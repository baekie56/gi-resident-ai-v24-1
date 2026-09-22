"""Owner-side content package builder. Never includes the publisher private key."""
from pathlib import Path
import base64, json, re, time, zipfile
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives import serialization
from updates import APP_ID, ENGINE_VERSION, canonical, digest, safe_name, version_tuple, https_url

def load_or_create_key(keyfile):
    keyfile=Path(keyfile)
    if keyfile.exists():return Ed25519PrivateKey.from_private_bytes(keyfile.read_bytes())
    keyfile.parent.mkdir(parents=True,exist_ok=True);key=Ed25519PrivateKey.generate()
    with keyfile.open('xb') as f:f.write(key.private_bytes(serialization.Encoding.Raw,serialization.PrivateFormat.Raw,serialization.NoEncryption()))
    return key

def build_package(web,version,keyfile,destination,notes='',package_url=None):
    version_tuple(version);web=Path(web).resolve();destination=Path(destination)
    key=load_or_create_key(keyfile);data={}
    for p in web.rglob('*'):
        if p.is_symlink():raise ValueError('内容目录不能包含符号链接')
        if not p.is_file():continue
        name=p.relative_to(web).as_posix()
        if safe_name(name) and name not in {'SHA256SUMS.txt','docs/AUTOMATED_TEST_LOG.txt'}:data[name]=p.read_bytes()
    if 'js/core.js' not in data:raise ValueError('请选择包含 index.html 和 js 文件夹的 web 内容目录')
    source=data['js/core.js'].decode('utf-8')
    if not re.search(r"VERSION\s*=\s*['\"]24\.0\.0['\"]",source):raise ValueError('本发布器只接受兼容的 V24 学习数据引擎')
    source=re.sub(r"BANK_VERSION\s*=\s*['\"][^'\"]+['\"]",f"BANK_VERSION = 'desktop-{version}'",source)
    data['js/core.js']=source.encode('utf-8')
    data['app-release.js']=('window.GI_APP_RELEASE='+json.dumps({'version':version,'engine':ENGINE_VERSION},ensure_ascii=False)+';').encode()
    html=data['index.html'].decode('utf-8')
    if 'src="app-release.js"' not in html:html=html.replace('<body>','<body>\n<script src="app-release.js"></script>')
    data['index.html']=html.encode('utf-8')
    # Complete pre-cache makes each mobile content version internally consistent.
    if 'sw-template.txt' in data:
        resources=['./']+['./'+n for n in data if n not in {'sw.js','sw-template.txt'}]
        data['sw.js']=data['sw-template.txt'].decode('utf-8').replace('__VERSION__',version).replace('__FILES__',json.dumps(resources,ensure_ascii=False)).encode('utf-8')
        del data['sw-template.txt']
    manifest={'schema':1,'appId':APP_ID,'version':version,'minRuntime':'1.0.0','engineVersion':ENGINE_VERSION,'notes':notes[:3000],'builtAt':time.strftime('%Y-%m-%dT%H:%M:%S%z'),'files':{n:digest(v) for n,v in sorted(data.items())}}
    raw=canonical(manifest);destination.parent.mkdir(parents=True,exist_ok=True)
    with zipfile.ZipFile(destination,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        z.writestr('manifest.json',raw);z.writestr('manifest.sig',base64.b64encode(key.sign(raw)))
        for n,v in data.items():z.writestr('web/'+n,v)
    # A ready-to-deploy mobile ZIP avoids asking the owner to unpack a custom file extension.
    with zipfile.ZipFile(destination.with_name('GI-web-'+version+'.zip'),'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for n,v in data.items():z.writestr(n,v)
    if package_url:
        https_url(package_url);payload={'appId':APP_ID,'version':version,'url':package_url,'sha256':digest(destination.read_bytes()),'notes':notes[:3000]}
        destination.with_name('latest.json').write_text(json.dumps({'payload':payload,'signature':base64.b64encode(key.sign(canonical(payload))).decode()},ensure_ascii=False,indent=2),encoding='utf-8')
    return manifest
