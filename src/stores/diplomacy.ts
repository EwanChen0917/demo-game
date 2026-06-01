import { defineStore } from 'pinia'
import { reactive } from 'vue'

export interface NobleHouse {
  id: string
  name: string
  favor: number
  power: number
}

export const useDiplomacyStore = defineStore('diplomacy', () => {
  const houses = reactive<NobleHouse[]>([])

  const relations = reactive<Record<string, number>>({})

  function generateHouses(count: number) {
    const surnames = ['王', '李', '张', '赵', '刘', '杨', '周', '吴']
    for (let i = 0; i < count; i++) {
      const id = `house_${i}`
      houses.push({
        id,
        name: `${surnames[i % surnames.length]}氏`,
        favor: 50,
        power: Math.floor(Math.random() * 50) + 30,
      })
    }
  }

  return {
    houses,
    relations,
    generateHouses,
  }
})
