//выставка настроек на старте уровня
function showSettings(unit) {
  const countConf = document.getElementById("count-value");
  const speedConf = document.getElementById("speed-value");
  const sizeConf = document.getElementById("size-value");
  const charConf = document.getElementById("char-value");
  const timeConf = document.getElementById("timer-display");
  const target = document.querySelector(".level-cup");
  const player = document.querySelector(".player-cup");
  const upperRC = document.getElementById("upper-rightcup");

  countConf.textContent = unit.count;
  speedConf.textContent = unit.speed;
  sizeConf.textContent = unit.size;
  charConf.textContent = unit.characters;
  target.textContent = unit.targetSum;
  player.textContent = unit.playerSum;
  upperRC.textContent = unit.targetSum;

  const minutes = Math.floor(unit.levelTime / 60);
  const seconds = unit.levelTime % 60;
  timeConf.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

//обновление отображения суммы игрока (после перетаскивания или удаления числа из зоны)
function showPlayerSum(actualSum) {
  const playerCup = document.querySelector(".player-cup");
  playerCup.textContent = actualSum;

  if (actualSum == settings.targetSum) {
    playerCup.style.color = "#5fd463";
    playerCup.style.textShadow = "0 0 20px #00ff00";
  } else if (
    actualSum >= settings.targetSum * 0.8 &&
    actualSum <= settings.targetSum * 1.2
  ) {
    playerCup.style.color = "#ffef44ff";
    playerCup.style.textShadow = "0 0 20px #fff200ff";
  } else {
    playerCup.style.color = "#fffacd";
    playerCup.style.textShadow = "0 0 20px #3300ff";
  }
}

//обновление отображения времени
function updateTimerDisplay() {
  const timerElement = document.getElementById("timer-display");
  if (timerElement) {
    // Форматируем время MM:SS
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    // Меняем цвет при малом времени
    if (timeLeft <= 10) {
      timerElement.style.color = "#ff4444";
      timerElement.style.animation = "pulse 1s infinite";
    } else {
      timerElement.style.color = "#87ceeb";
      timerElement.style.animation = "none";
    }
  }
}

function updatePoints() {
  const points = document.getElementById("point-value");
  const penalty = document.getElementById("penalty-value");
  points.textContent = addPoints;
  penalty.textContent = Math.abs(addPenalties);
}

function showResult() {
  const result = document.querySelector(".result");
  result.style.opacity = "1";
  const paste = document.querySelector(".result span");
  paste.textContent = addPoints + addPenalties;
}

function showPenalties() {
  const notification = document.getElementById("show-penalty");
  const change = document.querySelector("#show-penalty span");
  change.textContent = "-15"; //константное значение штрафа
  notification.style.opacity = 1;
  setTimeout(() => {
    notification.style.opacity = 0;
  }, 2000);
}
