import { useCallback, useEffect, useState } from 'react';
import type { WordCard } from '../types';
import initialWords from '../data/words.json';

const STORAGE_KEY = 'hebrew-cards';
const LEARNED_KEY = 'hebrew-cards-learned';

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

function loadCards(): WordCard[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as WordCard[];
  } catch {
    /* ignore */
  }
  return initialWords as WordCard[];
}

function saveCards(cards: WordCard[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export function useCards() {
  const [cards, setCards] = useState<WordCard[]>(loadCards);
  const [learnedIds, setLearnedIds] = useState<Set<number>>(loadLearned);

  useEffect(() => {
    saveCards(cards);
  }, [cards]);

  useEffect(() => {
    saveLearned(learnedIds);
  }, [learnedIds]);

  const studyCards = cards.filter((c) => !learnedIds.has(c.id));

  const toggleLearned = useCallback((id: number) => {
    setLearnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
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
    setCards(initialWords as WordCard[]);
    setLearnedIds(new Set());
  }, []);

  return { cards, studyCards, learnedIds, addCard, deleteCard, toggleLearned, clearLearned, resetToDefault };
}

export function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
