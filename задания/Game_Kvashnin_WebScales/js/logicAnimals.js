// Автозапуск при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  //запуск анимации вспышки
  startRandomFlashes();
  setupEvents();
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
}

function startLevel() {
  // Если анимация еще НИКОГДА не запускалась
  if (!isLevelComplete && !isLevelRunning && !isOnPause) {
    isLevelRunning = true;
    startScaleAnimation(false);
    //запуск таймера
    startTimer();
    addStartDrag();
    document.getElementById("start-btn").textContent = "⏸️ Пауза";
    document.getElementById("stop-btn").textContent = "Завершить";
  }
  // Если уже работает - ставим на паузу
  else if (!isLevelComplete && isLevelRunning && !isOnPause) {
    isLevelRunning = false;
    isOnPause = true;
    stop();
  }
  // Если на паузе - продолжаем
  else if (!isLevelComplete && !isLevelRunning && isOnPause) {
    isLevelRunning = true;
    isOnPause = false;
    addStartDrag();
    //возобновление таймера
    resumeTimer();
    document.getElementById("start-btn").textContent = "⏸️ Пауза";
  }
}

function stop() {
  removeStartDrag();
  pauseTimer();
  updateTimerDisplay();
  document.getElementById("start-btn").textContent = "▶️ Продолжить";
}

function out() {
  isLevelRunning = false;

  removeStartDrag();
  pauseTimer();

  document.getElementById("start-btn").textContent = "▶️ Старт";
  const timeConf = document.getElementById("timer-display");
  timeConf.textContent = "00:00";
  droppedImages = [];
  levelComplete();
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

  const currentLevelIndex = 3;
  const previousScore = currentElem.point_per_lvl[currentLevelIndex];
  const isLevelCompleted = currentElem.comp_lvls[currentLevelIndex];

  if (isLevelCompleted == 0 || previousScore < addPoints) {
    currentElem.total = currentElem.total - previousScore + addPoints;
    currentElem.point_per_lvl[currentLevelIndex] = addPoints;
    currentElem.comp_lvls[currentLevelIndex] = 1;

    localStorage.setItem("scales_round_list", JSON.stringify(currentList));
  }
}
