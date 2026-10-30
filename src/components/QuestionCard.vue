<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionsStore } from '../stores/questions'
import { categoryMeta, difficultyMeta } from '../data/taxonomy'

const props = defineProps({
  question: { type: Object, required: true }
})

const store = useQuestionsStore()
const router = useRouter()

const cat = computed(() => categoryMeta(props.question.category))
const diff = computed(() => difficultyMeta(props.question.difficulty))
const prog = computed(() => store.getProgress(props.question.id))

function open() {
  router.push({ name: 'question-detail', params: { id: props.question.id } })
}

function toggleBookmark(e) {
  e.stopPropagation()
  store.toggleBookmark(props.question.id)
}

const statusLabel = computed(() => {
  const s = prog.value.status
  if (s === 'solved') return { text: 'Solved', cls: 'st-solved' }
  if (s === 'attempted') return { text: 'Attempted', cls: 'st-attempted' }
  if (s === 'review') return { text: 'Review', cls: 'st-review' }
  return null
})

const lastOpened = computed(() => {
  const ts = prog.value.lastVisited
  if (!ts) return null
  const diff = Date.now() - ts
  const day = Math.floor(diff / 86400000)
  if (day >= 1) return `${day}d ago`
  const hr = Math.floor(diff / 3600000)
  if (hr >= 1) return `${hr}h ago`
  const min = Math.floor(diff / 60000)
  if (min >= 1) return `${min}m ago`
  return 'just now'
})
</script>

<template>
  <div class="q-card card" @click="open">
    <div class="q-card-top">
      <div class="top-badges">
        <span class="badge" :class="cat.badge">{{ question.category }}</span>
        <span v-if="question.core100" class="badge badge-core">🎯 Core 100 · {{ question.core100Set }}</span>
        <span v-else-if="question.recommended" class="badge badge-rec">⭐ Recommended</span>
      </div>
      <button
        class="bookmark"
        :class="{ active: prog.bookmarked }"
        :title="prog.bookmarked ? 'Remove bookmark' : 'Bookmark'"
        @click="toggleBookmark"
      >
        {{ prog.bookmarked ? '★' : '☆' }}
      </button>
    </div>
    <h3 class="q-title">{{ question.title }}</h3>
    <p class="q-excerpt">{{ question.statement }}</p>
    <div class="q-card-bottom">
      <span class="badge badge-pattern">{{ question.pattern }}</span>
      <span class="badge" :class="diff.badge">{{ question.difficulty }}</span>
      <span v-if="statusLabel" class="status-dot" :class="statusLabel.cls">{{ statusLabel.text }}</span>
    </div>
    <div v-if="lastOpened || prog.attempts" class="q-meta">
      <span v-if="lastOpened">🕑 {{ lastOpened }}</span>
      <span v-if="prog.attempts">· {{ prog.attempts }} attempt{{ prog.attempts === 1 ? '' : 's' }}</span>
    </div>
  </div>
</template>

<style scoped>
.q-card {
  padding: 16px;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.1s;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}

.q-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.q-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.top-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.badge-rec {
  background: rgba(224, 166, 60, 0.15);
  color: var(--amber);
}

.badge-core {
  background: rgba(53, 194, 138, 0.15);
  color: var(--green);
}

.bookmark {
  background: none;
  border: none;
  color: var(--text-dim);
  font-size: 18px;
  line-height: 1;
  padding: 0;
}

.bookmark.active {
  color: var(--amber);
}

.q-title {
  font-size: 16px;
  font-weight: 650;
}

.q-excerpt {
  color: var(--text-dim);
  font-size: 13px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.q-card-bottom {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  margin-top: auto;
}

.status-dot {
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
}

.st-solved {
  color: var(--green);
}
.st-attempted {
  color: var(--amber);
}
.st-review {
  color: var(--purple);
}

.q-meta {
  display: flex;
  gap: 6px;
  font-size: 11px;
  color: var(--text-dim);
}
</style>
