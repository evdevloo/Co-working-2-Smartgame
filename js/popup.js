import { HorseAcademy } from './board.js';

const openBtn = document.querySelector();

const challengesContent = document.getElementById('challenges-content');

for (let challenge of HorseAcademy.challenges) {
    const box = document.createElement('div');
    box.innerHTML = `
        <div class="box">
            <h2>Challenge ${challenge.id}</h2>
            <img src="./img/challenges/challenge${challenge.id}.png" alt="Challenge diagram ${challenge.id}">
            <button>Play</button>
        </div>
    `;
    challengesContent.appendChild(box);
}

const solutionsContent = document.getElementById('solutions-content');

for (let solution of HorseAcademy.challenges) {
    const box = document.createElement('div');
    box.innerHTML = `
        <div class="box">
            <h2>Solution ${solution.id}</h2>
            <img src="./img/raw_solutions/solution${solution.id}.png" alt="challenge solution ${solution.id}">
            <button>Play</button>
        </div>
    `;
    challengesContent.appendChild(box);
}