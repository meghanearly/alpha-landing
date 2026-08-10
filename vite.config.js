import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Single static landing page — no routing.
export default defineConfig({
  plugins: [react()],
})
