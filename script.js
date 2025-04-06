// Game variables
let words = [];
let score = 0;
let time;
let timerInterval;
let availableIndices = [];

// Difficulty settings
const difficulties = {
  easy: 120,
  medium: 60,
  hard: 30
};

// Audio elements
const correctSound = document.getElementById('correct-sound');
const incorrectSound = document.getElementById('incorrect-sound');

// Start the game
function startGame() {
  words = []; // Reset the word list

  // Parse Option 1: Line-by-Line Input
  const lineInput = document.getElementById('word-list-line').value.trim();
  if (lineInput) {
    const lines = lineInput.split('\n');
    for (let line of lines) {
      const [spanish, english] = line.split(',').map(item => item.trim());
      if (spanish && english) {
        words.push({ spanish, english });
      }
    }
  }

  // Parse Option 2: Spreadsheet Input
  const spreadsheetInput = document.getElementById('word-list-spreadsheet').value.trim();
  if (spreadsheetInput) {
    // Split into lines
    const lines = spreadsheetInput.split('\n');
    for (let line of lines) {
      // Try splitting by tabs (TSV) first
      let pairs = line.split('\t').map(item => item.trim());
      if (pairs.length === 2 && pairs[0] && pairs[1]) {
        // Tab-separated: one pair per line
        const [spanish, english] = pairs;
        words.push({ spanish, english });
      } else {
        // Try splitting by commas (CSV)
        pairs = line.split(',').map(item => item.trim());
        if (pairs.length >= 2 && pairs.length % 2 === 0) {
          // Comma-separated: multiple pairs in one line
          for (let i = 0; i < pairs.length; i += 2) {
            const spanish = pairs[i];
            const english = pairs[i + 1];
            if (spanish && english) {
              words.push({ spanish, english });
            }
          }
        }
      }
    }
  }

  // Validate the word list
  if FIXED: words.length === 0) {
    alert('No valid word pairs found. Please enter pairs using one of the methods provided.');
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

// Add event listener for the start button
document.getElementById('start').addEventListener('click', startGame);
