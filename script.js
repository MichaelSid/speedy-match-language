// Spanish-English word list
const words = [
  { spanish: "Encontrar", english: "To find" },
  { spanish: "Llegar a ser", english: "To become" },
  { spanish: "Dejar", english: "To leave" },
  { spanish: "Dejar", english: "To let" },
  { spanish: "Girar", english: "To turn" },
  { spanish: "Mostrar", english: "To show" },
  { spanish: "Tocar", english: "To play" },
  { spanish: "Sostener", english: "To hold" },
  { spanish: "Traer", english: "To bring" },
  { spanish: "Suceder", english: "To happen" },
  { spanish: "Proveer", english: "To provide" },
  { spanish: "Estar de pie", english: "To stand" },
  { spanish: "Reunirse", english: "To meet" },
  { spanish: "Establecer", english: "To set" },
  { spanish: "Dirigir", english: "To lead" },
  { spanish: "Comprender", english: "To understand" },
  { spanish: "Seguir", english: "To follow" },
  { spanish: "Detener", english: "To stop" },
  { spanish: "Añadir", english: "To add" },
  { spanish: "Gastar", english: "To spend" },
  { spanish: "Crecer", english: "To grow" },
  { spanish: "Recordar", english: "To remember" },
  { spanish: "Considerar", english: "To consider" },
  { spanish: "Enviar", english: "To send" },
  { spanish: "Esperar", english: "To expect" },
  { spanish: "Permanecer", english: "To stay" },
  { spanish: "Caer", english: "To fall" },
  { spanish: "Cortar", english: "To cut" },
  { spanish: "Alcanzar", english: "To reach" },
  { spanish: "Permanecer", english: "To remain" },
  { spanish: "Sugerir", english: "To suggest" },
  { spanish: "Levantar", english: "To raise" },
  { spanish: "Informar", english: "To report" },
  { spanish: "Tirar", english: "To pull" },
  { spanish: "temprano", english: "early" },
  { spanish: "capaz", english: "able" },
  { spanish: "reciente", english: "recent" },
  { spanish: "probable", english: "likely" },
  { spanish: "único", english: "single" },
  { spanish: "incorrecto", english: "wrong" }
];

// Game variables
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

// Start the game with selected difficulty
function startGame(difficulty) {
  score = 0;
  time = difficulties[difficulty];
  availableIndices = [...Array(words.length).keys()];
  document.getElementById('score').textContent = 'Score: 0';
  document.getElementById('timer').textContent = 'Time: ' + time;
  document.getElementById('difficulty-selection').style.display = 'none';
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
    document.getElementById('difficulty-selection').style.display = 'block';
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
  } else {
    time = Math.max(0, time - 5); // Subtract 5 seconds for incorrect answer
    document.getElementById('timer').textContent = 'Time: ' + time;
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

// Add event listeners for difficulty selection
document.getElementById('easy').addEventListener('click', () => startGame('easy'));
document.getElementById('medium').addEventListener('click', () => startGame('medium'));
document.getElementById('hard').addEventListener('click', () => startGame('hard'));
