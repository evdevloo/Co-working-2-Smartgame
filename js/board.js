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
        // reset the grid
        grid.innerHTML = '';

        for (let y = 0; y < this.#rows; y++) {
            for (let x = 0; x < this.#cols; x++) {
                let div = document.createElement('div');

                div.classList.add(
                    'cell',
                    'x-' + x,
                    'y-' + y,
                    'droppable'
                );
                grid.appendChild(div);
            }
        }

        // convert all tiles to html elements and put them on the board  
        const cells = grid.querySelectorAll('div');

        for (let y = 0; y < this.#rows; y++) {
            for (let x = 0; x < this.#cols; x++) {
                const cell = this.board[x][y];

                if (!cell) {
                    if (this.getPiece(x, y)) cells[x + y * this.#cols].remove();

                    continue;
                }

                const img = document.createElement('img');
                img.src = `img/tiles/${cell.name}.png`;
                img.alt = 'tile ' + cell.name;

                const piece = document.createElement('div');
                piece.appendChild(img);

                // use css classes to position the tile on the grid
                piece.classList.add(
                    'tile',
                    'x-' + x,
                    'y-' + y,
                    'rotation-' + cell.rotation
                );
                piece.setAttribute('draggable', true);
                cells[x + y * this.#cols].replaceWith(piece);
            }
        }
    }

    addPiece(name, x, y, rotation) {
        if (x < 0 || y < 0 || rotation % 2 === 0 && x >= this.#cols - 1 || rotation % 2 && y >= this.#rows - 1) {
            const err = new Error('Cannot place tile out of board');
            console.error(err);
            return err;
        }

        if (this.getPiece(x, y)) {
            const err = new Error('Cannot place tile on another tile');
            console.error(err);
            return err;
        }
        this.board[x][y] = {name, rotation};
        this.renderBoard();
    }

    getPiece(x, y) {
        if (this.board[x][y]) return this.board[x][y];
        if (x - 1 > 0 && this.board[x - 1][y]?.rotation % 2 === 0) return this.board[x - 1][y];
        if (y - 1 > 0 && this.board[x][y - 1]?.rotation % 2 === 1) return this.board[x][y - 1];
        return false;
    }

    removePiece(x, y) {
        this.board[x][y] = null;
        this.renderBoard();

        return this.getPiece(x, y);
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