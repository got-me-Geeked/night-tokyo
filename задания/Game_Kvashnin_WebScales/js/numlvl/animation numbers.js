function createNumber() {
  const number = document.createElement("div");
  number.className = "number";

  // Случайное число или символ
  const randomChar =
    settings.characters[Math.floor(Math.random() * settings.characters.length)];
  number.textContent = randomChar;

  // Случайная позиция вверху экрана
  number.style.left = `${Math.random() * window.innerWidth}px`;
  number.style.top = `${-settings.size}px`;
  number.style.fontSize = `${settings.size}px`;
  number.style.color = settings.color;
  number.style.opacity = Math.random() * 0.5 + 0.5; // 0.5-1.0

  // Случайная скорость
  const speed = settings.speed * (Math.random() * 0.5 + 0.75); // 75%-125% от базовой

  // Сохраняем данные в объекте
  number.numberData = {
    speed: speed,
    originalSize: settings.size,
    isFading: false,
  };

  document.body.appendChild(number);
  //обработчик перетаскивания только когда анимация запущена и левел запущен
  if (isRunning) {
    number.addEventListener("mousedown", startDrag);
  }

  return number;
}

function removeDrag() {
  if (!isRunning) {
    numbers.forEach((element) => {
      element.removeEventListener("mousedown", startDrag);
    });
  }
}

function addDrag() {
  if (isRunning) {
    numbers.forEach((element) => {
      element.addEventListener("mousedown", startDrag);
    });
  }
}

//обновление чисел на экране
function updateNumbersCount() {
  const currentCount = numbers.length;

  // Добавляем новые числа
  if (settings.count > currentCount) {
    for (let i = 0; i < settings.count - currentCount; i++) {
      numbers.push(createNumber());
    }
  }
  // Удаляем лишние числа
  else if (settings.count < currentCount) {
    const toRemove = currentCount - settings.count;
    for (let i = 0; i < toRemove; i++) {
      const number = numbers.pop();
      if (number && number.parentNode) {
        number.parentNode.removeChild(number);
      }
    }
  }
}

// currentTime = время с момента загрузки страницы (в миллисекундах)
function animate(currentTime = 0) {
  // Если НЕ запущено - НЕ обновляем и НЕ запрашиваем следующий кадр
  if (!isRunning || isLevelComplete) {
    return;
  }

  // Обновляем позиции чисел
  updateNumbers();

  // Следующий кадр
  animationId = requestAnimationFrame((time) => animate(time));
}

//движение на один шаг по кадрам
function updateNumbers() {
  numbers.forEach((number, index) => {
    if (!number || !number.parentNode || isLevelComplete) return;

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
    if (settings.fadeOut) {
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
      top > window.innerHeight + settings.size ||
      (data.isFading && parseFloat(number.style.opacity) <= 0)
    ) {
      // Возвращаем число наверх
      number.style.left = `${Math.random() * window.innerWidth}px`;
      number.style.top = `${-settings.size}px`;
      number.style.opacity = Math.random() * 0.5 + 0.5;
      number.style.transform = "scale(1)";

      // Меняем число
      const randomChar =
        settings.characters[
          Math.floor(Math.random() * settings.characters.length)
        ];
      number.textContent = randomChar;

      data.isFading = false;
    }

    // Иногда меняем число на лету (эффект "Матрицы")
    if (Math.random() < 0.005) {
      // 0,5% шанс смены символа
      const randomChar =
        settings.characters[
          Math.floor(Math.random() * settings.characters.length)
        ];
      number.textContent = randomChar;
    }
  });
}

//если число вышло за границы - пихаем его наверх (решение изменения расширения окна)
function updateNumbersPositions() {
  numbers.forEach((number) => {
    if (number && number.parentNode) {
      // Если число вышло за пределы экрана, переставляем его вверху
      const rect = number.getBoundingClientRect();
      if (
        rect.top > window.innerHeight ||
        rect.left < 0 ||
        rect.left > window.innerWidth
      ) {
        number.style.left = `${Math.random() * window.innerWidth}px`;
        number.style.top = `${-settings.size}px`;
        number.style.opacity = Math.random() * 0.5 + 0.5;
        number.numberData.isFading = false;
      }
    }
  });
}
