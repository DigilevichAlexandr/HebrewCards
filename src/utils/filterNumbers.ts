import type { WordCard } from '../types';

const NIKUD = /[\u0591-\u05C7]/g;

function stripNikud(text: string) {
  return text.replace(NIKUD, '').replace(/\s+/g, ' ').trim();
}

const NUMBER_HEBREW = new Set(
  [
    'אחד', 'שנים', 'שלש', 'שלוש', 'ארבע', 'חמש', 'שש', 'שבע', 'שמונה', 'תשע', 'עשר',
    'אחת עשרה', 'שתים עשרה', 'שלש עשרה', 'עשרים', 'שלשים', 'ארבעים', 'חמישים',
    'שישים', 'שבעים', 'שמונים', 'תשעים', 'מאה', 'אלף', 'מיליון',
    'ראשון', 'שני', 'שלישי',
  ].map(stripNikud),
);

const NUMBER_RUSSIAN =
  /^(один|два|три|четыре|пять|шесть|семь|восемь|девять|десять|одиннадцать|двенадцать|тринадцать|четырнадцать|пятнадцать|шестнадцать|семнадцать|восемнадцать|девятнадцать|двадцать|тридцать|сорок|пятьдесят|шестьдесят|семьдесят|восемьдесят|девяносто|сто|тысяча|миллион|первый|второй|третий)(\s|\/|$)/i;

export function isNumberCard(card: WordCard) {
  const he = stripNikud(card.hebrew);
  if (NUMBER_HEBREW.has(he)) return true;
  return NUMBER_RUSSIAN.test(card.russian.trim());
}

export function withoutNumberCards(cards: WordCard[]) {
  return cards.filter((card) => !isNumberCard(card));
}
