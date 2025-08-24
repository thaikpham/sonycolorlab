/**
 * ui.js
 * This module is responsible for all DOM manipulations and HTML generation.
 * It reads from the central state and updates the UI accordingly. It does not modify the state itself.
 */

// --- Local Module Imports ---
import { state } from './state.js';
import { getCurrentLanguage, t, applyTranslations } from './language.js';
import { parameterExplanations } from './translations.js';
import recipesData from './recipes-core.js';
import recipeImages from './recipes-images.js';
import { isAIEnabled } from './state.js';
import { fetchTrendingRecipeIds } from './api.js';


const mainContentEl = document.getElementById('mainContent');

// --- HELPER FUNCTIONS ---

/**
 * Displays a short-lived notification message (toast) at the bottom of the screen.
 * @param {string} message - The message to display.
 * @param {boolean} [isError=false] - If true, the toast will have a red error color.
 */
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

// --- HTML TEMPLATE GENERATORS ---

/**
 * Generates the HTML for the "How to Save" guide section.
 * @returns {string} The complete HTML string for the guide.
 */
function createSaveGuideHTML() {
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
                ${guideContent[getCurrentLanguage()]}
            </div>
        </div>
    `;
}

/**
 * Generates the complete HTML for a single recipe's detail view, including image collage,
 * action buttons, settings grids, and CTA sections.
 * @param {object} recipe - The recipe object from recipes-core.js.
 * @returns {string} The complete HTML string for the recipe details.
 */
function createFullRecipeHTML(recipe) {
    const demoImages = recipeImages[recipe.id] || [];
    
    const createCollageHTML = (images) => {
        if (!images || images.length === 0) return '';
        const count = Math.min(images.length, 6);

        const imageElements = images.slice(0, count).map((imgUrl, index) => `
            <div class="collage-item" data-recipe-id="${recipe.id}" data-index="${index}">
                <img 
                    src="${imgUrl}" 
                    loading="lazy" 
                    decoding="async"
                    alt="Demo image ${index + 1} for ${recipe.name[getCurrentLanguage()]}"
                    onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'flex items-center justify-center h-full text-gray-400 text-xs p-2 text-center\\'>Image failed to load</div>';"
                >
            </div>`).join('');

        return `<div class="photo-collage images-${count}">${imageElements}</div>`;
    };

    const createCTAHTML = (recipe) => {
        const recipeHashtag = `#${recipe.id.replace(/-/g, '')}`;
        const ctaText = t('ctaText').replace('{recipeHashtag}', `<b class="font-semibold text-blue-900">${recipeHashtag}</b>`);
        return `<div class="mt-8 p-5 md:p-6 bg-blue-50 border border-blue-200/50 rounded-2xl text-center">
            <h4 class="text-lg md:text-xl font-bold text-blue-800" data-translate-key="ctaTitle"></h4>
            <p class="mt-2 text-blue-700/90 max-w-2xl mx-auto text-sm md:text-base">${ctaText}</p>
            <div class="mt-5 flex flex-wrap justify-center gap-4">
                <button id="shareRecipeBtn" data-recipe-id="${recipe.id}" class="btn bg-green-500 hover:bg-green-600 text-white py-2.5 px-6 shadow-lg shadow-green-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share-2 h-5 w-5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                    <span data-translate-key="shareRecipeBtn"></span>
                </button>
            </div>
        </div>`;
    };

    const createSettingsGrid = (settings) => {
        if (!settings) return '';
        return Object.entries(settings).map(([key, value]) => {
            const explanationKey = Object.keys(parameterExplanations).find(k => k.toLowerCase() === key.toLowerCase().trim());
            return `<div class="flex flex-col p-4 bg-white/50 rounded-xl"><div class="flex items-center gap-1.5"><span class="parameter-title text-sm text-gray-500 font-medium" data-param-key="${explanationKey || ''}">${key}</span></div><span class="font-semibold text-xl text-gray-800 mt-1">${value}</span></div>`;
        }).join('');
    };

    const sections = [
        { titleKey: 'whiteBalanceTitle', content: `<div class="p-4 bg-white/50 rounded-xl"><p class="font-semibold text-xl text-gray-800">${recipe.whiteBalance || ''}</p></div>` },
        { titleKey: 'recipeSettingsTitle', content: `<div class="grid grid-cols-2 md:grid-cols-3 gap-3">${createSettingsGrid(recipe.settings)}</div>` },
        recipe.colorDepth ? { titleKey: 'colorDepthTitle', content: `<div class="grid grid-cols-3 md:grid-cols-6 gap-3">${createSettingsGrid(recipe.colorDepth)}</div>` } : null,
        recipe.detailSettings ? { titleKey: 'detailTitle', content: `<div class="grid grid-cols-2 md:grid-cols-3 gap-3">${createSettingsGrid(recipe.detailSettings)}</div>` } : null
    ].filter(Boolean);

    const aiDisabledAttr = !isAIEnabled ? `disabled title="${t('aiKeyNotConfigured')}"` : '';

    return `
        ${createCollageHTML(demoImages)}
        <div class="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <button class="btn btn-primary py-3 px-6" id="tweakWithAIBtn" data-recipe-id="${recipe.id}" ${aiDisabledAttr}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-5 h-5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                <span data-translate-key="tweakWithAI"></span>
            </button>
            <button class="btn bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 shadow-lg shadow-purple-500/30" id="captionAIBtn" data-recipe-id="${recipe.id}" ${aiDisabledAttr}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text w-5 h-5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                <span data-translate-key="captionFromAI"></span>
            </button>
            <button class="btn bg-gray-700 hover:bg-gray-800 text-white py-3 px-6 shadow-lg shadow-gray-500/30" id="downloadPdfBtn" data-recipe-id="${recipe.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download h-5 w-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                <span data-translate-key="downloadPDFBtn"></span>
            </button>
            <a href="https://helpguide.sony.net/di/pp/v1/en/contents/TP0000909106.html" target="_blank" rel="noopener noreferrer" class="btn bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open h-5 w-5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                <span data-translate-key="sonyGuideBtn"></span>
            </a>
        </div>
        <div class="space-y-8 mt-8">
            ${sections.map(section => `<div><h4 class="text-xl font-bold mb-3 text-gray-700" data-translate-key="${section.titleKey}"></h4><div class="p-4 bg-gray-500/5 rounded-2xl">${section.content}</div></div>`).join('')}
        </div>
        ${createSaveGuideHTML()}
        ${createCTAHTML(recipe)}
    `;
}

