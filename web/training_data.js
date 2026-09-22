window.GI_ANATOMY={
 upper:{title:'上消化道镜下解剖导航',subtitle:'从咽部进入十二指肠：把“镜子走到哪里”与典型镜下视野对应起来。',nodes:[
  {id:'u1',name:'食管入口 / UES',short:'UES',route:'距门齿约15 cm附近开始进入食管',landmark:'环咽肌区域，进入后见食管腔及纵行皱襞。',tip:'进镜时注意咽喉部黏膜及上段食管，减少盲目推进。',img:'varix',imgNote:'代表性食管腔内镜图（病理图像，用于认识食管腔形态）。'},
  {id:'u2',name:'胸中段食管',short:'中段食管',route:'食管中段',landmark:'管腔较直，正常黏膜为淡粉色鳞状上皮。',tip:'检查时螺旋退镜，避免只沿单一方向扫查。',img:'varix',imgNote:'真实食管内镜图：示静脉曲张，重点认识食管管腔与纵向走行。'},
  {id:'u3',name:'食管胃结合部 / Z线',short:'EGJ',route:'下段食管进入胃前',landmark:'鳞柱交界（Z线）、膈肌裂孔与胃黏膜皱襞终点是定位关键。',tip:'Barrett、反流、贲门病变都依赖这里的准确定位。',img:'barrett',imgNote:'真实Barrett食管图，可用于认识柱状上皮与Z线区域。'},
  {id:'u4',name:'贲门',short:'贲门',route:'进入胃后回望/反转观察',landmark:'胃食管交界的胃侧区域。',tip:'直视与反转都要看，避免漏掉贲门小病灶。',img:'barrett',imgNote:'代表性EGJ/贲门邻近视野。'},
  {id:'u5',name:'胃底',short:'胃底',route:'胃内反转观察近端胃',landmark:'近膈肌、胃大弯穹隆部。',tip:'胃底静脉曲张、PHG等病变可在这里更明显。',img:'phg',imgNote:'真实PHG图：代表胃体/胃底黏膜视野。'},
  {id:'u6',name:'胃体',short:'胃体',route:'胃腔主体',landmark:'大弯皱襞粗大，小弯相对平直；前后壁需要系统旋转观察。',tip:'建议固定顺序观察前壁→小弯→后壁→大弯。',img:'phg',imgNote:'真实胃体黏膜图（PHG）。'},
  {id:'u7',name:'胃角',short:'胃角',route:'胃体与胃窦交界的小弯侧切迹',landmark:'胃角切迹是早癌高发、易漏诊区域之一。',tip:'正面、近距离、充分充气/适度吸气后观察。',img:'egc',imgNote:'真实早期胃癌0-IIa图，适合作为胃角/胃部精查训练代表图。'},
  {id:'u8',name:'胃窦',short:'胃窦',route:'幽门前区',landmark:'皱襞逐渐减少，向幽门环汇聚。',tip:'关注GAVE、溃疡、早癌和幽门前病变。',img:'gave',imgNote:'真实GAVE图：典型胃窦放射状红色条纹。'},
  {id:'u9',name:'幽门',short:'幽门',route:'胃窦远端出口',landmark:'圆形/椭圆形幽门环，周期性开闭。',tip:'通过幽门时避免暴力推进，观察环周黏膜。',img:'ulcer',imgNote:'代表性胃十二指肠区域内镜病理图。'},
  {id:'u10',name:'十二指肠球部',short:'球部',route:'幽门后第一段',landmark:'腔较宽，皱襞相对少。',tip:'溃疡常见部位，退镜时要看前后壁。',img:'ulcer',imgNote:'真实溃疡裸露血管图，用于球部溃疡高危征象训练。'},
  {id:'u11',name:'十二指肠降部',short:'D2',route:'球后转弯进入降部',landmark:'可见环形皱襞；大乳头位于内侧壁。',tip:'ERCP训练的核心解剖终点是找到并正对十二指肠大乳头。',img:'ercpStone',imgNote:'真实ERCP造影图，帮助建立D2—乳头—胆胰管的空间联系。'}
 ]},
 lower:{title:'下消化道镜下解剖导航',subtitle:'从肛门到回肠末端：重点识别弯曲、肠腔形态和“盲肠三联征”。',nodes:[
  {id:'l1',name:'直肠',short:'直肠',route:'进镜起点',landmark:'腔较宽，退镜反转可评估肛直肠区域。',tip:'不要把“到达直肠”当作检查结束，退镜观察同样重要。',img:'uc',imgNote:'真实结直肠炎症内镜图，代表结直肠腔内视野。'},
  {id:'l2',name:'乙状结肠',short:'乙状',route:'直肠近端',landmark:'活动度大、弯曲多，是成袢常见区域。',tip:'短缩镜身、旋转和体位配合比单纯推镜更重要。',img:'uc',imgNote:'结肠镜真实图。'},
  {id:'l3',name:'降结肠',short:'降结肠',route:'左侧腹膜后段',landmark:'较直，进入脾曲前常见较锐转角。',tip:'识别腔道走向，避免在弯曲处持续顶压。',img:'uc',imgNote:'结肠镜真实图。'},
  {id:'l4',name:'脾曲',short:'脾曲',route:'左上腹转弯',landmark:'常为较锐角度，附近可见蓝色脾影（并非每例都明显）。',tip:'体位变化和吸气缩短有助于通过。',img:'crohn',imgNote:'真实结肠镜图。'},
  {id:'l5',name:'横结肠',short:'横结肠',route:'跨越上腹部',landmark:'呈三角形/多角形腔道的印象较常见。',tip:'注意肝曲与脾曲方向改变。',img:'crohn',imgNote:'真实结肠镜图。'},
  {id:'l6',name:'肝曲',short:'肝曲',route:'右上腹转弯',landmark:'从横结肠转向升结肠。',tip:'右侧结肠病变要保证清洁和充分观察。',img:'crohn',imgNote:'真实结肠镜图。'},
  {id:'l7',name:'升结肠',short:'升结肠',route:'右侧腹膜后段',landmark:'向近端逐步接近盲肠。',tip:'右半结肠扁平病变容易漏诊，退镜要慢。',img:'crohn',imgNote:'真实结肠镜图。'},
  {id:'l8',name:'盲肠',short:'盲肠',route:'结肠镜到达目标',landmark:'确认盲肠常依赖阑尾开口和回盲瓣，而不是“看起来像袋底”即可。',tip:'拍照记录盲肠标志是质量控制的重要习惯。',img:'uc',imgNote:'代表性结肠镜视野；游戏重点在盲肠标志识别。'},
  {id:'l9',name:'阑尾开口',short:'阑尾口',route:'盲肠底部标志',landmark:'常呈小孔/凹陷，周围黏膜皱襞向其集中。',tip:'ERAT就是从这里进入阑尾腔开展逆行造影/冲洗/取石等操作。',img:'uc',imgNote:'代表性结肠镜视野。'},
  {id:'l10',name:'回盲瓣',short:'ICV',route:'盲肠近端标志',landmark:'唇样/乳头样结构，是进入回肠末端的门户。',tip:'结合阑尾开口共同确认真正到达盲肠。',img:'crohn',imgNote:'Crohn病真实图，帮助建立回盲部炎症病变概念。'},
  {id:'l11',name:'回肠末端',short:'TI',route:'经回盲瓣插入',landmark:'绒毛样、细颗粒黏膜，与结肠黏膜不同。',tip:'疑似Crohn、出血、感染等病例常需要主动插入回肠末端。',img:'crohn',imgNote:'真实Crohn内镜图，作为回肠/结肠炎症训练代表。'}
 ]}
};

