/* game_logic.js */

// Initialize the game using chess.js
const game = new Chess();

// Initialize the board using chessboard.js
const board = Chessboard('board', {
    position: 'start',
    draggable: true,
    onDrop: handleMove
});

let timeLeft = 30; // Initial time for each turn
let timer; // Timer variable

// AI difficulty level (1 to 5)
let aiLevel = 3; // Default AI level (can be set by the user)

// Start the timer as the game begins
startTimer();

function startTimer() {
    clearInterval(timer); // Clear any existing timer
    timeLeft = 30; // Reset time
    document.getElementById('time-left').textContent = timeLeft;

    timer = setInterval(function () {
        timeLeft--;
        document.getElementById('time-left').textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Time's up! You lose.");
            handleGameOver(game.turn() === 'w' ? 'Black' : 'White');
        }
    }, 1000); // Update every second
}

// Handle the player's move
function handleMove(source, target) {
    // Attempt the move
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q' // Auto-promote to queen if applicable
    });

    // Illegal move
    if (move === null) {
        return 'snapback';
    } else {
        board.position(game.fen());
        updateStatus();
        startTimer(); // Restart the timer after a valid move

        // If playing against AI
        if (opponentIsAI() && !game.game_over()) {
            setTimeout(makeAIMove, 250); // AI makes a move after a short delay
        }
    }
}

// AI makes a move based on the selected difficulty level
function makeAIMove() {
    const possibleMoves = game.moves();
    if (possibleMoves.length === 0) return; // No possible moves

    let bestMove;

    switch (aiLevel) {
        case 1:
            // Level 1: Random move
            bestMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            break;
        case 2:
            // Level 2: Prefer capture moves
            bestMove = possibleMoves.find(move => move.includes('x')) || possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            break;
        case 3:
            // Level 3: Simple evaluation of moves
            bestMove = evaluateBestMove(game, possibleMoves);
            break;
        case 4:
            // Level 4: Minimax algorithm with depth 1
            bestMove = minimaxRoot(1, game, true);
            break;
        case 5:
            // Level 5: Minimax algorithm with depth 2
            bestMove = minimaxRoot(2, game, true);
            break;
        default:
            // Default to random move
            bestMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            break;
    }

    game.move(bestMove);
    board.position(game.fen());
    updateStatus();
}

// Evaluate moves for Level 3 AI
function evaluateBestMove(game, moves) {
    let bestMove = null;
    let bestValue = -Infinity;

    for (let move of moves) {
        game.move(move);
        let value = evaluateBoard(game.board());
        game.undo();

        if (value > bestValue) {
            bestValue = value;
            bestMove = move;
        }
    }
    return bestMove || moves[0];
}

// Evaluation function for the board
function evaluateBoard(board) {
    const pieceValues = {
        p: 1,
        n: 3,
        b: 3,
        r: 5,
        q: 9,
        k: 0
    };
    let totalValue = 0;

    for (let row of board) {
        for (let piece of row) {
            if (piece) {
                let value = pieceValues[piece.type];
                totalValue += piece.color === 'w' ? value : -value;
            }
        }
    }
    return totalValue;
}

// Minimax root function for AI Levels 4 and 5
function minimaxRoot(depth, game, isMaximizingPlayer) {
    const possibleMoves = game.moves();
    let bestMove = null;
    let bestValue = isMaximizingPlayer ? -Infinity : Infinity;

    for (let move of possibleMoves) {
        game.move(move);
        let value = minimax(depth - 1, game, !isMaximizingPlayer);
        game.undo();

        if (isMaximizingPlayer) {
            if (value > bestValue) {
                bestValue = value;
                bestMove = move;
            }
        } else {
            if (value < bestValue) {
                bestValue = value;
                bestMove = move;
            }
        }
    }
    return bestMove;
}

// Minimax algorithm
function minimax(depth, game, isMaximizingPlayer) {
    if (depth === 0 || game.game_over()) {
        return evaluateBoard(game.board());
    }

    const possibleMoves = game.moves();
    let bestValue = isMaximizingPlayer ? -Infinity : Infinity;

    for (let move of possibleMoves) {
        game.move(move);
        let value = minimax(depth - 1, game, !isMaximizingPlayer);
        game.undo();

        if (isMaximizingPlayer) {
            bestValue = Math.max(bestValue, value);
        } else {
            bestValue = Math.min(bestValue, value);
        }
    }
    return bestValue;
}

// Update the game status text
function updateStatus() {
    let status = '';

    if (game.in_checkmate()) {
        const winner = game.turn() === 'w' ? 'Black' : 'White';
        status = 'Game over, ' + winner + ' wins by checkmate.';
        handleGameOver(winner);
    } else if (game.in_draw()) {
        status = 'Game over, drawn position.';
        handleGameOver('Draw');
    } else {
        status = (game.turn() === 'w' ? 'White' : 'Black') + ' to move';

        if (game.in_check()) {
            status += ', in check!';
        }
    }

    document.getElementById('game-status').textContent = status;
}

// Handle the end of the game
function handleGameOver(result) {
    clearInterval(timer); // Stop the timer

    // Update player stats
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || { username: 'Guest' };
    let users = JSON.parse(localStorage.getItem('users')) || [];

    const userIndex = users.findIndex(user => user.username === currentUser.username);

    if (userIndex !== -1) {
        if (result === 'Draw') {
            users[userIndex].draws += 1;
        } else if (result === 'White' && currentUser.color === 'white') {
            users[userIndex].wins += 1;
        } else if (result === 'Black' && currentUser.color === 'black') {
            users[userIndex].wins += 1;
        } else {
            users[userIndex].losses += 1;
        }
        // Save updated stats
        localStorage.setItem('users', JSON.stringify(users));
    }

    alert('Game Over! ' + result + ' wins.');

    // Redirect to leaderboard or lobby
    window.location.href = 'leaderboard.html';
}

// Check if the opponent is AI
function opponentIsAI() {
    // For demo purposes, we assume AI. Update this logic for multiplayer.
    return true;
}

// Handle the surrender action
document.getElementById('surrender').addEventListener('click', function () {
    alert('You have surrendered.');
    handleGameOver(game.turn() === 'w' ? 'Black' : 'White');
});

// Set player's color (for stats tracking)
let currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || { username: 'Guest' };
currentUser.color = 'white'; // Assuming the player is always white for now
sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
