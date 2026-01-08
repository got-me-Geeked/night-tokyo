function calcPoints() {
  let difference = Math.abs(settings.targetSum - playerSum);
  let accuracy = Math.max(0, 1 - difference / settings.targetSum);
  addPoints = Math.round(accuracy * 100);
}

function calcPenalties() {
  if (settings.targetSum < playerSum) {
    addPenalties += -15;
    showPenalties();
    addPenalties = Math.max(addPenalties, -100);
  }
}
