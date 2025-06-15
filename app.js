import { translations, quizQuestions } from './translations.js';
import { recipesData } from './data.js';

// --- STATE & CONFIGURATION ---
const state = {
    currentLang: 'vi',
    currentView: 'home',
    selectedRecipeId: null,
    comparisonList: [], // Restored for comparison
    lastGeneratedAiRecipe: null,
    isAILoading: false,
    quizStep: 0,
    quizAnswers: {},
    activeFilters: { type: 'all', contrast: 'all', saturation: 'all' }
};

const mainContentEl = document.getElementById('mainContent');

// --- API CALLS (MOCKS) ---
async function callAIApi(prompt, delay = 1000) {
    if (state.isAILoading) return;
    state.isAILoading = true;
    try {
        await new Promise(resolve => setTimeout(resolve, delay));
        if (prompt.includes("Recommend TWO recipes")) {
            const idx1 = Math.floor(Math.random() * recipesData.length);
            let idx2;
            do { idx2 = Math.floor(Math.random() * recipesData.length); } while (idx1 === idx2);
            return [{ recipeId: recipesData[idx1].id }, { recipeId: recipesData[idx2].id }];
        }
        if (prompt.includes("Compare the following two recipes")) {
             const names = prompt.match(/\*(.*?)\* and \*(.*?)\*/);
             return `### Cảm Giác & Phong Cách\n* **${names[1]}:** Mang lại cảm giác ấm áp, hoài cổ.\n* **${names[2]}:** Tạo ra cái nhìn lạnh hơn, hiện đại.\n\n### So Sánh Thông Số Chính\n| Thông số | ${names[1]} | ${names[2]} | Phân Tích |\n|---|---|---|---|\n| **White Balance** | Ấm (4000K) | Lạnh (8000K) | Đây là sự khác biệt chính. |\n| **Black Level** | -15 | -10 | Cả hai đều tăng tương phản, nhưng công thức 1 có vùng tối sâu hơn. |\n\n### Trường Hợp Sử Dụng\n* **Dùng ${names[1]} khi:** Chụp chân dung, hoàng hôn.\n* **Dùng ${names[2]} khi:** Chụp phong cảnh, kiến trúc.`;
        }
        if (prompt.includes("Original Recipe")) {
            const originalId = prompt.match(/ID: (.*?)\)/)[1];
            const originalRecipe = recipesData.find(r => r.id === originalId);
            let adjustedRecipe = JSON.parse(JSON.stringify(originalRecipe));
            adjustedRecipe.name = {vi: `${originalRecipe.name.vi} (AI Tinh chỉnh)`, en: `${originalRecipe.name.en} (AI Adjusted)`};
            return { recipe: adjustedRecipe };
        }
        if (prompt.includes("Create a new recipe based on prompt:")) {
            return {
                id: `ai-${Date.now()}`, name: { vi: "Sáng tạo của AI", en: "AI Creation" },
                description: { vi: "Một công thức độc đáo được tạo ra từ prompt của bạn.", en: "A unique recipe generated from your prompt." },
                type: "color", contrast: ["high", "medium", "low"][Math.floor(Math.random()*3)], saturation: ["high", "medium", "low"][Math.floor(Math.random()*3)],
                whiteBalance: `${Math.floor(Math.random() * 60 + 30) * 100}K, A${Math.floor(Math.random()*8)}-M${Math.random().toFixed(1)}`,
                settings: { "Black level": `${Math.floor(Math.random() * 31 - 15)}`, "Gamma": "Cine1", "Black Gamma": "Wide +0", "Knee": "Auto", "Color Mode": "Still", "Saturation": `+${Math.floor(Math.random() * 33)}`, "Color Phase": `+${Math.floor(Math.random() * 8)}`},
                colorDepth: { R: `+${Math.floor(Math.random() * 8 - 4)}`, G: `+${Math.floor(Math.random() * 8 - 4)}`, B: `+${Math.floor(Math.random() * 8 - 4)}`, C: `+${Math.floor(Math.random() * 8 - 4)}`, M: `+${Math.floor(Math.random() * 8 - 4)}`, Y: `+${Math.floor(Math.random() * 8 - 4)}`},
            };
        }
    } catch (error) {
        console.error("AI API call failed:", error);
        return null;
    } finally {
        state.isAILoading = false;
        updateUIAfterAILoading();
    }
}

