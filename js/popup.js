'use strict';

(function () {
    const openBtn = document.getElementById('open-btn');
    const closeBtn = document.getElementById('close-btn');
    const popup = document.getElementById('popup');
    const board = document.getElementById('board');
    const heading = document.getElementById('challenge-heading');
    const headingdesc = document.getElementById('challenge-description');

    openBtn.addEventListener('click', function () {
        popup.style.display = 'flex';
        board.style.opacity = 0;
        heading.style.opacity = 0;
        headingdesc.style.opacity = 0;
    });

    closeBtn.addEventListener('click', function () {
        popup.style.display = 'none';
        board.style.opacity = 1;
        heading.style.opacity = 1;
        headingdesc.style.opacity = 1;
    });
})();
