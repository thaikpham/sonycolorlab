// File Path: src/app.js
import './styles/style.css';
// --- Local Module Imports ---
import { initLanguage, updateLangSlider } from './services/language.js';
import { initializeFirebase } from './services/api.js';
import { initAuth } from './services/auth.js';
import { initFirestore } from './services/firestore.js';
import { initEventListeners } from './services/event-listeners.js';
import { renderView } from './services/view-manager.js';
import { initConfig, state } from './services/state.js';
import { renderHeader } from './services/ui.js';


async function init() {
  initLanguage();
  await initConfig();
  
  const app = initializeFirebase();
  if (app) {
    initAuth(app);
    initFirestore(app);
    state.firebase.app = app;
  }

  renderHeader();
  initEventListeners();

  await renderView('home');
  updateLangSlider();
}

document.addEventListener("DOMContentLoaded", init);
