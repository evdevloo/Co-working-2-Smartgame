import { game } from './board.js';

let pieces = null;
let currentDroppable = null;
let rotation = 0;
getPieces();

function getPieces() {
    pieces = document.querySelectorAll(`.card, div.tile `);

    pieces .forEach(piece =>{
        //piece.addEventListener('dragstart', dragStart);
        piece.addEventListener('mousedown', onmousedown);
        piece.ondragstart = function() { return false;};
    });
}

function onmousedown(event) {
    let shiftX = event.clientX - event.target.getBoundingClientRect().left;
    let shiftY = event.clientY - event.target.getBoundingClientRect().top;

    event.target.style.position = 'absolute';
    event.target.style.zIndex = 1000;

    document.body.append(event.target);

    if (event.target.classList.contains('tile')){
        let X = event.target.classList[1].charAt(2);
        let Y = event.target.classList[2].charAt(2);
        let piece = event.target.firstChild.alt;

        event.target.id = piece.charAt(5);
        event.target.className = "card";
        event.target.innerHTML = '';
        event.target.setAttribute('draggable', true);
        game.removePiece(X, Y)
        getPieces();
    }
    event.target.classList.add("dragging");

    moveAt(event.pageX, event.pageY);

    document.addEventListener('mousemove', onMouseMove);

    document.addEventListener('keypress', (event) => {
        let key = event.key;

        if (key === 'r'){
            console.log("hi")
            ++rotation;
            if (rotation === 4){
                rotation = 0;
            }
            document.querySelector('.dragging').style.transformOrigin = 'center';
            document.querySelector('.dragging').style.transform = `rotate(${rotation * 90}deg)`;
        }
    });

    event.target.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        event.target.style = '';
        event.target.classList.remove("dragging")
        if ( currentDroppable === null|| (!currentDroppable.classList.contains('droppable')) || currentDroppable.id === 'items') {
            document.querySelector('#items').appendChild(event.target);
            sort();

        } else if(currentDroppable.parentElement.id === 'grid') {
            currentDroppable.appendChild(event.target);
            let x =+currentDroppable.classList[1].charAt(2);
            let y =+ currentDroppable.classList[2].charAt(2);
            game.addPiece(event.target.id,x,y,0);
            getPieces();
        }
        event.target.onmouseup = null;
    };

    function moveAt(pageX, pageY) {
        event.target.style.left = pageX - shiftX + 'px';
        event.target.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);

        event.target.hidden = true;
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        event.target.hidden = false;

        if (!elemBelow) return;

        let droppableBelow = elemBelow.closest('.droppable');

        if (currentDroppable !== droppableBelow) {
            if (currentDroppable) { // null when we were not over a droppable before this event
            }
            currentDroppable = droppableBelow;
            if (currentDroppable) { // null if we're not coming over a droppable now

            }
        }


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
