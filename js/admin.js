// ===================================
// Admin Panel - PARAMCGWALABOTS
// ===================================

// Global Variables
let courses = [];
let pdfs = [];
let currentEditingId = null;
let deleteCourseId = null;
let deletePdfId = null;
let thumbnailBase64 = '';
let bannerBase64 = '';
let pdfBase64 = '';
let standalonePdfBase64 = '';

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    loadCourses();
    loadPdfs();
    setupEventListeners();
    setupTabNavigation();
});

// Setup Tab Navigation
function setupTabNavigation() {
    const tabLinks = document.querySelectorAll('.admin-sidebar .nav-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            tabLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show selected tab content
            const tabId = this.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId + '-tab');
            if (tabContent) {
                tabContent.classList.add('active');
                
                // Refresh data when navigating to respective tab
                if (tabId === 'users') {
                    loadUsers();
                } else if (tabId === 'settings') {
                    loadSettings();
                } else if (tabId === 'logs') {
                    loadLogs();
                } else if (tabId === 'analytics') {
                    initAnalytics();
                }
            }
        });
    });
}

// Load Courses from localStorage or courses.json
async function loadCourses() {
    try {
        // Try to load from localStorage first
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
        
        renderCoursesTable();
    } catch (error) {
        console.error('❌ Error loading courses:', error);
        alert('Error loading courses. Please refresh the page.');
    }
}

// Save Courses to localStorage
function saveCoursesToStorage() {
    localStorage.setItem('paramcgwala_courses', JSON.stringify(courses));
}

// Load PDFs from localStorage
function loadPdfs() {
    try {
        const storedPdfs = localStorage.getItem('paramcgwala_pdfs');
        
        if (storedPdfs) {
            pdfs = JSON.parse(storedPdfs);
            console.log('✅ PDFs loaded from localStorage');
        } else {
            pdfs = [];
            console.log('✅ No PDFs found, starting fresh');
        }
        
        renderPdfsTable();
    } catch (error) {
        console.error('❌ Error loading PDFs:', error);
        pdfs = [];
        renderPdfsTable();
    }
}

// Save PDFs to localStorage
function savePdfsToStorage() {
    localStorage.setItem('paramcgwala_pdfs', JSON.stringify(pdfs));
}

