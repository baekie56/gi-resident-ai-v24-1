(function(){
const A='assets/procedure/';
const R=A+'real_v13/';
const REAL13={
 POEM:{
  title:'POEM · 同一病例真实连续8帧',
  source:'World Journal of Gastroenterology 2015开放获取病例图（CC BY-NC 4.0）：A-H依次展示术前、黏膜下注射、入口切开、黏膜下隧道、预设隧道路线上色、肌切开、进一步肌切开、夹闭入口。',
  sourceUrl:'https://www.wjgnet.com/1007-9327/full/v21/i30/WJG-21-9175-g001.htm',
  tools:['注射针','DualKnife','止血夹'],
  steps:[
   {title:'术前定位',img:R+'poem_01_before.jpg',next:R+'poem_02_injection.jpg',tool:'注射针',zone:[52,47,28,24],task:'把真实“注射针”拖到计划入口区，完成黏膜下注射。',note:'成功后切换到同一病例真实“黏膜下注射形成隆起”画面。'},
   {title:'入口切开',img:R+'poem_02_injection.jpg',next:R+'poem_03_incision.jpg',tool:'DualKnife',zone:[54,52,26,26],task:'把真实 DualKnife 拖到隆起中央/入口区域，完成纵向黏膜切开。',note:'成功后切换到同一病例真实“纵向黏膜切开”画面。'},
   {title:'建立黏膜下隧道',img:R+'poem_03_incision.jpg',next:R+'poem_04_tunnel.jpg',tool:'DualKnife',zone:[52,54,34,36],task:'从入口切开处进入，用刀沿黏膜下层向远端建立隧道。',note:'成功后切换到真实黏膜下隧道画面。'},
   {title:'确认隧道跨越EGJ',img:R+'poem_04_tunnel.jpg',next:R+'poem_05_route.jpg',tool:'注射针',zone:[51,54,36,34],task:'把注射针拖到隧道远端/胃侧区域，模拟染色确认隧道走向。',note:'成功后切换到同一病例真实“预设/确认隧道路线上色”画面。'},
   {title:'开始肌切开',img:R+'poem_05_route.jpg',next:R+'poem_06_myotomy1.jpg',tool:'DualKnife',zone:[56,56,30,34],task:'把刀拖到暴露的内环肌区域，开始肌切开。',note:'成功后切换到真实肌切开进行中画面。'},
   {title:'完成充分肌切开',img:R+'poem_06_myotomy1.jpg',next:R+'poem_07_myotomy2.jpg',tool:'DualKnife',zone:[53,52,36,40],task:'继续沿肌层切开到目标长度，避免误伤黏膜。',note:'成功后显示更完整的肌切开层面。'},
   {title:'夹闭黏膜入口',img:R+'poem_07_myotomy2.jpg',next:R+'poem_08_closure.jpg',tool:'止血夹',zone:[52,48,42,28],task:'把真实止血夹拖到黏膜入口裂口两侧，完成入口关闭。',note:'成功后切换到同一病例真实“多枚夹子关闭黏膜入口”画面。'}
 ]},
 CLIP:{
  title:'止血夹 · Dieulafoy病变真实前后图',
  source:'World Journal of Gastroenterology 2009开放获取病例图：同一Dieulafoy病变夹闭前、夹闭后及3个月随访。',
  sourceUrl:'https://www.wjgnet.com/1007-9327/full/v15/i34/4322.htm',
  tools:['止血夹'],
  steps:[
   {title:'识别并对准暴露血管',img:R+'clip_01.jpg',next:R+'clip_02.jpg',tool:'止血夹',zone:[54,59,24,24],task:'把真实止血夹拖到中央突出的Dieulafoy血管处，模拟对准并释放。',note:'下一帧为同一患者真实夹闭后画面。'},
   {title:'确认夹闭效果',img:R+'clip_02.jpg',next:R+'clip_03.jpg',tool:'止血夹',zone:[55,48,34,30],task:'再次把止血夹拖到夹闭区域，模拟检查夹闭牢固与无活动性出血。',note:'完成后切换到同一患者3个月随访画面。'}
 ]}
};
const REAL_TOOL={
 '注射针':'assets/procedure/tools/注射针_display.png',
 'DualKnife':'assets/procedure/tools/DualKnife_display.png',
 '止血夹':'assets/procedure/tools/止血夹_display.png',
 '套扎器':'assets/procedure/tools/套扎器_display.png',
 '圈套器':'assets/procedure/tools/圈套器_display.png',
 '导丝':'assets/procedure/tools/导丝_display.png',
 'FNA穿刺针':'assets/procedure/tools/FNA穿刺针_display.png',
 'FNB穿刺针':'assets/procedure/tools/FNB穿刺针_display.png',
 '取石球囊':'assets/procedure/tools/取石球囊_display.png',
 'Coagrasper':'assets/procedure/tools/Coagrasper_display.png',
 'APC探头':'assets/procedure/tools/APC探头_display.png',
 '隧道刀':'assets/procedure/tools/隧道刀_display.png'
};
let S=null;
function pstat(id){const p=window.prof&&prof();if(!p)return {best:0,runs:0};p.procedures=p.procedures||{};return p.procedures['v13_'+id]||{best:0,runs:0};}
function saveStat(id,pct){if(window.finishModule24)finishModule24('simulation',id+' 流程认知',pct);const p=window.prof&&prof();if(!p)return;p.procedures=p.procedures||{};const s=p.procedures['v13_'+id]||{best:0,runs:0};s.best=Math.max(s.best||0,pct);s.latest=pct;s.runs=(s.runs||0)+1;s.last=new Date().toISOString();p.procedures['v13_'+id]=s;p.xp=(p.xp||0)+Math.max(8,Math.round(pct/10));if(window.save)save();}
function toolCard(t){const src=REAL_TOOL[t]||'assets/procedure/tools/圈套器_display.png';return `<div class="v13tool" draggable="true" data-tool="${t}" onclick="v13Pick('${t}')"><img src="${src}" onerror="this.src='assets/procedure/tools/止血夹_display.png'" alt="${t}"><div><b>${t}</b></div></div>`}
window.v13Pick=function(t){S.selected=t;document.querySelectorAll('.v13tool').forEach(x=>x.classList.toggle('active',x.dataset.tool===t));};
window.v13Allow=e=>e.preventDefault();
window.v13Drop=function(e){e.preventDefault();const t=(e.dataTransfer&&e.dataTransfer.getData('text/plain'))||S.selected;attempt(t)};
window.v13Tap=function(){if(S.selected)attempt(S.selected)};
function attempt(t){const d=REAL13[S.id],st=d.steps[S.i],f=$('#v13fb');if(S.busy24||!f)return;if(window.simulationEvent24)simulationEvent24(S.i,t,t===st.tool,st.note);if(t!==st.tool){S.lives--;f.className='feedback mid';f.innerHTML=`<b>器械不对</b><br>当前步骤应使用：${st.tool}`;if(S.lives<=0)finish(false);return;}S.busy24=true;S.ok++;f.className='feedback good';f.innerHTML=`<b>✓ 操作正确</b><br>${st.note}`;const im=$('#v13img');im.classList.add('fade');setTimeout(()=>{im.src=st.next;im.onload=()=>im.classList.remove('fade')},160);setTimeout(()=>{if(!$('#v13fb'))return;S.busy24=false;S.i++;S.selected=null;if(S.i>=d.steps.length)finish(true);else render();},780)}
function finish(win){const d=REAL13[S.id],pct=Math.round(S.ok/d.steps.length*100);saveStat(S.id,pct);$('#main').innerHTML=head(`${d.title} · ${win?'完成':'失败'}`,d.source,'V13 REAL-SEQUENCE COMPLETE')+`<div class="grid g3">${metric('本轮成绩',pct+'%',`${S.ok}/${d.steps.length}`)}${metric('最近一次',pstat(S.id).latest+'%')}${metric('完成轮次',pstat(S.id).runs,'次')}</div><div class="card" style="margin-top:16px"><h2>${win?'真实连续图流程完成':'建议重新训练'}</h2><p>${d.source}</p><div class="row"><button class="btn" onclick="launchV9('${S.id}')">再练一轮</button><button class="btn ghost" onclick="procedures()">返回训练营</button></div></div>`}
function render(){const d=REAL13[S.id],st=d.steps[S.i];$('#main').innerHTML=head(d.title,st.task,`REAL CASE ${S.i+1}/${d.steps.length}`)+`<div class="notice"><b>同一病例连续图：</b>${d.source} <a href="${d.sourceUrl}" target="_blank" rel="noopener">原始来源</a></div><div class="v13layout"><section class="v13monitor"><img id="v13img" src="${st.img}"><div class="v13zone" style="left:${st.zone[0]-st.zone[2]/2}%;top:${st.zone[1]-st.zone[3]/2}%;width:${st.zone[2]}%;height:${st.zone[3]}%" ondragover="v13Allow(event)" ondrop="v13Drop(event)" onclick="v13Tap()"></div><div class="v13hud">STEP ${S.i+1}/${d.steps.length} · LIFE ${'♥'.repeat(S.lives)}${'♡'.repeat(3-S.lives)}</div></section><aside class="v13tray"><h3>真实器械托盘</h3><p>拖真实器械照片到目标区</p>${d.tools.map(toolCard).join('')}<div id="v13fb" class="feedback mid"><b>任务</b><br>${st.task}</div></aside></div>`;document.querySelectorAll('.v13tool').forEach(el=>el.addEventListener('dragstart',e=>{S.selected=el.dataset.tool;e.dataTransfer.setData('text/plain',el.dataset.tool)}));}
window.launchV13=function(id){S={id,i:0,ok:0,lives:3,selected:null};render();};
const oldLaunch=window.launchV9;
if(oldLaunch){window.launchV9=function(id){if(REAL13[id])return launchV13(id);return oldLaunch(id)}}
const oldProc=window.procedures;
if(oldProc){window.procedures=function(){oldProc();const m=document.querySelector('#main');if(!m)return;const n=document.createElement('div');n.className='notice v13status';n.innerHTML='<b>v13真实化进度：</b> POEM 已升级为同一病例 A-H 真实连续8帧；止血夹已升级为同一Dieulafoy病变真实夹闭前/后/随访图；ERAT、EUS-FNA/FNB沿用v12真实图；ERCP、EVL沿用v11真实图；ESD/EMR/APC继续保留真实阶段图。';const first=m.querySelector('.procedure-grid');if(first)first.before(n);}}
// upgrade tool atlas with real tool photos
window.openToolAtlas=function(){
 const tools=[
  ['注射针','黏膜下注射 / 抬举'],['DualKnife','ESD切开与剥离 / POEM切开'],['止血夹','夹闭止血 / 关闭创面'],['套扎器','EVL静脉曲张套扎'],['圈套器','EMR / 息肉切除'],['导丝','ERCP / ERAT'],['取石球囊','ERCP取石'],['FNA穿刺针','EUS-FNA'],['FNB穿刺针','EUS-FNB'],['Coagrasper','ESD止血'],['APC探头','APC凝固']
 ];
 $('#main').innerHTML=head('器械图库 v13','优先展示真实器械/产品照片，不再用示意图占位。','REAL TOOL ATLAS')+`<div class="notice"><b>v13：</b>已替换真实止血夹、DualKnife、注射针、套扎器等器械图；其余保留可用真实照片。器械图用于教学识别，不代表采购或品牌推荐。</div><div class="v13atlas">${tools.map(([t,u])=>`<div class="v13atlas-card"><img src="${REAL_TOOL[t]||'assets/procedure/tools/圈套器_display.png'}" onerror="this.src='assets/procedure/tools/止血夹_display.png'" alt="${t}"><div><h3>${t}</h3><p>${u}</p></div></div>`).join('')}</div><div class="row" style="margin-top:16px"><button class="btn ghost" onclick="procedures()">返回术式页</button></div>`;
};
const css=document.createElement('style');css.textContent=`
.v13layout{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:16px}.v13monitor{position:relative;background:#071018;border-radius:22px;overflow:hidden;min-height:520px}.v13monitor>img{width:100%;height:100%;max-height:640px;object-fit:contain;display:block;transition:opacity .18s}.v13monitor>img.fade{opacity:.12}.v13zone{position:absolute;border:3px dashed #fbbf24;background:#fbbf2425;border-radius:18px;cursor:pointer;box-shadow:0 0 26px #fbbf2466}.v13hud{position:absolute;top:12px;left:12px;background:#000c;color:#fff;padding:7px 10px;border-radius:8px;font:800 11px ui-monospace,monospace}.v13tray{background:#fff;border:1px solid #e4e7ec;border-radius:18px;padding:14px}.v13tool{display:grid;grid-template-columns:104px 1fr;gap:10px;align-items:center;border:2px solid #e4e7ec;border-radius:14px;padding:8px;margin:9px 0;background:#f8fafc;cursor:grab}.v13tool.active{border-color:#2e90fa;box-shadow:0 0 0 3px #2e90fa22}.v13tool img{width:104px;height:82px;object-fit:contain;background:#fff;border-radius:10px}.v13tool small{display:block;color:#667085;margin-top:3px}.v13status{margin:14px 0}.v13atlas{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.v13atlas-card{display:grid;grid-template-columns:150px 1fr;gap:16px;background:#fff;border:1px solid #e4e7ec;border-radius:18px;padding:14px;align-items:center}.v13atlas-card img{width:150px;height:112px;object-fit:contain;background:#fff;border:1px solid #eef2f6;border-radius:12px}.v13atlas-card h3{margin:0 0 6px}.v13atlas-card p{margin:0 0 8px;color:#667085}.v13atlas-card span{font-size:11px;color:#067647;background:#ecfdf3;padding:5px 8px;border-radius:999px}@media(max-width:900px){.v13layout{grid-template-columns:1fr}.v13monitor{min-height:380px}.v13atlas{grid-template-columns:1fr}.v13atlas-card{grid-template-columns:110px 1fr}.v13atlas-card img{width:110px;height:84px}}
`;document.head.appendChild(css);
try{document.title='GI Resident AI V24.0 · 住培辅助教学';}catch(e){}
})();
