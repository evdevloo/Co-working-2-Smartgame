import { resetSlider } from './itemBar.js';

// Initialize progress
if (!localStorage.getItem('horseAcademy_progress')) localStorage.setItem('horseAcademy_progress', "{}");

const grid = document.getElementById('grid');
const previousButton = document.getElementById('previousChallenge');
const nextButton = document.getElementById('nextChallenge');

/**
 * Initializes the last loaded level and loads the board from memory
 * 
 * @class HorseAcademy
 * @classdesc Game Class for the HorseAcademy game. Handles everything on the board
 */
export const game = new class HorseAcademy {
    rows = 4;
    cols = 5;

    #challenges = [
        { id: 1, difficulty: 'Starter', tiles: 'f', gate: 'x', solution: 'b47bcf64684dbed8' },
        { id: 2, difficulty: 'Starter', tiles: 'ae', gate: 't', solution: '8b25dd891d549090' },
        { id: 17, difficulty: 'Junior', tiles: 'dej', gate: 't', solution: '8e7e375e43cb1965' },
        { id: 18, difficulty: 'Junior', tiles: 'abcefj', gate: 'y', solution: '7ad39d6cbf19a677' },
        { id: 33, difficulty: 'Expert', tiles: 'adegij', gate: 't', solution: '' },
        { id: 34, difficulty: 'Expert', tiles: 'bcdefghij', gate: 'u', solution: '' },
        { id: 49, difficulty: 'Master', tiles: 'abcefghj', gate: 't', solution: '' },
        { id: 50, difficulty: 'Master', tiles: 'abdeghij', gate: 'x', solution: '' },
        { id: 63, difficulty: 'Master', tiles: 'bdefghij', gate: 'w', solution: '' },
        { id: 65, difficulty: 'Wizard', tiles: 'bdefgi', gate: 'none', solution: '' },
        { id: 66, difficulty: 'Wizard', tiles: 'acdefg', gate: 'none', solution: '' },
        { id: 80, difficulty: 'Wizard', tiles: 'abcdefhij', gate: 'none', solution: '' }
    ]
    challenges = this.#challenges.length;

    constructor(grid) {
        // Load stored level or initialize challenge 1
        this.newChallenge();
    }

    newChallenge(challengeIndex) {
        if (typeof challengeIndex === 'number') localStorage.setItem('horseAcademy_selectedChallenge', challengeIndex);
        else this.selectedChallenge = +localStorage.getItem('horseAcademy_selectedChallenge');
        if (typeof this.selectedChallenge !== 'number') this.selectedChallenge = 0;

        localStorage.setItem('horseAcademy_selectedChallenge', this.selectedChallenge);
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

        // update level navigation arrows
        previousButton.removeAttribute('disabled');
        nextButton.removeAttribute('disabled');

        if (this.selectedChallenge <= 0) previousButton.setAttribute('disabled', '');
        if (this.selectedChallenge >= this.challenges - 1) nextButton.setAttribute('disabled', '');

        // load the level
        this.loadProgress();

        // reset piece selection bar
        try {
            resetSlider(this.challenge.tiles);

        } catch (err) {
            console.log(err);
        }
    }

    resetProgress() {
        // create 2d array
        this.board = [...Array(this.cols)].fill()
            .map(col => [...Array(this.rows)].fill()
                .map(cell => null));

        this.saveProgress();
        this.renderBoard();
    }

    loadProgress() {
        // Retrieve boardstate
        this.board = JSON.parse(localStorage.getItem('horseAcademy_progress'))[this.challenge.id]?.board ?? {};
        this.progress = JSON.parse(localStorage.getItem('horseAcademy_progress'));

        if (Object.keys(this.board).length === 0) this.resetProgress();
        else this.renderBoard();
    }

    saveProgress() {
        this.progress = JSON.parse(localStorage.getItem('horseAcademy_progress'));

        this.progress[this.challenge.id] = {
            board: this.board,
            completed: this.progress[this.challenge.id]?.completed || this.solved()
        };

        localStorage.setItem('horseAcademy_progress', JSON.stringify(this.progress));
    }

    renderBoard() {
        // reset the grid
        grid.innerHTML = '';

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
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

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const cell = this.board[x][y];

                if (!cell) {
                    if (this.getPiece(x, y)) cells[x + y * this.cols].remove();

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
                cells[x + y * this.cols].replaceWith(piece);
            }
        }

        // FOR DEBUG ONLY! Change background color to check if correct
        /*document.body.style.backgroundColor = 'white';

        if (this.solved()) document.body.style.backgroundColor = 'lime';
        else if (this.progress[this.challenge.id].completed) document.body.style.backgroundColor = 'aqua';*/
    }

    addPiece(name, x, y, rotation) {
        if (rotation === 2) x--;
        if (rotation === 3) y--;

        if (x < 0 || y < 0 || rotation % 2 === 0 && x >= this.cols - 1 || rotation % 2 && y >= this.rows - 1) {
            const err = new Error('Cannot place tile out of board');
            //console.error(err);
            return err;
        }

        if (this.getPiece(x, y) || this.getPiece(x + (rotation === 0), y + (rotation === 1))) {
            const err = new Error('Cannot place tile on another tile');
            //console.error(err);
            return err;
        }
        this.board[x][y] = { name, rotation };
        this.saveProgress();
        this.renderBoard();
    }

    getPiece(x, y) {
        if (this.board[x][y]) return this.board[x][y];
        if (x - 1 >= 0 && this.board[x - 1][y]?.rotation % 2 === 0) return this.board[x - 1][y];
        if (y - 1 >= 0 && this.board[x][y - 1]?.rotation % 2 === 1) return this.board[x][y - 1];
    }

    removePiece(x, y) {
        let removedPiece = this.getPiece(x, y);
        this.board[x][y] = null;
        this.saveProgress();
        this.renderBoard();

        return removedPiece;
    }

    solved() {
        return this.getBoardHash() === this.challenge.solution;
    }

    getBoardHash() {
        // Account for symmetric pieces
        let board = this.board.map(row => [...row]);

        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                let cell = board[x][y];

                if (cell && 'abc'.includes(cell.name)) {
                    board[x][y].rotation = cell.rotation === 2 ? 0 : cell.rotation === 3 ? 1 : cell.rotation;
                }
            }
        }
        return (CryptoJS.SHA1(JSON.stringify(board)) + '').slice(0, 16);
    }
}

// Challenge navitation
previousButton.addEventListener('click', function () {
    if (game.selectedChallenge > 0) game.newChallenge(--game.selectedChallenge);
});

nextButton.addEventListener('click', function () {
    if (game.selectedChallenge < game.challenges - 1) game.newChallenge(++game.selectedChallenge);
});
