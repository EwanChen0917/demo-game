import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useFamilyStore } from './family'
import { useEconomyStore } from './economy'

export const useGameStore = defineStore('game', () => {
  const year = ref(1)
  const season = ref<'春' | '夏' | '秋' | '冬'>('春')

  const selectedTile = reactive({
    x: -1,
    y: -1,
  })

  function advanceSeason() {
    const seasons: ('春' | '夏' | '秋' | '冬')[] = ['春', '夏', '秋', '冬']
    const idx = seasons.indexOf(season.value)
    const familyStore = useFamilyStore()
    const economyStore = useEconomyStore()
    familyStore.onNewSeason()
    economyStore.settleSeason()
    if (idx === 3) {
      season.value = '春'
      year.value++
      familyStore.onNewYear()
    } else {
      season.value = seasons[idx + 1]
    }
  }

  function selectTile(col: number, row: number) {
    selectedTile.x = col
    selectedTile.y = row
  }

  return {
    year,
    season,
    selectedTile,
    advanceSeason,
    selectTile,
  }
})
