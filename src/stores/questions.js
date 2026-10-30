import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import rawQuestions from '../data/questions.json'
import {
  loadState,
  loadStateAsync,
  saveState,
  saveRemote,
  isServerAvailable,
  clearState,
  downloadState,
  parseImportedText
} from '../services/storage'

export const useQuestionsStore = defineStore('questions', () => {
  // ---- Question bank (static, decoupled from code) ----
  const questions = ref(rawQuestions)

  // ---- Persisted user state ----
  // Synchronous seed first (localStorage / bundled file) so the UI has data
  // immediately, then refresh from the file server if it's running.
  const persisted = loadState()
  const progress = ref(persisted.progress)

  // Whether the file-persistence server is active (shown in the UI).
  const serverActive = ref(false)

  // Pull authoritative state from the server on startup (if available).
  loadStateAsync().then(({ state, source }) => {
    serverActive.value = source === 'server' || isServerAvailable() === true
    if (source === 'server') {
      progress.value = state.progress
    }
  })

  // Persist on any progress change: localStorage immediately (cache) +
  // the file server (debounced) so src/data/progress.json updates on disk.
  let remoteTimer = null
  watch(
    progress,
    (val) => {
      const snapshot = { progress: val }
      saveState(snapshot) // localStorage (sync, always)
      if (remoteTimer) clearTimeout(remoteTimer)
      remoteTimer = setTimeout(async () => {
        const ok = await saveRemote(snapshot) // writes the real file
        serverActive.value = ok
      }, 400)
    },
    { deep: true }
  )

  // ---- Filters ----
  const filters = ref({
    search: '',
    category: '',
    pattern: '',
    difficulty: '',
    status: '', // '', 'solved', 'attempted', 'review', 'bookmarked', 'unsolved'
    recommended: false,
    core100: false,
    core100Set: '' // '', 'Foundation', 'Core', 'Capstone'
  })

  function resetFilters() {
    filters.value = {
      search: '', category: '', pattern: '', difficulty: '',
      status: '', recommended: false, core100: false, core100Set: ''
    }
  }

  // ---- Derived ----
  const patternsInBank = computed(() => {
    const set = new Set(questions.value.map((q) => q.pattern))
    return [...set].sort()
  })

  // All bookmarked questions (independent of the main filter bar).
  const bookmarkedQuestions = computed(() =>
    questions.value.filter((q) => {
      const p = progress.value[q.id]
      return p && p.bookmarked
    })
  )

  const filtered = computed(() => {
    const f = filters.value
    const term = f.search.trim().toLowerCase()
    const list = questions.value.filter((q) => {
      if (f.recommended && !q.recommended) return false
      if (f.core100 && !q.core100) return false
      if (f.core100Set && q.core100Set !== f.core100Set) return false
      if (f.category && q.category !== f.category) return false
      if (f.pattern && q.pattern !== f.pattern) return false
      if (f.difficulty && q.difficulty !== f.difficulty) return false
      if (f.status) {
        const p = progress.value[q.id]
        if (f.status === 'bookmarked' && !(p && p.bookmarked)) return false
        if (f.status === 'unsolved' && p && p.status === 'solved') return false
        if (['solved', 'attempted', 'review'].includes(f.status)) {
          if (!p || p.status !== f.status) return false
        }
      }
      if (term) {
        const hay = (q.title + ' ' + q.statement + ' ' + (q.tags || []).join(' ')).toLowerCase()
        if (!hay.includes(term)) return false
      }
      return true
    })
    // When viewing the Core 100, show them in their curated order.
    if (filters.value.core100) {
      return [...list].sort((a, b) => (a.core100Order || 0) - (b.core100Order || 0))
    }
    return list
  })

  // ---- Progress helpers ----
  const PROGRESS_DEFAULT = {
    status: null,
    bookmarked: false,
    lastVisited: null, // timestamp of the last time the question was opened
    visits: 0, // how many times opened
    attempts: 0, // how many times attempted
    solvedOwn: 0, // solved without help
    solvedHelp: 0 // solved with help (hints / solution)
  }

  function getProgress(id) {
    return { ...PROGRESS_DEFAULT, ...(progress.value[id] || {}) }
  }

  function setEntry(id, patch) {
    const cur = { ...PROGRESS_DEFAULT, ...(progress.value[id] || {}) }
    progress.value = {
      ...progress.value,
      [id]: { ...cur, ...patch, updatedAt: Date.now() }
    }
  }

  function setStatus(id, status) {
    const cur = getProgress(id)
    // toggle off if clicking the same status
    const next = cur.status === status ? null : status
    setEntry(id, { status: next })
  }

  // Record that the question was opened (bumps visit count + last-visited time).
  // Guard against double-counting from component remounts / HMR / reactive churn:
  // a given question counts at most one visit per 2 seconds.
  const lastVisitRecorded = {}
  function recordVisit(id) {
    const now = Date.now()
    if (lastVisitRecorded[id] && now - lastVisitRecorded[id] < 2000) return
    lastVisitRecorded[id] = now
    const cur = getProgress(id)
    setEntry(id, { visits: cur.visits + 1, lastVisited: now })
  }

  // Increment the attempt counter.
  function recordAttempt(id) {
    const cur = getProgress(id)
    setEntry(id, { attempts: cur.attempts + 1 })
  }

  // Mark a solve. withHelp=false -> solved on your own; true -> used hints/solution.
  // Also sets status to 'solved'.
  function recordSolve(id, withHelp = false) {
    const cur = getProgress(id)
    setEntry(id, {
      status: 'solved',
      solvedOwn: cur.solvedOwn + (withHelp ? 0 : 1),
      solvedHelp: cur.solvedHelp + (withHelp ? 1 : 0)
    })
  }

  function toggleBookmark(id) {
    const cur = getProgress(id)
    setEntry(id, { bookmarked: !cur.bookmarked })
  }

  function resetProgress() {
    progress.value = {}
    clearState()
    saveRemote({ progress: {} }).then((ok) => {
      serverActive.value = ok
    })
  }

  // ---- Export / Import (dual store: localStorage <-> text file) ----
  function exportProgress() {
    downloadState({ progress: progress.value })
  }

  // Accepts the raw text of a progress .json file.
  // mode: 'replace' (default) overwrites; 'merge' keeps existing + adds imported.
  function importProgress(text, mode = 'replace') {
    const parsed = parseImportedText(text)
    if (!parsed) return { ok: false, error: 'Not a valid progress file.' }

    if (mode === 'merge') {
      progress.value = { ...progress.value, ...parsed.progress }
    } else {
      progress.value = parsed.progress
    }
    saveState({ progress: progress.value })
    // also push the imported state to the file server if it's running
    saveRemote({ progress: progress.value }).then((ok) => {
      serverActive.value = ok
    })
    return { ok: true, count: Object.keys(parsed.progress).length }
  }

  // ---- Stats ----
  const stats = computed(() => {
    const total = questions.value.length
    let solved = 0
    let attempted = 0
    let review = 0
    let bookmarked = 0
    let recommended = 0
    let core100 = 0
    let solvedOwn = 0
    let solvedHelp = 0
    let totalAttempts = 0
    const core100Sets = { Foundation: { total: 0, solved: 0 }, Core: { total: 0, solved: 0 }, Capstone: { total: 0, solved: 0 } }
    const byCategory = {}
    const byPattern = {}

    for (const q of questions.value) {
      if (q.recommended) recommended++
      if (q.core100) {
        core100++
        const bucket = core100Sets[q.core100Set]
        if (bucket) {
          bucket.total++
          if (progress.value[q.id] && progress.value[q.id].status === 'solved') bucket.solved++
        }
      }
      byCategory[q.category] = byCategory[q.category] || { total: 0, solved: 0 }
      byPattern[q.pattern] = byPattern[q.pattern] || { total: 0, solved: 0 }
      byCategory[q.category].total++
      byPattern[q.pattern].total++

      const p = progress.value[q.id]
      if (!p) continue
      if (p.bookmarked) bookmarked++
      solvedOwn += p.solvedOwn || 0
      solvedHelp += p.solvedHelp || 0
      totalAttempts += p.attempts || 0
      if (p.status === 'solved') {
        solved++
        byCategory[q.category].solved++
        byPattern[q.pattern].solved++
      } else if (p.status === 'attempted') attempted++
      else if (p.status === 'review') review++
    }

    return { total, solved, attempted, review, bookmarked, recommended, core100, core100Sets, solvedOwn, solvedHelp, totalAttempts, byCategory, byPattern }
  })

  function getById(id) {
    return questions.value.find((q) => q.id === id) || null
  }

  return {
    questions,
    filters,
    filtered,
    bookmarkedQuestions,
    patternsInBank,
    resetFilters,
    getProgress,
    setStatus,
    recordVisit,
    recordAttempt,
    recordSolve,
    toggleBookmark,
    resetProgress,
    exportProgress,
    importProgress,
    serverActive,
    stats,
    getById
  }
})
