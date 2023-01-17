import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url'
import laravel from 'laravel-vite-plugin'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/application/main.jsx'],
      ssr: 'resources/application/ssr.jsx',
      refresh: true,
    }),
    preact(),
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
