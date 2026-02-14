// ===== CORAZONES =====
const heartsContainer = document.getElementById('hearts-container');
const heartPositions = [];

function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  let x;
  let attempts = 0;
  do {
    x = Math.random() * window.innerWidth;
    attempts++;
  } while (heartPositions.some(pos => Math.abs(pos - x) < 30) && attempts < 50);

  heartPositions.push(x);
  if (heartPositions.length > 50) heartPositions.shift();

  heart.style.left = x + 'px';
  const size = 15 + Math.random() * 15;
  heart.style.width = size + 'px';
  heart.style.height = size + 'px';
  heart.style.animationDuration = (4 + Math.random() * 3) + 's';
  heart.style.opacity = 0.5 + Math.random() * 0.5;

  heartsContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 7000);
}

setInterval(createHeart, 300);

// ===== DÍAS JUNTOS =====
const daysCountSpan = document.getElementById("daysCount");
function updateDays() {
  if (!daysCountSpan) return;
  const startDate = new Date(2026, 0, 3);
  const today = new Date();
  startDate.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  const diffTime = today - startDate;
  const diffDays = Math.floor(diffTime / (1000*60*60*24));
  daysCountSpan.textContent = diffDays;
}
updateDays();

// ===== MANECILLA DEL RELOJ =====
const clockHand = document.getElementById('clockHand');
let angle = 0;
setInterval(() => {
  angle += 6;
  if(angle>=360) angle = 0;
  if(clockHand) clockHand.style.transform = `translate(-50%,-100%) rotate(${angle}deg)`;
}, 1000);

// ===== NÚMEROS DEL RELOJ RESPONSIVE =====
function positionClockNumbers() {
  const marks = document.querySelectorAll(".hour-mark");
  const clock = document.querySelector(".clock-bg");
  if (!clock) return;
  const radius = clock.offsetWidth / 2 - 40; // radio dinámico
  marks.forEach(mark => {
    const angleDeg = mark.dataset.angle || 0;
    const rad = (angleDeg - 90) * Math.PI / 180; // -90 para empezar arriba
    const x = radius * Math.cos(rad);
    const y = radius * Math.sin(rad);
    mark.style.left = `calc(50% + ${x}px)`;
    mark.style.top = `calc(50% + ${y}px)`;
    mark.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
  });
}
positionClockNumbers();
window.addEventListener('resize', positionClockNumbers);

// ===== MENSAJE DIARIO =====
const messages = [
  "TE AMOOO ILHAMMM",
  "Te amo mi bebe 🌹",
  "ISRMANNNNNN✨",
  "Btata M9Lia💕",
  "Eres mi novia?💝"
];
const dailyMessageSpan = document.querySelector(".daily-message");

function showDailyMessage() {
  if (!dailyMessageSpan) return;
  const randomIndex = Math.floor(Math.random() * messages.length);
  dailyMessageSpan.textContent = messages[randomIndex];
}

// Mostrar mensaje al cargar la página
showDailyMessage();

// Cambiar mensaje automáticamente cada 10 segundos
setInterval(showDailyMessage, 10000);

// ===== MÚSICA =====
const audio = document.getElementById("audio");
const musicBtn = document.getElementById("musicBtn");

function toggleMusic() {
  if (!audio) return;
  if (audio.paused) {
    audio.play();
    if (musicBtn) musicBtn.textContent = "Pausar música";
  } else {
    audio.pause();
    if (musicBtn) musicBtn.textContent = "Reproducir música";
  }
}

if (musicBtn) musicBtn.addEventListener("click", toggleMusic);
