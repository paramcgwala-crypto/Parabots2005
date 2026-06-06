// ===================================
// PARAMCGWALABOTS - Course Filter System
// ===================================

let courses = [];
let filteredCourses = [];

// Load courses from courses.json or localStorage
async function loadCourses() {
    try {
        // Try to load from localStorage first (for admin panel changes)
        const storedCourses = localStorage.getItem('paramcgwala_courses');
        
        if (storedCourses) {
            courses = JSON.parse(storedCourses);
            console.log('✅ Courses loaded from localStorage');
        } else {
            // Load from courses.json
            const response = await fetch('courses.json');
            courses = await response.json();
            console.log('✅ Courses loaded from courses.json');
            // Save to localStorage for future use
            localStorage.setItem('paramcgwala_courses', JSON.stringify(courses));
        }
        
        // Filter only published courses
        courses = courses.filter(course => course.status === 'Published');
        filteredCourses = [...courses];
        
        // Generate course cards
        generateCourseCards();
        
        // Initialize filters
        initFilters();
        
    } catch (error) {
        console.error('❌ Error loading courses:', error);
        // Fallback to default courses
        courses = [];
        filteredCourses = [];
    }
}

// Generate course cards dynamically
function generateCourseCards() {
    const container = document.getElementById('courses-container');
    if (!container) return;

    if (filteredCourses.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="glass-card p-5">
                    <i class="bi bi-inbox display-1 text-muted mb-3"></i>
                    <h3 class="text-muted">No courses found</h3>
                    <p class="text-muted">Try adjusting your search or filter criteria</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredCourses.map((course, index) => `
        <div class="col-lg-4 col-md-6 mb-4 course-card-wrapper" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="course-card glass-card ${course.featured ? 'featured' : ''} premium-card">
                ${course.badge ? `<div class="course-badge ${course.badgeClass || ''}">${course.badge}</div>` : ''}
                
                <div class="course-image">
                    <img src="${course.thumbnailBase64 || course.imageUrl || 'https://via.placeholder.com/400x250/0B0F19/00F5D4?text=Course'}" 
                         alt="${course.title}" 
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/400x250/0B0F19/00F5D4?text=Course'">
                </div>
                
                <div class="course-content">
                    <span class="course-category">${course.category || 'Trading'}</span>
                    <h3>${course.title}</h3>
                    ${course.subtitle ? `<p class="course-subtitle">${course.subtitle}</p>` : ''}
                    ${course.instructorName ? `<p class="course-instructor"><i class="bi bi-person"></i> ${course.instructorName}</p>` : ''}
                    <p class="course-description">${course.description}</p>
                    
                    <div class="course-meta">
                        <span><i class="bi bi-clock"></i> ${course.duration}</span>
                        <span><i class="bi bi-bar-chart"></i> ${course.level}</span>
                    </div>
                    
                    <ul class="course-features">
                        ${course.features && course.features.length > 0 ? course.features.slice(0, 4).map(feature => `
                            <li><i class="bi bi-check-circle-fill"></i> ${feature}</li>
                        `).join('') : ''}
                    </ul>
                    
                    <div class="course-price">
                        <span class="price">${course.price}</span>
                        <span class="period">${course.period || 'one-time'}</span>
                    </div>
                    
                    <div class="course-actions">
                        ${course.videoLink ? 
                            `<a href="${course.videoLink}" target="_blank" class="btn btn-outline-primary btn-sm">
                                <i class="bi bi-play-circle"></i> Watch Preview
                            </a>` : ''}
                        
                        ${course.pdfDownloadLink || course.pdfBase64 ? 
                            `<a href="${course.pdfBase64 ? '#' : course.pdfDownloadLink}" ${course.pdfBase64 ? `onclick="downloadPdf('${course.id}'); return false;"` : ''} class="btn btn-outline-primary btn-sm">
                                <i class="bi bi-file-earmark-pdf"></i> Download PDF
                            </a>` : ''}
                        
                        ${course.whatsappLink ? 
                            `<a href="${course.whatsappLink}" target="_blank" class="btn btn-success btn-sm">
                                <i class="bi bi-whatsapp"></i> WhatsApp
                            </a>` : ''}
                        
                        ${course.telegramGroupLink ? 
                            `<a href="${course.telegramGroupLink}" target="_blank" class="btn btn-outline-primary btn-sm">
                                <i class="bi bi-telegram"></i> Join Telegram
                            </a>` : ''}
                        
                        <a href="${course.buyNowLink || '#contact'}" class="btn ${course.ctaClass || 'btn-primary'} btn-sm">
                            <i class="bi bi-cart"></i> Buy Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Reinitialize AOS for new elements
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Download PDF from base64
function downloadPdf(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (course && course.pdfBase64) {
        const link = document.createElement('a');
        link.href = course.pdfBase64;
        link.download = `${course.title.replace(/\s+/g, '_')}.pdf`;
        link.click();
    }
}

// Initialize filters
function initFilters() {
    const searchInput = document.getElementById('courseSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const levelFilter = document.getElementById('levelFilter');
    const priceFilter = document.getElementById('priceFilter');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }

    // Category dropdown filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }

    // Level dropdown filter
    if (levelFilter) {
        levelFilter.addEventListener('change', applyFilters);
    }

    // Price dropdown filter
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }

    // Category button filters
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Update dropdown filter to match
            if (categoryFilter) {
                categoryFilter.value = filter === 'all' ? '' : filter;
            }
            
            applyFilters();
        });
    });
}

// Apply all filters
function applyFilters() {
    const searchInput = document.getElementById('courseSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const levelFilter = document.getElementById('levelFilter');
    const priceFilter = document.getElementById('priceFilter');

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const category = categoryFilter ? categoryFilter.value : '';
    const level = levelFilter ? levelFilter.value : '';
    const priceRange = priceFilter ? priceFilter.value : '';

    filteredCourses = courses.filter(course => {
        // Search filter
        const matchesSearch = !searchTerm || 
            course.title.toLowerCase().includes(searchTerm) ||
            course.description.toLowerCase().includes(searchTerm) ||
            (course.subtitle && course.subtitle.toLowerCase().includes(searchTerm));

        // Category filter
        const matchesCategory = !category || course.category === category;

        // Level filter
        const matchesLevel = !level || course.level === level;

        // Price filter
        let matchesPrice = true;
        if (priceRange) {
            const priceValue = parseInt(course.price.replace(/[^0-9]/g, '')) || 0;
            switch (priceRange) {
                case 'low':
                    matchesPrice = priceValue < 500;
                    break;
                case 'medium':
                    matchesPrice = priceValue >= 500 && priceValue <= 1000;
                    break;
                case 'high':
                    matchesPrice = priceValue > 1000;
                    break;
            }
        }

        return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });

    // Sort: Featured courses first
    filteredCourses.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
    });

    generateCourseCards();
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
});

// Listen for localStorage changes (from admin panel)
window.addEventListener('storage', (e) => {
    if (e.key === 'paramcgwala_courses') {
        loadCourses();
    }
});

// ===================================
// Netflix-Style Slider Functionality
// ===================================
function initNetflixSliders() {
    // Generate slider cards
    generateFeaturedSlider();
    generateTradingSlider();
    generateAISlider();
    
    // Setup slider navigation
    setupSliderNavigation();
}

function generateFeaturedSlider() {
    const slider = document.getElementById('featured-slider');
    if (!slider) return;
    
    const featuredCourses = courses.filter(course => course.featured);
    
    if (featuredCourses.length === 0) {
        slider.innerHTML = '<p class="text-muted">No featured courses available.</p>';
        return;
    }
    
    slider.innerHTML = featuredCourses.map(course => `
        <div class="netflix-slider-card">
            <div class="course-card glass-card ${course.featured ? 'featured' : ''} premium-card">
                ${course.badge ? `<div class="course-badge ${course.badgeClass || ''}">${course.badge}</div>` : ''}
                
                <div class="course-image">
                    <img src="${course.thumbnailBase64 || course.imageUrl || 'https://via.placeholder.com/400x250/0B0F19/00F5D4?text=Course'}" 
                         alt="${course.title}" 
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/400x250/0B0F19/00F5D4?text=Course'">
                </div>
                
                <div class="course-content">
                    <span class="course-category">${course.category || 'Trading'}</span>
                    <h3>${course.title}</h3>
                    <div class="course-price">
                        <span class="price">${course.price}</span>
                    </div>
                    <div class="course-actions">
                        <a href="${course.buyNowLink || '#contact'}" class="btn btn-primary btn-sm">
                            <i class="bi bi-cart"></i> Buy Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function generateTradingSlider() {
    const slider = document.getElementById('trading-slider');
    if (!slider) return;
    
    const tradingCourses = courses.filter(course => 
        course.category === 'Trading' || 
        course.category === 'Forex' || 
        course.category === 'Crypto' ||
        course.category === 'Stocks'
    );
    
    if (tradingCourses.length === 0) {
        slider.innerHTML = '<p class="text-muted">No trading courses available.</p>';
        return;
    }
    
    slider.innerHTML = tradingCourses.map(course => `
        <div class="netflix-slider-card">
            <div class="course-card glass-card premium-card">
                ${course.badge ? `<div class="course-badge ${course.badgeClass || ''}">${course.badge}</div>` : ''}
                
                <div class="course-image">
                    <img src="${course.thumbnailBase64 || course.imageUrl || 'https://via.placeholder.com/400x250/0B0F19/00F5D4?text=Course'}" 
                         alt="${course.title}" 
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/400x250/0B0F19/00F5D4?text=Course'">
                </div>
                
                <div class="course-content">
                    <span class="course-category">${course.category || 'Trading'}</span>
                    <h3>${course.title}</h3>
                    <div class="course-price">
                        <span class="price">${course.price}</span>
                    </div>
                    <div class="course-actions">
                        <a href="${course.buyNowLink || '#contact'}" class="btn btn-primary btn-sm">
                            <i class="bi bi-cart"></i> Buy Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function generateAISlider() {
    const slider = document.getElementById('ai-slider');
    if (!slider) return;
    
    const aiCourses = courses.filter(course => 
        course.category === 'AI' || 
        course.category === 'AI Automation' ||
        course.category === 'N8N'
    );
    
    if (aiCourses.length === 0) {
        slider.innerHTML = '<p class="text-muted">No AI courses available.</p>';
        return;
    }
    
    slider.innerHTML = aiCourses.map(course => `
        <div class="netflix-slider-card">
            <div class="course-card glass-card premium-card">
                ${course.badge ? `<div class="course-badge ${course.badgeClass || ''}">${course.badge}</div>` : ''}
                
                <div class="course-image">
                    <img src="${course.thumbnailBase64 || course.imageUrl || 'https://via.placeholder.com/400x250/0B0F19/00F5D4?text=Course'}" 
                         alt="${course.title}" 
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/400x250/0B0F19/00F5D4?text=Course'">
                </div>
                
                <div class="course-content">
                    <span class="course-category">${course.category || 'AI'}</span>
                    <h3>${course.title}</h3>
                    <div class="course-price">
                        <span class="price">${course.price}</span>
                    </div>
                    <div class="course-actions">
                        <a href="${course.buyNowLink || '#contact'}" class="btn btn-primary btn-sm">
                            <i class="bi bi-cart"></i> Buy Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function setupSliderNavigation() {
    const prevButtons = document.querySelectorAll('.slider-prev');
    const nextButtons = document.querySelectorAll('.slider-next');
    
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sliderId = button.getAttribute('data-slider');
            const slider = document.getElementById(`${sliderId}-slider`);
            if (slider) {
                slider.scrollBy({ left: -300, behavior: 'smooth' });
            }
        });
    });
    
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sliderId = button.getAttribute('data-slider');
            const slider = document.getElementById(`${sliderId}-slider`);
            if (slider) {
                slider.scrollBy({ left: 300, behavior: 'smooth' });
            }
        });
    });
}

// Initialize Netflix sliders after loading courses
const originalLoadCourses = loadCourses;
loadCourses = async function() {
    await originalLoadCourses();
    initNetflixSliders();
};
