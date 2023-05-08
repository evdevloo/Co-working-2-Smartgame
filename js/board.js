// Staat in commentaar zodat alles in console gedebugged kan worden - Kyle

//'use strict';

//function() {
    const grid = document.getElementById('grid');
    const tiles = document.getElementById('tiles');
    
    // Game Class
    class HorseAcademy {
        #rows = 4;
        #cols = 5;

        #challenges = [
            {id: 1, difficulty: 'Starter', tiles: 'f', gate: 'x', solution: 'b47bcf64684dbed8'},
            {id: 2, difficulty: 'Starter', tiles: 'ae', gate: 't', solution: '8b25dd891d549090'},
            {id: 17, difficulty: 'Junior', tiles: 'dej', gate: 't', solution: '8e7e375e43cb1965'},
            {id: 18, difficulty: 'Junior', tiles: 'abcefj', gate: 'y', solution: '7ad39d6cbf19a677'},
            {id: 33, difficulty: 'Expert', tiles: 'adegij', gate: 't', solution: ''},
            {id: 34, difficulty: 'Expert', tiles: 'bcdefgij', gate: 'u', solution: ''},
            {id: 49, difficulty: 'Master', tiles: 'abcefghj', gate: 't', solution: ''},
            {id: 50, difficulty: 'Master', tiles: 'abdeghij', gate: 'x', solution: ''},
            {id: 63, difficulty: 'Master', tiles: 'bdefghij', gate: 'w', solution: ''},
            {id: 65, difficulty: 'Wizard', tiles: 'bdefgi', gate: 'none', solution: ''},
            {id: 66, difficulty: 'Wizard', tiles: 'acdefg', gate: 'none', solution: ''},
            {id: 80, difficulty: 'Wizard', tiles: 'abcdefhij', gate: 'none', solution: ''}
        ]
        challenges = this.#challenges.length;

        #progress = {
            18: {board: '[[null,null,{"name":"j","rotation":3},null],[null,{"name":"b","rotation":1},null,{"name":"a","rotation":0}],[null,{"name":"c","rotation":1},null,null],[null,null,{"name":"f","rotation":0},{"name":"e","rotation":2}],[null,null,null,null]]', completed: false}
        };

        constructor() {
            this.newChallenge();
        }
        
        newChallenge(challengeIndex) {
            this.selectedChallenge = challengeIndex || 0;
            this.challenge = this.#challenges[this.selectedChallenge];

            // update title
            document.querySelector('.challenge-heading h1').innerText = 'Challenge ' + (this.selectedChallenge + 1);

            // update subtitle
            const subtitle = document.querySelector('.challenge-heading h2');
            subtitle.innerText = this.challenge.difficulty;
            subtitle.className = this.challenge.difficulty.toLowerCase();

            // update challenge description
            const description = document.querySelector('.challenge-description img');
            description.src = `img/challenges/challenge${this.challenge.id}.png`;
            description.alt = 'challenge diagram ' + (this.selectedChallenge + 1);

            // update finish position
            document.querySelector('#fence .finish').className = 'finish ' + this.challenge.gate;

            this.loadProgress();
        }

        resetProgress() {
            // create 2d array
            this.board = [...Array(this.#cols)].fill()
                .map(col => [...Array(this.#rows)].fill()
                .map(cell => null));

            this.saveProgress();
        }

        loadProgress() {
            this.board = JSON.parse(this.#progress[this.challenge.id]?.board ?? '{}');

            if (Object.keys(this.board).length === 0) this.resetProgress();

            this.renderBoard();
        }

        saveProgress() {
            this.#progress[this.challenge.id] = {
                board: JSON.stringify(this.board),
                completed: this.#progress[this.challenge.id]?.completed || this.solved()
            };
        }

        renderBoard() {
            // clear all tiles
            tiles.innerHTML = '';

            // convert all tiles to html elements and put them on the board
            for (let x = 0; x < this.#cols; x++) {
                for (let y = 0; y < this.#rows; y++) {
                    const tile = this.board[x][y];

                    if (!tile) continue;

                    const img = document.createElement('img');
                    img.src = `img/tiles/${tile.name}.png`;
                    img.alt = 'tile ' + tile.name;

                    const div = document.createElement('div');
                    div.appendChild(img);

                    // use css classes to position the tile on the grid
                    div.classList.add(
                        'tile',
                        'x-' + x,
                        'y-' + y,
                        'rotation-' + tile.rotation
                    );

                    tiles.appendChild(div);
                }
            }
        }

        addPiece(name, x, y, rotation) {
            this.board[x][y] = {name, rotation};
            this.renderBoard();
        }

        removePiece(x, y) {
            this.board[x][y] = null;
            this.renderBoard();
        }

        solved() {
            return this.getBoardHash() === this.challenge.solution;
        }

        getBoardHash() {
            // Account for symmetric pieces
            let board = this.board.map(row => row.slice());

            for (let x = 0; x < this.#cols; x++) {
                for (let y = 0; y < this.#rows; y++) {
                    let tile = board[x][y];

                    if (tile && "abci".includes(tile.name)) {
                        board[x][y].rotation = tile.rotation === 2 ? 0 : tile.rotation === 3 ? 1 : tile.rotation;
                    }
                }
            }
            return (CryptoJS.SHA1(JSON.stringify(board)) + '').slice(0, 16);
        }
    }

    const game = new HorseAcademy();

    // Challenge Navigation
    document.getElementById('previousChallenge').addEventListener('click', function() {
        if (game.selectedChallenge > 0) game.newChallenge(--game.selectedChallenge);
        if (game.selectedChallenge <= 0) this.setAttribute('disabled', '');

        this.nextElementSibling.removeAttribute('disabled');
    });

    document.getElementById('nextChallenge').addEventListener('click', function() {
        if (game.selectedChallenge < game.challenges - 1) game.newChallenge(++game.selectedChallenge);
        if (game.selectedChallenge >= game.challenges - 1) this.setAttribute('disabled', '');

        this.previousElementSibling.removeAttribute('disabled');
    });
//})();