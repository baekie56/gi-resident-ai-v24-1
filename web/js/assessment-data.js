/* Versioned 10-item GI knowledge assessment. Keep item IDs stable within this release. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.GI24_ASSESSMENT=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const ID='gi-core-assessment-2026-09-30-v2';
  const VERSION='2026-09-30.2';
  const TITLE='消化科核心知识小测';
  const QUESTIONS=[
    {
      id:'ugib-risk-stratification',domain:'上消化道出血',
      question:'一名黑便患者生命体征稳定，拟决定是否需要住院及急诊处理。内镜前最适合先使用哪项工具进行风险分层？',
      options:['Glasgow-Blatchford出血评分','Forrest溃疡出血分级','Child-Pugh肝功能分级','MELD终末期肝病评分'],
      answer:0,
      explanation:'Glasgow-Blatchford评分用于上消化道出血的内镜前风险分层；Forrest分级需依据溃疡内镜表现。',
      source:'软件上消化道出血模块；ESGE 非静脉曲张性上消化道出血指南（2021）'
    },
    {
      id:'ugib-endoscopy-time',domain:'上消化道出血',
      question:'一名非静脉曲张性上消化道出血患者经补液后血压稳定，也没有继续呕血。较合适的内镜安排是？',
      options:['完成复苏后24小时内安排内镜','必须在到院1小时内完成内镜','观察48小时，若再次出血再内镜','出院后择期两周内完成内镜'],
      answer:0,
      explanation:'ESGE建议复苏后在24小时内完成早期上消化道内镜；并非所有患者都需在12小时内急诊内镜。',
      source:'ESGE 非静脉曲张性上消化道出血指南（2021）'
    },
    {
      id:'ugib-visible-vessel',domain:'内镜止血',
      question:'内镜见十二指肠溃疡底有裸露血管，目前没有活动性喷血。下列处理最合适的是？',
      options:['使用止血夹或接触热凝处理裸露血管','仅静脉应用大剂量PPI后观察','只在血管周围注射肾上腺素','暂不处理，24小时后复查内镜'],
      answer:0,
      explanation:'非出血性裸露血管属于需要内镜治疗的高危征象，可选择机械或热凝治疗；肾上腺素不宜单独作为确定性治疗。',
      source:'ESGE 非静脉曲张性上消化道出血指南（2021）'
    },
    {
      id:'cholangitis-diagnosis',domain:'胆道感染',
      question:'患者发热、白细胞升高并有胆红素升高，尚未出现典型Charcot三联征。哪项新增结果最支持急性胆管炎的完整诊断？',
      options:['胆管扩张并见胆总管结石','胆囊壁增厚并见少量周围积液','胰腺轻度肿大并见周围渗出','胃镜提示十二指肠活动性溃疡'],
      answer:0,
      explanation:'全身炎症和胆汁淤积基础上，再有胆管扩张或梗阻病因的影像证据，更符合Tokyo Guidelines的诊断框架。',
      source:'Tokyo Guidelines 2018 急性胆管炎诊断与严重度分级'
    },
    {
      id:'cholangitis-drainage',domain:'胆道感染',
      question:'胆管炎患者已接受补液和静脉抗菌药物，体温仍高且胆红素继续上升，影像见胆总管结石。下一步较合适的是？',
      options:['尽快评估并实施胆道引流','继续原方案观察至退热后再决定','立即行胆囊切除作为首要减压措施','先改为口服抗菌药物后门诊随访'],
      answer:0,
      explanation:'初始治疗反应不佳且存在持续梗阻时，应尽快进行胆道减压；常用方式为内镜下胆道引流。',
      source:'Tokyo Guidelines 2018；软件胆道感染动态病程模块'
    },
    {
      id:'pancreatitis-ct',domain:'急性胰腺炎',
      question:'患者典型上腹痛、脂肪酶超过正常上限3倍，入院24小时后生命体征稳定且疼痛减轻。此时对增强CT的处理是？',
      options:['暂不常规做，诊断不清或48—72小时未改善时再考虑','立即检查，以确认诊断并进行影像分级','在第24小时和第48小时分别复查一次','待脂肪酶恢复正常后常规复查一次'],
      answer:0,
      explanation:'ACG建议将CT保留给诊断不确定或48—72小时临床未改善的患者，早期应重视连续临床评估。',
      source:'ACG 急性胰腺炎指南（2024）'
    },
    {
      id:'pancreatitis-feeding',domain:'急性胰腺炎',
      question:'轻症急性胰腺炎患者入院次日疼痛明显减轻、无恶心呕吐，并主动表示饥饿。较合适的营养策略是？',
      options:['按耐受情况开始低脂固体饮食','继续禁食直至脂肪酶完全正常','常规改用全胃肠外营养一周','先行鼻空肠管置入后才能开始营养'],
      answer:0,
      explanation:'轻症患者若无恶心、呕吐等不耐受表现，可在24—48小时内尽早恢复低脂饮食，不必等待胰酶恢复正常。',
      source:'ACG 急性胰腺炎指南（2024）'
    },
    {
      id:'colonoscopy-cecum',domain:'内镜解剖',
      question:'结肠镜检查记录写“已到达盲肠”，但只有一张局部黏膜照片。补充哪项记录最能提高检查完整性的可信度？',
      options:['分别记录并拍摄阑尾开口和回盲瓣','补充记录从盲肠开始的退镜总时间','拍摄乙状结肠的腔形及血管纹理','记录患者检查结束后的腹胀程度'],
      answer:0,
      explanation:'盲肠插镜完成通常应识别并记录阑尾开口、回盲瓣等盲肠标志。',
      source:'软件镜下解剖地图；ASGE/ACG 结肠镜质量指标'
    },
    {
      id:'emr-nonlifting',domain:'内镜治疗',
      question:'计划对一处无既往治疗史的结肠平坦病变行EMR，黏膜下注射后病变中央不能充分抬举。较稳妥的下一步是？',
      options:['暂停圈套，重新评估深浸润可能并调整方案','增加圈套力度，按原方案继续完成切除','改用活检钳分块夹除病变后再随访','继续增加注射液量，直至病变完全抬举'],
      answer:0,
      explanation:'无既往干预时出现不抬举需警惕深浸润，也可能受技术因素影响；应先重新评估病变和切除策略，避免盲目圈套。',
      source:'软件内镜操作训练营 EMR 模块'
    },
    {
      id:'eus-fna-fnb',domain:'超声内镜',
      question:'胰腺实性占位需要取得较完整的组织结构，以便进行组织学和免疫组化判断。更符合这一取材目标的是？',
      options:['优先考虑EUS引导下FNB取材','仅做EUS观察，不获取标本','优先选择ERCP刷检作为实性占位的常规首选','仅抽取少量液体进行淀粉酶检测'],
      answer:0,
      explanation:'FNB更强调获取组织学核心，适用于需要保留组织结构或进行免疫组化的情境；最终选择还应结合病变位置和本中心经验。',
      source:'软件器械图库与EUS-FNA/FNB训练模块'
    }
  ];
  function score(answerIndexes){
    const correct=QUESTIONS.reduce((n,q,i)=>n+(Number(answerIndexes?.[i])===q.answer?1:0),0);
    return {correct,total:QUESTIONS.length,percent:Math.round(correct/QUESTIONS.length*100)};
  }
  return {ID,VERSION,TITLE,QUESTIONS,score};
});
