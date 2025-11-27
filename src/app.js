// File Path: src/app.js
import './styles/style.css';
// --- Local Module Imports ---
import { initLanguage, updateLangSlider } from './services/language.js';
import { initializeFirebase } from './services/api.js';
import { initEventListeners } from './services/event-listeners.js';
import { renderView } from './services/view-manager.js';
import { state } from './services/state.js';
import { renderHeader, updateListSelectionAndScroll } from './services/ui.js';


async function init() {
  initLanguage();
  
  const app = initializeFirebase();
  if (app) {
    state.firebase.app = app;
  } else {
    console.error("Firebase App failed to initialize. Authentication and Firestore functionalities will be unavailable.");
  }

  renderHeader();
  initEventListeners();

  // Check URL parameters for initial recipe ID
  const params = new URLSearchParams(window.location.search);
  const initialRecipeId = params.get('id');

  // Render the main view, passing the recipe ID if present
  await renderView('recipeFormulas', initialRecipeId);
  
  // If we have an initial ID, we might need to ensure the list item is scrolled into view
  if (initialRecipeId) {
      setTimeout(() => {
          updateListSelectionAndScroll(initialRecipeId);
      }, 100);
  }

  updateLangSlider();
}

document.addEventListener("DOMContentLoaded", init);
