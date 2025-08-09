// Check if user is logged in using token in localStorage
function isUserLoggedIn() {
  return !!localStorage.getItem('thriveher_token');
}

// Initialize and render course cards into #course-grid
function initializeCourseCards() {
  const courseGrid = document.querySelector('#course-grid');
  if (courseGrid) {
    courseGrid.innerHTML = Object.values(courses)
      .map(course => getCourseCardHTML(course))
      .join('');
  }
}

// Show course detail view
function showCourseDetail(courseId) {
  const course = courses[courseId];
  const detailSection = document.getElementById('course-detail');
  const detailContent = document.getElementById('course-detail-content');

  if (!course || !detailSection || !detailContent) return;

  // Hide course list and show detail
  document.getElementById('courses').classList.add('hidden');
  detailSection.classList.remove('hidden');

  detailContent.innerHTML = getCourseDetailHTML(course);

  detailSection.scrollIntoView({ behavior: 'smooth' });
}

// Back to courses button logic
document.getElementById('back-to-courses').addEventListener('click', function (e) {
  e.preventDefault();

  document.getElementById('course-detail').classList.add('hidden');
  document.getElementById('courses').classList.remove('hidden');

  document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
});

// Handle "Enroll Now" button clicks
document.addEventListener('click', function (e) {
  const enrollBtn = e.target.closest('.enroll-button');
  if (enrollBtn) {
    e.preventDefault();
    const courseId = enrollBtn.dataset.course;
    if (!courseId) return;

    if (!isUserLoggedIn()) {
      showToast('Please log in to enroll in courses', 'error');
      setTimeout(() => {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.classList.add('show');
      }, 1000);
      return;
    }
    showCourseDetail(courseId);
  }
});

// Initialize on DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeCourseCards();
});
