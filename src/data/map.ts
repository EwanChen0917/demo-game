export interface Province {
  id: string
  nameZh: string
  region: string
  color: string
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
  { id: '北直隶', nameZh: '北直隶', region: '京畿', color: '#8B4513', description: '天子脚下，首善之区，政治中心，百官辐辏。' },
  { id: '山东',   nameZh: '山东',   region: '华北', color: '#DAA520', description: '孔孟之乡，礼仪之邦，海岸线绵长。' },
  { id: '山西',   nameZh: '山西',   region: '华北', color: '#B8860B', description: '表里山河，晋商故里，煤铁之乡。' },
  { id: '陕西',   nameZh: '陕西',   region: '西北', color: '#6B8E23', description: '三秦大地，古都长安，丝路起点。' },
  { id: '河南',   nameZh: '河南',   region: '华北', color: '#DAA520', description: '中原腹地，天下之中，古都遍布，科举重镇。' },
  { id: '南直隶', nameZh: '南直隶', region: '江南', color: '#20B2AA', description: '江南核心，金陵故都，文华荟萃，富甲天下。' },
  { id: '浙江',   nameZh: '浙江',   region: '江南', color: '#2E8B57', description: '湖光山色，丝绸之府，文人墨客云集之地。' },
  { id: '福建',   nameZh: '福建',   region: '东南', color: '#3CB371', description: '八闽大地，海贸兴盛，山海相连。' },
  { id: '江西',   nameZh: '江西',   region: '东南', color: '#228B22', description: '赣江流域，瓷都故里，科举人才辈出。' },
  { id: '湖广',   nameZh: '湖广',   region: '湖广', color: '#CD853F', description: '荆楚大地，湖广熟天下足，长江锁钥。' },
  { id: '广东',   nameZh: '广东',   region: '两广', color: '#2E8B57', description: '岭南都会，海上丝路起点，商贸最盛之地。' },
  { id: '广西',   nameZh: '广西',   region: '两广', color: '#006400', description: '桂林山水，西南门户，百越故地。' },
  { id: '四川',   nameZh: '四川',   region: '西南', color: '#9370DB', description: '天府之国，沃野千里，扬一益二之地。' },
  { id: '贵州',   nameZh: '贵州',   region: '西南', color: '#7B68EE', description: '黔地山多，少数民族聚居，风俗独特。' },
  { id: '云南',   nameZh: '云南',   region: '西南', color: '#6A5ACD', description: '彩云之南，百族聚居，茶马古道起点。' },
  { id: '辽东',   nameZh: '辽东',   region: '东北', color: '#4682B4', description: '辽东重镇，边疆锁钥，农牧交汇之地。' },
]

export const PROVINCE_REGIONS = ['京畿', '华北', '江南', '东南', '湖广', '两广', '西南', '西北', '东北']

