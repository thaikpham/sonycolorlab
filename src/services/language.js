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
