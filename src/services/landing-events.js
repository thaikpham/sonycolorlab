// File Path: src/services/landing-events.js
import { renderView } from './view-manager.js';

export function initLandingEventListeners() {
    const enterLabBtn = document.getElementById('enterLabBtn');
    if (enterLabBtn) {
        enterLabBtn.addEventListener('click', () => {
            renderView('recipeFormulas');
        });
    }
}
