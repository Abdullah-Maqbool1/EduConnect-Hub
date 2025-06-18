// Student Dashboard JavaScript
class StudentDashboard {
    constructor() {
        this.currentUser = this.loadUserData();
        this.teachers = [];
        this.resources = [];
        this.questions = [];
        this.currentFilter = 'all';
        
        this.init();
    }

    init() {
        this.loadInitialData();
        this.setupEventListeners();
        this.updateUserInfo();
        this.showSection('library');
    }

    // Load user data from memory or set defaults
    loadUserData() {
        // In a real app, this would come from authentication
        return {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@student.edu',
            role: 'Student',
            joinDate: '2024-01-15'
        };
    }

    // Load initial data
    loadInitialData() {
        this.loadTeachers();
        this.loadResources();
        this.loadQuestions();
    }

    // Load mock teachers data
    loadTeachers() {
        this.teachers = [
            {
                id: 1,
                name: 'Dr. Sarah Johnson',
                email: 'sarah.johnson@edu.com',
                subject: 'Mathematics',
                specialization: 'Calculus & Statistics',
                experience: '8 years'
            },
            {
                id: 2,
                name: 'Prof. Michael Chen',
                email: 'michael.chen@edu.com',
                subject: 'Computer Science',
                specialization: 'Programming & Algorithms',
                experience: '12 years'
            },
            {
                id: 3,
                name: 'Dr. Emily Rodriguez',
                email: 'emily.rodriguez@edu.com',
                subject: 'Science',
                specialization: 'Physics & Chemistry',
                experience: '6 years'
            },
            {
                id: 4,
                name: 'Mr. David Wilson',
                email: 'david.wilson@edu.com',
                subject: 'English',
                specialization: 'Literature & Writing',
                experience: '10 years'
            },
            {
                id: 5,
                name: 'Dr. Lisa Thompson',
                email: 'lisa.thompson@edu.com',
                subject: 'History',
                specialization: 'World History & Politics',
                experience: '15 years'
            },
            {
                id: 6,
                name: 'Prof. Ahmed Hassan',
                email: 'ahmed.hassan@edu.com',
                subject: 'Mathematics',
                specialization: 'Geometry & Algebra',
                experience: '9 years'
            }
        ];
        this.updateTeacherCount();
        this.renderTeachers();
    }

    // Load mock resources data
    loadResources() {
        this.resources = [
            {
                id: 1,
                title: 'Introduction to Calculus',
                type: 'pdf',
                subject: 'Mathematics',
                description: 'Comprehensive guide covering limits, derivatives, and integrals with practical examples.',
                uploadDate: '2024-06-15',
                size: '2.5 MB'
            },
            {
                id: 2,
                title: 'Programming Fundamentals',
                type: 'video',
                subject: 'Computer Science',
                description: 'Complete video series covering basic programming concepts and problem-solving techniques.',
                uploadDate: '2024-06-10',
                duration: '3h 45m'
            },
            {
                id: 3,
                title: 'Chemistry Lab Manual',
                type: 'pdf',
                subject: 'Science',
                description: 'Step-by-step laboratory procedures and safety guidelines for chemistry experiments.',
                uploadDate: '2024-06-12',
                size: '4.2 MB'
            },
            {
                id: 4,
                title: 'Shakespeare Analysis',
                type: 'pdf',
                subject: 'English',
                description: 'In-depth analysis of major works by William Shakespeare with critical interpretations.',
                uploadDate: '2024-06-08',
                size: '1.8 MB'
            },
            {
                id: 5,
                title: 'World War II Documentary',
                type: 'video',
                subject: 'History',
                description: 'Educational documentary exploring the causes, events, and consequences of World War II.',
                uploadDate: '2024-06-14',
                duration: '2h 30m'
            },
            {
                id: 6,
                title: 'Physics Equations Reference',
                type: 'pdf',
                subject: 'Science',
                description: 'Quick reference guide for essential physics formulas and constants.',
                uploadDate: '2024-06-11',
                size: '0.8 MB'
            },
            {
                id: 7,
                title: 'JavaScript Tutorial Series',
                type: 'video',
                subject: 'Computer Science',
                description: 'Complete JavaScript tutorial from basics to advanced concepts with hands-on projects.',
                uploadDate: '2024-06-13',
                duration: '5h 20m'
            },
            {
                id: 8,
                title: 'Linear Algebra Handbook',
                type: 'pdf',
                subject: 'Mathematics',
                description: 'Comprehensive handbook covering vectors, matrices, and linear transformations.',
                uploadDate: '2024-06-09',
                size: '3.1 MB'
            }
        ];
        this.renderResources();
    }

