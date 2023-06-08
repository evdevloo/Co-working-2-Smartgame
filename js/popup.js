'use strict';
(function () {
    const openBtn = document.getElementById('open-btn');
    const openBtn2 = document.getElementById('openChal');
    const closeBtn = document.getElementById('close-btn');
    const popup = document.getElementById('popup');
    const popup2 = document.getElementById('popup2');
    const board = document.getElementById('board');
    const heading = document.getElementById('challenge-heading');
    const headingdesc = document.getElementById('challenge-description');
    const slider = document.getElementById('slider');
    const closeBtn2 = document.getElementById('close-btn2');

    openBtn.addEventListener('click', function () {
        popup.style.display = 'flex';
        popup2.style.display = "none";

        slider.style.visibility = 'hidden';
        
    });

    closeBtn.addEventListener('click', function () {
        popup.style.display = 'none';
        popup2.style.display = 'none';
        slider.style.visibility = 'visible';
    });

    openBtn2.addEventListener('click', function () {
        popup2.style.display = 'flex';
        popup.style.display = 'none';

        slider.style.visibility = 'hidden';
        
    });

    
    closeBtn2.addEventListener('click', function () {
        popup2.style.display = 'none';

        slider.style.visibility = 'visible';
        popup.style.display = 'none';
    });
})();
