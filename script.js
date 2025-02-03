/* script.js */

// Initialize game
const game = new Chess();
const board = Chessboard('board', {
    position: 'start',
    draggable: true,
    onDrop: handleMove
});

let timeLeft = 30; // Initial time for each turn
let timer; // Timer variable

// Start timer when game begins
startTimer();

function startTimer() {
    clearInterval(timer);
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
    }, 1000);
}

// Handle move logic
function handleMove(source, target) {
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q' // Automatically promote to queen
    });

    if (move === null) {
        return 'snapback';
    } else {
        board.position(game.fen());
        updateStatus();
        startTimer(); // Restart timer after a valid move

        // If playing against AI
        if (opponentIsAI() && !game.game_over()) {
            window.setTimeout(makeAIMove, 250);
        }
    }
}

function makeAIMove() {
    const possibleMoves = game.moves();
    if (possibleMoves.length === 0) return;

    // Make random move for AI
    const randomIdx = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIdx]);
    board.position(game.fen());
    updateStatus();
}

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

function handleGameOver(result) {
    // Update player stats
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let users = JSON.parse(localStorage.getItem('users')) || [];

    const userIndex = users.findIndex(user => user.username === currentUser.username);

    if (result === 'Draw') {
        users[userIndex].draws += 1;
    } else if (result === 'White' && currentUser.color === 'white') {
        users[userIndex].wins += 1;
    } else if (result === 'Black' && currentUser.color === 'black') {
        users[userIndex].wins += 1;
    } else {
        users[userIndex].losses += 1;
    }

    localStorage.setItem('users', JSON.stringify(users));
    alert('Game Over! ' + result + ' wins.');
    window.location.href = 'leaderboard.html';
}

// Determine if opponent is AI or another player (for demo, we'll assume AI)
function opponentIsAI() {
    return true; // Change this logic based on game mode
}

// Surrender button
document.getElementById('surrender').addEventListener('click', function () {
    alert('You have surrendered.');
    // Handle surrender logic (update stats, redirect, etc.)
    window.location.href = 'lobby.html';
});

