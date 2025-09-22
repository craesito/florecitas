// Variables globales
let canvas, ctx;
let flowers = [];
let particles = [];
let animationId;
let musicPlaying = false;

// Configuración
const CONFIG = {
    canvas: {
        width: 800,
        height: 400
    },
    flowers: {
        count: 12,
        colors: ['#FFD700', '#FFA500', '#FFFF00', '#FFEB3B', '#FFC107', '#FF8C00']
    },
    particles: {
        count: 30
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initCanvas();
    createParticles();
    createFlowers();
    initMusic();
    startAnimation();
});

// Inicializar canvas
function initCanvas() {
    canvas = document.getElementById('flowerCanvas');
    ctx = canvas.getContext('2d');
    
    // Ajustar tamaño del canvas
    canvas.width = CONFIG.canvas.width;
    canvas.height = CONFIG.canvas.height;
    
    // Hacer el canvas responsive
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
}

function resizeCanvas() {
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth - 40;
    const maxWidth = Math.min(containerWidth, CONFIG.canvas.width);
    
    canvas.style.width = maxWidth + 'px';
    canvas.style.height = (maxWidth * CONFIG.canvas.height / CONFIG.canvas.width) + 'px';
}

// Crear partículas de fondo
function createParticles() {
    const container = document.getElementById('particles-container');
    
    for (let i = 0; i < CONFIG.particles.count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posición aleatoria
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Tamaño aleatorio
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Animación aleatoria
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        
        container.appendChild(particle);
    }
}

// Crear flores
function createFlowers() {
    for (let i = 0; i < CONFIG.flowers.count; i++) {
        const flower = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 30 + 20,
            color: CONFIG.flowers.colors[Math.floor(Math.random() * CONFIG.flowers.colors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.05 + 0.02,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 1,
            stemHeight: Math.random() * 20 + 30,
            petals: Math.floor(Math.random() * 3) + 6 // 6-8 pétalos
        };
        flowers.push(flower);
    }
}

// Dibujar una flor
function drawFlower(flower) {
    const scale = 1 + 0.2 * Math.sin(flower.pulse);
    const currentSize = flower.size * scale;
    
    ctx.save();
    ctx.translate(flower.x, flower.y);
    ctx.rotate(flower.rotation);
    
    // Dibujar tallo
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, currentSize / 2);
    ctx.lineTo(0, currentSize / 2 + flower.stemHeight);
    ctx.stroke();
    
    // Dibujar hojas del tallo
    ctx.fillStyle = '#32CD32';
    for (let i = 0; i < 3; i++) {
        const leafY = currentSize / 2 + 10 + i * 8;
        if (leafY < currentSize / 2 + flower.stemHeight) {
            // Hoja izquierda
            ctx.beginPath();
            ctx.ellipse(-8, leafY, 6, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Hoja derecha
            ctx.beginPath();
            ctx.ellipse(8, leafY, 6, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Centro de la flor
    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.arc(0, 0, currentSize / 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Pétalos exteriores
    for (let i = 0; i < flower.petals; i++) {
        const angle = (i * Math.PI * 2) / flower.petals;
        const petalX = Math.cos(angle) * (currentSize / 2 + 5);
        const petalY = Math.sin(angle) * (currentSize / 2 + 5);
        
        ctx.fillStyle = flower.color;
        ctx.beginPath();
        ctx.arc(petalX, petalY, currentSize / 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Efecto de brillo
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    // Pétalos interiores
    for (let i = 0; i < flower.petals; i++) {
        const angle = (i * Math.PI * 2) / flower.petals;
        const petalX = Math.cos(angle) * (currentSize / 3);
        const petalY = Math.sin(angle) * (currentSize / 3);
        
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(petalX, petalY, currentSize / 12, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

// Animación principal
function animate() {
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Actualizar y dibujar flores
    flowers.forEach(flower => {
        // Mover flor
        flower.x += flower.speedX;
        flower.y += flower.speedY;
        
        // Rotar flor
        flower.rotation += flower.rotationSpeed;
        
        // Efecto de pulso
        flower.pulse += flower.pulseSpeed;
        
        // Rebotar en los bordes
        if (flower.x < 0 || flower.x > canvas.width) {
            flower.speedX *= -1;
        }
        if (flower.y < 0 || flower.y > canvas.height) {
            flower.speedY *= -1;
        }
        
        // Mantener dentro del canvas
        flower.x = Math.max(0, Math.min(canvas.width, flower.x));
        flower.y = Math.max(0, Math.min(canvas.height, flower.y));
        
        // Dibujar flor
        drawFlower(flower);
    });
    
    // Dibujar partículas flotantes
    drawFloatingParticles();
    
    animationId = requestAnimationFrame(animate);
}

// Dibujar partículas flotantes
function drawFloatingParticles() {
    for (let i = 0; i < 15; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 3 + 1;
        
        ctx.fillStyle = `rgba(255, 215, 0, ${Math.random() * 0.8 + 0.2})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Efecto de resplandor
        ctx.strokeStyle = `rgba(255, 215, 0, ${Math.random() * 0.5 + 0.2})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// Inicializar música
function initMusic() {
    const musicBtn = document.getElementById('musicBtn');
    const audio = document.getElementById('backgroundMusic');
    
    // Configurar audio
    audio.volume = 0.8;
    audio.loop = true;
    
    // Función para reproducir música
    function playMusic() {
        audio.play().then(() => {
            musicBtn.innerHTML = '<span class="music-icon">⏸️</span><span class="music-text">Páusame</span>';
            musicPlaying = true;
            console.log('Música reproduciéndose correctamente');
        }).catch(error => {
            console.log('Error:', error);
            alert('No se pudo reproducir la música. Verifica que el archivo florecienta.mp3 esté en la carpeta.');
        });
    }
    
    // Función para pausar música
    function pauseMusic() {
        audio.pause();
        musicBtn.innerHTML = '<span class="music-icon">🎵</span><span class="music-text">Tócame</span>';
        musicPlaying = false;
    }
    
    // Botón principal
    musicBtn.addEventListener('click', function() {
        if (musicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });
    
    // Reproducir al hacer clic en cualquier parte
    document.addEventListener('click', function() {
        if (!musicPlaying && audio.paused) {
            playMusic();
        }
    }, { once: true });
}

// Iniciar animación
function startAnimation() {
    animate();
}

// Efectos especiales
function addGlowEffect() {
    const elements = document.querySelectorAll('.main-title, .love-message');
    elements.forEach(element => {
        element.classList.add('glow');
    });
}

// Activar efectos después de un tiempo
setTimeout(addGlowEffect, 3000);

// Efecto de confeti al hacer clic
document.addEventListener('click', function(e) {
    createConfetti(e.clientX, e.clientY);
});

function createConfetti(x, y) {
    for (let i = 0; i < 10; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.backgroundColor = CONFIG.flowers.colors[Math.floor(Math.random() * CONFIG.flowers.colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        
        document.body.appendChild(confetti);
        
        // Animación de confeti
        const animation = confetti.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${(Math.random() - 0.5) * 200}px, ${Math.random() * 200}px) rotate(360deg)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => {
            confetti.remove();
        };
    }
}
