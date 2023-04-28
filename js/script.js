'use strict';

(function() {
    const grid = document.getElementById('grid');
    const tiles = document.getElementById('tiles');

    const challenges = {
        1: {tiles: 'f', gate: 'X', solution: ''},
        2: {tiles: 'ae', gate: 'T', solution: '[[,,{"n":"e","r":3},],[,,,{"n":"a","r":0}],[,,,],[,,,],[,,,]]', gate: 'T'},
        63: {tiles: 'bdefghij', gate: 'W', solution: '[[,,,],[,,,],[,,,{"n":"b","r":0}],[,,{"n":"b","r":0},],[,,,]]'}
    };

    class HorseAcademy {

        constructor(rows, cols) {
            this.rows = rows;
            this.cols = cols;
            this.newBoard(1);
        }
        
        newBoard(challenge) {
            // create 2d array
            this.board = [...Array(this.cols)].fill()
                .map(col => [...Array(this.rows)].fill()
                .map(cell => null));
            
            this.solution = challenges[challenge].solution;

            // test code
            this.board[0][2] = {name: 'e', rotation: 3};
            this.board[1][3] = {name: 'a', rotation: 0};
            // test code end

            this.renderBoard();
        }

        renderBoard() {
            // clear all tiles
            tiles.innerHTML = '';

            // convert all tiles to html elements and put them on the board
            for (let col = 0; col < this.cols; col++) {
                for (let row = 0; row < this.rows; row++) {
                    const tile = this.board[col][row];

                    if (!tile) continue;

                    const img = document.createElement('img');
                    img.src = `img/tiles/${tile.name}.png`;
                    img.alt = 'tile ' + tile.name;

                    const div = document.createElement('div');
                    div.appendChild(img);

                    // use css classes to position the tile on the grid
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

        solved() {
            return JSON.stringify(this.board)
                .replaceAll('null', '')
                .replaceAll('name', 'n')
                .replaceAll('rotation', 'r') === this.solution;
        }
    }

    const game = new HorseAcademy(4, 5);
    game.newBoard(2);
    console.log(game.solved()); // true
})();