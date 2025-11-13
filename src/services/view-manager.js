// File Path: src/services/view-manager.js
import { state } from './state.js';
import { initializeBackgroundBlobs, renderUltimateButton } from './ui.js';
import { applyTranslations, updateLangSlider } from './language.js';
import { renderColorMapChart } from './features.js';
import { renderLibraryList, renderLibraryDetails } from '../components/recipe-list/recipe-list-ui.js';

const mainContentEl = document.getElementById('mainContent');

const viewTemplates = {
    home: () => `
        <div id="homeView" class="w-full h-full flex flex-col items-center justify-center text-center absolute inset-0 p-6 md:p-8">
            <div class="max-w-3xl">
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 mb-4" style="text-wrap: balance;" data-translate-key="landingTitle"></h1>
                <p class="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mt-4" style="text-wrap: balance;" data-translate-key="landingSubtitle"></p>
            </div>

            <!-- Color Map for Desktop -->
            <div id="homeColorMapContainer" class="w-full max-w-4xl flex-grow my-8 cursor-pointer hidden md:block"></div>

            <!-- Action Buttons for Mobile -->
            <div class="md:hidden mt-12 w-full max-w-sm space-y-4">
                 <button id="enterLabBtn" class="btn btn-primary w-full py-4 text-lg">
                    <span data-translate-key="enterLabBtn"></span>
                 </button>
                 <button id="findMyColorBtn" class="btn bg-white/80 border border-gray-200 text-gray-800 hover:bg-white/90 w-full py-4 text-lg">
                    <span data-translate-key="findMyColorBtn"></span>
                 </button>
            </div>
        </div>`,
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
    userProfile: () => `
        <div id="userProfileViewContainer" class="w-full h-full max-w-7xl mx-auto view-transition">
            <!-- Profile content will be rendered by profile-ui.js -->
        </div>`
};

export async function attachViewEventListeners(viewName) {
    if (viewName === 'home') {
        initializeBackgroundBlobs();
        const homeChartContainer = document.getElementById('homeColorMapContainer');
        if (homeChartContainer && window.innerWidth >= 768) { // Only observe if on desktop
            const resizeObserver = new ResizeObserver(entries => {
                if (entries && entries.length > 0 && entries[0].contentRect.width > 0) {
                     renderColorMapChart('#homeColorMapContainer', state.allRecipes);
                     resizeObserver.unobserve(homeChartContainer);
                }
            });
            resizeObserver.observe(homeChartContainer);
        }
    }
    if (viewName === 'recipeFormulas') {
        await renderLibraryList();
        await renderLibraryDetails();

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

        const chartContainer = document.getElementById('colorMapContainer');
        if (chartContainer) {
            const resizeObserver = new ResizeObserver(entries => {
                if (entries && entries.length > 0 && entries[0].contentRect.width > 0) {
                     renderColorMapChart('#colorMapContainer', state.allRecipes);
                     resizeObserver.unobserve(chartContainer);
                }
            });
            resizeObserver.observe(chartContainer);
        }
        updateLangSlider();
    }
    if (viewName === 'userProfile') {
        const { renderUserProfilePage } = await import('../components/profile-ui.js');
        if (state.auth.user) {
            renderUserProfilePage(state.auth.user.uid);
        } else {
            const container = document.getElementById('userProfileViewContainer');
            if (container) {
                 container.innerHTML = `<div class="text-center mt-20"><p class="text-xl">Please log in to view your profile.</p></div>`;
            }
        }
    }
}

export function renderView(viewName, selectedId = null) {
    state.ui.currentView = viewName;
    if (selectedId) { state.ui.selectedRecipeId = selectedId; }

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
            currentContent.addEventListener('animationend', async () => {
                mainContentEl.innerHTML = viewTemplates[viewName]();
                await attachViewEventListeners(viewName);
                renderUltimateButton();
                applyTranslations();
                resolve();
            }, { once: true });
        } else {
            mainContentEl.innerHTML = viewTemplates[viewName]();
            attachViewEventListeners(viewName);
            renderUltimateButton();
            applyTranslations();
            resolve();
        }
    });
}
