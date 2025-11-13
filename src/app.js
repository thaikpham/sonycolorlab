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
import * as RecipeService from './services/recipe-service.js';

async function init() {
  initLanguage();
  
  const app = initializeFirebase();
  if (app) {
    initAuth(app);
    initFirestore(app);
    state.firebase.app = app;
  } else {
    console.error("Firebase App failed to initialize. Authentication and Firestore functionalities will be unavailable.");
  }

  // Load all recipes into the state at the beginning
  await RecipeService.getAllRecipes();

  renderHeader();
  initEventListeners();

  const params = new URLSearchParams(window.location.search);
  const recipeId = params.get('recipe');

  if (recipeId) {
    await renderView('recipeFormulas', recipeId);
  } else {
    await renderView('home');
  }

  updateLangSlider();
}

document.addEventListener("DOMContentLoaded", init);
