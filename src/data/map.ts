export interface Province {
  id: string
  nameEn: string
  nameZh: string
  region: string
  color: string
  capital: string
  description: string
}

export interface CityNode {
  id: string
  name: string
  provinceId: string
  x: number
  y: number
  importance: 'capital' | 'major' | 'normal'
  description: string
  neighbors: string[]
}

export const PROVINCES: Province[] = [
  { id: 'Beijing',      nameEn: 'Beijing',      nameZh: '北直隶', region: '京畿', color: '#8B4513', capital: 'beijing_city',   description: '天子脚下，首善之区，政治中心，百官辐辏。' },
  { id: 'Tianjin',      nameEn: 'Tianjin',      nameZh: '天津',   region: '京畿', color: '#8B4513', capital: 'tianjin_city',   description: '京城门户，漕运要冲，海河入海之地。' },
  { id: 'Hebei',        nameEn: 'Hebei',        nameZh: '河北',   region: '华北', color: '#DAA520', capital: 'baoding_city',   description: '华北平原，粮仓之地，历代兵家必争要地。' },
  { id: 'Shanxi',       nameEn: 'Shanxi',       nameZh: '山西',   region: '华北', color: '#DAA520', capital: 'taiyuan_city',   description: '表里山河，晋商故里，煤铁之乡。' },
  { id: 'Shandong',     nameEn: 'Shandong',     nameZh: '山东',   region: '华北', color: '#DAA520', capital: 'jinan_city',     description: '孔孟之乡，礼仪之邦，海岸线绵长。' },
  { id: 'Henan',        nameEn: 'Henan',        nameZh: '河南',   region: '华北', color: '#DAA520', capital: 'kaifeng_city',   description: '中原腹地，天下之中，古都遍布，科举重镇。' },
  { id: 'Neimenggu',    nameEn: 'Neimenggu',    nameZh: '漠南',   region: '漠南', color: '#BC8F5F', capital: 'hohhot_city',    description: '塞外草原，游牧之地，战略要冲。' },
  { id: 'Liaoning',     nameEn: 'Liaoning',     nameZh: '辽东',   region: '东北', color: '#4682B4', capital: 'shenyang_city',  description: '辽东重镇，边疆锁钥，农牧交汇之地。' },
  { id: 'Jilin',        nameEn: 'Jilin',        nameZh: '吉林',   region: '东北', color: '#4682B4', capital: 'jilin_city',     description: '白山黑水，山林茂密，东北腹地。' },
  { id: 'Heilongjiang', nameEn: 'Heilongjiang', nameZh: '龙江',   region: '东北', color: '#4682B4', capital: 'harbin_city',    description: '黑龙江畔，极北之地，边境要塞。' },
  { id: 'Shanghai',     nameEn: 'Shanghai',     nameZh: '松江',   region: '江南', color: '#20B2AA', capital: 'songjiang_city', description: '滨江重镇，商贸繁华，鱼米之乡。' },
  { id: 'Jiangsu',      nameEn: 'Jiangsu',      nameZh: '南直隶', region: '江南', color: '#20B2AA', capital: 'nanjing_city',   description: '江南核心，金陵故都，文华荟萃，富甲天下。' },
  { id: 'Zhejiang',     nameEn: 'Zhejiang',     nameZh: '浙江',   region: '江南', color: '#20B2AA', capital: 'hangzhou_city',  description: '湖光山色，丝绸之府，文人墨客云集之地。' },
  { id: 'Anhui',        nameEn: 'Anhui',        nameZh: '安徽',   region: '江南', color: '#20B2AA', capital: 'hefei_city',     description: '皖山皖水，徽商故里，新安文化发源地。' },
  { id: 'Fujian',       nameEn: 'Fujian',       nameZh: '福建',   region: '东南', color: '#3CB371', capital: 'fuzhou_city',    description: '八闽大地，海贸兴盛，山海相连。' },
  { id: 'Jiangxi',      nameEn: 'Jiangxi',      nameZh: '江西',   region: '东南', color: '#3CB371', capital: 'nanchang_city',  description: '赣江流域，瓷都故里，科举人才辈出。' },
  { id: 'Hubei',        nameEn: 'Hubei',        nameZh: '湖广北', region: '湖广', color: '#CD853F', capital: 'wuchang_city',   description: '荆楚大地，九省通衢，长江要冲。' },
  { id: 'Hunan',        nameEn: 'Hunan',        nameZh: '湖广南', region: '湖广', color: '#CD853F', capital: 'changsha_city',  description: '湘江流域，鱼米之乡，山地丘陵连绵。' },
  { id: 'Guangdong',    nameEn: 'Guangdong',    nameZh: '广东',   region: '两广', color: '#2E8B57', capital: 'guangzhou_city', description: '南海之滨，海上丝路起点，商贸最盛之地。' },
  { id: 'Guangxi',      nameEn: 'Guangxi',      nameZh: '广西',   region: '两广', color: '#2E8B57', capital: 'guilin_city',    description: '桂林山水，西南门户，百越故地。' },
  { id: 'Sichuan',      nameEn: 'Sichuan',      nameZh: '四川',   region: '西南', color: '#9370DB', capital: 'chengdu_city',   description: '天府之国，沃野千里，扬一益二之地。' },
  { id: 'Chongqing',    nameEn: 'Chongqing',    nameZh: '重庆',   region: '西南', color: '#9370DB', capital: 'chongqing_city', description: '山城重庆，长江门户，西南商都。' },
  { id: 'Guizhou',      nameEn: 'Guizhou',      nameZh: '贵州',   region: '西南', color: '#9370DB', capital: 'guiyang_city',   description: '黔地山多，少数民族聚居，风俗独特。' },
  { id: 'Yunnan',       nameEn: 'Yunnan',       nameZh: '云南',   region: '西南', color: '#9370DB', capital: 'kunming_city',   description: '彩云之南，百族聚居，茶马古道起点。' },
  { id: 'Shaanxi',      nameEn: 'Shaanxi',      nameZh: '陕西',   region: '西北', color: '#6B8E23', capital: 'xian_city',      description: '三秦大地，古都长安，丝路起点。' },
  { id: 'Gansu',        nameEn: 'Gansu',        nameZh: '甘肃',   region: '西北', color: '#BC8F5F', capital: 'lanzhou_city',   description: '河西走廊，丝路要道，连接西域咽喉。' },
  { id: 'Qinghai',      nameEn: 'Qinghai',      nameZh: '青海',   region: '西北', color: '#BC8F5F', capital: 'xining_city',    description: '高原之地，河湟谷地，青藏门户。' },
  { id: 'Ningxia',      nameEn: 'Ningxia',      nameZh: '宁夏',   region: '西北', color: '#BC8F5F', capital: 'yinchuan_city',  description: '塞上江南，黄河流经，农牧交界之地。' },
  { id: 'Xinjiang',     nameEn: 'Xinjiang',     nameZh: '西域',   region: '西北', color: '#BC8F5F', capital: 'urumqi_city',    description: '丝路西端，大漠绿洲，多民族聚居之地。' },
]

