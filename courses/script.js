const courseData = {
    'python-basics': {
        title: 'Python Basics',
        description: 'Learn the fundamentals of Python programming, including variables, data types, control flow, functions, and more.',
        level: 'Beginner',
        duration: '8 weeks',
        certification: true,
        qrCode: '/assets/qr-python.png',
        mentors: [
          {
            name: 'Kumari',
            photo: 'https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083377_960_720.jpg',
            bio: 'Senior Python Developer with 8+ years experience teaching coding to beginners.'
          },
          {
            name: 'Jane Doe',
            photo: 'https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083377_960_720.jpg',
            bio: 'Senior Python Developer with 8+ years experience teaching coding to beginners.'
          }
        ]
      },
      'python-numpy-pandas': {
        title: 'Python with NumPy & Pandas',
        description: 'Data analysis using NumPy and Pandas.',
        level: 'Intermediate',
        duration: '2 weeks',
        certification: true,
        qrCode: '/assets/qr-data.png',
        mentors: [
          {
            name: 'Maria Chen',
            photo: 'https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083376_960_720.jpg',
            bio: 'Data Scientist with expertise in Pandas and data viz.'
          }
        ]
      },
      'basic-c-programming': {
        title: 'Basic C Programming',
        description: 'Learn C syntax, data types, control structures, and functions. Ideal for beginners starting coding.',
        level: 'Beginner',
        duration: '6 weeks',
        certification: true,
        qrCode: '/assets/qr-c.png',
        mentors: [
          {
            name: 'Anjali Verma',
            photo: 'https://cdn.pixabay.com/photo/2021/09/24/02/48/girl-6651214_960_720.jpg',
            bio: 'C programmer and educator with a focus on foundational logic.'
          }
        ]
      }
    };

    // When any enroll button is clicked
    document.addEventListener("click", function (e) {
      const button = e.target.closest(".enroll-button");
      if (button) {
        const courseId = button.dataset.course;
        if (courseId) {
          showCourseDetail(courseId);
          history.pushState(null, "", `#course-${courseId}`);
          e.preventDefault();
        }
      }
    });

    function showCourseDetail(courseId) {
      const course = courseData[courseId];
      const detailSection = document.getElementById('course-detail');
      const detailContent = document.getElementById('course-detail-content');

      if (!course || !detailSection || !detailContent) return;

      // Hide all sections
      document.querySelectorAll('section').forEach(section => {
        if (section.id !== 'course-detail') {
          section.classList.add('hidden');
        }
      });

      // Show course detail section
      detailSection.classList.remove('hidden');

      // Mentors HTML
      let mentorsHtml = '';
      course.mentors.forEach(mentor => {
        mentorsHtml += `
          <div class="mentor-card mb-4">
            <img src="${mentor.photo}" alt="${mentor.name}" class="mentor-photo rounded-full w-16 h-16 object-cover">
            <div>
              <h4 class="font-bold text-lg">${mentor.name}</h4>
              <p class="text-sm text-gray-600">${mentor.bio}</p>
            </div>
          </div>
        `;
      });

      // Course detail HTML
      detailContent.innerHTML = `
        <div class="course-header mb-8">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold">${course.title}</h2>
          <div class="flex flex-wrap gap-3 justify-center mt-4">
            <span class="bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-sm font-medium">${course.level}</span>
            <span class="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">${course.duration}</span>
            ${course.certification ? '<span class="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium">Certificate</span>' : ''}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 course-content">
          <div class="md:col-span-2">
            <h3 class="text-2xl font-bold mb-4">Course Description</h3>
            <p class="course-description mb-6">${course.description}</p>

            <h3 class="text-2xl font-bold mb-4">Your Mentors</h3>
            <div class="space-y-4 mb-8">${mentorsHtml}</div>
          </div>

          <div class="enrollment-panel">
            <h3 class="text-xl font-bold mb-4">Enrollment & Payment</h3>
            <div class="qr-container text-center">
              <img src="${course.qrCode}" alt="QR Code" class="w-36 h-36 mx-auto mb-3" onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=payment-${courseId}'; this.onerror=null;">
              <p class="text-sm text-gray-500">Course Code:</p>
              <div class="course-code font-mono font-semibold cursor-pointer" onclick="copyText('${courseId.toUpperCase()}')" title="Click to copy">
                ${courseId.toUpperCase()}
              </div>
            </div>
            <button class="btn-primary w-full mt-6 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all">
              <i class="fas fa-graduation-cap mr-2"></i> Enroll Now
            </button>
          </div>
        </div>
      `;

      window.scrollTo(0, detailSection.offsetTop - 80);
    }

    // Load detail on page load if hash exists
    window.addEventListener('DOMContentLoaded', () => {
      const hash = window.location.hash;
      if (hash.startsWith('#course-')) {
        const courseId = hash.replace('#course-', '');
        showCourseDetail(courseId);
      }
    });
    document.getElementById("back-to-courses").addEventListener("click", function (e) {
    e.preventDefault(); // stop default anchor jump

    // Hide course detail section
    document.getElementById("course-detail").classList.add("hidden");

    // Show all other sections (especially #courses)
    document.querySelectorAll("section").forEach(section => {
      if (section.id !== "course-detail") {
        section.classList.remove("hidden");
      }
    });

    // Scroll to #courses section
    const courseSection = document.getElementById("courses");
    if (courseSection) {
      courseSection.scrollIntoView({ behavior: "smooth" });
    }

    // Remove hash from URL
    history.pushState("", document.title, window.location.pathname + window.location.search);
  });
