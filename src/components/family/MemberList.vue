<template>
  <div class="member-list">
    <h3 class="section-title">族人（{{ aliveCount }} 在世）</h3>

    <div
      v-for="m in familyStore.family.members"
      :key="m.id"
      class="member-row"
      :class="{
        selected: selectedId === m.id,
        deceased: !m.alive,
      }"
      @click="m.alive && emit('select', m.id)"
    >
      <div class="row-main">
        <span class="row-name">
          <span v-if="m.id === familyStore.chieftainId" class="crown">♛</span>
          {{ m.name }}
          <span class="gender-tag">{{ m.gender }}</span>
        </span>
        <span class="row-badges">
          <span class="stage-badge" :class="stageBadgeClass(m.examStage)">
            {{ m.examStage === '未参考' ? '白身' : m.examStage }}
          </span>
          <span v-if="m.pregnancySeasons > 0" class="preg-badge">孕</span>
        </span>
        <span class="row-age" :class="{ aging: isAging(m) }">
          {{ m.alive ? `${m.age}岁` : '已故' }}
        </span>
      </div>

      <transition name="expand">
        <div v-if="selectedId === m.id && m.alive" class="row-detail">
          <div class="detail-attrs">
            <span>文 {{ m.wenCai }}</span>
            <span>武 {{ m.wuLi }}</span>
            <span>运 {{ m.luck }}</span>
            <span v-if="m.officialId" class="rank-text">{{ rankName(m.officialId) }}</span>
          </div>

          <div class="exam-section">
            <div class="exam-progress">
              <span
                v-for="(stage, i) in examDisplayStages"
                :key="stage"
                class="exam-step"
                :class="{
                  done: examIdx(m.examStage) > i,
                  current: examIdx(m.examStage) === i,
                }"
              >{{ stage }}</span>
            </div>
            <div class="exam-rate-row">
              <span class="rate-label">通过率</span>
              <span class="rate-val" :class="rateClass(m)">{{ passRate(m) }}%</span>
            </div>
            <div v-if="m.examCooldown > 0" class="cooldown-tip">
              冷却 {{ m.examCooldown }} 年
            </div>
            <div v-else-if="examIdx(m.examStage) >= EXAM_STAGES.length - 1" class="cooldown-tip">
              已达最高功名
            </div>
            <button v-else class="btn-exam" @click.stop="doExam(m.id)">参加科举</button>
            <transition name="result-fade">
              <div v-if="examResults[m.id]" class="exam-result" :class="examResults[m.id]!.success ? 'result-ok' : 'result-fail'">
                {{ examResults[m.id]!.message }}
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useFamilyStore, EXAM_STAGES, type ExamStage, type FamilyMember, type ExamResult } from '@/stores/family'
import { OFFICIAL_RANKS, MILITARY_RANKS } from '@/data/officials'

defineProps<{ selectedId: string | null }>()
const emit = defineEmits<{ select: [id: string] }>()

const familyStore = useFamilyStore()
const allRanks = [...OFFICIAL_RANKS, ...MILITARY_RANKS]
const examResults = reactive<Record<string, ExamResult | null>>({})
const examDisplayStages = EXAM_STAGES.filter((s) => s !== '未参考')

const aliveCount = computed(() => familyStore.family.members.filter((m) => m.alive).length)

function isAging(m: FamilyMember): boolean {
  return m.alive && m.age >= m.lifespan - 10
}

function rankName(officialId: string): string {
  return allRanks.find((r) => r.id === officialId)?.description ?? ''
}

function examIdx(stage: ExamStage): number {
  return EXAM_STAGES.indexOf(stage)
}

function passRate(m: FamilyMember): number {
  const idx = examIdx(m.examStage)
  if (idx >= EXAM_STAGES.length - 1) return 0
  const base = [80, 60, 40, 25, 10][idx] ?? 5
  const wenBonus = Math.floor((m.wenCai - 50) * 0.4)
  const luckBonus = Math.floor((m.luck - 50) * 0.2)
  const chieftainBonus = familyStore.chieftainBonus().wenCai
  return Math.min(95, Math.max(5, base + wenBonus + luckBonus + chieftainBonus))
}

