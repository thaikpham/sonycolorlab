// --- STATE & CONFIGURATION ---
        const state = {
            currentLang: 'vi',
            currentView: 'home',
            selectedRecipeId: null,
            comparisonList: [],
            lastGeneratedAiRecipe: null,
            isAILoading: false,
            quizStep: 0,
            quizAnswers: {},
            activeFilters: { type: 'all', contrast: 'all', saturation: 'all' },
            isMobileDetailActive: false,
            lightbox: { isOpen: false, images: [], currentIndex: 0 }
        };

        const mainContentEl = document.getElementById('mainContent');
        let activeCharts = {};

        
        
        const quizQuestions = [
            { id: 'aesthetic', title: 'quizQ1', options: ['quizQ1A1', 'quizQ1A2', 'quizQ1A3', 'quizQ1A4'], values: ['Vintage', 'Modern', 'Cinematic', 'Artistic'] },
            { id: 'plan', title: 'quizQ2', options: ['quizQ2A1', 'quizQ2A2', 'quizQ2A3', 'quizQ2A4'], values: ['Portrait', 'Landscape', 'Street', 'Everyday'] },
            { id: 'mood', title: 'quizQ3', options: ['quizQ3A1', 'quizQ3A2', 'quizQ3A3', 'quizQ3A4'], values: ['Happy', 'Contemplative', 'Dynamic', 'Peaceful'] },
            { id: 'location', title: 'quizQ4', options: ['quizQ4A1', 'quizQ4A2', 'quizQ4A3', 'quizQ4A4'], values: ['Beach', 'Mountain', 'Urban', 'Old Town'] },
            { id: 'tone', title: 'quizQ5', options: ['quizQ5A1', 'quizQ5A2', 'quizQ5A3'], values: ['Warm', 'Cool', 'Neutral'] },
            { id: 'style', title: 'quizQ6', options: ['quizQ6A1', 'quizQ6A2'], values: ['Eastern', 'Western'] },
            { id: 'contrast', title: 'quizQ7', options: ['quizQ7A1', 'quizQ7A2', 'quizQ7A3'], values: ['High', 'Low', 'Medium'] },
            { id: 'saturation', title: 'quizQ8', options: ['quizQ8A1', 'quizQ8A2', 'quizQ8A3'], values: ['High', 'Low', 'Medium'] }
        ];
        
        async function callAIApi(prompt, delay = 1000) {
            if (state.isAILoading) return;
            state.isAILoading = true;
            try {
                await new Promise(resolve => setTimeout(resolve, delay));
                if (prompt.includes("Recommend TWO recipes")) {
                    const idx1 = Math.floor(Math.random() * recipesData.length);
                    let idx2 = Math.floor(Math.random() * recipesData.length);
                    while (idx1 === idx2) { idx2 = Math.floor(Math.random() * recipesData.length); }
                    const mockRecipe1 = recipesData[idx1]; const mockRecipe2 = recipesData[idx2];
                    return [
                        { recipeId: mockRecipe1.id, moodDescription: mockRecipe1.description[state.currentLang] },
                        { recipeId: mockRecipe2.id, moodDescription: mockRecipe2.description[state.currentLang] }
                    ];
                }
                if (prompt.includes("Original Recipe")) {
                    const originalId = prompt.match(/ID: (.*?)\)/)[1];
                    const originalRecipe = recipesData.find(r => r.id === originalId);
                    let adjustedRecipe = JSON.parse(JSON.stringify(originalRecipe));
                    adjustedRecipe.name = {vi: `${originalRecipe.name.vi} (AI Tinh chỉnh)`, en: `${originalRecipe.name.en} (AI Adjusted)`};
                    if (prompt.includes('ấm') || prompt.includes('warmer')) { adjustedRecipe.whiteBalance = "5500K, A6-M1"; }
                    if (prompt.includes('trong') || prompt.includes('clearer')) { if(adjustedRecipe.settings) adjustedRecipe.settings['Black level'] = '0'; }
                    return { recipe: adjustedRecipe };
                }
                if (prompt.includes("Compare the following two recipes")) {
                    const names = prompt.match(/\*(.*?)\* and \*(.*?)\*/);
                    return `### Cảm Giác & Phong Cách\n* **${names[1]}:** Mang lại cảm giác ấm áp, hoài cổ.\n* **${names[2]}:** Tạo ra cái nhìn lạnh hơn, hiện đại.\n\n### So Sánh Thông Số Chính\n| Thông số | ${names[1]} | ${names[2]} | Phân Tích |\n|---|---|---|---|\n| **White Balance** | Ấm (4000K) | Lạnh (8000K) | Đây là sự khác biệt chính. |\n| **Black Level** | -15 | -10 | Cả hai đều tăng tương phản, nhưng công thức 1 có vùng tối sâu hơn. |\n\n### Trường Hợp Sử Dụng\n* **Dùng ${names[1]} khi:** Chụp chân dung, hoàng hôn.\n* **Dùng ${names[2]} khi:** Chụp phong cảnh, kiến trúc.`;
                }
            } catch (error) {
                console.error("AI API call failed:", error); return null;
            } finally {
                state.isAILoading = false;
                updateUIAfterAILoading();
            }
        }
        
        function t(key) { return translations[key]?.[state.currentLang] || key; }
        
        function applyTranslations() {
            document.querySelectorAll('[data-translate-key]').forEach(el => {
                const key = el.dataset.translateKey;
                if (translations[key] && translations[key][state.currentLang]) {
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { el.placeholder = t(key); }   
                    else if (el.tagName === 'OPTION') { el.textContent = t(key); }   
                    else { el.innerHTML = t(key); }
                }
            });
            document.querySelectorAll('.nav-btn-mobile').forEach(btn => {
                const key = 'nav' + btn.dataset.view.charAt(0).toUpperCase() + btn.dataset.view.slice(1);
                btn.textContent = t(key);
            });
            document.getElementById('langVI').classList.toggle('active', state.currentLang === 'vi');
            document.getElementById('langEN').classList.toggle('active', state.currentLang === 'en');
        }

        function createSettingsGrid(settings) {
            if (!settings) return '';
            return Object.entries(settings).map(([key, value]) => `<div class="flex flex-col"><span class="text-xs text-neutral-500">${key}</span><span class="font-semibold text-lg">${value}</span></div>`).join('');
        };

        function createFullRecipeHTML(recipe, isMainView = false) {
            const titleClass = isMainView ? 'text-xl font-bold' : 'text-lg font-bold';
            const noteHTML = (recipe.notes && recipe.notes[state.currentLang])   
                ? `<div class="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-xl">
                        <p class="font-bold" data-translate-key="noteTitle"></p>
                        <p>${recipe.notes[state.currentLang]}</p>
                      </div>` : '';

            return `${noteHTML}<div class="space-y-6 mt-6">
                <div><h4 class="${titleClass} mb-2" data-translate-key="whiteBalanceTitle"></h4><div class="p-4 bg-black/5 rounded-xl"><p class="font-semibold text-lg">${recipe.whiteBalance || ''}</p></div></div>
                <div><h4 class="${titleClass} mb-2" data-translate-key="recipeSettingsTitle"></h4><div class="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5 p-5 bg-black/5 rounded-xl">${createSettingsGrid(recipe.settings)}</div></div>
                ${recipe.colorDepth ? `<div><h4 class="${titleClass} mb-2" data-translate-key="colorDepthTitle"></h4><div class="grid grid-cols-3 sm:grid-cols-6 gap-x-6 gap-y-5 p-5 bg-black/5 rounded-xl">${createSettingsGrid(recipe.colorDepth)}</div></div>` : ''}
                ${recipe.detailSettings ? `<div><h4 class="${titleClass} mb-2" data-translate-key="detailTitle"></h4><div class="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5 p-5 bg-black/5 rounded-xl">${createSettingsGrid(recipe.detailSettings)}</div></div>` : ''}
            </div>`;
        }

        function updateUIAfterAILoading() {
            document.querySelectorAll('button:disabled').forEach(btn => {
                if (btn.querySelector('.spinner')) {
                    btn.innerHTML = btn.dataset.originalText || '';
                    btn.disabled = false;
                }
            });
        }
        
        const viewTemplates = {
            home: () => `<div id="homeView" class="w-full h-full flex flex-col items-center justify-center text-center absolute inset-0 view-transition p-4">
                <h1 data-translate-key="landingTitle" class="landing-title"></h1>
                <p data-translate-key="landingSubtitle" class="landing-subtitle"></p>
                <button id="startQuizBtn" class="btn btn-primary mt-10 py-4 px-10 text-lg" data-translate-key="startQuizBtn"></button>
            </div>`,
            
            quiz: () => {
                if (state.quizStep >= quizQuestions.length) return '';
                const q = quizQuestions[state.quizStep];
                const optionsHTML = q.options.map((optKey, index) => `<div class="quiz-option" data-value="${q.values[index]}"><span data-translate-key="${optKey}"></span></div>`).join('');
                const gridCols = q.options.length > 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2';
                return `<div id="quizView" class="w-full h-full flex flex-col items-center justify-center absolute inset-0 view-transition">
                    <div class="w-full max-w-4xl text-center px-4" data-quiz-group="${q.id}">
                        <h2 class="quiz-question-title" data-translate-key="${q.title}"></h2>
                        <div class="grid ${gridCols} gap-4 sm:gap-5 mt-10 sm:mt-12">${optionsHTML}</div>
                    </div>
                </div>`;
            },
            
            recipeFormulas: () => `
                <div id="recipeFormulasView" class="w-full h-full flex flex-col md:flex-row gap-6 absolute inset-0 view-transition">
                    <aside id="recipeListPanel" class="w-full md:w-1/3 lg:w-[30%] xl:w-1/4 glass-panel p-4 md:p-6 flex flex-col flex-shrink-0 md:flex">
                        <h2 class="text-2xl md:text-3xl font-bold" data-translate-key="sidebarTitle"></h2>
                        <input type="search" id="searchInput" class="w-full p-3 my-4 rounded-xl bg-gray-200/50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all" data-translate-key="searchInputPlaceholder">
                        <div id="filtersContainer" class="space-y-4 text-sm mb-4">
                             <div><h4 class="font-semibold mb-2" data-translate-key="filterType"></h4><div class="flex gap-2" data-filter-group="type"><button class="filter-btn flex-1 py-2 px-3 rounded-full active" data-filter-value="all">All</button><button class="filter-btn flex-1 py-2 px-3 rounded-full" data-translate-key="filterTypeColor" data-filter-value="color"></button><button class="filter-btn flex-1 py-2 px-3 rounded-full" data-translate-key="filterTypeBW" data-filter-value="bw"></button></div></div>
                             <div><h4 class="font-semibold mb-2" data-translate-key="filterContrast"></h4><div class="flex gap-2" data-filter-group="contrast"><button class="filter-btn flex-1 py-2 px-3 rounded-full active" data-filter-value="all">All</button><button class="filter-btn flex-1 py-2 px-3 rounded-full" data-translate-key="filterHigh" data-filter-value="high"></button><button class="filter-btn flex-1 py-2 px-3 rounded-full" data-translate-key="filterMedium" data-filter-value="medium"></button><button class="filter-btn flex-1 py-2 px-3 rounded-full" data-translate-key="filterLow" data-filter-value="low"></button></div></div>
                             <div><h4 class="font-semibold mb-2" data-translate-key="filterSaturation"></h4><div class="flex gap-2" data-filter-group="saturation"><button class="filter-btn flex-1 py-2 px-3 rounded-full active" data-filter-value="all">All</button><button class="filter-btn flex-1 py-2 px-3 rounded-full" data-translate-key="filterHigh" data-filter-value="high"></button><button class="filter-btn flex-1 py-2 px-3 rounded-full" data-translate-key="filterMedium" data-filter-value="medium"></button><button class="filter-btn flex-1 py-2 px-3 rounded-full" data-translate-key="filterLow" data-filter-value="low"></button></div></div>
                        </div>
                        <div id="recipeListContainer" class="space-y-2 pt-4 border-t flex-grow overflow-y-auto pr-2 -mr-3"></div>
                        <div id="compareBtnContainer" class="pt-4 flex-shrink-0"></div>
                    </aside>
                    <main id="recipeMainPanel" class="w-full md:w-2/3 lg:w-[70%] xl:w-3/4 flex-col min-h-0 hidden md:flex">
                        <div class="glass-panel flex-grow overflow-y-auto p-6 lg:p-10">
                           <div id="chartsContainer">
                               <div class="text-center mb-10">
                                   <h2 class="text-2xl md:text-3xl font-bold text-gray-700" data-translate-key="recipeDetailWelcomeTitle"></h2><p class="text-neutral-500 mt-2 max-w-xl mx-auto" data-translate-key="recipeDetailWelcomeText"></p>
                               </div>
                               <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                   <div><h3 class="text-xl font-bold text-center mb-4" data-translate-key="colorChartTitle"></h3><div class="chart-container"><canvas id="colorChart"></canvas></div></div>
                                   <div><h3 class="text-xl font-bold text-center mb-4" data-translate-key="bwChartTitle"></h3><div class="chart-container"><canvas id="bwChart"></canvas></div></div>
                               </div>
                           </div>
                           <div id="recipeContent" class="hidden"></div>
                        </div>
                    </main>
                    <div id="recipeDetailPanelMobile" class="w-full h-full absolute inset-0 bg-[#f4f7fc] p-4 overflow-y-auto hidden">
                        <button id="backToListBtn" class="btn bg-gray-200 text-gray-800 mb-4 p-4" data-translate-key="backToListBtn"></button>
                        <div class="glass-panel p-6 overflow-y-auto">
                           <div id="recipeContentMobile"></div>
                        </div>
                    </div>
                </div>`,
            
            creativeLooks: () => {
                const looks = ['ST', 'PT', 'NT', 'VV', 'VV2', 'FL', 'IN', 'SH', 'BW', 'SE'];
                const params = ['contrast', 'highlights', 'shadows', 'fading', 'saturation', 'sharpness', 'sharpness_range', 'clarity'];
                const creativeLookDetails = {
                    ST: { img: 'https://www.sony-asia.com/microsite/rmdc/creativelooks/wp-content/uploads/2024/12/ST-00000431.jpg' },
                    PT: { img: 'https://sony.scene7.com/is/image/sonyglobalsolutions/02_PT_sample1?$columnSlideShow$' },
                    NT: { img: 'https://sony.scene7.com/is/image/sonyglobalsolutions/03_NT_sample1?$columnSlideShow$' },
                    VV: { img: 'https://www.sony-asia.com/microsite/rmdc/creativelooks/wp-content/uploads/2024/08/DSC00213-2048x1536.jpg' },
                    VV2: { img: 'https://www.sony-asia.com/microsite/rmdc/creativelooks/wp-content/uploads/2024/06/VV2_SEL2450G_DSC00638_compressed-2048x1365.jpg' },
                    FL: { img: 'https://www.sony-asia.com/microsite/rmdc/creativelooks/wp-content/uploads/2024/06/FL_SEL2450G_DSC02112_compressed-2048x1365.jpg' },
                    IN: { img: 'https://www.sony-asia.com/microsite/rmdc/creativelooks/wp-content/uploads/2024/09/DSC01031-2048x1365.jpg' },
                    SH: { img: 'https://www.sony-asia.com/microsite/rmdc/creativelooks/wp-content/uploads/2024/08/jomnot_SH_01-2048x1365.jpg' },
                    BW: { img: 'https://www.sony-asia.com/microsite/rmdc/creativelooks/wp-content/uploads/2024/08/BW2-scaled.jpeg' },
                    SE: { img: 'https://www.sony-asia.com/microsite/rmdc/creativelooks/wp-content/uploads/2024/11/1-Satheeshan-Thiyagaraja_SE_-3-7-600433AWB-2048x1365.jpg' }
                };
                const suggestedRecipes = [
                    { nameKey: 'cl_recipe_cinematic_name', descKey: 'cl_recipe_cinematic_desc', base: 'FL', settings: { Contrast: -2, Highlights: -1, Shadows: +1, Fade: 2, Saturation: -1, Sharpness: -2, Clarity: 0 } },
                    { nameKey: 'cl_recipe_vibrant_name', descKey: 'cl_recipe_vibrant_desc', base: 'VV2', settings: { Contrast: +2, Highlights: 0, Shadows: 0, Fade: 0, Saturation: +3, Sharpness: +1, Clarity: +2 } },
                    { nameKey: 'cl_recipe_soft_portrait_name', descKey: 'cl_recipe_soft_portrait_desc', base: 'PT', settings: { Contrast: -3, Highlights: +1, Shadows: +2, Fade: 1, Saturation: 0, Sharpness: -4, Clarity: +1 } },
                    { nameKey: 'cl_recipe_teal_orange_name', descKey: 'cl_recipe_teal_orange_desc', base: 'FL', settings: { Contrast: +1, Highlights: -2, Shadows: +3, Fade: 3, Saturation: -2, Sharpness: -1, Clarity: 0 } },
                    { nameKey: 'cl_recipe_dramatic_mono_name', descKey: 'cl_recipe_dramatic_mono_desc', base: 'BW', settings: { Contrast: +5, Highlights: -2, Shadows: -4, Fade: 0, Saturation: 0, Sharpness: +3, Clarity: +2 } },
                    { nameKey: 'cl_recipe_golden_hour_name', descKey: 'cl_recipe_golden_hour_desc', base: 'ST', settings: { Contrast: -2, Highlights: 0, Shadows: +4, Fade: 2, Saturation: +2, Sharpness: -3, Clarity: 0 } },
                    { nameKey: 'cl_recipe_urban_cool_name', descKey: 'cl_recipe_urban_cool_desc', base: 'NT', settings: { Contrast: +2, Highlights: -1, Shadows: -2, Fade: 1, Saturation: -3, Sharpness: +2, Clarity: +1 } },
                    { nameKey: 'cl_recipe_vibrant_summer_name', descKey: 'cl_recipe_vibrant_summer_desc', base: 'VV2', settings: { Contrast: +1, Highlights: 0, Shadows: 0, Fade: 0, Saturation: +4, Sharpness: 0, Clarity: +3 } }
                ];

                const looksHTML = looks.map(look => `
                    <div class="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                        <img src="${creativeLookDetails[look].img}" alt="Creative Look ${look}" class="w-full h-48 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/600x400/e0e0e0/757575?text=Image+Not+Found';">
                        <div class="p-5">
                            <h4 class="font-bold text-lg" data-translate-key="cl_${look}_name"></h4>
                            <p class="text-sm text-gray-600 mt-1" data-translate-key="cl_${look}_desc"></p>
                        </div>
                    </div>`).join('');

                const paramsHTML = params.map(param => `
                    <div class="bg-blue-50/50 p-4 rounded-lg">
                        <h5 class="font-semibold text-blue-800" data-translate-key="cl_param_${param.replace('_', '')}"></h5>
                        <p class="text-sm text-blue-700/80" data-translate-key="cl_param_${param.replace('_', '')}_desc"></p>
                    </div>`).join('');

                const recipesHTML = suggestedRecipes.map(recipe => `
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                         <div class="p-5">
                            <h4 class="text-xl font-bold" data-translate-key="${recipe.nameKey}"></h4>
                            <p class="text-sm text-gray-600 mt-1 mb-4" data-translate-key="${recipe.descKey}"></p>
                            <div class="text-sm font-semibold text-white bg-blue-500 inline-block px-3 py-1 rounded-full mb-4"><span data-translate-key="cl_base"></span>: ${recipe.base}</div>
                            <ul class="text-sm space-y-2">
                                ${Object.entries(recipe.settings).map(([key, value]) => `
                                    <li class="flex justify-between items-center">
                                        <span class="text-gray-700">${key}</span>
                                        <span class="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">${value > 0 ? '+' : ''}${value}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('');

                return `
                <div id="creativeLooksView" class="w-full h-full absolute inset-0 overflow-y-auto view-transition p-4 md:p-8">
                    <div class="max-w-7xl mx-auto">
                        <header class="text-center mb-10 md:mb-12">
                            <h1 class="text-3xl md:text-5xl font-extrabold text-slate-800 mb-2" data-translate-key="creativeLookHeader"></h1>
                            <h2 class="text-base md:text-lg text-slate-600 max-w-3xl mx-auto" data-translate-key="creativeLookSubtitle"></h2>
                        </header>

                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            ${looksHTML}
                        </div>
                        
                        <section class="mt-12 md:mt-16">
                            <h3 class="text-2xl md:text-3xl font-bold text-center mb-8" data-translate-key="recipeSuggestionsTitle"></h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                ${recipesHTML}
                            </div>
                        </section>

                        <section class="mt-12 md:mt-16 bg-white rounded-2xl shadow-lg p-6 md:p-8">
                            <h3 class="text-2xl md:text-3xl font-bold text-center mb-8" data-translate-key="customParamsTitle"></h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                               ${paramsHTML}
                            </div>
                        </section>
                         <footer class="text-center text-sm text-gray-500 pt-8 mt-12 border-t">
                             <p data-translate-key="footerText"></p>
                         </footer>
                    </div>
                </div>`;
            },
            
            featuredPhotos: () => `<div id="featuredPhotosView" class="w-full h-full absolute inset-0 overflow-y-auto view-transition p-4">
                <div class="glass-panel p-6 md:p-12 text-center max-w-5xl mx-auto">
                    <h2 class="text-2xl md:text-4xl font-bold" data-translate-key="featuredTitle"></h2>
                    <p class="text-base md:text-lg text-neutral-600 mt-4 max-w-3xl mx-auto" data-translate-key="featuredCta"></p>
                    <a href="https://photos.app.goo.gl/H8v1SQ68RSnn2r5Q6" target="_blank" rel="noopener noreferrer" class="btn btn-primary mt-8 py-3 px-8 text-base md:text-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M12 2L12 11M12 11L15 8M12 11L9 8"/><path d="M20 13.33V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H10.67" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        <span data-translate-key="featuredAlbumBtn"></span>
                    </a>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
                        ${recipesData.slice(0,6).map((recipe) => {
                            const hasDemoImages = recipe.demoImages && recipe.demoImages.length > 0;
                            const imgSrc = hasDemoImages ? recipe.demoImages[0] : `https://placehold.co/800x600/${recipe.personalityColor.substring(1)}/ffffff?text=${encodeURIComponent(recipe.name[state.currentLang])}`;
                            return `<div class="bg-gray-200 group rounded-xl overflow-hidden cursor-pointer lightbox-trigger-thumb" data-recipe-id="${recipe.id}" data-index="0">
                                <img src="${imgSrc}" alt="Ảnh demo công thức ${recipe.name[state.currentLang]}" class="aspect-video w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300">
                            </div>`;
                        }).join('')}
                    </div>
                    <div class="mt-12 pt-10 border-t border-gray-900/10">
                      <h3 class="text-xl md:text-2xl font-bold" data-translate-key="contributeTitle"></h3>
                      <p class="text-neutral-600 mt-2 max-w-xl mx-auto" data-translate-key="contributeDesc"></p>
                      <label class="btn btn-secondary mt-6 py-3 px-8 bg-gray-200 text-black hover:bg-gray-300 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <span data-translate-key="uploadBtn"></span>
                        <input type="file" class="hidden" accept="image/jpeg, image/png" id="photoUploadInput">
                      </label>
                    </div>
                </div>
            </div>`,
            
            explain: () => `
            <div id="explainView" class="w-full h-full absolute inset-0 overflow-y-auto view-transition bg-slate-50 text-gray-800">
                <div class="container mx-auto p-4 sm:p-6 md:p-12">
                    <section class="mb-12 md:mb-16 bg-white rounded-2xl shadow-lg p-6 md:p-10">
                        <div class="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed">
                            <h2 class="font-semibold text-2xl mb-6" data-translate-key="manifestoTitle"></h2>
                            <p class="mb-4" data-translate-key="manifestoBody1"></p>
                            <p class="mb-4" data-translate-key="manifestoBody2"></p>
                            <p class="mb-6 font-semibold text-xl text-center text-blue-600 py-4" data-translate-key="manifestoBody3"></p>
                            <p class="mb-4" data-translate-key="manifestoBody4"></p>
                            <p class="mb-4" data-translate-key="manifestoBody5"></p>
                            <p class="mb-6" data-translate-key="manifestoBody6"></p>
                            <p class="mb-8 font-bold" data-translate-key="manifestoBody7"></p>
                            <p class="text-right" data-translate-key="manifestoSignature"></p>
                        </div>
                    </section>

                    <header class="text-center mb-12 md:mb-16 pt-4 md:pt-8">
                        <h1 class="text-3xl md:text-5xl font-extrabold text-slate-800 mb-2" data-translate-key="explainHeader"></h1>
                        <h2 class="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto" data-translate-key="explainSubtitle"></h2>
                    </header>
            
                    <main class="space-y-12 md:space-y-20">
                        <section class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                            <h3 class="text-2xl md:text-3xl font-bold text-center mb-8" data-translate-key="tutorialTitle"></h3>
                            <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                                <div class="flex flex-col items-center">
                                    <div class="flex items-center justify-center w-16 h-16 bg-sky-100 text-sky-600 rounded-full text-2xl font-bold mb-4">1</div>
                                    <h4 class="font-bold text-lg mb-2" data-translate-key="tutorialStep1Title"></h4>
                                    <p class="text-sm text-gray-600" data-translate-key="tutorialStep1P1"></p>
                                    <p class="text-sm text-gray-600 mt-2" data-translate-key="tutorialStep1P2"></p>
                                </div>
                                <div class="flex flex-col items-center">
                                    <div class="flex items-center justify-center w-16 h-16 bg-sky-100 text-sky-600 rounded-full text-2xl font-bold mb-4">2</div>
                                    <h4 class="font-bold text-lg mb-2" data-translate-key="tutorialStep2Title"></h4>
                                    <p class="text-sm text-gray-600" data-translate-key="tutorialStep2P1"></p>
                                </div>
                                <div class="flex flex-col items-center">
                                    <div class="flex items-center justify-center w-16 h-16 bg-sky-100 text-sky-600 rounded-full text-2xl font-bold mb-4">3</div>
                                    <h4 class="font-bold text-lg mb-2" data-translate-key="tutorialStep3Title"></h4>
                                    <p class="text-sm text-gray-600" data-translate-key="tutorialStep3P1"></p>
                                </div>
                                <div class="flex flex-col items-center">
                                    <div class="flex items-center justify-center w-16 h-16 bg-sky-100 text-sky-600 rounded-full text-2xl font-bold mb-4">4</div>
                                    <h4 class="font-bold text-lg mb-2" data-translate-key="tutorialStep4Title"></h4>
                                    <p class="text-sm text-gray-600" data-translate-key="tutorialStep4P1"></p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 class="text-2xl md:text-3xl font-bold text-center mb-8" data-translate-key="pillarsTitle"></h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                                    <h4 class="text-xl font-bold mb-6 text-center" data-translate-key="wbPillarTitle"></h4>
                                    <div class="mb-8">
                                        <h5 class="font-bold text-lg" data-translate-key="wbKelvinTitle"></h5>
                                        <p class="text-sm text-gray-600 mb-3" data-translate-key="wbKelvinDesc"></p>
                                        <div class="w-full h-8 rounded-full bg-gradient-to-r from-blue-400 via-white to-orange-400 flex justify-between items-center px-2 text-xs font-bold text-gray-700">
                                            <span>2500K</span>
                                            <span>5500K</span>
                                            <span>9900K</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h5 class="font-bold text-lg" data-translate-key="wbShiftTitle"></h5>
                                        <p class="text-sm text-gray-600 mb-3" data-translate-key="wbShiftDesc"></p>
                                        <div id="abgm-grid-interactive-container">
                                            <div id="abgm-grid" class="relative">
                                                <span class="absolute top-1/2 -left-5 -translate-y-1/2 font-bold text-blue-600">B</span>
                                                <span class="absolute top-1/2 -right-5 -translate-y-1/2 font-bold text-amber-600">A</span>
                                                <span class="absolute left-1/2 -top-5 -translate-x-1/2 font-bold text-green-600">G</span>
                                                <span class="absolute left-1/2 -bottom-5 -translate-x-1/2 font-bold text-purple-600">M</span>
                                                <div id="abgm-pointer" style="top: 50%; left: 50%;"></div>
                                            </div>
                                            <div id="abgm-values" class="text-center mt-2 font-mono font-semibold bg-slate-100 p-2 rounded-md">A-B: 0, G-M: 0</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                                    <h4 class="text-xl font-bold mb-6 text-center" data-translate-key="ppPillarTitle"></h4>
                                    <p class="text-sm text-gray-700 mb-6 text-center" data-translate-key="ppInfographicDesc"></p>
                                     <div class="space-y-4">
                                         <details class="pp-infographic-item"><summary class="font-bold cursor-pointer">1. <span data-translate-key="ppItemGamma"></span></summary><p class="text-sm text-gray-600 mt-2" data-translate-key="ppItemGammaDesc"></p></details>
                                         <details class="pp-infographic-item"><summary class="font-bold cursor-pointer">2. <span data-translate-key="ppItemColorMode"></span></summary><p class="text-sm text-gray-600 mt-2" data-translate-key="ppItemColorModeDesc"></p></details>
                                         <details class="pp-infographic-item"><summary class="font-bold cursor-pointer">3. <span data-translate-key="ppItemBlackLevel"></span></summary><p class="text-sm text-gray-600 mt-2" data-translate-key="ppItemBlackLevelDesc"></p></details>
                                         <details class="pp-infographic-item"><summary class="font-bold cursor-pointer">4. <span data-translate-key="ppItemColorDepth"></span></summary><p class="text-sm text-gray-600 mt-2" data-translate-key="ppItemColorDepthDesc"></p></details>
                                    </div>
                                </div>
                            </div>
                        </section>
                        
                        <section class="bg-gradient-to-b from-slate-100 to-white rounded-2xl shadow-lg p-6 md:p-8">
                           <h3 class="text-2xl md:text-3xl font-bold text-center" data-translate-key="ppInfographicTitle"></h3>
                           <p class="max-w-3xl mx-auto text-center text-gray-700 mt-2 mb-10" data-translate-key="ppInfographicDesc"></p>
                           <div class="space-y-6">
                                <div class="pp-infographic-item"><h5 data-translate-key="ppItemBlackLevel"></h5><p class="text-sm text-gray-600 mt-1" data-translate-key="ppItemBlackLevelDesc"></p></div>
                                <div class="text-center text-gray-400 font-bold">↓</div>
                                <div class="pp-infographic-item"><h5 data-translate-key="ppItemGamma"></h5><p class="text-sm text-gray-600 mt-1" data-translate-key="ppItemGammaDesc"></p></div>
                                <div class="text-center text-gray-400 font-bold">↓</div>
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div class="pp-infographic-item"><h5 data-translate-key="ppItemBlackGamma"></h5><p class="text-sm text-gray-600 mt-1" data-translate-key="ppItemBlackGammaDesc"></p></div>
                                    <div class="pp-infographic-item"><h5 data-translate-key="ppItemKnee"></h5><p class="text-sm text-gray-600 mt-1" data-translate-key="ppItemKneeDesc"></p></div>
                                </div>
                                <div class="text-center text-gray-400 font-bold">↓</div>
                                <div class="pp-infographic-item"><h5 data-translate-key="ppItemColorMode"></h5><p class="text-sm text-gray-600 mt-1" data-translate-key="ppItemColorModeDesc"></p></div>
                                <div class="text-center text-gray-400 font-bold">↓</div>
                                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div class="pp-infographic-item"><h5 data-translate-key="ppItemSaturation"></h5><p class="text-sm text-gray-600 mt-1" data-translate-key="ppItemSaturationDesc"></p></div>
                                    <div class="pp-infographic-item"><h5 data-translate-key="ppItemColorPhase"></h5><p class="text-sm text-gray-600 mt-1" data-translate-key="ppItemColorPhaseDesc"></p></div>
                                    <div class="pp-infographic-item"><h5 data-translate-key="ppItemDetail"></h5><p class="text-sm text-gray-600 mt-1" data-translate-key="ppItemDetailDesc"></p></div>
                                </div>
                                <div class="text-center text-gray-400 font-bold">↓</div>
                                 <div class="pp-infographic-item"><h5 data-translate-key="ppItemColorDepth"></h5><p class="text-sm text-gray-600 mt-1" data-translate-key="ppItemColorDepthDesc"></p></div>
                           </div>
                           <div class="text-center mt-12">
                                <button id="exploreMoreBtn" class="btn btn-primary py-3 px-8 text-base md:text-lg" data-translate-key="navRecipeFormulas"></button>
                            </div>
                        </section>

                         <section class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                            <h3 class="text-2xl md:text-3xl font-bold text-center mb-4" data-translate-key="recallTitle"></h3>
                             <p class="max-w-3xl mx-auto text-center text-gray-700 mb-8" data-translate-key="recallDesc"></p>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                <div class="bg-slate-100 rounded-lg p-6 text-center">
                                    <h4 class="text-xl font-bold text-slate-700 mb-2" data-translate-key="recallInternalTitle"></h4>
                                    <p class="text-sm" data-translate-key="recallInternalDesc"></p>
                                </div>
                                <div class="bg-slate-100 rounded-lg p-6 text-center">
                                    <h4 class="text-xl font-bold text-slate-700 mb-2" data-translate-key="recallCardTitle"></h4>
                                    <p class="text-sm" data-translate-key="recallCardDesc"></p>
                                </div>
                            </div>
                         </section>

                         <section class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                            <h3 class="text-2xl md:text-3xl font-bold text-center mb-4" data-translate-key="exposureNoteTitle"></h3>
                             <p class="max-w-3xl mx-auto text-center text-gray-700" data-translate-key="exposureNoteDesc"></p>
                         </section>
            
                    </main>
                    <footer class="text-center text-sm text-gray-500 pt-8 mt-12 border-t">
                        <p data-translate-key="footerText"></p>
                    </footer>
                </div>
            </div>`
        };

        function openLightbox(images, initialIndex = 0) {
            if (!images || images.length === 0) return;
            state.lightbox.isOpen = true;
            state.lightbox.images = images;
            state.lightbox.currentIndex = initialIndex;
            const lightboxEl = document.getElementById('lightbox');
            lightboxEl.classList.remove('hidden');
            updateLightboxContent();
        }

        function closeLightbox() {
            state.lightbox.isOpen = false;
            document.getElementById('lightbox').classList.add('hidden');
        }

        function updateLightboxContent() {
            if (!state.lightbox.isOpen) return;
            const mainImageEl = document.getElementById('lightbox-main-image');
            const thumbnailsContainer = document.getElementById('lightbox-thumbnails');
            const newSrc = state.lightbox.images[state.lightbox.currentIndex];
            mainImageEl.style.opacity = '0';
            setTimeout(() => {
                mainImageEl.src = newSrc;
                mainImageEl.onload = () => { mainImageEl.style.opacity = '1'; };
            }, 150);
            
            thumbnailsContainer.innerHTML = state.lightbox.images.map((imgSrc, index) => `
                <img src="${imgSrc}" class="lightbox-thumb w-16 h-16 md:w-20 md:h-20 object-cover rounded-md ${index === state.lightbox.currentIndex ? 'active' : ''}" data-index="${index}">
            `).join('');
        }

        function navigateLightbox(direction) {
            if (!state.lightbox.isOpen) return;
            const imageCount = state.lightbox.images.length;
            let newIndex = state.lightbox.currentIndex + direction;
            if (newIndex < 0) newIndex = imageCount - 1;
            else if (newIndex >= imageCount) newIndex = 0;
            state.lightbox.currentIndex = newIndex;
            updateLightboxContent();
        }

        function destroyAllCharts() {
            Object.values(activeCharts).forEach(chart => { if(chart && typeof chart.destroy === 'function') chart.destroy(); });
            activeCharts = {};
        }

        function initInteractiveGrid() {
            const grid = document.getElementById('abgm-grid');
            const pointer = document.getElementById('abgm-pointer');
            const valuesDisplay = document.getElementById('abgm-values');
            if (!grid || !pointer || !valuesDisplay) return;

            let isDragging = false;

            function updatePosition(clientX, clientY) {
                const rect = grid.getBoundingClientRect();
                let x = clientX - rect.left;
                let y = clientY - rect.top;

                x = Math.max(0, Math.min(x, rect.width));
                y = Math.max(0, Math.min(y, rect.height));

                pointer.style.left = `${x}px`;
                pointer.style.top = `${y}px`;

                const abValue = Math.round((x / rect.width) * 18 - 9);
                const gmValue = Math.round(((rect.height - y) / rect.height) * 18 - 9); 

                const abLabel = abValue > 0 ? `A${abValue}` : (abValue < 0 ? `B${Math.abs(abValue)}` : '0');
                const gmLabel = gmValue > 0 ? `G${gmValue}` : (gmValue < 0 ? `M${Math.abs(gmValue)}` : '0');

                valuesDisplay.textContent = `${abLabel}, ${gmLabel}`;
            }

            grid.addEventListener('mousedown', (e) => {
                isDragging = true;
                updatePosition(e.clientX, e.clientY);
            });
            
            grid.addEventListener('touchstart', (e) => {
                isDragging = true;
                updatePosition(e.touches[0].clientX, e.touches[0].clientY);
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) updatePosition(e.clientX, e.clientY);
            });
            
             document.addEventListener('touchmove', (e) => {
                if (isDragging) updatePosition(e.touches[0].clientX, e.touches[0].clientY);
            });

            document.addEventListener('mouseup', () => { isDragging = false; });
            document.addEventListener('touchend', () => { isDragging = false; });
        }


        function renderView(viewName) {
            return new Promise(resolve => {
                const currentContent = mainContentEl.children[0];
                if (currentContent) {
                    currentContent.classList.add('view-transition-out');
                    destroyAllCharts();
                    currentContent.addEventListener('animationend', () => {
                        mainContentEl.innerHTML = viewTemplates[viewName]();
                        attachViewEventListeners(viewName);
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
        
        function handleFilterClick(e) {
            const btn = e.target.closest('.filter-btn'); if (!btn) return;
            const group = btn.closest('[data-filter-group]').dataset.filterGroup;
            const value = btn.dataset.filterValue; state.activeFilters[group] = value;
            document.querySelectorAll(`[data-filter-group="${group}"] .filter-btn`).forEach(b => b.classList.remove('active'));
            btn.classList.add('active'); renderLibraryList();
        }

        function handleRecipeSelection(id, type) {
            if (type === 'checkbox') {
                const index = state.comparisonList.indexOf(id);
                if (index > -1) { state.comparisonList.splice(index, 1); } 
                else if (state.comparisonList.length < 2) { state.comparisonList.push(id); }
            } else {
                if (state.selectedRecipeId === id) {
                    state.selectedRecipeId = null;
                    state.isMobileDetailActive = false;
                } else {
                    state.selectedRecipeId = id;
                    state.isMobileDetailActive = true;
                }
                state.comparisonList = [];
            }
            renderLibraryList();
            renderLibraryDetails();
            
            if (activeCharts.color && typeof activeCharts.color.update === 'function') { activeCharts.color.update(); }
            if (activeCharts.bw && typeof activeCharts.bw.update === 'function') { activeCharts.bw.update(); }
        }

        async function handleAiComparison(id1, id2, recipe2Obj = null) {
            const modal = document.getElementById('comparisonModal');
            const titleEl = document.getElementById('comparisonModalTitle');
            const contentEl = document.getElementById('comparisonModalContent');
            modal.classList.remove('hidden');
            titleEl.textContent = t('comparisonModalTitle');
            contentEl.innerHTML = `<div class="flex items-center justify-center p-8"><div class="spinner !w-12 !h-12 !border-4"></div><p class="ml-4 text-lg font-semibold">${t('comparisonLoading')}</p></div>`;
            const recipe1 = recipesData.find(r => r.id === id1);
            const recipe2 = recipe2Obj ? { ...recipe2Obj, id: 'ai-adjusted', name: recipe2Obj.name } : recipesData.find(r => r.id === id2);
            const prompt = `Compare the following two recipes: *${recipe1.name[state.currentLang]}* and *${recipe2.name[state.currentLang]}*. Analyze their overall feel, key parameter differences (like White Balance and Black Level), and suggest ideal use cases for each. Present the result in Markdown.`;
            const comparisonText = await callAIApi(prompt, 1200);
            contentEl.innerHTML = marked.parse(comparisonText || "Error loading comparison.");
            applyTranslations();
        }

        async function handleAiAdjustment(button) {
            const recipeId = button.dataset.recipeId;
            const textarea = document.getElementById('aiTuningTextarea');
            const resultContainer = document.getElementById('aiResultContainer');
            if (!textarea.value || !resultContainer || state.isAILoading) return;
            button.disabled = true; button.dataset.originalText = button.innerHTML;
            button.innerHTML = `<div class="spinner"></div> ${t('aiTuningBtn')}`;
            const originalRecipe = recipesData.find(r => r.id === recipeId);
            const prompt = `Original Recipe (ID: ${recipeId}): ${JSON.stringify(originalRecipe.settings)}. User request: "${textarea.value}". Please provide a new JSON object with adjusted settings.`;
            const aiResponse = await callAIApi(prompt);
            if (aiResponse && aiResponse.recipe) {
                state.lastGeneratedAiRecipe = aiResponse.recipe;
                resultContainer.innerHTML = `<div class="mt-6 border-t border-gray-200/50 pt-6"><h4 class="font-bold text-lg mb-2">${state.lastGeneratedAiRecipe.name[state.currentLang]}</h4><div class="p-4 rounded-xl bg-blue-50">${createFullRecipeHTML(state.lastGeneratedAiRecipe, false)}</div><button id="compareWithOriginalBtn" data-original-id="${recipeId}" class="btn btn-secondary w-full mt-4 py-3 bg-gray-200 text-black" data-translate-key="compareWithOriginalBtn"></button></div>`;
            } else { resultContainer.innerHTML = `<p class="text-red-500">Failed to generate adjustment.</p>`; }
            button.disabled = false; button.innerHTML = button.dataset.originalText; applyTranslations();
        }

        async function handleQuizSubmit() {
            await renderView('home');
            const homeView = document.getElementById('homeView');
            if (!homeView) { console.error("Quiz Submit Error: homeView not found after render."); return; }
            homeView.innerHTML = `<div class="flex flex-col items-center justify-center h-full"><div class="spinner !w-16 !h-16 !border-4"></div><h2 class="landing-title mt-8" data-translate-key="loadingAnalyze"></h2></div>`;
            applyTranslations();
            const prompt = `Based on user preferences: ${JSON.stringify(state.quizAnswers)}. Recommend TWO recipes from the available list. Respond with JSON array: [{"recipeId", "moodDescription" (in ${state.currentLang})}, ...].`;
            const aiResponse = await callAIApi(prompt);
            if (aiResponse && aiResponse.length >= 2) {
                const r1 = recipesData.find(r => r.id === aiResponse[0].recipeId);
                const r2 = recipesData.find(r => r.id === aiResponse[1].recipeId);
                if (r1 && r2) {
                    homeView.innerHTML = `<div class="w-full h-full flex items-center justify-center absolute inset-0 view-transition"><div class="quiz-result-container p-6 md:p-8 rounded-3xl w-full max-w-5xl mx-auto glass-panel"><h3 class="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center" data-translate-key="quizResultTitle"></h3><div class="grid md:grid-cols-2 gap-6"><div class="quiz-choice-option p-6" data-recipe-id="${r1.id}"><h4 class="text-xl md:text-2xl font-bold mb-2">${r1.name[state.currentLang]}</h4><p class="text-base italic text-gray-600">"${r1.description[state.currentLang]}"</p></div><div class="quiz-choice-option p-6" data-recipe-id="${r2.id}"><h4 class="text-xl md:text-2xl font-bold mb-2">${r2.name[state.currentLang]}</h4><p class="text-base italic text-gray-600">"${r2.description[state.currentLang]}"</p></div></div></div></div>`;
                    applyTranslations();
                }
            } else { homeView.innerHTML = `<p class="text-red-500">Lỗi khi lấy đề xuất từ AI.</p>`; }
        }
        
        function attachViewEventListeners(viewName) {
            if (viewName === 'recipeFormulas') {
                renderLibraryList();  
                renderLibraryDetails();
                renderInteractiveCharts(state.currentLang);
            } else if (viewName === 'explain') {
                initInteractiveGrid();
            }
        }

        function renderLibraryList() {
            const container = document.getElementById('recipeListContainer'); if (!container) return;
            const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase();
            let recipesToRender = recipesData.filter(recipe => (recipe.name.vi.toLowerCase().includes(searchTerm) || recipe.name.en.toLowerCase().includes(searchTerm) || recipe.description.vi.toLowerCase().includes(searchTerm) || recipe.description.en.toLowerCase().includes(searchTerm)) && (state.activeFilters.type === 'all' || recipe.type === state.activeFilters.type) && (state.activeFilters.contrast === 'all' || recipe.contrast === state.activeFilters.contrast) && (state.activeFilters.saturation === 'all' || recipe.saturation === state.activeFilters.saturation) );
            
            container.innerHTML = recipesToRender.map(recipe => {
                const isChecked = state.comparisonList.includes(recipe.id);
                const isSelected = recipe.id === state.selectedRecipeId;

                return `<div class="recipe-item p-3 rounded-xl transition-all duration-200 border-l-4 border-transparent flex items-start gap-4 ${isSelected ? 'selected' : ''}">
                            <input type="checkbox" class="recipe-compare-cb form-checkbox h-5 w-5 text-blue-600 rounded-md border-gray-300 focus:ring-blue-500 self-start mt-1 flex-shrink-0" data-recipe-id="${recipe.id}" ${isChecked ? 'checked' : ''} ${state.comparisonList.length >= 2 && !isChecked ? 'disabled' : ''}>
                             <div class="flex-grow cursor-pointer recipe-item-content" data-recipe-id="${recipe.id}">
                                 <div class="flex items-start gap-3">
                                     <div class="recipe-dot w-5 h-5 rounded-full flex-shrink-0 mt-1" style="background-color: ${recipe.personalityColor}" title="${recipe.name[state.currentLang]}"></div>
                                     <div class="flex-grow">
                                         <span class="font-semibold text-primary">${recipe.name[state.currentLang]}</span>
                                         <p class="text-sm text-neutral-600 mt-1 leading-snug">${recipe.description[state.currentLang]}</p>
                                     </div>
                                 </div>
                             </div>
                        </div>`;
            }).join('');

            const btnContainer = document.getElementById('compareBtnContainer');
            btnContainer.innerHTML = `<button id="compareBtn" class="btn btn-primary w-full mt-4 py-3" data-translate-key="compareBtn" ${state.comparisonList.length !== 2 ? 'disabled' : ''}></button>`;
            applyTranslations();
        }
        
        function renderLibraryDetails() {
            const isMobile = window.innerWidth < 768;
            const recipeListPanel = document.getElementById('recipeListPanel');
            const recipeMainPanel = document.getElementById('recipeMainPanel');
            const recipeDetailPanelMobile = document.getElementById('recipeDetailPanelMobile');

            if (isMobile) {
                if(state.isMobileDetailActive) {
                    recipeListPanel.classList.add('hidden');
                    recipeDetailPanelMobile.classList.remove('hidden');
                } else {
                    recipeListPanel.classList.remove('hidden');
                    recipeDetailPanelMobile.classList.add('hidden');
                }
            } else {
                recipeListPanel?.classList.remove('hidden');
                recipeDetailPanelMobile?.classList.add('hidden');
            }

            const recipe = recipesData.find(r => r.id === state.selectedRecipeId);

            let recipeContentContainer, chartsContainer;
            if (isMobile && state.isMobileDetailActive) {
                recipeContentContainer = document.getElementById('recipeContentMobile');
                chartsContainer = null;
            } else {
                recipeContentContainer = document.getElementById('recipeContent');
                chartsContainer = document.getElementById('chartsContainer');
            }

            if (!recipeContentContainer) return;

            if (!recipe) {  
                if (chartsContainer) chartsContainer.classList.remove('hidden');
                recipeContentContainer.classList.add('hidden');
                if(!isMobile) recipeMainPanel?.classList.remove('hidden');
                return;   
            }
            if (chartsContainer) chartsContainer.classList.add('hidden');
            recipeContentContainer.classList.remove('hidden');
            if(!isMobile) recipeMainPanel?.classList.remove('hidden');
            
            let thumbnailsHTML = '';
            const images = recipe.demoImages || [];
            let imageElements = [];
            images.forEach((imgSrc, index) => {
                imageElements.push(`<div class="bg-gray-200 group rounded-xl overflow-hidden cursor-pointer lightbox-trigger-thumb" data-recipe-id="${recipe.id}" data-index="${index}"><img src="${imgSrc}" alt="Ảnh demo ${index + 1}" class="aspect-[4/3] w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"></div>`);
            });
            const placeholdersNeeded = 3 - imageElements.length;
            const placeholderColor = recipe.personalityColor ? recipe.personalityColor.substring(1) : 'cccccc';
            for (let i = 0; i < placeholdersNeeded; i++) {
                const placeholderIndex = images.length + i;
                 imageElements.push(`<div class="bg-gray-200 group rounded-xl overflow-hidden"><img src="https://placehold.co/400x300/${placeholderColor}/ffffff?text=Sample+${placeholderIndex + 1}" alt="Ảnh minh họa ${placeholderIndex + 1}" class="aspect-[4/3] w-full h-full object-cover"></div>`);
            }
            thumbnailsHTML = `<div class="my-6"><div class="grid grid-cols-3 gap-2 md:gap-4">${imageElements.join('')}</div></div>`;

            recipeContentContainer.innerHTML = `
                <h3 class="text-3xl md:text-4xl font-bold">${recipe.name[state.currentLang]}</h3>
                <p class="text-lg text-neutral-600 mt-2 italic">"${recipe.description[state.currentLang]}"</p>
                ${thumbnailsHTML}
                <div id="originalRecipeContainer" class="mt-8">${createFullRecipeHTML(recipe, true)}</div>
                <div class="mt-12 pt-8 border-t-2 border-gray-200/60">
                    <details open class="group">
                        <summary class="text-xl md:text-2xl font-bold cursor-pointer list-none flex justify-between items-center group-hover:text-blue-600 transition-colors">
                            <span data-translate-key="tutorialTitle"></span>
                            <svg class="w-6 h-6 transition-transform transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </summary>
                        <div class="prose max-w-none mt-6 space-y-4 text-base text-gray-700">
                            <div><h4 class="font-bold" data-translate-key="tutorialStep1Title"></h4><p data-translate-key="tutorialStep1P1"></p></div>
                            <div><h4 class="font-bold" data-translate-key="tutorialStep2Title"></h4><p data-translate-key="tutorialStep2P1"></p></div>
                            <div><h4 class="font-bold" data-translate-key="tutorialStep3Title"></h4><p data-translate-key="tutorialStep3P1"></p></div>
                            <div><h4 class="font-bold" data-translate-key="tutorialStep4Title"></h4><p data-translate-key="tutorialStep4P1"></p></div>
                        </div>
                    </details>
                </div>
                <div class="mt-12 pt-8 border-t-2 border-gray-200/60">
                    <h3 class="text-xl md:text-2xl font-bold mb-4" data-translate-key="aiTuningTitle"></h3>
                    <div class="glass-panel p-4 md:p-6 -mx-2">
                        <textarea id="aiTuningTextarea" class="w-full p-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 transition-shadow" rows="3" data-translate-key="aiTuningPlaceholder"></textarea>
                        <button id="aiTuningBtn" data-recipe-id="${recipe.id}" class="btn btn-primary w-full mt-4 py-3" data-translate-key="aiTuningBtn"></button>
                        <div id="aiResultContainer"></div>
                    </div>
                </div>`;
            applyTranslations();
        }

        function renderInteractiveCharts(lang) {
            destroyAllCharts();
            const chartDefaultOptions = (yAxisTitleKey) => ({
                responsive: true,
                maintainAspectRatio: false,
                onClick: (e) => {
                    const chart = e.chart;
                    const elements = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
                    if (elements.length) {
                        const firstPoint = elements[0];
                        const recipeId = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index].id;
                        if (recipeId) { handleRecipeSelection(recipeId, 'chart'); }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleFont: { size: 14 },
                        bodyFont: { size: 13 },
                        padding: 10,
                        callbacks: { label: function(context) { return context.raw.name; } }
                    }
                },
                scales: {
                    x: { min: -10, max: 10, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { display: false }, border: { dash: [4, 4] }, title: { display: true, text: t('axisTonality') } },
                    y: { min: -10, max: 10, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { display: false }, border: { dash: [4, 4] }, title: { display: true, text: t(yAxisTitleKey) } }
                }
            });
            
            const colorCtx = document.getElementById('colorChart')?.getContext('2d');
            if (colorCtx) {
                const colorData = recipesData.filter(r => r.type === 'color' && r.coords && typeof r.coords.x === 'number' && typeof r.coords.y === 'number' && r.personalityColor).map(r => ({ ...r.coords, id: r.id, name: r.name[lang] }));
                activeCharts.color = new Chart(colorCtx, {
                    type: 'scatter',
                    data: {
                        datasets: [{
                            data: colorData,
                            pointBackgroundColor: colorData.map(d => {
                                const recipe = recipesData.find(r => r.id === d.id);
                                return recipe ? recipe.personalityColor : '#CCCCCC';
                            }),
                            pointBorderColor: (ctx) => (ctx.raw?.id === state.selectedRecipeId ? '#007AFF' : 'rgba(255, 255, 255, 0.8)'),
                            pointBorderWidth: (ctx) => (ctx.raw?.id === state.selectedRecipeId ? 4 : 2),
                            pointRadius: (ctx) => (ctx.raw?.id === state.selectedRecipeId ? 11 : 7),
                            pointHoverRadius: 11
                        }]
                    },
                    options: chartDefaultOptions('axisSaturation')
                });
            }

            const bwCtx = document.getElementById('bwChart')?.getContext('2d');
            if (bwCtx) {
                const bwData = recipesData.filter(r => r.type === 'bw' && r.coords && typeof r.coords.x === 'number' && typeof r.coords.y === 'number').map(r => ({ ...r.coords, id: r.id, name: r.name[lang] }));
                activeCharts.bw = new Chart(bwCtx, {
                    type: 'scatter',
                    data: {
                        datasets: [{
                            data: bwData,
                            pointBackgroundColor: '#475569',
                            pointBorderColor: (ctx) => (ctx.raw?.id === state.selectedRecipeId ? '#007AFF' : 'rgba(255, 255, 255, 0.8)'),
                            pointBorderWidth: (ctx) => (ctx.raw?.id === state.selectedRecipeId ? 4 : 2),
                            pointRadius: (ctx) => (ctx.raw?.id === state.selectedRecipeId ? 11 : 7),
                            pointHoverRadius: 11,
                            pointHoverBorderWidth: 3
                        }]
                    },
                    options: chartDefaultOptions('axisChroma')
                });
            }
        }

        function toggleMobileNav(show) {
            const menu = document.getElementById('mobileNavMenu');
            menu.classList.toggle('translate-x-full', !show);
        }

        function handleDropdownNav() {
            const container = document.getElementById('pp-dropdown-container');
            const btn = document.getElementById('pp-dropdown-btn');
            const menu = document.getElementById('pp-dropdown-menu');
            const chevron = document.getElementById('pp-dropdown-chevron');

            if (!container || !btn || !menu) return;

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = menu.classList.contains('hidden');
                if (isHidden) {
                    menu.classList.remove('hidden');
                    setTimeout(() => {
                        menu.classList.remove('opacity-0', 'scale-95');
                        chevron.style.transform = 'rotate(180deg)';
                    }, 10);
                } else {
                    menu.classList.add('opacity-0', 'scale-95');
                    chevron.style.transform = 'rotate(0deg)';
                    menu.addEventListener('transitionend', () => {
                        menu.classList.add('hidden');
                    }, { once: true });
                }
            });

            document.addEventListener('click', (e) => {
                if (!container.contains(e.target)) {
                    menu.classList.add('opacity-0', 'scale-95');
                    chevron.style.transform = 'rotate(0deg)';
                    if (!menu.classList.contains('hidden')) {
                        menu.addEventListener('transitionend', () => {
                            menu.classList.add('hidden');
                        }, { once: true });
                    }
                }
            });
        }


        function init() {
            document.body.addEventListener('click', async (e) => {
                const target = e.target;
                
                if (state.lightbox.isOpen) {
                    if (target.id === 'lightbox-bg' || target.closest('#lightbox-close')) { closeLightbox(); } 
                    else if (target.closest('#lightbox-next')) { navigateLightbox(1); } 
                    else if (target.closest('#lightbox-prev')) { navigateLightbox(-1); }
                    const thumb = target.closest('.lightbox-thumb');
                    if (thumb) {
                        state.lightbox.currentIndex = parseInt(thumb.dataset.index);
                        updateLightboxContent();
                    }
                    return; 
                }

                const lightboxTrigger = target.closest('.lightbox-trigger-thumb');
                const homeBtn = target.closest('#homeBtn');
                const navBtn = target.closest('.nav-btn'); 
                const mobileNavBtn = target.closest('.nav-btn-mobile');
                const langBtn = target.closest('.lang-btn');
                const startQuizBtn = target.closest('#startQuizBtn');
                const exploreMoreBtn = target.closest('#exploreMoreBtn');
                const hamburgerBtn = target.closest('#hamburgerBtn');
                const closeMobileNavBtn = target.closest('#closeMobileNavBtn');
                
                if (hamburgerBtn) { toggleMobileNav(true); return; }
                if (closeMobileNavBtn || (target.id === 'mobileNavMenu' && !target.closest('#mobileNavMenu > div'))) { toggleMobileNav(false); return; }
                if (mobileNavBtn) {
                    toggleMobileNav(false);
                    state.selectedRecipeId = null; state.isMobileDetailActive = false;
                    await renderView(mobileNavBtn.dataset.view); return;
                }
                if (homeBtn) { state.selectedRecipeId = null; state.isMobileDetailActive = false; await renderView('home'); return; }
                if (navBtn) { 
                    const dropdownMenu = document.getElementById('pp-dropdown-menu');
                    if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
                        dropdownMenu.classList.add('opacity-0', 'scale-95', 'hidden');
                        document.getElementById('pp-dropdown-chevron').style.transform = 'rotate(0deg)';
                    }
                    state.selectedRecipeId = null; 
                    state.isMobileDetailActive = false; 
                    await renderView(navBtn.dataset.view); 
                    return; 
                }
                if (exploreMoreBtn) { state.selectedRecipeId = null; state.isMobileDetailActive = false; await renderView('recipeFormulas'); return; }
                if (langBtn) { state.currentLang = langBtn.id.replace('lang', '').toLowerCase(); await renderView(state.currentView); return; }

                const quizOption = target.closest('.quiz-option');
                const quizChoice = target.closest('.quiz-choice-option');
                if (startQuizBtn) { state.quizStep = 0; state.quizAnswers = {}; await renderView('quiz'); return; }
                if (quizOption) {
                    if(!quizOption.classList.contains('selected')) {
                        const group = quizOption.closest('[data-quiz-group]').dataset.quizGroup;
                        state.quizAnswers[group] = quizOption.dataset.value;
                        document.querySelectorAll(`[data-quiz-group="${group}"] .quiz-option`).forEach(opt => opt.classList.remove('selected'));
                        quizOption.classList.add('selected');
                        setTimeout(() => {
                            state.quizStep++;
                            if (state.quizStep >= quizQuestions.length) handleQuizSubmit(); else renderView('quiz');
                        }, 250);
                    }
                    return;
                }
                 if (quizChoice) { 
                    state.selectedRecipeId = quizChoice.dataset.recipeId; 
                    state.isMobileDetailActive = true;
                    await renderView('recipeFormulas'); return; 
                }

                const recipeItemContent = target.closest('.recipe-item-content');
                const recipeDot = target.closest('.recipe-dot');
                const recipeCompareCb = target.closest('.recipe-compare-cb');
                const compareBtn = target.closest('#compareBtn');
                const compareWithOriginalBtn = target.closest('#compareWithOriginalBtn');
                const aiTuningBtn = target.closest('#aiTuningBtn');
                const backToListBtn = target.closest('#backToListBtn');
                const closeModalBtn = target.closest('#closeComparisonModalBtn');

                if (recipeItemContent || recipeDot) { handleRecipeSelection(target.closest('[data-recipe-id]').dataset.recipeId, 'div'); return; }
                if (recipeCompareCb) { handleRecipeSelection(recipeCompareCb.dataset.recipeId, 'checkbox'); return; }
                if (compareBtn && !compareBtn.disabled) { handleAiComparison(state.comparisonList[0], state.comparisonList[1]); return; }
                if (compareWithOriginalBtn) { handleAiComparison(compareWithOriginalBtn.dataset.originalId, null, state.lastGeneratedAiRecipe); return; }
                if (aiTuningBtn) { handleAiAdjustment(aiTuningBtn); return; }
                if (backToListBtn) { state.isMobileDetailActive = false; renderLibraryDetails(); return; }
                if (closeModalBtn) { document.getElementById('comparisonModal').classList.add('hidden'); return; }
                if (lightboxTrigger) {
                    const recipeId = lightboxTrigger.dataset.recipeId;
                    const recipe = recipesData.find(r => r.id === recipeId);
                    if (recipe && recipe.demoImages && recipe.demoImages.length > 0) {
                         openLightbox(recipe.demoImages, parseInt(lightboxTrigger.dataset.index));
                    }
                    return;
                }

                if (document.getElementById('filtersContainer')?.contains(target)) { handleFilterClick(e); return; }
            });
            
            document.body.addEventListener('input', (e) => {
                if (e.target.id === 'searchInput') {
                    renderLibraryList();
                }
            });
            
            window.addEventListener('resize', () => { if(state.currentView === 'recipeFormulas') renderLibraryDetails(); });
            
            renderView('home');
            handleDropdownNav();
        }

        document.addEventListener("DOMContentLoaded", init);

const recipesData = [
    {
        "id": "scl-01-vintage-memory",
        "name": { "vi": "SCL-01: Ký Ức Vintage", "en": "SCL-01: Vintage Memory" },
        "description": { "vi": "Tông màu phim cổ điển, độ bão hòa thấp và tương phản mềm, như một ký ức xa xăm.", "en": "A classic film tone with low saturation and soft contrast, like a distant memory." },
        "type": "color", "contrast": "low", "saturation": "low",
        "whiteBalance": "8600K, B2.5-M3",
        "settings": { "Black level": "-4", "Gamma": "Cine4", "Black Gamma": "Middle -6", "Knee": "Manual 82.5% +3", "Color Mode": "Still", "Saturation": "-7", "Color Phase": "0" },
        "colorDepth": { "R": "-5", "G": "+6", "B": "0", "C": "+2", "M": "+6", "Y": "+4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#a1887f", "coords": { "x": -6.5, "y": -5.5 }
    },
    {
        "id": "scl-02-emerald-dream",
        "name": { "vi": "SCL-02: Giấc Mơ Lục Bảo", "en": "SCL-02: Emerald Dream" },
        "description": { "vi": "Tông màu cổ điển với sắc xanh lá cây đặc trưng, mang lại cảm giác trong trẻo và hoài niệm.", "en": "A classic tone with characteristic green hues, providing a clear and nostalgic feel." },
        "type": "color", "contrast": "low", "saturation": "low",
        "whiteBalance": "3700K, A7-M0.5",
        "settings": { "Black level": "0", "Gamma": "Movie", "Black Gamma": "Wide +6", "Knee": "Manual 80% +3", "Color Mode": "Still", "Saturation": "+10", "Color Phase": "-2" },
        "colorDepth": { "R": "-3", "G": "+6", "B": "-2", "C": "-2", "M": "-4", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#66bb6a", "coords": { "x": -3.0, "y": -0.5 }
    },
    {
        "id": "scl-03-neon-noir",
        "name": { "vi": "SCL-03: Đêm Màu", "en": "SCL-03: Neon Noir" },
        "description": { "vi": "Tông màu xanh lá cây đậm chất điện ảnh, lý tưởng cho những cảnh đêm huyền ảo và rực rỡ.", "en": "A cinematic green tone, ideal for magical and vibrant night scenes." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "3000K, A7-G7",
        "settings": { "Black level": "-14", "Gamma": "Still", "Black Gamma": "Wide +6", "Knee": "Manual 105% +3", "Color Mode": "S-Gamut3.Cine", "Saturation": "+31", "Color Phase": "+4" },
        "colorDepth": { "R": "+4", "G": "0", "B": "+1", "C": "+4", "M": "+4", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#880e4f", "coords": { "x": 7.5, "y": 8.0 }
    },
    {
        "id": "scl-04-urban-shadows",
        "name": { "vi": "SCL-04: Bóng Đô Thị", "en": "SCL-04: Urban Shadows" },
        "description": { "vi": "Đen trắng tương phản cao, vùng tối sâu và chi tiết, hoàn hảo cho kiến trúc và đường phố.", "en": "High-contrast black and white with deep, detailed shadows, perfect for architecture and street." },
        "type": "bw", "contrast": "high", "saturation": "low",
        "whiteBalance": "AWB",
        "settings": { "Black level": "-9", "Gamma": "Still", "Black Gamma": "Middle -2", "Knee": "Manual 85% +4", "Color Mode": "Black & White", "Saturation": "+14", "Color Phase": "0" },
        "colorDepth": { "R": "-3", "G": "0", "B": "+2", "C": "+2", "M": "-3", "Y": "0" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#616161", "coords": { "x": 5.0, "y": -2.0 }
    },
    {
        "id": "scl-05-faded-canvas",
        "name": { "vi": "SCL-05: Vải Bạc Màu", "en": "SCL-05: Faded Canvas" },
        "description": { "vi": "Đen trắng với hiệu ứng 'faded', vùng tối được nâng lên tạo cảm giác hoài niệm, mơ màng.", "en": "Black and white with a 'faded' effect, where shadows are lifted to create a nostalgic, dreamy feel." },
        "type": "bw", "contrast": "low", "saturation": "medium",
        "whiteBalance": "AWB",
        "settings": { "Black level": "+2", "Gamma": "Still", "Black Gamma": "Middle -6", "Knee": "Manual 75% +1", "Color Mode": "Black & White", "Saturation": "0", "Color Phase": "0" },
        "colorDepth": { "R": "+4", "G": "+4", "B": "+6", "C": "+1", "M": "+6", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#9e9e9e", "coords": { "x": -3.0, "y": 1.0 }
    },
    {
        "id": "scl-06-sun-drenched",
        "name": { "vi": "SCL-06: Nắng Đượm", "en": "SCL-06: Sun-drenched" },
        "description": { "vi": "Tông màu ấm áp của cồn cát dưới ánh nắng, mang đậm cảm giác hoài cổ và tự do.", "en": "The warm tones of sunlit dunes, carrying a deep sense of nostalgia and freedom." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "AWB, A2-G1.75",
        "settings": { "Black level": "+3", "Gamma": "S-Cinetone", "Black Gamma": "Middle -6", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+31", "Color Phase": "+2" },
        "colorDepth": { "R": "+2", "G": "+6", "B": "+3", "C": "-4", "M": "-2", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ffb300", "coords": { "x": 0.5, "y": 8.5 }
    },
    {
        "id": "scl-07-silver-screen",
        "name": { "vi": "SCL-07: Màn Bạc", "en": "SCL-07: Silver Screen" },
        "description": { "vi": "Đen trắng tương phản cao, mô phỏng những thước phim điện ảnh kinh điển, sắc nét.", "en": "High-contrast black and white, simulating classic, sharp motion picture film." },
        "type": "bw", "contrast": "high", "saturation": "high",
        "whiteBalance": "5500K",
        "settings": { "Black level": "-14", "Gamma": "Still", "Black Gamma": "Wide -6", "Knee": "Manual 75% +3", "Color Mode": "Black & White", "Saturation": "+31", "Color Phase": "0" },
        "colorDepth": { "R": "+1", "G": "+6", "B": "0", "C": "+1", "M": "+6", "Y": "0" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#424242", "coords": { "x": 8.0, "y": 7.0 }
    },
    {
        "id": "scl-08-meadow-lullaby",
        "name": { "vi": "SCL-08: Ru Đồng", "en": "SCL-08: Meadow Lullaby" },
        "description": { "vi": "Tông màu ấm áp, mềm mại, gợi cảm giác của ánh nắng ban mai trên một đồng cỏ yên bình.", "en": "A warm, soft tone that evokes the feeling of morning sun on a peaceful meadow." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "4200K, A7-M2",
        "settings": { "Black level": "+4", "Gamma": "Still", "Black Gamma": "Narrow -6", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+13", "Color Phase": "-2" },
        "colorDepth": { "R": "-2", "G": "+6", "B": "-2", "C": "-6", "M": "-3", "Y": "0" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#fff176", "coords": { "x": -6.0, "y": 3.5 }
    },
    {
        "id": "scl-09-crimson-peak",
        "name": { "vi": "SCL-09: Đỉnh Thẫm", "en": "SCL-09: Crimson Peak" },
        "description": { "vi": "Màu sắc mạnh mẽ, tương phản cao, với tông đỏ và cam được nhấn mạnh, tạo nên sự kịch tính.", "en": "Strong colors with high contrast, with emphasized red and orange tones, creating a dramatic effect." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "8500K, B3.5-G1",
        "settings": { "Black level": "-14", "Gamma": "Still", "Black Gamma": "Wide -6", "Knee": "Manual 105% +4", "Color Mode": "S-Cinetone", "Saturation": "+31", "Color Phase": "0" },
        "colorDepth": { "R": "+4", "G": "+6", "B": "+1", "C": "+4", "M": "+4", "Y": "+4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#e53935", "coords": { "x": 8.5, "y": 8.5 }
    },
    {
        "id": "scl-10-golden-ember",
        "name": { "vi": "SCL-10: Tàn Tro Vàng", "en": "SCL-10: Golden Ember" },
        "description": { "vi": "Tái tạo ánh sáng vàng óng và mềm mại của buổi hoàng hôn, mang lại cảm giác ấm áp và lãng mạn.", "en": "Recreates the golden, soft light of sunset, providing a warm and romantic feel." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "5000K, A2-M1",
        "settings": { "Black level": "+5", "Gamma": "Still", "Black Gamma": "Wide -6", "Knee": "Manual 75% +3", "Color Mode": "S-Gamut3.Cine", "Saturation": "+24", "Color Phase": "+1" },
        "colorDepth": { "R": "-2", "G": "+6", "B": "+4", "C": "+4", "M": "+4", "Y": "0" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#e57373", "coords": { "x": 3.5, "y": 5.0 }
    },
    {
        "id": "scl-11-azure-dream",
        "name": { "vi": "SCL-11: Giấc Mơ Xanh", "en": "SCL-11: Azure Dream" },
        "description": { "vi": "Tông màu xanh dương đặc trưng, gợi cảm giác của một thước phim điện ảnh quay vào ban ngày.", "en": "A characteristic blue tone, evoking the feel of a daylight-shot motion picture." },
        "type": "color", "contrast": "medium", "saturation": "medium",
        "whiteBalance": "7400K, B4-M1",
        "settings": { "Black level": "0", "Gamma": "Still", "Black Gamma": "Middle +6", "Knee": "Manual 75% +3", "Color Mode": "Still", "Saturation": "+9", "Color Phase": "-2" },
        "colorDepth": { "R": "+3", "G": "+4", "B": "-3", "C": "-3", "M": "+4", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#42a5f5", "coords": { "x": 1.0, "y": 4.5 }
    },
    {
        "id": "scl-12-vibrant-daylight",
        "name": { "vi": "SCL-12: Nắng Sống Động", "en": "SCL-12: Vibrant Daylight" },
        "description": { "vi": "Màu sắc rực rỡ, trong trẻo, mô phỏng những thước phim quay ban ngày đầy sức sống.", "en": "Vibrant, clear colors, simulating lively daylight motion picture film." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "3300K, A7-G0.75",
        "settings": { "Black level": "-9", "Gamma": "Still", "Black Gamma": "Middle -6", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+31", "Color Phase": "+1" },
        "colorDepth": { "R": "+3", "G": "+6", "B": "-5", "C": "+3", "M": "+5", "Y": "+4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ef5350", "coords": { "x": 4.0, "y": 8.5 }
    },
    {
        "id": "scl-13-soft-focus",
        "name": { "vi": "SCL-13: Nét Mềm", "en": "SCL-13: Soft Focus" },
        "description": { "vi": "Tông màu mềm mại, độ bão hòa thấp, phù hợp cho chân dung và thời trang, tạo cảm giác nhẹ nhàng.", "en": "Soft tones with low saturation, suitable for portraits and fashion, creating a gentle feel." },
        "type": "color", "contrast": "low", "saturation": "low",
        "whiteBalance": "4100K, A7-M0.25",
        "settings": { "Black level": "-7", "Gamma": "Movie", "Black Gamma": "Middle -6", "Knee": "Manual 75% +3", "Color Mode": "Still", "Saturation": "+4", "Color Phase": "0" },
        "colorDepth": { "R": "0", "G": "+1", "B": "+2", "C": "+1", "M": "-6", "Y": "0" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#e0e0e0", "coords": { "x": -0.5, "y": -3.5 }
    },
    {
        "id": "scl-14-candlelight",
        "name": { "vi": "SCL-14: Ánh Nến", "en": "SCL-14: Candlelight" },
        "description": { "vi": "Tông màu vàng sang trọng, phù hợp cho những cảnh đêm đô thị lãng mạn, ấm cúng.", "en": "A luxurious golden tone, suitable for romantic and cozy urban nightscapes." },
        "type": "color", "contrast": "medium", "saturation": "medium",
        "whiteBalance": "5500K, A7-M0.75",
        "settings": { "Black level": "+1", "Gamma": "Still", "Black Gamma": "Narrow -6", "Knee": "Manual 75% +3", "Color Mode": "S-Gamut3.Cine", "Saturation": "+17", "Color Phase": "+6" },
        "colorDepth": { "R": "+4", "G": "0", "B": "+1", "C": "+4", "M": "+4", "Y": "-4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ffb74d", "coords": { "x": -1.0, "y": 5.0 }
    },
    {
        "id": "scl-15-graphic-mono",
        "name": { "vi": "SCL-15: Đơn Sắc Đồ Họa", "en": "SCL-15: Graphic Mono" },
        "description": { "vi": "Đen trắng với độ tương phản cực cao, tạo hiệu ứng đồ họa mạnh mẽ và ấn tượng.", "en": "Black and white with extremely high contrast, creating a strong and impressive graphic effect." },
        "type": "bw", "contrast": "high", "saturation": "high",
        "whiteBalance": "5500K",
        "settings": { "Black level": "-14", "Gamma": "Still", "Black Gamma": "Wide -6", "Knee": "Manual 75% +4", "Color Mode": "Black&White", "Saturation": "+31", "Color Phase": "0" },
        "colorDepth": { "R": "+3", "G": "+6", "B": "+6", "C": "+6", "M": "+6", "Y": "+6" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#424242", "coords": { "x": 8.5, "y": 8.5 }
    },
    {
        "id": "scl-16-summer-film",
        "name": { "vi": "SCL-16: Phim Mùa Hè", "en": "SCL-16: Summer Film" },
        "description": { "vi": "Màu sắc cân bằng, trung thực, mô phỏng những thước phim mùa hè trong trẻo và tươi mát.", "en": "Balanced, faithful colors, simulating clear and fresh summer films." },
        "type": "color", "contrast": "low", "saturation": "low",
        "whiteBalance": "4000K, A7-M0.25",
        "settings": { "Black level": "+1", "Gamma": "Still", "Black Gamma": "Wide -6", "Knee": "Manual 75 +3", "Color Mode": "Still", "Saturation": "+1", "Color Phase": "0" },
        "colorDepth": { "R": "0", "G": "+6", "B": "0", "C": "+2", "M": "+1", "Y": "0" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#aed581", "coords": { "x": -2.0, "y": -1.0 }
    },
    {
        "id": "scl-17-vintage-charm",
        "name": { "vi": "SCL-17: Nét Duyên Cổ", "en": "SCL-17: Vintage Charm" },
        "description": { "vi": "Độ bão hòa thấp và tương phản mềm, lý tưởng cho những bức chân dung mang màu sắc thời gian.", "en": "Low saturation and soft contrast, ideal for portraits with a timeless quality." },
        "type": "color", "contrast": "medium", "saturation": "low",
        "whiteBalance": "4200K, A7-M1",
        "settings": { "Black level": "-9", "Gamma": "Movie", "Black Gamma": "Middle -6", "Knee": "Manual 75% +3", "Color Mode": "Still", "Saturation": "+6", "Color Phase": "+2" },
        "colorDepth": { "R": "-2", "G": "+6", "B": "-2", "C": "-2", "M": "-4", "Y": "+3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#e57373", "coords": { "x": 2.0, "y": -2.0 }
    },
    {
        "id": "scl-18-dramatic-sky",
        "name": { "vi": "SCL-18: Bầu Trời Kịch Tính", "en": "SCL-18: Dramatic Sky" },
        "description": { "vi": "Hiệu ứng hồng ngoại đen trắng, làm cho cây cối và bầu trời trở nên ấn tượng, siêu thực.", "en": "A black and white infrared effect, making foliage and skies dramatic and surreal." },
        "type": "bw", "contrast": "high", "saturation": "high",
        "whiteBalance": "AWB, A3",
        "settings": { "Black level": "-9", "Gamma": "Still", "Black Gamma": "Wide -6", "Knee": "Manual 75% +3", "Color Mode": "Black & White", "Saturation": "+31", "Color Phase": "+3" },
        "colorDepth": { "R": "-6", "G": "-6", "B": "+6", "C": "+6", "M": "+6", "Y": "-4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#616161", "coords": { "x": 6.5, "y": 6.5 }
    },
    {
        "id": "scl-19-amber-hues",
        "name": { "vi": "SCL-19: Sắc Hổ Phách", "en": "SCL-19: Amber Hues" },
        "description": { "vi": "Tông màu hổ phách ấm áp, gợi nhớ những bức ảnh in từ thập niên 70, đầy hoài niệm.", "en": "Warm amber tones, reminiscent of prints from the 70s, full of nostalgia." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "4300K, A7-M0.25",
        "settings": { "Black level": "+1", "Gamma": "Movie", "Black Gamma": "Middle +1", "Knee": "Manual 75% +3", "Color Mode": "Still", "Saturation": "+2", "Color Phase": "0" },
        "colorDepth": { "R": "0", "G": "+6", "B": "+1", "C": "+1", "M": "+3", "Y": "+1" },
        "detailSettings": { "Level": "-6", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "0", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ffb74d", "coords": { "x": -5.5, "y": 2.0 }
    },
    {
        "id": "scl-20-surreal-pop",
        "name": { "vi": "SCL-20: Pop Siêu Thực", "en": "SCL-20: Surreal Pop" },
        "description": { "vi": "Màu sắc cực kỳ rực rỡ và bão hòa, tạo nên một thế giới siêu thực và đầy màu sắc.", "en": "Extremely vibrant and saturated colors, creating a surreal and colorful world." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "3500K, A7-G0.25",
        "settings": { "Black level": "-1", "Gamma": "Still", "Black Gamma": "Middle -6", "Knee": "Manual 75% +4", "Color Mode": "ITU709Matrix", "Saturation": "+17", "Color Phase": "-2" },
        "colorDepth": { "R": "+1", "G": "+6", "B": "+6", "C": "+6", "M": "+6", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ef5350", "coords": { "x": 3.0, "y": 8.0 }
    },
    {
        "id": "scl-21-frosty-mood",
        "name": { "vi": "SCL-21: Tâm Trạng Lạnh", "en": "SCL-21: Frosty Mood" },
        "description": { "vi": "Tông màu lạnh với sắc xanh dương và xanh lá cây, độ tương phản cao, mang lại cảm giác sắc lạnh.", "en": "A cool tone with blue and green hues and high contrast, providing a sharp, cold feel." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "4600K, A7-M1.5",
        "settings": { "Black level": "-7", "Gamma": "Cine1", "Black Gamma": "Wide +6", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+19", "Color Phase": "-3" },
        "colorDepth": { "R": "+1", "G": "+6", "B": "-4", "C": "-4", "M": "+2", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#29b6f6", "coords": { "x": 4.5, "y": 2.0 }
    },
    {
        "id": "scl-22-classic-warmth",
        "name": { "vi": "SCL-22: Cổ Điển Ấm", "en": "SCL-22: Classic Warmth" },
        "description": { "vi": "Tông màu điện ảnh cổ điển, cân bằng, với một chút ấm áp dễ chịu của nắng vàng.", "en": "A classic, balanced cinematic tone with a pleasant touch of golden warmth." },
        "type": "color", "contrast": "medium", "saturation": "medium",
        "whiteBalance": "AWB White Priority, A2-G0.25",
        "settings": { "Black level": "-1", "Gamma": "Movie", "Black Gamma": "Wide +6", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+11", "Color Phase": "0" },
        "colorDepth": { "R": "-2", "G": "+6", "B": "-4", "C": "+4", "M": "-4", "Y": "-1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ffca28", "coords": { "x": 2.0, "y": 1.5 }
    },
    {
        "id": "scl-23-crystal-clear",
        "name": { "vi": "SCL-23: Trong Suốt", "en": "SCL-23: Crystal Clear" },
        "description": { "vi": "Đen trắng với hạt mịn và chi tiết sắc nét, mang lại độ trong trẻo cao như pha lê.", "en": "Black and white with fine grain and sharp details, delivering crystal-high clarity." },
        "type": "bw", "contrast": "high", "saturation": "low",
        "whiteBalance": "AWB, B3-G0.25",
        "settings": { "Black level": "-11", "Gamma": "Still", "Black Gamma": "Middle -6", "Knee": "Manual 82% +4", "Color Mode": "Black & White", "Saturation": "0", "Color Phase": "0" },
        "colorDepth": { "R": "0", "G": "-6", "B": "+6", "C": "+6", "M": "+6", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#757575", "coords": { "x": 4.0, "y": -0.5 }
    },
    {
        "id": "scl-24-pro-warmth",
        "name": { "vi": "SCL-24: Chuyên Nghiệp Ấm", "en": "SCL-24: Pro Warmth" },
        "description": { "vi": "Màu sắc chân thực, tông màu da đẹp, phù hợp cho chân dung chuyên nghiệp với tông ấm.", "en": "Accurate colors and beautiful skin tones, suitable for professional portraits with warm tones." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4000K, A7-G1",
        "settings": { "Black level": "+5", "Gamma": "S-Cinetone/Cine4", "Black Gamma": "Narrow -6", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+29", "Color Phase": "-1" },
        "colorDepth": { "R": "+1", "G": "+6", "B": "+2", "C": "+4", "M": "+2", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ff8a65", "coords": { "x": 3.0, "y": 8.0 }
    },
    {
        "id": "scl-25-mystic-garden",
        "name": { "vi": "SCL-25: Vườn Huyền Bí", "en": "SCL-25: Mystic Garden" },
        "description": { "vi": "Tông màu độc đáo với sắc xanh lá và tím, tạo cảm giác kỳ ảo và bí ẩn như trong một khu vườn.", "en": "A unique tone with green and magenta hues, creating a fantastical and mysterious feel as if in a garden." },
        "type": "color", "contrast": "medium", "saturation": "medium",
        "whiteBalance": "7000K, B1-M1",
        "settings": { "Black level": "+6", "Gamma": "Still", "Black Gamma": "Middle +6", "Knee": "Manual 80% +3", "Color Mode": "S-Gamut3.Cine", "Saturation": "+9", "Color Phase": "+6" },
        "colorDepth": { "R": "0", "G": "+6", "B": "+4", "C": "+4", "M": "+4", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ba68c8", "coords": { "x": 0.0, "y": 2.5 }
    },
    {
        "id": "scl-26-night-vision",
        "name": { "vi": "SCL-26: Tầm Nhìn Đêm", "en": "SCL-26: Night Vision" },
        "description": { "vi": "Mô phỏng phim điện ảnh, với tông màu vàng ấm đặc trưng cho những cảnh quay đêm.", "en": "Simulates motion picture film, with characteristic warm yellow tones for night scenes." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "4700K, A7-G1.25",
        "settings": { "Black level": "-14", "Gamma": "S-log2 or S-log3", "Black Gamma": "Middle -6", "Knee": "Manual 75% +3", "Color Mode": "ITU709Matrix", "Saturation": "+31", "Color Phase": "+4" },
        "colorDepth": { "R": "0", "G": "+6", "B": "-6", "C": "-6", "M": "+4", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#827717", "coords": { "x": 5.5, "y": 7.5 }
    },
    {
        "id": "scl-27-vibrant-pop",
        "name": { "vi": "SCL-27: Pop Rực Rỡ", "en": "SCL-27: Vibrant Pop" },
        "description": { "vi": "Màu sắc rực rỡ, hơi ngả xanh, tạo cảm giác năng động và nổi bật như tranh Pop Art.", "en": "Vibrant, slightly bluish colors, creating a dynamic and prominent feel like Pop Art." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "3400K, A7-M1.75",
        "settings": { "Black level": "-5", "Gamma": "Still", "Black Gamma": "Wide +6", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+31", "Color Phase": "0" },
        "colorDepth": { "R": "+2", "G": "+6", "B": "+1", "C": "+6", "M": "-4", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ef5350", "coords": { "x": 6.0, "y": 8.5 }
    },
    {
        "id": "scl-28-subtle-hues",
        "name": { "vi": "SCL-28: Sắc Màu Tinh Tế", "en": "SCL-28: Subtle Hues" },
        "description": { "vi": "Tông màu chân thực, hơi ngả xanh, phù hợp cho nhiều thể loại nhiếp ảnh cần sự tinh tế.", "en": "A realistic, slightly blueish tone, suitable for many photography genres that require subtlety." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "3900K, A7-M0.75",
        "settings": { "Black level": "+3", "Gamma": "Movie", "Black Gamma": "Narrow -6", "Knee": "Manual 80% +3", "Color Mode": "Still", "Saturation": "+13", "Color Phase": "-1" },
        "colorDepth": { "R": "-2", "G": "+4", "B": "-2", "C": "-2", "M": "-4", "Y": "-1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#a1887f", "coords": { "x": -1.0, "y": 4.0 }
    },
    {
        "id": "scl-29-warm-film",
        "name": { "vi": "SCL-29: Phim Ấm", "en": "SCL-29: Warm Film" },
        "description": { "vi": "Một phiên bản khác của tông màu ấm với màu sắc dịu hơn, mang đậm chất phim điện ảnh.", "en": "Another version of the warm tone with more subdued colors, with a strong cinematic quality." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4400K, A7-G1",
        "settings": { "Black level": "0", "Gamma": "Cine1", "Black Gamma": "Middle +6", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+24", "Color Phase": "+2" },
        "colorDepth": { "R": "+2", "G": "+6", "B": "0", "C": "0", "M": "+4", "Y": "+2" },
        "detailSettings": { "Level": "-6", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 5", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ffb74d", "coords": { "x": 2.5, "y": 6.0 }
    },
    {
        "id": "scl-30-blue-mono",
        "name": { "vi": "SCL-30: Đơn Sắc Xanh", "en": "SCL-30: Blue Mono" },
        "description": { "vi": "Đen trắng mô phỏng phim Orthochromatic, nhạy với màu xanh dương và xanh lá, tạo hiệu ứng độc đáo.", "en": "Black and white simulating Orthochromatic film, sensitive to blue and green, creating a unique effect." },
        "type": "bw", "contrast": "high", "saturation": "medium",
        "whiteBalance": "AWB, A3-M2.75",
        "settings": { "Black level": "-11", "Gamma": "Movie", "Black Gamma": "Narrow -6", "Knee": "105% +4", "Color Mode": "Still", "Saturation": "+14", "Color Phase": "0" },
        "colorDepth": { "R": "+6", "G": "+6", "B": "-6", "C": "-6", "M": "+6", "Y": "+6" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#616161", "coords": { "x": 5.5, "y": 2.0 }
    },
    {
        "id": "scl-31-holiday-cheer",
        "name": { "vi": "SCL-31: Niềm Vui Lễ Hội", "en": "SCL-31: Holiday Cheer" },
        "description": { "vi": "Tông màu ấm áp, rực rỡ, mang lại không khí lễ hội và vui tươi, tràn ngập sức sống.", "en": "A warm, vibrant tone that brings a festive and joyful atmosphere, full of life." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "AWB, A5-G0.25",
        "settings": { "Black level": "-6", "Gamma": "Cine3", "Black Gamma": "Narrow -6", "Knee": "105% +4", "Color Mode": "Still", "Saturation": "+12", "Color Phase": "+3" },
        "colorDepth": { "R": "+2", "G": "+6", "B": "-3", "C": "-4", "M": "+3", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ef5350", "coords": { "x": 6.5, "y": 0.5 }
    },
    {
        "id": "scl-32-rich-palette",
        "name": { "vi": "SCL-32: Bảng Màu Đậm", "en": "SCL-32: Rich Palette" },
        "description": { "vi": "Màu sắc rực rỡ với tông đỏ và xanh dương nổi bật, tạo cảm giác sang trọng và quý phái.", "en": "Vibrant colors with prominent red and blue tones, creating a luxurious and noble feel." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "7000K, B2-M1",
        "settings": { "Black level": "-9", "Gamma": "Movie", "Black Gamma": "Wide +6", "Knee": "Manual 75% +3", "Color Mode": "Movie", "Saturation": "+24", "Color Phase": "+1" },
        "colorDepth": { "R": "+1", "G": "+6", "B": "+6", "C": "+6", "M": "+6", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#d81b60", "coords": { "x": 8.0, "y": 4.5 }
    },
    {
        "id": "scl-33-ethereal-mono",
        "name": { "vi": "SCL-33: Đơn Sắc Thanh Khiết", "en": "SCL-33: Ethereal Mono" },
        "description": { "vi": "Một biến thể của Eterna với màu sắc đậm và bão hòa hơn, tạo hiệu ứng đen trắng ấn tượng.", "en": "A variation of Eterna with richer and more saturated colors, creating a striking black and white effect." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "4000K, A7-M1",
        "settings": { "Black level": "-4", "Gamma": "Cine4", "Black Gamma": "Wide -4", "Knee": "Manual 87.5% +2", "Color Mode": "S-Gamut3", "Saturation": "+31", "Color Phase": "+5" },
        "colorDepth": { "R": "-2", "G": "-1", "B": "+2", "C": "+6", "M": "-2", "Y": "-1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#e57373", "coords": { "x": 7.5, "y": 5.0 }
    },
    {
        "id": "scl-34-green-tint-mono",
        "name": { "vi": "SCL-34: Đơn Sắc Ám Xanh Lá", "en": "SCL-34: Green Tint Mono" },
        "description": { "vi": "Đen trắng với tông màu xanh lá cây, tạo hiệu ứng độc đáo và nghệ thuật.", "en": "Black and white with a green tint, creating a unique and artistic effect." },
        "type": "bw", "contrast": "high", "saturation": "low",
        "whiteBalance": "AWB",
        "settings": { "Black level": "-14", "Gamma": "Still", "Black Gamma": "Wide -6", "Knee": "Manual 85% +4", "Color Mode": "Black & White", "Saturation": "+14", "Color Phase": "0" },
        "colorDepth": { "R": "+1", "G": "-3", "B": "0", "C": "+1", "M": "0", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#a5d6a7", "coords": { "x": 6.0, "y": 0.0 }
    },
    {
        "id": "scl-35-punchy-color",
        "name": { "vi": "SCL-35: Sắc Màu Tươi", "en": "SCL-35: Punchy Color" },
        "description": { "vi": "Công thức màu tương phản cao với tông màu ấm, rực rỡ và mạnh mẽ.", "en": "A high-contrast color recipe with warm, vibrant, and punchy tones." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "4000K, A5-M0.5",
        "settings": { "Black level": "-14", "Gamma": "Still", "Black Gamma": "Wide -6", "Knee": "Manual 92.5% +4", "Color Mode": "S-Gamut3.Cine", "Saturation": "+26", "Color Phase": "+5" },
        "colorDepth": { "R": "+4", "G": "+6", "B": "+4", "C": "+4", "M": "+1", "Y": "0" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#d32f2f", "coords": { "x": 6.0, "y": 7.5 }
    },
    {
        "id": "scl-36-cool-daylight",
        "name": { "vi": "SCL-36: Nắng Lạnh", "en": "SCL-36: Cool Daylight" },
        "description": { "vi": "Tông màu lạnh, siêu thực với độ bão hòa cao, phù hợp cho cảnh ban ngày.", "en": "A surreal, cool tone with high saturation, suitable for daylight scenes." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "8000K, B2-M2",
        "settings": { "Black level": "-14", "Gamma": "Cine3", "Black Gamma": "Wide +6", "Knee": "Manual 85% +3", "Color Mode": "S-Gamut3.Cine", "Saturation": "+19", "Color Phase": "+6" },
        "colorDepth": { "R": "-4", "G": "0", "B": "+2", "C": "+3", "M": "+4", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#4fc3f7", "coords": { "x": 5.5, "y": 5.0 }
    },
    {
        "id": "scl-37-modern-look",
        "name": { "vi": "SCL-37: Vẻ Hiện Đại", "en": "SCL-37: Modern Look" },
        "description": { "vi": "Màu sắc sống động và bão hòa cao, mang lại cảm giác tươi mới và hiện đại.", "en": "Vivid and highly saturated colors, providing a fresh and modern feel." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "4300K, A3.5",
        "settings": { "Black level": "-9", "Gamma": "Cine1", "Black Gamma": "Middle +6", "Knee": "Auto", "Color Mode": "S-Gamut3.Cine", "Saturation": "+31", "Color Phase": "+4" },
        "colorDepth": { "R": "-2", "G": "+3", "B": "+2", "C": "+2", "M": "-1", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#4caf50", "coords": { "x": 4.0, "y": 6.5 }
    },
    {
        "id": "scl-38-warm-vintage",
        "name": { "vi": "SCL-38: Cổ Điển Ấm", "en": "SCL-38: Warm Vintage" },
        "description": { "vi": "Phiên bản thứ hai của tông màu vàng ấm, với tông màu ấm và bão hòa hơn.", "en": "A second version of the warm golden tone, with warmer and more saturated colors." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4600K, A7-G1.25",
        "settings": { "Black level": "+1", "Gamma": "S-Cinetone", "Black Gamma": "Narrow -6", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+24", "Color Phase": "+4" },
        "colorDepth": { "R": "+2", "G": "-2", "B": "-4", "C": "-2", "M": "+2", "Y": "-1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ffb74d", "coords": { "x": 2.0, "y": 5.5 }
    },
    {
        "id": "scl-39-soft-portrait",
        "name": { "vi": "SCL-39: Chân Dung Mềm Mại", "en": "SCL-39: Soft Portrait" },
        "description": { "vi": "Mô phỏng phim chân dung, lý tưởng để có được tông màu da đẹp và tự nhiên.", "en": "Simulates portrait film, ideal for achieving beautiful and natural skin tones." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "4500K, A7-M1",
        "settings": { "Black level": "-14", "Gamma": "S-Log2/S-Log3", "Black Gamma": "Middle -6", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+19", "Color Phase": "+2" },
        "colorDepth": { "R": "+2", "G": "+4", "B": "+4", "C": "+6", "M": "+6", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ffccbc", "coords": { "x": 5.0, "y": 3.0 }
    },
    {
        "id": "scl-40-natural-light",
        "name": { "vi": "SCL-40: Ánh Sáng Tự Nhiên", "en": "SCL-40: Natural Light" },
        "description": { "vi": "Tông màu chân thực, hơi ngả xanh, phù hợp cho nhiều thể loại nhiếp ảnh.", "en": "A realistic, slightly blueish tone, suitable for many photography genres." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "3900K, A7-M0.75",
        "settings": { "Black level": "+3", "Gamma": "Movie", "Black Gamma": "Narrow -6", "Knee": "Manual 80% +3", "Color Mode": "Still", "Saturation": "+13", "Color Phase": "-1" },
        "colorDepth": { "R": "-2", "G": "+4", "B": "-2", "C": "-2", "M": "-4", "Y": "-1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#81c784", "coords": { "x": -1.0, "y": 4.0 }
    },
    {
        "id": "scl-41-warm-tones",
        "name": { "vi": "SCL-41: Tông Màu Ấm", "en": "SCL-41: Warm Tones" },
        "description": { "vi": "Tông màu độc đáo, ấm áp, mang lại cảm giác kỳ diệu và khác biệt cho bức ảnh.", "en": "A unique, warm tone that brings a magical and distinct feeling to the photo." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "7000K, B4-M1.25",
        "settings": { "Black level": "-11", "Gamma": "Movie", "Black Gamma": "Middle -6", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+16", "Color Phase": "0" },
        "colorDepth": { "R": "-3", "G": "+6", "B": "-2", "C": "-2", "M": "-4", "Y": "+3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ffb74d", "coords": { "x": 5.5, "y": 1.0 }
    },
    {
        "id": "scl-42-warm-portrait",
        "name": { "vi": "SCL-42: Chân Dung Ấm", "en": "SCL-42: Warm Portrait" },
        "description": { "vi": "Một phiên bản khác của Portra 400 với tông màu ấm và mềm mại hơn, lý tưởng cho chân dung.", "en": "Another version of Portra 400 with warmer and softer tones, ideal for portraits." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "3600K, A7-G1",
        "settings": { "Black level": "+10", "Gamma": "Movie", "Black Gamma": "Narrow -6", "Knee": "Manual 85% +3", "Color Mode": "Still", "Saturation": "+10", "Color Phase": "-3" },
        "colorDepth": { "R": "-2", "G": "+6", "B": "-2", "C": "+1", "M": "+4", "Y": "+1" },
        "detailSettings": { "Level": "-6", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 5", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ffcc80", "coords": { "x": -4.5, "y": 4.5 }
    },
    {
        "id": "scl-43-nostalgic-dream",
        "name": { "vi": "SCL-43: Giấc Mơ Hoài Cổ", "en": "SCL-43: Nostalgic Dream" },
        "description": { "vi": "Tông màu mộng mơ, mềm mại với màu sắc dịu nhẹ, mang lại cảm giác hoài niệm.", "en": "A dreamy, soft tone with gentle colors, bringing a nostalgic feeling." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4500K, A7",
        "settings": { "Black level": "-4", "Gamma": "Cine1 or Cine4", "Black Gamma": "Middle -6", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+24", "Color Phase": "+2" },
        "colorDepth": { "R": "-1", "G": "+4", "B": "-1", "C": "+2", "M": "+2", "Y": "0" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ef9a9a", "coords": { "x": 3.0, "y": 4.0 }
    },
    {
        "id": "scl-44-crisp-daylight",
        "name": { "vi": "SCL-44: Nắng Trong", "en": "SCL-44: Crisp Daylight" },
        "description": { "vi": "Màu sắc trong trẻo, hơi ngả xanh, mô phỏng ánh sáng ban ngày trong trẻo.", "en": "Clear, slightly bluish colors, simulating crisp daylight." },
        "type": "color", "contrast": "medium", "saturation": "medium",
        "whiteBalance": "3600K, A7-M1",
        "settings": { "Black level": "-3", "Gamma": "Movie", "Black Gamma": "Middle -6", "Knee": "Manual 80% +3", "Color Mode": "Still", "Saturation": "+9", "Color Phase": "0" },
        "colorDepth": { "R": "+2", "G": "+4", "B": "-3", "C": "+1", "M": "+5", "Y": "+4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#4dd0e1", "coords": { "x": 0.5, "y": 3.5 }
    },
    {
        "id": "scl-45-subtle-warmth",
        "name": { "vi": "SCL-45: Ấm Áp Dịu Dàng", "en": "SCL-45: Subtle Warmth" },
        "description": { "vi": "Tông màu ấm, bão hòa vừa phải, phù hợp cho chụp ảnh hàng ngày và chân dung.", "en": "Warm tones with moderate saturation, suitable for everyday photography and portraits." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "4500K, A7-M0.75",
        "settings": { "Black level": "+1", "Gamma": "Movie", "Black Gamma": "Wide -6", "Knee": "Manual 75% +3", "Color Mode": "Still", "Saturation": "+7", "Color Phase": "0" },
        "colorDepth": { "R": "-3", "G": "+6", "B": "-2", "C": "-4", "M": "+4", "Y": "+3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ffab91", "coords": { "x": -2.5, "y": 1.5 }
    },
    {
        "id": "scl-46-cinematic-green",
        "name": { "vi": "SCL-46: Lục Điện Ảnh", "en": "SCL-46: Cinematic Green" },
        "description": { "vi": "Tông màu điện ảnh, độ bão hòa thấp và tương phản mềm mại với sắc xanh lá.", "en": "A cinematic tone, low saturation and soft contrast with a green hue." },
        "type": "color", "contrast": "low", "saturation": "low",
        "whiteBalance": "4000K, A7-M0.25",
        "settings": { "Black level": "+6", "Gamma": "Movie", "Black Gamma": "Wide -4", "Knee": "Manual 75% +3", "Color Mode": "Still", "Saturation": "-4", "Color Phase": "0" },
        "colorDepth": { "R": "-2", "G": "+6", "B": "-1", "C": "+5", "M": "+3", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ad494a", "coords": { "x": -6.0, "y": -4.5 }
    },
    {
        "id": "scl-47-golden-age",
        "name": { "vi": "SCL-47: Thời Hoàng Kim", "en": "SCL-47: Golden Age" },
        "description": { "vi": "Màu sắc cổ điển, ấm áp, gợi nhớ những bức ảnh từ thập niên hoàng kim của nhiếp ảnh.", "en": "Classic, warm colors, reminiscent of photos from the golden age of photography." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "4200K, A7-M0.5",
        "settings": { "Black level": "+7", "Gamma": "Still", "Black Gamma": "Middle -6", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+11", "Color Phase": "-1" },
        "colorDepth": { "R": "+1", "G": "+6", "B": "+3", "C": "+3", "M": "+4", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ffd54f", "coords": { "x": -1.5, "y": 3.0 }
    },
    {
        "id": "scl-48-aurora-blue",
        "name": { "vi": "SCL-48: Lam Rạng Đông", "en": "SCL-48: Aurora Blue" },
        "description": { "vi": "Tông màu lạnh, trong trẻo với sắc xanh nổi bật, hoàn hảo để nắm bắt khoảnh khắc tinh khôi của buổi sớm.", "en": "A crisp, cool tone with prominent blue hues, perfect for capturing the pristine moments of early morning." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "8000K, B2-M2",
        "settings": { "Black level": "-14", "Gamma": "Cine3", "Black Gamma": "Wide +6", "Knee": "Manual 85% +3", "Color Mode": "S-Gamut3.Cine", "Saturation": "+19", "Color Phase": "+6" },
        "colorDepth": { "R": "-4", "G": "0", "B": "+2", "C": "+3", "M": "+4", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#4fc3f7", "coords": { "x": 5.5, "y": 5.0 }
    },
    {
        "id": "scl-49-summer-pop",
        "name": { "vi": "SCL-49: Pop Mùa Hè", "en": "SCL-49: Summer Pop" },
        "description": { "vi": "Màu sắc rực rỡ với tông ấm, mang lại cảm giác năng động và tràn đầy sức sống của mùa hè.", "en": "Vibrant colors with warm undertones, bringing a dynamic and lively summer feeling." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4000K, A7-G1",
        "settings": { "Black level": "+1", "Gamma": "Still", "Black Gamma": "Middle +6", "Knee": "Manual 75% +4", "Color Mode": "S-Gamut3", "Saturation": "+31", "Color Phase": "+3" },
        "colorDepth": { "R": "+1", "G": "+6", "B": "+6", "C": "+6", "M": "+6", "Y": "+3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ff8a65", "coords": { "x": 1.5, "y": 7.0 }
    },
    {
        "id": "scl-50-soft-contrast-bw",
        "name": { "vi": "SCL-50: Đơn Sắc Tương Phản Mềm", "en": "SCL-50: Soft Contrast B&W" },
        "description": { "vi": "Đen trắng tương phản mềm, mang lại cảm giác cổ điển, nhẹ nhàng và sâu lắng.", "en": "Soft-contrast black and white, providing a classic, gentle, and deep feel." },
        "type": "bw", "contrast": "low", "saturation": "low",
        "whiteBalance": "AWB",
        "settings": { "Black level": "-7", "Gamma": "Cine3", "Black Gamma": "Narrow -6", "Knee": "Manual 75% +2", "Color Mode": "Black & White", "Saturation": "0", "Color Phase": "-1" },
        "colorDepth": { "R": "-3", "G": "+2", "B": "+6", "C": "0", "M": "+6", "Y": "-4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#9e9e9e", "coords": { "x": -6.0, "y": -2.0 }
    },
    {
        "id": "scl-51-rich-earth",
        "name": { "vi": "SCL-51: Đất Mẹ", "en": "SCL-51: Rich Earth" },
        "description": { "vi": "Một phiên bản Kodachrome với tương phản cao hơn và màu sắc đậm đà, ấm áp.", "en": "A version of Kodachrome with higher contrast and rich, warm colors." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "4500K, A7-M0.5",
        "settings": { "Black level": "-9", "Gamma": "Cine1", "Black Gamma": "Middle +6", "Knee": "Manual 75% +3", "Color Mode": "Still", "Saturation": "+16", "Color Phase": "0" },
        "colorDepth": { "R": "+1", "G": "+5", "B": "+1", "C": "+6", "M": "+6", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#a1887f", "coords": { "x": 5.0, "y": 6.0 }
    },
    {
        "id": "scl-52-cool-tones",
        "name": { "vi": "SCL-52: Sắc Lạnh", "en": "SCL-52: Cool Tones" },
        "description": { "vi": "Mô phỏng màu sắc đặc trưng của máy ảnh cổ điển, với tông màu lạnh và sắc nét.", "en": "Simulates the characteristic colors of vintage cameras, with cool and sharp tones." },
        "type": "color", "contrast": "medium", "saturation": "low",
        "whiteBalance": "7000K, B5-M0.25",
        "settings": { "Black level": "-8", "Gamma": "Still", "Black Gamma": "Middle +6", "Knee": "Manual 75% +3", "Color Mode": "Still", "Saturation": "+5", "Color Phase": "+1" },
        "colorDepth": { "R": "+2", "G": "+6", "B": "+2", "C": "-4", "M": "+2", "Y": "-1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#78909c", "coords": { "x": 3.0, "y": -3.0 }
    },
    {
        "id": "scl-53-warm-daylight",
        "name": { "vi": "SCL-53: Nắng Ấm", "en": "SCL-53: Warm Daylight" },
        "description": { "vi": "Phiên bản Kodachrome cân bằng, màu sắc chân thực và dễ chịu cho ánh sáng ban ngày.", "en": "A balanced Kodachrome version with pleasant, realistic colors for daylight." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "4000K, A7-M2",
        "settings": { "Black level": "+5", "Gamma": "S-Cinetone", "Black Gamma": "Narrow -6", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+13", "Color Phase": "-2" },
        "colorDepth": { "R": "0", "G": "+6", "B": "+4", "C": "-1", "M": "+2", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ffcc80", "coords": { "x": -3.5, "y": 5.5 }
    },
    {
        "id": "scl-54-deep-blue",
        "name": { "vi": "SCL-54: Xanh Thẳm", "en": "SCL-54: Deep Blue" },
        "description": { "vi": "Mô phỏng phim âm bản màu, với tông màu xanh lạnh và độ tương phản vừa phải.", "en": "Simulates color negative film, with cool blue tones and moderate contrast." },
        "type": "color", "contrast": "medium", "saturation": "medium",
        "whiteBalance": "8200K, B4.5-G1.75",
        "settings": { "Black level": "-9", "Gamma": "S-Cinetone", "Black Gamma": "Narrow -6", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+15", "Color Phase": "+1" },
        "colorDepth": { "R": "+4", "G": "+6", "B": "-5", "C": "-4", "M": "+6", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#64b5f6", "coords": { "x": 2.0, "y": 1.5 }
    },
    {
        "id": "scl-55-high-key-bw",
        "name": { "vi": "SCL-55: Đơn Sắc Sáng", "en": "SCL-55: High-Key B&W" },
        "description": { "vi": "Phiên bản Tri-X với tương phản mềm và phẳng hơn, tạo hiệu ứng high-key.", "en": "A version of Tri-X with softer, flatter contrast, creating a high-key effect." },
        "type": "bw", "contrast": "low", "saturation": "high",
        "whiteBalance": "5500K, A3-G2",
        "settings": { "Black level": "+2", "Gamma": "Cine1", "Black Gamma": "Narrow +4", "Knee": "Manual 75% +2", "Color Mode": "Black & White", "Saturation": "+23", "Color Phase": "0" },
        "colorDepth": { "R": "+2", "G": "+2", "B": "+2", "C": "+1", "M": "+2", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#eeeeee", "coords": { "x": -7.0, "y": 7.5 }
    },
    {
        "id": "scl-56-rose-tint",
        "name": { "vi": "SCL-56: Sắc Hồng", "en": "SCL-56: Rose Tint" },
        "description": { "vi": "Tông màu hồng nhẹ nhàng, lãng mạn, tạo cảm giác mơ mộng và ngọt ngào.", "en": "A gentle, romantic rose tone that creates a dreamy and sweet feeling." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4600K, A7-M0.5",
        "settings": { "Black level": "+5", "Gamma": "Still", "Black Gamma": "Wide -6", "Knee": "Manual 75% +3", "Color Mode": "Pro", "Saturation": "+24", "Color Phase": "+1" },
        "colorDepth": { "R": "0", "G": "0", "B": "0", "C": "-2", "M": "+4", "Y": "0" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#f06292", "coords": { "x": 2.0, "y": 5.0 }
    },
    {
        "id": "scl-57-teal-orange",
        "name": { "vi": "SCL-57: Xanh Cam", "en": "SCL-57: Teal & Orange" },
        "description": { "vi": "Tông màu điện ảnh hiện đại với sắc xanh ở vùng tối và cam ở vùng sáng.", "en": "A modern cinematic tone with teal in the shadows and orange in the highlights." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "4700K, A7-G0.5",
        "settings": { "Black level": "-14", "Gamma": "Cine1", "Black Gamma": "Wide -6", "Knee": "Manual 82.5% +3", "Color Mode": "S-Cinetone/Still", "Saturation": "+9", "Color Phase": "+1" },
        "colorDepth": { "R": "+1", "G": "+6", "B": "-6", "C": "-5", "M": "+2", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ff8a65", "coords": { "x": 6.5, "y": 4.0 }
    },
    {
        "id": "scl-58-wide-range-bw",
        "name": { "vi": "SCL-58: Đơn Sắc Dải Rộng", "en": "SCL-58: Wide-Range B&W" },
        "description": { "vi": "Công thức đen trắng với dải tông màu rộng và chi tiết tốt ở cả vùng sáng và tối.", "en": "A black and white recipe with a wide tonal range and good detail in both highlights and shadows." },
        "type": "bw", "contrast": "medium", "saturation": "high",
        "whiteBalance": "6000K, B2.5-M1.5",
        "settings": { "Black level": "+1", "Gamma": "Cine1-4", "Black Gamma": "Middle -6", "Knee": "Manual 75% +3", "Color Mode": "Black & White", "Saturation": "+31", "Color Phase": "0" },
        "colorDepth": { "R": "-3", "G": "+4", "B": "+3", "C": "0", "M": "-4", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#9e9e9e", "coords": { "x": 2.0, "y": 3.0 }
    },
    {
        "id": "scl-59-natural-tones",
        "name": { "vi": "SCL-59: Sắc Màu Tự Nhiên", "en": "SCL-59: Natural Tones" },
        "description": { "vi": "Tông màu chân thực, hơi ngả xanh, phù hợp cho nhiều thể loại nhiếp ảnh cần sự tinh tế.", "en": "A realistic, slightly blueish tone, suitable for many photography genres that require subtlety." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "3900K, A7-M0.75",
        "settings": { "Black level": "+3", "Gamma": "Movie", "Black Gamma": "Narrow -6", "Knee": "Manual 80% +3", "Color Mode": "Still", "Saturation": "+13", "Color Phase": "-1" },
        "colorDepth": { "R": "-2", "G": "+4", "B": "-2", "C": "-2", "M": "-4", "Y": "-1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#a1887f", "coords": { "x": -1.0, "y": 4.0 }
    },
    {
        "id": "scl-60-deep-reds",
        "name": { "vi": "SCL-60: Đỏ Thẫm", "en": "SCL-60: Deep Reds" },
        "description": { "vi": "Mô phỏng phim slide với màu sắc rực rỡ và trong trẻo, nhấn mạnh tông đỏ.", "en": "Simulates slide film with vibrant and clear colors, emphasizing red tones." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "3500K, A7-G1.5",
        "settings": { "Black level": "0", "Gamma": "Still", "Black Gamma": "Middle -6", "Knee": "Manual 75% +3", "Color Mode": "S-Gamut3.Cine", "Saturation": "+31", "Color Phase": "+1" },
        "colorDepth": { "R": "+3", "G": "0", "B": "+6", "C": "0", "M": "+6", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#e53935", "coords": { "x": 5.0, "y": 8.5 }
    },
    {
        "id": "scl-61-soft-skin",
        "name": { "vi": "SCL-61: Da Mịn", "en": "SCL-61: Soft Skin" },
        "description": { "vi": "Mô phỏng phim chân dung, lý tưởng để có được tông màu da đẹp và tự nhiên.", "en": "Simulates portrait film, ideal for achieving beautiful and natural skin tones." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "4500K, A7-M1",
        "settings": { "Black level": "-14", "Gamma": "S-Log2/S-Log3", "Black Gamma": "Middle -6", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+19", "Color Phase": "+2" },
        "colorDepth": { "R": "+2", "G": "+4", "B": "+4", "C": "+6", "M": "+6", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ffccbc", "coords": { "x": 5.0, "y": 3.0 }
    },
    {
        "id": "scl-62-vintage-green",
        "name": { "vi": "SCL-62: Lục Cổ Điển", "en": "SCL-62: Vintage Green" },
        "description": { "vi": "Tông màu vàng xanh độc đáo, tạo cảm giác cổ điển và lạ mắt, như một thước phim cũ.", "en": "A unique yellow-green tone, creating a classic and unusual feel, like an old film." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "8000K, A7-G5.5",
        "settings": { "Black level": "-11", "Gamma": "Cine4", "Black Gamma": "Middle -6", "Knee": "Manual 75% +3", "Color Mode": "S-Gamut3", "Saturation": "+31", "Color Phase": "+6" },
        "colorDepth": { "R": "+3", "G": "+4", "B": "0", "C": "0", "M": "-2", "Y": "+6" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#cddc39", "coords": { "x": 6.5, "y": 8.0 }
    },
    {
        "id": "scl-63-high-contrast-punch",
        "name": { "vi": "SCL-63: Tương Phản Mạnh", "en": "SCL-63: High-Contrast Punch" },
        "description": { "vi": "Đen trắng tương phản cao, hạt rõ, mô phỏng phim được đẩy sáng để tăng kịch tính.", "en": "High-contrast black and white with prominent grain, simulating pushed film for added drama." },
        "type": "bw", "contrast": "high", "saturation": "high",
        "whiteBalance": "5500K, A3-G2",
        "settings": { "Black level": "+4", "Gamma": "Still", "Black Gamma": "Wide -6", "Knee": "Manual 77.5% +1", "Color Mode": "Black & White", "Saturation": "+23", "Color Phase": "0" },
        "colorDepth": { "R": "-3", "G": "0", "B": "+5", "C": "+4", "M": "-2", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#616161", "coords": { "x": 7.5, "y": 5.0 }
    },
    {
        "id": "scl-64-vibrant-yellow",
        "name": { "vi": "SCL-64: Vàng Rực", "en": "SCL-64: Vibrant Yellow" },
        "description": { "vi": "Tông màu vàng chủ đạo, tạo cảm giác nắng ấm và hoài cổ, tràn đầy năng lượng.", "en": "A dominant yellow tone, creating a sunny, nostalgic, and energetic feel." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4200K, A7-G0.25",
        "settings": { "Black level": "+3", "Gamma": "Still", "Black Gamma": "Wide +6", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+19", "Color Phase": "-3" },
        "colorDepth": { "R": "0", "G": "+6", "B": "0", "C": "-2", "M": "-3", "Y": "-1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ffee58", "coords": { "x": 1.5, "y": 7.5 }
    },
    {
        "id": "scl-65-classic-look",
        "name": { "vi": "SCL-65: Vẻ Đẹp Cổ Điển", "en": "SCL-65: Classic Look" },
        "description": { "vi": "Mô phỏng phim GAF 500 với màu sắc cổ điển và tông màu độc đáo, ấm áp.", "en": "Simulates GAF 500 film with vintage colors and a unique, warm tone." },
        "type": "color", "contrast": "medium", "saturation": "medium",
        "whiteBalance": "5300K, A7-M0.75",
        "settings": { "Black level": "+2", "Gamma": "Still", "Black Gamma": "Wide +6", "Knee": "Manual 75% +3", "Color Mode": "Still", "Saturation": "+9", "Color Phase": "0" },
        "colorDepth": { "R": "+2", "G": "+4", "B": "-2", "C": "-2", "M": "-2", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#d4e157", "coords": { "x": -0.5, "y": 6.0 }
    },
    {
        "id": "scl-66-tungsten-dream",
        "name": { "vi": "SCL-66: Giấc Mơ Tungsten", "en": "SCL-66: Tungsten Dream" },
        "description": { "vi": "Mô phỏng phim cân bằng cho ánh sáng đèn Tungsten, lý tưởng cho chụp đêm.", "en": "Simulates film balanced for Tungsten light, ideal for night photography." },
        "type": "color", "contrast": "low", "saturation": "low",
        "whiteBalance": "2700K, A7-M1.25",
        "settings": { "Black level": "+2", "Gamma": "Movie", "Black Gamma": "Wide +6", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+1", "Color Phase": "+4" },
        "colorDepth": { "R": "-4", "G": "-6", "B": "-6", "C": "+2", "M": "-6", "Y": "-4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ce93d8", "coords": { "x": -7.0, "y": -6.0 }
    },
    {
        "id": "scl-67-daylight-pro",
        "name": { "vi": "SCL-67: Chuyên Nghiệp Ban Ngày", "en": "SCL-67: Daylight Pro" },
        "description": { "vi": "Mô phỏng phim điện ảnh cân bằng cho ánh sáng ban ngày, màu sắc trong và rực rỡ.", "en": "Simulates motion picture film balanced for daylight, with clear and vibrant colors." },
        "type": "color", "contrast": "low", "saturation": "high",
        "whiteBalance": "3700K, A7-G1",
        "settings": { "Black level": "+8", "Gamma": "S-Cinetone", "Black Gamma": "Narrow -6", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+31", "Color Phase": "+2" },
        "colorDepth": { "R": "0", "G": "+2", "B": "+1", "C": "+1", "M": "-2", "Y": "0" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#81d4fa", "coords": { "x": -8.0, "y": 7.0 }
    },
    {
        "id": "scl-68-red-haze",
        "name": { "vi": "SCL-68: Màn Sương Đỏ", "en": "SCL-68: Red Haze" },
        "description": { "vi": "Hiệu ứng Redscale, toàn bộ ảnh được nhuốm một màu đỏ cam ấn tượng và độc đáo.", "en": "A Redscale effect, where the entire image is cast in a dramatic and unique red-orange hue." },
        "type": "color", "contrast": "low", "saturation": "low",
        "whiteBalance": ">9900K, B3-G2",
        "settings": { "Black level": "+4", "Gamma": "Still", "Black Gamma": "Middle -6", "Knee": "Manual 75% +3", "Color Mode": "ITU709Matrix", "Saturation": "+6", "Color Phase": "0" },
        "colorDepth": { "R": "+4", "G": "+6", "B": "+4", "C": "+4", "M": "-6", "Y": "-1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#e53935", "coords": { "x": -8.0, "y": -8.0 }
    },
    {
        "id": "scl-69-graphic-bw",
        "name": { "vi": "SCL-69: Đồ Họa Đơn Sắc", "en": "SCL-69: Graphic B&W" },
        "description": { "vi": "Đen trắng tương phản cao, phù hợp cho các tác phẩm cần sự mạnh mẽ và ấn tượng.", "en": "High-contrast black and white, suitable for works that require strength and impact." },
        "type": "bw", "contrast": "high", "saturation": "high",
        "whiteBalance": "5500K",
        "settings": { "Black level": "-14", "Gamma": "S-Cinetone", "Black Gamma": "Narrow -6", "Knee": "Manual 75+1", "Color Mode": "Black&White", "Saturation": "+27", "Color Phase": "0" },
        "colorDepth": { "R": "-2", "G": "+3", "B": "+2", "C": "+2", "M": "+2", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#616161", "coords": { "x": 8.5, "y": 5.5 }
    },
    {
        "id": "scl-70-warm-tones",
        "name": { "vi": "SCL-70: Tông Màu Ấm", "en": "SCL-70: Warm Tones" },
        "description": { "vi": "Tông màu độc đáo, ấm áp, mang lại cảm giác kỳ diệu và khác biệt cho bức ảnh.", "en": "A unique, warm tone that brings a magical and distinct feeling to the photo." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "7000K, B4-M1.25",
        "settings": { "Black level": "-11", "Gamma": "Movie", "Black Gamma": "Middle -6", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+16", "Color Phase": "0" },
        "colorDepth": { "R": "-3", "G": "+6", "B": "-2", "C": "-2", "M": "-4", "Y": "+3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ffb74d", "coords": { "x": 5.5, "y": 1.0 }
    },
    {
        "id": "scl-71-blue-sky",
        "name": { "vi": "SCL-71: Trời Xanh", "en": "SCL-71: Blue Sky" },
        "description": { "vi": "Tông màu xanh dương và xanh lá cây mát mẻ, trong trẻo, lý tưởng cho phong cảnh.", "en": "Cool and clear blue and green tones, ideal for landscapes." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "AWB, B2-G2",
        "settings": { "Black level": "-4", "Gamma": "Cine4", "Black Gamma": "Wide +6", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+29", "Color Phase": "+1" },
        "colorDepth": { "R": "+1", "G": "+6", "B": "+6", "C": "-4", "M": "-2", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#29b6f6", "coords": { "x": 7.0, "y": 7.0 }
    },
    {
        "id": "scl-72-soft-mono",
        "name": { "vi": "SCL-72: Đơn Sắc Mềm", "en": "SCL-72: Soft Mono" },
        "description": { "vi": "Mô phỏng phim đen trắng cổ điển, một lựa chọn tuyệt vời cho nhiếp ảnh đường phố.", "en": "Simulates classic black and white film, a great choice for street photography." },
        "type": "bw", "contrast": "low", "saturation": "low",
        "whiteBalance": "AWB, A3",
        "settings": { "Black level": "-11", "Gamma": "Movie", "Black Gamma": "Middle -4", "Knee": "Manual 75% +3", "Color Mode": "Black & White", "Saturation": "0", "Color Phase": "0" },
        "colorDepth": { "R": "0", "G": "+2", "B": "0", "C": "+1", "M": "+2", "Y": "0" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#bdbdbd", "coords": { "x": -5.0, "y": -5.0 }
    },
    {
        "id": "scl-73-warm-vintage",
        "name": { "vi": "SCL-73: Cổ Điển Ấm", "en": "SCL-73: Warm Vintage" },
        "description": { "vi": "Phiên bản thứ hai của tông màu vàng ấm, với tông màu ấm và bão hòa hơn.", "en": "A second version of the warm golden tone, with warmer and more saturated colors." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4600K, A7-G1.25",
        "settings": { "Black level": "+1", "Gamma": "S-Cinetone", "Black Gamma": "Narrow -6", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+24", "Color Phase": "+4" },
        "colorDepth": { "R": "+2", "G": "-2", "B": "-4", "C": "-2", "M": "+2", "Y": "-1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ffb74d", "coords": { "x": 2.0, "y": 5.5 }
    },
    {
        "id": "scl-74-cinematic-vibe",
        "name": { "vi": "SCL-74: Cảm Hứng Điện Ảnh", "en": "SCL-74: Cinematic Vibe" },
        "description": { "vi": "Tông màu điện ảnh với dải nhạy sáng rộng và màu sắc đậm chất phim.", "en": "A cinematic tone with wide dynamic range and filmic colors." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "3900K, A7",
        "settings": { "Black level": "-14", "Gamma": "HLG3", "Black Gamma": "Wide 0", "Knee": "Auto", "Color Mode": "BT.2020", "Saturation": "+31", "Color Phase": "+6" },
        "colorDepth": { "R": "-3", "G": "0", "B": "+4", "C": "+3", "M": "+4", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#64b5f6", "coords": { "x": 8.5, "y": 3.0 }
    },
    {
        "id": "scl-75-warm-pro",
        "name": { "vi": "SCL-75: Chuyên Nghiệp Ấm", "en": "SCL-75: Warm Pro" },
        "description": { "vi": "Màu sắc chân thực, tông màu da đẹp, phù hợp cho chân dung chuyên nghiệp với tông ấm.", "en": "Accurate colors and beautiful skin tones, suitable for professional portraits with warm tones." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4000K, A7-G1",
        "settings": { "Black level": "+5", "Gamma": "S-Cinetone/Cine4", "Black Gamma": "Narrow -6", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+29", "Color Phase": "-1" },
        "colorDepth": { "R": "+1", "G": "+6", "B": "+2", "C": "+4", "M": "+2", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ff8a65", "coords": { "x": 3.0, "y": 8.0 }
    },
    {
        "id": "scl-76-mystic-green",
        "name": { "vi": "SCL-76: Lục Huyền Bí", "en": "SCL-76: Mystic Green" },
        "description": { "vi": "Tông màu độc đáo với sắc xanh lá và tím, tạo cảm giác kỳ ảo và bí ẩn như trong một khu vườn.", "en": "A unique tone with green and magenta hues, creating a fantastical and mysterious feel as if in a garden." },
        "type": "color", "contrast": "medium", "saturation": "medium",
        "whiteBalance": "7000K, B1-M1",
        "settings": { "Black level": "+6", "Gamma": "Still", "Black Gamma": "Middle +6", "Knee": "Manual 80% +3", "Color Mode": "S-Gamut3.Cine", "Saturation": "+9", "Color Phase": "+6" },
        "colorDepth": { "R": "0", "G": "+6", "B": "+4", "C": "+4", "M": "+4", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ba68c8", "coords": { "x": 0.0, "y": 2.5 }
    },
    {
        "id": "scl-77-night-vision",
        "name": { "vi": "SCL-77: Tầm Nhìn Đêm", "en": "SCL-77: Night Vision" },
        "description": { "vi": "Mô phỏng phim điện ảnh, với tông màu vàng ấm đặc trưng cho những cảnh quay đêm.", "en": "Simulates motion picture film, with characteristic warm yellow tones for night scenes." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "4700K, A7-G1.25",
        "settings": { "Black level": "-14", "Gamma": "S-log2 or S-log3", "Black Gamma": "Middle -6", "Knee": "Manual 75% +3", "Color Mode": "ITU709Matrix", "Saturation": "+31", "Color Phase": "+4" },
        "colorDepth": { "R": "0", "G": "+6", "B": "-6", "C": "-6", "M": "+4", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#827717", "coords": { "x": 5.5, "y": 7.5 }
    },
    {
        "id": "scl-78-vibrant-pop",
        "name": { "vi": "SCL-78: Pop Rực Rỡ", "en": "SCL-78: Vibrant Pop" },
        "description": { "vi": "Màu sắc rực rỡ, hơi ngả xanh, tạo cảm giác năng động và nổi bật như tranh Pop Art.", "en": "Vibrant, slightly bluish colors, creating a dynamic and prominent feel like Pop Art." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "3400K, A7-M1.75",
        "settings": { "Black level": "-5", "Gamma": "Still", "Black Gamma": "Wide +6", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+31", "Color Phase": "0" },
        "colorDepth": { "R": "+2", "G": "+6", "B": "+1", "C": "+6", "M": "-4", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ef5350", "coords": { "x": 6.0, "y": 8.5 }
    },
    {
        "id": "scl-79-subtle-hues",
        "name": { "vi": "SCL-79: Sắc Màu Tinh Tế", "en": "SCL-79: Subtle Hues" },
        "description": { "vi": "Tông màu chân thực, hơi ngả xanh, phù hợp cho nhiều thể loại nhiếp ảnh cần sự tinh tế.", "en": "A realistic, slightly blueish tone, suitable for many photography genres that require subtlety." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "3900K, A7-M0.75",
        "settings": { "Black level": "+3", "Gamma": "Movie", "Black Gamma": "Narrow -6", "Knee": "Manual 80% +3", "Color Mode": "Still", "Saturation": "+13", "Color Phase": "-1" },
        "colorDepth": { "R": "-2", "G": "+4", "B": "-2", "C": "-2", "M": "-4", "Y": "-1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#a1887f", "coords": { "x": -1.0, "y": 4.0 }
    },
    {
        "id": "scl-80-warm-film",
        "name": { "vi": "SCL-80: Phim Ấm", "en": "SCL-80: Warm Film" },
        "description": { "vi": "Một phiên bản khác của tông màu ấm với màu sắc dịu hơn, mang đậm chất phim điện ảnh.", "en": "Another version of the warm tone with more subdued colors, with a strong cinematic quality." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4400K, A7-G1",
        "settings": { "Black level": "0", "Gamma": "Cine1", "Black Gamma": "Middle +6", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+24", "Color Phase": "+2" },
        "colorDepth": { "R": "+2", "G": "+6", "B": "0", "C": "0", "M": "+4", "Y": "+2" },
        "detailSettings": { "Level": "-6", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 5", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ffb74d", "coords": { "x": 2.5, "y": 6.0 }
    },
    {
        "id": "scl-81-blue-mono",
        "name": { "vi": "SCL-81: Đơn Sắc Xanh", "en": "SCL-81: Blue Mono" },
        "description": { "vi": "Đen trắng mô phỏng phim Orthochromatic, nhạy với màu xanh dương và xanh lá, tạo hiệu ứng độc đáo.", "en": "Black and white simulating Orthochromatic film, sensitive to blue and green, creating a unique effect." },
        "type": "bw", "contrast": "high", "saturation": "medium",
        "whiteBalance": "AWB, A3-M2.75",
        "settings": { "Black level": "-11", "Gamma": "Movie", "Black Gamma": "Narrow -6", "Knee": "105% +4", "Color Mode": "Still", "Saturation": "+14", "Color Phase": "0" },
        "colorDepth": { "R": "+6", "G": "+6", "B": "-6", "C": "-6", "M": "+6", "Y": "+6" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#616161", "coords": { "x": 5.5, "y": 2.0 }
    },
    {
        "id": "scl-82-holiday-cheer",
        "name": { "vi": "SCL-82: Niềm Vui Lễ Hội", "en": "SCL-82: Holiday Cheer" },
        "description": { "vi": "Tông màu ấm áp, rực rỡ, mang lại không khí lễ hội và vui tươi, tràn ngập sức sống.", "en": "A warm, vibrant tone that brings a festive and joyful atmosphere, full of life." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "AWB, A5-G0.25",
        "settings": { "Black level": "-6", "Gamma": "Cine3", "Black Gamma": "Narrow -6", "Knee": "105% +4", "Color Mode": "Still", "Saturation": "+12", "Color Phase": "+3" },
        "colorDepth": { "R": "+2", "G": "+6", "B": "-3", "C": "-4", "M": "+3", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#ef5350", "coords": { "x": 6.5, "y": 0.5 }
    },
    {
        "id": "scl-83-rich-palette",
        "name": { "vi": "SCL-83: Bảng Màu Đậm", "en": "SCL-83: Rich Palette" },
        "description": { "vi": "Màu sắc rực rỡ với tông đỏ và xanh dương nổi bật, tạo cảm giác sang trọng và quý phái.", "en": "Vibrant colors with prominent red and blue tones, creating a luxurious and noble feel." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "7000K, B2-M1",
        "settings": { "Black level": "-9", "Gamma": "Movie", "Black Gamma": "Wide +6", "Knee": "Manual 75% +3", "Color Mode": "Movie", "Saturation": "+24", "Color Phase": "+1" },
        "colorDepth": { "R": "+1", "G": "+6", "B": "+6", "C": "+6", "M": "+6", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#d81b60", "coords": { "x": 8.0, "y": 4.5 }
    },
    {
        "id": "scl-84-ethereal-mono",
        "name": { "vi": "SCL-84: Đơn Sắc Thanh Khiết", "en": "SCL-84: Ethereal Mono" },
        "description": { "vi": "Một biến thể của Eterna với màu sắc đậm và bão hòa hơn, tạo hiệu ứng đen trắng ấn tượng.", "en": "A variation of Eterna with richer and more saturated colors, creating a striking black and white effect." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "4000K, A7-M1",
        "settings": { "Black level": "-4", "Gamma": "Cine4", "Black Gamma": "Wide -4", "Knee": "Manual 87.5% +2", "Color Mode": "S-Gamut3", "Saturation": "+31", "Color Phase": "+5" },
        "colorDepth": { "R": "-2", "G": "-1", "B": "+2", "C": "+6", "M": "-2", "Y": "-1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+1", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "6", "Hi-Light Detail": "3" },
        "personalityColor": "#e57373", "coords": { "x": 7.5, "y": 5.0 }
    }
];const recipesData = [
    {
        "id": "scl-01-vintage-memory",
        "name": { "vi": "SCL-01: Ký Ức Vintage", "en": "SCL-01: Vintage Memory" },
        "description": { "vi": "Tông màu phim cổ điển, độ bão hòa thấp và tương phản mềm, như một ký ức xa xăm.", "en": "A classic film tone with low saturation and soft contrast, like a distant memory." },
        "type": "color", "contrast": "low", "saturation": "low",
        "whiteBalance": "8600K, B2.5-M3",
        "settings": { "Black level": "-5", "Gamma": "Cine4", "Black Gamma": "Middle -7", "Knee": "Manual 82.5% +4", "Color Mode": "Still", "Saturation": "-8", "Color Phase": "+1" },
        "colorDepth": { "R": "-6", "G": "+7", "B": "+1", "C": "+3", "M": "+7", "Y": "+5" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#a1887f", "coords": { "x": -7.5, "y": -6.5 }
    },
    {
        "id": "scl-02-emerald-dream",
        "name": { "vi": "SCL-02: Giấc Mơ Lục Bảo", "en": "SCL-02: Emerald Dream" },
        "description": { "vi": "Tông màu cổ điển với sắc xanh lá cây đặc trưng, mang lại cảm giác trong trẻo và hoài niệm.", "en": "A classic tone with characteristic green hues, providing a clear and nostalgic feel." },
        "type": "color", "contrast": "low", "saturation": "low",
        "whiteBalance": "3700K, A7-M0.5",
        "settings": { "Black level": "0", "Gamma": "Movie", "Black Gamma": "Wide +7", "Knee": "Manual 80% +4", "Color Mode": "Still", "Saturation": "+11", "Color Phase": "-3" },
        "colorDepth": { "R": "-4", "G": "+7", "B": "-3", "C": "-3", "M": "-5", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#66bb6a", "coords": { "x": -4.0, "y": -1.5 }
    },
    {
        "id": "scl-03-neon-noir",
        "name": { "vi": "SCL-03: Đêm Màu", "en": "SCL-03: Neon Noir" },
        "description": { "vi": "Tông màu xanh lá cây đậm chất điện ảnh, lý tưởng cho những cảnh đêm huyền ảo và rực rỡ.", "en": "A cinematic green tone, ideal for magical and vibrant night scenes." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "3000K, A7-G7",
        "settings": { "Black level": "-15", "Gamma": "Still", "Black Gamma": "Wide +7", "Knee": "Manual 105% +4", "Color Mode": "S-Gamut3.Cine", "Saturation": "+32", "Color Phase": "+5" },
        "colorDepth": { "R": "+5", "G": "-1", "B": "+2", "C": "+5", "M": "+5", "Y": "+3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#880e4f", "coords": { "x": 8.5, "y": 9.0 }
    },
    {
        "id": "scl-04-urban-shadows",
        "name": { "vi": "SCL-04: Bóng Đô Thị", "en": "SCL-04: Urban Shadows" },
        "description": { "vi": "Đen trắng tương phản cao, vùng tối sâu và chi tiết, hoàn hảo cho kiến trúc và đường phố.", "en": "High-contrast black and white with deep, detailed shadows, perfect for architecture and street." },
        "type": "bw", "contrast": "high", "saturation": "low",
        "whiteBalance": "AWB",
        "settings": { "Black level": "-10", "Gamma": "Still", "Black Gamma": "Middle -3", "Knee": "Manual 85% +4", "Color Mode": "Black & White", "Saturation": "+15", "Color Phase": "0" },
        "colorDepth": { "R": "-4", "G": "+1", "B": "+3", "C": "+3", "M": "-4", "Y": "-1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#616161", "coords": { "x": 6.0, "y": -3.0 }
    },
    {
        "id": "scl-05-faded-canvas",
        "name": { "vi": "SCL-05: Vải Bạc Màu", "en": "SCL-05: Faded Canvas" },
        "description": { "vi": "Đen trắng với hiệu ứng 'faded', vùng tối được nâng lên tạo cảm giác hoài niệm, mơ màng.", "en": "Black and white with a 'faded' effect, where shadows are lifted to create a nostalgic, dreamy feel." },
        "type": "bw", "contrast": "low", "saturation": "medium",
        "whiteBalance": "AWB",
        "settings": { "Black level": "+3", "Gamma": "Still", "Black Gamma": "Middle -7", "Knee": "Manual 75% +2", "Color Mode": "Black & White", "Saturation": "0", "Color Phase": "0" },
        "colorDepth": { "R": "+5", "G": "+5", "B": "+7", "C": "+2", "M": "+7", "Y": "-4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#9e9e9e", "coords": { "x": -4.0, "y": 0.0 }
    },
    {
        "id": "scl-06-sun-drenched",
        "name": { "vi": "SCL-06: Nắng Đượm", "en": "SCL-06: Sun-drenched" },
        "description": { "vi": "Tông màu ấm áp của cồn cát dưới ánh nắng, mang đậm cảm giác hoài cổ và tự do.", "en": "The warm tones of sunlit dunes, carrying a deep sense of nostalgia and freedom." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "AWB, A2-G1.75",
        "settings": { "Black level": "+4", "Gamma": "S-Cinetone", "Black Gamma": "Middle -7", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+32", "Color Phase": "+3" },
        "colorDepth": { "R": "+3", "G": "+7", "B": "+4", "C": "-5", "M": "-3", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ffb300", "coords": { "x": 1.5, "y": 9.5 }
    },
    {
        "id": "scl-07-silver-screen",
        "name": { "vi": "SCL-07: Màn Bạc", "en": "SCL-07: Silver Screen" },
        "description": { "vi": "Đen trắng tương phản cao, mô phỏng những thước phim điện ảnh kinh điển, sắc nét.", "en": "High-contrast black and white, simulating classic, sharp motion picture film." },
        "type": "bw", "contrast": "high", "saturation": "high",
        "whiteBalance": "5500K",
        "settings": { "Black level": "-15", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 75% +4", "Color Mode": "Black & White", "Saturation": "+32", "Color Phase": "0" },
        "colorDepth": { "R": "+2", "G": "+7", "B": "+1", "C": "+2", "M": "+7", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#424242", "coords": { "x": 9.0, "y": 8.0 }
    },
    {
        "id": "scl-08-meadow-lullaby",
        "name": { "vi": "SCL-08: Ru Đồng", "en": "SCL-08: Meadow Lullaby" },
        "description": { "vi": "Tông màu ấm áp, mềm mại, gợi cảm giác của ánh nắng ban mai trên một đồng cỏ yên bình.", "en": "A warm, soft tone that evokes the feeling of morning sun on a peaceful meadow." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "4200K, A7-M2",
        "settings": { "Black level": "+5", "Gamma": "Still", "Black Gamma": "Narrow -7", "Knee": "Manual 75% +5", "Color Mode": "Still", "Saturation": "+14", "Color Phase": "-3" },
        "colorDepth": { "R": "-3", "G": "+7", "B": "-3", "C": "-7", "M": "-4", "Y": "-1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#fff176", "coords": { "x": -7.0, "y": 4.5 }
    },
    {
        "id": "scl-09-crimson-peak",
        "name": { "vi": "SCL-09: Đỉnh Thẫm", "en": "SCL-09: Crimson Peak" },
        "description": { "vi": "Màu sắc mạnh mẽ, tương phản cao, với tông đỏ và cam được nhấn mạnh, tạo nên sự kịch tính.", "en": "Strong colors with high contrast, with emphasized red and orange tones, creating a dramatic effect." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "8500K, B3.5-G1",
        "settings": { "Black level": "-15", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 105% +5", "Color Mode": "S-Cinetone", "Saturation": "+32", "Color Phase": "+1" },
        "colorDepth": { "R": "+5", "G": "+7", "B": "+2", "C": "+5", "M": "+5", "Y": "+5" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#e53935", "coords": { "x": 9.5, "y": 9.5 }
    },
    {
        "id": "scl-10-golden-ember",
        "name": { "vi": "SCL-10: Tàn Tro Vàng", "en": "SCL-10: Golden Ember" },
        "description": { "vi": "Tái tạo ánh sáng vàng óng và mềm mại của buổi hoàng hôn, mang lại cảm giác ấm áp và lãng mạn.", "en": "Recreates the golden, soft light of sunset, providing a warm and romantic feel." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "5000K, A2-M1",
        "settings": { "Black level": "+6", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 75% +4", "Color Mode": "S-Gamut3.Cine", "Saturation": "+25", "Color Phase": "+2" },
        "colorDepth": { "R": "-3", "G": "+7", "B": "+5", "C": "+5", "M": "+5", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#e57373", "coords": { "x": 4.5, "y": 6.0 }
    },
    {
        "id": "scl-11-azure-dream",
        "name": { "vi": "SCL-11: Giấc Mơ Xanh", "en": "SCL-11: Azure Dream" },
        "description": { "vi": "Tông màu xanh dương đặc trưng, gợi cảm giác của một thước phim điện ảnh quay vào ban ngày.", "en": "A characteristic blue tone, evoking the feel of a daylight-shot motion picture." },
        "type": "color", "contrast": "medium", "saturation": "medium",
        "whiteBalance": "7400K, B4-M1",
        "settings": { "Black level": "0", "Gamma": "Still", "Black Gamma": "Middle +7", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+10", "Color Phase": "-3" },
        "colorDepth": { "R": "+4", "G": "+5", "B": "-4", "C": "-4", "M": "+5", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#42a5f5", "coords": { "x": 0.0, "y": 5.5 }
    },
    {
        "id": "scl-12-vibrant-daylight",
        "name": { "vi": "SCL-12: Nắng Sống Động", "en": "SCL-12: Vibrant Daylight" },
        "description": { "vi": "Màu sắc rực rỡ, trong trẻo, mô phỏng những thước phim quay ban ngày đầy sức sống.", "en": "Vibrant, clear colors, simulating lively daylight motion picture film." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "3300K, A7-G0.75",
        "settings": { "Black level": "-10", "Gamma": "Still", "Black Gamma": "Middle -7", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+32", "Color Phase": "+2" },
        "colorDepth": { "R": "+4", "G": "+7", "B": "-6", "C": "+4", "M": "+6", "Y": "+5" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ef5350", "coords": { "x": 5.0, "y": 9.5 }
    },
    {
        "id": "scl-13-soft-focus",
        "name": { "vi": "SCL-13: Nét Mềm", "en": "SCL-13: Soft Focus" },
        "description": { "vi": "Tông màu mềm mại, độ bão hòa thấp, phù hợp cho chân dung và thời trang, tạo cảm giác nhẹ nhàng.", "en": "Soft tones with low saturation, suitable for portraits and fashion, creating a gentle feel." },
        "type": "color", "contrast": "low", "saturation": "low",
        "whiteBalance": "4100K, A7-M0.25",
        "settings": { "Black level": "-8", "Gamma": "Movie", "Black Gamma": "Middle -7", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+5", "Color Phase": "0" },
        "colorDepth": { "R": "0", "G": "+2", "B": "+3", "C": "+2", "M": "-7", "Y": "0" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#e0e0e0", "coords": { "x": -1.5, "y": -4.5 }
    },
    {
        "id": "scl-14-candlelight",
        "name": { "vi": "SCL-14: Ánh Nến", "en": "SCL-14: Candlelight" },
        "description": { "vi": "Tông màu vàng sang trọng, phù hợp cho những cảnh đêm đô thị lãng mạn, ấm cúng.", "en": "A luxurious golden tone, suitable for romantic and cozy urban nightscapes." },
        "type": "color", "contrast": "medium", "saturation": "medium",
        "whiteBalance": "5500K, A7-M0.75",
        "settings": { "Black level": "+2", "Gamma": "Still", "Black Gamma": "Narrow -7", "Knee": "Manual 75% +4", "Color Mode": "S-Gamut3.Cine", "Saturation": "+18", "Color Phase": "+7" },
        "colorDepth": { "R": "+5", "G": "-1", "B": "+2", "C": "+5", "M": "+5", "Y": "-5" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ffb74d", "coords": { "x": -2.0, "y": 6.0 }
    },
    {
        "id": "scl-15-graphic-mono",
        "name": { "vi": "SCL-15: Đơn Sắc Đồ Họa", "en": "SCL-15: Graphic Mono" },
        "description": { "vi": "Đen trắng với độ tương phản cực cao, tạo hiệu ứng đồ họa mạnh mẽ và ấn tượng.", "en": "Black and white with extremely high contrast, creating a strong and impressive graphic effect." },
        "type": "bw", "contrast": "high", "saturation": "high",
        "whiteBalance": "5500K",
        "settings": { "Black level": "-15", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 75% +5", "Color Mode": "Black&White", "Saturation": "+32", "Color Phase": "0" },
        "colorDepth": { "R": "+4", "G": "+7", "B": "+7", "C": "+7", "M": "+7", "Y": "+7" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#424242", "coords": { "x": 9.5, "y": 9.5 }
    },
    {
        "id": "scl-16-summer-film",
        "name": { "vi": "SCL-16: Phim Mùa Hè", "en": "SCL-16: Summer Film" },
        "description": { "vi": "Màu sắc cân bằng, trung thực, mô phỏng những thước phim mùa hè trong trẻo và tươi mát.", "en": "Balanced, faithful colors, simulating clear and fresh summer films." },
        "type": "color", "contrast": "low", "saturation": "low",
        "whiteBalance": "4000K, A7-M0.25",
        "settings": { "Black level": "+2", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 75 +4", "Color Mode": "Still", "Saturation": "+2", "Color Phase": "+1" },
        "colorDepth": { "R": "+1", "G": "+7", "B": "0", "C": "+3", "M": "+2", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#aed581", "coords": { "x": -3.0, "y": -2.0 }
    },
    {
        "id": "scl-17-vintage-charm",
        "name": { "vi": "SCL-17: Nét Duyên Cổ", "en": "SCL-17: Vintage Charm" },
        "description": { "vi": "Độ bão hòa thấp và tương phản mềm, lý tưởng cho những bức chân dung mang màu sắc thời gian.", "en": "Low saturation and soft contrast, ideal for portraits with a timeless quality." },
        "type": "color", "contrast": "medium", "saturation": "low",
        "whiteBalance": "4200K, A7-M1",
        "settings": { "Black level": "-10", "Gamma": "Movie", "Black Gamma": "Middle -7", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+7", "Color Phase": "+3" },
        "colorDepth": { "R": "-3", "G": "+7", "B": "-3", "C": "-3", "M": "-5", "Y": "+4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#e57373", "coords": { "x": 1.0, "y": -3.0 }
    },
    {
        "id": "scl-18-dramatic-sky",
        "name": { "vi": "SCL-18: Bầu Trời Kịch Tính", "en": "SCL-18: Dramatic Sky" },
        "description": { "vi": "Hiệu ứng hồng ngoại đen trắng, làm cho cây cối và bầu trời trở nên ấn tượng, siêu thực.", "en": "A black and white infrared effect, making foliage and skies dramatic and surreal." },
        "type": "bw", "contrast": "high", "saturation": "high",
        "whiteBalance": "AWB, A3",
        "settings": { "Black level": "-10", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 75% +4", "Color Mode": "Black & White", "Saturation": "+32", "Color Phase": "+4" },
        "colorDepth": { "R": "-7", "G": "-7", "B": "+7", "C": "+7", "M": "+7", "Y": "-5" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#616161", "coords": { "x": 7.5, "y": 7.5 }
    },
    {
        "id": "scl-19-amber-hues",
        "name": { "vi": "SCL-19: Sắc Hổ Phách", "en": "SCL-19: Amber Hues" },
        "description": { "vi": "Tông màu hổ phách ấm áp, gợi nhớ những bức ảnh in từ thập niên 70, đầy hoài niệm.", "en": "Warm amber tones, reminiscent of prints from the 70s, full of nostalgia." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "4300K, A7-M0.25",
        "settings": { "Black level": "+2", "Gamma": "Movie", "Black Gamma": "Middle +2", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+3", "Color Phase": "+1" },
        "colorDepth": { "R": "+1", "G": "+7", "B": "+2", "C": "+2", "M": "+4", "Y": "+2" },
        "detailSettings": { "Level": "-7", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "0", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ffb74d", "coords": { "x": -6.5, "y": 1.0 }
    },
    {
        "id": "scl-20-surreal-pop",
        "name": { "vi": "SCL-20: Pop Siêu Thực", "en": "SCL-20: Surreal Pop" },
        "description": { "vi": "Màu sắc cực kỳ rực rỡ và bão hòa, tạo nên một thế giới siêu thực và đầy màu sắc.", "en": "Extremely vibrant and saturated colors, creating a surreal and colorful world." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "3500K, A7-G0.25",
        "settings": { "Black level": "-2", "Gamma": "Still", "Black Gamma": "Middle -7", "Knee": "Manual 75% +5", "Color Mode": "ITU709Matrix", "Saturation": "+18", "Color Phase": "-3" },
        "colorDepth": { "R": "+2", "G": "+7", "B": "+7", "C": "+7", "M": "+7", "Y": "-4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ef5350", "coords": { "x": 4.0, "y": 9.0 }
    },
    {
        "id": "scl-21-frosty-mood",
        "name": { "vi": "SCL-21: Tâm Trạng Lạnh", "en": "SCL-21: Frosty Mood" },
        "description": { "vi": "Tông màu lạnh với sắc xanh dương và xanh lá cây, độ tương phản cao, mang lại cảm giác sắc lạnh.", "en": "A cool tone with blue and green hues and high contrast, providing a sharp, cold feel." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "4600K, A7-M1.5",
        "settings": { "Black level": "-8", "Gamma": "Cine1", "Black Gamma": "Wide +7", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+20", "Color Phase": "-4" },
        "colorDepth": { "R": "+2", "G": "+7", "B": "-5", "C": "-5", "M": "+3", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#29b6f6", "coords": { "x": 5.5, "y": 1.0 }
    },
    {
        "id": "scl-22-classic-warmth",
        "name": { "vi": "SCL-22: Cổ Điển Ấm", "en": "SCL-22: Classic Warmth" },
        "description": { "vi": "Tông màu điện ảnh cổ điển, cân bằng, với một chút ấm áp dễ chịu của nắng vàng.", "en": "A classic, balanced cinematic tone with a pleasant touch of golden warmth." },
        "type": "color", "contrast": "medium", "saturation": "medium",
        "whiteBalance": "AWB White Priority, A2-G0.25",
        "settings": { "Black level": "-2", "Gamma": "Movie", "Black Gamma": "Wide +7", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+12", "Color Phase": "-1" },
        "colorDepth": { "R": "-3", "G": "+7", "B": "-5", "C": "+5", "M": "-5", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ffca28", "coords": { "x": 1.0, "y": 2.5 }
    },
    {
        "id": "scl-23-crystal-clear",
        "name": { "vi": "SCL-23: Trong Suốt", "en": "SCL-23: Crystal Clear" },
        "description": { "vi": "Đen trắng với hạt mịn và chi tiết sắc nét, mang lại độ trong trẻo cao như pha lê.", "en": "Black and white with fine grain and sharp details, delivering crystal-high clarity." },
        "type": "bw", "contrast": "high", "saturation": "low",
        "whiteBalance": "AWB, B3-G0.25",
        "settings": { "Black level": "-12", "Gamma": "Still", "Black Gamma": "Middle -7", "Knee": "Manual 82% +5", "Color Mode": "Black & White", "Saturation": "0", "Color Phase": "0" },
        "colorDepth": { "R": "-1", "G": "-7", "B": "+7", "C": "+7", "M": "+7", "Y": "-4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#757575", "coords": { "x": 5.0, "y": -1.5 }
    },
    {
        "id": "scl-24-pro-warmth",
        "name": { "vi": "SCL-24: Chuyên Nghiệp Ấm", "en": "SCL-24: Pro Warmth" },
        "description": { "vi": "Màu sắc chân thực, tông màu da đẹp, phù hợp cho chân dung chuyên nghiệp với tông ấm.", "en": "Accurate colors and beautiful skin tones, suitable for professional portraits with warm tones." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4000K, A7-G1",
        "settings": { "Black level": "+6", "Gamma": "S-Cinetone/Cine4", "Black Gamma": "Narrow -7", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+30", "Color Phase": "-2" },
        "colorDepth": { "R": "+2", "G": "+7", "B": "+3", "C": "+5", "M": "+3", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ff8a65", "coords": { "x": 2.0, "y": 9.0 }
    },
    {
        "id": "scl-25-mystic-garden",
        "name": { "vi": "SCL-25: Vườn Huyền Bí", "en": "SCL-25: Mystic Garden" },
        "description": { "vi": "Tông màu độc đáo với sắc xanh lá và tím, tạo cảm giác kỳ ảo và bí ẩn như trong một khu vườn.", "en": "A unique tone with green and magenta hues, creating a fantastical and mysterious feel as if in a garden." },
        "type": "color", "contrast": "medium", "saturation": "medium",
        "whiteBalance": "7000K, B1-M1",
        "settings": { "Black level": "+7", "Gamma": "Still", "Black Gamma": "Middle +7", "Knee": "Manual 80% +4", "Color Mode": "S-Gamut3.Cine", "Saturation": "+10", "Color Phase": "+7" },
        "colorDepth": { "R": "0", "G": "+7", "B": "+5", "C": "+5", "M": "+5", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ba68c8", "coords": { "x": -1.0, "y": 1.5 }
    },
    {
        "id": "scl-26-night-vision",
        "name": { "vi": "SCL-26: Tầm Nhìn Đêm", "en": "SCL-26: Night Vision" },
        "description": { "vi": "Mô phỏng phim điện ảnh, với tông màu vàng ấm đặc trưng cho những cảnh quay đêm.", "en": "Simulates motion picture film, with characteristic warm yellow tones for night scenes." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "4700K, A7-G1.25",
        "settings": { "Black level": "-15", "Gamma": "S-log2 or S-log3", "Black Gamma": "Middle -7", "Knee": "Manual 75% +4", "Color Mode": "ITU709Matrix", "Saturation": "+32", "Color Phase": "+5" },
        "colorDepth": { "R": "+1", "G": "+7", "B": "-7", "C": "-7", "M": "+5", "Y": "+3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#827717", "coords": { "x": 6.5, "y": 8.5 }
    },
    {
        "id": "scl-27-vibrant-pop",
        "name": { "vi": "SCL-27: Pop Rực Rỡ", "en": "SCL-27: Vibrant Pop" },
        "description": { "vi": "Màu sắc rực rỡ, hơi ngả xanh, tạo cảm giác năng động và nổi bật như tranh Pop Art.", "en": "Vibrant, slightly bluish colors, creating a dynamic and prominent feel like Pop Art." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "3400K, A7-M1.75",
        "settings": { "Black level": "-6", "Gamma": "Still", "Black Gamma": "Wide +7", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+32", "Color Phase": "0" },
        "colorDepth": { "R": "+3", "G": "+7", "B": "+2", "C": "+7", "M": "-5", "Y": "-4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ef5350", "coords": { "x": 7.0, "y": 9.5 }
    },
    {
        "id": "scl-28-subtle-hues",
        "name": { "vi": "SCL-28: Sắc Màu Tinh Tế", "en": "SCL-28: Subtle Hues" },
        "description": { "vi": "Tông màu chân thực, hơi ngả xanh, phù hợp cho nhiều thể loại nhiếp ảnh cần sự tinh tế.", "en": "A realistic, slightly blueish tone, suitable for many photography genres that require subtlety." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "3900K, A7-M0.75",
        "settings": { "Black level": "+4", "Gamma": "Movie", "Black Gamma": "Narrow -7", "Knee": "Manual 80% +4", "Color Mode": "Still", "Saturation": "+14", "Color Phase": "-2" },
        "colorDepth": { "R": "-3", "G": "+5", "B": "-3", "C": "-3", "M": "-5", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#a1887f", "coords": { "x": -2.0, "y": 3.0 }
    },
    {
        "id": "scl-29-warm-film",
        "name": { "vi": "SCL-29: Phim Ấm", "en": "SCL-29: Warm Film" },
        "description": { "vi": "Một phiên bản khác của tông màu ấm với màu sắc dịu hơn, mang đậm chất phim điện ảnh.", "en": "Another version of the warm tone with more subdued colors, with a strong cinematic quality." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4400K, A7-G1",
        "settings": { "Black level": "0", "Gamma": "Cine1", "Black Gamma": "Middle +7", "Knee": "Manual 75% +5", "Color Mode": "Still", "Saturation": "+25", "Color Phase": "+3" },
        "colorDepth": { "R": "+3", "G": "+7", "B": "0", "C": "0", "M": "+5", "Y": "+3" },
        "detailSettings": { "Level": "-7", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 5", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ffb74d", "coords": { "x": 3.5, "y": 7.0 }
    },
    {
        "id": "scl-30-blue-mono",
        "name": { "vi": "SCL-30: Đơn Sắc Xanh", "en": "SCL-30: Blue Mono" },
        "description": { "vi": "Đen trắng mô phỏng phim Orthochromatic, nhạy với màu xanh dương và xanh lá, tạo hiệu ứng độc đáo.", "en": "Black and white simulating Orthochromatic film, sensitive to blue and green, creating a unique effect." },
        "type": "bw", "contrast": "high", "saturation": "medium",
        "whiteBalance": "AWB, A3-M2.75",
        "settings": { "Black level": "-12", "Gamma": "Movie", "Black Gamma": "Narrow -7", "Knee": "105% +5", "Color Mode": "Still", "Saturation": "+15", "Color Phase": "0" },
        "colorDepth": { "R": "+7", "G": "+7", "B": "-7", "C": "-7", "M": "+7", "Y": "+7" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#616161", "coords": { "x": 6.5, "y": 1.0 }
    },
    {
        "id": "scl-31-holiday-cheer",
        "name": { "vi": "SCL-31: Niềm Vui Lễ Hội", "en": "SCL-31: Holiday Cheer" },
        "description": { "vi": "Tông màu ấm áp, rực rỡ, mang lại không khí lễ hội và vui tươi, tràn ngập sức sống.", "en": "A warm, vibrant tone that brings a festive and joyful atmosphere, full of life." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "AWB, A5-G0.25",
        "settings": { "Black level": "-7", "Gamma": "Cine3", "Black Gamma": "Narrow -7", "Knee": "105% +5", "Color Mode": "Still", "Saturation": "+13", "Color Phase": "+4" },
        "colorDepth": { "R": "+3", "G": "+7", "B": "-4", "C": "-5", "M": "+4", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ef5350", "coords": { "x": 7.5, "y": -0.5 }
    },
    {
        "id": "scl-32-rich-palette",
        "name": { "vi": "SCL-32: Bảng Màu Đậm", "en": "SCL-32: Rich Palette" },
        "description": { "vi": "Màu sắc rực rỡ với tông đỏ và xanh dương nổi bật, tạo cảm giác sang trọng và quý phái.", "en": "Vibrant colors with prominent red and blue tones, creating a luxurious and noble feel." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "7000K, B2-M1",
        "settings": { "Black level": "-10", "Gamma": "Movie", "Black Gamma": "Wide +7", "Knee": "Manual 75% +4", "Color Mode": "Movie", "Saturation": "+25", "Color Phase": "+2" },
        "colorDepth": { "R": "+2", "G": "+7", "B": "+7", "C": "+7", "M": "+7", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#d81b60", "coords": { "x": 9.0, "y": 5.5 }
    },
    {
        "id": "scl-33-ethereal-mono",
        "name": { "vi": "SCL-33: Đơn Sắc Thanh Khiết", "en": "SCL-33: Ethereal Mono" },
        "description": { "vi": "Một biến thể của Eterna với màu sắc đậm và bão hòa hơn, tạo hiệu ứng đen trắng ấn tượng.", "en": "A variation of Eterna with richer and more saturated colors, creating a striking black and white effect." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "4000K, A7-M1",
        "settings": { "Black level": "-5", "Gamma": "Cine4", "Black Gamma": "Wide -5", "Knee": "Manual 87.5% +3", "Color Mode": "S-Gamut3", "Saturation": "+32", "Color Phase": "+6" },
        "colorDepth": { "R": "-3", "G": "-2", "B": "+3", "C": "+7", "M": "-3", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#e57373", "coords": { "x": 8.5, "y": 6.0 }
    },
    {
        "id": "scl-34-green-tint-mono",
        "name": { "vi": "SCL-34: Đơn Sắc Ám Xanh Lá", "en": "SCL-34: Green Tint Mono" },
        "description": { "vi": "Đen trắng với tông màu xanh lá cây, tạo hiệu ứng độc đáo và nghệ thuật.", "en": "Black and white with a green tint, creating a unique and artistic effect." },
        "type": "bw", "contrast": "high", "saturation": "low",
        "whiteBalance": "AWB",
        "settings": { "Black level": "-15", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 85% +5", "Color Mode": "Black & White", "Saturation": "+15", "Color Phase": "0" },
        "colorDepth": { "R": "+2", "G": "-4", "B": "-1", "C": "+2", "M": "-1", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#a5d6a7", "coords": { "x": 7.0, "y": -1.0 }
    },
    {
        "id": "scl-35-punchy-color",
        "name": { "vi": "SCL-35: Sắc Màu Tươi", "en": "SCL-35: Punchy Color" },
        "description": { "vi": "Công thức màu tương phản cao với tông màu ấm, rực rỡ và mạnh mẽ.", "en": "A high-contrast color recipe with warm, vibrant, and punchy tones." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "4000K, A5-M0.5",
        "settings": { "Black level": "-15", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 92.5% +5", "Color Mode": "S-Gamut3.Cine", "Saturation": "+27", "Color Phase": "+6" },
        "colorDepth": { "R": "+5", "G": "+7", "B": "+5", "C": "+5", "M": "+2", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#d32f2f", "coords": { "x": 7.0, "y": 8.5 }
    },
    {
        "id": "scl-36-cool-daylight",
        "name": { "vi": "SCL-36: Nắng Lạnh", "en": "SCL-36: Cool Daylight" },
        "description": { "vi": "Tông màu lạnh, siêu thực với độ bão hòa cao, phù hợp cho cảnh ban ngày.", "en": "A surreal, cool tone with high saturation, suitable for daylight scenes." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "8000K, B2-M2",
        "settings": { "Black level": "-15", "Gamma": "Cine3", "Black Gamma": "Wide +7", "Knee": "Manual 85% +4", "Color Mode": "S-Gamut3.Cine", "Saturation": "+20", "Color Phase": "+7" },
        "colorDepth": { "R": "-5", "G": "-1", "B": "+3", "C": "+4", "M": "+5", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#4fc3f7", "coords": { "x": 6.5, "y": 4.0 }
    },
    {
        "id": "scl-37-modern-look",
        "name": { "vi": "SCL-37: Vẻ Hiện Đại", "en": "SCL-37: Modern Look" },
        "description": { "vi": "Màu sắc sống động và bão hòa cao, mang lại cảm giác tươi mới và hiện đại.", "en": "Vivid and highly saturated colors, providing a fresh and modern feel." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "4300K, A3.5",
        "settings": { "Black level": "-10", "Gamma": "Cine1", "Black Gamma": "Middle +7", "Knee": "Auto", "Color Mode": "S-Gamut3.Cine", "Saturation": "+32", "Color Phase": "+5" },
        "colorDepth": { "R": "-3", "G": "+4", "B": "+3", "C": "+3", "M": "-2", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#4caf50", "coords": { "x": 5.0, "y": 7.5 }
    },
    {
        "id": "scl-38-warm-vintage",
        "name": { "vi": "SCL-38: Cổ Điển Ấm", "en": "SCL-38: Warm Vintage" },
        "description": { "vi": "Phiên bản thứ hai của tông màu vàng ấm, với tông màu ấm và bão hòa hơn.", "en": "A second version of the warm golden tone, with warmer and more saturated colors." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4600K, A7-G1.25",
        "settings": { "Black level": "+2", "Gamma": "S-Cinetone", "Black Gamma": "Narrow -7", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+25", "Color Phase": "+5" },
        "colorDepth": { "R": "+3", "G": "-3", "B": "-5", "C": "-3", "M": "+3", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ffb74d", "coords": { "x": 3.0, "y": 6.5 }
    },
    {
        "id": "scl-39-soft-portrait",
        "name": { "vi": "SCL-39: Chân Dung Mềm Mại", "en": "SCL-39: Soft Portrait" },
        "description": { "vi": "Mô phỏng phim chân dung, lý tưởng để có được tông màu da đẹp và tự nhiên.", "en": "Simulates portrait film, ideal for achieving beautiful and natural skin tones." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "4500K, A7-M1",
        "settings": { "Black level": "-15", "Gamma": "S-Log2/S-Log3", "Black Gamma": "Middle -7", "Knee": "Manual 75% +5", "Color Mode": "Still", "Saturation": "+20", "Color Phase": "+3" },
        "colorDepth": { "R": "+3", "G": "+5", "B": "+5", "C": "+7", "M": "+7", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ffccbc", "coords": { "x": 6.0, "y": 2.0 }
    },
    {
        "id": "scl-40-natural-light",
        "name": { "vi": "SCL-40: Ánh Sáng Tự Nhiên", "en": "SCL-40: Natural Light" },
        "description": { "vi": "Tông màu chân thực, hơi ngả xanh, phù hợp cho nhiều thể loại nhiếp ảnh.", "en": "A realistic, slightly blueish tone, suitable for many photography genres." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "3900K, A7-M0.75",
        "settings": { "Black level": "+4", "Gamma": "Movie", "Black Gamma": "Narrow -7", "Knee": "Manual 80% +4", "Color Mode": "Still", "Saturation": "+14", "Color Phase": "-2" },
        "colorDepth": { "R": "-3", "G": "+5", "B": "-3", "C": "-3", "M": "-5", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#81c784", "coords": { "x": -2.0, "y": 3.0 }
    },
    {
        "id": "scl-41-warm-tones",
        "name": { "vi": "SCL-41: Tông Màu Ấm", "en": "SCL-41: Warm Tones" },
        "description": { "vi": "Tông màu độc đáo, ấm áp, mang lại cảm giác kỳ diệu và khác biệt cho bức ảnh.", "en": "A unique, warm tone that brings a magical and distinct feeling to the photo." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "7000K, B4-M1.25",
        "settings": { "Black level": "-12", "Gamma": "Movie", "Black Gamma": "Middle -7", "Knee": "Manual 75% +5", "Color Mode": "Still", "Saturation": "+17", "Color Phase": "-1" },
        "colorDepth": { "R": "-4", "G": "+7", "B": "-3", "C": "-3", "M": "-5", "Y": "+4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ffb74d", "coords": { "x": 6.5, "y": 0.0 }
    },
    {
        "id": "scl-42-warm-portrait",
        "name": { "vi": "SCL-42: Chân Dung Ấm", "en": "SCL-42: Warm Portrait" },
        "description": { "vi": "Một phiên bản khác của Portra 400 với tông màu ấm và mềm mại hơn, lý tưởng cho chân dung.", "en": "Another version of Portra 400 with warmer and softer tones, ideal for portraits." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "3600K, A7-G1",
        "settings": { "Black level": "+11", "Gamma": "Movie", "Black Gamma": "Narrow -7", "Knee": "Manual 85% +4", "Color Mode": "Still", "Saturation": "+11", "Color Phase": "-4" },
        "colorDepth": { "R": "-3", "G": "+7", "B": "-3", "C": "+2", "M": "+5", "Y": "+2" },
        "detailSettings": { "Level": "-7", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 5", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ffcc80", "coords": { "x": -5.5, "y": 3.5 }
    },
    {
        "id": "scl-43-nostalgic-dream",
        "name": { "vi": "SCL-43: Giấc Mơ Hoài Cổ", "en": "SCL-43: Nostalgic Dream" },
        "description": { "vi": "Tông màu mộng mơ, mềm mại với màu sắc dịu nhẹ, mang lại cảm giác hoài niệm.", "en": "A dreamy, soft tone with gentle colors, bringing a nostalgic feeling." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4500K, A7",
        "settings": { "Black level": "-5", "Gamma": "Cine1 or Cine4", "Black Gamma": "Middle -7", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+25", "Color Phase": "+3" },
        "colorDepth": { "R": "-2", "G": "+5", "B": "-2", "C": "+3", "M": "+3", "Y": "-1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ef9a9a", "coords": { "x": 4.0, "y": 5.0 }
    },
    {
        "id": "scl-44-crisp-daylight",
        "name": { "vi": "SCL-44: Nắng Trong", "en": "SCL-44: Crisp Daylight" },
        "description": { "vi": "Màu sắc trong trẻo, hơi ngả xanh, mô phỏng ánh sáng ban ngày trong trẻo.", "en": "Clear, slightly bluish colors, simulating crisp daylight." },
        "type": "color", "contrast": "medium", "saturation": "medium",
        "whiteBalance": "3600K, A7-M1",
        "settings": { "Black level": "-4", "Gamma": "Movie", "Black Gamma": "Middle -7", "Knee": "Manual 80% +4", "Color Mode": "Still", "Saturation": "+10", "Color Phase": "-1" },
        "colorDepth": { "R": "+3", "G": "+5", "B": "-4", "C": "+2", "M": "+6", "Y": "+5" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#4dd0e1", "coords": { "x": 1.5, "y": 4.5 }
    },
    {
        "id": "scl-45-subtle-warmth",
        "name": { "vi": "SCL-45: Ấm Áp Dịu Dàng", "en": "SCL-45: Subtle Warmth" },
        "description": { "vi": "Tông màu ấm, bão hòa vừa phải, phù hợp cho chụp ảnh hàng ngày và chân dung.", "en": "Warm tones with moderate saturation, suitable for everyday photography and portraits." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "4500K, A7-M0.75",
        "settings": { "Black level": "+2", "Gamma": "Movie", "Black Gamma": "Wide -7", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+8", "Color Phase": "-1" },
        "colorDepth": { "R": "-4", "G": "+7", "B": "-3", "C": "-5", "M": "+5", "Y": "+4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ffab91", "coords": { "x": -3.5, "y": 2.5 }
    },
    {
        "id": "scl-46-cinematic-green",
        "name": { "vi": "SCL-46: Lục Điện Ảnh", "en": "SCL-46: Cinematic Green" },
        "description": { "vi": "Tông màu điện ảnh, độ bão hòa thấp và tương phản mềm mại với sắc xanh lá.", "en": "A cinematic tone, low saturation and soft contrast with a green hue." },
        "type": "color", "contrast": "low", "saturation": "low",
        "whiteBalance": "4000K, A7-M0.25",
        "settings": { "Black level": "+7", "Gamma": "Movie", "Black Gamma": "Wide -5", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "-5", "Color Phase": "+1" },
        "colorDepth": { "R": "-3", "G": "+7", "B": "-2", "C": "+6", "M": "+4", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ad494a", "coords": { "x": -7.0, "y": -5.5 }
    },
    {
        "id": "scl-47-golden-age",
        "name": { "vi": "SCL-47: Thời Hoàng Kim", "en": "SCL-47: Golden Age" },
        "description": { "vi": "Màu sắc cổ điển, ấm áp, gợi nhớ những bức ảnh từ thập niên hoàng kim của nhiếp ảnh.", "en": "Classic, warm colors, reminiscent of photos from the golden age of photography." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "4200K, A7-M0.5",
        "settings": { "Black level": "+8", "Gamma": "Still", "Black Gamma": "Middle -7", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+12", "Color Phase": "-2" },
        "colorDepth": { "R": "+2", "G": "+7", "B": "+4", "C": "+4", "M": "+5", "Y": "+3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ffd54f", "coords": { "x": -2.5, "y": 4.0 }
    },
    {
        "id": "scl-48-aurora-blue",
        "name": { "vi": "SCL-48: Lam Rạng Đông", "en": "SCL-48: Aurora Blue" },
        "description": { "vi": "Tông màu lạnh, trong trẻo với sắc xanh nổi bật, hoàn hảo để nắm bắt khoảnh khắc tinh khôi của buổi sớm.", "en": "A crisp, cool tone with prominent blue hues, perfect for capturing the pristine moments of early morning." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "8000K, B2-M2",
        "settings": { "Black level": "-15", "Gamma": "Cine3", "Black Gamma": "Wide +7", "Knee": "Manual 85% +4", "Color Mode": "S-Gamut3.Cine", "Saturation": "+20", "Color Phase": "+7" },
        "colorDepth": { "R": "-5", "G": "-1", "B": "+3", "C": "+4", "M": "+5", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#4fc3f7", "coords": { "x": 6.5, "y": 4.0 }
    },
    {
        "id": "scl-49-summer-pop",
        "name": { "vi": "SCL-49: Pop Mùa Hè", "en": "SCL-49: Summer Pop" },
        "description": { "vi": "Màu sắc rực rỡ với tông ấm, mang lại cảm giác năng động và tràn đầy sức sống của mùa hè.", "en": "Vibrant colors with warm undertones, bringing a dynamic and lively summer feeling." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4000K, A7-G1",
        "settings": { "Black level": "+2", "Gamma": "Still", "Black Gamma": "Middle +7", "Knee": "Manual 75% +5", "Color Mode": "S-Gamut3", "Saturation": "+32", "Color Phase": "+4" },
        "colorDepth": { "R": "+2", "G": "+7", "B": "+7", "C": "+7", "M": "+7", "Y": "+4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ff8a65", "coords": { "x": 2.5, "y": 8.0 }
    },
    {
        "id": "scl-50-soft-contrast-bw",
        "name": { "vi": "SCL-50: Đơn Sắc Tương Phản Mềm", "en": "SCL-50: Soft Contrast B&W" },
        "description": { "vi": "Đen trắng tương phản mềm, mang lại cảm giác cổ điển, nhẹ nhàng và sâu lắng.", "en": "Soft-contrast black and white, providing a classic, gentle, and deep feel." },
        "type": "bw", "contrast": "low", "saturation": "low",
        "whiteBalance": "AWB",
        "settings": { "Black level": "-8", "Gamma": "Cine3", "Black Gamma": "Narrow -7", "Knee": "Manual 75% +3", "Color Mode": "Black & White", "Saturation": "0", "Color Phase": "-2" },
        "colorDepth": { "R": "-4", "G": "+3", "B": "+7", "C": "0", "M": "+7", "Y": "-5" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#9e9e9e", "coords": { "x": -7.0, "y": -3.0 }
    },
    {
        "id": "scl-51-rich-earth",
        "name": { "vi": "SCL-51: Đất Mẹ", "en": "SCL-51: Rich Earth" },
        "description": { "vi": "Một phiên bản Kodachrome với tương phản cao hơn và màu sắc đậm đà, ấm áp.", "en": "A version of Kodachrome with higher contrast and rich, warm colors." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "4500K, A7-M0.5",
        "settings": { "Black level": "-10", "Gamma": "Cine1", "Black Gamma": "Middle +7", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+17", "Color Phase": "0" },
        "colorDepth": { "R": "+2", "G": "+6", "B": "+2", "C": "+7", "M": "+7", "Y": "+3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#a1887f", "coords": { "x": 6.0, "y": 5.0 }
    },
    {
        "id": "scl-52-cool-tones",
        "name": { "vi": "SCL-52: Sắc Lạnh", "en": "SCL-52: Cool Tones" },
        "description": { "vi": "Mô phỏng màu sắc đặc trưng của máy ảnh cổ điển, với tông màu lạnh và sắc nét.", "en": "Simulates the characteristic colors of vintage cameras, with cool and sharp tones." },
        "type": "color", "contrast": "medium", "saturation": "low",
        "whiteBalance": "7000K, B5-M0.25",
        "settings": { "Black level": "-9", "Gamma": "Still", "Black Gamma": "Middle +7", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+6", "Color Phase": "+2" },
        "colorDepth": { "R": "+3", "G": "+7", "B": "+3", "C": "-5", "M": "+3", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#78909c", "coords": { "x": 2.0, "y": -4.0 }
    },
    {
        "id": "scl-53-warm-daylight",
        "name": { "vi": "SCL-53: Nắng Ấm", "en": "SCL-53: Warm Daylight" },
        "description": { "vi": "Phiên bản Kodachrome cân bằng, màu sắc chân thực và dễ chịu cho ánh sáng ban ngày.", "en": "A balanced Kodachrome version with pleasant, realistic colors for daylight." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "4000K, A7-M2",
        "settings": { "Black level": "+6", "Gamma": "S-Cinetone", "Black Gamma": "Narrow -7", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+14", "Color Phase": "-3" },
        "colorDepth": { "R": "0", "G": "+7", "B": "+5", "C": "-2", "M": "+3", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ffcc80", "coords": { "x": -4.5, "y": 4.5 }
    },
    {
        "id": "scl-54-deep-blue",
        "name": { "vi": "SCL-54: Xanh Thẳm", "en": "SCL-54: Deep Blue" },
        "description": { "vi": "Mô phỏng phim âm bản màu, với tông màu xanh lạnh và độ tương phản vừa phải.", "en": "Simulates color negative film, with cool blue tones and moderate contrast." },
        "type": "color", "contrast": "medium", "saturation": "medium",
        "whiteBalance": "8200K, B4.5-G1.75",
        "settings": { "Black level": "-10", "Gamma": "S-Cinetone", "Black Gamma": "Narrow -7", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+16", "Color Phase": "+2" },
        "colorDepth": { "R": "+5", "G": "+7", "B": "-6", "C": "-5", "M": "+7", "Y": "-4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#64b5f6", "coords": { "x": 3.0, "y": 0.5 }
    },
    {
        "id": "scl-55-high-key-bw",
        "name": { "vi": "SCL-55: Đơn Sắc Sáng", "en": "SCL-55: High-Key B&W" },
        "description": { "vi": "Phiên bản Tri-X với tương phản mềm và phẳng hơn, tạo hiệu ứng high-key.", "en": "A version of Tri-X with softer, flatter contrast, creating a high-key effect." },
        "type": "bw", "contrast": "low", "saturation": "high",
        "whiteBalance": "5500K, A3-G2",
        "settings": { "Black level": "+3", "Gamma": "Cine1", "Black Gamma": "Narrow +5", "Knee": "Manual 75% +3", "Color Mode": "Black & White", "Saturation": "+24", "Color Phase": "0" },
        "colorDepth": { "R": "+3", "G": "+3", "B": "+3", "C": "+2", "M": "+3", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#eeeeee", "coords": { "x": -8.0, "y": 8.5 }
    },
    {
        "id": "scl-56-rose-tint",
        "name": { "vi": "SCL-56: Sắc Hồng", "en": "SCL-56: Rose Tint" },
        "description": { "vi": "Tông màu hồng nhẹ nhàng, lãng mạn, tạo cảm giác mơ mộng và ngọt ngào.", "en": "A gentle, romantic rose tone that creates a dreamy and sweet feeling." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4600K, A7-M0.5",
        "settings": { "Black level": "+6", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 75% +4", "Color Mode": "Pro", "Saturation": "+25", "Color Phase": "+2" },
        "colorDepth": { "R": "-1", "G": "0", "B": "0", "C": "-3", "M": "+5", "Y": "-1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#f06292", "coords": { "x": 1.0, "y": 6.0 }
    },
    {
        "id": "scl-57-teal-orange",
        "name": { "vi": "SCL-57: Xanh Cam", "en": "SCL-57: Teal & Orange" },
        "description": { "vi": "Tông màu điện ảnh hiện đại với sắc xanh ở vùng tối và cam ở vùng sáng.", "en": "A modern cinematic tone with teal in the shadows and orange in the highlights." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "4700K, A7-G0.5",
        "settings": { "Black level": "-15", "Gamma": "Cine1", "Black Gamma": "Wide -7", "Knee": "Manual 82.5% +4", "Color Mode": "S-Cinetone/Still", "Saturation": "+10", "Color Phase": "+2" },
        "colorDepth": { "R": "+2", "G": "+7", "B": "-7", "C": "-6", "M": "+3", "Y": "+3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ff8a65", "coords": { "x": 7.5, "y": 3.0 }
    },
    {
        "id": "scl-58-wide-range-bw",
        "name": { "vi": "SCL-58: Đơn Sắc Dải Rộng", "en": "SCL-58: Wide-Range B&W" },
        "description": { "vi": "Công thức đen trắng với dải tông màu rộng và chi tiết tốt ở cả vùng sáng và tối.", "en": "A black and white recipe with a wide tonal range and good detail in both highlights and shadows." },
        "type": "bw", "contrast": "medium", "saturation": "high",
        "whiteBalance": "6000K, B2.5-M1.5",
        "settings": { "Black level": "+2", "Gamma": "Cine1-4", "Black Gamma": "Middle -7", "Knee": "Manual 75% +4", "Color Mode": "Black & White", "Saturation": "+32", "Color Phase": "0" },
        "colorDepth": { "R": "-4", "G": "+5", "B": "+4", "C": "0", "M": "-5", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#9e9e9e", "coords": { "x": 3.0, "y": 2.0 }
    },
    {
        "id": "scl-59-natural-tones",
        "name": { "vi": "SCL-59: Sắc Màu Tự Nhiên", "en": "SCL-59: Natural Tones" },
        "description": { "vi": "Tông màu chân thực, hơi ngả xanh, phù hợp cho nhiều thể loại nhiếp ảnh cần sự tinh tế.", "en": "A realistic, slightly blueish tone, suitable for many photography genres that require subtlety." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "3900K, A7-M0.75",
        "settings": { "Black level": "+4", "Gamma": "Movie", "Black Gamma": "Narrow -7", "Knee": "Manual 80% +4", "Color Mode": "Still", "Saturation": "+14", "Color Phase": "-2" },
        "colorDepth": { "R": "-3", "G": "+5", "B": "-3", "C": "-3", "M": "-5", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#a1887f", "coords": { "x": -2.0, "y": 3.0 }
    },
    {
        "id": "scl-60-deep-reds",
        "name": { "vi": "SCL-60: Đỏ Thẫm", "en": "SCL-60: Deep Reds" },
        "description": { "vi": "Mô phỏng phim slide với màu sắc rực rỡ và trong trẻo, nhấn mạnh tông đỏ.", "en": "Simulates slide film with vibrant and clear colors, emphasizing red tones." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "3500K, A7-G1.5",
        "settings": { "Black level": "+1", "Gamma": "Still", "Black Gamma": "Middle -7", "Knee": "Manual 75% +4", "Color Mode": "S-Gamut3.Cine", "Saturation": "+32", "Color Phase": "+2" },
        "colorDepth": { "R": "+4", "G": "+1", "B": "+7", "C": "+1", "M": "+7", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#e53935", "coords": { "x": 6.0, "y": 9.5 }
    },
    {
        "id": "scl-61-soft-skin",
        "name": { "vi": "SCL-61: Da Mịn", "en": "SCL-61: Soft Skin" },
        "description": { "vi": "Mô phỏng phim chân dung, lý tưởng để có được tông màu da đẹp và tự nhiên.", "en": "Simulates portrait film, ideal for achieving beautiful and natural skin tones." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "4500K, A7-M1",
        "settings": { "Black level": "-15", "Gamma": "S-Log2/S-Log3", "Black Gamma": "Middle -7", "Knee": "Manual 75% +5", "Color Mode": "Still", "Saturation": "+20", "Color Phase": "+3" },
        "colorDepth": { "R": "+3", "G": "+5", "B": "+5", "C": "+7", "M": "+7", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ffccbc", "coords": { "x": 6.0, "y": 2.0 }
    },
    {
        "id": "scl-62-vintage-green",
        "name": { "vi": "SCL-62: Lục Cổ Điển", "en": "SCL-62: Vintage Green" },
        "description": { "vi": "Tông màu vàng xanh độc đáo, tạo cảm giác cổ điển và lạ mắt, như một thước phim cũ.", "en": "A unique yellow-green tone, creating a classic and unusual feel, like an old film." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "8000K, A7-G5.5",
        "settings": { "Black level": "-12", "Gamma": "Cine4", "Black Gamma": "Middle -7", "Knee": "Manual 75% +4", "Color Mode": "S-Gamut3", "Saturation": "+32", "Color Phase": "+7" },
        "colorDepth": { "R": "+4", "G": "+5", "B": "0", "C": "0", "M": "-3", "Y": "+7" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#cddc39", "coords": { "x": 7.5, "y": 9.0 }
    },
    {
        "id": "scl-63-high-contrast-punch",
        "name": { "vi": "SCL-63: Tương Phản Mạnh", "en": "SCL-63: High-Contrast Punch" },
        "description": { "vi": "Đen trắng tương phản cao, hạt rõ, mô phỏng phim được đẩy sáng để tăng kịch tính.", "en": "High-contrast black and white with prominent grain, simulating pushed film for added drama." },
        "type": "bw", "contrast": "high", "saturation": "high",
        "whiteBalance": "5500K, A3-G2",
        "settings": { "Black level": "+5", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 77.5% +2", "Color Mode": "Black & White", "Saturation": "+24", "Color Phase": "0" },
        "colorDepth": { "R": "-4", "G": "-1", "B": "+6", "C": "+5", "M": "-3", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#616161", "coords": { "x": 8.5, "y": 6.0 }
    },
    {
        "id": "scl-64-vibrant-yellow",
        "name": { "vi": "SCL-64: Vàng Rực", "en": "SCL-64: Vibrant Yellow" },
        "description": { "vi": "Tông màu vàng chủ đạo, tạo cảm giác nắng ấm và hoài cổ, tràn đầy năng lượng.", "en": "A dominant yellow tone, creating a sunny, nostalgic, and energetic feel." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4200K, A7-G0.25",
        "settings": { "Black level": "+4", "Gamma": "Still", "Black Gamma": "Wide +7", "Knee": "Manual 75% +5", "Color Mode": "Still", "Saturation": "+20", "Color Phase": "-4" },
        "colorDepth": { "R": "-1", "G": "+7", "B": "0", "C": "-3", "M": "-4", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ffee58", "coords": { "x": 0.5, "y": 8.5 }
    },
    {
        "id": "scl-65-classic-look",
        "name": { "vi": "SCL-65: Vẻ Đẹp Cổ Điển", "en": "SCL-65: Classic Look" },
        "description": { "vi": "Mô phỏng phim GAF 500 với màu sắc cổ điển và tông màu độc đáo, ấm áp.", "en": "Simulates GAF 500 film with vintage colors and a unique, warm tone." },
        "type": "color", "contrast": "medium", "saturation": "medium",
        "whiteBalance": "5300K, A7-M0.75",
        "settings": { "Black level": "+3", "Gamma": "Still", "Black Gamma": "Wide +7", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+10", "Color Phase": "0" },
        "colorDepth": { "R": "+3", "G": "+5", "B": "-3", "C": "-3", "M": "-3", "Y": "+3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#d4e157", "coords": { "x": -1.5, "y": 5.0 }
    },
    {
        "id": "scl-66-tungsten-dream",
        "name": { "vi": "SCL-66: Giấc Mơ Tungsten", "en": "SCL-66: Tungsten Dream" },
        "description": { "vi": "Mô phỏng phim cân bằng cho ánh sáng đèn Tungsten, lý tưởng cho chụp đêm.", "en": "Simulates film balanced for Tungsten light, ideal for night photography." },
        "type": "color", "contrast": "low", "saturation": "low",
        "whiteBalance": "2700K, A7-M1.25",
        "settings": { "Black level": "+3", "Gamma": "Movie", "Black Gamma": "Wide +7", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+2", "Color Phase": "+5" },
        "colorDepth": { "R": "-5", "G": "-7", "B": "-7", "C": "+3", "M": "-7", "Y": "-5" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ce93d8", "coords": { "x": -8.0, "y": -7.0 }
    },
    {
        "id": "scl-67-daylight-pro",
        "name": { "vi": "SCL-67: Chuyên Nghiệp Ban Ngày", "en": "SCL-67: Daylight Pro" },
        "description": { "vi": "Mô phỏng phim điện ảnh cân bằng cho ánh sáng ban ngày, màu sắc trong và rực rỡ.", "en": "Simulates motion picture film balanced for daylight, with clear and vibrant colors." },
        "type": "color", "contrast": "low", "saturation": "high",
        "whiteBalance": "3700K, A7-G1",
        "settings": { "Black level": "+9", "Gamma": "S-Cinetone", "Black Gamma": "Narrow -7", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+32", "Color Phase": "+3" },
        "colorDepth": { "R": "0", "G": "+3", "B": "+2", "C": "+2", "M": "-3", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#81d4fa", "coords": { "x": -9.0, "y": 8.0 }
    },
    {
        "id": "scl-68-red-haze",
        "name": { "vi": "SCL-68: Màn Sương Đỏ", "en": "SCL-68: Red Haze" },
        "description": { "vi": "Hiệu ứng Redscale, toàn bộ ảnh được nhuốm một màu đỏ cam ấn tượng và độc đáo.", "en": "A Redscale effect, where the entire image is cast in a dramatic and unique red-orange hue." },
        "type": "color", "contrast": "low", "saturation": "low",
        "whiteBalance": ">9900K, B3-G2",
        "settings": { "Black level": "+5", "Gamma": "Still", "Black Gamma": "Middle -7", "Knee": "Manual 75% +4", "Color Mode": "ITU709Matrix", "Saturation": "+7", "Color Phase": "-1" },
        "colorDepth": { "R": "+5", "G": "+7", "B": "+5", "C": "+5", "M": "-7", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#e53935", "coords": { "x": -9.0, "y": -9.0 }
    },
    {
        "id": "scl-69-graphic-bw",
        "name": { "vi": "SCL-69: Đồ Họa Đơn Sắc", "en": "SCL-69: Graphic B&W" },
        "description": { "vi": "Đen trắng tương phản cao, phù hợp cho các tác phẩm cần sự mạnh mẽ và ấn tượng.", "en": "High-contrast black and white, suitable for works that require strength and impact." },
        "type": "bw", "contrast": "high", "saturation": "high",
        "whiteBalance": "5500K",
        "settings": { "Black level": "-15", "Gamma": "S-Cinetone", "Black Gamma": "Narrow -7", "Knee": "Manual 75+2", "Color Mode": "Black&White", "Saturation": "+28", "Color Phase": "0" },
        "colorDepth": { "R": "-3", "G": "+4", "B": "+3", "C": "+3", "M": "+3", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#616161", "coords": { "x": 9.5, "y": 6.5 }
    },
    {
        "id": "scl-70-warm-tones",
        "name": { "vi": "SCL-70: Tông Màu Ấm", "en": "SCL-70: Warm Tones" },
        "description": { "vi": "Tông màu độc đáo, ấm áp, mang lại cảm giác kỳ diệu và khác biệt cho bức ảnh.", "en": "A unique, warm tone that brings a magical and distinct feeling to the photo." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "7000K, B4-M1.25",
        "settings": { "Black level": "-12", "Gamma": "Movie", "Black Gamma": "Middle -7", "Knee": "Manual 75% +5", "Color Mode": "Still", "Saturation": "+17", "Color Phase": "-1" },
        "colorDepth": { "R": "-4", "G": "+7", "B": "-3", "C": "-3", "M": "-5", "Y": "+4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ffb74d", "coords": { "x": 6.5, "y": 0.0 }
    },
    {
        "id": "scl-71-blue-sky",
        "name": { "vi": "SCL-71: Trời Xanh", "en": "SCL-71: Blue Sky" },
        "description": { "vi": "Tông màu xanh dương và xanh lá cây mát mẻ, trong trẻo, lý tưởng cho phong cảnh.", "en": "Cool and clear blue and green tones, ideal for landscapes." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "AWB, B2-G2",
        "settings": { "Black level": "-5", "Gamma": "Cine4", "Black Gamma": "Wide +7", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+30", "Color Phase": "+2" },
        "colorDepth": { "R": "+2", "G": "+7", "B": "+7", "C": "-5", "M": "-3", "Y": "-4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#29b6f6", "coords": { "x": 8.0, "y": 8.0 }
    },
    {
        "id": "scl-72-soft-mono",
        "name": { "vi": "SCL-72: Đơn Sắc Mềm", "en": "SCL-72: Soft Mono" },
        "description": { "vi": "Mô phỏng phim đen trắng cổ điển, một lựa chọn tuyệt vời cho nhiếp ảnh đường phố.", "en": "Simulates classic black and white film, a great choice for street photography." },
        "type": "bw", "contrast": "low", "saturation": "low",
        "whiteBalance": "AWB, A3",
        "settings": { "Black level": "-12", "Gamma": "Movie", "Black Gamma": "Middle -5", "Knee": "Manual 75% +4", "Color Mode": "Black & White", "Saturation": "0", "Color Phase": "0" },
        "colorDepth": { "R": "0", "G": "+3", "B": "0", "C": "+2", "M": "+3", "Y": "0" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#bdbdbd", "coords": { "x": -6.0, "y": -6.0 }
    },
    {
        "id": "scl-73-warm-vintage",
        "name": { "vi": "SCL-73: Cổ Điển Ấm", "en": "SCL-73: Warm Vintage" },
        "description": { "vi": "Phiên bản thứ hai của tông màu vàng ấm, với tông màu ấm và bão hòa hơn.", "en": "A second version of the warm golden tone, with warmer and more saturated colors." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4600K, A7-G1.25",
        "settings": { "Black level": "+2", "Gamma": "S-Cinetone", "Black Gamma": "Narrow -7", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+25", "Color Phase": "+5" },
        "colorDepth": { "R": "+3", "G": "-3", "B": "-5", "C": "-3", "M": "+3", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ffb74d", "coords": { "x": 3.0, "y": 6.5 }
    },
    {
        "id": "scl-74-cinematic-vibe",
        "name": { "vi": "SCL-74: Cảm Hứng Điện Ảnh", "en": "SCL-74: Cinematic Vibe" },
        "description": { "vi": "Tông màu điện ảnh với dải nhạy sáng rộng và màu sắc đậm chất phim.", "en": "A cinematic tone with wide dynamic range and filmic colors." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "3900K, A7",
        "settings": { "Black level": "-15", "Gamma": "HLG3", "Black Gamma": "Wide 0", "Knee": "Auto", "Color Mode": "BT.2020", "Saturation": "+32", "Color Phase": "+7" },
        "colorDepth": { "R": "-4", "G": "-1", "B": "+5", "C": "+4", "M": "+5", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#64b5f6", "coords": { "x": 9.5, "y": 4.0 }
    },
    {
        "id": "scl-75-warm-pro",
        "name": { "vi": "SCL-75: Chuyên Nghiệp Ấm", "en": "SCL-75: Warm Pro" },
        "description": { "vi": "Màu sắc chân thực, tông màu da đẹp, phù hợp cho chân dung chuyên nghiệp với tông ấm.", "en": "Accurate colors and beautiful skin tones, suitable for professional portraits with warm tones." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4000K, A7-G1",
        "settings": { "Black level": "+6", "Gamma": "S-Cinetone/Cine4", "Black Gamma": "Narrow -7", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+30", "Color Phase": "-2" },
        "colorDepth": { "R": "+2", "G": "+7", "B": "+3", "C": "+5", "M": "+3", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ff8a65", "coords": { "x": 2.0, "y": 9.0 }
    },
    {
        "id": "scl-76-mystic-green",
        "name": { "vi": "SCL-76: Lục Huyền Bí", "en": "SCL-76: Mystic Green" },
        "description": { "vi": "Tông màu độc đáo với sắc xanh lá và tím, tạo cảm giác kỳ ảo và bí ẩn như trong một khu vườn.", "en": "A unique tone with green and magenta hues, creating a fantastical and mysterious feel as if in a garden." },
        "type": "color", "contrast": "medium", "saturation": "medium",
        "whiteBalance": "7000K, B1-M1",
        "settings": { "Black level": "+7", "Gamma": "Still", "Black Gamma": "Middle +7", "Knee": "Manual 80% +4", "Color Mode": "S-Gamut3.Cine", "Saturation": "+10", "Color Phase": "+7" },
        "colorDepth": { "R": "0", "G": "+7", "B": "+5", "C": "+5", "M": "+5", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ba68c8", "coords": { "x": -1.0, "y": 1.5 }
    },
    {
        "id": "scl-77-night-vision",
        "name": { "vi": "SCL-77: Tầm Nhìn Đêm", "en": "SCL-77: Night Vision" },
        "description": { "vi": "Mô phỏng phim điện ảnh, với tông màu vàng ấm đặc trưng cho những cảnh quay đêm.", "en": "Simulates motion picture film, with characteristic warm yellow tones for night scenes." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "4700K, A7-G1.25",
        "settings": { "Black level": "-15", "Gamma": "S-log2 or S-log3", "Black Gamma": "Middle -7", "Knee": "Manual 75% +4", "Color Mode": "ITU709Matrix", "Saturation": "+32", "Color Phase": "+5" },
        "colorDepth": { "R": "+1", "G": "+7", "B": "-7", "C": "-7", "M": "+5", "Y": "+3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#827717", "coords": { "x": 6.5, "y": 8.5 }
    },
    {
        "id": "scl-78-vibrant-pop",
        "name": { "vi": "SCL-78: Pop Rực Rỡ", "en": "SCL-78: Vibrant Pop" },
        "description": { "vi": "Màu sắc rực rỡ, hơi ngả xanh, tạo cảm giác năng động và nổi bật như tranh Pop Art.", "en": "Vibrant, slightly bluish colors, creating a dynamic and prominent feel like Pop Art." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "3400K, A7-M1.75",
        "settings": { "Black level": "-6", "Gamma": "Still", "Black Gamma": "Wide +7", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+32", "Color Phase": "0" },
        "colorDepth": { "R": "+3", "G": "+7", "B": "+2", "C": "+7", "M": "-5", "Y": "-4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ef5350", "coords": { "x": 7.0, "y": 9.5 }
    },
    {
        "id": "scl-79-subtle-hues",
        "name": { "vi": "SCL-79: Sắc Màu Tinh Tế", "en": "SCL-79: Subtle Hues" },
        "description": { "vi": "Tông màu chân thực, hơi ngả xanh, phù hợp cho nhiều thể loại nhiếp ảnh cần sự tinh tế.", "en": "A realistic, slightly blueish tone, suitable for many photography genres that require subtlety." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "3900K, A7-M0.75",
        "settings": { "Black level": "+4", "Gamma": "Movie", "Black Gamma": "Narrow -7", "Knee": "Manual 80% +4", "Color Mode": "Still", "Saturation": "+14", "Color Phase": "-2" },
        "colorDepth": { "R": "-3", "G": "+5", "B": "-3", "C": "-3", "M": "-5", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#a1887f", "coords": { "x": -2.0, "y": 3.0 }
    },
    {
        "id": "scl-80-warm-film",
        "name": { "vi": "SCL-80: Phim Ấm", "en": "SCL-80: Warm Film" },
        "description": { "vi": "Một phiên bản khác của tông màu ấm với màu sắc dịu hơn, mang đậm chất phim điện ảnh.", "en": "Another version of the warm tone with more subdued colors, with a strong cinematic quality." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "4400K, A7-G1",
        "settings": { "Black level": "0", "Gamma": "Cine1", "Black Gamma": "Middle +7", "Knee": "Manual 75% +5", "Color Mode": "Still", "Saturation": "+25", "Color Phase": "+3" },
        "colorDepth": { "R": "+3", "G": "+7", "B": "0", "C": "0", "M": "+5", "Y": "+3" },
        "detailSettings": { "Level": "-7", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 5", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ffb74d", "coords": { "x": 3.5, "y": 7.0 }
    },
    {
        "id": "scl-81-blue-mono",
        "name": { "vi": "SCL-81: Đơn Sắc Xanh", "en": "SCL-81: Blue Mono" },
        "description": { "vi": "Đen trắng mô phỏng phim Orthochromatic, nhạy với màu xanh dương và xanh lá, tạo hiệu ứng độc đáo.", "en": "Black and white simulating Orthochromatic film, sensitive to blue and green, creating a unique effect." },
        "type": "bw", "contrast": "high", "saturation": "medium",
        "whiteBalance": "AWB, A3-M2.75",
        "settings": { "Black level": "-12", "Gamma": "Movie", "Black Gamma": "Narrow -7", "Knee": "105% +5", "Color Mode": "Still", "Saturation": "+15", "Color Phase": "0" },
        "colorDepth": { "R": "+7", "G": "+7", "B": "-7", "C": "-7", "M": "+7", "Y": "+7" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#616161", "coords": { "x": 6.5, "y": 1.0 }
    },
    {
        "id": "scl-82-holiday-cheer",
        "name": { "vi": "SCL-82: Niềm Vui Lễ Hội", "en": "SCL-82: Holiday Cheer" },
        "description": { "vi": "Tông màu ấm áp, rực rỡ, mang lại không khí lễ hội và vui tươi, tràn ngập sức sống.", "en": "A warm, vibrant tone that brings a festive and joyful atmosphere, full of life." },
        "type": "color", "contrast": "high", "saturation": "medium",
        "whiteBalance": "AWB, A5-G0.25",
        "settings": { "Black level": "-7", "Gamma": "Cine3", "Black Gamma": "Narrow -7", "Knee": "105% +5", "Color Mode": "Still", "Saturation": "+13", "Color Phase": "+4" },
        "colorDepth": { "R": "+3", "G": "+7", "B": "-4", "C": "-5", "M": "+4", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ef5350", "coords": { "x": 7.5, "y": -0.5 }
    },
    {
        "id": "scl-83-rich-palette",
        "name": { "vi": "SCL-83: Bảng Màu Đậm", "en": "SCL-83: Rich Palette" },
        "description": { "vi": "Màu sắc rực rỡ với tông đỏ và xanh dương nổi bật, tạo cảm giác sang trọng và quý phái.", "en": "Vibrant colors with prominent red and blue tones, creating a luxurious and noble feel." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "7000K, B2-M1",
        "settings": { "Black level": "-10", "Gamma": "Movie", "Black Gamma": "Wide +7", "Knee": "Manual 75% +4", "Color Mode": "Movie", "Saturation": "+25", "Color Phase": "+2" },
        "colorDepth": { "R": "+2", "G": "+7", "B": "+7", "C": "+7", "M": "+7", "Y": "+2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#d81b60", "coords": { "x": 9.0, "y": 5.5 }
    },
    {
        "id": "scl-84-ethereal-mono",
        "name": { "vi": "SCL-84: Đơn Sắc Thanh Khiết", "en": "SCL-84: Ethereal Mono" },
        "description": { "vi": "Một biến thể của Eterna với màu sắc đậm và bão hòa hơn, tạo hiệu ứng đen trắng ấn tượng.", "en": "A variation of Eterna with richer and more saturated colors, creating a striking black and white effect." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "4000K, A7-M1",
        "settings": { "Black level": "-5", "Gamma": "Cine4", "Black Gamma": "Wide -5", "Knee": "Manual 87.5% +3", "Color Mode": "S-Gamut3", "Saturation": "+32", "Color Phase": "+6" },
        "colorDepth": { "R": "-3", "G": "-2", "B": "+3", "C": "+7", "M": "-3", "Y": "-2" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#e57373", "coords": { "x": 8.5, "y": 6.0 }
    }
];
