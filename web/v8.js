(function(){
const A='assets/procedure/';
const V7=A+'lesions/v7/';
const V8=A+'lesions/v8/';
const toolImg={
 '注射针':'assets/procedure/tools/注射针_display.png','DualKnife':'assets/procedure/tools/DualKnife_display.png','Coagrasper':'assets/procedure/tools/Coagrasper_display.png','圈套器':'assets/procedure/tools/圈套器_display.png','APC探头':'assets/procedure/tools/APC探头_display.png','止血夹':'assets/procedure/tools/止血夹_display.png',
 '套扎器':'assets/procedure/tools/套扎器_display.png','FNA穿刺针':'assets/procedure/tools/FNA穿刺针_display.png','乳头切开刀':'assets/procedure/tools/乳头切开刀_display.png','导丝':'assets/procedure/tools/导丝_display.png','取石球囊':'assets/procedure/tools/取石球囊_display.png','隧道刀':'assets/procedure/tools/隧道刀_display.png','冲洗导管':'assets/procedure/tools/冲洗导管_display.png'
};

const premium={
 ESD:{
  kind:'真实阶段图',
  title:'ESD · 胃早癌分阶段真实图模拟',
  case:'胃角早癌 ESD：病灶边缘注射、沿边缘切开、建立黏膜瓣、黏膜下剥离、术中止血，直到完整人工溃疡创面。',
  source:'ESD连续真实内镜图：Journal of Gastric Cancer 2011；图像已拆分为独立阶段图。术中出血帧为真实剥离图叠加教学性出血效果。',
  sourceUrl:'https://jgc-online.org/ArticleImage/1100JGC/jgc-11-146-g001-l.jpg',
  tools:['注射针','DualKnife','Coagrasper','止血夹'],
  steps:[
   {title:'黏膜下注射',task:'把“注射针”拖到病灶边缘/基底，先建立抬举垫。',before:V7+'esd_01_marking.jpg',after:V7+'esd_02_lift.jpg',tool:'注射针',zones:[[58,62,18,16]],captionBefore:'病灶标记完成',captionAfter:'注射后：病灶抬举',note:'成功后画面切换到真实“抬举后”阶段。'},
   {title:'沿病灶边缘环周切开',task:'选择 DualKnife，沿病灶边缘依次完成切开。请沿边缘命中 4 个落点，而不是切在病灶中央。',before:V7+'esd_02_lift.jpg',after:V7+'esd_03_incision.jpg',tool:'DualKnife',zones:[[39,53,10,10],[53,34,10,10],[73,48,10,10],[61,71,10,10]],captionBefore:'抬举充分',captionAfter:'环周切开完成',note:'已改善切开落点：现在要求沿病灶边缘完成环切。'},
   {title:'建立黏膜瓣',task:'继续用 DualKnife 从切开缘进入，建立可进入的黏膜瓣。',before:V7+'esd_03_incision.jpg',after:V7+'esd_04_flap.jpg',tool:'DualKnife',zones:[[52,73,18,14]],captionBefore:'已完成环切',captionAfter:'黏膜瓣建立 / 黏膜下层暴露',note:'切开后应形成可进入的黏膜瓣与工作空间。'},
   {title:'黏膜下剥离',task:'把 DualKnife 拖到暴露的黏膜下层，避免切到病灶表面或肌层。',before:V7+'esd_04_flap.jpg',after:V7+'esd_05_dissection.jpg',tool:'DualKnife',zones:[[60,62,22,18]],captionBefore:'黏膜瓣已建立',captionAfter:'黏膜下剥离进行中',note:'画面切换后可见更清楚的黏膜下层与纤维血管结构。'},
   {title:'术中出血处理',task:'出现术中出血。把 Coagrasper 拖到出血点进行目标性电凝止血。',before:V7+'esd_05_bleeding_sim.jpg',after:V7+'esd_05_dissection.jpg',tool:'Coagrasper',zones:[[63,60,17,17]],captionBefore:'术中出血（教学模拟叠加）',captionAfter:'止血后：视野恢复',note:'这一关使用真实ESD剥离图并叠加教学性出血视觉。'},
   {title:'完成剥离',task:'继续用 DualKnife 处理剩余黏膜下附着，完成整块切除。',before:V7+'esd_05_dissection.jpg',after:V7+'esd_06_defect.jpg',tool:'DualKnife',zones:[[49,40,16,14],[67,40,16,14]],captionBefore:'继续剥离',captionAfter:'整块切除后人工溃疡创面',note:'最终画面为真实切除后创面。'}
  ]
 },
 EMR:{
  kind:'真实阶段图',
  title:'EMR · 息肉抬举、圈套、切除、夹闭',
  case:'结肠息肉 EMR：原始病灶 → 注射抬举 → 圈套捕获 → 切除后创面 → 夹闭封闭创面。',
  source:'EMR连续真实结肠镜图：BMC Gastroenterology 2019（CC BY）；最后“夹闭创面”帧为在真实创面图上叠加教学性夹闭效果。',
  sourceUrl:'https://link.springer.com/article/10.1186/s12876-019-1114-x',
  tools:['注射针','圈套器','止血夹'],
  steps:[
   {title:'黏膜下注射',task:'把注射针拖到病灶基底，建立安全抬举垫。',before:V7+'emr_01_lesion.jpg',after:V7+'emr_02_lift.jpg',tool:'注射针',zones:[[52,58,19,18]],captionBefore:'原始息肉',captionAfter:'注射后：病灶明显抬举',note:'成功后切换到真实的抬举状态。'},
   {title:'圈套捕获',task:'把圈套器拖到整个抬举病灶，使圈套范围覆盖病灶及合理边缘。',before:V7+'emr_02_lift.jpg',after:V7+'emr_03_snare.jpg',tool:'圈套器',zones:[[52,46,31,32]],captionBefore:'抬举完成',captionAfter:'圈套器已套住病灶',note:'这一张就是实际“圈套后”的状态。'},
   {title:'收紧并切除',task:'继续使用圈套器，在病灶基底完成收紧并模拟切除。',before:V7+'emr_03_snare.jpg',after:V7+'emr_04_defect.jpg',tool:'圈套器',zones:[[55,72,22,14]],captionBefore:'圈套已就位',captionAfter:'EMR切除后创面',note:'成功后病灶消失，切换到真实切除后创面。'},
   {title:'夹闭封闭创面',task:'把止血夹依次拖到创面边缘两侧，完成夹闭封闭。',before:V7+'emr_04_defect.jpg',after:V8+'emr_05_closure.jpg',tool:'止血夹',zones:[[58,46,16,16],[58,60,16,16]],captionBefore:'EMR创面待处理',captionAfter:'夹闭后：创面封闭',note:'已加入最后打夹子封闭创面。'}
  ]
 },
 APC:{
  kind:'真实阶段图',
  title:'APC · GAVE治疗前 / 治疗中 / 治疗后',
  case:'胃窦血管扩张（GAVE）：识别靶血管后使用APC，观察治疗中与凝固后组织变化。',
  source:'GAVE APC真实序列：Frontiers in Surgery 2024，CC BY；图像已拆分为治疗前、治疗中、治疗后。',
  sourceUrl:'https://www.frontiersin.org/journals/surgery/articles/10.3389/fsurg.2024.1356409/full',
  tools:['APC探头'],
  steps:[
   {title:'第一治疗区',task:'拖动 APC 探头到异常血管区域，模拟非接触凝固。',before:V7+'apc_01_before.jpg',after:V7+'apc_02_during.jpg',tool:'APC探头',zones:[[55,45,20,18],[63,57,18,16]],captionBefore:'GAVE治疗前',captionAfter:'APC治疗中：可见探头与凝固改变',note:'完成后切换到真实治疗中图。'},
   {title:'完成分区治疗',task:'继续把 APC 探头放到剩余靶区，完成分区治疗。',before:V7+'apc_02_during.jpg',after:V7+'apc_03_after.jpg',tool:'APC探头',zones:[[57,47,20,18],[47,59,20,18]],captionBefore:'APC治疗中',captionAfter:'治疗后：可见凝固/焦痂改变',note:'成功后显示真实治疗后状态。'}
  ]
 },
 EVL:{
  kind:'教学状态图',
  title:'套扎（EVL）· 食管静脉曲张',
  case:'食管静脉曲张套扎：识别曲张静脉 → 吸入套扎帽 → 释放皮圈。',
  source:'教学状态图：本地制作，用于训练“把套扎器放到曲张静脉上并完成套扎”的流程。',
  sourceUrl:'',
  tools:['套扎器'],
  steps:[
   {title:'瞄准曲张静脉',task:'把套扎器拖到蓝色曲张静脉上方，对准准备套扎的静脉柱。',before:V8+'evl_01.png',after:V8+'evl_02.png',tool:'套扎器',zones:[[50,50,18,42]],captionBefore:'静脉曲张待套扎',captionAfter:'已吸入套扎帽',note:'先对准曲张静脉并吸引入帽。'},
   {title:'释放皮圈',task:'继续使用套扎器，在套扎帽处释放皮圈。',before:V8+'evl_02.png',after:V8+'evl_03.png',tool:'套扎器',zones:[[59,50,18,18]],captionBefore:'静脉已吸入套扎帽',captionAfter:'套扎完成',note:'完成后可见套扎后的紫色结节样改变。'}
  ]
 },
 POEM:{
  kind:'教学状态图',
  title:'POEM · 贲门失弛缓隧道化模拟',
  case:'POEM：入口区注射 → 黏膜切开 → 建立黏膜下隧道 → 跨EGJ肌切开 → 夹闭入口。',
  source:'教学状态图：本地制作，用于演示POEM关键步骤与顺序。',
  sourceUrl:'',
  tools:['注射针','隧道刀','止血夹'],
  steps:[
   {title:'入口区注射',task:'把注射针拖到入口点，先建立黏膜下抬举。',before:V8+'poem_01.png',after:V8+'poem_02.png',tool:'注射针',zones:[[51,37,18,16]],captionBefore:'POEM入口区',captionAfter:'注射后：入口区抬举',note:'POEM先注射，再切开。'},
   {title:'黏膜切开',task:'换用隧道刀，在抬举区进行入口切开。',before:V8+'poem_02.png',after:V8+'poem_03.png',tool:'隧道刀',zones:[[51,38,20,18]],captionBefore:'入口已抬举',captionAfter:'入口切开完成',note:'入口切开后才能进入隧道。'},
   {title:'建立黏膜下隧道',task:'继续使用隧道刀，沿黏膜下层向远端建立隧道。',before:V8+'poem_03.png',after:V8+'poem_04.png',tool:'隧道刀',zones:[[50,58,24,36]],captionBefore:'入口切开',captionAfter:'隧道建立中',note:'应沿黏膜下层推进，不是沿表面切。'},
   {title:'跨EGJ肌切开',task:'在隧道内完成肌切开，并向胃侧延伸。',before:V8+'poem_04.png',after:V8+'poem_05.png',tool:'隧道刀',zones:[[54,56,18,30]],captionBefore:'黏膜下隧道已建立',captionAfter:'肌切开完成',note:'这一步的目标是肌层，而不是黏膜。'},
   {title:'夹闭入口',task:'用止血夹关闭入口切口。',before:V8+'poem_05.png',after:V8+'poem_06.png',tool:'止血夹',zones:[[46,38,12,12],[52,38,12,12],[58,38,12,12]],captionBefore:'肌切开结束',captionAfter:'入口已夹闭',note:'POEM结束前要关闭黏膜入口。'}
  ]
 },
 ERCP:{
  kind:'教学状态图',
  title:'ERCP · 胆总管结石取石',
  case:'ERCP：识别乳头 → 导丝选择性胆管插管 → 乳头处理 → 球囊取石 → 终末清扫。',
  source:'教学状态图：本地制作；病例背景为胆总管结石取石流程。',
  sourceUrl:'',
  tools:['导丝','乳头切开刀','取石球囊'],
  steps:[
   {title:'导丝插管',task:'把导丝拖到乳头开口，完成选择性胆管插管。',before:V8+'ercp_01_papilla.png',after:V8+'ercp_02_wire.png',tool:'导丝',zones:[[51,45,12,12]],captionBefore:'识别大乳头',captionAfter:'导丝已进入胆管',note:'先获得稳定乳头视野，再进行选择性插管。'},
   {title:'乳头处理',task:'换用乳头切开刀，在乳头口进行治疗性处理。',before:V8+'ercp_02_wire.png',after:V8+'ercp_03_balloon.png',tool:'乳头切开刀',zones:[[50,45,14,14]],captionBefore:'导丝插管完成',captionAfter:'胆总管结石待取出',note:'处理后进入取石阶段。'},
   {title:'球囊取石',task:'把取石球囊拖到结石近端，再向乳头方向回拉。',before:V8+'ercp_03_balloon.png',after:V8+'ercp_04_clear.png',tool:'取石球囊',zones:[[50,39,18,18]],captionBefore:'结石 + 取石球囊',captionAfter:'终末胆管清扫后清晰',note:'回拉球囊后完成取石并得到清晰胆管影像。'}
  ]
 },
 ERAT:{
  kind:'教学状态图',
  title:'ERAT · 阑尾逆行治疗',
  case:'ERAT：识别阑尾开口 → 导丝进入阑尾腔 → 冲洗/清除梗阻 → 腔内通畅。',
  source:'教学状态图：本地制作，用于演示ERAT的基本思路与器械顺序。',
  sourceUrl:'',
  tools:['导丝','冲洗导管'],
  steps:[
   {title:'导丝进入阑尾开口',task:'把导丝拖到阑尾开口中央。',before:V8+'erat_01.png',after:V8+'erat_02.png',tool:'导丝',zones:[[51,48,14,14]],captionBefore:'阑尾开口',captionAfter:'导丝已进入阑尾腔',note:'ERAT的第一步是准确找到并进入阑尾开口。'},
   {title:'导管冲洗与取出碎屑',task:'换用冲洗导管，对阑尾腔进行冲洗并处理梗阻物。',before:V8+'erat_02.png',after:V8+'erat_03.png',tool:'冲洗导管',zones:[[49,49,18,18]],captionBefore:'导丝已就位',captionAfter:'冲洗处理中',note:'此步强调“导丝后再导管”的顺序。'},
   {title:'腔内恢复通畅',task:'继续把冲洗导管放在阑尾开口处，完成最终通畅处理。',before:V8+'erat_03.png',after:V8+'erat_04.png',tool:'冲洗导管',zones:[[49,49,18,18]],captionBefore:'冲洗与处理碎屑',captionAfter:'阑尾腔已通畅',note:'完成后显示处理后的通畅状态。'}
  ]
 },
 FNA:{
  kind:'教学状态图',
  title:'FNA · EUS引导穿刺取材',
  case:'EUS-FNA：识别靶病灶 → 规划安全路径避开血管 → 进针到病灶 → 在病灶内抽吸取材。',
  source:'教学状态图：本地制作，用于训练“先避血管，再穿刺”的流程。',
  sourceUrl:'',
  tools:['FNA穿刺针'],
  steps:[
   {title:'选择安全进针路径',task:'把FNA穿刺针拖到无血管的安全进针方向。',before:V8+'fna_01.png',after:V8+'fna_02.png',tool:'FNA穿刺针',zones:[[32,37,14,14]],captionBefore:'EUS下目标病灶',captionAfter:'已规划安全路径',note:'先规划路径，避免直接穿过血管。'},
   {title:'穿刺进入病灶',task:'沿安全路径把FNA针推进到病灶中央。',before:V8+'fna_02.png',after:V8+'fna_03.png',tool:'FNA穿刺针',zones:[[56,54,16,16]],captionBefore:'路径避开血管',captionAfter:'针尖已进入病灶',note:'必须命中病灶本体，而不是在边缘徘徊。'},
   {title:'病灶内抽吸取材',task:'继续保持针尖在病灶内，完成抽吸取材。',before:V8+'fna_03.png',after:V8+'fna_04.png',tool:'FNA穿刺针',zones:[[60,56,18,18]],captionBefore:'病灶内针尖位置',captionAfter:'取材完成',note:'完成后可见针在病灶内的工作状态。'}
  ]
 }
};

let G=null,selected='';
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function toolCard(t){const img=toolImg[t]||'assets/procedure/tools/止血夹_display.png';return `<div class="v7-tool" draggable="true" data-tool="${esc(t)}" onclick="v8SelectTool('${esc(t)}')"><img src="${img}" alt="${esc(t)}"><div class="name">${esc(t)}</div></div>`}
function procCard(id,d){const first=d.steps[0].before;return `<article class="v7-proc-card" onclick="launchV8('${id}')"><div class="v7-card-img"><img src="${first}"><span>${d.kind}</span></div><div class="v7-card-body"><h3>${d.title}</h3><p>${d.case}</p><div class="v7-card-tags"><b>${d.steps.length}个连续状态</b><em>${d.kind}</em><em>拖拽操作</em></div></div></article>`}
window.procedures=function(){
 const order=['ESD','EMR','APC','EVL','POEM','ERCP','ERAT','FNA'];
 const cards=order.map(id=>procCard(id,premium[id])).join('');
 $('#main').innerHTML=head('Endoscopy Procedure Lab v8','在 v7 的基础上继续升级：EMR 新增夹闭创面；ESD 切开落点改为沿病灶边缘；补齐更多器械图，并新增套扎、POEM、ERCP、ERAT、FNA 等常见消化内镜操作。','STATE-BASED SIMULATION v8')+`
 <section class="v7-intro"><div><h2>精品术式模拟 v8</h2><p>每个小游戏都围绕“具体病变 → 选择器械图片 → 拖到正确落点 → 画面切换到下一术中状态”展开。前三个术式（ESD / EMR / APC）以真实阶段图为主；新增 EVL、POEM、ERCP、ERAT、FNA 为教学状态图，方便先把流程练熟。</p></div><div class="v7-badges"><span>真实阶段图</span><span>教学状态图</span><span>器械图片补齐</span><span>拖拽落点</span></div></section>
 <div class="v7-grid">${cards}</div>
 <div class="notice v7-note"><b>说明：</b>本页现在混合两类资源：① 真实阶段图（ESD / EMR / APC）用于训练对真实病灶状态变化的认知；② 教学状态图（EVL / POEM / ERCP / ERAT / FNA）用于训练器械顺序、落点和流程。后续如果你有科室脱敏病例视频，可以继续替换新增术式的教学图为真实连续图。</div>`;
};
window.launchV8=function(id){ if(!premium[id]) return; G={id,step:0,hit:0,score:0,lives:3,start:Date.now(),expert:false,transition:false}; selected=''; renderV8(); };
window.v8SelectTool=function(t){selected=t;document.querySelectorAll('.v7-tool').forEach(x=>x.classList.toggle('active',x.dataset.tool===t));const m=document.querySelector('.v7-msg');if(m)m.textContent='已选择 '+t+'。拖住器械图片，把工作端放到正确区域。'};
window.v8Mode=function(x){if(!G)return;G.expert=x;renderV8()};
function renderV8(){
 const d=premium[G.id],st=d.steps[G.step];
 $('#main').innerHTML=head(d.title,d.case,'OPERATOR MODE v8')+`
 <div class="v7-shell">
  <div class="v7-topbar">
   <div><div class="v7-kicker">STEP ${G.step+1} / ${d.steps.length}</div><h2>${st.title}</h2><p>${st.task}</p></div>
   <div class="v7-mode"><button class="${G.expert?'':'active'}" onclick="v8Mode(false)">教学模式</button><button class="${G.expert?'active':''}" onclick="v8Mode(true)">专家模式</button></div>
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
  <div class="v7-source"><b>图像来源：</b>${d.source}${d.sourceUrl?` <a href="${d.sourceUrl}" target="_blank" rel="noopener">查看原始来源</a>`:''}</div>
 </div>`;
 bindV8(); drawZones();
}
function bindV8(){
 document.querySelectorAll('.v7-tool').forEach(el=>{el.addEventListener('dragstart',e=>{selected=el.dataset.tool;e.dataTransfer.setData('text/plain',selected);e.dataTransfer.effectAllowed='copy';});});
 const o=$('#v7overlay');
 o.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy'});
 o.addEventListener('drop',e=>{e.preventDefault();if(G.transition)return;const r=o.getBoundingClientRect();attemptV8(e.dataTransfer.getData('text/plain')||selected,(e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100)});
 o.addEventListener('click',e=>{if(!selected||G.transition)return;const r=o.getBoundingClientRect();attemptV8(selected,(e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100)});
}
function drawZones(){ const st=premium[G.id].steps[G.step],o=$('#v7overlay'); st.zones.forEach((z,i)=>{const h=document.createElement('div');h.className='v7-zone '+(G.expert?'expert':'');h.style.left=(z[0]-z[2]/2)+'%';h.style.top=(z[1]-z[3]/2)+'%';h.style.width=z[2]+'%';h.style.height=z[3]+'%';h.dataset.i=i;o.appendChild(h)}); }
function inside(x,y,z){return x>=z[0]-z[2]/2&&x<=z[0]+z[2]/2&&y>=z[1]-z[3]/2&&y<=z[1]+z[3]/2}
function attemptV8(tool,x,y){
 const d=premium[G.id],st=d.steps[G.step];
 if(tool!==st.tool) return failV8('器械错误：当前步骤需要 '+st.tool);
 const z=st.zones[G.hit]; if(!inside(x,y,z)) return failV8('落点不对。器械工作端没有进入当前目标区域。');
 G.score+=100+(G.expert?35:0); G.hit++; const zones=[...document.querySelectorAll('.v7-zone')]; if(zones[G.hit-1]) zones[G.hit-1].classList.add('done');
 updateV8('✓ 靶点 '+G.hit+'/'+st.zones.length+' 完成'); if(G.hit>=st.zones.length) successTransition(st);
}
function failV8(msg){G.lives--;G.score=Math.max(0,G.score-25);updateV8('⚠ '+msg);const mon=$('#v7monitor');if(mon){mon.classList.remove('shake');void mon.offsetWidth;mon.classList.add('shake')}if(G.lives<=0)setTimeout(finishV8,450)}
function updateV8(msg){const h=$('#v7hud'),m=document.querySelector('.v7-msg');if(h)h.innerHTML=`<b>SCORE ${G.score}</b><span>${'♥'.repeat(Math.max(0,G.lives))}${'♡'.repeat(3-Math.max(0,G.lives))}</span>`;if(m)m.textContent=msg}
function successTransition(st){
 G.transition=true; const img=$('#v7img'),fade=$('#v7fade'),cap=$('#v7caption'),msg=document.querySelector('.v7-msg');
 if(msg) msg.textContent='✓ '+st.title+' 完成，切换到下一术中状态…'; if(fade) fade.classList.add('on');
 setTimeout(()=>{ if(img){img.src=st.after; img.onload=()=>{if(fade)fade.classList.remove('on')}}; if(cap) cap.textContent=st.captionAfter; },260);
 setTimeout(()=>{ if(msg) msg.textContent=st.note; setTimeout(()=>{ G.step++; G.hit=0; G.transition=false; if(G.step>=premium[G.id].steps.length) finishV8(); else renderV8(); },950); },620);
}
function finishV8(){
 const d=premium[G.id],win=G.lives>0&&G.step>=d.steps.length,sec=Math.max(1,Math.round((Date.now()-G.start)/1000)),bonus=win?Math.max(0,320-sec):0,total=G.score+bonus,stars=win?(total>=650?3:total>=430?2:1):0;
 const o=$('#v7overlay'); if(!o) return;
 o.innerHTML=`<div class="v7-finish"><div><div class="v7-kicker">${win?'MISSION COMPLETE':'MISSION FAILED'}</div><h2>${d.title}</h2><div class="v7-finalscore">${total}</div><div class="v7-stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><p>用时 ${sec}s · 剩余生命 ${Math.max(0,G.lives)}/3 · ${G.expert?'专家模式':'教学模式'}</p><button class="btn" onclick="launchV8('${G.id}')">再练一轮</button> <button class="btn soft" onclick="procedures()">返回精品术式</button></div></div>`;
}
try{document.title='GI Resident AI V24.0 · 住培辅助教学';}catch(e){}
})();
