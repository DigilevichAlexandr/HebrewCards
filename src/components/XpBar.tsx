import { getLevelInfo } from '../utils/xp';

interface Props {
  xp: number;
}

export function XpBar({ xp }: Props) {
  const { level, nextLevel, progress, xpInLevel, xpToNext } = getLevelInfo(xp);

  return (
    <div className="xp-bar">
      <div className="xp-header">
        <span className="xp-level">
          {level.emoji} {level.title}
        </span>
        <span className="xp-points">{xp} XP</span>
      </div>
      <div className="xp-track">
        <div className="xp-fill" style={{ width: `${progress}%` }} />
      </div>
      {nextLevel && (
        <p className="xp-next">
          До «{nextLevel.title}»: {xpToNext - xpInLevel} XP
        </p>
      )}
    </div>
  );
}
