// File Path: src/services/view-manager.js
import { state } from './state.js';
import { initializeBackgroundBlobs } from './ui.js';
import { applyTranslations, updateLangSlider } from './language.js';
import { renderLibraryList, renderLibraryDetails } from '../components/recipe-list/recipe-list-ui.js';
import recipesData from './recipes.js';

const mainContentEl = document.getElementById('mainContent');

const viewTemplates = {
    recipeFormulas: () => `
        <!-- Removed 'view-transition' class from this parent div. 
             This is CRITICAL. If the parent has a transform/animation, 
             the fixed child (sidebar) becomes relative to this div (below header) 
             instead of the viewport (top of screen). -->
        <div id="recipeFormulasView" class="w-full h-full flex flex-col md:flex-row absolute inset-0">
            
            <!-- SIDEBAR: 
                 1. !fixed !h-screen !top-0 !left-0: Forces it to stick to the viewport edges.
                 2. view-transition: Animates the sidebar itself. Since the parent has no transform, this works correctly.
                 3. z-50: Ensures it overlays the header. -->
            <aside id="recipeListPanel" class="view-transition w-full md:!fixed md:!top-0 md:!left-0 md:!h-screen md:w-[320px] lg:w-[25%] z-50 bg-white/60 backdrop-blur-md border-r border-gray-200 p-4 md:p-5 flex flex-col transition-all duration-300">
                <div class="relative mb-4 flex-shrink-0">
                    <input type="search" id="searchInput" class="w-full p-3 pl-4 pr-12 rounded-xl bg-gray-200/50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all" placeholder="Find your signature style">
                </div>
                <div id="recipeListFilter"></div>
                <div id="recipeListContainer" class="space-y-2 flex-grow overflow-y-auto sleek-scrollbar -mr-2 pr-2"></div>
            </aside>
            
            <!-- MAIN CONTENT: 
                 1. view-transition: Animates in sync with sidebar.
                 2. md:ml-...: Adds margin to prevent content from hiding behind the fixed sidebar. -->
            <main id="recipeMainPanel" class="view-transition h-full flex-grow hidden md:flex flex-col min-h-0 md:ml-[320px] lg:ml-[25%] transition-all duration-300">
                <div class="w-full h-full flex-grow overflow-y-auto p-6 lg:p-8 sleek-scrollbar">
                    <div id="welcomeAndChartContainer" class="w-full h-full flex flex-col items-center justify-start p-4 overflow-y-auto">
                         <div class="max-w-4xl w-full space-y-8 text-center">
                            <!-- Hero Section -->
                            <div class="space-y-4">
                                <h1 class="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                                    Unlock Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Sony Alpha's</span> True Potential
                                </h1>
                                <p class="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
                                    Discover a library of film-inspired color recipes. Create cinematic looks straight out of camera. No grading required.
                                </p>
                            </div>

                            <!-- Feature Grid -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
                                <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                                    <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
                                    </div>
                                    <h3 class="text-xl font-bold text-gray-900 mb-2">Curated Recipes</h3>
                                    <p class="text-gray-600">Access a growing collection of styles, from vintage Kodak film stocks to modern cinematic looks.</p>
                                </div>
                                <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                                    <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                                    </div>
                                    <h3 class="text-xl font-bold text-gray-900 mb-2">AI-Powered Colorist</h3>
                                    <p class="text-gray-600">Describe the mood you want, and our Gemini AI will generate a custom Picture Profile setting just for you.</p>
                                </div>
                                <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                                    <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 text-green-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-camera"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                                    </div>
                                    <h3 class="text-xl font-bold text-gray-900 mb-2">SOOC Perfection</h3>
                                    <p class="text-gray-600">Save time on editing. Get beautiful, share-ready JPEGs straight out of camera (SOOC).</p>
                                </div>
                            </div>

                            <!-- Call to Action -->
                            <div class="mt-12 py-8">
                                <p class="text-lg font-medium text-gray-500 mb-6">Start exploring now. Select a recipe from the list on the left.</p>
                                <div class="inline-flex items-center justify-center p-1 rounded-full bg-gray-100 border border-gray-200">
                                    <span class="px-4 py-1 text-sm font-semibold text-gray-600">Beta Version 1.0</span>
                                </div>
                            </div>
                         </div>
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

    document.body.style.overflowY = 'auto';
    if (state.animation.blobAnimationFrameId) {
        cancelAnimationFrame(state.animation.blobAnimationFrameId);
        state.animation.blobAnimationFrameId = null;
    }
    if(blobContainer) {
        blobContainer.querySelectorAll('.bg-blob').forEach(b => b.classList.remove('visible'));
    }

    return new Promise(resolve => {
        const currentContent = mainContentEl.children[0];
        if (currentContent) {
            currentContent.classList.add('view-transition-out');
            currentContent.addEventListener('animationend', async () => {
                mainContentEl.innerHTML = viewTemplates[viewName]();
                await attachViewEventListeners(viewName);
                applyTranslations();
                resolve();
            }, { once: true });
        } else {
            mainContentEl.innerHTML = viewTemplates[viewName]();
            attachViewEventListeners(viewName);
            applyTranslations();
            resolve();
        }
    });
}
