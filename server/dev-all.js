// Launches the progress file-server and the Vite dev server together, so one
// command gives you automatic progress.json persistence. Cross-platform, no
// extra dependencies.
//
// Run: npm run dev:all

import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function run(name, args) {
  const child = spawn(npmCmd, ['run', ...args], {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  })
  child.on('exit', (code) => {
    console.log(`[dev:all] "${name}" exited with code ${code}`)
    process.exit(code ?? 0)
  })
  return child
}

const server = run('server', ['server'])
const vite = run('vite', ['dev'])

function shutdown() {
  server.kill()
  vite.kill()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
