/* auth.js */

// Toggle between login and register forms
document.getElementById('show-register').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});

// Simple hash function for passwords (for demo purposes only)
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        hash = hash * 31 + password.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

// Registration Handler
document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;

    if (username && password) {
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if username already exists
        if (users.find(user => user.username === username)) {
            alert('Username already exists. Please choose another one.');
            return;
        }

        // Add new user
        users.push({
            username: username,
            password: hashPassword(password),
            wins: 0,
            losses: 0,
            draws: 0
        });

        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful! Please log in.');

        // Switch to login form
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    }
});

// Login Handler
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.username === username && user.password === hashPassword(password));

    if (user) {
        // Save current user session
        sessionStorage.setItem('currentUser', JSON.stringify(user));

        // Redirect to lobby
        window.location.href = 'lobby.html';
    } else {
        alert('Invalid username or password.');
    }
});