const menu = document.querySelector("#menu");
const nav = document.querySelector("nav");
const hamburger = document.querySelector(".icon");

if (window.matchMedia("(min-width: 62em)").matches) {
  nav.setAttribute("aria-expanded", "true");
  hamburger.setAttribute("aria-hidden", "true");
}

menu.addEventListener("click", () => {
  nav.setAttribute(
    "aria-expanded",
    nav.getAttribute("aria-expanded") === "true" ? "false" : "true"
  );
  hamburger.setAttribute(
    "aria-hidden",
    hamburger.getAttribute("aria-hidden") === "true" ? "false" : "true"
  );
  menu.classList.toggle("active");
});
