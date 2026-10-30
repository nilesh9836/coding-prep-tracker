// Builds src/data/questions.json from the curated seed + parameterized families.
// Run: node scripts/generate.js
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { seed } from './questions-seed.js'
import { families, titleThemes } from './families.js'
import { recommendedRows, SLUG_OVERRIDES, PATTERN_BLURB } from './recommended.js'
import { core100Rows, SLUG_OVERRIDES as CORE_SLUG_OVERRIDES } from './core100.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = resolve(__dirname, '../src/data/questions.json')

const questions = []
let counter = 0
let themeIdx = 0

function nextId() {
  counter += 1
  return 'q' + String(counter).padStart(3, '0')
}

function nextTitle(preferred) {
  if (preferred) return preferred
  const t = titleThemes[themeIdx % titleThemes.length]
  themeIdx += 1
  return t
}

// 1) Curated seed questions keep their exact titles (they mirror the real exam)
for (const q of seed) {
  questions.push({ id: nextId(), ...q })
}

// 2) Expand families. Each variant gets a themed title with a suffix so titles
//    stay distinct across the whole bank.
const titleCount = {}
for (const fam of families) {
  for (let i = 0; i < fam.count; i++) {
    const built = fam.build(i)
    let title = nextTitle()
    // ensure uniqueness
    titleCount[title] = (titleCount[title] || 0) + 1
    if (titleCount[title] > 1) title = `${title} ${titleCount[title]}`
    questions.push({
      id: nextId(),
      category: fam.category,
      pattern: fam.pattern,
      difficulty: fam.difficulty,
      title,
      references: fam.refs || [],
      ...built
    })
  }
}

// 3) Recommended problems: real LeetCode questions from the user's solved list.
function toSlug(title) {
  if (SLUG_OVERRIDES[title]) return SLUG_OVERRIDES[title]
  return title
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const seenNumbers = new Set()
for (const [number, title, difficulty, pattern, category] of recommendedRows) {
  if (seenNumbers.has(number)) continue // dedup repeated problems
  seenNumbers.add(number)

  const slug = toSlug(title)
  const url = `https://leetcode.com/problems/${slug}/`
  const blurb = PATTERN_BLURB[pattern] || PATTERN_BLURB.default

  questions.push({
    id: nextId(),
    category,
    pattern,
    difficulty,
    title: `${number}. ${title}`,
    recommended: true,
    statement:
      `LeetCode #${number} — ${title} (${difficulty}).\n\n${blurb}\n\n` +
      `This is a recommended practice problem. Open the LeetCode link below for the full statement, examples, and constraints, then implement and submit your solution there.`,
    examples: [],
    constraints: [],
    hints: [`Pattern to apply: ${pattern}.`, 'Read the full constraints on LeetCode before coding.'],
    approach: `Recommended approach family: ${pattern}. Work it out on LeetCode and verify against its test suite.`,
    solution: `// Solve "${number}. ${title}" directly on LeetCode:\n// ${url}\n// Pattern: ${pattern}`,
    references: [
      { source: 'LeetCode', label: `#${number} ${title}`, url },
      { source: 'Hectal', label: 'DSA topic hub', url: 'https://hectal.in/dsa' }
    ],
    tags: ['recommended', pattern.toLowerCase().replace(/[^a-z0-9]+/g, '-')]
  })
}

// 4) The Core 100 — curated, ordered easy -> hard across every major pattern.
function coreSlug(title) {
  if (CORE_SLUG_OVERRIDES[title]) return CORE_SLUG_OVERRIDES[title]
  return title
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

let coreIndex = 0
const seenCoreTitles = new Set()
for (const [title, difficulty, set, teachPattern, module, ourPattern, category] of core100Rows) {
  if (seenCoreTitles.has(title)) continue
  seenCoreTitles.add(title)
  coreIndex += 1

  const url = `https://leetcode.com/problems/${coreSlug(title)}/`

  questions.push({
    id: nextId(),
    category,
    pattern: ourPattern,
    difficulty,
    title: `Core 100 #${coreIndex}: ${title}`,
    core100: true,
    core100Set: set, // Foundation | Core | Capstone
    core100Order: coreIndex,
    recommended: true,
    statement:
      `Core 100 problem (${set} set) — "${title}" (${difficulty}).\n\n` +
      `Teaching pattern: ${teachPattern}  ·  Source: ${module}\n\n` +
      `This is part of the curated Core 100 revision list, ordered to build from easy foundations to hard capstones. ` +
      `Open the LeetCode link below for the full statement, then solve it and re-solve from a blank file after 1, 3, 7 and 21 days.`,
    examples: [],
    constraints: [],
    hints: [`Teaching pattern: ${teachPattern}.`, `Covered in ${module}.`, 'Track the pattern, the key insight, and the mistake if you miss it.'],
    approach: `Core 100 approach: ${teachPattern} (${module}). Solve on LeetCode and verify against its test suite.`,
    solution: `// Core 100 #${coreIndex} — "${title}"\n// Pattern: ${teachPattern}  (${module})\n// Solve on LeetCode: ${url}`,
    references: [
      { source: 'LeetCode', label: title, url },
      { source: 'Hectal', label: `Core 100 · ${module}`, url: 'https://hectal.in/dsa' }
    ],
    tags: ['core100', `set-${set.toLowerCase()}`, teachPattern.toLowerCase().replace(/[^a-z0-9]+/g, '-')]
  })
}

// ---- Validation: every question must be complete ----
const required = ['id', 'category', 'pattern', 'difficulty', 'title', 'statement', 'solution']
const problems = []
for (const q of questions) {
  for (const key of required) {
    if (!q[key] || (typeof q[key] === 'string' && q[key].trim() === '')) {
      problems.push(`${q.id || '?'} missing ${key}`)
    }
  }
}
if (problems.length) {
  console.error('Validation failed:')
  problems.forEach((p) => console.error('  - ' + p))
  process.exit(1)
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(questions, null, 2) + '\n', 'utf8')

// ---- Summary ----
const byCat = {}
const byPat = {}
const byDiff = {}
for (const q of questions) {
  byCat[q.category] = (byCat[q.category] || 0) + 1
  byPat[q.pattern] = (byPat[q.pattern] || 0) + 1
  byDiff[q.difficulty] = (byDiff[q.difficulty] || 0) + 1
}
console.log(`Generated ${questions.length} questions -> ${outPath}`)
console.log('By category:', byCat)
console.log('By difficulty:', byDiff)
console.log('By pattern:', byPat)
