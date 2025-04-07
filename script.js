// Game variables
let words = [];
let score = 0;
let time;
let timerInterval;
let availableIndices = [];
let lastScore = 0;
let lastScorePerPair = 0;

// Audio elements
const correctSound = document.getElementById('correct-sound');
const incorrectSound = document.getElementById('incorrect-sound');

// Initialize scoreboard
function initializeScoreboard() {
  const bestScore = localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : 0;
  const bestScorePerPair = localStorage.getItem('bestScorePerPair') ? parseFloat(localStorage.getItem('bestScorePerPair')) : 0;
  lastScore = 0;
  lastScorePerPair = 0;
  document.getElementById('last-score').textContent = 'Last Score: ' + lastScore;
  document.getElementById('last-score-per-pair').textContent = 'Last Score per Pair: ' + lastScorePerPair.toFixed(2);
  document.getElementById('best-score').textContent = 'Best Score: ' + bestScore;
  document.getElementById('best-score-per-pair').textContent = 'Best Score per Pair: ' + bestScorePerPair.toFixed(2);
}

// Update scoreboard after game ends
function updateScoreboard() {
  lastScore = score;
  lastScorePerPair = words.length > 0 ? score / words.length : 0;
  const bestScore = localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : 0;
  const bestScorePerPair = localStorage.getItem('bestScorePerPair') ? parseFloat(localStorage.getItem('bestScorePerPair')) : 0;
  
  if (score > bestScore) {
    localStorage.setItem('bestScore', score);
  }
  if (lastScorePerPair > bestScorePerPair) {
    localStorage.setItem('bestScorePerPair', lastScorePerPair);
  }
  
  document.getElementById('last-score').textContent = 'Last Score: ' + lastScore;
  document.getElementById('last-score-per-pair').textContent = 'Last Score per Pair: ' + lastScorePerPair.toFixed(2);
  document.getElementById('best-score').textContent = 'Best Score: ' + Math.max(score, bestScore);
  document.getElementById('best-score-per-pair').textContent = 'Best Score per Pair: ' + Math.max(lastScorePerPair, bestScorePerPair).toFixed(2);
}

// Start the game
function startGame() {
  words = []; // Reset the word list

  // Helper function to parse a single line of input
  function parseLine(line) {
    // Try splitting by tabs (TSV)
    let pairs = line.split('\t').map(item => item.trim());
    if (pairs.length === 2 && pairs[0] && pairs[1]) {
      const [english, secondLang] = pairs;
      return { secondLang, english };
    }

    // Try splitting by commas (CSV)
    pairs = line.split(',').map(item => item.trim());
    if (pairs.length === 2 && pairs[0] && pairs[1]) {
      const [english, secondLang] = pairs;
      return { secondLang, english };
    }

    return null; // Invalid pair
  }

  // Parse Spreadsheet Input
  const spreadsheetInput = document.getElementById('word-list-spreadsheet').value.trim();
  if (spreadsheetInput) {
    const lines = spreadsheetInput.split('\n');
    for (let line of lines) {
      const pair = parseLine(line);
      if (pair) {
        words.push(pair);
      } else {
        // Handle multiple comma-separated pairs on one line
        const pairs = line.split(',').map(item => item.trim());
        if (pairs.length >= 2 && pairs.length % 2 === 0) {
          for (let i = 0; i < pairs.length; i += 2) {
            const english = pairs[i];
            const secondLang = pairs[i + 1];
            if (english && secondLang) {
              words.push({ secondLang, english });
            }
          }
        }
      }
    }
  }

  // Validate the word list
  if (words.length === 0) {
    alert('No valid word pairs found. Please ensure your input follows the format English,Second Language (one pair per line, or tab/comma-separated).');
    return;
  }

  // Set game time based on number of word pairs
  time = Math.max(30, 3 * words.length);
  score = 0;
  availableIndices = [...Array(words.length).keys()];
  document.getElementById('score').textContent = 'Score: 0';
  document.getElementById('timer').textContent = 'Time: ' + time;

  // Hide setup and show game area
  document.getElementById('setup').style.display = 'none';
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
    document.getElementById('setup').style.display = 'block';
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

  // Display the Second Language word and provide English options
  document.getElementById('second-lang-word').textContent = word.secondLang;

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
