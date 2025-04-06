// Game variables
let words = [];
let score = 0;
let time;
let timerInterval;
let availableIndices = [];
let lastScore = 0;

// Difficulty settings
const difficulties = {
  easy: 120,
  medium: 60,
  hard: 30
};

// Audio elements
const correctSound = document.getElementById('correct-sound');
const incorrectSound = document.getElementById('incorrect-sound');

// Initialize scoreboard
function initializeScoreboard() {
  const bestScore = localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : 0;
  lastScore = 0;
  document.getElementById('last-score').textContent = 'Last Score: ' + lastScore;
  document.getElementById('best-score').textContent = 'Best Score: ' + bestScore;
}

// Update scoreboard after game ends
function updateScoreboard() {
  lastScore = score;
  const bestScore = localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : 0;
  if (score > bestScore) {
    localStorage.setItem('bestScore', score);
  }
  document.getElementById('last-score').textContent = 'Last Score: ' + lastScore;
  document.getElementById('best-score').textContent = 'Best Score: ' + Math.max(score, bestScore);
}

// Start the game
function startGame() {
  words = []; // Reset the word list

  // Helper function to parse a single line of input
  function parseLine(line) {
    // Try splitting by tabs (TSV)
    let pairs = line.split('\t').map(item => item.trim());
    if (pairs.length === 2 && pairs[0] && pairs[1]) {
      const [english, spanish] = pairs;
      return { spanish, english };
    }

    // Try splitting by commas (CSV)
    pairs = line.split(',').map(item => item.trim());
    if (pairs.length === 2 && pairs[0] && pairs[1]) {
      const [english, spanish] = pairs;
      return { spanish, english };
    }

    return null; // Invalid pair
  }

  // Parse Option 1: Line-by-Line Input
  const lineInput = document.getElementById('word-list-line').value.trim();
  if (lineInput) {
    const lines = lineInput.split('\n');
    for (let line of lines) {
      const pair = parseLine(line);
      if (pair) {
        words.push(pair);
      }
    }
  }

  // Parse Option 2: Spreadsheet Input
  const spreadsheetInput = document.getElementById('word-list-spreadsheet').value.trim();
  if (spreadsheetInput) {
    const lines = spreadsheetInput.split('\n');
    for (let line of lines) {
      const pair = parseLine(line);
      if (pair) {
        words.push(pair);
      } else {
        // If the line has more than 2 items and an even number, treat it as multiple comma-separated pairs
        const pairs = line.split(',').map(item => item.trim());
        if (pairs.length >= 2 && pairs.length % 2 === 0) {
          for (let i = 0; i < pairs.length; i += 2) {
            const english = pairs[i];
            const spanish = pairs[i + 1];
            if (english && spanish) {
              words.push({ spanish, english });
            }
          }
        }
      }
    }
  }

  // Validate the word list
  if (words.length === 0) {
    alert('No valid word pairs found. Please ensure your input follows the format English,Spanish (one pair per line for line-by-line input, or tab/comma-separated for spreadsheet input).');
    return;
  }

  // Get the selected difficulty
  const difficulty = document.getElementById('difficulty').value;
  score = 0;
  time = difficulties[difficulty];
  availableIndices = [...Array(words.length).keys()];
  document.getElementById('score').textContent = 'Score: 0';
  document.getElementById('timer').textContent = 'Time: ' + time;

  // Hide word input and difficulty selection, show game area
  document.getElementById('word-input').style.display = 'none';
  document.getElementById('difficulty-selection').style.display = 'none';
  document.getElementById('game-area').style.display = 'block';

  timerInterval = setInterval(updateTimer, 1000);
  nextQuestion();
}

// Update the timer every second
function updateTimer() {
  time--;
  document.getElementById('timer').textContent = 'Time: ' + time;
  if (time <= 0) {
    clearInterval(timerInterval);
    updateScoreboard();
    alert('Game Over! Your score: ' + score);
    document.getElementById('word-input').style.display = 'block';
    document.getElementById('difficulty-selection').style.display = 'block';
    document.getElementById('game-area').style.display = 'none';
  }
}

// Display the next question
function nextQuestion() {
  if (time <= 0) return;

  if (availableIndices.length === 0) {
    availableIndices = [...Array(words.length).keys()];
  }

  const randomPos = Math.floor(Math.random() * availableIndices.length);
  const index = availableIndices.splice(randomPos, 1)[0];
  const word = words[index];

  // Display the Spanish word and provide English options
  document.getElementById('spanish-word').textContent = word.spanish;

  const options = [word.english];
  while (options.length < 4) {
    const randomOption = words[Math.floor(Math.random() * words.length)].english;
    if (!options.includes(randomOption)) {
      options.push(randomOption);
    }
  }
  shuffle(options);

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';
  options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.onclick = () => checkAnswer(option, word.english);
    optionsDiv.appendChild(button);
  });
}

// Check the selected answer
function checkAnswer(selected, correct) {
  if (selected === correct) {
    score += 10;
    document.getElementById('score').textContent = 'Score: ' + score;
    correctSound.currentTime = 0;
    correctSound.play();
  } else {
    time = Math.max(0, time - 5);
    document.getElementById('timer').textContent = 'Time: ' + time;
    incorrectSound.currentTime = 0;
    incorrectSound.play();
  }
  nextQuestion();
}

// Shuffle the options array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Initialize scoreboard on page load
initializeScoreboard();

// Add event listener for the start button
document.getElementById('start').addEventListener('click', startGame);
