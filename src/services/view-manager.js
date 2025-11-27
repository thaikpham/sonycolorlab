// File Path: src/services/view-manager.js
import { state } from './state.js';
import { initializeBackgroundBlobs } from './ui.js';
import { applyTranslations, updateLangSlider } from './language.js';
import { renderLibraryList, renderLibraryDetails } from '../components/recipe-list/recipe-list-ui.js';
import recipesData from './recipes.js';

const mainContentEl = document.getElementById('mainContent');

const viewTemplates = {
    recipeFormulas: () => `
        <div id="recipeFormulasView" class="w-full h-full flex flex-col md:flex-row absolute inset-0 view-transition">
            <aside id="recipeListPanel" class="h-full w-full md:w-auto md:flex-shrink-0 glass-panel p-4 md:p-5 flex flex-col">
                <div class="relative mb-4 flex-shrink-0">
                    <input type="search" id="searchInput" class="w-full p-3 pl-4 pr-12 rounded-xl bg-gray-200/50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all" data-translate-key="searchInputPlaceholder">
                </div>
                <div id="recipeListFilter"></div>
                <div id="recipeListContainer" class="space-y-2 flex-grow overflow-y-auto sleek-scrollbar -mr-2 pr-2"></div>
            </aside>
            <main id="recipeMainPanel" class="h-full flex-grow hidden md:flex flex-col min-h-0">
                <div class="glass-panel flex-grow overflow-y-auto p-6 lg:p-8 sleek-scrollbar">
                    <div id="welcomeAndChartContainer" class="w-full h-full flex items-center justify-center p-4 overflow-hidden">
                         <img src="https://raw.githubusercontent.com/thaikpham/color-lab-flyer/main/ColorLAB%20Flyer.png" 
                              alt="Color Lab Flyer" 
                              class="max-w-full max-h-full object-contain rounded-2xl shadow-sm"
                              style="width: auto; height: auto;" />
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

export async function attachViewEventListeners(viewName) {
    if (viewName === 'recipeFormulas') {
        renderLibraryList();
        renderLibraryDetails();

        const view = document.getElementById('recipeFormulasView');
        const listPanel = document.getElementById('recipeListPanel');
        const mainPanel = document.getElementById('recipeMainPanel');

        if (view && listPanel && mainPanel && window.innerWidth >= 1024) {
            const setStageActive = () => view.classList.remove('stage-inactive');
            const setStageInactive = () => view.classList.add('stage-inactive');

            setTimeout(setStageInactive, 500);

            listPanel.addEventListener('mouseenter', setStageActive);
            mainPanel.addEventListener('mouseenter', setStageInactive);
        }
        // Chart initialization removed
        updateLangSlider();
    }
}

export function renderView(viewName, selectedId = null) {
    if (viewName === 'home') {
        viewName = 'recipeFormulas';
    }
    state.ui.currentView = viewName;
    if (selectedId) { state.ui.selectedRecipeId = selectedId; }

    const blobContainer = document.getElementById('blobContainer');
    // ultimateButtonContainer removed

    document.body.style.overflowY = 'auto';
    if (state.animation.blobAnimationFrameId) {
        cancelAnimationFrame(state.animation.blobAnimationFrameId);
        state.animation.blobAnimationFrameId = null;
    }
    if(blobContainer) {
        blobContainer.querySelectorAll('.bg-blob').forEach(b => b.classList.remove('visible'));
    }

    // ultimateButtonContainer toggle logic removed

    return new Promise(resolve => {
        const currentContent = mainContentEl.children[0];
        if (currentContent) {
            currentContent.classList.add('view-transition-out');
            currentContent.addEventListener('animationend', async () => {
                mainContentEl.innerHTML = viewTemplates[viewName]();
                await attachViewEventListeners(viewName);
                // renderUltimateButton removed
                applyTranslations();
                resolve();
            }, { once: true });
        } else {
            mainContentEl.innerHTML = viewTemplates[viewName]();
            attachViewEventListeners(viewName);
            // renderUltimateButton removed
            applyTranslations();
            resolve();
        }
    });
}
