// File Path: src/services/view-manager.js
import { state } from './state.js';
import { initializeBackgroundBlobs, renderUltimateButton } from './ui.js';
import { applyTranslations, updateLangSlider } from './language.js';
import { renderLibraryList, renderLibraryDetails } from '../components/recipe-list/recipe-list-ui.js';
import { initLandingEventListeners } from './landing-events.js';

const mainContentEl = document.getElementById('mainContent');

const viewTemplates = {
  landing: () => `
    <div class="p-4 sm:p-8 md:p-12">
        <link rel="stylesheet" href="/landing/style.css">
        <main class="max-w-3xl mx-auto space-y-8">

        <!-- Header -->
        <header class="text-center mb-4">
            <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4" style="text-wrap: balance;">From the Web to Your Camera</h1>
            <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">A step-by-step guide to installing color recipes on your Sony camera</p>
        </header>

        <!-- Steps -->
        <div class="space-y-8">
            <!-- STEP 1: ENTER PARAMETERS -->
            <div class="section-card">
                <div class="flex items-start gap-4">
                    <div class="step-number">1</div>
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900">Enter Parameters</h2>
                        <p class="text-gray-600 mt-1">Use your camera's menu to set the two main parameters.</p>
                    </div>
                </div>
                <div class="mt-8 space-y-6 pl-4 border-l-2 border-gray-100 ml-5">
                    <div>
                        <h3 class="font-semibold text-lg">White Balance (WB)</h3>
                        <p class="text-sm text-gray-500 mt-1">Fine-tune the color temperature and tint of your image.</p>
                        <div class="mt-2"><span class="path-text">Menu → White Balance → Adjust</span></div>
                    </div>
                    <div>
                        <h3 class="font-semibold text-lg">Picture Profile</h3>
                        <p class="text-sm text-gray-500 mt-1">Apply color formulas and dynamic range settings.</p>
                        <div class="mt-2"><span class="path-text">Menu → Picture Profile → Select & Enter</span></div>
                    </div>
                </div>
            </div>

            <!-- STEP 2: TEST THE RECIPES -->
            <div class="section-card">
                 <div class="flex items-start gap-4">
                    <div class="step-number">2</div>
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900">Test the Recipes</h2>
                        <p class="text-gray-600 mt-1">Don't know where to start? Choose one of the popular recipes below.</p>
                    </div>
                </div>
                <!-- Recipe Cards Grid -->
                <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Card 1: Mojave Sun -->
                    <div class="recipe-card" data-modal-target="#modal-scl01">
                        <img src="https://lh3.googleusercontent.com/pw/AP1GczPC_ounREkB_Q6oj6ZM7ckVGcKKZ_saJP5O63nURHPk09iTI8l4YwSqUzyxJm8ZG760nUJhm5JgmMWyk4uGlDDaaWwjJJPO4E9IAoF1pNfMHqx-2g3OcDS2COZ1w93K8j16X08W24leuMEhZvXx6L4uyw=w736-h1105-s-no?authuser=0" alt="Mojave Sun film tone" class="recipe-card-image">
                        <div class="recipe-card-content">
                            <h3 class="text-xl font-bold mb-2">SCL-01: Mojave Sun</h3>
                            <p class="text-gray-600 text-sm">A nostalgic film tone with warm yellows, perfect for travel and lifestyle.</p>
                        </div>
                    </div>
                    <!-- Card 2: Daylight Cinema -->
                    <div class="recipe-card" data-modal-target="#modal-scl27">
                        <img src="https://lh3.googleusercontent.com/pw/AP1GczO2Zg9sIDNNb_6VjMP87b8-ADz04gPG7sMtACcq_icK4VBnyfX9HqCuj_KINNrJsAB9vtZWX-PWQlJWvD5UwVIsgqDz599aVKQWPdi7K_MeSKuWCSwe9paPaQ9AF7EWHRtg3y6xo_4YRiXkXAxfIxvpag=w745-h1077-s-no?authuser=0" alt="Pinkish-white skin tone" class="recipe-card-image">
                         <div class="recipe-card-content">
                            <h3 class="text-xl font-bold mb-2">SCL-27: Daylight Cinema</h3>
                            <p class="text-gray-600 text-sm">A clean, pinkish-white skin tone. For daylight conditions.</p>
                        </div>
                    </div>
                    <!-- Card 3: PROCOLOR-003 -->
                    <div class="recipe-card" data-modal-target="#modal-procolor003">
                        <img src="https://lh3.googleusercontent.com/pw/AP1GczPr5IM9fb8Mxygh4GGj44LBb0b4IXpdKOoRm_nPd8RtU1mbQONyQ36KZZs7PQImtpbA3xhWKp7S3AO534tRrgbssXY_dp3SBgQ7Y0hQPY7wymdLYCrTIp3KqeJb2RJcBjuPfNSmP3hXUgkHHujBcKZE4g=w442-h957-s-no?authuser=0" alt="Livestream" class="recipe-card-image">
                         <div class="recipe-card-content">
                            <h3 class="text-xl font-bold mb-2">PROCOLOR-003</h3>
                            <p class="text-gray-600 text-sm">For professional live streaming, preventing overexposure from harsh lighting.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- Enter Lab Button -->
        <div class="text-center mt-8">
            <button id="enterLabBtn" class="btn btn-primary w-full max-w-sm py-4 text-lg">Enter the Lab</button>
        </div>

        <!-- Footer -->
        <footer class="text-center mt-8 pt-8 border-t border-gray-200">
            <p class="text-gray-500 text-sm">Source & Color Recipes: <a href="https://sonycolorlab.app" target="_blank" class="font-semibold text-blue-600 hover:text-blue-500">sonycolorlab.app</a></p>
        </footer>

    </main>

    <!-- Image Lightbox Structure -->
    <div id="lightbox">
        <span id="lightbox-close">&times;</span>
        <img id="lightbox-image" src="" alt="Xem ảnh lớn">
    </div>

    <!-- Video Lightbox Structure -->
    <div id="video-lightbox" class="video-lightbox-overlay">
        <div class="video-lightbox-content">
            <span id="video-lightbox-close">&times;</span>
            <div id="video-player-container"></div>
        </div>
    </div>


    <!-- RECIPE MODALS (Content unchanged) -->
    <!-- Modal 1: SCL-01 -->
    <div id="modal-scl01" class="recipe-modal">
        <div class="recipe-modal-content">
            <button class="close-modal-btn">&times;</button>
            <div class="photo-collage mb-6">
                <img src="https://lh3.googleusercontent.com/pw/AP1GczPC_ounREkB_Q6oj6ZM7ckVGcKKZ_saJP5O63nURHPk09iTI8l4YwSqUzyxJm8ZG760nUJhm5JgmMWyk4uGlDDaaWwjJJPO4E9IAoF1pNfMHqx-2g3OcDS2COZ1w93K8j16X08W24leuMEhZvXx6L4uyw=w736-h1105-s-no?authuser=0" alt="Mojave Sun film tone 1" class="demo-image main-image" style="object-position: 50% 30%;">
                <img src="https://lh3.googleusercontent.com/pw/AP1GczPPT3oBJKObBMX8NEdTxe-PLC2BEd0eRGUMSUiYxocel93ljDNFyG58LJiiPhijnKyWkjJbkSim54sWvSLrRxeM22uF82BlckublQ4qsSic7gwhAVe-XX0jEzRuxDJG7j25PHU6tLUGIT0IRHjy_AvXuQ=w1658-h1105-s-no?authuser=0" alt="Mojave Sun film tone 2" class="demo-image">
                <img src="https://lh3.googleusercontent.com/pw/AP1GczPwAttTxhJ89lhQ4Lbp9Klq73D30WWsG21oDGzsTZ9ig_5IYa3hLxdsQnMIb-8xJF-SOUMsNjaoGm-1RbfHrcRDn8lrLR7krn4ubwBkoe7fKqWes36h-8T05_EvDvJiHM04HZYdZzSkJ_4O2y7yhyXc3A=w1658-h1105-s-no?authuser=0" alt="Mojave Sun film tone 3" class="demo-image">
            </div>
            <h3 class="text-2xl font-bold">SCL-01: Mojave Sun</h3>
            <p class="text-gray-600 mb-6">A nostalgic film tone with warm yellows, perfect for travel and lifestyle.</p>
            <div class="space-y-6">
                <div><h4 class="recipe-section-title">White Balance</h4><div class="param-item w-full"><div class="param-key">WB</div><div class="param-value">7000K, B3-M1.5</div></div></div>
                <div><h4 class="recipe-section-title">Picture Profile</h4><div class="param-grid"><div class="param-item"><div class="param-key">Black level</div><div class="param-value">-7</div></div><div class="param-item"><div class="param-key">Gamma</div><div class="param-value">Cine1</div></div><div class="param-item"><div class="param-key">Black Gamma</div><div class="param-value">Wide +5</div></div><div class="param-item"><div class="param-key">Knee</div><div class="param-value">Manual 75% +2</div></div><div class="param-item"><div class="param-key">Color Mode</div><div class="param-value">S-Gamut3</div></div><div class="param-item"><div class="param-key">Saturation</div><div class="param-value">+25</div></div><div class="param-item"><div class="param-key">Color Phase</div><div class="param-value">+1</div></div></div></div>
                <div><h4 class="recipe-section-title">Color Depth</h4><div class="param-grid grid-cols-3 sm:grid-cols-6"><div class="param-item"><div class="param-key">R</div><div class="param-value">-1</div></div><div class="param-item"><div class="param-key">G</div><div class="param-value">+1</div></div><div class="param-item"><div class="param-key">B</div><div class="param-value">+5</div></div><div class="param-item"><div class="param-key">C</div><div class="param-value">+4</div></div><div class="param-item"><div class="param-key">M</div><div class="param-value">-2</div></div><div class="param-item"><div class="param-key">Y</div><div class="param-value">+2</div></div></div></div>
                <div><h4 class="recipe-section-title">Detail</h4><div class="param-grid grid-cols-1"><div class="param-item"><div class="param-key">Level</div><div class="param-value">0</div></div></div></div>
            </div>
        </div>
    </div>
    <!-- Modal 2: SCL-27 -->
    <div id="modal-scl27" class="recipe-modal">
        <div class="recipe-modal-content">
            <button class="close-modal-btn">&times;</button>
             <div class="photo-collage mb-6">
                <img src="https://lh3.googleusercontent.com/pw/AP1GczO2Zg9sIDNNb_6VjMP87b8-ADz04gPG7sMtACcq_icK4VBnyfX9HqCuj_KINNrJsAB9vtZWX-PWQlJWvD5UwVIsgqDz599aVKQWPdi7K_MeSKuWCSwe9paPaQ9AF7EWHRtg3y6xo_4YRiXkXAxfIxvpag=w745-h1077-s-no?authuser=0" alt="Pinkish-white skin tone 1" class="demo-image main-image" style="object-position: center top;">
                <img src="https://lh3.googleusercontent.com/pw/AP1GczOC-qpjrL5DZLDDthLjrZKkl33JawDpyrBkMpIb-DjDkRIIu-ckWc__TVlzpOWZDarQTeZabCeaBAOtGnAM3L-AbrvBOFO1W5UIZh_jIZzuZdjsaNKKErVQOy7Mj8U4GoY86tFCRvoCEa4LeDMwH4VHxw=w726-h1077-s-no?authuser=0" alt="Pinkish-white skin tone 2" class="demo-image" style="object-position: center top;">
                <img src="https://lh3.googleusercontent.com/pw/AP1GczOnrW6HdG4jtEA_qoxJz25-5LUNZfJj4lk2Re-mDcRf5N0oXBSuI2nPnDSJeCS5hOl4A8nrjHromBkarVpKdh8f7PXeNxRvH4Vq_6ATKGo1KAGs68xM66zMriiWDgmmMn4xLjhZn2WsAwQK4jsGFQp6qQ=w718-h1077-s-no?authuser=0" alt="Pinkish-white skin tone 3" class="demo-image" style="object-position: center top;">
             </div>
            <h3 class="text-2xl font-bold">SCL-27: Daylight Cinema</h3>
            <p class="text-gray-600 mb-6">A clean, modern, pinkish-white skin tone. For daylight conditions.</p>
             <div class="space-y-6">
               <div><h4 class="recipe-section-title">White Balance</h4><div class="param-item w-full"><div class="param-key">WB</div><div class="param-value">3700K, A5-M1.5</div></div></div>
                 <div><h4 class="recipe-section-title">Picture Profile</h4><div class="param-grid"><div class="param-item"><div class="param-key">Black level</div><div class="param-value">-9</div></div><div class="param-item"><div class="param-key">Gamma</div><div class="param-value">S-Cinetone</div></div><div class="param-item"><div class="param-key">Black Gamma</div><div class="param-value">Narrow -7</div></div><div class="param-item"><div class="param-key">Knee</div><div class="param-value">Manual 75% +5</div></div><div class="param-item"><div class="param-key">Color Mode</div><div class="param-value">S-Cinetone</div></div><div class="param-item"><div class="param-key">Saturation</div><div class="param-value">+25</div></div><div class="param-item"><div class="param-key">Color Phase</div><div class="param-value">0</div></div></div></div>
                 <div><h4 class="recipe-section-title">Color Depth</h4><div class="param-grid grid-cols-3 sm:grid-cols-6"><div class="param-item"><div class="param-key">R</div><div class="param-value">-1</div></div><div class="param-item"><div class="param-key">G</div><div class="param-value">+3</div></div><div class="param-item"><div class="param-key">B</div><div class="param-value">+2</div></div><div class="param-item"><div class="param-key">C</div><div class="param-value">+2</div></div><div class="param-item"><div class="param-key">M</div><div class="param-value">-3</div></div><div class="param-item"><div class="param-key">Y</div><div class="param-value">-3</div></div></div></div>
                 <div><h4 class="recipe-section-title">Detail</h4><div class="param-grid grid-cols-1"><div class="param-item"><div class="param-key">Level</div><div class="param-value">0</div></div></div></div>
            </div>
        </div>
    </div>
    <!-- Modal 3: PROCOLOR-003 -->
    <div id="modal-procolor003" class="recipe-modal">
        <div class="recipe-modal-content">
            <button class="close-modal-btn">&times;</button>
            <div class="photo-collage mb-6">
                <img src="https://lh3.googleusercontent.com/pw/AP1GczPr5IM9fb8Mxygh4GGj44LBb0b4IXpdKOoRm_nPd8RtU1mbQONyQ36KZZs7PQImtpbA3xhWKp7S3AO534tRrgbssXY_dp3SBgQ7Y0hQPY7wymdLYCrTIp3KqeJb2RJcBjuPfNSmP3hXUgkHHujBcKZE4g=w442-h957-s-no?authuser=0" alt="Livestream 1" class="demo-image main-image">
                <img src="https://lh3.googleusercontent.com/pw/AP1GczNXJ3OUJXOjfZecO5mRrXBLNn9NHaMQRWGogsmBvvljqWBBWC1uvoZIlPz2uCko7DwCFPd2ruZIq3GDEipf_IjZtuxW5pBUAS18z8egEqZDxqoebuIsw7FO18Zlp9EUO01P0wAbKuS4Hx3mKN1YSEe5Rg=w498-h1077-s-no?authuser=0" alt="Livestream 2" class="demo-image">
            </div>
            <h3 class="text-2xl font-bold">PROCOLOR-003: EXTRA DR Stream 109</h3>
            <p class="text-gray-600 mb-6">For professional live streaming, confidently use harsh lighting without worrying about overexposure.</p>
             <div class="space-y-6">
               <div><h4 class="recipe-section-title">White Balance</h4><div class="param-item w-full"><div class="param-key">WB</div><div class="param-value">AWB, B1-M0.75</div></div></div>
                 <div><h4 class="recipe-section-title">Picture Profile</h4><div class="param-grid"><div class="param-item"><div class="param-key">Black level</div><div class="param-value">-3</div></div><div class="param-item"><div class="param-key">Gamma</div><div class="param-value">Cine1</div></div><div class="param-item"><div class="param-key">Black Gamma</div><div class="param-value">Wide -7</div></div><div class="param-item"><div class="param-key">Knee</div><div class="param-value">Manual 105% +2</div></div><div class="param-item"><div class="param-key">Color Mode</div><div class="param-value">Movie</div></div><div class="param-item"><div class="param-key">Saturation</div><div class="param-value">+15</div></div><div class="param-item"><div class="param-key">Color Phase</div><div class="param-value">0</div></div></div></div>
                 <div><h4 class="recipe-section-title">Color Depth</h4><div class="param-grid grid-cols-3 sm:grid-cols-6"><div class="param-item"><div class="param-key">R</div><div class="param-value">-2</div></div><div class="param-item"><div class="param-key">G</div><div class="param-value">-5</div></div><div class="param-item"><div class="param-key">B</div><div class="param-value">+3</div></div><div class="param-item"><div class="param-key">C</div><div class="param-value">+3</div></div><div class="param-item"><div class="param-key">M</div><div class="param-value">-4</div></div><div class="param-item"><div class="param-key">Y</div><div class="param-value">+2</div></div></div></div>
                 <div><h4 class="recipe-section-title">Detail</h4><div class="param-grid grid-cols-1"><div class="param-item"><div class="param-key">Level</div><div class="param-value">0</div></div></div></div>
            </div>
        </div>
    </div>

    <!-- Custom JavaScript -->
    <script src="main.js" defer></script>
    </div>
  `,
  home: () => `
        <div id="homeView" class="w-full h-full flex flex-col items-center justify-center text-center absolute inset-0 p-6 md:p-8">
            <div class="max-w-3xl">
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 mb-4" style="text-wrap: balance;" data-translate-key="landingTitle"></h1>
                <p class="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto my-4" style="text-wrap: balance;" data-translate-key="landingSubtitle"></p>
            </div>


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
                    <div id="welcomeContainer" class="flex flex-col items-center justify-center h-full">
                        <div id="welcomeText" class="text-center">
                            <h2 class="text-2xl md:text-3xl font-bold text-gray-700" data-translate-key="recipeDetailWelcomeTitle"></h2>
                            <p class="text-neutral-500 mt-2 max-w-xl mx-auto" data-translate-key="recipeDetailWelcomeText"></p>
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
  userProfile: () => `
        <div id="userProfileViewContainer" class="w-full h-full max-w-7xl mx-auto view-transition">
            <!-- Profile content will be rendered by profile-ui.js -->
        </div>`
};

export async function attachViewEventListeners(viewName) {
  if (viewName === 'landing') {
    initLandingEventListeners();
  }
  if (viewName === 'home') {
    initializeBackgroundBlobs();
  }
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
    if (blobContainer) {
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
