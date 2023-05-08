'use strict';
(function(){

    let dragged;

    const tiles = document.querySelectorAll(`#items div`);
    const targets = document.querySelectorAll(`.target`);

    tiles.forEach(tile =>{
        tile.addEventListener('dragstart', dragStart);
    });

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        setTimeout(() => {
            e.target.classList.add('hide');
        }, 0);
    }

    targets.forEach(target => {
        target.addEventListener('dragenter', dragEnter)
        target.addEventListener('dragover', dragOver);
        target.addEventListener('dragleave', dragLeave);
        target.addEventListener('drop', drop);
    })

    function dragEnter(event){
        event.preventDefault();
        event.target.classList.add('drag-over');

    }

    function dragOver(event) {
        event.preventDefault();
        event.target.classList.add('drag-over');
    }

    function dragLeave(event) {
        event.target.classList.remove('drag-over');
    }

    function drop(event) {
        if (!event.target.classList.contains("tile")){
            event.target.classList.remove('drag-over');

            // get the draggable element
            const id = event.dataTransfer.getData('text/plain');
            const draggable = document.getElementById(id);

            // add it to the drop target
            event.target.appendChild(draggable);

            // display the draggable element
            draggable.classList.remove('hide');
        }
    }

})();