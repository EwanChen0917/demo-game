<template>
  <div class="world-map" @wheel.prevent="onWheel" @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseUp">
    <svg
      ref="svgEl"
      class="map-svg"
      :viewBox="viewBox"
      @mousedown.prevent="onMouseDown"
    >
      <defs>
        <filter id="glow-gold">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-green">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="map-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#0d1f3c" />
          <stop offset="100%" stop-color="#060d1a" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="800" height="600" fill="url(#map-bg)" />

      <g class="terrain-layer">
        <path v-for="dao in daoPolygons" :key="dao.name"
          :d="dao.path"
          :fill="dao.color"
          fill-opacity="0.10"
          :stroke="dao.color"
          stroke-opacity="0.30"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
      </g>

      <g class="edges-layer">
        <line
          v-for="(e, i) in edges"
          :key="`e${i}`"
          :x1="e.x1" :y1="e.y1" :x2="e.x2" :y2="e.y2"
          stroke="#1e3a5a"
          stroke-width="0.6"
          stroke-dasharray="3 4"
          opacity="0.5"
        />
      </g>

      <g class="regions-layer">
        <g
          v-for="r in regions"
          :key="r.id"
          :transform="`translate(${r.x}, ${r.y})`"
          class="region-group"
          :class="{ selected: selectedId === r.id }"
          @click="onSelectRegion(r)"
          style="cursor: pointer"
        >
          <circle
            :r="haloRadius(r)"
            :fill="haloColor(r)"
            fill-opacity="0.15"
            v-if="selectedId === r.id || r.id === gameStore.homeRegionId"
          />

          <g :filter="r.id === gameStore.homeRegionId ? 'url(#glow-gold)' : (gameStore.controlledRegionIds.includes(r.id) ? 'url(#glow-green)' : '')">
            <path
              :d="castlePath(r.importance)"
              :fill="castleFill(r)"
              :stroke="castleStroke(r)"
              stroke-width="0.8"
              :transform="`translate(${-castleW(r.importance)/2}, ${-castleH(r.importance)})`"
            />
          </g>

          <text
            class="region-label"
            :y="8"
            text-anchor="middle"
            :font-size="labelSize(r.importance)"
            :fill="labelColor(r)"
            :font-weight="r.importance === 'capital' ? '700' : '400'"
          >{{ r.name }}</text>

          <text
            v-if="r.importance === 'capital'"
            y="-24"
            text-anchor="middle"
            font-size="7"
            fill="#f0c040"
            opacity="0.8"
          >★</text>
        </g>
      </g>
    </svg>

    <transition name="info-slide">
      <div class="info-panel" v-if="selected" :style="{ borderLeftColor: daoColor(selected.dao) }">
        <button class="info-close" @click="selectedId = null">✕</button>
        <div class="info-dao-badge" :style="{ background: daoColor(selected.dao) + '33', borderColor: daoColor(selected.dao) }">
          {{ selected.dao }}
        </div>
        <h2 class="info-name">{{ selected.name }}</h2>
        <div class="info-tags">
          <span v-if="selected.importance === 'capital'" class="tag tag-capital">都城</span>
          <span v-else-if="selected.importance === 'major'" class="tag tag-major">重镇</span>
          <span v-if="selected.id === gameStore.homeRegionId" class="tag tag-home">根基</span>
          <span v-if="gameStore.controlledRegionIds.includes(selected.id) && selected.id !== gameStore.homeRegionId" class="tag tag-ctrl">已控</span>
        </div>
        <p class="info-desc">{{ selected.description }}</p>
        <div class="info-neighbors">
          <div class="neighbors-title">相邻州郡</div>
          <div class="neighbors-chips">
            <span
              v-for="nid in selected.neighbors"
              :key="nid"
              class="neighbor-chip"
              @click="selectedId = nid"
            >{{ regionName(nid) }}</span>
          </div>
        </div>
        <button v-if="mode === 'select'" class="btn-settle" @click="onSettle">
          在此落地生根
        </button>
      </div>
    </transition>

    <div class="map-hint" v-if="mode === 'select' && !selected">
      <span>点击州郡选择家族起源之地</span>
    </div>

    <div class="dao-legend">
      <div v-for="(color, dao) in DAO_COLORS" :key="dao" class="legend-row">
        <span class="legend-dot" :style="{ background: color }" />
        <span>{{ dao }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { TANG_REGIONS, DAO_COLORS, getRegionById, type TangRegion } from '@/data/map'
import { useGameStore } from '@/stores/game'
import { useFamilyStore } from '@/stores/family'

const props = defineProps<{ mode: 'select' | 'view' }>()
const emit = defineEmits<{ settled: [regionId: string] }>()

const gameStore = useGameStore()
const familyStore = useFamilyStore()

const regions = TANG_REGIONS
const selectedId = ref<string | null>(null)
const selected = computed(() => selectedId.value ? getRegionById(selectedId.value) ?? null : null)

const pan = reactive({ x: 0, y: 0 })
const zoom = ref(1)
const dragging = ref(false)
const dragStart = reactive({ x: 0, y: 0, panX: 0, panY: 0 })
const svgEl = ref<SVGSVGElement>()

const viewBox = computed(() => {
  const w = 800 / zoom.value
  const h = 600 / zoom.value
  const cx = 390 - pan.x / zoom.value
  const cy = 275 - pan.y / zoom.value
  return `${cx - w/2} ${cy - h/2} ${w} ${h}`
})

function onMouseDown(e: MouseEvent) {
  dragging.value = true
  dragStart.x = e.clientX
  dragStart.y = e.clientY
  dragStart.panX = pan.x
  dragStart.panY = pan.y
}

function onMouseMove(e: MouseEvent) {
  if (!dragging.value) return
  pan.x = dragStart.panX + (e.clientX - dragStart.x)
  pan.y = dragStart.panY + (e.clientY - dragStart.y)
}

function onMouseUp() {
  dragging.value = false
}

function onWheel(e: WheelEvent) {
  const delta = e.deltaY > 0 ? -0.12 : 0.12
  zoom.value = Math.min(4, Math.max(0.4, zoom.value + delta))
}

interface Edge { x1:number; y1:number; x2:number; y2:number }
const edges = computed<Edge[]>(() => {
  const seen = new Set<string>()
  const result: Edge[] = []
  regions.forEach(r => {
    r.neighbors.forEach(nid => {
      const key = [r.id, nid].sort().join('-')
      if (seen.has(key)) return
      seen.add(key)
      const nb = getRegionById(nid)
      if (!nb) return
      result.push({ x1: r.x, y1: r.y, x2: nb.x, y2: nb.y })
    })
  })
  return result
})

interface DaoPolygon { name: string; color: string; path: string }
const daoPolygons = computed<DaoPolygon[]>(() => {
  const groups: Record<string, TangRegion[]> = {}
  regions.forEach(r => {
    if (!groups[r.dao]) groups[r.dao] = []
    groups[r.dao].push(r)
  })
  return Object.entries(groups).map(([dao, pts]) => {
    const hull = convexHull(pts.map(p => [p.x, p.y]))
    const pad = 18
    const expanded = hull.map(([x, y], i) => {
      const prev = hull[(i - 1 + hull.length) % hull.length]
      const next = hull[(i + 1) % hull.length]
      const dx1 = x - prev[0], dy1 = y - prev[1]
      const dx2 = next[0] - x, dy2 = next[1] - y
      const nx = -(dy1 + dy2), ny = dx1 + dx2
      const len = Math.sqrt(nx*nx + ny*ny) || 1
      return [x + nx/len*pad, y + ny/len*pad]
    })
    const d = expanded.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + ' Z'
    return { name: dao, color: DAO_COLORS[dao] ?? '#888', path: d }
  })
})

function convexHull(points: number[][]): number[][] {
  if (points.length < 3) return points
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const lower: number[][] = []
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length-2], lower[lower.length-1], p) <= 0) lower.pop()
    lower.push(p)
  }
  const upper: number[][] = []
  for (const p of [...sorted].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length-2], upper[upper.length-1], p) <= 0) upper.pop()
    upper.push(p)
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)]
}

