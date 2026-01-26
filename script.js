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

let selectedSound = null;
let selectedImage = null;
let selectedName = null;

let totalDurationMs = 0;
let elapsedMs = 0;
let timer = null;
let isPaused = false;

/* ===== SLIDER ===== */
durationValue.textContent = durationSlider.value;
durationSlider.addEventListener('input', () => {
  durationValue.textContent = durationSlider.value;
});

/* ===== SÉLECTION + PRÉ-ÉCOUTE ===== */
cards.forEach(card => {
  card.addEventListener('click', () => {

    if (player.classList.contains('active')) return;

    cards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    selectedSound = card.dataset.sound;
    selectedImage = card.dataset.image;
    selectedName = card.dataset.name;

    audio.pause();
    audio.currentTime = 0;

    audio.src = selectedSound;
    audio.play();

    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 3000);
  });
});


/* ===== LANCEMENT ===== */
startBtn.addEventListener('click', () => {
  if (!selectedSound) return alert("Sélectionnez un son");

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

  togglePlay.textContent = "⏸";
  stopBtn.classList.add('hidden');

  home.classList.remove('active');
  player.classList.add('active');

  startTimer();
});

/* ===== TIMER GLOBAL ===== */
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

/* ===== UI ===== */
function updateUI() {
  const elapsedSec = Math.floor(elapsedMs / 1000);
  const remainingSec = Math.ceil((totalDurationMs - elapsedMs) / 1000);

  progressBar.value = elapsedSec;
  currentTimeEl.textContent = formatTime(elapsedSec);
  remainingTimeEl.textContent = "-" + formatTime(remainingSec);
}

/* ===== PLAY / PAUSE ===== */
togglePlay.addEventListener('click', () => {
  if (isPaused) {
    audio.play();
    isPaused = false;
    togglePlay.textContent = "⏸";
    stopBtn.classList.add('hidden');
  } else {
    audio.pause();
    isPaused = true;
    togglePlay.textContent = "▶";
    stopBtn.classList.remove('hidden');
  }
});

/* ===== TERMINER ===== */
stopBtn.addEventListener('click', resetPlayer);

function resetPlayer() {
  clearInterval(timer);

  audio.pause();
  audio.currentTime = 0;

  elapsedMs = 0;
  isPaused = false;

  player.classList.remove('active');
  home.classList.add('active');
}

/* ===== FORMAT ===== */
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}
