/**
 * Maseer Consciousness System
 * Anonymous engagement tracking with consent
 */

const ConsciousnessSystem = (function() {
    'use strict';
    
    let scrollVelocity = 0;
    let lastScrollY = 0;
    let hasConsent = false;
    
    function init() {
        // Check for consent (user must interact with form)
        const form = document.getElementById('registerForm');
        if (!form) return;
        
        // Only track after user starts interacting
        form.addEventListener('focusin', grantConsent, { once: true });
        
        setupScrollTracking();
        setupFormEngagement();
    }
    
    function grantConsent() {
        hasConsent = true;
        console.log('[Maseer] Engagement tracking active (consent granted)');
    }
    
    function setupScrollTracking() {
        window.addEventListener('scroll', () => {
            if (!hasConsent) return;
            
            const currentY = window.scrollY;
            scrollVelocity = Math.abs(currentY - lastScrollY);
            lastScrollY = currentY;
        }, { passive: true });
    }
    
    function setupFormEngagement() {
        const form = document.getElementById('registerForm');
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (!hasConsent) return;
                document.body.style.setProperty('--glow-intensity', '0.8');
            });
            
            input.addEventListener('blur', () => {
                if (!hasConsent) return;
                document.body.style.setProperty('--glow-intensity', '0.5');
            });
            
            input.addEventListener('input', () => {
                if (!hasConsent) return;
                
                const filled = Array.from(inputs).filter(i => i.value).length;
                const progress = filled / inputs.length;
                
                const intensity = 0.5 + (progress * 0.3);
                document.body.style.setProperty('--glow-intensity', intensity);
            });
        });
    }
    
    return { init };
})();

document.addEventListener('DOMContentLoaded', ConsciousnessSystem.init);
