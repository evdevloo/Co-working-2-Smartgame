// Staat in commentaar zodat alles in console gedebugged kan worden - Kyle

//'use strict';

//function() {
    const grid = document.getElementById('grid');
    const tiles = document.getElementById('tiles');

    // Challenge Navigation
    document.getElementById('previousChallenge').addEventListener('click', function() {
        if (game.selectedChallenge > 1) game.newChallenge(--game.selectedChallenge);
        if (game.selectedChallenge <= 1) this.opacity = '.5';

        this.nextElementSibling.opacity = '1';
    });

    document.getElementById('nextChallenge').addEventListener('click', function() {
        if (game.selectedChallenge < game.challenges) game.newChallenge(++game.selectedChallenge);
        if (game.selectedChallenge >= game.challenges) this.opacity = '.5';

        this.previousElementSibling.opacity = '1';
    });
    
    // Game Class
    class HorseAcademy {
        rows = 4;
        cols = 5;

        #challenges = [
            {id: 1, difficulty: 'Starter', tiles: 'f', gate: 'x', solution: 'b47bcf64684dbed8'},
            {id: 2, difficulty: 'Starter', tiles: 'ae', gate: 't', solution: '8b25dd891d549090'},
            {id: 17, difficulty: 'Junior', tiles: 'dej', gate: 't', solution: '8e7e375e43cb1965'},
            {id: 18, difficulty: 'Junior', tiles: 'abcefj', gate: 'x', solution: '7ad39d6cbf19a677'},
            {id: 33, difficulty: 'Expert', tiles: 'adegij', gate: 't', solution: ''},
            {id: 34, difficulty: 'Expert', tiles: 'bcdefgij', gate: 'u', solution: ''},
            {id: 49, difficulty: 'Master', tiles: 'abcefghj', gate: 't', solution: ''},
            {id: 50, difficulty: 'Master', tiles: 'abdeghij', gate: 'x', solution: ''},
            {id: 63, difficulty: 'Master', tiles: 'bdefghij', gate: 'w', solution: ''},
            {id: 65, difficulty: 'Wizard', tiles: 'bdefgi', gate: 't', solution: ''},
            {id: 66, difficulty: 'Wizard', tiles: 'acdefg', gate: 'u', solution: ''},
            {id: 80, difficulty: 'Wizard', tiles: 'abcdefhij', gate: 't', solution: ''}
        ]
        challenges = this.#challenges.length;
        selectedChallenge = 1;

        constructor() {
            this.newChallenge(this.selectedChallenge);
        }
        
        newChallenge(challengeNumber) {
            const challenge = this.#challenges[challengeNumber - 1];

            // update title
            document.querySelector('.challenge-heading h1').innerText = 'Challenge ' + this.selectedChallenge;

            // update subtitle
            const subtitle = document.querySelector('.challenge-heading h2');
            subtitle.innerText = challenge.difficulty;
            subtitle.className = challenge.difficulty.toLowerCase();

            // update challenge description
            const img = document.querySelector('.challenge-description img');
            img.src = `img/challenges/challenge${challenge.id}.png`;
            img.alt = 'challenge diagram ' + this.selectedChallenge;

            // reset all gates
            document.querySelectorAll('#grid span').forEach(el => el.style.backgroundColor = '');

            // set gate to red
            document.querySelector('#grid #gate-' + challenge.gate).style.backgroundColor = 'red';

            this.solution = challenge.solution;
            this.resetBoard();
        }

        resetBoard() {
            // create 2d array
            this.board = [...Array(this.cols)].fill()
                .map(col => [...Array(this.rows)].fill()
                .map(cell => null));
            
            // Insert pieces manually
            this.board[1][3] = {name: 'a', rotation: 0};
            this.board[1][1] = {name: 'b', rotation: 1};
            this.board[2][1] = {name: 'c', rotation: 1};
            this.board[3][3] = {name: 'e', rotation: 2};
            this.board[3][2] = {name: 'f', rotation: 0};
            this.board[0][2] = {name: 'j', rotation: 3};

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
                        'x-' + col,
                        'y-' + row,
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
            // Account for symmetric pieces
            let board = this.board.map(row => row.slice());

            for (let col = 0; col < this.cols; col++) {
                for (let row = 0; row < this.rows; row++) {
                    let tile = board[col][row];

                    if (tile && "abci".includes(tile.name)) {
                        board[col][row].rotation = tile.rotation === 2 ? 0 : tile.rotation === 3 ? 1 : tile.rotation;
                    }
                }
            }
            return (CryptoJS.SHA1(JSON.stringify(board)) + '').slice(0, 16);
        }
    }

    // Program
    const game = new HorseAcademy();
//})();