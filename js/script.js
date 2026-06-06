// ===================================
// PARAMCGWALABOTS - JavaScript
// ===================================

// Configuration
const CONFIG = {
    // N8N Webhook URLs - Replace with your actual webhook URLs
    CONTACT_FORM_WEBHOOK: 'YOUR_N8N_CONTACT_FORM_WEBHOOK_URL_HERE',
    CHATBOT_WEBHOOK: 'https://cgwala.app.n8n.cloud/webhook/e48e3e76-31a9-4033-9d6f-ccec51586100/chat',
    COMPANY_NAME: 'PARAMCGWALABOTS',
    COMPANY_EMAIL: 'Paramcgwala@gmail.com',
    COMPANY_PHONE: '9617422068'
};

// Data Structures for Dynamic Content Generation
// =================================================

// Courses Data - Add new courses here to automatically generate cards
const courses = [
    {
        id: 1,
        title: "Starter Course",
        subtitle: "Perfect introduction to trading bots",
        price: "$299",
        period: "one-time",
        duration: "4 Weeks",
        level: "Beginner",
        badge: "Starter",
        badgeClass: "",
        featured: false,
        description: "Perfect introduction to trading bots and automation fundamentals. Learn the basics of automated trading.",
        features: [
            "20+ Video Lessons",
            "Basic Bot Setup",
            "Risk Management",
            "4 Weeks Duration",
            "Certificate of Completion",
            "Email Support"
        ],
        ctaText: "Enroll Now",
        ctaClass: "btn-outline-primary"
    },
    {
        id: 2,
        title: "Professional Course",
        subtitle: "Advanced strategies for serious traders",
        price: "$699",
        period: "one-time",
        duration: "8 Weeks",
        level: "Intermediate",
        badge: "Most Popular",
        badgeClass: "popular",
        featured: true,
        description: "Advanced strategies and custom bot development for serious traders. Build your own trading systems.",
        features: [
            "50+ Video Lessons",
            "Custom Bot Development",
            "Advanced Strategies",
            "8 Weeks Duration",
            "Professional Certificate",
            "Priority Support",
            "Private Community"
        ],
        ctaText: "Enroll Now",
        ctaClass: "btn-primary"
    },
    {
        id: 3,
        title: "Master Trading Automation",
        subtitle: "Complete mastery with AI & ML",
        price: "$1,499",
        period: "one-time",
        duration: "12 Weeks",
        level: "Advanced",
        badge: "Premium",
        badgeClass: "premium",
        featured: false,
        description: "Complete mastery of trading automation with AI and machine learning. Enterprise-level strategies.",
        features: [
            "100+ Video Lessons",
            "AI & ML Integration",
            "Enterprise Strategies",
            "12 Weeks Duration",
            "Master Certificate",
            "1-on-1 Mentorship",
            "Lifetime Updates",
            "VIP Community Access"
        ],
        ctaText: "Enroll Now",
        ctaClass: "btn-outline-primary"
    }
];