export const PROVINCE_REGIONS = ['京畿', '华北', '漠南', '东北', '江南', '东南', '湖广', '两广', '西南', '西北']

export const CITIES: CityNode[] = [
  { id: 'beijing_city',   name: '京师',   provinceId: 'Beijing',      x: 2141, y: 985,  importance: 'capital', description: '国都所在，天子脚下，科举取士之源，百官辐辏。',        neighbors: ['baoding_city', 'tianjin_city', 'taiyuan_city'] },
  { id: 'tianjin_city',   name: '天津',   provinceId: 'Tianjin',      x: 2188, y: 1010, importance: 'major',   description: '京城门户，漕运要冲。',                                 neighbors: ['beijing_city', 'baoding_city'] },
  { id: 'baoding_city',   name: '保定',   provinceId: 'Hebei',        x: 2118, y: 1038, importance: 'major',   description: '直隶重镇，京南门户。',                                 neighbors: ['beijing_city', 'shijiazhuang_city', 'jinan_city'] },
  { id: 'shijiazhuang_city', name: '真定', provinceId: 'Hebei',       x: 2082, y: 1080, importance: 'normal',  description: '太行山麓，农业富庶之地。',                             neighbors: ['baoding_city', 'taiyuan_city', 'handan_city'] },
  { id: 'handan_city',    name: '广平',   provinceId: 'Hebei',        x: 2065, y: 1128, importance: 'normal',  description: '冀南重镇，平原腹地。',                                 neighbors: ['shijiazhuang_city', 'kaifeng_city', 'taiyuan_city'] },
  { id: 'taiyuan_city',   name: '太原',   provinceId: 'Shanxi',       x: 2019, y: 1061, importance: 'capital', description: '晋地之都，表里山河，历代军事重镇。',                     neighbors: ['beijing_city', 'datong_city', 'xian_city'] },
  { id: 'datong_city',    name: '大同',   provinceId: 'Shanxi',       x: 2028, y: 998,  importance: 'major',   description: '九边重镇，抵御北方游牧的门户要塞。',                   neighbors: ['taiyuan_city', 'hohhot_city', 'beijing_city'] },
  { id: 'hohhot_city',    name: '归化',   provinceId: 'Neimenggu',    x: 1988, y: 942,  importance: 'major',   description: '塞外重镇，游牧与农耕交界之地。',                       neighbors: ['datong_city', 'yinchuan_city'] },
  { id: 'shenyang_city',  name: '沈阳',   provinceId: 'Liaoning',     x: 2336, y: 921,  importance: 'capital', description: '辽东重镇，东北边疆门户。',                             neighbors: ['beijing_city', 'jilin_city'] },
  { id: 'jilin_city',     name: '吉林',   provinceId: 'Jilin',        x: 2390, y: 851,  importance: 'major',   description: '松花江畔，东北腹地。',                                 neighbors: ['shenyang_city', 'harbin_city'] },
  { id: 'harbin_city',    name: '哈尔滨', provinceId: 'Heilongjiang', x: 2390, y: 780,  importance: 'major',   description: '黑龙江要津，极北边塞。',                               neighbors: ['jilin_city'] },
  { id: 'jinan_city',     name: '济南',   provinceId: 'Shandong',     x: 2178, y: 1138, importance: 'capital', description: '泉城济南，齐鲁大地中心。',                             neighbors: ['baoding_city', 'kaifeng_city', 'nanjing_city'] },
  { id: 'qingdao_city',   name: '青州',   provinceId: 'Shandong',     x: 2245, y: 1141, importance: 'normal',  description: '海滨重镇，商贸繁盛。',                                 neighbors: ['jinan_city'] },
  { id: 'kaifeng_city',   name: '开封',   provinceId: 'Henan',        x: 2092, y: 1185, importance: 'capital', description: '七朝古都，中原腹地，黄河要冲。',                        neighbors: ['jinan_city', 'baoding_city', 'xian_city', 'wuchang_city', 'nanjing_city'] },
  { id: 'luoyang_city',   name: '洛阳',   provinceId: 'Henan',        x: 2041, y: 1185, importance: 'major',   description: '九朝古都，天下之中。',                                 neighbors: ['kaifeng_city', 'xian_city'] },
  { id: 'songjiang_city', name: '松江',   provinceId: 'Shanghai',     x: 2350, y: 1418, importance: 'major',   description: '棉纺之乡，江南商贸重地。',                             neighbors: ['nanjing_city', 'hangzhou_city'] },
  { id: 'nanjing_city',   name: '金陵',   provinceId: 'Jiangsu',      x: 2260, y: 1397, importance: 'capital', description: '六朝古都，江南首府，文华荟萃之地。',                    neighbors: ['kaifeng_city', 'hangzhou_city', 'hefei_city', 'jinan_city'] },
  { id: 'suzhou_city',    name: '苏州',   provinceId: 'Jiangsu',      x: 2325, y: 1412, importance: 'major',   description: '苏州府，天堂之城，丝绸产地，文人雅集之所。',            neighbors: ['nanjing_city', 'hangzhou_city', 'songjiang_city'] },
  { id: 'hangzhou_city',  name: '杭州',   provinceId: 'Zhejiang',     x: 2310, y: 1467, importance: 'capital', description: '西子湖畔，人间天堂，丝茶之都。',                       neighbors: ['nanjing_city', 'suzhou_city', 'nanchang_city'] },
  { id: 'ningbo_city',    name: '宁波',   provinceId: 'Zhejiang',     x: 2366, y: 1487, importance: 'major',   description: '东海商港，海贸重镇。',                                 neighbors: ['hangzhou_city', 'fuzhou_city'] },
  { id: 'hefei_city',     name: '庐州',   provinceId: 'Anhui',        x: 2210, y: 1392, importance: 'normal',  description: '皖中重镇，淮南门户。',                                 neighbors: ['nanjing_city', 'kaifeng_city', 'wuchang_city'] },
  { id: 'fuzhou_city',    name: '福州',   provinceId: 'Fujian',       x: 2329, y: 1568, importance: 'capital', description: '八闽首府，东南海疆重地。',                             neighbors: ['hangzhou_city', 'ningbo_city', 'nanchang_city'] },
  { id: 'nanchang_city',  name: '南昌',   provinceId: 'Jiangxi',      x: 2215, y: 1496, importance: 'capital', description: '豫章故郡，洪都新府，赣江流域中心。',                   neighbors: ['hangzhou_city', 'fuzhou_city', 'wuchang_city', 'changsha_city', 'guangzhou_city'] },
  { id: 'wuchang_city',   name: '武昌',   provinceId: 'Hubei',        x: 2138, y: 1456, importance: 'capital', description: '九省通衢，长江锁钥，兵家必争之地。',                   neighbors: ['kaifeng_city', 'nanchang_city', 'changsha_city', 'chongqing_city', 'hefei_city'] },
  { id: 'changsha_city',  name: '长沙',   provinceId: 'Hunan',        x: 2084, y: 1545, importance: 'capital', description: '湘楚故都，楚汉文化发源地。',                           neighbors: ['wuchang_city', 'nanchang_city', 'guangzhou_city', 'guilin_city', 'guiyang_city'] },
  { id: 'guangzhou_city', name: '广州',   provinceId: 'Guangdong',    x: 2082, y: 1680, importance: 'capital', description: '岭南都会，海上丝路起点，商贸最盛之地。',                neighbors: ['nanchang_city', 'changsha_city', 'guilin_city'] },
  { id: 'guilin_city',    name: '桂林',   provinceId: 'Guangxi',      x: 1981, y: 1646, importance: 'capital', description: '桂林山水，西南门户重镇。',                             neighbors: ['changsha_city', 'guangzhou_city', 'guiyang_city', 'kunming_city'] },
  { id: 'chengdu_city',   name: '成都',   provinceId: 'Sichuan',      x: 1838, y: 1488, importance: 'capital', description: '天府之国核心，扬一益二之"益"，物产丰饶。',             neighbors: ['xian_city', 'chongqing_city', 'guiyang_city', 'kunming_city'] },
  { id: 'chongqing_city', name: '重庆',   provinceId: 'Chongqing',    x: 1950, y: 1518, importance: 'capital', description: '山城要塞，长江三峡门户，西南商都。',                   neighbors: ['chengdu_city', 'wuchang_city', 'guiyang_city'] },
  { id: 'guiyang_city',   name: '贵阳',   provinceId: 'Guizhou',      x: 1950, y: 1617, importance: 'capital', description: '黔中要地，西南通衢。',                                 neighbors: ['chongqing_city', 'changsha_city', 'guilin_city', 'kunming_city'] },
  { id: 'kunming_city',   name: '昆明',   provinceId: 'Yunnan',       x: 1845, y: 1667, importance: 'capital', description: '彩云之南，茶马古道枢纽，百族聚居之地。',               neighbors: ['chengdu_city', 'guiyang_city', 'guilin_city'] },
  { id: 'xian_city',      name: '西安',   provinceId: 'Shaanxi',      x: 1942, y: 1206, importance: 'capital', description: '十三朝古都，丝绸之路起点，西北政治中心。',             neighbors: ['taiyuan_city', 'kaifeng_city', 'chengdu_city', 'lanzhou_city'] },
  { id: 'lanzhou_city',   name: '兰州',   provinceId: 'Gansu',        x: 1793, y: 1180, importance: 'capital', description: '黄河要津，河西走廊东端，丝路咽喉。',                   neighbors: ['xian_city', 'xining_city', 'yinchuan_city', 'urumqi_city'] },
  { id: 'xining_city',    name: '西宁',   provinceId: 'Qinghai',      x: 1731, y: 1255, importance: 'capital', description: '河湟谷地，青藏高原东北门户。',                         neighbors: ['lanzhou_city'] },
  { id: 'yinchuan_city',  name: '银川',   provinceId: 'Ningxia',      x: 1890, y: 1094, importance: 'capital', description: '塞上江南，黄河之滨，西北要地。',                       neighbors: ['lanzhou_city', 'hohhot_city', 'xian_city'] },
  { id: 'urumqi_city',    name: '乌鲁木齐', provinceId: 'Xinjiang',   x: 1353, y: 977,  importance: 'capital', description: '西域都护，丝路重镇，大漠绿洲。',                       neighbors: ['lanzhou_city'] },
]

export function getProvinceById(id: string): Province | undefined {
  return PROVINCES.find(p => p.id === id)
}

export function getCityById(id: string): CityNode | undefined {
  return CITIES.find(c => c.id === id)
}

export function getCitiesByProvince(provinceId: string): CityNode[] {
  return CITIES.filter(c => c.provinceId === provinceId)
}
