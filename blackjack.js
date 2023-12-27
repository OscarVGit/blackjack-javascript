
let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0; 

let hidden;
let deck;

let canHit = true; //allows the player (you) to draw while yourSum <= 21
let canGamble = true; //allows the player (you) to gamble while playerMoney > 0, and after the player has hit
let playerMoney = 1000; // Starting amount of money
let currentBet = 10; // Starting bet amount

window.onload = function () {
    document.getElementById("new-hand").addEventListener("click", newHand);

    buildDeck();
    shuffleDeck();
    startGame();
};

// Rewriting the window.onload to be a DOMContentLoaded event listener
// document.addEventListener("DOMContentLoaded", function() {
//     buildDeck();
//     shuffleDeck();
//     startGame();
//     document.getElementById("new-hand").addEventListener("click", newHand);
// });

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {
    document.getElementById("new-hand").addEventListener("click", newHand);
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    // console.log(hidden);
    // console.log(dealerSum);
    // while (dealerSum < 17) {
    //     //<img src="./cards/4-C.png">
    //     let cardImg = document.createElement("img");
    //     let card = deck.pop();
    //     cardImg.src = "./cards/" + card + ".png";
    //     dealerSum += getValue(card);
    //     dealerAceCount += checkAce(card);
    //     document.getElementById("dealer-cards").append(cardImg);
    // }
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").append(cardImg);
    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    console.log(yourSum);
    document.getElementById("increase-bet").addEventListener("click", increaseBet);
    document.getElementById("decrease-bet").addEventListener("click", decreaseBet);

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);

    document.getElementById("new-hand").addEventListener("click", newHand);

}

function increaseBet() {
    currentBet += 10;
    document.getElementById("money").innerText = currentBet;
}

function decreaseBet() {
    if (playerMoney > 0) {
        currentBet -= 10;
        document.getElementById("money").innerText = currentBet;
    }
}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
        updateMoney(-currentBet) // Adjust the amount deducted from the player's money
        displayMoney(); // Display the new amount of money
        displayBet(); // Display the new bet amount
    }

}

function updateMoney(amount) {
    playerMoney += amount;
}

function displayMoney() {
    document.getElementById("money").innerText = playerMoney;
}

function displayBet(){
    document.getElementById("current-bet").innerText = "Bet: $" + currentBet;
}

function stay() {
        // Reveal the hidden card
    document.getElementById("hidden-card").src = "./cards/" + hidden + ".png";

    // Dealer's turn
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden-card").src = "./cards/" + hidden + ".png";

    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
        updateMoney(-currentBet) // Adjust the amount deducted from the player's money
    }
    else if (dealerSum > 21) {
        message = "You win!";
        updateMoney(currentBet * 2); // Adjust the amount added to the player's money
    }
    //both you and dealer <= 21
    else if (yourSum == dealerSum) {
        message = "Tie!";
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;

    displayMoney() // Display the new amount of money
    displayBet() // Display the new bet amount
}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

function newHand() {
    console.log("Entering newHand function");

    // Resetting variables for a new hand
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    hidden = null;
    canHit = true;
    canGamble = true;

    // Checking if the deck needs to be reshuffled
    if (deck.length < 10){
        console.log("Shuffling deck");
        buildDeck();
        shuffleDeck();
    }

    // clearing the dealer's cards
    let dealerCardsContainer = document.getElementById("dealer-cards");
    if (dealerCardsContainer){
        console.log("Clearing dealer cards");
        dealerCardsContainer.innerHTML = "";

        // Recreating the hidden card element
        let hiddenCard = document.createElement("img");
        hiddenCard.id = "hidden-card";
        hiddenCard.src = "./cards/BACK.png";
        hiddenCard.alt = "Hidden Card";
        dealerCardsContainer.appendChild(hiddenCard);
    } else {
        console.log("Dealer cards container not found");
    }

    // clearing the player's cards
    let yourCardsContainer = document.getElementById("your-cards");
    if (yourCardsContainer){
        console.log("Clearing player cards");
        yourCardsContainer.innerHTML = "";
    } else {
        console.log("Your cards container not found");
    }

    console.log("Clearing results");
    // Resetting the hidden card to be hidden
    // let hiddenElement = document.getElementById("hidden-card");
    // if (hiddenElement) {
    //     // hiddenElement.src = "./cards/BACK.png";
    //     document.getElementById("hidden-card").src = "./cards/BACK.png";

    // } else {
    //     console.error("Element with id 'hidden-card' is not found");
    // }
    console.log("after clearing results");
    // Start a new hand
    console.log("Calling startGame");
    startGame();
    
    console.log("Exiting newHand function");
}