// Trading Bots Data - Add new bots here to automatically generate cards
const tradingBots = [
    {
        id: 1,
        name: "Scalping Bot",
        icon: "bi-lightning",
        badge: "Popular",
        badgeClass: "",
        description: "High-frequency trading bot designed for quick profits from small price movements. Perfect for active traders.",
        features: [
            "100+ Trades/Day",
            "Low Latency",
            "Risk Management"
        ],
        profitPotential: "15-25% Monthly",
        ctaText: "Deploy Now"
    },
    {
        id: 2,
        name: "Futures Bot",
        icon: "bi-graph-up",
        badge: "Best Seller",
        badgeClass: "",
        description: "Advanced futures trading bot with leverage optimization and sophisticated risk controls for experienced traders.",
        features: [
            "Leverage Trading",
            "Hedging Strategies",
            "Auto Stop-Loss"
        ],
        profitPotential: "30-50% Monthly",
        ctaText: "Deploy Now"
    },
    {
        id: 3,
        name: "Spot Trading Bot",
        icon: "bi-currency-bitcoin",
        badge: "Stable",
        badgeClass: "",
        description: "Consistent spot trading bot focusing on steady gains with minimal risk. Ideal for long-term wealth building.",
        features: [
            "Low Risk",
            "DCA Strategy",
            "Portfolio Balance"
        ],
        profitPotential: "10-20% Monthly",
        ctaText: "Deploy Now"
    },
    {
        id: 4,
        name: "AI Signal Bot",
        icon: "bi-brain",
        badge: "AI Powered",
        badgeClass: "",
        description: "Machine learning-powered bot that analyzes market patterns and generates high-probability trading signals.",
        features: [
            "AI Analysis",
            "Pattern Recognition",
            "Sentiment Analysis"
        ],
        profitPotential: "25-40% Monthly",
        ctaText: "Deploy Now"
    },
    {
        id: 5,
        name: "Arbitrage Bot",
        icon: "bi-arrow-left-right",
        badge: "Advanced",
        badgeClass: "",
        description: "Explores price differences across exchanges for risk-free profits. Sophisticated multi-exchange execution.",
        features: [
            "Multi-Exchange",
            "Instant Execution",
            "Risk-Free Profits"
        ],
        profitPotential: "5-15% Monthly",
        ctaText: "Deploy Now"
    },
    {
        id: 6,
        name: "Grid Trading Bot",
        icon: "bi-grid-3x3",
        badge: "Versatile",
        badgeClass: "",
        description: "Automated grid trading that profits from market volatility. Set it and forget it approach for steady gains.",
        features: [
            "Volatility Trading",
            "Auto Grid Setup",
            "Passive Income"
        ],
        profitPotential: "20-35% Monthly",
        ctaText: "Deploy Now"
    }
];

// Dynamic Content Generation Functions
// =================================================

/**
 * Generate course cards dynamically from courses data
 */
function generateCourseCards() {
    const container = document.getElementById('courses-container');
    if (!container) return;

    container.innerHTML = courses.map((course, index) => `
        <div class="col-lg-4 col-md-6">
            <div class="course-card glass-card ${course.featured ? 'featured' : ''}" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="course-badge ${course.badgeClass}">${course.badge}</div>
                <h3>${course.title}</h3>
                <div class="course-price">
                    <span class="price">${course.price}</span>
                    <span class="period">${course.period}</span>
                </div>
                <p class="course-description">${course.description}</p>
                <ul class="course-features">
                    ${course.features.map(feature => `
                        <li><i class="bi bi-check-circle-fill"></i> ${feature}</li>
                    `).join('')}
                </ul>
                <button class="btn ${course.ctaClass} w-100 course-cta" data-course-id="${course.id}">${course.ctaText}</button>
            </div>
        </div>
    `).join('');

    // Add event listeners to course buttons
    document.querySelectorAll('.course-cta').forEach(btn => {
        btn.addEventListener('click', handleCourseClick);
    });
}

/**
 * Generate bot cards dynamically from tradingBots data
 */
function generateBotCards() {
    const container = document.getElementById('bots-container');
    if (!container) return;

    container.innerHTML = tradingBots.map((bot, index) => `
        <div class="col-lg-4 col-md-6">
            <div class="bot-card glass-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="bot-header">
                    <div class="bot-icon">
                        <i class="bi ${bot.icon}"></i>
                    </div>
                    <div class="bot-badge">${bot.badge}</div>
                </div>
                <h3>${bot.name}</h3>
                <p>${bot.description}</p>
                <div class="bot-features">
                    ${bot.features.map(feature => `
                        <span><i class="bi bi-check"></i> ${feature}</span>
                    `).join('')}
                </div>
                <div class="bot-profit">
                    <span>Profit Potential:</span>
                    <span class="profit-value">${bot.profitPotential}</span>
                </div>
                <button class="btn btn-primary w-100 bot-cta" data-bot-id="${bot.id}">${bot.ctaText}</button>
            </div>
        </div>
    `).join('');

    // Add event listeners to bot buttons
    document.querySelectorAll('.bot-cta').forEach(btn => {
        btn.addEventListener('click', handleBotClick);
    });
}

