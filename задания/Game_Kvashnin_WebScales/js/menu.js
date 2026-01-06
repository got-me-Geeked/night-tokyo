function correct() {
  const sessionUser = sessionStorage.getItem("scales_session_username");
  const menuUpper = document.getElementById("curr_user");
  menuUpper.textContent = sessionUser;
}

correct();

function Logout() {
  sessionStorage.clear();
  window.location.href = "index.html";
}

function Levels() {
  window.location.href = "levels.html";
}

function Stats() {
  window.location.href = "stats.html";
}

function Help() {
  window.location.href = "help.html";
}

// Автозапуск при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  //запуск анимации вспышки
  startRandomFlashes();
});
