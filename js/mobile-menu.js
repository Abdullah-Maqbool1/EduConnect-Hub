// Global variables to store elements (will be set after header loads)
let hamburger, mobileMenu, mobileMenuOverlay, body;

// Initialize mobile menu functionality
function initializeMobileMenu() {
    hamburger = document.getElementById('hamburger');
    mobileMenu = document.getElementById('mobileMenu');
    mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    body = document.body;

    // Only proceed if elements exist (for pages that have mobile menu)
    if (!hamburger || !mobileMenu || !mobileMenuOverlay) {
        return;
    }

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

// Active States Handler for Navigation
function handleActiveStates() {
    const currentPage = window.location.pathname;
    const currentFileName = currentPage.split('/').pop() || 'Home.html';

    // Desktop navigation links
    const desktopNavLinks = document.querySelectorAll('.nav-link');
    // Mobile navigation links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Remove active class from all links
    function removeAllActiveClasses() {
        desktopNavLinks.forEach(link => link.classList.remove('active'));
        mobileNavLinks.forEach(link => link.classList.remove('active'));
    }

    // Add active class based on href attribute
    function setActiveLink(targetFileName) {
        // Handle desktop links
        desktopNavLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const linkFileName = linkHref.split('/').pop();
            if (linkFileName === targetFileName || 
                (targetFileName === 'Home.html' && (linkFileName === 'index.html' || linkFileName === ''))) {
                link.classList.add('active');
            }
        });

        // Handle mobile links
        mobileNavLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const linkFileName = linkHref.split('/').pop();
            if (linkFileName === targetFileName || 
                (targetFileName === 'Home.html' && (linkFileName === 'index.html' || linkFileName === ''))) {
                link.classList.add('active');
            }
        });
    }

    // Remove all active classes first
    removeAllActiveClasses();

    // Set active based on current page filename
    console.log('Current filename:', currentFileName); // Debug log
    
    if (currentFileName === 'Home.html' || currentFileName === '' || currentFileName === 'index.html') {
        setActiveLink('Home.html');
    } else if (currentFileName === 'aboutPage.html') {
        setActiveLink('aboutPage.html');
    } else if (currentFileName === 'studentDashboard.html') {
        setActiveLink('studentDashboard.html');
    } else if (currentFileName === 'courses.html') {
        setActiveLink('courses.html');
    } else if (currentFileName === 'feedback.html') {
        setActiveLink('feedback.html');
    } else if (currentFileName === 'elibrary.html') {
        setActiveLink('elibrary.html');
    } else {
        // For any other page, try to match the filename directly
        setActiveLink(currentFileName);
    }

    // Handle click events for both desktop and mobile
    function handleNavClick(event) {
        const clickedLink = event.target;
        const href = clickedLink.getAttribute('href');
        const fileName = href.split('/').pop();

        // Remove active from all links
        removeAllActiveClasses();

        // Add active to both desktop and mobile versions of the clicked link
        setActiveLink(fileName);
        
        // Store the active link in sessionStorage for persistence
        sessionStorage.setItem('activeNavLink', fileName);
    }

    // Add click listeners to desktop links
    desktopNavLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Add click listeners to mobile links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Check if there's a stored active link and restore it
    const storedActiveLink = sessionStorage.getItem('activeNavLink');
    if (storedActiveLink) {
        const currentPageFileName = currentFileName === '' ? 'Home.html' : currentFileName;
        if (storedActiveLink === currentPageFileName) {
            setActiveLink(storedActiveLink);
        }
    }
}

// Main initialization function - call this after header is loaded
function initializeNavigation() {
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize active states
    handleActiveStates();
}

// Auto-run when DOM is loaded (fallback)
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure fetch operations complete
    setTimeout(initializeNavigation, 100);
});

// Update active states when navigating back/forward
window.addEventListener('popstate', () => {
    setTimeout(handleActiveStates, 100);
});

// Export the initialization function for manual calling
window.initializeNavigation = initializeNavigation;