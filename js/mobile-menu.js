const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const body = document.body;

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





// Active States Handler for Navigation
function handleActiveStates() {
    const currentPage = window.location.pathname;

    // Desktop navigation links
    const desktopNavLinks = document.querySelectorAll('.nav-link');
    // Mobile navigation links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Remove active class from all links
    function removeAllActiveClasses() {
        desktopNavLinks.forEach(link => link.classList.remove('active'));
        mobileNavLinks.forEach(link => link.classList.remove('active'));
    }

    // Add active class based on current page
    function setActiveLink(href) {
        // Handle desktop links
        desktopNavLinks.forEach(link => {
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });

        // Handle mobile links
        mobileNavLinks.forEach(link => {
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    }

    // Remove all active classes first
    removeAllActiveClasses();

    // Set active based on current page
    if (currentPage === '/' || currentPage === '/Home.html' || currentPage.endsWith('/Home.html')) {
        setActiveLink('/Home.html');
    } else if (currentPage === '/features.html' || currentPage.endsWith('/features.html')) {
        setActiveLink('features.html');
    } else if (currentPage === '/aboutus.html' || currentPage.endsWith('/aboutus.html')) {
        setActiveLink('aboutus.html');
    }

    // Handle click events for both desktop and mobile
    function handleNavClick(event) {
        const clickedLink = event.target;
        const href = clickedLink.getAttribute('href');

        // Remove active from all links
        removeAllActiveClasses();

        // Add active to both desktop and mobile versions of the clicked link
        setActiveLink(href);
    }

    // Add click listeners to desktop links
    desktopNavLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Add click listeners to mobile links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
}

// Initialize active states when page loads
document.addEventListener('DOMContentLoaded', handleActiveStates);

// Update active states when navigating back/forward
window.addEventListener('popstate', handleActiveStates);