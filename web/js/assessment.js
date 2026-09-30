/* Learner-facing assessment and teacher pre/post comparison. */
(function(){
 'use strict';
 const A=window.GI24_ASSESSMENT;if(!A)return;
 let run=null;
 const e=value=>typeof esc==='function'?esc(value):String(value??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 const attempts=p=>(p?.v24?.attempts||[]).filter(x=>x.kind==='assessment'&&x.caseId===A.ID&&x.status!=='abandoned');
 const phase=count=>count===0?{key:'pre',label:'首次测评',title:`${A.TITLE}（首次测评）`}:count===1?{key:'post',label:'学习后复测',title:`${A.TITLE}（学习后复测）`}:{key:'extra',label:'额外重测',title:`${A.TITLE}（额外重测）`};
 const scoreText=v=>typeof v==='number'?v+'%':'—';
 function comparison(p){const rows=attempts(p);return {pre:rows[0]||null,post:rows[1]||null,extra:rows.slice(2)}}
 function activate(){document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.v==='assessment'))}
 function assessmentHome(){
   if(session?.role!=='resident')return;
   activate();const c=comparison(prof()),next=phase(attempts(prof()).length),done=!!c.post;
   const metrics=done?`${metric('首次测评',scoreText(c.pre?.decisionScore),'前测')}${metric('学习后复测',scoreText(c.post?.decisionScore),'后测')}${metric('分数变化',(c.post.decisionScore-c.pre.decisionScore>0?'+':'')+(c.post.decisionScore-c.pre.decisionScore)+'分','后测－前测')}`:`${metric('题目数量','10题','均为单选题')}${metric('首次测评',c.pre?'已完成':'未完成',c.pre?'分数暂不向学员显示':'建议学习前完成')}${metric('学习后复测','未完成','完成软件训练后进行')}`;
   $('#main').innerHTML=head(A.TITLE,'围绕病例推理、急症处置、内镜解剖与操作安全。首次和复测分别保存，供管理员做前后比较。',`题库 ${A.VERSION}`)+`<div class="grid g3">${metrics}</div><section class="card assessment-intro"><h2>${done?'前后测已完成':next.label}</h2><p>${!c.pre?'请在系统学习前完成首次测评。提交后暂不显示分数和答案，减少对后续复测的影响。':!c.post?'首次测评已经保存。请按教学安排完成软件学习后，再使用同一套题进行复测。':'系统已保留两次原始记录；额外练习不会替代前后测。'}</p><div class="notice"><b>测评说明：</b>题序和选项顺序每次随机；每题只能提交一次。该结果用于形成性教学评价，不代表临床能力认证。正式研究仍需伦理审查、方案预注册和题目效度检验。</div><button class="btn" id="assessmentStart24">${!c.pre?'开始首次测评':!c.post?'开始学习后复测':'进行额外重测'}</button></section>${done?reviewSummary(c):''}`;
   $('#assessmentStart24').onclick=startAssessment;
 }
 function reviewSummary(c){
   const rows=[c.pre,c.post,...c.extra].filter(Boolean);
   return `<section class="card"><h2>测评记录</h2><div class="table-wrap"><table class="table"><tr><th>轮次</th><th>完成时间</th><th>用时</th><th>成绩</th></tr>${rows.map((x,i)=>`<tr><td>${i===0?'首次测评':i===1?'学习后复测':'额外重测 '+(i-1)}</td><td>${e(new Date(x.finishedAt).toLocaleString())}</td><td>${e(Math.round((x.durationSeconds||0)/60*10)/10)} 分钟</td><td>${scoreText(x.decisionScore)}</td></tr>`).join('')}</table></div></section>`;
 }
 function startAssessment(){
   const previous=attempts(prof()),p=phase(previous.length);
   beginModule24('assessment',A.ID);
   run={phase:p,questionOrder:GI24.shuffle(A.QUESTIONS.map((_,i)=>i)),index:0,answers:[],startedAt:new Date().toISOString(),locked:false};
   renderQuestion();
 }
 function renderQuestion(){
   const originalQuestionIndex=run.questionOrder[run.index],q=A.QUESTIONS[originalQuestionIndex],order=GI24.shuffle(q.options.map((_,i)=>i));run.current={originalQuestionIndex,order};run.locked=false;
   $('#main').innerHTML=head(run.phase.label,`${A.TITLE} · 第 ${run.index+1} 题，共 ${A.QUESTIONS.length} 题`,q.domain)+`<div class="assessment-progress" aria-label="答题进度"><i style="width:${Math.round(run.index/A.QUESTIONS.length*100)}%"></i></div><section class="card quiz24 assessment-question"><span class="tag">${e(q.domain)}</span><h2>${run.index+1}. ${e(q.question)}</h2><div class="choices" data-fixed-order="1">${order.map((optionIndex,displayIndex)=>`<button class="choice" data-original-index24="${optionIndex}" data-assessment-answer="${optionIndex}">${String.fromCharCode(65+displayIndex)}. ${e(q.options[optionIndex])}</button>`).join('')}</div><div id="assessmentState24" role="status"></div><button class="btn hidden" id="assessmentNext24">${run.index===A.QUESTIONS.length-1?'提交本次测评':'下一题'}</button></section><p class="mini assessment-footnote">本次不在答题过程中显示正误，全部提交后再按测评轮次提供反馈。</p>`;
   document.querySelectorAll('[data-assessment-answer]').forEach(button=>button.onclick=()=>selectAnswer(Number(button.dataset.assessmentAnswer),button));
 }
 function selectAnswer(selected,button){
   if(run.locked)return;run.locked=true;const q=A.QUESTIONS[run.current.originalQuestionIndex],correct=selected===q.answer;
   run.answers.push({questionIndex:run.current.originalQuestionIndex,selected,correct,order:run.current.order});
   moduleResponse24(q.question,q.options,selected,correct,q.answer,q.explanation);
   document.querySelectorAll('[data-assessment-answer]').forEach(x=>{x.disabled=true;if(x===button)x.classList.add('selected')});
   $('#assessmentState24').className='feedback mid';$('#assessmentState24').textContent='本题作答已记录。';
   const next=$('#assessmentNext24');next.classList.remove('hidden');next.onclick=()=>{run.index++;run.index<A.QUESTIONS.length?renderQuestion():finishAssessment()};
 }
 function finishAssessment(){
   const correct=run.answers.filter(x=>x.correct).length,score=Math.round(correct/A.QUESTIONS.length*100),p=run.phase;
   finishModule24('assessment',p.title,score);
   const c=comparison(prof()),isPre=p.key==='pre';
   $('#main').innerHTML=head('测评已保存',p.title,`${correct}/${A.QUESTIONS.length}`)+`<div class="grid g3">${isPre?`${metric('本次状态','已完成','分数暂不向学员显示')}${metric('作答题数',A.QUESTIONS.length,'全部完成')}${metric('下一步','完成软件训练','按教师安排复测')}`:`${metric('本次成绩',score+'%',`${correct}/${A.QUESTIONS.length}`)}${metric('首次测评',scoreText(c.pre?.decisionScore),'前测')}${metric('分数变化',c.pre?(score-c.pre.decisionScore>0?'+':'')+(score-c.pre.decisionScore)+'分':'—','本次－首次')}`}</div><section class="card"><h2>${isPre?'首次测评记录已锁定':'本次答题复盘'}</h2><p>${isPre?'为减少题目反馈对学习后复测的影响，本轮不展示分数、正确答案和解析；管理员后台已经保存原始成绩、用时和逐题正误。':'以下内容用于学习复盘；正式教学研究应按预设方案使用前两次记录。'}</p>${isPre?'':answerReview()}<div class="row"><button class="btn" onclick="nav('dashboard')">返回学习首页</button><button class="btn ghost" onclick="nav('assessment')">查看测评记录</button></div></section>`;
   run=null;
 }
 function answerReview(){return `<div class="assessment-review">${run.answers.map((a,i)=>{const q=A.QUESTIONS[a.questionIndex];return `<details><summary>${a.correct?'✓':'需复习'} ${i+1}. ${e(q.question)}</summary><p><b>你的选择：</b>${e(q.options[a.selected])}</p><p><b>正确答案：</b>${e(q.options[q.answer])}</p><p>${e(q.explanation)}</p><p class="mini">依据：${e(q.source)}</p></details>`}).join('')}</div>`}
 function dashboardCard(){
   if(session?.role!=='resident'||document.getElementById('assessmentDash24'))return;
   const c=comparison(prof()),host=$('#main');if(!host)return;const box=document.createElement('section');box.id='assessmentDash24';box.className='card assessment-dash';box.innerHTML=`<span class="pill">10题小测</span><h2>${e(A.TITLE)}</h2><p>${!c.pre?'建议在开始系统学习前完成首次测评。':!c.post?'首次测评已保存；完成学习后再进行复测。':'前后测均已保存，可在测评页查看比较。'}</p><button class="btn" id="assessmentDashGo24">${!c.pre?'开始首次测评':!c.post?'进入学习后复测':'查看测评记录'}</button>`;const anchor=host.querySelector('.notice');if(anchor)anchor.after(box);else host.prepend(box);box.querySelector('button').onclick=()=>nav('assessment');
 }
 function teacherBlock(){
   if(session?.role!=='teacher'||document.getElementById('assessmentTeacher24'))return;
   const host=$('#main');if(!host)return;const rows=Object.entries(db.profiles||{}).map(([name,p])=>{const c=comparison(p),delta=c.pre&&c.post?c.post.decisionScore-c.pre.decisionScore:null;return {name,participantId:p.v24?.participantId||'',pre:c.pre,post:c.post,delta}});
   const box=document.createElement('section');box.id='assessmentTeacher24';box.className='card';box.innerHTML=`<div class="section"><div><h2>10题小测前后对照</h2><small>首次完成记为前测，第二次完成记为学习后复测；额外重测不进入主比较。</small></div><button class="btn ghost" id="assessmentExport24">导出前后测 CSV</button></div><div class="table-wrap"><table class="table"><tr><th>学员</th><th>研究编号</th><th>前测</th><th>后测</th><th>变化</th><th>状态</th></tr>${rows.map(r=>`<tr><td>${e(r.name)}</td><td>${e(r.participantId)}</td><td>${scoreText(r.pre?.decisionScore)}</td><td>${scoreText(r.post?.decisionScore)}</td><td>${r.delta==null?'—':(r.delta>0?'+':'')+r.delta+'分'}</td><td>${r.post?'已完成前后测':r.pre?'待复测':'待首次测评'}</td></tr>`).join('')||'<tr><td colspan="6">暂无学员测评记录。</td></tr>'}</table></div>`;host.appendChild(box);box.querySelector('button').onclick=exportAssessment;
 }
 function exportAssessment(){
   const rows=Object.entries(db.profiles||{}).map(([name,p])=>{const c=comparison(p);return {username:name,participantId:p.v24?.participantId||'',assessmentId:A.ID,assessmentVersion:A.VERSION,preAttemptId:c.pre?.id||'',preScore:c.pre?.decisionScore??'',preStartedAt:c.pre?.startedAt||'',preFinishedAt:c.pre?.finishedAt||'',preDurationSeconds:c.pre?.durationSeconds??'',postAttemptId:c.post?.id||'',postScore:c.post?.decisionScore??'',postStartedAt:c.post?.startedAt||'',postFinishedAt:c.post?.finishedAt||'',postDurationSeconds:c.post?.durationSeconds??'',scoreChange:c.pre&&c.post?c.post.decisionScore-c.pre.decisionScore:''}});
   download24('GI_Resident_AI_pre_post_assessment_'+new Date().toISOString().slice(0,10)+'.csv',GI24.csv(rows),'text/csv;charset=utf-8');
 }
 window.assessment24=assessmentHome;window.exportAssessment24=exportAssessment;
 const baseBuildNav=window.buildNav;window.buildNav=function(){baseBuildNav();if(session?.role!=='resident')return;const host=$('#nav');if(!host||host.querySelector('[data-v=assessment]'))return;const button=document.createElement('button');button.dataset.v='assessment';button.textContent='🧠 10题小测';const before=host.querySelector('[data-v=report]');host.insertBefore(button,before||null);button.onclick=()=>nav('assessment')};
 const baseNav=window.nav;window.nav=function(route){if(route==='assessment'){assessmentHome();window.logActivity24?.('navigation',{route:'assessment'});return}return baseNav(route)};
 const baseDashboard=window.dashboard;window.dashboard=function(){const result=baseDashboard();dashboardCard();return result};
 const baseTeacher=window.teacher;window.teacher=async function(){const result=await baseTeacher();teacherBlock();return result};
})();