/**
 * Handle course button clicks
 */
function handleCourseClick(e) {
    e.preventDefault();
    const courseId = e.target.getAttribute('data-course-id');
    const course = courses.find(c => c.id === parseInt(courseId));
    if (course) {
        alert(`You clicked on ${course.title}. This would redirect to the enrollment page in a real application.`);
    }
}

/**
 * Handle bot button clicks
 */
function handleBotClick(e) {
    e.preventDefault();
    const botId = e.target.getAttribute('data-bot-id');
    const bot = tradingBots.find(b => b.id === parseInt(botId));
    if (bot) {
        alert(`You clicked on ${bot.name}. This would redirect to the deployment page in a real application.`);
    }
}

// Contact Form Integration with N8N Webhook
// =================================================

/**
 * Submit contact form to N8N webhook
 */
async function submitContactForm(formData) {
    try {
        const response = await fetch(CONFIG.CONTACT_FORM_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error submitting form:', error);
        throw error;
    }
}

/**
 * Handle contact form submission
 */
async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (!name || !email || !message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.innerHTML = '<i class="bi bi-spinner"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Submit form to N8N webhook
        await submitContactForm({
            name,
            email,
            phone,
            subject,
            message
        });
        
        // Show success message
        showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
        form.reset();
    } catch (error) {
        // Show error message
        showFormMessage('There was an error submitting your message. Please try again or contact us directly at ' + CONFIG.COMPANY_EMAIL, 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Show form message (success/error)
 */
function showFormMessage(message, type) {
    const formWrapper = document.querySelector('.contact-form-wrapper');
    
    // Remove existing message
    const existingMessage = formWrapper.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message alert alert-${type === 'success' ? 'success' : 'danger'}`;
    messageEl.innerHTML = `<i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    messageEl.style.marginBottom = 'var(--spacing-md)';
    
    // Insert message before form
    const form = formWrapper.querySelector('.contact-form');
    formWrapper.insertBefore(messageEl, form);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}

// AI Chatbot Integration with N8N Webhook
// =================================================

let chatHistory = [];
let isChatbotTyping = false;

/**
 * Toggle chatbot window
 */
function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    chatbotWindow.classList.toggle('active');
    
    // Focus input when opening
    if (chatbotWindow.classList.contains('active')) {
        setTimeout(() => {
            document.getElementById('chatbotInput').focus();
        }, 300);
    }
}

/**
 * Close chatbot window
 */
function closeChatbot() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    chatbotWindow.classList.remove('active');
}

/**
 * Add message to chat
 */
function addChatMessage(message, isUser = false) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageEl = document.createElement('div');
    messageEl.className = `chatbot-message ${isUser ? 'user' : 'bot'}`;
    
    messageEl.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add to history
    chatHistory.push({
        role: isUser ? 'user' : 'assistant',
        content: message,
        timestamp: new Date().toISOString()
    });
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    const typingEl = document.createElement('div');
    typingEl.className = 'chatbot-message bot typing-indicator';
    typingEl.id = 'typingIndicator';
    
    typingEl.innerHTML = `
        <div class="message-content">
            <div class="chatbot-typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    isChatbotTyping = true;
}

/**
 * Remove typing indicator
 */
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isChatbotTyping = false;
}

/**
 * Send message to N8N chatbot webhook with timeout and retry
 */
async function sendChatMessage(message, retryCount = 0) {
    const maxRetries = 2;
    const timeout = 15000; // 15 seconds timeout
    
    console.log('🤖 Sending message to N8N webhook:', CONFIG.CHATBOT_WEBHOOK);
    console.log('📤 Request payload:', JSON.stringify({
        message: message,
        history: chatHistory,
        timestamp: new Date().toISOString()
    }, null, 2));
    
    try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(CONFIG.CHATBOT_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                history: chatHistory,
                timestamp: new Date().toISOString()
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log('📥 Response status:', response.status);
        console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Network response not ok:', response.status, errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // Try to parse as JSON first
        const contentType = response.headers.get('content-type');
        console.log('📄 Content-Type:', contentType);
        
        let responseData;
        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
            console.log('✅ JSON Response:', JSON.stringify(responseData, null, 2));
        } else {
            // If not JSON, get text response
            responseData = await response.text();
            console.log('✅ Text Response:', responseData);
        }

        // Handle different response formats
        if (typeof responseData === 'string') {
            return responseData;
        } else if (responseData.response) {
            return responseData.response;
        } else if (responseData.message) {
            return responseData.message;
        } else if (responseData.output) {
            return responseData.output;
        } else if (responseData.text) {
            return responseData.text;
        } else if (Array.isArray(responseData) && responseData.length > 0) {
            // If response is an array, join the items
            return responseData.join('\n');
        } else {
            // Return the entire object as string if nothing else matches
            console.log('⚠️ Unexpected response format, returning as string');
            return JSON.stringify(responseData);
        }
    } catch (error) {
        console.error('❌ Error sending message to chatbot:', error);
        console.error('❌ Error details:', {
            message: error.message,
            stack: error.stack
        });
        
        // Check if it's a timeout or connection error
        if (error.name === 'AbortError') {
            console.error('⏱️ Request timed out after', timeout, 'ms');
            if (retryCount < maxRetries) {
                console.log(`🔄 Retrying... (${retryCount + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
                return sendChatMessage(message, retryCount + 1);
            }
            return 'The chatbot service is taking too long to respond. Please try again later.';
        }
        
        // Check if it's a network/connection error
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError') ||
            error.message.includes('connection') ||
            error.message.includes('ECONNREFUSED')) {
            console.error('🌐 Network connection error');
            if (retryCount < maxRetries) {
                console.log(`🔄 Retrying... (${retryCount + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
                return sendChatMessage(message, retryCount + 1);
            }
            return 'Unable to connect to the chatbot service. Please check your internet connection and try again.';
        }
        
        // Generic error
        if (retryCount < maxRetries) {
            console.log(`🔄 Retrying... (${retryCount + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            return sendChatMessage(message, retryCount + 1);
        }
        
        return `Error: ${error.message}. Please try again or contact us at ${CONFIG.COMPANY_EMAIL}`;
    }
}

/**
 * Handle chatbot message send
 */
async function handleChatbotSend() {
    console.log('🚀 handleChatbotSend called');
    const input = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSend');
    const message = input.value.trim();
    
    console.log('💬 User message:', message);
    
    if (!message || isChatbotTyping) {
        console.log('⚠️ Message empty or bot typing, returning');
        return;
    }
    
    // Add user message to chat
    addChatMessage(message, true);
    input.value = '';
    
    // Disable input while processing
    input.disabled = true;
    sendBtn.disabled = true;
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        console.log('📡 Calling sendChatMessage...');
        // Send message to N8N webhook
        const response = await sendChatMessage(message);
        console.log('✅ Received response from webhook:', response);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add bot response to chat
        addChatMessage(response, false);
    } catch (error) {
        console.error('❌ Error in handleChatbotSend:', error);
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add error message
        addChatMessage(`Error: ${error.message}`, false);
    } finally {
        // Re-enable input
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
    }
}

/**
 * Initialize chatbot
 */
function initializeChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    
    // Toggle chatbot window
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', toggleChatbot);
    }
    
    // Close chatbot window
    if (chatbotClose) {
        chatbotClose.addEventListener('click', closeChatbot);
    }
    
    // Send message on button click
    if (chatbotSend) {
        chatbotSend.addEventListener('click', handleChatbotSend);
    }
    
    // Send message on Enter key
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleChatbotSend();
            }
        });
    }
}

