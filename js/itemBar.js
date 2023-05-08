'use strict';
(function(){

    let dragged;

    const tiles = document.getElementsByClassName('draggable');
    const target = document.getElementById("droptarget");

    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];

        // plaats een eventListener op de knop
        tile.addEventListener("drag", () => {
            console.log("dragging");
        });

        tile.addEventListener("dragstart", (event) => {
            // store a ref. on the dragged elem
            dragged = event.target;
            // make it half transparent
            event.target.classList.add("dragging");
        });

        tile.addEventListener("dragend", (event) => {
            // reset the transparency
            event.target.classList.remove("dragging");
        });
    }


    target.addEventListener(
        "dragover",
        (event) => {
            // prevent default to allow drop
            event.preventDefault();
        },
        false
    );

    target.addEventListener("dragenter", (event) => {
        // highlight potential drop target when the draggable element enters it
        if (event.target.classList.contains("dropzone")) {
            event.target.classList.add("dragover");
        }
    });

    target.addEventListener("dragleave", (event) => {
        // reset background of potential drop target when the draggable element leaves it
        if (event.target.classList.contains("dropzone")) {
            event.target.classList.remove("dragover");
        }
    });

    target.addEventListener("drop", (event) => {
        // prevent default action (open as link for some elements)
        event.preventDefault();
        // move dragged element to the selected drop target
        if (event.target.classList.contains("dropzone")) {
            event.target.classList.remove("dragover");
            event.target.appendChild(dragged);
        }
    });
})();