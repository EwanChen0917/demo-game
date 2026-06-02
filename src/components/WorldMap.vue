<template>
  <div
    class="world-map"
    @mousedown.prevent="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
  >
    <svg
      ref="svgEl"
      class="map-svg"
      viewBox="0 0 3200 2600"
      :style="{ transform: `translate(${pan.x}px, ${pan.y}px)` }"
    >
      <defs>
        <!-- 羊皮纸纹理背景 -->
        <filter id="paper-texture" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="gray"/>
          <feBlend in="SourceGraphic" in2="gray" mode="multiply" result="blend"/>
          <feComponentTransfer in="blend">
            <feFuncR type="linear" slope="0.92" intercept="0.05"/>
            <feFuncG type="linear" slope="0.88" intercept="0.04"/>
            <feFuncB type="linear" slope="0.72" intercept="0.02"/>
          </feComponentTransfer>
        </filter>

        <!-- 水墨晕染 -->
        <filter id="ink-blur">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>

        <!-- 城池印章发光 -->
        <filter id="seal-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        <!-- 选中光晕 -->
        <filter id="select-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        <!-- 道颜色渐变，水墨感 -->
        <radialGradient v-for="dp in daoPolygons" :key="`grad-${dp.name}`"
          :id="`grad-${dp.name}`"
          cx="50%" cy="50%" r="60%"
        >
          <stop offset="0%" :stop-color="dp.color" stop-opacity="0.18"/>
          <stop offset="100%" :stop-color="dp.color" stop-opacity="0.04"/>
        </radialGradient>
      </defs>

      <!-- 羊皮纸底色 -->
      <rect x="0" y="0" width="3200" height="2600" fill="#e8dfc8" filter="url(#paper-texture)" rx="4"/>
      <rect x="0" y="0" width="3200" height="2600" fill="#d4c9a8" fill-opacity="0.25"/>

      <!-- 地图外边框装饰 -->
      <rect x="16" y="16" width="3168" height="2568" fill="none" stroke="#b09060" stroke-width="6" stroke-opacity="0.4" rx="8"/>

      <!-- 道疆域水墨色块 -->
      <g class="dao-layer">
        <path
          v-for="dp in daoPolygons"
          :key="`dao-${dp.name}`"
          :d="dp.path"
          :fill="`url(#grad-${dp.name})`"
          :stroke="dp.color"
          stroke-opacity="0.5"
          stroke-width="4"
          stroke-linejoin="round"
          filter="url(#ink-blur)"
        />
        <path
          v-for="dp in daoPolygons"
          :key="`dao-stroke-${dp.name}`"
          :d="dp.path"
          fill="none"
          :stroke="dp.color"
          stroke-opacity="0.25"
          stroke-width="8"
          stroke-linejoin="round"
          stroke-dasharray="20 10 6 10"
        />
      </g>

      <!-- 道路连线 -->
      <g class="roads-layer">
        <line
          v-for="(e, i) in edges"
          :key="`road-${i}`"
          :x1="e.x1" :y1="e.y1"
          :x2="e.x2" :y2="e.y2"
          stroke="#8a7a5a"
          stroke-opacity="0.22"
          stroke-width="2"
          stroke-dasharray="12 16"
        />
      </g>

      <!-- 城池节点 -->
      <g class="cities-layer">
        <g
          v-for="r in regions"
          :key="r.id"
          :transform="`translate(${r.x}, ${r.y})`"
          class="city-node"
          @click="onSelectRegion(r)"
          style="cursor: pointer"
        >
          <circle
            v-if="selectedId === r.id"
            :r="sealR(r) + 28"
            fill="none"
            :stroke="selectedStroke(r)"
            stroke-width="4"
            stroke-dasharray="14 10"
            opacity="0.8"
            filter="url(#select-glow)"
          />

          <circle
            :r="sealR(r)"
            :fill="sealFill(r)"
            :stroke="sealStroke(r)"
            :stroke-width="r.importance === 'capital' ? 6 : 4"
            :filter="selectedId === r.id || r.id === gameStore.homeRegionId ? 'url(#seal-glow)' : ''"
          />

          <circle
            v-if="r.importance !== 'normal'"
            :r="sealR(r) - 8"
            fill="none"
            :stroke="sealStroke(r)"
            stroke-width="2"
            stroke-opacity="0.6"
          />

          <text
            v-if="r.importance === 'capital'"
            text-anchor="middle"
            dominant-baseline="central"
            :font-size="sealR(r) * 0.85"
            :fill="sealTextColor(r)"
            pointer-events="none"
          >✦</text>

          <rect
            v-else-if="r.importance === 'major'"
            :x="-sealR(r)*0.28"
            :y="-sealR(r)*0.28"
            :width="sealR(r)*0.56"
            :height="sealR(r)*0.56"
            :fill="sealTextColor(r)"
            transform="rotate(45)"
            pointer-events="none"
          />

          <circle
            v-else
            :r="sealR(r) * 0.3"
            :fill="sealTextColor(r)"
            pointer-events="none"
          />

          <text
            text-anchor="middle"
            :y="sealR(r) + 38"
            :font-size="fontSize(r)"
            :fill="labelColor(r)"
            :font-weight="r.importance === 'capital' ? '700' : '400'"
            pointer-events="none"
            class="city-label"
            :letter-spacing="r.importance === 'capital' ? '6' : '3'"
          >{{ r.name }}</text>
        </g>
      </g>
    </svg>

    <!-- 城池信息卡片（点击后浮出，非全高侧边栏） -->
    <transition name="card-pop">
      <div
        v-if="selected"
        class="city-card"
        :style="{ borderColor: daoColorVal(selected.dao) }"
      >
        <button class="card-close" @click="selectedId = null">✕</button>

        <div class="card-dao" :style="{ color: daoColorVal(selected.dao) }">
          {{ selected.dao }}
        </div>

        <div class="card-name-row">
          <span class="card-name">{{ selected.name }}</span>
          <span class="card-imp" v-if="selected.importance === 'capital'">都城</span>
          <span class="card-imp card-imp-major" v-else-if="selected.importance === 'major'">重镇</span>
        </div>

        <div class="card-tags">
          <span v-if="selected.id === gameStore.homeRegionId" class="ctag ctag-home">根基</span>
          <span v-if="gameStore.controlledRegionIds.includes(selected.id) && selected.id !== gameStore.homeRegionId" class="ctag ctag-ctrl">已控</span>
        </div>

        <p class="card-desc">{{ selected.description }}</p>

        <div class="card-neighbors">
          <span class="neighbors-head">通往：</span>
          <span
            v-for="nid in selected.neighbors"
            :key="nid"
            class="nb-chip"
            @click="selectedId = nid"
          >{{ regionName(nid) }}</span>
        </div>

        <div class="card-actions">
          <button v-if="mode === 'select'" class="btn-settle" @click="onSettle">
            在此落地生根
          </button>
          <button v-else class="btn-enter" disabled>
            进入城池（即将开放）
          </button>
        </div>
      </div>
    </transition>

    <!-- 开局提示 -->
    <div class="map-hint" v-if="mode === 'select' && !selected">
      点击城池，选择家族根基之地
    </div>

    <!-- 道图例 -->
    <div class="dao-legend">
      <div class="legend-title">十道</div>
      <div v-for="(color, dao) in DAO_COLORS" :key="dao" class="legend-row">
        <span class="legend-dot" :style="{ background: color }"/>
        <span>{{ dao }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { TANG_REGIONS, DAO_COLORS, DAO_PATHS, getRegionById, type TangRegion } from '@/data/map'
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
const dragging = ref(false)
const didDrag = ref(false)
const dragStart = reactive({ x: 0, y: 0, panX: 0, panY: 0 })
const svgEl = ref<SVGSVGElement>()

function onMouseDown(e: MouseEvent) {
  dragging.value = true
  didDrag.value = false
  dragStart.x = e.clientX
  dragStart.y = e.clientY
  dragStart.panX = pan.x
  dragStart.panY = pan.y
}

function onMouseMove(e: MouseEvent) {
  if (!dragging.value) return
  const dx = e.clientX - dragStart.x
  const dy = e.clientY - dragStart.y
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.value = true
  pan.x = dragStart.panX + dx
  pan.y = dragStart.panY + dy
}

function onMouseUp() { dragging.value = false }

interface Edge { x1: number; y1: number; x2: number; y2: number }
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
  return Object.entries(DAO_PATHS).map(([dao, path]) => ({
    name: dao,
    color: DAO_COLORS[dao] ?? '#888',
    path,
  }))
})

