import { game } from './board.js';

let pieces = null;
let currentDroppable = null;
let rotation = 0;
//let tiles_challenge;

getPieces();
deleteDuplicates();

function getPieces() {
    pieces = document.querySelectorAll(`.card, div.tile `);

    pieces.forEach(piece => {
        piece.addEventListener('mousedown', onmousedown);

        piece.ondragstart = false;
    });
}
function onmousedown(event) {
    const piece = event.target;

    piece.style.position = 'absolute';
    piece.style.zIndex = 99;

    if (piece.classList.contains('tile')) {
        let X = piece.classList[1].slice(-1);
        let Y = piece.classList[2].slice(-1);
        rotation = piece.classList[3].slice(-1);
        piece.id = piece.firstChild.alt.slice(-1);
        piece.className = 'card';
        piece.innerHTML = '';
        piece.style.transform = `rotate(${rotation * 90}deg)`;
        game.removePiece(X, Y);
        getPieces();
    }

    document.body.append(piece);
    piece.classList.add("dragging");

    moveAt(event.pageX, event.pageY);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keypress', rotating)

    function moveAt(pageX, pageY) {
        piece.style.left = pageX - 50 + 'px';
        piece.style.top = pageY - 50 + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    function onMouseUp(event) {

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('keypress', rotating)

        piece.hidden = true;
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        piece.hidden = false;

        if (!elemBelow) return;

        let droppableBelow = elemBelow.closest('.droppable');

        if (currentDroppable !== droppableBelow) currentDroppable = droppableBelow;

        piece.style = '';
        piece.classList.remove('dragging')

        if (currentDroppable === null || (!currentDroppable.classList.contains('droppable')) || currentDroppable.id === 'items') {
            document.querySelector('#items').appendChild(piece);

        } else if (currentDroppable.parentElement.id === 'grid') {
            let x = +currentDroppable.classList[1].slice(-1);
            let y = +currentDroppable.classList[2].slice(-1);

            if (game.addPiece(piece.id, x, y, rotation % 4) === undefined) piece.remove();
            else document.querySelector('#items').appendChild(piece);
        }

        //resetSlider(tiles_challenge);
        rotation = 0;
        getPieces();
        document.removeEventListener('mouseup', onMouseUp);
    }

}

function rotating(event) {
    if (event.key === 'r') {
        ++rotation;
        document.querySelector('.dragging').style.transform = `rotate(${rotation * 90}deg)`;
    }
}

function deleteDuplicates() {
    let copies = Object.values(pieces).filter(piece => piece.classList.contains('tile'));

    copies.forEach(piece => {
        let id = piece.firstChild.alt.slice(-1);
        document.querySelector(`#${id}`).remove();
    })
}

export function resetSlider(tiles) {
    //tiles_challenge = tiles;

    let slider = document.querySelector('#items');
    slider.innerHTML = '';

    [...tiles].forEach(tile => {
        const div = document.createElement('div');
        div.id = tile;
        div.className = 'card';
        slider.appendChild(div);
    })
    getPieces();
    deleteDuplicates();
}
