//переменные для анимации чисел
let numbers = []; //все падающие числа
let animationId = null; //чтобы остановить анимацию
let isRunning = false; //состояние анимации
let onPause = false;
let lastTime = 0; //время последнего кадра (рассчитывать разницу между анимациями)

//переменные для логики уровня
let isLevelComplete = false; //уровень завершен?

//переменные для ...
let isAnimating = false;
let animationProgress = 0;

//переменные для таймера
let timerInterval = null; //ID интервала таймера

//переменные dropZone
const dropZone = document.getElementById("drop-zone");
let droppedNumbers = [];
let draggingNumber = null; //число которое мы перетаскиваем (объект DOM)
let dragOffsetX = 0; //смещение по X
let dragOffsetY = 0; //смещение по Y

//определение настроек
const difficulty = parseInt(sessionStorage.getItem("difficulty")) || 1;
const settings = getDifficulty(difficulty);

let playerSum = settings.playerSum;

//для подсчета очков
let addPoints = 0;
let addPenalties = 0;

function getDifficulty(difparam) {
  //определение настроек из пула
  /*
count - количество чисел одновременно на экране
speed - скорость падения (px за кадр)
size - размер числа в px
color - цвет чисел
characters - используемые символы на уровне
fadeOut - включение затухания чисел у нижнего края
levelTime - время уровня в секундах
playerSum - начальная сумма игрока
targetSum - сумма для уровнения
больше не придумал
  */
  const settings = [
    {
      count: 30,
      speed: 1,
      size: 60,
      color: "#87ceeb",
      characters: "0123456789",
      fadeOut: true,
      levelTime: 80,
      playerSum: 0,
      targetSum: 20,
    },
    {
      count: 40,
      speed: 1,
      size: 45,
      color: "#87ceeb",
      characters: "01234567",
      fadeOut: true,
      levelTime: 60,
      playerSum: 0,
      targetSum: 27,
    },
    {
      count: 40,
      speed: 2,
      size: 45,
      color: "#87ceeb",
      characters: "012345",
      fadeOut: true,
      levelTime: 30,
      playerSum: 0,
      targetSum: 34,
    },
  ];

  return settings[difparam - 1];
}