export const PROVINCE_PATHS: Record<string, string> = {
  '北直隶': 'M 2265,878 L 2363,878 L 2462,942 L 2511,845 L 2412,1105 L 2560,1235 L 2314,1430 L 2166,1138 L 2142,1040 L 2166,942 L 2265,878 Z',
  '辽东':   'M 2511,845 L 2462,942 L 2806,812 L 2855,910 L 2658,1008 L 2511,845 Z',
  '山东':   'M 2166,1138 L 2142,1040 L 2265,878 L 2363,878 L 2462,942 L 2511,845 L 2412,1105 L 2560,1235 L 2412,1398 L 2314,1430 L 2215,1462 L 2117,1268 L 2166,1138 Z',
  '山西':   'M 2166,942 L 2068,910 L 2018,942 L 1994,1040 L 1969,1138 L 1994,1300 L 2068,1398 L 2117,1268 L 2166,1138 L 2142,1040 L 2166,942 Z',
  '陕西':   'M 1822,878 L 2068,910 L 2018,942 L 1994,1040 L 1969,1138 L 1994,1300 L 2068,1398 L 1969,1398 L 1895,1398 L 1822,1365 L 1723,1365 L 1674,1170 L 1822,878 Z',
  '河南':   'M 2117,1268 L 2166,1138 L 2215,1462 L 2117,1462 L 2068,1398 L 1994,1300 L 2117,1268 Z',
  '南直隶': 'M 2215,1462 L 2314,1430 L 2412,1398 L 2511,1560 L 2560,1690 L 2412,1528 L 2314,1593 L 2265,1625 L 2166,1625 L 2068,1625 L 2117,1462 L 2215,1462 Z',
  '浙江':   'M 2314,1593 L 2412,1528 L 2511,1560 L 2560,1690 L 2437,1820 L 2535,1852 L 2486,1982 L 2338,2048 L 2265,2015 L 2142,1755 L 2265,1625 L 2314,1593 Z',
  '福建':   'M 2437,1820 L 2560,1690 L 2535,1852 L 2486,1982 L 2314,2080 L 2338,2048 L 2265,2015 L 2363,1885 L 2388,1788 L 2437,1820 Z',
  '江西':   'M 2166,1625 L 2265,1625 L 2142,1755 L 2388,1788 L 2363,1885 L 2265,2015 L 2191,2015 L 2117,1982 L 2117,1885 L 2142,1755 L 2265,1625 L 2166,1625 Z',
  '湖广':   'M 1822,1365 L 1895,1398 L 1969,1398 L 2068,1398 L 2117,1462 L 2068,1625 L 2166,1625 L 2142,1755 L 2117,1885 L 2117,1982 L 2043,1950 L 1969,1950 L 1895,1722 L 1920,1495 L 1772,1398 L 1723,1365 L 1822,1365 Z',
  '广东':   'M 2117,1982 L 2191,2015 L 2265,2015 L 2363,1885 L 2338,2048 L 2314,2080 L 2117,2210 L 1969,2145 L 2018,2048 L 1969,1950 L 2043,1950 L 2117,1982 Z',
  '广西':   'M 1969,1950 L 2018,2048 L 1969,2145 L 1871,2178 L 1378,2145 L 1674,2080 L 1772,2015 L 1895,1722 L 1969,1950 Z',
  '四川':   'M 1723,1365 L 1674,1170 L 1625,1300 L 1477,1560 L 1502,1690 L 1551,1755 L 1625,1820 L 1895,1722 L 1920,1495 L 1772,1398 L 1723,1365 Z',
  '贵州':   'M 1895,1722 L 1625,1820 L 1674,2080 L 1772,2015 L 1969,1950 L 2117,1885 L 1895,1722 Z',
  '云南':   'M 1551,1755 L 1625,1820 L 1674,2080 L 1378,2145 L 1354,1950 L 1378,1755 L 1477,1560 L 1551,1755 Z',
}

