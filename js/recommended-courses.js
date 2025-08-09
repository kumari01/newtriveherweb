// Handle course view button clicks
document.addEventListener('DOMContentLoaded', function() {
    const viewCourseButtons = document.querySelectorAll('.view-course-btn');

    viewCourseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course');

            // Redirect to courses page with the course ID as a parameter
            window.location.href = `../courses/courses.html?course=${courseId}`;
        });
    });
});