    // Load mock questions data  
    loadQuestions() {
        this.questions = [
            {
                id: 1,
                title: 'Help with Calculus Derivatives',
                subject: 'mathematics',
                content: 'I\'m struggling with understanding the chain rule for derivatives. Can someone explain it with examples?',
                date: '2024-06-17',
                status: 'answered'
            },
            {
                id: 2,
                title: 'JavaScript Array Methods',
                subject: 'computer-science',
                content: 'What\'s the difference between map(), filter(), and reduce() methods in JavaScript?',
                date: '2024-06-16',
                status: 'pending'
            },
            {
                id: 3,
                title: 'Chemistry Bonding Question',
                subject: 'science',
                content: 'Can someone explain the difference between ionic and covalent bonding with examples?',
                date: '2024-06-15',
                status: 'answered'
            }
        ];
        this.renderQuestions();
    }

    // Update user information in the UI
    updateUserInfo() {
        document.getElementById('student-name').textContent = this.currentUser.name;
        document.getElementById('profile-name').textContent = this.currentUser.name;
        document.getElementById('profile-email').textContent = this.currentUser.email;
        document.getElementById('profile-name-input').value = this.currentUser.name;
        document.getElementById('profile-email-input').value = this.currentUser.email;
    }

    // Update teacher count
    updateTeacherCount() {
        document.getElementById('teacher-count').textContent = this.teachers.length;
    }

    // Setup event listeners
    setupEventListeners() {
        // Question form submission
        document.getElementById('question-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitQuestion();
        });

        // Profile form submission
        document.getElementById('profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });

        // Responsive navigation toggle
        this.setupResponsiveNavigation();
        
        // Window resize handler for responsive features
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Initialize responsive features
        this.handleResize();
    }

