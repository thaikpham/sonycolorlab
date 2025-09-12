// File Path: thaikpham/sonycolorlab/sonycolorlab-main/src/components/quiz-ui.js
import { getCurrentLanguage, t } from '../services/language.js';
import recipeImages from '../services/recipe-images.js';
import { state } from '../services/state.js';

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
    const createSettingsHTML = (settings) => Object.entries(settings || {}).map(([key, value]) => `
        <div class="flex flex-col p-3 rounded-lg bg-white/70">
            <span class="text-sm text-gray-500 font-medium">${key}</span>
            <span class="font-semibold text-lg text-gray-800">${value}</span>
        </div>`).join('');

    quizContent.innerHTML = `
        <div class="quiz-result-view text-center max-w-3xl mx-auto py-8">
            <h3 class="text-3xl font-bold" data-translate-key="quizResultTitle"></h3>
            <p class="mt-2 text-gray-600" data-translate-key="quizResultDescription"></p>
            
            <div id="quiz-result-card" class="my-8 p-6 bg-white/80 rounded-2xl border text-left">
                <div class="flex flex-col sm:flex-row items-center gap-6 mb-6">
                    <img src="${recipeImages[bestMatch.id]?.[0] || 'https://placehold.co/400x300/e2e8f0/a0aec0?text=No+Image'}" class="w-full sm:w-48 h-32 rounded-lg object-cover shadow-lg" alt="Preview" onerror="this.onerror=null;this.src='https://placehold.co/400x300/e2e8f0/a0aec0?text=No+Image';">
                    <div class="text-center sm:text-left">
                        <h4 class="text-2xl font-bold">${bestMatch.name[getCurrentLanguage()]}</h4>
                        <p class="text-gray-600 mt-1 italic">"${bestMatch.description[getCurrentLanguage()]}"</p>
                    </div>
                </div>

                <h5 class="text-base font-bold mt-6 mb-2" data-translate-key="whiteBalanceTitle"></h5>
                <div class="p-3 bg-white/70 rounded-lg font-semibold">${bestMatch.whiteBalance}</div>

                <h5 class="text-base font-bold mt-4 mb-2" data-translate-key="recipeSettingsTitle"></h5>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">${createSettingsHTML(bestMatch.settings)}</div>

                ${bestMatch.colorDepth ? `<h5 class="text-base font-bold mt-4 mb-2" data-translate-key="colorDepthTitle"></h5><div class="grid grid-cols-3 md:grid-cols-6 gap-2">${createSettingsHTML(bestMatch.colorDepth)}</div>` : ''}
                ${bestMatch.detailSettings ? `<h5 class="text-base font-bold mt-4 mb-2" data-translate-key="detailTitle"></h5><div class="grid grid-cols-2 md:grid-cols-3 gap-2">${createSettingsHTML(bestMatch.detailSettings)}</div>` : ''}
            </div>

            <div class="flex flex-wrap gap-4 justify-center">
                <button id="viewResultBtn" data-recipe-id="${bestMatch.id}" class="btn btn-primary py-3 px-8 text-base">
                    <span data-translate-key="viewRecipeBtn"></span>
                </button>
                <button id="downloadQuizResultPngBtn" data-element-id="quiz-result-card" data-recipe-name="${bestMatch.name.en}" class="btn bg-gray-700 hover:bg-gray-800 text-white py-3 px-6 shadow-lg shadow-gray-500/30">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image h-5 w-5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    <span data-translate-key="downloadPNG"></span>
                </button>
                <button id="retakeQuizBtn" class="btn bg-gray-200 text-gray-800 py-3 px-8 text-base">
                    <span data-translate-key="retakeQuizBtn"></span>
                </button>
            </div>
        </div>`;
}


/**
 * Renders the AI-generated recipe result as an editable form.
 * @param {object} recipe - The AI-generated recipe object.
 */
