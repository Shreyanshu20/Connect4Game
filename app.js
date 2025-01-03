const ROWS = 6;
const COLS = 7;
let board = [];
let currentPlayer = 'red';
let scores = {
    p1: 0,
    p2: 0
};

const gameBoard = document.getElementById('game-board');
const turnIndicator = document.getElementById('turn-indicator');
const resetBtn = document.getElementById('reset-btn');
const resetScoreBtn = document.getElementById('reset-score-btn');
const scoreP1 = document.getElementById('score-p1');
const scoreP2 = document.getElementById('score-p2');

function updateScore(winner) {
    if (winner === 'red') {
        scores.p1++;
        scoreP1.textContent = scores.p1;
    } else {
        scores.p2++;
        scoreP2.textContent = scores.p2;
    }
}

function resetScores() {
    scores.p1 = 0;
    scores.p2 = 0;
    scoreP1.textContent = '0';
    scoreP2.textContent = '0';
}

function initializeBoard() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(null));
    gameBoard.innerHTML = '';

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    const col = parseInt(event.target.dataset.col);

    for (let row = ROWS - 1; row >= 0; row--) {
        if (!board[row][col]) {
            board[row][col] = currentPlayer;
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.classList.add(currentPlayer);

            if (checkWin(row, col)) {
                updateScore(currentPlayer);
                document.querySelector('h1').textContent = `Player ${currentPlayer === 'red' ? '1' : '2'} Wins!`;
                setTimeout(resetGame, 2000);
                return;
            }

            if (checkDraw()) {
                document.querySelector('h1').textContent = "It's a Draw!";
                setTimeout(resetGame, 2000);
                return;
            }

            currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
            turnIndicator.textContent = `Player ${currentPlayer === 'red' ? '1' : '2'}'s Turn`;
            break;
        }
    }
}

function checkWin(row, col) {
    const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1]
    ];

    return directions.some(([dx, dy]) => {
        return checkDirection(row, col, dx, dy) >= 4;
    });
}

function checkDirection(row, col, dx, dy) {
    const color = board[row][col];
    let count = 1;
    let x, y;

    x = row + dx;
    y = col + dy;
    while (x >= 0 && x < ROWS && y >= 0 && y < COLS && board[x][y] === color) {
        count++;
        x += dx;
        y += dy;
    }

    x = row - dx;
    y = col - dy;
    while (x >= 0 && x < ROWS && y >= 0 && y < COLS && board[x][y] === color) {
        count++;
        x -= dx;
        y -= dy;
    }

    return count;
}

function checkDraw() {
    return board.every(row => row.every(cell => cell !== null));
}

function resetGame() {
    initializeBoard();
    currentPlayer = 'red';
    document.querySelector('h1').textContent = 'Connect 4 Game';
    turnIndicator.textContent = "Player 1's Turn";
}

resetBtn.addEventListener('click', resetGame);
resetScoreBtn.addEventListener('click', resetScores);
initializeBoard();