export const CITIES: CityNode[] = [
  { id: 'beijing_city',    name: '京师',    provinceId: '北直隶', x: 2284, y: 982,  importance: 'capital', description: '国都所在，天子脚下，科举取士之源，百官辐辏。',        neighbors: ['baoding_city', 'taiyuan_city', 'shenyang_city'] },
  { id: 'baoding_city',    name: '保定',    provinceId: '北直隶', x: 2240, y: 1046, importance: 'major',   description: '直隶重镇，京南门户，军事要地。',                       neighbors: ['beijing_city', 'taiyuan_city', 'jinan_city', 'kaifeng_city'] },
  { id: 'jinan_city',      name: '济南',    provinceId: '山东',   x: 2314, y: 1189, importance: 'capital', description: '泉城济南，齐鲁大地中心。',                             neighbors: ['baoding_city', 'kaifeng_city', 'nanjing_city'] },
  { id: 'qingzhou_city',   name: '青州',    provinceId: '山东',   x: 2437, y: 1150, importance: 'normal',  description: '齐地古城，海滨重镇。',                                 neighbors: ['jinan_city'] },
  { id: 'taiyuan_city',    name: '太原',    provinceId: '山西',   x: 2092, y: 1112, importance: 'capital', description: '晋地之都，表里山河，历代军事重镇。',                     neighbors: ['beijing_city', 'datong_city', 'xian_city', 'kaifeng_city'] },
  { id: 'datong_city',     name: '大同',    provinceId: '山西',   x: 2132, y: 968,  importance: 'major',   description: '九边重镇，抵御北方游牧的门户要塞。',                   neighbors: ['taiyuan_city', 'beijing_city'] },
  { id: 'xian_city',       name: '西安',    provinceId: '陕西',   x: 1915, y: 1346, importance: 'capital', description: '十三朝古都，丝绸之路起点，西北政治中心。',             neighbors: ['taiyuan_city', 'kaifeng_city', 'chengdu_city', 'lanzhou_city'] },
  { id: 'lanzhou_city',    name: '兰州',    provinceId: '陕西',   x: 1664, y: 1228, importance: 'major',   description: '黄河要津，河西走廊东端，丝路咽喉。',                   neighbors: ['xian_city', 'chengdu_city'] },
  { id: 'kaifeng_city',    name: '开封',    provinceId: '河南',   x: 2181, y: 1313, importance: 'capital', description: '七朝古都，中原腹地，黄河要冲。',                        neighbors: ['jinan_city', 'baoding_city', 'xian_city', 'wuchang_city', 'nanjing_city'] },
  { id: 'luoyang_city',    name: '洛阳',    provinceId: '河南',   x: 2092, y: 1319, importance: 'major',   description: '九朝古都，天下之中。',                                 neighbors: ['kaifeng_city', 'xian_city'] },
  { id: 'nanjing_city',    name: '金陵',    provinceId: '南直隶', x: 2402, y: 1488, importance: 'capital', description: '六朝古都，江南首府，文华荟萃之地。',                    neighbors: ['kaifeng_city', 'hangzhou_city', 'hefei_city', 'jinan_city'] },
  { id: 'suzhou_city',     name: '苏州',    provinceId: '南直隶', x: 2491, y: 1540, importance: 'major',   description: '天堂之城，丝绸产地，文人雅集之所。',                    neighbors: ['nanjing_city', 'hangzhou_city'] },
  { id: 'hefei_city',      name: '庐州',    provinceId: '南直隶', x: 2270, y: 1528, importance: 'normal',  description: '皖中重镇，淮南门户。',                                 neighbors: ['nanjing_city', 'kaifeng_city', 'wuchang_city'] },
  { id: 'hangzhou_city',   name: '杭州',    provinceId: '浙江',   x: 2471, y: 1605, importance: 'capital', description: '西子湖畔，人间天堂，丝茶之都。',                       neighbors: ['nanjing_city', 'suzhou_city', 'nanchang_city'] },
  { id: 'ningbo_city',     name: '宁波',    provinceId: '浙江',   x: 2510, y: 1690, importance: 'major',   description: '东海商港，海贸重镇。',                                 neighbors: ['hangzhou_city', 'fuzhou_city'] },
  { id: 'fuzhou_city',     name: '福州',    provinceId: '福建',   x: 2427, y: 1878, importance: 'capital', description: '八闽首府，东南海疆重地。',                             neighbors: ['hangzhou_city', 'ningbo_city', 'nanchang_city'] },
  { id: 'quanzhou_city',   name: '泉州',    provinceId: '福建',   x: 2437, y: 1950, importance: 'major',   description: '海上丝路起点，番商云集之地。',                         neighbors: ['fuzhou_city'] },
  { id: 'nanchang_city',   name: '南昌',    provinceId: '江西',   x: 2260, y: 1710, importance: 'capital', description: '豫章故郡，洪都新府，赣江流域中心。',                   neighbors: ['hangzhou_city', 'fuzhou_city', 'wuchang_city', 'changsha_city', 'guangzhou_city'] },
  { id: 'jingdezhen_city', name: '景德镇',  provinceId: '江西',   x: 2338, y: 1660, importance: 'normal',  description: '瓷都，天下窑器之冠。',                                 neighbors: ['nanchang_city', 'hangzhou_city'] },
  { id: 'wuchang_city',    name: '武昌',    provinceId: '湖广',   x: 2181, y: 1586, importance: 'capital', description: '九省通衢，长江锁钥，兵家必争之地。',                   neighbors: ['kaifeng_city', 'nanchang_city', 'changsha_city', 'chongqing_city', 'hefei_city'] },
  { id: 'changsha_city',   name: '长沙',    provinceId: '湖广',   x: 2112, y: 1742, importance: 'major',   description: '湘楚故都，楚汉文化发源地。',                           neighbors: ['wuchang_city', 'nanchang_city', 'guangzhou_city', 'guilin_city', 'guiyang_city'] },
  { id: 'guangzhou_city',  name: '广州',    provinceId: '广东',   x: 2132, y: 2074, importance: 'capital', description: '岭南都会，海上丝路起点，商贸最盛之地。',                neighbors: ['nanchang_city', 'changsha_city', 'guilin_city'] },
  { id: 'chaozhou_city',   name: '潮州',    provinceId: '广东',   x: 2260, y: 2015, importance: 'normal',  description: '潮汕重镇，海贸繁盛。',                                 neighbors: ['guangzhou_city', 'fuzhou_city'] },
  { id: 'guilin_city',     name: '桂林',    provinceId: '广西',   x: 1984, y: 1930, importance: 'capital', description: '桂林山水，西南门户重镇。',                             neighbors: ['changsha_city', 'guangzhou_city', 'guiyang_city', 'kunming_city'] },
  { id: 'nanning_city',    name: '南宁',    provinceId: '广西',   x: 1820, y: 2048, importance: 'major',   description: '邕州古城，广西腹地，西南要冲。',                       neighbors: ['guilin_city', 'kunming_city'] },
  { id: 'chengdu_city',    name: '成都',    provinceId: '四川',   x: 1679, y: 1580, importance: 'capital', description: '天府之国核心，扬一益二之"益"，物产丰饶。',             neighbors: ['xian_city', 'chongqing_city', 'guiyang_city', 'kunming_city'] },
  { id: 'chongqing_city',  name: '重庆',    provinceId: '四川',   x: 1802, y: 1651, importance: 'major',   description: '山城要塞，长江三峡门户，西南商都。',                   neighbors: ['chengdu_city', 'wuchang_city', 'guiyang_city'] },
  { id: 'guiyang_city',    name: '贵阳',    provinceId: '贵州',   x: 1807, y: 1846, importance: 'capital', description: '黔中要地，西南通衢。',                                 neighbors: ['chongqing_city', 'changsha_city', 'guilin_city', 'kunming_city'] },
  { id: 'kunming_city',    name: '昆明',    provinceId: '云南',   x: 1610, y: 1950, importance: 'capital', description: '彩云之南，茶马古道枢纽，百族聚居之地。',               neighbors: ['chengdu_city', 'guiyang_city', 'guilin_city', 'nanning_city'] },
  { id: 'dali_city',       name: '大理',    provinceId: '云南',   x: 1502, y: 1885, importance: 'major',   description: '苍山洱海，南诏故都，西南商道要冲。',                   neighbors: ['kunming_city'] },
  { id: 'shenyang_city',   name: '沈阳',    provinceId: '辽东',   x: 2629, y: 858,  importance: 'capital', description: '辽东重镇，东北边疆门户。',                             neighbors: ['beijing_city', 'datong_city'] },
  { id: 'liaoyang_city',   name: '辽阳',    provinceId: '辽东',   x: 2668, y: 910,  importance: 'major',   description: '辽东都司驻地，东北军事中心。',                         neighbors: ['shenyang_city'] },
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
