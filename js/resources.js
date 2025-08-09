// Check if user is logged in using token in localStorage
function isUserLoggedIn() {
  return !!localStorage.getItem('thriveher_token');
}

// Handle resource downloads
document.addEventListener('DOMContentLoaded', function () {
  const downloadButtons = document.querySelectorAll('[download]');

  downloadButtons.forEach(button => {
    // Store original href and remove it to prevent immediate download
    const downloadUrl = button.getAttribute('href');
    button.removeAttribute('href');

    button.addEventListener('click', function (e) {
      e.preventDefault();

      if (!isUserLoggedIn()) {
        showToast('Please login to download resources', 'error');
        setTimeout(() => {
          const loginModal = document.getElementById('loginModal');
          if (loginModal) loginModal.classList.add('show');
        }, 1000);
        return;
      }

      // User logged in - proceed with download
      window.location.href = downloadUrl;
    });
  });
});
