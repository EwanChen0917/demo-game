<template>
  <div class="map-overlay" @click.self="emit('close')">
    <div class="map-panel">
      <div class="map-toolbar">
        <span class="map-title">大唐天下</span>
        <div class="toolbar-right">
          <span class="home-label" v-if="homeRegion">
            根基：{{ homeRegion.name }}（{{ homeRegion.dao }}）
          </span>
          <button class="btn-close" @click="emit('close')">✕ 关闭</button>
        </div>
      </div>

      <div class="map-body">
        <div class="svg-wrap">
          <svg
            viewBox="200 150 450 300"
            class="map-svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <g>
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
                selected: selectedId === r.id,
                home: r.id === gameStore.homeRegionId,
                controlled: gameStore.controlledRegionIds.includes(r.id),
                capital: r.importance === 'capital',
                major: r.importance === 'major',
              }"
              :transform="`translate(${r.x}, ${r.y})`"
              @click="selectedId = r.id"
            >
              <circle
                :r="nodeRadius(r.importance)"
                :fill="nodeFill(r)"
                class="node-circle"
              />
              <text
                class="node-label"
                :y="nodeRadius(r.importance) + 9"
                text-anchor="middle"
              >{{ r.name }}</text>
            </g>
          </svg>
        </div>

        <div class="side-panel">
          <div class="legend">
            <div v-for="(color, dao) in DAO_COLORS" :key="dao" class="legend-row">
              <span class="legend-dot" :style="{ background: color }" />
              <span>{{ dao }}</span>
            </div>
          </div>

          <div class="region-detail" v-if="selected">
            <div class="detail-header">
              <span class="detail-name">{{ selected.name }}</span>
              <span class="detail-dao">{{ selected.dao }}</span>
            </div>
            <div class="detail-tags">
              <span v-if="selected.importance === 'capital'" class="tag-capital">都城</span>
              <span v-else-if="selected.importance === 'major'" class="tag-major">重镇</span>
              <span v-if="selected.id === gameStore.homeRegionId" class="tag-home">根基</span>
              <span v-if="gameStore.controlledRegionIds.includes(selected.id)" class="tag-ctrl">已控</span>
            </div>
            <p class="detail-desc">{{ selected.description }}</p>
            <div class="detail-neighbors">
              <span class="neighbor-label">相邻：</span>
              <span
                v-for="nid in selected.neighbors"
                :key="nid"
                class="neighbor-chip"
                @click="selectedId = nid"
              >{{ regionName(nid) }}</span>
            </div>
          </div>

          <div class="no-select" v-else>
            <p>点击地图上的州城查看详情</p>
          </div>
        </div>
      </div>

      <div class="map-footer">
        <span class="stat">在世族人 {{ aliveCount }} 人</span>
        <span class="stat">第 {{ gameStore.year }} 年 · {{ gameStore.season }}</span>
        <span class="stat">已控 {{ gameStore.controlledRegionIds.length }} 州</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { TANG_REGIONS, DAO_COLORS, getRegionById, type TangRegion } from '@/data/map'
import { useGameStore } from '@/stores/game'
import { useFamilyStore } from '@/stores/family'

const emit = defineEmits<{ close: [] }>()

const gameStore = useGameStore()
const familyStore = useFamilyStore()

const regions = TANG_REGIONS
const selectedId = ref<string | null>(gameStore.homeRegionId)

const homeRegion = computed(() =>
  gameStore.homeRegionId ? getRegionById(gameStore.homeRegionId) ?? null : null,
)
const selected = computed(() =>
  selectedId.value ? regions.find((r) => r.id === selectedId.value) ?? null : null,
)
const aliveCount = computed(() =>
  familyStore.family.members.filter((m) => m.alive).length,
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
      const nb = regions.find((x) => x.id === nid)
      if (!nb) return
      result.push({ x1: r.x, y1: r.y, x2: nb.x, y2: nb.y })
    })
  })
  return result
})

function nodeRadius(imp: TangRegion['importance']): number {
  if (imp === 'capital') return 9
  if (imp === 'major') return 7
  return 5
}

