//переменные для логики уровня
let isLevelComplete = false; //уровень завершен?
let isLevelRunning = false;
let isOnPause = false;
//переменные для таймера
let timerInterval = null; //ID интервала таймера

//переменные dropZone
const dropZone = document.getElementById("drop-zone");
let droppedImages = [];
let draggingImage = null; //image которое мы перетаскиваем (объект DOM)
let dragOffsetX = 0; //смещение по X
let dragOffsetY = 0; //смещение по Y

let isAnimating = false;
let animationProgress = 0;

//переменная для увеличения картинки при нажатии клавиши
//let isKeyPressed = false;
const clicksLimit = 3;
let currentImage = null;

//используемые изображения
const animals = [
  { name: "tiger.jpg", mass: 18 },
  { name: "elephant.jpg", mass: 300 },
  { name: "zebra.jpg", mass: 35 },
  { name: "crocodile.jpg", mass: 30 },
  { name: "eagle.jpg", mass: 3 },
];

const settings = {
  count: animals.length,
  size: 100,
  levelTime: 80,
  playerSum: 0,
  targetSum: 708, //слонx2 крокодилx3 тигрx1 или слонx2 зебраx3 орелx1
};

//для подсчета очков
let addPoints = 0;
let playerSum = settings.playerSum;

init();

function createImage(name, value) {
  // Создаем элемент img
  const img = document.createElement("img");

  // Устанавливаем источник и атрибуты размеров
  img.src = `./img/${name}`;
  img.width = settings.size;
  img.height = settings.size;
  img.top = "-100px";
  img.style.objectFit = "cover"; // важно для сохранения пропорций

  img.animalData = {
    mass: value,
    total_mass: value,
    isDragged: false,
    clicks: 0,
    size: settings.size,
  };
  //img.addEventListener("mousedown", startDrag);

  // Добавляем на страницу
  const div = document.getElementById("bottom-animals");
  div.appendChild(img);
}

function initAllImages() {
  animals.forEach((element) => createImage(element.name, element.mass));
}

function init() {
  initAllImages();
  showSettings();
}
