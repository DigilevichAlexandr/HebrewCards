import type { WordCard } from '../types';

interface Props {
  cards: WordCard[];
  learnedIds: Set<number>;
  onDelete: (id: number) => void;
  onToggleLearned: (id: number) => void;
}

export function CardList({ cards, learnedIds, onDelete, onToggleLearned }: Props) {
  if (cards.length === 0) {
    return <div className="empty-state">Список пуст</div>;
  }

  const learnedCount = cards.filter((c) => learnedIds.has(c.id)).length;

  return (
    <div className="card-list">
      <p className="list-count">
        Всего: {cards.length} · выучено: {learnedCount}
      </p>
      <ul>
        {cards.map((card) => {
          const learned = learnedIds.has(card.id);
          return (
            <li key={card.id} className={learned ? 'learned' : ''}>
              <button
                type="button"
                className={`btn-learned-toggle ${learned ? 'active' : ''}`}
                onClick={() => onToggleLearned(card.id)}
                title={learned ? 'Вернуть в изучение' : 'Отметить как выученное'}
                aria-label={learned ? 'Вернуть в изучение' : 'Отметить как выученное'}
              >
                {learned ? '✓' : '○'}
              </button>
              <span className="hebrew" dir="rtl" lang="he">
                {card.hebrew}
              </span>
              <span className="separator">—</span>
              <span className="russian">{card.russian}</span>
              <button
                type="button"
                className="btn-delete"
                onClick={() => onDelete(card.id)}
                title="Удалить"
                aria-label="Удалить карточку"
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