// Main Application
// =================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Generate dynamic content
    generateCourseCards();
    generateBotCards();
    
    // Initialize AI Chatbot
    initializeChatbot();
    
    // Initialize AOS Animation Library
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
    
    // Initialize Swiper.js for Testimonials
    const testimonialsSlider = new Swiper('.testimonials-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });
    
    // Typing Effect for Hero Title
    const typingText = document.querySelector('.typing-text');
    const phrases = [
        'Automate Your Trading. Scale Your Profits.',
        'AI-Powered Trading Solutions.',
        'Ready-Made Trading Bots.',
        'Professional Trading Courses.'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before new phrase
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start typing effect
    if (typingText) {
        typeEffect();
    }
    
    // Sticky Navbar
    const navbar = document.getElementById('navbar');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
    
    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll Progress Bar
    const scrollProgress = document.getElementById('scrollProgress');
    
    window.addEventListener('scroll', function() {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }
    });
    
    // Back To Top Button
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Counter Animation
    const counters = document.querySelectorAll('.trust-number');
    const speed = 200;
    
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 10);
            } else {
                counter.innerText = target;
                // Add + sign for certain counters
                if (target === 95) {
                    counter.innerText = target + '%';
                } else if (target === 24) {
                    counter.innerText = target + '/7';
                } else {
                    counter.innerText = target + '+';
                }
            }
        });
    };
    
    // Intersection Observer for Counter Animation
    const trustSection = document.getElementById('trust');
    let countersAnimated = false;
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                animateCounters();
                countersAnimated = true;
            }
        });
    }, { threshold: 0.5 });
    
    if (trustSection) {
        counterObserver.observe(trustSection);
    }
    
    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // Form Validation and Submission
    const contactForm = document.querySelector('.contact-form');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate subscription
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const originalIcon = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="bi bi-spinner"></i>';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
                submitBtn.innerHTML = originalIcon;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Button Hover Effects with Ripple
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Parallax Effect for Hero Section
    const heroSection = document.querySelector('.hero-section');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        if (heroSection && scrolled < window.innerHeight) {
            heroSection.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
    
    // Lazy Loading for Images (if any images are added later)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    
    // Add hover effect to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add hover effect to bot cards
    const botCards = document.querySelectorAll('.bot-card');
    botCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add hover effect to course cards
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Dynamic year in footer
    const currentYear = new Date().getFullYear();
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        footerYear.innerHTML = `&copy; ${currentYear} ${CONFIG.COMPANY_NAME}. All rights reserved.`;
    }
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Press 'Escape' to close mobile menu
        if (e.key === 'Escape') {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
    
    // Add focus visible styles for accessibility
    document.addEventListener('focusin', function(e) {
        if (e.target.matches('a, button, input, textarea, select')) {
            e.target.style.outline = '2px solid #00F5D4';
            e.target.style.outlineOffset = '2px';
        }
    });
    
    document.addEventListener('focusout', function(e) {
        if (e.target.matches('a, button, input, textarea, select')) {
            e.target.style.outline = '';
            e.target.style.outlineOffset = '';
        }
    });
    
    // Console welcome message
    console.log('%c🤖 PARAMCGWALABOTS', 'font-size: 24px; font-weight: bold; color: #00F5D4;');
    console.log('%cPremium Trading Automation Platform', 'font-size: 14px; color: #AAB2C8;');
    console.log('%cBuilt with ❤️ for modern traders', 'font-size: 12px; color: #9B5DE5;');
});

// Additional utility functions
const utils = {
    // Debounce function for performance optimization
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Get element by selector with error handling
    getElement: function(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Element with selector "${selector}" not found`);
            return null;
        }
        return element;
    },
    
    // Add event listener with error handling
    addEvent: function(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
        } else {
            console.warn(`Cannot add event listener to null element`);
        }
    }
};

// Export utils for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
