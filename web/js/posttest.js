/* One-month post-use assessment: 10 objective/image items plus 3 rubric-scored clinical answers. */
(function(){
  'use strict';
  const ID='gi-posttest-month1-2026-11-19';
  const VERSION='2026-11-19.1';
  const TITLE='使用一个月后效果测评';
  const questions=[
    {id:'q01',topic:'上消化道出血',q:'58岁患者反复呕血并伴黑便，BP 86/50 mmHg、HR 124次/分。接诊后的优先处理最合适的是？',o:['先口服PPI，观察血压变化','建立静脉通路、复苏并备血，同时进行风险分层','立即安排结肠镜寻找出血点','先做腹部增强CT，结果出来后再处理'],a:1,why:'血流动力学不稳定时先完成复苏、建立通路和备血，再安排针对性内镜评估。'},
    {id:'q02',topic:'消化性溃疡出血',q:'胃镜显示胃角溃疡底部可见裸露血管，按Forrest分级属于哪一类，下一步应如何处理？',o:['Forrest III，常规随访即可','Forrest Ib，仅补液即可','Forrest IIa，应行内镜止血治疗','Forrest IIc，直接开始抗凝'],a:2,why:'裸露血管是Forrest IIa高危征象，需要内镜止血。'},
    {id:'q03',topic:'静脉曲张出血',q:'肝硬化患者大量呕血，怀疑食管胃静脉曲张破裂出血。除复苏外，最合适的早期组合是？',o:['仅静脉PPI，等待胃镜结果','血管活性药、预防性抗菌药，并尽早安排内镜','立即口服普萘洛尔负荷后回家','先行常规胆囊切除术'],a:1,why:'疑似曲张出血时，血管活性药和预防性抗菌药应尽早启动，并尽快内镜治疗。'},
    {id:'q04',topic:'急性胆管炎',q:'发热、黄疸、右上腹痛并出现低血压，影像提示胆总管结石。最符合优先级的方案是？',o:['只观察肝酶变化，待自然排石','先做择期胃镜，胆道处理可延后','先长期口服利胆药，再决定是否抗感染','复苏、尽快抗感染，并评估急诊胆道引流'],a:3,why:'感染性休克风险下要同步复苏和抗感染，并尽快解除胆道梗阻，通常评估ERCP引流。'},
    {id:'q05',topic:'急性胰腺炎',q:'关于急性胰腺炎的诊断，以下哪项最符合常用诊断原则？',o:['只要脂肪酶轻度升高即可确诊','必须同时有腹痛、酶升高和影像异常三项','满足典型腹痛、胰酶明显升高、典型影像三者中的两项即可','只有增强CT显示坏死才能诊断'],a:2,why:'通常满足三项诊断标准中的两项即可诊断，不能把影像或单次轻度酶升高作为唯一依据。'},
    {id:'q06',topic:'Barrett食管',q:'Barrett食管活检为肠上皮化生但未见异型增生，较合适的管理方向是？',o:['规范抑酸并按规范进行监测随访','直接全段食管ESD','不需要任何随访','立即行TIPS治疗'],a:0,why:'无异型增生时通常以规范抑酸和高质量监测为主，是否根除治疗需结合病理和专科评估。'},
    {id:'q07',type:'image',topic:'胃窦血管扩张症',q:'图像所示的“西瓜胃”样表现，最符合下列哪种疾病？',src:'assets/procedure/lesions/apc_gave.png',alt:'胃窦血管扩张症教学图像',o:['胃窦血管扩张症（GAVE）','门脉高压性胃病（PHG）','食管静脉曲张','早期胃癌'],a:0,why:'胃窦放射状红色条纹的“西瓜胃”是GAVE的典型教学表现。'},
    {id:'q08',type:'image',topic:'镜下解剖',q:'图像展示的结构最接近下列哪一项？',src:'assets/anatomy/major_papilla.jpg',alt:'十二指肠大乳头教学图像',o:['胃角','十二指肠大乳头','食管胃结合部Z线','回盲瓣'],a:1,why:'该图用于训练十二指肠大乳头的镜下定位。'},
    {id:'q09',type:'image',topic:'早期胃癌与ESD评估',q:'图像所示病变更适合用于哪一类训练主题？',src:'assets/procedure/lesions/esd_early_gastric_cancer.jpg',alt:'早期胃癌内镜教学图像',o:['早期胃癌的边界、浸润深度与ESD适应证评估','单纯痔出血分型','食管静脉曲张套扎定位','胆总管结石的超声诊断'],a:0,why:'该素材用于早期胃癌的病变识别、边界判断和内镜切除决策训练。'},
    {id:'q10',type:'image',topic:'胃镜路线识别',q:'图像所示部位最符合哪一个胃镜解剖地标？',src:'assets/anatomy/gastric_antrum.jpg',alt:'胃窦教学图像',o:['胃窦','食管上段','结肠脾曲','回肠末端'],a:0,why:'该素材用于胃窦部位识别和胃镜路线训练。'}
  ];
  const subjective=[
    {id:'s01',topic:'上消化道出血处置',q:'病例：58岁患者呕血、黑便，BP 86/50 mmHg、HR 124次/分，Hb 69 g/L，既往长期服用NSAID。请写出接诊后前10分钟的处置顺序，并说明每一步的目的。',criteria:[
      {label:'监护并评估气道/循环',terms:['监护','生命体征','血流动力学','气道','ABC'],weight:2},{label:'建立静脉通路并抽血备血',terms:['静脉通路','两条','粗针','交叉配血','备血','抽血'],weight:2},{label:'复苏与血液制品',terms:['复苏','晶体','输血','红细胞','血制品'],weight:2},{label:'静脉PPI及停用NSAID',terms:['PPI','质子泵','艾司奥美拉唑','奥美拉唑','NSAID','停用止痛药'],weight:1},{label:'安排早期胃镜和止血',terms:['胃镜','内镜','24小时','12小时','止血'],weight:2},{label:'考虑病因处理',terms:['幽门螺杆菌','H. pylori','根除','病因'],weight:1}]},
    {id:'s02',topic:'急性胆管炎处置',q:'病例：患者发热、黄疸、右上腹痛，出现意识模糊和低血压；影像提示胆总管结石及胆道扩张。请写出初始诊疗计划，说明何时需要胆道引流。',criteria:[
      {label:'按感染性休克评估并复苏',terms:['监护','复苏','补液','血流动力学','感染性休克','升压药'],weight:2},{label:'培养与实验室评估',terms:['血培养','培养','血常规','肝功能','乳酸','凝血'],weight:1},{label:'及时静脉抗菌药',terms:['抗菌','抗生素','广谱','经验性'],weight:2},{label:'解除胆道梗阻',terms:['胆道引流','ERCP','引流','减压','乳头切开'],weight:3},{label:'明确升级指征',terms:['低血压','意识模糊','器官功能障碍','不改善','尽快'],weight:2}]},
    {id:'s03',topic:'早期胃癌ESD评估',q:'病例：胃窦浅表隆起病变，放大内镜见边界清楚、表面不规则，活检提示高分化腺癌。请写出决定EMR或ESD前需要核对的关键资料和风险沟通要点。',criteria:[
      {label:'完整描述病变',terms:['部位','大小','边界','形态','放大','NBI','分型'],weight:2},{label:'评估浸润深度',terms:['浸润深度','黏膜内','黏膜下','超声内镜','分期'],weight:2},{label:'核对适应证与切除方式',terms:['ESD','EMR','适应证','整块切除','扩大适应证'],weight:2},{label:'评估溃疡及淋巴血管因素',terms:['溃疡','淋巴管','血管','分化','组织学'],weight:1},{label:'沟通出血穿孔及追加手术',terms:['出血','穿孔','追加手术','风险','病理复核','随访'],weight:2}]}
  ];
  const fold=v=>String(v??'').normalize('NFKC').toLowerCase().replace(/\s+/g,'');
  const escText=v=>typeof esc==='function'?esc(v):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const scoreText=(text,criteria)=>{const value=fold(text);let score=0,max=criteria.reduce((s,c)=>s+c.weight,0),hits=[],misses=[];for(const c of criteria){const ok=c.terms.some(term=>value.includes(fold(term)));if(ok){score+=c.weight;hits.push(c.label)}else misses.push(c.label)}return {score,max,percent:Math.round(score/max*100),hits,misses}};
  const questionHTML=(q,i)=>{const order=GI24.shuffle(q.o.map((_,n)=>n));const image=q.type==='image'?`<div class="posttest-image"><img src="${escText(q.src)}" alt="${escText(q.alt)}"><small>本地教学图像；仅用于识别训练</small></div>`:'';return `<article class="card posttest-question"><span class="tag">${escText(q.topic)} · ${q.type==='image'?'图片识别':'单项选择'}</span><h2>${i+1}. ${escText(q.q)}</h2>${image}<div class="posttest-choices">${order.map((n,k)=>`<label><input type="radio" name="${q.id}" value="${n}"><span>${String.fromCharCode(65+k)}. ${escText(q.o[n])}</span></label>`).join('')}</div></article>`};
  const subjectiveHTML=(q,i)=>`<article class="card posttest-question"><span class="tag">${escText(q.topic)} · 临床问答</span><h2>${i+1}. ${escText(q.q)}</h2><textarea id="${q.id}" rows="7" maxlength="3000" placeholder="请按临床顺序写出判断、处理和理由"></textarea><small class="posttest-help">系统按预设评分点给出初步分数，管理员可结合完整性和安全性复核。</small></article>`;
  function begin(){
    if(session?.role!=='resident')return;
    beginModule24('posttest',ID);const active=GI24_ACTIVE();active.mode='assessment';active.caseFamily='monthly-effect-assessment';active.title=TITLE;active.assessmentVersion=VERSION;
    const qs=questions.map(q=>({...q,order:GI24.shuffle(q.o.map((_,n)=>n))}));
    $('#main').innerHTML=head(TITLE,'用于比较学习一个月后的知识、图片识别和临床表达表现。','后测 · '+VERSION)+`<div class="notice"><b>作答说明：</b>请独立完成。本轮共10道选择/识图题、3道临床问答题；客观题占70分，临床问答占30分。提交后系统保存答案、用时和版本信息，主观题分数为自动初筛，管理员可复核。</div><form id="posttestForm"><section><h2>一、知识点与图片识别（10题）</h2>${qs.map((q,i)=>questionHTML(q,i)).join('')}</section><section><h2>二、临床问答（3题）</h2>${subjective.map((q,i)=>subjectiveHTML(q,i)).join('')}</section><div class="card posttest-submit"><button class="btn" type="submit">提交测评并查看结果</button><button class="btn ghost" type="button" id="posttestExit">暂不提交，退出</button><p id="posttestState" role="status"></p></div></form>`;
    $('#posttestForm').onsubmit=e=>{e.preventDefault();submit(qs)};$('#posttestExit').onclick=()=>{nav('dashboard')};
  }
  function submit(qs){
    const form=$('#posttestForm'),missing=[];let correct=0;const active=GI24_ACTIVE(),responses=[];
    qs.forEach(q=>{const el=form.querySelector(`input[name="${q.id}"]:checked`);if(!el){missing.push(q.id);return}const selected=Number(el.value),ok=selected===q.a;if(ok)correct++;moduleResponse24(q.q,q.o,selected,ok,q.a,q.why);responses.push({questionId:q.id,type:q.type||'single',topic:q.topic,selected,answer:q.o[selected],correct:ok,correctIndex:q.a,order:q.order,at:new Date().toISOString()})});
    let subjectTotal=0;const results=subjective.map(q=>{const text=form.querySelector('#'+q.id).value.trim();if(!text)missing.push(q.id);const result=scoreText(text,q.criteria);subjectTotal+=result.score;responses.push({questionId:q.id,type:'subjective',topic:q.topic,question:q.q,answer:text,score:result.score,maxScore:result.max,criteria:result.hits,missingCriteria:result.misses,at:new Date().toISOString()});return {...result,id:q.id}});
    if(missing.length){$('#posttestState').textContent='请完成全部13题后再提交。';return}
    const objectiveScore=Math.round(correct/qs.length*70),subjectiveMax=subjective.reduce((s,q)=>s+q.criteria.reduce((x,c)=>x+c.weight,0),0),subjectiveScore=Math.round(subjectTotal/subjectiveMax*30),score=objectiveScore+subjectiveScore;
    active.responses=responses;active.objectiveCorrect=correct;active.objectiveTotal=qs.length;active.objectiveScore=objectiveScore;active.subjectiveScore=subjectiveScore;active.subjectiveResults=results;active.decisionScore=score;active.completeness=100;finishModule24('posttest',TITLE,score);renderResult(correct,objectiveScore,subjectiveScore,score,results);
  }
  function renderResult(correct,objectiveScore,subjectiveScore,score,results){$('#main').innerHTML=head('月末效果测评已提交','结果已写入集中学习记录；主观问答分数为自动初筛分，管理员可复核。','已保存')+`<div class="grid g4">${metric('总分',score+'%','客观70% + 主观30%')}${metric('客观题',objectiveScore+'/70',`${correct}/10题`)}${metric('临床问答',subjectiveScore+'/30','规则初筛')}${metric('用时','已保存','详见学习记录')}</div><div class="card"><h2>临床问答自动评分</h2>${results.map((r,i)=>`<details open><summary>第${i+1}题：${r.score}/${r.max}分（${r.percent}%）</summary><p>已覆盖：${r.hits.length?r.hits.map(escText).join('、'):'暂无'}</p><p>待复核：${r.misses.length?r.misses.map(escText).join('、'):'无'}</p></details>`).join('')}<p class="mini">该分数用于形成性反馈和研究初步统计，不替代教师对临床安全性、完整性和合理替代方案的复核。</p><button class="btn" onclick="nav('report')">查看学习记录</button><button class="btn ghost" onclick="nav('dashboard')">返回学习首页</button></div>`}
  window.posttest=begin;
})();
