// Your Spanish-English word list
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

let score = 0;
let time = 60;
let timerInterval;

function startGame() {
  score = 0;
  time = 60;
  document.getElementById('score').textContent = 'Score: 0';
  document.getElementById('timer').textContent = 'Time: 60';
  document.getElementById('start').style.display = 'none';
  timerInterval = setInterval(updateTimer, 1000);
  nextQuestion();
}

function updateTimer() {
  time--;
  document.getElementById('timer').textContent = 'Time: ' + time;
  if (time <= 0) {
    clearInterval(timerInterval);
    alert('Game Over! Your score: ' + score);
    document.getElementById('start').style.display = 'block';
  }
}

function nextQuestion() {
  if (time <= 0) return;
  const randomIndex = Math.floor(Math.random() * words.length);
  const word = words[randomIndex];
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

function checkAnswer(selected, correct) {
  if (selected === correct) {
    score += 10;
    document.getElementById('score').textContent = 'Score: ' + score;
  } else {
    time -= 5;
  }
  nextQuestion();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

document.getElementById('start').addEventListener('click', startGame);
