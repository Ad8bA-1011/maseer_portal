const CONFIG = {
    BACKEND_REPO: 'Ad8bA-1011/maseer_automation',
    MAX_LOGO_SIZE: 2 * 1024 * 1024,
    SUPPORTED_FORMATS: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']
};

// Get token from injected config (only exists in production build)
const getToken = () => {
    if (typeof window.GITHUB_CONFIG !== 'undefined') {
        return window.GITHUB_CONFIG.token;
    }
    // Development fallback - shows error
    return null;
};

const App = (function() {
    'use strict';
    
    let logoFile = null;
    let isSubmitting = false;
    
    function init() {
        setupEventListeners();
        setupValidation();
        
        // Check if running locally (no token)
        if (!getToken()) {
            console.log('Development mode: GitHub token not available');
        }
    }
    
    function setupEventListeners() {
        const form = document.getElementById('registrationForm');
        if (form) {
            form.addEventListener('submit', handleSubmit);
        }
        
        const logoInput = document.getElementById('logoInput');
        const uploadZone = document.getElementById('uploadZone');
        
        if (logoInput) {
            logoInput.addEventListener('change', handleFileSelect);
        }
        
        if (uploadZone) {
            uploadZone.addEventListener('click', () => logoInput?.click());
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
                if (e.dataTransfer.files.length) {
                    processFile(e.dataTransfer.files[0]);
                }
            });
        }
        
        // Color picker sync
        const primaryInput = document.getElementById('primaryColor');
        const primaryPicker = document.getElementById('primaryColorPicker');
        if (primaryInput && primaryPicker) {
            primaryPicker.addEventListener('input', (e) => {
                primaryInput.value = e.target.value.toUpperCase();
            });
        }
    }
    
    function setupValidation() {
        const inputs = document.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearError(input));
        });
    }
    
    function validateField(field) {
        const value = field.value.trim();
        if (!value) {
            showFieldError(field, 'This field is required');
            return false;
        }
        if (field.id === 'primaryColor' && !/^#[0-9A-F]{6}$/i.test(value)) {
            showFieldError(field, 'Invalid hex color');
            return false;
        }
        clearError(field);
        return true;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        let errorEl = field.parentElement.querySelector('.field-error');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'field-error';
            field.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = message;
    }
    
    function clearError(field) {
        field.classList.remove('error');
        const errorEl = field.parentElement.querySelector('.field-error');
        if (errorEl) errorEl.remove();
    }
    
    function handleFileSelect(e) {
        if (e.target.files[0]) processFile(e.target.files[0]);
    }
    
    function processFile(file) {
        if (!CONFIG.SUPPORTED_FORMATS.includes(file.type)) {
            showToast('Please upload PNG, JPG, or SVG', 'error');
            return;
        }
        if (file.size > CONFIG.MAX_LOGO_SIZE) {
            showToast('Logo must be under 2MB', 'error');
            return;
        }
        
        logoFile = file;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('filePreview');
            if (preview) {
                document.getElementById('previewImg').src = e.target.result;
                document.getElementById('fileName').textContent = file.name;
                document.getElementById('fileSize').textContent = formatFileSize(file.size);
                preview.classList.add('show');
            }
            const uploadZone = document.getElementById('uploadZone');
            if (uploadZone) uploadZone.classList.add('has-file');
        };
        reader.readAsDataURL(file);
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    async function handleSubmit(e) {
        e.preventDefault();
        if (isSubmitting) return;
        
        const required = ['brandName', 'industry', 'primaryColor', 'facebookPage'];
        let valid = true;
        required.forEach(id => {
            const field = document.getElementById(id);
            if (field && !validateField(field)) valid = false;
        });
        if (!valid) {
            showToast('Please fill all required fields', 'error');
            return;
        }
        
        const token = getToken();
        if (!token) {
            // Development mode - use email fallback
            const data = await gatherFormData();
            const emailBody = `New Maseer Registration

Brand: ${data.brand_name}
Local Name: ${data.local_name || 'N/A'}
Industry: ${data.industry}
Primary Color: ${data.primary_color}
Secondary Color: ${data.secondary_color}
Facebook: ${data.facebook_page}
Contact: ${data.contact_info}
Target: ${data.target_audience}
Offerings: ${data.key_offerings}

JSON:
${JSON.stringify(data, null, 2)}`;

            window.location.href = `mailto:maseer.ac.ap@gmail.com?subject=New Registration: ${data.brand_name}&body=${encodeURIComponent(emailBody)}`;
            sessionStorage.setItem('maseer_registration', JSON.stringify({ brand_name: data.brand_name }));
            window.location.href = 'success.html';
            return;
        }
        
        isSubmitting = true;
        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Submitting...';
        
        try {
            const data = await gatherFormData();
            const result = await createGitHubIssue(data, token);
            
            if (result.success) {
                sessionStorage.setItem('maseer_registration', JSON.stringify({
                    brand_name: data.brand_name,
                    issue_number: result.issue_number
                }));
                window.location.href = 'success.html';
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error(error);
            showToast(error.message, 'error');
            isSubmitting = false;
            btn.disabled = false;
            btn.innerHTML = 'Generate My Sample Video';
        }
    }
    
    async function gatherFormData() {
        const data = {
            brand_name: document.getElementById('brandName').value.trim(),
            local_name: document.getElementById('localName').value.trim(),
            industry: document.getElementById('industry').value,
            primary_color: document.getElementById('primaryColor').value.toUpperCase(),
            secondary_color: document.getElementById('secondaryColor').value.toUpperCase() || '#EAB308',
            target_audience: document.getElementById('targetAudience').value.trim(),
            key_offerings: document.getElementById('keyOfferings').value.trim(),
            contact_info: document.getElementById('contact').value.trim(),
            facebook_page: document.getElementById('facebookPage').value.trim(),
            request_sample: true
        };
        
        if (logoFile) {
            data.logo_base64 = await fileToBase64(logoFile);
        }
        
        return data;
    }
    
    async function createGitHubIssue(data, token) {
        const issueBody = `## New Registration: ${data.brand_name}

**Submitted:** ${new Date().toISOString()}

### Brand Information
| Field | Value |
|-------|-------|
| **Brand Name** | ${data.brand_name} |
| **Local Name** | ${data.local_name || 'N/A'} |
| **Industry** | ${data.industry} |
| **Facebook** | ${data.facebook_page} |

### Visual Identity
| Field | Value |
|-------|-------|
| **Primary Color** | ${data.primary_color} |
| **Secondary Color** | ${data.secondary_color} |

### Marketing Details
| Field | Value |
|-------|-------|
| **Target Audience** | ${data.target_audience || 'N/A'} |
| **Key Offerings** | ${data.key_offerings || 'N/A'} |
| **Contact** | ${data.contact_info || 'N/A'} |

### Raw Data
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\``;

        const response = await fetch(`https://api.github.com/repos/${CONFIG.BACKEND_REPO}/issues`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: `New Registration: ${data.brand_name}`,
                body: issueBody,
                labels: ['new-client', 'pending']
            })
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || `GitHub error: ${response.status}`);
        }
        
        const issueData = await response.json();
        
        return {
            success: true,
            issue_number: issueData.number,
            issue_url: issueData.html_url
        };
    }
    
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    
    function showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (!toast) {
            alert(message);
            return;
        }
        toast.textContent = message;
        toast.className = `alert alert-${type} show`;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 5000);
    }
    
    return {
        init,
        removeFile: function() {
            logoFile = null;
            const preview = document.getElementById('filePreview');
            const uploadZone = document.getElementById('uploadZone');
            const input = document.getElementById('logoInput');
            if (preview) preview.classList.remove('show');
            if (uploadZone) uploadZone.classList.remove('has-file');
            if (input) input.value = '';
        }
    };
})();

document.addEventListener('DOMContentLoaded', App.init);
