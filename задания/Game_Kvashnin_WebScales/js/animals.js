// Добавление числа в область
function addToDropZone(img, event) {
  //alert("tcnm");
  if (!this.dropZone) return;

  const dropZoneRect = this.dropZone.getBoundingClientRect();
  const clientX = event.clientX;
  const clientY = event.clientY;

  // Проверяем, что клик был внутри зоны
  const isInDropZone =
    clientX >= dropZoneRect.left &&
    clientX <= dropZoneRect.right &&
    clientY >= dropZoneRect.top &&
    clientY <= dropZoneRect.bottom;

  if (isInDropZone) {
    img.style.position = "absolute";
    img.style.left = `${clientX - dropZoneRect.left - img.width / 2}px`;
    img.style.top = `${clientY - dropZoneRect.top - img.height / 2}px`;
    img.style.cursor = "default";
  }

  this.dropZone.appendChild(img);

  // Обновляем данные числа
  if (img.animalData) {
    img.animalData.isInDropZone = true;
  }
  /*
    // Добавляем в массив
    this.droppedAnimals.push({
      element: "",
      value: ,
    });*/

  // Добавляем обработчик для удаления
  img.removeEventListener("mousedown", this.startDrag);
  this.playerSum += img.animalData.value;
  this.updatePlayerCup();
  img.addEventListener("dblclick", this.removeFromDropZone);
  img.addEventListener("click", this.upSize);

  // Обновляем сумму

  //this.updatePoints(true, number);
  img.removeEventListener("dblclick", this.upSize);

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

upSize = (e) => {
  e.stopPropagation();
  const img = e.currentTarget;
  img.style.transition = "transform 0.3s ease";
  this.playerSum += img.animalData.value;
  img.animalData.value = img.animalData.value * 2;
  img.style.transform = "scale(1.5)";

  this.updatePlayerCup();
};

// Автозапуск при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  //запуск анимации вспышки
  startRandomFlashes();
});
