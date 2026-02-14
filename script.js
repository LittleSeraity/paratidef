// ===== CONFIGURACIÓN INICIAL DEL CANVAS =====
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ===== FOTO Y PELOTA =====
const img = new Image();
img.src = '5773780779069541719.jpg'; 

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 5,
    vy: 5,
    radius: 60,
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
    lastX: 0,
    lastY: 0
};

// ===== CORAZONES DE FONDO =====
const heartsContainer = document.getElementById('hearts-container');
function createHeart() {
    if (!heartsContainer) return;
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = Math.random() * window.innerWidth + 'px';
    const size = 15 + Math.random() * 15;
    heart.style.width = heart.style.height = size + 'px';
    heart.style.animationDuration = (4 + Math.random() * 3) + 's';
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 7000);
}
setInterval(createHeart, 300);

// ===== DIBUJO Y REBOTE =====
function drawBall() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    if (img.complete) {
        ctx.drawImage(img, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
    } else {
        // Círculo provisional por si la imagen tarda en cargar
        ctx.fillStyle = '#ff69b4';
        ctx.fill();
    }
    ctx.restore();
}

function updateBall() {
    if (!ball.isDragging) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Fricción (frenado natural)
        ball.vx *= 0.99;
        ball.vy *= 0.99;

        // REBOTE TOTAL (con corrección para que no se pegue)
        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.vx = -Math.abs(ball.vx);
        } else if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.vx = Math.abs(ball.vx);
        }

        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius;
            ball.vy = -Math.abs(ball.vy);
        } else if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            ball.vy = Math.abs(ball.vy);
        }

        // Velocidad mínima para que no se pare del todo
        if (Math.abs(ball.vx) < 1 && Math.abs(ball.vy) < 1) {
            ball.vx = (Math.random() - 0.5) * 6;
            ball.vy = (Math.random() - 0.5) * 6;
        }
    }
}

function gameLoop() {
    drawBall();
    updateBall();
    requestAnimationFrame(gameLoop);
}
img.onload = () => { gameLoop(); };
// Por si la imagen ya estaba en cache
if (img.complete) gameLoop();

// ===== INTERACCIÓN (LANZAMIENTO) =====
canvas.addEventListener('mousedown', e => {
    const dx = e.clientX - ball.x;
    const dy = e.clientY - ball.y;
    if (Math.sqrt(dx * dx + dy * dy) < ball.radius) {
        ball.isDragging = true;
        ball.offsetX = dx;
        ball.offsetY = dy;
        ball.lastX = e.clientX;
        ball.lastY = e.clientY;
    }
});

window.addEventListener('mousemove', e => {
    if (ball.isDragging) {
        ball.vx = e.clientX - ball.lastX;
        ball.vy = e.clientY - ball.lastY;
        ball.x = e.clientX - ball.offsetX;
        ball.y = e.clientY - ball.offsetY;
        ball.lastX = e.clientX;
        ball.lastY = e.clientY;
    }
});

window.addEventListener('mouseup', () => {
    if (ball.isDragging) {
        ball.isDragging = false;
        // Limitador de velocidad para que no desaparezca
        const maxS = 20;
        ball.vx = Math.max(-maxS, Math.min(maxS, ball.vx));
        ball.vy = Math.max(-maxS, Math.min(maxS, ball.vy));
    }
});

// ===== FUNCIONES EXTRA (CON PROTECCIÓN) =====
// Esto evita que el juego falle si los IDs no existen en el HTML
const daysCountSpan = document.getElementById("daysCount");
if (daysCountSpan) {
    const startDate = new Date(2026, 0, 3);
    const today = new Date();
    const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    daysCountSpan.textContent = diffDays;
}

const messages = ["TE AMOOO ILHAMMM", "Te amo mi bebe 🌹", "ISRMANNNNNN✨", "Btata M9Lia💕", "Eres mi novia?💝"];
const dailyMessageSpan = document.querySelector(".daily-message");
if (dailyMessageSpan) {
    setInterval(() => {
        dailyMessageSpan.textContent = messages[Math.floor(Math.random() * messages.length)];
    }, 10000);
    dailyMessageSpan.textContent = messages[0];
}

const musicBtn = document.getElementById("musicBtn");
const audio = document.getElementById("audio");
if (musicBtn && audio) {
    musicBtn.addEventListener("click", () => {
        audio.paused ? audio.play() : audio.pause();
    });
}
