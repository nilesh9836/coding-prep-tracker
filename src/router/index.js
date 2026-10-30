import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/questions',
    name: 'questions',
    component: () => import('../views/QuestionsView.vue')
  },
  {
    path: '/bookmarks',
    name: 'bookmarks',
    component: () => import('../views/BookmarksView.vue')
  },
  {
    path: '/questions/:id',
    name: 'question-detail',
    component: () => import('../views/QuestionDetailView.vue'),
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Auth guard: confirm the session (once) then gate private routes.
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.ready) await auth.init()

  if (to.meta.public) {
    // already logged in and heading to /login -> send home
    if (auth.isAuthed && to.name === 'login') return { name: 'dashboard' }
    return true
  }

  if (!auth.isAuthed) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