/**
 * An object containing template functions that return HTML strings for each application view.
 */
const viewTemplates = {
    home: () => `
        <div id="homeView" class="w-full h-full flex items-center justify-center absolute inset-0 p-4 md:p-8">
            <div class="w-full max-w-2xl mx-auto text-center">
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 mb-4" style="text-wrap: balance;" data-translate-key="landingTitle"></h1>
                <p class="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mt-4" style="text-wrap: balance;" data-translate-key="landingSubtitle"></p>
                <div class="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
                    <button id="startQuizBtn" class="btn btn-primary py-4 px-10 text-lg whitespace-nowrap">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wand-2 h-6 w-6"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2 18.28V22h3.72L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
                        <span data-translate-key="findMyColorBtn"></span>
                    </button>
                    <button data-view="recipeFormulas" class="nav-btn btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-4 px-10 text-lg whitespace-nowrap" data-translate-key="startExploringBtn"></button>
                </div>
            </div>
        </div>`,
    recipeFormulas: () => `
        <div id="recipeFormulasView" class="w-full h-full flex flex-col md:flex-row gap-6 absolute inset-0 view-transition">
            <aside id="recipeListPanel" class="w-full md:w-2/5 lg:w-1/3 flex-shrink-0 glass-panel p-4 md:p-6 flex flex-col md:flex">
                <div class="relative mb-4 flex-shrink-0">
                    <input type="search" id="searchInput" class="w-full p-3 pl-4 pr-12 rounded-xl bg-gray-200/50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all" data-translate-key="searchInputPlaceholder">
                    <button id="quizShortcutBtn" class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-blue-500" title="Find My Color Quiz">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wand-2 h-6 w-6"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2 18.28V22h3.72L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
                    </button>
                </div>
                <div id="recipeListContainer" class="space-y-2 flex-grow overflow-y-auto sleek-scrollbar pr-2 -mr-2"></div>
            </aside>
            <main id="recipeMainPanel" class="w-full md:w-3/5 lg:w-2/3 flex flex-col min-h-0 hidden md:flex">
                <div class="glass-panel flex-grow overflow-y-auto p-6 lg:p-10 sleek-scrollbar">
                    <div id="welcomeAndChartContainer" class="flex flex-col items-center justify-center h-full">
                        <div id="welcomeText" class="text-center">
                            <h2 class="text-2xl md:text-3xl font-bold text-gray-700" data-translate-key="recipeDetailWelcomeTitle"></h2>
                            <p class="text-neutral-500 mt-2 max-w-xl mx-auto" data-translate-key="recipeDetailWelcomeText"></p>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                            <a href="https://forms.gle/your-form-id" target="_blank" rel="noopener noreferrer" class="btn bg-green-500 hover:bg-green-600 text-white py-3 px-6 shadow-lg shadow-green-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-circle h-5 w-5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
                                <span data-translate-key="contributeRecipeBtn"></span>
                            </a>
                            <a href="https://www.facebook.com/groups/sonyalphavietnamoffical" target="_blank" rel="noopener noreferrer" class="btn btn-primary py-3 px-6 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users h-5 w-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                <span data-translate-key="ctaButton"></span>
                            </a>
                        </div>
                        <div id="colorMapContainer" class="flex-grow w-full"></div>
                    </div>
                    <div id="recipeContent" class="hidden"></div>
                </div>
            </main>
            <div id="recipeDetailPanelMobile" class="w-full h-full absolute inset-0 bg-[#f8f9fa] p-4 overflow-y-auto hidden">
                <button id="backToListBtn" class="btn bg-white/80 border border-gray-200 text-gray-800 mb-4 py-2 px-4" data-translate-key="backToListBtn"></button>
                <div class="glass-panel p-6 overflow-y-auto sleek-scrollbar"><div id="recipeContentMobile"></div></div>
            </div>
        </div>`,
};

