class FeedbackManager {
    constructor() {
        this.currentUser = null;
        this.feedbackData = [];
        this.filteredData = [];
        this.init();
    }

    init() {
        // Check authentication status
        this.checkAuthStatus();
        
        if (this.currentUser) {
            this.loadFeedbackData();
            this.bindEvents();
            this.renderFeedback();
            this.updateStatistics();
        }
    }

    checkAuthStatus() {
        const isLoggedIn = localStorage.getItem('loggedIn');
        const userRole = localStorage.getItem('role');
        
        if (!isLoggedIn || isLoggedIn !== 'true') {
            this.redirectToLogin();
            return;
        }

        this.currentUser = {
            name: localStorage.getItem('name'),
            email: localStorage.getItem('email'),
            role: localStorage.getItem('role')
        };

        console.log('Current user:', this.currentUser);
    }

    redirectToLogin() {
        alert('Please log in to access the feedback page.');
        window.location.href = 'accountsPage.html';
    }

    loadFeedbackData() {
        const feedbackKey = `userFeedback_${this.currentUser.email}`;
        const savedFeedback = localStorage.getItem(feedbackKey);
        
        if (savedFeedback) {
            this.feedbackData = JSON.parse(savedFeedback);
        } else {
            // Generate sample feedback data for new users
            this.generateSampleFeedback();
        }

        this.filteredData = [...this.feedbackData];
    }

