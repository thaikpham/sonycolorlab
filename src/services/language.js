import { state } from './state.js';
import { showLoadingOverlay, hideLoadingOverlay } from './ui.js';
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

export async function setLanguage(lang) {
  if (state.loadedTranslations[lang]) {
    state.currentTranslations = state.loadedTranslations[lang];
    state.language = lang;
    applyTranslations();
    updateLangSlider();
    localStorage.setItem('userLanguage', lang);
    return;
  }

  showLoadingOverlay();

  try {
    const response = await fetch(`/locales/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load language file: ${lang}.json`);
    }
    const newTranslations = await response.json();

    state.loadedTranslations[lang] = newTranslations;
    state.currentTranslations = newTranslations;
    state.language = lang;
    applyTranslations();
    updateLangSlider();
    localStorage.setItem('userLanguage', lang);
  } catch (error) {
    console.error('Error loading language:', error);
    state.currentTranslations = state.loadedTranslations['en'];
    state.language = 'en';
    applyTranslations();
    updateLangSlider();
  } finally {
    hideLoadingOverlay();
  }
}

export function initLanguage() {
  const savedLang = localStorage.getItem('userLanguage') || 'en';
  setLanguage(savedLang);
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
