// Blog Website JavaScript Functionality
// Author: Mohamad Aslam
// CodeSphere Blog

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initNavigation();
    initSearch();
    initComments();
    initSocialShare();
    initScrollEffects();
});

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Toggle hamburger icon
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// Navigation Functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href');
            
            if (targetId === '#home') {
                // Scroll to top for home
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                // Scroll to specific post
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('.blog-post');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + 200;
    
    // Check if we're at the top of the page
    if (window.scrollY < 300) {
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelector('.nav-link[href="#home"]').classList.add('active');
        return;
    }
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = '#' + section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[href="${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// Search Functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    if (searchInput && searchBtn) {
        // Search on button click
        searchBtn.addEventListener('click', performSearch);
        
        // Search on Enter key press
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Real-time search as user types (with debounce)
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(performSearch, 300);
        });
    }
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Show all posts if search is empty
            blogPosts.forEach(post => {
                post.classList.remove('hidden');
            });
            return;
        }
        
        let foundResults = false;
        
        blogPosts.forEach(post => {
            const title = post.querySelector('.post-title').textContent.toLowerCase();
            const content = post.querySelector('.post-excerpt').textContent.toLowerCase();
            const tags = Array.from(post.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            const category = post.getAttribute('data-category') || '';
            
            const searchableText = `${title} ${content} ${tags.join(' ')} ${category}`;
            
            if (searchableText.includes(searchTerm)) {
                post.classList.remove('hidden');
                foundResults = true;
                
                // Highlight search terms
                highlightSearchTerm(post, searchTerm);
            } else {
                post.classList.add('hidden');
            }
        });
        
        // Show "no results" message if needed
        showSearchResults(foundResults, searchTerm);
    }
    
    function highlightSearchTerm(post, searchTerm) {
        // This is a simple implementation - you could make it more sophisticated
        const title = post.querySelector('.post-title');
        const content = post.querySelector('.post-excerpt');
        
        // Remove existing highlights
        title.innerHTML = title.textContent;
        content.innerHTML = content.textContent;
        
        if (searchTerm.length > 2) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            title.innerHTML = title.innerHTML.replace(regex, '<mark style="background: #ffbe0b; padding: 2px 4px; border-radius: 3px;">$1</mark>');
            content.innerHTML = content.innerHTML.replace(regex, '<mark style="background: #ffbe0b; padding: 2px 4px; border-radius: 3px;">$1</mark>');
        }
    }
    
    function showSearchResults(found, searchTerm) {
        // Remove existing search result message
        const existingMessage = document.querySelector('.search-result-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        if (!found && searchTerm) {
            const blogPostsContainer = document.querySelector('.blog-posts');
            const message = document.createElement('div');
            message.className = 'search-result-message';
            message.style.cssText = `
                text-align: center;
                padding: 3rem;
                color: #636e72;
                font-size: 1.2rem;
                background: linear-gradient(135deg, #fff5f3 0%, #fff9e6 100%);
                border-radius: 15px;
                margin-bottom: 2rem;
                border: 1px solid #ffe0cc;
            `;
            message.innerHTML = `
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; color: #ff5e4d;"></i>
                <p>No blog posts found for "<strong>${searchTerm}</strong>"</p>
                <p style="font-size: 1rem; margin-top: 0.5rem; opacity: 0.8;">Try searching with different keywords.</p>
            `;
            blogPostsContainer.insertBefore(message, blogPostsContainer.firstChild);
        }
    }
}

// Comments Functionality
function initComments() {
    const commentForms = document.querySelectorAll('.comment-form');
    
    commentForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const postId = this.getAttribute('data-post');
            const nameInput = this.querySelector('input[name="name"]');
            const commentInput = this.querySelector('textarea[name="comment"]');
            const submitBtn = this.querySelector('.submit-btn');
            
            const name = nameInput.value.trim();
            const comment = commentInput.value.trim();
            
            if (name && comment) {
                // Show loading state
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="loading"></span> Posting...';
                submitBtn.disabled = true;
                
                // Simulate posting delay (replace with actual API call in production)
                setTimeout(() => {
                    addComment(postId, name, comment);
                    
                    // Reset form
                    nameInput.value = '';
                    commentInput.value = '';
                    
                    // Reset button
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    
                    // Show success message
                    showSuccessMessage(form, 'Comment posted successfully!');
                }, 1000);
            }
        });
    });
}

function addComment(postId, name, comment) {
    const commentsList = document.getElementById(`comments-${postId}`);
    const commentCount = document.querySelector(`.comment-count[data-post="${postId}"]`);
    
    // Create new comment element
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.style.opacity = '0';
    commentDiv.style.transform = 'translateY(20px)';
    
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    commentDiv.innerHTML = `
        <div class="comment-author">
            <i class="fas fa-user-circle"></i>
            ${escapeHtml(name)}
            <span style="font-size: 0.8rem; color: #999; font-weight: normal; margin-left: auto;">
                ${currentDate}
            </span>
        </div>
        <div class="comment-text">${escapeHtml(comment)}</div>
    `;
    
    // Add comment to the beginning of the list
    commentsList.insertBefore(commentDiv, commentsList.firstChild);
    
    // Animate comment appearance
    setTimeout(() => {
        commentDiv.style.transition = 'all 0.5s ease';
        commentDiv.style.opacity = '1';
        commentDiv.style.transform = 'translateY(0)';
    }, 100);
    
    // Update comment count
    const currentCount = parseInt(commentCount.textContent);
    commentCount.textContent = currentCount + 1;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showSuccessMessage(form, message) {
    // Remove existing success message
    const existingMessage = form.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    form.insertBefore(successDiv, form.firstChild);
    
    // Remove success message after 3 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.style.opacity = '0';
            successDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                successDiv.remove();
            }, 300);
        }
    }, 3000);
}

