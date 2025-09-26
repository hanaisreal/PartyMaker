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
                
                // Mark form as submitted to prevent abandonment tracking
                document.querySelector('form[name="waitlist"]').dataset.submitted = 'true';

                // Track signup with enhanced data
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'waitlist_signup', {
                        'event_category': 'Lead',
                        'event_label': 'Waitlist Join',
                        'email_domain': email.split('@')[1],
                        'counter_value': currentCount + 1
                    });

                    // Also track as conversion
                    gtag('event', 'conversion', {
                        'send_to': 'G-4CN4V4DRTL',
                        'event_category': 'Lead',
                        'event_label': 'Waitlist Signup Complete'
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
            const faqText = element.textContent.replace('+', '').replace('−', '').trim();

            // Track FAQ interaction
            if (typeof gtag !== 'undefined') {
                gtag('event', 'faq_interaction', {
                    'event_category': 'Engagement',
                    'event_label': faqText,
                    'action': isOpen ? 'close' : 'open'
                });
            }

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
            const intervalMs = 1500; // 1.5 seconds for clean A→B→A→B cycling
            let globalTimer = null;

            // Make itemStates accessible globally for mobile scroll detection
            window.mockupItemStates = window.mockupItemStates || [];
            const itemStates = window.mockupItemStates;

            // Global function to advance all items simultaneously
            function advanceAllItems() {
                itemStates.forEach(state => {
                    if (state && state.nextImage) {
                        state.nextImage();
                    }
                });
            }

            // Simple observer to start/stop auto-transitions when items are visible
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
                const imageWrap = item.querySelector('.mockup-image');

                // Get the list of images first
                const list = item.getAttribute('data-images').split(',').map(s => s.trim()).filter(Boolean);
                if (!imgEl || list.length < 2) return;

                const blurEl = document.createElement('div');
                blurEl.className = 'mockup-blur';

                // Create preview element for next image foreshadowing
                const previewEl = document.createElement('div');
                previewEl.className = 'next-image-preview';
                previewEl.style.cssText = `
                    position: absolute;
                    top: 50%;
                    right: 5px;
                    width: 25px;
                    height: 60px;
                    background-size: cover;
                    background-position: center;
                    transform: translateY(-50%);
                    opacity: 0;
                    transition: opacity 0.4s ease;
                    border-radius: 6px;
                    z-index: 2;
                    filter: blur(1px);
                `;

                if (imageWrap && !imageWrap.querySelector('.mockup-blur')) {
                    imageWrap.prepend(blurEl);
                    imageWrap.appendChild(previewEl);

                    // Add slider indicators for mobile
                    const indicatorsContainer = document.createElement('div');
                    indicatorsContainer.className = 'slider-indicators';

                    // Create dots based on number of images
                    for (let i = 0; i < list.length; i++) {
                        const dot = document.createElement('div');
                        dot.className = 'slider-dot';
                        if (i === 0) dot.classList.add('active');
                        indicatorsContainer.appendChild(dot);
                    }

                    imageWrap.appendChild(indicatorsContainer);
                }

                // Always start at index 0 - ensures clean A→B→A→B cycle
                let index = 0;
                function renderBlur(src) { if (blurEl) blurEl.style.backgroundImage = `url('${src}')`; }

                console.log(`Item ${idx}: Starting with "${list[0]}" (idx 0), will cycle: ${list.join(' -> ')}`);

                // Ensure we start with the first image
                imgEl.src = list[0];

                // Update preview image
                function updatePreview() {
                    const nextIdx = (index + 1) % list.length;
                    const nextSrc = list[nextIdx];
                    if (previewEl) {
                        previewEl.style.backgroundImage = `url('${nextSrc}')`;
                    }
                }

                // Update slider indicators
                function updateIndicators() {
                    const indicators = imageWrap.querySelectorAll('.slider-dot');
                    indicators.forEach((dot, i) => {
                        dot.classList.toggle('active', i === index);
                    });
                }

                // Show preview on hover
                item.addEventListener('mouseenter', () => {
                    if (previewEl) previewEl.style.opacity = '0.15';
                });

                item.addEventListener('mouseleave', () => {
                    if (previewEl) previewEl.style.opacity = '0';
                });

                function nextImage() {
                    // Simple alternating pattern for 2 images: 0→1→0→1
                    const nextIdx = (index + 1) % list.length;
                    const nextSrc = list[nextIdx];

                    console.log(`Item ${idx}: Fading to "${nextSrc}" (idx ${nextIdx})`);

                    // Preload the next image first
                    const preloadImg = new Image();
                    preloadImg.onload = () => {
                        // Once loaded, start the fade transition
                        imgEl.style.transition = 'opacity 1.3s ease-in-out';
                        imgEl.style.opacity = '0.3';

                        // After half fade, change source and fade back in
                        setTimeout(() => {
                            index = nextIdx;
                            imgEl.src = nextSrc;
                            imgEl.style.opacity = '1';

                            // Update UI elements
                            renderBlur(nextSrc);
                            updatePreview();
                            updateIndicators();

                            console.log(`Item ${idx}: Now showing "${list[index]}" (idx ${index})`);
                        }, 650); // Half of transition time
                    };

                    preloadImg.onerror = () => {
                        console.error(`Item ${idx}: Failed to load image: ${nextSrc}`);
                    };

                    preloadImg.src = nextSrc;
                }

                // store state for global timer
                const state = { nextImage };
                itemStates.push(state);

                // initial blur background, preview, and indicators
                renderBlur(imgEl.src);
                updatePreview();
                updateIndicators();

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
                // Remove focus from modal buttons before hiding
                if (document.activeElement && overlay.contains(document.activeElement)) {
                    document.activeElement.blur();
                }
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

        // Before/After Slider Functionality
        function initBeforeAfterSlider() {
            const slider = document.getElementById('beforeAfterSlider');
            const sliderControl = document.getElementById('sliderControl');
            const beforeImage = document.querySelector('.before-image');
            const afterImage = document.querySelector('.after-image');

            if (!slider || !sliderControl || !beforeImage || !afterImage) {
                // Silently return if before/after slider not present on this page
                return;
            }

            let isActive = false;
            let currentPosition = 50; // Start at 50% (middle)

            // Update slider position
            function updateSlider(percentage) {
                const clampedPercentage = Math.max(0, Math.min(100, percentage));
                currentPosition = clampedPercentage;

                // Update clip paths
                beforeImage.style.clipPath = `inset(0 ${100 - clampedPercentage}% 0 0)`;
                afterImage.style.clipPath = `inset(0 0 0 ${clampedPercentage}%)`;

                // Update slider control position
                sliderControl.style.left = `${clampedPercentage}%`;
            }

            // Get mouse/touch position as percentage
            function getPositionPercentage(event) {
                const rect = slider.getBoundingClientRect();
                const clientX = event.clientX || (event.touches && event.touches[0].clientX);
                const position = ((clientX - rect.left) / rect.width) * 100;
                return position;
            }

            // Mouse events
            function handleMouseDown(event) {
                event.preventDefault();
                isActive = true;
                slider.style.cursor = 'grabbing';
                updateSlider(getPositionPercentage(event));
            }

            function handleMouseMove(event) {
                if (!isActive) return;
                event.preventDefault();
                updateSlider(getPositionPercentage(event));
            }

            function handleMouseUp() {
                isActive = false;
                slider.style.cursor = 'grab';
            }

            // Touch events
            function handleTouchStart(event) {
                event.preventDefault();
                isActive = true;
                updateSlider(getPositionPercentage(event));
            }

            function handleTouchMove(event) {
                if (!isActive) return;
                event.preventDefault();
                updateSlider(getPositionPercentage(event));
            }

            function handleTouchEnd() {
                isActive = false;
            }

            // Add event listeners
            sliderControl.addEventListener('mousedown', handleMouseDown);
            slider.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            // Touch support
            sliderControl.addEventListener('touchstart', handleTouchStart, { passive: false });
            slider.addEventListener('touchstart', handleTouchStart, { passive: false });
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);

            // Keyboard accessibility
            sliderControl.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    updateSlider(currentPosition - 5);
                } else if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    updateSlider(currentPosition + 5);
                }
            });

            // Auto-animation on load (optional)
            function animateSlider() {
                let progress = 0;
                const duration = 3000; // 3 seconds
                const startTime = Date.now();

                function animate() {
                    const elapsed = Date.now() - startTime;
                    progress = Math.min(elapsed / duration, 1);

                    // Easing function for smooth animation
                    const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                    const easedProgress = easeInOut(progress);

                    // Animate from 0% to 100% and back to 50%
                    let position;
                    if (easedProgress < 0.5) {
                        position = easedProgress * 200; // 0 to 100
                    } else {
                        position = 100 - ((easedProgress - 0.5) * 100); // 100 to 50
                    }

                    updateSlider(position);

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                }

                // Start animation after a brief delay
                setTimeout(() => {
                    animate();
                }, 1000);
            }

            // Initialize slider
            updateSlider(currentPosition);

            // Start auto-animation on page load
            if (window.innerWidth > 768) { // Only on desktop
                animateSlider();
            }
        }

        // Initialize slider when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initBeforeAfterSlider);
        } else {
            initBeforeAfterSlider();
        }

        // Scroll-triggered animations for headings
        function initScrollAnimations() {
            const titles = document.querySelectorAll('.section-title');

            // Intersection Observer for scroll animations
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });

            titles.forEach(title => {
                observer.observe(title);
            });

            // Add stagger animation to other elements
            const animatedElements = document.querySelectorAll('.step, .mockup-item, .review-item, .price-card');

            const elementObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                            entry.target.style.opacity = '1';
                        }, index * 100);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -30px 0px'
            });

            animatedElements.forEach(element => {
                element.style.opacity = '0';
                elementObserver.observe(element);
            });
        }

        // Initialize scroll animations
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initScrollAnimations);
        } else {
            initScrollAnimations();
        }

        // Enhanced User Behavior Tracking
        function initEnhancedTracking() {
            if (typeof gtag === 'undefined') return;

            // Track CTA button clicks
            document.querySelectorAll('.hero-cta, .nav-cta, .waitlist-button, .mockup-button, .footer-cta-button').forEach(button => {
                button.addEventListener('click', function() {
                    const buttonText = this.textContent.trim();
                    const section = this.closest('section')?.className || 'unknown';

                    gtag('event', 'cta_click', {
                        'event_category': 'Conversion',
                        'event_label': buttonText,
                        'section': section
                    });
                });
            });

            // Track navigation clicks
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', function() {
                    const targetSection = this.getAttribute('href').replace('#', '');

                    gtag('event', 'navigation_click', {
                        'event_category': 'Navigation',
                        'event_label': targetSection,
                        'link_text': this.textContent.trim()
                    });
                });
            });

            // Track form interactions
            const emailInput = document.getElementById('waitlistEmail');
            if (emailInput) {
                let hasInteracted = false;

                emailInput.addEventListener('focus', function() {
                    if (!hasInteracted) {
                        gtag('event', 'form_start', {
                            'event_category': 'Lead',
                            'event_label': 'Email Input Focus'
                        });
                        hasInteracted = true;
                    }
                });

                emailInput.addEventListener('input', function() {
                    if (this.value.length === 1) { // First character typed
                        gtag('event', 'form_interact', {
                            'event_category': 'Lead',
                            'event_label': 'Email Typing Started'
                        });
                    }
                });

                // Track form abandonment (if user leaves without submitting)
                let formStarted = false;
                emailInput.addEventListener('focus', () => formStarted = true);

                window.addEventListener('beforeunload', function() {
                    if (formStarted && emailInput.value.length > 0 && !emailInput.closest('form').dataset.submitted) {
                        gtag('event', 'form_abandon', {
                            'event_category': 'Lead',
                            'event_label': 'Email Form Abandoned',
                            'value': emailInput.value.length
                        });
                    }
                });
            }

            // Track modal gallery interactions
            const modal = document.getElementById('galleryModal');
            if (modal) {
                const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            if (modal.classList.contains('open')) {
                                gtag('event', 'gallery_open', {
                                    'event_category': 'Engagement',
                                    'event_label': 'Modal Gallery Opened'
                                });
                            }
                        }
                    });
                });
                observer.observe(modal, { attributes: true });

                // Track modal navigation
                document.getElementById('modalNext')?.addEventListener('click', () => {
                    gtag('event', 'gallery_navigate', {
                        'event_category': 'Engagement',
                        'event_label': 'Next Image'
                    });
                });

                document.getElementById('modalPrev')?.addEventListener('click', () => {
                    gtag('event', 'gallery_navigate', {
                        'event_category': 'Engagement',
                        'event_label': 'Previous Image'
                    });
                });
            }

            // Track scroll depth
            let scrollMilestones = [25, 50, 75, 90];
            let trackedMilestones = new Set();

            function trackScrollDepth() {
                const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);

                scrollMilestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
                        trackedMilestones.add(milestone);
                        gtag('event', 'scroll_depth', {
                            'event_category': 'Engagement',
                            'event_label': `${milestone}% Scrolled`,
                            'value': milestone
                        });
                    }
                });
            }

            window.addEventListener('scroll', trackScrollDepth);

            // Track time on page (sends after 30 seconds, 1 min, 2 min, 5 min)
            const timePoints = [30, 60, 120, 300]; // seconds
            timePoints.forEach(seconds => {
                setTimeout(() => {
                    gtag('event', 'time_on_page', {
                        'event_category': 'Engagement',
                        'event_label': `${seconds} seconds`,
                        'value': seconds
                    });
                }, seconds * 1000);
            });

            // Track device and browser info
            gtag('event', 'user_device', {
                'event_category': 'Technical',
                'event_label': window.innerWidth <= 768 ? 'Mobile' : 'Desktop',
                'screen_resolution': `${screen.width}x${screen.height}`,
                'viewport_size': `${window.innerWidth}x${window.innerHeight}`
            });

            // Track section views using Intersection Observer
            const sections = document.querySelectorAll('section[class]');
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        const sectionName = entry.target.className.split(' ')[0] || entry.target.id || 'unknown';
                        gtag('event', 'section_view', {
                            'event_category': 'Engagement',
                            'event_label': sectionName,
                            'section_name': sectionName
                        });
                    }
                });
            }, { threshold: 0.5 });

            sections.forEach(section => sectionObserver.observe(section));

            // Track pricing section engagement
            const priceCards = document.querySelectorAll('.price-card');
            priceCards.forEach((card, index) => {
                card.addEventListener('mouseenter', function() {
                    const planName = this.querySelector('h3')?.textContent || `Plan ${index + 1}`;
                    gtag('event', 'pricing_hover', {
                        'event_category': 'Conversion',
                        'event_label': planName
                    });
                });
            });

            // Track outbound links (if any)
            document.querySelectorAll('a[href^="http"]').forEach(link => {
                link.addEventListener('click', function() {
                    const url = this.href;
                    if (!url.includes(window.location.hostname)) {
                        gtag('event', 'outbound_click', {
                            'event_category': 'Navigation',
                            'event_label': url,
                            'transport_type': 'beacon'
                        });
                    }
                });
            });
        }

        // Initialize enhanced tracking
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initEnhancedTracking);
        } else {
            initEnhancedTracking();
        }


