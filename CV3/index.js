// Global variables
const cube = document.getElementById("cube");
const scene = document.getElementById("scene");
const cubeLoader = document.getElementById('cubeLoader');
let isRotating = false;

// Side labels for accessibility
const sideLabels = {
    'front': 'Introduction',
    'right': 'Work Experience',
    'back': 'Education',
    'left': 'Certificates', 
    'top': 'Projects',
    'bottom': 'Contact Information'
};

// Initialize EmailJS (replace with your actual public key)
emailjs.init("3Qqg_cwZqQ1Cq2SJW");

const clickOnSide = (side) => {
    if (isRotating) return;
    
    const activeSide = cube.dataset.side;
    if (activeSide !== side) {
        isRotating = true;
        
        // Show loading animation
        cubeLoader.style.display = 'flex';
        
        // Add rotation animation class
        cube.classList.add('rotating');
        
        setTimeout(() => {
            cube.classList.replace(`show-${activeSide}`, `show-${side}`);
            cube.setAttribute("data-side", side);
            
            // Update active button states
            document.querySelectorAll('.btn').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-current', 'false');
            });
            
            const activeBtn = document.querySelector(`[data-side="${side}"]`);
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-current', 'true');
            
            // Update cube indicator
            updateCubeIndicator(side);
            
            // Scroll to top of the new face
            const currentFace = document.querySelector(`.cube-face-${side}`);
            if (currentFace) {
                currentFace.scrollTop = 0;
            }
            
            // Hide loading animation
            setTimeout(() => {
                cubeLoader.style.display = 'none';
                cube.classList.remove('rotating');
                isRotating = false;
            }, 300);
            
        }, 300);
    }
};

// Update cube position indicator
function updateCubeIndicator(side) {
    const indicatorText = document.querySelector('.indicator-text');
    const dots = document.querySelectorAll('.indicator-dots .dot');
    
    indicatorText.textContent = sideLabels[side];
    indicatorText.setAttribute('aria-label', `Current section: ${sideLabels[side]}`);
    
    dots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.dataset.side === side) {
            dot.classList.add('active');
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (isRotating) return;
    
    const sides = ['front', 'right', 'back', 'left', 'top', 'bottom'];
    const currentSide = cube.dataset.side;
    const currentIndex = sides.indexOf(currentSide);
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % sides.length;
        clickOnSide(sides[nextIndex]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + sides.length) % sides.length;
        clickOnSide(sides[prevIndex]);
    } else if (e.key >= 1 && e.key <= 6) {
        // Number keys 1-6 for direct navigation
        e.preventDefault();
        const sideIndex = parseInt(e.key) - 1;
        if (sideIndex < sides.length) {
            clickOnSide(sides[sideIndex]);
        }
    }
});

// Touch swipe gestures for mobile
let touchStartX = 0;
let touchStartY = 0;

scene.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

scene.addEventListener('touchend', (e) => {
    if (isRotating) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Minimum swipe distance
    if (Math.abs(diffX) > 50 || Math.abs(diffY) > 50) {
        const sides = ['front', 'right', 'back', 'left', 'top', 'bottom'];
        const currentSide = cube.dataset.side;
        const currentIndex = sides.indexOf(currentSide);
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (diffX > 0) {
                // Swipe left - next
                const nextIndex = (currentIndex + 1) % sides.length;
                clickOnSide(sides[nextIndex]);
            } else {
                // Swipe right - previous
                const prevIndex = (currentIndex - 1 + sides.length) % sides.length;
                clickOnSide(sides[prevIndex]);
            }
        } else {
            // Vertical swipe
            if (diffY > 0) {
                // Swipe up - next
                const nextIndex = (currentIndex + 1) % sides.length;
                clickOnSide(sides[nextIndex]);
            } else {
                // Swipe down - previous  
                const prevIndex = (currentIndex - 1 + sides.length) % sides.length;
                clickOnSide(sides[prevIndex]);
            }
        }
    }
});

// Button event listeners
document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const sideToTurn = e.target.dataset.side;
        if (sideToTurn && !isRotating) {
            clickOnSide(sideToTurn);
        }
    });
});

// Project card hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.classList.add('hover');
    });
    
    card.addEventListener('mouseleave', () => {
        card.classList.remove('hover');
    });
    
    // Touch devices
    card.addEventListener('touchstart', () => {
        card.classList.add('hover');
    });
    
    card.addEventListener('touchend', () => {
        setTimeout(() => {
            card.classList.remove('hover');
        }, 2000);
    });
});

// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loadingSpinner = submitBtn.querySelector('.loading-spinner');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            btnText.textContent = 'Sending...';
            loadingSpinner.style.display = 'block';
            submitBtn.disabled = true;
            
            try {
                // Send email using EmailJS (you need to set up EmailJS account)
                const response = await emailjs.send('service_jaxxp8o', 'template_ju14vj5', {
                    from_name: name,
                    from_email: email,
                    message: message
                });
                
                showNotification('Thank you for your message! I will get back to you soon.', 'success');
                contactForm.reset();
                
            } catch (error) {
                console.error('Email sending failed:', error);
                showNotification('Sorry, there was an error sending your message. Please try again later.', 'error');
            } finally {
                // Reset button state
                btnText.textContent = 'Send Message';
                loadingSpinner.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }
    
    // Fix project links
    const projectLinks = document.querySelectorAll('.visit-app');
    projectLinks.forEach(link => {
        link.style.pointerEvents = 'auto';
        link.style.cursor = 'pointer';
    });
});

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.setAttribute('aria-live', 'polite');
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Preload critical images
function preloadImages() {
    const images = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3sKlgIQ3rpieiLbbor7sNsIEFhfjAhj573w&s'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add initial active state
    document.querySelector('[data-side="front"]').classList.add('active');
    document.querySelector('[data-side="front"]').setAttribute('aria-current', 'true');
    
    // Initialize cube indicator
    updateCubeIndicator('front');
    
    // Preload images
    preloadImages();
    
    // Force scrolling to work on all faces
    document.querySelectorAll('.cube-face').forEach(face => {
        face.style.overflowY = 'auto';
        face.style.overflowX = 'hidden';
    });
    
    // Add focus styles for accessibility
    document.querySelectorAll('button, a, input, textarea').forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--blue)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
});

// Export for global access
window.clickOnSide = clickOnSide;