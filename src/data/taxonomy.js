// Central taxonomy for the SWPCT exam structure.
// Categories mirror the real exam grouping; patterns are the DSA techniques.

export const CATEGORIES = [
  { id: 'Code Understanding', short: 'CU', badge: 'badge-cat-cu' },
  { id: 'Problem Solving_1', short: 'PS1', badge: 'badge-cat-ps1' },
  { id: 'Problem Solving_2', short: 'PS2', badge: 'badge-cat-ps2' }
]

export const DIFFICULTIES = [
  { id: 'Easy', badge: 'badge-easy' },
  { id: 'Medium', badge: 'badge-medium' },
  { id: 'Hard', badge: 'badge-hard' }
]

export const PATTERNS = [
  'Graph BFS/DFS',
  'Matrix Traversal',
  'Matrix Rotation',
  'TSP / Backtracking',
  'Monotonic Stack',
  'Sliding Window',
  'Two Pointers',
  'Dynamic Programming',
  'Greedy',
  'Recursion',
  'Hashing',
  'Sorting',
  'Binary Search',
  'Prefix Sum',
  'Simulation',
  'String Manipulation',
  'Code Tracing'
]

export function categoryMeta(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, short: '?', badge: 'badge-pattern' }
}

export function difficultyMeta(id) {
  return DIFFICULTIES.find((d) => d.id === id) || { id, badge: 'badge-pattern' }
}
