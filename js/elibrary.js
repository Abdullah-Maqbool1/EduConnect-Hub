// E-Library JavaScript Implementation
// ===================================

class ELibrary {
    constructor() {
        this.resources = this.loadResources();
        this.currentUser = this.getCurrentUser();
        this.filteredResources = [...this.resources];
        this.currentView = 'grid';
        
        this.init();
    }

    // Initialize the application
    init() {
        this.setupEventListeners();
        this.handleUserRole();
        this.renderResources();
        this.updateAnalytics();
        this.setupToastSystem();
    }

    // =====================
    // LOCAL STORAGE METHODS
    // =====================

    loadResources() {
        const stored = localStorage.getItem('elibrary_resources');
        return stored ? JSON.parse(stored) : this.getDefaultResources();
    }

    saveResources() {
        localStorage.setItem('elibrary_resources', JSON.stringify(this.resources));
    }

    getCurrentUser() {
        const role = localStorage.getItem('role') || 'student';
        const userId = localStorage.getItem('userId') || 'user_' + Date.now();
        localStorage.setItem('userId', userId);
        return { role, userId };
    }

    getDefaultResources() {
        return [
            {
                id: 'res_001',
                title: 'Introduction to Data Structures',
                type: 'PDF',
                subject: 'Computer Science',
                url: 'https://example.com/data-structures.pdf',
                description: 'Comprehensive guide to basic data structures including arrays, linked lists, stacks, and queues.',
                addedOn: new Date('2024-01-15').toISOString(),
                views: 45,
                bookmarks: 12,
                addedBy: 'teacher_001'
            },
            {
                id: 'res_002',
                title: 'Calculus Fundamentals Video Series',
                type: 'Video',
                subject: 'Mathematics',
                url: 'https://youtube.com/watch?v=example',
                description: 'Complete video series covering differential and integral calculus with practical examples.',
                addedOn: new Date('2024-01-10').toISOString(),
                views: 78,
                bookmarks: 23,
                addedBy: 'teacher_002'
            },
            {
                id: 'res_003',
                title: 'Physics Simulation Lab',
                type: 'Link',
                subject: 'Physics',
                url: 'https://physicslab.example.com',
                description: 'Interactive physics simulations for understanding motion, forces, and energy.',
                addedOn: new Date('2024-01-08').toISOString(),
                views: 34,
                bookmarks: 8,
                addedBy: 'teacher_001'
            }
        ];
    }

    getUserBookmarks() {
        const stored = localStorage.getItem(`bookmarks_${this.currentUser.userId}`);
        return stored ? JSON.parse(stored) : [];
    }

    saveUserBookmarks(bookmarks) {
        localStorage.setItem(`bookmarks_${this.currentUser.userId}`, JSON.stringify(bookmarks));
    }

    // =====================
    // EVENT LISTENERS SETUP
    // =====================

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Filter functionality
        const subjectFilter = document.getElementById('subject-filter');
        const typeFilter = document.getElementById('type-filter');
        
        subjectFilter.addEventListener('change', () => this.applyFilters());
        typeFilter.addEventListener('change', () => this.applyFilters());

