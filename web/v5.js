// GI Resident AI v5: verified named anatomy atlas + true interactive procedure arcade
(function(){
const U_SRC='https://journals.sagepub.com/doi/10.1177/1756284820916693';
const L_SRC='https://www.frontiersin.org/journals/medicine/articles/10.3389/fmed.2026.1857599/full';
const anatomySets={
 upper:[
 ['上段食管','Proximal esophagus','upper_esophagus.jpg','食管近端管腔；淡粉色鳞状上皮。'],['下段食管','Distal esophagus','distal_esophagus.jpg','接近EGJ前的下段食管。'],['Z线 / 食管胃结合部','Z-line / EGJ','zline.jpg','鳞柱交界与膈肌压迹，是Barrett与反流评估关键。'],['贲门 + 胃底（反转位）','Cardia & fundus in inversion','cardia_fundus.jpg','胃内反转观察贲门和胃底。'],['胃体前视（含小弯）','Corpus, forward view','gastric_body_forward.jpg','胃体皱襞及小弯方向。'],['胃体反转（含大弯）','Corpus, retroflexion','gastric_body_retro.jpg','反转位观察胃体/大弯及近端盲区。'],['胃角','Gastric angulus','gastric_angle.jpg','胃角切迹：胃体与胃窦交界的小弯侧地标。'],['胃窦','Gastric antrum','gastric_antrum.jpg','皱襞减少并向幽门汇聚。'],['十二指肠球部','Duodenal bulb (D1)','duodenal_bulb.jpg','幽门后第一段，腔相对宽。'],['十二指肠降部','Second part of duodenum (D2)','duodenum_d2.jpg','环形皱襞明显；大乳头位于内侧壁。'],['十二指肠大乳头','Major papilla','major_papilla.jpg','ERCP选择性插管的核心解剖靶点。']
 ],
 lower:[
 ['回肠末端','Terminal ileum','terminal_ileum.jpg','经回盲瓣进入；黏膜绒毛样，与结肠黏膜不同。'],['阑尾开口','Appendiceal orifice','appendiceal_orifice.jpg','盲肠底部重要地标；ERAT从此识别入口。'],['升结肠','Ascending colon','ascending_colon.jpg','右侧结肠，向远端过肝曲进入横结肠。'],['肝曲','Hepatic flexure','hepatic_flexure.jpg','升结肠与横结肠转折处。'],['横结肠','Transverse colon','transverse_colon.jpg','横跨上腹部，腔形可随体位明显改变。'],['脾曲','Splenic flexure','colon_splenic_flexure.jpg','横结肠与降结肠转折；常为锐角。','commons'],['降结肠','Descending colon','descending_colon.jpg','左侧较固定结肠段。'],['乙状结肠','Sigmoid colon','sigmoid_colon.jpg','活动度大、易成袢。'],['直乙交界附近','Rectosigmoid region','rectosigmoid.jpg','接近肛缘约15–16 cm的视野，注意与直肠转换。'],['直肠','Rectum','rectum.jpg','退镜与反转观察的重要区域。']
 ]};
let atlasMode='upper';
window.anatomy=function(){renderAtlas()};
function renderAtlas(){
 const set=anatomySets[atlasMode];
 $('#main').innerHTML=head('镜下解剖图谱','每张图都明确写出“部位名称 + 英文名 + 真实图片来源”，不再用疾病图替代解剖部位。','教学解剖图谱')+
 `<div class="anatomy-toggle"><button class="${atlasMode==='upper'?'active':''}" onclick="setAtlas('upper')">胃镜：11个标准部位</button><button class="${atlasMode==='lower'?'active':''}" onclick="setAtlas('lower')">肠镜：10个部位</button><button onclick="startPhotoQuiz()">🎯 看图猜部位</button></div>
 <div class="atlas-legend"><b>图片规则：</b>上消化道图来自标准EGD摄影位图谱；下消化道主要图来自真实结肠镜病例序列，按原图明确标注的解剖部位裁切，仅用于“位置识别”，不把其黏膜外观当作“正常标准”。脾曲使用独立正常结肠镜开放图片。</div>
 <div class="anatomy-atlas-grid">${set.map((x,i)=>{let src=x[4]==='commons'?'assets/'+x[2]:'assets/anatomy/'+x[2];let link=x[4]==='commons'?'https://commons.wikimedia.org/wiki/File:Colonoscopy_splenic_flexure.jpg':(atlasMode==='upper'?U_SRC:L_SRC);return `<div class="atlas-card"><img src="${src}" onclick="openModal(this.src)"><div class="atlas-body"><span class="atlas-chip">${String(i+1).padStart(2,'0')} · 来源标注 · 待专科复核</span><h3>${x[0]}</h3><div class="atlas-en">${x[1]}</div><p class="atlas-note">${x[3]}</p><div class="atlas-source">真实内镜图 · <a href="${link}" target="_blank">原始来源/许可</a></div></div></div>`}).join('')}</div>`;
}
window.setAtlas=m=>{atlasMode=m;renderAtlas()};
let pq={i:0,score:0,items:[]};
window.startPhotoQuiz=function(){let pool=[...anatomySets.upper.map(x=>({...q(x),tract:'胃镜'})),...anatomySets.lower.map(x=>({...q(x),tract:'肠镜'}))];pool=pool.sort(()=>Math.random()-.5).slice(0,10);pq={i:0,score:0,items:pool};renderPq()};
function q(x){return {name:x[0],en:x[1],file:x[2],commons:x[4]==='commons'}}
function renderPq(){
  const x=pq.items[pq.i];
  const others=[...anatomySets.upper,...anatomySets.lower]
    .map(z=>z[0]).filter(n=>n!==x.name).sort(()=>Math.random()-.5).slice(0,3);
  const opts=[x.name,...others].sort(()=>Math.random()-.5);
  const src=x.commons?'assets/'+x.file:'assets/anatomy/'+x.file;
  $('#main').innerHTML=head('看图猜部位',`第 ${pq.i+1}/10 题 · ${x.tract}`,'Photo Quiz')+
    `<div class="quiz-shell"><div class="card"><div class="imgbox" style="max-width:620px;margin:auto"><img src="${src}" style="max-height:420px;object-fit:contain"></div><h2 style="text-align:center;margin:16px 0">这张内镜图对应哪个部位？</h2><div class="choices">${opts.map(o=>`<div class="choice" data-v="${o}">${o}</div>`).join('')}</div><div id="pqr"></div></div></div>`;
  $$('.choice').forEach(b=>{
    b.onclick=()=>{
      if(b.dataset.locked24)return;document.querySelectorAll('.choice').forEach(c=>c.dataset.locked24='1');
      const ok=b.dataset.v===x.name;
      if(window.moduleResponse24)moduleResponse24('图片定位：'+src,opts,opts.indexOf(b.dataset.v),ok,opts.indexOf(x.name),x.en);
      if(ok)pq.score++;
      $$('.choice').forEach(c=>{
        c.style.pointerEvents='none';
        if(c.dataset.v===x.name)c.classList.add('correct');
        if(c===b&&!ok)c.classList.add('wrong');
      });
      $('#pqr').innerHTML=`<div class="feedback ${ok?'good':'mid'}"><b>${ok?'✓ 定位正确':'✗ 正确答案：'+x.name}</b><br>${x.en}<div style="margin-top:10px"><button class="btn" id="pqn">${pq.i===9?'查看成绩':'下一张 →'}</button></div></div>`;
      $('#pqn').onclick=()=>{
        pq.i++;
        if(pq.i<10){renderPq();return;}
        if(window.finishModule24)finishModule24('recognition','镜下部位识图',pq.score*10);
        $('#main').innerHTML=head('部位识图完成','从“知道名字”升级到“看一眼知道镜子在哪”。','Complete')+
          `<div class="result-pop"><div class="bigstar">${pq.score>=9?'★★★':pq.score>=7?'★★☆':'★☆☆'}</div><h2>${pq.score}/10</h2><p>${pq.score>=8?'定位能力很好，可以继续做操作小游戏。':'建议回到图谱把胃角、Z线、D2、阑尾开口等高价值地标再看一遍。'}</p><button class="btn" onclick="startPhotoQuiz()">再玩一轮</button> <button class="btn soft" onclick="nav('anatomy')">回图谱</button></div>`;
      };
    };
  });
}
// ----- Procedure Arcade -----
const arcadeDefs={
 ESD:{icon:'✂️',title:'ESD：切开-剥离-止血',kind:'target',mission:'依次完成注射抬举→预处理血管→切开病灶边界。',tools:['注射针','Coagrasper','DualKnife'],targets:[['inject',150,115],['inject',250,95],['vessel',300,175],['cut',145,230],['cut',215,255],['cut',300,230]],order:['inject','inject','vessel','cut','cut','cut']},
 EMR:{icon:'⭕',title:'EMR：抬举并套圈',kind:'target',mission:'先注射抬举，再用圈套器捕获病灶，最后通电切除。',tools:['注射针','圈套器','切除电流'],targets:[['inject',215,120],['snare',215,185],['cut',215,185]],order:['inject','snare','cut']},
 APC:{icon:'⚡',title:'APC：移动热凝',kind:'target',mission:'用APC逐点处理血管靶区，避免误点正常黏膜。',tools:['APC探头'],targets:[['apc',120,120],['apc',170,160],['apc',240,130],['apc',300,185],['apc',190,235]],order:['apc','apc','apc','apc','apc']},
 ERCP:{icon:'🟡',title:'ERCP：导丝胆管迷宫',kind:'maze',mission:'从十二指肠乳头进入目标胆管，避免误入胰管和管壁。'},
 POEM:{icon:'🛤️',title:'POEM：黏膜下隧道导航',kind:'maze',mission:'沿安全黏膜下隧道前进并跨越EGJ，避免撞到“黏膜屋顶”和肌层边界。'},
 'EUS-FNA':{icon:'🎯',title:'EUS-FNA/FNB：避血管穿刺',kind:'aim',mission:'移动穿刺针到达靶病灶，避开Doppler显示的血管。'},
 ERAT:{icon:'🧩',title:'ERAT：阑尾腔导丝通关',kind:'maze',mission:'从阑尾开口把导丝送入阑尾腔远端，避免反复顶壁。'}
};
window.procedures=function(){let p=prof();$('#main').innerHTML=head('Endoscopy Arcade v5','这次不是答题：每种术式都有不同的鼠标/键盘操作、碰撞、生命值、计时与得分。','Mini Games')+`<div class="game-select-grid">${GI_PROCEDURES.map(x=>{let g=arcadeDefs[x.id];return `<div class="game-select" onclick="openProcedure('${x.id}')"><div class="game-icon">${g?.icon||procIcon(x.id)}</div><h3>${x.name}</h3><small>${g?g.title:'步骤+器械+风险训练'}</small><br><span class="game-badge">${g?'🎮 可操作小游戏':'📘 认知训练'}</span></div>`}).join('')}</div><div class="notice" style="margin-top:18px"><b>教学边界：</b>小游戏训练的是空间感、器械选择与关键节点意识，不模拟真实组织阻力，也不代表获得独立操作资质。</div>`};
const oldOverview=window.renderProcedureOverview;
window.renderProcedureOverview=function(){oldOverview();let g=arcadeDefs[currentProcedure.id];if(!g)return;let panel=document.querySelector('.procedure-layout .card:nth-child(2)');if(panel){let d=document.createElement('div');d.className='game-launch';d.innerHTML=`<h3>🕹️ 真正可操作小游戏</h3><p>${g.mission}</p><button class="btn" onclick="launchArcade('${currentProcedure.id}')">开始操作 →</button>`;panel.insertBefore(d,panel.firstChild)}};
let G={id:null,score:0,lives:3,step:0,tool:'',start:0,pos:{x:55,y:250},timer:null};
window.launchArcade=function(id){G={id,score:0,lives:3,step:0,tool:'',start:Date.now(),pos:{x:55,y:250},timer:null};renderArcade()};
function renderArcade(){let d=arcadeDefs[G.id];$('#main').innerHTML=head(d.title,d.mission,'ARCADE MODE')+`<div class="scope-game"><div class="scope-monitor"><canvas id="gameCanvas" width="800" height="500"></canvas><div class="scope-hud"><div class="hudtop"><div class="status">REC ● &nbsp; ${G.id}</div><div class="status" id="ghud">SCORE ${G.score} · LIFE ${'♥'.repeat(G.lives)}${'♡'.repeat(3-G.lives)}</div></div><div class="message" id="gmsg">${d.kind==='maze'?'使用方向键或下方按钮移动导丝/镜身':'先选择器械，再在内镜画面内操作'}</div></div></div><div class="arcade-tools" id="tools"></div><div class="arcade-panel"><div class="arcade-mission"><b>MISSION</b><span>${d.mission}</span></div><div class="arcade-btns"><button onclick="launchArcade('${G.id}')">重开</button><button onclick="openProcedure('${G.id}')">退出</button></div></div></div>`;let c=$('#gameCanvas'),ctx=c.getContext('2d');
 if(d.kind==='target') initTarget(c,ctx,d); else if(d.kind==='maze') initMaze(c,ctx,d); else initAim(c,ctx,d);
}
function mucosa(ctx){let g=ctx.createRadialGradient(400,250,30,400,250,430);g.addColorStop(0,'#e99b8f');g.addColorStop(.55,'#b95f62');g.addColorStop(1,'#4a1823');ctx.fillStyle=g;ctx.fillRect(0,0,800,500);for(let i=0;i<18;i++){ctx.strokeStyle=`rgba(255,210,190,${.08+Math.random()*.12})`;ctx.lineWidth=5+Math.random()*10;ctx.beginPath();ctx.arc(400,250,80+i*11,Math.PI*.1,Math.PI*1.1);ctx.stroke()}}
function fail(msg){G.lives--;G.score=Math.max(0,G.score-40);$('#gmsg').textContent='⚠ '+msg;updateHud();if(G.lives<=0)setTimeout(()=>finishGame(false),600)}function ok(msg,pts=100){G.score+=pts;G.step++;$('#gmsg').textContent='✓ '+msg;updateHud()}function updateHud(){let h=$('#ghud');if(h)h.textContent=`SCORE ${G.score} · LIFE ${'♥'.repeat(Math.max(0,G.lives))}${'♡'.repeat(3-Math.max(0,G.lives))}`}
function initTarget(c,ctx,d){mucosa(ctx);let cx=400,cy=250;ctx.fillStyle='#d66b72';ctx.beginPath();ctx.ellipse(cx,cy,120,80,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#8f3040';ctx.lineWidth=5;ctx.stroke();d.targets.forEach((t,i)=>drawTarget(ctx,t,i));$('#tools').innerHTML=d.tools.map(t=>`<button class="tool-btn" data-tool="${t}">${t}</button>`).join('');$$('.tool-btn').forEach(b=>b.onclick=()=>{$$('.tool-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');G.tool=b.dataset.tool;$('#gmsg').textContent='已选择 '+G.tool+'，请在画面中点击目标'});c.onclick=e=>{let r=c.getBoundingClientRect(),x=(e.clientX-r.left)*800/r.width,y=(e.clientY-r.top)*500/r.height,t=d.targets[G.step];if(!t)return;let expected=d.order[G.step],toolMap={inject:'注射针',vessel:'Coagrasper',cut:'DualKnife',snare:'圈套器',apc:'APC探头'};if(expected==='cut'&&G.id==='EMR')toolMap.cut='切除电流';let need=toolMap[expected];if(G.tool!==need)return fail(`这一步需要 ${need}`);let tx=t[1]*1.7-15,ty=t[2]*1.35-5;if(Math.hypot(x-tx,y-ty)<55){ok(`${need} 操作完成`);mucosa(ctx);ctx.fillStyle='#d66b72';ctx.beginPath();ctx.ellipse(cx,cy,120,80,0,0,Math.PI*2);ctx.fill();for(let j=G.step;j<d.targets.length;j++)drawTarget(ctx,d.targets[j],j);if(G.step>=d.order.length)setTimeout(()=>finishGame(true),500)}else fail('器械没有落在正确靶点')}}
function drawTarget(ctx,t,i){let x=t[1]*1.7-15,y=t[2]*1.35-5;ctx.save();ctx.strokeStyle=t[0]==='vessel'?'#ff3b30':t[0]==='apc'?'#f79009':'#53b1fd';ctx.fillStyle=t[0]==='vessel'?'#ff3b30aa':'#ffffff18';ctx.lineWidth=5;ctx.beginPath();ctx.arc(x,y,22,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.font='bold 15px sans-serif';ctx.fillText(i+1,x-5,y+5);ctx.restore()}
function initMaze(c,ctx,d){let walls=G.id==='POEM'?[[0,0,800,70],[0,430,800,70],[260,70,35,250],[520,180,35,250]]:G.id==='ERCP'?[[0,0,800,65],[0,435,800,65],[220,65,38,280],[440,155,38,280],[620,65,38,250]]:[[0,0,800,70],[0,430,800,70],[190,70,34,220],[330,190,34,240],[500,70,34,260],[650,200,34,230]];ctx.fillStyle='#111827';ctx.fillRect(0,0,800,500);ctx.fillStyle='#6b2836';walls.forEach(w=>ctx.fillRect(...w));ctx.fillStyle='#2e90fa';ctx.beginPath();ctx.arc(55,250,13,0,7);ctx.fill();ctx.fillStyle='#12b76a';ctx.beginPath();ctx.arc(750,250,28,0,7);ctx.fill();$('#tools').innerHTML='<button class="tool-btn" data-d="up">↑</button><button class="tool-btn" data-d="left">←</button><button class="tool-btn" data-d="down">↓</button><button class="tool-btn" data-d="right">→</button>';function move(dx,dy){let nx=G.pos.x+dx,ny=G.pos.y+dy;if(hit(nx,ny,walls)){fail('撞到管壁/错误分支');return}G.pos={x:nx,y:ny};draw();if(Math.hypot(nx-750,ny-250)<38)finishGame(true)}function hit(x,y,ws){return x<12||x>788||y<12||y>488||ws.some(w=>x>w[0]-12&&x<w[0]+w[2]+12&&y>w[1]-12&&y<w[1]+w[3]+12)}function draw(){ctx.fillStyle='#111827';ctx.fillRect(0,0,800,500);ctx.fillStyle='#6b2836';walls.forEach(w=>ctx.fillRect(...w));ctx.fillStyle='#12b76a';ctx.beginPath();ctx.arc(750,250,28,0,7);ctx.fill();ctx.fillStyle='#53b1fd';ctx.beginPath();ctx.arc(G.pos.x,G.pos.y,13,0,7);ctx.fill()}$$('[data-d]').forEach(b=>b.onclick=()=>{let m={up:[0,-20],down:[0,20],left:[-20,0],right:[20,0]}[b.dataset.d];move(...m)});window.onkeydown=e=>{let m={ArrowUp:[0,-20],ArrowDown:[0,20],ArrowLeft:[-20,0],ArrowRight:[20,0]}[e.key];if(m){e.preventDefault();move(...m)}};G.pos={x:55,y:250};draw()}
function initAim(c,ctx,d){let vessels=[{x:360,y:135,r:45},{x:430,y:315,r:55},{x:585,y:205,r:36}],target={x:680,y:250,r:52};G.pos={x:80,y:250};function draw(){mucosa(ctx);ctx.fillStyle='#8b1e2d';vessels.forEach(v=>{ctx.beginPath();ctx.arc(v.x,v.y,v.r,0,7);ctx.fill()});ctx.fillStyle='#fdb022';ctx.beginPath();ctx.arc(target.x,target.y,target.r,0,7);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(0,G.pos.y);ctx.lineTo(G.pos.x,G.pos.y);ctx.stroke();ctx.fillStyle='#53b1fd';ctx.beginPath();ctx.arc(G.pos.x,G.pos.y,12,0,7);ctx.fill()}$('#tools').innerHTML='<button class="tool-btn" data-d="up">↑</button><button class="tool-btn" data-d="left">←</button><button class="tool-btn" data-d="down">↓</button><button class="tool-btn" data-d="right">→</button>';function move(dx,dy){let nx=Math.max(20,Math.min(780,G.pos.x+dx)),ny=Math.max(20,Math.min(480,G.pos.y+dy));if(vessels.some(v=>Math.hypot(nx-v.x,ny-v.y)<v.r+12)){fail('Doppler血管！请重新选择无血管路径');return}G.pos={x:nx,y:ny};draw();if(Math.hypot(nx-target.x,ny-target.y)<target.r)finishGame(true)}$$('[data-d]').forEach(b=>b.onclick=()=>{let m={up:[0,-18],down:[0,18],left:[-18,0],right:[18,0]}[b.dataset.d];move(...m)});window.onkeydown=e=>{let m={ArrowUp:[0,-18],ArrowDown:[0,18],ArrowLeft:[-18,0],ArrowRight:[18,0]}[e.key];if(m){e.preventDefault();move(...m)}};draw()}
function finishGame(win){window.onkeydown=null;let sec=Math.max(1,Math.round((Date.now()-G.start)/1000)),bonus=win?Math.max(0,300-sec*3):0,score=G.score+bonus,stars=win?(score>=500?3:score>=250?2:1):0,p=prof();if(p){p.procedures=p.procedures||{};let st=p.procedures[G.id]||{};st.arcadeBest=Math.max(st.arcadeBest||0,score);st.arcadeRuns=(st.arcadeRuns||0)+1;p.procedures[G.id]=st;p.xp=(p.xp||0)+(win?10+stars*5:2);save()}$('#main').innerHTML=head(`${arcadeDefs[G.id].title} · ${win?'MISSION COMPLETE':'MISSION FAILED'}`,'小游戏训练空间感和关键动作逻辑；真实操作请进入模拟器和导师监督训练。','Result')+`<div class="result-pop"><div class="bigstar">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><h2>${score} 分</h2><p>用时 ${sec}s · 剩余生命 ${Math.max(0,G.lives)}/3</p><button class="btn" onclick="launchArcade('${G.id}')">再玩一轮</button> <button class="btn soft" onclick="openProcedure('${G.id}')">回术式主页</button></div>`}
// refresh version labels in current UI
try{document.title='GI Resident AI V24.0 · 住培辅助教学';document.querySelectorAll('.logo small').forEach(x=>x.textContent='RESIDENCY TRAINING · V5');document.querySelectorAll('.login .pill').forEach(x=>x.textContent='GI Resident AI · v5');}catch(e){}
})();
