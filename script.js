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
    const navLinks = document.querySelectorAll('nav a');
    
    for (const link of navLinks) {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile sidebar if it's open
                    const sidebar = document.querySelector('.sidebar');
                    if (window.innerWidth < 768 && sidebar.classList.contains('active')) {
                        sidebar.classList.remove('active');
                    }
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 20,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
    
    // Mobile sidebar toggle
    // Create a mobile menu toggle button
    const mobileToggle = document.createElement('button');
    mobileToggle.classList.add('mobile-menu-toggle');
    mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(mobileToggle);
    
    const sidebar = document.querySelector('.sidebar');
    
    mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        mobileToggle.innerHTML = sidebar.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close the sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 768 && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('active');
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Highlight active section based on scroll position
    const highlightActiveSection = () => {
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.main-nav a');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
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
});
