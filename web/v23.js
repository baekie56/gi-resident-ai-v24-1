// GI Resident AI v23: tolerant free-text grading, image resilience and pre-practice tutorials.
(function(){
'use strict';

const VERSION='V24.0';
const TOOL_IMAGES={
 '注射针':'assets/procedure/tools/注射针_display.png','DualKnife':'assets/procedure/tools/DualKnife_display.png',
 'Coagrasper':'assets/procedure/tools/Coagrasper_display.png','圈套器':'assets/procedure/tools/圈套器_display.png',
 'APC探头':'assets/procedure/tools/APC探头_display.png','止血夹':'assets/procedure/tools/止血夹_display.png',
 '套扎器':'assets/procedure/tools/套扎器_display.png','导丝':'assets/procedure/tools/导丝_display.png',
 '乳头切开刀':'assets/procedure/tools/乳头切开刀_display.png','取石球囊':'assets/procedure/tools/取石球囊_display.png',
 '隧道刀':'assets/procedure/tools/隧道刀_display.png','冲洗导管':'assets/procedure/tools/冲洗导管_display.png',
 'FNA穿刺针':'assets/procedure/tools/FNA穿刺针_display.png','FNB穿刺针':'assets/procedure/tools/FNB穿刺针_display.png'
};

const semanticScore=GI24.semanticScore;window.matchScore=GI24.semanticScore;window.GI_SEMANTIC_MATCH=GI24.semanticMatch;
// V24 text feedback is implemented in js/records.js.

const TUTORIALS={
 ESD:{name:'ESD',full:'内镜黏膜下剥离术',source:'https://www.asge.org/home/resources/publications/guidelines/american-society-for-gastrointestinal-endoscopy-guideline-on-endoscopic-submucosal-dissection-for-the-management-of-early-esophageal-and-gastric-cancers--methodology-and-review-of-evidence',steps:[
  ['病灶边界标记','先确认病灶范围与切除边界，标记点位于病灶外周。','assets/procedure/lesions/v7/esd_01_marking.jpg','胃早癌边界标记','DualKnife','scan'],
  ['黏膜下注射抬举','在病灶边缘及基底分区注射，建立安全黏膜下垫。','assets/procedure/lesions/v7/esd_02_lift.jpg','胃早癌注射抬举','注射针','inject'],
  ['环周切开','沿病灶外缘逐段切开，避免切入病灶中央。','assets/procedure/lesions/v7/esd_03_incision.jpg','胃早癌环周切开','DualKnife','cut'],
  ['黏膜下剥离与止血','辨认黏膜下层和血管，分层剥离；出血时恢复视野后目标性止血。','assets/procedure/lesions/v7/esd_05_dissection.jpg','胃早癌黏膜下剥离','Coagrasper','coag'],
  ['检查切除创面','确认标本完整、创面无活动性出血及可疑深层损伤。','assets/procedure/lesions/v7/esd_06_defect.jpg','ESD切除后创面','止血夹','inspect']]},
 EMR:{name:'EMR',full:'内镜黏膜切除术',source:'https://www.asge.org/home/resources/publications/guidelines/endoscopic-removal-of-colorectal-lesions-recommendations-by-the-us-multi-society-task-force-on-colorectal-cancer',steps:[
  ['确认病灶范围','在切除前观察大小、形态、边界及有无深浸润征象。','assets/procedure/lesions/v7/emr_01_lesion.jpg','乙状结肠腺瘤','圈套器','scan'],
  ['黏膜下注射','按病灶特点建立黏膜下抬举垫，并观察抬举征。','assets/procedure/lesions/v7/emr_02_lift.jpg','乙状结肠腺瘤注射抬举','注射针','inject'],
  ['圈套捕获','圈套器覆盖病灶并带少量正常边缘，避免夹入过深组织。','assets/procedure/lesions/v7/emr_03_snare.jpg','乙状结肠腺瘤圈套','圈套器','snare'],
  ['切除并检查创面','完成切除后检查残留、出血和深层损伤征象，按风险选择夹闭。','assets/procedure/lesions/v8/emr_05_closure.jpg','EMR创面夹闭','止血夹','clip']]},
 APC:{name:'APC',full:'氩离子凝固术',source:'https://www.asge.org/docs/default-source/education/practice_guidelines/doc-b4349a10-9b72-463e-ac70-f394c7aa20b4.pdf',steps:[
  ['识别浅表血管病变','确认拟治疗区域与周围正常黏膜。','assets/procedure/lesions/v7/apc_01_before.jpg','GAVE治疗前','APC探头','scan'],
  ['分区非接触凝固','保持探头可控距离，按设备和本机构参数分区治疗。','assets/procedure/lesions/v7/apc_02_during.jpg','GAVE APC治疗中','APC探头','coag'],
  ['观察治疗终点','复查凝固范围、活动性出血及深部热损伤风险。','assets/procedure/lesions/v7/apc_03_after.jpg','GAVE APC治疗后','APC探头','inspect']]},
 EVL:{name:'EVL',full:'食管静脉曲张套扎术',source:'https://www.asge.org/home/resources/publications/journal-scan/issue/top-recommendations-for-the-diagnosis-and-management-of-esophagogastric-variceal-bleeding',steps:[
  ['识别目标静脉柱','稳定视野并选择拟套扎的曲张静脉。','assets/procedure/real/evl_01.png','食管静脉曲张','套扎器','scan'],
  ['对准并吸入套扎帽','将目标置于帽中心，充分吸引后再准备释放皮圈。','assets/procedure/real/evl_02.png','曲张静脉吸入套扎帽','套扎器','band'],
  ['释放皮圈','保持位置稳定后释放，形成套扎结节。','assets/procedure/real/evl_03.png','食管静脉曲张套扎','套扎器','band'],
  ['复查套扎效果','确认套扎位置与即时止血效果，再按计划处理其他目标。','assets/procedure/real/evl_04.png','EVL套扎后','套扎器','inspect']]},
 POEM:{name:'POEM',full:'经口内镜下肌切开术',source:'https://www.asge.org/home/resources/publications/guidelines/asge-guideline-on-the-management-of-achalasia',steps:[
  ['入口区注射','规划黏膜入口并注射形成抬举。','assets/procedure/real_v13/poem_02_injection.jpg','POEM入口区注射','注射针','inject'],
  ['黏膜切开','在抬举区建立黏膜入口。','assets/procedure/real_v13/poem_03_incision.jpg','POEM黏膜切开','隧道刀','cut'],
  ['建立黏膜下隧道','在黏膜下层推进，持续辨认方向与黏膜完整性。','assets/procedure/real_v13/poem_04_tunnel.jpg','POEM黏膜下隧道','隧道刀','tunnel'],
  ['完成肌切开','在隧道内完成计划长度的肌切开并跨越EGJ。','assets/procedure/real_v13/poem_07_myotomy2.jpg','POEM肌切开','隧道刀','cut'],
  ['关闭黏膜入口','确认止血后用夹子完整关闭入口。','assets/procedure/real_v13/poem_08_closure.jpg','POEM入口夹闭','止血夹','clip']]},
 ERCP:{name:'ERCP',full:'内镜逆行胰胆管造影取石',source:'https://www.asge.org/docs/default-source/importfiles/Education/Training_and_Core_Curriculum/doc-ercp_core_curriculum.pdf',steps:[
  ['获得稳定乳头视野','调整镜身和乳头方向，避免在视野不稳时盲目插管。','assets/procedure/real/ercp_01.png','十二指肠大乳头','导丝','scan'],
  ['导丝选择性胆管插管','在透视和内镜监测下建立目标胆管通路。','assets/procedure/real/ercp_02.png','ERCP导丝插管','导丝','wire'],
  ['按指征处理乳头','根据结石和解剖选择切开或扩张策略。','assets/procedure/real/ercp_03.png','ERCP乳头处理','乳头切开刀','cut'],
  ['取石与终末清扫','用球囊或网篮取石，复查胆管清除情况。','assets/procedure/real/ercp_04.png','ERCP取石后胆管','取石球囊','extract']]},
 ERAT:{name:'ERAT',full:'内镜逆行阑尾炎治疗',source:'https://pmc.ncbi.nlm.nih.gov/articles/PMC9329065/',steps:[
  ['识别阑尾开口','在盲肠辨认阑尾开口及周围炎症改变。','assets/procedure/real_v12/erat_01.jpg','阑尾开口','导丝','scan'],
  ['导丝引导插管','在影像引导下建立阑尾腔通路。','assets/procedure/real_v12/erat_02.jpg','ERAT导丝插管','导丝','wire'],
  ['造影评估阑尾腔','观察管腔形态、狭窄、充盈缺损及外漏。','assets/procedure/real_v12/erat_03.jpg','阑尾腔造影','导丝','inspect'],
  ['冲洗减压并处理梗阻','吸引、冲洗脓液或粪石；仅在适应证和专科条件下实施。','assets/procedure/real_v12/erat_04.jpg','ERAT冲洗减压','冲洗导管','flush'],
  ['确认通畅或引流','复查通畅度，按选择性适应证决定是否置入引流支架。','assets/procedure/real_v12/erat_06.jpg','ERAT引流完成','导丝','inspect']]},
 FNA:{name:'EUS-FNA',full:'超声内镜引导细针穿刺抽吸',source:'https://www.asge.org/home/resources/publications/guidelines/american-society-for-gastrointestinal-endoscopy-guideline-on-the-role-of-endoscopy-in-the-diagnosis-and-management-of-solid-pancreatic-masses--summary-and-recommendations',steps:[
  ['确认病灶并用Doppler避血管','先扫查靶病灶，再确认穿刺路径无介入血管。','assets/procedure/real_v12/fna_01_eus.jpg','EUS下胰腺肿块','FNA穿刺针','scan'],
  ['保持针尖可见并进针','在实时超声监测下将针尖推进靶病灶。','assets/procedure/real_v12/fna_01_eus.jpg','EUS-FNA穿刺','FNA穿刺针','needle'],
  ['完成取材与标本处理','按方案完成取材，退出针具并规范处理细胞学标本。','assets/procedure/real_v12/fna_02_sample.jpg','EUS-FNA细胞学标本','FNA穿刺针','inspect']]},
 FNB:{name:'EUS-FNB',full:'超声内镜引导细针组织活检',source:'https://www.asge.org/home/resources/publications/guidelines/american-society-for-gastrointestinal-endoscopy-guideline-on-the-role-of-endoscopy-in-the-diagnosis-and-management-of-solid-pancreatic-masses--summary-and-recommendations',steps:[
  ['确认病灶并用Doppler避血管','先扫查病灶，设计无介入血管的安全针路。','assets/procedure/real_v12/fnb_01_eus.jpg','EUS下胰腺肿块','FNB穿刺针','scan'],
  ['保持针尖可见并扇形取材','针尖始终在超声视野内，在病灶不同区域完成组织获取。','assets/procedure/real_v12/fnb_01_eus.jpg','EUS-FNB穿刺','FNB穿刺针','needle'],
  ['标本处理认知','FNB旨在获取组织学标本；当前展示共享FNA细胞学图，不是FNB组织柱。具体取材与处理需按导师和病理科流程。','assets/procedure/real_v12/fnb_02_sample.jpg','共享FNA细胞学示例（非FNB组织柱）','FNB穿刺针','inspect']]},
 CLIP:{name:'止血夹',full:'Dieulafoy病变机械止血认知',source:'https://www.asge.org/docs/default-source/education/practice_guidelines/doc-b4349a10-9b72-463e-ac70-f394c7aa20b4.pdf',steps:[
  ['识别并清楚暴露目标','冲洗恢复视野，确认裸露血管或活动性出血点。','assets/procedure/real_v13/clip_01.jpg','Dieulafoy病变裸露血管','止血夹','scan'],
  ['打开并旋转止血夹','在靠近目标后打开夹臂，调整方向使其跨越血管及两侧组织。','assets/procedure/real_v13/clip_01.jpg','止血夹对准裸露血管','止血夹','clip'],
  ['夹闭并释放','确认夹臂位置后闭合、检查抓持，再释放止血夹。','assets/procedure/real_v13/clip_02.jpg','止血夹夹闭后','止血夹','clip'],
  ['复查止血效果','冲洗复查无活动性出血，并确认夹子位置稳定。','assets/procedure/real_v13/clip_03.jpg','止血夹治疗后图像（非即时止血验证）','止血夹','inspect']]}
};

let tutorialState=null,tutorialTimer=null;const learned={};
const baseLaunchV9=window.launchV9;
function stopTutorial(){if(tutorialTimer){clearInterval(tutorialTimer);tutorialTimer=null}}
function tutorialStepObject(tuple){return {title:tuple[0],text:tuple[1],img:tuple[2],label:tuple[3],tool:tuple[4],motion:tuple[5]}}
function renderTutorial(){learned[tutorialState.id]=learned[tutorialState.id]||new Set();learned[tutorialState.id].add(tutorialState.index);
 const t=TUTORIALS[tutorialState.id],s=tutorialStepObject(t.steps[tutorialState.index]),pct=Math.round((tutorialState.index+1)/t.steps.length*100),tool=TOOL_IMAGES[s.tool];
 $('#main').innerHTML=head(`${t.name} · 动画教学`,t.full,`流程认知 ${tutorialState.index+1}/${t.steps.length}`)+`<div class="tutorial-layout"><section class="tutorial-screen"><div class="tutorial-progress"><i style="width:${pct}%"></i></div><figure class="tutorial-stage motion-${s.motion}"><img class="tutorial-background" src="${s.img}" alt="${esc(s.label)}"><div class="tutorial-focus"></div>${tool?`<img class="tutorial-instrument" src="${tool}" alt="${esc(s.tool)}">`:'<span class="tutorial-probe"></span>'}<figcaption>${esc(s.label)}</figcaption></figure></section><aside class="card tutorial-copy"><span class="v20-badge">步骤 ${tutorialState.index+1}</span><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p><div class="tutorial-tool-name">${esc(s.tool)}</div><ol class="tutorial-index">${t.steps.map((x,i)=>`<li class="${i===tutorialState.index?'active':i<tutorialState.index?'done':''}" onclick="tutorialGo(${i})"><span>${i+1}</span>${esc(x[0])}</li>`).join('')}</ol><div class="tutorial-controls"><button class="btn ghost" onclick="tutorialPrevious()" ${tutorialState.index===0?'disabled':''}>← 上一步</button><button class="btn" onclick="tutorialNext()">${tutorialState.index===t.steps.length-1?'从头复习':'下一步 →'}</button></div><button class="btn tutorial-practice" ${learned[tutorialState.id].size<t.steps.length?'disabled':''} onclick="beginV23Practice('${tutorialState.id}')">${learned[tutorialState.id].size<t.steps.length?'请先浏览全部步骤':'进入流程认知模拟'}</button><p class="mini">已浏览 ${learned[tutorialState.id].size}/${t.steps.length} 步。浏览不代表掌握；请在模拟后复盘。</p><a class="tutorial-source" href="${t.source}" target="_blank" rel="noopener">教学依据 / 原始资料</a></aside></div><div class="v20-disclaimer"><b>教学边界：</b>动画用于建立步骤顺序、器械选择和风险意识，不代表独立操作资质；真实操作必须在合格导师监督、机构流程和适当设备条件下完成。</div>`;
 patchImages(document);
}
function openProcedureTutorial(id){if(!TUTORIALS[id])return baseLaunchV9&&baseLaunchV9(id);stopTutorial();tutorialState={id,index:0};renderTutorial()}
function tutorialGo(i){if(!tutorialState)return;tutorialState.index=Math.max(0,Math.min(TUTORIALS[tutorialState.id].steps.length-1,i));renderTutorial()}
function tutorialPrevious(){tutorialGo((tutorialState?.index||0)-1)}
function tutorialNext(){if(!tutorialState)return;tutorialGo((tutorialState.index+1)%TUTORIALS[tutorialState.id].steps.length)}
function beginV23Practice(id){if(!TUTORIALS[id]||!learned[id]||learned[id].size<TUTORIALS[id].steps.length)return;stopTutorial();if(window.beginModule24)beginModule24('simulation',id);tutorialState=null;if(baseLaunchV9)baseLaunchV9(id)}
window.launchV9=openProcedureTutorial;
Object.assign(window,{openProcedureTutorial,tutorialGo,tutorialPrevious,tutorialNext,beginV23Practice});

const baseProcedures=window.procedures;
window.procedures=function(){
 stopTutorial();tutorialState=null;baseProcedures();
 const grid=document.querySelector('.procedure-grid');if(!grid)return;
 const pageTitle=document.querySelector('#main .top h1');if(pageTitle)pageTitle.textContent='内镜认知训练营';
 const pageSubtitle=document.querySelector('#main .top p');if(pageSubtitle)pageSubtitle.textContent='动画教学 · 真实阶段图 · 器械操作 · 风险处置 · 流程认知模拟';
 const intro=document.createElement('section');intro.className='card tutorial-intro';intro.innerHTML='<div><span class="pill">V24.0 · 先学后练</span><h2>先看动画教学，再进入流程认知模拟</h2><p>每个术式均按“看真实阶段图 → 观察器械运动 → 理解步骤与风险 → 再动手”的顺序训练。</p></div><span class="tutorial-count">10<br><small>套动画教程</small></span>';
 grid.before(intro);
 grid.querySelectorAll('.proc-card').forEach(card=>{const id=card.querySelector('h2')?.textContent.trim();if(!TUTORIALS[id])return;card.onclick=()=>openProcedureTutorial(id);const button=card.querySelector('button');if(button)button.textContent='先看动画教学 →'});
 patchImages(grid);
};

function filenameLabel(src=''){try{const f=decodeURIComponent(src.split('/').pop().split('?')[0]).replace(/[_-]+/g,' ').replace(/\.(png|jpe?g|webp|gif|svg)$/i,'').trim();return f||'医学教学图'}catch(e){return '医学教学图'}}
function safeLabel(img){
 const tool=img.closest('[data-tool]')?.getAttribute('data-tool');if(tool)return tool;
 const current=String(img.alt||'').trim();if(current&&!/^(image|图片|图像|photo)$/i.test(current))return current;
 const card=img.closest('.v16card,.v19card,.toollab-card,.v13atlas-card,.v15card,.v17card');const heading=card?.querySelector('h3,.name')?.textContent?.trim();
 return heading||filenameLabel(img.getAttribute('src')||'');
}
function placeholder(label){
 const text=String(label||'医学教学图').replace(/[<>&"']/g,'').slice(0,30);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600"><rect width="100%" height="100%" fill="#101828"/><circle cx="480" cy="245" r="115" fill="#7f1d1d" opacity=".55"/><path d="M360 245h240M480 125v240" stroke="#fca5a5" stroke-width="12" opacity=".65"/><text x="480" y="430" fill="white" font-size="38" text-anchor="middle" font-family="Arial,sans-serif">图片加载失败：${text}</text></svg>`;
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function patchImage(img){
 if(!(img instanceof HTMLImageElement))return;const label=safeLabel(img);img.alt=label;img.decoding='async';
 const tool=img.closest('[data-tool]')?.getAttribute('data-tool');
 if(img.dataset.v23Guard)return;img.dataset.v23Guard='1';
 img.addEventListener('error',()=>{if(img.dataset.v23Recovered)return;img.dataset.v23Recovered='1';img.dataset.giMissing='1';img.src=placeholder(label);img.alt='图片加载失败：'+label;img.closest('.imgbox,figure')?.classList.add('image-missing');if(window.onImageMissing24)onImageMissing24(img)},{once:true});
}
function patchImages(root=document){root.querySelectorAll?.('img').forEach(patchImage)}
// Capture image errors before legacy inline fallbacks can substitute an unrelated image.
document.addEventListener('error',e=>{const img=e.target;if(!(img instanceof HTMLImageElement)||img.dataset.v23Recovered)return;e.stopImmediatePropagation();img.dataset.v23Recovered='1';img.dataset.giMissing='1';const label=safeLabel(img);img.removeAttribute('onerror');img.src=placeholder(label);img.alt='图片加载失败：'+label;if(window.onImageMissing24)onImageMissing24(img)},true);
let imageSyncPending=false;
const imageObserver=new MutationObserver(()=>{if(imageSyncPending)return;imageSyncPending=true;requestAnimationFrame(()=>{imageSyncPending=false;patchImages(document);syncV23()})});
imageObserver.observe(document.documentElement,{subtree:true,childList:true});patchImages(document);

function syncV23(){
 document.title='GI Resident AI V24.0 · 住培辅助教学';
 document.querySelectorAll('.logo').forEach(x=>{const n=[...x.childNodes].find(y=>y.nodeType===Node.TEXT_NODE&&y.textContent.trim());if(n&&n.textContent!=='GI Resident AI')n.textContent='GI Resident AI'});
 document.querySelectorAll('.logo b,.logo strong').forEach(x=>{if(x.textContent!=='GI Resident AI')x.textContent='GI Resident AI'});
 document.querySelectorAll('.logo small').forEach(x=>{if(x.textContent!=='住培辅助教学 · V24.0')x.textContent='住培辅助教学 · V24.0'});
 document.querySelectorAll('.login .pill,.account-brand .pill').forEach(x=>{if(x.textContent!=='GI RESIDENT AI · V24.0')x.textContent='GI RESIDENT AI · V24.0'});
 const brand=document.querySelector('.account-brand strong');if(brand&&brand.textContent!=='GI Resident AI')brand.textContent='GI Resident AI';
}
syncV23();window.addEventListener('load',()=>setTimeout(()=>{syncV23();patchImages(document)},0));

// Keep the source list visible inside the existing reference page.
if(Array.isArray(window.GI_PROCEDURE_REFS))[
 ['ASGE ESD guideline (2023)',TUTORIALS.ESD.source],['US Multi-Society colorectal lesion removal guideline',TUTORIALS.EMR.source],
 ['ASGE ERCP core curriculum',TUTORIALS.ERCP.source],['ASGE achalasia / POEM guideline',TUTORIALS.POEM.source],
 ['ASGE EUS tissue acquisition guideline (2024)',TUTORIALS.FNA.source],['ERAT comparative study (open access)',TUTORIALS.ERAT.source]
].forEach(([title,url])=>{if(!GI_PROCEDURE_REFS.some(x=>x.url===url))GI_PROCEDURE_REFS.push({title,url})});

window.GI_V23_TUTORIALS=TUTORIALS;
})();
