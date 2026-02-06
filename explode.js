// ---------------------------------------------------------
// 1. AUDIO SETUP — preload + decode for instant playback
// ---------------------------------------------------------
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let explosionBuffer = null;

// Preload and decode explosion sound
fetch("assets/explosion.mp3")
    .then(res => res.arrayBuffer())
    .then(data => audioContext.decodeAudioData(data))
    .then(buffer => {
        explosionBuffer = buffer;
    });

// Play explosion sound instantly with random pitch
function playExplosionSound() {
    if (!explosionBuffer) return; // still loading
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const source = audioContext.createBufferSource();
    source.buffer = explosionBuffer;

    // Random pitch variation
    source.playbackRate.value = 0.9 + Math.random() * 0.5;

    source.connect(audioContext.destination);
    source.start(0);
}



// ---------------------------------------------------------
// 2. EXPLOSION GIF SPAWNER — unique GIF per explosion
// ---------------------------------------------------------
function spawnExplosionGIF(x, y) {
    const overlay = document.getElementById("explosion-overlay");

    const img = document.createElement("img");
    img.src = "assets/explosion.gif?cb=" + Date.now(); // unique instance
    img.className = "explosion-gif";
    img.style.left = x + "px";
    img.style.top = y + "px";

    overlay.appendChild(img);

    // Remove after animation duration
    setTimeout(() => img.remove(), 1500);
}



// ---------------------------------------------------------
// 3. MAIN LOGIC — attach explosion behavior to DOM elements
// ---------------------------------------------------------
window.addEventListener("load", () => {
    const body = document.body;
    const elements = document.querySelectorAll("body *");

    // Determine which attribute to check
    const explodableAttr = body.hasAttribute("selective-explodables")
        ? "explodable"
        : "non-explodable";

    elements.forEach(el => {
        const shouldExplode =
            explodableAttr === "explodable"
                ? el.hasAttribute("explodable")
                : !el.hasAttribute("non-explodable");

        if (!shouldExplode) return;

        el.addEventListener("mousedown", event => {
            event.stopPropagation();

            el.classList.add("exploded");

            const rect = el.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            spawnExplosionGIF(x, y);
            playExplosionSound();
        });
    });
});
