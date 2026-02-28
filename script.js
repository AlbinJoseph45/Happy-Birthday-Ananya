/* FLOATING ITEMS */
const defaultItems = ["🌙", "✨", "🎈", "🎂", "💛"];
const hearts = ["💛", "💚"];

function createFloating(x = null, y = null, isAuto = false) {
    const items = document.body.classList.contains("hearts-only") ? hearts : defaultItems;

    // Check if floating over a clickable element (skip if yes)
    if (!isAuto && x !== null && y !== null) {
        const elUnderCursor = document.elementFromPoint(x, y);
        if (elUnderCursor && (elUnderCursor.tagName === "BUTTON" || elUnderCursor.tagName === "INPUT" || elUnderCursor.tagName === "A")) {
            return; // skip creating floating item over clickable element
        }
    }

    const el = document.createElement("div");
    el.classList.add("floating");

    if (x !== null && y !== null) {
        // Mouse/touch hearts
        el.innerText = hearts[Math.floor(Math.random() * hearts.length)];
        el.style.left = x + "px";
        el.style.top = y + "px";
        el.style.bottom = "auto";
        el.style.position = "fixed";
        el.style.fontSize = "14px"; // smaller than auto-floating
        el.style.animationDuration = "3s"; // faster float
    } else {
        // Auto-floating emojis
        el.innerText = items[Math.floor(Math.random() * items.length)];
        el.style.left = Math.random() * 100 + "vw";
        el.style.fontSize = "22px"; // slightly bigger
        el.style.animationDuration = "6s"; // slower float
    }

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 8000);
}

// Auto-floating interval
setInterval(() => createFloating(null, null, true), 800);

// Mouse trail
document.addEventListener("mousemove", (e) => {
    if (Math.random() > 0.7) {
        createFloating(e.clientX, e.clientY);
    }
});

// Mobile touch trail
document.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    if (Math.random() > 0.7) {
        createFloating(touch.clientX, touch.clientY);
    }
});

// Scroll hearts
document.addEventListener("scroll", () => {
    if (Math.random() > 0.85) {
        createFloating(Math.random() * window.innerWidth, window.innerHeight - 50, true);
    }
});

/* JOURNEY BUTTON */
function next(page) {
    document.body.classList.add("fade-out");
    setTimeout(() => window.location = page, 800);
}

/* QUIZ */
// -------- PROGRESS BAR --------

const totalQuestions = 5;
const progressBar = document.getElementById("progress-bar");

document.querySelectorAll("input[type=radio]").forEach(radio => {
    radio.addEventListener("change", updateProgress);
});

function updateProgress() {
    let answered = 0;

    for (let i = 1; i <= totalQuestions; i++) {
        if (document.querySelector(`input[name=q${i}]:checked`)) {
            answered++;
        }
    }

    let percentage = (answered / totalQuestions) * 100;
    progressBar.style.width = percentage + "%";
}


// -------- QUIZ SUBMIT --------
let currentQuestion = 0;
let score = 0;

const questions = document.querySelectorAll(".question");
const scoreDisplay = document.getElementById("scoreDisplay");
const result = document.getElementById("result");
const continueBtn = document.getElementById("continueBtn");

questions.forEach((question, qIndex) => {
    const options = question.querySelectorAll(".option");

    options.forEach((option, oIndex) => {
        option.addEventListener("click", () => {

            if (question.classList.contains("answered")) return;
            question.classList.add("answered");

            const correctIndex = parseInt(question.dataset.correct);

            if (oIndex === correctIndex) {
                option.classList.add("correct-answer");
                score++;
            } else {
                option.classList.add("wrong-answer");
                options[correctIndex].classList.add("correct-answer");
            }

            scoreDisplay.innerText = `Score: ${score} / ${questions.length}`;

            setTimeout(() => {
                question.classList.remove("active");

                currentQuestion++;

                if (currentQuestion < questions.length) {
                    questions[currentQuestion].classList.add("active");
                } else {
                    showFinalResult();
                }

            }, 1200);
        });
    });
});

function showFinalResult() {

    if (score === questions.length) {
        result.innerHTML = "Perfect score 💞 You truly know us!";
        launchConfetti();
    } else if (score >= 3) {
        result.innerHTML = "Still my forever 🌙 You did amazing!";
    } else {
        result.innerHTML = "Even wrong answers feel right with you 💛";
    }

    continueBtn.style.display = "inline-block";
}

/* LETTER */
function revealLetter() {
    document.querySelector(".letter").classList.add("show");
}

/* CONFETTI */
function launchConfetti() {
    for (let i = 0; i < 120; i++) {
        let c = document.createElement("div");
        c.classList.add("confetti");
        c.style.left = Math.random() * 100 + "vw";
        c.style.backgroundColor = ["#f4d03f", "#2ecc71", "#f8c471", "#a9dfbf"][Math.floor(Math.random() * 4)];
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 3000);
    }
}

