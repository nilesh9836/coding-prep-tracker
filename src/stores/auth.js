import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Demo auth: any username, shared password "123456789".
// The logged-in user is persisted to a file via the local server when it's
// running (src/data/users.json), and mirrored to localStorage as a fallback
// so plain `npm run dev` (no server) still keeps you logged in.

const SHARED_PASSWORD = '123456789'
const LS_KEY = 'swpct_user_v1'

function readLocalUser() {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeLocalUser(user) {
  if (typeof localStorage === 'undefined') return
  try {
    if (user) localStorage.setItem(LS_KEY, JSON.stringify(user))
    else localStorage.removeItem(LS_KEY)
  } catch {
    /* ignore */
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(readLocalUser())
  const ready = ref(false) // becomes true after we've checked the server session

  const isAuthed = computed(() => !!user.value)
  const username = computed(() => (user.value ? user.value.username : ''))
  const initials = computed(() => {
    const name = username.value.trim()
    if (!name) return '?'
    const parts = name.split(/[\s._-]+/).filter(Boolean)
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name.slice(0, 2).toUpperCase()
  })

  // A deterministic color per username so avatars look stable and distinct.
  const avatarColor = computed(() => {
    const name = username.value || '?'
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
    const hue = hash % 360
    return `hsl(${hue}, 60%, 45%)`
  })

  // Confirm the session from the server on startup (if server is running).
  async function init() {
    try {
      const res = await fetch('/api/session')
      if (res.ok) {
        const body = await res.json()
        if (body.user) {
          user.value = body.user
          writeLocalUser(body.user)
        } else if (user.value) {
          // server says logged out -> clear local
          user.value = null
          writeLocalUser(null)
        }
      }
    } catch {
      /* server not running -> keep localStorage user */
    } finally {
      ready.value = true
    }
  }

  async function login(name, password) {
    const trimmed = String(name || '').trim()
    if (!trimmed) return { ok: false, error: 'Please enter a username.' }
    if (password !== SHARED_PASSWORD) return { ok: false, error: 'Incorrect password.' }

    // Try the server first (persists to file); fall back to local-only.
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmed, password })
      })
      if (res.ok) {
        const body = await res.json()
        user.value = body.user
        writeLocalUser(body.user)
        return { ok: true }
      }
      if (res.status === 401) return { ok: false, error: 'Incorrect password.' }
    } catch {
      /* server down -> local fallback below */
    }

    const local = { username: trimmed, loginAt: Date.now() }
    user.value = local
    writeLocalUser(local)
    return { ok: true }
  }

  async function logout() {
    try {
      await fetch('/api/logout', { method: 'POST' })
    } catch {
      /* ignore */
    }
    user.value = null
    writeLocalUser(null)
  }

  return { user, ready, isAuthed, username, initials, avatarColor, init, login, logout }
})
