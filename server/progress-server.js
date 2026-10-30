// Tiny zero-dependency local server that persists progress to a real file on
// disk (src/data/progress.json). This is what makes bookmarking / status
// changes update the file automatically — browsers cannot write files directly.
//
// Run alongside Vite:  node server/progress-server.js   (or: npm run server)
// The Vite dev server proxies /api/* to this (see vite.config.js).

import { createServer } from 'node:http'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = resolve(__dirname, '../src/data/progress.json')
const USERS_FILE = resolve(__dirname, '../src/data/users.json')
const PORT = process.env.PROGRESS_PORT ? Number(process.env.PROGRESS_PORT) : 5123

// Shared password for every user (demo auth as requested).
const SHARED_PASSWORD = '123456789'

const EMPTY = { progress: {} }

async function readProgress() {
  try {
    const text = await readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(text)
    if (parsed && typeof parsed === 'object') {
      return { progress: parsed.progress || {} }
    }
  } catch {
    /* missing or corrupt -> empty */
  }
  return EMPTY
}

async function writeProgress(state) {
  const safe = { progress: (state && state.progress) || {} }
  await mkdir(dirname(DATA_FILE), { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(safe, null, 2) + '\n', 'utf8')
  return safe
}

async function readUsers() {
  try {
    const text = await readFile(USERS_FILE, 'utf8')
    const parsed = JSON.parse(text)
    if (parsed && typeof parsed === 'object') {
      return { currentUser: parsed.currentUser || null, users: parsed.users || [] }
    }
  } catch {
    /* missing or corrupt -> empty */
  }
  return { currentUser: null, users: [] }
}

async function writeUsers(state) {
  const safe = {
    currentUser: (state && state.currentUser) || null,
    users: (state && Array.isArray(state.users)) ? state.users : []
  }
  await mkdir(dirname(USERS_FILE), { recursive: true })
  await writeFile(USERS_FILE, JSON.stringify(safe, null, 2) + '\n', 'utf8')
  return safe
}

function sendJson(res, status, body) {
  const text = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  })
  res.end(text)
}

const server = createServer(async (req, res) => {
  const url = (req.url || '').split('?')[0]

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {})
    return
  }

  if (url === '/api/progress' && req.method === 'GET') {
    const state = await readProgress()
    sendJson(res, 200, state)
    return
  }

  if (url === '/api/progress' && req.method === 'POST') {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > 5_000_000) req.destroy() // basic guard
    })
    req.on('end', async () => {
      try {
        const body = JSON.parse(raw || '{}')
        const saved = await writeProgress(body)
        sendJson(res, 200, { ok: true, count: Object.keys(saved.progress).length })
      } catch {
        sendJson(res, 400, { ok: false, error: 'Invalid JSON body' })
      }
    })
    return
  }

  // ---- Auth / session ----
  // Returns the currently logged-in user (persisted in users.json), or null.
  if (url === '/api/session' && req.method === 'GET') {
    const state = await readUsers()
    sendJson(res, 200, { user: state.currentUser })
    return
  }

  if (url === '/api/login' && req.method === 'POST') {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > 100_000) req.destroy()
    })
    req.on('end', async () => {
      try {
        const body = JSON.parse(raw || '{}')
        const username = String(body.username || '').trim()
        const password = String(body.password || '')
        if (!username) {
          sendJson(res, 400, { ok: false, error: 'Username is required.' })
          return
        }
        if (password !== SHARED_PASSWORD) {
          sendJson(res, 401, { ok: false, error: 'Incorrect password.' })
          return
        }
        const state = await readUsers()
        const user = { username, loginAt: Date.now() }
        // keep a roster of everyone who has logged in (unique by username)
        const users = state.users.filter((u) => u.username !== username)
        users.push({ username, lastLogin: user.loginAt })
        await writeUsers({ currentUser: user, users })
        sendJson(res, 200, { ok: true, user })
      } catch {
        sendJson(res, 400, { ok: false, error: 'Invalid JSON body' })
      }
    })
    return
  }

  if (url === '/api/logout' && req.method === 'POST') {
    const state = await readUsers()
    await writeUsers({ currentUser: null, users: state.users })
    sendJson(res, 200, { ok: true })
    return
  }

  sendJson(res, 404, { ok: false, error: 'Not found' })
})

server.listen(PORT, () => {
  console.log(`[progress-server] writing to ${DATA_FILE}`)
  console.log(`[progress-server] listening on http://localhost:${PORT}`)
})
