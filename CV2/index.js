const cube = document.getElementById("cube");

const clickOnSide = (side) => {
    const activeSide = cube.dataset.side;
    if (activeSide !== side) {
        cube.classList.replace(`show-${activeSide}`, `show-${side}`);
        cube.setAttribute("data-side", side);
        
        // Add active state to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-side="${side}"]`).classList.add('active');
        
        // Scroll to top when changing sides
        const currentFace = document.querySelector(`.cube-face-${side}`);
        if (currentFace) {
            currentFace.scrollTop = 0;
        }
    }
};

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    const sides = ['front', 'right', 'back', 'left', 'top', 'bottom'];
    const currentSide = cube.dataset.side;
    const currentIndex = sides.indexOf(currentSide);
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const nextIndex = (currentIndex + 1) % sides.length;
        clickOnSide(sides[nextIndex]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const prevIndex = (currentIndex - 1 + sides.length) % sides.length;
        clickOnSide(sides[prevIndex]);
    }
});

document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const sideToTurn = e.target.dataset.side;
        if (sideToTurn) {
            clickOnSide(sideToTurn);
        }
    });
});

// Fix project links - ensure they work properly
document.addEventListener('DOMContentLoaded', function() {
    // Fix project links
    const projectLinks = document.querySelectorAll('.visit-app');
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Allow default link behavior (opening in new tab)
            console.log('Project link clicked:', this.href);
        });
        
        // Ensure links are clickable
        link.style.pointerEvents = 'auto';
        link.style.cursor = 'pointer';
    });
    
    // Handle contact form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Here you would typically send the form data to a server
            // For now, just show a success message
            alert('Thank you for your message, ' + name + '! I will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Ensure all interactive elements are clickable
    const interactiveElements = document.querySelectorAll('button, a, input, textarea');
    interactiveElements.forEach(element => {
        element.style.pointerEvents = 'auto';
    });
});

// Add initial active state to front button
document.querySelector('[data-side="front"]').classList.add('active');

// Force scrolling to work on all faces
document.querySelectorAll('.cube-face').forEach(face => {
    face.style.overflowY = 'auto';
    face.style.overflowX = 'hidden';
});