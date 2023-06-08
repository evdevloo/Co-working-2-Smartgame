const menu = document.querySelector('#menu');
const nav = document.querySelector('nav');
const hamburgerToggleButton = document.querySelector('.icon');

let navOpen = 0;

const closeNav = () => {
  if (window.matchMedia('(min-width: 75em)').matches) {
    menu.setAttribute('aria-expanded', false);
    nav.setAttribute('aria-expanded', false);
    hamburgerToggleButton.setAttribute('aria-hidden', false);
  }
};
closeNav();

window.addEventListener('resize', closeNav);

menu.addEventListener('click', () => {
  navOpen ^= 1;
  menu.setAttribute('aria-expanded', !!navOpen);
  nav.setAttribute('aria-expanded', !!navOpen);
  hamburgerToggleButton.setAttribute('aria-hidden', !!navOpen);
});