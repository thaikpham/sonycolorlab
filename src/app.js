// File Path: src/app.js
import './styles/style.css';
// --- Local Module Imports ---
import { initLanguage, updateLangSlider } from './services/language.js';
import { initializeFirebase } from './services/api.js';
import { initAuth } from './services/auth.js';
import { initFirestore } from './services/firestore.js';
import { initEventListeners } from './services/event-listeners.js';
import { renderView } from './services/view-manager.js';
import { state } from './services/state.js';
import { renderHeader } from './services/ui.js';


async function init() {
  initLanguage();
  // The initConfig() call has been removed as configuration is handled by Vite environment variables.
  
  const app = initializeFirebase();
  if (app) {
    initAuth(app);
    initFirestore(app);
    state.firebase.app = app;
  } else {
    console.error("Firebase App failed to initialize. Authentication and Firestore functionalities will be unavailable.");
  }

  renderHeader();
  initEventListeners();

  await renderView('home');
  updateLangSlider();
}

document.addEventListener("DOMContentLoaded", init);
