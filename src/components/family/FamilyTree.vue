<template>
  <div class="tree-overlay" @click.self="emit('close')">
    <div class="tree-panel">
      <div class="tree-toolbar">
        <span class="tree-title">{{ familyStore.family.name }}氏族谱</span>
        <button class="btn-close" @click="emit('close')">✕ 关闭</button>
      </div>

      <div class="tree-viewport" ref="viewport">
        <svg
          :width="svgWidth"
          :height="svgHeight"
          class="tree-svg"
        >
          <g>
            <polyline
              v-for="(pl, i) in parentLines"
              :key="`pl${i}`"
              :points="pl.points"
              class="edge-line"
            />
            <line
              v-for="(edge, i) in spouseEdges"
              :key="`se${i}`"
              :x1="edge.x1" :y1="edge.y1"
              :x2="edge.x2" :y2="edge.y2"
              class="spouse-line"
            />
          </g>

          <g
            v-for="node in nodes"
            :key="node.id"
            class="member-node"
            :class="{
              'node-deceased': !node.alive,
              'node-chieftain': node.id === familyStore.chieftainId,
              'node-selected': selectedId === node.id,
              'node-non-clan': !node.isClanMember,
            }"
            :transform="`translate(${node.x}, ${node.y})`"
            @click="selectedId = node.id"
          >
            <rect
              :x="-NODE_W / 2" :y="-NODE_H / 2"
              :width="NODE_W" :height="NODE_H"
              rx="6"
              class="node-rect"
            />
            <text class="crown-text" y="-14" v-if="node.id === familyStore.chieftainId">♛</text>
            <text class="node-name" y="2">{{ node.name }}</text>
            <text class="node-info" y="16">{{ node.age }}岁 · {{ node.gender }}</text>
          </g>
        </svg>
      </div>

      <div v-if="selectedMember" class="member-detail">
        <div class="detail-name">
          <span v-if="selectedMember.id === familyStore.chieftainId" class="crown">♛</span>
          {{ selectedMember.name }}
          <span class="detail-gen">第{{ selectedMember.generation }}代</span>
        </div>
        <div class="detail-attrs">
          <span>文 {{ selectedMember.wenCai }}</span>
          <span>武 {{ selectedMember.wuLi }}</span>
          <span>运 {{ selectedMember.luck }}</span>
          <span>{{ selectedMember.age }} / {{ selectedMember.lifespan }}岁</span>
          <span>{{ selectedMember.examStage === '未参考' ? '白身' : selectedMember.examStage }}</span>
        </div>
        <button
          v-if="canSetChieftain"
          class="btn-set-chieftain"
          @click="setAsChieftain"
        >
          立为族长
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFamilyStore, type FamilyMember } from '@/stores/family'

const emit = defineEmits<{ close: [] }>()

const familyStore = useFamilyStore()
const selectedId = ref<string | null>(null)
const viewport = ref<HTMLDivElement>()

const NODE_W = 90
const NODE_H = 50
const H_GAP = 30
const V_GAP = 90
const PAD = 60

interface NodePos extends FamilyMember {
  x: number
  y: number
}