function rateClass(m: FamilyMember): string {
  const r = passRate(m)
  if (r >= 60) return 'rate-high'
  if (r >= 30) return 'rate-mid'
  return 'rate-low'
}

function doExam(id: string) {
  examResults[id] = null
  examResults[id] = familyStore.takeExam(id)
}

function stageBadgeClass(stage: ExamStage): string {
  const map: Record<ExamStage, string> = {
    未参考: 'badge-white',
    童生: 'badge-white',
    秀才: 'badge-green',
    举人: 'badge-blue',
    进士: 'badge-gold',
    状元: 'badge-red',
  }
  return map[stage]
}
</script>

<style scoped>
.member-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-size: 13px;
  color: #8a7a6a;
  margin-bottom: 4px;
}

.member-row {
  border-radius: 4px;
  border: 1px solid #2a3a5a;
  background: #1a2a4a;
  overflow: hidden;
  transition: border-color 0.15s;
}

.member-row:not(.deceased) {
  cursor: pointer;
}

.member-row:hover:not(.deceased) {
  border-color: #4a6a9a;
}

.member-row.selected {
  border-color: #c8a96e;
  background: #1a2a4a;
}

.member-row.deceased {
  opacity: 0.4;
}

.row-main {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
}

.row-name {
  flex: 1;
  font-size: 13px;
  color: #f0d9b5;
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.crown {
  color: #f0c040;
  font-size: 12px;
}

.gender-tag {
  font-size: 10px;
  padding: 0 3px;
  border-radius: 2px;
  background: #2a3a5a;
  color: #8a9aba;
  flex-shrink: 0;
}

.row-badges {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.stage-badge {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
}

.badge-white { background: #3a3a4a; color: #b8a88a; }
.badge-green { background: #1a4a2a; color: #6fdb7a; }
.badge-blue  { background: #1a2a5a; color: #6aacf0; }
.badge-gold  { background: #4a3a10; color: #f0c040; }
.badge-red   { background: #4a1a1a; color: #f07060; }

.preg-badge {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
  background: #2a1a3a;
  color: #d090e0;
}

.row-age {
  font-size: 11px;
  color: #8a7a6a;
  flex-shrink: 0;
}

.row-age.aging {
  color: #c87a50;
}

.row-detail {
  padding: 0 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid #2a3a5a;
}

.detail-attrs {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #b8a88a;
  padding-top: 8px;
}

.rank-text {
  color: #c8a96e;
}

.exam-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.exam-progress {
  display: flex;
  gap: 2px;
}

.exam-step {
  flex: 1;
  text-align: center;
  font-size: 10px;
  padding: 2px 0;
  border-radius: 2px;
  background: #1a2a4a;
  color: #5a6a7a;
  border: 1px solid #2a3a5a;
}

.exam-step.done {
  background: #1a3a2a;
  color: #6fdb7a;
  border-color: #2a5a3a;
}

.exam-step.current {
  background: #3a2a10;
  color: #f0c040;
  border-color: #6a4a20;
}

.exam-rate-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.rate-label { color: #8a7a6a; }
.rate-high  { color: #6fdb7a; }
.rate-mid   { color: #f0c040; }
.rate-low   { color: #f07060; }

.cooldown-tip {
  font-size: 11px;
  color: #8a7a6a;
  text-align: center;
}

.btn-exam {
  width: 100%;
  padding: 7px 0;
  background: #2a4a8a;
  color: #c8d8f8;
  border: 1px solid #3a5aaa;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-exam:hover  { background: #3a5aaa; }
.btn-exam:active { background: #1a3a7a; }

.exam-result {
  padding: 6px 8px;
  border-radius: 3px;
  font-size: 12px;
  line-height: 1.4;
}

.result-ok   { background: #1a3a2a; color: #6fdb7a; border: 1px solid #2a5a3a; }
.result-fail { background: #3a1a1a; color: #f07060; border: 1px solid #5a2a2a; }

.expand-enter-active { transition: all 0.2s ease; }
.expand-enter-from   { opacity: 0; transform: translateY(-4px); }

.result-fade-enter-active { transition: opacity 0.3s; }
.result-fade-enter-from   { opacity: 0; }
</style>
