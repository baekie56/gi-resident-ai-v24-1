"""Windows controller for GI Resident AI. Bundled runtime, isolated data, signed content updates."""
from pathlib import Path
import argparse, base64, ctypes, json, os, shutil, socket, sqlite3, subprocess, sys, tempfile, threading, urllib.request, webbrowser
from updates import ReleaseManager, RUNTIME_VERSION, check_feed, download, digest, https_url, atomic_json

BUNDLE=Path(getattr(sys,'_MEIPASS',Path(__file__).resolve().parent))
HOME=Path(os.environ.get('GI_DESKTOP_HOME',str(Path(os.environ.get('LOCALAPPDATA',str(Path.home()))) / 'GIResidentAI')))
KEYFILE=Path(os.environ.get('LOCALAPPDATA',str(Path.home())))/'GIResidentAI_Publisher'/'publisher.ed25519'

class Service:
    def __init__(self,manager):self.manager=manager;self.server=None;self.thread=None;self.port=None;self.host='127.0.0.1'
    def start(self,port=8765,host='127.0.0.1'):
        if self.server:return
        import backend as b
        b.ROOT=self.manager.current_root();b.DATABASE=self.manager.db;b.CASE_BANK.clear();b.SESSIONS.clear();b.initialize()
        self.server=b.ThreadingHTTPServer((host,port),b.Handler);self.server.allow_remote=host=='0.0.0.0';self.port=self.server.server_address[1];self.host=host
        self.thread=threading.Thread(target=self.server.serve_forever,daemon=True);self.thread.start()
    def stop(self):
        if self.server:self.server.shutdown();self.server.server_close();self.thread.join(timeout=5);self.server=None
    @property
    def url(self):return f'http://127.0.0.1:{self.port}/'
    @property
    def classroom_url(self):
        try:ip=socket.gethostbyname(socket.gethostname())
        except Exception:ip='本机局域网IP'
        return f'http://{ip}:{self.port}/'

def manager():
    m=ReleaseManager(HOME,(BUNDLE/'release-public.key').read_bytes())
    if not m.state().get('active'):m.install(BUNDLE/'initial.giupdate')
    return m

