'use strict';

(function() {
    const grid = document.getElementById('grid');
    const tiles = document.getElementById('tiles');

    class HorseAcademy {
        constructor(rows, cols) {
            this.rows = rows;
            this.cols = cols;
            this.newBoard();

            // test code
            this.board[3][2] = {name: 'b', rotation: 0};
            this.renderBoard();
        }
        
        newBoard() {
            this.board = [...Array(this.cols)].fill()
                .map(col => [...Array(this.rows)].fill()
                .map(cell => null));
        }

        renderBoard() {
            tiles.innerHTML = '';

            for (let col = 0; col < this.cols; col++) {
                for (let row = 0; row < this.rows; row++) {
                    const tile = this.board[col][row];

                    if (!tile) continue;

                    console.log(tile);

                    const img = document.createElement('img');
                    img.src = `./img/tiles/${tile.name}.png`;
                    img.alt = 'tile ' + tile.name;

                    const div = document.createElement('div');
                    div.appendChild(img);

                    div.classList.add(
                        'tile',
                        'tile-' + tile.name,
                        'rotation-' + tile.rotation,
                        'x-' + row,
                        'y-' + col
                    );

                    tiles.appendChild(div);
                }
            }
        }
    }

    const game = new HorseAcademy(4, 5);
})();