    // Setup responsive navigation
    setupResponsiveNavigation() {
        const navTabs = document.querySelectorAll('.nav-tab');
        
        // Add touch support for mobile
        navTabs.forEach(tab => {
            tab.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const section = tab.getAttribute('data-section');
                this.showSection(section);
            });
        });
    }

    // Handle window resize for responsive features
    handleResize() {
        const width = window.innerWidth;
        
        // Adjust grid columns based on screen size
        this.adjustGridLayout(width);
        
        // Handle mobile navigation
        this.handleMobileNavigation(width);
        
        // Adjust form layouts
        this.adjustFormLayouts(width);
    }

    // Adjust grid layouts based on screen size
    adjustGridLayout(width) {
        const resourcesGrid = document.getElementById('resources-grid');
        const teachersGrid = document.getElementById('teachers-grid');
        
        if (width <= 480) {
            resourcesGrid.style.gridTemplateColumns = '1fr';
            teachersGrid.style.gridTemplateColumns = '1fr';
        } else if (width <= 768) {
            resourcesGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
            teachersGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
        } else {
            resourcesGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
            teachersGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
        }
    }

    // Handle mobile navigation adjustments
    handleMobileNavigation(width) {
        const dashboardNav = document.querySelector('.dashboard-nav');
        const navTabs = document.querySelectorAll('.nav-tab');
        
        if (width <= 768) {
            dashboardNav.style.flexDirection = 'column';
            navTabs.forEach(tab => {
                tab.style.flexDirection = 'row';
                tab.style.justifyContent = 'center';
            });
        } else {
            dashboardNav.style.flexDirection = 'row';
            navTabs.forEach(tab => {
                tab.style.flexDirection = 'column';
                tab.style.justifyContent = 'center';
            });
        }
    }

    // Adjust form layouts for mobile
    adjustFormLayouts(width) {
        const formActions = document.querySelectorAll('.form-actions');
        
        formActions.forEach(actions => {
            if (width <= 768) {
                actions.style.flexDirection = 'column';
            } else {
                actions.style.flexDirection = 'row';
            }
        });
    }

    // Show specific section
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected section
        document.getElementById(`${sectionName}-section`).classList.add('active');
        
        // Add active class to corresponding nav tab
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Load section-specific data if needed
        this.loadSectionData(sectionName);
    }

    // Load data specific to the section
    loadSectionData(sectionName) {
        switch(sectionName) {
            case 'library':
                this.renderResources();
                break;
            case 'teachers':
                this.renderTeachers();
                break;
            case 'questions':
                this.renderQuestions();
                break;
            case 'profile':
                this.updateUserInfo();
                break;
        }
    }

    // Render resources
    renderResources() {
        const grid = document.getElementById('resources-grid');
        const filteredResources = this.getFilteredResources();
        
        grid.innerHTML = filteredResources.map(resource => `
            <div class="resource-card" data-type="${resource.type}" data-subject="${resource.subject.toLowerCase()}">
                <div class="resource-header">
                    <div class="resource-icon ${resource.type}">
                        <i class="fas fa-${resource.type === 'pdf' ? 'file-pdf' : 'play-circle'}"></i>
                    </div>
                    <div>
                        <h3 class="resource-title">${resource.title}</h3>
                        <span class="resource-subject">${resource.subject}</span>
                    </div>
                </div>
                <p class="resource-description">${resource.description}</p>
                <div class="resource-actions">
                    <button class="btn btn-primary btn-small" onclick="dashboard.openResource(${resource.id})">
                        <i class="fas fa-${resource.type === 'pdf' ? 'download' : 'play'}"></i>
                        ${resource.type === 'pdf' ? 'Download' : 'Watch'}
                    </button>
                    <button class="btn btn-outline btn-small" onclick="dashboard.previewResource(${resource.id})">
                        <i class="fas fa-eye"></i>
                        Preview
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Get filtered resources based on current filter
    getFilteredResources() {
        const searchTerm = document.getElementById('library-search')?.value.toLowerCase() || '';
        
        return this.resources.filter(resource => {
            const matchesFilter = this.currentFilter === 'all' || resource.type === this.currentFilter;
            const matchesSearch = resource.title.toLowerCase().includes(searchTerm) ||
                                resource.description.toLowerCase().includes(searchTerm) ||
                                resource.subject.toLowerCase().includes(searchTerm);
            return matchesFilter && matchesSearch;
        });
    }

    // Render teachers
    renderTeachers() {
        const grid = document.getElementById('teachers-grid');
        const filteredTeachers = this.getFilteredTeachers();
        
        grid.innerHTML = filteredTeachers.map(teacher => `
            <div class="teacher-card">
                <div class="teacher-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <h3 class="teacher-name">${teacher.name}</h3>
                <p class="teacher-email">${teacher.email}</p>
                <p class="teacher-specialization">${teacher.specialization}</p>
                <span class="teacher-role">${teacher.subject}</span>
                <div class="teacher-actions" style="margin-top: 1rem;">
                    <button class="btn btn-primary btn-small" onclick="dashboard.contactTeacher(${teacher.id})">
                        <i class="fas fa-envelope"></i>
                        Contact
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Get filtered teachers
    getFilteredTeachers() {
        const searchTerm = document.getElementById('teacher-search')?.value.toLowerCase() || '';
        
        return this.teachers.filter(teacher => {
            return teacher.name.toLowerCase().includes(searchTerm) ||
                   teacher.subject.toLowerCase().includes(searchTerm) ||
                   teacher.specialization.toLowerCase().includes(searchTerm);
        });
    }

    // Render questions
    renderQuestions() {
        const list = document.getElementById('questions-list');
        
        if (this.questions.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: var(--text-color-paragraph);">No questions asked yet. Submit your first question above!</p>';
            return;
        }
        
        list.innerHTML = this.questions.map(question => `
            <div class="question-item">
                <div class="question-item-header">
                    <h4 class="question-item-title">${question.title}</h4>
                    <span class="question-item-date">${this.formatDate(question.date)}</span>
                </div>
                <span class="question-item-subject">${this.formatSubject(question.subject)}</span>
                <p class="question-item-content">${question.content}</p>
                <div style="margin-top: 1rem;">
                    <span class="status-badge ${question.status}">
                        <i class="fas fa-${question.status === 'answered' ? 'check-circle' : 'clock'}"></i>
                        ${question.status.charAt(0).toUpperCase() + question.status.slice(1)}
                    </span>
                </div>
            </div>
        `).join('');
    }

    // Filter functions
    filterByType(type) {
        this.currentFilter = type;
        
        // Update filter tab active state
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');
        
        this.renderResources();
    }

    filterLibrary() {
        this.renderResources();
    }

    filterTeachers() {
        this.renderTeachers();
    }

    // Submit question
    submitQuestion() {
        const form = document.getElementById('question-form');
        const formData = new FormData(form);
        
        const question = {
            id: this.questions.length + 1,
            title: document.getElementById('question-title').value,
            subject: document.getElementById('question-subject').value,
            content: document.getElementById('question-content').value,
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
        };
        
        this.questions.unshift(question);
        this.renderQuestions();
        form.reset();
        
        this.showToast('Question submitted successfully! You will receive an answer soon.', 'success');
    }

    // Update profile
    updateProfile() {
        const newName = document.getElementById('profile-name-input').value;
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Basic validation
        if (!newName.trim()) {
            this.showToast('Please enter your name.', 'error');
            return;
        }
        
        if (newPassword && newPassword !== confirmPassword) {
            this.showToast('Passwords do not match.', 'error');
            return;
        }
        
        if (newPassword && !currentPassword) {
            this.showToast('Please enter your current password to change it.', 'error');
            return;
        }
        
        // Update user data
        this.currentUser.name = newName;
        this.updateUserInfo();
        
        // Clear password fields
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        this.showToast('Profile updated successfully!', 'success');
    }

    // Reset profile form
    resetProfileForm() {
        document.getElementById('profile-form').reset();
        this.updateUserInfo();
    }

    // Resource actions
    openResource(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        this.showToast(`Opening ${resource.title}...`, 'success');
        // In a real app, this would open or download the resource
    }

    previewResource(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        this.showToast(`Previewing ${resource.title}...`, 'success');
        // In a real app, this would show a preview modal
    }

    // Contact teacher
    contactTeacher(teacherId) {
        const teacher = this.teachers.find(t => t.id === teacherId);
        this.showToast(`Opening contact form for ${teacher.name}...`, 'success');
        // In a real app, this would open a contact modal or redirect to messaging
    }

    // Utility functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    formatSubject(subject) {
        return subject.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // Show toast message
    showToast(message, type = 'success') {
        const toast = document.getElementById('message-toast');
        const icon = toast.querySelector('.toast-icon');
        const messageSpan = toast.querySelector('.toast-message');
        
        messageSpan.textContent = message;
        toast.className = `message-toast ${type}`;
        
        if (type === 'success') {
            icon.className = 'toast-icon fas fa-check-circle';
        } else {
            icon.className = 'toast-icon fas fa-exclamation-circle';
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Logout function
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            this.showToast('Logging out...', 'success');
            setTimeout(() => {
                // In a real app, this would redirect to login page
                window.location.href = 'login.html';
            }, 1000);
        }
    }
}

// Global functions for HTML onclick handlers
function showSection(section) {
    dashboard.showSection(section);
}

function filterByType(type) {
    dashboard.filterByType(type);
}

function filterLibrary() {
    dashboard.filterLibrary();
}

function filterTeachers() {
    dashboard.filterTeachers();
}

function resetProfileForm() {
    dashboard.resetProfileForm();
}

function logout() {
    dashboard.logout();
}

// Initialize dashboard when DOM is loaded
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new StudentDashboard();
});

