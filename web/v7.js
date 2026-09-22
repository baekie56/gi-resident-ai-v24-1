(function(){
const A='assets/procedure/';
const V=A+'lesions/v7/';
const toolImg={
 '注射针':'assets/procedure/tools/注射针_display.png','DualKnife':'assets/procedure/tools/DualKnife_display.png','Coagrasper':'assets/procedure/tools/Coagrasper_display.png','圈套器':'assets/procedure/tools/圈套器_display.png','APC探头':'assets/procedure/tools/APC探头_display.png','止血夹':'assets/procedure/tools/止血夹_display.png'
};
const legacyProcedures=window.procedures;
const legacyLaunch=window.launchArcade;

const premium={
 ESD:{
  title:'ESD · 胃早癌分阶段真实图模拟',
  case:'胃早癌 ESD 认知模拟：从抬举、切开、进入黏膜下层、剥离，到术中出血处理与完整创面。',
  source:'ESD连续真实内镜图：Journal of Gastric Cancer 2011；原始复合图拆分为独立阶段图。出血关采用真实ESD剥离图叠加教学性出血效果，并在界面明确标注。',
  sourceUrl:'https://jgc-online.org/ArticleImage/1100JGC/jgc-11-146-g001-l.jpg',
  tools:['注射针','DualKnife','Coagrasper','止血夹'],
  steps:[
   {title:'黏膜下注射',task:'把“注射针”拖到病灶边缘/基底的目标区，完成黏膜下抬举。',before:V+'esd_01_marking.jpg',after:V+'esd_02_lift.jpg',tool:'注射针',zones:[[63,57,18,17]],captionBefore:'病灶标记完成',captionAfter:'注射后：病灶抬举',note:'成功后画面切换到真实“抬举后”阶段。'},
   {title:'环周切开',task:'选择 DualKnife，沿抬举病灶外缘完成切开。教学模式下需命中3个边界点。',before:V+'esd_02_lift.jpg',after:V+'esd_03_incision.jpg',tool:'DualKnife',zones:[[48,51,13,13],[69,43,13,13],[71,69,13,13]],captionBefore:'抬举充分',captionAfter:'环周切开完成',note:'成功后显示真实环周切开阶段。'},
   {title:'建立黏膜瓣',task:'用 DualKnife 从切开缘进入，建立可进入的黏膜瓣。',before:V+'esd_03_incision.jpg',after:V+'esd_04_flap.jpg',tool:'DualKnife',zones:[[50,72,20,15]],captionBefore:'已完成环切',captionAfter:'黏膜瓣建立 / 黏膜下层暴露',note:'切开后应看到可进入的黏膜下层工作空间。'},
   {title:'黏膜下剥离',task:'把 DualKnife 拖到暴露的黏膜下层，而不是肌层或病灶表面。',before:V+'esd_04_flap.jpg',after:V+'esd_05_dissection.jpg',tool:'DualKnife',zones:[[58,61,27,20]],captionBefore:'黏膜瓣已建立',captionAfter:'黏膜下剥离进行中',note:'画面切换后可见更清楚的黏膜下层及纤维血管结构。'},
   {title:'术中出血处理',task:'出现术中出血。把 Coagrasper 拖到出血点进行目标性电凝止血。',before:V+'esd_05_bleeding_sim.jpg',after:V+'esd_05_dissection.jpg',tool:'Coagrasper',zones:[[62,60,18,18]],captionBefore:'术中出血（教学模拟叠加）',captionAfter:'止血后：视野恢复',note:'这一关使用真实ESD剥离图并叠加教学性出血视觉，不冒充同一病例的真实出血照片。'},
   {title:'完成剥离',task:'继续用 DualKnife 处理剩余黏膜下附着，完成整块切除。',before:V+'esd_05_dissection.jpg',after:V+'esd_06_defect.jpg',tool:'DualKnife',zones:[[47,39,24,18]],captionBefore:'继续剥离',captionAfter:'整块切除后人工溃疡创面',note:'最终画面为真实切除后创面。'}
  ]
 },
 EMR:{
  title:'EMR · 结肠息肉完整状态切换',
  case:'升结肠约10 mm无蒂/亚蒂息肉：原始病灶 → 注射抬举 → 圈套捕获 → 切除后创面。',
  source:'EMR连续真实结肠镜图：BMC Gastroenterology 2019（CC BY）；原始Figure 3拆分为4个独立阶段。',
  sourceUrl:'https://link.springer.com/article/10.1186/s12876-019-1114-x',
  tools:['注射针','圈套器','止血夹'],
  steps:[
   {title:'黏膜下注射',task:'把注射针拖到病灶基底，建立安全抬举垫。',before:V+'emr_01_lesion.jpg',after:V+'emr_02_lift.jpg',tool:'注射针',zones:[[52,58,19,18]],captionBefore:'原始息肉',captionAfter:'注射后：病灶明显抬举',note:'成功后切换到真实的抬举状态。'},
   {title:'圈套捕获',task:'把圈套器拖到整个抬举病灶，使圈套范围覆盖病灶及合理边缘。',before:V+'emr_02_lift.jpg',after:V+'emr_03_snare.jpg',tool:'圈套器',zones:[[52,46,31,32]],captionBefore:'抬举完成',captionAfter:'圈套器已套住病灶',note:'这一张就是实际“圈套后”的状态，不再在原图上画一个虚拟圈。'},
   {title:'收紧并切除',task:'继续使用圈套器，在病灶基底完成收紧并模拟切除。',before:V+'emr_03_snare.jpg',after:V+'emr_04_defect.jpg',tool:'圈套器',zones:[[55,72,22,14]],captionBefore:'圈套已就位',captionAfter:'EMR切除后创面',note:'成功后病灶消失，切换到真实切除后创面。'}
  ]
 },
 APC:{
  title:'APC · GAVE治疗前 / 治疗中 / 治疗后',
  case:'胃窦血管扩张（GAVE）：识别靶血管后使用APC，观察实时治疗阶段与凝固后组织变化。',
  source:'GAVE APC真实序列：Frontiers in Surgery 2024，CC BY；原始Figure拆分为治疗前、治疗中、治疗后3张图。',
  sourceUrl:'https://www.frontiersin.org/journals/surgery/articles/10.3389/fsurg.2024.1356409/full',
  tools:['APC探头','止血夹'],
  steps:[
   {title:'第一治疗区',task:'拖动 APC 探头到红色血管扩张区域，模拟非接触凝固。',before:V+'apc_01_before.jpg',after:V+'apc_02_during.jpg',tool:'APC探头',zones:[[58,47,30,29]],captionBefore:'GAVE治疗前',captionAfter:'APC治疗中：可见探头与凝固改变',note:'完成后画面直接切换到真实治疗中图。'},
   {title:'完成分区治疗',task:'继续把 APC 探头放到剩余靶区，完成分区治疗。',before:V+'apc_02_during.jpg',after:V+'apc_03_after.jpg',tool:'APC探头',zones:[[57,47,31,29]],captionBefore:'APC治疗中',captionAfter:'治疗后：可见凝固/焦痂改变',note:'成功后显示真实治疗后状态。'}
  ]
 }
};

let G=null,selected='';
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function toolCard(t){return `<div class="v7-tool" draggable="true" data-tool="${esc(t)}" onclick="v7SelectTool('${esc(t)}')"><img src="${toolImg[t]}" alt="${esc(t)}"><div class="name">${esc(t)}</div></div>`}
function procCard(id,d){return `<article class="v7-proc-card" onclick="launchV7('${id}')"><div class="v7-card-img"><img src="${d.steps[0].before}"><span>V7 PREMIUM</span></div><div class="v7-card-body"><h3>${d.title}</h3><p>${d.case}</p><div class="v7-card-tags"><b>${d.steps.length}个连续状态</b><em>真实阶段图</em><em>拖拽操作</em></div></div></article>`}

window.procedures=function(){
 const cards=Object.entries(premium).map(([id,d])=>procCard(id,d)).join('');
 $('#main').innerHTML=head('Endoscopy Procedure Lab v7','这次不再“一张图做到底”。每一步操作成功后都会切换到对应的下一阶段内镜图。','STATE-BASED SIMULATION')+`
 <section class="v7-intro"><div><h2>精品术式模拟</h2><p>先把 ESD、EMR、APC 做深。器械要选对、落点要对、顺序也要对；成功后画面才会进入下一术中状态。</p></div><div class="v7-badges"><span>真实病灶阶段图</span><span>器械图片</span><span>拖拽靶区</span><span>状态切换</span></div></section>
 <div class="v7-grid">${cards}</div>
 <div class="notice v7-note"><b>说明：</b>ESD、EMR、APC的主要阶段图均来自真实开放获取医学图像序列，并已本地化。ESD“出血”关目前使用真实剥离图加教学性出血视觉叠加，并明确标注；其余阶段均为真实对应阶段图。后续拿到医院自有脱敏ESD视频后，可直接替换为同一病例连续帧。</div>`;
};

window.launchV7=function(id){
 if(!premium[id]) return;
 G={id,step:0,hit:0,score:0,lives:3,start:Date.now(),expert:false,transition:false}; selected=''; renderV7();
};
window.v7SelectTool=function(t){selected=t;document.querySelectorAll('.v7-tool').forEach(x=>x.classList.toggle('active',x.dataset.tool===t));const m=document.querySelector('.v7-msg');if(m)m.textContent='已选择 '+t+'。拖住器械图片，把工作端放到正确区域。'};
window.v7Mode=function(x){if(!G)return;G.expert=x;renderV7()};

function renderV7(){
 const d=premium[G.id],st=d.steps[G.step];
 $('#main').innerHTML=head(d.title,d.case,'OPERATOR MODE v7')+`
 <div class="v7-shell">
  <div class="v7-topbar">
   <div><div class="v7-kicker">STEP ${G.step+1} / ${d.steps.length}</div><h2>${st.title}</h2><p>${st.task}</p></div>
   <div class="v7-mode"><button class="${G.expert?'':'active'}" onclick="v7Mode(false)">教学模式</button><button class="${G.expert?'active':''}" onclick="v7Mode(true)">专家模式</button></div>
  </div>
  <div class="v7-layout">
   <section class="v7-monitor" id="v7monitor">
    <img id="v7img" src="${st.before}" alt="${st.captionBefore}">
    <div class="v7-fade" id="v7fade"></div>
    <div class="v7-rec">REC ●</div>
    <div class="v7-hud" id="v7hud"><b>SCORE ${G.score}</b><span>${'♥'.repeat(G.lives)}${'♡'.repeat(3-G.lives)}</span></div>
    <div class="v7-caption" id="v7caption">${st.captionBefore}</div>
    <div class="v7-overlay" id="v7overlay"></div>
    <div class="v7-msg">${st.task}</div>
   </section>
   <aside class="v7-side">
    <div class="v7-tray"><h3>器械托盘</h3><p>拖拽图片到病灶/操作靶区</p>${d.tools.map(toolCard).join('')}</div>
    <div class="v7-progress"><h3>术式进度</h3>${d.steps.map((x,i)=>`<div class="v7-step ${i<G.step?'done':i===G.step?'current':''}"><span>${i<G.step?'✓':i+1}</span><div><b>${x.title}</b><small>${x.captionAfter}</small></div></div>`).join('')}</div>
   </aside>
  </div>
  <div class="v7-source"><b>图像来源：</b>${d.source} <a href="${d.sourceUrl}" target="_blank" rel="noopener">查看原始来源</a></div>
 </div>`;
 bindV7(); drawZones();
}

function bindV7(){
 document.querySelectorAll('.v7-tool').forEach(el=>{
  el.addEventListener('dragstart',e=>{selected=el.dataset.tool;e.dataTransfer.setData('text/plain',selected);e.dataTransfer.effectAllowed='copy';});
 });
 const o=$('#v7overlay');
 o.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy'});
 o.addEventListener('drop',e=>{e.preventDefault();if(G.transition)return;const r=o.getBoundingClientRect();attemptV7(e.dataTransfer.getData('text/plain')||selected,(e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100)});
 o.addEventListener('click',e=>{if(!selected||G.transition)return;const r=o.getBoundingClientRect();attemptV7(selected,(e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100)});
}
function drawZones(){
 const st=premium[G.id].steps[G.step],o=$('#v7overlay');
 st.zones.forEach((z,i)=>{const h=document.createElement('div');h.className='v7-zone '+(G.expert?'expert':'');h.style.left=(z[0]-z[2]/2)+'%';h.style.top=(z[1]-z[3]/2)+'%';h.style.width=z[2]+'%';h.style.height=z[3]+'%';h.dataset.i=i;o.appendChild(h)});
}
function inside(x,y,z){return x>=z[0]-z[2]/2&&x<=z[0]+z[2]/2&&y>=z[1]-z[3]/2&&y<=z[1]+z[3]/2}
function attemptV7(tool,x,y){
 const d=premium[G.id],st=d.steps[G.step];
 if(tool!==st.tool) return failV7('器械错误：当前步骤需要 '+st.tool);
 const z=st.zones[G.hit];
 if(!inside(x,y,z)) return failV7('落点不对。器械工作端没有进入当前目标区域。');
 G.score+=100+(G.expert?35:0);G.hit++;
 const zones=[...document.querySelectorAll('.v7-zone')];if(zones[G.hit-1])zones[G.hit-1].classList.add('done');
 updateV7('✓ 靶点 '+G.hit+'/'+st.zones.length+' 完成');
 if(G.hit>=st.zones.length) successTransition(st);
}
function failV7(msg){G.lives--;G.score=Math.max(0,G.score-25);updateV7('⚠ '+msg);const mon=$('#v7monitor');if(mon){mon.classList.remove('shake');void mon.offsetWidth;mon.classList.add('shake')}if(G.lives<=0)setTimeout(finishV7,450)}
function updateV7(msg){const h=$('#v7hud'),m=document.querySelector('.v7-msg');if(h)h.innerHTML=`<b>SCORE ${G.score}</b><span>${'♥'.repeat(Math.max(0,G.lives))}${'♡'.repeat(3-Math.max(0,G.lives))}</span>`;if(m)m.textContent=msg}
function successTransition(st){
 G.transition=true;const img=$('#v7img'),fade=$('#v7fade'),cap=$('#v7caption'),msg=document.querySelector('.v7-msg');
 if(msg)msg.textContent='✓ '+st.title+' 完成，切换到下一术中状态…';
 if(fade)fade.classList.add('on');
 setTimeout(()=>{if(img){img.src=st.after;img.onload=()=>{if(fade)fade.classList.remove('on')}};if(cap)cap.textContent=st.captionAfter;},260);
 setTimeout(()=>{
  if(msg)msg.textContent=st.note;
  setTimeout(()=>{G.step++;G.hit=0;G.transition=false;if(G.step>=premium[G.id].steps.length)finishV7();else renderV7();},950);
 },620);
}
function finishV7(){
 const d=premium[G.id],win=G.lives>0&&G.step>=d.steps.length,sec=Math.max(1,Math.round((Date.now()-G.start)/1000)),bonus=win?Math.max(0,320-sec):0,total=G.score+bonus,stars=win?(total>=650?3:total>=430?2:1):0;
 const o=$('#v7overlay');if(!o)return;
 o.innerHTML=`<div class="v7-finish"><div><div class="v7-kicker">${win?'MISSION COMPLETE':'MISSION FAILED'}</div><h2>${d.title}</h2><div class="v7-finalscore">${total}</div><div class="v7-stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><p>用时 ${sec}s · 剩余生命 ${Math.max(0,G.lives)}/3 · ${G.expert?'专家模式':'教学模式'}</p><button class="btn" onclick="launchV7('${G.id}')">再练一轮</button> <button class="btn soft" onclick="procedures()">返回精品术式</button></div></div>`;
}

try{document.title='GI Resident AI V24.0 · 住培辅助教学';document.querySelectorAll('.logo small').forEach(x=>x.textContent='RESIDENCY TRAINING · V7');document.querySelectorAll('.login .pill').forEach(x=>x.textContent='GI Resident AI · v7')}catch(e){}
})();
