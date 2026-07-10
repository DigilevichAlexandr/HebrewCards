import { useEffect, useState } from 'react';
import type { WordCard } from '../types';
import { speakHebrew, stopSpeaking } from '../utils/speech';

interface Props {
  cards: WordCard[];
  learnedCount: number;
  onMarkLearned: (id: number) => void;
}

export function StudyMode({ cards, learnedCount, onMarkLearned }: Props) {
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showRussianFirst, setShowRussianFirst] = useState(false);

  const [speakError, setSpeakError] = useState('');

  useEffect(() => {
    setOrder(cards.map((_, i) => i));
    setIndex(0);
    setFlipped(false);
  }, [cards.length]);

  useEffect(() => () => stopSpeaking(), [index, flipped, showRussianFirst]);

  if (cards.length === 0) {
    return (
      <div className="empty-state">
        <p>Нет карточек для изучения.</p>
        {learnedCount > 0 ? (
          <p>Выучено слов: {learnedCount}. Верните их во вкладке «Список».</p>
        ) : (
          <p>Добавьте слова во вкладке «Добавить».</p>
        )}
      </div>
    );
  }

  const safeIndex = Math.min(index, order.length - 1);
  const current = cards[order[safeIndex]];
  const front = showRussianFirst ? current.russian : current.hebrew;
  const back = showRussianFirst ? current.hebrew : current.russian;
  const frontDir = showRussianFirst ? 'ltr' : 'rtl';
  const backDir = showRussianFirst ? 'rtl' : 'ltr';

  const goNext = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % order.length);
  };

  const goPrev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + order.length) % order.length);
  };

  const reshuffle = () => {
    setOrder([...order].sort(() => Math.random() - 0.5));
    setIndex(0);
    setFlipped(false);
  };

  const markLearned = () => {
    onMarkLearned(current.id);
    setFlipped(false);
    if (order.length <= 1) return;
    setIndex((i) => (i >= order.length - 1 ? 0 : i));
  };

  const readHebrew = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setSpeakError('');
    const ok = await speakHebrew(current.hebrew);
    if (!ok) setSpeakError('Не удалось воспроизвести слово');
  };

  return (
    <div className="study">
      <div className="study-toolbar">
        <label className="toggle">
          <input
            type="checkbox"
            checked={showRussianFirst}
            onChange={(e) => {
              setShowRussianFirst(e.target.checked);
              setFlipped(false);
            }}
          />
          Сначала русский
        </label>
        <button type="button" className="btn btn-ghost" onClick={reshuffle}>
          Перемешать
        </button>
      </div>

      <div className="progress">
        {safeIndex + 1} / {order.length}
        {learnedCount > 0 && <span className="learned-badge"> · выучено: {learnedCount}</span>}
      </div>

      <button
        type="button"
        className={`flashcard ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped((f) => !f)}
        aria-label="Перевернуть карточку"
      >
        <div className="flashcard-inner">
          <div className="flashcard-face front" dir={frontDir}>
            <span className="label">{showRussianFirst ? 'Русский' : 'עברית'}</span>
            <span className="word">{front}</span>
            <span className="hint">Нажмите, чтобы перевернуть</span>
          </div>
          <div className="flashcard-face back" dir={backDir}>
            <span className="label">{showRussianFirst ? 'עברית' : 'Русский'}</span>
            <span className="word">{back}</span>
          </div>
        </div>
      </button>

      <button
        type="button"
        className="btn btn-speak"
        onClick={readHebrew}
        aria-label="Произнести на иврите"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Произнести на иврите
      </button>
      {speakError && <p className="speak-error">{speakError}</p>}

      <div className="nav-buttons">
        <button type="button" className="btn" onClick={goPrev}>
          ← Назад
        </button>
        <button type="button" className="btn btn-learned" onClick={markLearned}>
          Знаю ✓
        </button>
        <button type="button" className="btn btn-primary" onClick={goNext}>
          Далее →
        </button>
      </div>
    </div>
  );
}
