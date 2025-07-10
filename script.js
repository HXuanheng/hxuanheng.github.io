document.addEventListener('DOMContentLoaded', function() {
    // Abstract toggle functionality
    const abstractToggles = document.querySelectorAll('.abstract-toggle');
    abstractToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !expanded);
            
            const content = toggle.nextElementSibling;
            content.classList.toggle('hidden');
            
            toggle.querySelector('span').textContent = expanded ? 'Abstract' : 'Abstract';
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
    
    // Mobile navigation toggle for new layout
    const createMobileNavToggle = () => {
        const header = document.querySelector('.main-header');
        const nav = document.querySelector('.top-nav');
        
        // Only create if elements exist and no toggle already exists
        if (!header || !nav || document.querySelector('.mobile-nav-toggle')) {
            return;
        }
        
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
