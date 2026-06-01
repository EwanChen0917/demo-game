<template>
  <div class="marriage-panel">
    <div v-if="!candidate" class="intro">
      <p class="intro-tip">为 {{ member.name }} 物色佳偶</p>
      <button class="btn-propose" @click="generate">物色候选</button>
    </div>

    <div v-else class="candidate-view">
      <div class="candidate-card">
        <div class="cand-header">
          <span class="cand-name">{{ candidate.name }}</span>
          <span class="cand-meta">{{ candidate.gender }} · {{ candidate.age }}岁</span>
        </div>
        <div class="cand-attrs">
          <span>文 {{ candidate.wenCai }}</span>
          <span>武 {{ candidate.wuLi }}</span>
          <span>运 {{ candidate.luck }}</span>
        </div>
      </div>

      <div class="cand-actions">
        <button class="btn-confirm" @click="confirm">迎娶 / 嫁入</button>
        <button class="btn-reroll" @click="generate">换一位</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFamilyStore, type FamilyMember, type MarriageCandidate } from '@/stores/family'

const props = defineProps<{ member: FamilyMember }>()
const emit = defineEmits<{ done: [] }>()

const familyStore = useFamilyStore()
const candidate = ref<MarriageCandidate | null>(null)

function generate() {
  candidate.value = familyStore.generateCandidate(props.member.id)
}

function confirm() {
  if (!candidate.value) return
  familyStore.confirmMarriage(props.member.id, candidate.value)
  candidate.value = null
  emit('done')
}
</script>

<style scoped>
.marriage-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.intro {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}

.intro-tip {
  font-size: 12px;
  color: #8a9aba;
}

.btn-propose {
  width: 100%;
  padding: 7px 0;
  background: #2a1a3a;
  color: #d090e0;
  border: 1px solid #5a2a7a;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-propose:hover { background: #3a2a5a; }

.candidate-card {
  padding: 8px 10px;
  background: #1a1a2e;
  border: 1px solid #4a2a6a;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.cand-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cand-name {
  font-size: 14px;
  color: #f0d9b5;
}

.cand-meta {
  font-size: 11px;
  color: #8a7a6a;
}

.cand-attrs {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #b8a88a;
}

.cand-actions {
  display: flex;
  gap: 6px;
}

.btn-confirm {
  flex: 1;
  padding: 7px 0;
  background: #1a3a2a;
  color: #6fdb7a;
  border: 1px solid #2a6a3a;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-confirm:hover { background: #2a5a3a; }

.btn-reroll {
  padding: 7px 12px;
  background: #1a2a4a;
  color: #8a9aba;
  border: 1px solid #2a3a5a;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-reroll:hover { background: #1f3a6a; }
</style>