// Render PDFs Table
function renderPdfsTable(filteredPdfs = null) {
    const tableBody = document.getElementById('pdfsTableBody');
    const noPdfsMessage = document.getElementById('noPdfsMessage');
    
    const pdfsToRender = filteredPdfs || pdfs;
    
    if (pdfsToRender.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="no-courses-message">
                        <i class="bi bi-file-earmark-pdf"></i>
                        <p>No PDFs found. Add your first PDF to get started.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = pdfsToRender.map(pdf => `
        <tr>
            <td>${pdf.id}</td>
            <td>
                <strong>${pdf.title}</strong>
                ${pdf.description ? `<br><small class="text-muted">${pdf.description}</small>` : ''}
            </td>
            <td><span class="status-badge">${pdf.category || 'General'}</span></td>
            <td>${pdf.downloads || 0}</td>
            <td>
                ${pdf.status === 'Published' 
                    ? '<span class="status-badge published"><i class="bi bi-check-circle"></i> Published</span>' 
                    : '<span class="status-badge draft"><i class="bi bi-file-earmark"></i> Draft</span>'
                }
            </td>
            <td>
                <button class="action-btn edit" onclick="editPdf(${pdf.id})" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="action-btn delete" onclick="confirmDeletePdf(${pdf.id})" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Render Courses Table
function renderCoursesTable(filteredCourses = null) {
    const tableBody = document.getElementById('coursesTableBody');
    const noCoursesMessage = document.getElementById('noCoursesMessage');
    
    const coursesToRender = filteredCourses || courses;
    
    if (coursesToRender.length === 0) {
        tableBody.innerHTML = '';
        noCoursesMessage.style.display = 'block';
        return;
    }
    
    noCoursesMessage.style.display = 'none';
    
    tableBody.innerHTML = coursesToRender.map(course => `
        <tr>
            <td>${course.id}</td>
            <td>
                ${course.thumbnailBase64 
                    ? `<img src="${course.thumbnailBase64}" alt="${course.title}" class="course-thumbnail">`
                    : course.imageUrl 
                    ? `<img src="${course.imageUrl}" alt="${course.title}" class="course-thumbnail" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                       <div class="course-thumbnail-placeholder" style="display:none;"><i class="bi bi-image"></i></div>`
                    : `<div class="course-thumbnail-placeholder"><i class="bi bi-image"></i></div>`
                }
            </td>
            <td>
                <strong>${course.title}</strong>
                ${course.subtitle ? `<br><small class="text-muted">${course.subtitle}</small>` : ''}
            </td>
            <td><span class="status-badge">${course.category || 'Trading'}</span></td>
            <td>${course.price}</td>
            <td><span class="status-badge level">${course.level || 'N/A'}</span></td>
            <td>
                ${course.status === 'Published' 
                    ? '<span class="status-badge published"><i class="bi bi-check-circle"></i> Published</span>' 
                    : '<span class="status-badge draft"><i class="bi bi-file-earmark"></i> Draft</span>'
                }
            </td>
            <td>
                <button class="action-btn edit" onclick="editCourse(${course.id})" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="action-btn delete" onclick="confirmDelete(${course.id})" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Setup Event Listeners
function setupEventListeners() {
    // Add Course Button
    document.getElementById('addCourseBtn').addEventListener('click', () => {
        openModal();
    });
    
    // Save Course Button
    document.getElementById('saveCourseBtn').addEventListener('click', saveCourse);
    
    // Export Button
    document.getElementById('exportBtn').addEventListener('click', exportCourses);
    
    // Import Button
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    
    // Import File Input
    document.getElementById('importFile').addEventListener('change', importCourses);
    
    // Search Input
    document.getElementById('searchInput').addEventListener('input', filterCourses);
    
    // Category Filter
    document.getElementById('categoryFilter').addEventListener('change', filterCourses);
    
    // Confirm Delete Button
    document.getElementById('confirmDeleteBtn').addEventListener('click', deleteCourse);
    
    // File Upload Inputs
    document.getElementById('courseThumbnail').addEventListener('change', handleThumbnailUpload);
    document.getElementById('courseBanner').addEventListener('change', handleBannerUpload);
    document.getElementById('coursePdf').addEventListener('change', handlePdfUpload);
    
    // PDF Management
    const addPdfBtn = document.getElementById('addPdfBtn');
    if (addPdfBtn) {
        addPdfBtn.addEventListener('click', () => openPdfModal());
    }
    
    const savePdfBtn = document.getElementById('savePdfBtn');
    if (savePdfBtn) {
        savePdfBtn.addEventListener('click', savePdf);
    }
    
    const confirmDeletePdfBtn = document.getElementById('confirmDeletePdfBtn');
    if (confirmDeletePdfBtn) {
        confirmDeletePdfBtn.addEventListener('click', deletePdf);
    }
    
    const pdfFileInput = document.getElementById('pdfFile');
    if (pdfFileInput) {
        pdfFileInput.addEventListener('change', handleStandalonePdfUpload);
    }
    
    const pdfSearchInput = document.getElementById('pdfSearchInput');
    if (pdfSearchInput) {
        pdfSearchInput.addEventListener('input', filterPdfs);
    }
    
    const pdfCategoryFilter = document.getElementById('pdfCategoryFilter');
    if (pdfCategoryFilter) {
        pdfCategoryFilter.addEventListener('change', filterPdfs);
    }
}

// Open Modal for Adding/Editing Course
function openModal(course = null) {
    const modal = new bootstrap.Modal(document.getElementById('courseModal'));
    const modalTitle = document.getElementById('courseModalTitle');
    const form = document.getElementById('courseForm');
    
    // Reset base64 variables
    thumbnailBase64 = '';
    bannerBase64 = '';
    pdfBase64 = '';
    
    if (course) {
        // Edit mode
        modalTitle.textContent = 'Edit Course';
        currentEditingId = course.id;
        
        document.getElementById('courseId').value = course.id;
        document.getElementById('courseTitle').value = course.title;
        document.getElementById('courseSubtitle').value = course.subtitle || '';
        document.getElementById('coursePrice').value = course.price;
        document.getElementById('courseCategory').value = course.category || 'Trading';
        document.getElementById('courseLevel').value = course.level || 'Beginner';
        document.getElementById('courseDuration').value = course.duration || '';
        document.getElementById('courseBadge').value = course.badge || '';
        document.getElementById('courseBadgeClass').value = course.badgeClass || '';
        document.getElementById('courseDescription').value = course.description;
        document.getElementById('courseImageUrl').value = course.imageUrl || '';
        document.getElementById('courseBuyNowLink').value = course.buyNowLink || '';
        document.getElementById('coursePdfLink').value = course.pdfDownloadLink || '';
        document.getElementById('courseYoutubeLink').value = course.youtubePreviewLink || '';
        document.getElementById('courseTelegramLink').value = course.telegramGroupLink || '';
        document.getElementById('courseWhatsappLink').value = course.whatsappLink || '';
        document.getElementById('courseVideoLink').value = course.videoLink || '';
        document.getElementById('courseInstructor').value = course.instructorName || '';
        document.getElementById('courseStatus').value = course.status || 'Draft';
        document.getElementById('courseFeatures').value = course.features ? course.features.join('\n') : '';
        document.getElementById('courseFeatured').checked = course.featured || false;
        
        // Set base64 variables if they exist
        thumbnailBase64 = course.thumbnailBase64 || '';
        bannerBase64 = course.bannerBase64 || '';
        pdfBase64 = course.pdfBase64 || '';
    } else {
        // Add mode
        modalTitle.textContent = 'Add New Course';
        currentEditingId = null;
        form.reset();
        document.getElementById('courseStatus').value = 'Draft';
    }
    
    modal.show();
}

// Edit Course
function editCourse(id) {
    const course = courses.find(c => c.id === id);
    if (course) {
        openModal(course);
    }
}

// Save Course
function saveCourse() {
    const form = document.getElementById('courseForm');
    
    // Validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const courseData = {
        id: currentEditingId || Date.now(),
        title: document.getElementById('courseTitle').value.trim(),
        subtitle: document.getElementById('courseSubtitle').value.trim(),
        price: document.getElementById('coursePrice').value.trim(),
        category: document.getElementById('courseCategory').value,
        level: document.getElementById('courseLevel').value,
        duration: document.getElementById('courseDuration').value.trim(),
        badge: document.getElementById('courseBadge').value.trim(),
        badgeClass: document.getElementById('courseBadgeClass').value,
        description: document.getElementById('courseDescription').value.trim(),
        imageUrl: document.getElementById('courseImageUrl').value.trim(),
        buyNowLink: document.getElementById('courseBuyNowLink').value.trim(),
        pdfDownloadLink: document.getElementById('coursePdfLink').value.trim(),
        youtubePreviewLink: document.getElementById('courseYoutubeLink').value.trim(),
        telegramGroupLink: document.getElementById('courseTelegramLink').value.trim(),
        whatsappLink: document.getElementById('courseWhatsappLink').value.trim(),
        videoLink: document.getElementById('courseVideoLink').value.trim(),
        instructorName: document.getElementById('courseInstructor').value.trim(),
        status: document.getElementById('courseStatus').value,
        thumbnailBase64: thumbnailBase64,
        bannerBase64: bannerBase64,
        pdfBase64: pdfBase64,
        features: document.getElementById('courseFeatures').value
            .split('\n')
            .map(f => f.trim())
            .filter(f => f),
        featured: document.getElementById('courseFeatured').checked,
        period: 'one-time',
        ctaText: 'Enroll Now',
        ctaClass: currentEditingId ? (courses.find(c => c.id === currentEditingId)?.ctaClass || 'btn-outline-primary') : 'btn-outline-primary'
    };
    
    if (currentEditingId) {
        // Update existing course
        const index = courses.findIndex(c => c.id === currentEditingId);
        if (index !== -1) {
            courses[index] = courseData;
            console.log('✅ Course updated:', courseData.title);
        }
    } else {
        // Add new course
        courses.push(courseData);
        console.log('✅ Course added:', courseData.title);
    }
    
    saveCoursesToStorage();
    renderCoursesTable();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('courseModal'));
    modal.hide();
    
    alert(currentEditingId ? 'Course updated successfully!' : 'Course added successfully!');
}

// Confirm Delete
function confirmDelete(id) {
    deleteCourseId = id;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

// Delete Course
function deleteCourse() {
    if (deleteCourseId) {
        courses = courses.filter(c => c.id !== deleteCourseId);
        saveCoursesToStorage();
        renderCoursesTable();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();
        
        console.log('✅ Course deleted:', deleteCourseId);
        alert('Course deleted successfully!');
        deleteCourseId = null;
    }
}

// Export Courses to JSON
function exportCourses() {
    const dataStr = JSON.stringify(courses, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'courses.json';
    link.click();
    
    URL.revokeObjectURL(url);
    console.log('✅ Courses exported to courses.json');
}

// Import Courses from JSON
function importCourses(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedCourses = JSON.parse(e.target.result);
            
            if (Array.isArray(importedCourses)) {
                courses = importedCourses;
                saveCoursesToStorage();
                renderCoursesTable();
                console.log('✅ Courses imported from courses.json');
                alert('Courses imported successfully!');
            } else {
                alert('Invalid JSON format. Expected an array of courses.');
            }
        } catch (error) {
            console.error('❌ Error importing courses:', error);
            alert('Error importing courses. Please check the JSON file format.');
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

// Filter Courses
function filterCourses() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    const filtered = courses.filter(course => {
        const matchesSearch = 
            course.title.toLowerCase().includes(searchTerm) ||
            course.description.toLowerCase().includes(searchTerm) ||
            (course.subtitle && course.subtitle.toLowerCase().includes(searchTerm));
        
        const matchesCategory = !categoryFilter || course.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    renderCoursesTable(filtered);
}

// File Upload Handlers
function handleThumbnailUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('Thumbnail file size must be less than 2MB');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        thumbnailBase64 = e.target.result;
        console.log('✅ Thumbnail uploaded');
    };
    reader.readAsDataURL(file);
}

function handleBannerUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Banner file size must be less than 5MB');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        bannerBase64 = e.target.result;
        console.log('✅ Banner uploaded');
    };
    reader.readAsDataURL(file);
}

function handlePdfUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('PDF file size must be less than 10MB');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        pdfBase64 = e.target.result;
        console.log('✅ PDF uploaded');
    };
    reader.readAsDataURL(file);
}

function handleStandalonePdfUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('PDF file size must be less than 10MB');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        standalonePdfBase64 = e.target.result;
        console.log('✅ Standalone PDF uploaded');
    };
    reader.readAsDataURL(file);
}

