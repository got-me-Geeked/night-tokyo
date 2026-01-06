class NumberRain {
  constructor() {
    this.numbers = []; //все падающие числа
    this.animationId = null; //чтобы остановить анимацию
    this.isRunning = false; //состояние анимации
    this.onPause = false;
    this.lastTime = 0; //время последнего кадра (рассчитывать разницу между анимациями)

    this.draggingNumber = null; //числа которое мы перетаскиваем (объект DOM)
    this.dragOffsetX = 0; //смещение по X
    this.dragOffsetY = 0; //смещение по Y

    this.levelTime = 20; //время уровня (секукнды)
    this.timeLeft = this.levelTime; //оставшееся время
    this.timerInterval = null; //ID интервала таймера
    this.isLevelComplete = false; //уровень завершен?

    this.dropZone = null; //DOM-объект для сброса
    this.droppedNumbers = [];
    this.playerSum = 0;
    this.targetSum = 20;
    this.maxPoints = 100;
    this.numberOfLevel = 1;

    this.isAnimating = false;
    this.animationProgress = 0;

    // Настройки
    this.settings = {
      count: 30, //количество чисел одновременно на экране
      speed: 1, //скорость падения (px за кадр)
      size: 60,
      color: "#87ceeb",
      characters: "0123456789",
      fadeOut: true, //включение затухания чисел у нижнего края
    };

    this.init();
  }

  init() {
    this.setupControls();
    this.updateConfig();
    this.initDropZone();
    /* this.start();
        this.animate();*/
  }

  updateConfig() {
    const countConf = document.getElementById("count-value");
    const speedConf = document.getElementById("speed-value");
    const sizeConf = document.getElementById("size-value");
    const timeConf = document.getElementById("timer-display");
    const targetSum = document.querySelector(".level-cup");
    const upperRightCup = document.getElementById("upper-rightcup");
    countConf.textContent = this.settings.count;
    speedConf.textContent = this.settings.speed;
    sizeConf.textContent = this.settings.size;
    targetSum.textContent = this.targetSum;
    upperRightCup.textContent = this.targetSum;

    const minutes = Math.floor(this.levelTime / 60);
    const seconds = this.levelTime % 60;
    timeConf.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  setupControls() {
    //можно вынести
    // Кнопки
    document.getElementById("start-btn").addEventListener("click", (event) => {
      event.preventDefault(); // На всякий случай, если кнопка в форме
      this.start();
    });

    document.getElementById("stop-btn").addEventListener("click", (event) => {
      event.preventDefault();
      this.out();
    });

    // Изменение размера окна
    window.addEventListener("resize", () => {
      this.updateNumbersPositions();
    });
  }

  createNumber() {
    const number = document.createElement("div");
    number.className = "number";

    // Случайное число или символ
    const randomChar =
      this.settings.characters[
        Math.floor(Math.random() * this.settings.characters.length)
      ];
    number.textContent = randomChar;

    // Случайная позиция вверху экрана
    number.style.left = `${Math.random() * window.innerWidth}px`;
    number.style.top = `${-this.settings.size}px`;
    number.style.fontSize = `${this.settings.size}px`;
    number.style.color = this.settings.color;
    number.style.opacity = Math.random() * 0.5 + 0.5; // 0.5-1.0

    // Случайная скорость
    const speed = this.settings.speed * (Math.random() * 0.5 + 0.75); // 75%-125% от базовой

    // Сохраняем данные в объекте
    number.numberData = {
      speed: speed,
      originalSize: this.settings.size,
      isFading: false,
    };

    document.body.appendChild(number);

    //обработчик перетаскивания
    this.addDragHandlers(number);
    return number;
  }

  //добавление событий для перетаскивания
  addDragHandlers(number) {
    number.addEventListener("mousedown", this.startDrag);
  }

  //начало перетаскивания
  startDrag = (event) => {
    event.preventDefault();
    const number = event.currentTarget;
    this.draggingNumber = number;

    // Подсветка взятого числа
    /*number.style.boxShadow = "0 0 20px #ffff00, 0 0 30px #ff0";*/
    number.style.textShadow = "0 0 20px #ffff00";
    number.style.zIndex = "1000";
    number.style.cursor = "grabbing";

    // Рассчитываем смещение курсора относительно угла числа
    const rect = number.getBoundingClientRect();

    this.dragOffsetX = event.clientX - rect.left;
    this.dragOffsetY = event.clientY - rect.top;

    // Добавляем глобальные обработчики
    document.addEventListener("mousemove", this.handleDrag);
    document.addEventListener("mouseup", this.stopDrag);

    // Временно останавливаем автоматическое движение числа
    if (number.numberData) {
      number.numberData.originalSpeed = number.numberData.speed;
      number.numberData.speed = 0; // Останавливаем падение
    }
  };

  //обработка перетаскивания (каждый пиксель движения мыши)
  handleDrag = (event) => {
    //а мы что-то перетаскиваем?
    if (!this.draggingNumber) return;

    event.preventDefault();

    // Рассчитываем новую позицию с учетом смещения
    let newLeft = event.clientX - this.dragOffsetX;
    let newTop = event.clientY - this.dragOffsetY;

    // Ограничиваем границами окна
    const numberWidth = this.draggingNumber.offsetWidth;
    const numberHeight = this.draggingNumber.offsetHeight;

    // Границы окна
    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - numberWidth));
    newTop = Math.max(0, Math.min(newTop, window.innerHeight - numberHeight));

    // Применяем новую позицию
    this.draggingNumber.style.left = `${newLeft}px`;
    this.draggingNumber.style.top = `${newTop}px`;

    // Обновляем данные в numberData
    if (this.draggingNumber.numberData) {
      this.draggingNumber.numberData.isDragged = true;
    }
  };

  // конец перетаскивания
  stopDrag = (event) => {
    if (!this.draggingNumber) return;
    event.preventDefault();

    this.addToDropZone(this.draggingNumber, event);

    // Убираем подсветку
    /*this.draggingNumber.style.boxShadow = "";*/
    this.draggingNumber.style.textShadow = "0 0 5px #576abd";
    this.draggingNumber.style.zIndex = "1";
    this.draggingNumber.style.cursor = "grab";

    if (
      this.draggingNumber.numberData &&
      this.draggingNumber.numberData.originalSpeed !== undefined
    ) {
      this.draggingNumber.numberData.speed =
        this.draggingNumber.numberData.originalSpeed;
      this.draggingNumber.numberData.isDragged = false;
    }
    // Сбрасываем флаг перетаскивания (делаем всегда)
    if (this.draggingNumber.numberData) {
      this.draggingNumber.numberData.isDragged = false;
    }

    // Убираем обработчики
    document.removeEventListener("mousemove", this.handleDrag);
    document.removeEventListener("mouseup", this.stopDrag);

    this.draggingNumber = null;
  };

  //обновление чисел на экране
  updateNumbersCount() {
    const currentCount = this.numbers.length;

    // Добавляем новые числа
    if (this.settings.count > currentCount) {
      for (let i = 0; i < this.settings.count - currentCount; i++) {
        this.numbers.push(this.createNumber());
      }
    }
    // Удаляем лишние числа
    else if (this.settings.count < currentCount) {
      const toRemove = currentCount - this.settings.count;
      for (let i = 0; i < toRemove; i++) {
        const number = this.numbers.pop();
        if (number && number.parentNode) {
          number.parentNode.removeChild(number);
        }
      }
    }
  }

  //если число вышло за границы - пихаем его наверх (решение изменения расширения окна)
  updateNumbersPositions() {
    this.numbers.forEach((number) => {
      if (number && number.parentNode) {
        // Если число вышло за пределы экрана, переставляем его вверху
        const rect = number.getBoundingClientRect();
        if (
          rect.top > window.innerHeight ||
          rect.left < 0 ||
          rect.left > window.innerWidth
        ) {
          number.style.left = `${Math.random() * window.innerWidth}px`;
          number.style.top = `${-this.settings.size}px`;
          number.style.opacity = Math.random() * 0.5 + 0.5;
          number.numberData.isFading = false;
        }
      }
    });
  }

  // currentTime = время с момента загрузки страницы (в миллисекундах)
  animate(currentTime = 0) {
    // Если НЕ запущено - НЕ обновляем и НЕ запрашиваем следующий кадр
    if (!this.isRunning || this.isLevelComplete) {
      return;
    }

    // Обновляем позиции чисел
    this.updateNumbers();

    // Следующий кадр
    this.animationId = requestAnimationFrame((time) => this.animate(time));
  }

  //движение на один шаг по кадрам
  updateNumbers() {
    this.numbers.forEach((number, index) => {
      if (!number || !number.parentNode || this.isLevelComplete) return;

      // Если число перетаскивается - пропускаем
      if (number.numberData && number.numberData.isDragged) {
        return;
      }

      const data = number.numberData;
      let top = parseFloat(number.style.top);

      // Двигаем число вниз
      top += data.speed;
      number.style.top = `${top}px`;

      // Эффект мерцания
      if (Math.random() < 0.01) {
        // 1% шанс на мерцание
        number.style.opacity = Math.random() * 0.3 + 0.7;
      }

      // Эффект изменения размера при падении
      if (this.settings.fadeOut) {
        const progress = top / window.innerHeight;
        const scale = 1 - progress * 0.3; // Уменьшаем на 30% к низу
        number.style.transform = `scale(${scale})`;

        // Затухание у нижней границы
        if (top > window.innerHeight * 0.8) {
          const fade =
            1 - (top - window.innerHeight * 0.8) / (window.innerHeight * 0.2);
          number.style.opacity = Math.max(0, fade);
          data.isFading = true;
        }
      }

      // Если число полностью скрылось или ушло за экран
      if (
        top > window.innerHeight + this.settings.size ||
        (data.isFading && parseFloat(number.style.opacity) <= 0)
      ) {
        // Возвращаем число наверх
        number.style.left = `${Math.random() * window.innerWidth}px`;
        number.style.top = `${-this.settings.size}px`;
        number.style.opacity = Math.random() * 0.5 + 0.5;
        number.style.transform = "scale(1)";

        // Меняем число
        const randomChar =
          this.settings.characters[
            Math.floor(Math.random() * this.settings.characters.length)
          ];
        number.textContent = randomChar;

        data.isFading = false;
      }

      // Иногда меняем число на лету (эффект "Матрицы")
      if (Math.random() < 0.005) {
        // 0,5% шанс смены символа
        const randomChar =
          this.settings.characters[
            Math.floor(Math.random() * this.settings.characters.length)
          ];
        number.textContent = randomChar;
      }
    });
  }

  start() {
    // Если анимация еще НИКОГДА не запускалась
    if (!this.isRunning && this.animationId === null && !this.isLevelComplete) {
      this.isRunning = true;
      //Обновление чисел
      this.updateNumbersCount();
      this.animate();
      this.startScaleAnimation(false);
      //запуск таймера
      this.startTimer();

      document.getElementById("start-btn").textContent = "⏸️ Пауза";
      document.getElementById("stop-btn").disabled = false;
    }
    // Если уже работает - ставим на паузу
    else if (this.isRunning && !this.isLevelComplete) {
      this.stop();
    }
    // Если на паузе - продолжаем
    else if (
      !this.isRunning &&
      this.animationId !== null &&
      !this.isLevelComplete
    ) {
      this.isRunning = true;
      this.updateNumbersCount();
      this.animate();

      //возобновление таймера
      this.resumeTimer();

      document.getElementById("start-btn").textContent = "⏸️ Пауза";
    }
  }

  stop() {
    this.isRunning = false;
    this.pauseTimer();
    this.updateTimerDisplay();
    document.getElementById("start-btn").textContent = "▶️ Продолжить";
  }

  out() {
    this.isRunning = false;
    this.pauseTimer();
    document.getElementById("start-btn").textContent = "▶️ Продолжить";
    this.clear();
    window.location.href = "levels.html";
  }

  clear() {
    // Сбрасываем перетаскивание если оно активно
    if (this.draggingNumber) {
      this.stopDrag(new Event("manual"));
    }

    // ОСТАНОВКА ТАЙМЕРА
    this.pauseTimer();
    this.timeLeft = this.levelTime;
    this.isLevelComplete = false;

    this.updateTimerDisplay();

    // Удаляем все числа
    this.numbers.forEach((number) => {
      if (number && number.parentNode) {
        number.parentNode.removeChild(number);
      }
    });
    this.numbers = [];
    this.isRunning = false;
    document.getElementById("start-btn").textContent = "▶️ Старт";
  }

  startTimer() {
    this.timeLeft = this.levelTime; //?
    this.isLevelComplete = false;
    //обновление отображения таймера
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();

      if (this.timeLeft < 0) {
        this.levelComplete();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const timerElement = document.getElementById("timer-display");
    if (timerElement) {
      // Форматируем время MM:SS
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      timerElement.textContent = `${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      // Меняем цвет при малом времени
      if (this.timeLeft <= 10) {
        timerElement.style.color = "#ff4444";
        timerElement.style.animation = "pulse 1s infinite";
      } else {
        timerElement.style.color = "#87ceeb";
        timerElement.style.animation = "none";
      }
    }
  }

  pauseTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resumeTimer() {
    if (!this.timerInterval && this.timeLeft > 0) {
      this.timerInterval = setInterval(() => {
        this.timeLeft--;
        this.updateTimerDisplay();

        if (this.timeLeft <= 0) {
          this.levelComplete();
        }
      }, 1000);
    }
  }

  levelComplete() {
    if (this.isLevelComplete) return;

    this.isLevelComplete = true;
    this.timeLeft = this.levelTime;
    this.isLevelComplete = false;
    this.stop();

    // Показываем результат
    alert(`Время вышло! Уровень завершен!\n`);
    const button = document.getElementById("start-btn");
    button.style.display = "none";
    // Можно сохранить результат или перейти дальше
    this.saveResult();
  }

  saveResult() {
    const points = document.getElementById("point-value");
    let sum = parseInt(points.textContent);

    const sessionUser = sessionStorage.getItem("session_user");
    const localUser = JSON.parse(localStorage.getItem(sessionUser));
    const currentLevelIndex = this.numberOfLevel - 1;
    const previousScore = localUser.point_each_level[currentLevelIndex] || 0;
    const isLevelCompleted = localUser.completed_levels[currentLevelIndex] || 0;

    if (isLevelCompleted == 0 || previousScore < sum) {
      localUser.total_score = localUser.total_score - previousScore + sum;
      localUser.point_each_level[currentLevelIndex] = sum;
      localUser.completed_levels[currentLevelIndex] = 1;

      localStorage.setItem(sessionUser, JSON.stringify(localUser));
    }
  }

  initDropZone() {
    this.dropZone = document.getElementById("drop-zone");
    this.updatePlayerCup();
  }

  // Добавление числа в область
  addToDropZone(number, event) {
    //alert("tcnm");
    const numberValue = parseInt(number.textContent);
    if (isNaN(numberValue)) return;

    const droppedNumber = number;
    droppedNumber.classList.add("dropped-number");

    // Используем координаты из события, а не из getBoundingClientRect()
    const clientX = event.clientX;
    const clientY = event.clientY;

    const dropZoneRect = this.dropZone.getBoundingClientRect();

    // Проверяем, что клик был внутри зоны
    const isInDropZone =
      clientX >= dropZoneRect.left &&
      clientX <= dropZoneRect.right &&
      clientY >= dropZoneRect.top &&
      clientY <= dropZoneRect.bottom;

    if (!isInDropZone) {
      this.returnToRain(number);
      return;
    }

    droppedNumber.style.left = `${clientX - dropZoneRect.left}px`;
    droppedNumber.style.top = `${clientY - dropZoneRect.top}px`;

    this.dropZone.appendChild(droppedNumber);

    // Обновляем данные числа
    if (number.numberData) {
      number.numberData.isInDropZone = true;
    }

    // Добавляем в массив
    this.droppedNumbers.push({
      element: number,
      value: numberValue,
    });

    // Удаляем из массива падающих чисел
    const index = this.numbers.indexOf(number);
    if (index > -1) {
      this.numbers.splice(index, 1);
    }

    // Добавляем обработчик для удаления
    number.removeEventListener("mousedown", this.startDrag);
    number.addEventListener("dblclick", this.removeFromDropZone);

    // Обновляем сумму
    this.playerSum += numberValue;
    this.updatePlayerCup();
    this.updatePoints(true, number);

    // Проверяем условие победы
    if (this.playerSum == this.targetSum && !this.isAnimating) {
      this.startScaleAnimation(null); // Левая чаша уравнивается
    } else if (this.playerSum > this.targetSum && !this.isAnimating) {
      //левая чаша ниже чем правая
      this.startScaleAnimation(true);
    } else if (this.playerSum < this.targetSum && !this.isAnimating) {
      //левая чаша выше чем правая
      this.startScaleAnimation(false);
    }
  }

  // Удаление числа из области
  removeFromDropZone = (e) => {
    e.stopPropagation();
    const number = e.currentTarget;
    const value = parseInt(number.textContent);
    // Удаляем обработчик
    number.removeEventListener("dblclick", this.removeFromDropZone);

    // Удаляем из DOM зоны сброса
    if (number.parentNode === this.dropZone) {
      this.dropZone.removeChild(number);
    }

    // Возвращаем в массив падающих чисел
    this.numbers.push(number);

    // Восстанавливаем стили для падения
    number.classList.remove("dropped-number");
    number.style.position = "absolute";
    number.style.left = `${Math.random() * window.innerWidth}px`;
    number.style.top = `${-this.settings.size}px`;
    number.style.opacity = Math.random() * 0.5 + 0.5;
    number.style.textShadow = "0 0 5px #576abd";
    number.style.zIndex = "1";
    number.style.cursor = "pointer";

    // Восстанавливаем анимационные данные
    if (number.numberData) {
      number.numberData.isInDropZone = false;
      number.numberData.isFading = false;
      number.numberData.speed =
        number.numberData.originalSpeed ||
        this.settings.speed * (Math.random() * 0.5 + 0.75);
    }

    // Удаляем из массива сброшенных чисел
    this.droppedNumbers = this.droppedNumbers.filter(
      (item) => item.element !== number
    );

    let sumBefore = this.playerSum;

    // Обновляем сумму

    if (e.type != undefined) {
      this.updatePoints(false, number);
    }
    this.playerSum -= value;
    this.updatePlayerCup();

    // Проверяем условие победы
    if (this.playerSum == this.targetSum && !this.isAnimating) {
      this.startScaleAnimation(null); // Левая чаша уравнивается
    } else if (this.playerSum > sumBefore && !this.isAnimating) {
      //левая чаша ниже чем правая
      this.startScaleAnimation(true);
    } else if (this.playerSum < sumBefore && !this.isAnimating) {
      //левая чаша выше чем правая
      this.startScaleAnimation(false);
    }

    // Обновляем количество чисел на экране
    this.updateNumbersCount();
  };

  // Обновление отображения суммы
  updatePlayerCup() {
    const playerCup = document.querySelector(".player-cup");
    if (playerCup) {
      playerCup.textContent = this.playerSum;

      // Подсветка при приближении к цели
      if (
        this.playerSum >= this.targetSum * 0.8 &&
        this.playerSum <= this.targetSum * 1.2
      ) {
        playerCup.style.color = "#ff4444";
        playerCup.style.textShadow = "0 0 20px #ff0000";
      } else {
        playerCup.style.color = "#fffacd";
        playerCup.style.textShadow = "0 0 20px #3300ff";
      }
    }
  }

  startScaleAnimation(leftHeavy) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.animationProgress = 0;
    const leftCup = document.getElementById("leftcup");
    const rightCup = document.getElementById("rightcup");
    const upperRC = document.getElementById("upper-rightcup");

    const step = Math.abs(this.targetSum - this.playerSum) / this.targetSum;
    const steppx = step * 25;

    // Анимационная функция
    const animate = () => {
      // Увеличиваем прогресс
      this.animationProgress += 0.1;

      if (this.animationProgress < 1) {
        const currentStep = steppx;

        // Применяем трансформации
        if (leftHeavy) {
          // Левая чаша вниз, правая вверх
          leftCup.style.transform = `translateY(${currentStep}px)`;
          rightCup.style.transform = `translateY(${-currentStep}px)`;
          upperRC.style.transform = `translateY(${-currentStep}px), translateX(-50%)`;
        } else if (!leftHeavy) {
          // Левая чаша вверх, правая вниз
          leftCup.style.transform = `translateY(${-currentStep}px)`;
          rightCup.style.transform = `translateY(${currentStep}px)`;
          upperRC.style.transform = `translateY(${currentStep}px), translateX(-50%)`;
        } else {
          // leftHeavy == null - возвращаем в исходное положение
          leftCup.style.transform = `translateY(0px)`;
          rightCup.style.transform = `translateY(0px)`;
          upperRC.style.transform = `translateY(0px), translateX(-50%)`;
        }

        // Запрашиваем следующий кадр
        requestAnimationFrame(animate);
      } else {
        // Анимация завершена
        this.isAnimating = false;
      }
    };
    animate();
  }

  // Возврат числа в дождь
  returnToRain = (number) => {
    number.classList.remove("dropped-number");
    // Восстанавливаем стили и позицию
    number.style.position = "absolute";
    number.style.textShadow = "0 0 5px #576abd";
    /*number.style.left = `${Math.random() * window.innerWidth}px`;
    number.style.top = `${-this.settings.size}px`;*/

    // Восстанавливаем анимацию
    if (number.numberData) {
      number.numberData.speed = number.numberData.originalSpeed;
      number.numberData.isInDropZone = false;
      number.numberData.isDragged = false;
    }

    // Удаляем обработчик для удаления из зоны
    number.removeEventListener("dblclick", this.removeFromDropZone);
    // Добавляем обработчик для перетаскивания обратно
    this.addDragHandlers(number);

    // Если число было в droppedNumbers, удаляем его оттуда
    this.droppedNumbers = this.droppedNumbers.filter(
      (item) => item.element !== number
    );

    // Возвращаем в массив падающих чисел, если его там нет
    if (!this.numbers.includes(number)) {
      this.numbers.push(number);
    }
  };

  updatePoints(isAdded, number) {
    const pointPerMax = this.maxPoints / this.targetSum;
    const points = document.getElementById("point-value");
    let sum = parseInt(points.textContent);

    if (isAdded) {
      sum += parseInt(number.textContent) * pointPerMax;
      if (this.playerSum > this.targetSum) {
        //штраф

        setTimeout(() => {
          const fakeEvent = {
            currentTarget: number,
            stopPropagation: () => {},
          };
          this.removeFromDropZone(fakeEvent);
          alert(
            `Вы привысили контрольную сумму! Вам штраф -${
              parseInt(number.textContent) * pointPerMax * 2
            }!`
          );
          sum = Math.max(
            sum - parseInt(number.textContent) * pointPerMax * 2,
            0
          );
          points.textContent = `${sum}`;
        }, 1000);
      }
    } else {
      sum = Math.max(sum - parseInt(number.textContent) * pointPerMax, 0);
    }

    points.textContent = `${sum}`;
  }
}

// Автозапуск при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  window.numberRain = new NumberRain();
});
