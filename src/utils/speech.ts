let currentAudio: HTMLAudioElement | null = null;
let currentBlobUrl: string | null = null;

function revokeBlob() {
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }
}

export async function speakHebrew(text: string): Promise<boolean> {
  const trimmed = text.trim();
  if (!trimmed) return false;

  stopSpeaking();

  try {
    const response = await fetch(`/api/tts?text=${encodeURIComponent(trimmed)}`);
    if (!response.ok) return false;

    const blob = await response.blob();
    if (blob.size === 0) return false;

    revokeBlob();
    currentBlobUrl = URL.createObjectURL(blob);
    const audio = new Audio(currentBlobUrl);
    currentAudio = audio;

    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null;
      revokeBlob();
    };

    await audio.play();
    return true;
  } catch {
    return false;
  }
}

export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  revokeBlob();
}
