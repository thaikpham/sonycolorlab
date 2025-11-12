// File Path: thaikpham/sonycolorlab/sonycolorlab-main/src/components/ai-lab/ai-lab.js
import { state } from '../../services/state.js';
import { openModal, closeModal } from '../../services/ui.js';
import { renderAILab, renderAIError } from './ai-lab-ui.js';
import { callGeminiAPI } from '../../services/api.js';
import recipesData from '../../services/recipes.js';

/**
 * Opens the AI Lab to tweak an existing recipe from the library.
 * @param {string} recipeId The ID of the recipe to tweak.
 */
export function openAILab(recipeId) {
    const originalRecipe = recipesData.find(r => r.id === recipeId);
    if (!originalRecipe) return;

    // Reset state for a new session
    Object.assign(state.ai, {
        originalRecipe: originalRecipe,
        generatedRecipe: null,
        editableRecipe: null,
        userPrompt: '',
        isGenerating: false,
        abortController: state.ai.abortController ? (state.ai.abortController.abort(), null) : null
    });

    openModal('aiLabModal');
    renderAILab(); // Renders the initial prompt view
}

/**
 * Opens the AI Lab with a pre-generated/saved recipe for viewing and editing.
 * @param {object} recipeObject The full recipe object to load into the editor.
 */
export function openAILabWithExistingRecipe(recipeObject) {
    if (!recipeObject) return;

     // Reset state, but load the provided recipe as the "generated" one
    Object.assign(state.ai, {
        originalRecipe: null, // No original recipe for comparison
        generatedRecipe: recipeObject,
        editableRecipe: JSON.parse(JSON.stringify(recipeObject)),
        userPrompt: '',
        isGenerating: false,
        abortController: null
    });
    
    openModal('aiLabModal');
    renderAILab(); // This will directly render the comparison/edit view
}


export function closeAILab() {
    if (state.ai.abortController) {
        state.ai.abortController.abort();
    }
    closeModal('aiLabModal');
}

export function handleAIGeneration() {
    const userInput = document.getElementById('aiPromptInput').value.trim();
    if (!userInput || !state.ai.originalRecipe) return;
    state.ai.userPrompt = userInput;
    confirmAndCallAI();
}

export async function confirmAndCallAI() {
    state.ai.isGenerating = true;
    state.ai.abortController = new AbortController();
    renderAILab(); // Show loading state

    const expertPrompt = `As a professional colorist specializing in Sony Picture Profiles, analyze the following JSON object which represents an existing color recipe. Your task is to generate a new, modified JSON object based on the user's request: "${state.ai.userPrompt}". The new JSON must be a complete, valid recipe object. You must only respond with the raw JSON object, without any surrounding text, explanations, or markdown formatting. The generated recipe name and description must be in the same language as the user's prompt (${state.language}). Original recipe: ${JSON.stringify(state.ai.originalRecipe)}`;

    try {
        const generatedRecipe = await callGeminiAPI(expertPrompt, state.ai.abortController.signal);
        state.ai.generatedRecipe = generatedRecipe;
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error("Gemini API call failed:", error);
            renderAIError(document.getElementById('aiLabContent'));
        }
    } finally {
        state.ai.isGenerating = false;
        state.ai.userPrompt = '';
        state.ai.abortController = null;
        // Re-render to show result or error, but only if an error didn't already render.
        const errorEl = document.querySelector('#aiLabContent .bg-red-50');
        if (!errorEl) {
            renderAILab();
        }
    }
}
