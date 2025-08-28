import './styles/style.css';
// --- Local Module Imports ---
import { initLanguage, updateLangSlider } from './services/language.js';
import { state } from './services/state.js';
import { initializeFirebase } from './services/api.js';
import { initEventListeners } from './services/event-listeners.js';
import { renderView, attachViewEventListeners } from './services/view-manager.js';
import recipesData from './services/recipes.js';
import { applyTranslations } from './services/language.js';


async function init() {
    initLanguage();

    initEventListeners();

    await renderView('home');
    updateLangSlider();

    initializeFirebase();
}

document.addEventListener("DOMContentLoaded", init);
