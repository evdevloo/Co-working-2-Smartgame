"use strict";

(function() {
    let board = document.getElementById('board');
    let grid = document.getElementById('grid');
    let tiles = document.getElementById('tiles');

    tiles.addEventListener('mouseover', e => {
        e.stopPropagation();
    });

    grid.addEventListener('mouseover', e => {
        console.log(e.target);
    });
})();