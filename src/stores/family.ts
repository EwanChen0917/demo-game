import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export interface FamilyMember {
  id: string
  name: string
  generation: number
  age: number
  lifespan: number
  gender: '男' | '女'
  wenCai: number
  wuLi: number
  luck: number
  alive: boolean
  isClanMember: boolean
  fatherId: string | null
  motherId: string | null
  spouseIds: string[]
  childrenIds: string[]
  officialId: string | null
  examStage: ExamStage
  examCooldown: number
  pregnancySeasons: number
}

export type ExamStage = '未参考' | '童生' | '秀才' | '举人' | '进士' | '状元'

export const EXAM_STAGES: ExamStage[] = ['未参考', '童生', '秀才', '举人', '进士', '状元']

export const EXAM_STAGE_RANK: Record<ExamStage, string | null> = {
  未参考: null,
  童生: null,
  秀才: null,
  举人: null,
  进士: 'rank_13',
  状元: 'rank_9',
}

export interface ExamResult {
  success: boolean
  newStage: ExamStage
  message: string
}

export interface SeasonEvent {
  type: 'birth' | 'death' | 'chieftain'
  message: string
}

const MALE_NAMES = ['伯远', '仲昌', '叔明', '季安', '文翰', '武骏', '弘毅', '承志', '怀仁', '正德']
const FEMALE_NAMES = ['如云', '芳华', '婉清', '秀兰', '玉莲', '琴心', '书语', '诗韵', '慧娴', '雅静']
const SPOUSE_SURNAMES = ['李', '王', '张', '赵', '刘', '孙', '周', '吴', '郑', '冯']

