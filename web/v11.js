(function(){
const A='assets/procedure/';
const REAL_TOOL={
 '注射针':'assets/procedure/tools/注射针_display.png','FNA穿刺针':'assets/procedure/tools/FNA穿刺针_display.png','FNB穿刺针':'assets/procedure/tools/FNB穿刺针_display.png',
 '导丝':'assets/procedure/tools/导丝_display.png','取石球囊':'assets/procedure/tools/取石球囊_display.png','乳头切开刀':'assets/procedure/tools/乳头切开刀_display.png',
 'DualKnife':'assets/procedure/tools/DualKnife_display.png','隧道刀':'assets/procedure/tools/隧道刀_display.png','APC探头':'assets/procedure/tools/APC探头_display.png',
 '圈套器':'assets/procedure/tools/圈套器_display.png','套扎器':'assets/procedure/tools/套扎器_display.png','止血夹':'assets/procedure/tools/止血夹_display.png'
};
const REAL_SIM={
 ERCP:{title:'ERCP · 真实序列图（胆总管结石取石）',subtitle:'基于开放获取文献截图裁切成步骤图，随操作推进而变图。',tools:['导丝','取石球囊'],source:'开放获取文献真实病例图（裁切后用于教学）',steps:[
  {title:'选择性建立胆道通路',task:'把【导丝】拖到图中的操作区域，模拟胆道插管通路建立。',before:A+'real/ercp_01.png',after:A+'real/ercp_02.png',tool:'导丝',zone:[45,40,20,24],note:'真实图第1步：确认胆道结石后，先建立通路。'},
  {title:'球囊扩张乳头出口',task:'把【取石球囊】拖到乳头/出口处理区域，完成扩张。',before:A+'real/ercp_02.png',after:A+'real/ercp_03.png',tool:'取石球囊',zone:[44,38,24,26],note:'真实图第2步：球囊扩张，为后续取石创造条件。'},
  {title:'继续完成取石',task:'继续使用【取石球囊】拖到目标区域，把结石拖出。',before:A+'real/ercp_03.png',after:A+'real/ercp_04.png',tool:'取石球囊',zone:[43,40,24,28],note:'真实图第3步：结石被拖出，可见取石后的状态。'}]},
 EVL:{title:'EVL · 真实序列图（真实病例步骤）',subtitle:'已改成真实内镜图序列；当前采用真实 EVBL 相关病例步骤图，重点训练“图像变化 + 器械落点”。',tools:['套扎器','圈套器','取石球囊'],source:'开放获取文献真实病例图（裁切后用于教学）',steps:[
  {title:'识别套扎后目标区',task:'把【套扎器】拖到病变柱状区域，表示完成套扎后的靶向处理与观察。',before:A+'real/evl_01.png',after:A+'real/evl_02.png',tool:'套扎器',zone:[28,18,36,46],note:'真实图第1步：内镜下目标区与套扎后状态。'},
  {title:'对准皮圈部位处理',task:'把【圈套器】拖到皮圈/嵌顿区域，进入下一步处理。',before:A+'real/evl_02.png',after:A+'real/evl_03.png',tool:'圈套器',zone:[24,26,34,40],note:'真实图第2步：器械已到位，继续处理局部区域。'},
  {title:'完成扩张处理',task:'把【取石球囊】拖到狭窄处理区域，完成本轮操作。',before:A+'real/evl_03.png',after:A+'real/evl_04.png',tool:'取石球囊',zone:[24,26,40,42],note:'真实图第3步：完成处理后可见最终状态变化。'}]}
};
function gs(k,d){ const p=window.prof&&window.prof(); if(!p) return d; p.procedures=p.procedures||{}; return p.procedures[k]||d; }
function ss(k,v){ const p=window.prof&&window.prof(); if(!p) return; p.procedures=p.procedures||{}; p.procedures[k]=v; if(window.save) save(); }
let current={id:null,idx:0,score:0,selected:null};
function imgTool(t){ return REAL_TOOL[t] || 'assets/procedure/tools/止血夹_display.png'; }
function toolCard(t){ return `<div class="rp-tool ${current.selected===t?'active':''}" draggable="true" data-tool="${t}" onclick="v11PickTool('${t}')"><img src="${imgTool(t)}" onerror="this.src='assets/procedure/tools/止血夹_display.png'" alt="${t}"><div><b>${t}</b></div></div>`; }
window.v11PickTool=function(t){ current.selected=t; renderRealStep(); };
function finishReal(){ const proc=REAL_SIM[current.id]; const pct=Math.round(current.score/proc.steps.length*100); const key='real_'+current.id; const prev=gs(key,{best:0,runs:0}); prev.best=Math.max(prev.best||0,pct); prev.runs=(prev.runs||0)+1; prev.last=new Date().toISOString(); ss(key,prev); const p=window.prof&&window.prof(); if(p){ p.xp=(p.xp||0)+Math.max(8,pct/10|0); if(window.save) save(); }
 $('#main').innerHTML=head(proc.title,'真实步骤图训练已完成。','REAL SEQUENCE COMPLETE')+
 `<div class="grid g3">${metric('本轮正确率',pct+'%',`${current.score}/${proc.steps.length} 步`)}${metric('历史最好',prev.best+'%','个人最佳')}${metric('完成轮次',prev.runs,'累计')}</div>
 <div class="card" style="margin-top:16px"><h2>${pct>=80?'✅ 已掌握基本流程':'🔁 建议再练一遍'}</h2><p>${proc.source}</p><div class="row"><button class="btn" onclick="launchV9('${current.id}')">再练一轮</button><button class="btn ghost" onclick="procedures()">返回术式页</button></div></div>`;
 }
 function handleCheck(tool){ const proc=REAL_SIM[current.id], st=proc.steps[current.idx]; const ok=tool===st.tool; const fb=$('#v11Feedback'); fb.className='feedback '+(ok?'good':'bad'); fb.innerHTML=`<b>${ok?'✓ 操作正确':'✗ 器械不对'}</b><br>${ok?st.note:'本步应使用：'+st.tool}`; if(ok){ current.score++; setTimeout(()=>{ current.idx++; current.selected=null; if(current.idx>=proc.steps.length) finishReal(); else renderRealStep(); },500); } }
 window.v11Drop=function(ev){ ev.preventDefault(); const tool=(ev.dataTransfer&&ev.dataTransfer.getData('text/plain'))||current.selected; if(!tool) return; handleCheck(tool); };
 window.v11Allow=function(ev){ ev.preventDefault(); };
 window.v11UseSelected=function(){ if(current.selected) handleCheck(current.selected); };
 function renderRealStep(){ const proc=REAL_SIM[current.id], st=proc.steps[current.idx]; const s=gs('real_'+current.id,{best:0,runs:0}); $('#main').innerHTML=head(proc.title,proc.subtitle,'REAL SEQUENCE LAB v11')+
 `<div class="notice"><b>来源说明：</b>${proc.source}。当前这一版重点先把 <b>${current.id}</b> 从“模拟图”升级成“真实连续步骤图”。</div>
 <div class="card realsim-card"><div class="clinical-prompt"><span>第 ${current.idx+1}/${proc.steps.length} 步 · 历史最好 ${s.best||0}%</span><h2>${st.title}</h2><p>${st.task}</p></div>
 <div class="realsim-wrap"><div class="realsim-image"><img src="${st.before}" alt="step image"><div class="dropzone" style="left:${st.zone[0]}%;top:${st.zone[1]}%;width:${st.zone[2]}%;height:${st.zone[3]}%" ondragover="v11Allow(event)" ondrop="v11Drop(event)" onclick="v11UseSelected()"></div></div>
 <div class="realsim-tools"><h3>器械托盘</h3>${proc.tools.map(toolCard).join('')}</div></div>
 <div id="v11Feedback" class="feedback mid"><b>提示</b><br>${st.note}</div><div class="row" style="margin-top:12px"><button class="btn ghost" onclick="procedures()">返回术式页</button></div></div>`;
 $$('.rp-tool').forEach(el=>el.addEventListener('dragstart',e=>{current.selected=el.dataset.tool; e.dataTransfer.setData('text/plain', el.dataset.tool);}));
 }
 function launchReal(id){ current={id,idx:0,score:0,selected:null}; renderRealStep(); }
 const oldLaunch=window.launchV9;
 if(oldLaunch){ window.launchV9=function(id){ if(REAL_SIM[id]) return launchReal(id); return oldLaunch(id); }; }
 // override atlas to emphasize real photos and prevent broken images
 window.openToolAtlas=function(){
   const data=[
    ['注射针','真实器械照片（产品照）','黏膜下注射 / 抬举'],['DualKnife','真实器械近景','ESD 切开剥离'],['圈套器','真实器械照片（产品照）','EMR / 息肉圈套'],['套扎器','真实内镜操作照片','EVL 套扎'],['导丝','真实器械照片（产品照）','ERCP / ERAT 通路建立'],['取石球囊','真实内镜操作照片','ERCP 取石'],['乳头切开刀','真实器械近景','ERCP 切开'],['FNA穿刺针','真实器械照片（产品照）','EUS-FNA'],['FNB穿刺针','真实器械照片（产品照）','EUS-FNB'],['APC探头','真实器械近景','APC 热凝']
   ];
   $('#main').innerHTML=head('器械图库 v11','尽量替换为真实器械照片或真实术中器械照片，减少示意图。','REAL TOOL ATLAS v11')+
   `<div class="notice"><b>说明：</b>这一版优先修复“器械图片不显示”和“示意图过多”的问题。已把常用器械尽量换成真实器械照或真实术中器械照。</div><div class="toollab-grid">`+
   data.map(([n,t,u])=>`<div class="toollab-card"><img src="${imgTool(n)}" onerror="this.src='assets/procedure/tools/止血夹_display.png'" alt="${n}"><div><h3>${n}</h3><p>${u}</p></div></div>`).join('')+
   `</div><div class="row" style="margin-top:16px"><button class="btn ghost" onclick="procedures()">返回术式页</button></div>`;
 };
 // append real performance to report
 const oldReport=window.report;
 if(oldReport){ window.report=function(){ oldReport(); const p=window.prof&&window.prof(); if(!p||!p.procedures) return; const arr=['real_ERCP','real_EVL'].filter(k=>p.procedures[k]); if(!arr.length) return; const box=document.createElement('div'); box.className='card'; box.style.marginTop='16px'; box.innerHTML='<div class="section" style="margin-top:0"><h2>📸 真实序列图训练成绩</h2><small>v11 新增：ERCP / EVL 真实步骤图</small></div>'+arr.map(k=>{const v=p.procedures[k]; return `<div class="step-answer" style="margin-bottom:10px"><div class="answer-step"><b>${k.replace('real_','')}</b><span>历史最好 ${v.best||0}% · 完成 ${v.runs||0} 轮</span></div></div>`}).join(''); document.getElementById('main').appendChild(box); }; }
 const style=document.createElement('style'); style.textContent=`
 .realsim-card{padding:18px}.realsim-wrap{display:grid;grid-template-columns:minmax(0,1.2fr) 320px;gap:18px;align-items:start}.realsim-image{position:relative;border-radius:18px;overflow:hidden;background:#0b1324}.realsim-image img{display:block;width:100%;max-height:520px;object-fit:contain;background:#111827}.dropzone{position:absolute;border:3px dashed #facc15;border-radius:16px;background:rgba(250,204,21,.16);box-shadow:0 0 0 9999px rgba(17,24,39,.05) inset;cursor:pointer}.dropzone:hover{background:rgba(250,204,21,.28)}.realsim-tools{background:#f8fafc;border:1px solid #e4e7ec;border-radius:18px;padding:12px}.realsim-tools h3{margin:0 0 10px}.rp-tool{display:grid;grid-template-columns:88px 1fr;gap:12px;align-items:center;padding:10px;border:1px solid #e4e7ec;border-radius:14px;background:#fff;margin-bottom:10px;cursor:grab}.rp-tool.active{border-color:#2f6df6;box-shadow:0 0 0 3px rgba(47,109,246,.12)}.rp-tool img{width:88px;height:72px;object-fit:contain;background:#fff;border-radius:10px;border:1px solid #eef2f6}.rp-tool small{display:block;color:#667085}.toollab-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:16px}.toollab-card{display:grid;grid-template-columns:120px 1fr;gap:14px;background:#fff;border:1px solid #e4e7ec;border-radius:18px;padding:14px;align-items:center}.toollab-card img{width:120px;height:92px;object-fit:contain;background:#fff;border-radius:12px;border:1px solid #eef2f6}@media(max-width:980px){.realsim-wrap{grid-template-columns:1fr}.toollab-grid{grid-template-columns:1fr}.toollab-card{grid-template-columns:92px 1fr}.toollab-card img{width:92px;height:76px}}
 `; document.head.appendChild(style);
 try{document.title='GI Resident AI V24.0 · 住培辅助教学';}catch(e){}
})();