    generateSampleFeedback() {
        const sampleFeedback = [
            {
                id: this.generateId(),
                type: 'teacher',
                title: 'abc',
                rating: 5,
                comment: 'Excellent teaching methodology and very helpful during office hours.',
                status: 'reviewed',
                date: '2024-01-15',
                timestamp: new Date('2024-01-15').toISOString()
            },
            {
                id: this.generateId(),
                type: 'course',
                title: 'web engineering',
                rating: 4,
                comment: 'Great course content but could use more practical examples.',
                status: 'pending',
                date: '2024-01-12',
                timestamp: new Date('2024-01-12').toISOString()
            },
            {
                id: this.generateId(),
                type: 'material',
                title: 'Github',
                rating: 5,
                comment: 'Very comprehensive and well-structured notes.',
                status: 'reviewed',
                date: '2024-01-10',
                timestamp: new Date('2024-01-10').toISOString()
            },
            {
                id: this.generateId(),
                type: 'teacher',
                title: 'xyz',
                rating: 4,
                comment: 'Good practical approach, would appreciate more theory coverage.',
                status: 'pending',
                date: '2024-01-08',
                timestamp: new Date('2024-01-08').toISOString()
            },
            {
                id: this.generateId(),
                type: 'course',
                title: 'Software Engineering',
                rating: 3,
                comment: 'Course pace is a bit slow, content could be more updated.',
                status: 'reviewed',
                date: '2024-01-05',
                timestamp: new Date('2024-01-05').toISOString()
            }
        ];

        this.feedbackData = sampleFeedback;
        this.saveFeedbackData();
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveFeedbackData() {
        const feedbackKey = `userFeedback_${this.currentUser.email}`;
        localStorage.setItem(feedbackKey, JSON.stringify(this.feedbackData));
    }

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Filter functionality
        const typeFilter = document.getElementById('typeFilter');
        const statusFilter = document.getElementById('statusFilter');
        const dateFilter = document.getElementById('dateFilter');

        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.applyFilters());
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.applyFilters());
        }
        if (dateFilter) {
            dateFilter.addEventListener('change', () => this.applyFilters());
        }

        // Add new feedback button (if exists)
        const addFeedbackBtn = document.getElementById('addFeedbackBtn');
        if (addFeedbackBtn) {
            addFeedbackBtn.addEventListener('click', () => this.showAddFeedbackModal());
        }

        // Clear filters button
        this.addClearFiltersButton();
    }

    handleSearch(searchTerm) {
        if (!searchTerm.trim()) {
            this.applyFilters();
            return;
        }

        const term = searchTerm.toLowerCase();
        this.filteredData = this.feedbackData.filter(feedback => 
            feedback.title.toLowerCase().includes(term) ||
            feedback.comment.toLowerCase().includes(term) ||
            feedback.type.toLowerCase().includes(term)
        );

        this.renderFeedback();
    }

    applyFilters() {
        const typeFilter = document.getElementById('typeFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const dateFilter = document.getElementById('dateFilter').value;

        this.filteredData = this.feedbackData.filter(feedback => {
            let typeMatch = !typeFilter || feedback.type === typeFilter;
            let statusMatch = !statusFilter || feedback.status === statusFilter;
            let dateMatch = !dateFilter || feedback.date === dateFilter;

            return typeMatch && statusMatch && dateMatch;
        });

        this.renderFeedback();
    }

    addClearFiltersButton() {
        const controlsSection = document.querySelector('.search-filter-row');
        if (controlsSection && !document.getElementById('clearFiltersBtn')) {
            const clearBtn = document.createElement('button');
            clearBtn.id = 'clearFiltersBtn';
            clearBtn.className = 'btn btn-secondary';
            clearBtn.innerHTML = '<i class="fas fa-times"></i> Clear Filters';
            clearBtn.addEventListener('click', () => this.clearFilters());
            controlsSection.appendChild(clearBtn);
        }
    }

    clearFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('typeFilter').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('dateFilter').value = '';
        
        this.filteredData = [...this.feedbackData];
        this.renderFeedback();
    }

    renderFeedback() {
        const feedbackList = document.getElementById('feedbackList');
        
        if (this.filteredData.length === 0) {
            feedbackList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <h3>No feedback found</h3>
                    <p>Try adjusting your search or filters, or add some feedback.</p>
                </div>
            `;
            return;
        }

        feedbackList.innerHTML = this.filteredData.map(feedback => 
            this.createFeedbackCard(feedback)
        ).join('');

        // Add click events to feedback cards
        this.addCardClickEvents();
    }

    createFeedbackCard(feedback) {
        const stars = this.generateStarRating(feedback.rating);
        const statusIcon = feedback.status === 'reviewed' ? 'fas fa-check-circle' : 'fas fa-clock';
        
        return `
            <div class="feedback-card" data-id="${feedback.id}" data-type="${feedback.type}" data-status="${feedback.status}" data-date="${feedback.date}">
                <div class="feedback-header">
                    <div class="feedback-main">
                        <div class="feedback-badges">
                            <span class="badge ${feedback.type}">${this.capitalizeFirst(feedback.type)}</span>
                            <span class="badge ${feedback.status}">${this.capitalizeFirst(feedback.status)}</span>
                        </div>
                        <h3 class="feedback-title">${feedback.title}</h3>
                        <div class="star-rating">
                            ${stars}
                            <span class="rating-text">${feedback.rating}/5 stars</span>
                        </div>
                    </div>
                    <div class="status-indicator ${feedback.status}">
                        <i class="${statusIcon}"></i>
                        <span>${this.capitalizeFirst(feedback.status)}</span>
                    </div>
                </div>
                <div class="feedback-comment">
                    "${feedback.comment}"
                </div>
                <div class="feedback-meta">
                    <div class="meta-item">
                        <i class="fas fa-calendar"></i>
                        <span>Submitted on ${this.formatDate(feedback.date)}</span>
                    </div>
                    <div class="feedback-actions">
                        <button class="btn-sm btn-edit" onclick="feedbackManager.editFeedback('${feedback.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-sm btn-delete" onclick="feedbackManager.deleteFeedback('${feedback.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star star"></i>';
            } else {
                stars += '<i class="fas fa-star star empty"></i>';
            }
        }
        return stars;
    }

    addCardClickEvents() {
        const cards = document.querySelectorAll('.feedback-card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.feedback-actions')) {
                    const feedbackId = card.dataset.id;
                    this.showFeedbackDetails(feedbackId);
                }
            });
        });
    }

    showFeedbackDetails(feedbackId) {
        const feedback = this.feedbackData.find(f => f.id === feedbackId);
        if (!feedback) return;

        alert(`Feedback Details:\n\nTitle: ${feedback.title}\nType: ${feedback.type}\nRating: ${feedback.rating}/5\nStatus: ${feedback.status}\nDate: ${feedback.date}\n\nComment: ${feedback.comment}`);
    }

    editFeedback(feedbackId) {
        const feedback = this.feedbackData.find(f => f.id === feedbackId);
        if (!feedback) return;

        const newComment = prompt('Edit your comment:', feedback.comment);
        if (newComment !== null && newComment.trim() !== '') {
            feedback.comment = newComment.trim();
            feedback.status = 'pending'; // Reset status when edited
            this.saveFeedbackData();
            this.renderFeedback();
            this.updateStatistics();
            
            // Add activity if integrated with dashboard
            this.addActivity(`Edited feedback for ${feedback.title}`, 'orange');
        }
    }

    deleteFeedback(feedbackId) {
        const feedback = this.feedbackData.find(f => f.id === feedbackId);
        if (!feedback) return;

        if (confirm(`Are you sure you want to delete feedback for "${feedback.title}"?`)) {
            this.feedbackData = this.feedbackData.filter(f => f.id !== feedbackId);
            this.filteredData = this.filteredData.filter(f => f.id !== feedbackId);
            this.saveFeedbackData();
            this.renderFeedback();
            this.updateStatistics();
            
            // Add activity if integrated with dashboard
            this.addActivity(`Deleted feedback for ${feedback.title}`, 'gray');
        }
    }

    updateStatistics() {
        const total = this.feedbackData.length;
        const reviewed = this.feedbackData.filter(f => f.status === 'reviewed').length;
        const pending = this.feedbackData.filter(f => f.status === 'pending').length;
        const avgRating = total > 0 ? (this.feedbackData.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1) : 0;

        // Update stat cards
        document.querySelector('.stat-number.total').textContent = total;
        document.querySelector('.stat-number.reviewed').textContent = reviewed;
        document.querySelector('.stat-number.pending').textContent = pending;
        
        // Update average rating
        const avgRatingElement = document.querySelector('.stats-section .stat-card:last-child .stat-number');
        if (avgRatingElement) {
            avgRatingElement.textContent = avgRating;
        }
    }

    addFeedback(feedbackData) {
        const newFeedback = {
            id: this.generateId(),
            ...feedbackData,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        this.feedbackData.unshift(newFeedback);
        this.saveFeedbackData();
        this.renderFeedback();
        this.updateStatistics();
        
        // Add activity if integrated with dashboard
        this.addActivity(`Submitted feedback for ${newFeedback.title}`, 'blue');
    }

    // Utility functions
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    addActivity(title, type = 'gray') {
        // Integration with student dashboard if available
        if (window.addStudentActivity) {
            window.addStudentActivity(title, type);
        }
    }

    // Export data functionality
    exportFeedback() {
        const dataStr = JSON.stringify(this.feedbackData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `feedback_export_${this.currentUser.email}_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize feedback manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.feedbackManager = new FeedbackManager();
});

// Global functions for external use
window.addNewFeedback = function(title, type, rating, comment) {
    if (window.feedbackManager) {
        window.feedbackManager.addFeedback({
            title: title,
            type: type,
            rating: rating,
            comment: comment
        });
    }
};

window.exportUserFeedback = function() {
    if (window.feedbackManager) {
        window.feedbackManager.exportFeedback();
    }
};