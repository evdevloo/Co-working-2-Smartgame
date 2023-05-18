import { game } from './board.js';

    //let sliderTiles = document.querySelectorAll(`.card`);
    let sliderTiles;

    getPieces();

    function getPieces() {

        sliderTiles = document.querySelectorAll(`.card, #grid > div`);
        sliderTiles .forEach(element =>{
            element.addEventListener('dragstart', dragStart);
        });

    }


    let targets;
    getTargets();

    function getTargets(){
        targets = document.querySelectorAll(`#grid > div, #items`);

        targets.forEach(element => {

            element.addEventListener('dragenter', dragEnter)
            element.addEventListener('dragover', dragOver);
            element.addEventListener('dragleave', dragLeave);
            element.addEventListener('drop', drop);

        })
    }

    function dragStart(event) {

        if (event.target.classList.contains("tile")){
            let x = event.target.classList[1].charAt(2);
            let y = event.target.classList[2].charAt(2);
            game.removePiece(x,y)
        }
        event.dataTransfer.setData('text/plain', event.target.id);
        setTimeout(() => {
           event.target.classList.add('hide');
        }, 0);
    }

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

        if (event.target.parentElement.id === 'grid' || event.target.id === 'items'){
            event.target.classList.remove('drag-over');

            // get the draggable element
            const id = event.dataTransfer.getData('text/plain');
            const draggable = document.getElementById(id);

            if (event.target.parentElement.id === 'grid'){
                let x = event.target.classList[1].charAt(2);
                let y = event.target.classList[2].charAt(2);
                game.addPiece(draggable.id,x,y,0);
                getTargets();
                getPieces();
            }

            event.target.appendChild(draggable);
            //event.target.style.zIndex = '1';

            draggable.classList.remove('hide');
            sort();
        } else if (event.target.classList.contains('card') && event.target.parentElement.id === 'items'){
            event.target.classList.remove('drag-over');

            // get the draggable element
            const id = event.dataTransfer.getData('text/plain');
            const draggable = document.getElementById(id);

            event.target.parentElement.appendChild(draggable);
            //event.target.style.zIndex = '1';
            draggable.classList.remove('hide');
            sort();
        }
    }
    function sort() {
        /* Act on the event */
        let tile = document.querySelector(`#items`);
        let tileSort = [...document.querySelectorAll(`#items div`)];

        tileSort.sort(function(a, b){
            return (a.id > b.id) ? 1 : (a.id < b.id) ? -1 : 0;
    });
        for(var i = 0, l = tileSort.length; i < l; i++) {
            tile.appendChild(tileSort[i]);
        }
    }