/**
 * Maseer Consciousness System
 * Subtle engagement tracking
 */

const ConsciousnessSystem = (function() {
    'use strict';
    
    let scrollVelocity = 0;
    let lastScrollY = 0;
    
    function init() {
        setupScrollTracking();
        setupFormEngagement();
    }
    
    function setupScrollTracking() {
        window.addEventListener('scroll', () => {
            const currentY = window.scrollY;
            scrollVelocity = Math.abs(currentY - lastScrollY);
            lastScrollY = currentY;
        }, { passive: true });
    }
    
    function setupFormEngagement() {
        const form = document.getElementById('registrationForm');
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, select');
        let filledCount = 0;
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                document.body.style.setProperty('--glow-intensity', '0.8');
            });
            
            input.addEventListener('blur', () => {
                document.body.style.setProperty('--glow-intensity', '0.5');
            });
            
            input.addEventListener('input', () => {
                const filled = Array.from(inputs).filter(i => i.value).length;
                const progress = filled / inputs.length;
                
                // Subtle background pulse based on progress
                const intensity = 0.5 + (progress * 0.3);
                document.body.style.setProperty('--glow-intensity', intensity);
            });
        });
    }
    
    return { init };
})();

document.addEventListener('DOMContentLoaded', ConsciousnessSystem.init);
