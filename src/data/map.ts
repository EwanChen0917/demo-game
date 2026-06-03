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
  '北直隶': 'M 2265,878 L 2363,878 L 2462,942 L 2511,975 L 2511,1072 L 2462,1105 L 2363,1105 L 2265,1138 L 2166,1138 L 2166,1040 L 2166,975 L 2215,910 L 2265,878 Z',
  '山东':   'M 2265,1138 L 2363,1105 L 2462,1105 L 2511,1072 L 2560,1138 L 2560,1235 L 2511,1300 L 2462,1300 L 2412,1332 L 2363,1365 L 2289,1365 L 2265,1300 L 2265,1235 L 2265,1138 Z',
  '山西':   'M 2166,975 L 2166,910 L 2142,878 L 2068,910 L 2018,942 L 1994,1008 L 1969,1072 L 1969,1170 L 1994,1235 L 2018,1300 L 2068,1300 L 2117,1268 L 2117,1202 L 2142,1138 L 2166,1105 L 2166,1040 L 2166,975 Z',
  '陕西':   'M 1994,1008 L 2018,942 L 2068,910 L 1822,878 L 1723,975 L 1674,1072 L 1649,1170 L 1674,1235 L 1698,1300 L 1723,1365 L 1772,1398 L 1822,1430 L 1871,1398 L 1969,1398 L 1994,1365 L 1994,1300 L 1994,1235 L 1969,1170 L 1969,1072 L 1994,1008 Z',
  '河南':   'M 2166,1138 L 2265,1138 L 2265,1235 L 2289,1365 L 2314,1398 L 2265,1430 L 2215,1462 L 2166,1462 L 2117,1462 L 2068,1430 L 2018,1398 L 1994,1365 L 1994,1300 L 1994,1235 L 2068,1235 L 2117,1268 L 2117,1202 L 2166,1138 Z',
  '南直隶': 'M 2265,1430 L 2314,1398 L 2363,1365 L 2412,1332 L 2462,1332 L 2511,1430 L 2560,1528 L 2560,1593 L 2511,1625 L 2462,1657 L 2412,1625 L 2363,1625 L 2314,1593 L 2265,1593 L 2215,1593 L 2215,1528 L 2166,1462 L 2215,1462 L 2265,1430 Z',
  '浙江':   'M 2412,1625 L 2462,1657 L 2511,1625 L 2560,1593 L 2560,1657 L 2560,1755 L 2535,1820 L 2511,1852 L 2462,1885 L 2412,1852 L 2388,1820 L 2363,1755 L 2363,1690 L 2412,1657 L 2412,1625 Z',
  '福建':   'M 2412,1852 L 2462,1885 L 2511,1852 L 2511,1950 L 2486,2015 L 2462,2048 L 2363,2080 L 2314,2048 L 2289,2015 L 2265,1950 L 2289,1885 L 2314,1852 L 2388,1820 L 2412,1852 Z',
  '江西':   'M 2215,1593 L 2265,1593 L 2314,1593 L 2363,1690 L 2363,1755 L 2388,1820 L 2314,1852 L 2289,1885 L 2289,2015 L 2215,2015 L 2166,1982 L 2142,1950 L 2117,1885 L 2117,1820 L 2117,1755 L 2142,1690 L 2166,1625 L 2166,1593 L 2215,1593 Z',
  '湖广':   'M 1994,1398 L 2068,1430 L 2117,1462 L 2166,1462 L 2215,1528 L 2215,1593 L 2166,1625 L 2166,1593 L 2117,1690 L 2117,1755 L 2117,1820 L 2117,1885 L 2068,1885 L 2018,1918 L 1969,1918 L 1920,1885 L 1920,1820 L 1895,1755 L 1871,1690 L 1871,1625 L 1895,1560 L 1920,1495 L 1969,1430 L 1994,1398 Z',
  '广东':   'M 1969,1918 L 2018,1918 L 2068,1885 L 2117,1950 L 2166,1982 L 2215,2015 L 2265,2048 L 2314,2048 L 2289,2112 L 2215,2178 L 2117,2210 L 2018,2210 L 1969,2210 L 1895,2178 L 1871,2145 L 1920,2080 L 1945,2015 L 1969,1950 L 1969,1918 Z',
  '广西':   'M 1674,1885 L 1772,1852 L 1871,1852 L 1920,1885 L 1945,1982 L 1846,2048 L 1772,2080 L 1698,2112 L 1625,2145 L 1551,2145 L 1477,2112 L 1428,2048 L 1477,1950 L 1526,1885 L 1575,1852 L 1625,1885 L 1674,1885 Z',
  '四川':   'M 1723,1365 L 1772,1398 L 1822,1430 L 1920,1495 L 1969,1560 L 1969,1625 L 1920,1690 L 1895,1755 L 1822,1755 L 1772,1820 L 1723,1820 L 1674,1820 L 1625,1820 L 1551,1755 L 1502,1690 L 1477,1625 L 1502,1528 L 1551,1430 L 1575,1365 L 1625,1300 L 1674,1268 L 1698,1300 L 1723,1365 Z',
  '贵州':   'M 1674,1820 L 1723,1820 L 1772,1820 L 1822,1755 L 1871,1755 L 1895,1755 L 1920,1885 L 1945,1982 L 1846,2048 L 1772,2080 L 1698,2112 L 1625,2145 L 1649,2080 L 1674,1982 L 1649,1950 L 1625,1950 L 1674,1885 L 1674,1820 Z',
  '云南':   'M 1502,1528 L 1551,1755 L 1625,1820 L 1674,1820 L 1674,1885 L 1625,1885 L 1649,1950 L 1625,1950 L 1625,2145 L 1551,2145 L 1477,2112 L 1428,2048 L 1354,2015 L 1329,1950 L 1354,1852 L 1378,1755 L 1428,1690 L 1452,1625 L 1477,1593 L 1502,1528 Z',
  '辽东':   'M 2462,878 L 2511,812 L 2658,780 L 2806,845 L 2855,910 L 2855,975 L 2757,1008 L 2658,1008 L 2560,975 L 2511,975 L 2462,942 L 2462,878 Z',
}

