import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: true // Tüm hostlara izin vererek Railway hatasını çözer
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
    port: 8080
  }
})
