(function(){
const A='assets/procedure/';
const V7=A+'lesions/v7/';
const V8=A+'lesions/v8/';
const TOOL={
 '注射针':'assets/procedure/tools/注射针_display.png',
 'DualKnife':'assets/procedure/tools/DualKnife_display.png',
 'Coagrasper':'assets/procedure/tools/Coagrasper_display.png',
 '圈套器':'assets/procedure/tools/圈套器_display.png',
 'APC探头':'assets/procedure/tools/APC探头_display.png',
 '止血夹':'assets/procedure/tools/止血夹_display.png',
 '套扎器':'assets/procedure/tools/套扎器_display.png',
 'FNA穿刺针':'assets/procedure/tools/FNA穿刺针_display.png',
 'FNB穿刺针':'assets/procedure/tools/FNB穿刺针_display.png',
 '乳头切开刀':'assets/procedure/tools/乳头切开刀_display.png',
 '导丝':'assets/procedure/tools/导丝_display.png',
 '取石球囊':'assets/procedure/tools/取石球囊_display.png',
 '隧道刀':'assets/procedure/tools/隧道刀_display.png',
 '冲洗导管':'assets/procedure/tools/冲洗导管_display.png'
};
const TOOL_INFO=[
 ['注射针','黏膜下注射、病灶抬举'],['DualKnife','ESD / POEM 切开与剥离'],['Coagrasper','术中止血'],['圈套器','EMR 套圈与切除'],['APC探头','APC热凝'],['止血夹','创面夹闭'],['套扎器','EVL套扎'],['导丝','ERCP / ERAT 建立通道'],['乳头切开刀','ERCP乳头切开'],['取石球囊','ERCP取石'],['FNA穿刺针','EUS-FNA'],['FNB穿刺针','EUS-FNB'],['隧道刀','POEM隧道与肌切开'],['冲洗导管','ERAT/ERCP 冲洗辅助']
];
function toolPath(name){ return TOOL[name] || 'assets/procedure/tools/止血夹_display.png'; }
function patchToolImages(){ document.querySelectorAll('[data-tool]').forEach(el=>{if(el.classList.contains('v19card')) return; const name=el.getAttribute('data-tool'); const img=el.querySelector('img'); if(img && TOOL[name]){ img.src=TOOL[name]; img.onerror=null; }}); }
const mo=new MutationObserver(()=>patchToolImages()); mo.observe(document.documentElement,{subtree:true,childList:true}); setTimeout(patchToolImages,300);

window.openToolAtlas=function(){
  $('#main').innerHTML=head('器械图库 v16','统一校对器械图片映射，并新增“器械校对表”。','TOOL ATLAS v16')+
  `<div class="notice"><b>v16 重点：</b>继续修复“名称和图片不对应”的问题。现在每个器械都走统一映射，另外增加器械校对表，方便逐个核对。</div>
   <div class="v16atlas">${TOOL_INFO.map(([n,u])=>`<div class="v16card"><img src="${toolPath(n)}" alt="${n}"><div><h3>${n}</h3><p>${u}</p></div></div>`).join('')}</div>
   <div class="row" style="margin-top:16px"><button class="btn" onclick="openToolAudit()">打开器械校对表</button><button class="btn ghost" onclick="procedures()">返回术式页</button></div>`;
};
window.openToolAudit=function(){
  $('#main').innerHTML=head('器械校对表','逐个核对器械名称与图片文件。','TOOL AUDIT v16')+
  `<div class="notice"><b>说明：</b>这个页面用于带教或继续优化时快速核查每个器械的图片路径、名称和用途是否一致。</div>
  <table class="audit"><thead><tr><th>器械</th><th>图片</th><th>用途</th><th>路径</th></tr></thead><tbody>${TOOL_INFO.map(([n,u])=>`<tr><td>${n}</td><td><img src="${toolPath(n)}" alt="${n}"></td><td>${u}</td><td class="path">${toolPath(n)}</td></tr>`).join('')}</tbody></table>
  <div class="row" style="margin-top:16px"><button class="btn ghost" onclick="openToolAtlas()">返回器械图库</button></div>`;
};

const PROCS={
 ESD:{
  title:'ESD · v16 精修版',
  summary:'在 v15 基础上继续修正病灶标记与环周切开对应关系，加入单独的“沿标记划圈”步骤。',
  tools:['DualKnife','注射针','Coagrasper'],
  steps:[
   {kind:'path',title:'沿病灶外周标记点划圈',img:V7+'esd_01_marking.jpg',next:V7+'esd_02_lift.jpg',tool:'DualKnife',task:'按蓝色标记点顺时针完成环周划圈，路径要贴着病灶外周标记。',checkpoints:[[20,52],[31,34],[50,25],[71,29],[83,46],[80,67],[61,76],[40,75],[24,64]],radius:8},
   {kind:'tap',title:'黏膜下注射抬举',img:V7+'esd_02_lift.jpg',next:V7+'esd_02_lift.jpg',tool:'注射针',task:'在病灶基底较低处注射，完成充分抬举。',zone:[56,61,20,18]},
   {kind:'path',title:'沿病灶边缘环周切开',img:V7+'esd_02_lift.jpg',next:V7+'esd_03_incision.jpg',tool:'DualKnife',task:'沿病灶边缘切开，不要切到中央。',checkpoints:[[37,49],[49,34],[63,36],[71,49],[61,67],[44,63]],radius:8},
   {kind:'drag',title:'建立黏膜瓣',img:V7+'esd_03_incision.jpg',next:V7+'esd_04_flap.jpg',tool:'DualKnife',task:'从下缘切口向上拖动，建立黏膜瓣。',start:[53,71],end:[54,57],tol:11},
   {kind:'path',title:'沿黏膜下层剥离',img:V7+'esd_04_flap.jpg',next:V7+'esd_05_dissection.jpg',tool:'DualKnife',task:'沿暴露的黏膜下层连续剥离。',checkpoints:[[48,68],[57,61],[67,56]],radius:10},
   {kind:'tap',title:'处理术中出血',img:V7+'esd_05_bleeding_sim.jpg',next:V7+'esd_05_dissection.jpg',tool:'Coagrasper',task:'对准出血点凝止血。',zone:[63,60,17,17]},
   {kind:'path',title:'完成整块剥离',img:V7+'esd_05_dissection.jpg',next:V7+'esd_06_defect.jpg',tool:'DualKnife',task:'沿剩余附着面继续剥离，完成整块切除。',checkpoints:[[45,43],[56,40],[68,43]],radius:10}
  ]
 },
 EMR:{
  title:'EMR · v16 精修版',
  summary:'继续修正圈套目标区，分成“对准息肉头端”和“放大到刚好包住病灶”两步。',
  tools:['注射针','圈套器','止血夹'],
  steps:[
   {kind:'tap',title:'黏膜下注射',img:V7+'emr_01_lesion.jpg',next:V7+'emr_02_lift.jpg',tool:'注射针',task:'在息肉基底注射，形成良好抬举。',zone:[54,60,20,18]},
   {kind:'snarePlace',title:'套圈中心对准息肉头端',img:V7+'emr_02_lift.jpg',next:V7+'emr_02_lift.jpg',tool:'圈套器',task:'先点击息肉头端中央放置圈套中心。',center:[55,34],centerTol:7},
   {kind:'snareSize',title:'放大圈套，刚好包住息肉头端',img:V7+'emr_02_lift.jpg',next:V7+'emr_03_snare.jpg',tool:'圈套器',task:'拖动手柄放大圈套，大小要刚好覆盖息肉头端并带少量基底。',center:[55,34],centerTol:7,targetMin:12,targetMax:18},
   {kind:'drag',title:'收紧并切除',img:V7+'emr_03_snare.jpg',next:V7+'emr_04_defect.jpg',tool:'圈套器',task:'顺着器械方向向下轻拖，模拟收紧切除。',start:[61,72],end:[62,84],tol:10},
   {kind:'multiTap',title:'夹闭创面',img:V7+'emr_04_defect.jpg',next:V8+'emr_05_closure.jpg',tool:'止血夹',task:'依次夹闭创面两侧。',zones:[[54,47,16,16],[58,60,16,16]]}
  ]
 }
};
let S=null;
function stat(id){const p=window.prof&&prof(); if(!p) return {best:0,runs:0}; p.procedures=p.procedures||{}; return p.procedures['v16_'+id]||{best:0,runs:0};}
function saveStat(id,pct){if(window.finishModule24)finishModule24('simulation',id+' 流程认知',pct);const p=window.prof&&prof(); if(!p) return; p.procedures=p.procedures||{}; const s=p.procedures['v16_'+id]||{best:0,runs:0}; s.best=Math.max(s.best||0,pct);s.latest=pct; s.runs=(s.runs||0)+1; s.last=new Date().toISOString(); p.procedures['v16_'+id]=s; p.xp=(p.xp||0)+Math.max(10,Math.round(pct/8)); if(window.save) save();}
function cur(){ return PROCS[S.id].steps[S.i]; }
function pct(e,el){ const r=el.getBoundingClientRect(); return [(e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100]; }
function near(a,b,t){ return Math.hypot(a[0]-b[0],a[1]-b[1])<=t; }
function inZone(p,z){ return p[0]>=z[0]-z[2]/2 && p[0]<=z[0]+z[2]/2 && p[1]>=z[1]-z[3]/2 && p[1]<=z[1]+z[3]/2; }
function fb(type,html){ const x=$('#v16fb'); if(x){ x.className='feedback '+type; x.innerHTML=html; } }
function hud(){ const x=$('#v16hud'); if(x) x.textContent=`STEP ${S.i+1}/${PROCS[S.id].steps.length} · LIFE ${'♥'.repeat(S.lives)}${'♡'.repeat(3-S.lives)} · SCORE ${S.ok}`; }
function success(msg){if(S.busy24)return;S.busy24=true;if(window.simulationEvent24)simulationEvent24(S.i,S.selected,true,msg||"流程步骤完成");S.ok++; fb('good',`<b>✓ 正确</b><br>${msg||'进入下一步'}`); const step=cur(); const img=$('#v16img'); if(img){ img.classList.add('fade'); setTimeout(()=>{ img.src=step.next; img.onload=()=>img.classList.remove('fade'); },140);} setTimeout(()=>{if(!$('#v16fb'))return;S.busy24=false;S.i++; S.selected=null; S.path=[]; S.pathIndex=0; S.dragging=false; if(S.i>=PROCS[S.id].steps.length) finish(true); else render(); },700); }
function fail(msg){if(S.busy24)return;if(window.simulationEvent24)simulationEvent24(S.i,S.selected,false,msg);S.lives--; fb('mid',`<b>再试一次</b><br>${msg}`); hud(); if(S.lives<=0) finish(false); }
function finish(win){ const pct=Math.round(S.ok/PROCS[S.id].steps.length*100); saveStat(S.id,pct); const s=stat(S.id); $('#main').innerHTML=head(`${PROCS[S.id].title} · ${win?'完成':'失败'}`,PROCS[S.id].summary,'V16 COMPLETE')+`<div class="grid g3">${metric('本轮成绩',pct+'%',`${S.ok}/${PROCS[S.id].steps.length}`)}${metric('最近一次',s.latest+'%')}${metric('完成轮次',s.runs,'次')}</div><div class="card" style="margin-top:16px"><h2>${win?'v16 流程认知训练完成':'建议继续练一轮巩固精确落点'}</h2><p>${PROCS[S.id].summary}</p><div class="row"><button class="btn" onclick="launchV9('${S.id}')">再练一轮</button><button class="btn ghost" onclick="procedures()">返回训练营</button></div></div>`; }
function toolCard(t){ return `<div class="v16tool ${S.selected===t?'active':''}" draggable="true" data-tool="${t}"><img src="${toolPath(t)}" alt="${t}"><div><b>${t}</b></div></div>`; }
function renderOverlay(st){
  if(st.kind==='tap') return `<div class="v16zone" style="left:${st.zone[0]-st.zone[2]/2}%;top:${st.zone[1]-st.zone[3]/2}%;width:${st.zone[2]}%;height:${st.zone[3]}%"></div>`;
  if(st.kind==='multiTap'){ const z=st.zones[S.multi||0]; return `<div class="v16zone" style="left:${z[0]-z[2]/2}%;top:${z[1]-z[3]/2}%;width:${z[2]}%;height:${z[3]}%"></div>`; }
  if(st.kind==='path') return st.checkpoints.map((p,i)=>`<div class="v16dot" style="left:${p[0]-2}%;top:${p[1]-2}%"></div>`).join('')+`<svg id="v16svg" class="v16svg"></svg>`;
  if(st.kind==='drag') return `<div class="v16point start" style="left:${st.start[0]-2}%;top:${st.start[1]-2}%"></div><div class="v16point end" style="left:${st.end[0]-2}%;top:${st.end[1]-2}%"></div>`;
  if(st.kind==='snarePlace' || st.kind==='snareSize'){ const left=(S.snareCenter?S.snareCenter[0]:st.center[0]), top=(S.snareCenter?S.snareCenter[1]:st.center[1]); return `<div class="v16lesion" style="left:${st.center[0]-4}%;top:${st.center[1]-4}%"></div><div id="v16ring" class="v16ring ${S.snarePlaced?'show':''}" style="left:${left}%;top:${top}%;width:${(S.snareRadius||8)*2}%;height:${(S.snareRadius||8)*2}%"><span id="v16handle"></span></div>`; }
  return '';
}
function render(){ const st=cur(); $('#main').innerHTML=head(PROCS[S.id].title,PROCS[S.id].summary,`V16 ${S.id}`)+`<div class="notice"><b>v16 修正重点：</b>${S.id==='ESD'?'加入单独“沿标记划圈”步骤，并继续校正环周切开路径。':'把 EMR 套圈拆成“对准息肉头端”与“圈套大小合适”两步。'}</div><div class="v16layout"><section class="v16monitor"><img id="v16img" src="${st.img}" alt="${st.title}"><div id="v16ov" class="v16ov">${renderOverlay(st)}</div><div id="v16hud" class="v16hud"></div></section><aside class="v16side"><div class="v16task"><h3>${st.title}</h3><p>${st.task}</p></div><div class="v16tray">${PROCS[S.id].tools.map(toolCard).join('')}</div><div id="v16fb" class="feedback mid"><b>开始操作</b><br>先选器械，再在正确位置完成动作。</div><div class="row" style="margin-top:12px"><button class="btn ghost" onclick="procedures()">返回训练营</button></div></aside></div>`; bind(); hud(); drawPath(); }
function bind(){
  document.querySelectorAll('.v16tool').forEach(el=>{ el.onclick=()=>{ S.selected=el.dataset.tool; document.querySelectorAll('.v16tool').forEach(x=>x.classList.toggle('active',x.dataset.tool===S.selected)); }; el.addEventListener('dragstart',e=>{ S.selected=el.dataset.tool; e.dataTransfer.setData('text/plain',S.selected); }); });
  const ov=$('#v16ov'); const st=cur(); if(!ov) return;
  ov.addEventListener('dragover',e=>e.preventDefault());
  ov.addEventListener('drop',e=>{ e.preventDefault(); const t=e.dataTransfer.getData('text/plain'); if(t) S.selected=t; handlePoint(pct(e,ov)); });
  ov.addEventListener('click',e=>{ const step=cur(); if(step.kind==='path') return; if(step.kind==='snareSize') return; handlePoint(pct(e,ov)); });
  ov.addEventListener('pointerdown',e=>{ const p=pct(e,ov); const step=cur();
    if(step.kind==='path'){ if(S.selected!==step.tool) return fail('当前步骤应使用：'+step.tool); S.dragging=true; S.path=[p]; if(near(p,step.checkpoints[S.pathIndex],step.radius)){ S.pathIndex++; drawPath(); if(S.pathIndex>=step.checkpoints.length) success('路径正确，已完成该步骤。'); } }
    else if(step.kind==='drag'){ if(S.selected!==step.tool) return fail('当前步骤应使用：'+step.tool); if(!near(p,step.start,step.tol)) return fail('请从起点开始拖动。'); S.dragging=true; }
    else if(step.kind==='snareSize'){ if(S.selected!==step.tool) return fail('当前步骤应使用：'+step.tool); if(!S.snarePlaced){ S.snarePlaced=true; S.snareCenter=step.center; S.snareRadius=6; render(); return; } if(e.target.id==='v16handle') S.dragging='snare'; }
  });
  ov.addEventListener('pointermove',e=>{ const p=pct(e,ov); const step=cur();
    if(step.kind==='path' && S.dragging){ S.path.push(p); if(S.pathIndex<step.checkpoints.length && near(p,step.checkpoints[S.pathIndex],step.radius)){ S.pathIndex++; if(S.pathIndex>=step.checkpoints.length) return success('路径正确，已完成该步骤。'); } drawPath(); }
    else if(step.kind==='drag' && S.dragging){ if(near(p,step.end,step.tol)) success('拖动方向和落点正确。'); }
    else if(step.kind==='snareSize' && S.dragging==='snare'){ const c=S.snareCenter||step.center; S.snareRadius=Math.max(4,Math.min(24,Math.hypot(p[0]-c[0], p[1]-c[1]))); const ring=$('#v16ring'); if(ring){ ring.style.width=(S.snareRadius*2)+'%'; ring.style.height=(S.snareRadius*2)+'%'; ring.classList.add('show'); } if(near(c,step.center,step.centerTol) && S.snareRadius>=step.targetMin && S.snareRadius<=step.targetMax) success('圈套大小合适，已对准息肉头端。'); }
  });
  ['pointerup','pointerleave'].forEach(ev=>ov.addEventListener(ev,()=>{ S.dragging=false; }));
}
function handlePoint(p){ const st=cur(); if(!S.selected) return fail('请先选择器械。'); if(S.selected!==st.tool) return fail('当前步骤应使用：'+st.tool);
  if(st.kind==='tap'){ if(inZone(p,st.zone)) success('落点正确。'); else fail('落点没有对准目标区域。'); }
  else if(st.kind==='multiTap'){ const z=st.zones[S.multi||0]; if(inZone(p,z)){ S.multi=(S.multi||0)+1; if(S.multi>=st.zones.length) success('已完成创面夹闭。'); else { fb('good',`<b>✓ 第 ${S.multi} 个夹闭点完成</b><br>请继续夹闭另一侧。`); render(); S.multi=1; } } else fail('当前夹闭点不正确。'); }
  else if(st.kind==='snarePlace'){ if(near(p,st.center,st.centerTol)){ S.snarePlaced=true; S.snareCenter=st.center; S.snareRadius=6; success('圈套中心已对准息肉头端。'); } else fail('圈套中心没有对准息肉头端。'); }
}
function drawPath(){ const svg=$('#v16svg'); const st=cur(); if(!svg || st.kind!=='path') return; svg.setAttribute('viewBox','0 0 100 100'); const d=S.path&&S.path.length?`M ${S.path.map((p,i)=>`${i?'L':' '}${p[0]} ${p[1]}`).join(' ')}`:''; svg.innerHTML=(d?`<path d="${d}" stroke="#22c55e" stroke-width="1.2" fill="none" stroke-linecap="round"/>`:'' )+st.checkpoints.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="${i<S.pathIndex?2.3:1.9}" fill="${i<S.pathIndex?'#22c55e':'#fbbf24'}" stroke="#111827" stroke-width="0.4"/>`).join(''); }
window.launchV16=function(id){ S={id,i:0,ok:0,lives:3,selected:null,path:[],pathIndex:0,snarePlaced:false,snareCenter:null,snareRadius:8,multi:0,dragging:false}; render(); };
const oldLaunch=window.launchV9; if(oldLaunch){ window.launchV9=function(id){ if(PROCS[id]) return launchV16(id); return oldLaunch(id); }; }
const oldProc=window.procedures; if(oldProc){ window.procedures=function(){ oldProc(); const target=document.querySelector('.procedure-grid'); if(target){ const note=document.createElement('div'); note.className='notice'; note.style.margin='12px 0 16px'; note.innerHTML='<b>v16：</b>继续精修 ESD 与 EMR。ESD 新增“沿标记划圈”步骤，EMR 把“对准息肉头端”和“圈套大小合适”拆成两步；器械图库新增“器械校对表”。'; target.before(note);} patchToolImages(); }; }
const style=document.createElement('style'); style.textContent=`
.v16atlas{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.v16card{display:grid;grid-template-columns:180px 1fr;gap:14px;background:#fff;border:1px solid #e4e7ec;border-radius:18px;padding:14px;align-items:center}.v16card img{width:180px;height:120px;object-fit:contain;background:#fff;border:1px solid #eef2f6;border-radius:12px}.v16card h3{margin:0 0 6px}.v16card p{margin:0;color:#667085}.audit{width:100%;border-collapse:collapse;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e4e7ec}.audit th,.audit td{padding:10px;border-bottom:1px solid #eef2f6;text-align:left;vertical-align:middle}.audit img{width:110px;height:72px;object-fit:contain;background:#fff;border:1px solid #eef2f6;border-radius:10px}.audit .path{font-size:12px;color:#667085;word-break:break-all}.v16layout{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:16px}.v16monitor{position:relative;background:#091118;border-radius:22px;overflow:hidden;min-height:520px}.v16monitor img{width:100%;height:100%;max-height:660px;object-fit:contain;display:block;transition:opacity .18s}.v16monitor img.fade{opacity:.14}.v16ov{position:absolute;inset:0}.v16hud{position:absolute;top:12px;left:12px;background:#000c;color:#fff;padding:7px 10px;border-radius:8px;font:800 11px ui-monospace,monospace}.v16side{background:#fff;border:1px solid #e4e7ec;border-radius:18px;padding:14px}.v16tool{display:grid;grid-template-columns:92px 1fr;gap:10px;align-items:center;border:2px solid #e4e7ec;border-radius:14px;padding:8px;margin:8px 0;background:#f8fafc;cursor:grab}.v16tool.active{border-color:#2e90fa;box-shadow:0 0 0 3px rgba(46,144,250,.12)}.v16tool img{width:92px;height:72px;object-fit:contain;background:#fff;border-radius:10px}.v16zone{position:absolute;border:3px dashed #fbbf24;background:#fbbf2420;border-radius:18px;box-shadow:0 0 22px rgba(251,191,36,.35)}.v16dot{position:absolute;width:4%;height:4%;border-radius:999px;background:#fbbf24;border:2px solid #111827}.v16svg{position:absolute;inset:0;width:100%;height:100%}.v16point{position:absolute;width:4%;height:4%;border-radius:999px;border:2px solid #111827}.v16point.start{background:#fbbf24}.v16point.end{background:#22c55e}.v16lesion{position:absolute;width:8%;height:8%;border-radius:999px;background:#fff3;border:2px solid #f59e0b}.v16ring{position:absolute;border:4px solid #eab308;border-radius:999px;transform:translate(-50%,-50%);display:none}.v16ring.show{display:block}.v16ring span{position:absolute;right:-10px;bottom:-10px;width:18px;height:18px;border-radius:999px;background:#facc15;border:2px solid #111827;cursor:nwse-resize}.v16task h3{margin:0 0 8px}.v16task p{margin:0 0 12px}.v16tray{margin-top:10px}@media(max-width:900px){.v16atlas{grid-template-columns:1fr}.v16card{grid-template-columns:120px 1fr}.v16card img{width:120px;height:88px}.v16layout{grid-template-columns:1fr}.v16monitor{min-height:380px}.audit th:nth-child(4),.audit td:nth-child(4){display:none}}
`; document.head.appendChild(style);
try{document.title='GI Resident AI V24.0 · 住培辅助教学';}catch(e){}
})();
