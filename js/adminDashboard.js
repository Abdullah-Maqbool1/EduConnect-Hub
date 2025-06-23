// Get current date and time (PKT, June 23, 2025, 08:06 PM)
const currentDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
});
document.getElementById('current-date').textContent = currentDate;

// Load data from localStorage
const users = JSON.parse(localStorage.getItem('users') || '[]');
const resources = JSON.parse(localStorage.getItem('resources') || '[]');
const feedback = JSON.parse(localStorage.getItem('feedback') || '[]');

// Update Stats Cards
document.getElementById('total-users').textContent = users.length;
document.getElementById('total-resources').textContent = resources.length;
document.getElementById('pending-feedback').textContent = feedback.filter(f => !f.resolved).length;

// Populate Recent Users Table
const recentUsers = users.slice(-5).reverse();
const usersTableBody = document.getElementById('users-table-body');
recentUsers.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${user.name || 'N/A'}</td>
        <td>${user.email || 'N/A'}</td>
        <td>${user.department || 'N/A'}</td>
        <td>${new Date(user.registeredDate || Date.now()).toLocaleDateString()}</td>
    `;
    usersTableBody.appendChild(row);
});

// Populate Pending Feedback List
const pendingFeedback = feedback.filter(f => !f.resolved).slice(0, 3);
const feedbackList = document.getElementById('feedback-list');
pendingFeedback.forEach(fb => {
    const li = document.createElement('li');
    li.textContent = `${fb.username || 'Anonymous'}: ${fb.message || 'No message'}`;
    feedbackList.appendChild(li);
});