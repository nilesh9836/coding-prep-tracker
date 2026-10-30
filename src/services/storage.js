// Single point of contact for persistent state.
//
// Three layers, in priority order:
//  1. Local API server (server/progress-server.js) — writes a REAL file on disk
//     at src/data/progress.json. This is what makes bookmarking / status
//     changes update the file automatically. Only available when that server
//     is running (npm run dev:all or npm run server).
//  2. localStorage — fast cache + offline fallback when the server is absent.
//  3. Bundled src/data/progress.json (imported at build time) — seed/fallback
//     for a fresh browser with no saved progress and no server.

import seedFromFile from '../data/progress.json'

const KEY = 'swpct_learning_track_v1'
const API = '/api/progress'

const DEFAULT_STATE = {
  // progress: { [questionId]: {
  //   status,        // 'solved' | 'attempted' | 'review' | null
  //   bookmarked,    // boolean
  //   lastVisited,   // timestamp of last open
  //   visits,        // times opened
  //   attempts,      // times attempted
  //   solvedOwn,     // solved without help
  //   solvedHelp,    // solved with help
  //   updatedAt      // last modification timestamp
  // } }
  progress: {}
}

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') return parsed
  } catch {
    /* ignore corrupt data */
  }
  return null
}

function normalize(obj) {
  if (!obj || typeof obj !== 'object') return structuredClone(DEFAULT_STATE)
  return { ...structuredClone(DEFAULT_STATE), ...obj, progress: obj.progress || {} }
}

function hasProgress(state) {
  return state && state.progress && Object.keys(state.progress).length > 0
}

// ---- localStorage layer ----
export function loadLocal() {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(KEY)
  return raw ? normalize(safeParse(raw)) : null
}

export function saveState(state) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(normalize(state)))
  } catch {
    /* storage full or blocked - fail quietly */
  }
}

export function clearState() {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(KEY)
}

// ---- Server layer (optional; writes the real file) ----
// Returns the server state, or null if the server isn't reachable.
export async function loadRemote() {
  try {
    const res = await fetch(API, { method: 'GET' })
    if (!res.ok) return null
    const body = await res.json()
    return normalize(body)
  } catch {
    return null // server not running -> fall back
  }
}

let serverAvailable = null // null = unknown, true/false once probed

// Persists to the file server. Resolves to true if the write hit the server.
export async function saveRemote(state) {
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalize(state))
    })
    serverAvailable = res.ok
    return res.ok
  } catch {
    serverAvailable = false
    return false
  }
}

export function isServerAvailable() {
  return serverAvailable
}

// ---- Combined initial load ----
// Priority: server file -> localStorage -> bundled seed file -> empty.
// Whatever we settle on is also written back to localStorage as a cache.
export async function loadStateAsync() {
  // 1) Server (real file on disk)
  const remote = await loadRemote()
  if (remote) {
    serverAvailable = true
    saveState(remote)
    return { state: remote, source: 'server' }
  }
  serverAvailable = false

  // 2) localStorage
  const local = loadLocal()
  if (local && hasProgress(local)) {
    return { state: local, source: 'localStorage' }
  }

  // 3) Bundled seed file
  const seed = normalize(seedFromFile)
  if (hasProgress(seed)) {
    saveState(seed)
    return { state: seed, source: 'seedFile' }
  }

  // 4) Empty
  return { state: structuredClone(DEFAULT_STATE), source: 'empty' }
}

// Synchronous fallback (used if something needs state before async resolves).
export function loadState() {
  const local = loadLocal()
  if (local && hasProgress(local)) return local
  const seed = normalize(seedFromFile)
  if (hasProgress(seed)) return seed
  return structuredClone(DEFAULT_STATE)
}

// ---- Export / Import (manual text-file backup) ----
export function exportStateText(state) {
  return JSON.stringify(normalize(state), null, 2)
}

export function downloadState(state) {
  const text = exportStateText(state)
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const stamp = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `swpct-progress-${stamp}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function parseImportedText(text) {
  const parsed = safeParse(text)
  if (!parsed) return null
  return normalize(parsed)
}
