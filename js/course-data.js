// Course data with details
const courses = {
    'python-foundation': {
        id: 'python-foundation',
        title: 'Python Foundation',
        description: 'Learn the fundamentals of Python programming, including variables, data types, control flow, functions, and more. Perfect for beginners with no prior coding experience.',
        icon: 'fab fa-python',
        level: 'Beginner',
        duration: '8 weeks',
        price: '₹499',
        projects: '3+ Mini Projects',
        hasCertificate: true,
        topics: [
            'Introduction to Python',
            'Variables and Data Types',
            'Control Flow and Loops',
            'Functions and Modules',
            'Object-Oriented Programming',
            'File Handling and Exceptions'
        ]
    },
    'python-numpy-pandas': {
        id: 'python-numpy-pandas',
        title: 'Python with NumPy & Pandas',
        description: 'Advance your Python skills with real-world data analysis using NumPy and Pandas. Learn to clean, manipulate, and visualize data effectively.',
        icon: 'fas fa-chart-line',
        level: 'Intermediate',
        duration: '2 weeks',
        price: '₹659',
        projects: '3+ Mini Projects',
        hasCertificate: true,
        topics: [
            'NumPy Arrays and Operations',
            'Pandas DataFrames',
            'Data Cleaning and Preprocessing',
            'Data Visualization',
            'Statistical Analysis',
            'Real-world Data Projects'
        ]
    }
};


// Function to get course card HTML
function getCourseCardHTML(course) {
    return `
        <div class="feature-card p-6 sm:p-7 lg:p-8 bg-white rounded-2xl shadow-lg flex flex-col">
            <div class="feature-icon text-purple-600 text-4xl mb-4">
                <i class="${course.icon}"></i>
            </div>
            <h3 class="text-2xl font-bold mb-4">${course.title}</h3>
            <p class="text-gray-600 mb-6 flex-grow">${course.description}</p>
            <div class="flex gap-3 mb-6">
                <span class="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">${course.level}</span>
                <span class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">${course.duration}</span>
                ${course.hasCertificate ? '<span class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">Certificate</span>' : ''}
            </div>
            <div class="flex gap-4 items-center mb-6">
                <span class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">${course.price}</span>
                <span class="bg-cyan-100 text-cyan-600 px-3 py-1 rounded-full text-sm">${course.projects}</span>
            </div>
            <div class="flex gap-4 mt-auto">
                <button class="enroll-button btn-primary w-full flex items-center justify-center gap-2" data-course="${course.id}">
                    <i class="fas fa-graduation-cap"></i>
                    <span>Enroll Now</span>
                </button>
            </div>
        </div>
    `;
}



// Function to get course detail HTML
function getCourseDetailHTML(course) {
    return `
        <h2 class="text-3xl font-bold mb-6 gradient-text">${course.title}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2">
                <p class="text-gray-600 mb-6">${course.description}</p>
                <h3 class="text-xl font-bold mb-4">What You'll Learn</h3>
                <ul class="space-y-3">
                    ${course.topics.map(topic => `
                        <li class="flex items-start gap-3">
                            <i class="fas fa-check-circle text-green-500 mt-1"></i>
                            <span>${topic}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="bg-gray-50 p-6 rounded-xl h-fit">
                <h3 class="text-xl font-bold mb-4">Course Info</h3>
                <ul class="space-y-4">
                    <li class="flex items-center gap-3">
                        <i class="fas fa-chart-line text-purple-600"></i>
                        <span>Level: ${course.level}</span>
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="fas fa-clock text-purple-600"></i>
                        <span>Duration: ${course.duration}</span>
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="fas fa-indian-rupee-sign text-purple-600"></i>
                        <span>Price: ${course.price}</span>
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="fas fa-project-diagram text-purple-600"></i>
                        <span>${course.projects}</span>
                    </li>
                </ul>
                <button class="enroll-button btn-primary w-full mt-6 flex items-center justify-center gap-2" data-course="${course.id}">
                    <i class="fas fa-graduation-cap"></i>
                    <span>Enroll Now</span>
                </button>
            </div>
        </div>
    `;
}
