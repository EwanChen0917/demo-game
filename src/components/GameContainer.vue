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
  color: #2a1a08;
  letter-spacing: 3px;
  text-shadow: 0 1px 4px rgba(232, 220, 190, 0.8);
}

.hud-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #5a3a1a;
  background: rgba(232, 220, 190, 0.88);
  padding: 5px 12px;
  border-radius: 4px;
  border: 1px solid #b09060;
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
  background: rgba(232, 220, 190, 0.92);
  border: 1px solid #b09060;
  border-radius: 3px;
  color: #3a2010;
  font-size: 13px;
  font-family: 'Noto Serif SC', serif;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  letter-spacing: 1px;
  box-shadow: 1px 1px 6px rgba(60, 30, 10, 0.2);
}

.hud-btn:hover {
  background: rgba(220, 200, 160, 0.98);
  border-color: #8a5020;
  color: #1a0a00;
}

.hud-btn-season {
  background: #8b1a0a;
  border-color: #c84020;
  color: #ffe8c0;
  font-weight: 700;
  letter-spacing: 2px;
}

.hud-btn-season:hover:not(.blocked) {
  background: #a02010;
  border-color: #e05030;
  color: #fff0d0;
}

.hud-btn-season.blocked {
  background: rgba(139, 96, 48, 0.2);
  border-color: #b09060;
  color: #8a7a5a;
  cursor: default;
}

.sidebar-drawer {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background: rgba(232, 220, 190, 0.97);
  border-left: 2px solid #b09060;
  z-index: 20;
  overflow-y: auto;
  box-shadow: -4px 0 20px rgba(60, 30, 10, 0.25);
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
