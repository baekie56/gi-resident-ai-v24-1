// GI Resident AI v4: verified local anatomy images + procedure game data
(function(){
  window.GI_IMAGES = window.GI_IMAGES || {};
  Object.assign(window.GI_IMAGES, {
    cardiaVerified:{src:'assets/stomach_cardia.jpg',source:'https://commons.wikimedia.org/wiki/File:Stomach_endoscopy_3.jpg',credit:'Ignis · CC BY-SA 3.0 · Wikimedia Commons',verified:'胃贲门真实内镜图 · 本地缓存'},
    pylorusVerified:{src:'assets/stomach_pylorus.jpg',source:'https://commons.wikimedia.org/wiki/File:Stomach_endoscopy_1.jpg',credit:'Ignis · CC BY-SA 3.0 · Wikimedia Commons',verified:'幽门真实内镜图 · 本地缓存'},
    angleVerified:{src:'assets/gastric_angle_verified.jpg',source:'https://www.wjgnet.com/1007-9327/full/v21/i3/WJG-21-759-g020.htm',credit:'Lee SH et al. World J Gastroenterol 2015 · CC BY-NC 4.0 · cropped for teaching',verified:'胃角/J-turn真实内镜图 · 本地缓存'},
    splenicVerified:{src:'assets/colon_splenic_flexure.jpg',source:'https://commons.wikimedia.org/wiki/File:Colonoscopy_splenic_flexure.jpg',credit:'melvil · CC BY-SA 4.0 · Wikimedia Commons',verified:'脾曲真实结肠镜图 · 本地缓存'}
  });
  // Never use a wrong disease image as a location substitute.
  const up=window.GI_ANATOMY?.upper?.nodes||[], low=window.GI_ANATOMY?.lower?.nodes||[];
  up.forEach(n=>{n.imageStatus='待补充部位专属开放授权图片'; n.img=null; n.imgNote='为避免误导，本节点不再用其他疾病或其他部位图片代替。';});
  low.forEach(n=>{n.imageStatus='待补充部位专属开放授权图片'; n.img=null; n.imgNote='为避免误导，本节点不再用其他疾病或其他部位图片代替。';});
  function setNode(list,id,img,note){const n=list.find(x=>x.id===id);if(n){n.img=img;n.imgNote=note;n.imageStatus='已核对部位 · 本地图片';}}
  setNode(up,'u4','cardiaVerified','正常胃贲门真实内镜图，部位与本节点一致。');
  setNode(up,'u7','angleVerified','真实胃角/J-turn视野，绿色虚线标示胃角切迹；该图为原开放许可图局部裁剪。');
  setNode(up,'u9','pylorusVerified','正常幽门真实内镜图，部位与本节点一致。');
  setNode(low,'l4','splenicVerified','正常脾曲结肠镜图，可见透过肠壁的脾影，部位与本节点一致。');

  window.GI_PROCEDURE_GAME={
    ESD:{mission:'胃角0-IIa早癌，完成整块切除并保持安全黏膜下层。',lives:3,rounds:[
      {stage:'定位',prompt:'病灶边界尚不清楚，你的第一步？',choices:['立即深切肌层','充分冲洗、精查边界并决定标记范围','先夹闭病灶','直接圈套'],a:1,why:'ESD真正的第一关是边界判断，而不是“开始切”。'},
      {stage:'器械',prompt:'切开后进入黏膜下层，出现较粗血管横跨剥离路径。',choices:['Coagrasper预处理血管','继续高速切断','活检钳撕扯','拔镜结束'],a:0,why:'先识别并预凝/止血，可降低活动性出血导致视野丢失。'},
      {stage:'突发',prompt:'剥离时出现搏动性出血，视野迅速变红。',choices:['盲目继续剥离','先冲洗/吸引定位出血点并用止血钳控制','大量注气等待','改做ERCP'],a:1,why:'先恢复视野、找到出血点，再定点止血。'}]},
    EMR:{mission:'结肠20 mm表浅隆起病变，完成安全切除并减少残留。',lives:3,rounds:[
      {stage:'判断',prompt:'注射后病灶中央明显不抬举。下一步最合理？',choices:['强行套取深层组织','重新评估纤维化/深浸润风险与术式','直接APC烧掉','忽略不抬举征'],a:1,why:'不抬举要重新评估病变深度和纤维化，不能机械继续。'},
      {stage:'器械',prompt:'病变适合EMR，核心切除器械是？',choices:['圈套器','ERCP取石篮','FNB针','套扎器'],a:0,why:'EMR的核心切除工具是圈套器。'},
      {stage:'创面',prompt:'切除后创面见渗血点。',choices:['观察出血性质并选择夹闭/热凝等处理','继续盲切','立即POEM','不看创面直接结束'],a:0,why:'切后必须检查创面并按风险处理即时出血和缺损。'}]},
    POEM:{mission:'II型贲门失弛缓，建立安全隧道并完成跨EGJ肌切开。',lives:3,rounds:[
      {stage:'入口',prompt:'建立黏膜切口后，下一目标是？',choices:['建立黏膜下隧道','切除胃角','胆管插管','套扎食管'],a:0,why:'POEM的标志性技术结构是黏膜下隧道。'},
      {stage:'定位',prompt:'隧道到达EGJ附近，为什么要继续进入胃侧？',choices:['确保充分跨越LES区域','为了看幽门','为了取胆总管结石','没有意义'],a:0,why:'跨越EGJ进入胃侧有助于充分处理LES区域。'},
      {stage:'突发',prompt:'隧道内发现黏膜“屋顶”损伤风险增高。',choices:['减慢操作、保持黏膜层完整并调整切开平面','扩大损伤以看得更清楚','继续盲切','直接用APC全隧道烧灼'],a:0,why:'黏膜层是安全屏障，损伤后泄漏风险上升。'}]},
    APC:{mission:'GAVE弥漫渗血，完成分区浅表热凝并避免深部热损伤。',lives:3,rounds:[
      {stage:'准备',prompt:'治疗前腔内有较多液体和血液。',choices:['先吸引/冲洗，暴露靶区','直接长时间持续烧灼','关闭吸引','插入FNA针'],a:0,why:'先暴露靶区再进行非接触热凝。'},
      {stage:'能量',prompt:'同一点组织颜色已明显改变。',choices:['继续持续烧灼一分钟','停止该点，移动到下一靶区','增加气流到最大','改用取石篮'],a:1,why:'避免同一点过度热凝，减少深部热损伤。'},
      {stage:'安全',prompt:'薄壁肠段进行APC时最重要的原则？',choices:['更谨慎控制能量与时间','越高功率越安全','完全不需要观察组织反应','只要是非接触就无穿孔风险'],a:0,why:'非接触不等于无深部损伤。'}]},
    ERCP:{mission:'胆总管结石合并梗阻，完成选择性胆管插管、取石与引流。',lives:3,rounds:[
      {stage:'定位',prompt:'侧视镜进入D2，第一目标是？',choices:['获得稳定的大乳头正面视野','寻找胃角','进入回肠末端','做POEM隧道'],a:0,why:'稳定乳头视野是后续选择性插管的基础。'},
      {stage:'插管',prompt:'导丝反复进入胰管，胆管仍未成功。',choices:['继续无限次盲目尝试','识别困难插管并调整策略，减少无意义胰管操作','开始ESD','退出后不记录'],a:1,why:'反复困难插管会增加PEP风险，应及时调整策略。'},
      {stage:'治疗',prompt:'胆管造影证实单枚远端结石。',choices:['按情况进行乳头处理后取石/球囊清扫','只拍照结束','做胃EMR','行EVL'],a:0,why:'ERCP应有明确治疗目标。'}]},
    'EUS-FNA':{mission:'胰腺实性占位，需要安全获得组织学标本。',lives:3,rounds:[
      {stage:'扫查',prompt:'准备穿刺前最重要的影像动作之一？',choices:['多普勒确认穿刺路径并避开血管','关闭超声','只看胃镜白光','先APC'],a:0,why:'安全路径评估是EUS取材的底线。'},
      {stage:'针型',prompt:'胰腺实性肿块需要组织获取，当前训练默认更偏向？',choices:['FNB','永远只用刷检','圈套器','止血夹'],a:0,why:'实性胰腺病灶越来越偏向FNB以获取组织核心。'},
      {stage:'取材',prompt:'已经获得看起来质量较好的组织。',choices:['结合标本质量与风险决定是否追加穿刺','机械规定必须穿刺10次','改做ERAT','立即烧灼针道'],a:0,why:'穿刺次数不是越多越好，要平衡质量与风险。'}]},
    ERAT:{mission:'单纯性急性阑尾炎候选病例，完成阑尾腔评估并保持外科转诊警觉。',lives:3,rounds:[
      {stage:'入口',prompt:'结肠镜到达盲肠后，需要先识别？',choices:['阑尾开口','十二指肠大乳头','Z线','胃角'],a:0,why:'ERAT从阑尾开口建立逆行通路。'},
      {stage:'造影',prompt:'导丝进入后，下一步用于了解阑尾腔形态与梗阻？',choices:['逆行造影/冲洗评估','POEM肌切开','食管套扎','胃底APC'],a:0,why:'逆行造影可帮助判断阑尾腔、梗阻和粪石情况。'},
      {stage:'红旗',prompt:'CT提示穿孔并阑尾周围脓肿。',choices:['停止把ERAT当作常规路径，及时外科/MDT评估','继续强行取石','仅口服PPI','做胃ESD'],a:0,why:'复杂性阑尾炎不能机械套用ERAT流程。'}]}
  };
})();
