import { translations, quizQuestions, infographicTranslations } from './translations.js';
import { recipesData } from './data.js';

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
    activeCharts: {}
};

const mainContentEl = document.getElementById('mainContent');
const allTranslations = { ...translations, ...infographicTranslations };

// --- GEMINI API INTEGRATION ---
async function callGeminiApi(chatHistory, generationConfig = {}) {
    if (state.isAILoading) return;
    state.isAILoading = true;
    updateUILoadingState(true);

    const apiKey = ""; // Left empty as per instructions
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const payload = { contents: chatHistory, generationConfig };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
        const result = await response.json();
        if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts[0]) {
            const text = result.candidates[0].content.parts[0].text;
            return generationConfig.responseMimeType === 'application/json' ? JSON.parse(text) : text;
        } else {
            console.error("Unexpected API response structure:", result);
            return null;
        }
    } catch (error) {
        console.error("Gemini API call failed:", error);
        alert(t('errorApi'));
        return null;
    } finally {
        state.isAILoading = false;
        updateUILoadingState(false);
    }
}

// --- TRANSLATION & UI RENDERING ---
function t(key) {
    const keys = key.split('.');
    let result = allTranslations;
    for (const k of keys) {
        result = result?.[k];
        if (result === undefined) return key;
    }
    return result?.[state.currentLang] || result?.['en'] || key;
}

function applyTranslations() {
    document.documentElement.lang = state.currentLang;
    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.dataset.translateKey;
        const translation = t(key);
        if (el.dataset.translateType === 'html') {
            el.innerHTML = translation;
        } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = translation;
        } else {
            el.textContent = translation;
        }
    });
}

function updateUILoadingState(isLoading) {
    document.querySelectorAll('button[data-ai-button]').forEach(btn => {
        if (isLoading) {
            btn.disabled = true;
            btn.dataset.originalText = btn.innerHTML;
            const loadingText = t(btn.dataset.loadingKey || 'loading');
            btn.innerHTML = `<div class="spinner"></div> ${loadingText}`;
        } else {
            btn.disabled = false;
            if (btn.dataset.originalText) btn.innerHTML = btn.dataset.originalText;
        }
    });
}


// --- INFOGRAPHIC CHART RENDERING ---
function destroyAllCharts() {
    Object.values(state.activeCharts).forEach(chart => chart.destroy());
    state.activeCharts = {};
}