// Add styles for status badges (inject into head)
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: var(--border-radius);
            font-size: var(--small-font-size);
            font-weight: var(--font-medium);
        }
        
        .status-badge.answered {
            background-color: #10b981;
            color: white;
        }
        
        .status-badge.pending {
            background-color: #f59e0b;
            color: white;
        }
        
        .teacher-actions {
            margin-top: 1rem;
        }
        
        .teacher-specialization {
            color: var(--text-color-paragraph);
            font-size: var(--small-font-size);
            margin-bottom: 0.5rem;
            font-style: italic;
        }
        
        /* Enhanced responsive features */
        @media (max-width: 480px) {
            .welcome-stats {
                flex-direction: column;
                gap: 1rem;
            }
            
            .stat-item {
                flex-direction: row;
                gap: 1rem;
                padding: 1rem;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: var(--border-radius);
            }
            
            .resource-card,
            .teacher-card {
                padding: 1.5rem;
            }
            
            .resource-actions,
            .teacher-actions {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .btn-small {
                width: 100%;
                justify-content: center;
            }
        }
        
        /* Touch-friendly improvements */
        @media (pointer: coarse) {
            .nav-tab {
                min-height: 60px;
                touch-action: manipulation;
            }
            
            .btn {
                min-height: 44px;
                touch-action: manipulation;
            }
            
            .resource-card,
            .teacher-card {
                touch-action: manipulation;
            }
            
            .form-input,
            .form-textarea {
                min-height: 44px;
            }
        }
    `;
    document.head.appendChild(style);
});