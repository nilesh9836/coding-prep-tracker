<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const menuOpen = ref(false)

async function logout() {
  menuOpen.value = false
  await auth.logout()
  router.replace({ name: 'login' })
}
</script>

<template>
  <!-- Login page renders without the app chrome -->
  <RouterView v-if="route.meta.public" />

  <div v-else class="app-shell">
    <header class="topbar">
      <div class="brand">
        <span class="logo">⚡</span>
        <span>SWPCT Learning Track</span>
      </div>
      <nav class="nav-links">
        <RouterLink to="/">Dashboard</RouterLink>
        <RouterLink to="/questions">Questions</RouterLink>
        <RouterLink to="/bookmarks">★ Bookmarks</RouterLink>
      </nav>

      <div v-if="auth.isAuthed" class="user-area">
        <button class="avatar-btn" @click="menuOpen = !menuOpen" :title="auth.username">
          <span class="avatar" :style="{ background: auth.avatarColor }">{{ auth.initials }}</span>
          <span class="avatar-name">{{ auth.username }}</span>
          <span class="chev">▾</span>
        </button>
        <div v-if="menuOpen" class="menu" @click.self="menuOpen = false">
          <div class="menu-card">
            <div class="menu-head">
              <span class="avatar lg" :style="{ background: auth.avatarColor }">{{ auth.initials }}</span>
              <div>
                <div class="menu-name">{{ auth.username }}</div>
                <div class="menu-sub">Signed in</div>
              </div>
            </div>
            <button class="menu-item" @click="logout">Sign out</button>
          </div>
        </div>
      </div>
    </header>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.user-area {
  margin-left: auto;
  position: relative;
}

.avatar-btn {
  display: flex;
  align-items: center;
  gap: 9px;
  background: var(--bg-elev2);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 5px 12px 5px 5px;
  color: var(--text);
}

.avatar-btn:hover {
  border-color: var(--accent);
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.avatar.lg {
  width: 44px;
  height: 44px;
  font-size: 16px;
}

.avatar-name {
  font-size: 14px;
  font-weight: 500;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chev {
  color: var(--text-dim);
  font-size: 11px;
}

.menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 100;
}

.menu-card {
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
  width: 240px;
  padding: 8px;
}

.menu-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
}

.menu-name {
  font-weight: 650;
  font-size: 14px;
}

.menu-sub {
  color: var(--text-dim);
  font-size: 12px;
}

.menu-item {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  color: var(--text);
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
}

.menu-item:hover {
  background: var(--bg-elev2);
  color: var(--red);
}

@media (max-width: 620px) {
  .avatar-name {
    display: none;
  }
}
</style>
