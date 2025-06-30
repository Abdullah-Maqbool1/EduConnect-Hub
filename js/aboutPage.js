const teamData = [
  {
    name: "Areef ur Rehman",
    role: "Lead Developer",
    image: "assets/images/areef_profile_pic.jpg",
    bio: "A student coder building innovative tools for learning.",
    social: {
      github: "https://github.com/areefurrahman",
      linkedin: "https://linkedin.com/",
      instagram: "https://instagram.com/"
    }
  },
  {
    name: "Muzaffar Ali",
    role: "Mentor",
    image: "assets/images/muzaffar_profile_pic.jpg",
    bio: "An experienced teacher fostering collaboration in classrooms.",
    social: {
      github: "https://github.com/muz1058",
      linkedin: "https://www.linkedin.com/in/muzaffar-ali-1177672a6?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      instagram: "https://instagram.com/"
    }
  },
  {
    name: "Abdullah Maqbool",
    role: "Student Advocate",
    image: "assets/images/abdullah_profile_pic.jpg",
    bio: "Representing student voices to shape the platform.",
    social: {
      github: "https://github.com/Abdullah-Maqbool1",
      linkedin: "https://pk.linkedin.com/in/areef-ur-rahman",
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