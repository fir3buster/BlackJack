// Planning - Due 19 Feb 24
// You will share:
//  ☐ Your choice of game.
//  ☐ A wireframe of your "main" game screen.
//  ☐ Pseudocode for the overall game play.

// PseudoCode Prelim
/*

----------------------------------------------------------------------------------------------------------------------
Variables
1. Total points/ sum of the dealer => int
2. Total points/ sum of the player => int
3. Calculate the Ace of the dealer => int
4. Calculate the Ace of the player => int
5. hidden card => string
6. the deck/ rest of the cards => array
7. boolean to allow player to draw a new card if the total points is less than 21
8. money bet => int
9. total money/bankroll => int

*Advanced
10. calculate the number of cards that each dealer and player has

----------------------------------------------------------------------------------------------------------------------

Function
1. Build the deck 
    a. Create an array to list out all the values
    b. Create an array to list out all the suits
    c. Initialize an empty array for the deck
    d. Append all the cards into deck array.
        i) currently only set to 1 deck

2. Shuffle the deck
    a. loop through the deck array
        i) assign a variable with random index between 0 to 51
        ii) swap the random index with the index i from the loop

3.  start the game
    a. create place the bet function
    b. get the total points of the dealer
        i) create a function to get the value of the card. including the hidden card
            - append the cards using DOM to show on the web
    c. get the total points of the player
        i) create a function to get the value of the card.
            - append the cards using DOM to show on the web
    d. calculate the ace of the dealer
        i) create a function to check the number of ace a dealer has in a round.
    7. calculate the ace of the player
        i) create a function to check the number of ace a dealer has in a round.
    8. check for player action
        i) create a function to check if the player's going to hit or stand
            - if hit , 
                i) then get the value of the card and append
                ii) check and calculate the ace of the player
                iii) create another function to reduce the ACE 
                    - if " the total points of player is more than 21 and number of ace is more than 0"
                            total points minus 10;
                            number of ace minus 1;
            - else if stand, 
                return;
    9. reveal the hidden card
    10. reveal the results according to game play.

4. game play logic (the rules)
    a. if player is busted  or (*blackjack with only 2 cards)
        i) dealer reveals the hidden card and do not require to satisfy "sum > 17 condition"
        
    b. else;
        1. when the total points of the dealer is less than 17 (or soft 17 => A + 6)  (use a while loop)
            i) append a card until the sum is more than or equal to 17
            ii) check and calculate the ace of the player
            iii) create another function to reduce the ACE 
                - if " the total points of player is more than 21 and number of ace is more than 0"
                        total points minus 10;
                        number of ace minus 1;
    c. reset variables 1 to 8, update 9.


5. Stretch goals
    // split, double down, insurance
*/
//-------------------------------------------------------------------------------------------------------------------

// Declaring the variables
// 1. Total points/ sum of the dealer => int
let totalPointsDealer = 0;
// 2. Total points/ sum of the player => int
let totalPointsPlayer = 0;
// 3. Calculate the Ace of the dealer => int
let calAceDealer = 0;
// 4. Calculate the Ace of the player => int
let calAcePlayer = 0;
// 5. hidden card => string
let hiddenCard = "";
// 6. the deck/ rest of the cards => array
const deckOfCard = [];
// 7. boolean to allow player to draw a new card if the total points is less than 21
let canDrawCard = true;
// 8. money bet => int
let moneyBet = 0;
// 9. total money/bankroll => int
let bankroll = 0;
// // 11. cardindex
// const

/*
Function
1. Build the deck 
    a. Create an array to list out all the values
    b. Create an array to list out all the suits
    c. Initialize an empty array for the deck
    d. Append all the cards into deck array.
        i) currently only set to 1 deck
*/

function buildDeck() {
    const values = [
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
    ];
    // S = Spades, H = Heart, C = Club, D = Diamond
    const suits = ["S", "H", "C", "D"];

    for (const value of values) {
        for (const suit of suits) {
            const card = value + suit;
            deckOfCard.push(card);
        }
    }
}

/*
2. Shuffle the deck
    a. loop through the deck array
        i) assign a variable with random index between 0 to 51
        ii) swap the random index with the index i from the loop

*/

function shuffleDeck() {
    for (let i = 0; i < deckOfCard.length; i++) {
        const randomIndex = Math.floor(Math.random() * deckOfCard.length);
        let temp = deckOfCard[i];
        deckOfCard[i] = deckOfCard[randomIndex];
        deckOfCard[randomIndex] = temp;
    }
    console.log(deckOfCard);
}

