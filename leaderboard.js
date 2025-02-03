/* leaderboard.js */

// Fetch users from localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// Sort users by wins
users.sort((a, b) => b.wins - a.wins);

const tableBody = document.getElementById('leaderboard-table');

users.forEach(user => {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = user.username;

    const winsCell = document.createElement('td');
    winsCell.textContent = user.wins;

    const lossesCell = document.createElement('td');
    lossesCell.textContent = user.losses;

    const drawsCell = document.createElement('td');
    drawsCell.textContent = user.draws;

    row.appendChild(nameCell);
    row.appendChild(winsCell);
    row.appendChild(lossesCell);
    row.appendChild(drawsCell);

    tableBody.appendChild(row);
});