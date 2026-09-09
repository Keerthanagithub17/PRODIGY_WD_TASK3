
const cells = document.querySelectorAll(".cell");
const turnText = document.getElementById("turnText");
const message = document.getElementById("message");

const startBtn = document.getElementById("restartBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");

const pvpBtn = document.getElementById("pvpBtn");
const aiBtn = document.getElementById("aiBtn");

const scoreXDisplay = document.getElementById("scoreX");
const scoreODisplay = document.getElementById("scoreO");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;
let playWithAI = false;

let scoreX = 0;
let scoreO = 0;

const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function updateTurn() {
    if (gameOver) {
        return;
    }

    if (playWithAI && currentPlayer === "O") {
        turnText.textContent = "AI'S TURN";
    } else {
        turnText.textContent = "PLAYER " + currentPlayer + "'S TURN";
    }
}

function checkWinner() {
    for (let i = 0; i < winningPatterns.length; i++) {
        const pattern = winningPatterns[i];

        const a = pattern[0];
        const b = pattern[1];
        const c = pattern[2];

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return pattern;
        }
    }

    return null;
}

function checkDraw() {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            return false;
        }
    }

    return true;
}

function makeMove(index, player) {
    if (board[index] !== "" || gameOver) {
        return;
    }

    board[index] = player;

    cells[index].textContent = player;
    cells[index].disabled = true;
    cells[index].classList.add(player.toLowerCase());

    const winningPattern = checkWinner();

    if (winningPattern) {
        gameOver = true;

        for (let i = 0; i < winningPattern.length; i++) {
            cells[winningPattern[i]].classList.add("winner");
        }

        if (player === "X") {
            scoreX++;
            scoreXDisplay.textContent = scoreX;
        } else {
            scoreO++;
            scoreODisplay.textContent = scoreO;
        }

        if (playWithAI && player === "O") {
            message.textContent = "🤖 AI WINS!";
        } else {
            message.textContent = "🎉 PLAYER " + player + " WINS!";
        }

        turnText.textContent = "GAME OVER";

        return;
    }

    if (checkDraw()) {
        gameOver = true;
        message.textContent = "🤝 IT'S A DRAW!";
        turnText.textContent = "GAME OVER";
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    updateTurn();

    if (playWithAI && currentPlayer === "O") {
        setTimeout(aiMove, 500);
    }
}

function playerMove(index) {
    if (gameOver) {
        return;
    }

    if (playWithAI && currentPlayer === "O") {
        return;
    }

    makeMove(index, currentPlayer);
}

function aiMove() {
    if (gameOver) {
        return;
    }

    const available = [];

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            available.push(i);
        }
    }

    if (available.length === 0) {
        return;
    }

    let selectedMove = findBestMove();

    if (selectedMove === -1) {
        const randomIndex = Math.floor(Math.random() * available.length);
        selectedMove = available[randomIndex];
    }

    makeMove(selectedMove, "O");
}

function findBestMove() {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";

            if (checkWinner()) {
                board[i] = "";
                return i;
            }

            board[i] = "";
        }
    }

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "X";

            if (checkWinner()) {
                board[i] = "";
                return i;
            }

            board[i] = "";
        }
    }

    if (board[4] === "") {
        return 4;
    }

    const corners = [0, 2, 6, 8];

    for (let i = 0; i < corners.length; i++) {
        if (board[corners[i]] === "") {
            return corners[i];
        }
    }

    return -1;
}

function newGame() {
    board = ["", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameOver = false;

    message.textContent = "";

    for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = "";
        cells[i].disabled = false;
        cells[i].classList.remove("x");
        cells[i].classList.remove("o");
        cells[i].classList.remove("winner");
    }

    updateTurn();
}

function resetScore() {
    scoreX = 0;
    scoreO = 0;

    scoreXDisplay.textContent = "0";
    scoreODisplay.textContent = "0";

    newGame();
}

function setPlayerVsPlayer() {
    playWithAI = false;

    pvpBtn.classList.add("active");
    aiBtn.classList.remove("active");

    newGame();
}

function setPlayerVsAI() {
    playWithAI = true;

    aiBtn.classList.add("active");
    pvpBtn.classList.remove("active");

    newGame();
}

for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", function() {
        playerMove(i);
    });
}

startBtn.addEventListener("click", newGame);

resetScoreBtn.addEventListener("click", resetScore);

pvpBtn.addEventListener("click", setPlayerVsPlayer);

aiBtn.addEventListener("click", setPlayerVsAI);

updateTurn();