// --- CORE UI RENDERING LOGIC ---

/**
 * Initializes and animates the background blobs for the home screen.
 */
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
        if (state.currentView !== 'home') {
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
    animate();
}

/**
 * Renders a new view into the main content area with a transition animation.
 * @param {string} viewName - The name of the view to render ('home' or 'recipeFormulas').
 * @param {string|null} selectedId - An optional recipe ID to pre-select when the view loads.
 * @param {function} attachViewEventListeners - A callback function to attach events after the new view is in the DOM.
 * @returns {Promise<void>} A promise that resolves when the transition is complete.
 */
export function renderView(viewName, selectedId = null, attachViewEventListeners) {
    state.currentView = viewName;
    if (selectedId) { state.selectedRecipeId = selectedId; }

    const blobContainer = document.getElementById('blobContainer');

    if (viewName !== 'home') {
        document.body.style.overflowY = 'auto';
        // Stop the animation if it's running
        if (state.animation.blobAnimationFrameId) {
            cancelAnimationFrame(state.animation.blobAnimationFrameId);
            state.animation.blobAnimationFrameId = null;
        }
        if(blobContainer) {
            blobContainer.querySelectorAll('.bg-blob').forEach(b => b.classList.remove('visible'));
        }
    } else {
        document.body.style.overflowY = 'hidden';
        // Start the animation if it's not running
        if (!state.animation.blobAnimationFrameId) {
            initializeBackgroundBlobs();
        }
    }

    const footerEl = document.querySelector('footer');
    if (footerEl) {
        footerEl.classList.toggle('hidden', viewName === 'recipeFormulas');
    }

    return new Promise(resolve => {
        const currentContent = mainContentEl.children[0];
        if (currentContent) {
            currentContent.classList.add('view-transition-out');
            currentContent.addEventListener('animationend', () => {
                mainContentEl.innerHTML = viewTemplates[viewName]();
                if (attachViewEventListeners) attachViewEventListeners(viewName);
                applyTranslations();
                resolve();
            }, { once: true });
        } else {
            mainContentEl.innerHTML = viewTemplates[viewName]();
            if (attachViewEventListeners) attachViewEventListeners(viewName);
            applyTranslations();
            resolve();
        }
    });
}

/**
 * Updates the recipe list to highlight the selected item and scrolls it into view.
 * @param {string|null} id - The ID of the recipe to select, or null to deselect all.
 */
