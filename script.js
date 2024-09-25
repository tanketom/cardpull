document.getElementById('deck').addEventListener('click', pullCard);

async function pullCard() {
    const response = await fetch('cards.json');
    const data = await response.json();
    const cards = data.cards;
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

    // Animate the card
    setTimeout(() => {
        cardElement.style.bottom = '50%';
        cardElement.style.transform = 'translateY(50%)';
    }, 100);
}