function sealR(r: TangRegion): number {
  if (r.importance === 'capital') return 44
  if (r.importance === 'major') return 32
  return 20
}

function sealFill(r: TangRegion): string {
  if (r.id === gameStore.homeRegionId) return '#c8380a'
  if (gameStore.controlledRegionIds.includes(r.id)) return '#2a6a3a'
  if (r.importance === 'capital') return '#8b1a0a'
  if (r.importance === 'major') return '#3a2a0a'
  return '#e8dfc8'
}

function sealStroke(r: TangRegion): string {
  if (r.id === gameStore.homeRegionId) return '#f06030'
  if (gameStore.controlledRegionIds.includes(r.id)) return '#4aaa6a'
  if (r.importance === 'capital') return '#c84020'
  if (r.importance === 'major') return '#8a6a20'
  return '#8a7a5a'
}

function selectedStroke(r: TangRegion): string {
  if (r.id === gameStore.homeRegionId) return '#f06030'
  return '#c8a050'
}

function sealTextColor(r: TangRegion): string {
  if (r.id === gameStore.homeRegionId) return '#ffe0c0'
  if (gameStore.controlledRegionIds.includes(r.id)) return '#a0ffb0'
  if (r.importance === 'capital') return '#ffe090'
  if (r.importance === 'major') return '#d4b870'
  return '#8a7a5a'
}

