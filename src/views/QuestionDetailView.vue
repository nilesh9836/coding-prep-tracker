<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionsStore } from '../stores/questions'
import { categoryMeta, difficultyMeta } from '../data/taxonomy'
import CodeBlock from '../components/CodeBlock.vue'

const props = defineProps({ id: { type: String, required: true } })

const store = useQuestionsStore()
const router = useRouter()

const q = computed(() => store.getById(props.id))
const cat = computed(() => (q.value ? categoryMeta(q.value.category) : null))
const diff = computed(() => (q.value ? difficultyMeta(q.value.difficulty) : null))
const prog = computed(() => store.getProgress(props.id))

const revealedHints = ref(0)
const showSolution = ref(false)

// Record a visit when the question is opened or navigated to.
onMounted(() => {
  if (q.value) store.recordVisit(props.id)
})

// reset reveal state + record a visit when navigating between questions
watch(
  () => props.id,
  (id) => {
    revealedHints.value = 0
    showSolution.value = false
    if (store.getById(id)) store.recordVisit(id)
  }
)

function setStatus(s) {
  store.setStatus(props.id, s)
}

function recordAttempt() {
  store.recordAttempt(props.id)
}

function recordSolve(withHelp) {
  store.recordSolve(props.id, withHelp)
}

// "2 hours ago" style relative time.
function relativeTime(ts) {
  if (!ts) return 'never'
  const diff = Date.now() - ts
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return 'just now'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} min ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day} day${day === 1 ? '' : 's'} ago`
  return new Date(ts).toLocaleDateString()
}

function fullTime(ts) {
  return ts ? new Date(ts).toLocaleString() : ''
}
</script>

<template>
  <div v-if="q" class="detail">
    <button class="btn btn-ghost back" @click="router.push({ name: 'questions' })">← Back to list</button>

    <div class="head">
      <div class="head-badges">
        <span class="badge" :class="cat.badge">{{ q.category }}</span>
        <span class="badge badge-pattern">{{ q.pattern }}</span>
        <span class="badge" :class="diff.badge">{{ q.difficulty }}</span>
        <span v-if="q.core100" class="badge badge-core-detail">🎯 Core 100 · {{ q.core100Set }}</span>
        <span v-else-if="q.recommended" class="badge badge-rec-detail">⭐ Recommended</span>
      </div>
      <button
        class="bookmark"
        :class="{ active: prog.bookmarked }"
        @click="store.toggleBookmark(q.id)"
      >
        {{ prog.bookmarked ? '★ Bookmarked' : '☆ Bookmark' }}
      </button>
    </div>

    <h1 class="q-title">{{ q.title }}</h1>

    <div class="status-row">
      <button class="pill" :class="{ on: prog.status === 'solved' }" @click="setStatus('solved')">✓ Solved</button>
      <button class="pill" :class="{ on: prog.status === 'attempted' }" @click="setStatus('attempted')">◴ Attempted</button>
      <button class="pill" :class="{ on: prog.status === 'review' }" @click="setStatus('review')">⟳ To review</button>
    </div>

    <div class="activity card">
      <div class="activity-stats">
        <div class="stat-item" :title="fullTime(prog.lastVisited)">
          <span class="stat-k">Last opened</span>
          <span class="stat-v">{{ relativeTime(prog.lastVisited) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-k">Opened</span>
          <span class="stat-v">{{ prog.visits }}×</span>
        </div>
        <div class="stat-item">
          <span class="stat-k">Attempts</span>
          <span class="stat-v">{{ prog.attempts }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-k">Solved on own</span>
          <span class="stat-v green">{{ prog.solvedOwn }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-k">Solved with help</span>
          <span class="stat-v amber">{{ prog.solvedHelp }}</span>
        </div>
      </div>
      <div class="activity-actions">
        <button class="btn" @click="recordAttempt">+1 Attempt</button>
        <button class="btn btn-primary" @click="recordSolve(false)">✓ Solved on my own</button>
        <button class="btn" @click="recordSolve(true)">✓ Solved with help</button>
      </div>
    </div>

    <section class="block">
      <h2>Problem</h2>
      <p class="statement">{{ q.statement }}</p>
      <CodeBlock v-if="q.codeSnippet" :code="q.codeSnippet" />
    </section>

    <section v-if="q.references && q.references.length" class="block">
      <h2>Practice & references</h2>
      <div class="refs">
        <a
          v-for="(ref, i) in q.references"
          :key="i"
          class="ref-link"
          :href="ref.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="ref-source">{{ ref.source }}</span>
          <span class="ref-label">{{ ref.label }}</span>
          <span class="ref-arrow">↗</span>
        </a>
      </div>
    </section>

    <section v-if="q.examples && q.examples.length" class="block">
      <h2>Examples</h2>
      <div v-for="(ex, i) in q.examples" :key="i" class="example">
        <div><strong>Input:</strong> <code>{{ ex.input }}</code></div>
        <div><strong>Output:</strong> <code>{{ ex.output }}</code></div>
        <div v-if="ex.explanation" class="ex-expl"><strong>Explanation:</strong> {{ ex.explanation }}</div>
      </div>
    </section>

    <section v-if="q.constraints && q.constraints.length" class="block">
      <h2>Constraints</h2>
      <ul class="constraints">
        <li v-for="(c, i) in q.constraints" :key="i"><code>{{ c }}</code></li>
      </ul>
    </section>

    <section v-if="q.hints && q.hints.length" class="block">
      <h2>Hints</h2>
      <div v-for="(h, i) in q.hints" :key="i">
        <div v-if="i < revealedHints" class="hint">💡 {{ h }}</div>
      </div>
      <button
        v-if="revealedHints < q.hints.length"
        class="btn"
        @click="revealedHints++"
      >
        Reveal hint {{ revealedHints + 1 }} of {{ q.hints.length }}
      </button>
    </section>

    <section class="block">
      <h2>Solution</h2>
      <button v-if="!showSolution" class="btn btn-primary" @click="showSolution = true">
        Show solution
      </button>
      <div v-else class="solution">
        <p v-if="q.approach" class="approach">{{ q.approach }}</p>
        <CodeBlock v-if="q.solution" :code="q.solution" language="java" />
        <div v-if="q.complexity" class="complexity">
          <span><strong>Time:</strong> {{ q.complexity.time }}</span>
          <span><strong>Space:</strong> {{ q.complexity.space }}</span>
        </div>
        <button class="btn btn-ghost" @click="showSolution = false">Hide solution</button>
      </div>
    </section>
  </div>

  <div v-else class="empty-state">
    <span class="emoji">🫥</span>
    Question not found.
    <div style="margin-top: 16px">
      <button class="btn" @click="router.push({ name: 'questions' })">Back to list</button>
    </div>
  </div>
</template>

<style scoped>
.detail {
  max-width: 100%;
  margin: 0;
}

.back {
  margin-bottom: 16px;
  padding-left: 0;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.head-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge-rec-detail {
  background: rgba(224, 166, 60, 0.15);
  color: var(--amber);
}

.badge-core-detail {
  background: rgba(53, 194, 138, 0.15);
  color: var(--green);
}

.bookmark {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-dim);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
}

.bookmark.active {
  color: var(--amber);
  border-color: var(--amber);
}

.q-title {
  font-size: 26px;
  font-weight: 750;
  margin: 14px 0 16px;
}

.status-row {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.activity {
  padding: 16px;
  margin-bottom: 24px;
}

.activity-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  margin-bottom: 14px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-k {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--text-dim);
}

.stat-v {
  font-size: 18px;
  font-weight: 700;
}

.stat-v.green {
  color: var(--green);
}

.stat-v.amber {
  color: var(--amber);
}

.activity-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

.pill {
  background: var(--bg-elev2);
  border: 1px solid var(--border);
  color: var(--text-dim);
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
}

.pill.on {
  background: var(--accent-dim);
  color: var(--text);
  border-color: var(--accent);
}

.block {
  margin-bottom: 28px;
}

.block h2 {
  font-size: 16px;
  margin-bottom: 12px;
  color: var(--text);
}

.statement {
  white-space: pre-wrap;
  color: var(--text);
}

.refs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ref-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  transition: border-color 0.15s, background 0.15s;
}

.ref-link:hover {
  border-color: var(--accent);
  background: var(--bg-elev2);
}

.ref-source {
  font-weight: 700;
  color: var(--accent);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.ref-label {
  color: var(--text);
}

.ref-arrow {
  color: var(--text-dim);
}

.example {
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
  margin-bottom: 10px;
  font-size: 14px;
}

.example code {
  background: var(--bg-elev2);
  padding: 2px 6px;
  border-radius: 5px;
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 13px;
}

.ex-expl {
  margin-top: 6px;
  color: var(--text-dim);
}

.constraints {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.constraints code {
  background: var(--bg-elev);
  border: 1px solid var(--border);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
}

.hint {
  background: rgba(224, 166, 60, 0.08);
  border: 1px solid rgba(224, 166, 60, 0.3);
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 8px;
  font-size: 14px;
}

.approach {
  margin-bottom: 14px;
  white-space: pre-wrap;
}

.complexity {
  display: flex;
  gap: 20px;
  margin: 14px 0;
  font-size: 14px;
  color: var(--text-dim);
}
</style>
