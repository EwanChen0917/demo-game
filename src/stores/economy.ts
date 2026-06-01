import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { useFamilyStore } from './family'
import { OFFICIAL_RANKS, MILITARY_RANKS } from '@/data/officials'

export interface Asset {
  id: string
  type: '农庄' | '商铺' | '房产'
  name: string
  income: number
}

export const useEconomyStore = defineStore('economy', () => {
  const assets = reactive<Asset[]>([])

  const treasury = reactive({
    gold: 0,
    grain: 0,
  })

  function assetIncome(): number {
    return assets.reduce((sum, a) => sum + a.income, 0)
  }

  function salaryIncome(): number {
    const familyStore = useFamilyStore()
    const allRanks = [...OFFICIAL_RANKS, ...MILITARY_RANKS]
    return familyStore.family.members.reduce((sum, m) => {
      if (!m.officialId) return sum
      const rank = allRanks.find((r) => r.id === m.officialId)
      return sum + (rank?.monthlySalary ?? 0)
    }, 0)
  }

  function settleSeason() {
    const income = assetIncome() + salaryIncome()
    treasury.gold += income
    const familyStore = useFamilyStore()
    familyStore.family.wealth += income
  }

  return {
    assets,
    treasury,
    assetIncome,
    salaryIncome,
    settleSeason,
  }
})
