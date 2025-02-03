/* script.js */

// Initialize game
const game = new Chess();
const board = Chessboard('board', {
    position: 'start',
    draggable: true,
    onDrop: handleMove
});

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
        updateStatus();

        // If playing against AI
        if (opponentIsAI()) {
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
        status = 'Game over, ' + (game.turn() === 'w' ? 'Black' : 'White') + ' wins by checkmate.';
    } else if (game.in_draw()) {
        status = 'Game over, drawn position.';
    } else {
        status = (game.turn() === 'w' ? 'White' : 'Black') + ' to move';

        if (game.in_check()) {
            status += ', in check!';
        }
    }

    document.getElementById('game-status').textContent = status;
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