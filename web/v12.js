(function(){
const A='assets/procedure/';
const R=A+'real_v12/';
const TOOL={
 '导丝':'assets/procedure/tools/导丝_display.png','冲洗导管':'assets/procedure/tools/冲洗导管_display.png','取石球囊':'assets/procedure/tools/取石球囊_display.png',
 'FNA穿刺针':'assets/procedure/tools/FNA穿刺针_display.png','FNB穿刺针':'assets/procedure/tools/FNB穿刺针_display.png','止血夹':'assets/procedure/tools/止血夹_display.png'
};
const REAL12={
 ERAT:{title:'ERAT · 真实连续病例图',source:'BMC Gastroenterology 2022，开放获取真实ERAT六联图；已拆分为独立步骤图。',tools:['导丝','冲洗导管'],steps:[
  {title:'识别阑尾开口',img:R+'erat_01.jpg',next:R+'erat_02.jpg',tool:'导丝',zone:[47,50,28,28],task:'先定位充血水肿的阑尾开口，把导丝拖到阑尾开口区域。',note:'下一张真实图进入逆行造影/腔内评估阶段。'},
  {title:'建立导丝通路',img:R+'erat_02.jpg',next:R+'erat_03.jpg',tool:'导丝',zone:[57,58,28,34],task:'根据造影所示阑尾腔方向，将导丝推进至阑尾腔。',note:'真实下一步可见导管/导丝进入并有脓液、碎屑排出。'},
  {title:'冲洗并减压',img:R+'erat_03.jpg',next:R+'erat_04.jpg',tool:'冲洗导管',zone:[51,54,34,36],task:'换用冲洗导管，对阑尾腔冲洗减压并处理碎屑。',note:'真实下一步进入残余结石/碎屑处理。'},
  {title:'处理残余梗阻物',img:R+'erat_04.jpg',next:R+'erat_05.jpg',tool:'冲洗导管',zone:[52,50,32,36],task:'继续在阑尾腔目标区域处理残余梗阻物，恢复腔内通畅。',note:'处理后造影可见阑尾腔较前通畅。'},
  {title:'确认通畅',img:R+'erat_05.jpg',next:R+'erat_06.jpg',tool:'导丝',zone:[54,54,30,38],task:'再次沿阑尾腔走行确认通畅，并进入最终引流阶段。',note:'最终真实图显示支架/引流状态。'}
 ]},
 FNA:{title:'EUS-FNA · 真实胰腺肿块穿刺图',source:'World Journal of Gastroenterology 2007开放获取文章真实EUS-FNA图：白箭头为胰腺肿块，虚线箭头为FNA针；完成后展示同一研究的真实细胞学标本。',tools:['FNA穿刺针'],steps:[
  {title:'识别病灶与针路',img:R+'fna_01_eus.jpg',next:R+'fna_02_sample.jpg',tool:'FNA穿刺针',zone:[60,44,28,30],task:'把FNA穿刺针拖到真实EUS图中胰腺肿块/针尖进入区域，模拟完成穿刺取材。',note:'成功后不是示意图，而是切换到该研究真实EUS-FNA取材后的细胞学标本。'}
 ]},
 FNB:{title:'EUS-FNB · 真实EUS穿刺认知训练',source:'穿刺影像采用真实EUS针穿刺胰腺肿块图。FNB与FNA在EUS屏幕上的进针外观相近；本关用真实FNB器械图区分器械，并明确不把示意图冒充为“FNB专属病例连续图”。',tools:['FNB穿刺针'],steps:[
  {title:'选择FNB针并命中病灶',img:R+'fnb_01_eus.jpg',next:R+'fnb_02_sample.jpg',tool:'FNB穿刺针',zone:[60,44,28,30],task:'选择真实FNB穿刺针图片，把针拖到真实EUS病灶区域。',note:'完成后展示共享FNA细胞学示例，不是FNB组织柱。穿刺影像亦为共享EUS教学图；FNB标本判断需使用适当组织学材料。'}
 ]}
};
let S=null;
function pstat(id){const p=window.prof&&prof(); if(!p)return {best:0,runs:0}; p.procedures=p.procedures||{}; return p.procedures['v12_'+id]||{best:0,runs:0};}
function saveStat(id,pct){if(window.finishModule24)finishModule24('simulation',id+' 流程认知',pct);const p=window.prof&&prof();if(!p)return; p.procedures=p.procedures||{};const s=p.procedures['v12_'+id]||{best:0,runs:0};s.best=Math.max(s.best||0,pct);s.latest=pct;s.runs=(s.runs||0)+1;s.last=new Date().toISOString();p.procedures['v12_'+id]=s;p.xp=(p.xp||0)+Math.max(8,Math.round(pct/10));if(window.save)save();}
function toolCard(t){return `<div class="v12tool" draggable="true" data-tool="${t}" onclick="v12Pick('${t}')"><img src="${TOOL[t]}" onerror="this.src='assets/procedure/tools/止血夹_display.png'" alt="${t}"><div><b>${t}</b></div></div>`}
window.v12Pick=function(t){S.selected=t;document.querySelectorAll('.v12tool').forEach(x=>x.classList.toggle('active',x.dataset.tool===t));};
window.v12Allow=e=>e.preventDefault();
window.v12Drop=function(e){e.preventDefault();const t=(e.dataTransfer&&e.dataTransfer.getData('text/plain'))||S.selected;attempt(t)};
window.v12Tap=function(){if(S.selected)attempt(S.selected)};
function attempt(t){const d=REAL12[S.id],st=d.steps[S.i],f=$('#v12fb');if(S.busy24||!f)return;if(window.simulationEvent24)simulationEvent24(S.i,t,t===st.tool,st.note);if(t!==st.tool){S.lives--;f.className='feedback mid';f.innerHTML=`<b>器械不对</b><br>当前步骤应使用：${st.tool}`;if(S.lives<=0)finish(false);return;}S.busy24=true;S.ok++;f.className='feedback good';f.innerHTML=`<b>✓ 操作正确</b><br>${st.note}`;const im=$('#v12img');im.classList.add('fade');setTimeout(()=>{im.src=st.next;im.onload=()=>im.classList.remove('fade')},180);setTimeout(()=>{if(!$('#v12fb'))return;S.busy24=false;S.i++;S.selected=null;if(S.i>=d.steps.length)finish(true);else render();},800)}
function finish(win){const d=REAL12[S.id],pct=Math.round(S.ok/d.steps.length*100);saveStat(S.id,pct);$('#main').innerHTML=head(`${d.title} · ${win?'完成':'失败'}`,d.source,'V12 REAL-SEQUENCE COMPLETE')+`<div class="grid g3">${metric('本轮成绩',pct+'%',`${S.ok}/${d.steps.length}`)}${metric('最近一次',pstat(S.id).latest+'%')}${metric('完成轮次',pstat(S.id).runs,'次')}</div><div class="card" style="margin-top:16px"><h2>${win?'真实图流程完成':'建议重新训练'}</h2><p>${d.source}</p><div class="row"><button class="btn" onclick="launchV9('${S.id}')">再练一轮</button><button class="btn ghost" onclick="procedures()">返回训练营</button></div></div>`}
function render(){const d=REAL12[S.id],st=d.steps[S.i];$('#main').innerHTML=head(d.title,st.task,`REAL IMAGE ${S.i+1}/${d.steps.length}`)+`<div class="notice"><b>真实图片模式：</b>${d.source}</div><div class="v12layout"><section class="v12monitor"><img id="v12img" src="${st.img}"><div class="v12zone" style="left:${st.zone[0]-st.zone[2]/2}%;top:${st.zone[1]-st.zone[3]/2}%;width:${st.zone[2]}%;height:${st.zone[3]}%" ondragover="v12Allow(event)" ondrop="v12Drop(event)" onclick="v12Tap()"></div><div class="v12hud">STEP ${S.i+1}/${d.steps.length} · ♥${'♥'.repeat(Math.max(0,S.lives-1))}</div></section><aside class="v12tray"><h3>器械托盘</h3><p>拖真实器械照片到目标区域</p>${d.tools.map(toolCard).join('')}<div id="v12fb" class="feedback mid"><b>任务</b><br>${st.task}</div></aside></div><div class="card" style="margin-top:12px"><b>当前真实图解释：</b> ${st.note}</div>`;document.querySelectorAll('.v12tool').forEach(el=>el.addEventListener('dragstart',e=>{S.selected=el.dataset.tool;e.dataTransfer.setData('text/plain',el.dataset.tool)}));}
window.launchV12=function(id){S={id,i:0,ok:0,lives:3,selected:null};render();};
const oldLaunch=window.launchV9;
if(oldLaunch){window.launchV9=function(id){if(REAL12[id])return launchV12(id);return oldLaunch(id)}}
const oldProc=window.procedures;
if(oldProc){window.procedures=function(){oldProc();const m=document.querySelector('#main');if(!m)return;const n=document.createElement('div');n.className='notice v12status';n.innerHTML='<b>v12真实化进度：</b> ERAT、EUS-FNA、EUS-FNB 已切换到真实医学图训练；ERCP、EVL沿用v11真实序列图；ESD/EMR/APC沿用原真实阶段图。<b>POEM暂不再用模拟图冒充真实：</b>仍标记为待替换真实连续图。';const first=m.querySelector('.procedure-grid');if(first)first.before(n);}}
const css=document.createElement('style');css.textContent=`.v12layout{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:16px}.v12monitor{position:relative;background:#071018;border-radius:22px;overflow:hidden;min-height:520px}.v12monitor>img{width:100%;height:100%;max-height:620px;object-fit:contain;display:block;transition:opacity .2s}.v12monitor>img.fade{opacity:.15}.v12zone{position:absolute;border:3px dashed #fbbf24;background:#fbbf2425;border-radius:18px;cursor:pointer;box-shadow:0 0 20px #fbbf2455}.v12hud{position:absolute;top:12px;left:12px;background:#000c;color:#fff;padding:7px 10px;border-radius:8px;font:800 11px ui-monospace,monospace}.v12tray{background:#fff;border:1px solid #e4e7ec;border-radius:18px;padding:14px}.v12tool{display:grid;grid-template-columns:92px 1fr;gap:10px;align-items:center;border:2px solid #e4e7ec;border-radius:14px;padding:8px;margin:9px 0;background:#f8fafc;cursor:grab}.v12tool.active{border-color:#2e90fa;box-shadow:0 0 0 3px #2e90fa22}.v12tool img{width:92px;height:76px;object-fit:contain;background:#fff}.v12tool small{display:block;color:#667085;margin-top:3px}.v12status{margin:14px 0}@media(max-width:900px){.v12layout{grid-template-columns:1fr}.v12monitor{min-height:380px}}`;document.head.appendChild(css);
try{document.title='GI Resident AI V24.0 · 住培辅助教学';}catch(e){}
})();
