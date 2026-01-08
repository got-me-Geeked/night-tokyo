// Добавление картинки в область
function addToDropZone(img, event) {
  const imgval = img.animalData.total_mass;
  if (isNaN(imgval)) return;

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
    returnToSpawn(img);
    return;
  }
  img.style.left = `${clientX - dropZoneRect.left - dragOffsetX}px`;
  img.style.top = `${clientY - dropZoneRect.top - dragOffsetY}px`;
  img.style.boxShadow = "0 0 10px #00ff00";
  img.style.border = "2px solid  #00ff00";
  img.style.zIndex = "10";
  img.style.cursor = "pointer";

  dropZone.appendChild(img);

  // Добавляем в массив
  droppedImages.push({
    element: img,
    value: imgval,
  });

  img._handlers = {
    mouseenter: () => setupScaleAbility(img),
    mousemove: () => setupScaleAbility(img),
    mouseleave: () => removeScaleAbility(img),
  };
  // Добавляем обработчик для удаления
  img.removeEventListener("mousedown", startDrag);
  img.addEventListener("dblclick", removeFromDropZone);
  //добавление обработчиков наведения на картинку
  /*
  img.addEventListener("mouseenter", () => setupScaleAbility(img));
  img.addEventListener("mousemove", () => setupScaleAbility(img));
  img.addEventListener("mouseleave", () => removeScaleAbility(img));*/
  img.addEventListener("mouseenter", img._handlers.mouseenter);
  img.addEventListener("mousemove", img._handlers.mousemove);
  img.addEventListener("mouseleave", img._handlers.mouseleave);

  // Обновляем сумму
  playerSum += imgval;
  updateScores();
}

function setupScaleAbility(img) {
  if (img._keyHandler) {
    document.removeEventListener("keydown", img._keyHandler);
  }

  img._keyHandler = (e) => {
    if (
      (e.key === "ц" ||
        e.key === "Ц" ||
        e.key === "w" ||
        e.key === "W" ||
        e.key === "Control") &&
      img.animalData.clicks < clicksLimit
    ) {
      img.animalData.clicks += 1;
      imgResize(currentImage);
    }
  };
  document.addEventListener("keydown", img._keyHandler);
  img.style.boxShadow = "5px 5px 8px #c800ffff";
  currentImage = img;
}

function removeScaleAbility(img) {
  if (!img) return;
  if (img._keyHandler) {
    document.removeEventListener("keydown", img._keyHandler);
    img._keyHandler = null;
  }

  img.style.boxShadow = "";
  if (currentImage === img) {
    currentImage = null;
  }
}

function imgResize(img) {
  //обновление размера картинки
  img.animalData.size = img.animalData.size * 1.1;
  img.style.transition = "transform 0.3s ease";
  img.style.transform = `scale(${1.1 + 0.1 * (img.animalData.clicks - 1)})`;

  //обновление очков
  playerSum += img.animalData.mass;
  img.animalData.total_mass += img.animalData.mass;
  updateScores();
}

// Удаление числа из области
function removeFromDropZone(e) {
  e.stopPropagation();
  const img = e.currentTarget;
  const imgval = img.animalData.total_mass;
  // Удаляем обработчики
  img.removeEventListener("dblclick", removeFromDropZone);

  removeScaleAbility(img);
  /*img.removeEventListener("mouseenter", () => setupScaleAbility(img));
  img.removeEventListener("mousemove", () => setupScaleAbility(img));
  img.removeEventListener("mouseleave", () => removeScaleAbility(img));*/
  if (img._handlers) {
    img.removeEventListener("mouseenter", img._handlers.mouseenter);
    img.removeEventListener("mousemove", img._handlers.mousemove);
    img.removeEventListener("mouseleave", img._handlers.mouseleave);
    img._handlers = null;
  }
  img.addEventListener("mousedown", startDrag);

  // Удаляем из DOM зоны сброса
  if (img.parentNode === dropZone) {
    dropZone.removeChild(img);
  }
  returnToSpawn(img);

  playerSum -= imgval;

  updateScores();
}

function returnToSpawn(img) {
  const spawn = document.getElementById("bottom-animals");
  img.style.position = "static";
  img.style.zIndex = "100";
  img.style.boxShadow = "";
  img.style.border = "";
  img.style.cursor = "grab";
  img.style.transform = "";
  img.style.transition = "";
  img.width = settings.size;
  img.height = settings.size;
  img.animalData.size = settings.size;
  img.animalData.total_mass = img.animalData.mass;
  img.animalData.clicks = 0;
  img.animalData.isDragged = false;
  if (img._keyHandler) {
    document.removeEventListener("keydown", img._keyHandler);
    img._keyHandler = null;
  }
  spawn.appendChild(img);
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
