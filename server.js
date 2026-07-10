import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchGoogleTts } from './lib/tts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/tts', async (req, res) => {
  const text = String(req.query.text ?? '').trim();
  if (!text) {
    res.status(400).json({ error: 'text required' });
    return;
  }

  try {
    const audio = await fetchGoogleTts(text);
    if (!audio) {
      res.status(502).json({ error: 'empty audio' });
      return;
    }

    res.set('Content-Type', 'audio/mpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(audio);
  } catch {
    res.status(500).json({ error: 'tts failed' });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
