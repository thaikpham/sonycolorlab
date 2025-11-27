// File Path: src/services/ui.js
/**
 * ui.js
 * This module is responsible for all DOM manipulations and HTML generation.
 * It reads from the central state and updates the UI accordingly. It does not modify the state itself.
 */

// --- Local Module Imports ---
import { state } from './state.js';
import { t, applyTranslations } from './language.js';
import recipesData from './recipes.js';
import recipeImages from './recipe-images.js';


// --- HELPER FUNCTIONS ---

export function showLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    overlay.style.opacity = '1';
  }
}

export function hideLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 300);
  }
}

export function formatRecipeName(name) {
    if (!name) return '';
    return name.replace(/(SCL|PROCOLOR)-0+/, '$1-');
}

export function showToast(message, isError = false) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'app-toast';
        Object.assign(toast.style, {
            position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            padding: '12px 24px', borderRadius: '99px', color: 'white', zIndex: '9999',
            opacity: '0', transition: 'opacity 0.3s ease, bottom 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        });
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.backgroundColor = isError ? '#e53935' : '#2ecc71';
    toast.style.bottom = '20px';
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.bottom = '0px';
    }, 3000);
}

export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('visible');
    }, 10);
}

export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('visible');
    modal.addEventListener('transitionend', () => {
        if (!modal.classList.contains('visible')) {
            modal.classList.add('hidden');
        }
    }, { once: true });
}


// --- CORE UI RENDERING LOGIC ---

export function initializeBackgroundBlobs() {
    const container = document.getElementById('blobContainer');
    if (!container) return;
    container.innerHTML = '';

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const blobs = [
        { id: 'red', color: '#e74c3c', r: vw * 0.12 }, 
        { id: 'green', color: '#2ecc71', r: vw * 0.15 },
        { id: 'blue', color: '#3498db', r: vw * 0.11 }, 
        { id: 'cyan', color: '#1abc9c', r: vw * 0.14 },
        { id: 'magenta', color: '#9b59b6', r: vw * 0.10 }, 
        { id: 'yellow', color: '#f1c40f', r: vw * 0.13 },
    ].map(d => ({
        ...d,
        x: Math.random() * (vw - d.r * 2) + d.r,
        y: Math.random() * (vh - d.r * 2) + d.r,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
    }));

    const blobElements = blobs.map(blobData => {
        const el = document.createElement('div');
        el.className = 'bg-blob';
        el.style.width = `${blobData.r * 2}px`;
        el.style.height = `${blobData.r * 2}px`;
        el.style.backgroundColor = blobData.color;
        container.appendChild(el);
        setTimeout(() => el.classList.add('visible'), 100);
        return { el, data: blobData };
    });

    function animate() {
        if (state.ui.currentView !== 'home') {
            cancelAnimationFrame(state.animation.blobAnimationFrameId);
            state.animation.blobAnimationFrameId = null;
            return;
        }

        blobElements.forEach(item => {
            const blob = item.data;
            blob.x += blob.vx;
            blob.y += blob.vy;

            if (blob.x - blob.r < 0 || blob.x + blob.r > vw) {
                blob.vx *= -1;
                blob.x = Math.max(blob.r, Math.min(vw - blob.r, blob.x));
            }
            if (blob.y - blob.r < 0 || blob.y + blob.r > vh) {
                blob.vy *= -1;
                blob.y = Math.max(blob.r, Math.min(vh - blob.r, blob.y));
            }

            item.el.style.transform = `translate(${blob.x - blob.r}px, ${blob.y - blob.r}px)`;
        });

        state.animation.blobAnimationFrameId = requestAnimationFrame(animate);
    }

    if (state.animation.blobAnimationFrameId) {
        cancelAnimationFrame(state.animation.blobAnimationFrameId);
    }
    animate();
}

export function updateListSelectionAndScroll(id) {
    const listContainer = document.getElementById('recipeListContainer');
    if (!listContainer) return;

    listContainer.querySelectorAll('.recipe-item.selected').forEach(el => {
        el.classList.remove('selected');
        el.style.removeProperty('--glow-color');
    });

    if (id) {
        const newSelectedItem = listContainer.querySelector(`.recipe-item[data-recipe-id="${id}"]`);
        if (newSelectedItem) {
            newSelectedItem.classList.add('selected');
            // Use a default blue color since personalityColor is removed
            newSelectedItem.style.setProperty('--glow-color', '#3b82f6');
            
            newSelectedItem.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
}


export function renderHeader() {
    const header = document.getElementById('appHeader');
    if (!header) return;

    header.innerHTML = `
        <button id="homeBtn" class="flex items-center transition-transform duration-200 hover:scale-105 active:scale-100">
            <img src="/assets/logo_black.png" alt="Alpha AI Color Lab Logo" class="h-16 md:h-20 w-auto">
        </button>
        <div class="flex items-center gap-2 md:gap-4">
            <!-- Language switcher removed -->
        </div>
    `;
    applyTranslations();
}