function renderAllCharts(lang) {
    const FONT_COLOR = '#374151'; 
    const GRID_COLOR = '#E5E7EB'; 
    const PALETTE = { blue: '#00A6ED', green: '#7FBA00', yellow: '#FFB900', orange: '#F25022', gray: '#737373' };

    const defaultChartOptions = (extraOptions = {}) => ({
        responsive: true, maintainAspectRatio: false, color: FONT_COLOR,
        plugins: { legend: { labels: { color: FONT_COLOR } }, tooltip: { callbacks: { title: (items) => Array.isArray(items[0].label) ? items[0].label.join(' ') : items[0].label } } },
        scales: { x: { ticks: { color: FONT_COLOR }, grid: { color: GRID_COLOR } }, y: { ticks: { color: FONT_COLOR }, grid: { color: GRID_COLOR } } },
        ...extraOptions
    });
    
    const kelvinCtx = document.getElementById('kelvinChart')?.getContext('2d');
    if(kelvinCtx) {
        state.activeCharts.kelvin = new Chart(kelvinCtx, {
            type: 'bar',
            data: { labels: ['2500K', '4000K', '5500K', '7500K', '9900K'], datasets: [{ label: t('kelvinChartTitle'), data: [1, 1, 1, 1, 1], backgroundColor: ['rgba(0, 166, 237, 0.4)','rgba(0, 166, 237, 0.7)','rgba(200, 200, 200, 0.8)','rgba(242, 80, 34, 0.7)','rgba(242, 80, 34, 0.4)'], borderColor: ['#00A6ED','#00A6ED','rgba(150, 150, 150, 1)','#F25022','#F25022'], borderWidth: 1 }] },
            options: defaultChartOptions({ indexAxis: 'y', plugins: { legend: { display: false } } })
        });
    }

    const wbShiftCtx = document.getElementById('wbShiftChart')?.getContext('2d');
    if(wbShiftCtx) {
        state.activeCharts.wbShift = new Chart(wbShiftCtx, {
            type: 'scatter',
            data: { datasets: [ { label: t('wbShiftRecipe1'), data: [{x: 6, y: 7}], backgroundColor: PALETTE.blue, pointRadius: 10, pointHoverRadius: 15 }, { label: t('wbShiftRecipe2'), data: [{x: -7, y: 0.5}], backgroundColor: PALETTE.orange, pointRadius: 10, pointHoverRadius: 15 } ] },
            options: defaultChartOptions({ scales: { x: { min: -9, max: 9, title: { display: true, text: t('wbShiftXAxis'), color: FONT_COLOR } }, y: { min: -9, max: 9, title: { display: true, text: t('wbShiftYAxis'), color: FONT_COLOR } } } })
        });
    }

    const blackGammaCtx = document.getElementById('blackGammaChart')?.getContext('2d');
    if(blackGammaCtx) {
        state.activeCharts.blackGamma = new Chart(blackGammaCtx, {
            type: 'bar',
            data: { labels: ['-7', '-4', '0', '+4', '+7'], datasets: [{ label: 'Level', data: [-7, -4, 0, 4, 7], backgroundColor: [PALETTE.blue, PALETTE.blue, PALETTE.gray, PALETTE.orange, PALETTE.orange] }] },
            options: defaultChartOptions({ plugins: { legend: { display: false } }, scales: { y: { title: { display: true, text: t('blackGammaYAxis') } } } })
        });
    }

    const kneeCtx = document.getElementById('kneeChart')?.getContext('2d');
    if(kneeCtx) {
         state.activeCharts.knee = new Chart(kneeCtx, {
            type: 'line',
            data: { labels: Array.from({length: 12}, (_, i) => i * 10), datasets: [ { label: t('kneeChartNoKnee'), data: Array.from({length: 11}, (_, i) => i * 10), borderColor: PALETTE.gray, borderWidth: 2, borderDash: [5, 5], tension: 0.1, pointRadius: 0 }, { label: t('kneeChartSoft'), data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 88, 94, 98], borderColor: PALETTE.green, borderWidth: 3, tension: 0.4, pointRadius: 0 }, { label: t('kneeChartSharp'), data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 97, 101], borderColor: PALETTE.blue, borderWidth: 3, tension: 0.1, pointRadius: 0 } ] },
            options: defaultChartOptions({ plugins: { legend: { position: 'bottom', labels: { boxWidth: 20 } } }, scales: { x: { title: { display: true, text: t('kneeChartSignalIn') } }, y: { title: { display: true, text: t('kneeChartSignalOut') }, min: 0, max: 110 } } })
        });
    }
    
    const colorDepthCtx = document.getElementById('colorDepthChart')?.getContext('2d');
    if(colorDepthCtx) {
        const colorDepthLabels = allTranslations.colorDepthLabels[lang];
        state.activeCharts.colorDepth = new Chart(colorDepthCtx, {
            type: 'bar',
            data: { labels: colorDepthLabels, datasets: [{ label: t('colorDepthTitleChart'), data: [-3, 5, -3, -3, -5, -2], backgroundColor: ['#EF5350', '#66BB6A', '#42A5F5', '#26C6DA', '#AB47BC', '#FFEE58'] }] },
            options: defaultChartOptions({ plugins: { legend: { display: false } }, scales: { y: { min: -7, max: 7, title: { display: true, text: t('colorDepthYAxis') } } } })
        });
    }
}


