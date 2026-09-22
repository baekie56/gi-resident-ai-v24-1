(function(){
const A='assets/procedure/';
const toolImg={
 '注射针':'assets/procedure/tools/注射针_display.png','DualKnife':'assets/procedure/tools/DualKnife_display.png','Coagrasper':'assets/procedure/tools/Coagrasper_display.png','圈套器':'assets/procedure/tools/圈套器_display.png','APC探头':'assets/procedure/tools/APC探头_display.png','止血夹':'assets/procedure/tools/止血夹_display.png',
 '套扎器':'assets/procedure/tools/套扎器_display.png','FNA穿刺针':'assets/procedure/tools/FNA穿刺针_display.png','FNB穿刺针':'assets/procedure/tools/FNB穿刺针_display.png','乳头切开刀':'assets/procedure/tools/乳头切开刀_display.png','导丝':'assets/procedure/tools/导丝_display.png','取石球囊':'assets/procedure/tools/取石球囊_display.png','隧道刀':'assets/procedure/tools/隧道刀_display.png','冲洗导管':'assets/procedure/tools/冲洗导管_display.png'
};
const TOOL_DATA=[
 {name:'注射针', use:'黏膜下注射、抬举病灶或入口区', proc:['ESD','EMR','POEM'], level:'基础'},
 {name:'DualKnife', use:'ESD环周切开与黏膜下剥离', proc:['ESD'], level:'进阶'},
 {name:'Coagrasper', use:'ESD术中止血、处理暴露血管', proc:['ESD','止血'], level:'进阶'},
 {name:'圈套器', use:'息肉圈套捕获与EMR切除', proc:['EMR','息肉切除'], level:'基础'},
 {name:'APC探头', use:'非接触热凝固，如GAVE/APC止血', proc:['APC'], level:'基础'},
 {name:'止血夹', use:'创面夹闭、可见血管夹闭止血、关闭入口', proc:['EMR','POEM','止血'], level:'基础'},
 {name:'套扎器', use:'食管静脉曲张套扎', proc:['EVL'], level:'基础'},
 {name:'导丝', use:'ERCP/ERAT中建立通道与选择性插管', proc:['ERCP','ERAT'], level:'进阶'},
 {name:'乳头切开刀', use:'ERCP中乳头切开与治疗性处理', proc:['ERCP'], level:'进阶'},
 {name:'取石球囊', use:'胆总管取石与清扫', proc:['ERCP'], level:'进阶'},
 {name:'隧道刀', use:'POEM入口切开、隧道建立和肌切开', proc:['POEM'], level:'进阶'},
 {name:'冲洗导管', use:'ERAT冲洗阑尾腔、辅助处理碎屑', proc:['ERAT'], level:'进阶'},
 {name:'FNA穿刺针', use:'EUS引导细针穿刺抽吸', proc:['FNA'], level:'进阶'},
 {name:'FNB穿刺针', use:'EUS引导组织活检，获取组织柱', proc:['FNB'], level:'进阶'}
];
// use premium data from v9.js if available through closure? not accessible. recreate lite list for card rendering by reading known launch function names? simpler store metadata locally.
const PROC_CARDS=[
 ['ESD','真实阶段图','胃早癌分阶段真实图模拟','ESD / 胃早癌'],['EMR','真实阶段图','注射抬举、圈套、切除、夹闭','EMR / 结肠息肉'],['APC','真实阶段图','GAVE治疗前 / 中 / 后','APC / GAVE'],
 ['EVL','教学状态图','静脉曲张套扎','EVL / 曲张静脉'],['POEM','教学状态图','入口、隧道、肌切开、夹闭','POEM / 贲门失弛缓'],['ERCP','教学状态图','乳头、导丝、取石球囊','ERCP / 胆总管结石'],['ERAT','教学状态图','阑尾开口、导丝、冲洗','ERAT / 阑尾逆行治疗'],['FNA','教学状态图','安全路径、进针、取材','FNA / EUS穿刺'],['FNB','教学状态图','组织柱获取','FNB / EUS活检'],['CLIP','教学状态图','可见血管夹闭止血','止血夹 / 溃疡可见血管']
];
let toolQuizSet=[], toolQuizIndex=0, toolQuizScore=0;
function statKey(id){ return 'sim_'+id; }
function getSimStat(id){ const p=prof&&prof(); if(!p) return {best:0,runs:0}; p.procedures=p.procedures||{}; return p.procedures[statKey(id)]||{best:0,runs:0}; }
function setSimStat(id,score){ const p=prof&&prof(); if(!p) return; p.procedures=p.procedures||{}; const cur=p.procedures[statKey(id)]||{best:0,runs:0}; cur.best=Math.max(cur.best||0,score); cur.runs=(cur.runs||0)+1; cur.last=new Date().toISOString(); p.procedures[statKey(id)]=cur; p.xp=(p.xp||0)+Math.max(6,Math.round(score/12)); save&&save(); }
function setToolStat(score){ const p=prof&&prof(); if(!p) return; p.procedures=p.procedures||{}; const cur=p.procedures.toolChallenge||{best:0,runs:0}; cur.best=Math.max(cur.best||0,score); cur.runs=(cur.runs||0)+1; cur.last=new Date().toISOString(); p.procedures.toolChallenge=cur; p.xp=(p.xp||0)+Math.max(4,Math.round(score/15)); save&&save(); }
function simScore(id){ const s=getSimStat(id); return `<div class="proc-progress">历史最好 <b>${s.best||0}%</b> · ${s.runs||0}轮</div>`; }
function toolCardGrid(t){ return `<div class="toollab-card"><img src="${toolImg[t.name]}" alt="${t.name}"><div><div class="tags"><span class="tag hard">${t.level}</span><span class="tag">${t.proc.join(' / ')}</span></div><h3>${t.name}</h3><p>${t.use}</p></div></div>`; }
window.procedures=function(){
 const real=PROC_CARDS.filter(x=>x[1]==='真实阶段图').length;
 const teach=PROC_CARDS.filter(x=>x[1]==='教学状态图').length;
 const cards=PROC_CARDS.map(([id,cat,desc,title])=>`<div class="proc-card ${cat==='真实阶段图'?'blue':'green'}" onclick="launchV9('${id}')"><div class="proc-icon">${({ESD:'✂️',EMR:'⭕',APC:'⚡',EVL:'🪢',POEM:'🛤️',ERCP:'🟡',ERAT:'🧩',FNA:'🎯',FNB:'🧬',CLIP:'📎'})[id]||'🔧'}</div><div class="tags"><span class="tag hard">${cat}</span><span class="tag">${title}</span></div><h2>${id}</h2><p>${desc}</p>${simScore(id)}<button class="btn soft">进入术式 →</button></div>`).join('');
 const ts=(prof&&prof()&&prof().procedures&&prof().procedures.toolChallenge)||{best:0,runs:0};
 $('#main').innerHTML=head('Endoscopy Academy v10','在 v9 基础上继续升级：把术式库、器械图库和器械识图挑战整合成一个更完整的内镜教学训练页面。','Procedure Lab v10')+
 `<div class="procedure-banner"><div><span class="pill">NEW · Tool Lab</span><h2>术式训练 + 器械图谱 + 器械识图闯关</h2><p>v10 不只是继续加术式，还把“器械长什么样、用在哪一步、适合什么术式”单独抽出来练。这样规培生不只是会点步骤，还能认器械。</p></div><div class="proc-stats"><b>${real}</b><span>真实阶段图术式</span><b>${teach}</b><span>教学状态图术式</span></div></div>
 <div class="grid g2" style="margin-bottom:16px"><div class="card game-hero procedure-hero"><span class="pill">Tool Atlas</span><h2>🧰 器械图库</h2><p>把常用内镜器械单独列出来：注射针、圈套器、DualKnife、Coagrasper、导丝、乳头切开刀、FNA/FNB 穿刺针等。</p><button class="btn" onclick="openToolAtlas()">打开器械图库</button></div><div class="card game-hero anatomy-hero"><span class="pill">Tool Challenge</span><h2>🎯 器械识图闯关</h2><p>看图认器械，再判断它最常用于哪个操作。帮助规培生把“器械外观—名称—用途—术式”串起来。</p><p style="margin:8px 0 0;color:#667085">历史最好：<b>${ts.best||0}%</b> · 完成 ${ts.runs||0} 轮</p><button class="btn" onclick="startToolQuiz()">开始闯关</button></div></div>
 <div class="section"><h2>精品术式库</h2><small>点击进入对应术式模拟。v10 保留 v9 的所有小游戏并新增成绩沉淀。</small></div>
 <div class="procedure-grid">${cards}</div>
 <div class="notice" style="margin-top:16px"><b>v10亮点：</b>① 每个术式的完成成绩会沉淀到学习档案；② 新增器械图库与器械识图挑战；③ 更适合带教老师安排“先认器械，再练术式”的学习路径。</div>`;
 };
 window.openToolAtlas=function(){
   $('#main').innerHTML=head('器械图库','先认识器械，再进入具体术式。','Tool Atlas v10')+
   `<div class="notice"><b>学习建议：</b>先看器械图，再看它最常出现在哪个术式；最后去对应的小游戏里练“何时用、拖到哪里”。</div>
   <div class="toollab-grid">${TOOL_DATA.map(toolCardGrid).join('')}</div>
   <div class="row" style="margin-top:16px"><button class="btn" onclick="startToolQuiz()">开始器械识图闯关</button><button class="btn ghost" onclick="procedures()">返回术式页</button></div>`;
 };
 function sample(arr,n){ const a=[...arr].sort(()=>Math.random()-0.5); return a.slice(0,n); }
 window.startToolQuiz=function(){ toolQuizSet=sample(TOOL_DATA, Math.min(8,TOOL_DATA.length)).map((t,idx)=>{ const mode=idx%2===0?'name':'use'; if(mode==='name'){ const opts=sample(TOOL_DATA.filter(x=>x.name!==t.name),3).map(x=>x.name); opts.push(t.name); return {mode,t,prompt:'请识别这件器械的名称：',opts:opts.sort(()=>Math.random()-0.5),ans:t.name,explain:`${t.name}：${t.use}。常见于 ${t.proc.join('、')}。`}; } else { const opts=sample(TOOL_DATA.filter(x=>x.name!==t.name),3).map(x=>x.use); opts.push(t.use); return {mode,t,prompt:`${t.name} 最常用于什么？`,opts:opts.sort(()=>Math.random()-0.5),ans:t.use,explain:`${t.name} 常见于 ${t.proc.join('、')}。核心用途：${t.use}。`}; } }); toolQuizIndex=0; toolQuizScore=0; renderToolQuiz(); };
 function renderToolQuiz(){ const q=toolQuizSet[toolQuizIndex]; $('#main').innerHTML=head('器械识图闯关','看图认器械，再判断用途。','Tool Challenge')+
 `<div class="quiz-shell"><div class="card"><div class="clinical-prompt"><span>第 ${toolQuizIndex+1}/${toolQuizSet.length} 题</span><h2>${q.prompt}</h2></div><div class="imgbox proc-image toolquiz-img"><img src="${toolImg[q.t.name]}" alt="${q.t.name}"></div><div class="choices">${q.opts.map((o,i)=>`<div class="choice" data-i="${i}">${String.fromCharCode(65+i)}. ${o}</div>`).join('')}</div><div id="toolExp"></div><button id="toolNext" class="btn hidden" style="margin-top:12px">${toolQuizIndex===toolQuizSet.length-1?'完成闯关':'下一题 →'}</button></div></div>`;
 let locked=false; $$('.choice').forEach(el=>el.onclick=()=>{ if(locked) return; locked=true; const pick=q.opts[+el.dataset.i]; const ok=pick===q.ans;if(window.moduleResponse24)moduleResponse24(q.prompt,q.opts,+el.dataset.i,ok,q.opts.indexOf(q.ans),q.explain); if(ok) toolQuizScore++; $$('.choice').forEach(y=>{const txt=q.opts[+y.dataset.i]; if(txt===q.ans) y.classList.add('correct'); if(y===el && !ok) y.classList.add('wrong'); }); $('#toolExp').className='feedback '+(ok?'good':'mid'); $('#toolExp').innerHTML=`<b>${ok?'✓ 正确':'✗ 再看一下器械特点'}</b><br>${q.explain}`; $('#toolNext').classList.remove('hidden'); $('#toolNext').onclick=()=>{ if(toolQuizIndex<toolQuizSet.length-1){ toolQuizIndex++; renderToolQuiz(); } else finishToolQuiz(); }; }); }
 function finishToolQuiz(){ const pct=Math.round(toolQuizScore/toolQuizSet.length*100); setToolStat(pct);if(window.finishModule24)finishModule24('recognition','器械识图',pct); $('#main').innerHTML=head('器械识图闯关完成','把器械外观、名称、用途和术式真正串起来。','Tool Challenge Complete')+
 `<div class="grid g3">${metric('本轮成绩',pct+'%',`${toolQuizScore}/${toolQuizSet.length}`)}${metric('历史最好',((prof()||{}).procedures||{}).toolChallenge?.best?((prof()||{}).procedures||{}).toolChallenge.best+'%':'0%')}${metric('累计轮次',((prof()||{}).procedures||{}).toolChallenge?.runs||0,'次')}</div>
 <div class="card" style="margin-top:16px"><h2>${pct>=80?'🧰 器械识别不错':'🧠 建议再练一轮巩固器械印象'}</h2><p>${pct>=80?'接下来可以直接去对应术式里练操作顺序与落点。':'先回器械图库看看图，再做一次闯关，然后进入相应术式。'}</p><div class="row"><button class="btn" onclick="startToolQuiz()">再闯一轮</button><button class="btn soft" onclick="openToolAtlas()">返回器械图库</button><button class="btn ghost" onclick="procedures()">返回术式页</button></div></div>`;
 }
 // wrap launchV9 to record results by intercepting finish overlay button? easier monkey patch finish when returning to procedures impossible. Instead patch global finish function if exists? hard due closure in v9.js.
 // Alternative: provide recorder on click of 再练一轮? Not enough. So create observer to capture completion screen and record score when it appears.
 const origLaunch = window.launchV9;
 if(origLaunch){
   window.launchV9=function(id){ origLaunch(id); const root=document.getElementById('main'); const obs=new MutationObserver(()=>{ const fin=document.querySelector('.v7-finish'); if(fin && fin.innerText.includes('MISSION COMPLETE')){ const scoreEl=fin.querySelector('.v7-finalscore'); if(scoreEl){ const val=parseInt(scoreEl.textContent||'0',10)||0; const pct=Math.min(100, Math.max(40, Math.round(val/7))); setSimStat(id,pct); obs.disconnect(); } } }); obs.observe(root,{childList:true,subtree:true}); };
 }
 // extend report page to show tool challenge + sim stats if report exists
 const origReport = window.report;
 if(origReport){
   window.report=function(){ origReport(); const p=prof&&prof(); if(!p) return; const sims=p.procedures||{}; const simRows=Object.entries(sims).filter(([k])=>k.startsWith('sim_')||k==='toolChallenge'); if(!simRows.length) return; const box=document.createElement('div'); box.className='card'; box.style.marginTop='16px'; box.innerHTML='<div class="section" style="margin-top:0"><h2>🎮 内镜小游戏成绩</h2><small>v10 新增沉淀：术式模拟与器械识图闯关</small></div>'+simRows.map(([k,v])=>`<div class="step-answer" style="margin-bottom:10px"><div class="answer-step"><b>${k==='toolChallenge'?'器械闯关':k.replace('sim_','')}</b><span>历史最好 ${v.best||0}% · 完成 ${v.runs||0} 轮</span></div></div>`).join(''); document.getElementById('main').appendChild(box); }
 }
 // CSS inject
 const style=document.createElement('style'); style.textContent=`
 .toollab-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:16px}.toollab-card{display:grid;grid-template-columns:120px 1fr;gap:14px;background:#fff;border:1px solid #e4e7ec;border-radius:18px;padding:14px;align-items:center}.toollab-card img{width:120px;height:92px;object-fit:contain;background:#fff;border-radius:12px;border:1px solid #eef2f6}.toollab-card h3{margin:4px 0 6px}.toollab-card p{margin:0;color:#667085}.toolquiz-img img{max-height:220px;object-fit:contain;background:#fff}.proc-card.blue{background:linear-gradient(180deg,#f9fbff,#eef4ff)}.proc-card.green{background:linear-gradient(180deg,#f8fffb,#ecfdf3)}
 @media(max-width:900px){.toollab-grid{grid-template-columns:1fr}.toollab-card{grid-template-columns:92px 1fr}.toollab-card img{width:92px;height:76px}}
 `; document.head.appendChild(style);
 try{document.title='GI Resident AI V24.0 · 住培辅助教学';}catch(e){}
})();
