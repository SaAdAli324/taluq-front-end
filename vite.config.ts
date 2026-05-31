import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss() as any],
  server: {
    proxy: {
      '/api': {
        target: 'https://taluq-backend-1.onrender.com',
        changeOrigin: true,
      }
    }
  }
})
