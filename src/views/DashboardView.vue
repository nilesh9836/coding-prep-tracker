<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionsStore } from '../stores/questions'
import { categoryMeta } from '../data/taxonomy'

const store = useQuestionsStore()
const router = useRouter()
const s = computed(() => store.stats)

// ---- Export / Import ----
const fileInput = ref(null)
const importMsg = ref('')

function exportProgress() {
  store.exportProgress()
  importMsg.value = 'Progress downloaded as a .json file.'
}

function triggerImport() {
  importMsg.value = ''
  if (fileInput.value) fileInput.value.click()
}

function onImportFile(e) {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const result = store.importProgress(String(reader.result), 'replace')
    importMsg.value = result.ok
      ? `Imported ${result.count} question${result.count === 1 ? '' : 's'} of progress.`
      : result.error
  }
  reader.onerror = () => {
    importMsg.value = 'Could not read that file.'
  }
  reader.readAsText(file)
  e.target.value = '' // allow re-importing the same file
}

const pct = computed(() => (s.value.total ? Math.round((s.value.solved / s.value.total) * 100) : 0))

function openWithStatus(status) {
  store.resetFilters()
  store.filters.status = status
  router.push({ name: 'questions' })
}

function openRecommended() {
  store.resetFilters()
  store.filters.recommended = true
  router.push({ name: 'questions' })
}

function openCore100(set) {
  store.resetFilters()
  store.filters.core100 = true
  if (set) store.filters.core100Set = set
  router.push({ name: 'questions' })
}

function openWithCategory(cat) {
  store.resetFilters()
  store.filters.category = cat
  router.push({ name: 'questions' })
}

function openWithPattern(p) {
  store.resetFilters()
  store.filters.pattern = p
  router.push({ name: 'questions' })
}

function barPct(entry) {
  return entry.total ? Math.round((entry.solved / entry.total) * 100) : 0
}

const patternRows = computed(() =>
  Object.entries(s.value.byPattern)
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.total - a.total)
)

function resetAll() {
  if (confirm('Reset all progress and bookmarks? This cannot be undone.')) {
    store.resetProgress()
  }
}
</script>

<template>
  <div>
    <h1 class="page-title">Dashboard</h1>
    <p class="page-sub">Your SWPCT practice progress</p>

    <div class="stat-grid">
      <div class="stat card" @click="router.push({ name: 'questions' })">
        <div class="stat-num">{{ s.total }}</div>
        <div class="stat-label">Total questions</div>
      </div>
      <div class="stat card clickable" @click="openWithStatus('solved')">
        <div class="stat-num green">{{ s.solved }}</div>
        <div class="stat-label">Solved</div>
      </div>
      <div class="stat card clickable" @click="openWithStatus('attempted')">
        <div class="stat-num amber">{{ s.attempted }}</div>
        <div class="stat-label">Attempted</div>
      </div>
      <div class="stat card clickable" @click="openWithStatus('review')">
        <div class="stat-num purple">{{ s.review }}</div>
        <div class="stat-label">To review</div>
      </div>
      <div class="stat card clickable" @click="router.push({ name: 'bookmarks' })">
        <div class="stat-num amber">{{ s.bookmarked }}</div>
        <div class="stat-label">★ Bookmarked</div>
      </div>
      <div class="stat card clickable" @click="openRecommended()">
        <div class="stat-num amber">{{ s.recommended }}</div>
        <div class="stat-label">⭐ Recommended</div>
      </div>
      <div class="stat card clickable" @click="openCore100()">
        <div class="stat-num green">{{ s.core100 }}</div>
        <div class="stat-label">🎯 Core 100</div>
      </div>
    </div>

    <div class="progress-wrap card">
      <div class="progress-head">
        <span>Overall completion</span>
        <strong>{{ pct }}%</strong>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: pct + '%' }"></div>
      </div>
      <div class="solve-breakdown">
        <span>🟢 Solved on own: <strong>{{ s.solvedOwn }}</strong></span>
        <span>🟡 Solved with help: <strong>{{ s.solvedHelp }}</strong></span>
        <span>🔁 Total attempts: <strong>{{ s.totalAttempts }}</strong></span>
      </div>
    </div>

    <section class="card panel core100-panel">
      <h2 class="panel-title">🎯 Core 100 progress</h2>
      <div class="core-sets">
        <div
          v-for="setName in ['Foundation', 'Core', 'Capstone']"
          :key="setName"
          class="row clickable"
          @click="openCore100(setName)"
        >
          <div class="row-head">
            <span class="pattern-name">{{ setName }}</span>
            <span class="row-count">{{ s.core100Sets[setName].solved }}/{{ s.core100Sets[setName].total }}</span>
          </div>
          <div class="progress-track sm">
            <div class="progress-fill" :style="{ width: barPct(s.core100Sets[setName]) + '%' }"></div>
          </div>
        </div>
      </div>
    </section>

    <div class="cols">
      <section class="card panel">
        <h2 class="panel-title">By category</h2>
        <div
          v-for="(v, name) in s.byCategory"
          :key="name"
          class="row clickable"
          @click="openWithCategory(name)"
        >
          <div class="row-head">
            <span class="badge" :class="categoryMeta(name).badge">{{ name }}</span>
            <span class="row-count">{{ v.solved }}/{{ v.total }}</span>
          </div>
          <div class="progress-track sm">
            <div class="progress-fill" :style="{ width: barPct(v) + '%' }"></div>
          </div>
        </div>
      </section>

      <section class="card panel">
        <h2 class="panel-title">By pattern</h2>
        <div class="pattern-scroll">
          <div
            v-for="row in patternRows"
            :key="row.name"
            class="row clickable"
            @click="openWithPattern(row.name)"
          >
            <div class="row-head">
              <span class="pattern-name">{{ row.name }}</span>
              <span class="row-count">{{ row.solved }}/{{ row.total }}</span>
            </div>
            <div class="progress-track sm">
              <div class="progress-fill" :style="{ width: barPct(row) + '%' }"></div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <section class="card panel data-panel">
      <h2 class="panel-title">Backup & restore</h2>
      <p class="server-status" :class="store.serverActive ? 'on' : 'off'">
        <span class="dot"></span>
        <template v-if="store.serverActive">
          File auto-save is ON — changes write to <code>src/data/progress.json</code> automatically.
        </template>
        <template v-else>
          File auto-save is OFF — using localStorage only. Run <code>npm run dev:all</code> to enable
          automatic writes to <code>src/data/progress.json</code>.
        </template>
      </p>
      <p class="data-hint">
        Progress is cached in this browser's localStorage. Export it to a text (.json) file to keep a
        copy, and import that file on another browser or after clearing data. On first load with no saved
        progress, the app seeds itself from the bundled <code>src/data/progress.json</code> file.
      </p>
      <div class="data-actions">
        <button class="btn" @click="exportProgress">⬇ Export to file</button>
        <button class="btn" @click="triggerImport">⬆ Import from file</button>
        <input
          ref="fileInput"
          type="file"
          accept="application/json,.json"
          class="hidden-input"
          @change="onImportFile"
        />
      </div>
      <p v-if="importMsg" class="data-msg">{{ importMsg }}</p>
    </section>

    <div class="danger-zone">
      <button class="btn btn-ghost" @click="resetAll">Reset all progress</button>
    </div>
  </div>
