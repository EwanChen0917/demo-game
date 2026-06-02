export interface TangRegion {
  id: string
  name: string
  dao: string
  x: number
  y: number
  importance: 'capital' | 'major' | 'normal'
  description: string
  neighbors: string[]
}

export const TANG_REGIONS: TangRegion[] = [

  // ── 关内道 ──────────────────────────────────────────
  {
    id: 'jingzhao',
    name: '京兆',
    dao: '关内道',
    x: 463, y: 336,
    importance: 'capital',
    description: '大唐国都长安所在，天下第一繁华之地，科举取士之源。',
    neighbors: ['huazhou', 'tongzhou', 'fengxiang', 'binzhou'],
  },
  {
    id: 'huazhou',
    name: '华州',
    dao: '关内道',
    x: 477, y: 332,
    importance: 'normal',
    description: '关中东门，扼守潼关要道，商旅往来频繁。',
    neighbors: ['jingzhao', 'tongzhou', 'hezhong'],
  },
  {
    id: 'tongzhou',
    name: '同州',
    dao: '关内道',
    x: 471, y: 324,
    importance: 'normal',
    description: '关中北境，黄河渡口要津，农业富庶。',
    neighbors: ['jingzhao', 'huazhou', 'yanzhou', 'hezhong'],
  },
  {
    id: 'fengxiang',
    name: '凤翔',
    dao: '关内道',
    x: 444, y: 332,
    importance: 'major',
    description: '西京陪都，关中西部重镇，历代屯兵之所。',
    neighbors: ['jingzhao', 'binzhou', 'longzhou'],
  },
  {
    id: 'binzhou',
    name: '邠州',
    dao: '关内道',
    x: 452, y: 324,
    importance: 'normal',
    description: '泾水上游，农耕与游牧交界之地。',
    neighbors: ['jingzhao', 'fengxiang', 'yanzhou'],
  },

  // ── 河南道 ──────────────────────────────────────────
  {
    id: 'luozhou',
    name: '洛州',
    dao: '河南道',
    x: 510, y: 329,
    importance: 'capital',
    description: '东都洛阳，天下之中，丝路起点，百官辐辏。',
    neighbors: ['hezhong', 'huazhou', 'ruzhou', 'bianzhou'],
  },
  {
    id: 'hezhong',
    name: '河中',
    dao: '河南道',
    x: 484, y: 319,
    importance: 'major',
    description: '黄河中游要冲，晋陕交界咽喉，兵家必争之地。',
    neighbors: ['tongzhou', 'huazhou', 'luozhou', 'puzhou'],
  },
  {
    id: 'bianzhou',
    name: '汴州',
    dao: '河南道',
    x: 533, y: 328,
    importance: 'major',
    description: '运河枢纽，东西漕运要地，商业极盛。',
    neighbors: ['luozhou', 'songzhou', 'caozhou'],
  },
  {
    id: 'ruzhou',
    name: '汝州',
    dao: '河南道',
    x: 514, y: 347,
    importance: 'normal',
    description: '中原腹地，连接南北要道。',
    neighbors: ['luozhou', 'bianzhou', 'dengzhou'],
  },
  {
    id: 'songzhou',
    name: '宋州',
    dao: '河南道',
    x: 551, y: 334,
    importance: 'normal',
    description: '中原东部，淮河上游，农耕繁盛。',
    neighbors: ['bianzhou', 'caozhou', 'chuzhou'],
  },

  // ── 河东道 ──────────────────────────────────────────
  {
    id: 'puzhou',
    name: '蒲州',
    dao: '河东道',
    x: 481, y: 328,
    importance: 'major',
    description: '黄河东岸，晋地南门，古称河东要冲。',
    neighbors: ['hezhong', 'jinzhou', 'luozhou'],
  },
  {
    id: 'jinzhou',
    name: '晋州',
    dao: '河东道',
    x: 497, y: 308,
    importance: 'normal',
    description: '汾水流域，山西中部，煤铁之乡。',
    neighbors: ['puzhou', 'taiyuan', 'zezhou'],
  },
  {
    id: 'taiyuan',
    name: '太原',
    dao: '河东道',
    x: 510, y: 277,
    importance: 'major',
    description: '北都太原，李唐龙兴之地，北方军事重镇。',
    neighbors: ['jinzhou', 'daizhou', 'yuzhou'],
  },
  {
    id: 'daizhou',
    name: '代州',
    dao: '河东道',
    x: 515, y: 258,
    importance: 'normal',
    description: '雁门关所在，抵御北方游牧的门户。',
    neighbors: ['taiyuan', 'yuzhou'],
  },
  {
    id: 'zezhou',
    name: '泽州',
    dao: '河东道',
    x: 514, y: 316,
    importance: 'normal',
    description: '太行山西麓，连接晋豫要道。',
    neighbors: ['jinzhou', 'puzhou', 'weizhou'],
  },

  // ── 河北道 ──────────────────────────────────────────
  {
    id: 'weizhou',
    name: '魏州',
    dao: '河北道',
    x: 543, y: 302,
    importance: 'major',
    description: '河北南部重镇，安史之乱后割据藩镇之地。',
    neighbors: ['zezhou', 'caozhou', 'mingzhou_hb', 'yuzhou'],
  },
  {
    id: 'yuzhou',
    name: '幽州',
    dao: '河北道',
    x: 560, y: 245,
    importance: 'major',
    description: '北方军事重镇，安禄山起兵之地，扼守燕云要冲。',
    neighbors: ['taiyuan', 'daizhou', 'mingzhou_hb', 'weizhou'],
  },
  {
    id: 'mingzhou_hb',
    name: '冀州',
    dao: '河北道',
    x: 550, y: 284,
    importance: 'normal',
    description: '华北平原腹地，农耕富庶之乡。',
    neighbors: ['weizhou', 'yuzhou', 'caozhou'],
  },
  {
    id: 'caozhou',
    name: '曹州',
    dao: '河北道',
    x: 547, y: 321,
    importance: 'normal',
    description: '黄河北岸，豫北农业大州。',
    neighbors: ['bianzhou', 'weizhou', 'mingzhou_hb', 'songzhou'],
  },

  // ── 淮南道 ──────────────────────────────────────────
  {
    id: 'yangzhou',
    name: '扬州',
    dao: '淮南道',
    x: 599, y: 366,
    importance: 'major',
    description: '江南富庶第一州，扬一益二，商贾云集，文风鼎盛。',
    neighbors: ['chuzhou', 'chuzhou2', 'suzhou'],
  },
  {
    id: 'chuzhou',
    name: '楚州',
    dao: '淮南道',
    x: 594, y: 347,
    importance: 'normal',
    description: '淮河入海口，漕运要道，盐业兴盛。',
    neighbors: ['songzhou', 'yangzhou', 'chuzhou2'],
  },
  {
    id: 'chuzhou2',
    name: '滁州',
    dao: '淮南道',
    x: 585, y: 368,
    importance: 'normal',
    description: '淮南腹地，历来是南北拉锯之地。',
    neighbors: ['chuzhou', 'yangzhou', 'shouzhou'],
  },
  {
    id: 'shouzhou',
    name: '寿州',
    dao: '淮南道',
    x: 565, y: 363,
    importance: 'normal',
    description: '淮河中游，屯粮重镇。',
    neighbors: ['chuzhou2', 'dengzhou', 'ezhou'],
  },

  // ── 江南道 ──────────────────────────────────────────
  {
    id: 'suzhou',
    name: '苏州',
    dao: '江南道',
    x: 614, y: 384,
    importance: 'major',
    description: '江南水乡，丝绸之府，富甲天下，文人墨客荟萃。',
    neighbors: ['yangzhou', 'hangzhou', 'runzhou'],
  },
  {
    id: 'hangzhou',
    name: '杭州',
    dao: '江南道',
    x: 609, y: 401,
    importance: 'major',
    description: '钱塘江畔，江南繁华之地，后世南宋国都。',
    neighbors: ['suzhou', 'runzhou', 'muzhou'],
  },
  {
    id: 'runzhou',
    name: '润州',
    dao: '江南道',
    x: 600, y: 370,
    importance: 'normal',
    description: '长江南岸，沟通苏杭要道。',
    neighbors: ['suzhou', 'hangzhou', 'xuanzhou'],
  },
  {
    id: 'xuanzhou',
    name: '宣州',
    dao: '江南道',
    x: 591, y: 391,
    importance: 'normal',
    description: '皖南山地，文风颇盛，李白曾游历于此。',
    neighbors: ['runzhou', 'shouzhou', 'hongzhou'],
  },
  {
    id: 'hongzhou',
    name: '洪州',
    dao: '江南道',
    x: 554, y: 426,
    importance: 'major',
    description: '江西重镇，王勃《滕王阁序》发源地，文华荟萃。',
    neighbors: ['xuanzhou', 'ezhou', 'fuzhou_jn'],
  },
  {
    id: 'fuzhou_jn',
    name: '福州',
    dao: '江南道',
    x: 597, y: 469,
    importance: 'normal',
    description: '东南沿海，海贸兴盛，闽越之地。',
    neighbors: ['hongzhou', 'guangzhou'],
  },

  // ── 剑南道 ──────────────────────────────────────────
  {
    id: 'yizhou',
    name: '益州',
    dao: '剑南道',
    x: 401, y: 394,
    importance: 'capital',
    description: '成都所在，天府之国，富甲西南，扬一益二之"益"。',
    neighbors: ['longzhou', 'zizhou', 'kuizhou', 'yazhou'],
  },
  {
    id: 'zizhou',
    name: '梓州',
    dao: '剑南道',
    x: 413, y: 388,
    importance: 'normal',
    description: '川中腹地，连接东西蜀道要冲。',
    neighbors: ['yizhou', 'kuizhou', 'langzhou'],
  },
  {
    id: 'kuizhou',
    name: '夔州',
    dao: '剑南道',
    x: 465, y: 392,
    importance: 'normal',
    description: '长江三峡入口，杜甫客居之地，扼守入川门户。',
    neighbors: ['zizhou', 'langzhou', 'ezhou'],
  },

  // ── 山南道 ──────────────────────────────────────────
  {
    id: 'xiangzhou',
    name: '襄州',
    dao: '山南道',
    x: 505, y: 373,
    importance: 'major',
    description: '汉水中游，南北交通要冲，历代兵家重地。',
    neighbors: ['dengzhou', 'jingzhou', 'ezhou', 'langzhou'],
  },
  {
    id: 'dengzhou',
    name: '邓州',
    dao: '山南道',
    x: 505, y: 362,
    importance: 'normal',
    description: '南阳盆地，连通中原与荆楚。',
    neighbors: ['ruzhou', 'xiangzhou', 'shouzhou'],
  },
  {
    id: 'jingzhou',
    name: '荆州',
    dao: '山南道',
    x: 506, y: 401,
    importance: 'major',
    description: '长江中游，三国故地，控扼南北水道。',
    neighbors: ['xiangzhou', 'ezhou', 'langzhou'],
  },
  {
    id: 'ezhou',
    name: '鄂州',
    dao: '山南道',
    x: 533, y: 396,
    importance: 'normal',
    description: '武昌所在，长江要津，商贸繁盛。',
    neighbors: ['jingzhou', 'xiangzhou', 'hongzhou', 'kuizhou', 'shouzhou'],
  },
  {
    id: 'langzhou',
    name: '朗州',
    dao: '山南道',
    x: 499, y: 422,
    importance: 'normal',
    description: '湖南西北，沅水流域，柳宗元曾贬谪此地。',
    neighbors: ['jingzhou', 'yizhou', 'zizhou', 'kuizhou', 'xiangzhou'],
  },

  // ── 陇右道 ──────────────────────────────────────────
  {
    id: 'longzhou',
    name: '陇州',
    dao: '陇右道',
    x: 437, y: 326,
    importance: 'normal',
    description: '陇山东麓，连接关中与陇右的门户。',
    neighbors: ['fengxiang', 'yizhou', 'lanzhouLD'],
  },
  {
    id: 'lanzhouLD',
    name: '兰州',
    dao: '陇右道',
    x: 397, y: 306,
    importance: 'major',
    description: '黄河要津，丝绸之路重镇，连接西域咽喉。',
    neighbors: ['longzhou', 'liangzhou'],
  },
  {
    id: 'liangzhou',
    name: '凉州',
    dao: '陇右道',
    x: 382, y: 277,
    importance: 'major',
    description: '河西走廊东端，丝路重镇，多民族聚居之地。',
    neighbors: ['lanzhouLD', 'guazhou'],
  },
  {
    id: 'guazhou',
    name: '瓜州',
    dao: '陇右道',
    x: 294, y: 235,
    importance: 'normal',
    description: '敦煌附近，丝绸之路西出玉门关的最后一站。',
    neighbors: ['liangzhou'],
  },

  // ── 岭南道 ──────────────────────────────────────────
  {
    id: 'guangzhou',
    name: '广州',
    dao: '岭南道',
    x: 520, y: 517,
    importance: 'major',
    description: '南海之滨，海上丝绸之路起点，番商云集，富庶无比。',
    neighbors: ['fuzhou_jn', 'guilin'],
  },
  {
    id: 'guilin',
    name: '桂州',
    dao: '岭南道',
    x: 481, y: 482,
    importance: 'normal',
    description: '岭南西部，山水奇秀，连接西南与岭南。',
    neighbors: ['guangzhou', 'langzhou'],
  },

  // ── 东北 ──────────────────────────────────────────
  {
    id: 'yanzhou',
    name: '延州',
    dao: '关内道',
    x: 471, y: 298,
    importance: 'normal',
    description: '延河流域，黄土高原腹地，边境军事重镇。',
    neighbors: ['binzhou', 'tongzhou', 'taiyuan', 'daizhou'],
  },
]

