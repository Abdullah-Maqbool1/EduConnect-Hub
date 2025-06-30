// StudentDashboard.js
class StudentDashboard {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is logged in
        this.checkAuthStatus();
        
        // If user exists, load dashboard data
        if (this.currentUser) {
            this.loadDashboardData();
            this.bindEvents();
        }
    }

    checkAuthStatus() {
        // Check if user is logged in using your login system structure
        const isLoggedIn = localStorage.getItem('loggedIn');
        const userRole = localStorage.getItem('role');
        
        if (!isLoggedIn || isLoggedIn !== 'true') {
            this.showLoginModal();
            return;
        }

        // Check if user is a student
        if (userRole !== 'student') {
            alert('Access denied. This dashboard is for students only.');
            window.location.href = 'accountsPage.html'; // Redirect to login
            return;
        }

        // Create user object from stored login data
        this.currentUser = {
            name: localStorage.getItem('name'),
            email: localStorage.getItem('email'),
            role: localStorage.getItem('role'),
            id: localStorage.getItem('email') // Use email as unique identifier
        };
        
        console.log('Current user:', this.currentUser);
    }

    showLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'flex';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '1000';

            const modalContent = modal.querySelector('.modal-content');
            modalContent.style.backgroundColor = 'white';
            modalContent.style.padding = '2rem';
            modalContent.style.borderRadius = '8px';
            modalContent.style.textAlign = 'center';
            modalContent.style.maxWidth = '400px';

            document.getElementById('login-redirect-btn').addEventListener('click', () => {
                window.location.href = 'accountsPage.html'; // Updated to match your login page
            });
        }
    }

    loadDashboardData() {
        // Load user-specific data
        this.loadUserInfo();
        this.loadStatistics();
        this.loadRecentActivity();
        this.loadAchievements();
    }

    loadUserInfo() {
        const welcomeSpan = document.getElementById('student-name-welcome');
        if (welcomeSpan && this.currentUser) {
            welcomeSpan.textContent = this.currentUser.name || 'Student';
        }
    }

    loadStatistics() {
        // Get user-specific statistics from localStorage or generate default ones
        const userStats = this.getUserStats();
        
        document.getElementById('total-courses').textContent = userStats.totalCourses;
        document.getElementById('pending-feedback').textContent = userStats.pendingFeedback;
        document.getElementById('library-resources').textContent = userStats.libraryResources;
        document.getElementById('this-month').textContent = userStats.thisMonth;
    }

    getUserStats() {
        // Try to get user-specific stats from localStorage
        const statsKey = `userStats_${this.currentUser.email}`; // Use email as unique key
        const savedStats = localStorage.getItem(statsKey);
        
        if (savedStats) {
            return JSON.parse(savedStats);
        }

        // Generate default stats if none exist
        const defaultStats = {
            totalCourses: Math.floor(Math.random() * 15) + 5, // 5-20 courses
            pendingFeedback: Math.floor(Math.random() * 8) + 1, // 1-8 pending
            libraryResources: Math.floor(Math.random() * 100) + 20, // 20-120 resources
            thisMonth: Math.floor(Math.random() * 12) + 3 // 3-15 this month
        };

        // Save the generated stats
        localStorage.setItem(statsKey, JSON.stringify(defaultStats));
        return defaultStats;
    }

    loadRecentActivity() {
        const activityList = document.getElementById('activity-list');
        const userActivities = this.getUserActivities();

        if (userActivities.length === 0) {
            activityList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-dot gray"></div>
                    <div class="activity-content">
                        <div class="activity-title">No recent activity</div>
                        <div class="activity-time">Start by uploading materials or submitting feedback</div>
                    </div>
                </div>
            `;
            return;
        }

        activityList.innerHTML = userActivities.map(activity => `
            <div class="activity-item">
                <div class="activity-dot ${activity.type}"></div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    getUserActivities() {
        const activitiesKey = `userActivities_${this.currentUser.email}`;
        const savedActivities = localStorage.getItem(activitiesKey);
        
        if (savedActivities) {
            return JSON.parse(savedActivities);
        }

        // Generate default activities if none exist
        const defaultActivities = [
            {
                title: "Welcome to EduConnect Hub!",
                time: "Account created successfully",
                type: "green"
            },
            {
                title: "Profile Setup Complete",
                time: "Ready to start your learning journey",
                type: "orange"
            }
        ];

        localStorage.setItem(activitiesKey, JSON.stringify(defaultActivities));
        return defaultActivities;
    }

    addActivity(title, type = 'gray') {
        const activitiesKey = `userActivities_${this.currentUser.email}`;
        const activities = this.getUserActivities();
        
        const newActivity = {
            title: title,
            time: this.getRelativeTime(new Date()),
            type: type,
            timestamp: new Date().toISOString()
        };

        activities.unshift(newActivity);
        
        // Keep only last 10 activities
        if (activities.length > 10) {
            activities.splice(10);
        }

        localStorage.setItem(activitiesKey, JSON.stringify(activities));
        this.loadRecentActivity();
    }

    loadAchievements() {
        const achievementsList = document.getElementById('achievements-list');
        const userAchievements = this.getUserAchievements();

        if (userAchievements.length === 0) {
            achievementsList.innerHTML = `
                <div class="achievement-item">
                    <div class="achievement-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="achievement-content">
                        <div class="achievement-title">Getting Started</div>
                        <div class="achievement-desc">Complete your first action to earn achievements</div>
                    </div>
                </div>
            `;
            return;
        }

        achievementsList.innerHTML = userAchievements.map(achievement => `
            <div class="achievement-item">
                <div class="achievement-icon">
                    <i class="fas ${achievement.icon}"></i>
                </div>
                <div class="achievement-content">
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                </div>
            </div>
        `).join('');
    }

    getUserAchievements() {
        const achievementsKey = `userAchievements_${this.currentUser.email}`;
        const savedAchievements = localStorage.getItem(achievementsKey);
        
        if (savedAchievements) {
            return JSON.parse(savedAchievements);
        }

        // Generate default achievements based on user stats
        const stats = this.getUserStats();
        const defaultAchievements = [];

        // Welcome achievement for all new users
        defaultAchievements.push({
            title: "Welcome to EduConnect!",
            description: `Welcome ${this.currentUser.name}`,
            icon: "fa-user-plus"
        });

        if (stats.totalCourses >= 10) {
            defaultAchievements.push({
                title: "Course Explorer",
                description: `Enrolled in ${stats.totalCourses} courses`,
                icon: "fa-book"
            });
        }

        if (stats.libraryResources >= 50) {
            defaultAchievements.push({
                title: "Knowledge Seeker",
                description: `Accessed ${stats.libraryResources} resources`,
                icon: "fa-book-open"
            });
        }

        localStorage.setItem(achievementsKey, JSON.stringify(defaultAchievements));
        return defaultAchievements;
    }

    addAchievement(title, description, icon) {
        const achievementsKey = `userAchievements_${this.currentUser.email}`;
        const achievements = this.getUserAchievements();
        
        // Check if achievement already exists
        const exists = achievements.some(achievement => achievement.title === title);
        if (exists) return;

        const newAchievement = {
            title: title,
            description: description,
            icon: icon,
            earnedAt: new Date().toISOString()
        };

        achievements.unshift(newAchievement);
        localStorage.setItem(achievementsKey, JSON.stringify(achievements));
        this.loadAchievements();
        
        // Add activity for new achievement
        this.addActivity(`Earned "${title}" achievement`, 'orange');
    }

    bindEvents() {
        // Quick action buttons
        document.getElementById('upload-material-btn').addEventListener('click', () => {
            this.handleUploadMaterial();
        });

        document.getElementById('submit-feedback-btn').addEventListener('click', () => {
            this.handleSubmitFeedback();
        });

        document.getElementById('browse-library-btn').addEventListener('click', () => {
            this.handleBrowseLibrary();
        });

        document.getElementById('view-all-activity').addEventListener('click', () => {
            this.handleViewAllActivity();
        });

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Update stats periodically
        setInterval(() => {
            this.updateTimeStamps();
        }, 60000); // Update every minute
    }

    handleUploadMaterial() {
         window.location.href = 'course-material.html';
        // Check if CourseMaterialPage.html exists, otherwise show placeholder
        // if (this.pageExists('CourseMaterialPage.html')) {
           
        // } else {
        //     alert('Upload Material feature coming soon!');
        //     this.addActivity('Attempted to upload material', 'orange');
        // }
    }

    handleSubmitFeedback() {
         window.location.href = 'feedback.html';
        // if (this.pageExists('feedback.html')) {
           
        // } else {
        //     alert('Feedback feature coming soon!');
        //     this.addActivity('Attempted to submit feedback', 'blue');
        // }
    }

    handleBrowseLibrary() {
        window.location.href = 'elibrary.html';
        // if (this.pageExists('elibrary.html')) {
            
        // } else {
        //     alert('Library feature coming soon!');
        //     this.addActivity('Browsed library', 'green');
        //     this.updateStats('libraryResources', 1);
        // }
    }

    handleViewAllActivity() {
        const activities = this.getUserActivities();
        if (activities.length === 0) {
            alert('No activities to show yet!');
            return;
        }

        let activityText = 'Recent Activities:\n\n';
        activities.forEach((activity, index) => {
            activityText += `${index + 1}. ${activity.title} - ${activity.time}\n`;
        });

        alert(activityText);
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            // Clear login session data
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('name');
            localStorage.removeItem('email');
            localStorage.removeItem('role');
            
            // Add logout activity before clearing user data
            this.addActivity('Logged out', 'gray');
            
            // Redirect to login page
            window.location.href = 'accountsPage.html';
        }
    }

    pageExists(url) {
        // Simple check - in a real app, you might want to use fetch or similar
        // For now, return false to show placeholder messages
        return false;
    }

    updateStats(statName, increment = 1) {
        const statsKey = `userStats_${this.currentUser.email}`;
        const stats = this.getUserStats();
        
        if (stats[statName] !== undefined) {
            stats[statName] += increment;
            localStorage.setItem(statsKey, JSON.stringify(stats));
            this.loadStatistics();
        }
    }

    updateTimeStamps() {
        // Update relative time stamps for activities
        const activities = this.getUserActivities();
        let updated = false;

        activities.forEach(activity => {
            if (activity.timestamp) {
                const newTime = this.getRelativeTime(new Date(activity.timestamp));
                if (newTime !== activity.time) {
                    activity.time = newTime;
                    updated = true;
                }
            }
        });

        if (updated) {
            const activitiesKey = `userActivities_${this.currentUser.email}`;
            localStorage.setItem(activitiesKey, JSON.stringify(activities));
            this.loadRecentActivity();
        }
    }

    getRelativeTime(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
        
        return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    }

    // Utility method to simulate user interactions for demo
    simulateUserActivity() {
        const activities = [
            { title: "Completed Data Structures Quiz", type: "green" },
            { title: "Downloaded Algorithm Notes", type: "orange" },
            { title: "Submitted Project Proposal", type: "blue" },
            { title: "Joined Study Group", type: "purple" }
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        this.addActivity(randomActivity.title, randomActivity.type);
        
        // Randomly update stats
        if (Math.random() > 0.5) {
            this.updateStats('thisMonth', 1);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.studentDashboard = new StudentDashboard();
    
    // For demo purposes, simulate some activity every 30 seconds
    // Remove this in production
    setInterval(() => {
        if (window.studentDashboard.currentUser && Math.random() > 0.7) {
            window.studentDashboard.simulateUserActivity();
        }
    }, 30000);
});

// Global functions for external use
window.addStudentActivity = function(title, type = 'gray') {
    if (window.studentDashboard) {
        window.studentDashboard.addActivity(title, type);
    }
};

window.addStudentAchievement = function(title, description, icon) {
    if (window.studentDashboard) {
        window.studentDashboard.addAchievement(title, description, icon);
    }
};

window.updateStudentStats = function(statName, increment = 1) {
    if (window.studentDashboard) {
        window.studentDashboard.updateStats(statName, increment);
    }
};