function cross(o: number[], a: number[], b: number[]): number {
  return (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0])
}

function castleW(imp: TangRegion['importance']): number {
  return imp === 'capital' ? 20 : imp === 'major' ? 15 : 10
}
function castleH(imp: TangRegion['importance']): number {
  return imp === 'capital' ? 20 : imp === 'major' ? 15 : 10
}

function castlePath(imp: TangRegion['importance']): string {
  const w = castleW(imp)
  const h = castleH(imp)
  const b = Math.round(w * 0.2)
  const t = Math.round(h * 0.4)
  return [
    `M0,${h}`, `L0,${t}`, `L${b},${t}`, `L${b},0`,
    `L${b*2},0`, `L${b*2},${t}`,
    `L${w - b*2},${t}`, `L${w - b*2},0`,
    `L${w - b},0`, `L${w - b},${t}`,
    `L${w},${t}`, `L${w},${h}`, `Z`
  ].join(' ')
}

function castleFill(r: TangRegion): string {
  if (r.id === gameStore.homeRegionId) return '#f0c040'
  if (gameStore.controlledRegionIds.includes(r.id)) return '#4dbd74'
  if (r.importance === 'capital') return '#c8a060'
  if (r.importance === 'major') return '#6a8aaa'
  return '#4a5a6a'
}

