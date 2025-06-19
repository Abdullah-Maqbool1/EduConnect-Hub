const teamData = [
  {
    name: "Jane Smith",
    role: "Co-Founder",
    image: "assets/images/aboutPageProfile.jpg",
    bio: "Passionate about education, Jane leads the vision for EduConnectHub.",
    social: {
      github: "https://github.com/",
      linkedin: "https://linkedin.com/",
      instagram: "https://instagram.com/"
    }
  },
  {
    name: "Michael Lee",
    role: "Lead Developer",
    image: "assets/images/aboutPageProfile.jpg",
    bio: "A student coder building innovative tools for learning.",
    social: {
      github: "https://github.com/",
      linkedin: "https://linkedin.com/",
      instagram: "https://instagram.com/"
    }
  },
  {
    name: "Sarah Davis",
    role: "Mentor",
    image: "assets/images/aboutPageProfile.jpg",
    bio: "An experienced teacher fostering collaboration in classrooms.",
    social: {
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
      instagram: "https://instagram.com/"
    }
  },
  {
    name: "Alex Brown",
    role: "Student Advocate",
    image: "assets/images/aboutPageProfile.jpg",
    bio: "Representing student voices to shape the platform.",
    social: {
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in",
      instagram: "https://instagram.com"
    }
  }
];

function populateTeam() {
  const teamGrid = document.getElementById('team-grid');
  teamGrid.innerHTML = teamData.map(member => `
    <div class="team-card">
      <img src="${member.image}" alt="${member.name}">
      <h3>${member.name}</h3>
      <p class="role">${member.role}</p>
      <p class="bio">${member.bio}</p>
      <div class="social-icons">
        <a href="${member.social.github}" target="_blank"><i class="fab fa-github"></i></a>
        <a href="${member.social.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>
        <a href="${member.social.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>
      </div>
    </div>
  `).join('');
}

// Check localStorage for user role and personalize content
function personalizeContent() {
  const role = localStorage.getItem('role');
  if (role === 'student') {
    document.querySelector('.intro-text').textContent += ' Discover tools designed to enhance your learning journey!';
  } else if (role === 'teacher') {
    document.querySelector('.intro-text').textContent += ' Explore resources to empower your teaching experience!';
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  populateTeam();
  personalizeContent();
});