import { getCurrentLanguage, t } from '../services/language.js';
import recipeImages from '../services/recipe-images.js';

/**
 * Renders the entire one-page quiz layout.
 * @param {Array<object>} questions - The array of question data from quiz.js.
 */
export function renderOnePageQuizLayout(questions) {
    const quizContent = document.getElementById('quizContent');
    if (!quizContent) return;

    const gridAreas = ["1", "2", "3", "4", "5", "6"];

    const questionsHTML = questions.map((q, index) => {
        if (q.type === 'ai_prompt') {
            // AI Prompt Island
            return `
                <div class="quiz-island" data-question-index="${index}" data-grid-area="6" style="transition-delay: ${index * 100}ms;">
                    <h3 class="text-xl font-bold text-center mb-2">${q.question[getCurrentLanguage()]}</h3>
                    <p class="text-gray-600 text-center text-sm mb-4">${q.description[getCurrentLanguage()]}</p>
                    <textarea id="aiQuizPrompt" class="w-full p-3 rounded-xl bg-white/60 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all min-h-[100px]" placeholder="${t('aiQuizPromptPlaceholder')}"></textarea>
                </div>`;
        } else {
            // Standard Question Island
            const optionsHTML = q.options.map(opt => `
                <button class="quiz-option w-full text-left p-4 flex items-center gap-4" data-tags="${opt.tags.join(',')}" data-question-index="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide w-8 h-8 flex-shrink-0 text-gray-500 transition-colors">${opt.icon}</svg>
                    <span class="font-semibold text-base md:text-lg">${opt.text[getCurrentLanguage()]}</span>
                </button>`).join('');

            return `
                <div class="quiz-island" data-question-index="${index}" data-grid-area="${gridAreas[index] || ''}" style="transition-delay: ${index * 100}ms;">
                    <h3 class="text-xl font-bold text-center mb-4">${q.question[getCurrentLanguage()]}</h3>
                    <div class="space-y-3">${optionsHTML}</div>
                </div>`;
        }
    }).join('');

    const submitHTML = `
        <div id="quizSubmitIsland" class="quiz-island p-6 flex flex-col items-center justify-center text-center" style="transition-delay: ${questions.length * 100}ms;">
             <p class="text-gray-600 mb-4 text-sm" data-translate-key="quizSubmitInfo"></p>
             <button id="submitQuizBtn" class="btn btn-pastel-submit w-full max-w-xs py-4 text-lg" disabled>
                <span data-translate-key="quizSubmitBtn"></span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
        </div>
    `;

    quizContent.innerHTML = `<div class="quiz-one-page-layout">${questionsHTML}${submitHTML}</div>`;

    // Trigger activation animation
    setTimeout(() => {
        document.querySelectorAll('.quiz-island').forEach(island => {
            island.classList.add('active');
        });
    }, 100);
}


/**
 * Renders the standard quiz result by replacing the quiz layout.
 * @param {object} bestMatch - The recipe object that best matches the answers.
 */
export function renderQuizResult(bestMatch) {
    const quizContent = document.getElementById('quizContent');
    quizContent.innerHTML = `
        <div class="quiz-result-view text-center max-w-2xl mx-auto py-8">
            <h3 class="text-3xl font-bold" data-translate-key="quizResultTitle"></h3>
            <p class="mt-2 text-gray-600" data-translate-key="quizResultDescription"></p>
            <div class="my-8 p-6 bg-white/80 rounded-2xl border flex flex-col sm:flex-row items-center gap-6">
                <img src="${recipeImages[bestMatch.id][0]}" class="w-full sm:w-48 h-32 rounded-lg object-cover shadow-lg" alt="Preview">
                <div class="text-left">
                    <h4 class="text-xl font-bold">${bestMatch.name[getCurrentLanguage()]}</h4>
                    <p class="text-gray-600 mt-1">${bestMatch.description[getCurrentLanguage()]}</p>
                </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button id="viewResultBtn" data-recipe-id="${bestMatch.id}" class="btn btn-primary py-3 px-8 text-base">
                    <span data-translate-key="viewRecipeBtn"></span>
                </button>
                <button id="retakeQuizBtn" class="btn bg-gray-200 text-gray-800 py-3 px-8 text-base">
                    <span data-translate-key="retakeQuizBtn"></span>
                </button>
            </div>
        </div>`;
}

