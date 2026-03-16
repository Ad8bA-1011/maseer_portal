/**
 * Maseer Portal - Main Application Logic
 * Handles form submission with logo upload to GitHub Issues
 */

const App = (function() {
    'use strict';

    const CONFIG = {
        BACKEND_REPO: 'Ad8bA-1011/maseer_automation',
        MAX_LOGO_SIZE: 2 * 1024 * 1024, // 2MB
        MAX_URL_LENGTH: 7000,
        SUPPORTED_FORMATS: ['image/png', 'image/jpeg', 'image/svg+xml']
    };

    let logoFile = null;
    let logoBase64 = null;

    function init() {
        setupEventListeners();
        setupSubCategories();
        setupLogoUpload();
        setupColorPickers();
    }

    function setupEventListeners() {
        const form = document.getElementById('registerForm');
        if (form) {
            form.addEventListener('submit', handleSubmit);
        }

        // Category change updates sub-categories
        const category = document.getElementById('category');
        if (category) {
            category.addEventListener('change', updateSubCategories);
        }
    }

    function setupSubCategories() {
        const subCategories = {
            'Jewelry & Gold': ['Traditional Gold', 'Modern Jewelry', 'Wedding Collection', 'Custom Design'],
            'Café & Restaurant': ['Fast Food', 'Fine Dining', 'Café', 'Bakery', 'Traditional Cuisine'],
            'Fashion & Clothing': ['Men\'s Wear', 'Women\'s Wear', 'Children', 'Traditional', 'Modern'],
            'Technology & IT': ['Software', 'Hardware', 'Services', 'Consulting', 'Repair'],
            'Healthcare & Medical': ['Clinic', 'Pharmacy', 'Medical Equipment', 'Wellness', 'Laboratory'],
            'Education & Training': ['School', 'University', 'Vocational', 'Online Courses', 'Tutoring'],
            'Real Estate': ['Residential', 'Commercial', 'Land', 'Property Management', 'Construction'],
            'Automotive': ['Sales', 'Repair', 'Parts', 'Rental', 'Detailing'],
            'Beauty & Cosmetics': ['Salon', 'Spa', 'Products', 'Makeup', 'Skincare'],
            'Construction & Materials': ['Contracting', 'Supplies', 'Equipment', 'Design', 'Renovation'],
            'Consultancy & Services': ['Business', 'Legal', 'Financial', 'Marketing', 'IT'],
            'Retail & Shopping': ['Supermarket', 'Boutique', 'Electronics', 'Furniture', 'Grocery'],
            'Travel & Hospitality': ['Hotel', 'Travel Agency', 'Tour Guide', 'Transport', 'Events'],
            'Agriculture': ['Farming', 'Livestock', 'Processing', 'Equipment', 'Export'],
            'Handicrafts': ['Carpets', 'Pottery', 'Embroidery', 'Woodwork', 'Metalwork']
        };

        window.updateSubCategories = function() {
            const category = document.getElementById('category').value;
            const subSelect = document.getElementById('sub_category');
            
            subSelect.innerHTML = '<option value="">Select sub-category...</option>';
            subSelect.disabled = !category;
            
            if (category && subCategories[category]) {
                subCategories[category].forEach(sub => {
                    const option = document.createElement('option');
                    option.value = sub;
                    option.textContent = sub;
                    subSelect.appendChild(option);
                });
            }
        };
    }

    function setupLogoUpload() {
        const uploadZone = document.getElementById('logoUpload');
        const fileInput = document.getElementById('logo');
        const preview = document.getElementById('logoPreview');
        const removeBtn = document.getElementById('removeLogo');

        if (!uploadZone || !fileInput) return;

        uploadZone.addEventListener('click', () => fileInput.click());

        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('drag-active');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('drag-active');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('drag-active');
            const files = e.dataTransfer.files;
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
            showError('Please upload PNG, JPG, or SVG file only.');
            return;
        }

        if (file.size > CONFIG.MAX_LOGO_SIZE) {
            showError('Logo file too large. Maximum size is 2MB.');
            return;
        }

        logoFile = file;

        // Preview
        const reader = new FileReader();
        reader.onload = (e) => {
            logoBase64 = e.target.result;
            const preview = document.getElementById('logoPreview');
            const img = document.getElementById('logoPreviewImg');
            const name = document.getElementById('logoFileName');
            const size = document.getElementById('logoFileSize');

            img.src = logoBase64;
            name.textContent = file.name;
            size.textContent = formatFileSize(file.size);
            preview.classList.add('show');
            
            document.getElementById('logoUpload').classList.add('has-file');
        };
        reader.readAsDataURL(file);
    }

    function resetLogo() {
        logoFile = null;
        logoBase64 = null;
        document.getElementById('logo').value = '';
        document.getElementById('logoPreview').classList.remove('show');
        document.getElementById('logoUpload').classList.remove('has-file');
    }

    function setupColorPickers() {
        const primaryText = document.getElementById('primary_brand_color');
        const primaryPicker = document.getElementById('primary_color_picker');
        const secondaryText = document.getElementById('secondary_brand_color');
        const secondaryPicker = document.getElementById('secondary_color_picker');

        if (primaryText && primaryPicker) {
            primaryPicker.addEventListener('input', (e) => {
                primaryText.value = e.target.value.toUpperCase();
            });
            primaryText.addEventListener('change', (e) => {
                if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    primaryPicker.value = e.target.value;
                }
            });
        }

        if (secondaryText && secondaryPicker) {
            secondaryPicker.addEventListener('input', (e) => {
                secondaryText.value = e.target.value.toUpperCase();
            });
            secondaryText.addEventListener('change', (e) => {
                if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    secondaryPicker.value = e.target.value;
                }
            });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        const btn = document.getElementById('submitBtn');
        const originalText = btn.innerHTML;
        
        // Validation
        if (!validateForm()) return;

        // Show loading
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Processing...';

        try {
            // Generate client ID
            const clientId = 'MSR-' + Date.now().toString(36).toUpperCase();
            
            // Collect form data
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
                contact_info: document.getElementById('contact_info').value.trim(),
                request_sample: document.getElementById('request_sample').checked,
                submitted_at: new Date().toISOString(),
                source: 'maseer_portal_v2'
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
            const labels = encodeURIComponent('new-client,portal-registration,v2');
            
            const githubUrl = `https://github.com/${CONFIG.BACKEND_REPO}/issues/new?title=${title}&body=${body}&labels=${labels}`;

            // Check URL length
            if (githubUrl.length > CONFIG.MAX_URL_LENGTH) {
                // If too long, create issue without logo base64, upload logo separately
                const shortBody = buildIssueBody(formData, null);
                const shortUrl = `https://github.com/${CONFIG.BACKEND_REPO}/issues/new?title=${title}&body=${encodeURIComponent(shortBody)}&labels=${labels}`;
                
                sessionStorage.setItem('maseer_logo_base64', logoBase64);
                window.location.href = `upload-logo.html?brand=${encodeURIComponent(formData.client_name)}&id=${clientId}`;
                return;
            }

            // Redirect to GitHub
            window.location.href = githubUrl;

        } catch (error) {
            showError('An error occurred. Please try again.');
            console.error('Submission error:', error);
            btn.disabled = false;
            btn.innerHTML = originalText;
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

**Logo Base64:** \`${logoData.substring(0, 100)}...\` (truncated)

**Instructions:** Logo is embedded in this issue. Please process via update_clients.py.
`;
        } else {
            body += `

### 📎 Logo Upload Required

**⚠️ Logo not included in this issue (size limit).**

Please upload logo as a comment to this issue:
1. Click "Comment" below
2. Attach logo file (PNG/JPG/SVG, max 2MB)
3. Post comment

System will auto-detect and process.`;
        }

        body += `

---

**Auto-Processing:** Sample video will be generated automatically upon issue creation.
**ETA:** 3-5 minutes after logo processing.

*Registered via [Maseer Portal](https://ad8ba-1011.github.io/maseer_portal/)*
*Questions: adeeb.yousofi12@gmail.com*`;

        return body;
    }

    function validateForm() {
        const required = ['client_name', 'category', 'sub_category', 'target_audience', 'key_usp_1', 'contact_info'];
        let valid = true;

        required.forEach(field => {
            const el = document.getElementById(field);
            if (!el || !el.value.trim()) {
                el?.classList.add('error');
                valid = false;
            } else {
                el?.classList.remove('error');
            }
        });

        if (!logoFile) {
            showError('Please upload your brand logo.');
            valid = false;
        }

        if (!document.getElementById('terms').checked) {
            showError('Please accept the terms to continue.');
            valid = false;
        }

        return valid;
    }

    function showError(message) {
        const alert = document.getElementById('errorAlert');
        alert.textContent = message;
        alert.classList.add('show');
        setTimeout(() => alert.classList.remove('show'), 5000);
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
