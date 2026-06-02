<template>
  <div
    class="world-map"
    @mousedown.prevent="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
  >
    <svg
      class="map-svg"
      viewBox="0 0 3200 2600"
      :style="{ transform: `translate(${pan.x}px, ${pan.y}px)` }"
    >
      <defs>
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
        <filter id="ink-blur">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <filter id="seal-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="select-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="10" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- 羊皮纸底色 -->
      <rect x="0" y="0" width="3200" height="2600" fill="#e8dfc8" filter="url(#paper-texture)"/>
      <rect x="0" y="0" width="3200" height="2600" fill="#d4c9a8" fill-opacity="0.2"/>
      <rect x="16" y="16" width="3168" height="2568" fill="none" stroke="#b09060" stroke-width="6" stroke-opacity="0.35" rx="8"/>

      <!-- 省份疆域 -->
      <g v-if="provincePaths">
        <path
          v-for="prov in PROVINCES"
          :key="`fill-${prov.id}`"
          :d="provincePaths[prov.id] || ''"
          :fill="prov.color"
          fill-opacity="0.12"
          filter="url(#ink-blur)"
        />
        <path
          v-for="prov in PROVINCES"
          :key="`border-${prov.id}`"
          :d="provincePaths[prov.id] || ''"
          fill="none"
          :stroke="prov.color"
          stroke-opacity="0.45"
          stroke-width="3"
          stroke-linejoin="round"
        />
        <path
          v-for="prov in PROVINCES"
          :key="`dash-${prov.id}`"
          :d="provincePaths[prov.id] || ''"
          fill="none"
          :stroke="prov.color"
          stroke-opacity="0.2"
          stroke-width="6"
          stroke-linejoin="round"
          stroke-dasharray="16 8 4 8"
        />
      </g>

      <!-- 城池节点 -->
      <g v-for="city in CITIES" :key="city.id"
        :transform="`translate(${city.x}, ${city.y})`"
        @click="onSelectCity(city)"
        style="cursor: pointer"
      >
        <!-- 选中光晕 -->
        <circle
          v-if="selectedCityId === city.id"
          :r="sealR(city) + 24"
          fill="none"
          :stroke="cityStroke(city)"
          stroke-width="3"
          stroke-dasharray="12 8"
          opacity="0.9"
          filter="url(#select-glow)"
        />

        <!-- 印章主体 -->
        <circle
          :r="sealR(city)"
          :fill="sealFill(city)"
          :stroke="cityStroke(city)"
          :stroke-width="city.importance === 'capital' ? 5 : 3"
          :filter="selectedCityId === city.id || city.id === gameStore.homeRegionId ? 'url(#seal-glow)' : ''"
        />

        <!-- 内圈装饰 -->
        <circle
          v-if="city.importance !== 'normal'"
          :r="sealR(city) - 7"
          fill="none"
          :stroke="cityStroke(city)"
          stroke-width="1.5"
          stroke-opacity="0.5"
        />

        <!-- 都城星，重镇菱形，普通圆点 -->
        <text v-if="city.importance === 'capital'"
          text-anchor="middle" dominant-baseline="central"
          :font-size="sealR(city) * 0.85"
          :fill="sealTextColor(city)"
          pointer-events="none"
        >✦</text>
        <rect v-else-if="city.importance === 'major'"
          :x="-sealR(city)*0.28" :y="-sealR(city)*0.28"
          :width="sealR(city)*0.56" :height="sealR(city)*0.56"
          :fill="sealTextColor(city)" transform="rotate(45)"
          pointer-events="none"
        />
        <circle v-else
          :r="sealR(city) * 0.28"
          :fill="sealTextColor(city)"
          pointer-events="none"
        />

        <!-- 城池名称 -->
        <text
          text-anchor="middle"
          :y="sealR(city) + 34"
          :font-size="city.importance === 'capital' ? 32 : city.importance === 'major' ? 26 : 22"
          :fill="labelColor(city)"
          :font-weight="city.importance === 'capital' ? '700' : '400'"
          pointer-events="none"
          class="city-label"
          letter-spacing="4"
        >{{ city.name }}</text>
      </g>
    </svg>

    <!-- 城池信息卡片 -->
    <transition name="card-pop">
      <div v-if="selectedCity" class="city-card" :style="{ borderLeftColor: provinceColor(selectedCity.provinceId) }">
        <button class="card-close" @click="selectedCityId = null">✕</button>

        <div class="card-province" :style="{ color: provinceColor(selectedCity.provinceId) }">
          {{ provinceName(selectedCity.provinceId) }}
        </div>

        <div class="card-name-row">
          <span class="card-name">{{ selectedCity.name }}</span>
          <span class="card-imp" v-if="selectedCity.importance === 'capital'">首府</span>
          <span class="card-imp card-imp-major" v-else-if="selectedCity.importance === 'major'">重镇</span>
        </div>

        <div class="card-tags">
          <span v-if="selectedCity.id === gameStore.homeRegionId" class="ctag ctag-home">根基</span>
          <span v-if="gameStore.controlledRegionIds.includes(selectedCity.id)" class="ctag ctag-ctrl">已控</span>
        </div>

        <p class="card-desc">{{ selectedCity.description }}</p>

        <div class="card-neighbors">
          <span class="neighbors-head">通往：</span>
          <span
            v-for="nid in selectedCity.neighbors"
            :key="nid"
            class="nb-chip"
            @click="selectedCityId = nid"
          >{{ cityName(nid) }}</span>
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

    <div class="map-hint" v-if="mode === 'select' && !selectedCity">
      点击城池，选择家族根基之地
    </div>

    <div class="region-legend">
      <div class="legend-title">大区</div>
      <div v-for="region in uniqueRegions" :key="region" class="legend-row">
        <span class="legend-dot" :style="{ background: regionColor(region) }"/>
        <span>{{ region }}</span>
      </div>
    </div>

    <div v-if="!provincePaths" class="loading-hint">地图加载中…</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { PROVINCES, CITIES, getProvinceById, getCityById, type CityNode } from '@/data/map'
