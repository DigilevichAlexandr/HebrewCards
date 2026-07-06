import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/tts': {
        target: 'https://translate.google.com',
        changeOrigin: true,
        rewrite: (path) => {
          const match = path.match(/[?&]text=([^&]*)/);
          const text = match ? decodeURIComponent(match[1]) : '';
          return `/translate_tts?ie=UTF-8&tl=he&client=tw-ob&q=${encodeURIComponent(text)}`;
        },
      },
    },
  },
})
