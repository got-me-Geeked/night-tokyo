// Автозапуск при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  //запуск анимации вспышки
  startRandomFlashes();
  //определение уровня сложности
  const difficulty = sessionStorage.getItem("difficulty") || 1;
  //запуск игры c уровнем сложности
  Game(getDifficulty(difficulty));
});

function setupEvents() {
  document.getElementById("start-btn").addEventListener("click", (event) => {
    event.preventDefault();
    startLevel();
  });

  document.getElementById("stop-btn").addEventListener("click", (event) => {
    event.preventDefault();
    out();
  });

  document.getElementById("menu-btn").addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = "levels.html";
  });

  // Изменение размера окна = изменение позиций падающих чисел
  window.addEventListener("resize", () => {
    updateNumbersPositions();
  });
}

function startLevel() {
  // Если анимация еще НИКОГДА не запускалась
  if (!isRunning && animationId === null && !isLevelComplete) {
    isRunning = true;
    //Обновление чисел
    updateNumbersCount();
    animate();
    startScaleAnimation(false);
    //запуск таймера
    startTimer();

    document.getElementById("start-btn").textContent = "⏸️ Пауза";
    document.getElementById("stop-btn").textContent = "Завершить";
  }
  // Если уже работает - ставим на паузу
  else if (isRunning && !isLevelComplete) {
    stop();
  }
  // Если на паузе - продолжаем
  else if (!isRunning && animationId !== null && !isLevelComplete) {
    isRunning = true;
    document.querySelectorAll(".number").forEach((element) => {
      element.style.cursor = "grab";
    });
    addDrag();
    updateNumbersCount();
    animate();

    //возобновление таймера
    resumeTimer();

    document.getElementById("start-btn").textContent = "⏸️ Пауза";
  }
}

function stop() {
  isRunning = false;
  document.querySelectorAll(".number").forEach((element) => {
    element.style.cursor = "default";
  });
  removeDrag();
  pauseTimer();
  updateTimerDisplay();
  document.getElementById("start-btn").textContent = "▶️ Продолжить";
}

function out() {
  isRunning = false;
  document.querySelectorAll(".number").forEach((element) => {
    element.style.cursor = "default";
  });
  removeDrag();
  pauseTimer();
  //updateTimerDisplay();
  document.getElementById("start-btn").textContent = "▶️ Продолжить";
  const timeConf = document.getElementById("timer-display");
  timeConf.textContent = "00:00";
  clear();
  levelComplete();
}

function clear() {
  // Удаляем все числа
  numbers.forEach((number) => {
    if (number && number.parentNode) {
      number.parentNode.removeChild(number);
    }
  });
  numbers = [];
  isRunning = false;
  document.getElementById("start-btn").textContent = "▶️ Старт";
}

function Game(settings) {
  //на входе объект
  //показ настроек
  showSettings(settings);

  //установка событий
  setupEvents();
}

function levelComplete() {
  if (isLevelComplete) return;

  isLevelComplete = true;
  // Показываем результат
  showResult();
  document.getElementById("start-btn").style.display = "none";
  document.getElementById("stop-btn").style.display = "none";

  const sessionUser = sessionStorage.getItem("scales_session_username");
  saveResult(sessionUser);
  sessionStorage.removeItem("difficulty");
  //window.location.href = "levels.html";
}

function saveResult(user) {
  if (user == "Гость") {
    return;
  }
  const sessionUser = sessionStorage.getItem("scales_session_username");
  const currentList = JSON.parse(
    localStorage.getItem("scales_round_list") || "[]"
  );
  const currentElem = currentList.find((elem) => elem.user == sessionUser);

  const currentLevelIndex = parseInt(sessionStorage.getItem("difficulty")) - 1;
  const previousScore = currentElem.point_per_lvl[currentLevelIndex];
  const isLevelCompleted = currentElem.comp_lvls[currentLevelIndex];

  if (isLevelCompleted == 0 || previousScore < addPoints + addPenalties) {
    currentElem.total =
      currentElem.total - previousScore + (addPoints + addPenalties);
    currentElem.point_per_lvl[currentLevelIndex] = addPoints + addPenalties;
    currentElem.comp_lvls[currentLevelIndex] = 1;

    localStorage.setItem("scales_round_list", JSON.stringify(currentList));
  }
}
