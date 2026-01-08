function Logout() {
  window.location.href = "menu.html";
}

function Level1(number) {
  window.location.href = "levelnumbers.html";
  sessionStorage.setItem("difficulty", number);
}

function Level2() {
  window.location.href = "levelanimals.html";
}

// Автозапуск при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  //запуск анимации вспышки
  startRandomFlashes();
});