function fontSize(r: TangRegion): number {
  if (r.importance === 'capital') return 36
  if (r.importance === 'major') return 30
  return 24
}

function labelColor(r: TangRegion): string {
  if (r.id === gameStore.homeRegionId) return '#8b1a0a'
  if (gameStore.controlledRegionIds.includes(r.id)) return '#1a5a2a'
  if (r.importance === 'capital') return '#3a1a0a'
  if (r.importance === 'major') return '#4a3a1a'
  return '#6a5a3a'
}

function daoColorVal(dao: string): string {
  return DAO_COLORS[dao] ?? '#888'
}

function regionName(id: string): string {
  return getRegionById(id)?.name ?? id
}

function onSelectRegion(r: TangRegion) {
  if (didDrag.value) return
  selectedId.value = selectedId.value === r.id ? null : r.id
}

function onSettle() {
  if (!selected.value) return
  familyStore.family.name = selected.value.name.slice(0, 1)
  gameStore.startGame(selected.value.id)
  emit('settled', selected.value.id)
}
</script>

<style scoped>
.world-map {
  position: relative;
  width: 100%;
  height: 100%;
  background: #c8b89a;
  overflow: hidden;
  user-select: none;
  font-family: 'Noto Serif SC', 'SimSun', serif;
  cursor: grab;
}

.world-map:active { cursor: grabbing; }

.map-svg {
  width: 3200px;
  height: 2600px;
  display: block;
  will-change: transform;
}

.city-label {
  font-family: 'Noto Serif SC', 'SimSun', serif;
}

/* ─── 城池信息卡片 ─── */
.city-card {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 260px;
  background: rgba(232, 220, 190, 0.97);
  border: 2px solid #8a6030;
  border-left-width: 4px;
  border-radius: 4px;
  padding: 20px 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 4px 4px 20px rgba(60, 30, 10, 0.35);
}

