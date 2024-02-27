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
let bankroll = 1000;
// 10. count the number of cards dealer & player have
let dealerCardCount = 0;
let playerCardCount = 0;
// 11. boolean if player wins
let playerWin = false;
// 1. boolean if player has blackjack
let playerBlackJack = false;

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
    document.querySelector("#hit-btn").addEventListener("click", hitAction);
    document.querySelector("#stand-btn").addEventListener("click", standAction);
}

function pointsOfDealer(initial = true) {
    if (initial) {
        // document.querySelector("#hidden").style.visibility = "visible";
        const initialCard = deckOfCard.pop();
        const cardValue = transformStringToNumber(initialCard[0]);
        totalPointsDealer += cardValue;
        calAceDealer += checkNumAce(initialCard[0]);
        dealerCardCount += 1;
        document.querySelector("#points-dealer").innerText = totalPointsDealer;

        setTimeout(function () {
            createCardDOM(initialCard, ".deck-dealer");
        }, 1000);

        setTimeout(function () {
            document.querySelector(".dealer-total").style.visibility =
                "visible";
        }, 2000);

        getHiddenCard();
        // HAVE TO CHECK FOR DOUBLE ACE AT INITIAL
        if (totalPointsDealer === 22) {
            convertAceDealer();
        }
    }
}

function pointsOfPlayer(initial = true) {
    if (initial) {
        let cardInterval = 500;
        for (i = 0; i < 2; i++) {
            const initialCard = deckOfCard.pop();
            const cardValue = transformStringToNumber(initialCard[0]);
            totalPointsPlayer += cardValue;
            calAcePlayer += checkNumAce(initialCard[0]); // use initialCard[0]
            playerCardCount += 1;
            document.querySelector("#points-player").innerText =
                totalPointsPlayer;
            setTimeout(function () {
                createCardDOM(initialCard, ".deck-player");
            }, cardInterval);
            cardInterval += 1000;
        }
        setTimeout(function () {
            document.querySelector(".player-total").style.visibility =
                "visible";
        }, 2500);

        if (totalPointsPlayer === 21 && playerCardCount === 2) {
            setTimeout(function () {
                document.querySelector("#hit-btn").style.visibility = "hidden";
                document.querySelector("#stand-btn").style.visibility =
                    "hidden";
                displayResult("BlackJack!", "#blackjack-player");
            }, 3000);

            const timeout = setTimeout(function () {
                revealHiddenCardDOM(hiddenCard, "#hidden");
            }, 1000);

            if (totalPointsDealer === 21 && dealerCardCount === 2) {
                setTimeout(function () {
                    displayResult("BlackJack!", "#blackjack-dealer");
                }, 3000);
                setTimeout(function () {
                    displayResult("PUSH!");
                }, 3500);
            } else {
                playerBlackJack = true;
                setTimeout(function () {
                    displayResult("PLAYER WINS!", "#winner");
                }, 3500);
            }

            // setTimeout(function () {
            //     shuffle();
            //     reset();
            // }, 5000);
        }

        if (totalPointsPlayer === 22) {
            convertAcePlayer();
        }
    }
}

function hitAction() {
    const getCard = deckOfCard.pop();
    const cardValue = transformStringToNumber(getCard[0]);
    totalPointsPlayer += cardValue;
    calAcePlayer += checkNumAce(getCard[0]);
    createCardDOM(getCard, ".deck-player");
    playerCardCount += 1;
    convertAcePlayer();
    setTimeout(function () {
        document.querySelector("#points-player").innerText = totalPointsPlayer;
    }, 500);

    if (totalPointsPlayer > 21) {
        document.querySelector("#hit-btn").style.visibility = "hidden";
        document.querySelector("#stand-btn").style.visibility = "hidden";
        const timeout = setTimeout(function () {
            revealHiddenCardDOM(hiddenCard, "#hidden");
        }, 100);

        setTimeout(function () {
            displayResult("BUST!", "#bust-player");
            displayResult("DEALER WINS!", "#win-dealer");
        }, 3000);

        // setTimeout(function () {
        //     shuffle();
        //     reset();
        // }, 5000);
    }
}

function standAction() {
    convertAcePlayer();
    document.querySelector("#hit-btn").style.visibility = "hidden";
    document.querySelector("#stand-btn").style.visibility = "hidden";

    // TO-DO: DEALER TURN TO HIT ABOVE 17 here
    // reveal the hidden card

    const timeout = setTimeout(function () {
        revealHiddenCardDOM(hiddenCard, "#hidden");
    }, 100);

    dealerDrawCard();
}

