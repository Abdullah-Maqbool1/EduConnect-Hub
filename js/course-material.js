// Course Material Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log("welcome............");
    // Get course ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('courseId');

    const currentUser =  localStorage.getItem('userName') || localStorage.getItem('name')
    console.log(currentUser);
   

    const userRole = currentUser.role || localStorage.getItem('role');
    console.log(userRole);
    
    // DOM Elements
    const courseHeader = document.getElementById('courseHeader');
    const materialsGrid = document.getElementById('materialsGrid');
    const noMaterialsMessage = document.getElementById('noMaterialsMessage');
    const addMaterialBtn = document.getElementById('addMaterialBtn');
    const addMaterialModal = document.getElementById('addMaterialModal');
    const backBtn = document.getElementById('backBtn');
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const teacherHint = document.getElementById('teacherHint');
    const courseNotFound = document.getElementById('courseNotFound');
    
    // Modal elements
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const addMaterialForm = document.getElementById('addMaterialForm');
    
    // Initialize page
    init();
    
    function init() {
        if (!courseId) {
            showCourseNotFound();
            return;
        }
        
        const course = getCourseById(courseId);
        if (!course) {
            showCourseNotFound();
            return;
        }
        
        displayCourseHeader(course);
        setupEventListeners();
        setupTeacherFeatures();
        displayMaterials();
    }
    
    function getCourseById(id) {
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        return courses.find(course => course.id === id);
    }
    
    function displayCourseHeader(course) {
        courseHeader.innerHTML = `
            <div class="course-info">
                <h1>${course.title}</h1>
                <div class="course-meta">
                    <span class="course-subject">${course.subject}</span>
                    <span class="course-teacher">
                        <i class="fas fa-user"></i>
                        ${course.teacher}
                    </span>
                </div>
                <p class="course-description">${course.description}</p>
            </div>
        `;
    }
    
    function setupEventListeners() {
        // Back button
        backBtn.addEventListener('click', () => {
            window.location.href = 'courses.html';
        });
        
        // Search functionality
        searchInput.addEventListener('input', filterMaterials);
        typeFilter.addEventListener('change', filterMaterials);
        
        // Modal controls
        closeModal.addEventListener('click', closeAddMaterialModal);
        cancelBtn.addEventListener('click', closeAddMaterialModal);
        addMaterialModal.addEventListener('click', (e) => {
            if (e.target === addMaterialModal) {
                closeAddMaterialModal();
            }
        });
        
        // Form submission
        addMaterialForm.addEventListener('submit', handleAddMaterial);
    }
    
    function setupTeacherFeatures() {
        if (userRole === 'teacher') {
            addMaterialBtn.style.display = 'flex';
            teacherHint.style.display = 'block';
            
            addMaterialBtn.addEventListener('click', openAddMaterialModal);
        }
    }
    
    function getMaterials() {
        const materials = JSON.parse(localStorage.getItem('materials') || '[]');
        return materials.filter(material => material.courseId === courseId);
    }
    
    function displayMaterials() {
        const materials = getMaterials();
        
        if (materials.length === 0) {
            materialsGrid.style.display = 'none';
            noMaterialsMessage.style.display = 'block';
            return;
        }
        
        materialsGrid.style.display = 'grid';
        noMaterialsMessage.style.display = 'none';
        
        materialsGrid.innerHTML = materials.map(material => createMaterialCard(material)).join('');
    }
    
    function createMaterialCard(material) {
        const iconClass = getMaterialIcon(material.type);
        const typeLabel = getMaterialTypeLabel(material.type);
        const formattedDate = new Date(material.addedOn).toLocaleDateString();
        
        return `
            <div class="material-card">
                <div class="material-header">
                    <div class="material-icon ${material.type}">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="material-info">
                        <div class="material-type">${typeLabel}</div>
                        <h3 class="material-title">${material.title}</h3>
                        <p class="material-description">${material.description || 'No description available'}</p>
                    </div>
                </div>
                <div class="material-footer">
                    <div class="material-meta">
                        <i class="fas fa-calendar-alt"></i>
                        Added ${formattedDate}
                    </div>
                    <div class="material-actions">
                        <a href="${material.url}" target="_blank" class="view-btn">
                            <i class="fas fa-eye"></i>
                            View
                        </a>
                        <a href="${material.url}" target="_blank" class="download-btn">
                            <i class="fas fa-download"></i>
                            Download
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
    
    function getMaterialIcon(type) {
        const icons = {
            pdf: 'fas fa-file-pdf',
            video: 'fas fa-video',
            link: 'fas fa-link',
            document: 'fas fa-file-alt',
            presentation: 'fas fa-file-powerpoint'
        };
        return icons[type] || 'fas fa-file';
    }
    
    function getMaterialTypeLabel(type) {
        const labels = {
            pdf: 'PDF Document',
            video: 'Video',
            link: 'Web Link',
            document: 'Document',
            presentation: 'Presentation'
        };
        return labels[type] || 'File';
    }
    
    function filterMaterials() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value;
        const materials = getMaterials();
        
        const filteredMaterials = materials.filter(material => {
            const matchesSearch = material.title.toLowerCase().includes(searchTerm) ||
                                  material.description.toLowerCase().includes(searchTerm);
            const matchesType = !selectedType || material.type === selectedType;
            
            return matchesSearch && matchesType;
        });
        
        if (filteredMaterials.length === 0) {
            materialsGrid.innerHTML = `
                <div class="no-materials" style="grid-column: 1 / -1;">
                    <i class="fas fa-search"></i>
                    <h3>No Materials Found</h3>
                    <p>No materials match your search criteria.</p>
                </div>
            `;
        } else {
            materialsGrid.innerHTML = filteredMaterials.map(material => createMaterialCard(material)).join('');
        }
    }
    
    function openAddMaterialModal() {
        addMaterialModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeAddMaterialModal() {
        addMaterialModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        addMaterialForm.reset();
    }
    
    function handleAddMaterial(e) {
        e.preventDefault();
        
        const formData = new FormData(addMaterialForm);
        const materialData = {
            id: generateId(),
            courseId: courseId,
            title: document.getElementById('materialTitle').value.trim(),
            type: document.getElementById('materialType').value,
            url: document.getElementById('materialUrl').value.trim(),
            description: document.getElementById('materialDescription').value.trim(),
            addedBy: currentUser,
            addedOn: new Date().toISOString()
        };
        
        // Validate required fields
        if (!materialData.title || !materialData.type || !materialData.url) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Validate URL format
        if (!isValidUrl(materialData.url)) {
            alert('Please enter a valid URL.');
            return;
        }
        
        // Save material
        saveMaterial(materialData);
        
        // Close modal and refresh display
        closeAddMaterialModal();
        displayMaterials();
        
        // Show success message
        showSuccessMessage('Material added successfully!');
    }
    
    function saveMaterial(material) {
        console.log(material);
        const materials = JSON.parse(localStorage.getItem('materials') || '[]');
        materials.push(material);
        localStorage.setItem('materials', JSON.stringify(materials));
    }
    
    function generateId() {
        return 'mat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    function showSuccessMessage(message) {
        // Create and show a temporary success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            font-family: var(--body-font);
            font-size: var(--normal-font-size);
        `;
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
    
    function showCourseNotFound() {
        courseNotFound.style.display = 'flex';
        document.querySelector('.container').style.display = 'none';
    }
    
    // Initialize sample data for testing (remove in production)
    function initSampleData() {
        if (!localStorage.getItem('courses')) {
            const sampleCourses = [
                {
                    id: 'course001',
                    title: 'Web Development Fundamentals',
                    subject: 'Computer Science',
                    description: 'Learn the basics of HTML, CSS, and JavaScript to build modern web applications.',
                    teacher: 'Ms. Sarah Johnson',
                    createdOn: '2025-06-15'
                },
                {
                    id: 'course002',
                    title: 'Digital Marketing Essentials',
                    subject: 'Business',
                    description: 'Master the fundamentals of digital marketing including SEO, social media, and analytics.',
                    teacher: 'Mr. Ahmed Khan',
                    createdOn: '2025-06-14'
                }
            ];
            localStorage.setItem('courses', JSON.stringify(sampleCourses));
        }
        
        if (!localStorage.getItem('materials')) {
            const sampleMaterials = [
                {
                    id: 'mat001',
                    courseId: 'course001',
                    title: 'HTML Basics Guide',
                    type: 'pdf',
                    url: 'https://example.com/html-guide.pdf',
                    description: 'Complete guide to HTML fundamentals including tags, attributes, and best practices.',
                    addedBy: 'Ms. Sarah Johnson',
                    addedOn: '2025-06-15'
                },
                {
                    id: 'mat002',
                    courseId: 'course001',
                    title: 'CSS Styling Tutorial',
                    type: 'video',
                    url: 'https://youtube.com/watch?v=example',
                    description: 'Learn CSS styling techniques with practical examples and exercises.',
                    addedBy: 'Ms. Sarah Johnson',
                    addedOn: '2025-06-16'
                },
                {
                    id: 'mat003',
                    courseId: 'course001',
                    title: 'JavaScript Documentation',
                    type: 'link',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
                    description: 'Official JavaScript documentation and reference guide.',
                    addedBy: 'Ms. Sarah Johnson',
                    addedOn: '2025-06-17'
                }
            ];
            localStorage.setItem('materials', JSON.stringify(sampleMaterials));
        }
    }
    
    // Initialize sample data (comment out in production)
    initSampleData();
    
});