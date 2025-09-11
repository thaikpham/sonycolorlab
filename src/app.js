import './styles/style.css';
// --- Local Module Imports ---
import { initLanguage, updateLangSlider } from './services/language.js';
import { initializeFirebase } from './services/api.js';
import { initEventListeners } from './services/event-listeners.js';
import { renderView } from './services/view-manager.js';
import { initConfig } from './services/state.js';


async function init() {
  initLanguage();
  await initConfig()
  initEventListeners();

  await renderView('home');
  updateLangSlider();

  initializeFirebase();
}

document.addEventListener("DOMContentLoaded", init);
