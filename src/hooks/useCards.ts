import { useCallback, useEffect, useState } from 'react';
import type { WordCard } from '../types';
import initialWords from '../data/words.json';
import { XP_PER_WORD } from '../data/levels';
import { withoutNumberCards } from '../utils/filterNumbers';

const STORAGE_KEY = 'hebrew-cards';
const LEARNED_KEY = 'hebrew-cards-learned';
const XP_KEY = 'hebrew-cards-xp';
const XP_AWARDED_KEY = 'hebrew-cards-xp-awarded';

function loadLearned(): Set<number> {
  try {
    const saved = localStorage.getItem(LEARNED_KEY);
    if (saved) return new Set(JSON.parse(saved) as number[]);
  } catch {
    /* ignore */
  }
  return new Set();
}

function saveLearned(ids: Set<number>) {
  localStorage.setItem(LEARNED_KEY, JSON.stringify([...ids]));
}

function loadXp(): number {
  try {
    const saved = localStorage.getItem(XP_KEY);
    if (saved) return Math.max(0, parseInt(saved, 10) || 0);
  } catch {
    /* ignore */
  }
  return 0;
}

function saveXp(xp: number) {
  localStorage.setItem(XP_KEY, String(xp));
}

function loadAwardedIds(): Set<number> {
  try {
    const saved = localStorage.getItem(XP_AWARDED_KEY);
    if (saved) return new Set(JSON.parse(saved) as number[]);
  } catch {
    /* ignore */
  }
  return new Set();
}

function saveAwardedIds(ids: Set<number>) {
  localStorage.setItem(XP_AWARDED_KEY, JSON.stringify([...ids]));
}

function loadCards(): WordCard[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return withoutNumberCards(JSON.parse(saved) as WordCard[]);
  } catch {
    /* ignore */
  }
  return withoutNumberCards(initialWords as WordCard[]);
}

function saveCards(cards: WordCard[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export function useCards() {
  const [cards, setCards] = useState<WordCard[]>(loadCards);
  const [learnedIds, setLearnedIds] = useState<Set<number>>(loadLearned);
  const [xp, setXp] = useState(loadXp);
  const [awardedIds, setAwardedIds] = useState<Set<number>>(loadAwardedIds);

  useEffect(() => {
    saveCards(cards);
  }, [cards]);

  useEffect(() => {
    const cleaned = withoutNumberCards(cards);
    if (cleaned.length !== cards.length) setCards(cleaned);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    saveLearned(learnedIds);
  }, [learnedIds]);

  useEffect(() => {
    saveXp(xp);
  }, [xp]);

  useEffect(() => {
    saveAwardedIds(awardedIds);
  }, [awardedIds]);

  useEffect(() => {
    if (awardedIds.size === 0 && learnedIds.size > 0 && xp === 0) {
      setAwardedIds(new Set(learnedIds));
      setXp(learnedIds.size * XP_PER_WORD);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleLearned = useCallback((id: number) => {
    setLearnedIds((prev) => {
      if (prev.has(id)) {
        const next = new Set(prev);
        next.delete(id);
        return next;
      }
      setAwardedIds((awarded) => {
        if (!awarded.has(id)) {
          setXp((x) => x + XP_PER_WORD);
          return new Set(awarded).add(id);
        }
        return awarded;
      });
      return new Set(prev).add(id);
    });
  }, []);

  const studyCards = cards.filter((c) => !learnedIds.has(c.id));

  const markAsLearned = useCallback((id: number) => {
    setLearnedIds((prev) => {
      if (prev.has(id)) return prev;
      setAwardedIds((awarded) => {
        if (!awarded.has(id)) {
          setXp((x) => x + XP_PER_WORD);
          return new Set(awarded).add(id);
        }
        return awarded;
      });
      return new Set(prev).add(id);
    });
  }, []);

  const clearLearned = useCallback(() => {
    setLearnedIds(new Set());
  }, []);

  const addCard = useCallback((hebrew: string, russian: string) => {
    const trimmedHe = hebrew.trim();
    const trimmedRu = russian.trim();
    if (!trimmedHe || !trimmedRu) return false;

    setCards((prev) => {
      const maxId = prev.reduce((max, c) => Math.max(max, c.id), 0);
      return [...prev, { id: maxId + 1, hebrew: trimmedHe, russian: trimmedRu }];
    });
    return true;
  }, []);

  const deleteCard = useCallback((id: number) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    setLearnedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const resetToDefault = useCallback(() => {
    setCards(withoutNumberCards(initialWords as WordCard[]));
    setLearnedIds(new Set());
    setXp(0);
    setAwardedIds(new Set());
  }, []);

  return { cards, studyCards, learnedIds, awardedIds, xp, addCard, deleteCard, toggleLearned, markAsLearned, clearLearned, resetToDefault };
}

export function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