.card-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: 1px solid #b09060;
  border-radius: 3px;
  color: #8a6030;
  width: 22px;
  height: 22px;
  font-size: 11px;
  cursor: pointer;
  line-height: 1;
  transition: background 0.15s;
}
.card-close:hover { background: rgba(139, 90, 40, 0.1); }

.card-dao {
  font-size: 11px;
  letter-spacing: 2px;
  opacity: 0.8;
}

.card-name-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.card-name {
  font-size: 26px;
  color: #2a1a08;
  letter-spacing: 4px;
  line-height: 1;
}

.card-imp {
  font-size: 11px;
  padding: 1px 7px;
  background: #8b1a0a;
  color: #ffe090;
  border-radius: 2px;
  letter-spacing: 1px;
}

.card-imp-major {
  background: #5a3a0a;
  color: #d4b870;
}

.card-tags {
  display: flex;
  gap: 5px;
}

.ctag {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 2px;
  letter-spacing: 1px;
}

.ctag-home { background: #c8380a; color: #ffe0c0; }
.ctag-ctrl { background: #2a6a3a; color: #a0ffb0; }

.card-desc {
  font-size: 12px;
  color: #5a4a2a;
  line-height: 1.8;
  border-top: 1px solid rgba(139, 96, 48, 0.3);
  padding-top: 8px;
  margin: 0;
}

.card-neighbors {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
}

.neighbors-head {
  font-size: 11px;
  color: #8a7a5a;
}

.nb-chip {
  font-size: 11px;
  padding: 1px 8px;
  background: rgba(139, 96, 48, 0.12);
  border: 1px solid rgba(139, 96, 48, 0.35);
  border-radius: 2px;
  color: #5a3a1a;
  cursor: pointer;
  transition: background 0.15s;
}
.nb-chip:hover { background: rgba(139, 96, 48, 0.25); }

.card-actions { margin-top: 4px; }

.btn-settle {
  width: 100%;
  padding: 10px 0;
  background: #8b1a0a;
  color: #ffe8c0;
  border: none;
  border-radius: 3px;
  font-size: 14px;
  font-family: 'Noto Serif SC', serif;
  letter-spacing: 3px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-settle:hover { background: #a02010; }

.btn-enter {
  width: 100%;
  padding: 10px 0;
  background: rgba(139, 96, 48, 0.15);
  color: #8a7a5a;
  border: 1px dashed #b09060;
  border-radius: 3px;
  font-size: 13px;
  font-family: 'Noto Serif SC', serif;
  letter-spacing: 2px;
  cursor: not-allowed;
}

/* ─── 开局提示 ─── */
.map-hint {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(232, 220, 190, 0.92);
  border: 1px solid #b09060;
  border-radius: 20px;
  padding: 7px 22px;
  font-size: 13px;
  color: #5a3a1a;
  letter-spacing: 2px;
  pointer-events: none;
  box-shadow: 0 2px 10px rgba(60, 30, 10, 0.2);
}

/* ─── 道图例 ─── */
.dao-legend {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(232, 220, 190, 0.92);
  border: 1px solid #b09060;
  border-radius: 4px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 2px 2px 10px rgba(60, 30, 10, 0.2);
}

.legend-title {
  font-size: 11px;
  color: #5a3a1a;
  letter-spacing: 2px;
  margin-bottom: 4px;
  border-bottom: 1px solid rgba(139, 96, 48, 0.3);
  padding-bottom: 4px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  color: #6a5a3a;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  opacity: 0.7;
}

/* ─── 动画 ─── */
.card-pop-enter-active { transition: all 0.22s ease; }
.card-pop-leave-active { transition: all 0.18s ease; }
.card-pop-enter-from  { opacity: 0; transform: translateY(-50%) translateX(-16px); }
.card-pop-leave-to    { opacity: 0; transform: translateY(-50%) translateX(-16px); }
</style>
