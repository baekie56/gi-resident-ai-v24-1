/* Account and persistence boundary. Offline profiles are explicitly not authentication. */
(function(){
 'use strict';
 let server=false,registrationCodeRequired=false,passwordResetConfigured=false,resetPhone='',revision=0,syncTimer=null,syncing=false,dirty=false,conflict=false,activityTimer=null,activityBusy=false;
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
   if(user.role==='resident'&&!user.phoneBound){renderPhoneBinding(user);return}
   clearTimeout(syncTimer);conflict=false;dirty=false;revision=0;window.GI24_REMOTE=true;
   db={profiles:{},customCases:[],settings:{}};
   session={role:user.role,name:user.name,accountId:user.id,participantId:user.participantId};
   if(user.role==='resident'){
     const j=await api('/api/profile');revision=j.revision;reviews=j.reviews;
     db.profiles[user.name]=j.profile;ensureProfile(db.profiles[user.name]);
     if(window.ensure24)ensure24(db.profiles[user.name]);
     db.profiles[user.name].v24=db.profiles[user.name].v24||{};db.profiles[user.name].v24.participantId=user.participantId;
   }
   if(window.loadManagedContent24){try{await window.loadManagedContent24(true)}catch(e){window.GI24_CONTENT_WARNING='管理员内容暂时无法读取，内置训练仍可使用。'}}
   window.GI24_REVIEWS=reviews;window.GI24_SYNC='已连接集中数据库';window.app();
   if(user.role==='resident'){window.logActivity24('app_open',{route:'dashboard'});flushAttempts();flushActivities()}
 }
 function beginOffline(){
   const name=(document.getElementById('localName')?.value||document.getElementById('localSelect')?.value||'').trim();
   if(!/^[\p{L}\p{N}_ .-]{2,24}$/u.test(name)||['__proto__','constructor','prototype'].includes(name.toLowerCase()))return message('请填写2—24位学习代号，可用中文、字母、数字、._-');
   window.GI24_REMOTE=false;db=localDB();db.profiles[name]=db.profiles[name]||{};ensureProfile(db.profiles[name]);
   session={role:'resident',name,local:true};persistSession();save();window.GI24_SYNC='仅当前浏览器保存';window.app();
 }
 function renderPhoneBinding(user){
   document.body.innerHTML=`<main class="account-login"><section class="account-shell compact"><div class="account-form-panel"><div class="account-brand"><strong>GI Resident AI</strong><span class="pill">绑定手机号</span></div><h1>完善账号信息</h1><p class="account-lead">为了以后能通过短信找回密码，请为账号 <b>${esc(user.name)}</b> 绑定本人手机号。</p><form id="bindPhoneForm"><label for="bindPhone">手机号</label><input id="bindPhone" type="tel" inputmode="numeric" maxlength="13" autocomplete="tel" placeholder="请输入11位手机号"><button class="btn wide" id="bindPhoneButton">确认绑定并进入</button></form><p class="mini">手机号不会进入研究数据导出；绑定后如需更换，请联系管理员。</p><p id="accountMessage" role="status" class="error-text"></p></div></section></main>`;
   document.getElementById('bindPhoneForm').onsubmit=async e=>{e.preventDefault();const phone=document.getElementById('bindPhone').value.trim(),button=document.getElementById('bindPhoneButton');if(!/^1[3-9]\d{9}$/.test(phone))return message('请输入正确的11位手机号');button.disabled=true;try{const j=await api('/api/account/bind-phone',{phone});user.phoneBound=true;user.maskedPhone=j.maskedPhone;await beginServer(user)}catch(err){message(err.message);button.disabled=false}};
 }
 function renderAccountLogin(mode='login'){
   const profiles=Object.keys(localDB().profiles||{});
   const forms={
     login:`<h2>欢迎回来</h2><p class="form-hint">使用学习账号继续训练。</p><label for="accountName">用户名</label><input id="accountName" maxlength="24" autocomplete="username" placeholder="请输入用户名"><label for="accountPassword">密码</label><input id="accountPassword" type="password" maxlength="128" autocomplete="current-password" placeholder="请输入密码"><button class="btn wide" id="serverAccount">登录</button>`,
     register:`<h2>注册学员账号</h2><p class="form-hint">每个账号绑定一个手机号，用于找回密码。</p><label for="accountName">用户名</label><input id="accountName" maxlength="24" autocomplete="username" placeholder="例如 resident01"><label for="accountPhone">手机号</label><input id="accountPhone" type="tel" inputmode="numeric" maxlength="13" autocomplete="tel" placeholder="请输入本人11位手机号"><div class="field-grid"><div><label for="accountPassword">设置密码</label><input id="accountPassword" type="password" maxlength="128" autocomplete="new-password" placeholder="填写任意长度密码"></div><div><label for="accountConfirm">再次输入</label><input id="accountConfirm" type="password" maxlength="128" autocomplete="new-password" placeholder="再次输入密码"></div></div>${registrationCodeRequired?'<label for="registrationCode">班级邀请码</label><input id="registrationCode" maxlength="32" autocomplete="off" placeholder="请输入班级邀请码">':''}<button class="btn wide" id="serverAccount">创建账号</button>`,
     reset:`<h2>找回密码</h2><p class="form-hint">验证码将发送到账号绑定的手机号。</p><label for="resetPhone">绑定手机号</label><input id="resetPhone" type="tel" inputmode="numeric" maxlength="13" autocomplete="tel" placeholder="请输入11位手机号"><button class="btn wide" id="requestReset" ${passwordResetConfigured?'':'disabled'}>获取短信验证码</button><p class="mini">${passwordResetConfigured?'验证码10分钟内有效。':'短信服务待管理员在阿里云开通后即可使用。'}</p>`,
     'reset-code':`<h2>输入验证码</h2><p class="form-hint">验证码已发送至 ${esc(resetPhone.slice(0,3)+'****'+resetPhone.slice(-4))}</p><label for="resetCode">6位验证码</label><input id="resetCode" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="请输入验证码"><div class="field-grid"><div><label for="accountPassword">新密码</label><input id="accountPassword" type="password" maxlength="128" autocomplete="new-password" placeholder="设置新密码"></div><div><label for="accountConfirm">再次输入</label><input id="accountConfirm" type="password" maxlength="128" autocomplete="new-password" placeholder="再次输入新密码"></div></div><button class="btn wide" id="confirmReset">重设密码</button><button class="link-button" id="resendReset" type="button">重新获取验证码</button>`
   };
   document.body.innerHTML=`<main class="account-login"><section class="account-shell"><aside class="account-intro"><div class="account-brand light"><strong>GI Resident AI</strong><span>V24.1</span></div><h1>消化科住培辅助教学</h1><p>从病例推理到内镜认知，保留每次练习、用时与成绩变化。</p><ul><li>病例推理与急症决策</li><li>内镜解剖与操作训练</li><li>10题前后测与管理员复盘</li></ul><div class="privacy-note">手机号仅用于账号找回，不写入研究导出。</div></aside><div class="account-form-panel">${server?`<div class="account-tabs"><button type="button" id="tabLogin" class="${mode==='login'?'active':''}">登录</button><button type="button" id="tabRegister" class="${mode==='register'?'active':''}">注册</button><button type="button" id="tabReset" class="${mode.startsWith('reset')?'active':''}">找回密码</button></div><form id="accountForm">${forms[mode]||forms.login}</form><p class="mini admin-note">管理员使用同一登录入口；学员注册需要手机号${registrationCodeRequired?'和班级邀请码':''}。</p>`:`<div class="account-note">当前为离线模式。离线记录只保存在本设备。</div>`}<details ${server?'':'open'}><summary>离线学习档案</summary><label for="localSelect">继续已有档案</label><select id="localSelect"><option value="">请选择</option>${profiles.map(n=>`<option>${esc(n)}</option>`).join('')}</select><label for="localName">或创建学习代号</label><input id="localName" maxlength="24" placeholder="例如 resident01"><button id="localStart" type="button" class="btn ghost wide">进入离线学习</button><button id="localTeacher" type="button" class="btn ghost wide">本机演示工作台</button></details><p id="accountMessage" role="status" class="error-text">${esc(window.GI24_STORAGE_ERROR||'')}</p><footer class="mini">形成性学习工具。<a href="docs/APP_USAGE.md" target="_blank">使用说明</a></footer></div></section></main>`;
   document.getElementById('localStart').onclick=beginOffline;
   document.getElementById('localTeacher').onclick=()=>{window.GI24_REMOTE=false;db=localDB();session={role:'teacher',name:'本机演示工作台',local:true};window.GI24_SYNC='本机工作台，无权限隔离';window.app()};
   if(!server)return;
   document.getElementById('tabLogin').onclick=()=>renderAccountLogin('login');document.getElementById('tabRegister').onclick=()=>renderAccountLogin('register');document.getElementById('tabReset').onclick=()=>renderAccountLogin('reset');
   const form=document.getElementById('accountForm');
   form.onsubmit=async e=>{e.preventDefault();
     if(mode==='login'){
       const name=document.getElementById('accountName').value.trim(),password=document.getElementById('accountPassword').value,button=document.getElementById('serverAccount');if(!name||!password)return message('请输入用户名和密码');button.disabled=true;try{const j=await api('/api/login',{name,password});await beginServer(j.user)}catch(err){message(err.message);button.disabled=false}
     }else if(mode==='register'){
       const name=document.getElementById('accountName').value.trim(),phone=document.getElementById('accountPhone').value.trim(),password=document.getElementById('accountPassword').value,confirm=document.getElementById('accountConfirm').value,registrationCode=document.getElementById('registrationCode')?.value.trim()||'',button=document.getElementById('serverAccount');if(!name||!password)return message('请输入用户名和密码');if(!/^1[3-9]\d{9}$/.test(phone))return message('请输入正确的11位手机号');if(password!==confirm)return message('两次密码不一致');if(registrationCodeRequired&&!registrationCode)return message('请输入班级邀请码');button.disabled=true;try{const j=await api('/api/register',{name,phone,password,registrationCode});await beginServer(j.user)}catch(err){message(err.message);button.disabled=false}
     }else if(mode==='reset'){
       const phone=document.getElementById('resetPhone').value.trim(),button=document.getElementById('requestReset');if(!/^1[3-9]\d{9}$/.test(phone))return message('请输入正确的11位手机号');button.disabled=true;try{await api('/api/password-reset/request',{phone});resetPhone=phone;renderAccountLogin('reset-code')}catch(err){message(err.message);button.disabled=false}
     }else{
       const code=document.getElementById('resetCode').value.trim(),password=document.getElementById('accountPassword').value,confirm=document.getElementById('accountConfirm').value,button=document.getElementById('confirmReset');if(!/^\d{6}$/.test(code))return message('请输入6位短信验证码');if(!password)return message('请输入新密码');if(password!==confirm)return message('两次密码不一致');button.disabled=true;try{await api('/api/password-reset/confirm',{phone:resetPhone,code,password});resetPhone='';renderAccountLogin('login');message('密码已重设，请用原用户名登录')}catch(err){message(err.message);button.disabled=false}
     }
   };
   const resend=document.getElementById('resendReset');if(resend)resend.onclick=()=>{renderAccountLogin('reset');const phone=document.getElementById('resetPhone');if(phone)phone.value=resetPhone};
 }
 window.renderAccountLogin=renderAccountLogin;window.login=renderAccountLogin;
 window.logout=async function(){
   if(window.GI24_REMOTE){if(dirty||syncing){const ok=await flush();if(!ok){alert('尚有未保存记录，请先导出备份并等待保存完成，再退出。');return}}try{await api('/api/logout',{})}catch(e){alert('服务器退出未确认，请重试');return}db={profiles:{},customCases:[],settings:{}}}
   session=null;window.GI24_REMOTE=false;sessionStorage.removeItem('gi24Session');renderAccountLogin();
 };
 window.goUp=()=>window.nav(session?.role==='teacher'?'teacher':'dashboard');
 window.GI24_AUTH_READY=(async()=>{
   try{if(location.protocol!=='file:'){const h=await api('/api/health');server=!!h.accounts&&h.version===GI24.VERSION;registrationCodeRequired=!!h.registrationCodeRequired;passwordResetConfigured=!!h.passwordResetConfigured;window.GI24_AI_CONFIGURED=!!h.ai}}catch(e){}
   if(server){try{const me=await api('/api/me');await beginServer(me.user);return}catch(e){}}
   renderAccountLogin();
 })();
})();