</template>

<style scoped>
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.stat {
  padding: 18px;
  text-align: center;
}

.stat.clickable,
.row.clickable {
  cursor: pointer;
}

.stat.clickable:hover {
  border-color: var(--accent);
}

.stat-num {
  font-size: 30px;
  font-weight: 750;
}

.stat-num.green {
  color: var(--green);
}
.stat-num.amber {
  color: var(--amber);
}
.stat-num.purple {
  color: var(--purple);
}

.stat-label {
  color: var(--text-dim);
  font-size: 13px;
  margin-top: 4px;
}

.progress-wrap {
  padding: 18px;
  margin-bottom: 20px;
}

.solve-breakdown {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 14px;
  font-size: 13px;
  color: var(--text-dim);
}

.solve-breakdown strong {
  color: var(--text);
}

.progress-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.progress-track {
  background: var(--bg-elev2);
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.progress-track.sm {
  height: 6px;
}

.progress-fill {
  background: linear-gradient(90deg, var(--accent), var(--green));
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s;
}

.core100-panel {
  margin-bottom: 20px;
}

.core-sets {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 640px) {
  .core-sets {
    grid-template-columns: 1fr;
  }
}

.cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 760px) {
  .cols {
    grid-template-columns: 1fr;
  }
}

.panel {
  padding: 18px;
}

.panel-title {
  font-size: 15px;
  margin-bottom: 14px;
}

.row {
  padding: 8px 6px;
  border-radius: 8px;
}

.row.clickable:hover {
  background: var(--bg-elev2);
}

.row-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 13px;
}

.pattern-name {
  color: var(--text);
}

.row-count {
  color: var(--text-dim);
  font-size: 12px;
}

.pattern-scroll {
  max-height: 360px;
  overflow-y: auto;
}

.data-panel {
  margin-top: 20px;
}

.server-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 12px;
}

.server-status .dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

.server-status.on {
  color: var(--green);
}

.server-status.on .dot {
  background: var(--green);
}

.server-status.off {
  color: var(--text-dim);
}

.server-status.off .dot {
  background: var(--text-dim);
}

.server-status code {
  background: var(--bg-elev2);
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 12px;
}

.data-hint {
  color: var(--text-dim);
  font-size: 13px;
  margin-bottom: 14px;
  line-height: 1.6;
}

.data-hint code {
  background: var(--bg-elev2);
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 12px;
}

.data-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hidden-input {
  display: none;
}

.data-msg {
  margin-top: 12px;
  font-size: 13px;
  color: var(--green);
}

.danger-zone {
  margin-top: 28px;
  text-align: center;
}
</style>
