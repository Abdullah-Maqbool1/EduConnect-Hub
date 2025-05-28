document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.accounts__form--login');
    const registerForm = document.querySelector('.accounts__form--register');
    const loginTab = document.querySelector('[data-tab="login"]');
    const registerTab = document.querySelector('[data-tab="register"]');
    const backgroundImage = document.querySelector('.accounts__image');
    
    // Switch between login and register forms
    function switchForm(tab) {
        if (tab === 'login') {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            
            // Update tab styles
            loginTab.classList.add('accounts__tab--active');
            registerTab.classList.remove('accounts__tab--active');
            
        } else {
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
        }
    }
    
    // Tab click event listeners
    loginTab.addEventListener('click', function(e) {
        e.preventDefault();
        switchForm('login');
    });
    
    registerTab.addEventListener('click', function(e) {
        e.preventDefault();
        switchForm('register');
    });
    
    // Form submission
    const forms = document.querySelectorAll('.accounts__form-content');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically handle form submission with AJAX
            alert('Form submitted! In a real application, this would send data to your server.');
        });
    });
    
    // Initialize with login form active
    switchForm('login');
});