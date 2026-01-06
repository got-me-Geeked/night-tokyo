//начало перетаскивания
function startDrag(event) {
  event.preventDefault();
  const img = event.currentTarget;
  draggingImage = img;

  img.style.cursor = "grabbing";
  img.style.border = "2px solid #ffff00";
  img.style.boxShadow = "0 0 10px #ffff00";
  img.style.zIndex = "101";

  // Рассчитываем смещение курсора относительно угла картинки
  const rect = img.getBoundingClientRect();
  dragOffsetX = event.clientX - rect.left;
  dragOffsetY = event.clientY - rect.top;

  // Добавляем глобальные обработчики
  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", stopDrag);
}

function handleDrag(event) {
  if (!draggingImage) {
    return;
  }
  event.preventDefault();
  draggingImage.style.position = "absolute";
  // Рассчитываем новую позицию с учетом смещения
  let newLeft = event.clientX - dragOffsetX;
  let newTop = event.clientY - dragOffsetY;

  // Ограничиваем границами окна
  const imageWidth = draggingImage.offsetWidth;
  const imageHeight = draggingImage.offsetHeight;

  // Границы окна
  newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - imageWidth));
  newTop = Math.max(0, Math.min(newTop, window.innerHeight - imageHeight));

  // Применяем новую позицию
  draggingImage.style.left = `${newLeft}px`;
  draggingImage.style.top = `${newTop}px`;

  // Обновляем данные в numberData
  if (draggingImage.animalData) {
    draggingImage.animalData.isDragged = true;
  }
}
// конец перетаскивания
function stopDrag(event) {
  if (!draggingImage) return;
  event.preventDefault();

  addToDropZone(draggingImage, event);

  if (draggingImage.animalData) {
    draggingImage.animalData.isDragged = false;
  }

  // Убираем обработчики
  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", stopDrag);

  draggingImage = null;
}

function addStartDrag() {
  const imgContent = document.getElementById("bottom-animals");
  const children = imgContent.children;
  if (isLevelRunning) {
    for (let i = 0; i < children.length; i++) {
      children[i].addEventListener("mousedown", startDrag);
    }
  }
  if (droppedImages.length > 0) {
    for (let i = 0; i < dropZone.children.length; i++) {
      dropZone.children[i].addEventListener("dblclick", removeFromDropZone);
    }
  }
}

function removeStartDrag() {
  const imgContent = document.getElementById("bottom-animals");
  const children = imgContent.children;
  if (isOnPause) {
    for (let i = 0; i < children.length; i++) {
      children[i].removeEventListener("mousedown", startDrag);
    }
  }

  if (droppedImages.length > 0) {
    for (let i = 0; i < dropZone.children.length; i++) {
      dropZone.children[i].removeEventListener("dblclick", removeFromDropZone);
    }
  }
}