// Social Share Functionality
function initSocialShare() {
    const socialBtns = document.querySelectorAll('.social-btn');
    
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const postElement = this.closest('.blog-post');
            const postTitle = postElement.querySelector('.post-title').textContent;
            const postUrl = window.location.href + '#' + postElement.id;
            
            const platform = this.classList.contains('facebook') ? 'facebook' :
                           this.classList.contains('twitter') ? 'twitter' :
                           this.classList.contains('linkedin') ? 'linkedin' : '';
            
            shareToSocial(platform, postTitle, postUrl);
        });
    });
}

function shareToSocial(platform, title, url) {
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, 'share-dialog', 'width=600,height=400,scrollbars=yes,resizable=yes');
    }
}

// Scroll Effects
function initScrollEffects() {
    // Add scroll-based animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe blog posts for scroll animations
    const blogPosts = document.querySelectorAll('.blog-post');
    blogPosts.forEach((post, index) => {
        // Initial state for animation
        post.style.opacity = '0';
        post.style.transform = 'translateY(30px)';
        post.style.transition = `all 0.6s ease ${index * 0.1}s`;
        
        observer.observe(post);
    });
    
    // Smooth scroll to top functionality
    addScrollToTopButton();
}

function addScrollToTopButton() {
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #ff5e4d, #ff9a00);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(255, 94, 77, 0.3);
        font-size: 1.2rem;
        transition: all 0.3s ease;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transform: scale(0.8);
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
            scrollTopBtn.style.transform = 'scale(1)';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
            scrollTopBtn.style.transform = 'scale(0.8)';
        }
    });
    
    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    scrollTopBtn.addEventListener('mouseenter', () => {
        scrollTopBtn.style.transform = 'scale(1.1) translateY(-3px)';
        scrollTopBtn.style.boxShadow = '0 8px 25px rgba(255, 94, 77, 0.4)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', () => {
        scrollTopBtn.style.transform = 'scale(1)';
        scrollTopBtn.style.boxShadow = '0 5px 15px rgba(255, 94, 77, 0.3)';
    });
}

// Tag filtering functionality
function initTagFiltering() {
    const tags = document.querySelectorAll('.tag');
    
    tags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            
            const tagText = this.textContent.toLowerCase();
            const blogPosts = document.querySelectorAll('.blog-post');
            
            // Remove active class from all tags
            tags.forEach(t => t.classList.remove('active-tag'));
            
            // Add active class to clicked tag
            this.classList.add('active-tag');
            
            // Filter posts
            blogPosts.forEach(post => {
                const postTags = Array.from(post.querySelectorAll('.tag')).map(t => t.textContent.toLowerCase());
                
                if (postTags.includes(tagText)) {
                    post.classList.remove('hidden');
                    post.style.display = 'block';
                } else {
                    post.classList.add('hidden');
                    post.style.display = 'none';
                }
            });
            
            // Scroll to blog posts section
            document.querySelector('.blog-posts').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Initialize tag filtering
document.addEventListener('DOMContentLoaded', function() {
    initTagFiltering();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('search-input');
        if (searchInput && document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.blur();
            
            // Show all posts
            const blogPosts = document.querySelectorAll('.blog-post');
            blogPosts.forEach(post => {
                post.classList.remove('hidden');
                post.style.display = 'block';
            });
            
            // Remove search result message
            const searchMessage = document.querySelector('.search-result-message');
            if (searchMessage) {
                searchMessage.remove();
            }
        }
    }
});

// Performance optimization: Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Form validation enhancement
function enhanceFormValidation() {
    const forms = document.querySelectorAll('.comment-form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove existing error
    clearFieldError(field);
    
    if (!value) {
        showFieldError(field, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
        return false;
    }
    
    if (fieldName === 'name' && value.length < 2) {
        showFieldError(field, 'Name must be at least 2 characters long');
        return false;
    }
    
    if (fieldName === 'comment' && value.length < 10) {
        showFieldError(field, 'Comment must be at least 10 characters long');
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    field.style.borderColor = '#e74c3c';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 0.9rem;
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.3rem;
    `;
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#ffe0cc';
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Initialize enhanced form validation
document.addEventListener('DOMContentLoaded', function() {
    enhanceFormValidation();
});

// Console welcome message
console.log('%c🚀 CodeSphere Blog loaded successfully!', 'color: #ff5e4d; font-size: 16px; font-weight: bold;');
console.log('%cDeveloped by Mohamad Aslam', 'color: #ff9a00; font-size: 12px;');