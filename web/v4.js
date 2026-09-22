// GI Resident AI v4 UI overrides
(function(){
  const oldProcedures=window.procedures;
  window.procedures=function(){
    let p=prof();
    $('#main').innerHTML=head('内镜操作训练营 v4','术者视角：不是背答案，而是在连续术中事件里做选择。','Procedure Game')+`<div class="procedure-banner v4"><div><span class="pill"><span class="pulse-dot"></span> OPERATOR MODE</span><h2>你是术者：做对一步，连击加分；关键决策错误，会丢失“生命值”</h2><p>ESD、EMR、POEM、APC、ERCP、EUS-FNA/FNB、ERAT均加入连续情境小游戏；原有步骤排序、器械匹配和知识训练继续保留。</p></div><div class="proc-stats"><b>${Object.keys(p.procedures).length}</b><span>已训练术式</span></div></div><div class="procedure-grid">${GI_PROCEDURES.map(x=>{let st=p.procedures[x.id],hasGame=!!GI_PROCEDURE_GAME[x.id];return `<div class="proc-card ${x.color}" onclick="openProcedure('${x.id}')"><div class="proc-icon">${procIcon(x.id)}</div><div class="tags"><span class="tag hard">${x.level}</span><span class="tag">${x.badge}</span>${hasGame?'<span class="tag" style="background:#f4ebff;color:#6941c6">🎮 术者模式</span>':''}</div><h2>${x.name}</h2><p>${x.full}</p><div class="proc-progress">${st?`历史最好 <b>${st.best||0}%</b> · ${st.runs||0}轮`:'尚未训练'}</div><button class="btn soft">进入术式 →</button></div>`}).join('')}</div><div class="notice" style="margin-top:16px"><b>教学边界：</b>游戏训练的是认知流程和风险意识，不代表获得独立操作资质；真实操作仍需模拟器训练、规范化胜任力评估与导师监督。</div>`;
  };

  window.renderAnatomyDetail=function(){
    let n=GI_ANATOMY[anatomyMode].nodes[anatomyIndex],im=n.img?GI_IMAGES[n.img]:null;let box=$('#anatomyDetail');if(!box)return;
    const verified=im&&im.verified;
    box.innerHTML=`<div class="card anatomy-detail"><div class="route-kicker">${anatomyMode==='upper'?'UPPER GI':'LOWER GI'} · ${anatomyIndex+1}/${GI_ANATOMY[anatomyMode].nodes.length}</div><h2>${n.name}</h2><div class="image-audit">${verified?`<span class="verified-badge">✓ 已核对部位 · 本地图片</span>`:`<span class="pending-badge">⚠ 不用错误替代图</span>`}<small>${n.imageStatus||''}</small></div><div class="anatomy-fact"><span>镜身路线</span><b>${n.route}</b></div><div class="anatomy-fact"><span>识别标志</span><b>${n.landmark}</b></div><div class="anatomy-fact"><span>操作提醒</span><b>${n.tip}</b></div>${im?`<div class="imgbox anatomy-img"><img src="${im.src}" onclick="openModal(this.src)"></div><div class="src">${n.imgNote}<br>${im.credit} · <a href="${im.source}" target="_blank">原始来源/许可</a></div>`:`<div class="anatomy-placeholder"><div><b>本节点暂不放“凑数图”</b><span>只有在找到部位明确、来源可追溯、许可适合教学使用的真实内镜图后才会加入。这样可避免把胃体、胃窦或疾病图误当成该解剖部位。</span></div></div>`}<div class="row" style="margin-top:12px"><button class="btn ghost" ${anatomyIndex===0?'disabled':''} onclick="showAnatomyNode(${Math.max(0,anatomyIndex-1)})">← 上一站</button><button class="btn" onclick="showAnatomyNode(${Math.min(GI_ANATOMY[anatomyMode].nodes.length-1,anatomyIndex+1)})">下一站 →</button></div></div>`;
  };

  const oldOverview=window.renderProcedureOverview;
  window.renderProcedureOverview=function(){
    oldOverview();
    let x=currentProcedure, panel=document.querySelector('.procedure-layout .card:nth-child(2)');
    if(panel && GI_PROCEDURE_GAME[x.id]){
      let launch=document.createElement('div');
      launch.className='game-launch';
      launch.innerHTML=`<h3>🎮 术者模式</h3><p>${GI_PROCEDURE_GAME[x.id].mission}</p><button class="btn" onclick="startOperatorGame()">进入术中情境 →</button>`;
      panel.insertBefore(launch,panel.querySelector('.level-list'));
    }
  };

  let og={idx:0,score:0,combo:0,bestCombo:0,lives:3,locked:false};
  window.startOperatorGame=function(){
    let g=GI_PROCEDURE_GAME[currentProcedure.id];if(!g)return;
    og={idx:0,score:0,combo:0,bestCombo:0,lives:g.lives||3,locked:false};
    renderOperatorRound();
  };
  function gameImage(x){let im=GI_IMAGES[x.image];return im?im.src:''}
  function renderOperatorRound(){
    let x=currentProcedure,g=GI_PROCEDURE_GAME[x.id],r=g.rounds[og.idx],pct=Math.round(og.idx/g.rounds.length*100),bg=gameImage(x);
    $('#main').innerHTML=head(`${x.name} · 术者模式`,g.mission,`Round ${og.idx+1}/${g.rounds.length}`)+`<div class="operator-shell"><div class="operator-hud"><div class="hud-card"><small>MISSION</small><div class="progress-track"><i style="width:${pct}%"></i></div></div><div class="hud-card"><small>SCORE</small><strong>${og.score}</strong></div><div class="hud-card lives"><small>LIFE</small><strong>${'♥'.repeat(Math.max(0,og.lives))}${'♡'.repeat(Math.max(0,(g.lives||3)-og.lives))}</strong></div></div><div class="operator-screen scope-corners">${bg?`<img class="operator-bg" src="${bg}" onerror="this.style.display='none'">`:''}<div class="operator-overlay"><div class="operator-topline"><div class="mission-chip"><span>${x.name} / ${r.stage.toUpperCase()}</span>${g.mission}</div><div class="combo">COMBO × ${og.combo}</div></div><div class="operator-question"><div class="stage">STAGE ${og.idx+1} · ${r.stage}</div><h2>${r.prompt}</h2><div class="operator-choices">${r.choices.map((c,i)=>`<button class="operator-choice" data-i="${i}">${String.fromCharCode(65+i)} · ${c}</button>`).join('')}</div><div id="ogfb"></div></div></div></div><div class="notice" style="margin-top:12px"><b>游戏机制：</b>正确选择 +100分并叠加Combo；错误选择扣1生命值。这里强调“关键节点意识”，不是模拟真实手感。</div></div>`;
    og.locked=false;
    document.querySelectorAll('.operator-choice').forEach(b=>b.onclick=()=>answerOperator(+b.dataset.i));
  }
  function answerOperator(i){
    if(og.locked)return;og.locked=true;
    let g=GI_PROCEDURE_GAME[currentProcedure.id],r=g.rounds[og.idx],ok=i===r.a;
    document.querySelectorAll('.operator-choice').forEach((b,j)=>{b.disabled=true;if(j===r.a)b.classList.add('correct');if(j===i&&!ok)b.classList.add('wrong')});
    if(ok){og.combo++;og.bestCombo=Math.max(og.bestCombo,og.combo);og.score+=100+Math.max(0,(og.combo-1)*25)}else{og.combo=0;og.lives--;}
    let fb=$('#ogfb');fb.className='operator-feedback '+(ok?'good':'bad');fb.innerHTML=`<b>${ok?'✓ 操作正确 · COMBO +1':'✗ 决策失误 · LIFE -1'}</b><br>${r.why}<div class="row" style="margin-top:10px"><button class="btn" id="ognext">${og.lives<=0?'结束本轮':'继续 →'}</button></div>`;
    $('#ognext').onclick=()=>{if(og.lives<=0||og.idx>=g.rounds.length-1)finishOperatorGame();else{og.idx++;renderOperatorRound()}};
  }
  function finishOperatorGame(){
    let x=currentProcedure,g=GI_PROCEDURE_GAME[x.id],max=g.rounds.length*125,raw=Math.min(100,Math.round(og.score/max*100)),stars=raw>=85?3:raw>=60?2:1,p=prof(),st=p.procedures[x.id]||{best:0,runs:0};
    st.gameBest=Math.max(st.gameBest||0,raw);st.gameRuns=(st.gameRuns||0)+1;p.procedures[x.id]=st;p.xp+=stars*8;save();
    $('#main').innerHTML=head(`${x.name} · 术者模式完成`,'把错误留在游戏里，把风险意识带到模拟器和真实带教中。','Mission Complete')+`<div class="game-result"><div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><h2>${stars===3?'优秀：关键节点反应很稳':stars===2?'通过：再练一轮可强化流程':'建议回看术式主页后重试'}</h2><p>${g.mission}</p><div class="grid g3">${metric('本轮评分',raw+'%')}${metric('最高连击','× '+og.bestCombo)}${metric('剩余生命',og.lives,'/ '+(g.lives||3))}</div><div class="row" style="margin-top:16px"><button class="btn" onclick="startOperatorGame()">再挑战一次</button><button class="btn soft" onclick="openProcedure('${x.id}')">回术式主页</button><button class="btn ghost" onclick="nav('procedures')">换一个术式</button></div></div>`;
  }
})();
