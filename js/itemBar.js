import { game } from './board.js';

let pieces = null;
let currentDroppable = null;
let rotation = 0;

getPieces();
deleteDuplicates();

document.addEventListener('keypress', event => {
    if (event.key === 'r') {
        if (++rotation === 4) rotation = 0;

        //document.querySelector('.dragging').style.transformOrigin = 'center';
        document.querySelector('.dragging').style.transform = `rotate(${rotation * 90}deg)`;
    }
});

function getPieces() {
    pieces = document.querySelectorAll('.card, div.tile');

    pieces.forEach(piece => {
        //piece.addEventListener('dragstart', dragStart);
        piece.addEventListener('mousedown', onmousedown);

        // Kyle - deze lijn word niet gebruikt?
        //piece.ondragstart = function () { return false; };
        // en hoezo niet gewoon dit
        //piece.ondragstart = false;
    });
}

function onmousedown(event) {
    const piece = event.target;

    let rect = piece.getBoundingClientRect();
    let shiftX = event.clientX - rect.left;
    let shiftY = event.clientY - rect.top;

    piece.style.position = 'absolute';
    piece.style.zIndex = 99;

    document.body.append(piece);

    if (piece.classList.contains('tile')) {
        rotation = piece.classList[3].slice(-1);

        piece.id = piece.firstChild.alt.slice(-1);
        piece.className = 'card';
        piece.innerHTML = '';
        piece.setAttribute('draggable', 'true');
        piece.style.transform = `rotate(${rotation * 90}deg)`;
        game.removePiece(piece.classList[1].slice(-1), piece.classList[2].slice(-1));
        getPieces();
    }
    piece.classList.add("dragging");

    moveAt(event.pageX, event.pageY);

    document.addEventListener('mousemove', onMouseMove);

    piece.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        piece.style = '';
        piece.classList.remove("dragging");

        if (currentDroppable === null || !currentDroppable.classList.contains('droppable') || currentDroppable.id === 'items') {
            document.querySelector('#items').appendChild(piece);
            //sort();
            resetSlider();

        } else if (currentDroppable.parentElement.id === 'grid') { // itemBar.js:69 Uncaught TypeError: Cannot read properties of null (reading 'id')
            let x = +currentDroppable.classList[1].slice(-1);
            let y = + currentDroppable.classList[2].slice(-1);

            if (game.addPiece(piece.id, x, y, rotation) !== undefined) {
                piece.remove();

            } else {
                document.querySelector('#items').appendChild(piece);
                resetSlider();
            }
        }
        rotation = 0;
        getPieces();
        piece.onmouseup = null;
    };

    function moveAt(pageX, pageY) {
        piece.style.left = pageX - shiftX + 'px';
        piece.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);

        piece.hidden = true;
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        piece.hidden = false;

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

/*
function sort() {

    let tile = document.querySelector(`#items`);
    let tileSort = [...document.querySelectorAll(`#items div`)];

    tileSort.sort(function(a, b){
        return (a.id > b.id) ? 1 : (a.id < b.id) ? -1 : 0;});
    for(var i = 0, l = tileSort.length; i < l; i++) {
        tile.appendChild(tileSort[i]);
    }
}
 */

function deleteDuplicates() {
    console.log(pieces);
    let copies = Object.values(pieces).filter(piece => piece.classList.contains('tile'));

    copies.forEach(piece => {
        let id = piece.firstChild.alt.slice(-1);
        document.querySelector('#' + id).remove();
    })
}

export function resetSlider() {
    let tiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    let slider = document.querySelector('#items');
    slider.innerHTML = '';

    tiles.forEach(tile => {
        const div = document.createElement('div');
        div.id = tile;
        div.className = 'card';
        div.setAttribute('draggable', 'true');
        slider.appendChild(div);
    })
    getPieces();
    deleteDuplicates();
}
