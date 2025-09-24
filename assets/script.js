function joinWaitlist() {
            const email = document.getElementById('waitlistEmail').value;
            const button = document.querySelector('.waitlist-button');
            
            if (!email || !email.includes('@')) {
                alert('Please enter a valid email address');
                return;
            }
            
            button.textContent = 'Adding you...';
            button.disabled = true;
            
            setTimeout(() => {
                // Update counter
                const counter = document.getElementById('counterNumber');
                const currentCount = parseInt(counter.textContent);
                counter.textContent = currentCount + 1;
                
                // Success message
                alert(`Thanks! We'll email ${email} the moment PartyMaker launches in January!\n\nYou're locked in for 40% off launch pricing!`);
                
                // Reset form
                document.getElementById('waitlistEmail').value = '';
                button.textContent = 'Save My Spot!';
                button.disabled = false;
                
                // Track signup
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'waitlist_signup', {
                        'event_category': 'Lead',
                        'event_label': 'Waitlist Join'
                    });
                }
                
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead');
                }
            }, 1500);
        }
        
        function toggleFAQ(element) {
            const answer = element.nextElementSibling;
            const isOpen = answer.style.display === 'block';
            
            // Close all FAQs
            document.querySelectorAll('.faq-answer').forEach(a => {
                a.style.display = 'none';
                a.setAttribute('aria-hidden', 'true');
            });
            document.querySelectorAll('.faq-question').forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                q.querySelector('span').textContent = '+';
            });
            
            if (!isOpen) {
                answer.style.display = 'block';
                answer.setAttribute('aria-hidden', 'false');
                element.setAttribute('aria-expanded', 'true');
                element.querySelector('span').textContent = '−';
            }
        }
        
        // Animate counter on page load
        function animateCounter() {
            const counter = document.getElementById('counterNumber');
            let current = 820;
            const target = 847;
            const increment = 1;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = current;
            }, 50);
        }
        
        // Initialize counter animation
        window.addEventListener('load', animateCounter);
        
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Auto-slide mockup images on hover and modal gallery
        function initMockupSliders() {
            const items = document.querySelectorAll('.mockup-item[data-images]');
            const intervalMs = 2600;
            let globalTimer = null;
            const itemStates = [];

            // Global function to advance all items simultaneously
            function advanceAllItems() {
                itemStates.forEach(state => {
                    if (state && state.nextImage) {
                        state.nextImage();
                    }
                });
            }

            // Observe viewport to start/stop global timer
            const observer = new IntersectionObserver((entries) => {
                const anyVisible = entries.some(entry => entry.isIntersecting);

                if (anyVisible && !globalTimer) {
                    globalTimer = setInterval(advanceAllItems, intervalMs);
                } else if (!anyVisible && globalTimer) {
                    clearInterval(globalTimer);
                    globalTimer = null;
                }
            }, { threshold: 0.2 });

            items.forEach((item, idx) => {
                const imgEl = item.querySelector('.mockup-image img');
                const blurEl = document.createElement('div');
                blurEl.className = 'mockup-blur';
                const imageWrap = item.querySelector('.mockup-image');
                if (imageWrap && !imageWrap.querySelector('.mockup-blur')) {
                    imageWrap.prepend(blurEl);
                }

                const list = item.getAttribute('data-images').split(',').map(s => s.trim()).filter(Boolean);
                if (!imgEl || list.length < 2) return;

                let index = 0;
                function renderBlur(src) { if (blurEl) blurEl.style.backgroundImage = `url('${src}')`; }

                function nextImage() {
                    const nextIdx = (index + 1) % list.length;
                    const nextSrc = list[nextIdx];
                    imgEl.classList.remove('slide-enter','slide-enter-active');
                    imgEl.classList.add('slide-exit');
                    requestAnimationFrame(() => {
                        imgEl.classList.add('slide-exit-active');
                    });
                    setTimeout(() => {
                        imgEl.src = nextSrc;
                        renderBlur(nextSrc);
                        imgEl.classList.remove('slide-exit','slide-exit-active');
                        imgEl.classList.add('slide-enter');
                        requestAnimationFrame(() => {
                            imgEl.classList.add('slide-enter-active');
                        });
                        index = nextIdx;
                    }, 250);
                }

                // store state for global timer
                const state = { nextImage };
                itemStates.push(state);

                // initial blur background
                renderBlur(imgEl.src);

                // observe each item for visibility
                observer.observe(item);

                // click to open modal gallery
                item.addEventListener('click', () => openGallery(item));
                
                // keyboard navigation support
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openGallery(item);
                    }
                });
            });

            // Modal gallery logic - ensure DOM is ready
            const overlay = document.getElementById('galleryModal');
            const closeBtn = document.getElementById('galleryClose');
            const imgEl = document.getElementById('modalImage');
            const blurEl = document.getElementById('modalBlur');
            const prevBtn = document.getElementById('modalPrev');
            const nextBtn = document.getElementById('modalNext');
            
            // Check if modal elements exist
            if (!overlay || !closeBtn || !imgEl || !blurEl || !prevBtn || !nextBtn) {
                console.warn('Modal gallery elements not found');
                return;
            }
            
            let currentList = [];
            let currentIndex = 0;

            function renderModal() {
                const src = currentList[currentIndex];
                imgEl.src = src;
                blurEl.style.backgroundImage = `url('${src}')`;
            }

            function openGallery(item) {
                const list = item.getAttribute('data-images');
                if (!list) return;
                currentList = list.split(',').map(s => s.trim()).filter(Boolean);
                currentIndex = 0;
                renderModal();
                overlay.classList.add('open');
                overlay.setAttribute('aria-hidden','false');
                document.body.style.overflow = 'hidden';
            }

            function closeGallery() {
                overlay.classList.remove('open');
                overlay.setAttribute('aria-hidden','true');
                document.body.style.overflow = '';
            }

            function next() { currentIndex = (currentIndex + 1) % currentList.length; renderModal(); }
            function prev() { currentIndex = (currentIndex - 1 + currentList.length) % currentList.length; renderModal(); }

            // Enhanced close button event handling
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Close button clicked');
                closeGallery();
            });
            
            // Also handle mousedown for better responsiveness
            closeBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            
            overlay.addEventListener('click', (e) => { 
                if (e.target === overlay) {
                    console.log('Overlay clicked');
                    closeGallery(); 
                }
            });
            nextBtn.addEventListener('click', next);
            prevBtn.addEventListener('click', prev);
            window.addEventListener('keydown', (e) => {
                if (!overlay.classList.contains('open')) return;
                if (e.key === 'Escape') closeGallery();
                if (e.key === 'ArrowRight') next();
                if (e.key === 'ArrowLeft') prev();
            });
        }
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initMockupSliders);
        } else {
            initMockupSliders();
        }


