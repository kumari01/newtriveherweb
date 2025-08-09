// Helper Functions (can be outside DOMContentLoaded)
function showFormMessage(form, message, isError = true) {
  let msgElem = form.querySelector(".form-message");
  if (!msgElem) {
    msgElem = document.createElement("div");
    msgElem.className = "form-message";
    msgElem.style.margin = "10px 0";
    msgElem.style.fontSize = "1rem";
    form.insertBefore(msgElem, form.firstChild);
  }
  msgElem.textContent = message;
  msgElem.style.color = isError ? "#dc2626" : "#16a34a";
}

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function updateAuthUI() {
  const token = localStorage.getItem("thriveher_token");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const userGreetings = document.querySelectorAll(".userGreeting");
  const logoutBtns = document.querySelectorAll(".logoutBtn");
  const dashboardLogin = document.getElementById("openLoginFromDashboard"); // Dashboard login link

  if (token) {
    let user = JSON.parse(localStorage.getItem("thriveher_user") || "null");
    if (!user) {
      const payload = parseJwt(token);
      user = payload ? { name: payload.name || payload.email || "User" } : { name: "User" };
    }
    if (userGreetings) {
      userGreetings.forEach(ug => {
        ug.textContent = `Hi, ${user.name || user.email || "User"}!`;
        // Do NOT change display style here
      });
    }
    if (logoutBtns) logoutBtns.forEach(btn => btn.classList.remove("hidden"));
    if (loginBtn) loginBtn.classList.add("hidden");
    if (signupBtn) signupBtn.classList.add("hidden");
    if (dashboardLogin) dashboardLogin.style.display = "none";
  } else {
    if (userGreetings) userGreetings.forEach(ug => {
      ug.textContent = "";
      // Do NOT change display style here; let CSS handle hiding
    });
    if (logoutBtns) logoutBtns.forEach(btn => btn.classList.add("hidden"));
    if (loginBtn) loginBtn.classList.remove("hidden");
    if (signupBtn) signupBtn.classList.remove("hidden");
    if (dashboardLogin) dashboardLogin.style.display = "block";
  }
}


function initThreeScene() {
  // Stub for Three.js initialization
  console.log("3D scene initialized");
}