        // View toggle
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleView(e.target.closest('.view-btn').dataset.view));
        });

        // Upload form (teacher only)
        const uploadForm = document.getElementById('upload-form');
        const toggleUploadBtn = document.getElementById('toggle-upload');
        const clearFormBtn = document.getElementById('clear-form');

        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => this.handleResourceUpload(e));
        }
        
        if (toggleUploadBtn) {
            toggleUploadBtn.addEventListener('click', () => this.toggleUploadPanel());
        }
        
        if (clearFormBtn) {
            clearFormBtn.addEventListener('click', () => this.clearUploadForm());
        }
    }

    // =====================
    // USER ROLE HANDLING
    // =====================

    handleUserRole() {
        const uploadPanel = document.getElementById('upload-panel');
        
        if (this.currentUser.role === 'teacher') {
            if (uploadPanel) {
                uploadPanel.style.display = 'block';
            }
        } else {
            if (uploadPanel) {
                uploadPanel.style.display = 'none';
            }
        }
    }

    // =====================
    // SEARCH AND FILTER
    // =====================

    handleSearch(searchTerm) {
        this.searchTerm = searchTerm.toLowerCase().trim();
        this.applyFilters();
    }

    applyFilters() {
        const subjectFilter = document.getElementById('subject-filter').value;
        const typeFilter = document.getElementById('type-filter').value;

        this.filteredResources = this.resources.filter(resource => {
            const matchesSearch = !this.searchTerm || 
                resource.title.toLowerCase().includes(this.searchTerm) ||
                resource.description.toLowerCase().includes(this.searchTerm);
            
            const matchesSubject = !subjectFilter || resource.subject === subjectFilter;
            const matchesType = !typeFilter || resource.type === typeFilter;

            return matchesSearch && matchesSubject && matchesType;
        });

        this.renderResources();
    }

    // =====================
    // VIEW TOGGLE
    // =====================

    toggleView(view) {
        this.currentView = view;
        
        // Update button states
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Update grid class
        const resourcesGrid = document.getElementById('resources-grid');
        if (view === 'list') {
            resourcesGrid.classList.add('list-view');
        } else {
            resourcesGrid.classList.remove('list-view');
        }
    }

    // =====================
    // RESOURCE RENDERING
    // =====================

    renderResources() {
        const resourcesGrid = document.getElementById('resources-grid');
        const emptyState = document.getElementById('empty-state');

        if (this.filteredResources.length === 0) {
            resourcesGrid.style.display = 'none';
            emptyState.classList.add('show');
            return;
        }

        resourcesGrid.style.display = 'grid';
        emptyState.classList.remove('show');

        resourcesGrid.innerHTML = this.filteredResources.map(resource => 
            this.createResourceCard(resource)
        ).join('');

        // Add event listeners to new cards
        this.attachResourceEventListeners();
    }

    createResourceCard(resource) {
        const userBookmarks = this.getUserBookmarks();
        const isBookmarked = userBookmarks.includes(resource.id);
        const addedDate = new Date(resource.addedOn).toLocaleDateString();

        const bookmarkButton = this.currentUser.role === 'student' ? `
            <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                    data-resource-id="${resource.id}" 
                    title="${isBookmarked ? 'Remove bookmark' : 'Add bookmark'}">
                <i class="fas fa-bookmark"></i>
            </button>
        ` : '';

        return `
            <div class="resource-card" data-resource-id="${resource.id}">
                <div class="resource-header">
                    <div class="resource-icon ${resource.type.toLowerCase()}">
                        <i class="fas fa-${this.getResourceIcon(resource.type)}"></i>
                    </div>
                    <h3 class="resource-title">${resource.title}</h3>
                </div>
                
                <div class="resource-meta">
                    <span class="resource-subject">${resource.subject}</span>
                    <div class="resource-stats">
                        <span><i class="fas fa-eye"></i> ${resource.views}</span>
                        <span><i class="fas fa-bookmark"></i> ${resource.bookmarks}</span>
                    </div>
                </div>
                
                <div class="resource-description">
                    ${resource.description}
                </div>
                
                <div class="resource-actions">
                    <div class="action-buttons">
                        <a href="${resource.url}" target="_blank" class="btn btn-primary btn-small" 
                           data-resource-id="${resource.id}">
                            <i class="fas fa-external-link-alt"></i> Open
                        </a>
                        ${bookmarkButton}
                    </div>
                    <div class="resource-date">
                        Added ${addedDate}
                    </div>
                </div>
            </div>
        `;
    }

    getResourceIcon(type) {
        const icons = {
            'PDF': 'file-pdf',
            'Video': 'play-circle',
            'Link': 'link'
        };
        return icons[type] || 'file';
    }

    attachResourceEventListeners() {
        // Open resource links
        document.querySelectorAll('.btn-primary[data-resource-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const resourceId = e.target.closest('[data-resource-id]').dataset.resourceId;
                this.incrementViews(resourceId);
            });
        });

        // Bookmark buttons
        document.querySelectorAll('.bookmark-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const resourceId = e.target.closest('[data-resource-id]').dataset.resourceId;
                this.toggleBookmark(resourceId);
            });
        });
    }

    // =====================
    // RESOURCE INTERACTIONS
    // =====================

    incrementViews(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (resource) {
            resource.views++;
            this.saveResources();
            this.updateAnalytics();
        }
    }

    toggleBookmark(resourceId) {
        if (this.currentUser.role !== 'student') return;

        const userBookmarks = this.getUserBookmarks();
        const resource = this.resources.find(r => r.id === resourceId);
        
        if (!resource) return;

        const bookmarkIndex = userBookmarks.indexOf(resourceId);
        const isCurrentlyBookmarked = bookmarkIndex !== -1;

        if (isCurrentlyBookmarked) {
            userBookmarks.splice(bookmarkIndex, 1);
            resource.bookmarks--;
            this.showToast('Bookmark removed', 'success');
        } else {
            userBookmarks.push(resourceId);
            resource.bookmarks++;
            this.showToast('Resource bookmarked', 'success');
        }

        this.saveUserBookmarks(userBookmarks);
        this.saveResources();
        this.renderResources();
        this.updateAnalytics();
    }

    // =====================
    // UPLOAD FUNCTIONALITY
    // =====================

    toggleUploadPanel() {
        const formContainer = document.getElementById('upload-form-container');
        const toggleBtn = document.getElementById('toggle-upload');
        const icon = toggleBtn.querySelector('i');

        if (formContainer.classList.contains('collapsed')) {
            formContainer.classList.remove('collapsed');
            icon.className = 'fas fa-chevron-up';
        } else {
            formContainer.classList.add('collapsed');
            icon.className = 'fas fa-chevron-down';
        }
    }

    handleResourceUpload(e) {
        e.preventDefault();
        
        if (this.currentUser.role !== 'teacher') {
            this.showToast('Only teachers can upload resources', 'error');
            return;
        }

        const formData = new FormData(e.target);
        const newResource = {
            id: 'res_' + Date.now(),
            title: document.getElementById('resource-title').value.trim(),
            type: document.getElementById('resource-type').value,
            subject: document.getElementById('resource-subject').value,
            url: document.getElementById('resource-url').value.trim(),
            description: document.getElementById('resource-description').value.trim(),
            addedOn: new Date().toISOString(),
            views: 0,
            bookmarks: 0,
            addedBy: this.currentUser.userId
        };

        // Validation
        if (!newResource.title || !newResource.type || !newResource.subject || !newResource.url) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        // URL validation
        try {
            new URL(newResource.url);
        } catch {
            this.showToast('Please enter a valid URL', 'error');
            return;
        }

        // Add resource
        this.resources.unshift(newResource);
        this.saveResources();
        this.filteredResources = [...this.resources];
        
        // Update UI
        this.renderResources();
        this.updateAnalytics();
        this.clearUploadForm();
        
        this.showToast('Resource added successfully!', 'success');
    }

    clearUploadForm() {
        const form = document.getElementById('upload-form');
        if (form) {
            form.reset();
        }
    }

    // =====================
    // ANALYTICS CALCULATIONS
    // =====================

    updateAnalytics() {
        this.updateTotalResources();
        this.updateMostViewed();
        this.updateMostBookmarked();
        this.updateResourcesByType();
        this.updateResourcesBySubject();
        this.updateLatestResource();
    }

    updateTotalResources() {
        const element = document.getElementById('total-resources');
        if (element) {
            element.textContent = this.resources.length;
        }
    }

    updateMostViewed() {
        const element = document.getElementById('most-viewed');
        if (element) {
            if (this.resources.length === 0) {
                element.textContent = 'No resources yet';
                return;
            }

            const mostViewed = this.resources.reduce((max, resource) => 
                resource.views > max.views ? resource : max
            );

            element.textContent = mostViewed.views > 0 ? 
                `${mostViewed.title} (${mostViewed.views} views)` : 
                'No views yet';
        }
    }

    updateMostBookmarked() {
        const element = document.getElementById('most-bookmarked');
        if (element) {
            if (this.resources.length === 0) {
                element.textContent = 'No resources yet';
                return;
            }

            const mostBookmarked = this.resources.reduce((max, resource) => 
                resource.bookmarks > max.bookmarks ? resource : max
            );

            element.textContent = mostBookmarked.bookmarks > 0 ? 
                `${mostBookmarked.title} (${mostBookmarked.bookmarks} bookmarks)` : 
                'No bookmarks yet';
        }
    }

    updateResourcesByType() {
        const element = document.getElementById('type-breakdown');
        if (element) {
            const typeCounts = this.resources.reduce((counts, resource) => {
                counts[resource.type] = (counts[resource.type] || 0) + 1;
                return counts;
            }, {});

            const typeOrder = ['PDF', 'Video', 'Link'];
            element.innerHTML = typeOrder.map(type => 
                `<div class="stat-item">${type}: <span>${typeCounts[type] || 0}</span></div>`
            ).join('');
        }
    }

    updateResourcesBySubject() {
        const element = document.getElementById('subject-breakdown');
        if (element) {
            if (this.resources.length === 0) {
                element.innerHTML = '<div class="stat-item">No subjects yet</div>';
                return;
            }

            const subjectCounts = this.resources.reduce((counts, resource) => {
                counts[resource.subject] = (counts[resource.subject] || 0) + 1;
                return counts;
            }, {});

            // Sort subjects by count (descending) and take top 5
            const sortedSubjects = Object.entries(subjectCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5);

            element.innerHTML = sortedSubjects.map(([subject, count]) => 
                `<div class="stat-item">${subject}: <span>${count}</span></div>`
            ).join('');
        }
    }

    updateLatestResource() {
        const element = document.getElementById('latest-resource');
        if (element) {
            if (this.resources.length === 0) {
                element.textContent = 'No resources yet';
                return;
            }

            const latest = this.resources.reduce((latest, resource) => 
                new Date(resource.addedOn) > new Date(latest.addedOn) ? resource : latest
            );

            const timeAgo = this.getTimeAgo(latest.addedOn);
            element.textContent = `${latest.title} (${timeAgo})`;
        }
    }

    getTimeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    }

    // =====================
    // TOAST NOTIFICATION SYSTEM
    // =====================

    setupToastSystem() {
        // Toast system is ready to use
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast-notification');
        const icon = toast.querySelector('.toast-icon');
        const messageSpan = toast.querySelector('.toast-message');

        // Set message
        messageSpan.textContent = message;

        // Set type and icon
        toast.className = 'toast-notification show ' + type;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };
        
        icon.className = 'toast-icon ' + (icons[type] || icons.info);

        // Auto-hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// =====================
// INITIALIZE APPLICATION
// =====================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the E-Library application
    const eLibrary = new ELibrary();
    
    // Make it globally accessible for debugging
    window.eLibrary = eLibrary;
    
    console.log('E-Library initialized successfully!');
    console.log(`Current user role: ${eLibrary.currentUser.role}`);
    console.log(`Total resources: ${eLibrary.resources.length}`);
});