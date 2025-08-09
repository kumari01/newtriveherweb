const modalMarkup = `
    <!-- Sign Up Modal -->
    <div class="modal" id="signupModal">
    <div class="modal-content max-w-md md:max-w-lg w-full px-6 py-8">
        <button class="modal-close" id="closeSignupModal">
        <i class="fas fa-times"></i>
        </button>
        <h2 class="text-2xl font-bold mb-2 gradient-text">Join TriveHer</h2>
        <p class="text-gray-600 mb-6">Start your coding journey today!</p>

        <form id="signupForm">
        <div class="form-group">
            <label for="name" class="block mb-2 text-gray-700">Full Name</label>
            <input type="text" id="name" class="form-control" placeholder="Enter your name">
        </div>
        <div class="form-group">
            <label for="email" class="block mb-2 text-gray-700">Email Address</label>
            <input type="email" id="email" class="form-control" placeholder="Enter your email">
        </div>
        <div class="form-group">
            <label for="password" class="block mb-2 text-gray-700">Password</label>
            <input type="password" id="password" class="form-control" placeholder="Create a password">
        </div>
        <div class="form-group">
            <label for="age" class="block mb-2 text-gray-700">Age</label>
            <select id="age" class="form-control">
            <option value="" disabled selected>Select your age range</option>
            <option value="8-12">8-12 years</option>
            <option value="13-15">13-15 years</option>
            <option value="16-18">16-18 years</option>
            <option value="19+">19+ years</option>
            </select>
        </div>
        <button type="submit" class="btn-primary w-full justify-center">Create Account</button>
        </form>

        <div class="mt-6 text-center text-gray-600">
        Already have an account? <a href="javascript:void(0)" class="text-purple-600 font-medium" id="switchToLogin">Log In</a>
        </div>
    </div>
    </div>

    <!-- Login Modal -->
    <div class="modal" id="loginModal">
    <div class="modal-content">
        <button class="modal-close" id="closeLoginModal">
        <i class="fas fa-times"></i>
        </button>
        <h2 class="text-2xl font-bold mb-2 gradient-text">Welcome Back!</h2>
        <p class="text-gray-600 mb-6">Continue your coding journey</p>

        <form id="loginForm">
        <div class="form-group">
            <label for="loginEmail" class="block mb-2 text-gray-700">Email Address</label>
            <input type="email" id="loginEmail" class="form-control" placeholder="Enter your email">
        </div>
        <div class="form-group">
            <label for="loginPassword" class="block mb-2 text-gray-700">Password</label>
            <input type="password" id="loginPassword" class="form-control" placeholder="Enter your password">
        </div>
        <div class="flex justify-between items-center mb-6">
            <div class="flex items-center">
            <input type="checkbox" id="remember" class="mr-2">
            <label for="remember" class="text-gray-600">Remember me</label>
            </div>
            <a href="javascript:void(0)" id="openForgotPassword" class="text-purple-600 text-sm">Forgot password?</a>
        </div>
        <button type="submit" class="btn-primary w-full justify-center">Log In</button>
        </form>

        <div class="mt-6 text-center text-gray-600">
        Don't have an account? <a href="javascript:void(0)" class="text-purple-600 font-medium" id="switchToSignup">Sign Up</a>
        </div>
    </div>
    </div>

    <!-- Community Join Modal -->
    <div class="modal" id="communityModal">
    <div class="modal-content">
        <button class="modal-close" id="closeCommunityModal">
        <i class="fas fa-times"></i>
        </button>
        <h2 class="text-2xl font-bold mb-2 gradient-text">Join Our Community</h2>
        <p class="text-gray-600 mb-6">Connect with fellow coders and mentors</p>

        <div class="bg-gray-50 p-6 rounded-xl mb-6">
        <h3 class="font-bold mb-2">Community Benefits:</h3>
        <ul class="space-y-2">
            <li class="flex items-center gap-2">
            <i class="fas fa-check-circle text-green-500"></i>
            <span>Weekly coding challenges</span>
            </li>
            <li class="flex items-center gap-2">
            <i class="fas fa-check-circle text-green-500"></i>
            <span>Live mentoring sessions</span>
            </li>
            <li class="flex items-center gap-2">
            <i class="fas fa-check-circle text-green-500"></i>
            <span>Project feedback from professionals</span>
            </li>
            <li class="flex items-center gap-2">
            <i class="fas fa-check-circle text-green-500"></i>
            <span>Exclusive learning resources</span>
            </li>
        </ul>
        </div>
        <div>
        <a href="../community/community.html"><button type="submit" class="btn-primary w-full justify-center">Join Community</button></a>
        </div>
    </div>
    </div>
    <!-- Forgot Password Modal -->
    <div class="modal" id="forgotPasswordModal">
    <div class="modal-content">
        <button class="modal-close" id="closeForgotPasswordModal">
        <i class="fas fa-times"></i>
        </button>
        <h2 class="text-2xl font-bold mb-2 gradient-text">Reset Password</h2>
        <p class="text-gray-600 mb-6">
        Enter your registered email address. We’ll send you instructions to reset your password.
        </p>
        <form id="forgotPasswordForm">
        <div class="form-group">
            <label for="forgotEmail" class="block mb-2 text-gray-700">Email Address</label>
            <input
            type="email"
            id="forgotEmail"
            class="form-control"
            placeholder="Enter your email"
            required
            />
        </div>
        <button type="submit" class="btn-primary w-full justify-center">
            Send Reset Link
        </button>
        </form>
        <div class="mt-8 text-center text-gray-500 text-sm py-5" id="forgotPasswordMessage"></div>
    </div>
    </div>

    <!-- OTP Modal -->
    <div class="modal" id="otpModal">
    <div class="modal-content">
        <button class="modal-close" id="closeOtpModal" aria-label="Close OTP Modal">
        <i class="fas fa-times"></i>
        </button>

        <h2 class="text-2xl font-bold mb-2 gradient-text">Verify OTP</h2>
        <p class="text-gray-600 mb-6">
        Enter the 6-digit code sent to your email
        </p>

        <form id="otpForm">
        <div class="form-group">
            <label for="otpInput" class="block mb-2 text-gray-700">OTP</label>
            <input
            type="text"
            id="otpInput"
            class="form-control"
            placeholder="Enter OTP"
            maxlength="6"
            required
            inputmode="numeric"
            pattern="\d{6}"
            autocomplete="one-time-code"
            aria-describedby="otpEmailInfo"
            />
        </div>

        <button type="submit" class="btn-primary w-full justify-center">
            Verify
        </button>
        </form>

        <div
        class="mt-4 text-center text-gray-500 text-sm py-5"
        id="otpEmailInfo"
        aria-live="polite"
        ></div>
    </div>
    </div>
    <!-- New Password Modal -->
    <div class="modal" id="newPasswordModal">
    <div class="modal-content max-w-md">
        <button class="modal-close" id="closeNewPasswordModal">
        <i class="fas fa-times"></i>
        </button>
        <h2 class="text-2xl font-bold mb-2 gradient-text">Reset Password</h2>
        <p class="text-gray-600 mb-6">Enter your new password below.</p>
        <form id="newPasswordForm">
        <div class="form-group">
            <label for="newPassword" class="block mb-2 text-gray-700">New Password</label>
            <input type="password" id="newPassword" class="form-control" placeholder="New Password" minlength="6" required autocomplete="new-password" />
        </div>
        <div class="form-group">
            <label for="confirmPassword" class="block mb-2 text-gray-700">Confirm Password</label>
            <input type="password" id="confirmPassword" class="form-control" placeholder="Confirm Password" minlength="6" required autocomplete="new-password" />
        </div>
        <button type="submit" class="btn-primary w-full justify-center">Reset Password</button>
        </form>
        <div class="mt-4 text-center text-gray-500 text-sm py-5" id="newPasswordMessage"></div>
    </div>
    </div>

`;
// document.addEventListener("DOMContentLoaded", function () {
//     if (!document.getElementById("signupModal")) {
//       document.body.insertAdjacentHTML("beforeend", modalMarkup);
//     }
// });

