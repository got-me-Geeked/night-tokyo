const userPREFIX = "scales_username_list";
const roundPREFIX = "scales_round_list";

function addUsernameToList(username) {
  const currentList = JSON.parse(localStorage.getItem(userPREFIX) || "[]");
  if (!currentList) {
    return;
  }
  if (!currentList.includes(username)) {
    currentList.push(username);
    localStorage.setItem(userPREFIX, JSON.stringify(currentList));
  }
}

function chckUsernameInList(username) {
  const currentList = JSON.parse(localStorage.getItem(userPREFIX) || "[]");
  if (!currentList) {
    return;
  }
  if (currentList.includes(username)) {
    return true;
  }
  return false;
}

function addUserdataToList(
  username,
  total_score = 0,
  completed_levels = [0, 0, 0, 0],
  point_each_level = [0, 0, 0, 0]
) {
  const userData = {
    user: username,
    total: total_score,
    comp_lvls: completed_levels,
    point_per_lvl: point_each_level,
  };

  const currentList = JSON.parse(localStorage.getItem(roundPREFIX) || "[]");
  if (!currentList) {
    return;
  }
  if (!currentList.some((element) => element.user === username)) {
    currentList.push(userData);
    localStorage.setItem(`${roundPREFIX}`, JSON.stringify(currentList));
  }
}

function getUserdataFromList(username) {
  const currentList = JSON.parse(localStorage.getItem(roundPREFIX));
  if (!currentList) {
    return;
  }
  return currentList.find((element) => element.user === username);
}

function addSessionUser(username = "Гость") {
  sessionStorage.setItem("scales_session_username", username);
}

//регистрация нового игрока
function handleNewUserEnter() {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const regexp = /^[a-zA-Zа-яА-ЯёЁ0-9]+$/;

  //блок проверки
  if (username.length < 2 || username.length > 20) {
    alert("Имя должно быть минимум 2 символа и максимум 20");
    return;
  }

  if (!regexp.test(username)) {
    alert("Имя должно состоять из символов и цифр без пробелов");
    return;
  }

  //проверка что имя уникальное
  if (chckUsernameInList(username)) {
    alert(`В игре уже есть такой пользователь ${username}, выберите другое`);
    return;
  }

  //Добавление имени нового пользователя
  addUsernameToList(username);

  //Добавление данных по умолчанию
  addUserdataToList(username);

  // Переходим в игру c cохранением имени игрока
  addSessionUser(username);
  window.location.href = "menu.html";
}

function handleUserEnter() {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const regexp = /^[a-zA-Zа-яА-ЯёЁ0-9]+$/;

  //блок проверки
  if (username.length < 2 || username.length > 20) {
    alert("Имя должно быть минимум 2 символа и максимум 20");
    return;
  }

  if (!regexp.test(username)) {
    alert("Имя должно состоять из символов и цифр без пробелов");
    return;
  }
  //проверка что имя есть в localStorage
  if (!chckUsernameInList(username)) {
    alert(`Такого имени нет: ${username}`);
    return;
  }
  addSessionUser(username);
  window.location.href = "menu.html";
}

function handleGuestEnter() {
  addSessionUser();
  window.location.href = "menu.html";
}

// Автозапуск при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  //запуск анимации вспышки
  startRandomFlashes();
});
