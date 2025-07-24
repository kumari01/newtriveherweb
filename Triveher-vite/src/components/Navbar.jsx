import React from "react";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 py-4">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <a href="#" className="flex items-center gap-2">
        <div className="text-3xl font-bold flex items-center gap-1 logo-text logo">
          <span className="gradient-text">&lt;/&gt;</span>
          <span>
            Trive<span className="text-purple-600">Her</span>
          </span>
        </div>
      </a>

      <div className="hidden md:flex items-center gap-8">
        <a href="/main/index.html" className="nav-link nav-hide-on-tab">
          Home
        </a>
        <a href="/courses/courses.html" className="nav-link nav-hide-on-tab">
          Courses
        </a>
        <a href="/mentor/mentor.html" className="nav-link nav-hide-on-tab">
          Mentors
        </a>
        <a href="/community/community.html" className="nav-link nav-hide-on-tab">
          Community
        </a>
        <a href="/resources/resources.html" className="nav-link relative nav-hide-on-tab">
          Resources
          <div className="notification-badge" id="notificationBadge">
            1
          </div>
        </a>
      </div>

      <div className="flex items-center gap-4 nav-button-group">
        <button
          className="hidden md:inline-block px-4 py-2 border-2 border-purple-500 text-purple-600 text-sm font-medium rounded-full hover:bg-purple-50 transition-all nav-login"
          id="loginBtn"
        >
          Log In
        </button>
        <button
          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-full hover:bg-purple-500 transition-all nav-signup"
          id="signupBtn"
        >
          Sign Up
        </button>
        {/* Shows only in tab view */}
        <button
          id="openDashboard"
          className="inline-block lg:hidden text-gray-700 focus:outline-non nav-dashboard py-7"
        >
          <i className="fas fa-bars text-2xl"></i>
        </button>
      </div>
    </div>
    {/* Right-side Dashboard */}
    <div
      id="dashboardPanel"
      className="fixed top-0 right-0 h-full w-72 bg-white shadow-lg transform translate-x-full transition-transform duration-300 z-50"
    >
      <div className="p-6 bg-white opacity-100">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Dashboard</h3>
        <a
          href="#"
          id="openLoginFromDashboard"
          className="block py-2 text-gray-800 font-medium nav-link md:hidden lg:block"
        >
          Login
        </a>
        <a href="/main/index.html" className="block py-2 text-gray-800 font-medium nav-link">
          Home
        </a>
        <a href="/courses/courses.html" className="block py-2 text-gray-800 font-medium nav-link">
          Courses
        </a>
        <a href="/mentor/mentor.html" className="block py-2 text-gray-800 font-medium nav-link">
          Mentors
        </a>
        <a href="/community/community.html" className="block py-2 text-gray-800 font-medium nav-link">
          Community
        </a>
        <a href="/resources/resources.html" className="block py-2 text-gray-800 font-medium nav-link relative">
          Resources <div className="notification-badge">1</div>
        </a>

        <button
          id="closeDashboard"
          className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-full w-full"
        >
          Close
        </button>
      </div>
    </div>
  </nav>
);

export default Navbar;