export const DAO_COLORS: Record<string, string> = {
  '关内道': '#8B4513',
  '河南道': '#DAA520',
  '河东道': '#6B8E23',
  '河北道': '#4682B4',
  '淮南道': '#20B2AA',
  '江南道': '#3CB371',
  '剑南道': '#9370DB',
  '山南道': '#CD853F',
  '陇右道': '#BC8F5F',
  '岭南道': '#2E8B57',
}

export const DAO_PATHS: Record<string, string> = {
  '关内道': 'M 426,311 L 439,253 L 465,233 L 490,253 L 477,350 L 490,389 L 465,389 L 439,389 L 426,369 L 426,311 Z',
  '陇右道': 'M 426,311 L 439,253 L 426,233 L 348,194 L 194,194 L 39,292 L 219,369 L 335,506 L 400,506 L 400,408 L 439,389 L 426,369 L 426,311 Z',
  '河东道': 'M 490,253 L 503,214 L 529,233 L 529,311 L 516,350 L 503,350 L 477,350 L 490,253 Z',
  '河北道': 'M 503,214 L 555,233 L 619,253 L 619,292 L 632,311 L 594,350 L 581,350 L 529,350 L 516,350 L 529,311 L 529,233 L 503,214 Z',
  '河南道': 'M 477,350 L 503,350 L 529,350 L 581,350 L 594,350 L 619,389 L 594,389 L 555,389 L 529,408 L 516,389 L 516,350 L 503,350 L 477,350 Z',
  '山南道': 'M 439,389 L 465,389 L 490,389 L 516,389 L 529,408 L 529,447 L 503,447 L 465,428 L 439,408 L 400,408 L 439,389 Z',
  '淮南道': 'M 529,408 L 555,389 L 594,389 L 619,389 L 632,408 L 619,428 L 594,408 L 568,428 L 529,447 L 529,408 Z',
  '江南道': 'M 503,447 L 529,447 L 568,428 L 594,408 L 619,428 L 632,467 L 606,564 L 568,564 L 529,564 L 490,544 L 503,447 Z',
  '剑南道': 'M 400,408 L 439,408 L 465,428 L 503,447 L 490,544 L 335,506 L 400,506 L 400,408 Z',
  '岭南道': 'M 490,544 L 529,564 L 568,564 L 606,564 L 581,603 L 542,622 L 452,622 L 490,544 Z',
}

export function getRegionById(id: string): TangRegion | undefined {
  return TANG_REGIONS.find((r) => r.id === id)
}

export function getRegionsByDao(dao: string): TangRegion[] {
  return TANG_REGIONS.filter((r) => r.dao === dao)
}
