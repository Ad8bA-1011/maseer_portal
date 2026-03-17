/**
 * Maseer Portal Configuration v5
 * 
 * SECURITY: This is a FINE-GRAINED PAT with LIMITED scope:
 * - Repository: Ad8bA-1011/maseer_automation ONLY
 * - Permissions: Actions (read/write), Issues (read/write)
 * - CANNOT: Read code, modify files, access secrets, delete repo
 * 
 * If exposed, attacker can only create spam issues (annoying but not harmful)
 * Rotate token at: https://github.com/settings/personal-access-tokens
 */

const CONFIG = {
    // Backend repository
    BACKEND_REPO: 'Ad8bA-1011/maseer_automation',
    GITHUB_API_BASE: 'https://api.github.com',
    
    /**
     * FINE-GRAINED PERSONAL ACCESS TOKEN
     * Generate at: https://github.com/settings/personal-access-tokens/new
     * Required permissions:
     *   - Repository: Ad8bA-1011/maseer_automation
     *   - Actions: Read and write
     *   - Issues: Read and write
     * 
     * REPLACE THE LINE BELOW WITH YOUR ACTUAL TOKEN
     */
    PUBLIC_WORKFLOW_TOKEN: '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',
    
    // Validation
    MAX_LOGO_SIZE: 2 * 1024 * 1024,
    MAX_URL_LENGTH: 7000,
    SUPPORTED_FORMATS: ['image/png', 'image/jpeg', 'image/svg+xml'],
    
    // Features
    ENABLE_API_SUBMISSION: true,
    ENABLE_FALLBACK_REDIRECT: true,
    
    // Workflow IDs
    WORKFLOW_REGISTRATION: 'submit-registration.yml',
    WORKFLOW_SAMPLE: 'generate-sample.yml'
};

// Validate
if (!CONFIG.PUBLIC_WORKFLOW_TOKEN || 
    CONFIG.PUBLIC_WORKFLOW_TOKEN === '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') {
    console.warn('PUBLIC_WORKFLOW_TOKEN not configured. API submission disabled.');
    CONFIG.ENABLE_API_SUBMISSION = false;
}

export default CONFIG;
