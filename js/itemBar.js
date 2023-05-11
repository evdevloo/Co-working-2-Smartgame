'use strict';
(function(){

    class Tile {

        oldParent;
        constructor(element) {
            this.id = element.id;
            this.parent = element.parentElement;
            element.addEventListener('dragstart', dragStart);
        }

        moved(){
            this.oldParent = this.parent;
            this.oldParent.style.zIndex = "";
            this.parent = document.getElementById(this.id).parentElement;
            sort();
        }

        get tileOldParent(){
            return this.oldParent;
        }

        get tileParent() {
            return this.parent
        }
    }

    let sliderTiles = document.querySelectorAll(`.tile`);
    let tiles = [];
    sliderTiles .forEach(element =>{
        tiles.push(new Tile(element));
    });

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

    //const tiles = document.querySelectorAll(`#items div`);
    const targets = document.querySelectorAll(`.target`);

    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
        setTimeout(() => {
            event.target.classList.add('hide');

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
        //event.target.parentElement.style.zIndex = "";
    }

    function drop(event) {

        if (event.target.classList.contains("target") ){
            event.target.classList.remove('drag-over');

            // get the draggable element
            const id = event.dataTransfer.getData('text/plain');
            const draggable = document.getElementById(id);
            const tile = tiles.find(tile => tile.id === id);

            event.target.appendChild(draggable);
            event.target.style.zIndex = "1";
            draggable.classList.remove('hide');
            tile.moved();
        } else if (event.target.classList.contains("tile") && event.target.parentElement.id === "items"){
            event.target.classList.remove('drag-over');

            // get the draggable element
            const id = event.dataTransfer.getData('text/plain');
            const draggable = document.getElementById(id);
            const tile = tiles.find(tile => tile.id === id);

            event.target.parentElement.appendChild(draggable);
            event.target.style.zIndex = "1";
            draggable.classList.remove('hide');
            tile.moved();
            sort();
        }
    }

})();