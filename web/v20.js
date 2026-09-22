// GI Resident AI v20: dynamic progression, rescue drills, structured reporting and multimodal integration.
(function(){
const DYNAMIC_CASES=[
 {id:'dyn-bleed',title:'上消化道出血：从接诊到再评估',system:'急诊消化',level:'核心',intro:'患者到达抢救区后仍有活动性出血风险。你的选择会推动时间，并改变生命体征与后续窗口。',initial:{bp:'86/54',hr:'124',spo2:'96%',mental:'清醒焦虑'},steps:[
  {q:'到达后的第一个处置组合是什么？',choices:[
   {label:'立即建立监护与静脉通路，启动复苏、备血并同步评估',score:100,minutes:5,vitals:{bp:'94/60',hr:'112',spo2:'97%',mental:'清醒'},note:'先稳定循环并为后续止血创造条件，时间窗仍然可控。'},
   {label:'先完成完整病史和全部检查，再开始处理',score:35,minutes:18,vitals:{bp:'78/46',hr:'132',spo2:'95%',mental:'烦躁'},note:'关键处置被延迟，循环状态继续恶化。'},
   {label:'不做复苏，直接转入内镜室',score:10,minutes:10,vitals:{bp:'72/42',hr:'138',spo2:'93%',mental:'嗜睡'},note:'未先处理不稳定状态，转运和操作风险显著增加。'}]},
  {q:'首轮处置后，下一步最重要的动作是什么？',choices:[
   {label:'复测生命体征和灌注状态，核对关键检查并判断是否需要升级支持',score:100,minutes:10,vitals:{bp:'102/66',hr:'98',spo2:'98%',mental:'清醒'},note:'再评估把处置从一次动作变成闭环。'},
   {label:'患者暂时没有再呕血，停止监测等待明天查房',score:20,minutes:30,vitals:{bp:'82/50',hr:'121',spo2:'95%',mental:'乏力'},note:'暂时安静不等于风险解除，错过了再次恶化信号。'},
   {label:'重复开同一批检查，但不查看趋势',score:45,minutes:20,vitals:{bp:'90/55',hr:'114',spo2:'96%',mental:'清醒'},note:'检查数量不能代替趋势判断和床旁再评估。'}]},
  {q:'循环状态改善后，如何进入确定性处理阶段？',choices:[
   {label:'在持续监护下衔接内镜评估与止血路径，并预设失败后的升级方案',score:100,minutes:20,vitals:{bp:'108/70',hr:'92',spo2:'98%',mental:'清醒'},note:'稳定、诊断、止血和升级预案形成完整路径。'},
   {label:'只要血压恢复就立即出院观察',score:0,minutes:8,vitals:{bp:'88/56',hr:'118',spo2:'96%',mental:'头晕'},note:'短暂改善不能替代病因处理和风险监测。'},
   {label:'继续无限补液，不再推进病因评估',score:40,minutes:35,vitals:{bp:'96/62',hr:'108',spo2:'97%',mental:'清醒'},note:'支持治疗重要，但不能无限延迟确定性处理。'}]}
 ]},
 {id:'dyn-cholangitis',title:'隐匿性胆管炎：识别恶化窗口',system:'胰胆急症',level:'进阶',intro:'高龄患者症状并不典型，但意识和循环正在变化。需要用连续信息判断病情，而不是等待经典表现全部出现。',initial:{bp:'96/62',hr:'108',spo2:'95%',mental:'反应慢'},steps:[
  {q:'面对非典型表现，第一步如何组织评估？',choices:[
   {label:'同步评估感染、器官功能和胆道梗阻线索，并持续监测',score:100,minutes:8,vitals:{bp:'98/64',hr:'104',spo2:'96%',mental:'可交流'},note:'把非典型表现放入感染和梗阻框架，避免锚定偏差。'},
   {label:'没有完整经典三联征，按普通乏力处理',score:10,minutes:35,vitals:{bp:'82/48',hr:'122',spo2:'94%',mental:'嗜睡'},note:'等待经典表现造成识别延误。'},
   {label:'只关注肝酶，不评估循环和意识变化',score:35,minutes:20,vitals:{bp:'88/54',hr:'116',spo2:'94%',mental:'反应更慢'},note:'单项化验不能代表患者整体状态。'}]},
  {q:'监测发现循环和意识恶化，下一步重点是什么？',choices:[
   {label:'升级复苏与监护，同时尽快协调解除梗阻的确定性路径',score:100,minutes:12,vitals:{bp:'104/68',hr:'98',spo2:'97%',mental:'改善'},note:'支持治疗与病因控制同步推进。'},
   {label:'继续等待下一次常规查房再决定',score:0,minutes:45,vitals:{bp:'74/40',hr:'132',spo2:'91%',mental:'难唤醒'},note:'等待使可逆窗口明显缩小。'},
   {label:'只重复影像，不做床旁支持',score:30,minutes:28,vitals:{bp:'84/50',hr:'120',spo2:'93%',mental:'嗜睡'},note:'获取信息不能替代立即的支持与升级处置。'}]},
  {q:'进入确定性处理前，团队沟通应包含什么？',choices:[
   {label:'说明病情趋势、已完成支持、拟解除梗阻方案及失败后的替代路径',score:100,minutes:8,vitals:{bp:'110/72',hr:'92',spo2:'98%',mental:'清醒'},note:'清晰交班让多学科团队围绕同一风险模型行动。'},
   {label:'只说“患者黄疸，请会诊”',score:35,minutes:15,vitals:{bp:'96/60',hr:'106',spo2:'96%',mental:'反应慢'},note:'缺乏趋势和任务信息，会增加协作成本。'},
   {label:'不交班，等待其他科室自行阅读全部记录',score:10,minutes:25,vitals:{bp:'88/52',hr:'116',spo2:'94%',mental:'嗜睡'},note:'高风险病例需要主动、结构化的信息传递。'}]}
 ]}
];

const RESCUE_CASES=[
 {id:'rescue-hypoxia',title:'镇静相关低氧',severity:'高危',intro:'操作中 SpO₂ 持续下降，患者鼾声明显、胸廓起伏减弱。',steps:[
  {q:'第一反应是什么？',o:['继续操作，等监护仪自行恢复','暂停操作并立即评估气道、呼吸和循环','先离开房间寻找病历'],a:1,why:'先停止刺激并快速完成气道、呼吸、循环评估，识别可逆原因。'},
  {q:'初步判断为上气道梗阻，团队下一步如何配合？',o:['进行基础气道开放与氧合支持，同时呼叫支援','只把氧流量调高，其他都不做','继续追加镇静以减少挣扎'],a:0,why:'基础气道处理、氧合、监测和及时支援要并行。'},
  {q:'处理后仍未恢复，应如何升级？',o:['继续等待','按机构急救流程升级通气与复苏支持，并明确团队分工','立即结束记录并让患者独自观察'],a:1,why:'持续低氧需要尽快升级，避免把单一措施重复到失去时间窗。'}]},
 {id:'rescue-perforation',title:'术中疑似穿孔',severity:'高危',intro:'黏膜切除后出现深部结构暴露，患者腹痛加重，镜下可疑壁缺损。',steps:[
  {q:'最先应该做什么？',o:['继续扩大切除以确认范围','停止当前操作，减少进一步损伤并系统评估缺损','用力注气获得更清楚视野'],a:1,why:'先停止造成损伤的动作，并减少可能加重后果的操作。'},
  {q:'评估后认为缺损可内镜处理，下一步原则是什么？',o:['根据缺损位置和大小选择闭合策略，同时持续观察患者状态','忽略全身状态，只关注画面','完成原计划全部切除后再考虑'],a:0,why:'局部闭合与患者整体监测必须同时进行。'},
  {q:'离开内镜室前必须完成哪项闭环？',o:['只在口头上提到一下','记录事件、通知相关团队并制定监测及升级预案','删除操作图片避免误解'],a:1,why:'完整记录、交班、监测和升级标准是安全闭环的一部分。'}]},
 {id:'rescue-bleeding',title:'术中活动性出血',severity:'紧急',intro:'ESD 剥离中突然出现喷射样出血，视野迅速被血液遮挡。',steps:[
  {q:'首要目标是什么？',o:['盲目继续切开','保持定位并恢复视野，识别出血点和循环影响','立即拔镜且不做交班'],a:1,why:'先恢复可视性、定位出血点并同时评估患者状态。'},
  {q:'准备止血时应如何选择策略？',o:['根据出血性质、位置和当前器械选择可控的止血方式','随机反复使用所有器械','只提高能量，不再观察组织反应'],a:0,why:'止血需要目标明确、能量和机械策略可控，并持续观察效果。'},
  {q:'出血控制后还要做什么？',o:['立即结束，不再检查','复查止血效果和潜在损伤，记录事件并安排后续监测','删除过程记录'],a:1,why:'确认止血、识别继发损伤和制定监测计划才能真正闭环。'}]}
];

const REPORT_CASES=[
 {id:'report-egc',title:'胃窦微隆起病灶',badge:'胃镜报告',img:'assets/cases/early_gastric_cancer.jpg',vignette:'61岁男性，筛查胃镜发现胃窦小弯侧约12 mm微隆起病灶，表面结构不规则，已完成靶向活检。',defaults:{indication:'早癌筛查',extent:'检查至十二指肠降部',quality:'视野清晰，观察条件良好',location:'胃窦小弯侧',description:'约12 mm微隆起病灶，边界可辨，表面结构不规则',intervention:'靶向活检',specimen:'病灶活检标本送病理',complication:'未见即时并发症',impression:'胃窦表浅病变，性质待病理',plan:'结合病理及进一步分期评估'},checks:[['location',['胃窦']],['description',['12mm','隆起','不规则']],['intervention',['活检']],['specimen',['病理']],['impression',['表浅','病变']]]},
 {id:'report-polyp',title:'乙状结肠息肉切除',badge:'肠镜报告',img:'assets/procedure/lesions/emr_sigmoid_adenoma.jpg',vignette:'56岁女性，筛查肠镜于乙状结肠见约10 mm带蒂息肉，完成圈套切除并回收标本，创面无活动性出血。',defaults:{indication:'结直肠肿瘤筛查',extent:'进镜至回盲部，退镜观察完整',quality:'肠道准备可评价，视野满足观察',location:'乙状结肠',description:'约10 mm带蒂息肉，表面轻度充血',intervention:'圈套器完整切除',specimen:'标本完整回收并送病理',complication:'创面无活动性出血，未见即时并发症',impression:'乙状结肠息肉切除术后',plan:'等待病理后确定复查计划'},checks:[['extent',['回盲']],['location',['乙状']],['description',['10mm','带蒂']],['intervention',['圈套','切除']],['specimen',['回收','病理']]]}
];

const MULTI_CASES=[
 {id:'multi-egc',title:'胃表浅病变：是否具备局部治疗路径',summary:'将白光内镜、分层评估和病理结果放到同一判断中。',evidence:[
  {type:'内镜',title:'胃窦病灶',img:'assets/cases/early_gastric_cancer.jpg',text:'胃窦小弯侧微隆起病灶，边界相对清楚，表面结构不规则。'},
  {type:'EUS / 影像',title:'分层与转移线索',text:'病灶主要位于浅层；目前未见明确深层侵犯或可疑远处转移线索。'},
  {type:'病理',title:'靶向活检',text:'提示上皮性肿瘤性病变，需要结合完整病灶及分层信息决定治疗路径。'}],q:'综合三类证据，下一步最合理的思考方式是？',o:['只看活检名称，忽略病灶范围和分层','整合病灶边界、浸润深度、病理与全身分期，进入局部治疗适应证评估','因为病灶较小，不再需要任何评估'],a:1,why:'局部治疗决策需要内镜形态、浸润风险、病理和全身信息相互印证。'},
 {id:'multi-crohn',title:'回结肠炎症：范围、活动度与组织学',summary:'把肠镜所见、横断面影像和病理放进统一疾病模型。',evidence:[
  {type:'肠镜',title:'节段性黏膜病变',img:'assets/cases/crohn_colitis.jpg',text:'回盲部及邻近结肠见节段性溃疡和充血，病变分布不连续。'},
  {type:'MRE / CT',title:'肠壁与肠外信息',text:'末段回肠壁增厚，周围脂肪间隙改变；未见明确游离穿孔征象。'},
  {type:'病理',title:'多点活检',text:'慢性活动性炎症改变；需与感染、药物及其他炎症性疾病鉴别。'}],q:'这些证据应如何被使用？',o:['只依据单张内镜图确诊并分级','结合临床、分布特征、横断面影像与组织学，同时排除重要鉴别','病理未给出单一名称，因此所有证据都无效'],a:1,why:'多模态证据用于确认疾病模式、范围、并发症和鉴别，而不是让某一项结果独立承担全部结论。'},
 {id:'multi-bleed',title:'间歇性消化道出血：定位与时序',summary:'用血流动力学、CTA和内镜线索共同确定下一步。',evidence:[
  {type:'内镜',title:'可疑责任病灶',img:'assets/cases/ulcer_visible_vessel.jpg',text:'溃疡底见可疑裸露血管，但检查时未见持续喷射。'},
  {type:'CTA',title:'活动性线索',text:'扫描期未见明确造影剂外溢；阴性结果需要结合出血是否间歇及检查时机解释。'},
  {type:'实验室 / 趋势',title:'循环与血红蛋白',text:'复测提示血红蛋白继续下降，心率仍快，提示出血风险尚未解除。'}],q:'如何解释“CTA阴性但临床仍不稳定”？',o:['CTA阴性可以完全排除继续出血','结合检查时机和间歇性出血特点，继续围绕责任病灶与临床趋势推进评估和处置','只比较一次血红蛋白数值，不看生命体征'],a:1,why:'影像阴性必须放在时间轴中解释；持续的临床风险信号不能被单次阴性结果覆盖。'}
];

let dynamicState=null,rescueState=null,reportState=null,multiState=null;
const MODULE_LABELS={dynamic:'动态病程',rescue:'并发症抢救',reports:'报告质控',multimodal:'多模态病例'};

function ensureV20(p){
 if(!p)return p;
 p.v20=p.v20||{};
 ['dynamic','rescue','reports','multimodal'].forEach(k=>p.v20[k]=p.v20[k]||{best:0,runs:0,last:null});
 p.v20.history=p.v20.history||[];
 return p;
}
function v20Profile(){return ensureV20(prof())}
function recordV20(kind,title,score){let p=v20Profile(),s=p.v20[kind];s.best=Math.max(s.best||0,score);s.latest=score;s.runs=(s.runs||0)+1;s.last=new Date().toISOString();p.v20.history.unshift({kind,title,score,at:s.last});p.xp=(p.xp||0)+Math.max(5,Math.round(score/5));if(window.finishModule24)finishModule24(kind,title,score);save()}
function addV20Wrong(kind,title,q,picked,right,why){let p=v20Profile();p.wrong.unshift({caseId:'V20-'+kind.toUpperCase(),caseTitle:title,q,picked,right,why,at:new Date().toISOString()});save()}
function stat(kind){let p=v20Profile();return p.v20[kind]||{best:0,runs:0}}
function v20Disclaimer(){return '<div class="v20-disclaimer"><b>教学边界：</b>本模块用于临床思维、团队协作和报告规范训练，不替代本院流程、实时上级医师决策、硬件模拟器或导师监督下的真实操作。</div>'}
function activateNav(v){$$('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.v===v))}

function v20Hub(){let p=v20Profile();$('#main').innerHTML=head('临床能力闭环 v20','从“知道答案”继续训练病程判断、危机处置、报告表达与跨模态整合。','NEW · V20')+`<div class="v20-hub">
 ${moduleCard('dynamic','⏱️','动态病程模拟','每个选择都会推动时间并改变生命体征，训练优先级、再评估和升级时机。',p.v20.dynamic,'开始动态病例')}
 ${moduleCard('rescue','🚨','并发症抢救中心','面对低氧、穿孔和活动性出血，完成停止—评估—处置—交班闭环。',p.v20.rescue,'进入抢救训练')}
 ${moduleCard('reportlab','📋','内镜报告与质控','根据病例完成结构化报告，系统检查完整性、病灶描述和标本记录。',p.v20.reports,'开始报告训练')}
 ${moduleCard('multimodal','🧩','多模态联合病例','逐步解锁内镜、CT/MR/EUS、病理和趋势数据，再做综合判断。',p.v20.multimodal,'开始联合推理')}
 </div>${v20Disclaimer()}`}
function moduleCard(cls,icon,title,desc,s,cta){let kind=cls==='reportlab'?'reports':cls;return `<section class="card v20-module ${cls}"><div class="module-icon">${icon}</div><h2>${title}</h2><p>${desc}</p><div class="module-stat">最近一次 ${s.latest||0}% · 已完成 ${s.runs||0} 轮</div><button class="btn" onclick="nav('${kind}')">${cta}</button></section>`}

function dynamicHub(){let s=stat('dynamic');$('#main').innerHTML=head('动态病程模拟','时间会前进，生命体征会响应。关键不是多点按钮，而是选择正确的先后顺序。',`最近一次 ${s.latest||0}%`)+`<div class="v20-casegrid">${DYNAMIC_CASES.map(c=>`<section class="card v20-case"><span class="v20-badge">${c.level} · ${c.system}</span><h3>${c.title}</h3><p>${c.intro}</p><button class="btn" onclick="startDynamic('${c.id}')">开始病例</button></section>`).join('')}</div>${v20Disclaimer()}`}
function startDynamic(id){if(window.beginModule24)beginModule24('dynamic',id);let c=DYNAMIC_CASES.find(x=>x.id===id);dynamicState={id,index:0,time:0,score:0,vitals:{...c.initial},logs:[{time:0,title:'到达抢救区',text:c.intro}],locked:false,feedback:null};renderDynamic()}
function renderDynamic(){let c=DYNAMIC_CASES.find(x=>x.id===dynamicState.id),st=c.steps[dynamicState.index],S=dynamicState;$('#main').innerHTML=head(c.title,c.intro,`STEP ${S.index+1}/${c.steps.length}`)+`<div class="sim-shell"><section class="sim-monitor"><div class="row" style="justify-content:space-between"><span class="v20-badge">LIVE SIMULATION</span><span class="sim-clock">T + ${S.time} min</span></div><div class="vitals-grid">${vital('BP',S.vitals.bp,true)}${vital('HR',S.vitals.hr,+String(S.vitals.hr).replace(/\D/g,'')>115)}${vital('SpO₂',S.vitals.spo2,parseInt(S.vitals.spo2)<94)}${vital('意识',S.vitals.mental,S.vitals.mental!=='清醒'&&S.vitals.mental!=='可交流')}</div><div class="sim-question"><small>当前决策</small><h2>${st.q}</h2><div class="sim-options">${st.choices.map((o,i)=>`<button class="sim-option ${S.locked?(o.score===100?'correct':i===S.picked?'wrong':''):''}" ${S.locked?'disabled':''} onclick="chooseDynamic(${i})">${String.fromCharCode(65+i)}. ${o.label}</button>`).join('')}</div>${S.feedback?`<div class="feedback ${S.feedback.good?'good':'mid'}"><b>${S.feedback.good?'✓ 时机与优先级正确':'需要调整优先级'}</b><br>${S.feedback.note}</div><button class="btn" style="margin-top:12px" onclick="nextDynamic()">${S.index===c.steps.length-1?'查看动态病程总评':'推进病程 →'}</button>`:''}</div></section><aside class="card"><h2>病程时间轴</h2><div class="timeline">${S.logs.map(l=>`<div class="timeline-item"><b>T + ${l.time} min · ${l.title}</b>${l.text}</div>`).join('')}</div><button class="btn ghost" onclick="dynamicHub()">退出本例</button></aside></div>${v20Disclaimer()}`}
function vital(k,v,alert){return `<div class="vital-tile ${alert?'alert':''}"><span>${k}</span><b>${v}</b></div>`}
function chooseDynamic(i){if(dynamicState.locked)return;let c=DYNAMIC_CASES.find(x=>x.id===dynamicState.id),st=c.steps[dynamicState.index],o=st.choices[i];if(window.moduleResponse24)moduleResponse24(st.q,st.choices.map(x=>x.label),i,o.score===100,st.choices.findIndex(x=>x.score===100),o.note);dynamicState.locked=true;dynamicState.picked=i;dynamicState.time+=o.minutes;dynamicState.score+=o.score;dynamicState.vitals={...o.vitals};dynamicState.feedback={good:o.score===100,note:o.note};dynamicState.logs.push({time:dynamicState.time,title:o.score===100?'完成关键动作':'发生处置偏差',text:o.note});if(o.score<70){let best=st.choices.find(x=>x.score===100);addV20Wrong('dynamic',c.title,st.q,o.label,best.label,o.note)}renderDynamic()}
function nextDynamic(){let c=DYNAMIC_CASES.find(x=>x.id===dynamicState.id);if(dynamicState.index>=c.steps.length-1)return finishDynamic();dynamicState.index++;dynamicState.locked=false;dynamicState.feedback=null;dynamicState.picked=null;renderDynamic()}
function finishDynamic(){let c=DYNAMIC_CASES.find(x=>x.id===dynamicState.id),score=Math.round(dynamicState.score/c.steps.length);recordV20('dynamic',c.title,score);$('#main').innerHTML=head('动态病程完成',c.title,'COURSE COMPLETE')+`<div class="grid g3">${metric('本轮预设路径得分',score+'%','优先级与时机')}${metric('总用时',dynamicState.time+' min','模拟时间')}${metric('关键偏差',dynamicState.logs.filter(x=>x.title==='发生处置偏差').length,'已收入错题')}</div><div class="card" style="margin-top:16px"><h2>${score>=80?'本轮多数决策符合预设路径':'本轮存在需复盘的决策'}</h2><p>复盘时重点关注每次选择之后生命体征为什么改变，以及你是否完成了“行动—再评估—升级”的闭环。</p><div class="row"><button class="btn" onclick="startDynamic('${c.id}')">再练一次</button><button class="btn soft" onclick="dynamicHub()">换一个病例</button><button class="btn ghost" onclick="nav('report')">查看学习记录</button></div></div>`}

function rescueHub(){let s=stat('rescue');$('#main').innerHTML=head('并发症抢救中心','训练突发事件的第一反应、团队分工、升级处置与离室前闭环。',`最近一次 ${s.latest||0}%`)+`<div class="risk-banner"><b>抢救原则训练：</b>题目强调识别、暂停、支持、升级和沟通，不提供具体药物剂量，也不替代本院急救流程。</div><div class="v20-casegrid" style="margin-top:14px">${RESCUE_CASES.map(c=>`<section class="card v20-case"><span class="severity">${c.severity}</span><h3>${c.title}</h3><p>${c.intro}</p><button class="btn" onclick="startRescue('${c.id}')">开始演练</button></section>`).join('')}</div>${v20Disclaimer()}`}
function startRescue(id){if(window.beginModule24)beginModule24('rescue',id);rescueState={id,index:0,correct:0,locked:false,picked:null};renderRescue()}
function renderRescue(){let c=RESCUE_CASES.find(x=>x.id===rescueState.id),q=c.steps[rescueState.index],S=rescueState,pct=Math.round(S.index/c.steps.length*100);$('#main').innerHTML=head(c.title,c.intro,`RESCUE ${S.index+1}/${c.steps.length}`)+`<div class="card rescue-scene"><div class="rescue-head"><div><span class="rescue-step">关键节点 ${S.index+1}</span><h2>${q.q}</h2></div><span class="severity">${c.severity}</span></div><div class="rescue-strip"><i style="width:${pct}%"></i></div><div class="choices">${q.o.map((o,i)=>`<div class="choice ${S.locked?(i===q.a?'correct':i===S.picked?'wrong':''):''}" data-rescue="${i}">${String.fromCharCode(65+i)}. ${o}</div>`).join('')}</div>${S.locked?`<div class="rescue-feedback ${S.picked===q.a?'good':''}"><b>${S.picked===q.a?'✓ 处置方向正确':'✗ 第一优先级需要修正'}</b><br>${q.why}</div><button class="btn" id="rescueNext" style="margin-top:12px">${S.index===c.steps.length-1?'完成演练':'下一节点 →'}</button>`:''}</div>${v20Disclaimer()}`;$$('[data-rescue]').forEach(el=>el.onclick=()=>chooseRescue(+el.dataset.rescue));let n=$('#rescueNext');if(n)n.onclick=nextRescue}
function chooseRescue(i){if(rescueState.locked)return;let c=RESCUE_CASES.find(x=>x.id===rescueState.id),q=c.steps[rescueState.index];if(window.moduleResponse24)moduleResponse24(q.q,q.o,i,i===q.a,q.a,q.why);rescueState.locked=true;rescueState.picked=i;if(i===q.a)rescueState.correct++;else addV20Wrong('rescue',c.title,q.q,q.o[i],q.o[q.a],q.why);renderRescue()}
function nextRescue(){let c=RESCUE_CASES.find(x=>x.id===rescueState.id);if(rescueState.index>=c.steps.length-1)return finishRescue();rescueState.index++;rescueState.locked=false;rescueState.picked=null;renderRescue()}
function finishRescue(){let c=RESCUE_CASES.find(x=>x.id===rescueState.id),score=Math.round(rescueState.correct/c.steps.length*100);recordV20('rescue',c.title,score);$('#main').innerHTML=head('抢救演练完成',c.title,'RESCUE COMPLETE')+`<div class="grid g3">${metric('本轮成绩',score+'%',`${rescueState.correct}/${c.steps.length}`)}${metric('最近一次',stat('rescue').latest+'%')}${metric('错题',c.steps.length-rescueState.correct,'已加入错题本')}</div><div class="card" style="margin-top:16px"><h2>安全闭环记忆</h2><div class="memory-flow"><div><b>1</b><span>识别异常</span></div><div><b>2</b><span>暂停与支持</span></div><div><b>3</b><span>针对性处置</span></div><div><b>4</b><span>升级、记录与交班</span></div></div><div class="row"><button class="btn" onclick="startRescue('${c.id}')">再练一次</button><button class="btn soft" onclick="rescueHub()">选择其他事件</button></div></div>`}

function reportsHub(){let s=stat('reports');$('#main').innerHTML=head('内镜报告与质控','从一组真实教学素材出发，完成结构化记录并检查关键字段。',`最近一次 ${s.latest||0}%`)+`<div class="v20-casegrid">${REPORT_CASES.map(c=>`<section class="card v20-case"><span class="v20-badge">${c.badge}</span><h3>${c.title}</h3><p>${c.vignette}</p><button class="btn" onclick="startReportLab('${c.id}')">撰写报告</button></section>`).join('')}</div>${v20Disclaimer()}`}
function startReportLab(id){if(window.beginModule24)beginModule24('reports',id);reportState={id,graded:false};renderReportLab()}
function reportFields(c){let f=c.defaults;return `<div class="report-form">
 ${rf('indication','检查指征',f.indication)}${rf('extent','检查范围/到达部位',f.extent)}${rf('quality','准备与视野质量',f.quality)}${rf('location','病灶部位',f.location)}
 ${rf('description','病灶描述（大小、形态、表面、边界）',f.description,true)}${rf('intervention','完成的操作',f.intervention)}${rf('specimen','标本与送检',f.specimen)}${rf('complication','即时并发症',f.complication)}${rf('impression','内镜印象',f.impression,true)}${rf('plan','后续建议',f.plan,true)}
 </div>`}
function rf(id,label,val,wide){return `<div class="report-field ${wide?'wide':''}"><label for="r-${id}">${label}</label>${wide?`<textarea id="r-${id}" placeholder="请根据左侧病例资料填写" oninput="updateReportMeter()"></textarea>`:`<input id="r-${id}" placeholder="请填写" oninput="updateReportMeter()">`}</div>`}
function renderReportLab(){let c=REPORT_CASES.find(x=>x.id===reportState.id);$('#main').innerHTML=head('结构化内镜报告',c.title,c.badge)+`<div class="report-layout"><aside class="card report-source"><span class="v20-badge">教学病例</span><h2>${c.title}</h2><p>${c.vignette}</p><div class="imgbox"><img src="${c.img}" alt="${c.title}" onclick="openModal(this.src)"></div><div class="src">本地教学图片；仅用于报告训练，不作为真实患者记录。</div></aside><section class="card"><div class="quality-meter"><b>完成度</b><div class="bar"><i id="reportBar" style="width:0%"></i></div><strong id="reportPct">0%</strong></div>${reportFields(c)}<div class="row" style="margin-top:14px"><button class="btn" onclick="gradeReportLab()">提交质控</button><button class="btn ghost" onclick="reportsHub()">退出</button></div><div id="reportFeedback"></div></section></div>${v20Disclaimer()}`}
function reportValues(){let ids=['indication','extent','quality','location','description','intervention','specimen','complication','impression','plan'],out={};ids.forEach(id=>out[id]=($('#r-'+id)?.value||'').trim());return out}
function updateReportMeter(){let v=reportValues(),n=Object.values(v).filter(Boolean).length,pct=n*10;let b=$('#reportBar'),t=$('#reportPct');if(b)b.style.width=pct+'%';if(t)t.textContent=pct+'%'}
function gradeReportLab(){
 if(reportState?.graded)return;
 const c=REPORT_CASES.find(x=>x.id===reportState.id),v=reportValues(),r=GI24.safeReport(v,c.checks);
 if(!Object.values(v).some(Boolean))return alert('请先填写报告。');
 reportState.graded=true;
 if(window.attachReport24)attachReport24(v,r);
 recordV20('reports',c.title,r.content);
 $('#reportFeedback').innerHTML=`<div class="feedback mid"><b>字段完整性 ${r.completeness}% · 已核对内容 ${r.content}%</b><p>两项分别展示，不合成为临床能力分。未核对的表达和所有并发症、处置合理性均待教师复核。</p></div><div class="quality-checks">${r.details.map(x=>`<div class="quality-check ${x.ok?'ok':'miss'}">${x.ok?'已识别':'待复核'}：${esc(x.field)} · ${x.terms.map(esc).join('、')}</div>`).join('')}</div><div class="report-preview">${esc(Object.entries(v).map(([k,x])=>k+'：'+x).join('\n'))}</div><button class="btn" onclick="reportsHub()">返回报告训练</button>`;
 document.querySelectorAll('.report-form input,.report-form textarea').forEach(x=>x.disabled=true);
}

function multimodalHub(){let s=stat('multimodal');$('#main').innerHTML=head('多模态联合病例','依次打开不同来源的证据，最后完成综合判断。不要让单项结果覆盖完整病程。',`最近一次 ${s.latest||0}%`)+`<div class="v20-casegrid">${MULTI_CASES.map(c=>`<section class="card v20-case"><span class="v20-badge">3组证据</span><h3>${c.title}</h3><p>${c.summary}</p><button class="btn" onclick="startMultimodal('${c.id}')">开始整合</button></section>`).join('')}</div>${v20Disclaimer()}`}
function startMultimodal(id){if(window.beginModule24)beginModule24('multimodal',id);multiState={id,revealed:[],answered:false,picked:null};renderMultimodal()}
function renderMultimodal(){let c=MULTI_CASES.find(x=>x.id===multiState.id),S=multiState,all=S.revealed.length===c.evidence.length;$('#main').innerHTML=head(c.title,c.summary,`${S.revealed.length}/${c.evidence.length} EVIDENCE`)+`<div class="evidence-grid">${c.evidence.map((e,i)=>S.revealed.includes(i)?`<article class="evidence-card"><div>${e.img?`<img src="${e.img}" alt="${e.title}" onclick="openModal(this.src)">`:''}</div><div class="body"><span class="evidence-type">${e.type}</span><h3>${e.title}</h3><p>${e.text}</p></div></article>`:`<button class="evidence-card locked" onclick="revealEvidence(${i})"><div><b>打开证据 ${i+1}</b><br><span>${e.type}</span></div></button>`).join('')}</div>${all?`<section class="integration-box"><span class="v20-badge">INTEGRATION</span><h2>${c.q}</h2><div class="choices">${c.o.map((o,i)=>`<div class="choice ${S.answered?(i===c.a?'correct':i===S.picked?'wrong':''):''}" data-multi="${i}">${String.fromCharCode(65+i)}. ${o}</div>`).join('')}</div>${S.answered?`<div class="feedback ${S.picked===c.a?'good':'mid'}"><b>${S.picked===c.a?'✓ 证据整合正确':'✗ 存在单项证据锚定'}</b><br>${c.why}</div><div class="row" style="margin-top:12px"><button class="btn" onclick="startMultimodal('${c.id}')">再练一次</button><button class="btn soft" onclick="multimodalHub()">换一个病例</button></div>`:''}</section>`:`<div class="integration-box locked">请先依次打开全部证据，再进入综合判断。</div>`}${v20Disclaimer()}`;$$('[data-multi]').forEach(el=>el.onclick=()=>answerMultimodal(+el.dataset.multi))}
function revealEvidence(i){if(!multiState.revealed.includes(i))multiState.revealed.push(i);renderMultimodal()}
function answerMultimodal(i){if(multiState.answered)return;let c=MULTI_CASES.find(x=>x.id===multiState.id);if(window.moduleResponse24)moduleResponse24(c.q,c.o,i,i===c.a,c.a,c.why);multiState.answered=true;multiState.picked=i;let score=i===c.a?100:0;recordV20('multimodal',c.title,score);if(i!==c.a)addV20Wrong('multimodal',c.title,c.q,c.o[i],c.o[c.a],c.why);renderMultimodal()}

function appendDashboard(){let host=$('#main');if(!host||$('#v20Dash'))return;let p=v20Profile(),box=document.createElement('div');box.id='v20Dash';box.innerHTML=`<div class="section"><h2>临床能力闭环</h2><small>病程 · 抢救 · 报告 · 多模态</small></div><div class="v20-hub">${moduleCard('dynamic','⏱️','动态病程','选择会改变时间和生命体征。',p.v20.dynamic,'开始')}${moduleCard('rescue','🚨','并发症抢救','训练突发事件的安全闭环。',p.v20.rescue,'开始')}${moduleCard('reportlab','📋','报告与质控','把观察转化为临床记录。',p.v20.reports,'开始')}${moduleCard('multimodal','🧩','多模态病例','整合内镜、影像、病理与趋势。',p.v20.multimodal,'开始')}</div>`;let firstSection=host.querySelector('.section');if(firstSection)firstSection.before(box);else host.appendChild(box)}
function appendReport(){let host=$('#main');if(!host||$('#v20Report'))return;let p=v20Profile(),box=document.createElement('div');box.id='v20Report';box.innerHTML=`<div class="section"><h2>模块练习记录</h2><small>四类新增训练</small></div><div class="v20-results">${['dynamic','rescue','reports','multimodal'].map(k=>metric(MODULE_LABELS[k],(p.v20[k].latest||0)+'%',`${p.v20[k].runs||0} 轮`)).join('')}</div><div class="section"><h2>最近训练</h2></div><div class="card"><table class="table"><tr><th>模块</th><th>训练项目</th><th>成绩</th><th>时间</th></tr>${p.v20.history.slice(0,12).map(h=>`<tr><td><span class="v20-history-type">${MODULE_LABELS[h.kind]}</span></td><td>${esc(h.title)}</td><td>${h.score}%</td><td>${new Date(h.at).toLocaleString()}</td></tr>`).join('')||'<tr><td colspan="4">尚未完成 v20 训练</td></tr>'}</table></div>`;host.appendChild(box)}
function appendTeacher(){let host=$('#main');if(!host||$('#v20Teacher'))return;let rows=Object.keys(db.profiles).map(n=>{let p=ensureV20(db.profiles[n]);return [n,p.v20.dynamic.best,p.v20.rescue.best,p.v20.reports.best,p.v20.multimodal.best,p.v20.history.length]});let box=document.createElement('div');box.id='v20Teacher';box.innerHTML=`<div class="section"><h2>模块学习总览</h2><small>显示最近一次成绩</small></div><div class="card"><table class="table"><tr><th>学员</th><th>动态病程</th><th>并发症</th><th>报告质控</th><th>多模态</th><th>训练轮次</th></tr>${rows.map(r=>`<tr>${r.map((x,i)=>`<td>${i===0?esc(x):i<5?x+'%':x}</td>`).join('')}</tr>`).join('')}</table></div>`;host.appendChild(box)}
function syncV20(){document.title='GI Resident AI V24.0 · 住培辅助教学';document.querySelectorAll('.logo small').forEach(x=>x.textContent='CLINICAL COMPETENCY LOOP · V20');document.querySelectorAll('.login .pill').forEach(x=>x.textContent='GI Resident AI · v20');let lp=document.querySelector('.login-card>p');if(lp)lp.textContent='32个分层病例 · 动态病程 · 并发症抢救 · 内镜报告质控 · 多模态联合推理';}

window.GI24_MODULE_DATA={DYNAMIC_CASES,RESCUE_CASES,REPORT_CASES,MULTI_CASES};
const oldEnsure=window.ensureProfile;window.ensureProfile=function(p){return ensureV20(oldEnsure?oldEnsure(p):p)};
Object.values(db.profiles).forEach(ensureV20);save();
const oldBuildNav=window.buildNav;window.buildNav=function(){if(session.role==='teacher')return oldBuildNav();let items=[['dashboard','🏠 今日学习'],['v20hub','✨ v20能力闭环'],['cases','🏥 AI虚拟病房'],['dynamic','⏱️ 动态病程'],['rescue','🚨 并发症抢救'],['reports','📋 报告与质控'],['multimodal','🧩 多模态病例'],['anatomy','🧭 镜下解剖地图'],['procedures','🎮 内镜操作训练营'],['images','🔬 真实内镜闯关'],['wrong','📝 错题本'],['report','📈 能力报告'],['refs','📚 指南/图片来源'],['logout','↩ 退出']];$('#nav').innerHTML=items.map(x=>`<button data-v="${x[0]}">${x[1]}</button>`).join('');$$('#nav button').forEach(b=>b.onclick=()=>b.dataset.v==='logout'?logout():nav(b.dataset.v))};
const oldNav=window.nav;window.nav=function(v){let routes={v20hub:v20Hub,dynamic:dynamicHub,rescue:rescueHub,reports:reportsHub,multimodal:multimodalHub};if(routes[v]){activateNav(v);routes[v]();return}oldNav(v)};
const oldDashboard=window.dashboard;window.dashboard=function(){oldDashboard();appendDashboard()};
const oldReport=window.report;window.report=function(){oldReport();appendReport()};
const oldTeacher=window.teacher;window.teacher=function(){oldTeacher();appendTeacher()};
const oldApp=window.app;window.app=function(){oldApp();syncV20()};
const oldLogin=window.login;window.login=function(){oldLogin();syncV20()};

Object.assign(window,{v20Hub,dynamicHub,startDynamic,chooseDynamic,nextDynamic,rescueHub,startRescue,chooseRescue,nextRescue,reportsHub,startReportLab,updateReportMeter,gradeReportLab,multimodalHub,startMultimodal,revealEvidence,answerMultimodal});
function refreshCurrent(){syncV20();if(session){buildNav();nav(session.role==='teacher'?'teacher':'dashboard')}}
if(document.readyState==='loading')window.addEventListener('load',refreshCurrent);else setTimeout(refreshCurrent,0);
})();
