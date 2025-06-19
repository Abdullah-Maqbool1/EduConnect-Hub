// E-Library JavaScript with Analytics and Local Storage
class ELibrary {
    constructor() {
        this.resources = this.loadResources();
        this.userRole = this.getUserRole();
        this.currentView = 'grid';
        this.selectedFile = null;
        this.selectedFileUrl = null;//added later for open

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkUserRole();
        this.displayResources();
        this.updateAnalytics();
        this.setupModalEventListeners();
    }

    // User Role Management
    getUserRole() {
        return localStorage.getItem('userRole') || 'student';
    }

    checkUserRole() {
        const role = this.getUserRole();
        const uploadPanel = document.getElementById('upload-panel');
        const uploadButton = document.getElementById('open-upload-modal');

        if (role === 'teacher') {
            if (uploadPanel) uploadPanel.style.display = 'block';
            if (uploadButton) uploadButton.style.display = 'flex';
        } else {
            if (uploadPanel) uploadPanel.style.display = 'none';
            if (uploadButton) uploadButton.style.display = 'none';
        }
    }

    // Local Storage Management
    loadResources() {
        const stored = localStorage.getItem('libraryResources');
        if (stored) {
            return JSON.parse(stored);
        }

        
        const sampleResources = [
            {
                id: '1',
                title: 'AVL Tree Lab (1)',
                type: 'Document',
                subject: 'Data Structures',
                // url: 'local://uploads/AVL Tree Lab (1).docx',
                url: 'uploads/AVL_Tree_Lab_1.docx',

                description: 'Lab report on AVL tree rotations and balancing.',
                addedOn: new Date('2025-06-13').toISOString(),
                views: 0,
                bookmarks: 0,
                tags: ['avl', 'tree', 'lab'],
                category: 'Lab Work',
                level: 'Intermediate',
                language: 'English',
                featured: false,
                downloadable: true
            },
            {
                id: '2',
                title: 'drive',
                type: 'pdf',
                subject: 'Data Structures',
                url: 'https://onlinepgc-my.sharepoint.com/:b:/g/personal/maria_naseem_ucp_edu_pk/EU0XIyMYg6pBkj73nBoheysBWsLDaqo_9vkhywGbOsAmBQ?e=ewMqeY',
                description: 'Detailed notes and diagrams on Binary Search Trees.',
                addedOn: new Date('2025-06-13').toISOString(),
                views: 0,
                bookmarks: 0,
                tags: ['binary search tree', 'bst', 'dsa'],
                category: 'Lecture Notes',
                level: 'Intermediate',
                language: 'English',
                featured: false,
                downloadable: true
            },
            {
                id: '3',
                title: 'RECURSION PRACTICE QUESTIONS',
                type: 'Document',
                subject: 'Data Structures',
                url: 'uploads/RECURSION PRACTICE QUESTIONS.docx',
                description: 'Practice problems focused on recursive algorithms.',
                addedOn: new Date('2025-06-13').toISOString(),
                views: 0,
                bookmarks: 0,
                tags: ['recursion', 'practice', 'questions'],
                category: 'Practice Material',
                level: 'Beginner',
                language: 'English',
                featured: false,
                downloadable: true
            }
        ];

        this.saveResources(sampleResources);
        return sampleResources;
    }

