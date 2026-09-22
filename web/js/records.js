/* Append-only attempt records, pseudonymous exports, teacher feedback and backup. */
(function(){
 'use strict';
 const clone=x=>JSON.parse(JSON.stringify(x));
 const uid=()=>window.crypto?.randomUUID?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
 let active=null,caseDraft={dx:'',diff:'',plan:''},fresh=false,teacherRows=[];
 window.GI24_MODE='learn';window.GI24_ONLINE=false;
 function ensure24(p){if(!p)return p;p.v24=p.v24||{};p.v24.participantId=p.v24.participantId||'P-'+uid().replace(/-/g,'').slice(-12).toUpperCase();p.v24.attempts=p.v24.attempts||[];p.v24.reviewDue=p.v24.reviewDue||{};p.v24.reviewStreak=p.v24.reviewStreak||{};return p}
 window.ensure24=ensure24;
 function start(kind,id,mode='learn'){
   const p=ensure24(prof());if(!p)return;
   if(active&&!active.finishedAt)commit(null,'abandoned');
   active={id:uid(),caseId:id,caseFamily:id,kind,mode,softwareVersion:GI24.VERSION,distributionVersion:window.GI_APP_RELEASE?.version||null,bankVersion:GI24.BANK_VERSION,ruleVersion:GI24.RULE_VERSION,startedAt:new Date().toISOString(),responses:[],hints:0,aiUsed:false,firstAttempt:!p.v24.attempts.some(a=>a.kind===kind&&a.caseId===id&&a.status!=='abandoned')};
   window.logActivity24?.('attempt_started',{itemId:id,attemptId:active.id,details:{kind,mode,softwareVersion:GI24.VERSION,bankVersion:GI24.BANK_VERSION}});
 }
 function commit(score,status='pending-review'){
   if(!active||active.finishedAt)return;
   const p=ensure24(prof());if(!p)return;
   active.finishedAt=new Date().toISOString();active.durationSeconds=Math.max(0,Math.round((Date.parse(active.finishedAt)-Date.parse(active.startedAt))/1000));
   active.decisionScore=score;active.status=status;
   if(active.kind==='case'){active.freeText=clone(caseDraft);active.chat=clone(chatHistory);active.orderedTests=clone(ordered)}
   const saved=clone(active);p.v24.attempts.push(saved);window.persistAttempt24?.(saved);
   window.logActivity24?.(status==='abandoned'?'attempt_abandoned':'attempt_completed',{itemId:active.caseId,attemptId:active.id,details:{kind:active.kind,mode:active.mode,status,decisionScore:active.decisionScore,ruleCoverage:active.ruleCoverage,durationSeconds:active.durationSeconds}});
   if(status!=='abandoned'){
     const k=active.caseId,s=p.v24.reviewStreak[k]||0;
     p.v24.reviewDue[k]=GI24.nextReview(active.finishedAt,score>=80,s);p.v24.reviewStreak[k]=score>=80?s+1:0;
     if(['dynamic','rescue','multimodal','reports'].includes(active.kind))p.v24.reviewDue[active.kind]=p.v24.reviewDue[k];
   }
   save();
 }
 window.beginCase24=c=>{start('case',c.id,window.GI24_MODE);if(active&&c?.managed){active.contentVersion=c.managedVersion||null;active.contentRevision=window.GI24_CONTENT_REVISION||null}caseDraft={dx:'',diff:'',plan:''};fresh=true};
 window.beginModule24=(kind,id)=>start(kind,id);
 window.simulationEvent24=(step,selected,ok,note)=>{if(active&&!active.finishedAt&&active.kind==='simulation'){active.responses.push({step,selected,correct:ok,note,at:new Date().toISOString()});window.logActivity24?.('answer_submitted',{itemId:active.caseId,attemptId:active.id,details:{kind:active.kind,step,correct:!!ok}})}};
 window.moduleResponse24=(question,options,selected,correct,answerIndex,explanation)=>{
   if(!active||active.finishedAt)return;
   const order=window.currentOptionOrder24?currentOptionOrder24(options):options.map((_,i)=>i);
   active.responses.push({questionId:active.caseId+':'+active.responses.length,question,order,selected,correct,answer:options[selected],correctIndex:answerIndex,explanation,at:new Date().toISOString()});
   window.logActivity24?.('answer_submitted',{itemId:active.caseId,attemptId:active.id,details:{kind:active.kind,questionId:active.caseId+':'+(active.responses.length-1),correct:!!correct}});
 };
 window.finishModule24=(kind,title,score)=>{if(!active||active.kind!==kind||active.finishedAt)return;active.title=title;commit(score)};
 window.attachReport24=(values,r)=>{if(active){active.reportValues=clone(values);active.ruleCoverage=r.content;active.completeness=r.completeness}};
 window.captureCaseDraft24=()=>{if(fresh){fresh=false;return}if(!active||active.kind!=='case')return;for(const k of ['dx','diff','plan']){let el=document.getElementById(k);if(el)caseDraft[k]=el.value}};
 window.restoreCaseDraft24=()=>{if(active?.kind!=='case')return;for(const k of ['dx','diff','plan']){let el=document.getElementById(k);if(el)el.value=caseDraft[k]};const main=document.getElementById('main');if(!main.querySelector('#mode24')){const box=document.createElement('div');box.id='mode24';box.className='notice';box.textContent=active.mode==='selftest'?'自测练习：隐藏诊断标题和即时答案，提交后统一复盘。沿用训练题库，不能视为独立考试。':'学习模式：规则只核对明确表达，未识别部分交管理员复核。';main.querySelector('.top')?.after(box)}if(active.mode==='selftest'){document.querySelectorAll('[data-score]').forEach(b=>{b.textContent='保存本项答案';});}else if(window.GI24_REMOTE&&window.GI24_AI_CONFIGURED&&!main.querySelector('#aiConsent24')){const box=document.createElement('label');box.id='aiConsent24';box.className='ai-consent';box.innerHTML=`<input type="checkbox" ${window.GI24_ONLINE?'checked':''}>启用联网患者问答：发送本教学病例的患者可知资料和问答文本至 OpenAI；请勿输入真实患者信息。`;box.querySelector('input').onchange=e=>window.GI24_ONLINE=e.target.checked;document.querySelector('.composer')?.after(box)}};
 window.caseTitle24=c=>window.GI24_MODE==='selftest'?`${c.age}岁${c.sex}性 · ${c.chief}`:c.title;
 window.scoreFree=function(type){
   captureCaseDraft24();const text=caseDraft[type]?.trim();if(!text)return alert('请先填写答案');
   const key={dx:'diagnosis',diff:'differential',plan:'plan'}[type],r=GI24.semanticScore(text,currentCase.targets[key]);
   window.logActivity24?.('answer_submitted',{itemId:active?.caseId,attemptId:active?.id,details:{kind:'case-free-text',field:type,ruleCoverage:r.score}});
   freeScores[type]=r.score;const el=document.getElementById('f'+type);el.className='feedback mid';
   if(window.GI24_MODE==='selftest'){el.textContent='答案已保存，本轮提交后显示核对结果。';return}
   if(active)active.hints++;
   el.innerHTML=`<b>明确表达覆盖 ${r.hit.length}/${r.total}</b><p>这是规则核对结果，不是医学正确率。尚未确认的合理表达可由管理员补充认可。</p>${r.details.map(d=>`<div>${d.ok?'已识别':'待复核'}：${esc(d.target)}${d.status==='negated'||d.status==='conflict'?' · '+esc(d.reason):''}</div>`).join('')}`;
 };
 window.renderDecision=function(i,correctCount){
   captureCaseDraft24();const c=currentCase,q=c.decisions[i],self=window.GI24_MODE==='selftest';
   const order=GI24.shuffle(q.o.map((_,j)=>j));
   $('#main').innerHTML=head('关键决策',caseTitle24(c),`${i+1}/${c.decisions.length}`)+`<section class="card quiz24"><h2>${esc(q.q)}</h2><div class="choices" data-fixed-order="1">${order.map((j,k)=>`<button class="choice" data-answer="${j}">${String.fromCharCode(65+k)}. ${esc(q.o[j])}</button>`).join('')}</div><div id="decisionFeedback"></div><button id="decisionNext" class="btn hidden">${i===c.decisions.length-1?'提交本轮并复盘':'下一题'}</button></section>`;
   let locked=false;
   document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{
     if(locked)return;locked=true;const j=Number(b.dataset.answer),ok=j===q.a;
     if(active){active.responses.push({questionId:c.id+':decision:'+i,question:q.q,order,selected:j,correct:ok,answer:q.o[j],correctIndex:q.a,explanation:q.why,at:new Date().toISOString()});window.logActivity24?.('answer_submitted',{itemId:c.id,attemptId:active.id,details:{kind:'case',questionId:c.id+':decision:'+i,correct:ok}})}
     document.querySelectorAll('[data-answer]').forEach(x=>{x.disabled=true;if(self){if(x===b)x.classList.add('selected')}else{if(Number(x.dataset.answer)===q.a)x.classList.add('correct');if(x===b&&!ok)x.classList.add('wrong')}});
     $('#decisionFeedback').className='feedback '+(self?'mid':ok?'good':'mid');$('#decisionFeedback').textContent=self?'已记录，本轮结束后统一显示解析。':(ok?'符合预设答案。':'需要复盘。')+q.why;
     const next=$('#decisionNext');next.classList.remove('hidden');next.onclick=()=>i<c.decisions.length-1?renderDecision(i+1,correctCount+(ok?1:0)):finishCase(correctCount+(ok?1:0));
   });
 };
 window.finishCase=function(correctCount){
   if(!active||active.finishedAt)return;captureCaseDraft24();const c=currentCase,p=ensure24(prof()),pct=Math.round(correctCount/c.decisions.length*100);
   const textResults=Object.fromEntries(['dx','diff','plan'].map(k=>[k,GI24.semanticScore(caseDraft[k],c.targets[{dx:'diagnosis',diff:'differential',plan:'plan'}[k]])]));
   active.ruleCoverage=Math.round(Object.values(textResults).reduce((s,x)=>s+x.score,0)/3);active.ruleDetails=textResults;active.title=c.title;
   const negated=Object.values(textResults).flatMap(x=>x.details).filter(x=>['negated','conflict'].includes(x.status));
   active.safetyReview=negated.map(x=>x.target);const responses=clone(active.responses);
   responses.filter(x=>!x.correct).forEach(x=>p.wrong.unshift({caseId:c.id,caseTitle:c.title,q:x.question,picked:x.answer,right:c.decisions.find(d=>d.q===x.question)?.o[x.correctIndex],why:x.explanation,at:x.at}));
   p.scores[c.id]=pct;p.history.unshift({caseId:c.id,title:c.title,score:pct,mode:active.mode,at:new Date().toISOString()});p.xp=(p.xp||0)+10;
   commit(pct,negated.length?'safety-review':'pending-review');phase=4;
   $('#main').innerHTML=head('本轮学习复盘',c.title,'待管理员复核')+`<div class="grid g3">${metric('决策练习',pct+'%',`${correctCount}/${c.decisions.length}`)}${metric('表达覆盖',active.ruleCoverage+'%','不等于医学正确率')}${metric('本轮模式',active.mode==='selftest'?'自测练习':'学习模式','未验证的形成性测评')}</div><div class="notice">${negated.length?'检测到否定或矛盾表达，需优先请管理员复核。':'临床完整性、关键安全错误及合理替代方案均需管理员复核。'}不将决策分与表达覆盖合成为能力认证。</div><div class="card">${responses.map(x=>`<details><summary>${x.correct?'✓':'待复盘'} ${esc(x.question)}</summary><p>你的回答：${esc(x.answer)}</p><p>${esc(x.explanation)}</p></details>`).join('')}<h2>自由文本核对</h2>${Object.entries(textResults).map(([k,r])=>`<h3>${{dx:'诊断',diff:'鉴别',plan:'计划'}[k]}</h3><p>${esc(caseDraft[k]||'未填写')}</p>${r.details.map(d=>`<p class="mini">${d.ok?'已识别':'待复核'}：${esc(d.target)} · ${esc(d.reason)}</p>`).join('')}`).join('')}<h3>病例学习点</h3><ul>${c.pearls.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><button class="btn" onclick="nav('report')">查看学习记录</button><button class="btn ghost" onclick="nav('cases')">返回病例库</button></div>`;
 };
 window.checkAI=async()=>{aiAvailable=!!(window.GI24_REMOTE&&window.GI24_AI_CONFIGURED&&window.GI24_ONLINE&&window.GI24_MODE!=='selftest');const el=$('#aiState');if(el){el.textContent=aiAvailable?'联网患者问答（待核验）':'本地规则问答';el.classList.toggle('on',aiAvailable)}};
 window.askPatient=async function(){
   const input=$('#ask'),q=input?.value.trim();if(!q)return;if(q.length>1000)return alert('问题请控制在1000字以内');
   captureCaseDraft24();const prior=clone(chatHistory);chatHistory.push({who:'user',text:q});input.value='';let answer=localPatientAnswer(q);await checkAI();
   const caseId=currentCase.id,attemptId=active?.id;
   if(aiAvailable){const btn=$('#send');if(btn)btn.disabled=true;try{const r=await fetch('/api/ai',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-GI24-Request':'1'},signal:AbortSignal.timeout(45000),body:JSON.stringify({caseId,message:q,history:prior,consent:true})});const j=await r.json();if(r.ok&&j.text){answer=j.text;if(active&&active.id===attemptId){active.aiUsed=true;active.aiModel=j.model;active.promptVersion=j.promptVersion}}else answer='[联网失败，使用本地规则回答] '+answer}catch(e){answer='[联网不可用，使用本地规则回答] '+answer}}
   if(currentCase?.id!==caseId||active?.id!==attemptId)return;chatHistory.push({who:'patient',text:answer});renderWard();
 };
 function download(name,text,type='application/json'){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 window.download24=download;
 function exportProfiles(){return session?.role==='teacher'?db.profiles:{[session.name]:prof()}}
 window.exportData=()=>download('GI_Resident_AI_V24_learning_backup.json',JSON.stringify({format:'gi24-learning-backup',version:GI24.VERSION,exportedAt:new Date().toISOString(),profiles:exportProfiles()},null,2));
 window.exportResearch24=type=>{const includeText=!!$('#includeText24')?.checked,rows=GI24.researchRows(exportProfiles(),includeText);download('GI_Resident_AI_V24_research.'+type,type==='csv'?GI24.csv(rows):JSON.stringify({format:'gi24-research',version:GI24.VERSION,containsFreeText:includeText,records:rows},null,2),type==='csv'?'text/csv;charset=utf-8':'application/json')};
 window.importData=async function(e){
   const file=e.target.files?.[0];if(!file)return;if(file.size>8*1024*1024)return alert('备份超过8MB，暂不导入');
   if(window.GI24_REMOTE)return alert('服务器模式不导入覆盖档案。请在离线工作台恢复备份；服务器按原始记录保留。');
   try{const items=GI24.validateBackup(JSON.parse(await file.text()));for(const [name,p]of Object.entries(items)){let key=name;if(db.profiles[key])key=name+'-恢复-'+Date.now().toString(36);db.profiles[key]=ensure24(ensureProfile(p))}save();await window.teacher();alert('已恢复为独立本机档案，未覆盖现有记录')}catch(err){alert('导入失败：'+err.message)}
 };
 window.resetAll=()=>alert('V24不提供一键清空全部记录。请通过学习备份管理数据，避免不可恢复丢失。');
  const exportsHTML=()=>`<section class="card"><h2>导出与备份</h2><div class="row"><button class="btn" onclick="exportData()">导出学习备份</button><button class="btn ghost" onclick="exportResearch24('csv')">研究 CSV</button><button class="btn ghost" onclick="exportResearch24('json')">研究 JSON</button>${session?.role==='teacher'&&window.GI24_REMOTE?'<button class="btn ghost" onclick="exportAdmin24()">管理员训练明细 CSV</button>':''}</div><label class="ai-consent"><input type="checkbox" id="includeText24">在研究导出中包含原始回答和问答文本（可能含身份或患者信息，请核查后再共享）</label><p class="mini">默认研究导出使用随机研究编号，不含用户名、密码、盐或密码哈希。学习备份包含档案名称与原始文本，请妥善保管。</p>${session?.local&&session.role==='teacher'?'<label class="btn ghost">恢复V24学习备份<input type="file" id="importFile" accept=".json" hidden></label>':''}</section>`;
  const when=v=>{if(!v)return '—';const d=new Date(typeof v==='number'?v*1000:v);return Number.isNaN(d.getTime())?'—':d.toLocaleString()};
  const duration=v=>{v=Math.max(0,Number(v)||0);if(v<60)return Math.round(v)+'秒';const h=Math.floor(v/3600),m=Math.round(v%3600/60);return h?`${h}小时${m}分`:`${m}分钟`};
  const statusLabel=s=>({abandoned:'中途退出','safety-review':'安全表达待复核','pending-review':'待管理员复核',reviewed:'已复核'}[s]||s||'待复核');
  function attemptTable(attempts){return `<div class="table-wrap"><table class="table"><tr><th>开始时间</th><th>结束时间</th><th>模块/病例</th><th>用时</th><th>决策成绩</th><th>表达覆盖</th><th>首次</th><th>状态</th></tr>${attempts.slice().reverse().map(a=>`<tr><td>${esc(when(a.startedAt))}</td><td>${esc(when(a.finishedAt||a.serverReceivedAt))}</td><td>${esc(a.title||a.caseId)}<small>${esc(a.kind||'—')} · ${a.mode==='selftest'?'自测':'学习'}</small></td><td>${esc(duration(a.durationSeconds))}</td><td>${a.decisionScore==null?'—':esc(a.decisionScore)+'%'}</td><td>${a.ruleCoverage==null?'—':esc(a.ruleCoverage)+'%'}</td><td>${a.firstAttempt?'是':'重练'}</td><td>${esc(statusLabel(a.status))}</td></tr>`).join('')||'<tr><td colspan="8">尚无完整记录，开始一次练习后显示。</td></tr>'}</table></div>`}
  const eventNames={login:'登录',logout:'退出登录',app_open:'打开学习首页',navigation:'进入功能',attempt_started:'开始训练',answer_submitted:'提交作答',attempt_completed:'完成训练',attempt_abandoned:'中途退出训练',profile_saved:'档案同步',admin_review:'管理员复核'};
  function eventTable(events){return `<div class="table-wrap"><table class="table"><tr><th>操作时间</th><th>操作</th><th>位置/项目</th><th>关联训练</th></tr>${events.slice(0,100).map(e=>`<tr><td>${esc(when(e.occurredAt||e.receivedAt))}</td><td>${esc(eventNames[e.type]||e.type)}</td><td>${esc(e.route||e.itemId||'—')}</td><td>${esc(e.attemptId?String(e.attemptId).slice(0,12):'—')}</td></tr>`).join('')||'<tr><td colspan="4">暂无操作日志。</td></tr>'}</table></div>`}
 window.exportAdmin24=function(){const rows=[];for(const row of teacherRows){const attempts=row.profile?.v24?.attempts||[];for(const a of attempts)rows.push({username:row.name,participantId:row.participantId,attemptId:a.id,kind:a.kind,caseId:a.caseId,title:a.title||'',mode:a.mode||'',startedAt:a.startedAt||'',finishedAt:a.finishedAt||'',durationSeconds:a.durationSeconds??'',decisionScore:a.decisionScore??'',ruleCoverage:a.ruleCoverage??'',firstAttempt:a.firstAttempt?'yes':'no',status:a.status||'',softwareVersion:a.softwareVersion||'',bankVersion:a.bankVersion||'',contentVersion:a.contentVersion??'',contentRevision:a.contentRevision??'',ruleVersion:a.ruleVersion||''})}download('GI_Resident_AI_admin_attempts_'+new Date().toISOString().slice(0,10)+'.csv',GI24.csv(rows),'text/csv;charset=utf-8')};
 window.report=function(){const p=ensure24(prof()),a=p.v24.attempts.filter(x=>x.status!=='abandoned'),first=a.filter(x=>x.kind==='case'&&x.firstAttempt&&x.decisionScore!=null),last=a[a.length-1];$('#main').innerHTML=head('学习记录与复盘','首次、重练与自测分别保留；不使用最高分替代学习轨迹。',p.v24.participantId)+`<div class="grid g3">${metric('完成记录',a.length,'不删除旧轮次')}${metric('首次病例决策均分',first.length?Math.round(first.reduce((s,x)=>s+x.decisionScore,0)/first.length)+'%':'—','仅练习统计')}${metric('最近一轮',last?.decisionScore==null?'—':last.decisionScore+'%','原始记录保留')}</div><section class="card"><h2>训练记录</h2>${attemptTable(p.v24.attempts)}</section>${(window.GI24_REVIEWS||[]).length?`<section class="card"><h2>管理员反馈</h2>${window.GI24_REVIEWS.map(r=>`<p><b>${esc(r.status==='reviewed'?'已复核':'需继续练习')}</b> · ${esc(r.note)}</p>`).join('')}</section>`:''}${exportsHTML()}`};
  window.teacher=async function(){
    if(session?.role!=='teacher')return;
    if(window.GI24_REMOTE){try{const j=await api24('/api/teacher');teacherRows=j.students;window.GI24_TEACHER_REVIEWS=j.reviews;window.GI24_TEACHER_EVENTS=j.events||[];db.profiles=Object.fromEntries(teacherRows.map(x=>[x.name,ensure24(ensureProfile(x.profile))]))}catch(e){$('#main').innerHTML=head('管理员工作台')+`<div class="notice">${esc(e.message)}</div>`;return}}
    const profiles=Object.entries(db.profiles),events=window.GI24_TEACHER_EVENTS||[],n=profiles.reduce((s,[,p])=>s+(p.v24?.attempts?.length||0),0),completed=profiles.flatMap(([,p])=>p.v24?.attempts||[]).filter(a=>a.status!=='abandoned'),scores=completed.map(a=>a.decisionScore).filter(x=>typeof x==='number'),seconds=completed.reduce((s,a)=>s+(Number(a.durationSeconds)||0),0),pending=completed.filter(a=>['pending-review','safety-review'].includes(a.status)).length;
    const cards=profiles.map(([name,p])=>{const row=teacherRows.find(x=>x.name===name)||{},summary=row.summary||{},attempts=p.v24?.attempts||[],studentEvents=events.filter(e=>e.userId===row.userId);return `<details class="admin-student" data-search="${esc((name+' '+ensure24(p).v24.participantId).toLowerCase())}"><summary><span><b>${esc(name)}</b><small>${esc(ensure24(p).v24.participantId)}</small></span><span>最近活动 ${esc(when(summary.lastActive))}</span><span>完成 ${summary.completed??attempts.filter(a=>a.status!=='abandoned').length} 次</span><span>均分 ${summary.averageScore==null?'—':summary.averageScore+'%'}</span></summary><div class="admin-student-body"><div class="grid g4">${metric('全部训练',summary.attempts??attempts.length,'含中途退出')}${metric('累计用时',duration(summary.totalSeconds??attempts.reduce((s,a)=>s+(Number(a.durationSeconds)||0),0)))}${metric('待复核',summary.pendingReview??attempts.filter(a=>['pending-review','safety-review'].includes(a.status)).length)}${metric('最近活动',when(summary.lastActive),'服务器接收时间')}</div><h3>训练成绩与时间</h3>${attemptTable(attempts)}<h3>最近操作记录</h3>${eventTable(studentEvents)}<h3>逐次原始记录</h3>${attempts.filter(a=>a.status!=='abandoned').slice().reverse().map(a=>`<details><summary>${esc(a.title||a.caseId)} · ${esc(when(a.finishedAt))} · ${a.decisionScore==null?'—':a.decisionScore+'%'}</summary><pre class="record-json">${esc(JSON.stringify(a,null,2))}</pre>${window.GI24_REMOTE?`<button class="btn ghost" data-review-user="${esc(row.userId)}" data-review-attempt="${esc(a.id)}">记录管理员反馈</button>`:''}</details>`).join('')||'<p>暂无完成记录。</p>'}</div></details>`}).join('');
    $('#main').innerHTML=head('管理员工作台',window.GI24_REMOTE?'数据库持续保存每名规培生的训练、操作时间、成绩与复核记录。管理员反馈单独追加，不覆盖原始作答。':'仅汇总当前浏览器档案；不能查看其他设备。正式研究请使用服务器账户。','教学管理')+`<div class="grid g4">${metric('规培生',profiles.length)}${metric('完成训练',completed.length,`全部记录 ${n}`)}${metric('累计训练',duration(seconds))}${metric('总体均分',scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length)+'%':'—',`待复核 ${pending}`)}</div><section class="card admin-toolbar"><label>查找规培生<input id="studentSearch24" placeholder="输入用户名或研究编号"></label><label>显示范围<select id="studentFilter24"><option value="all">全部规培生</option><option value="active">已有训练</option><option value="pending">有待复核记录</option></select></label><button class="btn ghost" id="refreshAdmin24">刷新记录</button></section><section><div class="section"><h2>规培生记录</h2><span id="studentCount24">${profiles.length}人</span></div><div id="studentList24" class="admin-student-list">${cards||'<div class="card"><p>暂无规培生档案。</p></div>'}</div></section>${exportsHTML()}`;
    const imp=$('#importFile');if(imp)imp.onchange=importData;
    const applyFilter=()=>{const q=($('#studentSearch24')?.value||'').trim().toLowerCase(),filter=$('#studentFilter24')?.value||'all';let shown=0;document.querySelectorAll('.admin-student').forEach((el,i)=>{const row=teacherRows[i]||{},attempts=row.profile?.v24?.attempts||[],okText=!q||el.dataset.search.includes(q),okType=filter==='all'||(filter==='active'&&attempts.length)||(filter==='pending'&&attempts.some(a=>['pending-review','safety-review'].includes(a.status)));el.hidden=!(okText&&okType);if(!el.hidden)shown++});if($('#studentCount24'))$('#studentCount24').textContent=shown+'人'};
    if($('#studentSearch24'))$('#studentSearch24').oninput=applyFilter;if($('#studentFilter24'))$('#studentFilter24').onchange=applyFilter;if($('#refreshAdmin24'))$('#refreshAdmin24').onclick=()=>teacher();
    document.querySelectorAll('[data-review-user]').forEach(b=>b.onclick=()=>{const form=document.createElement('div');form.className='card';form.innerHTML='<label>管理员反馈<textarea maxlength="2000" placeholder="记录认可的合理表达、关键遗漏与下次训练目标"></textarea></label><label>复核结论<select><option value="needs-followup">需继续练习</option><option value="reviewed">已完成复核</option></select></label><button class="btn">保存反馈</button><p role="status"></p>';b.after(form);b.disabled=true;form.querySelector('button').onclick=async()=>{try{const note=form.querySelector('textarea').value.trim();if(!note)return;await api24('/api/review',{userId:b.dataset.reviewUser,attemptId:b.dataset.reviewAttempt,note,status:form.querySelector('select').value});form.querySelector('[role=status]').textContent='反馈已保存';form.querySelector('button').disabled=true}catch(e){form.querySelector('[role=status]').textContent=e.message}}});
  };
 window.GI24_ACTIVE=()=>active;
  window.addEventListener('gi24-leave-training',()=>{if(active&&!active.finishedAt)commit(null,'abandoned')});
  window.addEventListener('pagehide',()=>{if(active&&!active.finishedAt)commit(null,'abandoned')});
})();






