import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/application/main.js'],
      ssr: 'resources/application/ssr.js',
      refresh: true,
    }),
    vue(),
  ],
  legacy: {
    buildSsrCjsExternalHeuristics: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./resources/', import.meta.url)),
    },
  },
})