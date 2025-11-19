import { state } from './state.js';
import { getDefaultTranslations } from './translations.js';

if (!state.loadedTranslations) {
  state.loadedTranslations = {
    en: getDefaultTranslations(),
  };
  state.currentTranslations = getDefaultTranslations();
  state.language = 'en';
}

export function t(key) {
  return state.currentTranslations[key] || key;
}

export function applyTranslations() {
  document.querySelectorAll('[data-translate-key]').forEach(el => {
    const key = el.dataset.translateKey;
    const translation = t(key);
    if (el.placeholder) {
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

    const isEnglish = state.language === 'en';
    
    langVI.classList.toggle('text-blue-600', !isEnglish);
    langVI.classList.toggle('text-gray-500', isEnglish);
    langEN.classList.toggle('text-blue-600', isEnglish);
    langEN.classList.toggle('text-gray-500', !isEnglish);
    
    glider.style.transform = isEnglish ? 'translateX(100%)' : 'translateX(0%)';
}
