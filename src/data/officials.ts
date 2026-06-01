export interface OfficialRank {
  id: string
  name: string
  pin: number           // 品级 1-9，1最高
  type: '文' | '武'
  monthlySalary: number
  description: string
}

export const OFFICIAL_RANKS: OfficialRank[] = [
  { id: 'rank_1', name: '正一品', pin: 1, type: '文', monthlySalary: 200, description: '太师、太傅、太保' },
  { id: 'rank_2', name: '从一品', pin: 1, type: '文', monthlySalary: 180, description: '少师、少傅、少保' },
  { id: 'rank_3', name: '正二品', pin: 2, type: '文', monthlySalary: 160, description: '太子少师、尚书' },
  { id: 'rank_4', name: '从二品', pin: 2, type: '文', monthlySalary: 140, description: '侍郎、学士' },
  { id: 'rank_5', name: '正三品', pin: 3, type: '文', monthlySalary: 120, description: '都御史、通政使' },
  { id: 'rank_6', name: '从三品', pin: 3, type: '文', monthlySalary: 100, description: '光禄寺卿、太仆寺卿' },
  { id: 'rank_7', name: '正四品', pin: 4, type: '文', monthlySalary: 80, description: '佥都御史、大理寺少卿' },
  { id: 'rank_8', name: '从四品', pin: 4, type: '文', monthlySalary: 70, description: '祭酒、参议' },
  { id: 'rank_9', name: '正五品', pin: 5, type: '文', monthlySalary: 60, description: '郎中、知府' },
  { id: 'rank_10', name: '从五品', pin: 5, type: '文', monthlySalary: 50, description: '员外郎、知州' },
  { id: 'rank_11', name: '正六品', pin: 6, type: '文', monthlySalary: 40, description: '主事、通判' },
  { id: 'rank_12', name: '从六品', pin: 6, type: '文', monthlySalary: 35, description: '修撰、州同' },
  { id: 'rank_13', name: '正七品', pin: 7, type: '文', monthlySalary: 30, description: '知县、编修' },
  { id: 'rank_14', name: '从七品', pin: 7, type: '文', monthlySalary: 25, description: '检讨、给事中' },
  { id: 'rank_15', name: '正八品', pin: 8, type: '文', monthlySalary: 20, description: '县丞、博士' },
  { id: 'rank_16', name: '从八品', pin: 8, type: '文', monthlySalary: 15, description: '典簿、助教' },
  { id: 'rank_17', name: '正九品', pin: 9, type: '文', monthlySalary: 10, description: '主簿、典史' },
  { id: 'rank_18', name: '从九品', pin: 9, type: '文', monthlySalary: 8, description: '巡检、驿丞' },
]

export const MILITARY_RANKS: OfficialRank[] = [
  { id: 'mil_1', name: '正一品', pin: 1, type: '武', monthlySalary: 200, description: '大将军' },
  { id: 'mil_2', name: '从一品', pin: 1, type: '武', monthlySalary: 180, description: '骠骑将军' },
  { id: 'mil_3', name: '正二品', pin: 2, type: '武', monthlySalary: 160, description: '辅国将军' },
  { id: 'mil_4', name: '从二品', pin: 2, type: '武', monthlySalary: 140, description: '镇军将军' },
  { id: 'mil_5', name: '正三品', pin: 3, type: '武', monthlySalary: 120, description: '中领军' },
  { id: 'mil_6', name: '从三品', pin: 3, type: '武', monthlySalary: 100, description: '护军' },
  { id: 'mil_7', name: '正四品', pin: 4, type: '武', monthlySalary: 80, description: '校尉' },
  { id: 'mil_8', name: '从四品', pin: 4, type: '武', monthlySalary: 70, description: '都尉' },
  { id: 'mil_9', name: '正五品', pin: 5, type: '武', monthlySalary: 60, description: '骑都尉' },
  { id: 'mil_10', name: '从五品', pin: 5, type: '武', monthlySalary: 50, description: '鹰扬尉' },
  { id: 'mil_11', name: '正六品', pin: 6, type: '武', monthlySalary: 40, description: '宣威尉' },
  { id: 'mil_12', name: '从六品', pin: 6, type: '武', monthlySalary: 35, description: '振威校尉' },
  { id: 'mil_13', name: '正七品', pin: 7, type: '武', monthlySalary: 30, description: '致果校尉' },
  { id: 'mil_14', name: '从七品', pin: 7, type: '武', monthlySalary: 25, description: '翊麾校尉' },
  { id: 'mil_15', name: '正八品', pin: 8, type: '武', monthlySalary: 20, description: '宣节校尉' },
  { id: 'mil_16', name: '从八品', pin: 8, type: '武', monthlySalary: 15, description: '御侮校尉' },
  { id: 'mil_17', name: '正九品', pin: 9, type: '武', monthlySalary: 10, description: '仁勇校尉' },
  { id: 'mil_18', name: '从九品', pin: 9, type: '武', monthlySalary: 8, description: '陪戎校尉' },
]
