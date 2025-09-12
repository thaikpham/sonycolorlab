// File Path: thaikpham/sonycolorlab/sonycolorlab-main/src/components/ai-lab/ai-lab-ui.js
import { state } from '../../services/state.js';
import { t, applyTranslations } from '../../services/language.js';

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
// ... existing code ...
            </button>
        </div>
    `;
}

function renderAIComparison(container) {
    const original = state.ai.originalRecipe;
    const generated = state.ai.generatedRecipe;
    // Store an editable copy
    state.ai.editableRecipe = JSON.parse(JSON.stringify(generated));

    const createEditableGrid = (titleKey, settings, section) => {
        if (!settings) return '';
        const gridItems = Object.entries(settings).map(([key, value]) => {
            // FIX: Use optional chaining to safely access properties of 'original' which might be null.
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
// ... existing code ...
