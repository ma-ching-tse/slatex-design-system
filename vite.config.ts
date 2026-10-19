import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  cacheDir: '.cache/vite',
  resolve: {
    alias: [
      { find: '@slatex/react/styles.css', replacement: fileURLToPath(new URL('./packages/react/src/styles.css', import.meta.url)) },
      { find: /^@slatex\/react$/, replacement: fileURLToPath(new URL('./packages/react/src/index.ts', import.meta.url)) },
    ],
  },
})