/* COUNTDOWN WITH ANIMATION */
function countdown() {
    const duration = 5;
    const el = document.getElementById("count");
    const message = document.getElementById("message");

    let timeLeft = duration;

    const timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            el.innerHTML = "🎉 HAPPY BIRTHDAY ANANYA 🎉";
            el.classList.add("big-bounce");

            message.classList.remove("hidden");
            message.classList.add("fade-in");

            launchConfetti();
        } else {
            el.innerHTML = timeLeft;
            el.classList.add("pop");
            setTimeout(() => el.classList.remove("pop"), 300);
            timeLeft--;
        }
    }, 1000);
}

countdown();


/* IMPROVED CONFETTI */
function launchConfetti() {
    const canvas = document.getElementById("confetti");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let fireworks = [];

    class Firework {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.particles = [];

            for (let i = 0; i < 80; i++) {
                this.particles.push({
                    x: this.x,
                    y: this.y,
                    angle: Math.random() * Math.PI * 2,
                    speed: Math.random() * 6 + 2,
                    radius: Math.random() * 3 + 2,
                    alpha: 1,
                    color: `hsl(${Math.random() * 360}, 100%, 50%)`
                });
            }
        }

        update() {
            this.particles.forEach(p => {
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed;
                p.alpha -= 0.01;
            });

            this.particles = this.particles.filter(p => p.alpha > 0);
        }

        draw() {
            this.particles.forEach(p => {
                ctx.globalAlpha = p.alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });
            ctx.globalAlpha = 1;
        }
    }

    function createFirework() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height / 2;
        fireworks.push(new Firework(x, y));
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Randomly create new fireworks continuously
        if (Math.random() < 0.05) {
            createFirework();
        }

        fireworks.forEach(f => {
            f.update();
            f.draw();
        });

        fireworks = fireworks.filter(f => f.particles.length > 0);

        requestAnimationFrame(animate);
    }

    animate();
}

/* TRACK which pieces are correctly placed */
let correctPieces = new Set();
let puzzleSolved = false; // Lock flag

// Initialize the puzzle
function initPuzzle() {
    const container = document.getElementById("puzzle");
    if (!container) return;

    const size = 3;
    const pieces = [];

    // Create puzzle pieces
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const div = document.createElement("div");
            div.classList.add("puzzle-piece");
            div.style.backgroundImage = "url('images/us.jpeg')";
            div.style.backgroundSize = `${size * 100}px ${size * 100}px`;
            div.style.backgroundPosition = `-${c * 100}px -${r * 100}px`;
            div.dataset.row = r;
            div.dataset.col = c;
            pieces.push(div);
        }
    }

    // Shuffle pieces
    let shuffled;
    do {
        shuffled = pieces.slice().sort(() => Math.random() - 0.5);
    } while (shuffled.every((p, idx) => {
        const r = Math.floor(idx / size);
        const c = idx % size;
        return parseInt(p.dataset.row) === r && parseInt(p.dataset.col) === c;
    }));
    shuffled.forEach(p => container.appendChild(p));

    let dragSrc = null;

    pieces.forEach(p => {
        p.setAttribute("draggable", "true");

        // Desktop: Drag start
        p.addEventListener("dragstart", e => {
            if (puzzleSolved) return;
            dragSrc = p;
            p.classList.add("dragging");
        });

        // Desktop: Drag end
        p.addEventListener("dragend", e => {
            if (puzzleSolved) return;
            p.classList.remove("dragging");
        });

        // Desktop: Drag over
        p.addEventListener("dragover", e => { if (!puzzleSolved) e.preventDefault(); });

        // Desktop: Drop to swap
        p.addEventListener("drop", e => {
            if (puzzleSolved) return;
            e.preventDefault();
            if (dragSrc && dragSrc !== p) {
                const parent = container;
                const dragNext = dragSrc.nextSibling === p ? dragSrc : dragSrc.nextSibling;
                parent.insertBefore(dragSrc, p);
                parent.insertBefore(p, dragNext);

                handleSwap(dragSrc, p); // Handle swap logic for both desktop and mobile
            }
        });

        // Mobile: Touch end (simulates a move)
        p.addEventListener("touchend", e => {
            if (puzzleSolved) return;
            handleSwap(p, p); // Handle same piece move for mobile
        });
    });
}

// Handle piece swap or single move
function handleSwap(piece1, piece2) {
    const pieces = [piece1, piece2];
    const statuses = pieces.map(p => {
        const container = p.parentElement;
        const idx = Array.from(container.children).indexOf(p);
        const r = Math.floor(idx / 3);
        const c = idx % 3;
        const key = p.dataset.row + "-" + p.dataset.col;
        const correct = parseInt(p.dataset.row) === r && parseInt(p.dataset.col) === c;
        if (correct && !correctPieces.has(key)) {
            correctPieces.add(key);
        } else if (!correct && correctPieces.has(key)) {
            correctPieces.delete(key);
        }
        return { piece: p, correct, key };
    });

    const correctCount = statuses.filter(s => s.correct).length;

    // Handle swap result based on correctness of the pieces
    if (correctCount === 2) {
        // Both correct
        statuses.forEach(s => {
            spawnHeart(s.piece);
        });
        playSound('correct');
    } else if (correctCount === 0) {
        // Both wrong
        statuses.forEach(s => {
            s.piece.classList.add("wrong-glow");
            playSound('wrong');
            setTimeout(() => s.piece.classList.remove("wrong-glow"), 500);
        });
    } else if (correctCount === 1) {
        // One correct, one wrong
        const correctPiece = statuses.find(s => s.correct).piece;
        spawnHeart(correctPiece);
        playSound('correct');
        // Nothing for the wrong piece
    }

    checkPuzzle();
}

