<template>
  <div v-if="hasContent" class="birth-panel">
    <h3 class="section-title">家族动态</h3>

    <transition-group name="event-fade" tag="div" class="events-list">
      <div
        v-for="(evt, i) in seasonEvents"
        :key="i"
        class="event-item"
        :class="evt.type === 'birth' ? 'event-birth' : evt.type === 'death' ? 'event-death' : 'event-chieftain'"
      >
        <span class="event-icon">{{ iconFor(evt.type) }}</span>
        <span class="event-text">{{ evt.message }}</span>
      </div>
    </transition-group>

    <div v-if="pregnant.length > 0" class="pregnancy-list">
      <div
        v-for="m in pregnant"
        :key="m.id"
        class="pregnancy-item"
      >
        <span class="preg-name">{{ m.name }}</span>
        <span class="preg-status">怀孕中，还有 {{ m.pregnancySeasons }} 季</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFamilyStore, type SeasonEvent } from '@/stores/family'

const familyStore = useFamilyStore()

const seasonEvents = computed(() => familyStore.seasonEvents)

const pregnant = computed(() =>
  familyStore.family.members.filter((m) => m.alive && m.pregnancySeasons > 0),
)

const hasContent = computed(() =>
  seasonEvents.value.length > 0 || pregnant.value.length > 0,
)

function iconFor(type: SeasonEvent['type']): string {
  if (type === 'birth') return '🎉'
  if (type === 'death') return '🕯'
  return '👑'
}
</script>

<style scoped>
.birth-panel {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 12px;
  border-bottom: 1px solid #2a3a5a;
}

.section-title {
  font-size: 13px;
  color: #8a7a6a;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.event-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 7px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
}

.event-birth {
  background: #1a3a2a;
  border: 1px solid #2a5a3a;
  color: #8fdb9a;
}

.event-death {
  background: #2a1a2a;
  border: 1px solid #4a2a4a;
  color: #b8a8c8;
}

.event-chieftain {
  background: #2a2a1a;
  border: 1px solid #5a4a20;
  color: #f0c040;
}

.event-icon {
  flex-shrink: 0;
  font-size: 13px;
}

.event-text {
  flex: 1;
}

.pregnancy-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pregnancy-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 8px;
  background: #1a2a3a;
  border-radius: 4px;
  border: 1px solid #2a3a5a;
}

.preg-name {
  font-size: 12px;
  color: #f0d9b5;
}

.preg-status {
  font-size: 11px;
  color: #c8a96e;
}

.event-fade-enter-active {
  transition: all 0.35s ease;
}
.event-fade-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