    saveResources(resources = this.resources) {
        localStorage.setItem('libraryResources', JSON.stringify(resources));
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterResources();
            });
        }

        // Filter functionality
        const subjectFilter = document.getElementById('subject-filter');
        const typeFilter = document.getElementById('type-filter');

        if (subjectFilter) {
            subjectFilter.addEventListener('change', () => this.filterResources());
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.filterResources());
        }

        // View toggle
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.toggleView(view);
            });
        });

        // Upload form (for teachers)
        const uploadForm = document.getElementById('upload-form');
        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }

        // Clear form button
        const clearFormBtn = document.getElementById('clear-form');
        if (clearFormBtn) {
            clearFormBtn.addEventListener('click', () => {
                this.clearUploadForm();
            });
        }

        // Toggle upload panel
        const toggleUploadBtn = document.getElementById('toggle-upload');
        if (toggleUploadBtn) {
            toggleUploadBtn.addEventListener('click', () => {
                this.toggleUploadPanel();
            });
        }
    }

    // Modal Event Listeners
    setupModalEventListeners() {
        const openModalBtn = document.getElementById('open-upload-modal');
        const closeModalBtn = document.getElementById('close-upload-modal');
        const cancelBtn = document.getElementById('cancel-upload');
        const modalOverlay = document.getElementById('upload-modal-overlay');
        const uploadModalForm = document.getElementById('upload-modal-form');
        const fileInput = document.getElementById('file-input');
        const fileDropZone = document.getElementById('file-drop-zone');
        const removeFileBtn = document.getElementById('remove-file-btn');

        // Open modal
        if (openModalBtn) {
            openModalBtn.addEventListener('click', () => {
                this.openUploadModal();
            });
        }

        // Close modal
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.closeUploadModal();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeUploadModal();
            });
        }

        // Close on overlay click
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeUploadModal();
                }
            });
        }

        // File upload handling
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileSelect(e.target.files[0]);
            });
        }

        // Drag and drop
        if (fileDropZone) {
            fileDropZone.addEventListener('click', () => {
                fileInput.click();
            });

            fileDropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileDropZone.classList.add('drag-over');
            });

            fileDropZone.addEventListener('dragleave', () => {
                fileDropZone.classList.remove('drag-over');
            });

            fileDropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                fileDropZone.classList.remove('drag-over');
                const file = e.dataTransfer.files[0];
                if (file) {
                    this.handleFileSelect(file);
                }
            });
        }

        // Remove file
        if (removeFileBtn) {
            removeFileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeSelectedFile();
            });
        }

        // Modal form submission
        if (uploadModalForm) {
            uploadModalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleModalFormSubmit();
            });
        }
    }

    // Modal Functions
    openUploadModal() {
        const modalOverlay = document.getElementById('upload-modal-overlay');
        if (modalOverlay) {
            modalOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeUploadModal() {
        const modalOverlay = document.getElementById('upload-modal-overlay');
        if (modalOverlay) {
            modalOverlay.classList.remove('show');
            document.body.style.overflow = 'auto';
            this.clearModalForm();
        }
    }

    
    handleFileSelect(file) {
        if (!file) return;

        this.selectedFile = file;
        this.selectedFileUrl = URL.createObjectURL(file); // 👈 Generate object URL

        const filePreview = document.getElementById('file-preview');
        const dropZoneContent = document.querySelector('.drop-zone-content');
        const fileName = document.getElementById('selected-file-name');
        const fileSize = document.getElementById('selected-file-size');
        const modalResourceType = document.getElementById('modal-resource-type');

        if (filePreview && dropZoneContent && fileName && fileSize) {
            dropZoneContent.style.display = 'none';
            filePreview.style.display = 'block';

            fileName.textContent = file.name;
            fileSize.textContent = this.formatFileSize(file.size);

            const fileType = this.detectFileType(file);
            if (modalResourceType && fileType) {
                modalResourceType.value = fileType;
            }

            const titleInput = document.getElementById('modal-resource-title');
            if (titleInput && !titleInput.value) {
                titleInput.value = file.name.replace(/\.[^/.]+$/, "");
            }
        }
    }
    removeSelectedFile() {
        this.selectedFile = null;
        const filePreview = document.getElementById('file-preview');
        const dropZoneContent = document.querySelector('.drop-zone-content');
        const fileInput = document.getElementById('file-input');

        if (filePreview && dropZoneContent) {
            filePreview.style.display = 'none';
            dropZoneContent.style.display = 'block';
        }

        if (fileInput) {
            fileInput.value = '';
        }
    }

    detectFileType(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        const typeMap = {
            'pdf': 'PDF',
            'doc': 'Document',
            'docx': 'Document',
            'ppt': 'Presentation',
            'pptx': 'Presentation',
            'mp4': 'Video',
            'avi': 'Video',
            'mov': 'Video',
            'mkv': 'Video',
            'jpg': 'Image',
            'jpeg': 'Image',
            'png': 'Image',
            'gif': 'Image'
        };
        return typeMap[extension] || 'Document';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    clearModalForm() {
        const form = document.getElementById('upload-modal-form');
        if (form) {
            form.reset();
        }
        this.removeSelectedFile();
    }

    handleModalFormSubmit() {
        const formData = this.getModalFormData();
        if (this.validateModalForm(formData)) {
            // Simulate file upload progress
            this.simulateFileUpload(() => {
                this.addResource(formData);
                this.closeUploadModal();
                this.showToast('Resource uploaded successfully!', 'success');
            });
        }
    }

    getModalFormData() {
        return {
            title: document.getElementById('modal-resource-title')?.value || '',
            type: document.getElementById('modal-resource-type')?.value || '',
            subject: document.getElementById('modal-resource-subject')?.value || '',
            category: document.getElementById('modal-resource-category')?.value || '',
            level: document.getElementById('modal-resource-level')?.value || '',
            language: document.getElementById('modal-resource-language')?.value || 'English',
            description: document.getElementById('modal-resource-description')?.value || '',
            tags: document.getElementById('modal-resource-tags')?.value || '',
            featured: document.getElementById('modal-resource-featured')?.checked || false,
            downloadable: document.getElementById('modal-resource-downloadable')?.checked || true,
            file: this.selectedFile
        };
    }

    validateModalForm(formData) {
        const errors = [];

        if (!formData.title.trim()) {
            errors.push('Title is required');
        }

        if (!formData.type) {
            errors.push('Resource type is required');
        }

        if (!formData.subject) {
            errors.push('Subject is required');
        }

        if (!this.selectedFile) {
            errors.push('Please select a file to upload');
        }

        if (errors.length > 0) {
            this.showToast(errors.join(', '), 'error');
            return false;
        }

        return true;
    }

    simulateFileUpload(callback) {
        const progressBar = document.getElementById('upload-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        if (progressBar && progressFill && progressText) {
            progressBar.style.display = 'block';

            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 100) {
                    progress = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        progressBar.style.display = 'none';
                        callback();
                    }, 500);
                }

                progressFill.style.width = progress + '%';
                progressText.textContent = Math.round(progress) + '%';
            }, 200);
        } else {
            // Fallback if progress elements don't exist
            setTimeout(callback, 1000);
        }
    }

    // Resource Management
    addResource(formData) {
        const newResource = {
            id: Date.now().toString(),
            title: formData.title,
            type: formData.type,
            subject: formData.subject,
            url: this.selectedFileUrl || '#',
            // url: formData.file ? `local://uploads/${formData.file.name}` : '#',
            description: formData.description,
            category: formData.category,
            level: formData.level,
            language: formData.language,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            featured: formData.featured,
            downloadable: formData.downloadable,
            addedOn: new Date().toISOString(),
            views: 0,
            bookmarks: 0,
            fileSize: formData.file ? formData.file.size : 0,
            fileName: formData.file ? formData.file.name : ''
        };

        this.resources.unshift(newResource);
        this.saveResources();
        this.displayResources();
        this.updateAnalytics();
    }

    handleFormSubmit() {
        const formData = {
            title: document.getElementById('resource-title')?.value || '',
            type: document.getElementById('resource-type')?.value || '',
            subject: document.getElementById('resource-subject')?.value || '',
            url: document.getElementById('resource-url')?.value || '',
            description: document.getElementById('resource-description')?.value || ''
        };

        if (this.validateForm(formData)) {
            const resource = {
                id: Date.now().toString(),
                ...formData,
                addedOn: new Date().toISOString(),
                views: 0,
                bookmarks: 0,
                tags: [],
                category: '',
                level: '',
                language: 'English',
                featured: false,
                downloadable: true
            };

            this.resources.unshift(resource);
            this.saveResources();
            this.displayResources();
            this.updateAnalytics();
            this.clearUploadForm();
            this.showToast('Resource added successfully!', 'success');
        }
    }

    validateForm(formData) {
        const errors = [];

        if (!formData.title.trim()) {
            errors.push('Title is required');
        }

        if (!formData.type) {
            errors.push('Type is required');
        }

        if (!formData.subject) {
            errors.push('Subject is required');
        }

        if (!formData.url.trim()) {
            errors.push('URL is required');
        }

        if (errors.length > 0) {
            this.showToast(errors.join(', '), 'error');
            return false;
        }

        return true;
    }

    clearUploadForm() {
        const form = document.getElementById('upload-form');
        if (form) {
            form.reset();
        }
    }

    toggleUploadPanel() {
        const container = document.getElementById('upload-form-container');
        const toggleBtn = document.getElementById('toggle-upload');

        if (container && toggleBtn) {
            container.classList.toggle('collapsed');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-chevron-up');
                icon.classList.toggle('fa-chevron-down');
            }
        }
    }

    // Display and Filtering
    displayResources(resourcesToShow = this.resources) {
        const container = document.getElementById('resources-grid');
        const emptyState = document.getElementById('empty-state');

        if (!container) return;

        if (resourcesToShow.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.classList.add('show');
            return;
        }

        if (emptyState) emptyState.classList.remove('show');

        container.innerHTML = resourcesToShow.map(resource => {
            const isBookmarked = this.isResourceBookmarked(resource.id);
            const userRole = this.getUserRole();

            return `
                <div class="resource-card" data-id="${resource.id}">
                    <div class="resource-header">
                        <div class="resource-icon ${resource.type.toLowerCase()}">
                            <i class="fas ${this.getResourceIcon(resource.type)}"></i>
                        </div>
                        <h3 class="resource-title">${resource.title}</h3>
                    </div>
                    
                    <div class="resource-meta">
                        <span class="resource-subject">${resource.subject}</span>
                        <div class="resource-stats">
                            <span><i class="fas fa-eye"></i> ${resource.views}</span>
                            <span><i class="fas fa-heart"></i> ${resource.bookmarks}</span>
                        </div>
                    </div>
                    
                    <div class="resource-description">
                        ${resource.description}
                    </div>
                    
                    <div class="resource-actions">
                        <div class="action-buttons">
                            <button class="btn btn-primary btn-small" onclick="eLibrary.openResource('${resource.id}')">
                                <i class="fas fa-external-link-alt"></i> Open
                            </button>
                            ${userRole === 'student' ? `
                                <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                                        onclick="eLibrary.toggleBookmark('${resource.id}')"
                                        title="${isBookmarked ? 'Remove bookmark' : 'Add bookmark'}">
                                    <i class="fas fa-heart"></i>
                                </button>
                            ` : ''}
                        </div>
                        <div class="resource-date">
                            ${new Date(resource.addedOn).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getResourceIcon(type) {
        const icons = {
            'PDF': 'fa-file-pdf',
            'Video': 'fa-play-circle',
            'Link': 'fa-link',
            'Document': 'fa-file-word',
            'Presentation': 'fa-file-powerpoint',
            'Image': 'fa-image'
        };
        return icons[type] || 'fa-file';
    }

    filterResources() {
        const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
        const subjectFilter = document.getElementById('subject-filter')?.value || '';
        const typeFilter = document.getElementById('type-filter')?.value || '';

        const filtered = this.resources.filter(resource => {
            const matchesSearch = resource.title.toLowerCase().includes(searchTerm) ||
                resource.description.toLowerCase().includes(searchTerm);
            const matchesSubject = !subjectFilter || resource.subject === subjectFilter;
            const matchesType = !typeFilter || resource.type === typeFilter;

            return matchesSearch && matchesSubject && matchesType;
        });

        this.displayResources(filtered);
    }

    toggleView(view) {
        this.currentView = view;
        const container = document.getElementById('resources-grid');
        const viewButtons = document.querySelectorAll('.view-btn');

        // Update button states
        viewButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Update container class
        if (container) {
            container.classList.toggle('list-view', view === 'list');
        }
    }

    // Resource Actions
    openResource(id) {
        const resource = this.resources.find(r => r.id === id);
        if (resource) {
            // Increment view count
            resource.views++;
            this.saveResources();
            this.displayResources();
            this.updateAnalytics();
            window.open(resource.url, '_blank');

            // Open resource
            // if (resource.url.startsWith('local://')) {
            //     this.showToast('File would be opened from local storage', 'success');
            // } else {
            //     window.open(resource.url, '_blank');
            // }
        }
    }

    toggleBookmark(id) {
        const bookmarks = this.getBookmarks();
        const index = bookmarks.indexOf(id);

        if (index > -1) {
            bookmarks.splice(index, 1);
            this.decrementBookmarkCount(id);
            this.showToast('Bookmark removed', 'success');
        } else {
            bookmarks.push(id);
            this.incrementBookmarkCount(id);
            this.showToast('Bookmark added', 'success');
        }

        localStorage.setItem('userBookmarks', JSON.stringify(bookmarks));
        this.displayResources();
        this.updateAnalytics();
    }

    getBookmarks() {
        const stored = localStorage.getItem('userBookmarks');
        return stored ? JSON.parse(stored) : [];
    }

    isResourceBookmarked(id) {
        return this.getBookmarks().includes(id);
    }

    incrementBookmarkCount(id) {
        const resource = this.resources.find(r => r.id === id);
        if (resource) {
            resource.bookmarks++;
            this.saveResources();
        }
    }

    decrementBookmarkCount(id) {
        const resource = this.resources.find(r => r.id === id);
        if (resource && resource.bookmarks > 0) {
            resource.bookmarks--;
            this.saveResources();
        }
    }

    // Analytics
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
            const typeCounts = this.resources.reduce((acc, resource) => {
                acc[resource.type] = (acc[resource.type] || 0) + 1;
                return acc;
            }, {});

            const typeStats = ['PDF', 'Video', 'Link', 'Document', 'Presentation', 'Image']
                .map(type => `<div class="stat-item">${type}: <span>${typeCounts[type] || 0}</span></div>`)
                .join('');

            element.innerHTML = typeStats || '<div class="stat-item">No resources yet</div>';
        }
    }

    updateResourcesBySubject() {
        const element = document.getElementById('subject-breakdown');
        if (element) {
            const subjectCounts = this.resources.reduce((acc, resource) => {
                acc[resource.subject] = (acc[resource.subject] || 0) + 1;
                return acc;
            }, {});

            const subjectStats = Object.entries(subjectCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5) // Show top 5 subjects
                .map(([subject, count]) =>
                    `<div class="stat-item">${subject}: <span>${count}</span></div>`
                )
                .join('');

            element.innerHTML = subjectStats || '<div class="stat-item">No subjects yet</div>';
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

            const date = new Date(latest.addedOn).toLocaleDateString();
            element.textContent = `${latest.title} (${date})`;
        }
    }

    // Toast Notifications
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast-notification');
        const toastMessage = document.querySelector('.toast-message');
        const toastIcon = document.querySelector('.toast-icon');

        if (toast && toastMessage && toastIcon) {
            // Set message
            toastMessage.textContent = message;

            // Set icon based on type
            toastIcon.className = `toast-icon fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`;

            // Set toast type
            toast.className = `toast-notification ${type}`;

            // Show toast
            toast.classList.add('show');

            // Hide after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }
}

// Initialize the E-Library when the page loads
let eLibrary;

document.addEventListener('DOMContentLoaded', () => {
    eLibrary = new ELibrary();

    // Set default user role if not set (for testing)
    if (!localStorage.getItem('userRole')) {
        localStorage.setItem('userRole', 'teacher'); // Change to 'student' to test student view
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ELibrary;
}