window.GI_EXTRA_IMAGES={
 ercpStone:{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/ERCP%20stone.jpg',source:'https://commons.wikimedia.org/wiki/File:ERCP_stone.jpg',credit:'Samir · CC BY-SA 3.0/GFDL · Wikimedia Commons'},
 poemPhoto:{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/POEM%20Procedure%202013%20Cropped.jpg',source:'https://commons.wikimedia.org/wiki/File:POEM_Procedure_2013_Cropped.jpg',credit:'Mgaidhane · CC BY-SA 4.0 · Wikimedia Commons'},
 gastricAntrum:{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Gastric%20Ulcer%20Antrum.jpg',source:'https://commons.wikimedia.org/wiki/File:Gastric_Ulcer_Antrum.jpg',credit:'Med_Chaos · Public domain · Wikimedia Commons'}
};
Object.assign(window.GI_IMAGES,window.GI_EXTRA_IMAGES);

window.GI_ANATOMY_QUIZ=[
 {tract:'upper',q:'胃镜下看到“鳞柱交界（Z线）”，最接近哪个解剖区域？',o:['食管胃结合部','胃角','幽门','十二指肠球部'],a:0,why:'Z线是鳞状食管上皮与柱状胃型黏膜的交界标志。'},
 {tract:'upper',q:'胃镜反转后重点观察近端穹隆部，主要是在看？',o:['胃底/贲门','胃窦','球部','食管中段'],a:0,why:'反转视野有助于观察贲门及胃底近端区域。'},
 {tract:'upper',q:'胃小弯侧出现明显切迹，常作为重要定位点的是？',o:['胃角','大乳头','回盲瓣','脾曲'],a:0,why:'胃角切迹是胃体与胃窦交界的重要内镜标志。'},
 {tract:'upper',q:'通过幽门后最先进入的部位通常是？',o:['十二指肠球部','空肠','十二指肠水平部','回肠末端'],a:0,why:'幽门后首先进入十二指肠球部。'},
 {tract:'upper',q:'ERCP侧视镜最终要在十二指肠降部找到的关键结构是？',o:['十二指肠大乳头','Z线','胃角','阑尾开口'],a:0,why:'胆胰管经大乳头区域开口，是ERCP插管的解剖目标。'},
 {tract:'lower',q:'结肠镜下同时看到阑尾开口和回盲瓣，最能说明到达？',o:['盲肠','乙状结肠','直肠','横结肠'],a:0,why:'阑尾开口与回盲瓣是盲肠确认的关键标志。'},
 {tract:'lower',q:'结肠镜最容易成袢、活动度较大的部位常是？',o:['乙状结肠','升结肠','盲肠','直肠'],a:0,why:'乙状结肠活动度大、弯曲多，是常见成袢区域。'},
 {tract:'lower',q:'要进入回肠末端，需要识别并通过？',o:['回盲瓣','幽门','Z线','十二指肠乳头'],a:0,why:'回盲瓣是进入回肠末端的门户。'},
 {tract:'lower',q:'ERAT的内镜起始靶点是？',o:['阑尾开口','胃角','大乳头','食管胃结合部'],a:0,why:'ERAT从结肠镜下识别阑尾开口开始。'},
 {tract:'lower',q:'从横结肠转向升结肠需要通过？',o:['肝曲','脾曲','胃角','十二指肠上曲'],a:0,why:'肝曲连接横结肠与升结肠。'}
];

window.GI_PROCEDURES=[
 {id:'ESD',name:'ESD',full:'Endoscopic Submucosal Dissection',level:'进阶',badge:'早癌核心',color:'blue',image:'egc',imageNote:'真实早期胃癌图：术前病灶识别是ESD第一步。',indications:'需要整块切除并准确病理评估的表浅消化道肿瘤，具体适应证依部位、大小、组织学和浸润风险决定。',goal:'完整标本、准确病理分期，并在合适病例中实现内镜根治。',equipment:['透明帽','注射针','黏膜下注射液','ESD切开/剥离刀','高频电外科设备','止血钳/夹子'],steps:['精查并明确病灶边界','标记（按部位/策略决定）','黏膜下注射形成安全垫','环周/部分黏膜切开','进入黏膜下层并逐步剥离','处理血管与创面，回收完整标本','固定标本并按方向送病理'],danger:'出血、穿孔、狭窄（尤其环周食管切除）及术后迟发出血等。',pearls:['病灶边界判断比“会切”更早、更重要。','维持清晰黏膜下层视野和安全切割平面。','遇到粗大血管先识别、预处理再切。'],quiz:[
  {q:'ESD相较传统分片EMR最核心的优势之一是？',o:['更容易整块切除较大表浅病变并准确病理评估','完全没有穿孔风险','不需要病理','任何晚期癌都可根治'],a:0,why:'ESD的核心价值之一是较大病变的en bloc切除和精确病理评估。'},
  {q:'剥离时最希望始终保持在哪个层面？',o:['清晰黏膜下层安全平面','肌层深部','浆膜外','病灶表面'],a:0,why:'维持黏膜下层视野有助于控制血管并减少肌层损伤。'},
  {q:'发现较粗血管横跨计划剥离路径时更合理的是？',o:['先识别并预凝/止血后再切','闭眼快速切断','直接拔镜','改用活检钳硬拽'],a:0,why:'预处理可降低活动性出血导致视野丢失。'}]},
 {id:'EMR',name:'EMR',full:'Endoscopic Mucosal Resection',level:'基础→进阶',badge:'常用切除',color:'green',image:'gastricAntrum',imageNote:'真实胃窦内镜图，用于理解黏膜层病变与注射抬举概念。',indications:'适合多种表浅黏膜病变，选择取决于部位、大小、形态及浸润风险。',goal:'通过抬举/套圈等方式切除黏膜病变并获得病理。',equipment:['注射针','黏膜下注射液','圈套器','透明帽（部分技术）','高频电外科设备','止血夹'],steps:['精查病变并判断是否适合EMR','必要时黏膜下注射抬举','选择合适圈套器完整套取病变','收紧确认不夹入过深组织','通电切除','回收标本并检查创面','必要时处理出血/闭合缺损'],danger:'即时/迟发出血、穿孔；较大病变分片切除后复发/残留风险增加。',pearls:['“不抬举征”要警惕纤维化或深浸润，但也受既往活检/操作影响。','切前确认圈套器内组织量和位置。','病理结果决定后续是否需要追加治疗。'],quiz:[
  {q:'EMR前黏膜下注射最主要目的之一是？',o:['把病变与肌层分离形成安全垫','让肿瘤立刻消失','代替病理','增加出血'],a:0,why:'良好抬举有助于安全套取并降低深层损伤。'},
  {q:'较大病变需要分片EMR时，后续更需要关注？',o:['残留/局部复发','食管静脉曲张','胰腺炎','胆管炎'],a:0,why:'分片切除影响完整病理评估并增加局部残留/复发管理需求。'}]},
 {id:'POEM',name:'POEM',full:'Peroral Endoscopic Myotomy',level:'高级',badge:'隧道技术',color:'purple',image:'poemPhoto',imageNote:'真实POEM术中操作照片（Wikimedia Commons开放许可）。',indications:'主要用于贲门失弛缓症等特定食管动力障碍，需结合HRM分型、症状和中心经验。',goal:'经黏膜下隧道完成选择性肌切开，降低LES阻力。',equipment:['透明帽','黏膜下注射液','隧道/ESD刀','止血钳','高频电外科设备','止血夹/缝合装置'],steps:['确定切口与肌切开策略','黏膜下注射并建立入口','建立黏膜下隧道并跨越EGJ进入胃侧','识别肌层并按计划完成肌切开','确认止血与隧道完整性','退出隧道','夹闭/缝合黏膜入口'],danger:'气体相关事件、黏膜损伤、出血、术后GERD等。',pearls:['隧道必须跨越EGJ并进入胃侧一定距离。','黏膜层是“安全屋顶”，避免穿破。','术后反流是长期随访重点。'],quiz:[
  {q:'POEM最具标志性的技术结构是？',o:['黏膜下隧道','胆管造影','结肠套扎','胃造瘘'],a:0,why:'POEM通过黏膜下隧道到达肌层并完成肌切开。'},
  {q:'隧道为什么要跨越EGJ进入胃侧？',o:['确保充分处理LES区域','为了进入十二指肠','为了切除胃息肉','没有任何意义'],a:0,why:'治疗目标是降低EGJ/LES功能性梗阻。'},
  {q:'POEM后长期需要重点关注？',o:['胃食管反流','阑尾炎','胆总管结石','痔'],a:0,why:'POEM后GERD是重要随访问题。'}]},
 {id:'APC',name:'APC',full:'Argon Plasma Coagulation',level:'基础→进阶',badge:'非接触热凝',color:'orange',image:'gave',imageNote:'真实GAVE图：APC是临床常见治疗场景之一。',indications:'常用于浅表血管性病变、弥漫渗血或部分组织消融，具体参数与适应证依病变和部位决定。',goal:'利用氩气等离子体进行非接触式浅表热凝。',equipment:['APC探头','氩气源/电外科工作站','内镜','必要时冲洗/吸引装置'],steps:['明确治疗靶区并清除液体/血液','选择合适功率与气流设置（遵循本中心设备规范）','探头保持合适距离，短脉冲点状/条带状处理','避免在同一点过度灼烧','观察凝固效果并处理残余出血','充分吸引腔内气体并结束'],danger:'深部热损伤、穿孔、气体相关扩张/爆炸风险（尤其不当肠道准备或可燃气体环境）。',pearls:['APC是非接触热凝，但并不等于“没有深部损伤”。','薄壁肠段要更谨慎。','治疗GAVE时常需分次治疗。'],quiz:[
  {q:'APC属于？',o:['非接触式热凝','机械夹闭','冷切除','纯注射治疗'],a:0,why:'APC通过电离氩气传递热能。'},
  {q:'为了减少深部热损伤，更应避免？',o:['同一点长时间持续灼烧','短脉冲移动处理','观察组织反应','遵循设备参数'],a:0,why:'持续过度热凝增加深层损伤风险。'}]},
 {id:'ERCP',name:'ERCP',full:'Endoscopic Retrograde Cholangiopancreatography',level:'高级',badge:'胆胰介入',color:'gold',image:'ercpStone',imageNote:'真实ERCP造影图：远端胆总管结石。',indications:'主要用于需要治疗性胆胰管介入的疾病，如胆总管结石、部分胆道梗阻/狭窄等；不应把ERCP当作普通诊断性成像的替代。',goal:'通过十二指肠乳头选择性插管进行胆/胰管造影及治疗。',equipment:['侧视十二指肠镜','导丝','造影导管/切开刀','球囊/取石篮','扩张球囊','支架','透视设备'],steps:['侧视镜到达D2并调整大乳头正面视野','导丝辅助选择性胆管/胰管插管','有限、目的明确地造影确认解剖与病变','按病因实施括约肌切开/扩张/取石/引流等','确认引流和止血','退出器械并制定PEP等并发症预防/监测方案'],danger:'ERCP后胰腺炎、出血、胆管炎/感染、穿孔等。',pearls:['真正难点之一是稳定的乳头视野和选择性插管。','尽量避免无意义反复胰管插管/造影。','术前要明确：这次ERCP准备解决什么治疗问题。'],quiz:[
  {q:'ERCP前最关键的问题之一是？',o:['这次是否有明确治疗性目标','患者喜欢什么颜色','是否需要看胃角','是否有痔'],a:0,why:'现代ERCP以治疗为主，应明确收益大于风险。'},
  {q:'选择性插管困难时，反复盲目操作最担心增加？',o:['ERCP后胰腺炎风险','Barrett食管','UC','胃底静脉曲张'],a:0,why:'困难插管和胰管操作与PEP风险密切相关。'},
  {q:'胆总管结石常见治疗组合包括？',o:['乳头处理 + 取石/球囊清扫','ESD切除胆总管','POEM','结肠EMR'],a:0,why:'根据结石大小、乳头和胆管情况选择切开/扩张及取石策略。'}]},
 {id:'EUS-FNA',name:'EUS-FNA/FNB',full:'EUS-guided Tissue Acquisition',level:'高级',badge:'超声+穿刺',color:'teal',image:'gist',imageNote:'真实胃黏膜下肿物图：EUS首先判断壁层来源，再决定是否需要组织获取。',indications:'胰腺实性占位、部分黏膜下病变/淋巴结等需要组织学诊断的病变；应先评估穿刺路径和是否真正改变管理。',goal:'在实时EUS引导下安全获取细胞/组织。',equipment:['线阵EUS镜','FNA/FNB穿刺针','多普勒','负压装置（按技术）','标本处理器材'],steps:['EUS系统扫查并确认目标病灶','用多普勒确认穿刺路径避开血管','选择合适针型/针径','锁定目标并穿刺','在病灶内按技术完成取材','退出针具并处理标本','评估是否需要追加穿刺及并发症监测'],danger:'出血、感染、胰腺炎、穿孔等；不同靶器官风险不同。',pearls:['先看清病灶和血管，再谈穿刺。','实性胰腺肿块的组织获取越来越偏向FNB以获取组织核心。','穿刺次数不是越多越好，要兼顾标本质量与风险。'],quiz:[
  {q:'穿刺前使用多普勒的核心目的？',o:['寻找并避开血管','测量胃酸','判断Forrest分级','看肠道准备'],a:0,why:'安全穿刺路径必须尽量避开血管结构。'},
  {q:'针对胰腺实性肿块，当前ASGE指南更偏向？',o:['FNB而非FNA','所有患者只做刷检','不用组织学','直接EMR'],a:0,why:'2024 ASGE指南对实性胰腺肿块EUS-TA推荐FNB优于FNA。'},
  {q:'EUS看到胃黏膜下隆起，下一步第一思维应是？',o:['确定来源层次和内部回声特征','立即盲穿','先做ERCP','直接APC'],a:0,why:'EUS首先用于层次定位和风险特征评估。'}]},
 {id:'ERAT',name:'ERAT',full:'Endoscopic Retrograde Appendicitis Therapy',level:'探索性高级',badge:'创新术式',color:'red',image:'uc',imageNote:'代表性结肠镜视野。ERAT需先到达盲肠并识别阑尾开口。',indications:'目前主要探索用于经过严格筛选的急性单纯性阑尾炎。复杂性阑尾炎、穿孔/脓肿等情形不能简单套用。',goal:'经结肠镜从阑尾开口进行逆行插管、造影/冲洗、解除梗阻并按情况置入引流。',equipment:['结肠镜','透明帽（按中心技术）','导丝','造影导管','取石/取异物器械','冲洗装置','必要时阑尾支架'],steps:['完成影像和临床评估，排除明显复杂性阑尾炎','结肠镜到达盲肠并识别阑尾开口','导丝辅助进入阑尾腔','逆行造影明确腔道、梗阻和粪石','冲洗/解除梗阻，必要时取石','按病情和中心方案决定是否置入支架引流','术后观察并告知复发/升级手术可能'],danger:'穿孔、出血、感染加重、技术失败和复发；其角色仍在研究与标准化过程中。',pearls:['它不是“阑尾版ERCP的成熟复制品”，证据等级和标准化程度仍有限。','病例筛选比技术本身更重要。','必须保留及时转外科/升级治疗的路径。'],quiz:[
  {q:'ERAT目前最合理的定位是？',o:['选择性、探索性的器官保留内镜技术','已经完全替代阑尾切除','所有右下腹痛都能做','完全无复发风险'],a:0,why:'现有研究显示潜力，但尚不足以把它作为所有急性阑尾炎的常规替代。'},
  {q:'ERAT结肠镜下首先必须识别？',o:['阑尾开口','Z线','大乳头','胃角'],a:0,why:'阑尾开口是逆行进入阑尾腔的解剖入口。'},
  {q:'影像提示阑尾穿孔并脓肿形成时，最不应做的是？',o:['机械套用ERAT流程而忽略外科/感染控制评估','立即多学科评估','考虑复杂性阑尾炎路径','评估引流/手术策略'],a:0,why:'复杂性阑尾炎不能简单套用ERAT。'}]},
 {id:'EVL',name:'EVL',full:'Endoscopic Variceal Ligation',level:'进阶',badge:'急诊止血',color:'navy',image:'varix',imageNote:'真实食管静脉曲张红色征图。',indications:'食管静脉曲张出血的内镜止血及部分二级预防场景。',goal:'通过套扎使曲张静脉闭塞并减少出血风险。',equipment:['胃镜','多环套扎器','吸引装置'],steps:['复苏和药物/抗菌治疗同步进行','内镜确认出血来源和曲张静脉','装载套扎器并重新进镜','从远端向近端选择目标静脉','充分吸入目标曲张静脉','释放套扎环','确认止血并制定后续二级预防计划'],danger:'溃疡形成、再出血、狭窄（反复治疗）及误套正常组织等。',pearls:['急性出血不是“只做一个套扎”——药物、抗菌药、风险分层同样关键。','视野差时先吸引/冲洗，避免盲目套扎。'],quiz:[{q:'急性食管静脉曲张出血，EVL之外还应同步重视？',o:['血管活性药和抗菌药等综合管理','只做PPI','只做CT','停止复苏'],a:0,why:'急性静脉曲张出血需要综合治疗。'}]},
 {id:'CLIP',name:'内镜夹闭',full:'Mechanical Endoscopic Hemostasis',level:'基础',badge:'机械止血',color:'gray',image:'ulcer',imageNote:'真实Forrest IIa溃疡图：机械夹闭是常见止血工具之一。',indications:'可用于部分溃疡裸露血管/活动性出血、黏膜切除后缺损及医源性穿孔等，依场景选择。',goal:'机械压闭血管或闭合组织缺损。',equipment:['旋转止血夹','可重复开闭夹（视产品）','透明帽（辅助）'],steps:['充分冲洗并定位出血点/缺损','调整镜身使夹子轴线尽量对准目标','张开夹子并抓取足够组织','确认位置后释放','观察是否止血/闭合充分','必要时追加夹闭'],danger:'夹闭位置不佳、影响后续操作、组织抓取不足或夹住器械等。',pearls:['“看见血”不等于“看见血管”——先找到真正靶点。','尽量让夹子与血管/缺损形成有效机械压迫方向。'],quiz:[{q:'夹闭成功的关键之一是？',o:['准确定位靶点并抓取足够组织','离出血点越远越好','盲目连续放夹','只夹血凝块'],a:0,why:'机械止血需要对真正出血点形成有效压迫。'}]}
];

window.GI_PROCEDURE_REFS=[
 {title:'ASGE guideline on ESD for early esophageal and gastric cancers (2023)',url:'https://www.asge.org/home/resources/publications/guidelines/american-society-for-gastrointestinal-endoscopy-guideline-on-endoscopic-submucosal-dissection-for-the-management-of-early-esophageal-and-gastric-cancers--summary-and-recommendations'},
 {title:'ASGE guideline on post-ERCP pancreatitis prevention (2023)',url:'https://www.asge.org/home/resources/publications/guidelines/asge-guideline-on-post-ercp-pancreatitis-prevention-strategies-summary-and-recommendations'},
 {title:'ASGE guideline on solid pancreatic masses / EUS tissue acquisition (2024)',url:'https://www.asge.org/home/resources/publications/guidelines/american-society-for-gastrointestinal-endoscopy-guideline-on-role-of-endoscopy-in-the-diagnosis-and-management-of-solid-pancreatic-masses--methodology-and-review-of-evidence'},
 {title:'ESGE curriculum for ERCP and EUS training',url:'https://www.esge.com/ercp-and-eus-training-curriculum'},
 {title:'ERAT current status review',url:'https://academic.oup.com/gastro/article/doi/10.1093/gastro/goae037/7659177'}
];
