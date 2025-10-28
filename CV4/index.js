const cube = document.getElementById("cube");
        const scene = document.getElementById("scene");
        const buttons = document.querySelectorAll(".btn");
        
        // Navigation order for keyboard controls
        const sides = ['front', 'right', 'back', 'left', 'top', 'bottom'];
        let currentSideIndex = 0;

        // Touch/Swipe support
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        const clickOnSide = (side) => {
            const activeSide = cube.dataset.side;
            if (activeSide !== side) {
                cube.classList.replace(`show-${activeSide}`, `show-${side}`);
                cube.setAttribute("data-side", side);
                
                // Update button active states
                buttons.forEach(btn => {
                    if (btn.dataset.side === side) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });

                // Update current side index
                currentSideIndex = sides.indexOf(side);

                // Hide swipe hint after first interaction
                const swipeHint = document.querySelector('.swipe-hint');
                if (swipeHint) {
                    swipeHint.style.display = 'none';
                }
            }
        };

        // Button click handlers
        buttons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const sideToTurn = e.target.dataset.side;
                if (sideToTurn) {
                    clickOnSide(sideToTurn);
                }
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            let newIndex = currentSideIndex;

            switch(e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    newIndex = (currentSideIndex + 1) % 4; // Only cycle through front, right, back, left
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    newIndex = (currentSideIndex - 1 + 4) % 4;
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    newIndex = 4; // Top
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    newIndex = 5; // Bottom
                    break;
            }

            if (newIndex !== currentSideIndex || e.key.startsWith('Arrow')) {
                clickOnSide(sides[newIndex]);
            }
        });

        // Touch/Swipe handlers
        scene.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, false);

        scene.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, false);

        function handleSwipe() {
            const swipeThreshold = 50;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            // Horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
                if (diffX > 0) {
                    // Swipe left - go to next side
                    const newIndex = (currentSideIndex + 1) % 4;
                    clickOnSide(sides[newIndex]);
                } else {
                    // Swipe right - go to previous side
                    const newIndex = (currentSideIndex - 1 + 4) % 4;
                    clickOnSide(sides[newIndex]);
                }
            }
            // Vertical swipe
            else if (Math.abs(diffY) > swipeThreshold) {
                if (diffY > 0) {
                    // Swipe up - go to top
                    clickOnSide('top');
                } else {
                    // Swipe down - go to bottom
                    clickOnSide('bottom');
                }
            }
        }

        // Mouse drag support (optional enhancement)
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;

        scene.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            scene.style.cursor = 'grabbing';
        });

        scene.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
        });

        scene.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            scene.style.cursor = 'grab';

            const diffX = dragStartX - e.clientX;
            const diffY = dragStartY - e.clientY;
            const dragThreshold = 50;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > dragThreshold) {
                if (diffX > 0) {
                    const newIndex = (currentSideIndex + 1) % 4;
                    clickOnSide(sides[newIndex]);
                } else {
                    const newIndex = (currentSideIndex - 1 + 4) % 4;
                    clickOnSide(sides[newIndex]);
                }
            } else if (Math.abs(diffY) > dragThreshold) {
                if (diffY > 0) {
                    clickOnSide('top');
                } else {
                    clickOnSide('bottom');
                }
            }
        });

        scene.addEventListener('mouseleave', () => {
            isDragging = false;
            scene.style.cursor = 'grab';
        });

        scene.style.cursor = 'grab';

        // Hide swipe hint after 5 seconds
        setTimeout(() => {
            const swipeHint = document.querySelector('.swipe-hint');
            if (swipeHint) {
                swipeHint.style.animation = 'fadeInOut 1s forwards';
                setTimeout(() => {
                    swipeHint.style.display = 'none';
                }, 1000);
            }
        }, 5000);

        // Accessibility: Focus management
        buttons.forEach((btn, index) => {
            btn.addEventListener('focus', () => {
                // Optional: Auto-rotate on focus for keyboard users
            });
        });