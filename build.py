"""Build the Windows executable, owner source ZIP and installable mobile web ZIP."""
from pathlib import Path
import json, os, shutil, subprocess, sys, zipfile, hashlib
from publisher import build_package,load_or_create_key
from updates import inspect_package
from cryptography.hazmat.primitives import serialization

ROOT=Path(__file__).resolve().parent
KEY=Path(os.environ['LOCALAPPDATA'])/'GIResidentAI_Publisher'/'publisher.ed25519'
OUT=ROOT.parent/'GI_Resident_AI_Desktop_Delivery';OUT.mkdir(exist_ok=True)
key=load_or_create_key(KEY);pub=key.public_key().public_bytes(serialization.Encoding.Raw,serialization.PublicFormat.Raw)
(ROOT/'release-public.key').write_bytes(pub)
manifest=build_package(ROOT/'web','1.1.0',KEY,ROOT/'initial.giupdate','增加集中保存、规培生操作日志、训练时间成绩汇总与管理员后台')
inspect_package(ROOT/'initial.giupdate',pub)
subprocess.run([sys.executable,'-m','PyInstaller','--noconfirm','--onefile','--windowed','--name','GI_Resident_AI','--distpath',str(OUT),'--workpath',str(ROOT/'build-work'),'--specpath',str(ROOT),'--add-data',str(ROOT/'initial.giupdate')+';.', '--add-data',str(ROOT/'release-public.key')+';.','--hidden-import','backend','--hidden-import','publisher',str(ROOT/'desktop.py')],cwd=ROOT,check=True)
shutil.copy2(ROOT/'initial.giupdate',OUT/'GI-content-1.1.0.giupdate')
with zipfile.ZipFile(ROOT/'initial.giupdate') as z,zipfile.ZipFile(OUT/'GI_Resident_AI_Mobile_Web.zip','w',zipfile.ZIP_DEFLATED,compresslevel=9) as dest:
    for n in z.namelist():
        if n.startswith('web/'):dest.writestr(n[4:],z.read(n))
print(json.dumps({'exe':str(OUT/'GI_Resident_AI.exe'),'mobile':str(OUT/'GI_Resident_AI_Mobile_Web.zip'),'contentFiles':len(manifest['files']),'publisherPublicFingerprint':hashlib.sha256(pub).hexdigest()},ensure_ascii=False,indent=2))
