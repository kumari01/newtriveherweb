// Assuming this login check function is available globally
function isUserLoggedIn() {
  return !!localStorage.getItem('thriveher_token');
}

// Add event delegation for Contact buttons
document.addEventListener('click', function(e) {
  const contactBtn = e.target.closest('.btn-primary');
  if (contactBtn && contactBtn.textContent.trim() === 'Contact') {
    e.preventDefault();
    console.log('Contact button clicked');

    if (!isUserLoggedIn()) {
      console.log('User not logged in - showing toast');
      showToast('Please log in to contact mentors', 'error');

      setTimeout(() => {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.classList.add('show');
      }, 1000);
      return;
    }
    // Authorized user action here...
    // You can add your contact logic or modal here.
  }
});