const nodes = computed<NodePos[]>(() => {
  const members = familyStore.family.members
  if (members.length === 0) return []

  const maxGen = Math.max(...members.map((m) => m.generation))
  const posMap: Record<string, NodePos> = {}

  for (let g = 1; g <= maxGen; g++) {
    const row = members.filter((m) => m.generation === g)
    const y = PAD + (g - 1) * (NODE_H + V_GAP) + NODE_H / 2

    if (g === 1) {
      const coupleGroups: FamilyMember[][] = []
      const placed = new Set<string>()
      row.forEach((m) => {
        if (placed.has(m.id)) return
        placed.add(m.id)
        const spouseInRow = m.spouseIds
          .map((sid) => row.find((r) => r.id === sid))
          .filter(Boolean) as FamilyMember[]
        const group = [m, ...spouseInRow]
        spouseInRow.forEach((s) => placed.add(s.id))
        coupleGroups.push(group)
      })

      let cx = PAD + NODE_W / 2
      coupleGroups.forEach((group) => {
        const groupW = group.length * NODE_W + (group.length - 1) * H_GAP
        group.forEach((m, i) => {
          posMap[m.id] = { ...m, x: cx + i * (NODE_W + H_GAP), y }
        })
        cx += groupW + H_GAP * 3
      })
    } else {
      const parentPairs = new Map<string, { cx: number; children: FamilyMember[] }>()

      row.forEach((child) => {
        const father = child.fatherId ? posMap[child.fatherId] : null
        const mother = child.motherId ? posMap[child.motherId] : null
        const anchor = father && mother
          ? (father.x + mother.x) / 2
          : father?.x ?? mother?.x ?? PAD + NODE_W / 2
        const key = [child.fatherId ?? '', child.motherId ?? ''].join('-')
        if (!parentPairs.has(key)) {
          parentPairs.set(key, { cx: anchor, children: [] })
        }
        parentPairs.get(key)!.children.push(child)
      })

      const sortedPairs = [...parentPairs.values()].sort((a, b) => a.cx - b.cx)

      let minX = PAD + NODE_W / 2
      sortedPairs.forEach((pair) => {
        const count = pair.children.length
        const groupW = count * NODE_W + (count - 1) * H_GAP
        let startX = pair.cx - groupW / 2
        if (startX < minX) startX = minX
        pair.children.forEach((child, i) => {
          posMap[child.id] = { ...child, x: startX + i * (NODE_W + H_GAP) + NODE_W / 2, y }
        })
        minX = startX + groupW + H_GAP * 2
      })
    }
  }

  return Object.values(posMap)
})

const nodeMap = computed(() => {
  const m: Record<string, NodePos> = {}
  nodes.value.forEach((n) => (m[n.id] = n))
  return m
})

interface Edge { x1: number; y1: number; x2: number; y2: number }
interface Polyline { points: string }

const parentLines = computed<Polyline[]>(() => {
  const result: Polyline[] = []
  const members = familyStore.family.members

  const coupleChildMap = new Map<string, string[]>()
  members.forEach((child) => {
    if (!child.fatherId && !child.motherId) return
    const key = [child.fatherId ?? '', child.motherId ?? ''].join('-')
    if (!coupleChildMap.has(key)) coupleChildMap.set(key, [])
    coupleChildMap.get(key)!.push(child.id)
  })

  coupleChildMap.forEach((childIds, key) => {
    const [fId, mId] = key.split('-')
    const father = fId ? nodeMap.value[fId] : null
    const mother = mId ? nodeMap.value[mId] : null
    if (!father && !mother) return

    const anchorX = father && mother ? (father.x + mother.x) / 2 : (father ?? mother)!.x
    const anchorY = (father ?? mother)!.y + NODE_H / 2
    const midY = anchorY + V_GAP / 2

    const childNodes = childIds.map((id) => nodeMap.value[id]).filter(Boolean)
    if (childNodes.length === 0) return

    const leftX = Math.min(...childNodes.map((c) => c.x))
    const rightX = Math.max(...childNodes.map((c) => c.x))

    result.push({ points: `${anchorX},${anchorY} ${anchorX},${midY}` })

    if (childNodes.length > 1) {
      result.push({ points: `${leftX},${midY} ${rightX},${midY}` })
    }

    childNodes.forEach((child) => {
      result.push({ points: `${child.x},${midY} ${child.x},${child.y - NODE_H / 2}` })
    })
  })

  return result
})

const spouseEdges = computed<Edge[]>(() => {
  const seen = new Set<string>()
  const result: Edge[] = []
  nodes.value.forEach((n) => {
    n.spouseIds.forEach((sid) => {
      const key = [n.id, sid].sort().join('-')
      if (seen.has(key)) return
      seen.add(key)
      const spouse = nodeMap.value[sid]
      if (!spouse) return
      const left = n.x < spouse.x ? n : spouse
      const right = n.x < spouse.x ? spouse : n
      result.push({
        x1: left.x + NODE_W / 2, y1: left.y,
        x2: right.x - NODE_W / 2, y2: right.y,
      })
    })
  })
  return result
})

