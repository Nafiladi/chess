/* lobby.js */

// Check if user is logged in
let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
if (!currentUser) {
    alert('Please log in first.');
    window.location.href = 'index.html';
}

// Display username
document.getElementById('user-name').textContent = currentUser.username;

// Room management
let rooms = JSON.parse(localStorage.getItem('rooms')) || [];

// Function to display rooms
function displayRooms() {
    const roomList = document.getElementById('room-list');
    roomList.innerHTML = '';

    rooms.forEach(room => {
        const li = document.createElement('li');
        li.textContent = `Room ID: ${room.id} | Players: ${room.players}/2`;
        roomList.appendChild(li);
    });
}

// Create a new room
document.getElementById('create-room').addEventListener('click', function () {
    const roomId = 'room-' + Date.now();
    const newRoom = {
        id: roomId,
        players: 1,
        host: currentUser.username
    };
    rooms.push(newRoom);
    localStorage.setItem('rooms', JSON.stringify(rooms));
    sessionStorage.setItem('currentRoom', JSON.stringify(newRoom));

    // Redirect to game page
    window.location.href = 'game.html';
});

// Join a room
document.getElementById('join-room').addEventListener('click', function () {
    const roomId = document.getElementById('join-room-id').value.trim();
    const room = rooms.find(r => r.id === roomId);

    if (room) {
        if (room.players < 2) {
            room.players += 1;
            localStorage.setItem('rooms', JSON.stringify(rooms));
            sessionStorage.setItem('currentRoom', JSON.stringify(room));

            // Redirect to game page
            window.location.href = 'game.html';
        } else {
            alert('Room is full.');
        }
    } else {
        alert('Room not found.');
    }
});

// Display rooms on page load
displayRooms();

// Logout
document.getElementById('logout').addEventListener('click', function () {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});