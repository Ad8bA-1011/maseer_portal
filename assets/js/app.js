/**
 * Maseer Portal - Main Application
 * Handles form submission to GitHub Issues
 */

// Configuration
const CONFIG = {
    BACKEND_REPO: 'Ad8bA-1011/maseer_automation',
    MAX_LOGO_SIZE: 2 * 1024 * 1024, // 2MB
    ALLOWED_LOGO_TYPES: ['image/png', 'image/jpeg', 'image/svg+xml']
};

// Form validation
function validateForm(formData) {
    const errors = [];
    
    const brandName = formData.get('brand_name');
    if (!brandName || brandName.length < 2) {
        errors.push('Brand name must be at least 2 characters');
    }
    if (brandName && !/^[\w\s\-&]+$/.test(brandName)) {
        errors.push('Brand name contains invalid characters');
    }
    
    const industry = formData.get('industry');
    if (!industry) {
        errors.push('Please select an industry');
    }
    
    const primaryColor = formData.get('primary_color');
    if (!primaryColor || !/^#[0-9A-Fa-f]{6}$/.test(primaryColor)) {
        errors.push('Primary color must be valid hex (e.g., #6B21A8)');
    }
    
    return errors;
}

// Logo validation
function validateLogo(file) {
    if (!file) return null;
    
    if (file.size > CONFIG.MAX_LOGO_SIZE) {
        return 'Logo must be under 2MB';
    }
    
    if (!CONFIG.ALLOWED_LOGO_TYPES.includes(file.type)) {
        return 'Logo must be PNG, JPG, or SVG';
    }
    
    return null;
}

// Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Submit registration to GitHub
async function submitRegistration(formData, logoBase64 = null) {
    const payload = {
        brand_name: formData.get('brand_name'),
        local_name: formData.get('local_name') || '',
        industry: formData.get('industry'),
        primary_color: formData.get('primary_color'),
        secondary_color: formData.get('secondary_color') || '#EAB308',
        target_audience: formData.get('target_audience') || '',
        key_offerings: formData.get('key_offerings') || '',
        contact_info: formData.get('contact_info') || '',
        facebook_page: formData.get('facebook_page') || '',
        request_sample: true,
        logo_base64: logoBase64
    };
    
    const issueBody = `New Registration: ${payload.brand_name}\n\n\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\``;
    
    // Note: In production, this should call a backend endpoint or use GitHub API with PAT
    // For security, the actual submission should not expose PAT_TOKEN in frontend
    // Instead, use a serverless function or the backend's issue creation endpoint
    
    console.log('Registration payload:', payload);
    
    // Simulate success - replace with actual API call
    return { success: true, issueNumber: 'TBD' };
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        
        // Validate
        const errors = validateForm(formData);
        if (errors.length > 0) {
            alert('Please fix errors:\n' + errors.join('\n'));
            return;
        }
        
        // Handle logo
        const logoFile = formData.get('logo');
        let logoBase64 = null;
        
        if (logoFile && logoFile.size > 0) {
            const logoError = validateLogo(logoFile);
            if (logoError) {
                alert(logoError);
                return;
            }
            logoBase64 = await fileToBase64(logoFile);
        }
        
        // Submit
        try {
            const result = await submitRegistration(formData, logoBase64);
            if (result.success) {
                window.location.href = 'success.html';
            }
        } catch (err) {
            alert('Submission failed: ' + err.message);
        }
    });
});
