import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

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
    const url =
      `https://translate.google.com/translate_tts?ie=UTF-8&tl=he&client=tw-ob&q=${encodeURIComponent(text)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer: 'https://translate.google.com/',
      },
    });

    if (!response.ok) {
      res.status(502).json({ error: 'tts upstream failed' });
      return;
    }

    const audio = Buffer.from(await response.arrayBuffer());
    if (audio.length === 0) {
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