import { useGameStore } from '@/stores/game'
import { useFamilyStore } from '@/stores/family'

const props = defineProps<{ mode: 'select' | 'view' }>()
const emit = defineEmits<{ settled: [regionId: string] }>()

const gameStore = useGameStore()
const familyStore = useFamilyStore()

const selectedCityId = ref<string | null>(null)
const selectedCity = computed(() =>
  selectedCityId.value ? getCityById(selectedCityId.value) ?? null : null,
)

const provincePaths = ref<Record<string, string> | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/province-paths.json')
    provincePaths.value = await res.json()
  } catch (e) {
    console.error('Failed to load province paths', e)
  }
})

const pan = reactive({ x: 0, y: 0 })
const dragging = ref(false)
const didDrag = ref(false)
const dragStart = reactive({ x: 0, y: 0, panX: 0, panY: 0 })

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

function sealR(city: CityNode): number {
  if (city.importance === 'capital') return 40
  if (city.importance === 'major') return 28
  return 18
}

function sealFill(city: CityNode): string {
  if (city.id === gameStore.homeRegionId) return '#c8380a'
  if (gameStore.controlledRegionIds.includes(city.id)) return '#2a6a3a'
  const prov = getProvinceById(city.provinceId)
  if (city.importance === 'capital') return '#6a1a0a'
  if (city.importance === 'major') return '#2a1a0a'
  return '#e8dfc8'
}

function cityStroke(city: CityNode): string {
  if (city.id === gameStore.homeRegionId) return '#f06030'
  if (gameStore.controlledRegionIds.includes(city.id)) return '#4aaa6a'
  if (city.importance === 'capital') return '#c84020'
  if (city.importance === 'major') return '#8a6a20'
  return '#8a7a5a'
}

function sealTextColor(city: CityNode): string {
  if (city.id === gameStore.homeRegionId) return '#ffe0c0'
  if (gameStore.controlledRegionIds.includes(city.id)) return '#a0ffb0'
  if (city.importance === 'capital') return '#ffe090'
  if (city.importance === 'major') return '#d4b870'
  return '#8a7a5a'
}

function labelColor(city: CityNode): string {
  if (city.id === gameStore.homeRegionId) return '#8b1a0a'
  if (gameStore.controlledRegionIds.includes(city.id)) return '#1a5a2a'
  if (city.importance === 'capital') return '#2a1000'
  if (city.importance === 'major') return '#4a3a1a'
  return '#6a5a3a'
}

function provinceColor(provinceId: string): string {
  return getProvinceById(provinceId)?.color ?? '#888'
}

function provinceName(provinceId: string): string {
  return getProvinceById(provinceId)?.nameZh ?? provinceId
}

function cityName(cityId: string): string {
  return getCityById(cityId)?.name ?? cityId
}

const uniqueRegions = computed(() => {
  const seen = new Set<string>()
  const result: string[] = []
  PROVINCES.forEach(p => {
    if (!seen.has(p.region)) {
      seen.add(p.region)
      result.push(p.region)
    }
  })
  return result
})

function regionColor(region: string): string {
  const prov = PROVINCES.find(p => p.region === region)
  return prov?.color ?? '#888'
}

function onSelectCity(city: CityNode) {
  if (didDrag.value) return
  selectedCityId.value = selectedCityId.value === city.id ? null : city.id
}

function onSettle() {
  if (!selectedCity.value) return
  const city = selectedCity.value
  const prov = getProvinceById(city.provinceId)
  familyStore.family.name = (prov?.nameZh ?? city.name).slice(0, 1)
  gameStore.startGame(city.id)
  emit('settled', city.id)
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
  z-index: 10;
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
}
.card-close:hover { background: rgba(139, 90, 40, 0.1); }

.card-province {
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

.card-tags { display: flex; gap: 5px; }

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

.neighbors-head { font-size: 11px; color: #8a7a5a; }

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
}

.region-legend {
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
  z-index: 10;
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

.loading-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  color: #8a7a5a;
  letter-spacing: 3px;
}

.card-pop-enter-active { transition: all 0.22s ease; }
.card-pop-leave-active { transition: all 0.18s ease; }
.card-pop-enter-from  { opacity: 0; transform: translateY(-50%) translateX(-16px); }
.card-pop-leave-to    { opacity: 0; transform: translateY(-50%) translateX(-16px); }
</style>
