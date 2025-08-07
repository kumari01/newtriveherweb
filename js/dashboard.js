document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const logoutBtns = document.querySelectorAll(".logoutBtn");
  const userGreetings = document.querySelectorAll(".userGreeting");

  // Updates UI based on authentication state
  function updateAuthUI() {
    const token = localStorage.getItem("thriveher_token");

    if (token) {
      // Hide login/signup buttons when logged in
      if (loginBtn) loginBtn.style.display = "none";
      if (signupBtn) signupBtn.style.display = "none";

      // Show all logout buttons and greetings
      logoutBtns.forEach(btn => btn.style.display = "inline-block");

      const user = JSON.parse(localStorage.getItem("thriveher_user") || "{}");
      userGreetings.forEach(ug => {
        ug.textContent = `Hi, ${user.name || "User"}!`;
        // DON'T modify style.display here; CSS controls visibility
      });


    } else {
      // Show login/signup on logout or not logged in
      if (loginBtn) loginBtn.style.display = "inline-block";
      if (signupBtn) signupBtn.style.display = "inline-block";

      // Hide logout buttons and greeting texts
      logoutBtns.forEach(btn => btn.style.display = "none");
      userGreetings.forEach(ug => {
        ug.textContent = "";
        // CSS controls visibility (hidden on relevant screen sizes)
      });

    }
  }

  // Initial UI update on page load
  updateAuthUI();

  // Attach logout event to all logout buttons
  logoutBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      localStorage.removeItem("thriveher_token");
      localStorage.removeItem("thriveher_user");
      updateAuthUI();
      // Redirect to landing page after logout
      window.location.href = "../index.html";
    });
  });
});
