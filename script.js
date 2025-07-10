document.addEventListener('DOMContentLoaded', function() {
    // Abstract toggle functionality
    const abstractToggles = document.querySelectorAll('.abstract-toggle');
    abstractToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !expanded);
            
            const content = toggle.nextElementSibling;
            content.classList.toggle('hidden');
            
            toggle.querySelector('span').textContent = expanded ? 'Show Abstract' : 'Hide Abstract';
        });
    });
    
    // Dark mode toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.top-nav a');
    
    for (const link of navLinks) {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100, // Account for fixed header
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
    
    // Highlight active section based on scroll position
    const highlightActiveSection = () => {
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.top-nav a');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // Account for fixed header
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#' + current) {
                item.classList.add('active');
            }
            
            // Special case for home link
            if (current === 'home' && item.getAttribute('href') === '#home') {
                item.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', highlightActiveSection);
    
    // Call once on initial load
    highlightActiveSection();
    
    // Mobile navigation toggle for new layout
    const createMobileNavToggle = () => {
        const header = document.querySelector('.main-header');
        const nav = document.querySelector('.top-nav');
        
        // Create mobile toggle button
        const mobileToggle = document.createElement('button');
        mobileToggle.classList.add('mobile-nav-toggle');
        mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Insert the toggle button into the header
        const headerContent = document.querySelector('.header-content');
        headerContent.insertBefore(mobileToggle, nav);
        
        // Toggle navigation on mobile
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('mobile-active');
            mobileToggle.innerHTML = nav.classList.contains('mobile-active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close mobile nav when clicking on a link
        const mobileNavLinks = document.querySelectorAll('.top-nav a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    nav.classList.remove('mobile-active');
                    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
        
        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                nav.classList.contains('mobile-active') && 
                !nav.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                nav.classList.remove('mobile-active');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    };
    
    // Initialize mobile navigation
    createMobileNavToggle();
});
