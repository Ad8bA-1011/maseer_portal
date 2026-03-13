/**
 * Color Picker Utilities for Maseer Portal
 */

const ColorTools = (function() {
    'use strict';

    const COLOR_PSYCHOLOGY = {
        '#D4AF37': { name: 'Gold', emotion: 'Luxury, Success', industries: ['Jewelry', 'Premium'] },
        '#8B4513': { name: 'Brown', emotion: 'Reliability', industries: ['Food', 'Crafts'] },
        '#FF6B6B': { name: 'Coral', emotion: 'Energy', industries: ['Fashion', 'Beauty'] },
        '#00D9FF': { name: 'Cyan', emotion: 'Innovation', industries: ['Tech', 'Healthcare'] },
        '#00A86B': { name: 'Jade', emotion: 'Health', industries: ['Medical', 'Wellness'] },
        '#4169E1': { name: 'Royal Blue', emotion: 'Trust', industries: ['Education', 'Finance'] },
        '#FF1493': { name: 'Pink', emotion: 'Passion', industries: ['Beauty', 'Fashion'] },
        '#6B21A8': { name: 'Purple', emotion: 'Creativity', industries: ['Creative', 'Premium'] }
    };

    function hexToHSL(hex) {
        let r = parseInt(hex.slice(1, 3), 16) / 255;
        let g = parseInt(hex.slice(3, 5), 16) / 255;
        let b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
    }

    function getComplementary(hex) {
        const hsl = hexToHSL(hex);
        hsl.h = (hsl.h + 180) % 360;
        return hslToHex(hsl.h, hsl.s, hsl.l);
    }

    function getPsychology(hex) {
        let closest = null;
        let minDistance = Infinity;
        
        for (const [color, data] of Object.entries(COLOR_PSYCHOLOGY)) {
            const distance = colorDistance(hex, color);
            if (distance < minDistance) {
                minDistance = distance;
                closest = { hex: color, ...data };
            }
        }
        return closest;
    }

    function colorDistance(hex1, hex2) {
        const rgb1 = hexToRGB(hex1);
        const rgb2 = hexToRGB(hex2);
        return Math.sqrt(
            Math.pow(rgb1[0] - rgb2[0], 2) +
            Math.pow(rgb1[1] - rgb2[1], 2) +
            Math.pow(rgb1[2] - rgb2[2], 2)
        );
    }

    function hexToRGB(hex) {
        return [
            parseInt(hex.slice(1, 3), 16),
            parseInt(hex.slice(3, 5), 16),
            parseInt(hex.slice(5, 7), 16)
        ];
    }

    function applyHarmony(primaryHex) {
        const secondary = getComplementary(primaryHex);
        const secondaryInput = document.getElementById('secondaryColor');
        const secondaryPicker = document.getElementById('secondaryColorPicker');
        
        if (secondaryInput && !secondaryInput.value) {
            secondaryInput.value = secondary;
            if (secondaryPicker) secondaryPicker.value = secondary;
        }
    }

    return {
        getComplementary,
        getPsychology,
        applyHarmony
    };
})();

// Auto-apply on primary color change
document.addEventListener('DOMContentLoaded', () => {
    const primaryInput = document.getElementById('primaryColor');
    if (primaryInput) {
        primaryInput.addEventListener('change', (e) => {
            if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                ColorTools.applyHarmony(e.target.value.toUpperCase());
            }
        });
    }
});