export function renderQuizAIResult(recipe) {
    state.quiz.editableRecipe = JSON.parse(JSON.stringify(recipe)); // Deep copy to avoid state mutation
    const quizContent = document.getElementById('quizContent');

    const createSettingsHTML = (settings, section) => Object.entries(settings || {}).map(([key, value]) => `
        <div class="flex flex-col p-3 rounded-lg bg-white/70">
            <label for="${section}-${key.replace(/\s+/g, '-')}" class="text-sm text-gray-500 font-medium">${key}</label>
            <input type="text" id="${section}-${key.replace(/\s+/g, '-')}" data-section="${section}" data-key="${key}" class="font-semibold text-lg text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none p-1" value="${value}">
        </div>`).join('');

    quizContent.innerHTML = `
        <div class="quiz-result-view text-center max-w-3xl mx-auto py-8">
            <h3 class="text-3xl font-bold" data-translate-key="aiQuizResultTitle"></h3>
            <p class="mt-2 text-gray-600" data-translate-key="aiQuizResultDescription"></p>
            <form id="aiRecipeForm">
                <div id="quiz-ai-result-card" class="my-8 p-6 bg-white/80 rounded-2xl border text-left space-y-4">
                    <div>
                        <label for="recipeName" class="text-base font-bold mb-2 block" data-translate-key="recipeNameLabel"></label>
                        <input type="text" id="recipeName" class="w-full text-2xl font-bold text-center p-2 border-b-2" value="${recipe.name[getCurrentLanguage()]}">
                    </div>
                    <div>
                         <label for="recipeDescription" class="text-base font-bold mb-2 block" data-translate-key="recipeDescriptionLabel"></label>
                        <textarea id="recipeDescription" rows="2" class="w-full text-gray-600 mt-1 text-center italic p-2 border-b-2">${recipe.description[getCurrentLanguage()]}</textarea>
                    </div>

                    <div>
                        <h5 class="text-base font-bold mt-6 mb-2" data-translate-key="whiteBalanceTitle"></h5>
                        <input type="text" id="whiteBalance" class="w-full p-3 bg-white/70 rounded-lg font-semibold border-b-2" value="${recipe.whiteBalance}">
                    </div>

                    <div>
                        <h5 class="text-base font-bold mt-4 mb-2" data-translate-key="recipeSettingsTitle"></h5>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-2" id="main-settings-grid">${createSettingsHTML(recipe.settings, 'settings')}</div>
                    </div>

                    ${recipe.colorDepth ? `<div><h5 class="text-base font-bold mt-4 mb-2" data-translate-key="colorDepthTitle"></h5><div class="grid grid-cols-3 md:grid-cols-6 gap-2" id="color-depth-grid">${createSettingsHTML(recipe.colorDepth, 'colorDepth')}</div></div>` : ''}
                    ${recipe.detailSettings ? `<div><h5 class="text-base font-bold mt-4 mb-2" data-translate-key="detailTitle"></h5><div class="grid grid-cols-2 md:grid-cols-3 gap-2" id="detail-settings-grid">${createSettingsHTML(recipe.detailSettings, 'detailSettings')}</div></div>` : ''}

                     <div>
                        <h5 class="text-base font-bold mt-4 mb-2" data-translate-key="notesLabel"></h5>
                        <textarea id="recipeNotes" class="w-full p-3 rounded-lg bg-white/70 border-2 border-gray-200" rows="4" placeholder="${t('notesPlaceholder')}"></textarea>
                    </div>
                </div>
                <div class="flex flex-wrap gap-4 justify-center">
                    <button id="saveAIGeneratedRecipeBtn" type="button" class="btn btn-primary py-3 px-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save h-5 w-5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                        <span data-translate-key="saveAIGeneratedRecipe"></span>
                    </button>
                    <button id="saveToDriveBtn" type="button" class="btn bg-green-500 hover:bg-green-600 text-white py-3 px-6 shadow-lg shadow-green-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide w-5 h-5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M11.5 12.5 13 14l-2.5 2.5"/><path d="m10 16.5 1.5-1.5"/></svg>
                        <span data-translate-key="saveToDriveBtn"></span>
                    </button>
                    <button id="retakeQuizBtn" type="button" class="btn bg-gray-200 text-gray-800 py-3 px-8 text-base">
                        <span data-translate-key="retakeQuizBtn"></span>
                    </button>
                </div>
            </form>
        </div>`;
}

/**
 * Renders a loading spinner by replacing the quiz layout.
 */
export function renderQuizLoading() {
    const quizContent = document.getElementById('quizContent');
    quizContent.innerHTML = `
        <div class="ai-loading-container">
            <img src="/assets/Logo.png" alt="Loading..." class="ai-loading-logo">
            <p class="mt-4 text-gray-600" data-translate-key="aiQuizGenerating"></p>
        </div>`;
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

/**
 * Renders the AI clarification question step in the quiz.
 * @param {string} question The clarification question from the AI.
 * @param {Array<string>} options The answer options from the AI.
 */
export function renderAIClarification(question, options) {
    const quizContent = document.getElementById('quizContent');
    if (!quizContent) return;

    const optionsHTML = options.map(option => `
        <button class="quiz-clarification-option btn bg-white hover:bg-gray-100 text-gray-800 py-3 px-6 border border-gray-300">
            ${option}
        </button>
    `).join('');

    quizContent.innerHTML = `
        <div class="quiz-result-view text-center max-w-2xl mx-auto py-8">
            <div class="flex justify-center items-center gap-3 mb-4">
                 <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Zm12.25-3.625a.75.75 0 0 0-1.06-1.06l-1.592 1.591a.75.75 0 1 0 1.06 1.061l1.592-1.591ZM21 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5h2.25a.75.75 0 0 1 .75.75ZM17.81 17.81a.75.75 0 0 0-1.06-1.06l-1.591 1.592a.75.75 0 0 0 1.06 1.06l1.591-1.592ZM12 18.75a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V19.5a.75.75 0 0 1 .75-.75ZM4.19 17.81a.75.75 0 1 0-1.06-1.06l-1.591 1.592a.75.75 0 0 0 1.06 1.06l1.591-1.592ZM3 12a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0-1.5H3.75A.75.75 0 0 1 3 12ZM4.19 6.19a.75.75 0 0 0 1.06-1.06L3.657 3.536a.75.75 0 0 0-1.06 1.06l1.592 1.592Z" /></svg>
                </div>
                <h3 class="text-2xl font-bold" data-translate-key="aiClarificationTitle"></h3>
            </div>
            <p class="mt-2 text-lg text-gray-700">${question}</p>
            <div class="mt-6 flex flex-wrap justify-center gap-4">
                ${optionsHTML}
            </div>
        </div>
    `;
}

