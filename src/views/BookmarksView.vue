<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionsStore } from '../stores/questions'
import QuestionCard from '../components/QuestionCard.vue'

const store = useQuestionsStore()
const router = useRouter()

const search = ref('')

const list = computed(() => {
  const term = search.value.trim().toLowerCase()
  const items = store.bookmarkedQuestions
  if (!term) return items
  return items.filter((q) => {
    const hay = (q.title + ' ' + q.statement + ' ' + (q.tags || []).join(' ')).toLowerCase()
    return hay.includes(term)
  })
})
</script>

<template>
  <div>
    <h1 class="page-title">★ Bookmarks</h1>
    <p class="page-sub">
      {{ store.bookmarkedQuestions.length }} bookmarked question{{ store.bookmarkedQuestions.length === 1 ? '' : 's' }}
    </p>

    <div v-if="store.bookmarkedQuestions.length" class="bm-search card">
      <input v-model="search" type="text" placeholder="Search within bookmarks…" />
    </div>

    <div v-if="list.length" class="grid">
      <QuestionCard v-for="q in list" :key="q.id" :question="q" />
    </div>

    <div v-else-if="store.bookmarkedQuestions.length" class="empty-state">
      <span class="emoji">🔍</span>
      No bookmarks match "{{ search }}".
    </div>

    <div v-else class="empty-state">
      <span class="emoji">☆</span>
      You haven't bookmarked any questions yet.
      <div style="margin-top: 16px">
        <button class="btn" @click="router.push({ name: 'questions' })">Browse questions</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bm-search {
  padding: 14px;
  margin-bottom: 20px;
}

.bm-search input {
  width: 100%;
  background: var(--bg-elev2);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  padding: 9px 12px;
  font-size: 14px;
  outline: none;
}

.bm-search input:focus {
  border-color: var(--accent);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
</style>
