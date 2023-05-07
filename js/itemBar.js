'use strict';
(function(){

    let dragged;

    const source = document.querySelector('.draggable');

    source.addEventListener("drag", (event) => {
        console.log("dragging");
    });

    source.addEventListener("dragstart", (event) => {
        // store a ref. on the dragged elem
        dragged = event.target;
        // make it half transparent
        event.target.classList.add("dragging");
    });

    source.addEventListener("dragend", (event) => {
        // reset the transparency
        event.target.classList.remove("dragging");
    });

})();