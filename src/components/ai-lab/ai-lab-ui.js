import { state } from '../../services/state.js';
import { t, applyTranslations } from '../../services/language.js';

export function renderAILab() {
    const contentEl = document.getElementById('aiLabContent');
    if (!contentEl) return;

    if (state.ai.isGenerating) {
        contentEl.innerHTML = `<div class="flex flex-col items-center justify-center h-64"><div class="loader-dark"></div><p class="mt-4 text-gray-600">Gemini is thinking...</p></div>`;
        return;
    }
    if (state.ai.generatedRecipe) {
        renderAIComparison(contentEl);
        return;
    }
    renderAIPromptInput(contentEl);
    applyTranslations();
}

function renderAIPromptInput(container) {
    const recipeName = state.ai.originalRecipe.name[t('lang')];
    container.innerHTML = `
        <p class="text-lg text-gray-600 text-center">${t('aiLabDescription').replace('{recipeName}', `<b>${recipeName}</b>`)}</p>
        <textarea id="aiPromptInput" class="w-full mt-4 p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all min-h-[100px]" placeholder="${t('aiPromptPlaceholder')}"></textarea>
        <div class="mt-6 text-center">
            <button id="generateAIBtn" class="btn btn-primary py-3 px-8 text-lg">
                <span data-translate-key="aiGenerateBtn"></span>
            </button>
        </div>
    `;
}

function renderAIComparison(container) {
    const original = state.ai.originalRecipe;
    const generated = state.ai.generatedRecipe;

    const createComparisonGrid = (titleKey, originalSettings, generatedSettings) => {
        if (!originalSettings || !generatedSettings) return '';
        const allKeys = Object.keys(originalSettings);
        const gridItems = allKeys.map(key => {
            const originalValue = originalSettings[key];
            const generatedValue = generatedSettings[key];
            const isChanged = originalValue !== generatedValue;
            return `
                <div class="flex flex-col p-3 rounded-lg ${isChanged ? 'bg-blue-100/50 border border-blue-200' : 'bg-gray-100/70'}">
                    <span class="text-sm text-gray-500 font-medium">${key}</span>
                    <div class="flex items-baseline gap-2 mt-1">
                        <span class="font-semibold text-lg ${isChanged ? 'text-blue-700' : 'text-gray-800'}">${generatedValue}</span>
                        ${isChanged ? `<span class="text-xs text-gray-500 line-through">${originalValue}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        return `<div><h4 class="text-lg font-bold mb-3 text-gray-700" data-translate-key="${titleKey}"></h4><div class="grid grid-cols-2 md:grid-cols-3 gap-3">${gridItems}</div></div>`;
    };

    container.innerHTML = `
        <div class="text-center">
            <h3 class="text-2xl font-bold" data-translate-key="aiComparisonTitle"></h3>
            <p class="mt-1 text-gray-600" data-translate-key="aiComparisonDescription"></p>
        </div>
        <div class="mt-6 grid grid-cols-1">
             <div class="border-2 border-blue-500 rounded-xl p-4 bg-white shadow-lg">
                <h4 class="text-xl font-bold text-center text-blue-600" data-translate-key="aiNewTitle"></h4>
                <p class="text-center text-gray-500">${generated.name[t('lang')]}</p>
            </div>
        </div>
        <div class="mt-6 space-y-6">
            ${createComparisonGrid('recipeSettingsTitle', original.settings, generated.settings)}
            ${original.colorDepth ? createComparisonGrid('colorDepthTitle', original.colorDepth, generated.colorDepth) : ''}
        </div>
        <div class="mt-8 text-center">
             <button id="downloadAIPdfBtn" data-recipe-id="${original.id}" class="btn bg-gray-700 hover:bg-gray-800 text-white py-3 px-6 shadow-lg shadow-gray-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download h-5 w-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                <span data-translate-key="downloadPDFBtn"></span>
            </button>
        </div>
    `;
    applyTranslations();
}

export function renderAIError(container) {
    container.innerHTML = `
        <div class="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 class="text-xl font-bold text-red-800" data-translate-key="aiErrorTitle"></h3>
            <p class="mt-2 text-red-700" data-translate-key="aiErrorText"></p>
        </div>
    `;
    applyTranslations();
}