// --- COMPONENT & VIEW TEMPLATES ---
const viewTemplates = {
    home: () => `<div id="homeView" class="w-full h-full flex flex-col items-center justify-center text-center absolute inset-0 view-transition">...</div>`, // same as before
    quiz: () => `<div id="quizView" class="w-full h-full flex flex-col items-center justify-center absolute inset-0 view-transition">...</div>`, // same as before
    library: () => `<div id="libraryView" class="w-full h-full flex flex-col md:flex-row gap-6 absolute inset-0 view-transition">...</div>`, // same as before
    aiStudio: () => `<div id="aiStudioView" class="w-full h-full absolute inset-0 overflow-y-auto view-transition">...</div>`, // same as before
    
    explain: () => `
    <div id="explainView" class="w-full h-full absolute inset-0 overflow-y-auto view-transition p-4 md:p-8">
        <div class="max-w-7xl mx-auto">
            <header class="text-center mb-12 md:mb-16">
                <h1 class="text-4xl md:text-5xl font-extrabold text-slate-800 mb-2" data-translate-key="mainTitle"></h1>
                <h2 class="text-xl md:text-2xl text-blue-600 font-medium" data-translate-key="mainSubtitle"></h2>
            </header>
            <main class="space-y-16 md:space-y-20">
                <!-- Sections from infographic.html will be here -->
                <section id="intro" class="text-center">
                    <h3 class="text-3xl font-bold mb-4" data-translate-key="introTitle"></h3>
                    <p class="max-w-3xl mx-auto text-lg text-slate-600 mb-8" data-translate-key="introParagraph"></p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
                        <div class="bg-white p-6 rounded-xl shadow-lg"><h4 class="text-xl font-bold text-[#F25022] mb-3" data-translate-key="rawProcessTitle"></h4><ol class="text-left space-y-2 text-slate-700"><li data-translate-key="rawStep1"></li><li data-translate-key="rawStep2"></li><li data-translate-key="rawStep3"></li><li data-translate-key="rawStep4"></li><li data-translate-key="rawStep5"></li></ol></div>
                        <div class="bg-white p-6 rounded-xl shadow-lg border-4 border-[#7FBA00]"><h4 class="text-xl font-bold text-[#7FBA00] mb-3" data-translate-key="diyProcessTitle"></h4><ol class="text-left space-y-2 text-slate-700"><li data-translate-key="diyStep1"></li><li data-translate-key="diyStep2"></li><li data-translate-key="diyStep3" class="font-bold"></li></ol></div>
                    </div>
                </section>

                <section id="wb"><h3 class="text-3xl font-bold text-center mb-8" data-translate-key="wbTitle"></h3><div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"><div class="bg-white p-6 rounded-xl shadow-lg"><h4 class="text-xl font-bold mb-4" data-translate-key="wbKelvinTitle"></h4><p class="mb-4 text-slate-600" data-translate-key="wbKelvinDesc"></p><div class="chart-container h-64 md:h-80"><canvas id="kelvinChart"></canvas></div><div class="mt-4 text-sm text-slate-500 space-y-1"><p data-translate-key="wbKelvinCool" data-translate-type="html"></p><p data-translate-key="wbKelvinWarm" data-translate-type="html"></p></div></div><div class="bg-white p-6 rounded-xl shadow-lg"><h4 class="text-xl font-bold mb-4" data-translate-key="wbShiftTitle"></h4><p class="mb-4 text-slate-600" data-translate-key="wbShiftDesc"></p><div class="chart-container h-64 md:h-80"><canvas id="wbShiftChart"></canvas></div><div class="mt-4 text-sm text-slate-500"><p data-translate-key="wbShiftExample" data-translate-type="html"></p></div></div></div></section>
                
                <section id="pp"><h3 class="text-3xl font-bold text-center mb-8" data-translate-key="ppTitle"></h3><p class="max-w-3xl mx-auto text-center text-lg text-slate-600 mb-8" data-translate-key="ppDesc"></p><div class="bg-white p-6 rounded-xl shadow-lg mb-8"><div class="flex flex-col md:flex-row justify-around items-center text-center"><div class="p-4"><h5 class="text-lg font-bold" data-translate-key="ppFlow1"></h5><p class="text-sm text-slate-500" data-translate-key="ppFlow1Desc"></p></div><div class="flow-arrow transform md:rotate-0 rotate-90 my-2 md:my-0">→</div><div class="p-4"><h5 class="text-lg font-bold" data-translate-key="ppFlow2"></h5><p class="text-sm text-slate-500" data-translate-key="ppFlow2Desc"></p></div><div class="flow-arrow transform md:rotate-0 rotate-90 my-2 md:my-0">→</div><div class="p-4"><h5 class="text-lg font-bold" data-translate-key="ppFlow3"></h5><p class="text-sm text-slate-500" data-translate-key="ppFlow3Desc"></p></div></div></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><div class="bg-white p-6 rounded-xl shadow-lg"><h4 class="text-xl font-bold mb-4" data-translate-key="blackGammaTitle"></h4><p class="mb-4 text-slate-600" data-translate-key="blackGammaDesc"></p><div class="chart-container h-56"><canvas id="blackGammaChart"></canvas></div><p class="mt-4 text-sm text-slate-500" data-translate-key="blackGammaNote" data-translate-type="html"></p></div><div class="bg-white p-6 rounded-xl shadow-lg"><h4 class="text-xl font-bold mb-4" data-translate-key="kneeTitle"></h4><p class="mb-4 text-slate-600" data-translate-key="kneeDesc"></p><div class="chart-container h-56"><canvas id="kneeChart"></canvas></div><p class="mt-4 text-sm text-slate-500" data-translate-key="kneeNote" data-translate-type="html"></p></div><div class="bg-white p-6 rounded-xl shadow-lg md:col-span-2 lg:col-span-1"><h4 class="text-xl font-bold mb-4" data-translate-key="colorDepthTitle"></h4><p class="mb-4 text-slate-600" data-translate-key="colorDepthDesc"></p><div class="chart-container h-56"><canvas id="colorDepthChart"></canvas></div><p class="mt-4 text-sm text-slate-500" data-translate-key="colorDepthNote"></p></div></div></section>
                
                <footer class="text-center mt-16 pt-8 border-t border-slate-300"><p class="text-slate-600" data-translate-key="footerText"></p><p class="text-sm text-slate-500 mt-2" data-translate-key="footerSubtext"></p></footer>
            </main>
        </div>
    </div>`
};

