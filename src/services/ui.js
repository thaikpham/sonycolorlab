// File Path: thaikpham/sonycolorlab/sonycolorlab-main/src/services/ui.js
/**
 * ui.js
 * This module is responsible for all DOM manipulations and HTML generation.
 * It reads from the central state and updates the UI accordingly. It does not modify the state itself.
 */

// --- Local Module Imports ---
import { state } from './state.js';
import { t, applyTranslations } from './language.js';
import recipeImages from './recipe-images.js';


// --- HELPER FUNCTIONS ---

export function showLoadingIndicator() {
  state.ui.isLoading = true;
  const container = document.getElementById('recipeListContainer');
  if (container) {
    container.innerHTML = `<div class="p-4 text-center text-gray-500">${t('loadingRecipes')}</div>`;
  }
}

export function hideLoadingIndicator() {
  state.ui.isLoading = false;
}

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
  // if (!name) return '';
  // return name.replace(/(SCL|PROCOLOR)-0+/, '$1-');
  return name;
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

// This functionality has been removed to simplify the UI.
export function toggleUltimateActionsMenu() {}


// --- HTML TEMPLATE GENERATORS ---

export function createSaveGuideHTML() {
  const guideContent = {
    vi: `
            <p class="mb-4">Trên các máy ảnh Sony Alpha thế hệ mới (như α7 IV, α7R V, α1, ZV-E1), bạn có thể lưu được <strong>3 preset trên thân máy</strong> (vị trí 1, 2, 3 trên vòng xoay) và <strong>4 preset trên thẻ nhớ</strong> (M1, M2, M3, M4).</p>
            <ol class="space-y-4 list-decimal list-inside">
                <li>
                    <strong>Bước 1: Thiết lập máy ảnh theo công thức</strong>
                    <p class="pl-6 text-gray-600">Trước tiên, hãy cài đặt tất cả các thông số của công thức này vào máy ảnh của bạn, bao gồm Cân bằng trắng (WB) và tất cả các mục trong Picture Profile.</p>
                </li>
                <li>
                    <strong>Bước 2: Truy cập Menu để lưu cài đặt</strong>
                    <p class="pl-6 text-gray-600">Nhấn nút <strong>MENU</strong>, di chuyển đến tab <strong>Shooting (màu hồng)</strong> &rarr; <strong>Shooting Mode</strong> &rarr; <strong>Camera Set. Memory</strong>.</p>
                </li>
                <li>
                    <strong>Bước 3: Chọn vị trí lưu</strong>
                    <p class="pl-6 text-gray-600">Chọn một trong các vị trí bạn muốn lưu (ví dụ: số <strong>1</strong> hoặc <strong>M1</strong>) và nhấn nút Enter để xác nhận. Cài đặt của bạn đã được lưu!</p>
                </li>
                <li>
                    <strong>Bước 4: Gọi lại cài đặt đã lưu</strong>
                    <p class="pl-6 text-gray-600">Để sử dụng, chỉ cần xoay vòng xoay chế độ trên đỉnh máy đến đúng số <strong>1, 2, hoặc 3</strong>. Máy ảnh sẽ ngay lập tức áp dụng tất cả các thông số bạn đã lưu.</p>
                </li>
            </ol>
        `,
    en: `
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
                    <strong>Step 3: Choose a Memory Slot</strong>
                    <p class="pl-6 text-gray-600">Select one of the memory slots you want to save to (e.g., <strong>1</strong> or <strong>M1</strong>) and press the Enter button to confirm. Your settings are now saved!</p>
                </li>
                <li>
                    <strong>Step 4: Recall the Saved Setting</strong>
                    <p class="pl-6 text-gray-600">To use the preset, simply turn the top mode dial to the corresponding number <strong>1, 2, or 3</strong>. The camera will instantly apply all your saved settings.</p>
                </li>
            </ol>
        `
  };

  const relocatedContent = `
    <div class="space-y-8">
        <!-- STEP 3: SAVE THE RECIPES -->
        <div class="section-card-condensed">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Save the Recipes</h2>
            <p class="text-gray-600 mb-6">Watch the corresponding video tutorial for your camera model to save the settings.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <!-- New Menu Video Player -->
                <div class="video-container">
                    <div class="video-info">
                        <h4 class="font-semibold text-sm">NEW MENU</h4>
                        <p class="text-xs text-gray-500">A7IV, A7SIII, FX3, A7CII...</p>
                    </div>
                    <div class="video-thumbnail" data-video-id="nAWs5Mus90s">
                        <img src="https://img.youtube.com/vi/nAWs5Mus90s/hqdefault.jpg" alt="Video tutorial for new Sony menu cameras" loading="lazy">
                        <div class="play-button-overlay">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.5 5.604v12.792a1.5 1.5 0 0 0 2.25 1.3l10.5-6.396a1.5 1.5 0 0 0 0-2.6L9.75 4.304a1.5 1.5 0 0 0-2.25 1.3z" /></svg>
                        </div>
                    </div>
                </div>
                <!-- Old Menu Video Player -->
                <div class="video-container">
                    <div class="video-info">
                        <h4 class="font-semibold text-sm">OLD MENU</h4>
                        <p class="text-xs text-gray-500">A7III, A6400, ZV-E10...</p>
                    </div>
                    <div class="video-thumbnail" data-video-id="SI0bdb_oP9A">
                        <img src="https://img.youtube.com/vi/SI0bdb_oP9A/hqdefault.jpg" alt="Video tutorial for old Sony menu cameras" loading="lazy">
                        <div class="play-button-overlay">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.5 5.604v12.792a1.5 1.5 0 0 0 2.25 1.3l10.5-6.396a1.5 1.5 0 0 0 0-2.6L9.75 4.304a1.5 1.5 0 0 0-2.25 1.3z" /></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- STEP 4: RECALL & USE -->
        <div class="section-card-condensed">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Recall & Use</h2>
            <p class="text-gray-600 mb-6">Once saved, you can quickly access the recipes on the mode dial.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <h4 class="font-semibold text-sm">Save on Camera (1, 2, 3)</h4>
                    <p class="text-xs text-gray-500 mt-1">Turn the mode dial directly to the corresponding number.</p>
                </div>
                <div class="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <h4 class="font-semibold text-sm">Save on Card (M1-M4)</h4>
                    <p class="text-xs text-gray-500 mt-1">Turn to <span class="font-bold text-gray-700">MR</span> and select the saved memory on the card.</p>
                </div>
            </div>
        </div>
    </div>
  `;

  return `
        <div class="mt-8 p-5 md:p-6 bg-gray-50 border border-gray-200/80 rounded-2xl">
            <div class="flex justify-between items-center cursor-pointer" id="toggleSaveGuideBtn">
                <div>
                    <h4 class="text-lg md:text-xl font-bold text-gray-800" data-translate-key="saveGuideTitle"></h4>
                    <p class="mt-1 text-gray-600 text-sm" data-translate-key="saveGuideSubtitle"></p>
                </div>
                <button class="btn bg-gray-200 text-gray-700 hover:bg-gray-300 py-2 px-4 text-sm pointer-events-none">
                    <span data-translate-key="showGuideBtn"></span>
                </button>
            </div>
            <div id="saveGuideContent" class="mt-4 text-sm md:text-base overflow-hidden max-h-0 transition-all duration-700 ease-in-out">
                ${relocatedContent}
                <hr class="my-6 border-gray-300">
                ${guideContent[state.language]}
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
    container.innerHTML = `<p class="text-gray-500 itaic" data-translate-key="noCommentsYet"></p>`;
    applyTranslations();
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

// This functionality has been removed to simplify the UI.
export function renderUltimateButton() {}

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


// This functionality has been removed to simplify the UI.
export function renderHeader() {}
