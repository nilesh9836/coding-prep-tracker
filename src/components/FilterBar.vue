<script setup>
import { computed } from 'vue'
import { useQuestionsStore } from '../stores/questions'
import { CATEGORIES, DIFFICULTIES } from '../data/taxonomy'

const store = useQuestionsStore()

const f = computed(() => store.filters)

const activeChips = computed(() => {
  const chips = []
  const cur = store.filters
  if (cur.search) chips.push({ key: 'search', label: `"${cur.search}"` })
  if (cur.category) chips.push({ key: 'category', label: cur.category })
  if (cur.pattern) chips.push({ key: 'pattern', label: cur.pattern })
  if (cur.difficulty) chips.push({ key: 'difficulty', label: cur.difficulty })
  if (cur.status) chips.push({ key: 'status', label: statusLabel(cur.status) })
  if (cur.recommended) chips.push({ key: 'recommended', label: '⭐ Recommended' })
  if (cur.core100) chips.push({ key: 'core100', label: '🎯 Core 100' })
  if (cur.core100Set) chips.push({ key: 'core100Set', label: cur.core100Set })
  return chips
})

function statusLabel(s) {
  const map = {
    solved: 'Solved',
    attempted: 'Attempted',
    review: 'To Review',
    bookmarked: 'Bookmarked',
    unsolved: 'Unsolved'
  }
  return map[s] || s
}

function clearChip(key) {
  if (key === 'recommended' || key === 'core100') {
    store.filters[key] = false
    if (key === 'core100') store.filters.core100Set = ''
  } else {
    store.filters[key] = ''
  }
}
</script>

<template>
  <div class="filter-bar card">
    <div class="filter-row">
      <input
        v-model="f.search"
        class="search"
        type="text"
        placeholder="Search title, statement, tags…"
      />
      <select v-model="f.category">
        <option value="">All categories</option>
        <option v-for="c in CATEGORIES" :key="c.id" :value="c.id">{{ c.id }}</option>
      </select>
      <select v-model="f.pattern">
        <option value="">All patterns</option>
        <option v-for="p in store.patternsInBank" :key="p" :value="p">{{ p }}</option>
      </select>
      <select v-model="f.difficulty">
        <option value="">Any difficulty</option>
        <option v-for="d in DIFFICULTIES" :key="d.id" :value="d.id">{{ d.id }}</option>
      </select>
      <select v-model="f.status">
        <option value="">Any status</option>
        <option value="solved">Solved</option>
        <option value="attempted">Attempted</option>
        <option value="review">To Review</option>
        <option value="unsolved">Unsolved</option>
        <option value="bookmarked">Bookmarked</option>
      </select>
      <label class="rec-toggle" :class="{ on: f.recommended }">
        <input v-model="f.recommended" type="checkbox" />
        ⭐ Recommended
      </label>
      <label class="rec-toggle core" :class="{ on: f.core100 }">
        <input v-model="f.core100" type="checkbox" />
        🎯 Core 100
      </label>
      <select v-if="f.core100" v-model="f.core100Set">
        <option value="">All sets</option>
        <option value="Foundation">Foundation (easy)</option>
        <option value="Core">Core (medium)</option>
        <option value="Capstone">Capstone (hard)</option>
      </select>
    </div>
    <div v-if="activeChips.length" class="chips">
      <span v-for="chip in activeChips" :key="chip.key" class="chip">
        {{ chip.label }}
        <button @click="clearChip(chip.key)">×</button>
      </span>
      <button class="btn btn-ghost clear-all" @click="store.resetFilters()">Clear all</button>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  padding: 14px;
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.search {
  flex: 1 1 220px;
}

input,
select {
  background: var(--bg-elev2);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  padding: 9px 12px;
  font-size: 14px;
  outline: none;
}

input:focus,
select:focus {
  border-color: var(--accent);
}

select {
  cursor: pointer;
}

.rec-toggle {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--bg-elev2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 14px;
  color: var(--text-dim);
  cursor: pointer;
  user-select: none;
}

.rec-toggle.on {
  border-color: var(--amber);
  color: var(--text);
}

.rec-toggle.core.on {
  border-color: var(--green);
}

.rec-toggle input {
  accent-color: var(--amber);
  cursor: pointer;
  padding: 0;
}

.rec-toggle.core input {
  accent-color: var(--green);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  align-items: center;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--accent-dim);
  color: var(--text);
  padding: 4px 6px 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.chip button {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: var(--text);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  line-height: 1;
  font-size: 13px;
}

.clear-all {
  padding: 4px 10px;
  font-size: 12px;
  color: var(--text-dim);
}
</style>
