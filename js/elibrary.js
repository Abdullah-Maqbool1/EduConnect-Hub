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

        // Add floating upload button for file uploads
        this.addFloatingUploadButton();
    }

    addFloatingUploadButton() {
        if (this.currentUser.role !== 'teacher') return;

        const floatingBtn = document.createElement('button');
        floatingBtn.className = 'floating-upload-btn';
        floatingBtn.innerHTML = '<i class="fas fa-plus"></i>';
        floatingBtn.title = 'Upload Resource';
        floatingBtn.addEventListener('click', () => this.showUploadModal());

        document.body.appendChild(floatingBtn);
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

    showUploadModal() {
        this.createUploadModal();
        const modal = document.getElementById('upload-modal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideUploadModal() {
        const modal = document.getElementById('upload-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    createUploadModal() {
        // Remove existing modal if present
        const existingModal = document.getElementById('upload-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'upload-modal';
        modal.className = 'upload-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="eLibrary.hideUploadModal()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-cloud-upload-alt"></i> Upload Resource</h3>
                    <button class="modal-close" onclick="eLibrary.hideUploadModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form class="modal-form" id="modal-upload-form">
                    <div class="upload-type-selector">
                        <div class="upload-type-option active" data-type="file">
                            <i class="fas fa-file-upload"></i>
                            <span>Upload File</span>
                        </div>
                        <div class="upload-type-option" data-type="link">
                            <i class="fas fa-link"></i>
                            <span>Add Link</span>
                        </div>
                    </div>

                    <div class="form-section file-upload-section">
                        <div class="file-drop-zone" id="file-drop-zone">
                            <div class="drop-zone-content">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <p>Drag & drop your file here or <span class="browse-link">browse</span></p>
                                <small>Supported formats: PDF, MP4, MOV, AVI, DOCX, PPTX (Max 100MB)</small>
                            </div>
                            <input type="file" id="file-input" accept=".pdf,.mp4,.mov,.avi,.docx,.pptx" hidden>
                        </div>
                        
                        <div class="file-preview" id="file-preview" style="display: none;">
                            <div class="file-info">
                                <div class="file-icon">
                                    <i class="fas fa-file"></i>
                                </div>
                                <div class="file-details">
                                    <div class="file-name"></div>
                                    <div class="file-size"></div>
                                </div>
                                <button type="button" class="remove-file-btn" onclick="eLibrary.removeSelectedFile()">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                            <div class="upload-progress" id="upload-progress" style="display: none;">
                                <div class="progress-bar">
                                    <div class="progress-fill"></div>
                                </div>
                                <div class="progress-text">0%</div>
                            </div>
                        </div>
                    </div>

                    <div class="form-section link-upload-section" style="display: none;">
                        <div class="form-group">
                            <label for="modal-resource-url">Resource URL *</label>
                            <input type="url" id="modal-resource-url" placeholder="https://example.com/resource">
                        </div>
                    </div>

                    <div class="form-section">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="modal-resource-title">Title *</label>
                                <input type="text" id="modal-resource-title" required>
                            </div>
                            <div class="form-group">
                                <label for="modal-resource-subject">Subject *</label>
                                <select id="modal-resource-subject" required>
                                    <option value="">Select Subject</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="Physics">Physics</option>
                                    <option value="Chemistry">Chemistry</option>
                                    <option value="Biology">Biology</option>
                                    <option value="English">English</option>
                                    <option value="History">History</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="modal-resource-description">Description</label>
                            <textarea id="modal-resource-description" rows="3" placeholder="Brief description of the resource..."></textarea>
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="eLibrary.hideUploadModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary" id="modal-submit-btn">
                            <i class="fas fa-plus"></i> Add Resource
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupModalEventListeners();
    }

    setupModalEventListeners() {
        // Upload type selector
        document.querySelectorAll('.upload-type-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                this.switchUploadType(type);
            });
        });

        // File drop zone
        const dropZone = document.getElementById('file-drop-zone');
        const fileInput = document.getElementById('file-input');
        const browseLink = dropZone.querySelector('.browse-link');

        // Browse link click
        browseLink.addEventListener('click', () => fileInput.click());

        // File input change
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileSelection(file);
            }
        });

        // Drag and drop events
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file) {
                this.handleFileSelection(file);
            }
        });

        // Modal form submission
        document.getElementById('modal-upload-form').addEventListener('submit', (e) => {
            this.handleModalResourceUpload(e);
        });
    }

    switchUploadType(type) {
        // Update active option
        document.querySelectorAll('.upload-type-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-type="${type}"]`).classList.add('active');

        // Show/hide sections
        const fileSection = document.querySelector('.file-upload-section');
        const linkSection = document.querySelector('.link-upload-section');

        if (type === 'file') {
            fileSection.style.display = 'block';
            linkSection.style.display = 'none';
        } else {
            fileSection.style.display = 'none';
            linkSection.style.display = 'block';
        }
    }

    handleFileSelection(file) {
        // Validate file
        const maxSize = 100 * 1024 * 1024; // 100MB
        const allowedTypes = ['application/pdf', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 
                             'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                             'application/vnd.openxmlformats-officedocument.presentationml.presentation'];

        if (file.size > maxSize) {
            this.showToast('File size must be under 100MB', 'error');
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            this.showToast('Unsupported file type', 'error');
            return;
        }

        // Store selected file
        this.selectedFile = file;

        // Update UI
        this.showFilePreview(file);
        
        // Auto-fill title if empty
        const titleInput = document.getElementById('modal-resource-title');
        if (!titleInput.value) {
            titleInput.value = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        }
    }

    showFilePreview(file) {
        const dropZone = document.getElementById('file-drop-zone');
        const preview = document.getElementById('file-preview');
        const fileName = preview.querySelector('.file-name');
        const fileSize = preview.querySelector('.file-size');
        const fileIcon = preview.querySelector('.file-icon i');

        // Hide drop zone, show preview
        dropZone.style.display = 'none';
        preview.style.display = 'block';

        // Update file info
        fileName.textContent = file.name;
        fileSize.textContent = this.formatFileSize(file.size);

        // Update icon based on file type
        const iconClass = this.getFileIcon(file.type);
        fileIcon.className = `fas fa-${iconClass}`;
    }

    removeSelectedFile() {
        this.selectedFile = null;
        const dropZone = document.getElementById('file-drop-zone');
        const preview = document.getElementById('file-preview');
        const fileInput = document.getElementById('file-input');

        // Reset UI
        dropZone.style.display = 'block';
        preview.style.display = 'none';
        fileInput.value = '';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getFileIcon(mimeType) {
        const iconMap = {
            'application/pdf': 'file-pdf',
            'video/mp4': 'file-video',
            'video/quicktime': 'file-video',
            'video/x-msvideo': 'file-video',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'file-word',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'file-powerpoint'
        };
        return iconMap[mimeType] || 'file';
    }

    simulateFileUpload() {
        return new Promise((resolve) => {
            const progressBar = document.getElementById('upload-progress');
            const progressFill = document.querySelector('.progress-fill');
            const progressText = document.querySelector('.progress-text');

            progressBar.style.display = 'block';
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 100) progress = 100;

                progressFill.style.width = progress + '%';
                progressText.textContent = Math.round(progress) + '%';

                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        progressBar.style.display = 'none';
                        resolve();
                    }, 500);
                }
            }, 200);
        });
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

    async handleModalResourceUpload(e) {
        e.preventDefault();
        
        if (this.currentUser.role !== 'teacher') {
            this.showToast('Only teachers can upload resources', 'error');
            return;
        }

        const activeType = document.querySelector('.upload-type-option.active').dataset.type;
        const title = document.getElementById('modal-resource-title').value.trim();
        const subject = document.getElementById('modal-resource-subject').value;
        const description = document.getElementById('modal-resource-description').value.trim();

        // Validation
        if (!title || !subject) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        let resourceType = '';
        let resourceUrl = '';

        if (activeType === 'file') {
            if (!this.selectedFile) {
                this.showToast('Please select a file to upload', 'error');
                return;
            }

            // Determine resource type from file
            const mimeType = this.selectedFile.type;
            if (mimeType.includes('pdf')) {
                resourceType = 'PDF';
            } else if (mimeType.includes('video')) {
                resourceType = 'Video';
            } else {
                resourceType = 'Document';
            }

            // Simulate file upload
            const submitBtn = document.getElementById('modal-submit-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

            try {
                await this.simulateFileUpload();
                
                // In a real application, this would be the actual uploaded file URL
                // For demo purposes, we'll create a mock URL
                resourceUrl = `https://cdn.educonnect.com/files/${this.selectedFile.name}`;
                
            } catch (error) {
                this.showToast('Upload failed. Please try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Resource';
                return;
            }
        } else {
            // Link upload
            const url = document.getElementById('modal-resource-url').value.trim();
            
            if (!url) {
                this.showToast('Please enter a resource URL', 'error');
                return;
            }

            // URL validation
            try {
                new URL(url);
                resourceUrl = url;
                resourceType = 'Link';
            } catch {
                this.showToast('Please enter a valid URL', 'error');
                return;
            }
        }

        // Create new resource
        const newResource = {
            id: 'res_' + Date.now(),
            title: title,
            type: resourceType,
            subject: subject,
            url: resourceUrl,
            description: description,
            addedOn: new Date().toISOString(),
            views: 0,
            bookmarks: 0,
            addedBy: this.currentUser.userId,
            isUploaded: activeType === 'file',
            fileName: activeType === 'file' ? this.selectedFile.name : null,
            fileSize: activeType === 'file' ? this.selectedFile.size : null
        };

        // Add resource
        this.resources.unshift(newResource);
        this.saveResources();
        this.filteredResources = [...this.resources];
        
        // Update UI
        this.renderResources();
        this.updateAnalytics();
        this.hideUploadModal();
        
        this.showToast(`Resource ${activeType === 'file' ? 'uploaded' : 'added'} successfully!`, 'success');
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