export const useFamilyStore = defineStore('family', () => {
  const family = reactive({
    name: '陈' as string,
    wealth: 10000,
    reputation: 50,
    members: [] as FamilyMember[],
  })

  const chieftainId = ref<string | null>(null)
  const needsChieftainSelection = ref(false)
  const seasonEvents = reactive<SeasonEvent[]>([])

  let charCount = 0
  function generateId(): string {
    return `char_${++charCount}`
  }

  function randomLifespan(): number {
    return 55 + Math.floor(Math.random() * 30)
  }

  function inheritAttr(a: number, b: number): number {
    const base = Math.round((a + b) / 2)
    const delta = Math.floor(Math.random() * 21) - 10
    return Math.min(100, Math.max(10, base + delta))
  }

  function makeMember(
    overrides: Partial<FamilyMember> & Pick<FamilyMember, 'id' | 'name' | 'gender' | 'generation'>,
  ): FamilyMember {
    return {
      age: 0,
      lifespan: randomLifespan(),
      wenCai: 40 + Math.floor(Math.random() * 30),
      wuLi: 40 + Math.floor(Math.random() * 30),
      luck: 20 + Math.floor(Math.random() * 60),
      alive: true,
      isClanMember: true,
      fatherId: null,
      motherId: null,
      spouseIds: [],
      childrenIds: [],
      officialId: null,
      examStage: '未参考',
      examCooldown: 0,
      pregnancySeasons: -1,
      ...overrides,
    }
  }

  function addInitialMembers() {
    const father = makeMember({
      id: generateId(),
      name: '陈伯远',
      gender: '男',
      generation: 1,
      age: 28,
      lifespan: 72,
      wenCai: 65,
      wuLi: 45,
      luck: 50,
      isClanMember: true,
    })
    const mother = makeMember({
      id: generateId(),
      name: SPOUSE_SURNAMES[Math.floor(Math.random() * SPOUSE_SURNAMES.length)] + FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)],
      gender: '女',
      generation: 1,
      age: 26,
      lifespan: 68,
      wenCai: 55,
      wuLi: 30,
      luck: 60,
      isClanMember: false,
      spouseIds: [father.id],
    })
    father.spouseIds.push(mother.id)
    family.members.push(father, mother)
    chieftainId.value = father.id
  }
  addInitialMembers()

  function chieftain(): FamilyMember | null {
    return family.members.find((m) => m.id === chieftainId.value && m.alive) ?? null
  }

  function chieftainBonus(): { wenCai: number; wuLi: number } {
    const c = chieftain()
    if (!c) return { wenCai: 0, wuLi: 0 }
    return {
      wenCai: Math.floor(c.wenCai * 0.05),
      wuLi: Math.floor(c.wuLi * 0.05),
    }
  }

  function eligibleChieftains(): FamilyMember[] {
    return family.members.filter(
      (m) => m.alive && m.isClanMember && m.age >= 16,
    )
  }

  function setChieftain(memberId: string) {
    const m = family.members.find((x) => x.id === memberId)
    if (!m || !m.alive || !m.isClanMember || m.age < 16) return
    chieftainId.value = memberId
    needsChieftainSelection.value = false
    seasonEvents.push({ type: 'chieftain', message: `${m.name} 被推举为新任族长，望再创家族荣光。` })
  }

  function onNewYear() {
    family.members.forEach((m) => {
      if (!m.alive) return
      m.age++
      if (m.examCooldown > 0) m.examCooldown--
      if (m.age >= m.lifespan) {
        m.alive = false
        m.officialId = null
        const isChieftain = chieftainId.value === m.id
        seasonEvents.push({ type: 'death', message: `${m.name} 享年 ${m.age} 岁，溘然长逝。` })
        if (isChieftain) {
          chieftainId.value = null
          needsChieftainSelection.value = true
          seasonEvents.push({ type: 'chieftain', message: `族长 ${m.name} 已故，请指定新任族长。` })
        }
      }
    })
    family.reputation = Math.max(0, family.reputation - 2)
  }

  function onNewSeason() {
    seasonEvents.splice(0)
    family.members.forEach((m) => {
      if (!m.alive || m.gender !== '女') return
      if (m.age < 16 || m.age > 45) return
      if (m.spouseIds.length === 0) return
      const husband = family.members.find((x) => m.spouseIds.includes(x.id) && x.alive)
      if (!husband) return

      if (m.pregnancySeasons === -1) {
        const chance = 0.25 + (m.luck - 50) * 0.003
        if (Math.random() < chance) {
          m.pregnancySeasons = 3
        }
      } else if (m.pregnancySeasons > 0) {
        m.pregnancySeasons--
        if (m.pregnancySeasons === 0) {
          giveBirth(m, husband)
          m.pregnancySeasons = -1
        }
      }
    })
  }

  function giveBirth(mother: FamilyMember, father: FamilyMember) {
    const gender: '男' | '女' = Math.random() < 0.5 ? '男' : '女'
    const namePool = gender === '男' ? MALE_NAMES : FEMALE_NAMES
    const name = `${family.name}${namePool[Math.floor(Math.random() * namePool.length)]}`
    const child = makeMember({
      id: generateId(),
      name,
      gender,
      generation: Math.max(mother.generation, father.generation) + 1,
      age: 0,
      isClanMember: true,
      fatherId: father.id,
      motherId: mother.id,
      wenCai: inheritAttr(mother.wenCai, father.wenCai),
      wuLi: inheritAttr(mother.wuLi, father.wuLi),
      luck: 20 + Math.floor(Math.random() * 60),
    })
    mother.childrenIds.push(child.id)
    father.childrenIds.push(child.id)
    family.members.push(child)
    family.reputation += 3
    seasonEvents.push({ type: 'birth', message: `${mother.name} 诞下${gender === '男' ? '麟儿' : '千金'} ${name}，举家同庆！` })
  }

  function takeExam(memberId: string): ExamResult {
    const m = family.members.find((x) => x.id === memberId)
    if (!m) return { success: false, newStage: '未参考', message: '找不到该族人' }
    if (m.examCooldown > 0) return { success: false, newStage: m.examStage, message: `还需等待 ${m.examCooldown} 年` }
    if (m.age < 15) return { success: false, newStage: m.examStage, message: '年龄不足，无法参考' }

    const currentIdx = EXAM_STAGES.indexOf(m.examStage)
    if (currentIdx >= EXAM_STAGES.length - 1) {
      return { success: false, newStage: m.examStage, message: '已到达最高功名' }
    }

    const bonus = chieftainBonus()
    const passRate = calcPassRate(m, currentIdx, bonus.wenCai)
    if (Math.random() * 100 < passRate) {
      const newStage = EXAM_STAGES[currentIdx + 1]
      m.examStage = newStage
      m.examCooldown = 0
      const rankId = EXAM_STAGE_RANK[newStage]
      if (rankId) m.officialId = rankId
      family.reputation += 10 + (currentIdx + 1) * 5
      return { success: true, newStage, message: successMsg(newStage) }
    } else {
      m.examCooldown = currentIdx < 2 ? 1 : 3
      return { success: false, newStage: m.examStage, message: failMsg(m.examStage) }
    }
  }

  function calcPassRate(m: FamilyMember, stageIdx: number, chieftainWenBonus = 0): number {
    const base = [80, 60, 40, 25, 10][stageIdx] ?? 5
    const wenBonus = Math.floor((m.wenCai - 50) * 0.4)
    const luckBonus = Math.floor((m.luck - 50) * 0.2)
    return Math.min(95, Math.max(5, base + wenBonus + luckBonus + chieftainWenBonus))
  }

  function successMsg(stage: ExamStage): string {
    const msgs: Record<ExamStage, string> = {
      未参考: '',
      童生: '考中童生！迈出仕途第一步。',
      秀才: '高中秀才！乡里皆贺。',
      举人: '荣登举人！前途无量。',
      进士: '金榜题名，入朝为官！授正七品知县。',
      状元: '殿试夺魁，状元及第！授正五品知府。',
    }
    return msgs[stage]
  }

  function failMsg(currentStage: ExamStage): string {
    const msgs: Record<ExamStage, string> = {
      未参考: '名落孙山，继续苦读吧。',
      童生: '此次未能晋级，继续努力。',
      秀才: '乡试落榜，三年后再战。',
      举人: '会试未中，三年后再战。',
      进士: '殿试未入前列，三年后再战。',
      状元: '',
    }
    return msgs[currentStage]
  }

  return {
    family,
    chieftainId,
    needsChieftainSelection,
    seasonEvents,
    chieftain,
    chieftainBonus,
    eligibleChieftains,
    setChieftain,
    onNewYear,
    onNewSeason,
    takeExam,
  }
})

