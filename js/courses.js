// Course Management System
class CourseManager {
    constructor() {
        this.courses = this.loadCourses();
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    // Initialize the course manager
    init() {
        this.setupEventListeners();
        this.checkUserRole();
        this.displayCourses();
    }

    // Load courses from localStorage
    loadCourses() {
        const courses = localStorage.getItem('courses');
        return courses ? JSON.parse(courses) : [];
    }

    // Save courses to localStorage
    saveCourses() {
        localStorage.setItem('courses', JSON.stringify(this.courses));
    }

    // Get current user from localStorage
    getCurrentUser() {
        const role = localStorage.getItem('role');
        const name = localStorage.getItem('userName') || localStorage.getItem('name');
        return { role, name };
    }

    // Check user role and show/hide teacher-only features
    checkUserRole() {
        const addCourseBtn = document.getElementById('addCourseBtn');
        if (this.currentUser.role === 'teacher') {
            addCourseBtn.style.display = 'flex';
        } else {
            addCourseBtn.style.display = 'none';
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', () => this.filterCourses());

        // Subject filter
        const subjectFilter = document.getElementById('subjectFilter');
        subjectFilter.addEventListener('change', () => this.filterCourses());

        // Add course button (teacher only)
        const addCourseBtn = document.getElementById('addCourseBtn');
        addCourseBtn.addEventListener('click', () => this.openAddCourseModal());

        // Modal controls
        const closeModal = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const addCourseModal = document.getElementById('addCourseModal');
        
        closeModal.addEventListener('click', () => this.closeAddCourseModal());
        cancelBtn.addEventListener('click', () => this.closeAddCourseModal());
        
        // Close modal when clicking outside
        addCourseModal.addEventListener('click', (e) => {
            if (e.target === addCourseModal) {
                this.closeAddCourseModal();
            }
        });

        // Form submission
        const addCourseForm = document.getElementById('addCourseForm');
        addCourseForm.addEventListener('submit', (e) => this.handleAddCourse(e));
    }

    // Display courses
    displayCourses(coursesToShow = this.courses) {
        const coursesGrid = document.getElementById('coursesGrid');
        const noCoursesMessage = document.getElementById('noCoursesMessage');

        if (coursesToShow.length === 0) {
            coursesGrid.innerHTML = '';
            noCoursesMessage.style.display = 'block';
            return;
        }

        noCoursesMessage.style.display = 'none';
        coursesGrid.innerHTML = coursesToShow.map(course => this.createCourseCard(course)).join('');

        // Add event listeners to view material buttons
        const viewButtons = coursesGrid.querySelectorAll('.view-materials-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const courseId = e.target.closest('.course-card').dataset.courseId;
                this.viewCourseMaterials(courseId);
            });
        });
    }

    // Create course card HTML
    createCourseCard(course) {
        const createdDate = new Date(course.createdOn).toLocaleDateString();
        
        return `
            <div class="course-card" data-course-id="${course.id}">
                <div class="course-header">
                    <div>
                        <h3 class="course-title">${course.title}</h3>
                    </div>
                    <span class="course-subject">${course.subject}</span>
                </div>
                
                <p class="course-description">${course.description}</p>
                
                <div class="course-footer">
                    <div class="course-teacher">
                        <i class="fas fa-user-graduate"></i>
                        ${course.teacher}
                    </div>
                    <button class="view-materials-btn">
                        <i class="fas fa-folder-open"></i>
                        View Materials
                    </button>
                </div>
            </div>
        `;
    }

    // Filter courses based on search and subject filter
    filterCourses() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const selectedSubject = document.getElementById('subjectFilter').value;

        let filteredCourses = this.courses;

        // Filter by search term
        if (searchTerm) {
            filteredCourses = filteredCourses.filter(course =>
                course.title.toLowerCase().includes(searchTerm) ||
                course.description.toLowerCase().includes(searchTerm) ||
                course.teacher.toLowerCase().includes(searchTerm)
            );
        }

        // Filter by subject
        if (selectedSubject) {
            filteredCourses = filteredCourses.filter(course =>
                course.subject === selectedSubject
            );
        }

        this.displayCourses(filteredCourses);
    }

    // Open add course modal
    openAddCourseModal() {
        const modal = document.getElementById('addCourseModal');
        modal.classList.add('active');
        
        // Reset form
        document.getElementById('addCourseForm').reset();
    }

    // Close add course modal
    closeAddCourseModal() {
        const modal = document.getElementById('addCourseModal');
        modal.classList.remove('active');
    }

    // Handle add course form submission
    handleAddCourse(e) {
        e.preventDefault();

        const title = document.getElementById('courseTitle').value.trim();
        const subject = document.getElementById('courseSubject').value;
        const description = document.getElementById('courseDescription').value.trim();

        if (!title || !subject || !description) {
            alert('Please fill in all required fields.');
            return;
        }

        // Create new course object
        const newCourse = {
            id: this.generateCourseId(),
            title: title,
            subject: subject,
            description: description,
            teacher: this.currentUser.name || 'Unknown Teacher',
            createdOn: new Date().toISOString().split('T')[0]
        };

        // Add to courses array
        this.courses.push(newCourse);
        this.saveCourses();

        // Close modal and refresh display
        this.closeAddCourseModal();
        this.displayCourses();

        // Show success message
        this.showSuccessMessage('Course created successfully!');
    }

    // Generate unique course ID
    generateCourseId() {
        return 'course_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Navigate to course materials page
    viewCourseMaterials(courseId) {
        window.location.href = `course-material.html?courseId=${courseId}`;
    }

    // Show success message
    showSuccessMessage(message) {
        // Create temporary success message element
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            font-family: var(--body-font);
            font-size: var(--normal-font-size);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        successDiv.textContent = message;

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(successDiv);

        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.remove();
            style.remove();
        }, 3000);
    }
}

// Initialize course manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const courseManager = new CourseManager();
});