document.addEventListener('DOMContentLoaded', setupDeck);

async function setupDeck() {
    const response = await fetch('cards.json');
    const data = await response.json();
    const cards = data.cards;
    const deckContainer = document.getElementById('deck-container');

    cards.forEach(card => {
        const cardElement = document.createElement('img');
        cardElement.src = data.backside;
        cardElement.className = 'deck-card';
        cardElement.dataset.card = JSON.stringify(card);
        deckContainer.appendChild(cardElement);
    });

    document.querySelectorAll('.deck-card').forEach(card => {
        card.addEventListener('click', pullCard);
    });
}

function pullCard(event) {
    const card = JSON.parse(event.target.dataset.card);
    displayCard(card);
    event.target.remove();
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

    // Animate the card
    setTimeout(() => {
        cardElement.style.bottom = '50%';
        cardElement.style.transform = 'translateY(50%)';
    }, 100);
}