function createRandomFlash() {
  // Создаем элемент вспышки
  const flash = document.createElement("div");

  // Случайная позиция на экране
  const x = Math.random() * 100;
  const y = Math.random() * 100;

  // Случайный размер
  const size = 35 + Math.random() * 100;

  // Случайный цвет
  const colors = ["#ffffff", "#87ceeb", "#ff4444", "#4caf50", "#ffeb3b"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  // Настройки стиля
  flash.style.cssText = `
    position: fixed;
    left: ${x}%;
    top: ${y}%;
    width: ${size}px;
    height: ${size}px;
    background: ${color};
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    opacity: 0;
    z-index: -1;
    pointer-events: none;
    transform: translate(-50%, -50%) scale(0);
    transition: opacity 0.3s, transform 0.3s;
  `;

  // Добавляем на страницу
  document.body.appendChild(flash);

  // Анимация появления
  setTimeout(() => {
    flash.style.opacity = "0.8";
    flash.style.transform = "translate(-50%, -50%) scale(1)";
  }, 10);

  // Анимация исчезновения
  setTimeout(() => {
    flash.style.opacity = "0";
    flash.style.transform = "translate(-50%, -50%) scale(0)";

    // Удаляем через 0.3 секунды
    setTimeout(() => {
      if (flash.parentNode) {
        flash.parentNode.removeChild(flash);
      }
    }, 500);
  }, 500);
}

function startRandomFlashes(interval = 1000) {
  // Создаем первую вспышку сразу

  // Запускаем интервал
  return setInterval(flashes, interval);
}

function flashes() {
  createRandomFlash();
  createRandomFlash();
  createRandomFlash();
}
