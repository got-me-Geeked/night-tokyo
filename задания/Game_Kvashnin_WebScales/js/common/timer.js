function startTimer() {
  timeLeft = settings.levelTime;
  isLevelComplete = false;
  //обновление отображения таймера
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft < 0) {
      out();
    }
  }, 1000);
}

function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resumeTimer() {
  if (!timerInterval && timeLeft > 0) {
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();

      if (timeLeft < 0) {
        out();
      }
    }, 1000);
  }
}
