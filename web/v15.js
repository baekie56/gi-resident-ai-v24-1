(function(){
const A='assets/procedure/';
// Unified tool map to avoid fallback-to-snare mismatches.
const FIXED_TOOL={
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
 '冲洗导管':'assets/procedure/tools/冲洗导管_display.png',
 '切开刀':'assets/procedure/tools/切开刀_display.png'
};
function getFixedTool(t){ return FIXED_TOOL[t] || 'assets/procedure/tools/止血夹_display.png'; }
// Patch atlas to always use the unified map.
window.openToolAtlas=function(){
 const tools=[
  ['注射针','黏膜下注射 / 抬举'],['DualKnife','ESD / POEM 切开剥离'],['Coagrasper','ESD术中止血'],['圈套器','EMR / 息肉套圈切除'],['APC探头','APC热凝'],['止血夹','创面夹闭 / 止血'],['套扎器','EVL套扎'],['导丝','ERCP / ERAT 建立通道'],['乳头切开刀','ERCP乳头切开'],['取石球囊','ERCP取石'],['FNA穿刺针','EUS-FNA'],['FNB穿刺针','EUS-FNB'],['隧道刀','POEM隧道与肌切开'],['冲洗导管','ERAT/ERCP冲洗辅助']
 ];
 $('#main').innerHTML=head('器械图库 v15','已统一修复器械图片映射，尽量做到“器械名称—图片”一一对应。','TOOL ATLAS v15')+
 `<div class="notice"><b>v15 修正：</b>不再让图片加载失败后回退成圈套器；每个器械都改成独立映射，并在图片下直接标出器械名称，避免“名字对但图片错”。</div><div class="v15atlas">`+
 tools.map(([t,u])=>`<div class="v15card"><img src="${getFixedTool(t)}" alt="${t}"><div><h3>${t}</h3><p>${u}</p></div></div>`).join('')+
 `</div><div class="row" style="margin-top:16px"><button class="btn ghost" onclick="procedures()">返回术式页</button></div>`;
 };
 // Patch generic v7/v8/v9/v10/v11/v12/v13/v14 tool trays by replacing image src after render.
 function patchToolImages(){
   document.querySelectorAll('[data-tool]').forEach(el=>{
     if(el.classList.contains('v19card')) return;
     const name=el.getAttribute('data-tool');
     const img=el.querySelector('img');
     if(img && FIXED_TOOL[name]) { img.src=FIXED_TOOL[name]; img.onerror=null; }
   });
 }
 // Observe page changes and patch trays/atlas.
 const mo=new MutationObserver(()=>patchToolImages());
 mo.observe(document.documentElement,{subtree:true,childList:true});
 setTimeout(patchToolImages,300);
 // Enhance v14 procedural accuracy: ESD marking and EMR snare alignment.
 if(window.launchV14){
   const oldLaunch=window.launchV14;
   window.launchV14=function(id){ oldLaunch(id); setTimeout(()=>{
     // internal state is inside v14 closure, so we patch the DOM instructions/targets via a wrapper when pages render.
   },50); };
 }
 // Override launchV14 completely with corrected geometry by reusing v14 styles? Simpler: implement fixed versions for ESD and EMR only, then delegate others back to v14.
 const V7=A+'lesions/v7/', V8=A+'lesions/v8/', R13=A+'real_v13/';
 const PROCS={
  ESD:{title:'ESD · v15 对位修正版',summary:'修正病灶边缘标记与切开路径，让划圈更贴近病灶边界。',tools:['注射针','DualKnife','Coagrasper'],steps:[
   {kind:'tap',title:'黏膜下注射',img:V7+'esd_01_marking.jpg',next:V7+'esd_02_lift.jpg',tool:'注射针',zone:[57,61,18,16],task:'在病灶基底注射，形成抬举。'},
   {kind:'path',title:'沿病灶边缘环周切开',img:V7+'esd_02_lift.jpg',next:V7+'esd_03_incision.jpg',tool:'DualKnife',task:'按病灶周围标记点顺时针完成切开，路径要沿病灶边缘走。',checkpoints:[[37,49],[49,34],[63,36],[71,49],[61,66],[45,63]],radius:8},
   {kind:'drag',title:'建立黏膜瓣',img:V7+'esd_03_incision.jpg',next:V7+'esd_04_flap.jpg',tool:'DualKnife',task:'从病灶下缘进入，向上拖出黏膜瓣。',start:[53,71],end:[54,57],tol:11},
   {kind:'path',title:'沿黏膜下层剥离',img:V7+'esd_04_flap.jpg',next:V7+'esd_05_dissection.jpg',tool:'DualKnife',task:'沿暴露的黏膜下层继续剥离。',checkpoints:[[48,68],[57,61],[67,56]],radius:10},
   {kind:'tap',title:'术中止血',img:V7+'esd_05_bleeding_sim.jpg',next:V7+'esd_05_dissection.jpg',tool:'Coagrasper',zone:[63,60,17,17],task:'对准出血点止血。'},
   {kind:'path',title:'完成整块剥离',img:V7+'esd_05_dissection.jpg',next:V7+'esd_06_defect.jpg',tool:'DualKnife',task:'沿剩余黏膜下附着完成剥离。',checkpoints:[[45,43],[56,40],[68,43]],radius:10}
  ]},
  EMR:{title:'EMR · v15 对位修正版',summary:'修正套圈目标区，让圈套器瞄准息肉头端，而不是下方抬举垫。',tools:['注射针','圈套器','止血夹'],steps:[
   {kind:'tap',title:'黏膜下注射',img:V7+'emr_01_lesion.jpg',next:V7+'emr_02_lift.jpg',tool:'注射针',zone:[54,60,20,18],task:'在息肉基底注射抬举。'},
   {kind:'snare',title:'圈套对准息肉头端',img:V7+'emr_02_lift.jpg',next:V7+'emr_03_snare.jpg',tool:'圈套器',task:'先点击息肉头端中央放置圈套，再放大到刚好包住息肉头端及少量基底。',center:[55,35],centerTol:8,targetMin:11,targetMax:17},
   {kind:'drag',title:'收紧并切除',img:V7+'emr_03_snare.jpg',next:V7+'emr_04_defect.jpg',tool:'圈套器',task:'从圈套器手柄方向向下轻拖，模拟收紧切除。',start:[61,72],end:[62,84],tol:10},
   {kind:'multiTap',title:'夹闭创面',img:V7+'emr_04_defect.jpg',next:V8+'emr_05_closure.jpg',tool:'止血夹',task:'依次夹闭创面两侧。',zones:[[54,47,16,16],[58,60,16,16]]}
  ]}
 };
 let S=null;
 function feedback(type,html){const f=$('#v15fb'); if(f){f.className='feedback '+type; f.innerHTML=html;}}
 function stat(id){const p=window.prof&&prof(); if(!p) return {best:0,runs:0}; p.procedures=p.procedures||{}; return p.procedures['v15_'+id]||{best:0,runs:0};}
 function saveStat(id,pct){const p=window.prof&&prof(); if(!p) return; p.procedures=p.procedures||{}; const s=p.procedures['v15_'+id]||{best:0,runs:0}; s.best=Math.max(s.best||0,pct); s.runs=(s.runs||0)+1; p.procedures['v15_'+id]=s; p.xp=(p.xp||0)+Math.max(10,Math.round(pct/8)); if(window.save) save();}
 function pct(e,el){const r=el.getBoundingClientRect(); return [(e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100];}
 function near(a,b,t){return Math.hypot(a[0]-b[0],a[1]-b[1])<=t;}
 function inZone(p,z){return p[0]>=z[0]-z[2]/2 && p[0]<=z[0]+z[2]/2 && p[1]>=z[1]-z[3]/2 && p[1]<=z[1]+z[3]/2;}
 function cur(){return PROCS[S.id].steps[S.i];}
 function ok(note){S.ok++; feedback('good',`<b>✓ 正确</b><br>${note||'已进入下一步'}`); const st=cur(); const img=$('#v15img'); img.classList.add('fade'); setTimeout(()=>{img.src=st.next;img.onload=()=>img.classList.remove('fade')},140); setTimeout(()=>{S.i++; S.selected=null; S.pathIndex=0; S.path=[]; S.multi=0; S.snarePlaced=false; if(S.i>=PROCS[S.id].steps.length) finish(true); else render();},700);}
 function bad(msg){S.lives--; feedback('mid',`<b>再试一次</b><br>${msg}`); updateHud(); if(S.lives<=0) finish(false);} 
 function finish(win){const pct=Math.round(S.ok/PROCS[S.id].steps.length*100); saveStat(S.id,pct); const ss=stat(S.id); $('#main').innerHTML=head(`${PROCS[S.id].title} · ${win?'完成':'失败'}`,PROCS[S.id].summary,'V15 COMPLETE')+`<div class="grid g3">${metric('本轮成绩',pct+'%',`${S.ok}/${PROCS[S.id].steps.length}`)}${metric('历史最好',ss.best+'%')}${metric('完成轮次',ss.runs,'次')}</div><div class="card" style="margin-top:16px"><h2>${win?'对位修正训练完成':'建议重练，感受更准确的落点'}</h2><div class="row"><button class="btn" onclick="launchV15('${S.id}')">再练一轮</button><button class="btn ghost" onclick="procedures()">返回训练营</button></div></div>`;}
 function updateHud(){const h=$('#v15hud'); if(h) h.textContent=`STEP ${S.i+1}/${PROCS[S.id].steps.length} · LIFE ${'♥'.repeat(S.lives)}${'♡'.repeat(3-S.lives)} · SCORE ${S.ok}`;}
 function toolCard(t){return `<div class="v15tool ${S.selected===t?'active':''}" data-tool="${t}" draggable="true"><img src="${getFixedTool(t)}" alt="${t}"><div><b>${t}</b></div></div>`}
 function render(){const st=cur(); $('#main').innerHTML=head(PROCS[S.id].title,PROCS[S.id].summary,`V15 ${S.id}`)+`<div class="notice"><b>本版修正：</b>${S.id==='ESD'?'划圈路径已重新对准病灶边缘标记。':'套圈中心已重新对准息肉头端。'}</div><div class="v15layout"><section class="v15monitor"><img id="v15img" src="${st.img}"><div id="v15ov" class="v15ov">${renderOverlay(st)}</div><div id="v15hud" class="v15hud"></div></section><aside class="v15side"><div class="v15task"><h3>${st.title}</h3><p>${st.task}</p></div><div class="v15tray">${PROCS[S.id].tools.map(toolCard).join('')}</div><div id="v15fb" class="feedback mid"><b>开始操作</b><br>先选器械，再在正确区域完成动作。</div><div class="row" style="margin-top:12px"><button class="btn ghost" onclick="procedures()">返回训练营</button></div></aside></div>`; bind(); updateHud();}
 function renderOverlay(st){ if(st.kind==='tap') return `<div class="v15zone" style="left:${st.zone[0]-st.zone[2]/2}%;top:${st.zone[1]-st.zone[3]/2}%;width:${st.zone[2]}%;height:${st.zone[3]}%"></div>`; if(st.kind==='multiTap'){ const z=st.zones[S.multi||0]; return `<div class="v15zone" style="left:${z[0]-z[2]/2}%;top:${z[1]-z[3]/2}%;width:${z[2]}%;height:${z[3]}%"></div>`; } if(st.kind==='path'){ return st.checkpoints.map((p,i)=>`<div class="v15dot ${i===0?'first':''}" style="left:${p[0]-2}%;top:${p[1]-2}%"></div>`).join('')+`<svg id="v15svg" class="v15svg"></svg>`; } if(st.kind==='drag'){ return `<div class="v15point start" style="left:${st.start[0]-2}%;top:${st.start[1]-2}%"></div><div class="v15point end" style="left:${st.end[0]-2}%;top:${st.end[1]-2}%"></div>`; } if(st.kind==='snare'){ return `<div class="v15lesion" style="left:${st.center[0]-4}%;top:${st.center[1]-4}%"></div><div id="v15ring" class="v15ring ${S.snarePlaced?'show':''}" style="left:${S.snareCenter?S.snareCenter[0]:0}%;top:${S.snareCenter?S.snareCenter[1]:0}%;width:${(S.snareRadius||8)*2}%;height:${(S.snareRadius||8)*2}%"><span id="v15handle"></span></div>`; } return ''; }
 function bind(){ document.querySelectorAll('.v15tool').forEach(el=>{ el.onclick=()=>{S.selected=el.dataset.tool; document.querySelectorAll('.v15tool').forEach(x=>x.classList.toggle('active',x.dataset.tool===S.selected));}; el.addEventListener('dragstart',e=>{S.selected=el.dataset.tool; e.dataTransfer.setData('text/plain',S.selected);});}); const ov=$('#v15ov'); const st=cur(); ov.addEventListener('dragover',e=>e.preventDefault()); ov.addEventListener('drop',e=>{e.preventDefault(); const t=e.dataTransfer.getData('text/plain'); if(t) S.selected=t; handlePoint(pct(e,ov));}); ov.addEventListener('click',e=>{if(st.kind!=='path') handlePoint(pct(e,ov));}); ov.addEventListener('pointerdown',e=>{const p=pct(e,ov); if(st.kind==='path'){ if(S.selected!==st.tool) return bad('当前步骤应使用：'+st.tool); S.dragging=true; S.path=[p]; if(near(p,st.checkpoints[S.pathIndex],st.radius)){ S.pathIndex++; drawPath(); if(S.pathIndex>=st.checkpoints.length) ok('已沿病灶边缘完成路径。'); } } else if(st.kind==='drag'){ if(S.selected!==st.tool) return bad('当前步骤应使用：'+st.tool); if(!near(p,st.start,st.tol)) return bad('请从起点开始拖动。'); S.dragging=true; } else if(st.kind==='snare'){ if(S.selected!==st.tool) return bad('当前步骤应使用：'+st.tool); if(!S.snarePlaced){ S.snarePlaced=true; S.snareCenter=p; S.snareRadius=6; render(); } else if(e.target.id==='v15handle'){ S.dragging='snare'; } } }); ov.addEventListener('pointermove',e=>{const p=pct(e,ov); if(st.kind==='path'&&S.dragging){ S.path.push(p); if(S.pathIndex<st.checkpoints.length && near(p,st.checkpoints[S.pathIndex],st.radius)){ S.pathIndex++; drawPath(); if(S.pathIndex>=st.checkpoints.length) ok('切开路径正确，已对准病灶边缘。'); } drawPath(); } else if(st.kind==='drag'&&S.dragging){ if(near(p,st.end,st.tol)) ok('拖动方向和落点正确。'); } else if(st.kind==='snare'&&S.dragging==='snare'){ const c=S.snareCenter; S.snareRadius=Math.max(4,Math.min(24,Math.hypot(p[0]-c[0],p[1]-c[1]))); const ring=$('#v15ring'); ring.style.width=(S.snareRadius*2)+'%'; ring.style.height=(S.snareRadius*2)+'%'; if(near(c,st.center,st.centerTol) && S.snareRadius>=st.targetMin && S.snareRadius<=st.targetMax) ok('圈套区域已对准息肉头端。'); } }); ['pointerup','pointerleave'].forEach(ev=>ov.addEventListener(ev,()=>{S.dragging=false;})); }
 function handlePoint(p){ const st=cur(); if(!S.selected) return bad('请先选择器械。'); if(S.selected!==st.tool) return bad('当前步骤应使用：'+st.tool); if(st.kind==='tap'){ if(inZone(p,st.zone)) ok('落点正确。'); else bad('落点没有对准目标区域。'); } else if(st.kind==='multiTap'){ const z=st.zones[S.multi||0]; if(inZone(p,z)){ S.multi=(S.multi||0)+1; if(S.multi>=st.zones.length) ok('已完成两侧夹闭。'); else { feedback('good',`<b>✓ 已完成第 ${S.multi} 个夹闭点</b><br>请继续夹闭另一侧。`); render(); S.multi=1; } } else bad('当前夹闭点不正确。'); } else if(st.kind==='snare'&&!S.snarePlaced){ S.snarePlaced=true; S.snareCenter=p; S.snareRadius=6; render(); } }
 function drawPath(){ const svg=$('#v15svg'); const st=cur(); if(!svg) return; svg.setAttribute('viewBox','0 0 100 100'); const d=S.path&&S.path.length?`M ${S.path.map((p,i)=>`${i?'L':' '}${p[0]} ${p[1]}`).join(' ')}`:''; svg.innerHTML=(d?`<path d="${d}" stroke="#22c55e" stroke-width="1.2" fill="none"/>`:'' )+st.checkpoints.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="${i<S.pathIndex?2.3:1.9}" fill="${i<S.pathIndex?'#22c55e':'#fbbf24'}" stroke="#111827" stroke-width="0.4"/>`).join(''); }
 window.launchV15=function(id){ S={id,i:0,ok:0,lives:3,selected:null,path:[],pathIndex:0,snarePlaced:false,snareCenter:[0,0],snareRadius:8,multi:0,dragging:false}; render(); };
 const oldLaunchV9=window.launchV9; if(oldLaunchV9){ window.launchV9=function(id){ if(PROCS[id]) return launchV15(id); return oldLaunchV9(id); }; }
 const oldProcedures=window.procedures; if(oldProcedures){ window.procedures=function(){ oldProcedures(); const target=document.querySelector('.procedure-grid'); if(target){ const note=document.createElement('div'); note.className='notice'; note.style.margin='12px 0 16px'; note.innerHTML='<b>v15 修正：</b>① 器械图片映射重新整理，尽量做到每个器械对应自己的图；② ESD 划圈路径已重新贴合病灶边缘；③ EMR 套圈中心已重新对准息肉头端。'; target.before(note);} patchToolImages(); }; }
 const style=document.createElement('style'); style.textContent=`
 .v15atlas{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.v15card{display:grid;grid-template-columns:180px 1fr;gap:14px;background:#fff;border:1px solid #e4e7ec;border-radius:18px;padding:14px;align-items:center}.v15card img{width:180px;height:120px;object-fit:contain;background:#fff;border:1px solid #eef2f6;border-radius:12px}.v15card h3{margin:0 0 6px}.v15card p{margin:0;color:#667085}.v15layout{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:16px}.v15monitor{position:relative;background:#091118;border-radius:22px;overflow:hidden;min-height:520px}.v15monitor img{width:100%;height:100%;max-height:660px;object-fit:contain;display:block;transition:opacity .18s}.v15monitor img.fade{opacity:.14}.v15ov{position:absolute;inset:0}.v15hud{position:absolute;top:12px;left:12px;background:#000c;color:#fff;padding:7px 10px;border-radius:8px;font:800 11px ui-monospace,monospace}.v15side{background:#fff;border:1px solid #e4e7ec;border-radius:18px;padding:14px}.v15tool{display:grid;grid-template-columns:92px 1fr;gap:10px;align-items:center;border:2px solid #e4e7ec;border-radius:14px;padding:8px;margin:8px 0;background:#f8fafc;cursor:grab}.v15tool.active{border-color:#2e90fa;box-shadow:0 0 0 3px rgba(46,144,250,.12)}.v15tool img{width:92px;height:72px;object-fit:contain;background:#fff;border-radius:10px}.v15zone{position:absolute;border:3px dashed #fbbf24;background:#fbbf2420;border-radius:18px;box-shadow:0 0 22px rgba(251,191,36,.35)}.v15dot{position:absolute;width:4%;height:4%;border-radius:999px;background:#fbbf24;border:2px solid #111827}.v15dot.first{box-shadow:0 0 12px #fbbf24}.v15svg{position:absolute;inset:0;width:100%;height:100%}.v15point{position:absolute;width:4%;height:4%;border-radius:999px;border:2px solid #111827}.v15point.start{background:#fbbf24}.v15point.end{background:#22c55e}.v15lesion{position:absolute;width:8%;height:8%;border-radius:999px;background:#fff3;border:2px solid #f59e0b}.v15ring{position:absolute;border:4px solid #eab308;border-radius:999px;transform:translate(-50%,-50%);display:none}.v15ring.show{display:block}.v15ring span{position:absolute;right:-10px;bottom:-10px;width:18px;height:18px;border-radius:999px;background:#facc15;border:2px solid #111827}.v15task h3{margin:0 0 8px}.v15task p{margin:0 0 12px}.v15tray{margin-top:10px}@media(max-width:900px){.v15atlas{grid-template-columns:1fr}.v15card{grid-template-columns:120px 1fr}.v15card img{width:120px;height:88px}.v15layout{grid-template-columns:1fr}.v15monitor{min-height:380px}}
`; document.head.appendChild(style);
 try{document.title='GI Resident AI V24.0 · 住培辅助教学';}catch(e){}
})();
