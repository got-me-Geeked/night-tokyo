//выставка настроек на старте уровня
function showSettings() {
  const countConf = document.getElementById("count-value");
  const sizeConf = document.getElementById("size-value");
  const timeConf = document.getElementById("timer-display");
  const target = document.querySelector(".level-cup");
  const player = document.querySelector(".player-cup");
  const upperRC = document.getElementById("upper-rightcup");

  countConf.textContent = settings.count;
  sizeConf.textContent = settings.size;
  target.textContent = settings.targetSum;
  player.textContent = settings.playerSum;
  upperRC.textContent = settings.targetSum;

  const minutes = Math.floor(settings.levelTime / 60);
  const seconds = settings.levelTime % 60;
  timeConf.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function updatePoints() {
  const points = document.getElementById("point-value");
  points.textContent = addPoints;
}

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

function showResult() {
  const result = document.querySelector(".result");
  result.style.opacity = "1";
  const paste = document.querySelector(".result span");
  paste.textContent = addPoints;
}