const svgWidth = computed(() => {
  if (nodes.value.length === 0) return 600
  const maxX = Math.max(...nodes.value.map((n) => n.x + NODE_W / 2))
  return Math.max(600, maxX + PAD)
})

const svgHeight = computed(() => {
  if (nodes.value.length === 0) return 400
  const maxY = Math.max(...nodes.value.map((n) => n.y + NODE_H / 2))
  return Math.max(400, maxY + PAD)
})

const selectedMember = computed(() =>
  selectedId.value ? familyStore.family.members.find((m) => m.id === selectedId.value) ?? null : null,
)

const canSetChieftain = computed(() => {
  const m = selectedMember.value
  return m && m.alive && m.isClanMember && m.age >= 16 && m.id !== familyStore.chieftainId
})

function setAsChieftain() {
  if (selectedId.value) familyStore.setChieftain(selectedId.value)
}
</script>

<style scoped>
.tree-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.tree-panel {
  width: 90vw;
  height: 85vh;
  background: #0e1628;
  border: 1px solid #2a3a5a;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tree-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #2a3a5a;
  flex-shrink: 0;
}

.tree-title {
  font-size: 18px;
  color: #f0d9b5;
}

.btn-close {
  padding: 5px 14px;
  background: transparent;
  border: 1px solid #4a5a7a;
  border-radius: 4px;
  color: #8a9aba;
  cursor: pointer;
  font-size: 13px;
  transition: border-color 0.15s, color 0.15s;
}

.btn-close:hover {
  border-color: #c8a96e;
  color: #f0d9b5;
}

.tree-viewport {
  flex: 1;
  overflow: auto;
  padding: 8px;
}

.tree-svg {
  display: block;
}

.edge-line {
  stroke: #2a4a6a;
  stroke-width: 1.5;
  fill: none;
}

.spouse-line {
  stroke: #4a3a6a;
  stroke-width: 1;
  stroke-dasharray: 4 3;
}

.member-node {
  cursor: pointer;
}

.node-rect {
  fill: #1a2a4a;
  stroke: #2a4a7a;
  stroke-width: 1.5;
  transition: fill 0.15s, stroke 0.15s;
}

.member-node:hover .node-rect {
  fill: #1f3a6a;
  stroke: #c8a96e;
}

.node-selected .node-rect {
  fill: #1f3a6a;
  stroke: #c8a96e;
  stroke-width: 2;
}

.node-chieftain .node-rect {
  stroke: #f0c040;
  stroke-width: 2;
}

.node-deceased .node-rect {
  fill: #141820;
  stroke: #2a2a3a;
  opacity: 0.5;
}

.node-non-clan .node-rect {
  fill: #1a1a2e;
  stroke: #3a2a4a;
}

.crown-text {
  fill: #f0c040;
  font-size: 13px;
  text-anchor: middle;
  dominant-baseline: middle;
}

.node-name {
  fill: #f0d9b5;
  font-size: 13px;
  text-anchor: middle;
  dominant-baseline: middle;
}

.node-deceased .node-name {
  fill: #5a5a6a;
}

.node-info {
  fill: #8a9aba;
  font-size: 10px;
  text-anchor: middle;
  dominant-baseline: middle;
}

.member-detail {
  flex-shrink: 0;
  padding: 12px 20px;
  border-top: 1px solid #2a3a5a;
  display: flex;
  align-items: center;
  gap: 24px;
}

.detail-name {
  font-size: 16px;
  color: #f0d9b5;
  display: flex;
  align-items: center;
  gap: 6px;
}

.crown {
  color: #f0c040;
}

.detail-gen {
  font-size: 12px;
  color: #8a7a6a;
}

.detail-attrs {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #b8a88a;
}

.btn-set-chieftain {
  margin-left: auto;
  padding: 6px 16px;
  background: #2a3a1a;
  border: 1px solid #4a6a2a;
  border-radius: 4px;
  color: #9fdb7a;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s;
}

.btn-set-chieftain:hover {
  background: #3a5a2a;
}
</style>
