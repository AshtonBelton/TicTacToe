// Setting up the board
const Gameboard = (() => {
    let board = Array(9).fill(null);
    
    const getBoard = () => board;

    const resetBoard = () => {
        board = Array(9).fill(null);
        DisplayController.renderBoard();
    };

    const setMark = (index, mark) => {
        if (index >= 0 && index < 9 && !board[index]) {
            board[index] = mark;
            return true;
        }
        return false;
    };

    return { getBoard, resetBoard, setMark };
})();

// Creating a player with a mark
const Player = (name, mark) => {
    return { name, mark };
}

// Managing the game
const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameActive = false;

    const startGame = (player1Name, player2Name) => {
        players = [Player(player1Name, 'X'), Player(player2Name, 'O')];
        currentPlayerIndex = 0;
        gameActive = true;
        Gameboard.resetBoard();
        DisplayController.updateStatus(`${players[0].name}'s turn`);
    };

    const playTurn = (index) => {
        if (!gameActive) return;
        if (Gameboard.setMark(index, players[currentPlayerIndex].mark)) {
            DisplayController.updateSquare(index);
            if (checkWinner(players[currentPlayerIndex].mark)) {
                gameActive = false;
                DisplayController.updateStatus(`${players[currentPlayerIndex].name} wins!`);
            } else if (Gameboard.getBoard().every(cell => cell)) {
                gameActive = false;
                DisplayController.updateStatus(`It's a tie!`);
            } else {
                currentPlayerIndex = 1 - currentPlayerIndex; // Switch player
                DisplayController.updateStatus(`${players[currentPlayerIndex].name}'s turn`);
            }
        }
    };

    const checkWinner = (mark) => {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winningCombinations.some(combination =>
            combination.every(index => Gameboard.getBoard()[index] === mark)
        );
    };

    return { startGame, playTurn };

})();

// Display and interaction of the DOM
const DisplayController = (() => {
    const boardElement = document.getElementById('gameboard');
    const statusElement = document.getElementById('status');
    const startButton = document.getElementById('start');
    const squares = document.querySelectorAll('.square');

    startButton.addEventListener('click', () => {
        const player1Name = document.getElementById('player1').value || 'Player 1';
        const player2Name = document.getElementById('player2').value || 'Player 2';
        GameController.startGame(player1Name, player2Name);
    });

    squares.forEach(square => {
        square.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            GameController.playTurn(index);
        });
    });

    const renderBoard = () => {
        Gameboard.getBoard().forEach((mark, index) => {
            squares[index].textContent = mark;
        });
    };

    const updateSquare = (index) => {
        squares[index].textContent = Gameboard.getBoard()[index];
    };

    const updateStatus = (message) => {
        statusElement.textContent = message;
    };

    return { renderBoard, updateSquare, updateStatus };
})();