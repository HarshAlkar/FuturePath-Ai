import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('https://futurepath-ai-1.onrender.com'),
    'import.meta.env.VITE_WS_URL': JSON.stringify('wss://futurepath-ai-1.onrender.com'),
  },
}) 