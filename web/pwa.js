/* Installable mobile shell. Learner data and APIs are never cached by the service worker. */
(function(){
 'use strict';let installPrompt=null,registration=null,applyRequested=false;
 function updateActive(){return window.GI24_ACTIVE?.()&&!GI24_ACTIVE().finishedAt}
 function bar(){
   if(document.getElementById('installCenter'))return;
   const host=document.querySelector('.account-card')||document.querySelector('.side');if(!host)return;
   const box=document.createElement('section');box.id='installCenter';box.className='install-center';
   const version=window.GI_APP_RELEASE?.version||'1.1.0';
   box.innerHTML='<small>应用内容 '+version+'</small><button type="button" id="installApp">安装 / 更新说明</button><button type="button" id="checkAppUpdate">检查网页更新</button><p id="pwaStatus" role="status"></p>';host.appendChild(box);
   box.querySelector('#installApp').onclick=async()=>{if(installPrompt){await installPrompt.prompt();installPrompt=null}else{alert('电脑：使用桌面版 EXE，或浏览器菜单中的“安装应用”。\n安卓：在 Chrome / Edge 菜单选择“安装应用”或“添加到主屏幕”。\n苹果：在 Safari 分享菜单选择“添加到主屏幕”。\n\n手机安装需 HTTPS 网址，首次联网完整加载后可离线学习。手机版档案保存在本机浏览器，不会自动同步电脑数据库。')}};
   box.querySelector('#checkAppUpdate').onclick=async()=>{
     const p=box.querySelector('#pwaStatus');
     if(!registration){p.textContent=location.protocol==='https:'?'正在准备离线资源，请稍后重试。':'电脑软件更新请使用“软件与更新中心”；手机网页安装需 HTTPS 网址。';return}
     try{await registration.update();p.textContent='已检查更新；若有新版本，资源准备完成后会提示。';if(registration.waiting)offerUpdate()}catch(e){p.textContent='当前无法检查网络，已有离线内容仍可使用。'}
   };
   if(registration?.waiting)offerUpdate();
 }
 function offerUpdate(){
   const p=document.getElementById('pwaStatus');if(!p||p.querySelector('button'))return;
   p.textContent='新版本已准备好。先结束训练并保存记录。';const button=document.createElement('button');button.textContent='保存后更新并重开';
   button.onclick=async()=>{if(updateActive()){alert('请先完成本轮训练，或通过导航退出，再更新。');return}if(window.flushProfile24&&!(await flushProfile24())){alert('记录尚未保存，请稍后再更新。');return}if(!confirm('确认已保存并导出重要备份，且关闭其他学习标签页？更新将重新打开页面，保留本机学习档案。'))return;applyRequested=true;registration.waiting?.postMessage({type:'ACTIVATE_RELEASE'})};p.appendChild(button);
 }
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;bar()});
 if(location.protocol==='https:'&&'serviceWorker' in navigator){
   let reloading=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloading||!applyRequested)return;reloading=true;location.reload()});
   navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(r=>{registration=r;r.addEventListener('updatefound',()=>{const w=r.installing;w?.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)offerUpdate()})});bar();if(r.waiting)offerUpdate()}).catch(()=>{});
 }
 let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;bar()})}).observe(document.documentElement,{childList:true,subtree:true});bar();
 const nav=window.nav;window.nav=function(...args){const result=nav(...args);document.querySelector('.side')?.classList.remove('mobile-open');return result};
 function menu(){const side=document.querySelector('.side');if(!side||side.querySelector('.mobile-menu'))return;const b=document.createElement('button');b.className='mobile-menu';b.textContent='☰ 学习菜单';b.onclick=()=>{side.classList.toggle('mobile-open');b.setAttribute('aria-expanded',side.classList.contains('mobile-open'))};side.prepend(b)}
 new MutationObserver(menu).observe(document.documentElement,{childList:true,subtree:true});menu();
})();
