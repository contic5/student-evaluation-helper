import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/student-evaluation-helper/', // match your repo name exactly
  build: {
    outDir: 'build' // Optional — only if you want `build` instead of `dist`
  },
})
