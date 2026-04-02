document.addEventListener("DOMContentLoaded", function () {
  const button = document.querySelector(".dropdown-toggle");
  const menu = document.querySelector(".dropdown-menu");

  if (!button || !menu) return;

  button.addEventListener("click", function (e) {
    e.stopPropagation();

    if (menu.classList.contains("show")) {
      menu.classList.remove("show");
    } else {
      menu.classList.add("show");
    }
  });

  document.addEventListener("click", function () {
    menu.classList.remove("show");
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function () {
      menu.classList.remove("show");
    });
  });
});