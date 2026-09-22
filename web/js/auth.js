/* Account and persistence boundary. Offline profiles are explicitly not authentication. */
(function(){
 'use strict';
 let server=false,revision=0,syncTimer=null,syncing=false,dirty=false,conflict=false,activityTimer=null,activityBusy=false;
 let reviews=[];window.GI24_REMOTE=false;window.GI24_SYNC='本机保存';
 const localDB=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{profiles:{},customCases:[],settings:{}}}catch(e){return {profiles:{},customCases:[],settings:{}}}};
 async function api(path,data,keepalive=false){
   const options={credentials:'same-origin',headers:{'X-GI24-Request':'1'},signal:AbortSignal.timeout(15000)};
   if(data!==undefined){options.method='POST';options.headers['Content-Type']='application/json';options.body=JSON.stringify(data);if(keepalive)options.keepalive=true}
   const r=await fetch(path,options);let j;try{j=await r.json()}catch(e){throw Error('服务器响应异常')}
   if(!r.ok){const e=Error(j.error||'请求失败');e.status=r.status;throw e}return j;
 }
 window.api24=api;
 const accountQueueKey=kind=>`gi24-${kind}-queue-${session?.accountId||'anonymous'}`;
 function readQueue(kind){try{const x=JSON.parse(localStorage.getItem(accountQueueKey(kind))||'[]');return Array.isArray(x)?x:[]}catch(e){return []}}
 function writeQueue(kind,items){try{localStorage.setItem(accountQueueKey(kind),JSON.stringify(items.slice(-500)))}catch(e){window.GI24_STORAGE_ERROR='待上传记录无法写入浏览器，请保持页面打开并检查存储空间。'}}
 async function flushAttempts(){
   if(!server||!window.GI24_REMOTE||session?.role!=='resident')return;
   let queue=readQueue('attempt');
   while(queue.length){try{await api('/api/attempt',{attempt:queue[0]},true);queue.shift();writeQueue('attempt',queue)}catch(e){break}}
 }
 window.persistAttempt24=function(attempt){
   if(!window.GI24_REMOTE||session?.role!=='resident'||!attempt)return;
   const queue=readQueue('attempt');if(!queue.some(x=>x.id===attempt.id))queue.push(attempt);writeQueue('attempt',queue);flushAttempts();
 };
 async function flushActivities(){
   clearTimeout(activityTimer);if(activityBusy||!server||!window.GI24_REMOTE||session?.role!=='resident')return;
   let queue=readQueue('activity');if(!queue.length)return;activityBusy=true;const batch=queue.slice(0,100);
   try{await api('/api/activity',{events:batch},true);queue=queue.slice(batch.length);writeQueue('activity',queue)}catch(e){}finally{activityBusy=false}
   if(queue.length)activityTimer=setTimeout(flushActivities,3000);
 }
 window.logActivity24=function(type,details={}){
   if(!window.GI24_REMOTE||session?.role!=='resident')return;
   const queue=readQueue('activity');queue.push({id:window.crypto?.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2),type,route:details.route||null,itemId:details.itemId||null,attemptId:details.attemptId||null,occurredAt:new Date().toISOString(),details:details.details||{}});writeQueue('activity',queue);clearTimeout(activityTimer);activityTimer=setTimeout(flushActivities,150);
 };
 function message(text){const x=document.getElementById('accountMessage');if(x)x.textContent=text}
 function syncBadge(){const el=document.getElementById('sync24');if(el)el.textContent=window.GI24_SYNC}
 window.showSaveError=()=>{window.GI24_SYNC=window.GI24_STORAGE_ERROR||'保存失败，请导出备份';syncBadge()};
 async function flush(){
   clearTimeout(syncTimer);
   if(syncing){return false}
   if(!server||!window.GI24_REMOTE||session?.role!=='resident'||!dirty)return !conflict;
   if(conflict)return false;
   syncing=true;dirty=false;window.GI24_SYNC='正在保存…';syncBadge();
   try{const j=await api('/api/profile',{profile:prof(),revision});revision=j.revision;window.GI24_SYNC='已保存到集中数据库'}
   catch(e){dirty=true;conflict=e.status===409;window.GI24_SYNC=(conflict?'保存冲突：':'保存失败：')+e.message;window.GI24_STORAGE_ERROR=window.GI24_SYNC}
   finally{syncing=false;syncBadge()}
   if(dirty&&!conflict)syncTimer=setTimeout(flush,5000);
   return !dirty&&!conflict;
 }
 window.flushProfile24=flush;
 window.queueProfileSync=function(){if(!window.GI24_REMOTE||session?.role!=='resident')return;dirty=true;window.GI24_SYNC='待保存';syncBadge();clearTimeout(syncTimer);syncTimer=setTimeout(flush,400)};
 window.addEventListener('beforeunload',e=>{if(dirty||syncing){e.preventDefault();e.returnValue=''}});
 window.addEventListener('pagehide',()=>{flushAttempts();flushActivities()});
 async function beginServer(user){
   clearTimeout(syncTimer);conflict=false;dirty=false;revision=0;window.GI24_REMOTE=true;
   db={profiles:{},customCases:[],settings:{}};
   session={role:user.role,name:user.name,accountId:user.id,participantId:user.participantId};
   if(user.role==='resident'){
     const j=await api('/api/profile');revision=j.revision;reviews=j.reviews;
     db.profiles[user.name]=j.profile;ensureProfile(db.profiles[user.name]);
     if(window.ensure24)ensure24(db.profiles[user.name]);
     db.profiles[user.name].v24=db.profiles[user.name].v24||{};db.profiles[user.name].v24.participantId=user.participantId;
   }
   window.GI24_REVIEWS=reviews;window.GI24_SYNC='已连接集中数据库';window.app();
   if(user.role==='resident'){window.logActivity24('app_open',{route:'dashboard'});flushAttempts();flushActivities()}
 }
 function beginOffline(){
   const name=(document.getElementById('localName')?.value||document.getElementById('localSelect')?.value||'').trim();
   if(!/^[\p{L}\p{N}_ .-]{2,24}$/u.test(name)||['__proto__','constructor','prototype'].includes(name.toLowerCase()))return message('请填写2—24位学习代号，可用中文、字母、数字、._-');
   window.GI24_REMOTE=false;db=localDB();db.profiles[name]=db.profiles[name]||{};ensureProfile(db.profiles[name]);
   session={role:'resident',name,local:true};persistSession();save();window.GI24_SYNC='仅当前浏览器保存';window.app();
 }
 function renderAccountLogin(mode='login'){
   const profiles=Object.keys(localDB().profiles||{});
   document.body.innerHTML=`<main class="account-login"><section class="account-card"><div class="account-brand"><strong>GI Resident AI</strong><span class="pill">V24.1</span></div><h1>消化科住培辅助教学</h1><p class="account-lead">病例推理 · 急症决策 · 内镜认知 · 管理员复盘</p><div class="account-note">${server?'账户学习记录、作答时间和成绩保存到数据库；管理员登录后可按规培生查看。账户密码不会放入浏览器档案。':'当前为离线模式。离线记录仅保存在本设备，管理员无法远程汇总；正式研究请使用服务器账户。'}</div>${server?`<div class="account-tabs"><button id="tabLogin" class="${mode==='login'?'active':''}">账户登录</button><button id="tabRegister" class="${mode==='register'?'active':''}">注册学员</button></div><label for="accountName">用户名</label><input id="accountName" maxlength="24" autocomplete="username" placeholder="使用学习代号，避免填写真实身份信息"><label for="accountPassword">密码（至少10位）</label><input id="accountPassword" type="password" maxlength="128" autocomplete="${mode==='login'?'current-password':'new-password'}">${mode==='register'?'<label for="accountConfirm">再次输入密码</label><input id="accountConfirm" type="password" maxlength="128" autocomplete="new-password">':''}<button class="btn wide" id="serverAccount">${mode==='login'?'登录':'创建学员账户'}</button><p class="mini">管理员账户由维护者在电脑软件的“数据与管理员”页创建，不提供公共管理员注册入口。</p>`:''}<details ${server?'':'open'}><summary>离线学习档案</summary><label for="localSelect">继续已有档案</label><select id="localSelect"><option value="">请选择</option>${profiles.map(n=>`<option>${esc(n)}</option>`).join('')}</select><label for="localName">或创建学习代号</label><input id="localName" maxlength="24" placeholder="例如 resident01"><button id="localStart" class="btn ghost wide">进入离线学习</button><button id="localTeacher" class="btn ghost wide">本机演示工作台</button><p class="mini">离线工作台无权限隔离，也不能汇总其他设备；不用于正式研究。</p></details><p id="accountMessage" role="status" class="error-text">${esc(window.GI24_STORAGE_ERROR||'')}</p><footer class="mini">形成性学习工具。临床内容及图片许可仍需专科教师与权利人核验。<a href="docs/APP_USAGE.md" target="_blank">使用说明</a></footer></section></main>`;
   document.getElementById('localStart').onclick=beginOffline;
   document.getElementById('localTeacher').onclick=()=>{window.GI24_REMOTE=false;db=localDB();session={role:'teacher',name:'本机演示工作台',local:true};window.GI24_SYNC='本机工作台，无权限隔离';window.app()};
   if(server){
     document.getElementById('tabLogin').onclick=()=>renderAccountLogin('login');document.getElementById('tabRegister').onclick=()=>renderAccountLogin('register');
     const submit=async()=>{const name=document.getElementById('accountName').value.trim(),password=document.getElementById('accountPassword').value,button=document.getElementById('serverAccount');if(!name||password.length<10)return message('请输入用户名和至少10位密码');if(mode==='register'&&password!==document.getElementById('accountConfirm').value)return message('两次密码不一致');button.disabled=true;try{const j=await api(mode==='login'?'/api/login':'/api/register',{name,password});await beginServer(j.user)}catch(e){message(e.message);button.disabled=false}};
     document.getElementById('serverAccount').onclick=submit;document.getElementById('accountPassword').onkeydown=e=>{if(e.key==='Enter')submit()};
   }
 }
 window.renderAccountLogin=renderAccountLogin;window.login=renderAccountLogin;
 window.logout=async function(){
   if(window.GI24_REMOTE){if(dirty||syncing){const ok=await flush();if(!ok){alert('尚有未保存记录，请先导出备份并等待保存完成，再退出。');return}}try{await api('/api/logout',{})}catch(e){alert('服务器退出未确认，请重试');return}db={profiles:{},customCases:[],settings:{}}}
   session=null;window.GI24_REMOTE=false;sessionStorage.removeItem('gi24Session');renderAccountLogin();
 };
 window.goUp=()=>window.nav(session?.role==='teacher'?'teacher':'dashboard');
 window.GI24_AUTH_READY=(async()=>{
   try{if(location.protocol!=='file:'){const h=await api('/api/health');server=!!h.accounts&&h.version===GI24.VERSION;window.GI24_AI_CONFIGURED=!!h.ai}}catch(e){}
   if(server){try{const me=await api('/api/me');await beginServer(me.user);return}catch(e){}}
   renderAccountLogin();
 })();
})();

