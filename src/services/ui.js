// File Path: thaikpham/sonycolorlab/sonycolorlab-main/src/services/ui.js
/**
 * ui.js
 * This module is responsible for all DOM manipulations and HTML generation.
 * It reads from the central state and updates the UI accordingly. It does not modify the state itself.
 */

// --- Local Module Imports ---
import { state } from './state.js';
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

export function toggleUltimateActionsMenu(forceClose = false) {
    const menu = document.getElementById('ultimateActionsMenu');
    const icon = document.getElementById('ultimateCtaIcon');
    if (!menu || !icon) return;

    const actionButtons = menu.querySelectorAll('.ultimate-action-btn');
    const isOpen = menu.classList.contains('menu-open');

    if (forceClose || isOpen) {
        menu.classList.remove('menu-open');
        icon.style.transform = 'rotate(0deg)';
        actionButtons.forEach(btn => {
            btn.classList.remove('visible');
            btn.style.transform = `scale(0.5)`;
        });
    } else {
        menu.classList.add('menu-open');
        icon.style.transform = 'rotate(135deg)';

        const radius = 130;
        const startAngle = 167;
        const endAngle = 283;

        const angleStep = (endAngle - startAngle) / (actionButtons.length > 1 ? actionButtons.length - 1 : 1);

        actionButtons.forEach((btn, index) => {
            const angle = startAngle + (angleStep * index);
            const angleRad = angle * (Math.PI / 180);

            const x = radius * Math.cos(angleRad);
            const y = radius * Math.sin(angleRad);

            btn.style.transitionDelay = `${index * 40}ms`;
            btn.classList.add('visible');
            btn.style.transform = `translate(${x}px, ${y}px) scale(1)`;
        });
    }
}


// --- HTML TEMPLATE GENERATORS ---

export function createSaveGuideHTML() {
    return `
        <div class="mt-8 p-5 md:p-6 bg-gray-50 border border-gray-200/80 rounded-2xl">
            <div class="flex justify-between items-center cursor-pointer" id="toggleSaveGuideBtn">
                <div>
                    <h4 class="text-lg md:text-xl font-bold text-gray-800">Save & Recall Guide</h4>
                    <p class="mt-1 text-gray-600 text-sm">Learn how to save and recall these settings on your camera.</p>
                </div>
                <button class="btn bg-gray-200 text-gray-700 hover:bg-gray-300 py-2 px-4 text-sm pointer-events-none">
                    <span>Show Guide</span>
                </button>
            </div>
            <div id="saveGuideContent" class="mt-4 text-sm md:text-base overflow-hidden max-h-0 transition-all duration-700 ease-in-out">
                <p class="mb-4">On new generation Sony Alpha cameras (like α7 IV, α7R V, α1, ZV-E1), you can save <strong>3 presets on the camera body</strong> (positions 1, 2, 3 on the mode dial) and <strong>4 presets on the memory card</strong> (M1, M2, M3, M4).</p>
                <ol class="space-y-4 list-decimal list-inside">
                    <li>
                        <strong>Step 1: Set Up Your Camera with the Recipe</strong>
                        <p class="pl-6 text-gray-600">First, input all the parameters from this recipe into your camera, including White Balance (WB) and all Picture Profile settings.</p>
                    </li>
                    <li>
                        <strong>Step 2: Access the Save Settings Menu</strong>
                        <p class="pl-6 text-gray-600">Press the <strong>MENU</strong> button, navigate to the <strong>Shooting tab (pink)</strong> &rarr; <strong>Shooting Mode</strong> &rarr; <strong>Camera Set. Memory</strong>.</p>
                    </li>
                    <li>
                        <strong>Step 3: Video Guides</strong>
                        <p class="pl-6 text-gray-600">Watch these videos to see the process in action.</p>
                        <div class="aspect-w-16 aspect-h-9 my-4">
                            <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                    </li>
                    <li>
                        <strong>Step 4: Recall the Saved Setting</strong>
                        <p class="pl-6 text-gray-600">To use the preset, simply turn the top mode dial to the corresponding number <strong>1, 2, or 3</strong>. The camera will instantly apply all your saved settings.</p>
                    </li>
                </ol>
            </div>
        </div>
    `;
}

/**
 * Renders the list of comments into its container.
 * @param {Array<object>} comments - An array of comment objects from Firestore.
 */