function placeYourBet() {
    // check if bankroll < value, hide the chips
    document.querySelector("#place-bet").style.visibility = "visible";
    document.querySelector("#total-bet").style.visibility = "visible";
    // document.querySelector("#bankroll").innerText = "$" + bankroll;
    document
        .querySelectorAll(".chips")
        .forEach((e) => (e.style.display = "none"));
    document
        .querySelectorAll(".chips")
        .forEach((e) => (e.style.display = "block"));
    document.querySelector("#chips1").addEventListener("click", function () {
        if (bankroll < 25) {
            return;
        }
        createChipsAtBetsButton(25, "#hidden-chip1");
    });
    document.querySelector("#chips2").addEventListener("click", function () {
        if (bankroll < 50) {
            return;
        }
        createChipsAtBetsButton(50, "#hidden-chip2");
    });
    document.querySelector("#chips3").addEventListener("click", function () {
        if (bankroll < 100) {
            return;
        }
        createChipsAtBetsButton(100, "#hidden-chip3");
    });
    document.querySelector("#chips4").addEventListener("click", function () {
        if (bankroll < 500) {
            return;
        }
        createChipsAtBetsButton(500, "#hidden-chip4");
    });

    document
        .querySelector("#reset-bets-btn")
        .addEventListener("click", function () {
            document.querySelector("#deal-hide-btn").style.visibility =
                "hidden";
            document.querySelector("#reset-bets-btn").style.visibility =
                "hidden";
            document
                .querySelectorAll(".hidden-chip")
                .forEach((e) => (e.style.visibility = "hidden"));
            bankroll += moneyBet;
            moneyBet = 0;
            document.querySelector("#bankroll").innerText = "$" + bankroll;
            document.querySelector("#total-bet").innerText = "$" + moneyBet;
        });
}

function createChipsAtBetsButton(value, element) {
    totalBet(value);
    document
        .querySelectorAll(".hidden-chip")
        .forEach((e) => (e.style.visibility = "hidden"));
    document.querySelector(element).style.visibility = "visible";
}

function totalBet(value) {
    moneyBet += value;
    bankroll -= value;
    // console.log(moneyBet);
    // console.log(bankroll);
    document.querySelector("#total-bet").innerText = "$" + moneyBet;
    document.querySelector("#deal-hide-btn").style.visibility = "visible";
    document.querySelector("#bankroll").innerText = "$" + bankroll;
    document.querySelector("#reset-bets-btn").style.visibility = "visible";
}

function revealPlayerButtons() {
    if (moneyBet === 0) {
        document.querySelector("#deal-hide-btn").style.visibility = "hidden";
        document.querySelector("#reset-bets-btn").style.visibility = "hidden";
    }

    document
        .querySelector("#deal-hide-btn")
        .addEventListener("click", function () {
            document.querySelector("#place-bet").style.visibility = "hidden";
            setTimeout(function () {
                document.querySelector("#hit-btn").style.visibility = "visible";
                document.querySelector("#stand-btn").style.visibility =
                    "visible";
            }, 2400);

            document.querySelector("#deal-hide-btn").style.visibility =
                "hidden";
            document.querySelector("#reset-bets-btn").style.visibility =
                "hidden";
            document
                .querySelectorAll(".chips")
                .forEach((e) => e.removeAttribute("disabled")); // TAKE NOTE ON RESET
            startGame();
        });
}

function results() {
    if (totalPointsDealer === 21 && dealerCardCount === 2) {
        displayResult("BlackJack!", "#blackjack-dealer");
        setTimeout(function () {
            displayResult("DEALER WINS!", "#win-dealer");
        }, 2000);
    }

    if (totalPointsPlayer <= 21) {
        if (totalPointsPlayer === totalPointsDealer) {
            displayResult("PUSH!");
        } else if (totalPointsPlayer > totalPointsDealer) {
            playerWin = true;
            displayResult("PLAYER WINS!", "#win-player");
        } else if (
            totalPointsPlayer < totalPointsDealer &&
            totalPointsDealer <= 21
        ) {
            displayResult("DEALER WINS!", "#win-dealer");
        } else if (
            totalPointsPlayer < totalPointsDealer &&
            totalPointsDealer > 21
        ) {
            displayResult("BUST!", "#bust-dealer");
            playerWin = true;
            displayResult("PLAYER WINS!", "#win-player");
        }
    }

    // setTimeout(function () {
    //     shuffle();
    //     reset();
    // }, 5000);
}

