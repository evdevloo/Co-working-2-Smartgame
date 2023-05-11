import { game } from './board.js';

    let sliderTiles = document.querySelectorAll(`.card`);

    sliderTiles .forEach(element =>{
        element.addEventListener('dragstart', dragStart);
    });

    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
        setTimeout(() => {
            event.target.classList.add('hide');

        }, 0);
    }

    const rows = 4;
    const cols = 5;
    let targets= [];
    getTargets();

    function getTargets(){
        let tempTarg = [...document.querySelectorAll(`#grid > div, #items`)];
        let h= 0
        for (var i = 0; i < rows; i++) {
            targets[i]=[];
            for (var j = 0; j < cols; j++) {
                targets[i][j] = tempTarg[h++];
            }
        }

        targets.forEach(row => {
            row.forEach(col => {
                col.addEventListener('dragenter', dragEnter)
                col.addEventListener('dragover', dragOver);
                col.addEventListener('dragleave', dragLeave);
                col.addEventListener('drop', drop);
            })
        })
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

                for (let i = 0; i < rows; i++) {
                    for (let j = 0; j < cols; j++) {
                        if (event.target === targets[i][j]){
                            game.addPiece(draggable.id,j,i,0);
                        }
                    }
                }
                getTargets();

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