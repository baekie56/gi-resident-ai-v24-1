/* Rebuild traceable inventories from the checked-in teaching bank; does not download media. */
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const R=path.resolve(__dirname,'..'),W={},ctx={window:W,GI24:require('../js/core.js')};vm.createContext(ctx);
const read=f=>fs.readFileSync(path.join(R,f),'utf8');
for(const f of ['data.js','training_data.js','v4_data.js','local_images.js'])vm.runInContext(read(f),ctx);
function prefix(file,marker,expression){const s=read(file);if(!s.includes(marker))throw Error(marker);vm.runInContext(s.slice(0,s.indexOf(marker))+'window._metadata='+expression+';})();',ctx);return W._metadata}
const tools=prefix('v18.js','const ORDER','TOOLS');
const modules=prefix('v20.js','let dynamicState','{DYNAMIC_CASES,RESCUE_CASES,REPORT_CASES,MULTI_CASES}');
const anatomy=prefix('v5.js',"let atlasMode",'{anatomySets,U_SRC,L_SRC}');
const tutorials=prefix('v23.js','let tutorialState','TUTORIALS');
const D=path.join(R,'docs');fs.mkdirSync(D,{recursive:true});
const csv=(name,rows)=>{const keys=Object.keys(rows[0]);const q=x=>'"'+String(x??'').replace(/"/g,'""')+'"';fs.writeFileSync(path.join(D,name),'\ufeff'+[keys.map(q).join(','),...rows.map(r=>keys.map(k=>q(r[k])).join(','))].join('\r\n'),'utf8')};
const cases=W.GI_CASES;
fs.writeFileSync(path.join(D,'patient_bank.json'),JSON.stringify(cases.map(c=>Object.fromEntries(['id','age','sex','chief','intro','qa'].filter(k=>k in c).map(k=>[k,c[k]]))),null,2));
const content=[];
function row(kind,c,n){content.push({模块:kind,项目ID:c.id,名称:c.title||c.name,题目或步骤数:n,题库版本:'2026-09-06.1',培训阶段:'导师按先修能力指定',学习目标:'识别风险与结构化推理/见项目内容',关键安全错误标准:'待专科制定',指南条款与适用人群:'待逐项核查',合理替代答案:'待补充',审核状态:'待专科审核',审核者:'',审核日期:'',问题与修订记录:'',复核者:''})}
cases.forEach(c=>row('病例推理',c,c.decisions.length));
for(const [kind,items]of Object.entries(modules))for(const c of items)row(kind,c,c.steps?.length||c.checks?.length||1);
for(const c of W.GI_PROCEDURES)row('内镜术式',c,c.steps?.length||'');
csv('CONTENT_REVIEW.csv',content);
const sourceMap=new Map();
function put(file,source,note){if(!file||!file.startsWith('assets/'))return;file=path.posix.normalize(file);const a=sourceMap.get(file)||[];a.push({source:source||'',note:note||''});sourceMap.set(file,a)}
for(const [id,x]of Object.entries(W.GI_IMAGES||{}))put(x.src,x.source,[id,x.credit].filter(Boolean).join(' · '));
for(const [id,x]of Object.entries(tools))for(const k of ['main','detail'])put(x[k],x.url,`${id} ${x.model} ${k}；原包来源声明未核验授权`);
for(const [tract,set]of Object.entries(anatomy.anatomySets))for(const x of set)put(x[4]==='commons'?'assets/'+x[2]:'assets/anatomy/'+x[2],x[4]==='commons'?'https://commons.wikimedia.org/wiki/File:Colonoscopy_splenic_flexure.jpg':tract==='upper'?anatomy.U_SRC:anatomy.L_SRC,x[0]+'；原包部位标注待签审');
// A tutorial's guideline link is not automatically its image copyright source.
for(const [id,t]of Object.entries(tutorials))for(const st of t.steps||[])put(st[2],'',`${id}教程；指南链接仅作教学参考：${t.source||''}`);
for(const file of sourceMap.keys())if(!fs.existsSync(path.join(R,file)))throw Error('Missing computed image path: '+file);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(dir,x.name)):[path.join(dir,x.name)])}
const files=walk(R).filter(f=>/\.(png|jpe?g|webp|gif|svg)$/i.test(f));
const rootCode=walk(R).filter(f=>/\.(js|css|html)$/.test(f)&&!f.includes(path.sep+'scripts'+path.sep)).map(f=>({f:path.relative(R,f).replaceAll('\\','/'),s:fs.readFileSync(f,'utf8')}));
const assets=files.map(f=>{const rel=path.relative(R,f).replaceAll('\\','/'),hash=crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'),m=sourceMap.get(rel)||[];return {相对路径:rel,字节数:fs.statSync(f).size,SHA256:hash,原包声明来源:[...new Set(m.map(x=>x.source).filter(Boolean))].join(' | '),来源状态:m.some(x=>x.source)?'原包声明线索，待核实':'待溯源',权利人与许可证:'待核实',允许软件分发及论文复用:'待确认',授权或许可证据文件:'',署名要求:'待核实',可检索引用文件:rootCode.filter(x=>x.s.includes(rel)||x.s.includes(path.basename(rel))).map(x=>x.f).join(' | '),备注:m.map(x=>x.note).join(' | '),同内容文件:'',审核者:'',审核日期:''}});
for(const a of assets){a.同内容文件=assets.filter(b=>b.SHA256===a.SHA256&&b!==a).map(b=>b.相对路径).join(' | ');if(/fnb_02_sample|fna_02_sample/.test(a.相对路径))a.备注+='；共享FNA细胞学示例，非FNB组织柱；建议用自有授权图替换'}
csv('ASSET_REGISTER.csv',assets);
const summary={softwareVersion:'24.0.0',bankVersion:'2026-09-06.1',cases:cases.length,decisions:cases.reduce((n,c)=>n+c.decisions.length,0),caseIds:cases.map(c=>c.id),modules:Object.fromEntries(Object.entries(modules).map(([k,a])=>[k,a.length])),procedures:W.GI_PROCEDURES.length,images:assets.length,contentReviewRows:content.length,imagesWithSourceClue:assets.filter(a=>a.原包声明来源).length,allMedicalReview:'pending',allAssetPermissions:'pending'};
fs.writeFileSync(path.join(D,'inventory.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));
