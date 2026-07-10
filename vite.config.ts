import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

async function fetchGoogleTts(text: string): Promise<Buffer | null> {
  const url =
    `https://translate.google.com/translate_tts?ie=UTF-8&tl=he&client=tw-ob&q=${encodeURIComponent(text)}`
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Referer: 'https://translate.google.com/',
    },
  })
  if (!response.ok) return null
  const audio = Buffer.from(await response.arrayBuffer())
  return audio.length > 0 ? audio : null
}

function ttsApiPlugin(): Plugin {
  return {
    name: 'tts-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/tts')) return next()

        const query = req.url.split('?')[1] ?? ''
        const text = new URLSearchParams(query).get('text')?.trim()
        if (!text) {
          res.statusCode = 400
          res.end('text required')
          return
        }

        try {
          const audio = await fetchGoogleTts(text)
          if (!audio) {
            res.statusCode = 502
            res.end('empty audio')
            return
          }
          res.setHeader('Content-Type', 'audio/mpeg')
          res.setHeader('Cache-Control', 'public, max-age=86400')
          res.end(audio)
        } catch {
          res.statusCode = 500
          res.end('tts failed')
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), ttsApiPlugin()],
})
