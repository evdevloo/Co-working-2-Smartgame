import { resetSlider } from './itemBar.js';

// Initialize progress
let progress = localStorage.getItem('horseAcademy_progress');

if (!progress) localStorage.setItem('horseAcademy_progress', "{}");
else if (progress.constructor === Object) localStorage.setItem('horseAcademy_progress', "{}");

//delete progress;

const grid = document.getElementById('grid');
const previousButton = document.getElementById('previousChallenge');
const nextButton = document.getElementById('nextChallenge');

/**
 * Initializes the last loaded level and loads the board from memory
 * 
 * @class HorseAcademy
 * @classdesc Game Class for the HorseAcademy game. Handles everything on the board
 */
export class HorseAcademy {
    static challenges = [
        { id: 1, difficulty: 'Starter', tiles: 'f', gate: 'x', solution: 'b47bcf64684dbed8' },
        { id: 2, difficulty: 'Starter', tiles: 'ae', gate: 't', solution: '8b25dd891d549090' },
        { id: 17, difficulty: 'Junior', tiles: 'dej', gate: 't', solution: '8e7e375e43cb1965' },
        { id: 18, difficulty: 'Junior', tiles: 'abcefj', gate: 'y', solution: '7ad39d6cbf19a677' },
        { id: 33, difficulty: 'Expert', tiles: 'adegij', gate: 't', solution: '5357a15732b44058' },
        { id: 34, difficulty: 'Expert', tiles: 'bcdefghij', gate: 'u', solution: '90198111396d359a' },
        { id: 49, difficulty: 'Master', tiles: 'abcefghj', gate: 't', solution: '1f0367ea681eed22' },
        { id: 50, difficulty: 'Master', tiles: 'abdeghij', gate: 'x', solution: '9b612b333b6f0969' },
        { id: 63, difficulty: 'Master', tiles: 'bdefghij', gate: 'w', solution: '14328115a11f1e0e' },
        { id: 65, difficulty: 'Wizard', tiles: 'bdefgi', gate: 'none', solution: 'e7885f11ea2fe2c7' },
        { id: 66, difficulty: 'Wizard', tiles: 'acdefg', gate: 'none', solution: '3b0ce17ee27e2313' },
        { id: 80, difficulty: 'Wizard', tiles: 'abcdefhij', gate: 'none', solution: '5e1ae1542ee01f21' }
    ]

    rows = 4;
    cols = 5;

    constructor(grid) {
        // Load stored level or initialize on challenge 1
        this.newChallenge();
    }

    newChallenge(challengeIndex) {
        if (!Number.isInteger(this.selectedChallenge)) this.selectedChallenge = +localStorage.getItem('horseAcademy_selectedChallenge');
        else this.selectedChallenge = Number.isInteger(+challengeIndex) ? +challengeIndex : 0;

        localStorage.setItem('horseAcademy_selectedChallenge', this.selectedChallenge);
        this.challenge = HorseAcademy.challenges[this.selectedChallenge];

        // update title
        document.querySelector('.challenge-heading h1').innerText = 'Challenge ' + this.challenge.id;

        // update subtitle
        const subtitle = document.querySelector('.challenge-heading h2');
        subtitle.innerText = this.challenge.difficulty;
        subtitle.className = this.challenge.difficulty.toLowerCase();

        // update challenge description
        const description = document.querySelector('.challenge-description img');
        description.src = `img/challenges/challenge${this.challenge.id}.png`;
        description.alt = 'challenge diagram ' + this.challenge.id;

        // update finish position
        document.querySelector('#fence .finish').className = 'finish ' + this.challenge.gate;

        // update level navigation arrows
        previousButton.removeAttribute('disabled');
        nextButton.removeAttribute('disabled');

        if (this.selectedChallenge <= 0) previousButton.setAttribute('disabled', '');
        if (this.selectedChallenge >= HorseAcademy.challenges.length - 1) nextButton.setAttribute('disabled', '');

        // load the level
        this.loadProgress();

        // reset piece selection bar
        try {
            resetSlider(this.challenge.tiles);

        } catch (err) {
            console.log(err);
        }
    }

    giveupChallenge() {
        this.progress = JSON.parse(localStorage.getItem('horseAcademy_progress'));
        if (!this.progress[this.challenge.id].completed) this.progress[this.challenge.id].givenUp = true;
        localStorage.setItem('horseAcademy_progress', JSON.stringify(this.progress));

        this.updateSolved();
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
            completed: this.progress[this.challenge.id]?.completed || this.solved(),
            givenUp: this.progress[this.challenge.id]?.givenUp ?? false
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
                    'y-' + y
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
        this.updateSolved();
    }

    updateSolved() {
        const challengeSolved = document.querySelector('.challenge-solved');
        const challengeSolvedText = challengeSolved.querySelector('span:first-child');

        if (this.solved()) {
            challengeSolvedText.innerText = 'Solved';
            challengeSolved.classList.add('solved');
            challengeSolved.classList.remove('solved-before', 'given-up');

        } else if (this.progress[this.challenge.id].completed) {
            challengeSolvedText.innerText = 'Solved Before';
            challengeSolved.classList.add('solved-before');
            challengeSolved.classList.remove('solved', 'given-up');

        } else {
            challengeSolvedText.innerText = 'Unsolved';
            challengeSolved.classList.remove('solved', 'solved-before', 'given-up');
        }

        if (this.progress[this.challenge.id].givenUp) {
            challengeSolved.classList.add('given-up');
            challengeSolved.classList.remove('solved', 'solved-before');
        }
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

// Initizalize game
export const game = new HorseAcademy();

// Challenge navitation
previousButton.addEventListener('click', () => {
    if (game.selectedChallenge > 0) game.newChallenge(--game.selectedChallenge);
});

nextButton.addEventListener('click', () => {
    if (game.selectedChallenge < HorseAcademy.challenges.length - 1) game.newChallenge(++game.selectedChallenge);
});

// Show solution popup
const showSolutionButton = document.getElementById('showSolution');
const hideSolutionButton = document.querySelector('.challenge-popup-close');
const solutionPopup = document.querySelector('.challenge-popup');
const darkerBackground = document.querySelector('.challenge-popup + div');

let solutionShown = 0;

const closePopup = event => {
    if (!event.code || event.code === 'Escape') {
        solutionShown = 0;
        solutionPopup.setAttribute('hidden', '');
        darkerBackground.setAttribute('hidden', '');
    }
};

showSolutionButton.addEventListener('click', () => {
    solutionShown ^= 1;

    if (solutionShown) {
        game.giveupChallenge();

        solutionPopup.querySelector('img').src = `./img/solutions/solution${game.challenge.id}.png`;

        // Give time for image to load
        setTimeout(() => {
            solutionPopup.removeAttribute('hidden');
            darkerBackground.removeAttribute('hidden');
            solutionPopup.focus();
        }, 1);

    } else closePopup();
});

// Hide solution
hideSolutionButton.addEventListener('click', closePopup);
darkerBackground.addEventListener('click', closePopup);
document.addEventListener('keydown', closePopup);

// Reset progress
document.getElementById('challenges-reset-progress').addEventListener('click', () => {
    game.resetProgress();
    location.reload();
});
