export interface Level {
  minXp: number;
  title: string;
  emoji: string;
}

export const LEVELS: Level[] = [
  { minXp: 0, title: 'Турист в Шук ха-Кармель', emoji: '🎒' },
  { minXp: 10, title: 'Новичок с разговорником', emoji: '📖' },
  { minXp: 30, title: 'Шалом-грешник', emoji: '🙋' },
  { minXp: 60, title: 'Охотник за огласовками', emoji: '🔍' },
  { minXp: 100, title: 'Падаван раввина', emoji: '🥋' },
  { minXp: 150, title: 'Завсегдатай кафе в Т-А', emoji: '☕' },
  { minXp: 210, title: 'Мастер торга на рынке', emoji: '💰' },
  { minXp: 280, title: 'Гуру произношения ח', emoji: '🗣️' },
  { minXp: 360, title: 'Легенда Кнессета', emoji: '🏛️' },
  { minXp: 450, title: 'Полубог Синайского текста', emoji: '⚡' },
  { minXp: 550, title: 'Царь иврита', emoji: '👑' },
];

export const XP_PER_WORD = 10;