export function updateListSelectionAndScroll(id) {
    const listContainer = document.getElementById('recipeListContainer');
    if (!listContainer) return;

    // Deselect previously selected item
    const oldSelectedItem = listContainer.querySelector('.recipe-item.selected');
    if (oldSelectedItem) {
        oldSelectedItem.classList.remove('selected');
    }

    // Select the new item if an ID is provided
    if (id) {
        const newSelectedItem = listContainer.querySelector(`.recipe-item[data-recipe-id="${id}"]`);
        if (newSelectedItem) {
            newSelectedItem.classList.add('selected');
            const recipe = recipesData.find(r => r.id === id);
            if (recipe) {
                // Apply glow color for the selected item
                newSelectedItem.style.setProperty('--glow-color', recipe.personalityColor);
            }
            // Scroll the item into the center of the view
            newSelectedItem.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
}

/**
 * Renders the list of recipes in the sidebar, filtering by the search input.
 */
export async function renderLibraryList() {
    const container = document.getElementById('recipeListContainer');
    if (!container) return;
    const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const trendingIds = await fetchTrendingRecipeIds();
    
    // Filter recipes based on name or description in the current language
    const recipesToRender = recipesData.filter(r => 
        r.name[getCurrentLanguage()].toLowerCase().includes(searchTerm) || 
        r.description[getCurrentLanguage()].toLowerCase().includes(searchTerm)
    );
    
    container.innerHTML = recipesToRender.map((recipe, index) => {
        const isSelected = recipe.id === state.selectedRecipeId;
        const isTrending = trendingIds.includes(recipe.id);
        const glowStyle = isSelected ? `--glow-color: ${recipe.personalityColor};` : '';
        const animationStyle = `animation-delay: ${index * 40}ms;`; // Stagger animation
        
        const trendingIconHTML = isTrending 
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star text-yellow-400 flex-shrink-0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` 
            : '';

        return `<div class="recipe-item p-3 rounded-xl cursor-pointer ${isSelected ? 'selected' : ''} recipe-item-stagger" 
                     data-recipe-id="${recipe.id}" 
                     style="${glowStyle} ${animationStyle}">
            <div class="flex justify-between items-start">
                <span class="font-semibold text-primary pr-2">${recipe.name[getCurrentLanguage()]}</span>
                ${trendingIconHTML}
            </div>
            <p class="text-sm text-neutral-600 mt-1 leading-snug">${recipe.description[getCurrentLanguage()]}</p>
        </div>`;
    }).join('');
}

/**
 * Renders the main content panel, showing either the welcome/chart view or the recipe details.
 * Also handles the responsive layout switching between desktop and mobile.
 */
export function renderLibraryDetails() {
    const isMobile = window.innerWidth < 768;
    const recipeListPanel = document.getElementById('recipeListPanel');
    const recipeMainPanel = document.getElementById('recipeMainPanel');
    const recipeDetailPanelMobile = document.getElementById('recipeDetailPanelMobile');

    // Handle responsive visibility
    if (isMobile) {
        recipeListPanel.classList.toggle('hidden', state.isMobileDetailActive);
        recipeDetailPanelMobile.classList.toggle('hidden', !state.isMobileDetailActive);
    } else {
        recipeListPanel?.classList.remove('hidden');
        recipeDetailPanelMobile?.classList.add('hidden');
    }

    const recipe = recipesData.find(r => r.id === state.selectedRecipeId);
    let recipeContentContainer = isMobile && state.isMobileDetailActive 
        ? document.getElementById('recipeContentMobile') 
        : document.getElementById('recipeContent');
    let welcomeAndChartContainer = document.getElementById('welcomeAndChartContainer');
    
    if (!recipeContentContainer) return;

    // If no recipe is selected, show the welcome/chart view
    if (!recipe) {
        if (welcomeAndChartContainer) welcomeAndChartContainer.classList.remove('hidden');
        recipeContentContainer.classList.add('hidden');
        if(!isMobile) recipeMainPanel?.classList.remove('hidden');
        return;
    }
    
    // If a recipe is selected, hide the welcome view and show the details
    if (welcomeAndChartContainer) welcomeAndChartContainer.classList.add('hidden');
    recipeContentContainer.classList.remove('hidden');
    if(!isMobile) recipeMainPanel?.classList.remove('hidden');

    recipeContentContainer.innerHTML = `
        <div class="mb-4">
            <button id="backToChartBtn" class="btn bg-white/60 border border-gray-200/80 text-gray-700 hover:bg-white/90 py-2 px-4 text-sm" data-translate-key="backToChartBtn"></button>
        </div>
        <div>
            <h3 class="text-3xl md:text-4xl font-bold">${recipe.name[getCurrentLanguage()]}</h3>
            <p class="text-lg text-neutral-600 mt-1">"${recipe.description[getCurrentLanguage()]}"</p>
        </div>
        <div class="mt-8">${createFullRecipeHTML(recipe)}</div>
    `;
    applyTranslations();
}