function renderView(viewName) {
    state.currentView = viewName;
    const currentContent = mainContentEl.children[0];
    const renderNewContent = () => {
        destroyAllCharts(); // Destroy old charts before rendering new view
        // Re-fill the other view templates here for completeness
        viewTemplates.home = () => `<div id="homeView" class="w-full h-full flex flex-col items-center justify-center text-center absolute inset-0 view-transition"><h1 data-translate-key="landingTitle" class="landing-title"></h1><p data-translate-key="landingSubtitle" class="landing-subtitle mt-4"></p><button id="startQuizBtn" class="btn btn-primary mt-8 py-4 px-8 text-lg" data-translate-key="startQuizBtn"></button></div>`;
        viewTemplates.quiz = () => { if (state.quizStep >= quizQuestions.length) return ''; const q = quizQuestions[state.quizStep]; const optionsHTML = q.options.map((optKey, index) => `<div class="quiz-option" data-value="${q.values[index]}"><span data-translate-key="${optKey}"></span></div>`).join(''); const gridCols = q.options.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'; return `<div id="quizView" class="w-full h-full flex flex-col items-center justify-center absolute inset-0 view-transition"><div class="w-full max-w-4xl text-center" data-quiz-group="${q.id}"><h2 class="quiz-question-title" data-translate-key="${q.title}"></h2><div class="grid grid-cols-1 ${gridCols} gap-4 mt-12">${optionsHTML}</div></div></div>`; };
        viewTemplates.library = () => `<div id="libraryView" class="w-full h-full flex flex-col md:flex-row gap-6 absolute inset-0 view-transition"><aside class="md:w-1/3 lg:w-1/4 glass-panel p-5 flex flex-col rounded-3xl"><h2 class="text-2xl font-bold" data-translate-key="sidebarTitle"></h2><input type="search" id="searchInput" class="w-full p-3 my-4 rounded-xl bg-gray-200/50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all" data-translate-key="searchInputPlaceholder"><div id="filtersContainer" class="space-y-4">...</div><div id="recipeListContainer" class="space-y-1 pt-4 mt-4 border-t flex-grow overflow-y-auto pr-2"></div><div id="compareBtnContainer" class="pt-2 flex-shrink-0"></div></aside><main class="md:w-2/3 lg:w-3/4 flex flex-col min-h-0"><div class="glass-panel flex-grow overflow-y-auto p-8 rounded-3xl"><div id="recipeDetailWelcome" class="text-center flex flex-col items-center justify-center h-full text-neutral-400">...</div><div id="recipeContent" class="hidden"></div></div></main></div>`;
        viewTemplates.aiStudio = () => `<div id="aiStudioView" class="w-full h-full absolute inset-0 overflow-y-auto view-transition"><div class="glass-panel p-8 md:p-12 rounded-3xl max-w-4xl mx-auto my-8"><h2 data-translate-key="aiStudioTitle" class="text-4xl md:text-5xl font-extrabold text-center tracking-tight"></h2><p data-translate-key="aiStudioSubtitle" class="mt-4 text-lg text-neutral-600 text-center max-w-2xl mx-auto"></p><div class="mt-10 max-w-2xl mx-auto"><label for="aiStudioPrompt" class="block text-lg font-semibold mb-3 text-center" data-translate-key="aiStudioPromptTitle"></label><textarea id="aiStudioPrompt" class="w-full p-4 rounded-xl border-2 bg-white/50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm" rows="4" data-translate-key="aiStudioPromptPlaceholder"></textarea><div class="mt-6 flex justify-center"><button id="aiStudioGenerateBtn" class="btn btn-primary w-full md:w-auto md:px-12 py-4 text-lg" data-translate-key="aiStudioGenerateBtn" data-ai-button data-loading-key="aiStudioLoading"></button></div><div id="aiStudioResultContainer" class="mt-10"></div></div></div></div>`;

        mainContentEl.innerHTML = viewTemplates[viewName]();
        attachViewEventListeners(viewName);
        applyTranslations();
    };

    if (currentContent) {
        currentContent.classList.add('view-transition-out');
        currentContent.addEventListener('animationend', renderNewContent, { once: true });
    } else {
        renderNewContent();
    }
}

// ... (rest of the functions like handleQuizSubmit, handleAiComparison, etc. remain the same)
// ... I'm omitting them here for brevity, but they should be included in the final file.

function attachViewEventListeners(viewName) {
    if (viewName === 'explain') {
        renderAllCharts(state.currentLang);
    }
    // ... (other view event listeners remain the same)
    else if (viewName === 'library') {
        renderLibraryList(); renderLibraryDetails();
        document.getElementById('searchInput').addEventListener('input', renderLibraryList);
        document.getElementById('filtersContainer').addEventListener('click', e => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            const group = btn.closest('[data-filter-group]').dataset.filterGroup;
            const value = btn.dataset.filterValue;
            state.activeFilters[group] = value;
            document.querySelectorAll(`[data-filter-group="${group}"] .filter-btn`).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderLibraryList();
        });
    } else if (viewName === 'quiz') {
         document.querySelector('#quizView .grid').addEventListener('click', e => {
            const option = e.target.closest('.quiz-option');
            if(!option || option.classList.contains('selected')) return;
            const group = option.closest('[data-quiz-group]').dataset.quizGroup;
            state.quizAnswers[group] = option.dataset.value;
            option.classList.add('selected');
            setTimeout(() => {
                state.quizStep++;
                if (state.quizStep >= quizQuestions.length) {
                    // Placeholder for handleQuizSubmit();
                } else renderView('quiz');
            }, 250);
        });
    } else if (viewName === 'aiStudio') {
        document.getElementById('aiStudioGenerateBtn').addEventListener('click', () => { /* Placeholder for handleAiStudioGeneration() */ });
    }
}


function init() {
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('button, a');
        if (!target) return;

        // Navigation
        const view = target.dataset.view;
        if (view) {
            renderView(view);
            return;
        }
        if (target.id === 'homeBtn') {
            renderView('home');
            return;
        }

        // Language switching
        if (target.matches('.lang-btn')) {
            state.currentLang = target.id.includes('VI') ? 'vi' : 'en';
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('langVI').classList.toggle('active', state.currentLang === 'vi');
            document.getElementById('langEN').classList.toggle('active', state.currentLang === 'en');
            // Re-render view to apply translations and update charts if visible
            renderView(state.currentView);
        }
    });
    
    renderView('home');
}

document.addEventListener("DOMContentLoaded", init);

