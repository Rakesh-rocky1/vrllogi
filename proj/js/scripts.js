document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme from localStorage or system preference
    initializeTheme();

    // Add active class to current navigation item
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentLocation.includes(linkPath) && linkPath !== '/') {
            link.classList.add('active');
        } else if (currentLocation === '/' && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Map initialization is now handled directly in contact.html

    // Enhance buttons with hover animations
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('pulse');
        });
        button.addEventListener('mouseleave', function() {
            this.classList.remove('pulse');
        });
    });

    // Add counter animation to numbers
    const countElements = document.querySelectorAll('.count-number');
    if (countElements.length > 0) {
        animateCounters();
    }

    // Add animation on scroll for elements with 'animated' class
    const animatedElements = document.querySelectorAll('.animated');

    if (animatedElements.length > 0) {
        window.addEventListener('scroll', checkScroll);
        // Check initially as some elements might be in view on page load
        checkScroll();
    }

    function checkScroll() {
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementPosition < windowHeight * 0.9) {
                // Apply different animations based on data attribute or element position
                if (element.classList.contains('hero-content')) {
                    element.classList.add('fade-in');
                } else if (element.closest('.product-card')) {
                    element.classList.add('zoom-in');
                } else if (element.closest('.col-md-4:nth-child(odd)')) {
                    element.classList.add('slide-in-left');
                } else if (element.closest('.col-md-4:nth-child(even)')) {
                    element.classList.add('slide-in-right');
                } else {
                    element.classList.add('fade-in');
                }

                // Add delay for children to create cascade effect
                if (element.children.length > 0) {
                    Array.from(element.children).forEach((child, index) => {
                        child.style.animationDelay = `${0.1 * (index + 1)}s`;
                    });
                }
            }
        });
    }

    // Function to animate counters
    function animateCounters() {
        countElements.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const step = Math.ceil(target / (duration / 20)); // Update every 20ms
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = current.toLocaleString();
            }, 20);
        });
    }

    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            heroSection.style.backgroundPositionY = `${scrollPosition * 0.4}px`;
        });
    }

    // Add subtle hover animations to service boxes
    const serviceBoxes = document.querySelectorAll('.service-box, .card.product-card, .card.border-0.shadow-sm');
    serviceBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.classList.add('pulse');
        });
        box.addEventListener('mouseleave', function() {
            this.classList.remove('pulse');
        });
    });

    // Form submission handler
    document.getElementById('contactForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value,
            'inquiry-type': document.getElementById('inquiry-type').value
        };

        try {
            const response = await fetch('YOUR_API_GATEWAY_URL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Thank you for contacting us. We will get back to you soon!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#0d6efd'
                });
                this.reset();
            } else {
                alert('Error: ' + (data.error || 'Failed to submit form'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit form. Please try again.');
        }
    });

    // Newsletter form submission
    document.getElementById('newsletterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for subscribing to our newsletter!');
        this.reset();
    });
});

// Map functionality is now handled directly in contact.html

// Dark Mode Toggle Functions
function initializeTheme() {
    // Check if the user previously set a theme preference
    const savedTheme = localStorage.getItem('theme');

    // Create and add the theme toggle button to the navbar
    addThemeToggleButton();

    if (savedTheme) {
        // Apply the saved theme
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        // Check if the user has a system preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (prefersDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }

    // Update the toggle button icon to match current theme
    updateThemeIcon();
}

function addThemeToggleButton() {
    // Create the button element
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark/light mode');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Default icon (will be updated)

    // Add click event listener to toggle theme
    themeToggle.addEventListener('click', toggleTheme);

    // Find the navbar nav (where we'll add the button)
    const navbarNav = document.querySelector('.navbar-nav');
    if (navbarNav) {
        // Create a container to wrap the button in
        const toggleContainer = document.createElement('li');
        toggleContainer.className = 'nav-item d-flex align-items-center ms-2';
        toggleContainer.appendChild(themeToggle);

        // Add the toggle button to the navbar
        navbarNav.appendChild(toggleContainer);
    }
}

function toggleTheme() {
    // Get the current theme
    const currentTheme = document.documentElement.getAttribute('data-theme');

    // Toggle the theme
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Apply the new theme
    document.documentElement.setAttribute('data-theme', newTheme);

    // Save the preference in localStorage
    localStorage.setItem('theme', newTheme);

    // Update the toggle button icon
    updateThemeIcon();

    // Add elegant transition effect
    addThemeTransitionEffect();
}

function updateThemeIcon() {
    // Get the current theme
    const currentTheme = document.documentElement.getAttribute('data-theme');

    // Find the theme toggle button
    const themeToggle = document.querySelector('.theme-toggle');

    if (themeToggle) {
        // Update the icon based on the current theme
        if (currentTheme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
}

function addThemeTransitionEffect() {
    // Create a temporary overlay for transition effect
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = document.documentElement.getAttribute('data-theme') === 'dark' ? '#121212' : '#ffffff';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';

    document.body.appendChild(overlay);

    // Trigger the fade animation
    setTimeout(() => {
        overlay.style.opacity = '0.1';

        setTimeout(() => {
            overlay.style.opacity = '0';

            // Remove the overlay after the animation
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        }, 200);
    }, 0);
}