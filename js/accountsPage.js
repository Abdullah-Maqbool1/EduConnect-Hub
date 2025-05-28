document.addEventListener('DOMContentLoaded', function() {
    // Get all elements
    const loginForm = document.querySelector('.accounts__form--login');
    const registerForm = document.querySelector('.accounts__form--register');
    const loginTab = document.querySelectorAll('[data-tab="login"]');
    const registerTab = document.querySelectorAll('[data-tab="register"]');
    
    // Function to switch forms
    function switchForm(tab) {
        // First reset all forms and tabs
        loginForm.classList.remove('active');
        registerForm.classList.remove('active');
        
        // Note: We're using querySelectorAll and looping because there are multiple tabs
        loginTab.forEach(tab => tab.classList.remove('accounts__tab--active'));
        registerTab.forEach(tab => tab.classList.remove('accounts__tab--active'));
        
        if (tab === 'login') {
            loginForm.classList.add('active');
            loginTab.forEach(tab => tab.classList.add('accounts__tab--active'));
        } else {
            registerForm.classList.add('active');
            registerTab.forEach(tab => tab.classList.add('accounts__tab--active'));
        }
    }
    
    // Add event listeners to all tabs (since there are multiple in your HTML)
    document.querySelectorAll('[data-tab="login"]').forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            switchForm('login');
        });
    });
    
    document.querySelectorAll('[data-tab="register"]').forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            switchForm('register');
        });
    });
    
    // Form submission handlers
    document.querySelector('.accounts__form--login .accounts__form-content')
        .addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Login form submitted');
        });
    
    document.querySelector('.accounts__form--register .accounts__form-content')
        .addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Register form submitted');
        });
    
    // Initialize with login form active
    switchForm('login');
});