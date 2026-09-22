"""Integration tests use a temporary database and local server; no external API calls."""
import sys, tempfile, threading, unittest, json, urllib.request, urllib.error, http.cookiejar
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import backend as B
B.ROOT=Path(__file__).resolve().parents[1]/"web"

class BackendTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp=tempfile.TemporaryDirectory();B.DATABASE=Path(cls.tmp.name)/'test.sqlite3';B.initialize()
        B.create_user('testteacher','OnlyForTests-24','teacher')
        cls.server=B.ThreadingHTTPServer(('127.0.0.1',0),B.Handler)
        cls.base='http://127.0.0.1:'+str(cls.server.server_address[1]);cls.thread=threading.Thread(target=cls.server.serve_forever,daemon=True);cls.thread.start()
        cls.a=cls.client();cls.b=cls.client();cls.t=cls.client()
        cls.ua=cls.request(cls.a,'/api/register',{'name':'learner-a','password':'OnlyForTests-24'})[1]['user']
        cls.ub=cls.request(cls.b,'/api/register',{'name':'learner-b','password':'OnlyForTests-24'})[1]['user']
        cls.request(cls.t,'/api/login',{'name':'testteacher','password':'OnlyForTests-24'})
    @classmethod
    def tearDownClass(cls):cls.server.shutdown();cls.server.server_close();cls.thread.join();cls.tmp.cleanup()
    @staticmethod
    def client():return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
    @classmethod
    def request(cls,client,path,data=None,headers=None):
        h={'Content-Type':'application/json','X-GI24-Request':'1'};h.update(headers or {})
        req=urllib.request.Request(cls.base+path,data=json.dumps(data).encode() if data is not None else None,headers=h)
        try:
            with client.open(req,timeout=10) as r:return r.status,json.loads(r.read()),r.headers
        except urllib.error.HTTPError as e:
            raw=e.read()
            try:j=json.loads(raw)
            except Exception:j={'body':raw.decode(errors='ignore')}
            code,headers=e.code,e.headers;e.close();return code,j,headers
    def test_01_authentication_required(self):self.assertEqual(self.request(self.client(),'/api/profile')[0],401)
    def test_02_teacher_permissions(self):self.assertEqual(self.request(self.a,'/api/teacher')[0],403)
    def test_03_roles_cannot_be_requested_by_registration(self):self.assertEqual(self.ua['role'],'resident')
    def test_04_profile_and_secrets(self):
        status,j,_=self.request(self.a,'/api/profile');self.assertEqual(status,200);self.assertNotIn('password_hash',json.dumps(j));self.assertNotIn('salt',json.dumps(j))
    def test_05_cross_origin_write_blocked(self):self.assertEqual(self.request(self.a,'/api/profile',{}, {'Origin':'https://example.org'})[0],403)
    def test_06_private_files_blocked(self):
        for p in ['/private/gi24.sqlite3','/backend.py','/tests/test_backend.py','/%2e%2e/server.py']:
            self.assertEqual(self.request(self.a,p)[0],403,p)
    def test_07_password_login_and_cookie(self):
        c=self.client();s,j,h=self.request(c,'/api/login',{'name':'learner-a','password':'OnlyForTests-24'});self.assertEqual(s,200);self.assertIn('HttpOnly',h['Set-Cookie']);self.assertIn('SameSite=Strict',h['Set-Cookie'])
        self.assertEqual(self.request(self.client(),'/api/login',{'name':'learner-a','password':'incorrect-value'})[0],401)
    def test_08_account_isolation_and_append_only(self):
        a={'id':'attempt1','caseId':'TEST','kind':'case','responses':[],'decisionScore':50}
        p={'history':[],'wrong':[],'v24':{'attempts':[a]},'accounts':{'passwordHash':'must-not-save'}}
        s,j,_=self.request(self.a,'/api/profile',{'revision':0,'profile':p});self.assertEqual(s,200)
        other=self.request(self.b,'/api/profile')[1];self.assertEqual(other['profile'].get('v24',{}).get('attempts'),[])
        own=self.request(self.a,'/api/profile')[1];self.assertNotIn('accounts',own['profile']);self.assertEqual(own['profile']['v24']['participantId'],self.ua['participantId'])
        a['decisionScore']=100;self.assertEqual(self.request(self.a,'/api/profile',{'revision':1,'profile':p})[0],409)
        a['decisionScore']=50;self.assertEqual(self.request(self.a,'/api/profile',{'revision':0,'profile':p})[0],409)
        p['v24']['attempts']=[];self.assertEqual(self.request(self.a,'/api/profile',{'revision':1,'profile':p})[0],409)
    def test_09_teacher_review_separate_from_answer(self):
        s,_,_=self.request(self.t,'/api/review',{'userId':self.ua['id'],'attemptId':'attempt1','status':'needs-followup','note':'请解释处置依据'});self.assertEqual(s,200)
        p=self.request(self.a,'/api/profile')[1];self.assertEqual(p['profile']['v24']['attempts'][0]['decisionScore'],50);self.assertEqual(p['reviews'][0]['note'],'请解释处置依据')
    def test_09b_immediate_attempt_and_activity_log(self):
        attempt={'id':'attempt-immediate','caseId':'CASE-2','kind':'case','title':'即时保存病例','startedAt':'2026-09-16T08:00:00Z','finishedAt':'2026-09-16T08:05:00Z','durationSeconds':300,'responses':[],'decisionScore':80,'status':'pending-review'}
        s,j,_=self.request(self.a,'/api/attempt',{'attempt':attempt});self.assertEqual(s,200);self.assertTrue(j['stored'])
        self.assertEqual(self.request(self.a,'/api/attempt',{'attempt':attempt})[0],200)
        events=[{'id':'event-start','type':'attempt_started','itemId':'CASE-2','attemptId':'attempt-immediate','occurredAt':'2026-09-16T08:00:00Z','details':{'kind':'case'}},{'id':'event-finish','type':'attempt_completed','itemId':'CASE-2','attemptId':'attempt-immediate','occurredAt':'2026-09-16T08:05:00Z','details':{'decisionScore':80}}]
        self.assertEqual(self.request(self.a,'/api/activity',{'events':events})[0],200)
        dashboard=self.request(self.t,'/api/teacher')[1];row=next(x for x in dashboard['students'] if x['userId']==self.ua['id'])
        self.assertGreaterEqual(row['summary']['attempts'],2);self.assertTrue(any(x['type']=='attempt_completed' and x['userId']==self.ua['id'] for x in dashboard['events']))
        changed=dict(attempt);changed['decisionScore']=81;self.assertEqual(self.request(self.a,'/api/attempt',{'attempt':changed})[0],409)
    def test_10_logout_revokes(self):
        c=self.client();self.request(c,'/api/login',{'name':'learner-b','password':'OnlyForTests-24'});self.request(c,'/api/logout',{});self.assertEqual(self.request(c,'/api/me')[0],401)
    def test_11_unknown_and_malformed_requests(self):
        self.assertEqual(self.request(self.a,'/api/missing',{})[0],404);self.assertEqual(self.request(self.a,'/api/profile',[])[0],400)
    def test_12_ai_needs_opt_in(self):self.assertEqual(self.request(self.a,'/api/ai',{'caseId':'TEST','message':'你好'})[0],400)
    def test_13_atomic_rejection(self):
        p=self.request(self.a,'/api/profile')[1];attempts=p['profile']['v24']['attempts'];attempts.insert(0,{'id':'new-but-rejected','kind':'case'});attempts[-1]['decisionScore']=99
        self.assertEqual(self.request(self.a,'/api/profile',{'revision':p['revision'],'profile':p['profile']})[0],409)
        with B.database() as c:self.assertEqual(c.execute("SELECT COUNT(*) FROM attempts WHERE id='new-but-rejected'").fetchone()[0],0)
    def test_14_password_db_not_plaintext(self):
        with B.database() as c:u=c.execute('SELECT * FROM users WHERE id=?',(self.ua['id'],)).fetchone()
        self.assertNotEqual(u['password_hash'],'OnlyForTests-24');self.assertEqual(len(u['password_hash']),64)

    def test_15_reject_unsafe_record_types(self):
        for score in ['<img src=x onerror=alert(1)>',True,101,-1]:
            p={'history':[],'wrong':[],'v24':{'attempts':[{'id':'unsafe','decisionScore':score}]}}
            self.assertEqual(self.request(self.b,'/api/profile',{'revision':0,'profile':p})[0],400)

    def test_16_reject_unsafe_nested_fields(self):
        p={'history':[],'wrong':[],'v24':{'__proto__':{'danger':True}}}
        self.assertEqual(self.request(self.b,'/api/profile',{'revision':0,'profile':p})[0],400)

    def test_17_patient_bank_has_no_answer_key(self):
        self.assertEqual(len(B.CASE_BANK),32)
        for case in B.CASE_BANK.values():
            self.assertTrue(set(case)<=set(['id','age','sex','chief','intro','qa']))
            self.assertNotIn('targets',case);self.assertNotIn('decisions',case)

if __name__=='__main__':unittest.main(verbosity=2)
