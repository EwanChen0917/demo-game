<template>
  <div class="game-layout">
    <div ref="phaserContainer" class="phaser-layer" />
    <div class="ui-sidebar">
      <div class="sidebar-scroll">
        <InfoPanel />
        <div class="divider" />
        <ChieftainPanel />
        <div class="divider" />
        <BirthPanel />
        <MemberList :selected-id="selectedMemberId" @select="selectedMemberId = $event" />
      </div>
      <div class="sidebar-footer">
        <button class="btn-tree" @click="showTree = true">族谱</button>
        <button
          class="btn-season"
          :class="{ blocked: hasPendingEvents }"
          :disabled="hasPendingEvents"
          @click="handleNextTurn"
        >
          {{ hasPendingEvents ? `待处理 ${store.pendingEvents.length}` : '过一季' }}
        </button>
      </div>
    </div>

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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Phaser from 'phaser'
import { createGame } from '@/game'
import { useGameStore } from '@/stores/game'
import InfoPanel from './InfoPanel.vue'
import MemberList from './family/MemberList.vue'
import BirthPanel from './family/BirthPanel.vue'
import ChieftainPanel from './family/ChieftainPanel.vue'
import FamilyTree from './family/FamilyTree.vue'
import EventModal from './EventModal.vue'

const phaserContainer = ref<HTMLDivElement>()
let game: Phaser.Game | null = null

const store = useGameStore()
const selectedMemberId = ref<string | null>(null)
const showTree = ref(false)
const eventIndex = ref(0)

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

onMounted(() => {
  if (phaserContainer.value) {
    game = createGame(phaserContainer.value)
  }
})

onUnmounted(() => {
  if (game) {
    game.destroy(true)
    game = null
  }
})
</script>

<style scoped>
.game-layout {
  display: flex;
  width: 100%;
  height: 100%;
}

.phaser-layer {
  flex: 1;
  min-width: 0;
}

.ui-sidebar {
  width: 280px;
  background: #16213e;
  border-left: 1px solid #2a3a5a;
  display: flex;
  flex-direction: column;
}

.sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-scroll::-webkit-scrollbar { width: 4px; }
.sidebar-scroll::-webkit-scrollbar-thumb {
  background: #2a3a5a;
  border-radius: 2px;
}

.divider {
  height: 1px;
  background: #2a3a5a;
}

.sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid #2a3a5a;
  display: flex;
  gap: 8px;
}

.btn-tree {
  flex: 0 0 72px;
  padding: 10px 0;
  background: #1a2a4a;
  color: #c8a96e;
  border: 1px solid #3a5a8a;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.btn-tree:hover { background: #1f3a6a; border-color: #c8a96e; }

.btn-season {
  flex: 1;
  padding: 10px 0;
  background: #c8a96e;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}

.btn-season:hover:not(.blocked)  { background: #dab97e; }
.btn-season:active:not(.blocked) { background: #b8985e; }

.btn-season.blocked {
  background: #3a4a5a;
  color: #8a9aba;
  cursor: default;
  opacity: 0.8;
}
</style>