export const CITIES: CityNode[] = [
  { id: 'beijing_city',    name: '京师',    provinceId: '北直隶', x: 2284, y: 982,  importance: 'capital', description: '国都所在，天子脚下，科举取士之源，百官辐辏。',        neighbors: ['baoding_city', 'taiyuan_city', 'shenyang_city'] },
  { id: 'baoding_city',    name: '保定',    provinceId: '北直隶', x: 2240, y: 1038, importance: 'major',   description: '直隶重镇，京南门户，军事要地。',                       neighbors: ['beijing_city', 'taiyuan_city', 'jinan_city', 'kaifeng_city'] },
  { id: 'jinan_city',      name: '济南',    provinceId: '山东',   x: 2314, y: 1138, importance: 'capital', description: '泉城济南，齐鲁大地中心。',                             neighbors: ['baoding_city', 'kaifeng_city', 'nanjing_city'] },
  { id: 'qingzhou_city',   name: '青州',    provinceId: '山东',   x: 2412, y: 1170, importance: 'normal',  description: '齐地古城，海滨重镇。',                                 neighbors: ['jinan_city'] },
  { id: 'taiyuan_city',    name: '太原',    provinceId: '山西',   x: 2068, y: 1072, importance: 'capital', description: '晋地之都，表里山河，历代军事重镇。',                     neighbors: ['beijing_city', 'datong_city', 'xian_city', 'kaifeng_city'] },
  { id: 'datong_city',     name: '大同',    provinceId: '山西',   x: 2068, y: 942,  importance: 'major',   description: '九边重镇，抵御北方游牧的门户要塞。',                   neighbors: ['taiyuan_city', 'beijing_city'] },
  { id: 'xian_city',       name: '西安',    provinceId: '陕西',   x: 1871, y: 1332, importance: 'capital', description: '十三朝古都，丝绸之路起点，西北政治中心。',             neighbors: ['taiyuan_city', 'kaifeng_city', 'chengdu_city', 'lanzhou_city'] },
  { id: 'lanzhou_city',    name: '兰州',    provinceId: '陕西',   x: 1698, y: 1202, importance: 'major',   description: '黄河要津，河西走廊东端，丝路咽喉。',                   neighbors: ['xian_city', 'chengdu_city'] },
  { id: 'kaifeng_city',    name: '开封',    provinceId: '河南',   x: 2166, y: 1300, importance: 'capital', description: '七朝古都，中原腹地，黄河要冲。',                        neighbors: ['jinan_city', 'baoding_city', 'xian_city', 'wuchang_city', 'nanjing_city'] },
  { id: 'luoyang_city',    name: '洛阳',    provinceId: '河南',   x: 2068, y: 1332, importance: 'major',   description: '九朝古都，天下之中。',                                 neighbors: ['kaifeng_city', 'xian_city'] },
  { id: 'nanjing_city',    name: '金陵',    provinceId: '南直隶', x: 2363, y: 1495, importance: 'capital', description: '六朝古都，江南首府，文华荟萃之地。',                    neighbors: ['kaifeng_city', 'hangzhou_city', 'hefei_city', 'jinan_city'] },
  { id: 'suzhou_city',     name: '苏州',    provinceId: '南直隶', x: 2437, y: 1528, importance: 'major',   description: '天堂之城，丝绸产地，文人雅集之所。',                    neighbors: ['nanjing_city', 'hangzhou_city'] },
  { id: 'hefei_city',      name: '庐州',    provinceId: '南直隶', x: 2240, y: 1528, importance: 'normal',  description: '皖中重镇，淮南门户。',                                 neighbors: ['nanjing_city', 'kaifeng_city', 'wuchang_city'] },
  { id: 'hangzhou_city',   name: '杭州',    provinceId: '浙江',   x: 2462, y: 1625, importance: 'capital', description: '西子湖畔，人间天堂，丝茶之都。',                       neighbors: ['nanjing_city', 'suzhou_city', 'nanchang_city'] },
  { id: 'ningbo_city',     name: '宁波',    provinceId: '浙江',   x: 2511, y: 1690, importance: 'major',   description: '东海商港，海贸重镇。',                                 neighbors: ['hangzhou_city', 'fuzhou_city'] },
  { id: 'fuzhou_city',     name: '福州',    provinceId: '福建',   x: 2437, y: 1885, importance: 'capital', description: '八闽首府，东南海疆重地。',                             neighbors: ['hangzhou_city', 'ningbo_city', 'nanchang_city'] },
  { id: 'quanzhou_city',   name: '泉州',    provinceId: '福建',   x: 2412, y: 1950, importance: 'major',   description: '海上丝路起点，番商云集之地。',                         neighbors: ['fuzhou_city'] },
  { id: 'nanchang_city',   name: '南昌',    provinceId: '江西',   x: 2215, y: 1755, importance: 'capital', description: '豫章故郡，洪都新府，赣江流域中心。',                   neighbors: ['hangzhou_city', 'fuzhou_city', 'wuchang_city', 'changsha_city', 'guangzhou_city'] },
  { id: 'jingdezhen_city', name: '景德镇',  provinceId: '江西',   x: 2314, y: 1690, importance: 'normal',  description: '瓷都，天下窑器之冠。',                                 neighbors: ['nanchang_city', 'hangzhou_city'] },
  { id: 'wuchang_city',    name: '武昌',    provinceId: '湖广',   x: 2166, y: 1593, importance: 'capital', description: '九省通衢，长江锁钥，兵家必争之地。',                   neighbors: ['kaifeng_city', 'nanchang_city', 'changsha_city', 'chongqing_city', 'hefei_city'] },
  { id: 'changsha_city',   name: '长沙',    provinceId: '湖广',   x: 2068, y: 1755, importance: 'major',   description: '湘楚故都，楚汉文化发源地。',                           neighbors: ['wuchang_city', 'nanchang_city', 'guangzhou_city', 'guilin_city', 'guiyang_city'] },
  { id: 'guangzhou_city',  name: '广州',    provinceId: '广东',   x: 2068, y: 2080, importance: 'capital', description: '岭南都会，海上丝路起点，商贸最盛之地。',                neighbors: ['nanchang_city', 'changsha_city', 'guilin_city'] },
  { id: 'chaozhou_city',   name: '潮州',    provinceId: '广东',   x: 2265, y: 2048, importance: 'normal',  description: '潮汕重镇，海贸繁盛。',                                 neighbors: ['guangzhou_city', 'fuzhou_city'] },
  { id: 'guilin_city',     name: '桂林',    provinceId: '广西',   x: 1895, y: 1950, importance: 'capital', description: '桂林山水，西南门户重镇。',                             neighbors: ['changsha_city', 'guangzhou_city', 'guiyang_city', 'kunming_city'] },
  { id: 'nanning_city',    name: '南宁',    provinceId: '广西',   x: 1772, y: 2080, importance: 'major',   description: '邕州古城，广西腹地，西南要冲。',                       neighbors: ['guilin_city', 'kunming_city'] },
  { id: 'chengdu_city',    name: '成都',    provinceId: '四川',   x: 1723, y: 1593, importance: 'capital', description: '天府之国核心，扬一益二之"益"，物产丰饶。',             neighbors: ['xian_city', 'chongqing_city', 'guiyang_city', 'kunming_city'] },
  { id: 'chongqing_city',  name: '重庆',    provinceId: '四川',   x: 1871, y: 1625, importance: 'major',   description: '山城要塞，长江三峡门户，西南商都。',                   neighbors: ['chengdu_city', 'wuchang_city', 'guiyang_city'] },
  { id: 'guiyang_city',    name: '贵阳',    provinceId: '贵州',   x: 1822, y: 1820, importance: 'capital', description: '黔中要地，西南通衢。',                                 neighbors: ['chongqing_city', 'changsha_city', 'guilin_city', 'kunming_city'] },
  { id: 'kunming_city',    name: '昆明',    provinceId: '云南',   x: 1649, y: 1885, importance: 'capital', description: '彩云之南，茶马古道枢纽，百族聚居之地。',               neighbors: ['chengdu_city', 'guiyang_city', 'guilin_city', 'nanning_city'] },
  { id: 'dali_city',       name: '大理',    provinceId: '云南',   x: 1526, y: 1885, importance: 'major',   description: '苍山洱海，南诏故都，西南商道要冲。',                   neighbors: ['kunming_city'] },
  { id: 'shenyang_city',   name: '沈阳',    provinceId: '辽东',   x: 2658, y: 910,  importance: 'capital', description: '辽东重镇，东北边疆门户。',                             neighbors: ['beijing_city', 'datong_city'] },
  { id: 'liaoyang_city',   name: '辽阳',    provinceId: '辽东',   x: 2706, y: 942,  importance: 'major',   description: '辽东都司驻地，东北军事中心。',                         neighbors: ['shenyang_city'] },
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
