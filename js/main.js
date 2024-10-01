document.querySelector(".menu-toggle").addEventListener("click", function () {
  document.querySelector(".sidebar").classList.toggle("open");
});

const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach((item) => {
  item.addEventListener("click", function () {
    menuItems.forEach((i) => i.classList.remove("active"));
    this.classList.add("active");
  });
});
