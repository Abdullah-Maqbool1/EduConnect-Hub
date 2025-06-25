document.addEventListener('DOMContentLoaded', function () {
  // Get form and tab elements
  const loginForm = document.querySelector('.accounts__form--login');
  const registerForm = document.querySelector('.accounts__form--register');
  const loginTabs = document.querySelectorAll('[data-tab="login"]');
  const registerTabs = document.querySelectorAll('[data-tab="register"]');

  // Function to switch between login/register forms
  function switchForm(tab) {
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    loginTabs.forEach(tab => tab.classList.remove('accounts__tab--active'));
    registerTabs.forEach(tab => tab.classList.remove('accounts__tab--active'));

    if (tab === 'login') {
      loginForm.classList.add('active');
      loginTabs.forEach(tab => tab.classList.add('accounts__tab--active'));
      document.title = "Login - EduConnectHub";
    } else {
      registerForm.classList.add('active');
      registerTabs.forEach(tab => tab.classList.add('accounts__tab--active'));
      document.title = "Register - EduConnectHub";
    }
  }

  // Add tab switching events
  loginTabs.forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();
      switchForm('login');
    });
  });

  registerTabs.forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();
      switchForm('register');
    });
  });

  // Handle registration
  registerForm.querySelector('.accounts__form-content').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm-password").value;
    const role = document.getElementById("user-teacher").checked ? "teacher" : "student";

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.some(user => user.email === email);
    if (userExists) {
      alert("Email already registered.");
      return;
    }

    users.push({ name, email, password, role });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! You can now log in.");
    switchForm("login");
  });

  // Handle login
  loginForm.querySelector('.accounts__form-content').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find(user => user.email === email && user.password === password);

    if (!foundUser) {
      alert("Invalid email or password.");
      return;
    }

    // Save login session info
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("name", foundUser.name);
    localStorage.setItem("email", foundUser.email);
    localStorage.setItem("role", foundUser.role);

    // Redirect to correct dashboard
    if (foundUser.role === "student") {
      window.location.href = "studentDashboard.html";
    } else {
      window.location.href = "teacherDashboard.html";
    }
  });

  // Load login tab by default
  switchForm('login');
});
