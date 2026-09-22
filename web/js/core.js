/* GI Resident AI V24.0 — pure, independently testable learning rules. */
(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GI24 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  const VERSION = '24.0.0', BANK_VERSION = '2026-09-06.1', RULE_VERSION = 'conservative-1';
  // Explicit equivalents only. No edit-distance correction of clinical concepts.
  const groups = [
    ['胃食管反流病','GERD','胃食管返流病'], ['原发性硬化性胆管炎','PSC'],
    ['自发性细菌性腹膜炎','SBP'], ['炎症性肠病','IBD'], ['溃疡性结肠炎','UC'],
    ['克罗恩病','Crohn病','Crohn'], ['胃窦血管扩张症','GAVE','西瓜胃'],
    ['门脉高压性胃病','门静脉高压性胃病','PHG'], ['巴雷特食管','Barrett食管','Barrett'],
    ['食管静脉曲张破裂出血','食管胃静脉曲张破裂出血','静脉曲张破裂出血'],
    ['非静脉曲张性上消化道出血','NVUGIB'], ['胆总管结石','CBD结石'],
    ['质子泵抑制剂','PPI'], ['抗菌药','抗生素'], ['幽门螺杆菌','H. pylori','H.pylori','HP'],
    ['非甾体抗炎药','NSAIDs','NSAID'], ['内镜止血','内镜下止血','镜下止血','胃镜止血'],
    ['内镜黏膜下剥离术','ESD'], ['内镜黏膜切除术','内镜下黏膜切除术','EMR'],
    ['食管静脉曲张套扎术','EVL'], ['经口内镜下肌切开术','POEM'],
    ['内镜逆行胰胆管造影','ERCP'], ['超声内镜','内镜超声','EUS'],
    ['细针穿刺抽吸','FNA'], ['细针组织活检','FNB'], ['经颈静脉肝内门体分流术','TIPS'],
    ['磁共振胰胆管成像','MRCP'], ['计算机断层血管成像','CTA','CT血管成像'],
    ['多学科讨论','MDT'], ['高分辨食管测压','高分辨率食管测压','HRM'],
    ['24小时内','二十四小时内'], ['12小时内','十二小时内'],
    ['根除幽门螺杆菌','根除HP'], ['停用非甾体抗炎药','停NSAID','停用NSAID'],
    ['未见即时并发症','无即时并发症','没有即时并发症']
  ];
  const fold = v => String(v ?? '').normalize('NFKC').toLowerCase().replace(/\s+/g,'');
  const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const aliases = new Map();
  groups.forEach(g => g.forEach(v => aliases.set(fold(v), fold(g[0]))));
  const aliasRe = new RegExp([...aliases.keys()].sort((a,b)=>b.length-a.length).map(escapeRe).join('|'),'g');
  function canonical(value) {
    const text = fold(value);
    return text.replace(aliasRe, (match, offset) => {
      if (/^[a-z]/.test(match) && /[a-z]/.test(text[offset-1] || '')) return match;
      if (/[a-z]$/.test(match) && /[a-z]/.test(text[offset+match.length] || '')) return match;
      return aliases.get(match);
    });
  }
  const neg = /不|无|未|非|否认|排除|除外|避免|禁止|拒绝|停用|停止/;
  const conditional = /如果|假如|倘若|必要时|需要时|有指征时|视情况|待排除|不能排除|不排除|可能|尚待|再考虑|暂缓/;
  const result = (status, reason) => ({ok:status==='matched',status,reason,mode:status==='matched'?'explicit-equivalent':'review',confidence:null});
  function semanticMatch(input, target) {
    const n=canonical(input), t=canonical(target);
    if (!n || !t) return result('missing','未提供可核对的表达');
    if (n.length>12000) return result('review','文字过长，请教师复核');
    const clauses=n.split(/[，,。；;！!?？\n]|但是|然而|但应|但需/).filter(Boolean);
    let yes=false,no=false,uncertain=false;
    for(const clause of clauses) {
      let at=clause.indexOf(t);
      while(at>=0) {
        const left=clause.slice(0,at), right=clause.slice(at+t.length);
        if ((/^\d/.test(t)&&/[\d.]$/.test(left)) || (/\d$/.test(t)&&/^[\d.]/.test(right))) {at=clause.indexOf(t,at+t.length);continue}
        // Condition/uncertainty does not demonstrate a definite diagnosis or action.
        if ((conditional.test(left)||/^(待排|可能|不考虑|不能确定|已排除|阴性)/.test(right)) && !conditional.test(t)) uncertain=true;
        else if ((neg.test(left)||/^(不考虑|已排除|阴性|不成立|不予|暂不|暂缓|无需|不需要|未见|未行|不要|不做)/.test(right)) && !neg.test(t)) no=true;
        else if (neg.test(t) && neg.test(left)) uncertain=true;
        else yes=true;
        at=clause.indexOf(t,at+t.length);
      }
    }
    if(yes&&(no||uncertain)) return result('conflict','存在相反或不确定表达，须教师复核');
    if(no) return result('negated','表达是否定，不能计为该正向评分点');
    if(uncertain) return result('review','存在条件、疑问或不确定表达，须教师复核');
    if(yes) return result('matched','明确表达或白名单同义表达；仍需结合病例核查');
    return result('review','规则未确认完整含义，不等于医学答案错误');
  }
  function semanticScore(text, targets) {
    const unique=[...new Set((targets||[]).map(canonical))];
    const details=unique.map(t=>({target:(targets||[]).find(x=>canonical(x)===t),...semanticMatch(text,t)}));
    const hit=details.filter(x=>x.ok).map(x=>x.target);
    return {hit,total:details.length,score:details.length?Math.round(hit.length/details.length*100):0,details,pending:details.some(x=>!x.ok)};
  }
  function hashSeed(s) {let h=2166136261;for(const ch of String(s)){h=Math.imul(h^ch.charCodeAt(0),16777619)}return h>>>0}
  function rngFrom(seed) {let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  function shuffle(items,rng=Math.random){const out=[...items];for(let i=out.length-1;i>0;i--){let j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
  function dayKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  function nextReview(at,correct,streak=0){const d=new Date(at);d.setDate(d.getDate()+(correct?[1,3,7,14,30][Math.min(streak,4)]:1));return d.toISOString()}
  function frozenPlan(profile,day,build){profile.v21=profile.v21||{};profile.v21.daily=profile.v21.daily||{};const rec=profile.v21.daily[day]=profile.v21.daily[day]||{};if(!Array.isArray(rec.plan)){rec.plan=JSON.parse(JSON.stringify(build()));rec.bankVersion=BANK_VERSION;rec.generatedAt=new Date().toISOString()}return rec.plan}
  function safeReport(values,checks){
    const present=Object.values(values).filter(x=>String(x).trim()).length;
    const details=checks.map(([field,terms])=>({field,terms,ok:terms.every(t=>semanticMatch(values[field],t).ok)}));
    return {completeness:Math.round(present/Math.max(1,Object.keys(values).length)*100),content:Math.round(details.filter(x=>x.ok).length/Math.max(1,checks.length)*100),details,pending:true};
  }
  function validateBackup(value){
    if(!value||typeof value!=='object'||Array.isArray(value)||value.format!=='gi24-learning-backup'||value.version!==VERSION||!value.profiles||typeof value.profiles!=='object'||Array.isArray(value.profiles))throw Error('请选择V24学习备份文件，研究导出不能用作备份');
    const out={};
    for(const [name,p] of Object.entries(value.profiles)){
      if(!/^[\p{L}\p{N}_ .-]{2,40}$/u.test(name)||['__proto__','constructor','prototype'].includes(name.toLowerCase()))throw Error('备份档案名称不合法');
      if(!p||typeof p!=='object'||!Array.isArray(p.history)||!Array.isArray(p.wrong))throw Error('备份档案结构不完整');
      const inspect=(x,depth=0)=>{if(depth>25)throw Error('备份嵌套过深');if(x&&typeof x==='object')for(const [k,v]of Object.entries(x)){if(['__proto__','constructor','prototype'].includes(k))throw Error('备份含不安全字段');inspect(v,depth+1)}};inspect(p);
      for(const k of ['scores','img','anatomy','procedures','v20','v21','v24'])if(p[k]!=null&&(typeof p[k]!=='object'||Array.isArray(p[k])))throw Error('备份字段类型错误');
      if(p.v24?.attempts!=null&&!Array.isArray(p.v24.attempts))throw Error('训练记录类型错误');
      for(const a of p.v24?.attempts||[]){if(!a||typeof a.id!=='string'||typeof a.caseId!=='string'||!Array.isArray(a.responses))throw Error('训练记录字段不完整');for(const k of ['decisionScore','ruleCoverage','completeness'])if(a[k]!=null&&(typeof a[k]!=='number'||!Number.isFinite(a[k])||a[k]<0||a[k]>100))throw Error('训练分值格式错误')}
      const allowed=['scores','wrong','img','xp','streak','last','history','anatomy','procedures','v20','v21','v24'];
      out[name]=Object.fromEntries(allowed.filter(k=>Object.hasOwn(p,k)).map(k=>[k,JSON.parse(JSON.stringify(p[k]))]));
      // Cached task actions are executable UI instructions; never accept them from a backup.
      if(out[name].v21?.daily)for(const day of Object.values(out[name].v21.daily)){if(day&&typeof day==='object')delete day.plan}
    }
    return out;
  }
  // Research exports intentionally use a field whitelist. Raw narratives are opt-in.
  function researchRows(profiles,includeText=false){
    const rows=[];
    for(const p of Object.values(profiles))for(const a of p.v24?.attempts||[]){
      const row={participantId:p.v24?.participantId,attemptId:a.id,caseId:a.caseId,caseFamily:a.caseFamily||a.caseId,kind:a.kind,mode:a.mode,softwareVersion:a.softwareVersion,distributionVersion:a.distributionVersion||null,bankVersion:a.bankVersion,contentVersion:a.contentVersion??null,contentRevision:a.contentRevision??null,ruleVersion:a.ruleVersion,startedAt:a.startedAt,finishedAt:a.finishedAt,durationSeconds:a.durationSeconds,decisionScore:a.decisionScore??null,ruleCoverage:a.ruleCoverage??null,firstAttempt:!!a.firstAttempt,hints:a.hints||0,aiUsed:!!a.aiUsed,aiModel:a.aiModel||null,status:a.status||'pending-review',responses:(a.responses||[]).map(r=>({questionId:r.questionId,order:r.order,selected:r.selected,correct:r.correct,at:r.at}))};
      row.promptVersion=a.promptVersion||null;row.completeness=a.completeness??null;
      if(includeText){row.freeText=a.freeText;row.reportValues=a.reportValues;row.chat=a.chat;row.responses=(a.responses||[]).map((r,i)=>({...row.responses[i],step:r.step,question:r.question,answer:r.answer,explanation:r.explanation,note:r.note}))}
      rows.push(row);
    }
    return rows;
  }
  function csv(rows){if(!rows.length)return '\ufeff';const cols=Object.keys(rows[0]);const cell=v=>'"'+String(typeof v==='object'?JSON.stringify(v):v??'').replace(/^[=+@\-\t\r]/,'\'$&').replace(/"/g,'""')+'"';return '\ufeff'+[cols.map(cell).join(','),...rows.map(r=>cols.map(k=>cell(r[k])).join(','))].join('\r\n')}
  return {VERSION,BANK_VERSION,RULE_VERSION,canonical,semanticMatch,semanticScore,hashSeed,rngFrom,shuffle,dayKey,nextReview,frozenPlan,safeReport,validateBackup,researchRows,csv};
});