/*
3.  start the game
    a. create place the bet function
    b. get the total points of the dealer
        i) create a function to get the value of the card. including the hidden card
            - append the cards using DOM to show on the web
    c. get the total points of the player
        i) create a function to get the value of the card.
            - append the cards using DOM to show on the web
    d. calculate the ace of the dealer
        i) create a function to check the number of ace a dealer has in a round.
    7. calculate the ace of the player
        i) create a function to check the number of ace a dealer has in a round.
    8. check for player action
        i) create a function to check if the player's going to hit or stand
            - if hit , 
                i) then get the value of the card and append
                ii) check and calculate the ace of the player
                iii) create another function to reduce the ACE 
                    - if " the total points of player is more than 21 and number of ace is more than 0"
                            total points minus 10;
                            number of ace minus 1;
            - else if stand, 
                return;
    9. reveal the hidden card
    10. reveal the results according to game play.
*/

function startGame() {
    pointsOfDealer();
    pointsOfPlayer();

    // event listener
    document.querySelector("#hit").addEventListener("click", hitAction);
    document.querySelector("#stand").addEventListener("click", standAction);
}

function pointsOfDealer(initial = true) {
    if (initial) {
        getHiddenCard();

        const initialCard = deckOfCard.pop();
        console.log(initialCard);
        const cardValue = transformStringToNumber(initialCard[0]);
        totalPointsDealer += cardValue;
        calAceDealer += checkNumAce(cardValue);
        createCardDOM(initialCard, "#deck-dealer");
    }
    console.log(totalPointsDealer);
}

function pointsOfPlayer(initial = true) {
    if (initial) {
        for (i = 0; i < 2; i++) {
            const initialCard = deckOfCard.pop();
            console.log(initialCard);
            const cardValue = transformStringToNumber(initialCard[0]);
            totalPointsPlayer += cardValue;
            calAcePlayer += checkNumAce(cardValue);
            createCardDOM(initialCard, "#deck-player");
        }
    }
    console.log(totalPointsPlayer);
}

function hitAction() {
    if (!canDrawCard) {
        return;
    }

    const getCard = deckOfCard.pop();
    const cardValue = transformStringToNumber(getCard[0]);
    totalPointsPlayer += cardValue;
    calAcePlayer += checkNumAce(cardValue);
    createCardDOM(getCard, "#deck-player");

    if (convertAce(totalPointsPlayer, calAcePlayer) > 21) {
        canDrawCard = false;
    }
}

function standAction() {
    totalPointsPlayer = convertAce(totalPointsPlayer, calAcePlayer);
    canDrawCard = false;

    // TO-DO: DEALER TURN TO HIT ABOVE 17 here
    // reveal the hidden card
    // PROPOSE USING A WHILE LOOP

    // RESULTS of who wins if-else statement
}
//--------------------------------------------------------------------------------------------

// GENERIC function
function transformStringToNumber(value) {
    if (isNaN(value)) {
        if (value !== "A") {
            return 10;
        }
        return 11;
    }
    return Number(value);
}

// a function to create and append card using DOM to display on the web
function createCardDOM(card, element) {
    const imgPath = `img\\deck\\${card}.png`;
    const createCard = document.createElement("img");
    document.querySelector(element).appendChild(createCard);
    createCard.classList.add("img");
    createCard.setAttribute("src", imgPath);
}

// i) create a function to check the number of ace in a round.
function checkNumAce(value) {
    if (value !== "A") {
        return 0;
    }
    return 1;
}

function getHiddenCard() {
    const hiddenCard = deckOfCard.pop();
    const hiddenCardValue = transformStringToNumber(hiddenCard[0]);
    totalPointsDealer += hiddenCardValue;
    calAceDealer += checkNumAce(hiddenCardValue);
}

// convert the value of ACE from 11 to 1 if the total value of cards is more than 21
function convertAce(pointsTotal, aceTotal) {
    while (pointsTotal > 21 && aceTotal > 0) {
        pointsTotal -= 10;
        aceTotal -= 1;
    }
    return pointsTotal;
}

//--------------------------------------------------------------------------------------------

buildDeck();
shuffleDeck();
startGame();

// let num = 123;
// console.log(typeof num);
// num += 100;
// console.log(num);
