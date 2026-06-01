<template>
  <div class="chieftain-panel">
    <div class="chieftain-header">
      <h3 class="section-title">族长</h3>
    </div>

    <div v-if="needsSelection" class="needs-selection">
      <p class="selection-tip">族长已故，请指定新任族长</p>
      <div
        v-for="m in eligible"
        :key="m.id"
        class="candidate-card"
        @click="familyStore.setChieftain(m.id)"
      >
        <span class="candidate-name">{{ m.name }}</span>
        <span class="candidate-info">{{ m.age }}岁 · 文{{ m.wenCai }} 武{{ m.wuLi }}</span>
      </div>
    </div>

    <div v-else-if="chieftain" class="chieftain-info">
      <div class="chieftain-name">
        <span class="crown">♛</span>
        <span>{{ chieftain.name }}</span>
      </div>
      <div class="chieftain-attrs">
        <span>文 {{ chieftain.wenCai }}</span>
        <span>武 {{ chieftain.wuLi }}</span>
        <span>{{ chieftain.age }}岁</span>
      </div>
      <div class="bonus-row">
        <span class="bonus-label">科举加成</span>
        <span class="bonus-val">+{{ bonus.wenCai }}</span>
      </div>
    </div>

    <div v-else class="empty-tip">暂无族长</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFamilyStore } from '@/stores/family'

const familyStore = useFamilyStore()

const chieftain = computed(() => familyStore.chieftain())
const bonus = computed(() => familyStore.chieftainBonus())
const needsSelection = computed(() => familyStore.needsChieftainSelection)
const eligible = computed(() => familyStore.eligibleChieftains())
</script>

<style scoped>
.chieftain-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  font-size: 13px;
  color: #8a7a6a;
}

.needs-selection {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.selection-tip {
  font-size: 12px;
  color: #c87a50;
  text-align: center;
}

.candidate-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 10px;
  background: #1a2a4a;
  border: 1px solid #3a5a8a;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.candidate-card:hover {
  border-color: #c8a96e;
  background: #1f3060;
}

.candidate-name {
  font-size: 13px;
  color: #f0d9b5;
}

.candidate-info {
  font-size: 11px;
  color: #8a9aba;
}

.chieftain-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  background: #1a2a1a;
  border: 1px solid #3a5a3a;
  border-radius: 4px;
}

.chieftain-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  color: #f0d9b5;
}

.crown {
  color: #f0c040;
  font-size: 16px;
}

.chieftain-attrs {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #b8a88a;
}

.bonus-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding-top: 4px;
  border-top: 1px solid #2a4a2a;
}

.bonus-label {
  color: #8a9a8a;
}

.bonus-val {
  color: #6fdb7a;
}

.empty-tip {
  font-size: 12px;
  color: #5a5a6a;
  text-align: center;
  padding: 8px 0;
}
</style>
