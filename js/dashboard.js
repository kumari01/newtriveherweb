document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userGreeting = document.getElementById("userGreeting");

  function updateAuthUI() {
    const token = localStorage.getItem("thriveher_token");
    if(token) {
      if(loginBtn) loginBtn.style.display = "none";
      if(signupBtn) signupBtn.style.display = "none";
      if(logoutBtn) logoutBtn.style.display = "inline-block";
      if(userGreeting) {
        const user = JSON.parse(localStorage.getItem("thriveher_user") || "{}");
        userGreeting.textContent = `Hi, ${user.name || "User"}!`;
        userGreeting.style.display = "inline-block";
      }
    } else {
      if(loginBtn) loginBtn.style.display = "inline-block";
      if(signupBtn) signupBtn.style.display = "inline-block";
      if(logoutBtn) logoutBtn.style.display = "none";
      if(userGreeting) userGreeting.style.display = "none";
    }
  }

  updateAuthUI();

  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("thriveher_token");
    localStorage.removeItem("thriveher_user");
    updateAuthUI();
  });
});
