import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // هذا هو السطر الأهم
// base: '/DevFlow/', 
  plugins: [react()],
})
