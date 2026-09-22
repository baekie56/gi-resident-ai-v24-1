"""Signed, atomic web-content releases. Runtime and learner database are never replaced."""
from pathlib import Path, PurePosixPath
from contextlib import closing
import base64, hashlib, json, os, re, shutil, sqlite3, tempfile, time, urllib.request, urllib.parse, zipfile
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

APP_ID='org.giresident.learning'
RUNTIME_VERSION='1.1.0'
ENGINE_VERSION='24.0.0'
EXTENSIONS={'.html','.js','.css','.json','.csv','.md','.txt','.png','.jpg','.jpeg','.webp','.svg','.ico','.webmanifest'}
LIMIT=160*1024*1024

def version_tuple(value):
    if not isinstance(value,str) or not re.fullmatch(r'(0|[1-9]\d{0,4})\.(0|[1-9]\d{0,4})\.(0|[1-9]\d{0,4})',value):raise ValueError('版本号须为三段数字，例如 1.0.1')
    return tuple(map(int,value.split('.')))

def digest(data):return hashlib.sha256(data).hexdigest()
def canonical(obj):return json.dumps(obj,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode('utf-8')
def safe_name(name):
    p=PurePosixPath(name)
    if not name or '\\' in name or ':' in name or p.is_absolute() or any(x in {'','..','.'} or x.startswith('.') for x in name.split('/')):return False
    if any(x.lower() in {'private','tests','scripts','__pycache__','node_modules'} for x in p.parts):return False
    if any(x.rstrip(' .')!=x or x.split('.')[0].upper() in {'CON','PRN','AUX','NUL',*[f'COM{i}' for i in range(1,10)],*[f'LPT{i}' for i in range(1,10)]} for x in p.parts):return False
    return p.suffix.lower() in EXTENSIONS

def atomic_json(path,value):
    path=Path(path);path.parent.mkdir(parents=True,exist_ok=True)
    temp=path.with_name(path.name+'.tmp')
    with temp.open('w',encoding='utf-8') as f:json.dump(value,f,ensure_ascii=False,indent=2);f.flush();os.fsync(f.fileno())
    os.replace(temp,path)

def inspect_package(package,public_key):
    package=Path(package)
    if package.stat().st_size>LIMIT:raise ValueError('更新包超过大小限制')
    with zipfile.ZipFile(package) as z:
        entries=z.infolist();names=[x.filename for x in entries]
        if len(names)>1500 or len(set(x.casefold() for x in names))!=len(names):raise ValueError('更新包含重复文件或文件过多')
        if sum(x.file_size for x in entries)>LIMIT:raise ValueError('解压大小超过限制')
        if z.getinfo('manifest.json').file_size>1024*1024 or z.getinfo('manifest.sig').file_size>200:raise ValueError('更新清单异常')
        raw=z.read('manifest.json');signature=base64.b64decode(z.read('manifest.sig'),validate=True)
        Ed25519PublicKey.from_public_bytes(public_key).verify(signature,raw)
        m=json.loads(raw)
        if m.get('appId')!=APP_ID or m.get('schema')!=1 or m.get('engineVersion')!=ENGINE_VERSION:raise ValueError('更新包不兼容本应用')
        version_tuple(m['version'])
        if version_tuple(m.get('minRuntime','1.0.0'))>version_tuple(RUNTIME_VERSION):raise ValueError('此更新需要先升级电脑软件主程序')
        files=m.get('files')
        if not isinstance(files,dict) or not {'index.html','js/core.js','docs/patient_bank.json','app-release.js'}<=set(files):raise ValueError('缺少核心文件')
        if any(not safe_name(n) or not re.fullmatch('[0-9a-f]{64}',h) for n,h in files.items()):raise ValueError('更新包路径或哈希不合法')
        if set(names)!={'manifest.json','manifest.sig'}|{'web/'+n for n in files}:raise ValueError('更新包文件与清单不一致')
        for n,h in files.items():
            if digest(z.read('web/'+n))!=h:raise ValueError('更新包内容校验失败：'+n)
        return m

class ReleaseManager:
    def __init__(self,home,public_key):
        self.home=Path(home).resolve();self.key=public_key;self.releases=self.home/'releases';self.releases.mkdir(parents=True,exist_ok=True)
        self.state_path=self.home/'release-state.json';self.db=self.home/'data'/'gi24.sqlite3'
    def state(self):
        if not self.state_path.exists():return {}
        state=json.loads(self.state_path.read_text(encoding='utf-8'))
        for k in ['active','previous']:
            if state.get(k):version_tuple(state[k])
        return state
    def current_root(self):
        s=self.state();v=s.get('active')
        if not v:raise ValueError('尚未安装内容版本')
        target=self.releases/v/'web'
        if not target.is_dir():raise ValueError('当前内容目录缺失，请重新导入更新包')
        return target
    def backup_database(self):
        if not self.db.exists():return None
        backup=self.home/'backups'/('learning-'+time.strftime('%Y%m%d-%H%M%S')+'-'+str(time.time_ns()%1000000)+'.sqlite3');backup.parent.mkdir(exist_ok=True)
        with closing(sqlite3.connect(self.db)) as src,closing(sqlite3.connect(backup)) as dst:src.backup(dst)
        return backup
    def install(self,package,bootstrap=False):
        m=inspect_package(package,self.key);s=self.state();v=m['version'];previous=s.get('active')
        if previous and version_tuple(v)<=version_tuple(previous):raise ValueError('请选择比当前版本更新的包；恢复旧版请使用回退功能')
        target=self.releases/v
        if target.exists():
            # Resume after a power loss between extraction and atomic pointer commit.
            try:
                existing=json.loads((target/'manifest.json').read_text(encoding='utf-8'))
                if existing!=m or any(digest((target/'web'/n).read_bytes())!=h for n,h in m['files'].items()):raise ValueError()
            except Exception:raise ValueError('已有同版本目录内容不一致，请使用新的版本号')
            backup=self.backup_database() if previous else None
            atomic_json(self.state_path,{'active':v,'previous':previous,'installedAt':time.time(),'backup':str(backup) if backup else None});return m
        staging=Path(tempfile.mkdtemp(prefix='.stage-',dir=self.releases)).resolve()
        assert staging.is_relative_to(self.releases.resolve())
        try:
            with zipfile.ZipFile(package) as z:
                for name in m['files']:
                    p=staging/'web'/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(z.read('web/'+name))
                (staging/'manifest.json').write_bytes(z.read('manifest.json'))
            # A snapshot precedes the pointer switch; failed validation never touches live data.
            backup=self.backup_database() if previous else None
            os.replace(staging,self.releases/v)
            atomic_json(self.state_path,{'active':v,'previous':previous,'installedAt':time.time(),'backup':str(backup) if backup else None})
            return m
        finally:
            if staging.exists():shutil.rmtree(staging)
    def rollback(self):
        s=self.state();old=s.get('previous')
        if not old or not (self.releases/old/'web/index.html').is_file():raise ValueError('没有可回退的内容版本')
        self.backup_database();atomic_json(self.state_path,{**s,'active':old,'previous':s['active'],'installedAt':time.time()});return old

def https_url(url):
    p=urllib.parse.urlsplit(url)
    if p.scheme!='https' or not p.hostname or p.username or p.password or p.fragment:raise ValueError('请填写不含账号密码的 HTTPS 地址')
    return url

class HTTPSRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,req,fp,code,msg,headers,newurl):
        https_url(newurl);return super().redirect_request(req,fp,code,msg,headers,newurl)

def download(url,limit=LIMIT):
    opener=urllib.request.build_opener(HTTPSRedirect())
    with opener.open(https_url(url),timeout=30) as r:
        out=bytearray()
        while chunk:=r.read(65536):
            out.extend(chunk)
            if len(out)>limit:raise ValueError('下载内容超过限制')
        return bytes(out)

def check_feed(url,public_key,current):
    # The feed wrapper and its package URL are signed, so hosting cannot substitute a release.
    envelope=json.loads(download(url,1024*1024));payload=envelope['payload']
    Ed25519PublicKey.from_public_bytes(public_key).verify(base64.b64decode(envelope['signature'],validate=True),canonical(payload))
    if payload.get('appId')!=APP_ID:raise ValueError('更新源不属于本软件')
    https_url(payload['url']);version_tuple(payload['version'])
    if not re.fullmatch('[0-9a-f]{64}',payload['sha256']):raise ValueError('更新源哈希错误')
    return payload if version_tuple(payload['version'])>version_tuple(current) else None
