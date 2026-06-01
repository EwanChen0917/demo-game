<template>
  <div class="exam-panel">
    <h3 class="section-title">科举</h3>

    <div v-if="!member" class="empty-tip">
      请先在左侧选择一名族人
    </div>

    <template v-else>
      <div class="target-name">{{ member.name }}</div>

      <div class="progress-bar">
        <div
          v-for="(stage, i) in stages"
          :key="stage"
          class="progress-step"
          :class="{
            done: stageIdx(member.examStage) > i,
            current: stageIdx(member.examStage) === i,
          }"
        >
          {{ stage }}
        </div>
      </div>

      <div class="pass-rate-row">
        <span class="label">通过率</span>
        <span class="value" :class="rateClass">{{ passRate }}%</span>
      </div>

      <div v-if="member.examCooldown > 0" class="cooldown-block">
        下次可考：{{ member.examCooldown }} 年后
      </div>
      <div v-else-if="stageIdx(member.examStage) >= stages.length - 1" class="cooldown-block">
        已达最高功名
      </div>
      <button v-else class="btn-exam" @click="doExam">参加科举</button>

      <transition name="result-fade">
        <div
          v-if="lastResult"
          class="result-block"
          :class="lastResult.success ? 'result-success' : 'result-fail'"
        >
          {{ lastResult.message }}
        </div>
      </transition>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFamilyStore, EXAM_STAGES, type ExamStage, type ExamResult } from '@/stores/family'

const props = defineProps<{ selectedId: string | null }>()

const familyStore = useFamilyStore()

const member = computed(() =>
  props.selectedId ? familyStore.family.members.find((m) => m.id === props.selectedId) ?? null : null,
)

const stages = EXAM_STAGES.filter((s) => s !== '未参考')

function stageIdx(stage: ExamStage): number {
  return EXAM_STAGES.indexOf(stage)
}

const passRate = computed(() => {
  if (!member.value) return 0
  const m = member.value
  const idx = stageIdx(m.examStage)
  if (idx >= EXAM_STAGES.length - 1) return 0
  const base = [80, 60, 40, 25, 10][idx] ?? 5
  const wenBonus = Math.floor((m.wenCai - 50) * 0.4)
  const luckBonus = Math.floor((m.luck - 50) * 0.2)
  return Math.min(95, Math.max(5, base + wenBonus + luckBonus))
})

const rateClass = computed(() => {
  if (passRate.value >= 60) return 'rate-high'
  if (passRate.value >= 30) return 'rate-mid'
  return 'rate-low'
})

const lastResult = ref<ExamResult | null>(null)

function doExam() {
  if (!props.selectedId) return
  lastResult.value = null
  const result = familyStore.takeExam(props.selectedId)
  lastResult.value = result
}
</script>

<style scoped>
.exam-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  font-size: 13px;
  color: #8a7a6a;
}

.empty-tip {
  font-size: 13px;
  color: #5a5a6a;
  text-align: center;
  padding: 12px 0;
}

.target-name {
  font-size: 15px;
  color: #f0d9b5;
  text-align: center;
}

.progress-bar {
  display: flex;
  gap: 2px;
}

.progress-step {
  flex: 1;
  text-align: center;
  font-size: 11px;
  padding: 3px 0;
  border-radius: 2px;
  background: #1a2a4a;
  color: #5a6a7a;
  border: 1px solid #2a3a5a;
}

.progress-step.done {
  background: #1a3a2a;
  color: #6fdb7a;
  border-color: #2a5a3a;
}

.progress-step.current {
  background: #3a2a10;
  color: #f0c040;
  border-color: #6a4a20;
}

.pass-rate-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.label { color: #8a7a6a; }

.rate-high { color: #6fdb7a; }
.rate-mid  { color: #f0c040; }
.rate-low  { color: #f07060; }

.cooldown-block {
  text-align: center;
  font-size: 12px;
  color: #8a7a6a;
  padding: 8px 0;
}

.btn-exam {
  width: 100%;
  padding: 9px 0;
  background: #2a4a8a;
  color: #c8d8f8;
  border: 1px solid #3a5aaa;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-exam:hover { background: #3a5aaa; }
.btn-exam:active { background: #1a3a7a; }

.result-block {
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.5;
}

.result-success {
  background: #1a3a2a;
  color: #6fdb7a;
  border: 1px solid #2a5a3a;
}

.result-fail {
  background: #3a1a1a;
  color: #f07060;
  border: 1px solid #5a2a2a;
}

.result-fade-enter-active { transition: opacity 0.3s; }
.result-fade-enter-from   { opacity: 0; }
</style>
