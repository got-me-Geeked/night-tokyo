// Добавление числа в область
function addToDropZone(number, event) {
  const numberValue = parseInt(number.textContent);
  if (isNaN(numberValue)) return;

  const droppedNumber = number;

  // Используем координаты из события, а не из getBoundingClientRect()
  const clientX = event.clientX;
  const clientY = event.clientY;

  const dropZoneRect = dropZone.getBoundingClientRect();

  // Проверяем, что клик был внутри зоны
  const isInDropZone =
    clientX >= dropZoneRect.left &&
    clientX <= dropZoneRect.right &&
    clientY >= dropZoneRect.top &&
    clientY <= dropZoneRect.bottom;

  if (!isInDropZone) {
    returnToRain(number);
    return;
  }
  droppedNumber.style.left = `${clientX - dropZoneRect.left - dragOffsetX}px`;
  droppedNumber.style.top = `${clientY - dropZoneRect.top - dragOffsetY}px`;
  droppedNumber.style.color = "#5fd463";
  droppedNumber.style.textShadow = "0 0 10px #00ff00";
  droppedNumber.style.zIndex = "100";
  droppedNumber.style.cursor = "pointer";

  dropZone.appendChild(droppedNumber);

  // Обновляем данные числа
  if (number.numberData) {
    number.numberData.isInDropZone = true;
  }

  // Добавляем в массив
  droppedNumbers.push({
    element: number,
    value: numberValue,
  });

  // Удаляем из массива падающих чисел
  const index = numbers.indexOf(number);
  if (index > -1) {
    numbers.splice(index, 1);
  }

  // Добавляем обработчик для удаления
  number.removeEventListener("mousedown", startDrag);
  number.addEventListener("dblclick", removeFromDropZone);

  // Обновляем сумму
  playerSum += numberValue;
  calcPenalties();
  updateScores();
}

// Возврат числа в дождь
function returnToRain(number) {
  number.classList.remove("dropped-number");
  // Восстанавливаем стили и позицию
  number.style.position = "absolute";
  number.style.textShadow = "0 0 5px #576abd";

  // Восстанавливаем анимацию
  if (number.numberData) {
    number.numberData.speed = number.numberData.originalSpeed;
    number.numberData.isInDropZone = false;
    number.numberData.isDragged = false;
  }

  // Удаляем обработчик для удаления из зоны
  number.removeEventListener("dblclick", removeFromDropZone);
  // Добавляем обработчик для перетаскивания обратно
  number.addEventListener("mousedown", startDrag);

  // Если число было в droppedNumbers, удаляем его оттуда
  droppedNumbers = droppedNumbers.filter((item) => item.element !== number);

  // Возвращаем в массив падающих чисел, если его там нет
  if (!numbers.includes(number)) {
    numbers.push(number);
  }
}

// Удаление числа из области
function removeFromDropZone(e) {
  e.stopPropagation();
  const number = e.currentTarget;
  const value = parseInt(number.textContent);
  // Удаляем обработчик
  number.removeEventListener("dblclick", removeFromDropZone);
  number.addEventListener("mousedown", startDrag);

  // Удаляем из DOM зоны сброса
  if (number.parentNode === dropZone) {
    dropZone.removeChild(number);
  }

  // Возвращаем в массив падающих чисел
  numbers.push(number);

  // Восстанавливаем стили для падения
  number.style.position = "absolute";
  number.style.left = `${Math.random() * window.innerWidth}px`;
  number.style.top = `${-settings.size}px`;
  number.style.opacity = Math.random() * 0.5 + 0.5;
  number.style.textShadow = "0 0 5px #576abd";
  number.style.color = settings.color;
  number.style.zIndex = "1";

  // Восстанавливаем анимационные данные
  if (number.numberData) {
    number.numberData.isInDropZone = false;
    number.numberData.isFading = false;
    number.numberData.speed =
      number.numberData.originalSpeed ||
      this.settings.speed * (Math.random() * 0.5 + 0.75);
  }

  // Удаляем из массива сброшенных чисел
  droppedNumbers = droppedNumbers.filter((item) => item.element !== number);

  playerSum -= value;

  updateScores();
  // Обновляем количество чисел на экране
  updateNumbersCount();
}

function updateScores() {
  calcPoints();
  showPlayerSum(playerSum);
  updatePoints();

  // Проверяем условие победы
  if (playerSum == settings.targetSum && !isAnimating) {
    startScaleAnimation(null); // Левая чаша уравнивается
  } else if (playerSum > settings.targetSum && !isAnimating) {
    //левая чаша ниже чем правая
    startScaleAnimation(true);
  } else if (playerSum < settings.targetSum && !isAnimating) {
    //левая чаша выше чем правая
    startScaleAnimation(false);
  }
}
