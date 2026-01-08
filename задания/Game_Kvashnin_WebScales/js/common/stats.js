function loadLeaderboard() {
  const currentList = JSON.parse(
    localStorage.getItem("scales_round_list") || "[]"
  );

  //ответственность за изменения данных игрока (прохождение уровня, число очков) лежит на коде уровня
  if (currentList.length <= 0 || currentList == "[]") {
    return;
  }
  const tablebody = document.querySelector("tbody");
  const noDataRow = document.getElementById("noDataRow");
  //очистка таблицы
  tablebody.innerHTML = "";

  //получаем всех игроков из localStorage
  const users = [];
  for (let i = 0; i < currentList.length; i++) {
    const playerData = currentList[i];
    const key = playerData.user;
    let sumlevels, sumpoints;
    sumlevels = 0;
    sumpoints = 0;
    playerData.comp_lvls.forEach((element) => {
      sumlevels += element;
    });
    playerData.point_per_lvl.forEach((element) => {
      sumpoints += element;
    });

    users.push({
      username: key,
      completedLevels: sumlevels,
      totalScore: sumpoints,
    });
  }

  if (noDataRow && users.length > 0) {
    noDataRow.remove();
  }
  //сортировка игроков по totalScore
  users.sort((a, b) => b.totalScore - a.totalScore);

  //добавление tr в dom
  users.forEach((user, index) => {
    const row = document.createElement("tr");
    let rank = "";
    if (index === 0) rank = "top-1";
    else if (index === 1) rank = "top-2";
    else if (index === 2) rank = "top-3";
    const Prefix = index < 3 ? `${index + 1}. ` : "";
    row.innerHTML = `
      <td class="username-col ${rank}">
        ${Prefix}${user.username}
      </td>
      <td class="levels-col ${rank}">${user.completedLevels}</td>
      <td class="score-col ${rank}">${user.totalScore}</td>
    `;

    tablebody.appendChild(row);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  loadLeaderboard();

  window.addEventListener("resize", loadLeaderboard);
});