function castleStroke(r: TangRegion): string {
  if (r.id === gameStore.homeRegionId) return '#ffd060'
  if (gameStore.controlledRegionIds.includes(r.id)) return '#6fdb9a'
  return '#2a3a4a'
}

function haloRadius(r: TangRegion): number {
  return castleW(r.importance) * 1.4
}

function haloColor(r: TangRegion): string {
  if (r.id === gameStore.homeRegionId) return '#f0c040'
  return '#4dbd74'
}

function labelSize(imp: TangRegion['importance']): number {
  return imp === 'capital' ? 9 : imp === 'major' ? 8 : 7
}

function labelColor(r: TangRegion): string {
  if (r.id === gameStore.homeRegionId) return '#f0c040'
  if (gameStore.controlledRegionIds.includes(r.id)) return '#6fdb9a'
  if (r.importance === 'capital') return '#e8c87a'
  return '#a8b8c8'
}

function daoColor(dao: string): string {
  return DAO_COLORS[dao] ?? '#888'
}

function regionName(id: string): string {
  return getRegionById(id)?.name ?? id
}

function onSelectRegion(r: TangRegion) {
  selectedId.value = r.id
}

function onSettle() {
  if (!selected.value) return
  const region = selected.value
  familyStore.family.name = region.name.slice(0, 1)
  gameStore.startGame(region.id)
  emit('settled', region.id)
}
</script>

<style scoped>
.world-map {
  position: relative;
  width: 100%;
  height: 100%;
  background: #060d1a;
  overflow: hidden;
  user-select: none;
  font-family: 'Noto Serif SC', 'SimSun', serif;
}

.map-svg {
  width: 100%;
  height: 100%;
  cursor: grab;
}

.map-svg:active {
  cursor: grabbing;
}

.region-label {
  font-family: 'Noto Serif SC', 'SimSun', serif;
  pointer-events: none;
  letter-spacing: 1px;
}

.info-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 280px;
  height: 100%;
  background: rgba(6, 13, 26, 0.93);
  border-left: 3px solid #3a6aaa;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  backdrop-filter: blur(8px);
}

.info-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: 1px solid #2a3a5a;
  color: #6a7a8a;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: border-color 0.15s, color 0.15s;
}

.info-close:hover {
  border-color: #c8a96e;
  color: #f0d9b5;
}

.info-dao-badge {
  display: inline-block;
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 12px;
  border: 1px solid;
  color: #d0c0a0;
  align-self: flex-start;
}

.info-name {
  font-size: 28px;
  color: #f0d9b5;
  letter-spacing: 4px;
  margin: 0;
}

.info-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 3px;
}

.tag-capital  { background: #4a3a10; color: #f0c040; }
.tag-major    { background: #1a3a2a; color: #6fdb7a; }
.tag-home     { background: #5a3a00; color: #ffb040; }
.tag-ctrl     { background: #1a2a3a; color: #6aacf0; }

.info-desc {
  font-size: 13px;
  color: #b0a090;
  line-height: 1.9;
  border-left: 2px solid rgba(100, 130, 160, 0.4);
  padding-left: 12px;
  margin: 0;
}

.info-neighbors {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.neighbors-title {
  font-size: 11px;
  color: #5a6a7a;
  letter-spacing: 1px;
}

.neighbors-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.neighbor-chip {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 12px;
  background: #0f1e35;
  border: 1px solid #2a3a5a;
  color: #8a9aba;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.neighbor-chip:hover {
  background: #1a2a4a;
  color: #f0d9b5;
  border-color: #4a6aaa;
}

.btn-settle {
  margin-top: auto;
  padding: 12px 0;
  background: linear-gradient(135deg, #8a6020, #c8a040);
  color: #1a1000;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  font-family: 'Noto Serif SC', serif;
  letter-spacing: 2px;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-settle:hover { opacity: 0.9; }

.map-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(6, 13, 26, 0.8);
  border: 1px solid #2a3a5a;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 13px;
  color: #6a8aaa;
  letter-spacing: 1px;
  pointer-events: none;
}

.dao-legend {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(6, 13, 26, 0.85);
  border: 1px solid #1a2a3a;
  border-radius: 6px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  color: #6a7a8a;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.info-slide-enter-active { transition: transform 0.25s ease, opacity 0.25s; }
.info-slide-leave-active { transition: transform 0.2s ease, opacity 0.2s; }
.info-slide-enter-from   { transform: translateX(-100%); opacity: 0; }
.info-slide-leave-to     { transform: translateX(-100%); opacity: 0; }
</style>