// PDF Modal Functions
function openPdfModal(pdf = null) {
    const modal = new bootstrap.Modal(document.getElementById('pdfModal'));
    const modalTitle = document.getElementById('pdfModalTitle');
    const form = document.getElementById('pdfForm');
    
    standalonePdfBase64 = '';
    
    if (pdf) {
        modalTitle.textContent = 'Edit PDF';
        currentEditingId = pdf.id;
        
        document.getElementById('pdfId').value = pdf.id;
        document.getElementById('pdfTitle').value = pdf.title;
        document.getElementById('pdfDescription').value = pdf.description || '';
        document.getElementById('pdfCategory').value = pdf.category || 'General';
        document.getElementById('pdfDownloadLink').value = pdf.downloadLink || '';
        document.getElementById('pdfStatus').value = pdf.status || 'Draft';
        standalonePdfBase64 = pdf.pdfBase64 || '';
    } else {
        modalTitle.textContent = 'Add New PDF';
        currentEditingId = null;
        form.reset();
        document.getElementById('pdfStatus').value = 'Draft';
    }
    
    modal.show();
}

function editPdf(id) {
    const pdf = pdfs.find(p => p.id === id);
    if (pdf) {
        openPdfModal(pdf);
    }
}

function savePdf() {
    const form = document.getElementById('pdfForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const pdfData = {
        id: currentEditingId || Date.now(),
        title: document.getElementById('pdfTitle').value.trim(),
        description: document.getElementById('pdfDescription').value.trim(),
        category: document.getElementById('pdfCategory').value,
        downloadLink: document.getElementById('pdfDownloadLink').value.trim(),
        status: document.getElementById('pdfStatus').value,
        pdfBase64: standalonePdfBase64,
        downloads: currentEditingId ? (pdfs.find(p => p.id === currentEditingId)?.downloads || 0) : 0,
        createdAt: currentEditingId ? (pdfs.find(p => p.id === currentEditingId)?.createdAt || new Date().toISOString()) : new Date().toISOString()
    };
    
    if (currentEditingId) {
        const index = pdfs.findIndex(p => p.id === currentEditingId);
        if (index !== -1) {
            pdfs[index] = pdfData;
            console.log('✅ PDF updated:', pdfData.title);
        }
    } else {
        pdfs.push(pdfData);
        console.log('✅ PDF added:', pdfData.title);
    }
    
    savePdfsToStorage();
    renderPdfsTable();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('pdfModal'));
    modal.hide();
    
    alert(currentEditingId ? 'PDF updated successfully!' : 'PDF added successfully!');
}

function confirmDeletePdf(id) {
    deletePdfId = id;
    const modal = new bootstrap.Modal(document.getElementById('deletePdfModal'));
    modal.show();
}

function deletePdf() {
    if (deletePdfId) {
        pdfs = pdfs.filter(p => p.id !== deletePdfId);
        savePdfsToStorage();
        renderPdfsTable();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('deletePdfModal'));
        modal.hide();
        
        console.log('✅ PDF deleted:', deletePdfId);
        alert('PDF deleted successfully!');
        deletePdfId = null;
    }
}

