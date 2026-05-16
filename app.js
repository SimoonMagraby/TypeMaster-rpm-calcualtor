// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
  passages: null,
  currentPassage: "",
  difficulty: "easy",
  mode: "timed", // 'timed' or 'passage'
  isTestActive: false,
  startTime: null,
  timerInterval: null,
  timeRemaining: 60,
  timeElapsed: 0,
  userInput: "",
  correctChars: 0,
  incorrectChars: 0,
  totalCharsTyped: 0,
  currentPosition: 0,
  errors: new Set(), // Track error positions
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
  startBtn: document.getElementById("start-btn"),
  restartBtn: document.getElementById("restart-btn"),
  difficultyBtns: document.querySelectorAll("[data-difficulty]"),
  modeBtns: document.querySelectorAll("[data-mode]"),
  passage: document.getElementById("passage"),
  inputField: document.getElementById("input-field"),
  typingContainer: document.getElementById("typing-container"),
  wpmDisplay: document.getElementById("wpm-display"),
  accuracyDisplay: document.getElementById("accuracy-display"),
  timeDisplay: document.getElementById("time-display"),
  modalOverlay: document.getElementById("modal-overlay"),
  modalTitle: document.getElementById("modal-title"),
  modalSubtitle: document.getElementById("modal-subtitle"),
  celebrationEmoji: document.getElementById("celebration-emoji"),
  resultWpm: document.getElementById("result-wpm"),
  resultAccuracy: document.getElementById("result-accuracy"),
  resultCorrect: document.getElementById("result-correct"),
  resultIncorrect: document.getElementById("result-incorrect"),
  personalBestSection: document.getElementById("personal-best-section"),
  personalBestWpm: document.getElementById("personal-best-wpm"),
  closeModalBtn: document.getElementById("close-modal-btn"),
};

// ============================================
// INITIALIZATION
// ============================================
async function init() {
  await loadPassages();
  setupEventListeners();
  updateTimeDisplay();
}

async function loadPassages() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    state.passages = data.passages;
  } catch (error) {
    console.warn(
      "Could not load data.json (likely CORS issue with file:// protocol). Using embedded data instead.",
    );
    // Fallback: Embedded passage data for local file:// usage
    state.passages = {
      easy: [
        "The quick brown fox jumps over the lazy dog near the old barn.",
        "She sells seashells by the seashore on sunny summer days.",
        "A journey of a thousand miles begins with a single step forward.",
        "Time flies like an arrow when you are having fun with friends.",
        "The early bird catches the worm before the sun rises high.",
        "Practice makes perfect when you work hard every single day.",
        "All good things come to those who wait with great patience.",
        "Home is where the heart is and family gathers together warmly.",
      ],
      medium: [
        "The magnificent aurora borealis danced across the northern sky, painting ethereal ribbons of green and purple light that mesmerized all who witnessed nature's spectacular display.",
        "Despite numerous obstacles and setbacks, the determined entrepreneur persevered through challenging circumstances, ultimately transforming her innovative vision into a thriving global enterprise.",
        "Ancient civilizations developed sophisticated astronomical knowledge, constructing elaborate observatories to track celestial movements and predict seasonal changes with remarkable accuracy.",
        "The symphony orchestra's performance captivated the audience with its harmonious blend of strings, woodwinds, brass, and percussion creating an unforgettable musical experience.",
        "Technological advancements continue revolutionizing communication methods, enabling instantaneous global connectivity that fundamentally transforms how societies interact and share information.",
        "Environmental conservation efforts require collaborative international cooperation, sustainable resource management, and widespread public awareness to protect our planet's delicate ecosystems.",
      ],
      hard: [
        "The philosopher's intricate epistemological arguments challenged conventional wisdom, proposing that subjective perception fundamentally shapes our understanding of objective reality-a concept that sparked considerable controversy among contemporary scholars.",
        "Quantum mechanics revolutionized physics by introducing probabilistic interpretations of subatomic behavior, contradicting classical determinism and revealing nature's inherent uncertainty at microscopic scales through phenomena like superposition and entanglement.",
        "The Renaissance period witnessed unprecedented artistic, scientific, and intellectual flourishing; polymaths like Leonardo da Vinci exemplified this era's spirit by seamlessly integrating diverse disciplines-anatomy, engineering, painting-into cohesive masterworks.",
        "Neuroplasticity research demonstrates the brain's remarkable capacity for reorganization throughout life: synaptic connections continuously form, strengthen, or weaken based on experiences, challenging long-held assumptions about cognitive rigidity in adulthood.",
        "Cryptocurrency's decentralized blockchain technology disrupts traditional financial systems by enabling peer-to-peer transactions without intermediaries, though volatility, regulatory uncertainty, and environmental concerns regarding energy consumption remain significant challenges.",
        "The anthropocene epoch-characterized by humanity's profound geological impact-presents existential dilemmas: balancing technological progress with ecological sustainability requires reimagining economic paradigms, consumption patterns, and our fundamental relationship with Earth's biosphere.",
      ],
    };
  }
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
  // Start button
  elements.startBtn.addEventListener("click", startTest);

  // Restart button
  elements.restartBtn.addEventListener("click", restartTest);

  // Difficulty buttons
  elements.difficultyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!state.isTestActive) {
        state.difficulty = btn.dataset.difficulty;
        elements.difficultyBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      }
    });
  });

  // Mode buttons
  elements.modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!state.isTestActive) {
        state.mode = btn.dataset.mode;
        elements.modeBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        updateTimeDisplay();
      }
    });
  });

  // Input field
  elements.inputField.addEventListener("input", handleInput);

  // Click on passage to start typing
  elements.typingContainer.addEventListener("click", () => {
    if (state.isTestActive) {
      elements.inputField.focus();
    }
  });

  // Close modal
  elements.closeModalBtn.addEventListener("click", closeModal);
  elements.modalOverlay.addEventListener("click", (e) => {
    if (e.target === elements.modalOverlay) {
      closeModal();
    }
  });
}

