document.addEventListener('DOMContentLoaded', function() {
    // Abstract toggle functionality
    const abstractToggles = document.querySelectorAll('.abstract-toggle');
    abstractToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !expanded);
            
            const content = toggle.nextElementSibling;
            if (content && content.classList.contains('abstract-content')) {
                content.classList.toggle('hidden');
                
                const icon = toggle.querySelector('i');
                const span = toggle.querySelector('span');
                
                if (!expanded) {
                    if (icon) icon.className = 'fas fa-minus-circle';
                    if (span) span.textContent = 'Abstract';
                } else {
                    if (icon) icon.className = 'fas fa-plus-circle';
                    if (span) span.textContent = 'Abstract';
                }
            }
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
        const headerContent = document.querySelector('.header-content');
        
        // Only create if elements exist and no toggle already exists
        if (!header || !nav || !headerContent || document.querySelector('.mobile-nav-toggle')) {
            return;
        }
        
        // Create mobile toggle button
        const mobileToggle = document.createElement('button');
        mobileToggle.classList.add('mobile-nav-toggle');
        mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Insert the toggle button into the header (it will be positioned by CSS)
        headerContent.insertBefore(mobileToggle, headerContent.firstChild);
        
        // Toggle navigation on mobile
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = nav.classList.contains('mobile-active');
            nav.classList.toggle('mobile-active');
            mobileToggle.innerHTML = nav.classList.contains('mobile-active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
            mobileToggle.setAttribute('aria-expanded', nav.classList.contains('mobile-active'));
        });
        
        // Close mobile nav when clicking on a link
        const mobileNavLinks = document.querySelectorAll('.top-nav a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('mobile-active');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('mobile-active') && 
                !nav.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                nav.classList.remove('mobile-active');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                nav.classList.remove('mobile-active');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    };
    
    // Initialize mobile navigation
    createMobileNavToggle();
    
    // Toggle abstract function for research page
    window.toggleAbstract = function(id) {
        const abstractDiv = document.getElementById(id);
        const toggleButton = document.querySelector(`[onclick="toggleAbstract('${id}')"]`);
        
        if (abstractDiv && toggleButton) {
            const isHidden = abstractDiv.style.display === 'none';
            abstractDiv.style.display = isHidden ? 'block' : 'none';
            
            const icon = toggleButton.querySelector('i');
            const text = toggleButton.childNodes[toggleButton.childNodes.length - 1];
            
            if (isHidden) {
                icon.className = 'fas fa-minus';
                text.textContent = 'Abstract';
                toggleButton.setAttribute('aria-expanded', 'true');
            } else {
                icon.className = 'fas fa-plus';
                text.textContent = 'Abstract';
                toggleButton.setAttribute('aria-expanded', 'false');
            }
        }
    }
});
