// File Path: src/app.js
import './styles/style.css';
// --- Local Module Imports ---
import { initEventListeners } from './services/event-listeners.js';
import { renderView } from './services/view-manager.js';
import { fetchAndSortRecipes } from './services/recipe-service.js';
import { renderHeader } from './services/ui.js';


async function init() {
  try {
    await fetchAndSortRecipes();
  } catch (error) {
    console.error("Failed to fetch recipes, but application will continue to run.", error);
  } finally {
    renderHeader();
    initEventListeners();

    await renderView('home');
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('fade-out');
        preloader.addEventListener('animationend', () => {
          preloader.remove();
        });
      }, 1500); // 1.5 second delay
    }
  }
}

document.addEventListener("DOMContentLoaded", init);
