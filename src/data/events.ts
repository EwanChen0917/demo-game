export interface GameEvent {
  id: string
  title: string
  description: string
  condition: (state: any) => boolean
  choices: {
    label: string
    effect: string
  }[]
}

export const EVENTS: GameEvent[] = [
  {
    id: 'evt_scholar_visit',
    title: '名士来访',
    description: '一位饱学之士路过此地，听闻你家名声，前来拜访。',
    condition: () => true,
    choices: [
      { label: '盛情款待，求教学问', effect: 'family.reputation += 10' },
      { label: '以礼相待，赠银送别', effect: 'family.wealth -= 50' },
    ],
  },
  {
    id: 'evt_famine_relief',
    title: '饥荒赈济',
    description: '今年收成欠佳，流民涌入城中。官府号召各家捐粮赈灾。',
    condition: () => true,
    choices: [
      { label: '开仓放粮，救济百姓', effect: 'family.reputation += 20, family.wealth -= 200' },
      { label: '闭门不出，明哲保身', effect: 'family.reputation -= 10' },
    ],
  },
  {
    id: 'evt_wedding_proposal',
    title: '提亲',
    description: '城里李家派人前来，欲与你家结为亲家。',
    condition: () => true,
    choices: [
      { label: '答应这门亲事', effect: 'diplomacy.house_Li.favor += 30' },
      { label: '婉言谢绝', effect: 'diplomacy.house_Li.favor -= 10' },
    ],
  },
]