// Spawn heart for correct placement
function spawnHeart(piece) {
    const rect = piece.getBoundingClientRect();
    const x = rect.left + rect.width / 2 - 7;
    const y = rect.top + rect.height / 2 - 7;

    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1500); // Remove heart after animation completes
}

// Sparkle trail for correct placement
function spawnSparkle(piece) {
    const rect = piece.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement("div");
        sparkle.classList.add("heart");
        sparkle.style.width = sparkle.style.height = (5 + Math.random() * 10) + "px";
        sparkle.style.left = rect.left + rect.width / 2 + (Math.random() * 40 - 20) + "px";
        sparkle.style.top = rect.top + rect.height / 2 + (Math.random() * 40 - 20) + "px";
        sparkle.style.opacity = 0.7;
        sparkle.style.animationDuration = (1 + Math.random()) + "s";
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1500);
    }
}

// Check puzzle completion
function checkPuzzle() {
    const container = document.getElementById("puzzle");
    const children = Array.from(container.children);
    let solved = true;

    children.forEach((p, idx) => {
        const r = Math.floor(idx / 3);
        const c = idx % 3;
        if (parseInt(p.dataset.row) !== r || parseInt(p.dataset.col) !== c) {
            solved = false;
        }
    });

    if (solved) {
        document.getElementById("puzzleMessage").style.display = "block";
        celebrateVictory();
    }
}

// Celebrate victory: floating hearts and sounds
function celebrateVictory() {
    // Delay locking the puzzle until animation is finished
    const victoryDuration = 4000; // Match the animation duration

    const container = document.getElementById("puzzle");
    const rect = container.getBoundingClientRect();

    // Generate 50 floating hearts
    for (let i = 0; i < 50; i++) {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.style.width = heart.style.height = (10 + Math.random() * 15) + "px";
        heart.style.left = rect.left + Math.random() * rect.width + "px";
        heart.style.top = rect.top + Math.random() * rect.height + "px";
        heart.style.opacity = 0.7;
        heart.style.animationDuration = (2 + Math.random() * 2) + "s";
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), victoryDuration);
    }

    // Play celebration sound
    playSound('complete');

    // Lock puzzle after victory animation
    setTimeout(() => {
        puzzleSolved = true;
    }, victoryDuration); // Puzzle locks after the animation is done
}

// Play sound using Web Audio API
function playSound(type) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);

    if (type === 'correct') {
        o.type = 'sine'; o.frequency.setValueAtTime(880, ctx.currentTime); // High note
        g.gain.setValueAtTime(0.1, ctx.currentTime);
        o.start();
        o.stop(ctx.currentTime + 0.15);
    }
    else if (type === 'wrong') {
        o.type = 'triangle'; o.frequency.setValueAtTime(220, ctx.currentTime); // Low buzz
        g.gain.setValueAtTime(0.1, ctx.currentTime);
        o.start();
        o.stop(ctx.currentTime + 0.15);
    }
    else if (type === 'complete') {
        // Small chord
        const freqs = [440, 660, 880];
        freqs.forEach(f => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        });
    }
}

// Initialize puzzle when the page loads
window.addEventListener("load", initPuzzle);


/* CONSTELLATION UNLOCK GAME */
window.addEventListener("load", function () {

    const stars = document.querySelectorAll(".star");
    const selectedContainer = document.getElementById("selectedMemories");

    if (!stars.length) return;

    const correctOrder = ["1", "3", "5", "4", "2"];
    let userOrder = [];

    stars.forEach(star => {
        star.addEventListener("click", function () {

            const id = this.getAttribute("data-id");

            if (!userOrder.includes(id)) {

                userOrder.push(id);
                this.classList.add("active");

                // Create preview card
                const imgSrc = this.querySelector("img").src;
                const card = document.createElement("div");
                card.classList.add("selected-card");

                const img = document.createElement("img");
                img.src = imgSrc;

                card.appendChild(img);
                selectedContainer.appendChild(card);
            }

            if (userOrder.length === correctOrder.length) {
                checkOrder();
            }
        });
    });

    function checkOrder() {
        const feedback = document.getElementById("feedback");

        if (JSON.stringify(userOrder) === JSON.stringify(correctOrder)) {
            feedback.innerHTML = "The stars obey you 🌟";
            document.querySelector(".moon-glow").innerHTML = "🌕✨";
            document.getElementById("unlockContent").style.display = "block";
        } else {
            feedback.innerHTML = "The constellation fades… try again 🌌";

            userOrder = [];
            selectedContainer.innerHTML = "";

            stars.forEach(s => s.classList.remove("active"));
        }
    }

});