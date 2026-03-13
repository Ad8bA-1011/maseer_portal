/**
 * Maseer I18n System - English, Persian/Dari, Pashto
 */

const I18n = (function() {
    'use strict';
    
    const TRANSLATIONS = {
        en: {
            tagline: "Premium AI video marketing for Afghan brands.<br>4 daily campaigns. 1224×1536 Meta-optimized.",
            campaignTitle: "Your Daily Campaign Schedule",
            morningTitle: "Morning Motivation",
            morningDesc: "Celestial Minimalism with Nastaʿlīq calligraphy. Navy-to-gold gradients.",
            middayTitle: "General Information",
            middayDesc: "Organic \"Hujra\" aesthetic with hand-drawn textures. Warm earthy tones.",
            eveningTitle: "Service Promotion",
            eveningDesc: "Modern Classic with high-res photography. Detail callouts.",
            nightTitle: "Brand Awareness",
            nightDesc: "Tactile Stop-Motion with handcrafted assembly. 12fps stutter.",
            formTitle: "Create Your Campaign",
            formSubtitle: "Fill in your brand details to generate your free sample"
        },
        
        fa: {
            tagline: "بازاریابی ویدیویی هوش مصنوعی برای برندهای افغان.<br>۴ کمپین روزانه. بهینه‌شده برای متا ۱۲۲۴×۱۵۳۶.",
            campaignTitle: "برنامه زمانی کمپین روزانه شما",
            morningTitle: "انگیزه صبحگاهی",
            morningDesc: "مینیمالیسم آسمانی با خط نستعلیق. گرادیانتی از نیلی به طلایی.",
            middayTitle: "اطلاعات عمومی",
            middayDesc: "جمالیات ارگانیک \"هجره\" با بافت‌های دست‌کشیده. رنگ‌های گرم زمینی.",
            eveningTitle: "تبلیغ خدمات",
            eveningDesc: "کلاسیک مدرن با عکاسی با وضوح بالا. جزئیات برجسته.",
            nightTitle: "آگاهی از برند",
            nightDesc: "استاپ‌موشن لمسی با مونتاژ دست‌ساز. لرزش ۱۲ فریم‌برثانیه.",
            formTitle: "کمپین خود را بسازید",
            formSubtitle: "جزئیات برند خود را پر کنید تا نمونه رایگان دریافت کنید"
        },
        
        ps: {
            tagline: "د افغان برندونو لپاره د AI ویډیو مارکیټینګ.<br>۴ ورځنی کمپاینونه. ۱۲۲۴×۱۵۳۶ Meta-بهینه شوی.",
            campaignTitle: "ستاسو د ورځنی کمپاین مهال ویش",
            morningTitle: "سهارنه الهام",
            morningDesc: "د نستعلیق خط سره آسماني مینیمالیزم. د سمندرۍ څخه تر سرو زرو پورې.",
            middayTitle: "عمومي معلومات",
            middayDesc: "د \"هجرې\" ارګانیک جمالیات د لاسي بافتونو سره. ګرم ځمکني رنګونه.",
            eveningTitle: "د خدماتو ترویج",
            eveningDesc: "د لوړې resolutions عکاسي سره عصري کلاسیک. د جزئیاتو غږونه.",
            nightTitle: "د برند خبرتیا",
            nightDesc: "د لاسي مونتاژ سره لمسی سټاپ-موشن. ۱۲fps سټټر.",
            formTitle: "خپل کمپاین جوړ کړئ",
            formSubtitle: "د خپل برند جزئیات ډک کړئ ترڅو وړیا نمونه ترلاسه کړئ"
        }
    };
    
    let currentLang = 'en';
    
    function init() {
        const saved = localStorage.getItem('maseer_lang');
        if (saved && TRANSLATIONS[saved]) {
            setLanguage(saved, false);
        }
    }
    
    function setLanguage(lang, save = true) {
        if (!TRANSLATIONS[lang]) return;
        
        currentLang = lang;
        document.documentElement.dir = (lang === 'fa' || lang === 'ps') ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (TRANSLATIONS[lang][key]) {
                el.innerHTML = TRANSLATIONS[lang][key];
            }
        });
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        if (save) localStorage.setItem('maseer_lang', lang);
    }
    
    function getCurrentLang() { return currentLang; }
    
    return { init, setLanguage, getCurrentLang };
})();

function setLanguage(lang) { I18n.setLanguage(lang); }

document.addEventListener('DOMContentLoaded', I18n.init);
