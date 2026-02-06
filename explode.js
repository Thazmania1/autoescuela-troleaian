// ---------------------------------------------------------
// PATH HANDLING — dynamic relative paths for GitHub Pages
// ---------------------------------------------------------
const depth = window.location.pathname.split("/").length - 2;
const prefix = "../".repeat(depth - 1);
const ASSET = (file) => prefix + "assets/" + file;


// ---------------------------------------------------------
// 1. AUDIO SETUP — preload + decode for instant playback
// ---------------------------------------------------------
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let explosionBuffer = null;

// Preload and decode explosion sound
fetch(ASSET("explosion.mp3"))
    .then(res => res.arrayBuffer())
    .then(data => audioContext.decodeAudioData(data))
    .then(buffer => {
        explosionBuffer = buffer;
    });

function playExplosionSound() {
    if (!explosionBuffer) return;
    if (audioContext.state === "suspended") audioContext.resume();

    const source = audioContext.createBufferSource();
    source.buffer = explosionBuffer;
    source.playbackRate.value = 0.9 + Math.random() * 0.5;
    source.connect(audioContext.destination);
    source.start(0);
}


// ---------------------------------------------------------
// 2. EXPLOSION GIF SPAWNER
// ---------------------------------------------------------
function spawnExplosionGIF(x, y) {
    const overlay = document.getElementById("explosion-overlay");

    const img = document.createElement("img");
    img.src = ASSET("explosion.gif") + "?cb=" + Date.now();
    img.className = "explosion-gif";
    img.style.left = x + "px";
    img.style.top = y + "px";

    overlay.appendChild(img);
    setTimeout(() => img.remove(), 1500);
}


// ---------------------------------------------------------
// 3. MAIN LOGIC
// ---------------------------------------------------------
window.addEventListener("load", () => {
    const body = document.body;
    const elements = document.querySelectorAll("body *");

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
            const x = rect.left + rect.width / 2 + window.scrollX;
            const y = rect.top + rect.height / 2 + window.scrollY;

            spawnExplosionGIF(x, y);
            playExplosionSound();
        });
    });
});
