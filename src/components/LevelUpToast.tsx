import { useEffect } from 'react';
import type { Level } from '../data/levels';

interface Props {
  level: Level | null;
  onClose: () => void;
}

export function LevelUpToast({ level, onClose }: Props) {
  useEffect(() => {
    if (!level) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [level, onClose]);

  if (!level) return null;

  return (
    <div className="level-up-toast" role="alert">
      <span className="level-up-emoji">{level.emoji}</span>
      <div>
        <p className="level-up-title">Новый уровень!</p>
        <p className="level-up-name">{level.title}</p>
      </div>
    </div>
  );
}