function nodeFill(r: TangRegion): string {
  if (r.id === gameStore.homeRegionId) return '#f0c040'
  if (gameStore.controlledRegionIds.includes(r.id)) return '#6fdb7a'
  return DAO_COLORS[r.dao] ?? '#888'
}

function regionName(id: string): string {
  return getRegionById(id)?.name ?? id
}
</script>

<style scoped>
.map-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.map-panel {
  width: 92vw;
  height: 88vh;
  background: #0a1220;
  border: 1px solid #2a3a5a;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.map-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #1a2a4a;
  flex-shrink: 0;
}

.map-title {
  font-size: 18px;
  color: #f0d9b5;
  letter-spacing: 4px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.home-label {
  font-size: 13px;
  color: #f0c040;
}

.btn-close {
  padding: 5px 14px;
  background: transparent;
  border: 1px solid #4a5a7a;
  border-radius: 4px;
  color: #8a9aba;
  cursor: pointer;
  font-size: 13px;
  transition: border-color 0.15s, color 0.15s;
}

.btn-close:hover {
  border-color: #c8a96e;
  color: #f0d9b5;
}

.map-body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.svg-wrap {
  flex: 1;
  overflow: hidden;
  padding: 8px;
}

.map-svg {
  width: 100%;
  height: 100%;
}

.edge-line {
  stroke: #1a3a5a;
  stroke-width: 0.8;
}

.region-node { cursor: pointer; }

.node-circle {
  stroke: #0a1525;
  stroke-width: 1;
  transition: fill-opacity 0.15s;
  fill-opacity: 0.75;
}

.region-node:hover .node-circle,
.region-node.selected .node-circle {
  fill-opacity: 1;
  stroke: #f0d9b5;
  stroke-width: 1.5;
}

.region-node.home .node-circle {
  stroke: #f0c040;
  stroke-width: 2;
  filter: drop-shadow(0 0 5px rgba(240, 192, 64, 0.5));
}

.region-node.capital .node-circle {
  stroke: #f0c040;
  stroke-width: 1.5;
}

.node-label {
  font-size: 7px;
  fill: #8a9aba;
  pointer-events: none;
  dominant-baseline: hanging;
}

.region-node:hover .node-label,
.region-node.selected .node-label,
.region-node.home .node-label,
.region-node.capital .node-label {
  fill: #f0d9b5;
  font-size: 8px;
}

.side-panel {
  width: 220px;
  border-left: 1px solid #1a2a4a;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 12px;
  gap: 12px;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #8a9aba;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.region-detail {
  border-top: 1px solid #1a2a4a;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.detail-name {
  font-size: 18px;
  color: #f0d9b5;
}

.detail-dao {
  font-size: 11px;
  color: #8a9aba;
}

.detail-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.tag-capital { font-size: 11px; padding: 1px 7px; border-radius: 3px; background: #4a3a10; color: #f0c040; }
.tag-major   { font-size: 11px; padding: 1px 7px; border-radius: 3px; background: #1a3a2a; color: #6fdb7a; }
.tag-home    { font-size: 11px; padding: 1px 7px; border-radius: 3px; background: #3a2a10; color: #f0a040; }
.tag-ctrl    { font-size: 11px; padding: 1px 7px; border-radius: 3px; background: #1a2a3a; color: #6aacf0; }

.detail-desc {
  font-size: 12px;
  color: #b8a88a;
  line-height: 1.7;
}

.detail-neighbors {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.neighbor-label {
  font-size: 11px;
  color: #5a6a7a;
}

.neighbor-chip {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 10px;
  background: #1a2a4a;
  color: #8a9aba;
  cursor: pointer;
  transition: background 0.15s;
}

.neighbor-chip:hover {
  background: #2a3a6a;
  color: #f0d9b5;
}

.no-select {
  border-top: 1px solid #1a2a4a;
  padding-top: 12px;
  font-size: 12px;
  color: #4a5a6a;
  text-align: center;
}

.map-footer {
  display: flex;
  gap: 24px;
  padding: 10px 20px;
  border-top: 1px solid #1a2a4a;
  flex-shrink: 0;
}

.stat {
  font-size: 12px;
  color: #8a9aba;
}
</style>
