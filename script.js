document.getElementById('pull-card').addEventListener('click', pullCard);

async function pullCard() {
    const response = await fetch('cards.json');
    const cards = await response.json();
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    displayCard(randomCard);
}

function displayCard(card) {
    const container = document.getElementById('tarot-container');
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.innerHTML = `
        <img src="${card.image}" alt="${card.title}">
        <h3>${card.title}</h3>
        <p>${card.text}</p>
    `;
    container.appendChild(cardElement);
}