def open_learning(url):
    # Edge/Chrome app mode gives a dedicated learning window; fall back to the system browser.
    paths=[Path(os.environ.get('ProgramFiles(x86)','C:/Program Files (x86)'))/'Microsoft/Edge/Application/msedge.exe',Path(os.environ.get('ProgramFiles','C:/Program Files'))/'Google/Chrome/Application/chrome.exe']
    for browser in paths:
        if browser.is_file():
            subprocess.Popen([str(browser),'--app='+url,'--new-window'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);return
    webbrowser.open(url)

def main_gui(publisher_only=False):
    import tkinter as tk
    from tkinter import ttk, filedialog, messagebox, simpledialog
    root=tk.Tk();root.title('GI Resident AI · 软件与更新中心');root.geometry('730x710');root.minsize(650,680);root.configure(bg='#f1f6f8')
    style=ttk.Style();style.theme_use('clam');style.configure('.',font=('Microsoft YaHei UI',10));style.configure('TFrame',background='#f1f6f8');style.configure('TLabel',background='#f1f6f8',foreground='#183b4b');style.configure('TButton',padding=(16,10));style.configure('Primary.TButton',background='#0d766d',foreground='white',font=('Microsoft YaHei UI',12,'bold'));style.map('Primary.TButton',background=[('active','#095e56')])
    m=manager();service=Service(m);busy=False
    panel=ttk.Frame(root,padding=28);panel.pack(fill='both',expand=True)
    ttk.Label(panel,text='GI Resident AI',font=('Segoe UI',25,'bold')).pack(anchor='w')
    ttk.Label(panel,text='消化内科住培辅助教学 · Windows 桌面版',font=('Microsoft YaHei UI',13)).pack(anchor='w',pady=(2,14))
    version=tk.StringVar();status=tk.StringVar(value='准备就绪。点击“进入学习”开始。')
    def refresh():version.set(f'电脑程序 {RUNTIME_VERSION}  ·  内容版本 {m.state()["active"]}  ·  数据独立保存')
    refresh();ttk.Label(panel,textvariable=version).pack(anchor='w')
    def run(job,done):
        nonlocal busy
        if busy:return
        busy=True;status.set('正在处理，请稍候…')
        def worker():
            try:value=job();root.after(0,lambda:finish(value,None))
            except Exception as e:root.after(0,lambda e=e:finish(None,e))
        def finish(value,error):
            nonlocal busy
            busy=False;refresh()
            if error:status.set('操作未完成，当前数据保留。');messagebox.showerror('未完成',str(error) or '签名或文件校验未通过。',parent=root)
            else:done(value)
        threading.Thread(target=worker,daemon=True).start()
    def enter():
        if busy:return
        try:service.start();open_learning(service.url);status.set('学习服务运行中。保留此窗口；更新前先保存作答并退出学习页面。')
        except OSError:messagebox.showerror('端口被占用','本机 8765 端口不可用。请关闭其他 GI Resident AI 实例后重试。',parent=root)
    ttk.Button(panel,text='进入学习',style='Primary.TButton',command=enter).pack(fill='x',pady=(22,16))
    tabs=ttk.Notebook(panel);tabs.pack(fill='both',expand=True)
    update=ttk.Frame(tabs,padding=18);admin=ttk.Frame(tabs,padding=18);publish=ttk.Frame(tabs,padding=18)
    tabs.add(update,text='  软件更新  ');tabs.add(admin,text='  数据与管理员  ');tabs.add(publish,text='  我的发布工具  ')
    ttk.Label(update,text='更新只替换题库、页面和素材。账户与学习记录保留。',wraplength=570).pack(anchor='w',pady=(0,12))
    def ready_to_update():
        return not busy and messagebox.askokcancel('准备更新','请先在学习页面确认“已保存”，退出当前训练并关闭学习窗口。\n\n继续后会停止本机服务、备份数据库，再切换内容版本。未提交草稿不会写入数据库。',parent=root)
    def apply_package(path):
        service.stop();return m.install(path)
    def imported(result):status.set('已更新至 '+result['version']+'。点击“进入学习”重新登录。')
    def import_update():
        path=filedialog.askopenfilename(title='选择本机生成的签名更新包',filetypes=[('GI 更新包','*.giupdate')],parent=root)
        if path and ready_to_update():run(lambda:apply_package(path),imported)
    ttk.Button(update,text='导入更新包…',command=import_update).pack(fill='x')
    configpath=HOME/'settings.json'
    try:settings=json.loads(configpath.read_text(encoding='utf-8'))
    except Exception:settings={}
    url=tk.StringVar(value=settings.get('updateFeed',''))
    ttk.Label(update,text='可选：你自己的 HTTPS 更新清单地址').pack(anchor='w',pady=(14,3));ttk.Entry(update,textvariable=url).pack(fill='x')
    def check_online():
        try:https_url(url.get().strip());atomic_json(configpath,{'updateFeed':url.get().strip()})
        except Exception as e:messagebox.showinfo('在线更新未配置',str(e)+'\n没有网址时直接导入更新包即可。',parent=root);return
        def found(feed):
            if not feed:status.set('当前已是此更新源提供的最新版本。');return
            if not messagebox.askyesno('发现内容更新',f"版本 {feed['version']}\n{feed.get('notes','')}\n\n是否下载并准备安装？",parent=root):status.set('已暂缓更新。');return
            if not ready_to_update():return
            def fetch_apply():
                data=download(feed['url'])
                if digest(data)!=feed['sha256']:raise ValueError('下载包校验失败，未更新')
                with tempfile.TemporaryDirectory(prefix='gi-update-') as temp:
                    p=Path(temp)/'download.giupdate';p.write_bytes(data)
                    from updates import inspect_package
                    if inspect_package(p,m.key)['version']!=feed['version']:raise ValueError('包版本与更新清单不一致')
                    return apply_package(p)
            run(fetch_apply,imported)
        run(lambda:check_feed(url.get().strip(),m.key,m.state()['active']),found)
    ttk.Button(update,text='保存地址并检查在线更新',command=check_online).pack(fill='x',pady=8)
    def rollback():
        if ready_to_update():run(lambda:(service.stop(),m.rollback())[1],lambda v:status.set('已回退内容至 '+v+'，学习数据未回退。'))
    ttk.Button(update,text='回退上一内容版本',command=rollback).pack(fill='x')
    ttk.Label(admin,text='账户、训练成绩、操作时间与管理员反馈存放在当前 Windows 用户的数据目录。\n更新软件、移动 EXE 或重新解压不会替换该目录。',wraplength=560).pack(anchor='w',pady=(0,12))
    def classroom():
        if busy:return
        try:
            if service.server:service.stop()
            service.start(host='0.0.0.0');open_learning(service.url)
            status.set('班级服务器已启动。管理员可在本机登录，规培生可用同一网络中的手机或电脑访问。')
            messagebox.showinfo('班级访问地址','请让规培生在同一可信网络中打开：\n\n'+service.classroom_url+'\n\n本机管理员入口：\n'+service.url+'\n\n保持本程序开启。正式跨院或互联网使用应部署 HTTPS 服务器。',parent=root)
        except OSError:messagebox.showerror('启动失败','端口 8765 不可用，或 Windows 防火墙阻止了网络访问。',parent=root)
    ttk.Button(admin,text='启动班级服务器并查看管理员后台',style='Primary.TButton',command=classroom).pack(fill='x',pady=(0,10))
    ttk.Button(admin,text='打开数据目录',command=lambda:os.startfile(HOME)).pack(fill='x')
    def backup():
        run(m.backup_database,lambda p:(status.set('完整数据库备份已创建。' if p else '尚未创建数据库。'),messagebox.showinfo('备份结果',str(p) if p else '先进入学习，创建档案后再备份。',parent=root)))
    ttk.Button(admin,text='备份账户、记录与管理员反馈',command=backup).pack(fill='x',pady=8)
    def teacher():
        if busy:return
        name=simpledialog.askstring('创建管理员','管理员用户名（2—24位）：',parent=root)
        if not name:return
        password=simpledialog.askstring('创建管理员','密码（至少10位）：',show='*',parent=root)
        if not password:return
        again=simpledialog.askstring('创建管理员','再次输入密码：',show='*',parent=root)
        if again!=password:messagebox.showerror('创建失败','两次密码不一致',parent=root);return
        def create():
            import backend as b
            b.ROOT=m.current_root();b.DATABASE=m.db;b.initialize();b.create_user(name,password,'teacher')
        run(create,lambda _:status.set('管理员账户已创建，请进入学习后登录。'))
    ttk.Button(admin,text='创建管理员账户',command=teacher).pack(fill='x')
    ttk.Label(admin,text='完整数据库备份包含账户信息，请妥善保管。\n原 V24 数据迁移步骤见交付包中的使用说明。',wraplength=560).pack(anchor='w',pady=12)
    webpath=tk.StringVar(value=str(Path(__file__).resolve().parent/'web') if not getattr(sys,'frozen',False) else '')
    newversion=tk.StringVar(value='1.0.1');notes=tk.StringVar(value='题库与教学内容更新');packageurl=tk.StringVar(value='')
    ttk.Label(publish,text='选择你维护的 web 源码目录，生成可发给学员的更新包。',wraplength=560).pack(anchor='w')
    def chooseweb():
        p=filedialog.askdirectory(title='选择维护包中的 web 目录',parent=root)
        if p:webpath.set(p)
    ttk.Button(publish,text='选择内容目录…',command=chooseweb).pack(fill='x',pady=5);ttk.Label(publish,textvariable=webpath,wraplength=560).pack(anchor='w')
    row=ttk.Frame(publish);row.pack(fill='x',pady=4);ttk.Label(row,text='新版本').pack(side='left');ttk.Entry(row,textvariable=newversion,width=12).pack(side='left',padx=8);ttk.Label(row,text='更新说明').pack(side='left');ttk.Entry(row,textvariable=notes).pack(side='left',fill='x',expand=True)
    ttk.Label(publish,text='可选：更新包最终 HTTPS 下载地址（同时生成 latest.json）').pack(anchor='w');ttk.Entry(publish,textvariable=packageurl).pack(fill='x')
    def publish_now():
        if busy:return
        if not KEYFILE.exists():messagebox.showinfo('需要发布密钥','本机没有原发布密钥。请从你自己的私密备份恢复到：\n'+str(KEYFILE)+'\n学员不需要此密钥。',parent=root);return
        destination=filedialog.asksaveasfilename(title='保存更新包',defaultextension='.giupdate',initialfile='GI-content-'+newversion.get()+'.giupdate',parent=root)
        if not destination:return
        def build():
            from publisher import build_package,load_or_create_key
            from cryptography.hazmat.primitives import serialization
            key=load_or_create_key(KEYFILE)
            if key.public_key().public_bytes(serialization.Encoding.Raw,serialization.PublicFormat.Raw)!=m.key:raise ValueError('本机发布密钥与此软件不匹配')
            return build_package(webpath.get(),newversion.get(),KEYFILE,destination,notes.get(),packageurl.get().strip() or None)
        run(build,lambda r:status.set('已生成签名更新包及同目录的 GI-web-'+r['version']+'.zip 手机部署包。'))
    ttk.Button(publish,text='生成签名更新包',command=publish_now).pack(fill='x',pady=8)
    ttk.Label(publish,text='发布密钥仅在你的电脑上保存，不放入学员包。后端程序升级需重新生成 EXE。',wraplength=560).pack(anchor='w')
    ttk.Label(panel,textvariable=status,wraplength=660).pack(anchor='w',pady=(16,4))
    ttk.Label(panel,text='形成性学习工具 · 医学内容仍需专科审核',foreground='#667b86').pack(anchor='w')
    def close():
        if busy:messagebox.showinfo('操作进行中','请等待当前操作结束。',parent=root);return
        if service.server and not messagebox.askokcancel('退出软件','请确认学习页面已保存。退出会停止本机学习服务。',parent=root):return
        service.stop();root.destroy()
    root.protocol('WM_DELETE_WINDOW',close)
    if publisher_only:tabs.select(publish)
    root.mainloop()

def self_test(output):
    m=manager();s=Service(m)
    try:
        s.start(0)
        with urllib.request.urlopen(s.url+'api/health') as r:health=json.load(r)
        with urllib.request.urlopen(s.url) as r:html=r.read().decode('utf-8')
        assert health['version']=='24.0.0' and 'app-release.js' in html and m.db.exists()
        atomic_json(output,{'ok':True,'runtime':RUNTIME_VERSION,'content':m.state()['active'],'database':str(m.db),'html':True,'health':health})
    finally:s.stop()

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--self-test');parser.add_argument('--publisher',action='store_true');parser.add_argument('--serve-only',type=int);a=parser.parse_args()
    HOME.mkdir(parents=True,exist_ok=True)
    if a.self_test:self_test(a.self_test);return
    if a.serve_only:
        s=Service(manager());s.start(a.serve_only)
        try:threading.Event().wait()
        finally:s.stop()
        return
    handle=None
    if os.name=='nt':
        kernel=ctypes.WinDLL('kernel32',use_last_error=True);kernel.CreateMutexW.restype=ctypes.c_void_p
        handle=kernel.CreateMutexW(None,False,'Local\\GIResidentAI-Desktop-1')
        if ctypes.get_last_error()==183:
            ctypes.windll.user32.MessageBoxW(None,'软件与更新中心已经运行，请切换到已有窗口。','GI Resident AI',0);return
    try:main_gui(a.publisher)
    finally:
        if handle:kernel.CloseHandle(ctypes.c_void_p(handle))

if __name__=='__main__':
    try:main()
    except Exception as e:
        HOME.mkdir(parents=True,exist_ok=True)
        (HOME/'startup-error.txt').write_text(type(e).__name__+': '+str(e),encoding='utf-8')
        if '--self-test' not in sys.argv and '--serve-only' not in sys.argv:
            import tkinter.messagebox
            tkinter.messagebox.showerror('GI Resident AI 启动失败',str(e)+'\n详情保存在数据目录 startup-error.txt')
        sys.exit(1)

