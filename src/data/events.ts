import type { useFamilyStore } from '@/stores/family'
import type { useEconomyStore } from '@/stores/economy'
import type { useGameStore } from '@/stores/game'

export interface EventContext {
  family: ReturnType<typeof useFamilyStore>
  economy: ReturnType<typeof useEconomyStore>
  game: ReturnType<typeof useGameStore>
}

export interface EventChoice {
  label: string
  apply: (ctx: EventContext) => void
  preview?: string
}

export interface GameEvent {
  id: string
  category: '家族内务' | '经济' | '社会' | '科举机缘'
  title: string
  description: string
  condition?: (ctx: EventContext) => boolean
  weight: number
  choices: EventChoice[]
}

export const EVENTS: GameEvent[] = [

  {
    id: 'evt_scholar_visit',
    category: '社会',
    title: '名士来访',
    description: '一位饱学之士路过此地，听闻你家名声，登门拜访。此人学识渊博，与之深谈或可大有裨益。',
    weight: 10,
    choices: [
      {
        label: '盛情款待，虚心求教',
        preview: '声望 +12，随机一名族人文才 +5',
        apply: (ctx) => {
          ctx.family.family.reputation += 12
          const member = ctx.family.family.members.filter((m) => m.alive && m.isClanMember)[0]
          if (member) member.wenCai = Math.min(100, member.wenCai + 5)
        },
      },
      {
        label: '以礼相待，赠银送别',
        preview: '财富 -80，声望 +5',
        apply: (ctx) => {
          ctx.family.family.wealth -= 80
          ctx.family.family.reputation += 5
        },
      },
      {
        label: '婉言谢绝，闭门不出',
        preview: '无影响',
        apply: () => {},
      },
    ],
  },

  {
    id: 'evt_famine_relief',
    category: '社会',
    title: '饥荒赈济',
    description: '今年收成欠佳，流民涌入城中。官府号召各家大户捐粮赈灾，城中百姓翘首以盼。',
    weight: 8,
    choices: [
      {
        label: '开仓放粮，慷慨赈济',
        preview: '财富 -300，声望 +25',
        apply: (ctx) => {
          ctx.family.family.wealth -= 300
          ctx.family.family.reputation += 25
        },
      },
      {
        label: '象征性捐助，应付场面',
        preview: '财富 -80，声望 +5',
        apply: (ctx) => {
          ctx.family.family.wealth -= 80
          ctx.family.family.reputation += 5
        },
      },
      {
        label: '闭门不出，明哲保身',
        preview: '声望 -15',
        apply: (ctx) => {
          ctx.family.family.reputation -= 15
        },
      },
    ],
  },

  {
    id: 'evt_fire',
    category: '经济',
    title: '宅院失火',
    description: '深夜走水，宅院东厢遭受火灾。所幸家人无恙，但财物损失惨重。',
    weight: 6,
    choices: [
      {
        label: '立即重建，修缮如初',
        preview: '财富 -500',
        apply: (ctx) => { ctx.family.family.wealth -= 500 },
      },
      {
        label: '简单修缮，将就使用',
        preview: '财富 -150，声望 -5',
        apply: (ctx) => {
          ctx.family.family.wealth -= 150
          ctx.family.family.reputation -= 5
        },
      },
    ],
  },

  {
    id: 'evt_merchant_windfall',
    category: '经济',
    title: '商队大捷',
    description: '家族商队此行运气极佳，在外地以低价购入稀缺货物，高价出售，获利颇丰。',
    weight: 9,
    choices: [
      {
        label: '收入囊中',
        preview: '财富 +600',
        apply: (ctx) => { ctx.family.family.wealth += 600 },
      },
      {
        label: '犒赏商队，鼓励士气',
        preview: '财富 +400，声望 +8',
        apply: (ctx) => {
          ctx.family.family.wealth += 400
          ctx.family.family.reputation += 8
        },
      },
    ],
  },

  {
    id: 'evt_tax_demand',
    category: '经济',
    title: '官府加税',
    description: '新任知府为充军饷，下令辖区各家按资产额外缴纳赋税，态度强硬，不容推脱。',
    weight: 7,
    choices: [
      {
        label: '如数缴纳，息事宁人',
        preview: '财富 -400',
        apply: (ctx) => { ctx.family.family.wealth -= 400 },
      },
      {
        label: '托人打点，少缴一些',
        preview: '财富 -200，声望 -8',
        apply: (ctx) => {
          ctx.family.family.wealth -= 200
          ctx.family.family.reputation -= 8
        },
      },
    ],
  },

  {
    id: 'evt_harvest_boom',
    category: '经济',
    title: '风调雨顺',
    description: '今年天公作美，家族农庄粮食大丰收，仓廪充实，家丁欢呼雀跃。',
    weight: 10,
    choices: [
      {
        label: '存粮备荒',
        preview: '财富 +250',
        apply: (ctx) => { ctx.family.family.wealth += 250 },
      },
      {
        label: '出售余粮，趁价高变现',
        preview: '财富 +400，声望 +5',
        apply: (ctx) => {
          ctx.family.family.wealth += 400
          ctx.family.family.reputation += 5
        },
      },
    ],
  },

  {
    id: 'evt_clan_dispute',
    category: '家族内务',
    title: '族人争产',
    description: '族中两房为祖产分配起了争执，双方僵持不下，纷纷来找族长做主。',
    weight: 7,
    choices: [
      {
        label: '秉公裁决，按规矩来',
        preview: '声望 +10',
        apply: (ctx) => { ctx.family.family.reputation += 10 },
      },
      {
        label: '各打五十大板，息事宁人',
        preview: '无明显影响',
        apply: () => {},
      },
      {
        label: '偏袒一方，谋取好处',
        preview: '财富 +200，声望 -12',
        apply: (ctx) => {
          ctx.family.family.wealth += 200
          ctx.family.family.reputation -= 12
        },
      },
    ],
  },

  {
    id: 'evt_prodigy_born',
    category: '家族内务',
    title: '天资少年',
    description: '族中一名少年近日读书过目不忘，诗文出众，街坊四邻皆称其为神童，前途不可限量。',
    weight: 5,
    condition: (ctx) => ctx.family.family.members.some((m) => m.alive && m.age < 15 && m.wenCai >= 65),
    choices: [
      {
        label: '重金延请名师',
        preview: '财富 -200，该族人文才 +10',
        apply: (ctx) => {
          ctx.family.family.wealth -= 200
          const prodigy = ctx.family.family.members.find((m) => m.alive && m.age < 15 && m.wenCai >= 65)
          if (prodigy) prodigy.wenCai = Math.min(100, prodigy.wenCai + 10)
        },
      },
      {
        label: '顺其自然，静待成才',
        preview: '无影响',
        apply: () => {},
      },
    ],
  },

  {
    id: 'evt_illness',
    category: '家族内务',
    title: '族人染疾',
    description: '家中一名族人近日染上时疫，高烧不退，需延医问药，否则恐有性命之忧。',
    weight: 8,
    condition: (ctx) => ctx.family.family.members.some((m) => m.alive),
    choices: [
      {
        label: '重金求医，全力救治',
        preview: '财富 -300，该族人寿命 +5年',
        apply: (ctx) => {
          ctx.family.family.wealth -= 300
          const sick = ctx.family.family.members.find((m) => m.alive && m.isClanMember)
          if (sick) sick.lifespan += 5
        },
      },
      {
        label: '请郎中把脉，简单诊治',
        preview: '财富 -80',
        apply: (ctx) => { ctx.family.family.wealth -= 80 },
      },
    ],
  },

  {
    id: 'evt_martial_contest',
    category: '社会',
    title: '擂台比武',
    description: '城中举办武术擂台，各路好手云集。有人前来邀请家族武艺出众的族人参赛。',
    weight: 7,
    condition: (ctx) => ctx.family.family.members.some((m) => m.alive && m.wuLi >= 55),
    choices: [
      {
        label: '踊跃参赛，一展身手',
        preview: '财富 +200，声望 +15（赢）或声望 -5（输）',
        apply: (ctx) => {
          const fighter = ctx.family.family.members.find((m) => m.alive && m.wuLi >= 55)
          if (!fighter) return
          const win = Math.random() * 100 < 40 + (fighter.wuLi - 55) * 1.5
          if (win) {
            ctx.family.family.wealth += 200
            ctx.family.family.reputation += 15
          } else {
            ctx.family.family.reputation -= 5
          }
        },
      },
      {
        label: '婉言谢绝，不必冒险',
        preview: '无影响',
        apply: () => {},
      },
    ],
  },

  {
    id: 'evt_exam_tip',
    category: '科举机缘',
    title: '夫子举荐',
    description: '城中一位德高望重的老夫子听闻家中有学子备考科举，主动登门，愿意亲自指点文章。',
    weight: 8,
    condition: (ctx) => ctx.family.family.members.some((m) => m.alive && m.age >= 15 && m.examStage !== '状元'),
    choices: [
      {
        label: '虚心求教，日夜苦读',
        preview: '财富 -100，学子文才 +8',
        apply: (ctx) => {
          ctx.family.family.wealth -= 100
          const student = ctx.family.family.members.find(
            (m) => m.alive && m.age >= 15 && m.examStage !== '状元',
          )
          if (student) student.wenCai = Math.min(100, student.wenCai + 8)
        },
      },
      {
        label: '礼貌接待，不做额外安排',
        preview: '声望 +5',
        apply: (ctx) => { ctx.family.family.reputation += 5 },
      },
    ],
  },

  {
    id: 'evt_lucky_dream',
    category: '科举机缘',
    title: '梦授天书',
    description: '家中一名备考学子昨夜梦见一位白发仙翁，授以锦囊妙计，醒来后文思泉涌，奋笔疾书。',
    weight: 4,
    condition: (ctx) => ctx.family.family.members.some((m) => m.alive && m.examStage !== '状元' && m.luck >= 60),
    choices: [
      {
        label: '顺势而为，趁热打铁',
        preview: '学子运气 +10，文才 +5',
        apply: (ctx) => {
          const student = ctx.family.family.members.find(
            (m) => m.alive && m.examStage !== '状元' && m.luck >= 60,
          )
          if (student) {
            student.luck = Math.min(100, student.luck + 10)
            student.wenCai = Math.min(100, student.wenCai + 5)
          }
        },
      },
      {
        label: '不过是南柯一梦',
        preview: '无影响',
        apply: () => {},
      },
    ],
  },

  {
    id: 'evt_donation_request',
    category: '社会',
    title: '修桥募捐',
    description: '乡里老桥年久失修，热心乡绅发起募捐，希望各家大户慷慨解囊，方便来往行人。',
    weight: 9,
    choices: [
      {
        label: '大力捐助，带头示范',
        preview: '财富 -400，声望 +20',
        apply: (ctx) => {
          ctx.family.family.wealth -= 400
          ctx.family.family.reputation += 20
        },
      },
      {
        label: '量力而行，小额捐助',
        preview: '财富 -100，声望 +6',
        apply: (ctx) => {
          ctx.family.family.wealth -= 100
          ctx.family.family.reputation += 6
        },
      },
      {
        label: '借故推辞，不予捐助',
        preview: '声望 -8',
        apply: (ctx) => { ctx.family.family.reputation -= 8 },
      },
    ],
  },

  {
    id: 'evt_wandering_doctor',
    category: '家族内务',
    title: '游医登门',
    description: '一位游方郎中路过此地，声称擅长养生之道，可为族人调理体质，延年益寿。',
    weight: 6,
    choices: [
      {
        label: '请其为年长族人诊治',
        preview: '财富 -150，最年长族人寿命 +8年',
        apply: (ctx) => {
          ctx.family.family.wealth -= 150
          const eldest = [...ctx.family.family.members]
            .filter((m) => m.alive)
            .sort((a, b) => b.age - a.age)[0]
          if (eldest) eldest.lifespan += 8
        },
      },
      {
        label: '婉言谢绝，恐是江湖骗术',
        preview: '无影响',
        apply: () => {},
      },
    ],
  },

  {
    id: 'evt_lucky_star',
    category: '社会',
    title: '贵人相助',
    description: '家族在城中口碑颇佳，一位在朝官员念及旧情，托人捎来一笔银两，聊表心意。',
    weight: 5,
    condition: (ctx) => ctx.family.family.reputation >= 60,
    choices: [
      {
        label: '感激收下',
        preview: '财富 +500',
        apply: (ctx) => { ctx.family.family.wealth += 500 },
      },
      {
        label: '婉拒馈赠，保持清白',
        preview: '声望 +15',
        apply: (ctx) => { ctx.family.family.reputation += 15 },
      },
    ],
  },
]
