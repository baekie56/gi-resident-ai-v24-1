(function(){
const A='assets/procedure/tools/';
const CANON={
 '注射针':A+'注射针_display.png',
 'DualKnife':A+'DualKnife_display.png',
 'Coagrasper':A+'Coagrasper_display.png',
 '圈套器':A+'圈套器_display.png',
 'APC探头':A+'APC探头_display.png',
 '止血夹':A+'止血夹_display.png',
 '套扎器':A+'套扎器_display.png',
 'FNA穿刺针':A+'FNA穿刺针_display.png',
 'FNB穿刺针':A+'FNB穿刺针_display.png',
 '乳头切开刀':A+'乳头切开刀_display.png',
 '导丝':A+'导丝_display.png',
 '取石球囊':A+'取石球囊_display.png',
 '隧道刀':A+'隧道刀_display.png',
 '冲洗导管':A+'冲洗导管_display.png',
 '切开刀':A+'切开刀_display.png'
};
const TOOL_INFO=[
 ['注射针','黏膜下注射、病灶抬举'],['DualKnife','ESD / POEM 切开与剥离'],['Coagrasper','术中止血'],['圈套器','EMR 套圈与切除'],['APC探头','APC 热凝'],['止血夹','创面夹闭 / 止血'],['套扎器','EVL 套扎'],['导丝','ERCP / ERAT 建立通道'],['乳头切开刀','ERCP 乳头切开'],['取石球囊','ERCP 取石'],['FNA穿刺针','EUS-FNA'],['FNB穿刺针','EUS-FNB'],['隧道刀','POEM 隧道与肌切开'],['冲洗导管','ERAT / ERCP 冲洗辅助']
];
function toolSrc(name){ return CANON[name] || CANON['止血夹']; }
function preload(){ Object.values(CANON).forEach(src=>{ const img=new Image(); img.src=src; }); }
function findToolName(el){
  if(!el) return null;
  const direct=el.getAttribute('data-tool') || el.dataset?.tool || el.getAttribute('alt');
  if(direct && CANON[direct]) return direct;
  const wrap=el.closest('[data-tool], .v16tool, .v15tool, .v14-tool, .v13tool, .v12tool, .rp-tool, .v7-tool, .toollab-card, .v13atlas-card, .v15card, .v16card, tr, .choice, .proc-card');
  if(wrap){
    const dt=wrap.getAttribute('data-tool'); if(dt && CANON[dt]) return dt;
    const txt=(wrap.innerText||'').replace(/\s+/g,' ');
    for(const k of Object.keys(CANON)){ if(txt.includes(k)) return k; }
  }
  const parentTxt=(el.parentElement?.innerText||'')+' '+(el.nextElementSibling?.innerText||'');
  for(const k of Object.keys(CANON)){ if(parentTxt.includes(k)) return k; }
  return null;
}
function patchImg(img){
  if(!img) return;
  // v19 高清图库自己管理“整器械 + 细节”双图，旧版自动修复不能覆盖它。
  if(img.closest('.v19card, .v19lightbox')) return;
  const name=findToolName(img);
  if(!name) return;
  const desired=toolSrc(name);
  // If wrong image (e.g. snare fallback) or broken, replace it.
  const src=img.getAttribute('src')||'';
  if(src.includes('snare_real') && name!=='圈套器') img.src=desired;
  if(src.includes('止血夹') && name!=='止血夹' && src!==desired) img.src=desired;
  if(!src || src!==desired) img.src=desired;
  img.setAttribute('alt',name);
  img.onerror=function(){ this.onerror=null; this.src=desired; };
  img.loading='eager';
  img.decoding='sync';
}
function patchAll(root=document){
  const selectors=[
    'img[alt]', '.v7-tool img', '.v12tool img', '.v13tool img', '.v14-tool img', '.v15tool img', '.v16tool img', '.rp-tool img',
    '.toollab-card img', '.v13atlas-card img', '.v15card img', '.v16card img', '.audit img', '.v15atlas img', '.v16atlas img'
  ].join(',');
  root.querySelectorAll(selectors).forEach(patchImg);
}
window.fixAllToolImages=patchAll;
// Strong observer: after any DOM mutation, re-patch tool images.
const mo=new MutationObserver(ms=>{ patchAll(document); });
mo.observe(document.documentElement,{subtree:true,childList:true,attributes:false});
window.addEventListener('load',()=>{ preload(); patchAll(document); setTimeout(()=>patchAll(document),300); setTimeout(()=>patchAll(document),1200); });
// override atlas with robust display-only images
window.openToolAtlas=function(){
  $('#main').innerHTML=head('器械图库 v17','修复器械图片空白/不显示：所有器械卡统一使用预处理后的 display 图片。','TOOL ATLAS v17')+
  `<div class="notice"><b>v17 重点修复：</b>很多器械图在识别和操作演示里不显示，这版统一改成预处理后的 display 图片，并增加页面级自动修复逻辑。现在就算旧页面调用旧路径，也会被自动替换成对应的显示图。</div>
   <div class="v17atlas">${TOOL_INFO.map(([n,u])=>`<div class="v17card" data-tool="${n}"><img src="${toolSrc(n)}" alt="${n}"><div><h3>${n}</h3><p>${u}</p></div></div>`).join('')}</div>
   <div class="row" style="margin-top:16px"><button class="btn" onclick="openToolAudit()">打开器械校对表</button><button class="btn ghost" onclick="procedures()">返回术式页</button></div>`;
  patchAll(document);
};
window.openToolAudit=function(){
  $('#main').innerHTML=head('器械校对表 v17','用于核对每个器械的显示图、名称与用途。','TOOL AUDIT v17')+
  `<div class="notice"><b>适用场景：</b>如果后续你继续发现某个器械图不对，可以直接在这个表里定位是哪一个器械还要继续换图。</div>
   <table class="audit"><thead><tr><th>器械</th><th>显示图</th><th>用途</th><th>路径</th></tr></thead><tbody>${TOOL_INFO.map(([n,u])=>`<tr data-tool="${n}"><td>${n}</td><td><img src="${toolSrc(n)}" alt="${n}"></td><td>${u}</td><td class="path">${toolSrc(n)}</td></tr>`).join('')}</tbody></table>
   <div class="row" style="margin-top:16px"><button class="btn ghost" onclick="openToolAtlas()">返回器械图库</button></div>`;
  patchAll(document);
};
// Improve training pages text and repair after entering any procedure page
const oldProc=window.procedures;
if(oldProc){
  window.procedures=function(){ oldProc(); const grid=document.querySelector('.procedure-grid'); if(grid){ const note=document.createElement('div'); note.className='notice'; note.style.margin='12px 0 16px'; note.innerHTML='<b>v17 修复：</b>重点处理“器械图空白/不显示”。现在器械识别、器械图库、操作演示中的器械图都会自动修复为对应 display 图。'; grid.before(note); } patchAll(document); };
}
// Patch after clicks that likely enter training modes
window.addEventListener('click',()=>setTimeout(()=>patchAll(document),80),true);
const style=document.createElement('style');
style.textContent=`
.v17atlas{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.v17card{display:grid;grid-template-columns:180px 1fr;gap:14px;background:#fff;border:1px solid #e4e7ec;border-radius:18px;padding:14px;align-items:center}
.v17card img{width:180px;height:120px;object-fit:contain;background:#fff;border:1px solid #eef2f6;border-radius:12px}
.v17card h3{margin:0 0 6px}.v17card p{margin:0;color:#667085}.v17card small{display:block;margin-top:8px;color:#98a2b3;word-break:break-all}
.audit{width:100%;border-collapse:collapse;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e4e7ec}.audit th,.audit td{padding:10px;border-bottom:1px solid #eef2f6;text-align:left;vertical-align:middle}.audit img{width:110px;height:72px;object-fit:contain;background:#fff;border:1px solid #eef2f6;border-radius:10px}.audit .path{font-size:12px;color:#667085;word-break:break-all}
.v7-tool img,.v12tool img,.v13tool img,.v14-tool img,.v15tool img,.v16tool img,.rp-tool img,.toollab-card img,.v13atlas-card img,.v15card img,.v16card img{background:#fff;min-height:70px;object-fit:contain}
@media(max-width:900px){.v17atlas{grid-template-columns:1fr}.v17card{grid-template-columns:120px 1fr}.v17card img{width:120px;height:88px}.audit th:nth-child(4),.audit td:nth-child(4){display:none}}
`;
document.head.appendChild(style);
try{document.title='GI Resident AI V24.0 · 住培辅助教学';}catch(e){}
})();