// In modal.js, after inserting modalMarkup:
document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("signupModal")) {
      document.body.insertAdjacentHTML("beforeend", modalMarkup);
    }

    // Add event listeners for auth buttons
    document.getElementById('loginBtn')?.addEventListener('click', function() {
      document.getElementById('loginModal').classList.add('show');
    });

    document.getElementById('signupBtn')?.addEventListener('click', function() {
      document.getElementById('signupModal').classList.add('show');
    });

    // Add event listeners for close buttons
    document.getElementById('closeLoginModal')?.addEventListener('click', function() {
      document.getElementById('loginModal').classList.remove('show');
    });

    document.getElementById('closeSignupModal')?.addEventListener('click', function() {
      document.getElementById('signupModal').classList.remove('show');
    });

    // Add switch between login and signup
    document.getElementById('switchToLogin')?.addEventListener('click', function() {
      document.getElementById('signupModal').classList.remove('show');
      document.getElementById('loginModal').classList.add('show');
    });

    document.getElementById('switchToSignup')?.addEventListener('click', function() {
      document.getElementById('loginModal').classList.remove('show');
      document.getElementById('signupModal').classList.add('show');
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
      if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
      }
    });

    if (typeof initializeModalLogic === "function") {
      initializeModalLogic();
    }
});

// Add showToast function
function showToast(message, type = 'error') {
  // Remove existing toast if any
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create new toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  // Add icon based on type
  const icon = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';
  toast.innerHTML = `<i class="fas ${icon} toast-icon"></i><span class="toast-message">${message}</span>`;

  // Append toast to body
  document.body.appendChild(toast);

  // Show toast animation
  requestAnimationFrame(() => toast.classList.add('show'));

  // Hide and remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3000);
}

// Update the click handlers
document.addEventListener('click', function(e) {
  if (e.target.matches('[data-auth="login"]')) {
    showModal('login');
  } else if (e.target.matches('[data-auth="signup"]')) {
    showModal('signup');
  }
});