function filterPdfs() {
    const searchTerm = document.getElementById('pdfSearchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('pdfCategoryFilter').value;
    
    const filtered = pdfs.filter(pdf => {
        const matchesSearch = 
            pdf.title.toLowerCase().includes(searchTerm) ||
            (pdf.description && pdf.description.toLowerCase().includes(searchTerm));
        
        const matchesCategory = !categoryFilter || pdf.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    renderPdfsTable(filtered);
}

// ===================================
// Testimonials CRUD
// ===================================
let testimonials = [];
let currentTestimonialId = null;
let deleteTestimonialId = null;

function loadTestimonials() {
    try {
        const stored = localStorage.getItem('paramcgwala_testimonials');
        if (stored) {
            testimonials = JSON.parse(stored);
        } else {
            testimonials = [
                { id: 1, name: 'Rahul K.', role: 'Professional Trader', text: 'PARAMCGWALA completely changed the way I approach trading. The bots are incredibly accurate and the community support is unmatched.', rating: 5, initials: 'RK', result: '+127%', resultLabel: '6-month return', status: 'Published' },
                { id: 2, name: 'Priya S.', role: 'Beginner Trader', text: 'I started with zero knowledge and now I am consistently profitable. The structured courses make complex concepts easy to understand.', rating: 5, initials: 'PS', result: '+89%', resultLabel: '3-month return', status: 'Published' },
                { id: 3, name: 'Amit V.', role: 'Full-time Investor', text: 'The automation features save me hours every day. I can run my entire trading strategy on autopilot while focusing on analysis.', rating: 5, initials: 'AV', result: '+200%', resultLabel: 'Annual return', status: 'Published' },
                { id: 4, name: 'Neha M.', role: 'Part-time Trader', text: 'Finally a platform that delivers on its promises. The telegram signals are accurate and the community is incredibly helpful.', rating: 5, initials: 'NM', result: '+156%', resultLabel: '4-month return', status: 'Published' }
            ];
            saveTestimonialsToStorage();
        }
        renderTestimonialsTable();
    } catch (error) {
        console.error('Error loading testimonials:', error);
        testimonials = [];
        renderTestimonialsTable();
    }
}

function saveTestimonialsToStorage() {
    localStorage.setItem('paramcgwala_testimonials', JSON.stringify(testimonials));
}

function renderTestimonialsTable() {
    const tableBody = document.getElementById('testimonialsTableBody');
    if (!tableBody) return;
    
    if (testimonials.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center"><div class="no-courses-message"><i class="bi bi-chat-quote"></i><p>No testimonials found. Add your first testimonial to get started.</p></div></td></tr>`;
        return;
    }
    
    tableBody.innerHTML = testimonials.map(t => `
        <tr>
            <td>${t.id}</td>
            <td><strong>${t.name}</strong>${t.role ? `<br><small class="text-muted">${t.role}</small>` : ''}</td>
            <td>${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</td>
            <td>${t.result || '-'}</td>
            <td>${t.status === 'Published' ? '<span class="status-badge published"><i class="bi bi-check-circle"></i> Published</span>' : '<span class="status-badge draft"><i class="bi bi-file-earmark"></i> Draft</span>'}</td>
            <td>
                <button class="action-btn edit" onclick="editTestimonial(${t.id})" title="Edit"><i class="bi bi-pencil"></i></button>
                <button class="action-btn delete" onclick="confirmDeleteTestimonial(${t.id})" title="Delete"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function openTestimonialModal(testimonial = null) {
    const modal = new bootstrap.Modal(document.getElementById('testimonialModal'));
    const modalTitle = document.getElementById('testimonialModalTitle');
    const form = document.getElementById('testimonialForm');
    
    if (testimonial) {
        modalTitle.textContent = 'Edit Testimonial';
        currentTestimonialId = testimonial.id;
        document.getElementById('testimonialName').value = testimonial.name;
        document.getElementById('testimonialRole').value = testimonial.role || '';
        document.getElementById('testimonialText').value = testimonial.text;
        document.getElementById('testimonialRating').value = testimonial.rating;
        document.getElementById('testimonialInitials').value = testimonial.initials || '';
        document.getElementById('testimonialResult').value = testimonial.result || '';
        document.getElementById('testimonialResultLabel').value = testimonial.resultLabel || '';
        document.getElementById('testimonialStatus').value = testimonial.status || 'Published';
    } else {
        modalTitle.textContent = 'Add New Testimonial';
        currentTestimonialId = null;
        form.reset();
        document.getElementById('testimonialRating').value = '5';
        document.getElementById('testimonialStatus').value = 'Published';
    }
    
    modal.show();
}

function editTestimonial(id) {
    const t = testimonials.find(x => x.id === id);
    if (t) openTestimonialModal(t);
}

function saveTestimonial() {
    const form = document.getElementById('testimonialForm');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    
    const data = {
        id: currentTestimonialId || Date.now(),
        name: document.getElementById('testimonialName').value.trim(),
        role: document.getElementById('testimonialRole').value.trim(),
        text: document.getElementById('testimonialText').value.trim(),
        rating: parseInt(document.getElementById('testimonialRating').value),
        initials: document.getElementById('testimonialInitials').value.trim(),
        result: document.getElementById('testimonialResult').value.trim(),
        resultLabel: document.getElementById('testimonialResultLabel').value.trim(),
        status: document.getElementById('testimonialStatus').value
    };
    
    if (currentTestimonialId) {
        const idx = testimonials.findIndex(x => x.id === currentTestimonialId);
        if (idx !== -1) testimonials[idx] = data;
    } else {
        testimonials.push(data);
    }
    
    saveTestimonialsToStorage();
    renderTestimonialsTable();
    bootstrap.Modal.getInstance(document.getElementById('testimonialModal')).hide();
    alert(currentTestimonialId ? 'Testimonial updated!' : 'Testimonial added!');
}

function confirmDeleteTestimonial(id) {
    deleteTestimonialId = id;
    new bootstrap.Modal(document.getElementById('deleteTestimonialModal')).show();
}

function deleteTestimonial() {
    if (deleteTestimonialId) {
        testimonials = testimonials.filter(x => x.id !== deleteTestimonialId);
        saveTestimonialsToStorage();
        renderTestimonialsTable();
        bootstrap.Modal.getInstance(document.getElementById('deleteTestimonialModal')).hide();
        deleteTestimonialId = null;
    }
}

// ===================================
// Resources CRUD
// ===================================
let resources = [];
let currentResourceId = null;
let deleteResourceId = null;

function loadResources() {
    try {
        const stored = localStorage.getItem('paramcgwala_resources');
        if (stored) {
            resources = JSON.parse(stored);
        } else {
            resources = [];
            saveResourcesToStorage();
        }
        renderResourcesTable();
    } catch (error) {
        console.error('Error loading resources:', error);
        resources = [];
        renderResourcesTable();
    }
}

function saveResourcesToStorage() {
    localStorage.setItem('paramcgwala_resources', JSON.stringify(resources));
}

function renderResourcesTable() {
    const tableBody = document.getElementById('resourcesTableBody');
    if (!tableBody) return;
    
    if (resources.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center"><div class="no-courses-message"><i class="bi bi-bookmark"></i><p>No resources found. Add your first resource to get started.</p></div></td></tr>`;
        return;
    }
    
    tableBody.innerHTML = resources.map(r => `
        <tr>
            <td>${r.id}</td>
            <td><strong>${r.title}</strong></td>
            <td><span class="status-badge">${r.type}</span></td>
            <td>${r.status === 'Published' ? '<span class="status-badge published"><i class="bi bi-check-circle"></i> Published</span>' : '<span class="status-badge draft"><i class="bi bi-file-earmark"></i> Draft</span>'}</td>
            <td>
                <button class="action-btn edit" onclick="editResource(${r.id})" title="Edit"><i class="bi bi-pencil"></i></button>
                <button class="action-btn delete" onclick="confirmDeleteResource(${r.id})" title="Delete"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function openResourceModal(resource = null) {
    const modal = new bootstrap.Modal(document.getElementById('resourceModal'));
    const modalTitle = document.getElementById('resourceModalTitle');
    const form = document.getElementById('resourceForm');
    
    if (resource) {
        modalTitle.textContent = 'Edit Resource';
        currentResourceId = resource.id;
        document.getElementById('resourceTitle').value = resource.title;
        document.getElementById('resourceType').value = resource.type;
        document.getElementById('resourceDescription').value = resource.description;
        document.getElementById('resourceUrl').value = resource.url || '';
        document.getElementById('resourceStatus').value = resource.status || 'Published';
    } else {
        modalTitle.textContent = 'Add New Resource';
        currentResourceId = null;
        form.reset();
        document.getElementById('resourceType').value = 'PDF';
        document.getElementById('resourceStatus').value = 'Published';
    }
    
    modal.show();
}

function editResource(id) {
    const r = resources.find(x => x.id === id);
    if (r) openResourceModal(r);
}

function saveResource() {
    const form = document.getElementById('resourceForm');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    
    const data = {
        id: currentResourceId || Date.now(),
        title: document.getElementById('resourceTitle').value.trim(),
        type: document.getElementById('resourceType').value,
        description: document.getElementById('resourceDescription').value.trim(),
        url: document.getElementById('resourceUrl').value.trim(),
        status: document.getElementById('resourceStatus').value
    };
    
    if (currentResourceId) {
        const idx = resources.findIndex(x => x.id === currentResourceId);
        if (idx !== -1) resources[idx] = data;
    } else {
        resources.push(data);
    }
    
    saveResourcesToStorage();
    renderResourcesTable();
    bootstrap.Modal.getInstance(document.getElementById('resourceModal')).hide();
    alert(currentResourceId ? 'Resource updated!' : 'Resource added!');
}

function confirmDeleteResource(id) {
    deleteResourceId = id;
    new bootstrap.Modal(document.getElementById('deleteResourceModal')).show();
}

function deleteResource() {
    if (deleteResourceId) {
        resources = resources.filter(x => x.id !== deleteResourceId);
        saveResourcesToStorage();
        renderResourcesTable();
        bootstrap.Modal.getInstance(document.getElementById('deleteResourceModal')).hide();
        deleteResourceId = null;
    }
}

// ===================================
// Pricing Plans CRUD
// ===================================
let pricingPlans = [];
let currentPricingId = null;
let deletePricingId = null;

function loadPricingPlans() {
    try {
        const stored = localStorage.getItem('paramcgwala_pricing');
        if (stored) {
            pricingPlans = JSON.parse(stored);
        } else {
            pricingPlans = [
                { id: 1, name: 'Starter', price: 'Free', period: 'forever', features: ['Access to basic bots', 'Community forum access', 'Weekly market insights', 'Basic support'], featured: false, status: 'Published' },
                { id: 2, name: 'Pro Trader', price: '$299', period: 'one-time', features: ['All starter features', 'Premium trading bots', 'Real-time signals', 'Advanced analytics', 'Priority support', 'Private telegram group'], featured: true, status: 'Published' },
                { id: 3, name: 'Enterprise', price: '$999', period: 'one-time', features: ['All pro features', 'Custom bot development', 'API access', 'Dedicated account manager', 'White-label solution', '24/7 phone support'], featured: false, status: 'Published' }
            ];
            savePricingToStorage();
        }
        renderPricingTable();
    } catch (error) {
        console.error('Error loading pricing:', error);
        pricingPlans = [];
        renderPricingTable();
    }
}

function savePricingToStorage() {
    localStorage.setItem('paramcgwala_pricing', JSON.stringify(pricingPlans));
}

function renderPricingTable() {
    const tableBody = document.getElementById('pricingTableBody');
    if (!tableBody) return;
    
    if (pricingPlans.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center"><div class="no-courses-message"><i class="bi bi-currency-dollar"></i><p>No pricing plans found. Add your first plan to get started.</p></div></td></tr>`;
        return;
    }
    
    tableBody.innerHTML = pricingPlans.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><strong>${p.name}</strong>${p.featured ? ' <span class="badge bg-warning text-dark">Featured</span>' : ''}</td>
            <td>${p.price}<small class="text-muted">/${p.period || ''}</small></td>
            <td>${p.status === 'Published' ? '<span class="status-badge published"><i class="bi bi-check-circle"></i> Published</span>' : '<span class="status-badge draft"><i class="bi bi-file-earmark"></i> Draft</span>'}</td>
            <td>
                <button class="action-btn edit" onclick="editPricing(${p.id})" title="Edit"><i class="bi bi-pencil"></i></button>
                <button class="action-btn delete" onclick="confirmDeletePricing(${p.id})" title="Delete"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function openPricingModal(plan = null) {
    const modal = new bootstrap.Modal(document.getElementById('pricingModal'));
    const modalTitle = document.getElementById('pricingModalTitle');
    const form = document.getElementById('pricingForm');
    
    if (plan) {
        modalTitle.textContent = 'Edit Pricing Plan';
        currentPricingId = plan.id;
        document.getElementById('planName').value = plan.name;
        document.getElementById('planPrice').value = plan.price;
        document.getElementById('planPeriod').value = plan.period || '';
        document.getElementById('planFeatures').value = (plan.features || []).join('\n');
        document.getElementById('planFeatured').checked = plan.featured || false;
        document.getElementById('planStatus').value = plan.status || 'Published';
    } else {
        modalTitle.textContent = 'Add New Plan';
        currentPricingId = null;
        form.reset();
        document.getElementById('planStatus').value = 'Published';
    }
    
    modal.show();
}

function editPricing(id) {
    const p = pricingPlans.find(x => x.id === id);
    if (p) openPricingModal(p);
}

function savePricing() {
    const form = document.getElementById('pricingForm');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    
    const data = {
        id: currentPricingId || Date.now(),
        name: document.getElementById('planName').value.trim(),
        price: document.getElementById('planPrice').value.trim(),
        period: document.getElementById('planPeriod').value.trim(),
        features: document.getElementById('planFeatures').value.split('\n').map(f => f.trim()).filter(f => f),
        featured: document.getElementById('planFeatured').checked,
        status: document.getElementById('planStatus').value
    };
    
    if (currentPricingId) {
        const idx = pricingPlans.findIndex(x => x.id === currentPricingId);
        if (idx !== -1) pricingPlans[idx] = data;
    } else {
        pricingPlans.push(data);
    }
    
    savePricingToStorage();
    renderPricingTable();
    bootstrap.Modal.getInstance(document.getElementById('pricingModal')).hide();
    alert(currentPricingId ? 'Plan updated!' : 'Plan added!');
}

function confirmDeletePricing(id) {
    deletePricingId = id;
    new bootstrap.Modal(document.getElementById('deletePricingModal')).show();
}

function deletePricing() {
    if (deletePricingId) {
        pricingPlans = pricingPlans.filter(x => x.id !== deletePricingId);
        savePricingToStorage();
        renderPricingTable();
        bootstrap.Modal.getInstance(document.getElementById('deletePricingModal')).hide();
        deletePricingId = null;
    }
}

// ===================================
// FAQs CRUD
// ===================================
let faqs = [];
let currentFaqId = null;
let deleteFaqId = null;

function loadFaqs() {
    try {
        const stored = localStorage.getItem('paramcgwala_faqs');
        if (stored) {
            faqs = JSON.parse(stored);
        } else {
            faqs = [];
            saveFaqsToStorage();
        }
        renderFaqsTable();
    } catch (error) {
        console.error('Error loading FAQs:', error);
        faqs = [];
        renderFaqsTable();
    }
}

function saveFaqsToStorage() {
    localStorage.setItem('paramcgwala_faqs', JSON.stringify(faqs));
}

function renderFaqsTable() {
    const tableBody = document.getElementById('faqsTableBody');
    if (!tableBody) return;
    
    if (faqs.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center"><div class="no-courses-message"><i class="bi bi-question-circle"></i><p>No FAQs found. Add your first FAQ to get started.</p></div></td></tr>`;
        return;
    }
    
    tableBody.innerHTML = faqs.map(f => `
        <tr>
            <td>${f.id}</td>
            <td><strong>${f.question}</strong></td>
            <td><span class="status-badge">${f.category || 'General'}</span></td>
            <td>${f.status === 'Published' ? '<span class="status-badge published"><i class="bi bi-check-circle"></i> Published</span>' : '<span class="status-badge draft"><i class="bi bi-file-earmark"></i> Draft</span>'}</td>
            <td>
                <button class="action-btn edit" onclick="editFaq(${f.id})" title="Edit"><i class="bi bi-pencil"></i></button>
                <button class="action-btn delete" onclick="confirmDeleteFaq(${f.id})" title="Delete"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function openFaqModal(faq = null) {
    const modal = new bootstrap.Modal(document.getElementById('faqModal'));
    const modalTitle = document.getElementById('faqModalTitle');
    const form = document.getElementById('faqForm');
    
    if (faq) {
        modalTitle.textContent = 'Edit FAQ';
        currentFaqId = faq.id;
        document.getElementById('faqQuestion').value = faq.question;
        document.getElementById('faqAnswer').value = faq.answer;
        document.getElementById('faqCategory').value = faq.category || 'Trading';
        document.getElementById('faqOrder').value = faq.order || 0;
        document.getElementById('faqStatus').value = faq.status || 'Published';
    } else {
        modalTitle.textContent = 'Add New FAQ';
        currentFaqId = null;
        form.reset();
        document.getElementById('faqCategory').value = 'Trading';
        document.getElementById('faqOrder').value = '0';
        document.getElementById('faqStatus').value = 'Published';
    }
    
    modal.show();
}

function editFaq(id) {
    const f = faqs.find(x => x.id === id);
    if (f) openFaqModal(f);
}

function saveFaq() {
    const form = document.getElementById('faqForm');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    
    const data = {
        id: currentFaqId || Date.now(),
        question: document.getElementById('faqQuestion').value.trim(),
        answer: document.getElementById('faqAnswer').value.trim(),
        category: document.getElementById('faqCategory').value,
        order: parseInt(document.getElementById('faqOrder').value) || 0,
        status: document.getElementById('faqStatus').value
    };
    
    if (currentFaqId) {
        const idx = faqs.findIndex(x => x.id === currentFaqId);
        if (idx !== -1) faqs[idx] = data;
    } else {
        faqs.push(data);
    }
    
    saveFaqsToStorage();
    renderFaqsTable();
    bootstrap.Modal.getInstance(document.getElementById('faqModal')).hide();
    alert(currentFaqId ? 'FAQ updated!' : 'FAQ added!');
}

function confirmDeleteFaq(id) {
    deleteFaqId = id;
    new bootstrap.Modal(document.getElementById('deleteFaqModal')).show();
}

function deleteFaq() {
    if (deleteFaqId) {
        faqs = faqs.filter(x => x.id !== deleteFaqId);
        saveFaqsToStorage();
        renderFaqsTable();
        bootstrap.Modal.getInstance(document.getElementById('deleteFaqModal')).hide();
        deleteFaqId = null;
    }
}

// ===================================
// Videos CRUD
// ===================================
let videos = [];
let currentVideoId = null;
let deleteVideoId = null;

function loadVideos() {
    try {
        const stored = localStorage.getItem('paramcgwala_videos');
        if (stored) {
            videos = JSON.parse(stored);
        } else {
            videos = [];
            saveVideosToStorage();
        }
        renderVideosTable();
    } catch (error) {
        console.error('Error loading videos:', error);
        videos = [];
        renderVideosTable();
    }
}

function saveVideosToStorage() {
    localStorage.setItem('paramcgwala_videos', JSON.stringify(videos));
}

function renderVideosTable() {
    const tableBody = document.getElementById('videosTableBody');
    if (!tableBody) return;
    
    if (videos.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center"><div class="no-courses-message"><i class="bi bi-play-circle"></i><p>No videos found. Add your first video to get started.</p></div></td></tr>`;
        return;
    }
    
    tableBody.innerHTML = videos.map(v => `
        <tr>
            <td>${v.id}</td>
            <td><strong>${v.title}</strong></td>
            <td><span class="status-badge">${v.category || 'Course'}</span></td>
            <td>${v.duration || '-'}</td>
            <td>${v.status === 'Published' ? '<span class="status-badge published"><i class="bi bi-check-circle"></i> Published</span>' : '<span class="status-badge draft"><i class="bi bi-file-earmark"></i> Draft</span>'}</td>
            <td>
                <button class="action-btn edit" onclick="editVideo(${v.id})" title="Edit"><i class="bi bi-pencil"></i></button>
                <button class="action-btn delete" onclick="confirmDeleteVideo(${v.id})" title="Delete"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function openVideoModal(video = null) {
    const modal = new bootstrap.Modal(document.getElementById('videoModal'));
    const modalTitle = document.getElementById('videoModalTitle');
    const form = document.getElementById('videoForm');
    
    if (video) {
        modalTitle.textContent = 'Edit Video';
        currentVideoId = video.id;
        document.getElementById('videoTitle').value = video.title;
        document.getElementById('videoCategory').value = video.category || 'Course';
        document.getElementById('videoDuration').value = video.duration || '';
        document.getElementById('videoDescription').value = video.description || '';
        document.getElementById('videoUrl').value = video.url || '';
        document.getElementById('videoThumbnail').value = video.thumbnail || '';
        document.getElementById('videoStatus').value = video.status || 'Published';
        document.getElementById('videoFeatured').value = video.featured ? 'true' : 'false';
    } else {
        modalTitle.textContent = 'Add New Video';
        currentVideoId = null;
        form.reset();
        document.getElementById('videoCategory').value = 'Course';
        document.getElementById('videoStatus').value = 'Published';
        document.getElementById('videoFeatured').value = 'false';
    }
    
    modal.show();
}

function editVideo(id) {
    const v = videos.find(x => x.id === id);
    if (v) openVideoModal(v);
}

function saveVideo() {
    const form = document.getElementById('videoForm');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    
    const data = {
        id: currentVideoId || Date.now(),
        title: document.getElementById('videoTitle').value.trim(),
        category: document.getElementById('videoCategory').value,
        duration: document.getElementById('videoDuration').value.trim(),
        description: document.getElementById('videoDescription').value.trim(),
        url: document.getElementById('videoUrl').value.trim(),
        thumbnail: document.getElementById('videoThumbnail').value.trim(),
        status: document.getElementById('videoStatus').value,
        featured: document.getElementById('videoFeatured').value === 'true'
    };
    
    if (currentVideoId) {
        const idx = videos.findIndex(x => x.id === currentVideoId);
        if (idx !== -1) videos[idx] = data;
    } else {
        videos.push(data);
    }
    
    saveVideosToStorage();
    renderVideosTable();
    bootstrap.Modal.getInstance(document.getElementById('videoModal')).hide();
    alert(currentVideoId ? 'Video updated!' : 'Video added!');
}

function confirmDeleteVideo(id) {
    deleteVideoId = id;
    new bootstrap.Modal(document.getElementById('deleteVideoModal')).show();
}

function deleteVideo() {
    if (deleteVideoId) {
        videos = videos.filter(x => x.id !== deleteVideoId);
        saveVideosToStorage();
        renderVideosTable();
        bootstrap.Modal.getInstance(document.getElementById('deleteVideoModal')).hide();
        deleteVideoId = null;
    }
}

// ===================================
// Landing Pages CRUD
// ===================================
let landingPages = [];
let currentLandingPageId = null;
let deleteLandingPageId = null;

function loadLandingPages() {
    try {
        const stored = localStorage.getItem('paramcgwala_landing_pages');
        if (stored) {
            landingPages = JSON.parse(stored);
        } else {
            landingPages = [];
            saveLandingPagesToStorage();
        }
        renderLandingPagesTable();
    } catch (error) {
        console.error('Error loading landing pages:', error);
        landingPages = [];
        renderLandingPagesTable();
    }
}

function saveLandingPagesToStorage() {
    localStorage.setItem('paramcgwala_landing_pages', JSON.stringify(landingPages));
}

function renderLandingPagesTable() {
    const tableBody = document.getElementById('landingPagesTableBody');
    if (!tableBody) return;
    
    if (landingPages.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center"><div class="no-courses-message"><i class="bi bi-layout-text-window"></i><p>No landing pages found. Add your first page to get started.</p></div></td></tr>`;
        return;
    }
    
    tableBody.innerHTML = landingPages.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><strong>${p.title}</strong>${p.featured ? ' <span class="badge bg-warning text-dark">Featured</span>' : ''}</td>
            <td>${p.slug || '-'}</td>
            <td>${p.views || 0}</td>
            <td>${p.status === 'Published' ? '<span class="status-badge published"><i class="bi bi-check-circle"></i> Published</span>' : '<span class="status-badge draft"><i class="bi bi-file-earmark"></i> Draft</span>'}</td>
            <td>
                <button class="action-btn edit" onclick="editLandingPage(${p.id})" title="Edit"><i class="bi bi-pencil"></i></button>
                <button class="action-btn delete" onclick="confirmDeleteLandingPage(${p.id})" title="Delete"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function openLandingPageModal(page = null) {
    const modal = new bootstrap.Modal(document.getElementById('landingPageModal'));
    const modalTitle = document.getElementById('landingPageModalTitle');
    const form = document.getElementById('landingPageForm');
    
    if (page) {
        modalTitle.textContent = 'Edit Landing Page';
        currentLandingPageId = page.id;
        document.getElementById('landingPageTitle').value = page.title;
        document.getElementById('landingPageSlug').value = page.slug || '';
        document.getElementById('landingPageDescription').value = page.description || '';
        document.getElementById('landingPageStatus').value = page.status || 'Published';
        document.getElementById('landingPageViews').value = page.views || 0;
        document.getElementById('landingPageFeatured').checked = page.featured || false;
    } else {
        modalTitle.textContent = 'Add New Landing Page';
        currentLandingPageId = null;
        form.reset();
        document.getElementById('landingPageStatus').value = 'Published';
        document.getElementById('landingPageViews').value = 0;
        document.getElementById('landingPageFeatured').checked = false;
    }
    
    modal.show();
}

function editLandingPage(id) {
    const p = landingPages.find(x => x.id === id);
    if (p) openLandingPageModal(p);
}

function saveLandingPage() {
    const form = document.getElementById('landingPageForm');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    
    const data = {
        id: currentLandingPageId || Date.now(),
        title: document.getElementById('landingPageTitle').value.trim(),
        slug: document.getElementById('landingPageSlug').value.trim(),
        description: document.getElementById('landingPageDescription').value.trim(),
        status: document.getElementById('landingPageStatus').value,
        views: parseInt(document.getElementById('landingPageViews').value) || 0,
        featured: document.getElementById('landingPageFeatured').checked
    };
    
    if (currentLandingPageId) {
        const idx = landingPages.findIndex(x => x.id === currentLandingPageId);
        if (idx !== -1) landingPages[idx] = data;
    } else {
        landingPages.push(data);
    }
    
    saveLandingPagesToStorage();
    renderLandingPagesTable();
    bootstrap.Modal.getInstance(document.getElementById('landingPageModal')).hide();
    alert(currentLandingPageId ? 'Landing page updated!' : 'Landing page added!');
}

function confirmDeleteLandingPage(id) {
    deleteLandingPageId = id;
    new bootstrap.Modal(document.getElementById('deleteLandingPageModal')).show();
}

function deleteLandingPage() {
    if (deleteLandingPageId) {
        landingPages = landingPages.filter(x => x.id !== deleteLandingPageId);
        saveLandingPagesToStorage();
        renderLandingPagesTable();
        bootstrap.Modal.getInstance(document.getElementById('deleteLandingPageModal')).hide();
        deleteLandingPageId = null;
    }
}

// Hook up new tab CRUD events + initialize data
document.addEventListener('DOMContentLoaded', function() {
    // Defer to let original DOMContentLoaded handler run first
    setTimeout(function() {
        // Init data stores
        loadTestimonials();
        loadResources();
        loadPricingPlans();
        loadFaqs();
        loadVideos();
        loadLandingPages();
        loadUsers();
        loadSettings();
        loadLogs();
        initAnalytics();

        // Testimonial events
        const addTestimonialBtn = document.getElementById('addTestimonialBtn');
        if (addTestimonialBtn) addTestimonialBtn.addEventListener('click', () => openTestimonialModal());
        const saveTestimonialBtn = document.getElementById('saveTestimonialBtn');
        if (saveTestimonialBtn) saveTestimonialBtn.addEventListener('click', saveTestimonial);
        const confirmDeleteTestimonialBtn = document.getElementById('confirmDeleteTestimonialBtn');
        if (confirmDeleteTestimonialBtn) confirmDeleteTestimonialBtn.addEventListener('click', deleteTestimonial);

        // Resource events
        const addResourceBtn = document.getElementById('addResourceBtn');
        if (addResourceBtn) addResourceBtn.addEventListener('click', () => openResourceModal());
        const saveResourceBtn = document.getElementById('saveResourceBtn');
        if (saveResourceBtn) saveResourceBtn.addEventListener('click', saveResource);
        const confirmDeleteResourceBtn = document.getElementById('confirmDeleteResourceBtn');
        if (confirmDeleteResourceBtn) confirmDeleteResourceBtn.addEventListener('click', deleteResource);

        // Pricing events
        const addPricingBtn = document.getElementById('addPricingBtn');
        if (addPricingBtn) addPricingBtn.addEventListener('click', () => openPricingModal());
        const savePricingBtn = document.getElementById('savePricingBtn');
        if (savePricingBtn) savePricingBtn.addEventListener('click', savePricing);
        const confirmDeletePricingBtn = document.getElementById('confirmDeletePricingBtn');
        if (confirmDeletePricingBtn) confirmDeletePricingBtn.addEventListener('click', deletePricing);

        // FAQ events
        const addFaqBtn = document.getElementById('addFaqBtn');
        if (addFaqBtn) addFaqBtn.addEventListener('click', () => openFaqModal());
        const saveFaqBtn = document.getElementById('saveFaqBtn');
        if (saveFaqBtn) saveFaqBtn.addEventListener('click', saveFaq);
        const confirmDeleteFaqBtn = document.getElementById('confirmDeleteFaqBtn');
        if (confirmDeleteFaqBtn) confirmDeleteFaqBtn.addEventListener('click', deleteFaq);

        // Video events
        const addVideoBtn = document.getElementById('addVideoBtn');
        if (addVideoBtn) addVideoBtn.addEventListener('click', () => openVideoModal());
        const saveVideoBtn = document.getElementById('saveVideoBtn');
        if (saveVideoBtn) saveVideoBtn.addEventListener('click', saveVideo);
        const confirmDeleteVideoBtn = document.getElementById('confirmDeleteVideoBtn');
        if (confirmDeleteVideoBtn) confirmDeleteVideoBtn.addEventListener('click', deleteVideo);

        // Landing Page events
        const addLandingPageBtn = document.getElementById('addLandingPageBtn');
        if (addLandingPageBtn) addLandingPageBtn.addEventListener('click', () => openLandingPageModal());
        const saveLandingPageBtn = document.getElementById('saveLandingPageBtn');
        if (saveLandingPageBtn) saveLandingPageBtn.addEventListener('click', saveLandingPage);
        const confirmDeleteLandingPageBtn = document.getElementById('confirmDeleteLandingPageBtn');
        if (confirmDeleteLandingPageBtn) confirmDeleteLandingPageBtn.addEventListener('click', deleteLandingPage);

        // User events
        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) addUserBtn.addEventListener('click', () => openUserModal());
        const saveUserBtn = document.getElementById('saveUserBtn');
        if (saveUserBtn) saveUserBtn.addEventListener('click', saveUser);
        const confirmDeleteUserBtn = document.getElementById('confirmDeleteUserBtn');
        if (confirmDeleteUserBtn) confirmDeleteUserBtn.addEventListener('click', deleteUser);
        const userSearchInput = document.getElementById('userSearchInput');
        if (userSearchInput) userSearchInput.addEventListener('input', loadUsers);
        const userRoleFilter = document.getElementById('userRoleFilter');
        if (userRoleFilter) userRoleFilter.addEventListener('change', loadUsers);

        // Settings events
        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveSettings);
    }, 100);
});

// ===================================
// User Management CRUD
// ===================================
let adminUsers = [];
let currentEditingUserId = null;
let deleteUserId = null;

async function loadUsers() {
    const tableBody = document.getElementById('usersTableBody');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr class="skeleton-row">
                <td><span class="skeleton-bar short"></span></td>
                <td><span class="skeleton-bar medium"></span></td>
                <td><span class="skeleton-bar long"></span></td>
                <td><span class="skeleton-bar short"></span></td>
                <td><span class="skeleton-bar short"></span></td>
                <td><span class="skeleton-bar medium"></span></td>
            </tr>
            <tr class="skeleton-row">
                <td><span class="skeleton-bar short"></span></td>
                <td><span class="skeleton-bar medium"></span></td>
                <td><span class="skeleton-bar long"></span></td>
                <td><span class="skeleton-bar short"></span></td>
                <td><span class="skeleton-bar short"></span></td>
                <td><span class="skeleton-bar medium"></span></td>
            </tr>
        `;
    }
    try {
        const searchInput = document.getElementById('userSearchInput');
        const roleFilter = document.getElementById('userRoleFilter');
        
        const search = searchInput ? searchInput.value.trim() : '';
        const role = roleFilter ? roleFilter.value : '';
        
        const response = await fetch(`api/users.php?search=${encodeURIComponent(search)}&role=${encodeURIComponent(role)}`);
        const result = await response.json();
        
        if (result.success) {
            adminUsers = result.data;
            renderUsersTable();
        } else {
            console.error('❌ Failed to load users:', result.message);
        }
    } catch (error) {
        console.error('❌ Error loading users:', error);
    }
}

function renderUsersTable() {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;
    
    if (adminUsers.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center"><div class="no-courses-message"><i class="bi bi-people"></i><p>No users found matching query.</p></div></td></tr>`;
        return;
    }
    
    tableBody.innerHTML = adminUsers.map(user => `
        <tr>
            <td>${user.id}</td>
            <td><strong>${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}</strong></td>
            <td>${escapeHtml(user.email)}</td>
            <td><span class="status-badge ${user.role}">${user.role.toUpperCase()}</span></td>
            <td>
                <span class="status-badge ${user.status === 'active' ? 'published' : 'draft'}">
                    ${user.status.toUpperCase()}
                </span>
            </td>
            <td>
                <button class="action-btn edit" onclick="editUser(${user.id})" title="Edit User">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="action-btn delete" onclick="confirmDeleteUser(${user.id})" title="Delete User">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function openUserModal(user = null) {
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    const modalTitle = document.getElementById('userModalTitle');
    const form = document.getElementById('userForm');
    
    form.reset();
    
    if (user) {
        modalTitle.textContent = 'Edit User';
        currentEditingUserId = user.id;
        document.getElementById('adminUserId').value = user.id;
        document.getElementById('userFirstName').value = user.first_name;
        document.getElementById('userLastName').value = user.last_name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userPhone').value = user.phone || '';
        document.getElementById('userRole').value = user.role;
        document.getElementById('userStatus').value = user.status;
        
        // Email is readonly when editing
        document.getElementById('userEmail').readOnly = true;
        // Password is not required when editing
        document.getElementById('userPassword').required = false;
    } else {
        modalTitle.textContent = 'Add New User';
        currentEditingUserId = null;
        document.getElementById('adminUserId').value = '';
        document.getElementById('userEmail').readOnly = false;
        document.getElementById('userPassword').required = true;
    }
    
    modal.show();
}

function editUser(id) {
    const user = adminUsers.find(u => u.id === id);
    if (user) {
        openUserModal(user);
    }
}

async function saveUser() {
    const form = document.getElementById('userForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const id = document.getElementById('adminUserId').value;
    const data = {
        first_name: document.getElementById('userFirstName').value.trim(),
        last_name: document.getElementById('userLastName').value.trim(),
        email: document.getElementById('userEmail').value.trim(),
        phone: document.getElementById('userPhone').value.trim(),
        password: document.getElementById('userPassword').value,
        role: document.getElementById('userRole').value,
        status: document.getElementById('userStatus').value
    };
    
    let method = 'POST';
    if (id) {
        method = 'PUT';
        data.id = parseInt(id);
    }
    
    try {
        const response = await fetch('api/users.php', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
            alert(id ? 'User updated successfully!' : 'User created successfully!');
            bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
            loadUsers();
            loadLogs(); // Reload activity logs to show this action
        } else {
            alert('Error saving user: ' + result.message);
        }
    } catch (error) {
        console.error('Error saving user:', error);
        alert('An error occurred while saving the user.');
    }
}

function confirmDeleteUser(id) {
    deleteUserId = id;
    new bootstrap.Modal(document.getElementById('deleteUserModal')).show();
}

async function deleteUser() {
    if (!deleteUserId) return;
    
    try {
        const response = await fetch('api/users.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: deleteUserId })
        });
        
        const result = await response.json();
        if (result.success) {
            alert('User deleted successfully!');
            bootstrap.Modal.getInstance(document.getElementById('deleteUserModal')).hide();
            loadUsers();
            loadLogs(); // Reload activity logs
        } else {
            alert('Error deleting user: ' + result.message);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user.');
    } finally {
        deleteUserId = null;
    }
}

// ===================================
// Settings Management
// ===================================
async function loadSettings() {
    try {
        const response = await fetch('api/settings.php');
        const result = await response.json();
        
        if (result.success && result.data) {
            const data = result.data;
            if (document.getElementById('setCompanyName')) document.getElementById('setCompanyName').value = data.company_name || '';
            if (document.getElementById('setCompanyEmail')) document.getElementById('setCompanyEmail').value = data.company_email || '';
            if (document.getElementById('setCompanyPhone')) document.getElementById('setCompanyPhone').value = data.company_phone || '';
            if (document.getElementById('setWhatsapp')) document.getElementById('setWhatsapp').value = data.whatsapp_number || '';
            if (document.getElementById('setTelegram')) document.getElementById('setTelegram').value = data.telegram_handle || '';
            if (document.getElementById('setChatbotWebhook')) document.getElementById('setChatbotWebhook').value = data.chatbot_webhook || '';
            if (document.getElementById('setContactWebhook')) document.getElementById('setContactWebhook').value = data.contact_form_webhook || '';
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

async function saveSettings() {
    const data = {
        company_name: document.getElementById('setCompanyName').value.trim(),
        company_email: document.getElementById('setCompanyEmail').value.trim(),
        company_phone: document.getElementById('setCompanyPhone').value.trim(),
        whatsapp_number: document.getElementById('setWhatsapp').value.trim(),
        telegram_handle: document.getElementById('setTelegram').value.trim(),
        chatbot_webhook: document.getElementById('setChatbotWebhook').value.trim(),
        contact_form_webhook: document.getElementById('setContactWebhook').value.trim()
    };
    
    try {
        const response = await fetch('api/settings.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Settings saved successfully!');
            loadLogs(); // Reload logs
        } else {
            alert('Error saving settings: ' + result.message);
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('An error occurred while saving configurations.');
    }
}

// ===================================
// Activity Logs
// ===================================
async function loadLogs() {
    const tableBody = document.getElementById('logsTableBody');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr class="skeleton-row">
                <td><span class="skeleton-bar medium"></span></td>
                <td><span class="skeleton-bar medium"></span></td>
                <td><span class="skeleton-bar short"></span></td>
                <td><span class="skeleton-bar long"></span></td>
                <td><span class="skeleton-bar medium"></span></td>
            </tr>
            <tr class="skeleton-row">
                <td><span class="skeleton-bar medium"></span></td>
                <td><span class="skeleton-bar medium"></span></td>
                <td><span class="skeleton-bar short"></span></td>
                <td><span class="skeleton-bar long"></span></td>
                <td><span class="skeleton-bar medium"></span></td>
            </tr>
        `;
    }
    try {
        const response = await fetch('api/logs.php');
        const result = await response.json();
        
        if (result.success && result.data) {
            renderLogsTable(result.data);
        }
    } catch (error) {
        console.error('Error loading activity logs:', error);
    }
}

function renderLogsTable(logs) {
    const tableBody = document.getElementById('logsTableBody');
    if (!tableBody) return;
    
    if (logs.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center"><div class="no-courses-message"><i class="bi bi-journal-text"></i><p>No activity logs found.</p></div></td></tr>`;
        return;
    }
    
    tableBody.innerHTML = logs.map(log => {
        const dateStr = log.created_at || '';
        return `
            <tr>
                <td>${escapeHtml(dateStr)}</td>
                <td><strong>${escapeHtml(log.admin_email || 'System')}</strong></td>
                <td><span class="status-badge level">${escapeHtml(log.action.replace('_', ' ').toUpperCase())}</span></td>
                <td>${escapeHtml(log.details || '-')}</td>
                <td><small class="text-muted">${escapeHtml(log.ip_address || '-')}</small></td>
            </tr>
        `;
    }).join('');
}

// ===================================
// Analytics and Performance
// ===================================
let analyticsChartInstance = null;

function initAnalytics() {
    // Generate/fetch some analytics numbers
    const visitsElement = document.getElementById('analyticsVisits');
    const usersElement = document.getElementById('analyticsUsers');
    const premiumElement = document.getElementById('analyticsPremium');
    const enrollmentsElement = document.getElementById('analyticsEnrollments');
    
    // Set mock count values based on real data metrics
    if (visitsElement) visitsElement.textContent = '14,890';
    if (usersElement) usersElement.textContent = adminUsers.length ? adminUsers.length : '840';
    if (premiumElement) {
        const premiumCount = adminUsers.filter(u => u.role === 'premium').length;
        premiumElement.textContent = premiumCount ? premiumCount : '124';
    }
    if (enrollmentsElement) enrollmentsElement.textContent = courses.length ? courses.length * 15 + 120 : '340';
    
    // Initialize Chart.js
    const ctx = document.getElementById('analyticsChart');
    if (!ctx) return;
    
    // Destroy previous chart if exists
    if (analyticsChartInstance) {
        analyticsChartInstance.destroy();
    }
    
    const labels = [];
    const pageviewsData = [];
    const signupsData = [];
    
    // Populate last 7 days labels and data
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' }));
        
        // Random stats
        pageviewsData.push(Math.floor(Math.random() * 800) + 1200);
        signupsData.push(Math.floor(Math.random() * 15) + 5);
    }
    
    analyticsChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Page Views',
                    data: pageviewsData,
                    borderColor: '#00F5D4',
                    backgroundColor: 'rgba(0, 245, 212, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    yAxisID: 'y'
                },
                {
                    label: 'New Signups',
                    data: signupsData,
                    borderColor: '#7209B7',
                    backgroundColor: 'rgba(114, 9, 183, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#a0aec0'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#a0aec0'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false // only want the grid lines for one axis
                    },
                    ticks: {
                        color: '#a0aec0'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

