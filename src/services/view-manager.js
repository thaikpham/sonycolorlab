// File Path: src/services/view-manager.js
import { state } from './state.js';
import { initializeBackgroundBlobs } from './ui.js';
import { applyTranslations, updateLangSlider } from './language.js';
import { renderLibraryList, renderLibraryDetails } from '../components/recipe-list/recipe-list-ui.js';
import { handleRecipeSelection } from './recipe-service.js';

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
                    <div id="welcomeContainer">
                        <div class="p-4 sm:p-8 md:p-12">
                            <link rel="stylesheet" href="/landing/style.css">
                            <main class="max-w-3xl mx-auto space-y-8">

                            <!-- Header -->
                            <header class="text-center mb-4">
                                 <img src="/assets/logo.png" alt="Sony Color Lab Logo" class="h-10 sm:h-12 mx-auto mb-6">
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
                                        <a href="/SCL-01" class="recipe-card" data-recipe-id="scl-01-mojave-sun">
                                            <img src="https://lh3.googleusercontent.com/pw/AP1GczPC_ounREkB_Q6oj6ZM7ckVGcKKZ_saJP5O63nURHPk09iTI8l4YwSqUzyxJm8ZG760nUJhm5JgmMWyk4uGlDDaaWwjJJPO4E9IAoF1pNfMHqx-2g3OcDS2COZ1w93K8j16X08W24leuMEhZvXx6L4uyw=w736-h1105-s-no?authuser=0" alt="Mojave Sun film tone" class="recipe-card-image">
                                            <div class="recipe-card-content">
                                                <h3 class="text-xl font-bold mb-2">SCL-01: Mojave Sun</h3>
                                                <p class="text-gray-600 text-sm">A nostalgic film tone with warm yellows, perfect for travel and lifestyle.</p>
                                            </div>
                                        </a>
                                        <!-- Card 2: Daylight Cinema -->
                                        <a href="/SCL-27" class="recipe-card" data-recipe-id="scl-27-daylight-cinema">
                                            <img src="https://lh3.googleusercontent.com/pw/AP1GczO2Zg9sIDNNb_6VjMP87b8-ADz04gPG7sMtACcq_icK4VBnyfX9HqCuj_KINNrJsAB9vtZWX-PWQlJWvD5UwVIsgqDz599aVKQWPdi7K_MeSKuWCSwe9paPaQ9AF7EWHRtg3y6xo_4YRiXkXAxfIxvpag=w745-h1077-s-no?authuser=0" alt="Pinkish-white skin tone" class="recipe-card-image">
                                             <div class="recipe-card-content">
                                                <h3 class="text-xl font-bold mb-2">SCL-27: Daylight Cinema</h3>
                                                <p class="text-gray-600 text-sm">A clean, pinkish-white skin tone. For daylight conditions.</p>
                                            </div>
                                        </a>
                                        <!-- Card 3: PROCOLOR-003 -->
                                        <a href="/PROCOLOR-003" class="recipe-card" data-recipe-id="procolor-003-extra-dr-stream-109">
                                            <img src="https://lh3.googleusercontent.com/pw/AP1GczPr5IM9fb8Mxygh4GGj44LBb0b4IXpdKOoRm_nPd8RtU1mbQONyQ36KZZs7PQImtpbA3xhWKp7S3AO534tRrgbssXY_dp3SBgQ7Y0hQPY7wymdLYCrTIp3KqeJb2RJcBjuPfNSmP3hXUgkHHujBcKZE4g=w442-h957-s-no?authuser=0" alt="Livestream" class="recipe-card-image">
                                             <div class="recipe-card-content">
                                                <h3 class="text-xl font-bold mb-2">PROCOLOR-003</h3>
                                                <p class="text-gray-600 text-sm">For professional live streaming, preventing overexposure from harsh lighting.</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>

                                <!-- STEP 3: SAVE THE RECIPES -->
                                 <div class="section-card">
                                    <div class="flex items-start gap-4">
                                        <div class="step-number">3</div>
                                        <div>
                                            <h2 class="text-2xl font-bold text-gray-900">Save the Recipes</h2>
                                            <p class="text-gray-600 mt-1">Watch the corresponding video tutorial for your camera model to save the settings.</p>
                                        </div>
                                    </div>
                                    <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                                <div class="section-card">
                                    <div class="flex items-start gap-4">
                                        <div class="step-number">4</div>
                                        <div>
                                            <h2 class="text-2xl font-bold text-gray-900">Recall & Use</h2>
                                            <p class="text-gray-600 mt-1">Once saved, you can quickly access the recipes on the mode dial.</p>
                                        </div>
                                    </div>
                                    <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h4 class="font-semibold text-sm">Save on Camera (1, 2, 3)</h4>
                                            <p class="text-xs text-gray-500 mt-1">Turn the mode dial directly to the corresponding number.</p>
                                        </div>
                                        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h4 class="font-semibold text-sm">Save on Card (M1-M4)</h4>
                                            <p class="text-xs text-gray-500 mt-1">Turn to <span class="font-bold text-gray-700">MR</span> and select the saved memory on the card.</p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <!-- Footer -->
                            <footer class="text-center mt-8 pt-8 border-t border-gray-200">
                                <p class="text-gray-500 text-sm">Source & Color Recipes: <a href="https://sonycolorlab.app" target="_blank" class="font-semibold text-blue-600 hover:text-blue-500">sonycolorlab.app</a></p>
                            </footer>

                        </main>

                        <!-- Video Lightbox Structure -->
                        <div id="video-lightbox" class="video-lightbox-overlay">
                            <div class="video-lightbox-content">
                                <span id="video-lightbox-close">&times;</span>
                                <div id="video-player-container"></div>
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
  userProfile: () => `
        <div id="userProfileViewContainer" class="w-full h-full max-w-7xl mx-auto view-transition">
            <!-- Profile content will be rendered by profile-ui.js -->
        </div>`
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

    updateLangSlider();

    // Attach event listeners for the landing page guide
    const recipeCards = document.querySelectorAll('.recipe-card');
    recipeCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const recipeId = card.dataset.recipeId;
            handleRecipeSelection(recipeId);
        });
    });

    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const videoLightbox = document.getElementById('video-lightbox');
    const videoPlayerContainer = document.getElementById('video-player-container');
    const videoLightboxClose = document.getElementById('video-lightbox-close');

    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const videoId = thumbnail.getAttribute('data-video-id');
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            videoPlayerContainer.innerHTML = '';
            videoPlayerContainer.appendChild(iframe);
            videoLightbox.classList.add('visible');
        });
    });

    const closeVideoLightbox = () => {
        videoLightbox.classList.remove('visible');
        videoPlayerContainer.innerHTML = '';
    };

    if (videoLightboxClose) {
        videoLightboxClose.addEventListener('click', closeVideoLightbox);
    }

    if (videoLightbox) {
        videoLightbox.addEventListener('click', (e) => {
            if (e.target === videoLightbox) {
                closeVideoLightbox();
            }
        });
    }
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
