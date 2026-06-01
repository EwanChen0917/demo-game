import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useFamilyStore } from './family'
import { useEconomyStore } from './economy'
import { EVENTS, type GameEvent } from '@/data/events'

export const useGameStore = defineStore('game', () => {
  const year = ref(1)
  const season = ref<'春' | '夏' | '秋' | '冬'>('春')

  const selectedTile = reactive({
    x: -1,
    y: -1,
  })

  const pendingEvents = ref<GameEvent[]>([])

  function buildEventContext() {
    return {
      family: useFamilyStore(),
      economy: useEconomyStore(),
      game: useGameStore(),
    }
  }

  function drawEvents() {
    const ctx = buildEventContext()
    const eligible = EVENTS.filter((e) => !e.condition || e.condition(ctx))
    const totalWeight = eligible.reduce((s, e) => s + e.weight, 0)
    const count = Math.random() < 0.6 ? 1 : Math.random() < 0.7 ? 2 : 0
    const drawn: GameEvent[] = []
    const usedIds = new Set<string>()
    for (let i = 0; i < count; i++) {
      let roll = Math.random() * totalWeight
      for (const evt of eligible) {
        if (usedIds.has(evt.id)) continue
        roll -= evt.weight
        if (roll <= 0) {
          drawn.push(evt)
          usedIds.add(evt.id)
          break
        }
      }
    }
    pendingEvents.value = drawn
  }

  function resolveEvent(eventId: string, choiceIndex: number) {
    const evt = pendingEvents.value.find((e) => e.id === eventId)
    if (!evt) return
    const choice = evt.choices[choiceIndex]
    if (!choice) return
    choice.apply(buildEventContext())
    pendingEvents.value = pendingEvents.value.filter((e) => e.id !== eventId)
  }

  function advanceSeason() {
    const seasons: ('春' | '夏' | '秋' | '冬')[] = ['春', '夏', '秋', '冬']
    const idx = seasons.indexOf(season.value)
    const familyStore = useFamilyStore()
    const economyStore = useEconomyStore()
    familyStore.onNewSeason()
    economyStore.settleSeason()
    drawEvents()
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
    pendingEvents,
    advanceSeason,
    resolveEvent,
    selectTile,
  }
})
