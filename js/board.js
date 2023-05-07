// Staat in commentaar zodat alles in console gedebugged kan worden - Kyle

//'use strict';

//function() {
    const grid = document.getElementById('grid');
    const tiles = document.getElementById('tiles');

    // Challenge Navigation
    document.getElementById('previousChallenge').addEventListener('click', function() {
        if (game.selectedChallenge > 1) game.newChallenge(--game.selectedChallenge);
        if (game.selectedChallenge <= 1) this.style.filter = 'opacity(50%)';

        this.nextElementSibling.style.filter = 'opacity(1)';
    });

    document.getElementById('nextChallenge').addEventListener('click', function() {
        if (game.selectedChallenge < 80) game.newChallenge(++game.selectedChallenge);
        if (game.selectedChallenge >= 80) this.style.filter = 'opacity(50%)';

        this.previousElementSibling.style.filter = 'opacity(1)';
    });
    
    // Game Class
    class HorseAcademy {
        rows = 4;
        cols = 5;

        #challenges = {
            1: {difficulty: 'Starter', tiles: 'f', gate: 'x', solution: '32b0f3913ab4814e'},
            2: {difficulty: 'Starter', tiles: 'ae', gate: 't', solution: '9844f81e1408f6ec'},
            63: {difficulty: 'Master', tiles: 'bdefghij', gate: 'w', solution: ''},
            80: {difficulty: 'Wizard', tiles: 'abcdefhij', gate: 't', solution: ''}
        }
        selectedChallenge = 1;

        constructor() {
            this.newChallenge(this.selectedChallenge);
        }
        
        newChallenge(challengeNumber) {
            const challenge = this.#challenges[challengeNumber];

            // update title
            document.querySelector('.challenge-heading h1').innerText = 'Challenge ' + this.selectedChallenge;

            if (challenge) {
                // update subtitle
                const subtitle = document.querySelector('.challenge-heading h2');
                subtitle.innerText = challenge.difficulty;
                subtitle.className = challenge.difficulty.toLowerCase();

                // update challenge description
                const img = document.querySelector('.challenge-description img');
                img.src = `img/challenges/solution${this.selectedChallenge}.png`;
                img.alt = 'challenge diagram ' + this.selectedChallenge;

                // reset all gates
                document.querySelectorAll('#grid span').forEach(el => el.style.backgroundColor = '');

                // set gate to red
                document.querySelector('#grid #gate-' + challenge.gate).style.backgroundColor = 'red';

                this.solution = challenge.solution;
            }
            this.resetBoard();
        }

        resetBoard() {
            // create 2d array
            this.board = [...Array(this.cols)].fill()
                .map(col => [...Array(this.rows)].fill()
                .map(cell => null));
            
            // test code
            this.board[3][0] = {name: 'f', rotation: 0};
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
                        'x-' + row,
                        'y-' + col,
                        'rotation-' + tile.rotation
                    );

                    tiles.appendChild(div);
                }
            }
        }

        solved() {
            return this.getBoardHash() === this.solution;
        }

        getBoardHash() {
            return (CryptoJS.SHA1(JSON.stringify(this.board)) + '').slice(0, 16);
        }
    }

    // Program
    const game = new HorseAcademy();
//})();