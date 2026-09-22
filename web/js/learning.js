/* V24 learning navigation, display hygiene, randomized choices and content governance. */
(function(){
 'use strict';
 const coreIDs=new Set(['UGIB-PU','UGIB-VARIX','CHOLANGITIS','AP-BILIARY','AP-HTG','CBD-STONE']);
 const oldNav=window.nav,oldApp=window.app,oldProcedures=window.procedures;
 window.nav=function(route){window.dispatchEvent(new Event('gi24-leave-training'));window.logActivity24?.('navigation',{route});oldNav(route);patchUI()};
 window.app=function(){oldApp();patchUI()};
 window.setLearningMode24=function(mode){window.GI24_MODE=mode==='selftest'?'selftest':'learn';window.cases()};
 window.cases=function(){
   const self=window.GI24_MODE==='selftest';
   $('#main').innerHTML=head('病例推理',self?'自测练习隐藏诊断标题；同一题库不构成独立考试。':'从常见急症开始，练习问诊、检查选择、处置优先级和交班。',`${allCases().length}个病例`)+`<div class="mode-tabs"><button class="btn ${self?'ghost':''}" onclick="setLearningMode24('learn')">学习模式</button><button class="btn ${self?'':'ghost'}" onclick="setLearningMode24('selftest')">自测练习</button></div><div class="notice">病例内容沿用原始素材，尚待专科签审。用于形成性学习；请由导师判断具体培训阶段及先修要求。</div><div class="toolbar"><input id="caseSearch24" placeholder="${self?'搜索主诉或系统':'搜索病例、主诉或系统'}"><select id="caseGroup24"><option value="all">全部病例</option><option value="core">优先：出血与胰胆急症</option></select></div><div class="casegrid" id="caseGrid24"></div>`;
   function draw(){const query=norm($('#caseSearch24').value),group=$('#caseGroup24').value;$('#caseGrid24').innerHTML=allCases().filter(c=>(group!=='core'||coreIDs.has(c.id))&&(!query||norm((self?'':c.title)+c.chief+c.system).includes(query))).map(c=>`<button class="case case24" data-case24="${esc(c.id)}"><span class="tag">${esc(c.system)}</span><span class="tag">${esc(c.difficulty)}</span><h3>${esc(self?`${c.age}岁${c.sex}性 · ${c.chief}`:c.title)}</h3><p>${esc(c.chief)}</p><small>教学内容待专科复核</small></button>`).join('');document.querySelectorAll('[data-case24]').forEach(b=>b.onclick=()=>startCase(b.dataset.case24))}
   $('#caseSearch24').oninput=draw;$('#caseGroup24').onchange=draw;draw();
 };
 window.procedures=function(){
   window.dispatchEvent(new Event('gi24-leave-training'));
   const tutorials=window.GI_V23_TUTORIALS||{},p=ensure24(prof());
   $('#main').innerHTML=head('内镜认知训练','识别器械、理解步骤与风险、知道何时请求导师协助。','10套教程')+`<div class="notice">拖拽与动画用于流程认知，不评价独立内镜操作能力。先逐步浏览教程，再进入模拟复盘；ERAT 为专科条件下的拓展认知内容。</div><div class="grid g2"><section class="card"><h2>器械图库</h2><p>观察所示型号的外观、针尖结构及用途，比较 FNA 与 FNB。</p><button class="btn" onclick="openToolAtlas()">打开器械图库</button></section><section class="card"><h2>器械识图练习</h2><p>辨认名称与用途，记录本轮作答及解析。</p><button class="btn" onclick="startToolQuiz()">开始识图</button></section></div><div class="section"><h2>流程教程</h2><small>图像标签与临床适用性待专科复核</small></div><div class="casegrid">${Object.entries(tutorials).map(([id,t])=>{const last=p.v24.attempts.filter(a=>a.kind==='simulation'&&a.caseId===id&&a.status!=='abandoned').at(-1);return `<section class="card"><span class="tag">${t.steps.length}个教学步骤</span><h2>${esc(t.name)}</h2><p>${esc(t.full)}</p>${id==='FNB'?'<p class="mini">共享FNA细胞学图已标注，非FNB组织柱。</p>':''}<p>最近一轮：${last?esc(last.decisionScore)+'%':'尚未完成'}</p><button class="btn" data-tutorial24="${esc(id)}">先看教程 →</button></section>`}).join('')}</div>`;
   document.querySelectorAll('[data-tutorial24]').forEach(b=>b.onclick=()=>openProcedureTutorial(b.dataset.tutorial24));patchUI();
 };
 const originalImages=window.images;
 window.images=function(){beginModule24('images','image-bank');originalImages()};
 const imageQOriginal=window.imageQ;
 if(imageQOriginal)window.imageQ=function(){imageQOriginal();patchUI()};
 // Keep original lesson assets and simulations; record their attempts without changing motor metrics into competency claims.
 for(const fn of ['startToolQuiz','startPhotoQuiz','startAnatomyQuiz','startProcedureQuiz']){
   const original=window[fn];if(!original)continue;
   window[fn]=function(...args){beginModule24(fn==='startProcedureQuiz'?'procedure':'recognition',fn==='startProcedureQuiz'?currentProcedure.id:fn);return original(...args)};
 }
 window.currentOptionOrder24=options=>{
   const choices=document.querySelector('.choices,.sim-options');if(!choices)return options.map((_,i)=>i);
   const order=[...choices.querySelectorAll('.choice,.sim-option')].map(x=>Number(x.dataset.originalIndex24));
   return order.length===options.length&&order.every(Number.isInteger)?order:options.map((_,i)=>i);
 };
 function shuffleChoices(){document.querySelectorAll('.choices:not([data-fixed-order]),.sim-options').forEach(box=>{
   if(box.dataset.shuffled24)return;box.dataset.shuffled24='1';
   const items=[...box.querySelectorAll(':scope > .choice,:scope > .sim-option')];
   items.forEach((el,i)=>{el.dataset.originalIndex24=String(i);if(el.tagName!=='BUTTON'){el.setAttribute('role','button');el.tabIndex=0;el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click()}})}});
   // Locked feedback screens keep their source ordering. Unanswered screens use Fisher–Yates.
   const ordered=box.querySelector('.correct,.wrong')?items:GI24.shuffle(items);
   ordered.forEach((el,i)=>{const node=[...el.childNodes].find(x=>x.nodeType===Node.TEXT_NODE);if(node&&/^[A-Z][.、]\s*/.test(node.textContent))node.textContent=node.textContent.replace(/^[A-Z][.、]\s*/,String.fromCharCode(65+i)+'. ');box.appendChild(el)});
 })}
 window.onImageMissing24=function(img){
   const main=$('#main');if(!main)return;
   if(!main.querySelector('#missing24')){const msg=document.createElement('p');msg.id='missing24';msg.className='notice error-text';msg.textContent='图片加载失败。本页图像答题和模拟已暂停，请检查完整解压目录后重新进入。';main.prepend(msg)}
   main.dataset.imageBlocked='1';main.querySelectorAll('.choice,.sim-option').forEach(x=>{if(x.tagName==='BUTTON')x.disabled=true;x.setAttribute('aria-disabled','true')});
 };
 // Replaced pages have no missing-image marker; do not leave a stale blocked flag behind.
 const blockIfMissing=e=>{const main=$('#main');if(main?.querySelector('#missing24')&&e.target.closest('.choice,.sim-option,[draggable],canvas,[class*="overlay"],[class*="zone"]')){e.preventDefault();e.stopImmediatePropagation()}};
 for(const type of ['click','pointerdown','drop'])document.addEventListener(type,blockIfMissing,true);
 function patchUI(){
   const main=$('#main');if(!main)return;
   if(!main.querySelector('#missing24'))delete main.dataset.imageBlocked;
   if(!main.querySelector('#bar24')){const bar=document.createElement('div');bar.id='bar24';bar.className='bar24';bar.innerHTML='<button class="btn ghost small" id="home24">← 学习首页</button><span id="sync24"></span>';main.prepend(bar);bar.querySelector('button').onclick=()=>nav(session?.role==='teacher'?'teacher':'dashboard')}
   const sync=$('#sync24');if(sync&&sync.textContent!==window.GI24_SYNC)sync.textContent=window.GI24_SYNC||'本机保存';
   const logo=document.querySelector('.logo');if(logo){const small=logo.querySelector('small');if(small&&small.textContent!=='住培辅助教学 · V24.1')small.textContent='住培辅助教学 · V24.1'}
   const top=main.querySelector('.top');if(top){const pill=top.querySelector('.pill');if(pill&&/V\d+|v\d+/.test(pill.textContent)&&!pill.dataset.clean24){pill.dataset.clean24='1';pill.textContent='V24.1 · 形成性学习'}}
   document.querySelectorAll('#nav button').forEach(b=>{const labels={v20hub:'✨ 临床能力练习',cases:'🏥 病例推理',procedures:'🎮 内镜认知训练',report:'📈 学习记录',caseadmin:window.GI24_REMOTE?'🧩 管理员内容管理':'🧩 内容审核台账'};const label=labels[b.dataset.v];if(label&&b.textContent!==label)b.textContent=label});
   shuffleChoices();
   // Label shared sampling images wherever an earlier simulation route uses them.
   document.querySelectorAll('img[src*="fnb_02_sample"],img[src*="fna_02_sample"]').forEach(img=>{if(img.dataset.shared24)return;img.dataset.shared24='1';img.alt='共享FNA细胞学示例；不是FNB组织柱';const n=document.createElement('p');n.className='image-source-note';n.textContent='共享FNA细胞学示例（非FNB组织柱），仅辅助标本类型讨论。';img.parentElement.after(n)});
 }
 let scheduled=false;
 new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;patchUI()})}).observe(document.documentElement,{childList:true,subtree:true});
 window.caseadmin=function(){
   if(session?.role!=='teacher')return;
   $('#main').innerHTML=head('内容审核台账','内容与版权审核需由实际教师、单位和权利人完成；本版本未代签审核。','V24.0')+`<div class="notice">基础病例 ${GI_CASES.length} 例。临床知识点、评分标准、原图与指南适用性均需逐项签审；“可运行”不等于“已通过医学验证”。</div><div class="card"><h2>审核材料</h2><p><a href="docs/CONTENT_REVIEW.csv" target="_blank">病例审核清单 CSV</a></p><p><a href="docs/ASSET_REGISTER.csv" target="_blank">逐文件素材来源与许可清单 CSV</a></p><p><a href="docs/RESEARCH_PROTOCOL.md" target="_blank">研究方案准备说明</a></p><p><a href="docs/COPYRIGHT_PREPARATION.md" target="_blank">软著材料准备说明</a></p><p>审核状态：待专科审核。修订知识点时须同步升级题库和评分版本，并将签审材料存入项目档案。</p></div><div class="card"><h2>病例清单</h2>${GI_CASES.map(c=>`<details><summary>${esc(c.id)} · ${esc(c.title)} · 待审核</summary><p>目标：症状识别、检查选择、处置优先级和升级交班。</p><p>培训阶段：由导师按先修能力指定。</p><p>当前预设诊断：${c.targets.diagnosis.map(esc).join('；')}</p><p>当前预设计划：${c.targets.plan.map(esc).join('；')}</p><p>审核者、审核日期、指南具体条款：待填写。</p></details>`).join('')}</div>`;
 };
 const baseDashboard=window.dashboard;
 window.dashboard=function(){baseDashboard();
   const top=$('#main .top');if(top){const box=document.createElement('div');box.className='notice';box.innerHTML='<b>V24学习路径：</b>优先完成出血、胆道感染与胰腺炎病例，练习识别风险、选择检查、安排处置和呼叫上级。内镜动画与小游戏用于认知拓展。<br>规则反馈不替代教师复核；正式研究需使用独立测评病例。';top.after(box)}
   const btn=document.createElement('button');btn.className='btn';btn.textContent='开始病例推理';btn.onclick=()=>nav('cases');top?.after(btn);patchUI();
 };
 // Browser Back uses a real history entry per top-level route, not an endless pushState guard.
 const routed=window.nav;let fromHistory=false;
 window.nav=function(route){routed(route);if(!fromHistory&&session&&route!=='logout')history.pushState({gi24:route},'',location.href)};
 window.addEventListener('popstate',e=>{if(!session)return;fromHistory=true;nav(e.state?.gi24||(session.role==='teacher'?'teacher':'dashboard'));fromHistory=false});
 patchUI();
})();


