import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Single static landing page — no routing.
// base matches the GitHub Pages project path (meghanearly.github.io/alpha-landing/).
export default defineConfig({
  base: '/alpha-landing/',
  plugins: [react()],
})
