import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Forward progress API calls to the local file-persistence server.
      '/api': {
        target: 'http://localhost:5123',
        changeOrigin: true
      }
    }
  }
})
