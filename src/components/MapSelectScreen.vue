<template>
  <div class="select-overlay">
    <div class="select-panel">
      <div class="panel-header">
        <h1 class="title">大唐天下</h1>
        <p class="subtitle">选择你的家族起源之地</p>
      </div>

      <div class="map-area">
        <svg
          viewBox="200 150 450 300"
          class="map-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <g class="edges">
            <line
              v-for="(edge, i) in edges"
              :key="`e${i}`"
              :x1="edge.x1" :y1="edge.y1"
              :x2="edge.x2" :y2="edge.y2"
              class="edge-line"
            />
          </g>

          <g
            v-for="r in regions"
            :key="r.id"
            class="region-node"
            :class="{
              selected: hoveredId === r.id,
              capital: r.importance === 'capital',
              major: r.importance === 'major',
            }"
            :transform="`translate(${r.x}, ${r.y})`"
            @click="select(r)"
            @mouseenter="hoveredId = r.id"
            @mouseleave="hoveredId = null"
          >
            <circle
              :r="nodeRadius(r.importance)"
              :fill="daoColor(r.dao)"
              :fill-opacity="hoveredId === r.id ? 1 : 0.7"
              class="node-circle"
            />
            <text
              class="node-label"
              :y="nodeRadius(r.importance) + 9"
              text-anchor="middle"
            >{{ r.name }}</text>
          </g>
        </svg>

        <div class="map-legend">
          <div v-for="(color, dao) in DAO_COLORS" :key="dao" class="legend-item">
            <span class="legend-dot" :style="{ background: color }" />
            <span class="legend-name">{{ dao }}</span>
          </div>
        </div>
      </div>

      <div class="info-area">
        <template v-if="hovered">
          <div class="region-info">
            <div class="region-header">
              <span class="region-name">{{ hovered.name }}</span>
              <span class="region-dao">{{ hovered.dao }}</span>
              <span v-if="hovered.importance === 'capital'" class="tag-capital">都城</span>
              <span v-else-if="hovered.importance === 'major'" class="tag-major">重镇</span>
            </div>
            <p class="region-desc">{{ hovered.description }}</p>
            <button class="btn-confirm" @click="confirm">
              以 {{ hovered.name }} 为根基，开创家业
            </button>
          </div>
        </template>
        <template v-else>
          <p class="hint">悬停州城查看简介，点击选定出生地</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { TANG_REGIONS, DAO_COLORS, type TangRegion } from '@/data/map'
import { useGameStore } from '@/stores/game'
import { useFamilyStore } from '@/stores/family'

const emit = defineEmits<{ started: [] }>()

const gameStore = useGameStore()
const familyStore = useFamilyStore()

const regions = TANG_REGIONS
const hoveredId = ref<string | null>(null)

const hovered = computed(() =>
  hoveredId.value ? regions.find((r) => r.id === hoveredId.value) ?? null : null,
)

interface Edge { x1: number; y1: number; x2: number; y2: number }

const edges = computed<Edge[]>(() => {
  const seen = new Set<string>()
  const result: Edge[] = []
  regions.forEach((r) => {
    r.neighbors.forEach((nid) => {
      const key = [r.id, nid].sort().join('-')
      if (seen.has(key)) return
      seen.add(key)
      const neighbor = regions.find((x) => x.id === nid)
      if (!neighbor) return
      result.push({ x1: r.x, y1: r.y, x2: neighbor.x, y2: neighbor.y })
    })
  })
  return result
})

function nodeRadius(importance: TangRegion['importance']): number {
  if (importance === 'capital') return 9
  if (importance === 'major') return 7
  return 5
}

function daoColor(dao: string): string {
  return DAO_COLORS[dao] ?? '#888'
}

function select(r: TangRegion) {
  hoveredId.value = r.id
}

function confirm() {
  if (!hovered.value) return
  const region = hovered.value
  familyStore.family.name = region.name.slice(0, 1)
  gameStore.startGame(region.id)
  emit('started')
}
</script>

<style scoped>
.select-overlay {
  position: fixed;
  inset: 0;
  background: #080f1e;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
}

.select-panel {
  width: 95vw;
  max-width: 1100px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-header {
  text-align: center;
  padding-top: 16px;
}

.title {
  font-size: 32px;
  color: #f0d9b5;
  letter-spacing: 8px;
}

.subtitle {
  font-size: 14px;
  color: #8a7a6a;
  margin-top: 4px;
  letter-spacing: 2px;
}

.map-area {
  flex: 1;
  display: flex;
  gap: 12px;
  min-height: 0;
}

.map-svg {
  flex: 1;
  height: 100%;
  background: #0a1525;
  border: 1px solid #1a2a4a;
  border-radius: 6px;
}

.edge-line {
  stroke: #1a3a5a;
  stroke-width: 0.8;
}

.region-node {
  cursor: pointer;
}

.node-circle {
  stroke: #1a2a4a;
  stroke-width: 1;
  transition: fill-opacity 0.15s, r 0.15s;
}

.region-node.selected .node-circle {
  stroke: #f0d9b5;
  stroke-width: 2;
  filter: drop-shadow(0 0 4px rgba(240, 217, 181, 0.6));
}

.region-node.capital .node-circle {
  stroke: #f0c040;
  stroke-width: 1.5;
}

.node-label {
  font-size: 7px;
  fill: #c8b898;
  pointer-events: none;
}

.region-node.selected .node-label,
.region-node.capital .node-label {
  fill: #f0d9b5;
  font-size: 8px;
}

.map-legend {
  width: 100px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  background: #0a1525;
  border: 1px solid #1a2a4a;
  border-radius: 6px;
  align-self: flex-start;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-name {
  font-size: 11px;
  color: #8a9aba;
}

.info-area {
  height: 100px;
  padding: 0 8px;
  display: flex;
  align-items: center;
}

.region-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.region-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.region-name {
  font-size: 22px;
  color: #f0d9b5;
}

.region-dao {
  font-size: 13px;
  color: #8a9aba;
  padding: 1px 8px;
  background: #1a2a4a;
  border-radius: 10px;
}

.tag-capital {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 3px;
  background: #4a3a10;
  color: #f0c040;
}

.tag-major {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 3px;
  background: #1a3a2a;
  color: #6fdb7a;
}

.region-desc {
  font-size: 13px;
  color: #b8a88a;
  line-height: 1.6;
}

.btn-confirm {
  align-self: flex-start;
  padding: 8px 20px;
  background: #c8a96e;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-confirm:hover { background: #dab97e; }

.hint {
  font-size: 13px;
  color: #4a5a6a;
  text-align: center;
  width: 100%;
  letter-spacing: 1px;
}
</style>
