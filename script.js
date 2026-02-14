// ===== CONFIGURACIÓN INICIAL DEL CANVAS =====
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
function resizeCanvas(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
window.addEventListener('resize',resizeCanvas);
resizeCanvas();

// ===== FOTO Y PELOTA (CON INERCIA) =====
const img = new Image();
img.src = '5773780779069541719.jpg'; 

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 3,
    vy: 3,
    radius: 60,
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
    lastX: 0, // Para calcular el impulso
    lastY: 0
};

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

    if (heartsContainer) heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 7000);
}
setInterval(createHeart, 300);

// ===== LÓGICA DE DIBUJO Y REBOTE =====
function drawBall() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
    ctx.restore();
}

function updateBall() {
    if (!ball.isDragging) {
        // Aplicar movimiento
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Fricción suave (para que no ruede infinitamente a mil por hora)
        ball.vx *= 0.98;
        ball.vy *= 0.98;

        // Rebote en bordes con corrección de posición
        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.vx *= -1;
        } else if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.vx *= -1;
        }

        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius;
            ball.vy *= -1;
        } else if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            ball.vy *= -1;
        }

        // Si se frena demasiado, mantener un movimiento mínimo
        if (Math.abs(ball.vx) < 0.5 && Math.abs(ball.vy) < 0.5) {
            ball.vx = (Math.random() - 0.5) * 4;
            ball.vy = (Math.random() - 0.5) * 4;
        }
    }
}

function gameLoop() {
    drawBall();
    updateBall();
    requestAnimationFrame(gameLoop);
}
img.onload = () => { gameLoop(); };

// ===== EVENTOS DE MOUSE (LANZAMIENTO) =====
canvas.addEventListener('mousedown', e => {
    const dx = e.clientX - ball.x;
    const dy = e.clientY - ball.y;
    if (Math.sqrt(dx * dx + dy * dy) < ball.radius) {
        ball.isDragging = true;
        ball.offsetX = dx;
        ball.offsetY = dy;
        ball.lastX = e.clientX;
        ball.lastY = e.clientY;
        canvas.style.cursor = 'grabbing';
    }
});

window.addEventListener('mousemove', e => {
    if (ball.isDragging) {
        // Calculamos la velocidad actual según el movimiento del ratón
        ball.vx = e.clientX - ball.lastX;
        ball.vy = e.clientY - ball.lastY;

        // Actualizamos posición
        ball.x = e.clientX - ball.offsetX;
        ball.y = e.clientY - ball.offsetY;

        // Guardamos posición para el siguiente cálculo
        ball.lastX = e.clientX;
        ball.lastY = e.clientY;
    }
});

window.addEventListener('mouseup', () => {
    if (ball.isDragging) {
        ball.isDragging = false;
        canvas.style.cursor = 'grab';
        
        // Limitamos la velocidad máxima de lanzamiento
        const maxSpeed = 20;
        ball.vx = Math.max(-maxSpeed, Math.min(maxSpeed, ball.vx));
        ball.vy = Math.max(-maxSpeed, Math.min(maxSpeed, ball.vy));
    }
});

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

// ===== RELOJ Y MENSAJES =====
const clockHand = document.getElementById('clockHand');
let angle = 0;
setInterval(() => {
    angle += 6;
    if(angle>=360) angle = 0;
    if(clockHand) clockHand.style.transform = `translate(-50%,-100%) rotate(${angle}deg)`;
}, 1000);

const messages = ["TE AMOOO ILHAMMM", "Te amo mi bebe 🌹", "ISRMANNNNNN✨", "Btata M9Lia💕", "Eres mi novia?💝"];
const dailyMessageSpan = document.querySelector(".daily-message");

function showDailyMessage() {
    if (!dailyMessageSpan) return;
    const randomIndex = Math.floor(Math.random() * messages.length);
    dailyMessageSpan.textContent = messages[randomIndex];
}
showDailyMessage();
setInterval(showDailyMessage, 10000);

// ===== MÚSICA =====
const audio = document.getElementById("audio");
const musicBtn = document.getElementById("musicBtn");
function toggleMusic() {
    if (!audio) return;
    audio.paused ? audio.play() : audio.pause();
}
if (musicBtn) musicBtn.addEventListener("click", toggleMusic);