// ============================================
// TEST CONTROL
// ============================================
function startTest() {
  if (!state.passages) return;

  // Reset state
  resetState();

  // Select random passage
  const passages = state.passages[state.difficulty];
  state.currentPassage = passages[Math.floor(Math.random() * passages.length)];

  // Display passage
  displayPassage();

  // Start test
  state.isTestActive = true;
  state.startTime = Date.now();
  elements.passage.classList.remove("disabled");
  elements.typingContainer.classList.add("active");
  elements.inputField.focus();

  // Start timer
  if (state.mode === "timed") {
    state.timeRemaining = 60;
    startTimer();
  } else {
    state.timeElapsed = 0;
    startCountUp();
  }

  // Update UI
  elements.startBtn.textContent = "Test in Progress...";
  elements.startBtn.disabled = true;
}

function restartTest() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
  }
  resetState();
  elements.startBtn.textContent = "Start Test";
  elements.startBtn.disabled = false;
  elements.passage.textContent = 'Click "Start Test" to begin...';
  elements.passage.classList.add("disabled");
  elements.typingContainer.classList.remove("active");
  updateTimeDisplay();
}

function resetState() {
  state.isTestActive = false;
  state.startTime = null;
  state.userInput = "";
  state.correctChars = 0;
  state.incorrectChars = 0;
  state.totalCharsTyped = 0;
  state.currentPosition = 0;
  state.errors.clear();
  elements.inputField.value = "";
  elements.wpmDisplay.textContent = "0";
  elements.accuracyDisplay.textContent = "100%";

  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

// ============================================
// TIMER FUNCTIONS
// ============================================
function startTimer() {
  state.timerInterval = setInterval(() => {
    state.timeRemaining--;
    updateTimeDisplay();

    if (state.timeRemaining <= 0) {
      endTest();
    }
  }, 1000);
}

function startCountUp() {
  state.timerInterval = setInterval(() => {
    state.timeElapsed++;
    updateTimeDisplay();
  }, 1000);
}

function updateTimeDisplay() {
  if (state.mode === "timed") {
    elements.timeDisplay.textContent = `${state.timeRemaining}s`;
  } else {
    const minutes = Math.floor(state.timeElapsed / 60);
    const seconds = state.timeElapsed % 60;
    elements.timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}

// ============================================
// PASSAGE DISPLAY
// ============================================
function displayPassage() {
  elements.passage.innerHTML = "";

  for (let i = 0; i < state.currentPassage.length; i++) {
    const span = document.createElement("span");
    span.textContent = state.currentPassage[i];
    span.classList.add("char");
    span.dataset.index = i;
    elements.passage.appendChild(span);
  }

  // Add cursor to first character
  if (elements.passage.children[0]) {
    elements.passage.children[0].classList.add("cursor");
  }
}

// ============================================
// INPUT HANDLING
// ============================================
function handleInput(e) {
  if (!state.isTestActive) return;

  const input = e.target.value;
  state.userInput = input;
  state.currentPosition = input.length;

  // Update character display
  updateCharacterDisplay();

  // Calculate stats
  calculateStats();

  // Check if test is complete (passage mode)
  if (
    state.mode === "passage" &&
    state.currentPosition >= state.currentPassage.length
  ) {
    endTest();
  }
}

function updateCharacterDisplay() {
  const chars = elements.passage.querySelectorAll(".char");

  chars.forEach((char, index) => {
    // Remove all classes
    char.classList.remove("correct", "incorrect", "cursor");

    if (index < state.currentPosition) {
      // Character has been typed
      if (state.userInput[index] === state.currentPassage[index]) {
        char.classList.add("correct");
      } else {
        char.classList.add("incorrect");
        state.errors.add(index);
      }
    } else if (index === state.currentPosition) {
      // Current cursor position
      char.classList.add("cursor");
    }
  });
}

// ============================================
// STATISTICS CALCULATION
// ============================================
function calculateStats() {
  // Count correct and incorrect characters
  state.correctChars = 0;
  state.incorrectChars = 0;

  for (let i = 0; i < state.currentPosition; i++) {
    if (state.userInput[i] === state.currentPassage[i]) {
      state.correctChars++;
    } else {
      state.incorrectChars++;
    }
  }

  state.totalCharsTyped = state.currentPosition;

  // Calculate WPM (words = characters / 5)
  const timeInMinutes =
    state.mode === "timed"
      ? (60 - state.timeRemaining) / 60
      : state.timeElapsed / 60;

  const wpm =
    timeInMinutes > 0 ? Math.round(state.correctChars / 5 / timeInMinutes) : 0;

  // Calculate accuracy
  const accuracy =
    state.totalCharsTyped > 0
      ? Math.round((state.correctChars / state.totalCharsTyped) * 100)
      : 100;

  // Update display
  elements.wpmDisplay.textContent = wpm;
  elements.accuracyDisplay.textContent = `${accuracy}%`;
}

// ============================================
// TEST COMPLETION
// ============================================
function endTest() {
  state.isTestActive = false;
  clearInterval(state.timerInterval);
  elements.inputField.blur();
  elements.typingContainer.classList.remove("active");
  elements.startBtn.textContent = "Start Test";
  elements.startBtn.disabled = false;

  // Calculate final stats
  const timeInMinutes =
    state.mode === "timed"
      ? (60 - state.timeRemaining) / 60
      : state.timeElapsed / 60;

  const finalWpm =
    timeInMinutes > 0 ? Math.round(state.correctChars / 5 / timeInMinutes) : 0;

  const finalAccuracy =
    state.totalCharsTyped > 0
      ? Math.round((state.correctChars / state.totalCharsTyped) * 100)
      : 100;

  // Show results
  showResults(finalWpm, finalAccuracy);
}

// ============================================
// RESULTS MODAL
// ============================================
function showResults(wpm, accuracy) {
  // Update result values
  elements.resultWpm.textContent = wpm;
  elements.resultAccuracy.textContent = `${accuracy}%`;
  elements.resultCorrect.textContent = state.correctChars;
  elements.resultIncorrect.textContent = state.incorrectChars;

  // Check personal best
  const personalBest = getPersonalBest();

  if (personalBest === null) {
    // First test - baseline established
    elements.modalTitle.textContent = "Baseline Established!";
    elements.modalSubtitle.textContent = "Your first test is complete!";
    elements.celebrationEmoji.textContent = "🎯";
    elements.personalBestSection.classList.add("hidden");
    savePersonalBest(wpm);
  } else if (wpm > personalBest) {
    // New high score!
    elements.modalTitle.textContent = "High Score Smashed!";
    elements.modalSubtitle.textContent = "You beat your personal best!";
    elements.celebrationEmoji.textContent = "🏆";
    elements.personalBestSection.classList.remove("hidden");
    elements.personalBestWpm.textContent = wpm;
    savePersonalBest(wpm);
    createConfetti();
  } else {
    // Regular completion
    elements.modalTitle.textContent = "Test Complete!";
    elements.modalSubtitle.textContent = `Your best: ${personalBest} WPM`;
    elements.celebrationEmoji.textContent = "✅";
    elements.personalBestSection.classList.remove("hidden");
    elements.personalBestWpm.textContent = personalBest;
  }

  // Show modal
  elements.modalOverlay.classList.add("show");
}

function closeModal() {
  elements.modalOverlay.classList.remove("show");
}

// ============================================
// LOCAL STORAGE
// ============================================
function getPersonalBest() {
  const best = localStorage.getItem("typingTestPersonalBest");
  return best ? parseInt(best) : null;
}

function savePersonalBest(wpm) {
  localStorage.setItem("typingTestPersonalBest", wpm.toString());
}

// ============================================
// CONFETTI ANIMATION
// ============================================
function createConfetti() {
  const colors = [
    "hsl(260, 85%, 65%)",
    "hsl(200, 90%, 60%)",
    "hsl(25, 95%, 60%)",
    "hsl(340, 85%, 65%)",
    "hsl(145, 70%, 55%)",
    "hsl(45, 95%, 60%)",
  ];

  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + "s";
      confetti.style.animationDuration = Math.random() * 2 + 2 + "s";
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 3000);
    }, i * 30);
  }
}

// ============================================
// START APPLICATION
// ============================================
init();
