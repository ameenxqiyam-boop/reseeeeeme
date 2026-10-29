// ================================
// PERSONALIZE THIS
// ================================
// Edit these messages to customize the experience

const CONFIG = {
    name: '',

    // Flower discovery messages (shown when each flower is clicked)
    flowerMessages: [
        "A tiny bell, just for your little corner of the world.",
        "A little North Carolina garden, delivered across the internet.",
        "One small thank-you for being a lovely friend.",
        "A quiet bloom with a hint of shrine-at-dusk magic.",
        "Five little bells, all gathered for you."
    ],

    // The letter content (shown when envelope is opened)
    letter: `Hey, friend.

It's kind of lovely how a friendship can travel across the internet and still make an ordinary day feel brighter.

I made this little garden with a few things that felt like you: a bit of purple, some lily-of-the-valley bells, and a whole plushie patrol. There's even a tiny hint of shrine-at-dusk magic.

I hope it gives you a cozy minute whenever you need one. I'm really glad we became friends.

From your friend on the other side of the screen.`,

    // Optional: Background music (add file path to assets/audio/)
    music: '', // Example: 'assets/audio/song.mp3'

    // Final message customization (optional - current text is designed to work well)
    finalMessages: {
        line1: "One last little thing...",
        line2: "I'm really glad we met, even from miles away.",
        line3: "Keep this tiny garden",
        line4: "for a day that could use a little softness.",
        line5: "Made especially for you, with care. 💜"
    }
};

// ================================
// APP STATE
// ================================
const state = {
    currentScene: 'intro',
    flowersFound: new Set(),
    plushiesFound: new Set(),
    envelopeOpened: false,
    isTransitioning: false
};

// ================================
// DOM ELEMENTS
// ================================
const scenes = {
    intro: document.getElementById('scene-intro'),
    garden: document.getElementById('scene-garden'),
    envelope: document.getElementById('scene-envelope'),
    hearts: document.getElementById('scene-hearts'),
    final: document.getElementById('scene-final')
};

const introButton = document.getElementById('intro-button');
const introSubtitle = document.querySelector('.intro-line-2');
const flowers = document.querySelectorAll('.flower');
const flowerMessage = document.getElementById('flower-message');
const flowerProgress = document.querySelector('.flower-progress');
const gardenContinue = document.getElementById('garden-continue');
const envelope = document.getElementById('envelope');
const letterText = document.getElementById('letter-text');
const envelopeContinue = document.getElementById('envelope-continue');
const plushies = document.querySelectorAll('.hidden-heart');
const plushiesProgress = document.querySelector('.hearts-progress');
const plushiesContinue = document.getElementById('hearts-continue');
const finalParticles = document.getElementById('final-particles');

if (CONFIG.name) {
    introSubtitle.textContent = `For ${CONFIG.name} in North Carolina, with plushies, purple skies, and tiny flowers.`;
}

Object.entries(CONFIG.finalMessages).forEach(([line, message]) => {
    document.querySelector(`.final-${line.replace('line', 'line-')}`).textContent = message;
});

// ================================
// SCENE TRANSITIONS
// ================================
function switchScene(fromScene, toScene) {
    if (state.isTransitioning) return;
    state.isTransitioning = true;

    scenes[fromScene].classList.remove('active');

    setTimeout(() => {
        scenes[toScene].classList.add('active');
        state.currentScene = toScene;
        state.isTransitioning = false;

        // Trigger scene-specific animations
        if (toScene === 'final') {
            startFinalAnimation();
        }
    }, 800);
}

// ================================
// INTRO SCENE
// ================================
introButton.addEventListener('click', () => {
    introButton.disabled = true;
    switchScene('intro', 'garden');
});

introButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        introButton.click();
    }
});

// ================================
// FLOWER GARDEN SCENE
// ================================
flowers.forEach(flower => {
    flower.addEventListener('click', () => handleFlowerClick(flower));
    flower.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlowerClick(flower);
        }
    });
});

function handleFlowerClick(flower) {
    const flowerId = flower.dataset.flower;

    if (state.flowersFound.has(flowerId)) return;

    state.flowersFound.add(flowerId);

    // Create sparkle effect
    createSparkle(flower);

    // Show message
    const messageIndex = parseInt(flowerId) - 1;
    flowerMessage.textContent = CONFIG.flowerMessages[messageIndex];
    flowerMessage.classList.add('show');

    // Update progress
    flowerProgress.textContent = `${state.flowersFound.size} of 5 blooms`;

    // Check if all flowers found
    if (state.flowersFound.size === 5) {
        setTimeout(() => {
            flowerMessage.textContent = "Every little bell found its way to you.";
            gardenContinue.classList.remove('hidden');
        }, 1500);
    }
}

