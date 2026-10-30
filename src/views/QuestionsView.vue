<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useQuestionsStore } from '../stores/questions'
import FilterBar from '../components/FilterBar.vue'
import QuestionCard from '../components/QuestionCard.vue'

const store = useQuestionsStore()

const PAGE_SIZE = 48
const page = ref(1)

// reset to first page whenever the filtered set changes
watch(
  () => store.filtered.length,
  () => {
    page.value = 1
  }
)

const visible = computed(() => store.filtered.slice(0, page.value * PAGE_SIZE))
const hasMore = computed(() => visible.value.length < store.filtered.length)

function loadMore() {
  if (hasMore.value) page.value++
}

// Auto-load more as the sentinel scrolls into view.
const sentinel = ref(null)
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) loadMore()
    },
    { rootMargin: '400px' }
  )
  if (sentinel.value) observer.observe(sentinel.value)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div>
    <h1 class="page-title">Question Bank</h1>
    <p class="page-sub">
      {{ store.filtered.length }} of {{ store.questions.length }} questions
    </p>

    <FilterBar />

    <div v-if="store.filtered.length" class="grid">
      <QuestionCard v-for="q in visible" :key="q.id" :question="q" />
    </div>

    <div v-else class="empty-state">
      <span class="emoji">🔍</span>
      No questions match these filters.
    </div>

    <!-- Sentinel triggers auto-load; button is a fallback -->
    <div ref="sentinel" class="sentinel"></div>
    <div v-if="hasMore" class="load-more">
      <button class="btn" @click="loadMore">
        Load more ({{ store.filtered.length - visible.length }} left)
      </button>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.sentinel {
  height: 1px;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}
</style>
