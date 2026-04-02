const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight * 0.6;
const window_width = window.innerWidth * 0.7;
canvas.height = window_height;
canvas.width = window_width;

let raton = { x: undefined, y: undefined };
let circulos = [];
let particulas = []; 
let animacionID; // Para poder detener el bucle de animación

// --- VARIABLES DE PROGRESIÓN ---
let score = 0;
let nivel = 1;
const NIVEL_MAXIMO = 5; // Límite de niveles
let velocidadBase = 2; 
let cantidadPorNivel = 0; 
let cambiandoNivel = false; 

// Elementos del DOM
const scoreDisplay = document.getElementById('scoreDisplay');
const levelDisplay = document.getElementById('levelDisplay');
const overlay = document.getElementById('startOverlay');
const overlaySlider = document.getElementById('overlaySlider');
const overlayDisplay = document.getElementById('overlayNumDisplay');
const btnStart = document.getElementById('btnStart');

// Elementos de la pantalla de Victoria
const victoryOverlay = document.getElementById('victoryOverlay');
const finalScoreDisplay = document.getElementById('finalScoreDisplay');
const btnRestart = document.getElementById('btnRestart');

// --- LÓGICA DE EVENTOS ---
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    raton.x = e.clientX - rect.left;
    raton.y = e.clientY - rect.top;
});

canvas.addEventListener('click', (e) => {
    if (cambiandoNivel) return; 

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    for (let i = circulos.length - 1; i >= 0; i--) {
        let c = circulos[i];
        let distancia = obtenerDistancia(c.posX, c.posY, clickX, clickY);

        if (distancia <= c.radius) {
            for (let j = 0; j < 15; j++) {
                particulas.push(new Particle(c.posX, c.posY, c.color, 3));
            }
            circulos.splice(i, 1);
            score += 10;
            scoreDisplay.innerText = score;
            break; 
        }
    }
});

// --- CLASES ---
class Particle {
    constructor(x, y, color, speedBase) {
        this.x = x; this.y = y;
        this.radius = Math.random() * 3 + 1;
        this.color = color;
        this.opacity = 1;
        this.fadeSpeed = 0.02;
        this.vx = (Math.random() - 0.5) * speedBase * 3;
        this.vy = (Math.random() - 0.5) * speedBase * 3;
    }
    update(context) {
        context.save();
        context.globalAlpha = this.opacity;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
        context.restore();
        this.x += this.vx; this.y += this.vy;
        this.opacity -= this.fadeSpeed;
        return this.opacity <= 0;
    }
}

class Circle {
    constructor(x, y, radius, color, speed) {
        this.posX = x; this.posY = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.isHovered = false;
        this.dx = (Math.random() - 0.5) * this.speed;
        this.dy = (Math.random() - 0.5) * this.speed;
    }
    draw(context) {
        context.beginPath();
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        context.shadowBlur = 12;
        context.shadowColor = this.color;
        context.fillStyle = this.color;
        context.fill();
        context.shadowBlur = 0;
    }
    update(context) {
        this.draw(context);
        if (raton.x && raton.y) {
            if (obtenerDistancia(this.posX, this.posY, raton.x, raton.y) <= this.radius) {
                if (!this.isHovered) { this.color = colorAleatorio(); this.isHovered = true; }
            } else { this.isHovered = false; }
        }
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) this.dx *= -1;
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) this.dy *= -1;
        this.posX += this.dx; this.posY += this.dy;
    }
}

// --- FUNCIONES DE APOYO ---
function obtenerDistancia(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function colorAleatorio() {
    return `hsl(${Math.random() * 360}, 85%, 65%)`;
}

function crearCirculo() {
    let radio = Math.floor(Math.random() * 20 + 15);
    let x = Math.random() * (window_width - radio * 2) + radio;
    let y = Math.random() * (window_height - radio * 2) + radio;
    return new Circle(x, y, radio, colorAleatorio(), velocidadBase);
}

// --- CONTROL DEL JUEGO ---
function subirNivel() {
    nivel++;
    velocidadBase += 1.5; 
    levelDisplay.innerText = nivel;
    
    setTimeout(() => {
        for (let i = 0; i < cantidadPorNivel; i++) {
            circulos.push(crearCirculo());
        }
        cambiandoNivel = false; 
    }, 500);
}

function mostrarVictoria() {
    cancelAnimationFrame(animacionID); // Detenemos la animación del fondo
    finalScoreDisplay.innerText = score;
    victoryOverlay.style.visibility = 'visible';
    victoryOverlay.style.opacity = '1';
}

// Evento Menú Principal -> Iniciar Juego
overlaySlider.addEventListener('input', function() {
    overlayDisplay.innerText = this.value;
});

btnStart.addEventListener('click', function() {
    cantidadPorNivel = parseInt(overlaySlider.value);
    nivel = 1;
    score = 0;
    velocidadBase = 3; 
    cambiandoNivel = false; 
    scoreDisplay.innerText = score;
    levelDisplay.innerText = nivel;
    circulos = [];
    particulas = [];
    
    for (let i = 0; i < cantidadPorNivel; i++) circulos.push(crearCirculo());
    
    overlay.style.opacity = '0';
    setTimeout(() => { 
        overlay.style.visibility = 'hidden'; 
        updateGame(); 
    }, 600);
});

// Evento Pantalla Victoria -> Volver al Menú
btnRestart.addEventListener('click', function() {
    victoryOverlay.style.opacity = '0';
    setTimeout(() => {
        victoryOverlay.style.visibility = 'hidden';
        // Limpiamos el canvas para que esté vacío al volver a empezar
        ctx.clearRect(0, 0, window_width, window_height); 
        // Mostramos de nuevo el menú inicial
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
    }, 600);
});

let updateGame = function () {
    animacionID = requestAnimationFrame(updateGame);
    ctx.clearRect(0, 0, window_width, window_height);

    circulos.forEach(c => c.update(ctx));

    for (let i = 0; i < circulos.length; i++) {
        for (let j = i + 1; j < circulos.length; j++) {
            let c1 = circulos[i], c2 = circulos[j];
            let dist = obtenerDistancia(c1.posX, c1.posY, c2.posX, c2.posY);
            if (dist < c1.radius + c2.radius) {
                let vRelX = c1.dx - c2.dx, vRelY = c1.dy - c2.dy;
                let nx = (c2.posX - c1.posX) / dist, ny = (c2.posY - c1.posY) / dist;
                let velChoque = vRelX * nx + vRelY * ny;
                if (velChoque > 0) {
                    c1.dx -= velChoque * nx; c1.dy -= velChoque * ny;
                    c2.dx += velChoque * nx; c2.dy += velChoque * ny;
                }
            }
        }
    }

    for (let i = particulas.length - 1; i >= 0; i--) {
        if (particulas[i].update(ctx)) particulas.splice(i, 1);
    }

    if (circulos.length === 0 && particulas.length === 0 && !cambiandoNivel) {
        cambiandoNivel = true; 
        if (nivel === NIVEL_MAXIMO) {
            mostrarVictoria(); // Si estamos en el nivel 5, mostramos victoria
        } else {
            subirNivel(); // De lo contrario, seguimos subiendo de nivel
        }
    }
};