/**
 * ui.js
 * This module is responsible for all DOM manipulations and HTML generation.
 * It reads from the central state and updates the UI accordingly. It does not modify the state itself.
 * * ==============================================
 * CẬP NHẬT GIAO DIỆN NÚT ĐA CHỨC NĂNG - NGÀY 27/08/2025
 * ==============================================
 * - Thay thế nút "Enter Color Lab" trên trang chủ bằng logo với hiệu ứng Liquid Glass.
 * - Loại bỏ hiệu ứng blob động bên trong nút để có giao diện trong suốt hoàn toàn.
 * - Cập nhật logic render để hiển thị đúng nút cho từng giao diện.
 * - Gán các màu pastel cho các nút chức năng.
 * - Loại bỏ icon khỏi các nút chức năng trong menu.
 * - Đồng bộ kích thước nút CTA trên trang chủ về 72x72px.
 * * ==============================================
 * SỬA LỖI TƯƠNG TÁC NÚT ĐA CHỨC NĂNG - NGÀY 27/08/2025
 * ==============================================
 * - Sửa lại hàm `renderUltimateButton` để không phá hủy cấu trúc DOM.
 * - Thay vì dùng `innerHTML` để ghi đè toàn bộ wrapper, hàm sẽ quản lý việc
 * thêm/xóa nút CTA và cập nhật nội dung menu một cách độc lập,
 * đảm bảo `#ultimateActionsMenu` luôn tồn tại để các hàm khác có thể tương tác.
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

function formatRecipeName(name) {
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


// --- HTML TEMPLATE GENERATORS ---

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

function createFullRecipeHTML(recipe) {
    const demoImages = recipeImages[recipe.id] || [];
    
    const createCollageHTML = (images) => {
        if (!images || images.length === 0) return '';
        const count = Math.min(images.length, 8);

        const imageElements = images.slice(0, count).map((imgUrl, index) => `
            <div class="collage-item" data-recipe-id="${recipe.id}" data-index="${index}">
                <img 
                    src="${imgUrl}" 
                    loading="lazy" 
                    decoding="async"
                    alt="Demo image ${index + 1} for ${formatRecipeName(recipe.name[getCurrentLanguage()])}"
                    onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'flex items-center justify-center h-full text-gray-400 text-xs p-2 text-center\\'>Image failed to load</div>';"
                >
            </div>`).join('');

        return `<div class="photo-collage">${imageElements}</div>`;
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
            <button class="btn bg-gray-700 hover:bg-gray-800 text-white py-3 px-6 shadow-lg shadow-gray-500/30" id="downloadPdfBtn" data-recipe-id="${recipe.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download h-5 w-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                <span data-translate-key="downloadPDFBtn"></span>
            </button>
             <button id="shareRecipeBtn" data-recipe-id="${recipe.id}" class="btn bg-green-500 hover:bg-green-600 text-white py-2.5 px-6 shadow-lg shadow-green-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share-2 h-5 w-5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                <span data-translate-key="shareRecipeBtn"></span>
            </button>
        </div>
        <div class="space-y-8 mt-8">
            ${sections.map(section => `<div><h4 class="text-xl font-bold mb-3 text-gray-700" data-translate-key="${section.titleKey}"></h4><div class="p-4 bg-gray-500/5 rounded-2xl">${section.content}</div></div>`).join('')}
        </div>
        ${createSaveGuideHTML()}
    `;
}

const viewTemplates = {
    home: () => `
        <div id="homeView" class="w-full h-full flex flex-col items-center justify-center absolute inset-0 p-4 md:p-8">
            <div class="text-center">
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 mb-4" style="text-wrap: balance;" data-translate-key="landingTitle"></h1>
                <p class="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mt-4" style="text-wrap: balance;" data-translate-key="landingSubtitle"></p>
            </div>
            <div id="homeColorMapContainer" class="w-full max-w-4xl flex-grow my-8 cursor-pointer"></div>
        </div>`,
    recipeFormulas: () => `
        <div id="recipeFormulasView" class="w-full h-full flex flex-col md:flex-row absolute inset-0 view-transition">
            <aside id="recipeListPanel" class="h-full w-full md:w-auto md:flex-shrink-0 glass-panel p-4 md:p-5 flex flex-col">
                <div class="relative mb-4 flex-shrink-0">
                    <input type="search" id="searchInput" class="w-full p-3 pl-4 pr-12 rounded-xl bg-gray-200/50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all" data-translate-key="searchInputPlaceholder">
                </div>
                <div id="recipeListContainer" class="space-y-2 flex-grow overflow-y-auto sleek-scrollbar -mr-2 pr-2"></div>
            </aside>
            <main id="recipeMainPanel" class="h-full flex-grow hidden md:flex flex-col min-h-0">
                <div class="glass-panel flex-grow overflow-y-auto p-6 lg:p-8 sleek-scrollbar">
                    <div id="welcomeAndChartContainer" class="flex flex-col items-center justify-center h-full">
                        <div id="welcomeText" class="text-center">
                            <h2 class="text-2xl md:text-3xl font-bold text-gray-700" data-translate-key="recipeDetailWelcomeTitle"></h2>
                            <p class="text-neutral-500 mt-2 max-w-xl mx-auto" data-translate-key="recipeDetailWelcomeText"></p>
                        </div>
                        <div id="colorMapContainer" class="flex-grow w-full mt-8"></div>
                    </div>
                    <div id="recipeContent" class="hidden"></div>
                </div>
            </main>
            <div id="recipeDetailPanelMobile" class="w-full h-full absolute inset-0 bg-[#f8f9fa] overflow-y-auto hidden sleek-scrollbar">
                <div class="p-4">
                    <button id="backToListBtn" class="btn bg-white/80 border border-gray-200 text-gray-800 mb-4 py-2 px-4" data-translate-key="backToListBtn"></button>
                    <div id="recipeContentMobile"></div>
                </div>
            </div>
        </div>`,
};

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
        if (state.currentView !== 'home') {
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
    const menu = document.getElementById('ultimateActionsMenu');
    if (!wrapper || !menu) return;

    // Xóa nút bấm cũ và nội dung menu cũ để tránh trùng lặp
    let existingButton = wrapper.querySelector('#ultimateCtaBtn');
    if (existingButton) {
        existingButton.remove();
    }
    menu.innerHTML = '';

    // HTML cho nút bấm chính
    const mainButtonHTML = `
        <button id="ultimateCtaBtn" class="liquid-glass-button" style="width: 72px; height: 72px; padding: 14px; border-radius: 28px;">
             <img id="ultimateCtaIcon" src="Logo.png" alt="Actions" style="width: 100%; height: auto; transition: transform 0.4s var(--ease-out-back); position: relative; z-index: 2;">
        </button>
    `;

    // Render dựa trên view hiện tại
    if (state.currentView === 'home') {
        wrapper.insertAdjacentHTML('beforeend', mainButtonHTML);
        menu.classList.add('hidden');
    } else if (state.currentView === 'recipeFormulas') {
        const menuActions = [
             { id: 'ultimateHomeBtn', key: 'backToHome', colorClass: 'btn-pastel-blue' },
             { id: 'ultimateQuizBtn', key: 'findMyColorBtn', colorClass: 'btn-pastel-red' },
             { key: 'sonyGuideBtn', href: 'https://helpguide.sony.net/di/pp/v1/en/contents/TP0000909106.html', colorClass: 'btn-pastel-yellow' },
             { key: 'contributeRecipeBtn', href: 'https://forms.gle/your-form-id', colorClass: 'btn-pastel-magenta' },
             { key: 'ctaButton', href: 'https://www.facebook.com/groups/sonyalphavietnamoffical', colorClass: 'btn-pastel-cyan' }
        ];

        menu.innerHTML = menuActions.reverse().map(action => {
            const commonAttrs = `class="btn ${action.colorClass}"`;
            const content = `<span data-translate-key="${action.key}"></span>`;
            if (action.href) {
                return `<a href="${action.href}" target="_blank" rel="noopener noreferrer" ${commonAttrs}>${content}</a>`;
            } else {
                return `<button id="${action.id}" ${commonAttrs}>${content}</button>`;
            }
        }).join('');
        
        wrapper.insertAdjacentHTML('beforeend', mainButtonHTML);
    }
    
    applyTranslations();
}


export function renderView(viewName, selectedId = null, attachViewEventListeners) {
    state.currentView = viewName;
    if (selectedId) { state.selectedRecipeId = selectedId; }

    const blobContainer = document.getElementById('blobContainer');
    const ultimateButtonContainer = document.getElementById('ultimateButtonContainer');

    if (viewName !== 'home') {
        document.body.style.overflowY = 'auto';
        if (state.animation.blobAnimationFrameId) {
            cancelAnimationFrame(state.animation.blobAnimationFrameId);
            state.animation.blobAnimationFrameId = null;
        }
        if(blobContainer) {
            blobContainer.querySelectorAll('.bg-blob').forEach(b => b.classList.remove('visible'));
        }
    } else {
        document.body.style.overflowY = 'hidden';
        if (!state.animation.blobAnimationFrameId) {
            initializeBackgroundBlobs();
        }
    }

    ultimateButtonContainer.classList.toggle('hidden', viewName !== 'home' && viewName !== 'recipeFormulas');

    return new Promise(resolve => {
        const currentContent = mainContentEl.children[0];
        if (currentContent) {
            currentContent.classList.add('view-transition-out');
            currentContent.addEventListener('animationend', () => {
                mainContentEl.innerHTML = viewTemplates[viewName]();
                if (attachViewEventListeners) attachViewEventListeners(viewName);
                renderUltimateButton();
                applyTranslations();
                resolve();
            }, { once: true });
        } else {
            mainContentEl.innerHTML = viewTemplates[viewName]();
            if (attachViewEventListeners) attachViewEventListeners(viewName);
            renderUltimateButton();
            applyTranslations();
            resolve();
        }
    });
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
            const recipe = recipesData.find(r => r.id === id);
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

export async function renderLibraryList() {
    const container = document.getElementById('recipeListContainer');
    if (!container) return;
    const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const trendingIds = await fetchTrendingRecipeIds();
    
    const recipesToRender = recipesData.filter(r => 
        r.name[getCurrentLanguage()].toLowerCase().includes(searchTerm) || 
        r.description[getCurrentLanguage()].toLowerCase().includes(searchTerm)
    );
    
    container.innerHTML = recipesToRender.map((recipe, index) => {
        const isSelected = recipe.id === state.selectedRecipeId;
        const isTrending = trendingIds.includes(recipe.id);
        const hasImages = recipeImages[recipe.id] && recipeImages[recipe.id].length > 0 && recipeImages[recipe.id].some(url => !url.includes('placehold.co'));
        const glowStyle = isSelected ? `--glow-color: ${recipe.personalityColor};` : '';
        const animationStyle = `animation-delay: ${index * 30}ms;`;
        
        const imageIconHTML = hasImages 
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image text-teal-500 flex-shrink-0"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`
            : '';

        const trendingIconHTML = isTrending 
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star text-yellow-400 flex-shrink-0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` 
            : '';

        return `<div class="recipe-item p-4 rounded-lg cursor-pointer ${isSelected ? 'selected' : ''} recipe-item-stagger" 
                     data-recipe-id="${recipe.id}" 
                     style="${glowStyle} ${animationStyle}">
            <div class="flex justify-between items-start">
                <span class="font-semibold text-primary pr-2">${formatRecipeName(recipe.name[getCurrentLanguage()])}</span>
                <div class="flex items-center gap-2 pt-1">
                    ${imageIconHTML}
                    ${trendingIconHTML}
                </div>
            </div>
            <p class="text-sm text-neutral-600 mt-1 leading-snug">${recipe.description[getCurrentLanguage()]}</p>
        </div>`;
    }).join('');
}

export function renderLibraryDetails() {
    const isMobile = window.innerWidth < 768;
    const recipeListPanel = document.getElementById('recipeListPanel');
    const recipeMainPanel = document.getElementById('recipeMainPanel');
    const recipeDetailPanelMobile = document.getElementById('recipeDetailPanelMobile');

    if (isMobile) {
        recipeListPanel.classList.toggle('hidden', state.isMobileDetailActive);
        if (state.isMobileDetailActive) {
            recipeDetailPanelMobile.classList.remove('hidden');
            setTimeout(() => recipeDetailPanelMobile.classList.add('visible'), 10);
        } else {
            recipeDetailPanelMobile.classList.remove('visible');
            recipeDetailPanelMobile.addEventListener('transitionend', () => {
                if (!recipeDetailPanelMobile.classList.contains('visible')) {
                    recipeDetailPanelMobile.classList.add('hidden');
                }
            }, { once: true });
        }
    } else {
        recipeListPanel?.classList.remove('hidden');
        recipeDetailPanelMobile?.classList.add('hidden');
        recipeDetailPanelMobile?.classList.remove('visible');
    }

    const recipe = recipesData.find(r => r.id === state.selectedRecipeId);
    let recipeContentContainer = isMobile && state.isMobileDetailActive 
        ? document.getElementById('recipeContentMobile') 
        : document.getElementById('recipeContent');
    let welcomeAndChartContainer = document.getElementById('welcomeAndChartContainer');
    
    if (!recipeContentContainer) return;

    if (!recipe) {
        if (welcomeAndChartContainer) welcomeAndChartContainer.classList.remove('hidden');
        recipeContentContainer.classList.add('hidden');
        if(!isMobile) recipeMainPanel?.classList.remove('hidden');
        return;
    }
    
    if (welcomeAndChartContainer) welcomeAndChartContainer.classList.add('hidden');
    recipeContentContainer.classList.remove('hidden');
    if(!isMobile) recipeMainPanel?.classList.remove('hidden');

    recipeContentContainer.innerHTML = `
        <div class="mb-4 hidden md:block">
            <button id="backToChartBtn" class="btn bg-white/60 border border-gray-200/80 text-gray-700 hover:bg-white/90 py-2 px-4 text-sm" data-translate-key="backToChartBtn"></button>
        </div>
        <div>
            <h3 class="text-3xl md:text-4xl font-bold">${formatRecipeName(recipe.name[getCurrentLanguage()])}</h3>
            <p class="text-lg text-neutral-600 mt-1">"${recipe.description[getCurrentLanguage()]}"</p>
        </div>
        <div class="mt-8">${createFullRecipeHTML(recipe)}</div>
    `;
    applyTranslations();
}
