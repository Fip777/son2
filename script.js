/* =========================
   SÉLECTION DES ÉLÉMENTS
========================= */
const cards = document.querySelectorAll('.card');
const audio = document.getElementById('audio');

const home = document.getElementById('home');
const player = document.getElementById('player');

const startBtn = document.getElementById('startBtn');
const togglePlay = document.getElementById('togglePlay');
const stopBtn = document.getElementById('stopBtn');

const durationSlider = document.getElementById('duration');
const durationValue = document.getElementById('durationValue');

const playerImage = document.getElementById('playerImage');
const playerTitle = document.getElementById('playerTitle');

const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const remainingTimeEl = document.getElementById('remainingTime');

/* =========================
   VARIABLES GLOBALES
========================= */
let selectedSound = null;
let selectedImage = null;
let selectedName = null;

let totalDurationMs = 0;
let elapsedMs = 0;
let timer = null;
let isPaused = false;
let previewTimeout = null;

/* =========================
   SLIDER DURÉE
========================= */
durationValue.textContent = durationSlider.value;
durationSlider.addEventListener('input', () => {
  durationValue.textContent = durationSlider.value;
});

/* =========================
   SÉLECTION + PRÉ-ÉCOUTE
========================= */
cards.forEach(card => {
  card.addEventListener('click', () => {
    if (player.classList.contains('active')) return;

    cards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    selectedSound = card.dataset.sound;
    selectedImage = card.dataset.image;
    selectedName = card.dataset.name;

    if (previewTimeout) clearTimeout(previewTimeout);

    audio.pause();
    audio.currentTime = 0;
    audio.src = selectedSound;
    audio.play();

    previewTimeout = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
      previewTimeout = null;
    }, 3000);
  });
});

/* =========================
   LANCEMENT LECTURE
========================= */
startBtn.addEventListener('click', () => {
  if (!selectedSound) {
    alert("Sélectionnez un son");
    return;
  }

  if (previewTimeout) clearTimeout(previewTimeout);

  audio.pause();
  audio.currentTime = 0;

  totalDurationMs = durationSlider.value * 60 * 1000;
  elapsedMs = 0;
  isPaused = false;

  playerImage.src = selectedImage;
  playerTitle.textContent = selectedName;

  progressBar.max = totalDurationMs / 1000;
  progressBar.value = 0;

  audio.src = selectedSound;
  audio.loop = true;
  audio.play();

  togglePlay.classList.remove('play');
  togglePlay.classList.add('pause');
  stopBtn.classList.remove('visible');

  home.classList.remove('active');
  player.classList.add('active');

  startTimer();
});

/* =========================
   TIMER GLOBAL
========================= */
function startTimer() {
  clearInterval(timer);

  timer = setInterval(() => {
    if (isPaused) return;

    elapsedMs += 1000;

    if (elapsedMs >= totalDurationMs) {
      resetPlayer();
      return;
    }

    updateUI();
  }, 1000);
}

/* =========================
   UI : BARRE DE LECTURE
========================= */
function updateUI() {
  const elapsedSec = Math.floor(elapsedMs / 1000);
  const remainingSec = Math.ceil((totalDurationMs - elapsedMs) / 1000);

  progressBar.value = elapsedSec;
  currentTimeEl.textContent = formatTime(elapsedSec);
  remainingTimeEl.textContent = "-" + formatTime(remainingSec);
}

/* =========================
   PLAY / PAUSE
========================= */
togglePlay.addEventListener('click', () => {
  isPaused = !isPaused;

  if (isPaused) {
    audio.pause();
    togglePlay.classList.remove('pause');
    togglePlay.classList.add('play');
    stopBtn.classList.add('visible');
  } else {
    audio.play();
    togglePlay.classList.remove('play');
    togglePlay.classList.add('pause');
    stopBtn.classList.remove('visible');
  }
});

/* =========================
   BOUTON TERMINER
========================= */
stopBtn.addEventListener('click', resetPlayer);

function resetPlayer() {
  clearInterval(timer);

  audio.pause();
  audio.currentTime = 0;

  elapsedMs = 0;
  isPaused = false;

  stopBtn.classList.remove('visible');

  player.classList.remove('active');
  home.classList.add('active');

  togglePlay.classList.remove('play');
  togglePlay.classList.add('pause');
}

/* =========================
   FORMATAGE DU TEMPS
========================= */
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = String(seconds % 60).padStart(2, '0');
  return `${min}:${sec}`;
}