function createSparkle(element) {
    const rect = element.getBoundingClientRect();
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        width: 20px;
        height: 20px;
        background: var(--dusty-rose);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: sparkleEffect 0.6s ease forwards;
    `;
    document.body.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 600);
}

// Add sparkle animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleEffect {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(3);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

gardenContinue.addEventListener('click', () => {
    switchScene('garden', 'envelope');
});

gardenContinue.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        gardenContinue.click();
    }
});

// ================================
// ENVELOPE SCENE
// ================================
// Set letter content
letterText.textContent = CONFIG.letter;

envelope.addEventListener('click', () => {
    if (state.envelopeOpened) return;
    state.envelopeOpened = true;

    envelope.classList.add('open');

    setTimeout(() => {
        envelopeContinue.classList.remove('hidden');
    }, 1500);
});

envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        envelope.click();
    }
});

envelopeContinue.addEventListener('click', () => {
    switchScene('envelope', 'hearts');
});

envelopeContinue.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        envelopeContinue.click();
    }
});

// ================================
// PLUSHIE HUNT SCENE
// ================================
plushies.forEach(plushie => {
    plushie.addEventListener('click', () => handlePlushieClick(plushie));
    plushie.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePlushieClick(plushie);
        }
    });
});

function handlePlushieClick(plushie) {
    const plushieId = plushie.dataset.heart;

    if (state.plushiesFound.has(plushieId)) return;

    state.plushiesFound.add(plushieId);
    plushie.classList.add('collected');

    createSparkle(plushie);

    plushiesProgress.textContent = `${state.plushiesFound.size} of 5 plushies`;

    if (state.plushiesFound.size === 5) {
        setTimeout(() => {
            plushiesContinue.classList.remove('hidden');
        }, 1000);
    }
}

plushiesContinue.addEventListener('click', () => {
    switchScene('hearts', 'final');
});

plushiesContinue.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        plushiesContinue.click();
    }
});

// ================================
// FINAL SCENE
// ================================
function startFinalAnimation() {
    // Create falling petals
    for (let i = 0; i < 20; i++) {
        setTimeout(() => createFallingPetal(), i * 200);
    }

    // Create floating fireflies
    for (let i = 0; i < 10; i++) {
        setTimeout(() => createFloatingFirefly(), i * 300);
    }

    // Create sparkles
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createParticleSparkle(), i * 250);
    }
}

function createFallingPetal() {
    const petal = document.createElement('div');
    petal.className = 'particle';
    const startX = Math.random() * 100;
    const size = 20 + Math.random() * 20;
    const duration = 4 + Math.random() * 3;

    petal.style.cssText = `
        left: ${startX}%;
        top: -30px;
        width: ${size}px;
        height: ${size}px;
        background: var(--pastel-pink);
        border-radius: 50% 0 50% 50%;
        opacity: 0.6;
        animation: fallPetal ${duration}s linear forwards;
    `;

    finalParticles.appendChild(petal);

    setTimeout(() => petal.remove(), duration * 1000);
}

function createFloatingFirefly() {
    const firefly = document.createElement('div');
    firefly.className = 'particle';
    const startX = Math.random() * 100;
    const size = 5 + Math.random() * 5;
    const duration = 5 + Math.random() * 3;

    firefly.style.cssText = `
        left: ${startX}%;
        bottom: -30px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: #f2dfb3;
        box-shadow: 0 0 14px 4px rgba(242, 223, 179, 0.4);
        animation: floatHeart ${duration}s ease-out forwards;
    `;

    finalParticles.appendChild(firefly);

    setTimeout(() => firefly.remove(), duration * 1000);
}

function createParticleSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'particle';
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const size = 5 + Math.random() * 10;
    const duration = 2 + Math.random() * 2;

    sparkle.style.cssText = `
        left: ${startX}%;
        top: ${startY}%;
        width: ${size}px;
        height: ${size}px;
        background: var(--dusty-rose);
        border-radius: 50%;
        animation: particleSparkle ${duration}s ease-out forwards;
    `;

    finalParticles.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), duration * 1000);
}

// Add final animation keyframes
const finalStyle = document.createElement('style');
finalStyle.textContent = `
    @keyframes fallPetal {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.6;
        }
        100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
        }
    }

    @keyframes floatHeart {
        0% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
        }
        100% {
            transform: translateY(-100vh) scale(0.5);
            opacity: 0;
        }
    }

    @keyframes particleSparkle {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        50% {
            transform: scale(1.5);
            opacity: 0.8;
        }
        100% {
            transform: scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(finalStyle);

// ================================
// OPTIONAL MUSIC
// ================================
if (CONFIG.music) {
    const audio = new Audio(CONFIG.music);
    audio.loop = true;
    audio.volume = 0.3;

    // Play on first interaction
    document.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(() => {
                // Autoplay blocked - user needs to interact first
            });
        }
    }, { once: true });
}

// ================================
// WINDOW RESIZE HANDLING
// ================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Adjust any dynamic layouts if needed
    }, 250);
});
