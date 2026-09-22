const test=require('node:test');
const assert=require('node:assert/strict');
const C=require('../js/core.js');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');

for(const [input,target]of [
 ['急性胆囊炎','急性胆管炎'],['不考虑急性胆囊炎','急性胆管炎'],
 ['暂不进行内镜止血','内镜止血'],['无需使用抗菌药','尽早抗菌药'],
 ['未见活动性出血','活动性出血'],['暂不考虑胃食管反流病','胃食管反流病'],
 ['排除急性胆管炎','急性胆管炎'],['急性胆管炎已排除','急性胆管炎'],
 ['不能排除急性胆管炎','急性胆管炎'],['如果出血再进行内镜止血','内镜止血'],
 ['不需要复苏','复苏'],['需要复苏，但是不需要复苏','复苏'],
 ['质子泵抑制剂','大剂量PPI'],['PPI','静脉PPI'],['24小时内内镜','12小时内内镜'],
 ['12cm','12mm'],['112','12'],['EUS-FNA','FNB'],['IBD','UC'],['ERCP','MRCP'],
 ['未见即时并发症不能确定','未见即时并发症'],['存在即时并发症','未见即时并发症']
])test(`no false credit: ${input} -> ${target}`,()=>assert.equal(C.semanticMatch(input,target).ok,false));
for(const [input,target]of [['GERD','胃食管反流病'],['建议使用静脉PPI','静脉质子泵抑制剂'],['予抗生素','抗菌药'],['明确急性胆管炎','急性胆管炎'],['无即时并发症','未见即时并发症'],['内镜下止血','内镜止血']])test(`explicit equivalent: ${input}`,()=>assert.equal(C.semanticMatch(input,target).ok,true));
test('aliases are non-recursive and preserve spelling differences',()=>{assert.equal(C.canonical('胃食管反流病'),'胃食管反流病');assert.notEqual(C.canonical('急性胆囊炎'),C.canonical('急性胆管炎'))});
test('frozen daily plan survives completion, refresh and profile reload',()=>{
 let p={};let count=0;const make=()=>[{id:'case-'+(++count)}];const a=C.frozenPlan(p,'2026-09-06',make);p.scores={[a[0].id]:100};p=JSON.parse(JSON.stringify(p));assert.deepEqual(C.frozenPlan(p,'2026-09-06',make),a);assert.equal(count,1);assert.notDeepEqual(C.frozenPlan(p,'2026-09-07',make),a)
});
test('actual V21 scheduler remains fixed after GERD completion',()=>{
 const root=path.join(__dirname,'..'),ctx={window:{},GI24:C,session:{name:'audit2'}};vm.createContext(ctx);
 for(const f of ['data.js','training_data.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);
 Object.assign(ctx,{GI_CASES:ctx.window.GI_CASES,GI_PROCEDURES:ctx.window.GI_PROCEDURES});
 const source=fs.readFileSync(path.join(root,'v21.js'),'utf8');vm.runInContext(source.slice(0,source.indexOf('function dailyTraining()'))+'window.plan=buildDailyPlan;})();',ctx);
 const p={scores:{},wrong:[],procedures:{},history:[],v20:{history:[]},v21:{daily:{}}};const before=JSON.stringify(ctx.window.plan(p,'2026-09-06','audit2'));
 const id=JSON.parse(before)[0].id;p.scores[id]=100;p.history.push({caseId:id,at:'2026-09-06T10:00:00+08:00'});assert.equal(JSON.stringify(ctx.window.plan(p,'2026-09-06','audit2')),before)
});
test('report completeness is not medical credit',()=>{const v=Object.fromEntries(Array.from({length:10},(_,i)=>['field'+i,'乱写']));const r=C.safeReport(v,[['field0',['12mm']],['field1',['乙状结肠']]]);assert.equal(r.completeness,100);assert.equal(r.content,0);assert.equal(r.pending,true)});
test('shuffle keeps option identity and answer index mapping',()=>{for(let seed=0;seed<100;seed++){const order=C.shuffle([0,1,2,3],C.rngFrom(seed));assert.deepEqual([...order].sort(),[0,1,2,3]);assert.equal(order.filter(x=>x===0).length,1)}});
test('research export does not leak account fields or narrative by default',()=>{
 const p={accounts:{passwordHash:'SECRET'},password:'SECRET',v24:{participantId:'P-01',attempts:[{id:'a',kind:'case',caseId:'X',freeText:{dx:'SENSITIVE'},chat:['SENSITIVE'],passwordHash:'SECRET',responses:[{questionId:'q',answer:'SENSITIVE',selected:0,order:[1,0]}]}]}};
 const out=JSON.stringify(C.researchRows({realName:p}));for(const word of ['SECRET','SENSITIVE','realName','passwordHash'])assert(!out.includes(word));assert(out.includes('P-01'));assert(JSON.stringify(C.researchRows({realName:p},true)).includes('SENSITIVE'));
});
test('CSV escapes formulas and preserves multiline values',()=>{const out=C.csv([{value:'=1+1',text:'a,"b"\nc'}]);assert(out.includes("'=1+1"));assert(out.includes('""b""'))});
test('backup import rejects wrong format and reserved profile names',()=>{assert.throws(()=>C.validateBackup({}));assert.throws(()=>C.validateBackup(JSON.parse('{"format":"gi24-learning-backup","version":"24.0.0","profiles":{"__proto__":{"history":[],"wrong":[]}}}')))});
