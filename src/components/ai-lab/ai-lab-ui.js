// File Path: src/components/ai-lab/ai-lab-ui.js
import { state } from '../../services/state.js';
import { t, applyTranslations } from '../../services/language.js';
import recipesData from '../../services/recipes.js';

// --- TWEAK EXISTING RECIPE UI ---

function renderAIPromptInput(container) {
    const recipeName = state.ai.originalRecipe.name;
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

// --- NEW BAKING UI ---

function getUniqueTags() {
    const allTags = recipesData.flatMap(r => r.tags || []);
    // Normalize and dedup tags
    const uniqueTags = [...new Set(allTags.map(tag => tag.toLowerCase()))];
    return uniqueTags.sort();
}

function renderNewColorBaking(container) {
    const tags = getUniqueTags();
    const selectedTags = state.ai.selectedTags || [];

    const tagsHTML = tags.map(tag => {
        const isSelected = selectedTags.includes(tag);
        return `
            <button class="ai-tag-btn px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${isSelected ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50'}" data-tag="${tag}">
                ${tag}
            </button>
        `;
    }).join('');

    container.innerHTML = `
        <div class="flex flex-col h-full">
            <div class="text-center mb-6">
                <h3 class="text-2xl font-bold text-gray-800">The Color Kitchen</h3>
                <p class="text-gray-500">Mix ingredients and let AI bake your perfect recipe.</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
                <!-- Left: Inspiration Station -->
                <div class="flex flex-col h-full bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="text-2xl">🧪</span>
                        <h4 class="text-lg font-bold text-gray-700">Inspiration Ingredients</h4>
                    </div>
                    <p class="text-sm text-gray-500 mb-4">Select tags to ground the AI's creativity in existing styles.</p>
                    <div class="flex flex-wrap gap-2 overflow-y-auto max-h-[300px] lg:max-h-full sleek-scrollbar content-start">
                        ${tagsHTML}
                    </div>
                </div>

                <!-- Right: The Vision -->
                <div class="flex flex-col h-full">
                    <div class="bg-white rounded-2xl p-5 border-2 border-purple-100 h-full flex flex-col shadow-sm focus-within:border-purple-300 focus-within:shadow-md transition-all">
                        <div class="flex items-center gap-2 mb-4">
                            <span class="text-2xl">✨</span>
                            <h4 class="text-lg font-bold text-gray-700">Your Vision</h4>
                        </div>
                        <textarea id="aiBakePromptInput" class="w-full flex-grow p-0 border-none resize-none focus:ring-0 text-gray-700 placeholder-gray-400 text-lg leading-relaxed bg-transparent" placeholder="Describe the scene, mood, or movie look you want to achieve... (e.g., 'A rainy cyberpunk street at night, high contrast, neon teal and orange')"></textarea>
                        
                        <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <div class="text-xs text-gray-400">
                                <span id="tagCount">${selectedTags.length}</span> ingredients selected
                            </div>
                            <button id="startBakingBtn" class="btn bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2.5 px-6 shadow-lg shadow-purple-200 transform transition-transform active:scale-95">
                                Start Baking
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// --- SHARED COMPONENTS ---

function renderAILoading(container) {
    container.innerHTML = `
        <div class="ai-loading-container">
            <img src="/assets/Logo.png" alt="Loading..." class="ai-loading-logo">
            <p class="mt-4 text-gray-600 text-lg font-medium animate-pulse">Gemini is analyzing colors...</p>
            <p class="text-sm text-gray-400 mt-2">Designing curves, shifting phases, and balancing levels.</p>
        </div>
    `;
}

// Helper to escape backticks for safe insertion into template literals
const escapeBackticks = (str = '') => String(str).replace(/`/g, '\\`');

function renderAIComparison(container) {
    const original = state.ai.originalRecipe; // May be null in 'bake' mode
    const generated = state.ai.generatedRecipe;
    // Store an editable copy
    state.ai.editableRecipe = JSON.parse(JSON.stringify(generated));

    const createEditableGrid = (titleKey, settings, section) => {
        if (!settings) return '';
        const gridItems = Object.entries(settings).map(([key, value]) => {
            const originalValue = original?.settings?.[key] ?? original?.colorDepth?.[key] ?? original?.detailSettings?.[key];
            // Only highlight changes if there is an original recipe to compare against
            const isChanged = original && originalValue !== undefined && String(originalValue) !== String(value);
            
            return `
                <div class="flex flex-col p-3 rounded-lg ${isChanged ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-100'} transition-colors hover:bg-white hover:shadow-sm">
                    <label for="ai-${section}-${key.replace(/\s+/g, '-')}" class="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">${key}</label>
                    <div class="flex items-baseline gap-2">
                        <input type="text" id="ai-${section}-${key.replace(/\s+/g, '-')}" data-section="${section}" data-key="${key}" class="font-bold text-lg w-full ${isChanged ? 'text-blue-600' : 'text-gray-800'} bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none transition-colors" value="${value}">
                         ${isChanged ? `<span class="text-xs text-gray-400 line-through flex-shrink-0" title="Original: ${originalValue}">${originalValue}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        return `<div class="mb-6"><h4 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2" data-translate-key="${titleKey}"></h4><div class="grid grid-cols-2 md:grid-cols-3 gap-3">${gridItems}</div></div>`;
    };

    const headerTitleKey = original ? 'aiComparisonTitle' : 'aiNewTitle';
    const headerDescKey = original ? 'aiComparisonDescription' : 'quizSubmitInfo'; 
    // Reusing existing keys where possible, or falling back to generic text if needed

    container.innerHTML = `
        <div class="text-center mb-8">
            <div class="inline-block p-2 rounded-full bg-green-100 text-green-600 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800" data-translate-key="${headerTitleKey}">Recipe Generated</h3>
            <p class="mt-1 text-gray-600">Here is your custom color formula. Review and save it to your lab.</p>
        </div>

        <form id="aiRecipeForm" class="space-y-6">
            <!-- Header Card -->
            <div class="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="md:col-span-2">
                        <label for="recipeName" class="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2 block" data-translate-key="recipeNameLabel"></label>
                        <input type="text" id="recipeName" class="w-full text-2xl font-black text-gray-900 bg-transparent border-b-2 border-gray-100 focus:border-purple-500 focus:outline-none py-1 transition-colors" value="${escapeBackticks(generated.name)}">
                    </div>
                     <div>
                        <label class="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2 block" data-translate-key="whiteBalanceTitle"></label>
                        <input type="text" id="whiteBalance" class="w-full text-xl font-bold text-gray-800 bg-gray-50 rounded-lg border border-gray-200 px-3 py-2 focus:border-purple-500 focus:outline-none transition-colors" value="${generated.whiteBalance}">
                    </div>
                </div>
                <div class="mt-4">
                     <label for="recipeDescription" class="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2 block" data-translate-key="recipeDescriptionLabel"></label>
                    <textarea id="recipeDescription" rows="2" class="w-full text-gray-600 italic bg-transparent border-none resize-none focus:ring-0 p-0 leading-relaxed">${escapeBackticks(generated.description)}</textarea>
                </div>
            </div>

            <!-- Settings Grid -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                ${createEditableGrid('recipeSettingsTitle', generated.settings, 'settings')}
                ${generated.colorDepth ? createEditableGrid('colorDepthTitle', generated.colorDepth, 'colorDepth') : ''}
                ${generated.detailSettings ? createEditableGrid('detailTitle', generated.detailSettings, 'detailSettings') : ''}
            </div>
            
            <!-- Notes -->
            <div class="bg-yellow-50 rounded-2xl border border-yellow-100 p-6">
                <label class="text-xs uppercase tracking-wider text-yellow-700 font-bold mb-2 block" data-translate-key="notesLabel"></label>
                <textarea id="recipeNotes" class="w-full bg-transparent border-none focus:ring-0 text-gray-700 placeholder-yellow-300/50" rows="2" placeholder="${t('notesPlaceholder')}">${escapeBackticks(generated.notes || '')}</textarea>
            </div>
        </form>

        <div class="mt-8 pt-6 border-t border-gray-200 flex flex-wrap justify-center items-center gap-4">
            <button id="saveAIGeneratedRecipeBtn" class="btn btn-primary py-3 px-8 shadow-lg shadow-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                <span data-translate-key="saveAIGeneratedRecipe"></span>
            </button>
             <button id="downloadAIPngBtn" data-recipe-id="${original?.id || generated.id}" class="btn bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 shadow-lg shadow-gray-400/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                <span data-translate-key="downloadPNG"></span>
            </button>
            <button id="closeAILabBtn2" class="btn bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 px-6">
                Close
            </button>
        </div>
    `;
    applyTranslations();
}

export function renderAIError(container) {
    if (!container) return;
    container.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full p-8 text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2" data-translate-key="aiErrorTitle"></h3>
            <p class="text-gray-600 max-w-md mx-auto mb-8" data-translate-key="aiErrorText"></p>
            <button id="cancelAIBtn" class="btn bg-gray-200 text-gray-800 py-2 px-8 hover:bg-gray-300 transition-colors">
                <span data-translate-key="aiCancelBtn"></span>
            </button>
        </div>
    `;
    applyTranslations();
}

export function renderAILab() {
    const contentEl = document.getElementById('aiLabContent');
    if (!contentEl) return;

    if (state.ai.isGenerating) {
        renderAILoading(contentEl);
    } else if (state.ai.generatedRecipe) {
        renderAIComparison(contentEl);
    } else {
        if (state.ai.mode === 'bake') {
            renderNewColorBaking(contentEl);
        } else {
            renderAIPromptInput(contentEl);
        }
    }
    applyTranslations();
}
