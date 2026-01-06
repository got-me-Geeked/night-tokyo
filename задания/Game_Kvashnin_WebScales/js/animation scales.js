function startScaleAnimation(leftHeavy) {
  if (isAnimating) return;
  isAnimating = true;
  animationProgress = 0;
  const leftCup = document.getElementById("leftcup");
  const rightCup = document.getElementById("rightcup");
  const upperRC = document.getElementById("upper-rightcup");

  const step =
    Math.abs(settings.targetSum - Math.min(playerSum, settings.targetSum * 2)) /
    settings.targetSum;
  const steppx =
    step *
    Math.max(30, Math.round((settings.targetSum * 5) / settings.targetSum / 2));

  // Анимационная функция
  const animate = () => {
    // Увеличиваем прогресс
    animationProgress += 0.1;

    if (animationProgress < 1) {
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
      isAnimating = false;
    }
  };
  animate();
}
