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
