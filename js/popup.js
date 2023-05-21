'use strict';

(function () {
    const openBtn = document.getElementById('open-btn');
    const closeBtn = document.getElementById('close-btn');
    const popup = document.getElementById('popup');
    const board = document.getElementById('board');

    openBtn.addEventListener('click', function () {
        popup.style.display = 'flex';
        board.style.opacity = 0;
    });

    closeBtn.addEventListener('click', function () {
        popup.style.display = 'none';
        board.style.opacity = 1;
    });
})();
