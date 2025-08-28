import { translations } from './translations.js';

let currentLang = 'en';

export function initLanguage() {
    const savedLang = localStorage.getItem('sonycolorlab-lang');
    currentLang = savedLang || 'en';
    return currentLang;
}

export function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('sonycolorlab-lang', currentLang);
}

export function getCurrentLanguage() {
    return currentLang;
}

export function t(key) {
    return translations[key]?.[currentLang] || key;
}

export function applyTranslations() {
    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.dataset.translateKey;
        const translation = t(key);
        if (el.placeholder !== undefined) {
            el.placeholder = translation;
        } else {
            el.innerHTML = translation;
        }
    });
}

export function updateLangSlider() {
    const glider = document.getElementById('lang-glider');
    const langVI = document.getElementById('langVI');
    const langEN = document.getElementById('langEN');
    if (!glider || !langVI || !langEN) return;

    const isEnglish = currentLang === 'en';
    
    langVI.classList.toggle('text-blue-600', !isEnglish);
    langVI.classList.toggle('text-gray-500', isEnglish);
    langEN.classList.toggle('text-blue-600', isEnglish);
    langEN.classList.toggle('text-gray-500', !isEnglish);
    
    glider.style.transform = isEnglish ? 'translateX(100%)' : 'translateX(0%)';
}
