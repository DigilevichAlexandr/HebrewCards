import { LEVELS, type Level } from '../data/levels';

export interface LevelInfo {
  level: Level;
  levelIndex: number;
  nextLevel: Level | null;
  progress: number;
  xpInLevel: number;
  xpToNext: number;
}

export function getLevelInfo(xp: number): LevelInfo {
  let levelIndex = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      levelIndex = i;
      break;
    }
  }

  const level = LEVELS[levelIndex];
  const nextLevel = levelIndex < LEVELS.length - 1 ? LEVELS[levelIndex + 1] : null;
  const xpInLevel = xp - level.minXp;
  const xpToNext = nextLevel ? nextLevel.minXp - level.minXp : 0;
  const progress = nextLevel ? Math.min(100, (xpInLevel / xpToNext) * 100) : 100;

  return { level, levelIndex, nextLevel, progress, xpInLevel, xpToNext };
}

export function getLevelIndex(xp: number): number {
  return getLevelInfo(xp).levelIndex;
}
