const grid = document.getElementById('grid');

// Game Class
export const game = new class HorseAcademy {
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

    constructor(grid) {
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
        // reset all cells
        grid.innerHTML = '';

        for (let cell = 0; cell < this.#cols * this.#rows; cell++) {
            grid.appendChild(document.createElement('div'));
        }

        // convert all tiles to html elements and put them on the board
        let tiles = 0;

        for (let x = 0; x < this.#cols; x++) {
            for (let y = 0; y < this.#rows; y++) {
                const cell = this.board[x][y];

                if (!cell) continue;

                const img = document.createElement('img');
                img.src = `img/tiles/${cell.name}.png`;
                img.alt = 'tile ' + cell.name;

                const tile = document.createElement('div');
                tile.appendChild(img);

                // use css classes to position the tile on the grid
                tile.classList.add(
                    'tile',
                    'x-' + x,
                    'y-' + y,
                    'rotation-' + cell.rotation
                );
                const cells = grid.querySelectorAll('div');
                cells[x + y * this.#cols - tiles++].replaceWith(tile);
                cells[x + y * this.#cols + 1 - tiles].remove();
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
                let cell = board[x][y];

                if (cell && "abci".includes(cell.name)) {
                    board[x][y].rotation = cell.rotation === 2 ? 0 : cell.rotation === 3 ? 1 : cell.rotation;
                }
            }
        }
        return (CryptoJS.SHA1(JSON.stringify(board)) + '').slice(0, 16);
    }
}

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