export function renderComments(comments) {
    const container = document.getElementById('commentsListContainer');
    if (!container) return;

    if (comments.length === 0) {
        container.innerHTML = `<p class="text-gray-500 itaic">No comments yet.</p>`;
        return;
    }

    container.innerHTML = comments.map(comment => `
        <div class="flex items-start gap-4 animate-fade-in">
            <img src="${comment.userAvatar || 'https://placehold.co/40x40/e2e8f0/a0aec0?text=A'}" alt="${comment.userName}" class="w-10 h-10 rounded-full">
            <div class="flex-grow bg-gray-100 rounded-lg p-3">
                <p class="font-semibold text-sm">${comment.userName}</p>
                <p class="text-gray-700 whitespace-pre-wrap mt-1">${comment.text}</p>
                <p class="text-xs text-gray-400 mt-2 text-right">${comment.timestamp ? new Date(comment.timestamp.seconds * 1000).toLocaleString() : ''}</p>
            </div>
        </div>
    `).join('');
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

export function renderUltimateButton() {
    const wrapper = document.getElementById('ultimateButtonWrapper');
    if (!wrapper) return;

    wrapper.innerHTML = ''; // Clear wrapper for a fresh, safe render

    const mainButtonHTML = `
        <button id="ultimateCtaBtn" class="liquid-glass-button" style="width: 80px; height: 80px; padding: 16px; border-radius: 32px;">
             <img id="ultimateCtaIcon" src="/assets/Logo.png" alt="Actions" style="width: 100%; height: auto; transition: transform 0.4s var(--ease-out-back);">
        </button>
    `;

    if (state.ui.currentView === 'home') {
        wrapper.innerHTML = mainButtonHTML;
    } else if (state.ui.currentView === 'recipeFormulas') {
        const icons = {
            contributePhotosBtn: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-plus"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" x2="22" y1="5" y2="5"/><line x1="19" x2="19" y1="2" y2="8"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
            findMyColorBtn: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flask-round"><path d="M10 2v7.31"/><path d="M14 9.31V2"/><path d="M12 12.31v4"/><path d="M10 16.31h4"/><path d="M12 22a7 7 0 0 0 7-7c0-3.87-3.13-7-7-7s-7 3.13-7 7a7 7 0 0 0 7 7z"/></svg>`,
            sonyGuideBtn: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
            contributeRecipeBtn: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-plus-2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="15" y1="15" y2="15"/></svg>`,
            ctaButton: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
        };

        const menuActions = [
             { id: 'ultimateContributeBtn', key: 'contributePhotosBtn', colorClass: 'btn-pastel-blue', icon: icons.contributePhotosBtn },
             { id: 'ultimateQuizBtn', key: 'findMyColorBtn', colorClass: 'btn-pastel-red', icon: icons.findMyColorBtn },
             { key: 'sonyGuideBtn', href: 'https://helpguide.sony.net/di/pp/v1/en/contents/TP0000909106.html', colorClass: 'btn-pastel-yellow', icon: icons.sonyGuideBtn },
             { key: 'contributeRecipeBtn', href: 'https://forms.gle/your-form-id', colorClass: 'btn-pastel-magenta', icon: icons.contributeRecipeBtn },
             { key: 'ctaButton', href: 'https://www.facebook.com/groups/sonycolorlab', colorClass: 'btn-pastel-cyan', icon: icons.ctaButton }
        ];

        const menuHTML = `<div id="ultimateActionsMenu">` + menuActions.reverse().map(action => {
            const commonAttrs = `class="ultimate-action-btn ${action.colorClass}"`;
            const content = `${action.icon}<span class="ultimate-tooltip" data-translate-key="${action.key}"></span>`;
            if (action.href) {
                return `<a href="${action.href}" target="_blank" rel="noopener noreferrer" ${commonAttrs}>${content}</a>`;
            } else {
                return `<button id="${action.id}" ${commonAttrs}>${content}</button>`;
            }
        }).join('') + `</div>`;
        
        wrapper.innerHTML = menuHTML + mainButtonHTML;
    }
    
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
            const recipe = state.recipes.find(r => r.id === id);
            if (recipe) {
                newSelectedItem.style.setProperty('--glow-color', recipe.personalityColor);
            }
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
            <div id="authContainer" class="flex items-center gap-4"></div>
        </div>
    `;
}