function t(key) {
     const keys = key.split('.');
     let result = translations;
     for (const k of keys) {
         result = result[k];
         if (result === undefined) return key;
     }
     return result[state.currentLang] || result['en'] || key;
}

function applyTranslations() {
    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.dataset.translateKey;
        if(el.dataset.translateType === 'html') {
            el.innerHTML = t(key);
        } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = t(key);
        } else {
            el.textContent = t(key);
        }
    });
}

function createSettingsGrid(settings) {
    if (!settings) return '';
    return Object.entries(settings).map(([key, value]) => `<div class="flex flex-col"><span class="text-xs text-neutral-500">${key}</span><span class="font-semibold">${value}</span></div>`).join('');
};

function createFullRecipeHTML(recipe, isMainView = false) {
    const titleClass = isMainView ? 'text-xl font-bold' : 'text-lg font-bold';
    return `<div class="space-y-6 mt-4">
        <div><h4 class="${titleClass} mb-2" data-translate-key="whiteBalanceTitle"></h4><div class="p-4 bg-gray-500/10 rounded-lg"><p class="font-semibold">${recipe.whiteBalance || ''}</p></div></div>
        <div><h4 class="${titleClass} mb-2" data-translate-key="recipeSettingsTitle"></h4><div class="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 p-4 bg-gray-500/10 rounded-lg">${createSettingsGrid(recipe.settings)}</div></div>
        ${recipe.colorDepth ? `<div><h4 class="${titleClass} mb-2" data-translate-key="colorDepthTitle"></h4><div class="grid grid-cols-3 md:grid-cols-6 gap-x-6 gap-y-4 p-4 bg-gray-500/10 rounded-lg">${createSettingsGrid(recipe.colorDepth)}</div></div>` : ''}
        ${recipe.detailSettings ? `<div><h4 class="${titleClass} mb-2" data-translate-key="detailTitle"></h4><div class="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 p-4 bg-gray-500/10 rounded-lg">${createSettingsGrid(recipe.detailSettings)}</div></div>` : ''}
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
    home: () => `<div id="homeView" class="w-full h-full flex flex-col items-center justify-center text-center absolute inset-0 view-transition">
        <h1 data-translate-key="landingTitle" class="landing-title"></h1>
        <p data-translate-key="landingSubtitle" class="landing-subtitle mt-4"></p>
        <button id="startQuizBtn" class="btn btn-primary mt-8 py-4 px-8 text-lg" data-translate-key="startQuizBtn"></button>
    </div>`,
    
    quiz: () => {
        if (state.quizStep >= quizQuestions.length) return '';
        const q = quizQuestions[state.quizStep];
        const optionsHTML = q.options.map((optKey, index) => `<div class="quiz-option" data-value="${q.values[index]}"><span data-translate-key="${optKey}"></span></div>`).join('');
        let gridCols = 'md:grid-cols-2';
        if (q.options.length === 3) gridCols = 'md:grid-cols-3';
        else if (q.options.length <= 1) gridCols = '';
        return `<div id="quizView" class="w-full h-full flex flex-col items-center justify-center absolute inset-0 view-transition"><div class="w-full max-w-4xl text-center" data-quiz-group="${q.id}"><h2 class="quiz-question-title" data-translate-key="${q.title}"></h2><div class="grid grid-cols-1 ${gridCols} gap-4 mt-12">${optionsHTML}</div></div></div>`;
    },
    
    library: () => `
        <div id="libraryView" class="w-full h-full flex flex-col md:flex-row gap-6 absolute inset-0 view-transition">
             <aside class="md:w-1/3 lg:w-1/4 glass-panel p-5 flex flex-col rounded-3xl">
                <h2 class="text-2xl font-bold" data-translate-key="sidebarTitle"></h2>
                <input type="search" id="searchInput" class="w-full p-3 my-4 rounded-xl bg-gray-200/50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all" data-translate-key="searchInputPlaceholder">
                <div id="filtersContainer" class="space-y-4">
                     <div><h4 class="font-semibold mb-2" data-translate-key="filterType"></h4><div class="flex gap-2" data-filter-group="type"><button class="filter-btn flex-1 py-2 px-4 rounded-full active" data-filter-value="all">All</button><button class="filter-btn flex-1 py-2 px-4 rounded-full" data-translate-key="filterTypeColor" data-filter-value="color"></button><button class="filter-btn flex-1 py-2 px-4 rounded-full" data-translate-key="filterTypeBW" data-filter-value="bw"></button></div></div>
                     <div><h4 class="font-semibold mb-2" data-translate-key="filterContrast"></h4><div class="flex gap-2" data-filter-group="contrast"><button class="filter-btn flex-1 py-2 px-4 rounded-full active" data-filter-value="all">All</button><button class="filter-btn flex-1 py-2 px-4 rounded-full" data-translate-key="filterHigh" data-filter-value="high"></button><button class="filter-btn flex-1 py-2 px-4 rounded-full" data-translate-key="filterMedium" data-filter-value="medium"></button><button class="filter-btn flex-1 py-2 px-4 rounded-full" data-translate-key="filterLow" data-filter-value="low"></button></div></div>
                     <div><h4 class="font-semibold mb-2" data-translate-key="filterSaturation"></h4><div class="flex gap-2" data-filter-group="saturation"><button class="filter-btn flex-1 py-2 px-4 rounded-full active" data-filter-value="all">All</button><button class="filter-btn flex-1 py-2 px-4 rounded-full" data-translate-key="filterHigh" data-filter-value="high"></button><button class="filter-btn flex-1 py-2 px-4 rounded-full" data-translate-key="filterMedium" data-filter-value="medium"></button><button class="filter-btn flex-1 py-2 px-4 rounded-full" data-translate-key="filterLow" data-filter-value="low"></button></div></div>
                </div>
                <div id="recipeListContainer" class="space-y-1 pt-4 mt-4 border-t flex-grow overflow-y-auto pr-2"></div>
                <div id="compareBtnContainer" class="pt-2 flex-shrink-0"></div>
             </aside>
             <main class="md:w-2/3 lg:w-3/4 flex flex-col min-h-0"><div class="glass-panel flex-grow overflow-y-auto p-8 rounded-3xl">
                <div id="recipeDetailWelcome" class="text-center flex flex-col items-center justify-center h-full text-neutral-400">
                   <svg class="mx-auto mb-4 w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v11.494m-5.747-8.662l11.494 5.747m-11.494 0l11.494-5.747M4.75 12A7.25 7.25 0 0112 4.75v0A7.25 7.25 0 0119.25 12v0a7.25 7.25 0 01-7.25 7.25v0A7.25 7.25 0 014.75 12v0z"></path></svg>
                   <h2 class="text-3xl font-bold mt-4 text-gray-600" data-translate-key="recipeDetailWelcomeTitle"></h2><p class="text-neutral-500 mt-2 max-w-sm" data-translate-key="recipeDetailWelcomeText"></p>
                </div>
                <div id="recipeContent" class="hidden"></div>
             </div></main>
        </div>`,
    
    aiStudio: () => `<div id="aiStudioView" class="w-full h-full absolute inset-0 overflow-y-auto view-transition">
        <div class="glass-panel p-8 md:p-12 rounded-3xl max-w-4xl mx-auto my-8">
            <h2 data-translate-key="aiStudioTitle" class="text-4xl md:text-5xl font-extrabold text-center tracking-tight"></h2>
            <p data-translate-key="aiStudioSubtitle" class="mt-4 text-lg text-neutral-600 text-center max-w-2xl mx-auto"></p>

            <div class="mt-10 max-w-2xl mx-auto">
                <label for="aiStudioPrompt" class="block text-lg font-semibold mb-3 text-center" data-translate-key="aiStudioPromptTitle"></label>
                <textarea id="aiStudioPrompt" class="w-full p-4 rounded-xl border-2 bg-white/50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm" rows="4" data-translate-key="aiStudioPromptPlaceholder"></textarea>
                <div class="mt-6 flex justify-center">
                    <button id="aiStudioGenerateBtn" class="btn btn-primary w-full md:w-auto md:px-12 py-4 text-lg" data-translate-key="aiStudioGenerateBtn"></button>
                </div>
                <div id="aiStudioResultContainer" class="mt-10"></div>
            </div>
        </div>
    </div>`
};

function renderView(viewName) {
    state.currentView = viewName;
    return new Promise(resolve => {
        const currentContent = mainContentEl.children[0];
        if (currentContent) {
            currentContent.classList.add('view-transition-out');
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
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    const group = btn.closest('[data-filter-group]').dataset.filterGroup;
    const value = btn.dataset.filterValue;
    state.activeFilters[group] = value;
    document.querySelectorAll(`[data-filter-group="${group}"] .filter-btn`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderLibraryList();
}

function handleRecipeSelection(id, type) {
    if (type === 'checkbox') {
        const index = state.comparisonList.indexOf(id);
        if (index > -1) {
            state.comparisonList.splice(index, 1);
        } else if (state.comparisonList.length < 2) {
            state.comparisonList.push(id);
        }
        
        if (state.comparisonList.length !== 2) {
            state.selectedRecipeId = null;
            document.getElementById('recipeContent').classList.add('hidden');
            document.getElementById('recipeDetailWelcome').classList.remove('hidden');
        }
    } else { 
        state.selectedRecipeId = id;
        state.comparisonList = []; // Clear comparison when viewing details
        renderLibraryDetails();
    }
    renderLibraryList();
}

async function handleAiComparison() {
    if (state.comparisonList.length !== 2) return;
    const [id1, id2] = state.comparisonList;
    const modal = document.getElementById('comparisonModal');
    const titleEl = document.getElementById('comparisonModalTitle');
    const contentEl = document.getElementById('comparisonModalContent');
    
    modal.classList.remove('hidden');
    titleEl.textContent = t('comparisonModalTitle');
    contentEl.innerHTML = `<div class="flex items-center justify-center p-8"><div class="spinner !w-12 !h-12 !border-4"></div><p class="ml-4 text-lg font-semibold" data-translate-key="comparisonLoading"></p></div>`;
    applyTranslations();

    const recipe1 = recipesData.find(r => r.id === id1);
    const recipe2 = recipesData.find(r => r.id === id2);

    const prompt = `Compare the following two recipes: *${recipe1.name[state.currentLang]}* and *${recipe2.name[state.currentLang]}*. Analyze their overall feel, key parameter differences (like White Balance and Black Level), and suggest ideal use cases for each. Present the result in Markdown.`;
    const comparisonText = await callAIApi(prompt, 1200);
    
    contentEl.innerHTML = marked.parse(comparisonText || "Error loading comparison.");
}


async function handleAiAdjustment(button) {
    const recipeId = button.dataset.recipeId;
    const textarea = document.getElementById('aiTuningTextarea');
    const resultContainer = document.getElementById('aiResultContainer');
    if (!textarea.value || !resultContainer || state.isAILoading) return;
    
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = `<div class="spinner"></div> ${t('aiTuningBtn')}`;

    const originalRecipe = recipesData.find(r => r.id === recipeId);
    const prompt = `Original Recipe (ID: ${recipeId}): ${JSON.stringify(originalRecipe.settings)}. User request: "${textarea.value}". Please provide a new JSON object with adjusted settings.`;
    const aiResponse = await callAIApi(prompt);

    if (aiResponse && aiResponse.recipe) {
        state.lastGeneratedAiRecipe = aiResponse.recipe;
        resultContainer.innerHTML = `<div class="mt-4 border-t border-gray-200/50 pt-4">
                <h4 class="font-bold text-lg mb-2">${state.lastGeneratedAiRecipe.name[state.currentLang]}</h4>
                <div class="p-4 rounded-xl bg-blue-50">${createFullRecipeHTML(state.lastGeneratedAiRecipe, false)}</div>
            </div>`;
    } else {
         resultContainer.innerHTML = `<p class="text-red-500">Failed to generate adjustment.</p>`;
    }
    button.disabled = false;
    button.innerHTML = button.dataset.originalText;
    applyTranslations();
}

async function handleQuizSubmit() {
    await renderView('home');
    const homeView = document.getElementById('homeView');
    homeView.innerHTML = `<div class="flex flex-col items-center justify-center h-full"><div class="spinner !w-16 !h-16 !border-4"></div><h2 class="landing-title mt-8" data-translate-key="loadingAnalyze"></h2></div>`;
    applyTranslations();
    
    const prompt = `Based on user preferences: ${JSON.stringify(state.quizAnswers)}. Recommend TWO recipes from the available list. Respond with JSON array: [{"recipeId"}, ...].`;
    const aiResponse = await callAIApi(prompt);

    if (aiResponse && aiResponse.length >= 2) {
         const r1 = recipesData.find(r => r.id === aiResponse[0].recipeId);
         const r2 = recipesData.find(r => r.id === aiResponse[1].recipeId);
         if (r1 && r2) {
            homeView.innerHTML = `<div class="w-full h-full flex items-center justify-center absolute inset-0 view-transition">
                <div class="quiz-result-container p-8 rounded-3xl w-full max-w-4xl mx-auto glass-panel">
                    <h3 class="text-2xl font-bold mb-8 text-center" data-translate-key="quizResultTitle"></h3>
                    <div class="grid md:grid-cols-2 gap-8">
                        <div class="quiz-choice-option p-6 rounded-2xl bg-white/50 text-left" data-recipe-id="${r1.id}"><h4 class="text-2xl font-bold mb-2">${r1.name[state.currentLang]}</h4><p class="text-md italic text-gray-600">"${r1.description[state.currentLang]}"</p></div>
                        <div class="quiz-choice-option p-6 rounded-2xl bg-white/50 text-left" data-recipe-id="${r2.id}"><h4 class="text-2xl font-bold mb-2">${r2.name[state.currentLang]}</h4><p class="text-md italic text-gray-600">"${r2.description[state.currentLang]}"</p></div>
                    </div>
                    <div class="text-center mt-8"><button id="retakeQuizBtn" class="btn btn-secondary py-3 px-6" data-translate-key="retakeQuizBtn"></button></div>
                </div>
            </div>`;
            applyTranslations();
         }
    } else {
         homeView.innerHTML = `<p class="text-red-500">Lỗi khi lấy đề xuất từ AI.</p>`;
    }
}

async function handleAiStudioGeneration() {
    const button = document.getElementById('aiStudioGenerateBtn');
    const promptText = document.getElementById('aiStudioPrompt').value;
    const resultContainer = document.getElementById('aiStudioResultContainer');
    
    if (!promptText || state.isAILoading) return;
    
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = `<div class="spinner"></div> ${t('aiStudioLoading')}`;
    
    const prompt = `Create a new recipe based on prompt: "${promptText}"`;
    const newRecipe = await callAIApi(prompt, 1500);
    
    if (newRecipe) {
        resultContainer.innerHTML = `<div class="mt-4 border-t border-gray-200/50 pt-6">
            <h3 class="text-2xl font-bold text-center mb-4" data-translate-key="aiStudioResultTitle"></h3>
            <div class="p-4 rounded-2xl bg-blue-50 shadow-inner">${createFullRecipeHTML(newRecipe, false)}</div>
        </div>`;
    } else {
        resultContainer.innerHTML = `<p class="text-red-500 text-center mt-4">Error generating recipe.</p>`;
    }
    button.disabled = false;
    button.innerHTML = button.dataset.originalText;
    applyTranslations();
}

function attachViewEventListeners(viewName) {
    if (viewName === 'library') {
        renderLibraryList(); renderLibraryDetails();
        document.getElementById('searchInput').addEventListener('input', renderLibraryList);
        document.getElementById('filtersContainer').addEventListener('click', handleFilterClick);
        document.getElementById('recipeListContainer').addEventListener('click', e => {
             const cb = e.target.closest('.recipe-compare-cb');
             const item = e.target.closest('.recipe-item-clickable');
             if (cb) {
                 handleRecipeSelection(cb.dataset.recipeId, 'checkbox');
             } else if (item) {
                 handleRecipeSelection(item.dataset.recipeId, 'div');
             }
        });
        const compareBtnContainer = document.getElementById('compareBtnContainer');
        if (compareBtnContainer) {
            compareBtnContainer.addEventListener('click', (e) => {
                if(e.target.id === 'compareBtn' && !e.target.disabled) {
                    handleAiComparison();
                }
            });
        }
    } else if (viewName === 'quiz') {
         document.querySelector('#quizView .grid').addEventListener('click', e => {
            const option = e.target.closest('.quiz-option');
            if(!option || option.classList.contains('selected')) return;
            const group = option.closest('[data-quiz-group]').dataset.quizGroup;
            state.quizAnswers[group] = option.dataset.value;
            option.classList.add('selected');
            setTimeout(() => {
                state.quizStep++;
                if (state.quizStep >= quizQuestions.length) handleQuizSubmit();
                else renderView('quiz');
            }, 250);
        });
    } else if (viewName === 'aiStudio') {
        document.getElementById('aiStudioGenerateBtn').addEventListener('click', handleAiStudioGeneration);
    }
}

function renderLibraryList() {
     const container = document.getElementById('recipeListContainer');
     if (!container) return;
     const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase();
     
     let recipesToRender = recipesData.filter(recipe => 
        (recipe.name.vi.toLowerCase().includes(searchTerm) || recipe.name.en.toLowerCase().includes(searchTerm) || recipe.description.vi.toLowerCase().includes(searchTerm) || recipe.description.en.toLowerCase().includes(searchTerm)) &&
        (state.activeFilters.type === 'all' || recipe.type === state.activeFilters.type) &&
        (state.activeFilters.contrast === 'all' || recipe.contrast === state.activeFilters.contrast) &&
        (state.activeFilters.saturation === 'all' || recipe.saturation === state.activeFilters.saturation)
     );

     container.innerHTML = recipesToRender.map(recipe => {
        const isSelected = recipe.id === state.selectedRecipeId;
        const isChecked = state.comparisonList.includes(recipe.id);
         return `<div class="recipe-item p-3 rounded-lg transition-all duration-200 border-l-4 border-transparent flex gap-3 items-center ${isSelected ? 'selected' : ''}">
            <input type="checkbox" class="recipe-compare-cb form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 flex-shrink-0" data-recipe-id="${recipe.id}" ${isChecked ? 'checked' : ''} ${state.comparisonList.length >= 2 && !isChecked ? 'disabled' : ''}>
            <div class="flex-grow cursor-pointer recipe-item-clickable" data-recipe-id="${recipe.id}">
                <span class="font-semibold text-primary">${recipe.name[state.currentLang]}</span>
                <p class="text-xs text-neutral-600 mt-1 leading-snug">${recipe.description[state.currentLang]}</p>
            </div>
        </div>`;
     }).join('');
     
     const btnContainer = document.getElementById('compareBtnContainer');
     btnContainer.innerHTML = `<button id="compareBtn" class="btn btn-primary w-full mt-4 py-3" data-translate-key="compareBtn" ${state.comparisonList.length !== 2 ? 'disabled' : ''}></button>`;
     applyTranslations();
}

function renderLibraryDetails() {
    const recipeContentContainer = document.getElementById('recipeContent');
    const welcomeView = document.getElementById('recipeDetailWelcome');
    const recipe = recipesData.find(r => r.id === state.selectedRecipeId);
    if (!recipe) {
        welcomeView.classList.remove('hidden');
        recipeContentContainer.classList.add('hidden');
        return;
    }
    welcomeView.classList.add('hidden');
    recipeContentContainer.classList.remove('hidden');
    
    recipeContentContainer.innerHTML = `
        <h3 class="text-3xl font-bold">${recipe.name[state.currentLang]}</h3>
        <p class="text-lg text-neutral-600 mt-2 mb-6 italic">"${recipe.description[state.currentLang]}"</p>
        <div id="originalRecipeContainer">${createFullRecipeHTML(recipe, true)}</div>
        <div class="mt-12 pt-8 border-t border-gray-200">
            <details class="group" open>
                <summary class="text-2xl font-bold cursor-pointer list-none flex justify-between items-center group-hover:text-blue-600 transition-colors">
                    <span data-translate-key="quickGuideTitle"></span>
                    <svg class="w-5 h-5 transition-transform transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </summary>
                <div class="prose-guide max-w-none mt-4 space-y-4">
                    <p data-translate-key="quickGuideStep1" data-translate-type="html"></p>
                    <p data-translate-key="quickGuideStep2" data-translate-type="html"></p>
                    <p data-translate-key="quickGuideStep3" data-translate-type="html"></p>
                    <p data-translate-key="quickGuideStep4" data-translate-type="html"></p>
                </div>
            </details>
        </div>
        <div class="mt-12 pt-8 border-t border-gray-200">
            <h3 class="text-2xl font-bold mb-4" data-translate-key="aiTuningTitle"></h3>
            <div class="glass-panel p-5 rounded-2xl">
                <textarea id="aiTuningTextarea" class="w-full p-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 transition-shadow" rows="3" data-translate-key="aiTuningPlaceholder"></textarea>
                <button id="aiTuningBtn" data-recipe-id="${recipe.id}" class="btn btn-primary w-full mt-4 py-3" data-translate-key="aiTuningBtn"></button>
                <div id="aiResultContainer" class="mt-4"></div>
            </div>
        </div>`;
    applyTranslations();
}

function init() {
    document.body.addEventListener('click', async (e) => {
        const target = e.target;
        const homeBtn = target.closest('#homeBtn');
        const navBtn = target.closest('.nav-btn');
        const langBtn = target.closest('.lang-btn');
        const startQuizBtn = target.closest('#startQuizBtn');
        const retakeQuizBtn = target.closest('#retakeQuizBtn');
        const aiTuningBtn = target.closest('#aiTuningBtn');
        const quizChoice = target.closest('.quiz-choice-option');
        const recipeItemClickable = target.closest('.recipe-item-clickable');
        const recipeCheckbox = target.closest('.recipe-compare-cb');
        const compareBtn = target.closest('#compareBtn');
        const closeModalBtn = target.closest('#closeComparisonModalBtn');

        const resetQuiz = async () => { state.quizStep = 0; state.quizAnswers = {}; await renderView('quiz'); };

        if (homeBtn) { await renderView('home'); return; }
        if (navBtn && !navBtn.href) { 
            e.preventDefault();
            await renderView(navBtn.dataset.view); 
            return; 
        }
        if (langBtn) { 
            state.currentLang = langBtn.id.replace('lang', '').toLowerCase(); 
            await renderView(state.currentView);
            return; 
        }
        if (startQuizBtn || retakeQuizBtn) { await resetQuiz(); return; }
        if (aiTuningBtn) { handleAiAdjustment(aiTuningBtn); return; }
        if (quizChoice) { 
            state.selectedRecipeId = quizChoice.dataset.recipeId; 
            await renderView('library');
            return; 
        }
        if(recipeItemClickable) {
            handleRecipeSelection(recipeItemClickable.dataset.recipeId, 'div');
        }
        if(recipeCheckbox) {
            handleRecipeSelection(recipeCheckbox.dataset.recipeId, 'checkbox');
        }
        if (compareBtn && !compareBtn.disabled) {
            handleAiComparison();
        }
        if (closeModalBtn) {
            document.getElementById('comparisonModal').classList.add('hidden');
        }
    });
    
    renderView('home');
}

document.addEventListener("DOMContentLoaded", init);
