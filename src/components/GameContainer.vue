<template>
  <div class="game-root">
    <WorldMap :mode="store.started ? 'view' : 'select'" @settled="onGameStarted" />

    <template v-if="store.started">
      <div class="hud-top-left">
        <div class="hud-family">{{ familyStore.family.name }}氏</div>
        <div class="hud-stats">
          <span>第 {{ store.year }} 年 · {{ store.season }}</span>
          <span>声望 {{ familyStore.family.reputation }}</span>
          <span>财富 {{ familyStore.family.wealth }}</span>
          <span>族人 {{ aliveCount }}</span>
        </div>
      </div>

      <div class="hud-top-right">
        <button class="hud-btn" @click="showSidebar = !showSidebar">
          {{ showSidebar ? '收起' : '族务' }}
        </button>
        <button class="hud-btn" @click="showTree = true">族谱</button>
        <button
          class="hud-btn hud-btn-season"
          :class="{ blocked: hasPendingEvents }"
          :disabled="hasPendingEvents"
          @click="handleNextTurn"
        >
          {{ hasPendingEvents ? `待处理 ${store.pendingEvents.length}` : '过一季' }}
        </button>
      </div>

      <transition name="sidebar-slide">
        <div class="sidebar-drawer" v-if="showSidebar">
          <div class="sidebar-inner">
            <ChieftainPanel />
            <div class="divider" />
            <BirthPanel />
            <MemberList :selected-id="selectedMemberId" @select="selectedMemberId = $event" />
          </div>
        </div>
      </transition>
    </template>

    <Teleport to="body">
      <FamilyTree v-if="showTree" @close="showTree = false" />
      <EventModal
        v-if="currentEvent"
        :event="currentEvent"
        :current="eventIndex + 1"
        :total="store.pendingEvents.length + eventIndex"
        @resolve="handleResolve"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/game'
import { useFamilyStore } from '@/stores/family'
import WorldMap from './WorldMap.vue'
import MemberList from './family/MemberList.vue'
import BirthPanel from './family/BirthPanel.vue'
import ChieftainPanel from './family/ChieftainPanel.vue'
import FamilyTree from './family/FamilyTree.vue'
import EventModal from './EventModal.vue'

const store = useGameStore()
const familyStore = useFamilyStore()

const selectedMemberId = ref<string | null>(null)
const showTree = ref(false)
const showSidebar = ref(false)
const eventIndex = ref(0)

const aliveCount = computed(() => familyStore.family.members.filter((m) => m.alive).length)
const hasPendingEvents = computed(() => store.pendingEvents.length > 0)
const currentEvent = computed(() => store.pendingEvents[0] ?? null)

function handleNextTurn() {
  if (hasPendingEvents.value) return
  eventIndex.value = 0
  store.advanceSeason()
}

function handleResolve(eventId: string, choiceIndex: number) {
  eventIndex.value++
  store.resolveEvent(eventId, choiceIndex)
}

function onGameStarted() {
  showSidebar.value = false
}
</script>

<style scoped>
.game-root {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: 'Noto Serif SC', 'SimSun', serif;
}

.hud-top-left {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;
  z-index: 10;
}

.hud-family {
  font-size: 22px;
  color: #f0d9b5;
  letter-spacing: 3px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.8);
}

.hud-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #8a9aba;
  background: rgba(6, 13, 26, 0.7);
  padding: 5px 12px;
  border-radius: 4px;
  border: 1px solid #1a2a3a;
}

.hud-top-right {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.hud-btn {
  padding: 8px 16px;
  background: rgba(6, 13, 26, 0.85);
  border: 1px solid #2a4a6a;
  border-radius: 4px;
  color: #8ab8d8;
  font-size: 13px;
  font-family: 'Noto Serif SC', serif;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  backdrop-filter: blur(4px);
}

.hud-btn:hover {
  background: rgba(20, 40, 70, 0.9);
  border-color: #4a8ab8;
  color: #d0e8f8;
}

.hud-btn-season {
  background: rgba(30, 20, 5, 0.9);
  border-color: #8a6020;
  color: #c8a060;
  font-weight: 700;
  letter-spacing: 1px;
}

.hud-btn-season:hover:not(.blocked) {
  background: rgba(50, 35, 8, 0.95);
  border-color: #c8a040;
  color: #f0c060;
}

.hud-btn-season.blocked {
  background: rgba(20, 30, 40, 0.85);
  border-color: #2a3a4a;
  color: #4a6a7a;
  cursor: default;
}

.sidebar-drawer {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background: rgba(8, 15, 30, 0.95);
  border-left: 1px solid #1a2a4a;
  z-index: 20;
  backdrop-filter: blur(10px);
  overflow-y: auto;
}

.sidebar-inner {
  padding: 16px;
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-inner::-webkit-scrollbar { width: 4px; }
.sidebar-inner::-webkit-scrollbar-thumb {
  background: #2a3a5a;
  border-radius: 2px;
}

.divider {
  height: 1px;
  background: #1a2a3a;
}

.sidebar-slide-enter-active { transition: transform 0.25s ease; }
.sidebar-slide-leave-active { transition: transform 0.2s ease; }
.sidebar-slide-enter-from   { transform: translateX(100%); }
.sidebar-slide-leave-to     { transform: translateX(100%); }
</style>
