import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    outDir: 'packages/react/dist',
    lib: {
      entry: fileURLToPath(new URL('./packages/react/library.ts', import.meta.url)),
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'styles',
    },
    rolldownOptions: {
      external: (id) => /^(react($|\/)|react-dom($|\/)|lucide-react$|@radix-ui\/)/.test(id),
      output: { banner: '"use client";' },
    },
  },
})
