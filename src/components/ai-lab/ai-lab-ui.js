// File Path: thaikpham/sonycolorlab/sonycolorlab-main/src/components/ai-lab/ai-lab-ui.js
import { state } from '../../services/state.js';
import { t, applyTranslations, getCurrentLanguage } from '../../services/language.js';

export function renderAILab() {
// ... existing code ...
    renderAIPromptInput(contentEl);
    applyTranslations();
}

function renderAIPromptInput(container) {
// ... existing code ...
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

// Helper to escape backticks for safe insertion into template literals
const escapeBackticks = (str = '') => String(str).replace(/`/g, '\\`');

function renderAIComparison(container) {
    const original = state.ai.originalRecipe;
    const generated = state.ai.generatedRecipe;
    // Store an editable copy
    state.ai.editableRecipe = JSON.parse(JSON.stringify(generated));

    const createEditableGrid = (titleKey, settings, section) => {
        if (!settings) return '';
        const gridItems = Object.entries(settings).map(([key, value]) => {
            const originalValue = original?.settings?.[key] ?? original?.colorDepth?.[key] ?? original?.detailSettings?.[key];
            const isChanged = original && originalValue !== undefined && originalValue !== value;
            return `
                <div class="flex flex-col p-3 rounded-lg ${isChanged ? 'bg-blue-100/50 border border-blue-200' : 'bg-gray-100/70'}">
                    <label for="ai-${section}-${key.replace(/\s+/g, '-')}" class="text-sm text-gray-500 font-medium">${key}</label>
                    <div class="flex items-baseline gap-2 mt-1">
                        <input type="text" id="ai-${section}-${key.replace(/\s+/g, '-')}" data-section="${section}" data-key="${key}" class="font-semibold text-lg w-full ${isChanged ? 'text-blue-700' : 'text-gray-800'} bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none p-1" value="${value}">
                         ${isChanged ? `<span class="text-xs text-gray-400 line-through flex-shrink-0">${originalValue}</span>` : ''}
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
        <form id="aiRecipeForm" class="mt-6">
            <div class="p-4 bg-white/80 rounded-2xl border text-left space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="recipeName" class="text-base font-bold mb-2 block" data-translate-key="recipeNameLabel"></label>
                        <input type="text" id="recipeName" class="w-full text-xl font-bold p-2 border-b-2" value="${escapeBackticks(generated.name[getCurrentLanguage()])}">
                    </div>
                     <div>
                        <h5 class="text-base font-bold mb-2" data-translate-key="whiteBalanceTitle"></h5>
                        <input type="text" id="whiteBalance" class="w-full p-2 bg-white/70 rounded-lg font-semibold border-b-2" value="${generated.whiteBalance}">
                    </div>
                </div>
                <div>
                     <label for="recipeDescription" class="text-base font-bold mb-2 block" data-translate-key="recipeDescriptionLabel"></label>
                    <textarea id="recipeDescription" rows="2" class="w-full text-gray-600 mt-1 italic p-2 border-b-2">${escapeBackticks(generated.description[getCurrentLanguage()])}</textarea>
                </div>
            </div>

            <div class="mt-6 space-y-6">
                ${createEditableGrid('recipeSettingsTitle', generated.settings, 'settings')}
                ${generated.colorDepth ? createEditableGrid('colorDepthTitle', generated.colorDepth, 'colorDepth') : ''}
                ${generated.detailSettings ? createEditableGrid('detailTitle', generated.detailSettings, 'detailSettings') : ''}
                <div>
                    <h5 class="text-base font-bold mt-4 mb-2" data-translate-key="notesLabel"></h5>
                    <textarea id="recipeNotes" class="w-full p-3 rounded-lg bg-white/70 border-2 border-gray-200" rows="4" placeholder="${t('notesPlaceholder')}"></textarea>
                </div>
            </div>
        </form>
        <div class="mt-8 text-center flex flex-wrap justify-center items-center gap-4">
            <button id="saveAIGeneratedRecipeBtn" class="btn btn-primary py-3 px-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save h-5 w-5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                <span data-translate-key="saveAIGeneratedRecipe"></span>
            </button>
             <button id="downloadAIPngBtn" data-recipe-id="${original?.id || generated.id}" class="btn bg-gray-700 hover:bg-gray-800 text-white py-3 px-6 shadow-lg shadow-gray-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image h-5 w-5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                <span data-translate-key="downloadPNG"></span>
            </button>
        </div>
    `;
    applyTranslations();
}

export function renderAIError(container) {

