const STORAGE_KEY = "hebrewCards_learned";

const card = document.getElementById("card");
const cardContainer = document.getElementById("cardContainer");
const hebrewWord = document.getElementById("hebrewWord");
const russianWord = document.getElementById("russianWord");
const counter = document.getElementById("counter");
const controls = document.getElementById("controls");
const doneMessage = document.getElementById("doneMessage");
const learnedBtn = document.getElementById("learnedBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");
const resetAllBtn = document.getElementById("resetAllBtn");

let learned = loadLearned();
let remaining = [];
let currentIndex = -1;

function loadLearned() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
  } catch {
    return new Set();
  }
}

function saveLearned() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...learned]));
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildRemaining() {
  remaining = WORDS
    .map((w, i) => i)
    .filter((i) => !learned.has(i));
  shuffle(remaining);
  currentIndex = 0;
}

function updateCounter() {
  const total = WORDS.length;
  const left = remaining.length - currentIndex;
  counter.textContent = `${learned.size} из ${total} выучено · осталось ${left}`;
}

function showCard() {
  if (currentIndex >= remaining.length) {
    if (learned.size === WORDS.length) {
      showDone();
    } else {
      buildRemaining();
      if (remaining.length === 0) {
        showDone();
        return;
      }
      showCard();
    }
    return;
  }

  const word = WORDS[remaining[currentIndex]];
  card.classList.remove("flipped");
  hebrewWord.textContent = word.hebrew;
  russianWord.textContent = word.russian;

  cardContainer.classList.remove("animate-in");
  void cardContainer.offsetWidth;
  cardContainer.classList.add("animate-in");

  cardContainer.style.display = "";
  controls.style.display = "";
  doneMessage.style.display = "none";

  updateCounter();
}

function showDone() {
  cardContainer.style.display = "none";
  controls.style.display = "none";
  doneMessage.style.display = "flex";
  counter.textContent = `${learned.size} из ${WORDS.length} выучено`;
}

function flipCard() {
  card.classList.toggle("flipped");
}

function markLearned() {
  learned.add(remaining[currentIndex]);
  saveLearned();
  currentIndex++;
  showCard();
}

function nextCard() {
  currentIndex++;
  showCard();
}

function resetProgress() {
  if (!confirm("Сбросить весь прогресс? Все слова снова станут невыученными.")) return;
  learned.clear();
  saveLearned();
  buildRemaining();
  showCard();
}

cardContainer.addEventListener("click", flipCard);
learnedBtn.addEventListener("click", markLearned);
nextBtn.addEventListener("click", nextCard);
resetBtn.addEventListener("click", resetProgress);
resetAllBtn.addEventListener("click", resetProgress);

buildRemaining();
showCard();
