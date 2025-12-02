// File Path: src/services/view-manager.js
import { state } from './state.js';
import { initializeBackgroundBlobs } from './ui.js';
import { applyTranslations, updateLangSlider } from './language.js';
import { renderLibraryList, renderLibraryDetails } from '../components/recipe-list/recipe-list-ui.js';
import { initGuideFeatures } from './features.js';
import recipesData from './recipes.js';

const mainContentEl = document.getElementById('mainContent');

const viewTemplates = {
    recipeFormulas: () => `
        <div id="recipeFormulasView" class="w-full h-full flex flex-col md:flex-row absolute inset-0">
            <!-- SIDEBAR: Fixed full height on desktop -->
            <aside id="recipeListPanel" class="view-transition w-full md:!fixed md:!top-0 md:!left-0 md:!h-screen md:w-[320px] lg:w-[25%] z-50 bg-white/60 backdrop-blur-md border-r border-gray-200 p-4 md:p-5 flex flex-col transition-all duration-300">
                <div class="mb-6 flex justify-center md:justify-start flex-shrink-0 cursor-pointer" id="sidebarLogoBtn">
                    <img src="/assets/logo_black.png" alt="Alpha AI Color Lab" class="h-24 w-auto object-contain hover:opacity-80 transition-opacity">
                </div>
                <div class="relative mb-4 flex-shrink-0">
                    <input type="search" id="searchInput" class="w-full p-3 pl-4 pr-12 rounded-xl bg-gray-200/50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all" placeholder="Find your signature style">
                </div>
                <div id="recipeListFilter"></div>
                <div id="recipeListContainer" class="space-y-2 flex-grow overflow-y-auto sleek-scrollbar -mr-2 pr-2"></div>
            </aside>
            
            <!-- MAIN CONTENT: Pushed right on desktop -->
            <main id="recipeMainPanel" class="view-transition h-full flex-grow hidden md:flex flex-col min-h-0 md:ml-[320px] lg:ml-[25%] transition-all duration-300">
                <div class="w-full h-full flex-grow overflow-y-auto p-6 lg:p-8 sleek-scrollbar">
                    <div id="welcomeAndChartContainer" class="w-full h-full flex flex-col items-center justify-start p-4 overflow-y-auto">
                         <div class="max-w-full w-full space-y-8 text-center">
                            <!-- Hero Section -->
                            <div class="space-y-4">
                                <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                                    Unlock Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Sony Alpha's</span> True Potential
                                </h1>
                                <p class="text-base md:text-lg text-gray-600 max-w-2xl mx-auto line-clamp-3">
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
                                    <p class="text-gray-600 line-clamp-3">Access a growing collection of styles, from vintage Kodak film stocks to modern cinematic looks.</p>
                                </div>
                                
                                <!-- AI-Powered Colorist Card (Updated) -->
                                <div id="openNewColorBakingBtn" class="p-6 bg-white rounded-2xl shadow-sm border border-purple-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-purple-300 transition-all duration-300 group relative overflow-hidden">
                                    <div class="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div class="relative z-10">
                                        <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600 group-hover:scale-110 transition-transform duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                                        </div>
                                        <div class="flex justify-between items-center mb-2">
                                            <h3 class="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">AI-Powered Colorist</h3>
                                            <span class="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-purple-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                            </span>
                                        </div>
                                        <p class="text-gray-600 line-clamp-3 group-hover:text-gray-800">Enter the Color Lab. Mix ingredients and prompt Gemini AI to bake a custom Picture Profile just for you.</p>
                                    </div>
                                </div>

                                <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                                    <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 text-green-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-camera"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                                    </div>
                                    <h3 class="text-xl font-bold text-gray-900 mb-2">SOOC Perfection</h3>
                                    <p class="text-gray-600 line-clamp-3">Save time on editing. Get beautiful, share-ready JPEGs straight out of camera (SOOC).</p>
                                </div>
                            </div>

                            <!-- START OF MIGRATED GUIDE CONTENT -->
                            
                            <!-- Global State Controller: Camera Model -->
                            <section class="mt-12 text-left">
                                <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                                    <h2 class="text-xl font-bold mb-4 text-slate-800">📷 Select Your Camera System</h2>
                                    <p class="text-slate-600 mb-6">Sony menus changed drastically in 2021. Select your model to customize this guide.</p>
                                    
                                    <div class="flex flex-col sm:flex-row gap-4">
                                        <button id="btn-new-menu" data-menu="new" class="guide-menu-btn flex-1 py-4 px-6 rounded-lg border-2 font-bold text-lg flex items-center justify-center gap-2 guide-active-tab transition-colors">
                                            <span>New Menu System</span>
                                            <span class="text-xs font-normal block sm:inline opacity-75">(A7IV, A7SIII, FX3, A6700)</span>
                                        </button>
                                        <button id="btn-old-menu" data-menu="old" class="guide-menu-btn flex-1 py-4 px-6 rounded-lg border-2 font-bold text-lg flex items-center justify-center gap-2 guide-inactive-tab transition-colors">
                                            <span>Old Menu System</span>
                                            <span class="text-xs font-normal block sm:inline opacity-75">(A7III, A6000s, A6400)</span>
                                        </button>
                                    </div>

                                    <!-- Video Guide Container -->
                                    <div id="guide-video-container" class="mt-6 w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-sm">
                                        <!-- Video content injected via features.js -->
                                    </div>
                                </div>
                            </section>

                            <!-- Section 1: Concept & Prep -->
                            <section id="prep" class="mt-12 text-left">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <!-- Concept Card -->
                                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                        <h3 class="text-2xl font-bold text-slate-800 mb-4">💡 The Concept</h3>
                                        <p class="text-slate-600 mb-4">Standard RAW photos are flat. Picture Profiles (PP) manipulate the signal <strong>before compression</strong>.</p>
                                        <div class="flex gap-4 items-center bg-slate-50 p-4 rounded-lg">
                                            <div class="text-center w-1/2">
                                                <div class="text-3xl mb-2">📱</div>
                                                <div class="font-bold text-sm text-slate-700">Recipe Book</div>
                                                <div class="text-xs text-slate-500">Sony Color Lab</div>
                                            </div>
                                            <div class="text-2xl text-slate-300">➜</div>
                                            <div class="text-center w-1/2">
                                                <div class="text-3xl mb-2">📷</div>
                                                <div class="font-bold text-sm text-slate-700">The Kitchen</div>
                                                <div class="text-xs text-slate-500">Camera Menu</div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Prep Checklist -->
                                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                        <h3 class="text-2xl font-bold text-slate-800 mb-4">🛠️ Preparation</h3>
                                        <p class="text-sm text-slate-600 mb-4">Ensure instant access in the field by adding this web app to your home screen.</p>
                                        <ul class="space-y-3">
                                            <li class="flex items-center gap-3 cursor-pointer group guide-checklist-item">
                                                <div class="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-white transition-colors group-hover:border-orange-400 check-circle">✓</div>
                                                <span class="text-slate-700 select-none">Open <strong>sonycolorlab.app</strong> on browser</span>
                                            </li>
                                            <li class="flex items-center gap-3 cursor-pointer group guide-checklist-item">
                                                <div class="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-white transition-colors group-hover:border-orange-400 check-circle">✓</div>
                                                <span class="text-slate-700 select-none">Tap <strong>Share</strong> (iOS) or <strong>Three Dots</strong> (Android)</span>
                                            </li>
                                            <li class="flex items-center gap-3 cursor-pointer group guide-checklist-item">
                                                <div class="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-white transition-colors group-hover:border-orange-400 check-circle">✓</div>
                                                <span class="text-slate-700 select-none">Select <strong>"Add to Home Screen"</strong></span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <!-- Section 2: Navigation Map (Dynamic) -->
                            <section class="mt-16 text-left">
                                <h3 class="text-2xl font-bold text-slate-800 mb-2">📍 Finding the Menu</h3>
                                <p class="text-slate-600 mb-6">Follow the path below to locate the Picture Profile settings for your <span id="camera-model-text" class="font-bold text-orange-600">New Menu System</span>.</p>
                                
                                <div class="bg-slate-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
                                    <div class="absolute top-0 right-0 p-4 opacity-10 text-9xl">⚙️</div>
                                    
                                    <div id="path-container" class="flex flex-col md:flex-row items-start md:items-center gap-4 text-sm md:text-base font-mono">
                                        <!-- Content injected via JS -->
                                    </div>
                                </div>
                            </section>

                            <!-- Section 3: The Ingredients -->
                            <section class="mt-16 text-left">
                                <div class="mb-8">
                                    <h3 class="text-2xl font-bold text-slate-800 mb-2">🧪 The Ingredients</h3>
                                    <p class="text-slate-600">A Picture Profile is built from five key settings. Click on any card below to understand its role in the "Film Look".</p>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <!-- Gamma -->
                                    <div class="guide-step-card bg-white p-6 rounded-xl shadow-sm border border-slate-200 cursor-pointer guide-ingredient-card" data-ingredient="gamma">
                                        <div class="flex justify-between items-start mb-4">
                                            <h4 class="font-bold text-lg text-slate-800">1. Gamma</h4>
                                            <span class="text-2xl">📈</span>
                                        </div>
                                        <p class="text-sm text-slate-500 mb-2">The Contrast Backbone</p>
                                        <div id="desc-gamma" class="hidden text-sm text-slate-700 bg-slate-50 p-3 rounded mt-2 border-l-2 border-orange-500">
                                            <p class="mb-2"><strong>Cine2:</strong> Limits highlights (100%) but lifts shadows. Creates a matte, filmic base.</p>
                                            <p class="mb-2"><strong>S-Log2:</strong> Max dynamic range. Harder to use.</p>
                                            <p><strong>Still:</strong> Standard punchy digital look.</p>
                                        </div>
                                    </div>

                                    <!-- Black Level -->
                                    <div class="guide-step-card bg-white p-6 rounded-xl shadow-sm border border-slate-200 cursor-pointer guide-ingredient-card" data-ingredient="blackLevel">
                                        <div class="flex justify-between items-start mb-4">
                                            <h4 class="font-bold text-lg text-slate-800">2. Black Level</h4>
                                            <span class="text-2xl">🌗</span>
                                        </div>
                                        <p class="text-sm text-slate-500 mb-2">Controls Shadow Lift</p>
                                        <div id="desc-blackLevel" class="hidden text-sm text-slate-700 bg-slate-50 p-3 rounded mt-2 border-l-2 border-orange-500">
                                            <p class="mb-2"><strong>Positive (+):</strong> Fades blacks to dark gray (Vintage/Faded look).</p>
                                            <p><strong>Negative (-):</strong> Crushes blacks for high contrast (Moody look).</p>
                                        </div>
                                    </div>

                                    <!-- Color Mode -->
                                    <div class="guide-step-card bg-white p-6 rounded-xl shadow-sm border border-slate-200 cursor-pointer guide-ingredient-card" data-ingredient="colorMode">
                                        <div class="flex justify-between items-start mb-4">
                                            <h4 class="font-bold text-lg text-slate-800">3. Color Mode</h4>
                                            <span class="text-2xl">🎨</span>
                                        </div>
                                        <p class="text-sm text-slate-500 mb-2">The Palette & Saturation</p>
                                        <div id="desc-colorMode" class="hidden text-sm text-slate-700 bg-slate-50 p-3 rounded mt-2 border-l-2 border-orange-500">
                                            <p class="mb-2"><strong>Pro / Cinema:</strong> Use these for analog emulation. Less "digital" than standard.</p>
                                            <p><strong>Saturation:</strong> -2 to -4 for pastel, +2 for slide film.</p>
                                        </div>
                                    </div>

                                    <!-- Color Depth -->
                                    <div class="guide-step-card bg-white p-6 rounded-xl shadow-sm border border-slate-200 cursor-pointer guide-ingredient-card" data-ingredient="colorDepth">
                                        <div class="flex justify-between items-start mb-4">
                                            <h4 class="font-bold text-lg text-slate-800">4. Color Depth</h4>
                                            <span class="text-2xl">🧪</span>
                                        </div>
                                        <p class="text-sm text-slate-500 mb-2">The Secret Sauce</p>
                                        <div id="desc-colorDepth" class="hidden text-sm text-slate-700 bg-slate-50 p-3 rounded mt-2 border-l-2 border-orange-500">
                                            <p>Adjusts luminance of specific channels (R, G, B, C, M, Y). Boosting "Red" here deepens skin tones without oversaturating the whole image. <strong>Do not skip.</strong></p>
                                        </div>
                                    </div>

                                    <!-- Detail -->
                                    <div class="guide-step-card bg-white p-6 rounded-xl shadow-sm border border-slate-200 cursor-pointer guide-ingredient-card" data-ingredient="detail">
                                        <div class="flex justify-between items-start mb-4">
                                            <h4 class="font-bold text-lg text-slate-800">5. Detail</h4>
                                            <span class="text-2xl">🔪</span>
                                        </div>
                                        <p class="text-sm text-slate-500 mb-2">Sharpness Control</p>
                                        <div id="desc-detail" class="hidden text-sm text-slate-700 bg-slate-50 p-3 rounded mt-2 border-l-2 border-orange-500">
                                            <p><strong>Set to -7:</strong> Removes artificial digital sharpening. Essential for an organic, soft look that mimics scanned film.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- Section 4: Critical Rules (Visualization) -->
                            <section id="exposure" class="mt-16 text-left mb-16">
                                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    
                                    <!-- Left: Text Context -->
                                    <div class="lg:col-span-1">
                                        <h3 class="text-2xl font-bold text-slate-800 mb-4">⚠️ Critical Shooting Rules</h3>
                                        <p class="text-slate-600 mb-6">Using profiles requires changing how you expose and set white balance. Failing to do this will ruin the "baked in" look.</p>
                                        
                                        <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                                            <h4 class="font-bold text-red-700 text-sm uppercase mb-1">Mandatory Rule</h4>
                                            <p class="text-red-900 font-bold">Set White Balance Manually!</p>
                                            <p class="text-red-800 text-sm mt-1">Picture Profiles do not control tint. You MUST input the specific WB Shift (e.g., A2 M1) from the recipe.</p>
                                        </div>

                                        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                            <h4 class="font-bold text-blue-700 text-sm uppercase mb-1">Workflow Tip</h4>
                                            <p class="text-blue-900 font-bold">Memory Recall (MR)</p>
                                            <p class="text-blue-800 text-sm mt-1">Save your PP + WB + Exposure settings to Memory Slot 1. Switch to "1" on the dial to load the full recipe instantly.</p>
                                        </div>
                                    </div>

                                    <!-- Right: Exposure Chart -->
                                    <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                                        <h4 class="font-bold text-slate-700 mb-4">Exposure Compensation Rules (Ev)</h4>
                                        
                                        <!-- Chart Container -->
                                        <div class="chart-container">
                                            <canvas id="exposureChart"></canvas>
                                        </div>
                                        <p class="text-center text-xs text-slate-500 mt-2">
                                            * Values indicate how much brighter you should expose compared to the camera's meter reading (0).
                                        </p>
                                    </div>
                                </div>
                            </section>
                            
                            <!-- END OF MIGRATED GUIDE CONTENT -->

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
        initGuideFeatures(); // Initialize charts and dynamic menu content
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
