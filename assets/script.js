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
            document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
            document.querySelectorAll('.faq-question span').forEach(s => s.textContent = '+');
            
            if (!isOpen) {
                answer.style.display = 'block';
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


