(function(){
const A='assets/procedure/';
const V7=A+'lesions/v7/';
const V8=A+'lesions/v8/';
const R13=A+'real_v13/';
const TOOL={
  '注射针':'assets/procedure/tools/注射针_display.png',
  'DualKnife':'assets/procedure/tools/DualKnife_display.png',
  'Coagrasper':'assets/procedure/tools/Coagrasper_display.png',
  '圈套器':'assets/procedure/tools/圈套器_display.png',
  '止血夹':'assets/procedure/tools/止血夹_display.png'
};
const PROCS={
 ESD:{
  title:'ESD · v14 操作手感强化版',
  summary:'在真实阶段图基础上，加入沿边缘连续切线、剥离拖线、止血点击等更接近操作手感的交互。',
  source:'真实阶段图来自既有 ESD 连续病例；v14 强化“沿病变边缘切开”和“沿黏膜下层剥离”的动作感。',
  tools:['注射针','DualKnife','Coagrasper'],
  steps:[
   {kind:'tap',title:'黏膜下注射',img:V7+'esd_01_marking.jpg',next:V7+'esd_02_lift.jpg',tool:'注射针',zone:[58,62,18,16],task:'拖或点选注射针，在病灶基底完成注射。'},
   {kind:'path',title:'沿病变边缘环周切开',img:V7+'esd_02_lift.jpg',next:V7+'esd_03_incision.jpg',tool:'DualKnife',task:'沿病变边缘依次走完 4 个切开点，不要切到病灶中央。',checkpoints:[[40,53],[53,34],[73,48],[61,71]],radius:8},
   {kind:'drag',title:'建立黏膜瓣',img:V7+'esd_03_incision.jpg',next:V7+'esd_04_flap.jpg',tool:'DualKnife',task:'从切开缘向下拖出黏膜瓣，建立进入黏膜下层的工作口。',start:[52,72],end:[52,58],tol:10},
   {kind:'path',title:'沿黏膜下层剥离',img:V7+'esd_04_flap.jpg',next:V7+'esd_05_dissection.jpg',tool:'DualKnife',task:'沿暴露的黏膜下层连续剥离，依次经过 3 个关键点。',checkpoints:[[49,67],[58,60],[67,56]],radius:10},
   {kind:'tap',title:'术中止血',img:V7+'esd_05_bleeding_sim.jpg',next:V7+'esd_05_dissection.jpg',tool:'Coagrasper',zone:[63,60,17,17],task:'选 Coagrasper，精确点到出血点进行止血。'},
   {kind:'path',title:'完成整块剥离',img:V7+'esd_05_dissection.jpg',next:V7+'esd_06_defect.jpg',tool:'DualKnife',task:'沿剩余黏膜下附着继续剥离，完成整块切除。',checkpoints:[[46,43],[57,40],[69,42]],radius:10}
  ]
 },
 EMR:{
  title:'EMR · v14 圈套器张开/收紧版',
  summary:'增强圈套器操作感：先抬举，再让圈套器覆盖病灶，最后模拟收紧切除并夹闭创面。',
  source:'EMR 连续真实阶段图；v14 增加圈套器覆盖病灶的可视化交互。',
  tools:['注射针','圈套器','止血夹'],
  steps:[
   {kind:'tap',title:'黏膜下注射',img:V7+'emr_01_lesion.jpg',next:V7+'emr_02_lift.jpg',tool:'注射针',zone:[52,58,19,18],task:'用注射针在息肉基底完成抬举。'},
   {kind:'snare',title:'张开圈套器并套住病灶',img:V7+'emr_02_lift.jpg',next:V7+'emr_03_snare.jpg',tool:'圈套器',task:'选圈套器，先点击病灶中心放置圈套，再拖动手柄放大，直到完整包住病灶。',center:[52,46],centerTol:9,targetMin:12,targetMax:19},
   {kind:'drag',title:'收紧并切除',img:V7+'emr_03_snare.jpg',next:V7+'emr_04_defect.jpg',tool:'圈套器',task:'继续使用圈套器，从病灶基底向下轻拖，模拟收紧并切除。',start:[55,70],end:[55,82],tol:10},
   {kind:'multiTap',title:'夹闭创面',img:V7+'emr_04_defect.jpg',next:V8+'emr_05_closure.jpg',tool:'止血夹',task:'用止血夹依次夹闭创面两侧。',zones:[[58,46,16,16],[58,60,16,16]]}
  ]
 },
 POEM:{
  title:'POEM · v14 隧道/肌切开拖线版',
  summary:'基于 v13 同一病例真实 8 帧，加入隧道推进与肌切开拖线路径。',
  source:'同一病例 POEM A-H 真实连续图；v14 强化隧道推进和肌切开动作感。',
  tools:['注射针','DualKnife','止血夹'],
  steps:[
   {kind:'tap',title:'入口区注射',img:R13+'poem_01_before.jpg',next:R13+'poem_02_injection.jpg',tool:'注射针',zone:[52,47,28,24],task:'在计划入口区完成黏膜下注射。'},
   {kind:'path',title:'入口切开',img:R13+'poem_02_injection.jpg',next:R13+'poem_03_incision.jpg',tool:'DualKnife',task:'沿入口纵向切开路线向下走两点。',checkpoints:[[54,45],[54,59]],radius:10},
   {kind:'path',title:'建立黏膜下隧道',img:R13+'poem_03_incision.jpg',next:R13+'poem_04_tunnel.jpg',tool:'DualKnife',task:'从入口向远端连续推进，完成隧道建立。',checkpoints:[[49,55],[56,54],[61,56],[67,58]],radius:10},
   {kind:'tap',title:'确认隧道跨越 EGJ',img:R13+'poem_04_tunnel.jpg',next:R13+'poem_05_route.jpg',tool:'注射针',zone:[57,55,24,22],task:'在远端/胃侧区域点染，确认隧道走向。'},
   {kind:'path',title:'开始肌切开',img:R13+'poem_05_route.jpg',next:R13+'poem_06_myotomy1.jpg',tool:'DualKnife',task:'沿内环肌切开路径完成前半段肌切开。',checkpoints:[[49,50],[56,56],[63,62]],radius:10},
   {kind:'path',title:'延长肌切开',img:R13+'poem_06_myotomy1.jpg',next:R13+'poem_07_myotomy2.jpg',tool:'DualKnife',task:'继续沿肌层延长切开到目标长度。',checkpoints:[[45,48],[53,55],[60,62],[67,70]],radius:10},
   {kind:'clip',title:'夹闭入口',img:R13+'poem_07_myotomy2.jpg',next:R13+'poem_08_closure.jpg',tool:'止血夹',zone:[52,48,42,28],task:'先把止血夹旋转到合适方向，再在入口裂口中央释放。',targetAngle:0}
  ]
 },
 CLIP:{
  title:'止血夹 · v14 旋转释放版',
  summary:'在真实 Dieulafoy 病变图基础上，加入“先旋转方向、再释放”的步骤。',
  source:'同一 Dieulafoy 病变真实前后图；v14 强化夹子方向与释放动作。',
  tools:['止血夹'],
  steps:[
   {kind:'clip',title:'旋转对准可见血管',img:R13+'clip_01.jpg',next:R13+'clip_02.jpg',tool:'止血夹',zone:[54,59,24,24],task:'先将止血夹旋转到与血管方向一致，再在血管处释放。',targetAngle:0},
   {kind:'tap',title:'确认夹闭稳固',img:R13+'clip_02.jpg',next:R13+'clip_03.jpg',tool:'止血夹',zone:[55,48,34,30],task:'再次检查夹闭区域，确认无活动性出血并完成随访。'}
  ]
 }
};
let T=null;
function toolCard(t){return `<div class="v14-tool ${T&&T.selected===t?'active':''}" draggable="true" data-tool="${t}"><img src="${TOOL[t]||'assets/procedure/tools/圈套器_display.png'}" onerror="this.src='assets/procedure/tools/止血夹_display.png'" alt="${t}"><div><b>${t}</b></div></div>`}
function stat(id){const p=window.prof&&prof();if(!p)return {best:0,runs:0};p.procedures=p.procedures||{};return p.procedures['v14_'+id]||{best:0,runs:0};}
function saveStat(id,pct){if(window.finishModule24)finishModule24('simulation',id+' 流程认知',pct);const p=window.prof&&prof();if(!p)return;p.procedures=p.procedures||{};const s=p.procedures['v14_'+id]||{best:0,runs:0};s.best=Math.max(s.best||0,pct);s.latest=pct;s.runs=(s.runs||0)+1;s.last=new Date().toISOString();p.procedures['v14_'+id]=s;p.xp=(p.xp||0)+Math.max(10,Math.round(pct/8));if(window.save)save();}
function pctPoint(ev, el){const r=el.getBoundingClientRect();return [(ev.clientX-r.left)/r.width*100,(ev.clientY-r.top)/r.height*100];}
function near(p, q, tol){return Math.hypot(p[0]-q[0],p[1]-q[1])<=tol;}
function inZone(p, z){return p[0]>=z[0]-z[2]/2 && p[0]<=z[0]+z[2]/2 && p[1]>=z[1]-z[3]/2 && p[1]<=z[1]+z[3]/2;}
function currentStep(){return PROCS[T.id].steps[T.step];}
function feedback(type, html){const f=$('#v14fb');if(f){f.className='feedback '+type;f.innerHTML=html;}}
function fail(msg){if(T.busy24)return;if(window.simulationEvent24)simulationEvent24(T.step,T.selected,false,msg);T.lives--; feedback('mid',`<b>未完成</b><br>${msg}`); updateHUD(); if(T.lives<=0) finish(false);}
function succeed(note){if(T.busy24)return;T.busy24=true;if(window.simulationEvent24)simulationEvent24(T.step,T.selected,true,note||"流程步骤完成");T.ok++; feedback('good',`<b>✓ 完成</b><br>${note||'操作成功'}`); const st=currentStep(); const img=$('#v14img'); if(img&&st.next){img.classList.add('fade'); setTimeout(()=>{img.src=st.next;img.onload=()=>img.classList.remove('fade');},160);} setTimeout(()=>{if(!$('#v14fb'))return;T.busy24=false;T.step++; T.selected=null; T.path=[]; T.pathIndex=0; T.multiIndex=0; T.snarePlaced=false; T.snareRadius=8; T.snareCenter=[0,0]; T.clipAngle=90; if(T.step>=PROCS[T.id].steps.length) finish(true); else render();},700);}
function updateHUD(){const hud=$('#v14hud'); if(hud) hud.textContent=`STEP ${T.step+1}/${PROCS[T.id].steps.length} · LIFE ${'♥'.repeat(T.lives)}${'♡'.repeat(3-T.lives)} · SCORE ${T.ok}`;}
function finish(win){const pct=Math.round(T.ok/PROCS[T.id].steps.length*100); saveStat(T.id,pct); const s=stat(T.id); $('#main').innerHTML=head(`${PROCS[T.id].title} · ${win?'完成':'失败'}`,PROCS[T.id].source,'V14 OPERATION COMPLETE')+`<div class="grid g3">${metric('本轮成绩',pct+'%',`${T.ok}/${PROCS[T.id].steps.length}`)}${metric('最近一次',s.latest+'%')}${metric('完成轮次',s.runs,'次')}</div><div class="card" style="margin-top:16px"><h2>${win?'流程认知训练完成':'建议重新训练巩固步骤认知'}</h2><p>${PROCS[T.id].summary}</p><div class="row"><button class="btn" onclick="launchV9('${T.id}')">再练一轮</button><button class="btn ghost" onclick="procedures()">返回训练营</button></div></div>`;}
function renderStepExtras(st){
 let html='';
 if(st.kind==='path') html += `<div class="v14hint">请按顺序经过 ${st.checkpoints.length} 个高亮点。</div>`;
 if(st.kind==='snare') html += `<div class="v14hint">先点击病灶中心放置圈套，再拖动黄色手柄调整大小。</div>`;
 if(st.kind==='clip') html += `<div class="v14clipctrl"><span>夹子方向：</span><button class="btn ghost small" onclick="v14Rotate(-15)">↺</button><b id="v14angle">${T.clipAngle}°</b><button class="btn ghost small" onclick="v14Rotate(15)">↻</button><small>目标：${st.targetAngle}°</small></div>`;
 return html;
}
function checkpointDots(st){ if(st.kind!=='path') return ''; return st.checkpoints.map((p,i)=>`<div class="v14dot ${i<T.pathIndex?'done':''} ${i===T.pathIndex?'current':''}" style="left:${p[0]-2}%;top:${p[1]-2}%"></div>`).join(''); }
function zoneHTML(st){
 if(st.kind==='tap'||st.kind==='multiTap'||st.kind==='clip') return `<div class="v14zone" style="left:${st.zone?st.zone[0]-st.zone[2]/2:st.zones[T.multiIndex][0]-st.zones[T.multiIndex][2]/2}%;top:${st.zone?st.zone[1]-st.zone[3]/2:st.zones[T.multiIndex][1]-st.zones[T.multiIndex][3]/2}%;width:${st.zone?st.zone[2]:st.zones[T.multiIndex][2]}%;height:${st.zone?st.zone[3]:st.zones[T.multiIndex][3]}%"></div>`;
 if(st.kind==='drag') return `<div class="v14dragline"><span class="start" style="left:${st.start[0]-2}%;top:${st.start[1]-2}%"></span><span class="end" style="left:${st.end[0]-2}%;top:${st.end[1]-2}%"></span></div>`;
 if(st.kind==='snare') return `<div class="v14lesion" style="left:${st.center[0]-3}%;top:${st.center[1]-3}%"></div><div id="snareRing" class="v14snare ${T.snarePlaced?'show':''}" style="left:${T.snareCenter[0]}%;top:${T.snareCenter[1]}%;width:${T.snareRadius*2}%;height:${T.snareRadius*2}%"><span id="snareHandle"></span></div>`;
 return checkpointDots(st)+`<svg class="v14svg" id="v14svg"></svg>`;
}
function render(){ const proc=PROCS[T.id], st=currentStep(); $('#main').innerHTML=head(proc.title,proc.summary,`V14 STEP ${T.step+1}/${proc.steps.length}`)+`<div class="notice"><b>v14 强化点：</b>${proc.source}</div><div class="v14layout"><section class="v14monitor"><img id="v14img" src="${st.img}" alt="${st.title}"><div id="v14overlay" class="v14overlay">${zoneHTML(st)}</div><div id="v14hud" class="v14hud"></div></section><aside class="v14side"><div class="v14task"><h3>${st.title}</h3><p>${st.task}</p>${renderStepExtras(st)}</div><div class="v14tray"><h3>真实器械托盘</h3>${proc.tools.map(toolCard).join('')}</div><div id="v14fb" class="feedback mid"><b>开始操作</b><br>选择正确器械，并在图中完成指定动作。</div><div class="row" style="margin-top:12px"><button class="btn ghost" onclick="procedures()">返回训练营</button></div></aside></div>`; bind(); updateHUD(); drawPath(); }
function bind(){
 document.querySelectorAll('.v14-tool').forEach(el=>{ el.addEventListener('click',()=>{T.selected=el.dataset.tool; document.querySelectorAll('.v14-tool').forEach(x=>x.classList.toggle('active',x.dataset.tool===T.selected));}); el.addEventListener('dragstart',e=>{T.selected=el.dataset.tool; e.dataTransfer.setData('text/plain',T.selected);}); });
 const ov=$('#v14overlay'); if(!ov) return; const st=currentStep();
 ov.addEventListener('dragover',e=>e.preventDefault());
 ov.addEventListener('drop',e=>{e.preventDefault(); if(e.dataTransfer.getData('text/plain')) T.selected=e.dataTransfer.getData('text/plain'); handlePoint(pctPoint(e,ov));});
 ov.addEventListener('click',e=>{ if(st.kind==='path' || T.dragging) return; handlePoint(pctPoint(e,ov)); });
 ov.addEventListener('pointerdown',e=>{ const p=pctPoint(e,ov); if(st.kind==='path'){ if(T.selected!==st.tool){ fail('当前步骤应使用：'+st.tool); return; } T.dragging=true; T.path=[p]; if(near(p, st.checkpoints[T.pathIndex], st.radius||10)) {T.pathIndex++; drawPath(); if(T.pathIndex>=st.checkpoints.length) succeed('已完成连续路径操作。');} }
 else if(st.kind==='drag'){ if(T.selected!==st.tool){ fail('当前步骤应使用：'+st.tool); return; } if(!near(p, st.start, st.tol||10)){ fail('请从起点开始拖动。'); return; } T.dragging=true; T.dragStart=p; }
 else if(st.kind==='snare'){ if(T.selected!==st.tool){ fail('当前步骤应使用：'+st.tool); return; } const ring=$('#snareRing'); if(!T.snarePlaced){ T.snarePlaced=true; T.snareCenter=p; T.snareRadius=6; render(); return; } const h=$('#snareHandle'); if(h && e.target===h){ T.dragging='snare'; } }
 });
 ov.addEventListener('pointermove',e=>{ const p=pctPoint(e,ov), st=currentStep(); if(st.kind==='path' && T.dragging){ T.path.push(p); if(T.pathIndex<st.checkpoints.length && near(p, st.checkpoints[T.pathIndex], st.radius||10)){ T.pathIndex++; drawPath(); if(T.pathIndex>=st.checkpoints.length) succeed('已完成连续路径操作。'); } drawPath(); }
 else if(st.kind==='drag' && T.dragging){ drawDragPreview(p); if(near(p, st.end, st.tol||10)) succeed('拖动方向和落点正确。'); }
 else if(st.kind==='snare' && T.dragging==='snare'){ const c=T.snareCenter; T.snareRadius=Math.max(4, Math.min(24, Math.hypot(p[0]-c[0], p[1]-c[1]))); updateSnare(); if(near(c, st.center, st.centerTol||8) && T.snareRadius>=st.targetMin && T.snareRadius<=st.targetMax){ succeed('圈套器已完整覆盖病灶。'); } }
 });
 ['pointerup','pointerleave'].forEach(ev=>ov.addEventListener(ev,()=>{T.dragging=false; removeDragPreview();}));
}
function handlePoint(p){ const st=currentStep(); if(!T.selected){ fail('请先选择器械。'); return; } if(T.selected!==st.tool){ fail('当前步骤应使用：'+st.tool); return; } if(st.kind==='tap'){ if(inZone(p, st.zone)) succeed('落点正确，进入下一阶段。'); else fail('落点不对，请再对准目标区域。'); }
 else if(st.kind==='multiTap'){ const z=st.zones[T.multiIndex]; if(inZone(p,z)){ T.multiIndex++; if(T.multiIndex>=st.zones.length) succeed('已完成所有夹闭点。'); else { feedback('good',`<b>✓ 第 ${T.multiIndex}/${st.zones.length} 个夹闭点完成</b><br>请继续夹闭下一个位置。`); render(); T.multiIndex = T.multiIndex; } } else fail('当前夹闭位置不正确。'); }
 else if(st.kind==='clip'){ if(Math.abs(T.clipAngle - st.targetAngle)>20){ fail('夹子方向还不合适，请先旋转。'); return; } if(inZone(p, st.zone)) succeed('夹子方向和释放点都正确。'); else fail('释放位置不正确。'); }
 else if(st.kind==='snare' && !T.snarePlaced){ T.snarePlaced=true; T.snareCenter=p; T.snareRadius=6; render(); }
}
function drawPath(){ const st=currentStep(); const svg=$('#v14svg'); if(!svg || st.kind!=='path') return; svg.setAttribute('viewBox','0 0 100 100'); const path=T.path&&T.path.length?`M ${T.path.map((p,i)=>`${i?'L':' '}${p[0]} ${p[1]}`).join(' ')}`:''; svg.innerHTML=(path?`<path d="${path}" stroke="#22c55e" stroke-width="1.2" fill="none" stroke-linecap="round"/>`:'' ) + st.checkpoints.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="${i<T.pathIndex?2.4:1.8}" fill="${i<T.pathIndex?'#22c55e': i===T.pathIndex?'#fbbf24':'#ffffff'}" stroke="#111827" stroke-width="0.4"/>`).join(''); }
function drawDragPreview(p){ const ov=$('#v14overlay'); if(!ov) return; let line=$('#v14dragPreview'); if(!line){ line=document.createElement('div'); line.id='v14dragPreview'; line.className='v14dragPreview'; ov.appendChild(line);} const st=currentStep(); const x1=st.start[0], y1=st.start[1], x2=p[0], y2=p[1]; const dx=x2-x1, dy=y2-y1, len=Math.hypot(dx,dy), ang=Math.atan2(dy,dx)*180/Math.PI; line.style.left=x1+'%'; line.style.top=y1+'%'; line.style.width=len+'%'; line.style.transform=`rotate(${ang}deg)`; }
function removeDragPreview(){ const el=$('#v14dragPreview'); if(el) el.remove(); }
function updateSnare(){ const ring=$('#snareRing'); if(!ring) return; ring.style.left=T.snareCenter[0]+'%'; ring.style.top=T.snareCenter[1]+'%'; ring.style.width=(T.snareRadius*2)+'%'; ring.style.height=(T.snareRadius*2)+'%'; ring.classList.add('show'); }
window.v14Rotate=function(delta){ T.clipAngle=(T.clipAngle+delta+360)%360; const a=$('#v14angle'); if(a) a.textContent=T.clipAngle+'°'; const zone=$('.v14zone'); if(zone) zone.style.transform=`rotate(${T.clipAngle}deg)`; };
window.launchV14=function(id){ T={id,step:0,ok:0,lives:3,selected:null,path:[],pathIndex:0,multiIndex:0,clipAngle:90,snarePlaced:false,snareCenter:[0,0],snareRadius:8,dragging:false}; render(); };
const oldLaunch=window.launchV9; if(oldLaunch){ window.launchV9=function(id){ if(PROCS[id]) return launchV14(id); return oldLaunch(id); }; }
const oldProc=window.procedures; if(oldProc){ window.procedures=function(){ oldProc(); const target=document.querySelector('.procedure-grid'); if(target){ const note=document.createElement('div'); note.className='notice'; note.style.margin='12px 0 16px'; note.innerHTML='<b>v14 操作手感升级：</b>ESD 新增沿边缘连续切线与剥离拖线；EMR 新增圈套器放置/放大交互；POEM 新增隧道推进和肌切开拖线；止血夹新增旋转释放。进入这些术式将自动启用 v14 操作版。'; target.before(note);} }; }
const oldAtlas=window.openToolAtlas; if(oldAtlas){ window.openToolAtlas=function(){ oldAtlas(); const n=document.createElement('div'); n.className='notice'; n.style.marginTop='14px'; n.innerHTML='<b>v14 器械图说明：</b>本页继续优先使用真实器械照片；同时手术操作训练中，EMR/ESD/POEM/CLIP 已增强交互手感。'; document.querySelector('#main')?.appendChild(n); }; }
const style=document.createElement('style'); style.textContent=`
.v14layout{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:16px}.v14monitor{position:relative;background:#091118;border-radius:22px;overflow:hidden;min-height:520px}.v14monitor img{width:100%;height:100%;max-height:680px;object-fit:contain;display:block;transition:opacity .18s}.v14monitor img.fade{opacity:.14}.v14overlay{position:absolute;inset:0}.v14side{background:#fff;border:1px solid #e4e7ec;border-radius:18px;padding:14px}.v14task h3{margin:0 0 8px}.v14task p{margin:0 0 10px}.v14tray h3{margin:8px 0}.v14-tool{display:grid;grid-template-columns:96px 1fr;gap:10px;align-items:center;border:2px solid #e4e7ec;border-radius:14px;padding:8px;margin:9px 0;background:#f8fafc;cursor:grab}.v14-tool.active{border-color:#2e90fa;box-shadow:0 0 0 3px rgba(46,144,250,.12)}.v14-tool img{width:96px;height:74px;object-fit:contain;background:#fff;border-radius:10px}.v14-tool small{display:block;color:#667085;margin-top:4px}.v14hud{position:absolute;top:12px;left:12px;background:#000c;color:#fff;padding:7px 10px;border-radius:8px;font:800 11px ui-monospace,monospace}.v14zone{position:absolute;border:3px dashed #fbbf24;background:#fbbf2420;border-radius:18px;box-shadow:0 0 22px rgba(251,191,36,.35);cursor:pointer;transform-origin:center}.v14hint{font-size:12px;color:#175cd3;background:#eff8ff;border-radius:10px;padding:8px 10px;margin-bottom:10px}.v14dot{position:absolute;width:4%;height:4%;border-radius:999px;background:#fff;border:2px solid #111827}.v14dot.current{background:#fbbf24;box-shadow:0 0 12px #fbbf24}.v14dot.done{background:#22c55e}.v14svg{position:absolute;inset:0;width:100%;height:100%}.v14dragline .start,.v14dragline .end{position:absolute;width:4%;height:4%;border-radius:999px;border:2px solid #111827}.v14dragline .start{background:#fbbf24}.v14dragline .end{background:#22c55e}.v14dragPreview{position:absolute;height:0.8%;background:#22c55e;transform-origin:left center;border-radius:999px}.v14snare{position:absolute;border:4px solid #eab308;border-radius:999px;transform:translate(-50%,-50%);display:none;box-shadow:0 0 0 9999px rgba(0,0,0,.02) inset}.v14snare.show{display:block}.v14snare span{position:absolute;right:-10px;bottom:-10px;width:18px;height:18px;border-radius:999px;background:#facc15;border:2px solid #111827;cursor:nwse-resize}.v14lesion{position:absolute;width:6%;height:6%;border-radius:999px;background:#ffffff55;border:2px solid #f59e0b;transform:translate(-50%,-50%)}.v14clipctrl{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:8px 0 12px}.btn.small{padding:4px 8px;font-size:12px}.v14status{margin-top:12px}@media(max-width:920px){.v14layout{grid-template-columns:1fr}.v14monitor{min-height:380px}}
`; document.head.appendChild(style);
try{document.title='GI Resident AI V24.0 · 住培辅助教学';}catch(e){}
})();
