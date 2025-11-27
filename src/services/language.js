// File Path: src/services/language.js
import { state } from './state.js';
import { translations } from './translations.js';

// Initialize with English
state.language = 'en';
state.currentTranslations = translations.en;

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

export function setLanguage(lang) {
  // No-op: Language is hardcoded to English
  console.warn("Language switching is disabled.");
}

export function initLanguage() {
  // No-op
}

export function updateLangSlider() {
    // No-op
}
