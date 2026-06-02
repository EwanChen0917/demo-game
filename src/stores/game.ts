import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useFamilyStore } from './family'
import { useEconomyStore } from './economy'
import { EVENTS, type GameEvent } from '@/data/events'

export const useGameStore = defineStore('game', () => {
  const year = ref(1)
  const season = ref<'春' | '夏' | '秋' | '冬'>('春')
  const started = ref(false)

  const homeRegionId = ref<string | null>(null)
  const controlledRegionIds = ref<string[]>([])

  const selectedTile = reactive({ x: -1, y: -1 })
  const pendingEvents = ref<GameEvent[]>([])
  const eventCooldowns = reactive<Record<string, number>>({})

  function startGame(regionId: string) {
    homeRegionId.value = regionId
    controlledRegionIds.value = [regionId]
    started.value = true
  }

  function buildEventContext() {
    return {
      family: useFamilyStore(),
      economy: useEconomyStore(),
      game: useGameStore(),
    }
  }

  function drawEvents() {
    const ctx = buildEventContext()
    const eligible = EVENTS.filter((e) => {
      if (eventCooldowns[e.id] > 0) return false
      return !e.condition || e.condition(ctx)
    })

    Object.keys(eventCooldowns).forEach((id) => {
      if (eventCooldowns[id] > 0) eventCooldowns[id]--
    })

    const roll = Math.random()
    const count = roll < 0.25 ? 0 : roll < 0.75 ? 1 : 2

    const drawn: GameEvent[] = []
    const usedIds = new Set<string>()
    const totalWeight = eligible.reduce((s, e) => s + e.weight, 0)

    for (let i = 0; i < count; i++) {
      if (eligible.length === 0) break
      let r = Math.random() * totalWeight
      for (const evt of eligible) {
        if (usedIds.has(evt.id)) continue
        r -= evt.weight
        if (r <= 0) {
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
    eventCooldowns[eventId] = evt.cooldownSeasons ?? 8
    pendingEvents.value = pendingEvents.value.filter((e) => e.id !== eventId)
  }

  function advanceSeason() {
    if (!started.value) return
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
    started,
    homeRegionId,
    controlledRegionIds,
    selectedTile,
    pendingEvents,
    startGame,
    advanceSeason,
    resolveEvent,
    selectTile,
  }
})
