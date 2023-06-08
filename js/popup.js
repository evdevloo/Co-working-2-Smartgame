import { HorseAcademy, game } from './board.js';

const challengesContent = document.querySelector('#challenges-content');
const challengesContentList = document.querySelector('#challenges-content .grid-container');
const challengesOpenButton = document.querySelector('nav li:nth-child(2) a');
const challengesCloseButton = document.querySelector('#challenges-content .close-btn');

challengesOpenButton.addEventListener('click', () => {
    challengesContent.removeAttribute('hidden');
});

challengesCloseButton.addEventListener('click', () => {
    challengesContent.setAttribute('hidden', '');
});

challengesContentList.innerHTML = '';

for (let challengeIndex in HorseAcademy.challenges) {
    const challenge = HorseAcademy.challenges[challengeIndex];

    const box = document.createElement('div');
    box.innerHTML = `
        <h2>Challenge ${challenge.id}</h2>
        <img src="./img/challenges/challenge${challenge.id}.png" alt="Challenge diagram ${challenge.id}">
        <button class="container-button">Play</button>
    `;
    box.classList.add('box', challenge.difficulty.toLowerCase());
    
    box.querySelector('button').addEventListener('click', () => {
        game.newChallenge(challengeIndex);
        challengesContent.setAttribute('hidden', '');
    });

    challengesContentList.appendChild(box);
}

const solutionsContent = document.querySelector('#solutions-content');
const solutionsContentList = document.querySelector('#solutions-content .grid-container');
const solutionsOpenButton = document.querySelector('nav li:nth-child(3) a');
const solutionsCloseButton = document.querySelector('#solutions-content .close-btn');

solutionsOpenButton.addEventListener('click', () => {
    solutionsContent.removeAttribute('hidden');
});

solutionsCloseButton.addEventListener('click', () => {
    solutionsContent.setAttribute('hidden', '');
});

solutionsContentList.innerHTML = '';

for (let challengeIndex in HorseAcademy.challenges) {
    const challenge = HorseAcademy.challenges[challengeIndex];

    const box = document.createElement('div');
    box.innerHTML = `
        <img src="./img/solutions/solution${challenge.id}.png" alt="challenge solution ${challenge.id}">
        <button class="container-button">Play</button>
    `;
    box.classList.add('box', challenge.difficulty.toLowerCase());
    
    box.querySelector('button').addEventListener('click', () => {
        game.newChallenge(challengeIndex);
        solutionsContent.setAttribute('hidden', '');
    });

    solutionsContentList.appendChild(box);
}