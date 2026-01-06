//начало перетаскивания
function startDrag(event) {
  event.preventDefault();
  const number = event.currentTarget;
  draggingNumber = number;

  // Подсветка взятого числа
  number.style.textShadow = "0 0 20px #ffff00";
  number.style.zIndex = "1000";
  number.style.cursor = "grabbing";

  // Рассчитываем смещение курсора относительно угла числа
  const rect = number.getBoundingClientRect();

  dragOffsetX = event.clientX - rect.left;
  dragOffsetY = event.clientY - rect.top;

  // Добавляем глобальные обработчики
  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", stopDrag);

  // Временно останавливаем автоматическое движение числа
  if (number.numberData) {
    number.numberData.originalSpeed = number.numberData.speed;
    number.numberData.speed = 0; // Останавливаем падение
  }
}

//обработка перетаскивания (каждый пиксель движения мыши)
function handleDrag(event) {
  //а мы что-то перетаскиваем?
  if (!draggingNumber) return;

  event.preventDefault();

  // Рассчитываем новую позицию с учетом смещения
  let newLeft = event.clientX - dragOffsetX;
  let newTop = event.clientY - dragOffsetY;

  // Ограничиваем границами окна
  const numberWidth = draggingNumber.offsetWidth;
  const numberHeight = draggingNumber.offsetHeight;

  // Границы окна
  newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - numberWidth));
  newTop = Math.max(0, Math.min(newTop, window.innerHeight - numberHeight));

  // Применяем новую позицию
  draggingNumber.style.left = `${newLeft}px`;
  draggingNumber.style.top = `${newTop}px`;

  // Обновляем данные в numberData
  if (draggingNumber.numberData) {
    draggingNumber.numberData.isDragged = true;
  }
}

// конец перетаскивания
function stopDrag(event) {
  if (!draggingNumber) return;
  event.preventDefault();

  addToDropZone(draggingNumber, event);

  if (
    draggingNumber.numberData &&
    draggingNumber.numberData.originalSpeed !== undefined
  ) {
    draggingNumber.numberData.speed = draggingNumber.numberData.originalSpeed;
    draggingNumber.numberData.isDragged = false;
  }
  // Сбрасываем флаг перетаскивания (делаем всегда)
  if (draggingNumber.numberData) {
    draggingNumber.numberData.isDragged = false;
  }

  // Убираем обработчики
  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", stopDrag);

  draggingNumber = null;
}
