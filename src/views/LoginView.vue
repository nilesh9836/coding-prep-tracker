<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const error = ref('')
const busy = ref(false)

async function submit() {
  error.value = ''
  busy.value = true
  const result = await auth.login(username.value, password.value)
  busy.value = false
  if (result.ok) {
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.replace(redirect)
  } else {
    error.value = result.error
  }
}
</script>

<template>
  <div class="login-shell">
    <div class="login-card">
      <div class="brand-block">
        <span class="logo">⚡</span>
        <h1>SWPCT Learning Track</h1>
        <p class="tagline">Sign in to track your coding-exam prep</p>
      </div>

      <form class="login-form" @submit.prevent="submit">
        <label class="field">
          <span class="field-label">Username</span>
          <input
            v-model="username"
            type="text"
            autocomplete="username"
            placeholder="Enter any username"
            autofocus
          />
        </label>

        <label class="field">
          <span class="field-label">Password</span>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="Password"
          />
        </label>

        <p v-if="error" class="error">{{ error }}</p>

        <button class="btn btn-primary submit" type="submit" :disabled="busy">
          {{ busy ? 'Signing in…' : 'Sign in' }}
        </button>

        <p class="hint">
          Demo login: any username works, password is <code>123456789</code>.
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(1200px 600px at 50% -10%, rgba(79, 140, 255, 0.18), transparent),
    var(--bg);
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 36px 32px;
  box-shadow: var(--shadow);
}

.brand-block {
  text-align: center;
  margin-bottom: 28px;
}

.brand-block .logo {
  font-size: 40px;
  display: block;
  margin-bottom: 8px;
}

.brand-block h1 {
  font-size: 20px;
  font-weight: 750;
}

.tagline {
  color: var(--text-dim);
  font-size: 13px;
  margin-top: 4px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.field input {
  background: var(--bg-elev2);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  padding: 11px 13px;
  font-size: 14px;
  outline: none;
}

.field input:focus {
  border-color: var(--accent);
}

.error {
  color: var(--red);
  font-size: 13px;
  margin: -4px 0 0;
}

.submit {
  justify-content: center;
  padding: 12px;
  font-size: 15px;
  margin-top: 4px;
}

.submit:disabled {
  opacity: 0.6;
  cursor: default;
}

.hint {
  text-align: center;
  color: var(--text-dim);
  font-size: 12px;
  margin-top: 4px;
}

.hint code {
  background: var(--bg-elev2);
  padding: 1px 6px;
  border-radius: 4px;
}
</style>
