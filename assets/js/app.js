/**
 * Maseer Portal - Main Application
 * Handles form validation and GitHub Issue creation
 * LOGO UPLOAD: Two-step process (form first, logo in comment)
 */

const CONFIG = {
    BACKEND_REPO: 'Ad8bA-1011/maseer_automation',
    MAX_LOGO_SIZE: 2 * 1024 * 1024, // 2MB
    ALLOWED_LOGO_TYPES: ['image/png', 'image/jpeg', 'image/svg+xml'],
    ALLOWED_EXTENSIONS: ['.png', '.jpg', '.jpeg', '.svg']
};

// Store logo temporarily for two-step upload
let pendingLogo = null;
let pendingLogoData = null;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const logoInput = document.getElementById('logo');
    const fileLabel = document.querySelector('.file-input-label');
    
    // File input handling
    if (logoInput && fileLabel) {
        logoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            
            if (!file) {
                fileLabel.classList.remove('file-selected');
                fileLabel.textContent = fileLabel.dataset.original || '📎 Click to upload logo (PNG/JPG/SVG, max 2MB)';
                pendingLogo = null;
                pendingLogoData = null;
                return;
            }
            
            // Store original text
            if (!fileLabel.dataset.original) {
                fileLabel.dataset.original = fileLabel.textContent;
            }
            
            // Validate
            const error = validateLogo(file);
            if (error) {
                showError('logo-error', error);
                logoInput.value = '';
                return;
            }
            
            clearError('logo-error');
            
            // Store for later upload
            pendingLogo = file;
            
            // Convert to base64 for preview/storage
            fileToBase64(file).then(base64 => {
                pendingLogoData = base64;
                
                // Show selected
                fileLabel.classList.add('file-selected');
                fileLabel.innerHTML = `✓ ${escapeHtml(file.name)} (${formatFileSize(file.size)})<br>
                    <small style="color: var(--secondary);">Will be uploaded after form submission</small>`;
            });
        });
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            // Validate
            const errors = validateForm(form);
            if (errors.length > 0) {
                alert('Please fix the following errors:\n\n• ' + errors.join('\n• '));
                return;
            }
            
            // Show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Preparing submission...';
            
            try {
                // Build issue body (WITHOUT logo base64 - too large for URL)
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Build issue
                const title = `New Registration: ${escapeHtml(data.brand_name)}`;
                const body = buildIssueBody(data, !!pendingLogo);
                
                // Check URL length
                const githubUrl = new URL(`https://github.com/${CONFIG.BACKEND_REPO}/issues/new`);
                githubUrl.searchParams.set('title', title);
                githubUrl.searchParams.set('body', body);
                githubUrl.searchParams.set('labels', 'new-client,portal-registration');
                
                const urlLength = githubUrl.toString().length;
                console.log('GitHub URL length:', urlLength);
                
                if (urlLength > 7500) {
                    throw new Error('Form data too large. Please reduce text in descriptions.');
                }
                
                // If we have a logo, store it in sessionStorage for the next step
                if (pendingLogo && pendingLogoData) {
                    sessionStorage.setItem('maseer_pending_logo', pendingLogoData);
                    sessionStorage.setItem('maseer_pending_brand', data.brand_name);
                    sessionStorage.setItem('maseer_logo_filename', pendingLogo.name);
                }
                
                // Open GitHub issue creation in new tab
                window.open(githubUrl.toString(), '_blank');
                
                // Redirect to intermediate page that handles logo upload instructions
                window.location.href = 'upload-logo.html';
                
            } catch (err) {
                console.error('Submission error:', err);
                alert('Error: ' + err.message);
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});

function validateLogo(file) {
    // Check size
    if (file.size > CONFIG.MAX_LOGO_SIZE) {
        return `Logo is too large (${formatFileSize(file.size)}). Maximum size is 2MB.`;
    }
    
    // Check type
    if (!CONFIG.ALLOWED_LOGO_TYPES.includes(file.type)) {
        return `Invalid file type (${file.type}). Please use PNG, JPG, or SVG.`;
    }
    
    // Check extension
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!CONFIG.ALLOWED_EXTENSIONS.includes(ext)) {
        return `Invalid file extension (${ext}). Please use .png, .jpg, .jpeg, or .svg.`;
    }
    
    return null;
}

function validateForm(form) {
    const errors = [];
    const data = new FormData(form);
    
    const brandName = data.get('brand_name');
    if (!brandName || brandName.length < 2) {
        errors.push('Brand name must be at least 2 characters');
    } else if (brandName.length > 50) {
        errors.push('Brand name must be under 50 characters');
    } else if (!/^[\w\s\-&]+$/.test(brandName)) {
        errors.push('Brand name contains invalid characters (only letters, numbers, spaces, hyphens, and & allowed)');
    }
    
    if (!data.get('industry')) {
        errors.push('Please select an industry');
    }
    
    const primaryColor = data.get('primary_color');
    if (!primaryColor || !/^#[0-9A-Fa-f]{6}$/.test(primaryColor)) {
        errors.push('Primary color must be a valid hex code (e.g., #6B21A8)');
    }
    
    const termsDaily = form.querySelector('#terms_daily');
    if (termsDaily && !termsDaily.checked) {
        errors.push('You must agree to receive daily videos');
    }
    
    // WhatsApp validation (if provided)
    const contact = data.get('contact_info');
    if (contact && contact.trim()) {
        // Basic Afghan phone validation
        const cleaned = contact.replace(/\s/g, '');
        if (!/^(\+93|0093)?[0-9]{9,10}$/.test(cleaned)) {
            errors.push('WhatsApp number appears invalid (expected format: +93 70 123 4567)');
        }
    }
    
    return errors;
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

function buildIssueBody(data, hasLogoPending) {
    const payload = {
        brand_name: data.brand_name,
        local_name: data.local_name || '',
        industry: data.industry,
        primary_color: data.primary_color,
        secondary_color: data.secondary_color || '#EAB308',
        key_offerings: truncateText(data.key_offerings || '', 500),
        target_audience: truncateText(data.target_audience || '', 200),
        contact_info: data.contact_info || '',
        facebook_page: data.facebook_page || '',
        request_sample: data.request_sample === 'on',
        has_logo_pending: hasLogoPending,  // Flag for backend
        submitted_at: new Date().toISOString(),
        source: 'maseer_portal',
        portal_version: '2.0.0'
    };
    
    let body = `## 🎯 New Registration via Maseer Portal

**Brand:** ${payload.brand_name}
**Industry:** ${payload.industry}
**Submitted:** ${payload.submitted_at}

### Brand Details
\`\`\`json
${JSON.stringify(payload, null, 2)}
\`\`\`
`;

    if (hasLogoPending) {
        body += `
---

### 📎 Logo Upload Required

**⚠️ IMPORTANT:** Please reply to this issue with your logo attached.

**Instructions:**
1. Click "Comment" below
2. Drag and drop your logo file, OR click to upload
3. Supported formats: PNG, JPG, SVG (max 2MB)
4. Once uploaded, your sample video will be generated automatically

**Expected filename format:** \`${payload.brand_name.replace(/\s+/g, '_')}_logo.png\`
`;
    }
    
    body += `

---

*This issue was automatically generated by the [Maseer Portal](https://Ad8bA-1011.github.io/maseer_portal/)*.
*Backend processing begins automatically after logo upload (if required).*`;
    
    return body;
}

// Utility functions
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.classList.add('visible');
    }
}

function clearError(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = '';
        el.classList.remove('visible');
    }
}
