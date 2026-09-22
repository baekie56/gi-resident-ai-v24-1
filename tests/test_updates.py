import base64,json,sys,tempfile,unittest,zipfile,sqlite3
from pathlib import Path
from unittest.mock import patch
from contextlib import contextmanager
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from publisher import build_package,load_or_create_key
from updates import *
from cryptography.hazmat.primitives import serialization

@contextmanager
def db(path):
    c=sqlite3.connect(path)
    try:
        with c:yield c
    finally:c.close()

class UpdateTest(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.root=Path(self.temp.name);self.web=self.root/'web';self.web.mkdir()
        for n,text in {'index.html':'<body>test</body>','js/core.js':"const VERSION = '24.0.0', BANK_VERSION='old';",'docs/patient_bank.json':'[]','style.css':'body{}','private/password.txt':'SECRET','server.py':'not allowed'}.items():
            p=self.web/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text)
        self.keyfile=self.root/'key';self.key=load_or_create_key(self.keyfile);self.pub=self.key.public_key().public_bytes(serialization.Encoding.Raw,serialization.PublicFormat.Raw)
        self.m=ReleaseManager(self.root/'user',self.pub);self.one=self.package('1.0.0')
    def tearDown(self):self.temp.cleanup()
    def package(self,version):
        p=self.root/(version+'.giupdate');build_package(self.web,version,self.keyfile,p,'test');return p
    def install_db(self):
        self.m.install(self.one);self.m.db.parent.mkdir(parents=True,exist_ok=True)
        with db(self.m.db) as c:c.execute('CREATE TABLE learner(value TEXT)');c.execute("INSERT INTO learner VALUES('keep me')")
    def test_signed_package_and_exclusions(self):
        m=inspect_package(self.one,self.pub);self.assertEqual(m['version'],'1.0.0');self.assertNotIn('private/password.txt',m['files']);self.assertNotIn('server.py',m['files'])
    def test_wrong_signing_key_rejected(self):
        other=load_or_create_key(self.root/'other').public_key().public_bytes(serialization.Encoding.Raw,serialization.PublicFormat.Raw)
        with self.assertRaises(Exception):inspect_package(self.one,other)
    def test_tampered_content_rejected(self):
        p=self.root/'tampered'
        with zipfile.ZipFile(self.one) as z,zipfile.ZipFile(p,'w') as out:
            for n in z.namelist():out.writestr(n,b'changed' if n=='web/index.html' else z.read(n))
        with self.assertRaises(ValueError):self.m.install(p)
        self.assertEqual(self.m.state(),{})
    def test_signature_manifest_changes_rejected(self):
        p=self.root/'badmanifest'
        with zipfile.ZipFile(self.one) as z,zipfile.ZipFile(p,'w') as out:
            for n in z.namelist():out.writestr(n,z.read(n).replace(b'1.0.0',b'1.0.1') if n=='manifest.json' else z.read(n))
        with self.assertRaises(Exception):self.m.install(p)
    def test_update_keeps_database_and_backup(self):
        self.install_db();self.m.install(self.package('1.0.1'));self.assertEqual(self.m.state()['active'],'1.0.1')
        with db(self.m.db) as c:self.assertEqual(c.execute('SELECT value FROM learner').fetchone()[0],'keep me')
        with db(self.m.state()['backup']) as c:self.assertEqual(c.execute('SELECT value FROM learner').fetchone()[0],'keep me')
    def test_rollback_content_only(self):
        self.install_db();self.m.install(self.package('1.0.1'));self.assertEqual(self.m.rollback(),'1.0.0');self.assertTrue(self.m.db.exists())
    def test_older_and_duplicate_rejected(self):
        self.m.install(self.one)
        for p in [self.one,self.package('0.9.0')]:
            with self.assertRaises(ValueError):self.m.install(p)
    def test_atomic_failure_can_resume(self):
        self.m.install(self.one);new=self.package('1.0.1')
        with patch('updates.atomic_json',side_effect=OSError('simulated power loss')):
            with self.assertRaises(OSError):self.m.install(new)
        self.assertEqual(self.m.state()['active'],'1.0.0');self.m.install(new);self.assertEqual(self.m.state()['active'],'1.0.1')
    def test_extra_paths_rejected(self):
        with zipfile.ZipFile(self.one,'a') as z:z.writestr('web/../../evil.js','evil')
        with self.assertRaises(ValueError):self.m.install(self.one)
    def test_windows_path_validation(self):
        for p in ['../x.js','/x.js','a\\x.js','private/data.json','CON.js','x.js:evil','x /a.js','a/./b.js','tests/q.js']:
            self.assertFalse(safe_name(p),p)
        self.assertTrue(safe_name('assets/图片.png'))
    def test_version_validation(self):
        for v in ['1.0','v1.0.1','1.0.1/../../x','01.0.0','1.0.-1']:
            with self.assertRaises(ValueError):version_tuple(v)
    def test_feed_signature_and_newer(self):
        payload={'appId':APP_ID,'version':'1.0.1','url':'https://example.org/a.giupdate','sha256':'a'*64}
        envelope=canonical({'payload':payload,'signature':base64.b64encode(self.key.sign(canonical(payload))).decode()})
        with patch('updates.download',return_value=envelope):self.assertEqual(check_feed('https://example.org/latest.json',self.pub,'1.0.0')['version'],'1.0.1');self.assertIsNone(check_feed('https://example.org/latest.json',self.pub,'1.0.1'))
    def test_http_and_embedded_credentials_rejected(self):
        for url in ['http://example.org/x','https://user:pass@example.org/x','file:///x']:
            with self.assertRaises(ValueError):https_url(url)
    def test_incompatible_engine_rejected(self):
        with zipfile.ZipFile(self.one) as z:items={n:z.read(n) for n in z.namelist()}
        m=json.loads(items['manifest.json']);m['engineVersion']='25.0.0';raw=canonical(m);items['manifest.json']=raw;items['manifest.sig']=base64.b64encode(self.key.sign(raw))
        with zipfile.ZipFile(self.one,'w') as z:
            for n,v in items.items():z.writestr(n,v)
        with self.assertRaises(ValueError):self.m.install(self.one)

if __name__=='__main__':unittest.main(verbosity=2)
