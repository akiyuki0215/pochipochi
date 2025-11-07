document.addEventListener("DOMContentLoaded", async () => {
  const menu = document.getElementById("menu");
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    const groups = data.groups;

    Object.keys(groups).forEach(group => {
      const title = document.createElement("h2");
      title.textContent = group.toUpperCase();
      menu.appendChild(title);

      groups[group].forEach(item => {
        const btn = document.createElement("button");
        btn.className = "button";
        btn.textContent = item;
        btn.onclick = () => alert(`${item} を選択しました`);
        menu.appendChild(btn);
      });
    });
  } catch (e) {
    menu.textContent = "データの読み込みに失敗しました。";
    console.error(e);
  }
});