document.addEventListener("DOMContentLoaded", function () {
  // ---- Modal & Panel Elements ----
  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");
  const communityModal = document.getElementById("communityModal");
  const otpModal = document.getElementById("otpModal");
  const forgotPasswordModal = document.getElementById("forgotPasswordModal");
  const newPasswordModal = document.getElementById("newPasswordModal");

  const closeLoginModal = document.getElementById("closeLoginModal");
  const closeSignupModal = document.getElementById("closeSignupModal");
  const closeCommunityModal = document.getElementById("closeCommunityModal");
  const closeOtpModal = document.getElementById("closeOtpModal");
  const closeForgotPasswordModal = document.getElementById("closeForgotPasswordModal");
  const closeNewPasswordModal = document.getElementById("closeNewPasswordModal");

  const switchToSignup = document.getElementById("switchToSignup");
  const switchToLogin = document.getElementById("switchToLogin");

  const joinCommunityBtn = document.getElementById("joinCommunityBtn");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  const dashboardPanel = document.getElementById("dashboardPanel");
  const openDashboard = document.getElementById("openDashboard");
  const closeDashboard = document.getElementById("closeDashboard");

  // --- Forms ---
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const communityForm = document.getElementById("communityForm");
  const otpForm = document.getElementById("otpForm");
  const otpInput = document.getElementById("otpInput");
  const otpEmailInfo = document.getElementById("otpEmailInfo");

  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  const forgotPasswordMessage = document.getElementById("forgotPasswordMessage");

  const openForgotPassword = document.getElementById("openForgotPassword"); // Link in login modal

  const startLearningBtn = document.getElementById("start-learning-btn");
  if (startLearningBtn) {
    startLearningBtn.addEventListener("click", () => {
      openModal(signupModal);
    });
  }

  const getStartedBtn = document.getElementById('getStartedBtn');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      openModal(signupModal);
    });
  }

  // Home navigation: redirect to index if not logged in
  const homeNavLink = document.getElementById('homeNavLink');
  if (homeNavLink) {
    homeNavLink.addEventListener('click', function(e) {
      const isLoggedIn = !!localStorage.getItem("thriveher_token");
      if (!isLoggedIn) {
        e.preventDefault();
        window.location.href = "index.html"; // adjust if needed
      }
    });
  }

  // -- New Password Reset Modal & Form --
  const newPasswordForm = document.getElementById("newPasswordForm");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const newPasswordMessage = document.getElementById("newPasswordMessage");

  // --- State for OTP and Password Reset ---
  let pendingSignupEmail = "";
  let resetFlowEmail = "";
  let resetOtpVerified = false;

  // --- Helper for modal open/close ---
  function openModal(modal) { if (modal) modal.classList.add("show"); }
  function closeModal(modal) { if (modal) modal.classList.remove("show"); }

  // --- Dashboard toggle handlers ---
  if (openDashboard && dashboardPanel) {
    openDashboard.addEventListener("click", () => {
      dashboardPanel.classList.remove("translate-x-full");
      dashboardPanel.classList.add("translate-x-0");
    });
  }
  if (closeDashboard && dashboardPanel) {
    closeDashboard.addEventListener("click", () => {
      dashboardPanel.classList.remove("translate-x-0");
      dashboardPanel.classList.add("translate-x-full");
    });
  }

  // --- Modal open/close and switch handlers ---
  if (loginBtn && loginModal) loginBtn.addEventListener("click", () => openModal(loginModal));
  if (closeLoginModal && loginModal) closeLoginModal.addEventListener("click", () => closeModal(loginModal));
  if (signupBtn && signupModal) signupBtn.addEventListener("click", () => openModal(signupModal));
  if (closeSignupModal && signupModal) closeSignupModal.addEventListener("click", () => closeModal(signupModal));
  if (joinCommunityBtn && communityModal) joinCommunityBtn.addEventListener("click", () => openModal(communityModal));
  if (closeCommunityModal && communityModal) closeCommunityModal.addEventListener("click", () => closeModal(communityModal));
  if (closeOtpModal && otpModal) closeOtpModal.addEventListener("click", () => { closeModal(otpModal); otpForm.reset(); otpEmailInfo.textContent = ""; pendingSignupEmail = ""; });
  if (switchToSignup && loginModal && signupModal) switchToSignup.addEventListener("click", () => { closeModal(loginModal); openModal(signupModal); });
  if (switchToLogin && loginModal && signupModal) switchToLogin.addEventListener("click", () => { closeModal(signupModal); openModal(loginModal); });

  // --- Forgot password modal logic ---
  if (openForgotPassword && forgotPasswordModal && loginModal) {
    openForgotPassword.addEventListener("click", () => { closeModal(loginModal); openModal(forgotPasswordModal); });
  }
  if (closeForgotPasswordModal && forgotPasswordModal) {
    closeForgotPasswordModal.addEventListener("click", () => {
      closeModal(forgotPasswordModal);
      forgotPasswordMessage.textContent = "";
      forgotPasswordForm.reset();
    });
  }
  if (closeNewPasswordModal && newPasswordModal) {
    closeNewPasswordModal.addEventListener("click", () => {
      closeModal(newPasswordModal);
      newPasswordForm.reset();
      newPasswordMessage.textContent = "";
    });
  }

  //opening the login modal from dashboard
  const openLoginFromDashboard = document.getElementById("openLoginFromDashboard");
  if (openLoginFromDashboard && loginModal) {
    openLoginFromDashboard.addEventListener("click", () => {
      closeModal(dashboardPanel);
      openModal(loginModal);
    });
  }
  //active links updation code

  // --- Close modals on clicking outside ---
  window.addEventListener("click", (e) => {
    if (e.target === signupModal) closeModal(signupModal);
    if (e.target === loginModal) closeModal(loginModal);
    if (e.target === communityModal) closeModal(communityModal);
    if (e.target === otpModal) closeModal(otpModal);
    if (e.target === forgotPasswordModal) closeModal(forgotPasswordModal);
    if (e.target === newPasswordModal) closeModal(newPasswordModal);
    if (e.target === dashboardPanel) closeModal(dashboardPanel);
  });



  // ============================
  // === Signup/OTP Handlers ====
  // ============================
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const age = document.getElementById("age").value;

      try {
        const res = await fetch("http://localhost:5000/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, age }),
        });
        const data = await res.json();

        if (res.ok && data.message && data.message.includes("OTP")) {
          pendingSignupEmail = email;
          openModal(otpModal);
          if (otpEmailInfo) otpEmailInfo.textContent = `OTP sent to ${email}`;
          closeModal(signupModal);
          signupForm.reset();
        } else if (res.ok && data.token) {
          localStorage.setItem("thriveher_token", data.token);
          localStorage.setItem("thriveher_user", JSON.stringify(data.user));
          showFormMessage(signupForm, `Signup successful! Welcome, ${data.user.name}.`, false);
          setTimeout(() => { closeModal(signupModal); signupForm.reset(); updateAuthUI(); window.location.href = "dashboard.html"; }, 1200);
        } else {
          showFormMessage(signupForm, data.message || "Signup failed.");
        }
      } catch (err) {
        showFormMessage(signupForm, "Network error. Please try again.");
      }
    });
  }

  if (otpForm) {
    otpForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const otp = otpInput.value.trim();
      if (!pendingSignupEmail) {
        showFormMessage(otpForm, "We couldn’t find an active signup request. Please start the signup process before entering the OTP.");
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/api/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: pendingSignupEmail, otp }),
        });
        const data = await res.json();

        if (res.ok && data.token) {
          localStorage.setItem("thriveher_token", data.token);
          localStorage.setItem("thriveher_user", JSON.stringify(data.user));
          showFormMessage(otpForm, `Signup complete! Welcome, ${data.user.name}.`, false);
          setTimeout(() => {
            closeModal(otpModal);
            otpForm.reset();
            if (otpEmailInfo) otpEmailInfo.textContent = "";
            pendingSignupEmail = "";
            updateAuthUI();
            window.location.href = "../dashboard.html";
          }, 1200);
        } else {
          showFormMessage(otpForm, data.message || "OTP verification failed.");
        }
      } catch (err) {
        showFormMessage(otpForm, "Network error. Please try again.");
      }
    });
  }

  // ==========================
  // == Login Handler ==
  // ==========================
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      try {
        const res = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("thriveher_token", data.token);
          localStorage.setItem("thriveher_user", JSON.stringify(data.user));
          showFormMessage(loginForm, `Login successful! Welcome back, ${data.user.name}.`, false);
          setTimeout(() => {
            closeModal(loginModal);
            loginForm.reset();
            updateAuthUI();
            // Use the handleLoginRedirect function from dashboard.js
            if (typeof window.handleLoginRedirect === 'function') {
                window.handleLoginRedirect();
            } else {
                window.location.href = '../dashboard.html';
            }
          }, 1200);
        } else {
          showFormMessage(loginForm, data.message || "Login failed.");
        }
      } catch (err) {
        showFormMessage(loginForm, "Network error. Please try again.");
      }
    });
  }

  // ====================
  // == Forgot Password, OTP-for-reset, New Password ==
  // ====================
  // 1) Step 1: Handle "Forgot Password" Form Submission (send OTP)
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("forgotEmail").value.trim();

      // Clear previous messages
      forgotPasswordMessage.textContent = "";
      forgotPasswordMessage.style.color = "";

      try {
        const res = await fetch("http://localhost:5000/api/request-password-reset-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();

        if (res.ok) {
          forgotPasswordMessage.textContent =
            "If that email exists in our system, we’ve sent reset instructions.";
          forgotPasswordMessage.style.color = "#16a34a"; // green

          // Store this for OTP and password reset
          resetFlowEmail = email;
          resetOtpVerified = false;

          // After a slight delay, open OTP modal for reset
          setTimeout(() => {
            closeModal(forgotPasswordModal);
            otpInput.value = "";
            otpEmailInfo.textContent = `OTP sent to ${email}`;
            openModal(otpModal);
          }, 1200);
        } else {
          forgotPasswordMessage.textContent = data.message || "Failed to send reset email.";
          forgotPasswordMessage.style.color = "#dc2626"; // red
          resetFlowEmail = "";
        }
      } catch (err) {
        forgotPasswordMessage.style.color = "#dc2626"; // red
        forgotPasswordMessage.textContent = "Network error. Please try again.";
        resetFlowEmail = "";
      }
    });
  }

  // 2) Step 2: Handle OTP Modal for Password Reset (using resetFlowEmail instead of signup)
  otpForm?.addEventListener("submit", async function (e) {
    e.preventDefault();
    otpEmailInfo.textContent = "";
    const otp = otpInput.value.trim();

    // Determine if in "signup" or "reset" mode
    let forReset = !!resetFlowEmail;
    let email = forReset ? resetFlowEmail : pendingSignupEmail;

    if (!email) {
      showFormMessage(otpForm, "No process in progress.");
      return;
    }

    // If in password reset flow, use verify-reset-otp endpoint
    const url = forReset
      ? "http://localhost:5000/api/verify-reset-otp"
      : "http://localhost:5000/api/verify-otp";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      // For signup flow (has .token): handled further up
      if (!forReset) return; // Let signup handler take care

      // For password reset flow:
      if (forReset && res.ok) {
        resetOtpVerified = true;
        closeModal(otpModal);
        otpForm.reset();
        newPasswordForm.reset();
        newPasswordMessage.textContent = "";
        openModal(newPasswordModal);
      } else if (forReset) {
        otpEmailInfo.textContent = data.message || "Invalid OTP. Please try again.";
        otpEmailInfo.style.color = "red";
      }
    } catch (err) {
      otpEmailInfo.textContent = "Network error. Please try again.";
      otpEmailInfo.style.color = "red";
    }
  });

  // 3) Step 3: New Password Modal (after OTP verified in reset flow)
  newPasswordForm?.addEventListener("submit", async function (e) {
    e.preventDefault();
    newPasswordMessage.textContent = "";
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (newPassword.length < 6) {
      newPasswordMessage.textContent = "Password must be at least 6 characters.";
      newPasswordMessage.style.color = "#dc2626";
      return;
    }
    if (newPassword !== confirmPassword) {
      newPasswordMessage.textContent = "Passwords do not match.";
      newPasswordMessage.style.color = "#dc2626";
      return;
    }
    if (!resetOtpVerified || !resetFlowEmail) {
      newPasswordMessage.textContent = "OTP not verified.";
      newPasswordMessage.style.color = "#dc2626";
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetFlowEmail, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        newPasswordMessage.textContent = "Password reset successful! Redirecting to login…";
        newPasswordMessage.style.color = "#16a34a";
        setTimeout(() => {
          closeModal(newPasswordModal);
          // Redirect to login page or show login modal
          openModal(loginModal); // Change to your actual login page path
          // OR, if using a modal system:
          // openModal(loginModal);
        }, 1500);
        // Reset state
        resetFlowEmail = "";
        resetOtpVerified = false;
    }
    else {
          newPasswordMessage.textContent = data.message || "Failed to reset password.";
          newPasswordMessage.style.color = "#dc2626";
        }
      } catch (err) {
        newPasswordMessage.textContent = "Network error. Please try again.";
        newPasswordMessage.style.color = "#dc2626";
      }
  });

  // =======================
  // Community Form (prototype)
  // =======================
  if (communityForm) {
    communityForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("This is a prototype. In the full version, this would add you to our community.");
      closeModal(communityModal);
    });
  }

  // Logout button handler
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("thriveher_token");
      localStorage.removeItem("thriveher_user");
      updateAuthUI();
    });
  }

  // Notification badge show after delay
  setTimeout(function () {
    const badge = document.getElementById("notificationBadge");
    if (badge) badge.classList.add("show");
  }, 3000);

  // GSAP Animations (your existing)
  if (window.gsap) {
    gsap.from(".hero-content h1", { opacity: 0, y: 50, duration: 1, ease: "power3.out" });
    gsap.from(".hero-content p", { opacity: 0, y: 30, duration: 1, delay: 0.3, ease: "power3.out" });
    gsap.from(".btn-primary", { opacity: 0, y: 20, duration: 1, delay: 0.6, ease: "power3.out" });
  }

  // ==== Your existing Course Data, Rendering, Routing, Enrollment logic here ====

  // Init Three.js scene (stub)
  if (typeof initThreeScene === "function") initThreeScene();

  // Initial auth UI update
  updateAuthUI();
});
