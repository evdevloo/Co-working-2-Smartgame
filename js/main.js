import {game} from './board.js';

game.resetProgress();
game.addPiece('e', 1, 0, 1);

console.log(game.getPiece(1, 1));
console.log(game.board);