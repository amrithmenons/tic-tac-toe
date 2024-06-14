document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.getElementById('restartButton');
    const manualModeButton = document.getElementById('manualMode');
    const automaticModeButton = document.getElementById('automaticMode');
    const statusMessage = document.getElementById('statusMessage');
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let isAutomaticMode = false;
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartButton.addEventListener('click', restartGame);
    manualModeButton.addEventListener('click', () => setMode(false));
    automaticModeButton.addEventListener('click', () => setMode(true));

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = clickedCell.getAttribute('data-index');

        if (gameState[clickedCellIndex] !== '' || checkWinner()) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;

        if (checkWinner()) {
            setTimeout(() => alert(`${getPlayerName(currentPlayer)} has won!`), 100);
            statusMessage.textContent = `${getPlayerName(currentPlayer)} has won!`;
            return;
        } else if (gameState.every(cell => cell !== '')) {
            setTimeout(() => alert('Draw!'), 100);
            statusMessage.textContent = 'Draw!';
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        if (isAutomaticMode && currentPlayer === 'O') {
            makeAIMove();
        }
    }

    function checkWinner() {
        return winningConditions.some(condition => {
            return condition.every(index => gameState[index] === currentPlayer);
        });
    }

    function restartGame() {
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => {
            cell.textContent = '';
        });
        statusMessage.textContent = '';
    }

    function setMode(automatic) {
        isAutomaticMode = automatic;
        restartGame();
        restartButton.classList.remove('hidden');
    }

    function makeAIMove() {
        const bestMove = findBestMove();
        gameState[bestMove] = currentPlayer;
        cells[bestMove].textContent = currentPlayer;

        if (checkWinner()) {
            setTimeout(() => alert(`${getPlayerName(currentPlayer)} has won!`), 100);
            statusMessage.textContent = `${getPlayerName(currentPlayer)} has won!`;
            return;
        } else if (gameState.every(cell => cell !== '')) {
            setTimeout(() => alert('Draw!'), 100);
            statusMessage.textContent = 'Draw!';
            return;
        }

        currentPlayer = 'X';
    }

    function findBestMove() {
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === '') {
                gameState[i] = currentPlayer;
                if (checkWinner()) {
                    gameState[i] = '';
                    return i;
                }
                gameState[i] = '';
            }
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === '') {
                gameState[i] = currentPlayer;
                if (checkWinner()) {
                    gameState[i] = '';
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    return i;
                }
                gameState[i] = '';
            }
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        const availableCells = gameState
            .map((cell, index) => (cell === '' ? index : null))
            .filter(index => index !== null);
        const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        return randomIndex;
    }

    function getPlayerName(player) {
        if (isAutomaticMode) {
            return player === 'X' ? 'User' : 'AI';
        } else {
            return player === 'X' ? 'User 1' : 'User 2';
        }
    }
});
