<template>
  <div class="event-overlay">
    <div class="event-card">
      <div class="event-header">
        <span class="event-category">{{ event.category }}</span>
        <span class="event-count" v-if="total > 1">{{ current }} / {{ total }}</span>
      </div>

      <h2 class="event-title">{{ event.title }}</h2>
      <p class="event-desc">{{ event.description }}</p>

      <div class="choices">
        <button
          v-for="(choice, i) in event.choices"
          :key="i"
          class="choice-btn"
          @click="emit('resolve', event.id, i)"
        >
          <span class="choice-label">{{ choice.label }}</span>
          <span v-if="choice.preview" class="choice-preview">{{ choice.preview }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameEvent } from '@/data/events'

defineProps<{
  event: GameEvent
  current: number
  total: number
}>()

const emit = defineEmits<{
  resolve: [eventId: string, choiceIndex: number]
}>()
</script>

<style scoped>
.event-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.event-card {
  width: 480px;
  max-width: 90vw;
  background: #0e1628;
  border: 1px solid #3a5a8a;
  border-radius: 8px;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-category {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 12px;
  background: #1a2a4a;
  color: #8a9aba;
  border: 1px solid #2a3a5a;
}

.event-count {
  font-size: 12px;
  color: #5a6a7a;
}

.event-title {
  font-size: 22px;
  color: #f0d9b5;
  line-height: 1.3;
}

.event-desc {
  font-size: 14px;
  color: #b8a88a;
  line-height: 1.8;
  border-left: 2px solid #2a4a6a;
  padding-left: 12px;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.choice-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  padding: 12px 16px;
  background: #1a2a4a;
  border: 1px solid #2a4a7a;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, border-color 0.15s;
}

.choice-btn:hover {
  background: #1f3a6a;
  border-color: #c8a96e;
}

.choice-btn:active {
  background: #162a50;
}

.choice-label {
  font-size: 14px;
  color: #f0d9b5;
}

.choice-preview {
  font-size: 12px;
  color: #6a9a8a;
}
</style>
