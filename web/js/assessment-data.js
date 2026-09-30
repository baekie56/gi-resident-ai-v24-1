/* Versioned 10-item GI knowledge assessment. Keep item IDs stable within this release. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.GI24_ASSESSMENT=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const ID='gi-core-assessment-2026-09-30-v1';
  const VERSION='2026-09-30.1';
  const TITLE='消化科核心知识小测';
  const QUESTIONS=[
    {
      id:'ugib-resuscitation',domain:'上消化道出血',
      question:'一名呕血患者血压下降、心率增快。当前最优先的处理思路是？',
      options:['先稳定循环、建立监护与静脉通路，同时推进病因评估','先完成全部病史和检查，再决定是否复苏','不做评估，直接转入内镜室','等待再次呕血后再处理'],
      answer:0,
      explanation:'不稳定的上消化道出血应先进行血流动力学复苏和监护，并同步完成风险评估与后续止血准备。',
      source:'软件动态病程模块；ESGE 非静脉曲张性上消化道出血指南（2021）'
    },
    {
      id:'ugib-endoscopy-time',domain:'上消化道出血',
      question:'急性非静脉曲张性上消化道出血患者完成血流动力学复苏后，通常推荐何时行上消化道内镜？',
      options:['24小时内','所有患者必须1小时内','症状完全消失后再安排','一律等待72小时以上'],
      answer:0,
      explanation:'ESGE建议复苏后在24小时内完成早期上消化道内镜；并非所有患者都需在12小时内急诊内镜。',
      source:'ESGE 非静脉曲张性上消化道出血指南（2021）'
    },
    {
      id:'ugib-hemostasis',domain:'内镜止血',
      question:'内镜发现活动性出血性消化性溃疡时，下列哪种止血策略更合适？',
      options:['肾上腺素注射联合机械或接触热凝等第二种止血方式','仅喷洒生理盐水后结束检查','只做活检，不处理出血','单独依赖肾上腺素注射，不再使用其他方式'],
      answer:0,
      explanation:'活动性出血溃疡通常采用联合止血，肾上腺素注射不宜作为唯一的确定性止血方式。',
      source:'ESGE 非静脉曲张性上消化道出血指南（2021）'
    },
    {
      id:'cholangitis-diagnosis',domain:'胆道感染',
      question:'怀疑急性胆管炎，但患者没有完整的Charcot三联征。下一步最合理的判断方式是？',
      options:['结合全身炎症、胆汁淤积和影像学胆道梗阻证据综合判断','因三联征不完整，立即排除胆管炎','只看转氨酶是否升高','只要有腹痛即可确诊'],
      answer:0,
      explanation:'完整三联征并非诊断所必需，应结合炎症、胆汁淤积和影像学证据进行判断。',
      source:'Tokyo Guidelines 2018 急性胆管炎诊断与严重度分级'
    },
    {
      id:'cholangitis-severe',domain:'胆道感染',
      question:'急性胆管炎患者出现低血压和意识改变，最合理的处置方向是？',
      options:['立即复苏和器官支持，并尽快协调胆道引流','仅口服药物后回家观察','只重复肝功能，等待自然恢复','先完成择期门诊检查，再考虑处理'],
      answer:0,
      explanation:'出现器官功能障碍提示重症风险，需要复苏、器官支持、抗感染并尽快进行胆道减压。',
      source:'Tokyo Guidelines 2018；软件胆道感染动态病程模块'
    },
    {
      id:'pancreatitis-ct',domain:'急性胰腺炎',
      question:'急性胰腺炎诊断较明确、早期病情稳定时，增强CT的合理使用原则是？',
      options:['诊断不确定或48—72小时未改善时再重点考虑','所有患者到院后立即重复多次增强CT','只要脂肪酶升高就每天做CT','CT完全不能用于急性胰腺炎'],
      answer:0,
      explanation:'ACG建议将CT保留给诊断不确定或48—72小时临床未改善的患者，早期应重视连续临床评估。',
      source:'ACG 急性胰腺炎指南（2024）'
    },
    {
      id:'pancreatitis-antibiotics',domain:'急性胰腺炎',
      question:'关于急性胰腺炎的抗菌药物使用，下列哪项更合适？',
      options:['没有感染证据时不常规预防性使用抗菌药物','所有急性胰腺炎均应立即长期联合抗菌治疗','淀粉酶升高本身就是抗菌药物指征','无论是否感染都应使用抗菌药物直到影像恢复'],
      answer:0,
      explanation:'没有感染证据时不推荐常规预防性抗菌治疗；怀疑感染性坏死等情况时再按临床证据处理。',
      source:'ACG 急性胰腺炎指南（2024）'
    },
    {
      id:'colonoscopy-cecum',domain:'内镜解剖',
      question:'结肠镜到达盲肠后，哪组解剖标志最有助于确认检查完整性？',
      options:['阑尾开口和回盲瓣','齿状线和肛乳头','胃角和幽门','十二指肠大乳头和胆总管开口'],
      answer:0,
      explanation:'盲肠插镜完成通常应识别并记录阑尾开口、回盲瓣等盲肠标志。',
      source:'软件镜下解剖地图；ASGE/ACG 结肠镜质量指标'
    },
    {
      id:'emr-sequence',domain:'内镜治疗',
      question:'对适合EMR的黏膜病变，下列哪一流程最符合软件中的基本训练顺序？',
      options:['评估病变—黏膜下注射抬举—圈套切除—检查创面并处理风险','先盲目圈套，再寻找病变边界','切除前不评估抬举征，也不检查创面','只冲洗病变，不做切除评估'],
      answer:0,
      explanation:'EMR训练强调病变评估、抬举、圈套切除和术后创面评估的完整闭环。',
      source:'软件内镜操作训练营 EMR 模块'
    },
    {
      id:'eus-fna-fnb',domain:'超声内镜',
      question:'关于EUS引导下FNA与FNB，下列哪项表述更准确？',
      options:['FNA偏重细胞学取材，FNB更强调获取组织学核心，选择取决于病变和诊断需求','两者完全相同，任何情况下都没有区别','FNB只用于冲洗胆管，不能取材','FNA只能获取完整组织柱，不能做细胞学检查'],
      answer:0,
      explanation:'FNA与FNB在取材目标和针具设计上有差异，应根据病变特点、所需病理信息和本中心流程选择。',
      source:'软件器械图库与EUS-FNA/FNB训练模块'
    }
  ];
  function score(answerIndexes){
    const correct=QUESTIONS.reduce((n,q,i)=>n+(Number(answerIndexes?.[i])===q.answer?1:0),0);
    return {correct,total:QUESTIONS.length,percent:Math.round(correct/QUESTIONS.length*100)};
  }
  return {ID,VERSION,TITLE,QUESTIONS,score};
});
