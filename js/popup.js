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

    openBtn.addEventListener('click', function () {
        popup.style.display = 'flex';
        board.style.opacity = 0;
        heading.style.opacity = 0;
        headingdesc.style.opacity = 0;
        slider.style.visibility = 'hidden';
        popup2.style.display = "none";
    });

    closeBtn.addEventListener('click', function () {
        popup.style.display = 'none';
        popup2.style.display = 'none';
        board.style.opacity = 1;
        heading.style.opacity = 1;
        headingdesc.style.opacity = 1;
        slider.style.visibility = 'visible';
    });

    openBtn2.addEventListener('click', function () {
        board.style.opacity = 0;
        heading.style.opacity = 0;
        headingdesc.style.opacity = 0;
        slider.style.visibility = 'hidden';
        popup2.style.display = 'flex';
        popup.style.display = 'none';
    });

    const closeBtn2 = popup2.querySelector('.close-btn');
    closeBtn2.addEventListener('click', function () {
        popup2.style.display = 'none';
        board.style.opacity = 1;
        heading.style.opacity = 1;
        headingdesc.style.opacity = 1;
        slider.style.visibility = 'visible';
        popup.style.display = 'none';
    });
})();
