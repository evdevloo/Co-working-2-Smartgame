document.querySelector('.info').addEventListener('click', () => {
    document.querySelector('#gameRules').showModal();
});

document.querySelector('#gameRules #close').addEventListener('click', () => {
    document.querySelector('#gameRules').close();
});