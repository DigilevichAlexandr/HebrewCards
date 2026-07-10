import { useEffect, useRef, useState } from 'react';
import { useCards } from './hooks/useCards';
import { StudyMode } from './components/StudyMode';
import { AddCardForm } from './components/AddCardForm';
import { CardList } from './components/CardList';
import { XpBar } from './components/XpBar';
import { LevelUpToast } from './components/LevelUpToast';
import { getLevelIndex } from './utils/xp';
import type { Level } from './data/levels';
import { LEVELS } from './data/levels';
import './App.css';

type Tab = 'study' | 'add' | 'list';

export default function App() {
  const { cards, studyCards, learnedIds, awardedIds, xp, addCard, deleteCard, toggleLearned, markAsLearned, clearLearned, resetToDefault } = useCards();
  const [tab, setTab] = useState<Tab>('study');
  const [levelUp, setLevelUp] = useState<Level | null>(null);
  const [xpFlash, setXpFlash] = useState<number | null>(null);
  const prevLevelRef = useRef(getLevelIndex(xp));

  useEffect(() => {
    const newLevel = getLevelIndex(xp);
    if (newLevel > prevLevelRef.current) {
      setLevelUp(LEVELS[newLevel]);
    }
    prevLevelRef.current = newLevel;
  }, [xp]);

  const handleMarkLearned = (id: number) => {
    const willGain = !awardedIds.has(id);
    markAsLearned(id);
    if (willGain) {
      setXpFlash(10);
      setTimeout(() => setXpFlash(null), 1500);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#4F46E5" />
            <text x="16" y="22" textAnchor="middle" fill="white" fontSize="16" fontFamily="Frank Ruhl Libre, serif">א</text>
          </svg>
          <h1>Hebrew Cards</h1>
        </div>
        <p className="subtitle">Изучение слов на иврите по карточкам</p>
        <XpBar xp={xp} />
      </header>

      <LevelUpToast level={levelUp} onClose={() => setLevelUp(null)} />
      {xpFlash && <div className="xp-flash">+{xpFlash} XP</div>}

      <nav className="tabs">
        <button
          type="button"
          className={tab === 'study' ? 'active' : ''}
          onClick={() => setTab('study')}
        >
          Учить
        </button>
        <button
          type="button"
          className={tab === 'add' ? 'active' : ''}
          onClick={() => setTab('add')}
        >
          Добавить
        </button>
        <button
          type="button"
          className={tab === 'list' ? 'active' : ''}
          onClick={() => setTab('list')}
        >
          Список
        </button>
      </nav>

      <main className="main">
        {tab === 'study' && (
          <StudyMode
            cards={studyCards}
            learnedCount={learnedIds.size}
            onMarkLearned={handleMarkLearned}
          />
        )}
        {tab === 'add' && <AddCardForm onAdd={addCard} />}
        {tab === 'list' && (
          <>
            <CardList
              cards={cards}
              learnedIds={learnedIds}
              onDelete={deleteCard}
              onToggleLearned={toggleLearned}
              onClearLearned={clearLearned}
            />
            <button type="button" className="btn btn-ghost reset-btn" onClick={resetToDefault}>
              Сбросить к исходному списку
            </button>
          </>
        )}
      </main>
    </div>
  );
}
