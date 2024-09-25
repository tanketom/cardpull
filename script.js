document.addEventListener('DOMContentLoaded', setupDeck);

async function setupDeck() {
    const response = await fetch('cards.json');
    const data = await response.json();
    const cards = data.cards;
    const deckContainer = document.getElementById('deck-container');

    // Shuffle the cards
    shuffleArray(cards);

    cards.forEach((card, index) => {
        const cardElement = document.createElement('img');
        cardElement.src = data.backside;
        cardElement.className = 'deck-card';
        cardElement.dataset.card = JSON.stringify(card);
        cardElement.style.zIndex = cards.length - index; // Stack the cards
        deckContainer.appendChild(cardElement);
    });

    document.querySelectorAll('.deck-card').forEach(card => {
        card.addEventListener('click', pullCard);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function pullCard(event) {
    const card = JSON.parse(event.target.dataset.card);
    const position = document.querySelectorAll('.grid-position.occupied').length + 1;
    const choices = await fetchChoices(card.title, position);
    const isReversed = Math.random() < 0.5; // Randomly determine if the card is reversed
    displayCard(card, choices, isReversed);
    event.target.remove();
}

async function fetchChoices(cardTitle, position) {
    const response = await fetch('choices.json');
    const data = await response.json();
    const positionName = data.positions[position.toString()];
    return data.choices[cardTitle][positionName];
}

function displayCard(card, choices, isReversed) {
    const container = document.getElementById('tarot-container');
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.innerHTML = `
        <img src="${card.image}" alt="${card.title}">
        <div class="card-info">
            <h3>${card.title} ${isReversed ? '(Reversed)' : ''}</h3>
            <p>${isReversed ? card.reversed : card.text}</p>
        </div>
    `;
    container.appendChild(cardElement);

    // Animate the card to the center
    setTimeout(() => {
        cardElement.style.bottom = '50%';
        cardElement.style.transform = 'translateY(50%)';
        createParticles(cardElement);
        showCardDetails(cardElement, card, choices);
    }, 100);

    // Add click event to place the card in the grid
    cardElement.addEventListener('click', () => placeCardInGrid(cardElement));
}

function createParticles(cardElement) {
    for (let i = 0; i < 7; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        cardElement.appendChild(particle);
    }
}

function showCardDetails(cardElement, card, choices) {
    const detailsBox = document.createElement('div');
    detailsBox.className = 'details-box';
    const surprisedPhrases = ["Ah, yes…", "Interesting…", "Oh, I didn't expect you already…"];
    const randomPhrase = surprisedPhrases[Math.floor(Math.random() * surprisedPhrases.length)];
    detailsBox.innerHTML = `
        <h3>${randomPhrase} ${card.title}</h3>
        ${choices.map(choice => `<div class="choice">${choice}</div>`).join('')}
    `;
    cardElement.appendChild(detailsBox);

    detailsBox.querySelectorAll('.choice').forEach(choice => {
        choice.addEventListener('click', () => {
            alert(`You chose: ${choice.textContent}`);
            detailsBox.remove();
        });
    });
}

function placeCardInGrid(cardElement) {
    const container = document.getElementById('tarot-container');
    const emptyCell = Array.from(container.children).find(cell => cell.classList.contains('grid-position') && !cell.classList.contains('occupied'));

    if (emptyCell) {
        emptyCell.classList.add('occupied');
        emptyCell.appendChild(cardElement);
        cardElement.style.position = 'static';
        cardElement.style.bottom = 'auto';
        cardElement.style.transform = 'none';
    }
}