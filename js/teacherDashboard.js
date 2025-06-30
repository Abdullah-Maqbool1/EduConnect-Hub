document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("name") || "Teacher";
  console.log(name);
  const role = localStorage.getItem("role");
  console.log(role);
  if (role !== "teacher") window.location.href = "../Home.html";

  document.getElementById("teacherName").textContent = name;

  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  const materials = JSON.parse(localStorage.getItem("materials")) || [];
  console.log("mm",materials);
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

  const myCourses = courses.filter(c => c.teacher === name);
  console.log(myCourses);
  const myMaterials = materials.filter(m => m.addedBy === name);
  console.log(myMaterials);

  document.getElementById("courseCount").textContent = myCourses.length;
  document.getElementById("materialCount").textContent = myMaterials.length;
  document.getElementById("feedbackCount").textContent = feedbacks.filter(f => f.role === "student").length;

  const coursesContainer = document.getElementById("teacherCourses");
  coursesContainer.innerHTML = myCourses.map(course => `
    <div class="course-card">
      <h4>${course.title} (${course.subject})</h4>
      <p>${course.description}</p>
      <a href="course-material.html?courseId=${course.id}" class="btn-primary">Manage Materials</a>
    </div>
  `).join("");

  const uploadsList = document.getElementById("recentUploads");
  const recentUploads = myMaterials.sort((a, b) => new Date(b.addedOn) - new Date(a.addedOn)).slice(0, 5);
  uploadsList.innerHTML = recentUploads.map(m => `
    <li><strong>${m.title}</strong> – ${getCourseTitle(m.courseId)} (${m.type.toUpperCase()})</li>
  `).join("");

  const feedbackList = document.getElementById("feedbackList");
  const studentFeedbacks = feedbacks.filter(f => f.role === "student");
  feedbackList.innerHTML = studentFeedbacks.map(f => `
    <li>
      <strong>${f.name}</strong> – ${f.category} (${new Date(f.date).toLocaleDateString()})
      <div class="feedback-msg">${f.message}</div>
    </li>
  `).join("");

  function getCourseTitle(courseId) {
    const match = courses.find(c => c.id === courseId);
    return match ? match.title : "Unknown Course";
  }

  document.getElementById("addCourseBtn").addEventListener("click", () => {
    window.location.href = "courses.html";
  });
});
