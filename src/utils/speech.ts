let currentAudio: HTMLAudioElement | null = null;
let currentBlobUrl: string | null = null;

const NIKUD = /[\u0591-\u05C7]/g;

function plainHebrew(text: string) {
  return text.replace(NIKUD, '').replace(/''/g, "'").trim();
}

function revokeBlob() {
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    const onVoices = () => {
      speechSynthesis.removeEventListener('voiceschanged', onVoices);
      resolve(speechSynthesis.getVoices());
    };
    speechSynthesis.addEventListener('voiceschanged', onVoices);
    setTimeout(() => resolve(speechSynthesis.getVoices()), 500);
  });
}

async function speakWithSynthesis(text: string): Promise<boolean> {
  if (!('speechSynthesis' in window)) return false;

  const voices = await loadVoices();
  const hebrewVoice = voices.find(
    (v) => v.lang.startsWith('he') || v.lang.startsWith('iw'),
  );

  return new Promise((resolve) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'he-IL';
    utterance.rate = 0.85;
    if (hebrewVoice) utterance.voice = hebrewVoice;
    utterance.onend = () => resolve(true);
    utterance.onerror = () => resolve(false);
    speechSynthesis.speak(utterance);
  });
}

async function playAudioBlob(blob: Blob): Promise<boolean> {
  revokeBlob();
  currentBlobUrl = URL.createObjectURL(blob);
  const audio = new Audio(currentBlobUrl);
  currentAudio = audio;

  audio.onended = () => {
    if (currentAudio === audio) currentAudio = null;
    revokeBlob();
  };

  try {
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

async function speakWithApi(text: string): Promise<boolean> {
  const response = await fetch(`/api/tts?text=${encodeURIComponent(text)}`);
  if (!response.ok) return false;

  const blob = await response.blob();
  if (blob.size === 0) return false;

  return playAudioBlob(blob);
}

export async function speakHebrew(text: string): Promise<boolean> {
  const trimmed = plainHebrew(text);
  if (!trimmed) return false;

  stopSpeaking();

  if (await speakWithApi(trimmed)) return true;
  return speakWithSynthesis(trimmed);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  revokeBlob();
}
