# SWPCT Learning Track

A single-page web app for practicing SWPCT-style coding problems. Browse, filter, and track your progress across 300+ questions organized by exam category and algorithmic pattern. Built with Vue 3 + Vite. No backend, no database — all question data is a bundled JSON file and all your progress lives in `localStorage`.

## Login

The app has a simple demo login. Enter **any username**; the password is **`123456789`** for everyone. The signed-in user shows as an avatar (colored initials) in the top bar with a sign-out menu. When the file server is running (`npm run dev:all`), the current user and a roster of everyone who has logged in are persisted to `src/data/users.json`; otherwise the session is kept in localStorage. All routes except `/login` require being signed in.

## Features

- **527 questions** across the three SWPCT exam categories: Code Understanding, Problem Solving_1, Problem Solving_2 — including **124 recommended real LeetCode problems** (tagged `recommended`) and the curated **Core 100** list (tagged `core100`, split 25 Foundation / 55 Core / 20 Capstone, shown in their curated easy→hard order), all with direct LeetCode links.
- **Dual filtering** — filter by category **and** by algorithmic pattern (Graph BFS/DFS, Matrix Traversal, Matrix Rotation, TSP/Backtracking, Monotonic Stack, Sliding Window, Two Pointers, DP, Greedy, Recursion, Hashing, Sorting, Binary Search, Prefix Sum, Simulation, String Manipulation, Code Tracing, Union Find, Dijkstra, Topological Sort, Graph Coloring, Priority Queue, Intervals), plus difficulty, free-text search, and a **⭐ Recommended-only** toggle. Filters combine (AND) and show as removable chips.
- **Question detail** — full statement, code snippets (syntax-highlighted), worked examples, constraints, progressive hints (reveal one at a time), a show/hide **Java reference solution** with approach and complexity, and **practice reference links** to the equivalent LeetCode / GeeksforGeeks problem and the [hectal.in/dsa](https://hectal.in/dsa) topic hub.
- **Progress tracking** — mark questions Solved / Attempted / To Review, bookmark favorites. Everything persists in `localStorage`.
- **Automatic file persistence** — run `npm run dev:all` and every change (bookmark, solved/attempted/review) is written to the real file `src/data/progress.json` on disk by a tiny local server, in addition to localStorage. The Dashboard shows whether file auto-save is ON or OFF.
- **Backup & restore (dual store)** — localStorage is the live cache; from the Dashboard you can **Export** your progress to a `.json` text file and **Import** it back on another browser or after clearing data. On first load with no saved progress, the app seeds itself from the bundled `src/data/progress.json` file.
- **Bookmarks tab** — a dedicated tab listing only your starred questions, with its own search.
- **Dashboard** — overall completion %, counts by status, and solved-vs-total breakdowns per category and per pattern. Every tile is a shortcut into a filtered list.

## Run it

Requires Node 18+.

```bash
npm install
npm run dev:all  # Vite dev server + file-persistence server (recommended)
npm run dev      # Vite only (progress saved to localStorage only)
npm run server   # the file-persistence server only (writes src/data/progress.json)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

### Progress persistence

- `npm run dev:all` runs both the Vite dev server and a tiny zero-dependency Node
  server (`server/progress-server.js`). Vite proxies `/api/progress` to it. Every
  bookmark or status change is POSTed and written to `src/data/progress.json` on
  disk automatically, so the file stays in sync. localStorage is also updated as a
  fast cache.
- `npm run dev` (Vite only) still works — it just saves to localStorage and the
  manual Export/Import file, since a browser alone cannot write to disk.
- Load priority on startup: **server file → localStorage → bundled `progress.json` → empty.**

## Project structure

```
src/
  assets/main.css          global theme + shared UI classes
  components/
    CodeBlock.vue          highlight.js Java code rendering
    FilterBar.vue          search + category/pattern/difficulty/status filters
    QuestionCard.vue       list card with status + bookmark
  data/
    taxonomy.js            categories, difficulties, pattern list + badge meta
    questions.json         the generated question bank (do not edit by hand)
  services/storage.js      localStorage read/write with safe fallback
  stores/questions.js      Pinia store: filtering, progress, stats
  views/
    DashboardView.vue      stats + breakdowns
    QuestionsView.vue      filterable, paginated list
    QuestionDetailView.vue single-question page
scripts/
  questions-seed.js        15 curated questions mirroring the real exam
  families.js              parameterized problem families (the bulk of the bank)
  recommended.js           124 real LeetCode problems (the user's solved list), tagged "recommended"
  core100.js               the curated Core 100 list (25/55/20), tagged "core100" with set + module
  generate.js              builds src/data/questions.json (run: node scripts/generate.js)
```

## Question schema

Each entry in `questions.json`:

```json
{
  "id": "q001",
  "category": "Problem Solving_2",
  "pattern": "Graph BFS/DFS",
  "difficulty": "Hard",
  "title": "Setting the Exploration Route",
  "statement": "Full problem description…",
  "codeSnippet": "optional Java code shown in the Problem section (used by Code Understanding items)",
  "examples": [{ "input": "…", "output": "…", "explanation": "…" }],
  "constraints": ["1 <= n <= 10^5"],
  "hints": ["Hint 1", "Hint 2"],
  "approach": "Explanation of the intended algorithm.",
  "solution": "Java reference solution.",
  "complexity": { "time": "O(V+E)", "space": "O(V)" },
  "references": [
    { "source": "LeetCode", "label": "Rotting Oranges (BFS)", "url": "https://leetcode.com/problems/rotting-oranges/" },
    { "source": "Hectal", "label": "Graphs: BFS", "url": "https://hectal.in/dsa" }
  ],
  "tags": ["graph", "bfs"]
}
```

The data layer is decoupled: you can replace `src/data/questions.json` with your own file (same schema) and the app works without any code change.

## Regenerating / extending the bank

The bank is produced from curated seeds plus parameterized problem families:

```bash
node scripts/generate.js
```

To add questions, append to `scripts/questions-seed.js` (fully hand-written items) or add/extend a family in `scripts/families.js`, then re-run the generator. It validates that every question has the required fields before writing.