/**
 * Renders the AI-generated recipe result by replacing the quiz layout.
 * @param {object} recipe - The AI-generated recipe object.
 */
export function renderQuizAIResult(recipe) {
    const quizContent = document.getElementById('quizContent');
    const createSettingsHTML = (settings) => Object.entries(settings || {}).map(([key, value]) => `
        <div class="flex flex-col p-3 rounded-lg bg-white/70">
            <span class="text-sm text-gray-500 font-medium">${key}</span>
            <span class="font-semibold text-lg text-gray-800">${value}</span>
        </div>`).join('');

    quizContent.innerHTML = `
        <div class="quiz-result-view text-center max-w-3xl mx-auto py-8">
            <h3 class="text-3xl font-bold" data-translate-key="aiQuizResultTitle"></h3>
            <p class="mt-2 text-gray-600" data-translate-key="aiQuizResultDescription"></p>
            <div class="my-8 p-6 bg-white/80 rounded-2xl border text-left">
                <h4 class="text-2xl font-bold text-center">${recipe.name[getCurrentLanguage()]}</h4>
                <p class="text-gray-600 mt-1 text-center italic">"${recipe.description[getCurrentLanguage()]}"</p>

                <h5 class="text-base font-bold mt-6 mb-2" data-translate-key="whiteBalanceTitle"></h5>
                <div class="p-3 bg-white/70 rounded-lg font-semibold">${recipe.whiteBalance}</div>

                <h5 class="text-base font-bold mt-4 mb-2" data-translate-key="recipeSettingsTitle"></h5>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">${createSettingsHTML(recipe.settings)}</div>

                ${recipe.colorDepth ? `<h5 class="text-base font-bold mt-4 mb-2" data-translate-key="colorDepthTitle"></h5><div class="grid grid-cols-3 md:grid-cols-6 gap-2">${createSettingsHTML(recipe.colorDepth)}</div>` : ''}
                ${recipe.detailSettings ? `<h5 class="text-base font-bold mt-4 mb-2" data-translate-key="detailTitle"></h5><div class="grid grid-cols-2 md:grid-cols-3 gap-2">${createSettingsHTML(recipe.detailSettings)}</div>` : ''}
            </div>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button id="retakeQuizBtn" class="btn bg-gray-200 text-gray-800 py-3 px-8 text-base">
                    <span data-translate-key="retakeQuizBtn"></span>
                </button>
            </div>
        </div>`;
}

/**
 * Renders a loading spinner by replacing the quiz layout.
 */
export function renderQuizLoading() {
    const quizContent = document.getElementById('quizContent');
    quizContent.innerHTML = `<div class="flex flex-col items-center justify-center h-full"><div class="loader-dark"></div><p class="mt-4 text-gray-600" data-translate-key="aiQuizGenerating"></p></div>`;
}

/**
 * Renders an error message by replacing the quiz layout.
 */
export function renderQuizError() {
    const quizContent = document.getElementById('quizContent');
    quizContent.innerHTML = `
        <div class="quiz-result-view text-center max-w-lg mx-auto py-8">
            <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 class="text-xl font-bold text-red-800" data-translate-key="aiErrorTitle"></h3>
                <p class="mt-2 text-red-700" data-translate-key="aiErrorText"></p>
                <button id="retakeQuizBtn" class="btn bg-gray-200 text-gray-800 py-3 px-8 text-base mt-4">
                    <span data-translate-key="retakeQuizBtn"></span>
                </button>
            </div>
        </div>`;
}
