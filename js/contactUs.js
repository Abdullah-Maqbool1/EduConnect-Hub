function handleFormSubmission(event) {
  event.preventDefault();
  
  // Get form values
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const role = document.getElementById('role').value;
  const message = document.getElementById('message').value;

  // Store form data in localStorage (for demo purposes, since no backend)
  const formData = { name, email, role, message, timestamp: new Date().toISOString() };
  localStorage.setItem('contactFormSubmission', JSON.stringify(formData));

  // Show confirmation (replace with actual backend submission in production)
  alert('Thank you for your message! We will get back to you soon.');

  // Reset form
  document.getElementById('contact-form').reset();
}

// Personalize intro text based on user role
function personalizeContent() {
  const role = localStorage.getItem('role');
  if (role === 'student') {
    document.querySelector('.intro-text').textContent += ' We’re excited to support your learning journey!';
  } else if (role === 'teacher') {
    document.querySelector('.intro-text').textContent += ' Let’s collaborate to enhance your teaching experience!';
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('contact-form').addEventListener('submit', handleFormSubmission);
  personalizeContent();
});