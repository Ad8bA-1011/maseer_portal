/**
 * Maseer Portal - Main Application Logic v3
 * Enhanced UX with working sub-categories and step-by-step form
 */

const App = (function() {
    'use strict';

    const CONFIG = {
        BACKEND_REPO: 'Ad8bA-1011/maseer_automation',
        MAX_LOGO_SIZE: 2 * 1024 * 1024, // 2MB
        MAX_URL_LENGTH: 7000,
        SUPPORTED_FORMATS: ['image/png', 'image/jpeg', 'image/svg+xml']
    };

    // Sub-categories data
    const SUB_CATEGORIES = {
        'Jewelry & Gold': [
            { value: 'Traditional Gold', label: 'Traditional Gold' },
            { value: 'Modern Jewelry', label: 'Modern Jewelry' },
            { value: 'Wedding Collection', label: 'Wedding Collection' },
            { value: 'Custom Design', label: 'Custom Design' },
            { value: 'Gold Investment', label: 'Gold Investment' }
        ],
        'Café & Restaurant': [
            { value: 'Fast Food', label: 'Fast Food' },
            { value: 'Fine Dining', label: 'Fine Dining' },
            { value: 'Café', label: 'Café' },
            { value: 'Bakery', label: 'Bakery' },
            { value: 'Traditional Cuisine', label: 'Traditional Cuisine' },
            { value: 'International Food', label: 'International Food' }
        ],
        'Fashion & Clothing': [
            { value: 'Men\'s Wear', label: 'Men\'s Wear' },
            { value: 'Women\'s Wear', label: 'Women\'s Wear' },
            { value: 'Children Clothing', label: 'Children Clothing' },
            { value: 'Traditional Clothing', label: 'Traditional Clothing' },
            { value: 'Modern Fashion', label: 'Modern Fashion' },
            { value: 'Accessories', label: 'Accessories' }
        ],
        'Technology & IT': [
            { value: 'Software Development', label: 'Software Development' },
            { value: 'Hardware Sales', label: 'Hardware Sales' },
            { value: 'IT Services', label: 'IT Services' },
            { value: 'Consulting', label: 'Consulting' },
            { value: 'Repair & Maintenance', label: 'Repair & Maintenance' },
            { value: 'Cybersecurity', label: 'Cybersecurity' }
        ],
        'Healthcare & Medical': [
            { value: 'General Clinic', label: 'General Clinic' },
            { value: 'Pharmacy', label: 'Pharmacy' },
            { value: 'Medical Equipment', label: 'Medical Equipment' },
            { value: 'Wellness Center', label: 'Wellness Center' },
            { value: 'Laboratory', label: 'Laboratory' },
            { value: 'Specialized Care', label: 'Specialized Care' }
        ],
        'Education & Training': [
            { value: 'School', label: 'School' },
            { value: 'University', label: 'University' },
            { value: 'Vocational Training', label: 'Vocational Training' },
            { value: 'Online Courses', label: 'Online Courses' },
            { value: 'Private Tutoring', label: 'Private Tutoring' },
            { value: 'Language Learning', label: 'Language Learning' }
        ],
        'Real Estate': [
            { value: 'Residential Sales', label: 'Residential Sales' },
            { value: 'Commercial Property', label: 'Commercial Property' },
            { value: 'Land Development', label: 'Land Development' },
            { value: 'Property Management', label: 'Property Management' },
            { value: 'Construction', label: 'Construction' },
            { value: 'Rental Services', label: 'Rental Services' }
        ],
        'Automotive': [
            { value: 'Car Sales', label: 'Car Sales' },
            { value: 'Auto Repair', label: 'Auto Repair' },
            { value: 'Spare Parts', label: 'Spare Parts' },
            { value: 'Car Rental', label: 'Car Rental' },
            { value: 'Detailing', label: 'Detailing' },
            { value: 'Modification', label: 'Modification' }
        ],
        'Beauty & Cosmetics': [
            { value: 'Beauty Salon', label: 'Beauty Salon' },
            { value: 'Spa', label: 'Spa' },
            { value: 'Cosmetic Products', label: 'Cosmetic Products' },
            { value: 'Makeup Services', label: 'Makeup Services' },
            { value: 'Skincare', label: 'Skincare' },
            { value: 'Hair Styling', label: 'Hair Styling' }
        ],
        'Construction & Materials': [
            { value: 'General Contracting', label: 'General Contracting' },
            { value: 'Building Supplies', label: 'Building Supplies' },
            { value: 'Heavy Equipment', label: 'Heavy Equipment' },
            { value: 'Interior Design', label: 'Interior Design' },
            { value: 'Renovation', label: 'Renovation' },
            { value: 'Architecture', label: 'Architecture' }
        ],
        'Consultancy & Services': [
            { value: 'Business Consulting', label: 'Business Consulting' },
            { value: 'Legal Services', label: 'Legal Services' },
            { value: 'Financial Advisory', label: 'Financial Advisory' },
            { value: 'Marketing Agency', label: 'Marketing Agency' },
            { value: 'IT Consulting', label: 'IT Consulting' },
            { value: 'HR Services', label: 'HR Services' }
        ],
        'Retail & Shopping': [
            { value: 'Supermarket', label: 'Supermarket' },
            { value: 'Boutique', label: 'Boutique' },
            { value: 'Electronics', label: 'Electronics' },
            { value: 'Furniture', label: 'Furniture' },
            { value: 'Grocery', label: 'Grocery' },
            { value: 'Online Store', label: 'Online Store' }
        ],
        'Travel & Hospitality': [
            { value: 'Hotel', label: 'Hotel' },
            { value: 'Travel Agency', label: 'Travel Agency' },
            { value: 'Tour Guide', label: 'Tour Guide' },
            { value: 'Transportation', label: 'Transportation' },
            { value: 'Event Planning', label: 'Event Planning' },
            { value: 'Resort', label: 'Resort' }
        ],
        'Agriculture': [
            { value: 'Crop Farming', label: 'Crop Farming' },
            { value: 'Livestock', label: 'Livestock' },
            { value: 'Food Processing', label: 'Food Processing' },
            { value: 'Agricultural Equipment', label: 'Agricultural Equipment' },
            { value: 'Export', label: 'Export' },
            { value: 'Organic Farming', label: 'Organic Farming' }
        ],
        'Handicrafts': [
            { value: 'Carpets & Rugs', label: 'Carpets & Rugs' },
            { value: 'Pottery', label: 'Pottery' },
            { value: 'Embroidery', label: 'Embroidery' },
            { value: 'Woodwork', label: 'Woodwork' },
            { value: 'Metalwork', label: 'Metalwork' },
            { value: 'Jewelry Crafting', label: 'Jewelry Crafting' }
        ]
    };

    // Color psychology data
    const COLOR_PSYCHOLOGY = {
        '#6B21A8': { name: 'Purple', emotion: 'creativity, luxury, wisdom' },
        '#EAB308': { name: 'Gold', emotion: 'success, quality, prestige' },
        '#DC2626': { name: 'Red', emotion: 'energy, passion, urgency' },
        '#059669': { name: 'Green', emotion: 'growth, health, harmony' },
        '#2563EB': { name: 'Blue', emotion: 'trust, professionalism, calm' },
        '#EA580C': { name: 'Orange', emotion: 'enthusiasm, creativity, warmth' },
        '#0891B2': { name: 'Cyan', emotion: 'innovation, clarity, freshness' },
        '#BE185D': { name: 'Pink', emotion: 'compassion, nurturing, love' },
        '#4338CA': { name: 'Indigo', emotion: 'intuition, spirituality, depth' },
        '#000000': { name: 'Black', emotion: 'elegance, power, sophistication' }
    };

    let currentStep = 1;
    const totalSteps = 4;
    let logoFile = null;
    let logoBase64 = null;
    let formData = {};

    function init() {
        setupEventListeners();
        setupSubCategories();
        setupColorPickers();
        setupLogoUpload();
        setupCharacterCounters();
        setupFormNavigation();
        updateProgress();
    }

    function setupEventListeners() {
        // Form submission
        const form = document.getElementById('registerForm');
        if (form) {
            form.addEventListener('submit', handleSubmit);
        }

        // Category change
        const category = document.getElementById('category');
        if (category) {
            category.addEventListener('change', handleCategoryChange);
        }

        // Phone input formatting
        const phone = document.getElementById('contact_info');
        if (phone) {
            phone.addEventListener('input', formatPhoneInput);
        }
    }

    function setupSubCategories() {
        // Initial state - disabled
        const subCategorySelect = document.getElementById('sub_category');
        if (subCategorySelect) {
            subCategorySelect.disabled = true;
        }
    }

    function handleCategoryChange() {
        const category = document.getElementById('category').value;
        const subCategorySelect = document.getElementById('sub_category');
        const loadingIndicator = document.getElementById('subCategoryLoading');

        if (!category) {
            subCategorySelect.innerHTML = '<option value="">Select category first...</option>';
            subCategorySelect.disabled = true;
            return;
        }

        // Show loading
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
        }
        subCategorySelect.disabled = true;

        // Simulate async loading for better UX
        setTimeout(() => {
            const subCategories = SUB_CATEGORIES[category] || [];
            
            subCategorySelect.innerHTML = '<option value="">Select sub-category...</option>';
            
            subCategories.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub.value;
                option.textContent = sub.label;
                subCategorySelect.appendChild(option);
            });

            subCategorySelect.disabled = false;
            
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }

            // Add animation class
            subCategorySelect.classList.add('loaded');
            setTimeout(() => subCategorySelect.classList.remove('loaded'), 300);

        }, 300); // Small delay for perceived performance
    }

    function setupColorPickers() {
        const primaryText = document.getElementById('primary_brand_color');
        const primaryPicker = document.getElementById('primary_color_picker');
        const primaryPreview = document.getElementById('primaryColorPreview');
        const secondaryText = document.getElementById('secondary_brand_color');
        const secondaryPicker = document.getElementById('secondary_color_picker');
        const secondaryPreview = document.getElementById('secondaryColorPreview');

        // Primary color
        if (primaryPicker && primaryText && primaryPreview) {
            primaryPicker.addEventListener('input', (e) => {
                const color = e.target.value.toUpperCase();
                primaryText.value = color;
                primaryPreview.style.background = color;
                updateColorPsychology('primary', color);
            });

            primaryText.addEventListener('change', (e) => {
                let color = e.target.value.toUpperCase();
                if (/^#[0-9A-F]{6}$/.test(color)) {
                    primaryPicker.value = color;
                    primaryPreview.style.background = color;
                    updateColorPsychology('primary', color);
                }
            });
        }

        // Secondary color
        if (secondaryPicker && secondaryText && secondaryPreview) {
            secondaryPicker.addEventListener('input', (e) => {
                const color = e.target.value.toUpperCase();
                secondaryText.value = color;
                secondaryPreview.style.background = color;
                updateColorPsychology('secondary', color);
            });

            secondaryText.addEventListener('change', (e) => {
                let color = e.target.value.toUpperCase();
                if (/^#[0-9A-F]{6}$/.test(color)) {
                    secondaryPicker.value = color;
                    secondaryPreview.style.background = color;
                    updateColorPsychology('secondary', color);
                }
            });
        }

        // Suggest button
        const suggestBtn = document.getElementById('suggestSecondary');
        if (suggestBtn) {
            suggestBtn.addEventListener('click', () => {
                const primary = primaryPicker.value;
                const complementary = getComplementaryColor(primary);
                secondaryPicker.value = complementary;
                secondaryText.value = complementary.toUpperCase();
                document.getElementById('secondaryColorPreview').style.background = complementary;
                updateColorPsychology('secondary', complementary.toUpperCase());
                
                // Visual feedback
                suggestBtn.textContent = '✓ Applied';
                setTimeout(() => {
                    suggestBtn.textContent = 'Suggest Match';
                }, 1500);
            });
        }
    }

    function getComplementaryColor(hex) {
        const rgb = parseInt(hex.slice(1), 16);
        const r = (rgb >> 16) & 0xFF;
        const g = (rgb >> 8) & 0xFF;
        const b = rgb & 0xFF;
        
        // Simple complementary - invert and adjust for aesthetics
        const compR = 255 - r;
        const compG = 255 - g;
        const compB = 255 - b;
        
        return '#' + 
            Math.round((r + compR) / 2).toString(16).padStart(2, '0') +
            Math.round((g + compG) / 2).toString(16).padStart(2, '0') +
            Math.round((b + compB) / 2).toString(16).padStart(2, '0');
    }

    function updateColorPsychology(type, color) {
        const element = document.getElementById(type + 'Psychology');
        if (!element) return;

        const psychology = COLOR_PSYCHOLOGY[color] || 
            COLOR_PSYCHOLOGY[Object.keys(COLOR_PSYCHOLOGY).find(c => 
                Math.abs(parseInt(c.slice(1), 16) - parseInt(color.slice(1), 16)) < 500000
            )] || 
            { name: 'Custom', emotion: 'unique to your brand' };

        element.querySelector('span:last-child').textContent = 
            `${psychology.name} conveys ${psychology.emotion}`;
    }

    function setupLogoUpload() {
        const uploadZone = document.getElementById('logoUpload');
        const fileInput = document.getElementById('logo');
        const preview = document.getElementById('logoPreview');
        const removeBtn = document.getElementById('removeLogo');

        if (!uploadZone || !fileInput) return;

        // Click to upload
        uploadZone.addEventListener('click', () => fileInput.click());
        uploadZone.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInput.click();
            }
        });

        // Drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadZone.addEventListener(eventName, () => {
                uploadZone.classList.add('drag-active');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, () => {
                uploadZone.classList.remove('drag-active');
            }, false);
        });

        uploadZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length) handleLogoSelect(files[0]);
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) handleLogoSelect(e.target.files[0]);
        });

        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                resetLogo();
            });
        }
    }

    function handleLogoSelect(file) {
        // Validation
        if (!CONFIG.SUPPORTED_FORMATS.includes(file.type)) {
            showToast('Please upload PNG, JPG, or SVG file only.', 'error');
            return;
        }

        if (file.size > CONFIG.MAX_LOGO_SIZE) {
            showToast('Logo file too large. Maximum size is 2MB.', 'error');
            return;
        }

        logoFile = file;

        // Preview
        const reader = new FileReader();
        reader.onload = (e) => {
            logoBase64 = e.target.result;
            
            const img = new Image();
            img.onload = () => {
                document.getElementById('logoDimensions').textContent = 
                    `${img.naturalWidth}×${img.naturalHeight}px`;
            };
            img.src = logoBase64;

            document.getElementById('logoPreviewImg').src = logoBase64;
            document.getElementById('logoFileName').textContent = file.name;
            document.getElementById('logoFileSize').textContent = formatFileSize(file.size);
            
            document.getElementById('logoPreview').classList.add('show');
            document.getElementById('logoUpload').classList.add('has-file');
            document.getElementById('logo-error').classList.remove('show');
        };
        reader.readAsDataURL(file);
    }

    function resetLogo() {
        logoFile = null;
        logoBase64 = null;
        document.getElementById('logo').value = '';
        document.getElementById('logoPreview').classList.remove('show');
        document.getElementById('logoUpload').classList.remove('has-file');
        document.getElementById('logoDimensions').textContent = '';
    }

    function setupCharacterCounters() {
        const fields = ['key_usp_1', 'key_usp_2', 'ai_modification_notes'];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const counter = document.getElementById(fieldId.replace('key_usp_', 'usp').replace('ai_modification_notes', 'notes') + 'Count');
            
            if (field && counter) {
                field.addEventListener('input', () => {
                    counter.textContent = field.value.length;
                });
            }
        });
    }

    function setupFormNavigation() {
        // Next buttons
        document.querySelectorAll('.btn-next').forEach(btn => {
            btn.addEventListener('click', () => {
                const nextStep = parseInt(btn.dataset.next);
                if (validateStep(currentStep)) {
                    goToStep(nextStep);
                }
            });
        });

        // Previous buttons
        document.querySelectorAll('.btn-prev').forEach(btn => {
            btn.addEventListener('click', () => {
                const prevStep = parseInt(btn.dataset.prev);
                goToStep(prevStep);
            });
        });

        // Progress step clicks
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            step.addEventListener('click', () => {
                const targetStep = index + 1;
                if (targetStep < currentStep || validateStep(currentStep)) {
                    goToStep(targetStep);
                }
            });
        });
    }

    function goToStep(step) {
        // Hide current step
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
        
        // Show new step
        currentStep = step;
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('active');
        
        // Mark previous steps as completed
        for (let i = 1; i < currentStep; i++) {
            document.querySelector(`.progress-step[data-step="${i}"]`).classList.add('completed');
        }
        
        // Update progress lines
        document.querySelectorAll('.progress-line').forEach((line, index) => {
            if (index < currentStep - 1) {
                line.classList.add('completed');
            } else {
                line.classList.remove('completed');
            }
        });

        updateProgress();
        
        // Scroll to top of form
        document.getElementById('register').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function validateStep(step) {
        let valid = true;
        const stepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        
        // Required fields in this step
        const requiredFields = stepElement.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const errorEl = document.getElementById(field.id + '-error');
            
            if (!field.value.trim()) {
                field.classList.add('error');
                if (errorEl) errorEl.classList.add('show');
                valid = false;
            } else {
                field.classList.remove('error');
                if (errorEl) errorEl.classList.remove('show');
            }
        });

        // Special validation for logo on step 2
        if (step === 2 && !logoFile) {
            document.getElementById('logo-error').classList.add('show');
            valid = false;
        }

        if (!valid) {
            showToast('Please fill in all required fields', 'error');
        }

        return valid;
    }

    function updateProgress() {
        const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('progressBar').classList.add('visible');
    }

    function formatPhoneInput(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.startsWith('93')) {
            value = value.slice(2);
        }
        if (value.length > 9) {
            value = value.slice(0, 9);
        }
        
        // Format as 70 123 4567
        if (value.length >= 2) {
            value = value.slice(0, 2) + ' ' + value.slice(2);
        }
        if (value.length >= 6) {
            value = value.slice(0, 6) + ' ' + value.slice(6);
        }
        
        e.target.value = value.trim();
    }

    function updateSummary() {
        const summaryContent = document.getElementById('summaryContent');
        const fields = {
            'Brand': document.getElementById('client_name').value,
            'Category': document.getElementById('category').value,
            'Sub-category': document.getElementById('sub_category').value,
            'Primary Color': document.getElementById('primary_brand_color').value,
            'Language': document.getElementById('language_preference').value
        };

        summaryContent.innerHTML = Object.entries(fields)
            .map(([label, value]) => `
                <div class="summary-item">
                    <span class="summary-label">${label}:</span>
                    <span class="summary-value">${value || '-'}</span>
                </div>
            `).join('');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        if (!validateStep(4)) return;
        
        const btn = document.getElementById('submitBtn');
        const btnText = btn.querySelector('.btn-text');
        const spinner = btn.querySelector('.spinner');
        
        // Show loading
        btn.disabled = true;
        btnText.style.display = 'none';
        spinner.style.display = 'block';

        try {
            // Generate client ID
            const clientId = 'MSR-' + Date.now().toString(36).toUpperCase();
            
            // Collect all form data
            const formData = {
                client_id: clientId,
                client_name: document.getElementById('client_name').value.trim(),
                category: document.getElementById('category').value,
                sub_category: document.getElementById('sub_category').value,
                target_audience: document.getElementById('target_audience').value.trim(),
                primary_brand_color: document.getElementById('primary_brand_color').value.toUpperCase(),
                secondary_brand_color: document.getElementById('secondary_brand_color').value.toUpperCase(),
                font_preference: document.getElementById('font_preference').value,
                language_preference: document.getElementById('language_preference').value,
                key_usp_1: document.getElementById('key_usp_1').value.trim(),
                key_usp_2: document.getElementById('key_usp_2').value.trim(),
                current_offer_focus: document.getElementById('current_offer_focus').value.trim(),
                seasonal_theme: document.getElementById('seasonal_theme').value,
                ai_modification_notes: document.getElementById('ai_modification_notes').value.trim(),
                meta_page_id: document.getElementById('meta_page_id').value.trim(),
                contact_info: '+93 ' + document.getElementById('contact_info').value.trim(),
                request_sample: document.getElementById('request_sample').checked,
                submitted_at: new Date().toISOString(),
                source: 'maseer_portal_v3'
            };

            // Store for success page
            sessionStorage.setItem('maseer_registration', JSON.stringify({
                client_id: clientId,
                client_name: formData.client_name,
                request_sample: formData.request_sample
            }));

            // Build issue body
            const issueBody = buildIssueBody(formData, logoBase64);
            
            // Create GitHub Issue URL
            const title = encodeURIComponent(`New Registration: ${formData.client_name} [${clientId}]`);
            const body = encodeURIComponent(issueBody);
            const labels = encodeURIComponent('new-client,portal-registration,v3');
            
            const githubUrl = `https://github.com/${CONFIG.BACKEND_REPO}/issues/new?title=${title}&body=${body}&labels=${labels}`;

            // Check URL length
            if (githubUrl.length > CONFIG.MAX_URL_LENGTH) {
                // Store logo for separate upload
                sessionStorage.setItem('maseer_logo_base64', logoBase64);
                window.location.href = `upload-logo.html?brand=${encodeURIComponent(formData.client_name)}&id=${clientId}`;
                return;
            }

            // Success - redirect to GitHub
            window.location.href = githubUrl;

        } catch (error) {
            showToast('An error occurred. Please try again.', 'error');
            console.error('Submission error:', error);
            btn.disabled = false;
            btnText.style.display = 'block';
            spinner.style.display = 'none';
        }
    }

    function buildIssueBody(data, logoData) {
        const payload = {
            ...data,
            logo_included: !!logoData
        };

        let body = `## 🎯 New Registration via Maseer Portal

**Client ID:** ${data.client_id}
**Brand:** ${data.client_name}
**Submitted:** ${data.submitted_at}

### 📋 Complete Registration Data

\`\`\`json
${JSON.stringify(payload, null, 2)}
\`\`\``;

        if (logoData) {
            body += `

### 🎨 Logo Attachment

Logo is embedded in registration data.
`;
        }

        body += `

---

**Auto-Processing:** Sample video will be generated automatically upon issue creation.
**ETA:** 3-5 minutes after processing.

*Registered via [Maseer Portal](https://ad8ba-1011.github.io/maseer_portal/)*
*Questions: adeeb.yousofi12@gmail.com*`;

        return body;
    }

    function showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'show ' + type;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