function reset() {
    if (!playerWin) {
    } else if (playerBlackJack) {
        bankroll += Math.round(moneyBet * 2.5);
    } else {
        bankroll += moneyBet * 2;
    }

    totalPointsDealer = 0;
    totalPointsPlayer = 0;
    calAceDealer = 0;
    calAcePlayer = 0;
    hiddenCard = "";
    deckOfCard.length = 0;
    canDrawCard = true;
    moneyBet = 0;
    dealerCardCount = 0;
    playerCardCount = 0;
    playerWin = false;
    playerBlackJack = false;

    // Clear the DOM elements
    document.querySelector("#hidden").style.visibility = "hidden";
    document.querySelector("#points-dealer").innerText = "0";
    document.querySelector(".dealer-total").style.visibility = "hidden";
    document.querySelector("#points-player").innerText = "0";
    document.querySelector(".player-total").style.visibility = "hidden";
    document.querySelector("#hit-btn").style.visibility = "hidden";
    document.querySelector("#stand-btn").style.visibility = "hidden";
    document.querySelector("#bust-player").style.visibility = "hidden";
    document.querySelector("#blackjack-player").style.visibility = "hidden";
    document.querySelector("#blackjack-dealer").style.visibility = "hidden";
    document.querySelector("#total-bet").style.visibility = "hidden";
    document.querySelector("#winner").innerText = "";
    document.querySelector("#win-player").innerText = "";
    document.querySelector("#win-dealer").innerText = "";
    document.querySelector("#bust-dealer").innerText = "";
    document.querySelector(".deck-dealer").innerHTML =
        "<img id='hidden' src='img/deck/BACK.png' />";
    document.querySelector(".deck-player").innerHTML = "";

    document.querySelector("#deal-hide-btn").style.visibility = "hidden";
    document.querySelector("#reset-bets-btn").style.visibility = "hidden";
    document
        .querySelectorAll(".hidden-chip")
        .forEach((e) => (e.style.visibility = "hidden"));
    document.querySelector("#bankroll").innerText = "$" + bankroll;
    document.querySelector("#total-bet").innerText = "$" + moneyBet;

    // setTimeout(function () {
    //     buildDeck();
    //     shuffleDeck();
    //     placeYourBet();
    //     revealPlayerButtons();
    // }, 2000);
}
//--------------------------------------------------------------------------------------------

// GENERIC function
function transformStringToNumber(value) {
    if (isNaN(value)) {
        if (value !== "A") {
            return 10;
        }
        return 11;
    } else if (!isNaN(value) && Number(value) === 1) {
        return 10;
    }
    return Number(value);
}

// a function to create and append card using DOM to display on the web
function createCardDOM(card, element) {
    const imgPath = "./img/deck/" + card + ".png";
    // const imgPath = path.join('img', 'deck', `${card}.png`); // does not work. probably environment setting issue with node.js
    const createCard = document.createElement("img");
    document.querySelector(element).appendChild(createCard);
    createCard.classList.add("img");
    createCard.setAttribute("src", imgPath);
    //flyInEffect;
    setTimeout(function () {
        createCard.style.transition = "transform 1.0s ease-in-out";
        createCard.style.transform = "translate(0, 0)";
    }, 100);
}

function revealHiddenCardDOM(card, element) {
    const imgPath = "img/deck/" + card + ".png";
    document.querySelector(element).src = imgPath;
    document.querySelector("#points-dealer").innerText = totalPointsDealer;
}

function checkNumAce(value) {
    if (value !== "A") {
        return 0;
    }
    return 1;
}

function getHiddenCard() {
    hiddenCard = deckOfCard.pop();
    const hiddenCardValue = transformStringToNumber(hiddenCard[0]);
    totalPointsDealer += hiddenCardValue;
    calAceDealer += checkNumAce(hiddenCard[0]);
    dealerCardCount += 1;
    setTimeout(function () {
        document.querySelector("#hidden").style.transition =
            "transform 0.5s ease-in-out";
        document.querySelector("#hidden").style.transform = "translate(0, 0)";
    }, 100);
}

// convert the value of ACE from 11 to 1 if the total value of cards is more than 21
function convertAceDealer() {
    while (totalPointsDealer > 21 && calAceDealer > 0) {
        totalPointsDealer -= 10;
        calAceDealer -= 1;
    }
}

function convertAcePlayer() {
    while (totalPointsPlayer > 21 && calAcePlayer > 0) {
        totalPointsPlayer -= 10;
        calAcePlayer -= 1;
    }
}

function dealerDrawCard() {
    const drawInterval = 500;

    function drawNextCard() {
        if (totalPointsDealer < 17) {
            setTimeout(function () {
                const getCard = deckOfCard.pop();
                const cardValue = transformStringToNumber(getCard[0]);
                totalPointsDealer += cardValue;
                calAceDealer += checkNumAce(getCard[0]);
                createCardDOM(getCard, ".deck-dealer");
                dealerCardCount += 1;
                convertAceDealer();
                setTimeout(() => {
                    document.querySelector("#points-dealer").innerText =
                        totalPointsDealer;
                }, 750);
                drawNextCard();
            }, drawInterval);
        }
    }

    drawNextCard();

    setTimeout(function () {
        results();
    }, 3000);
}

function displayResult(text, element = "#winner") {
    const resultElement = document.querySelector(element);
    resultElement.innerText = text;
    resultElement.classList.add("fadeIn");
    resultElement.classList.add("hold");
    setTimeout(function () {
        resultElement.classList.remove("fadeIn");
    }, 5000);
}

function shuffle(element = "#shuffle") {
    const shuffleElement = document.querySelector(element);
    shuffleElement.innerText = "Shuffling...";
    shuffleElement.classList.add("fadeIn");
    shuffleElement.classList.add("hold");
    setTimeout(function () {
        shuffleElement.classList.remove("fadeIn");
    }, 5000);
}

//--------------------------------------------------------------------------------------------

function main() {
    buildDeck();
    shuffleDeck();
    placeYourBet();
    revealPlayerButtons();
}

main();
