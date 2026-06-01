<template>
  <div class="info-panel">
    <h2 class="panel-title">{{ familyStore.family.name }}家</h2>

    <section class="info-section">
      <div class="info-row">
        <span class="label">年份</span>
        <span class="value">第 {{ gameStore.year }} 年 · {{ gameStore.season }}</span>
      </div>
      <div class="info-row">
        <span class="label">财富</span>
        <span class="value">{{ familyStore.family.wealth }} 金</span>
      </div>
      <div class="info-row">
        <span class="label">声望</span>
        <span class="value">{{ familyStore.family.reputation }}</span>
      </div>
      <div class="info-row">
        <span class="label">族人</span>
        <span class="value">{{ familyStore.family.members.length }} 人</span>
      </div>
      <div class="info-row">
        <span class="label">选中地块</span>
        <span class="value">({{ gameStore.selectedTile.x }}, {{ gameStore.selectedTile.y }})</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useFamilyStore } from '@/stores/family'

const gameStore = useGameStore()
const familyStore = useFamilyStore()
</script>

<style scoped>
.info-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-title {
  font-size: 20px;
  color: #f0d9b5;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #2a3a5a;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  font-size: 14px;
  color: #b8a88a;
  margin-bottom: 4px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.label {
  color: #8a7a6a;
}

.value {
  color: #f0d9b5;
}
</style>
