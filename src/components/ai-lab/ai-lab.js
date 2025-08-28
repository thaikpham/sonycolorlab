import { state } from '../../services/state.js';
import { openModal, closeModal } from '../../services/ui.js';
import { renderAILab, renderAIError } from './ai-lab-ui.js';
import { callGeminiAPI } from '../../services/api.js';
import { getCurrentLanguage } from '../../services/language.js';
import recipesData from '../../services/recipes.js';

export function openAILab(recipeId) {
    state.ai.originalRecipe = recipesData.find(r => r.id === recipeId);
    if (!state.ai.originalRecipe) return;

    Object.assign(state.ai, {
        generatedRecipe: null, userPrompt: '', isGenerating: false,
        abortController: state.ai.abortController ? (state.ai.abortController.abort(), null) : null
    });

    openModal('aiLabModal');
    renderAILab();
}

export function closeAILab() {
    if (state.ai.abortController) state.ai.abortController.abort();
    closeModal('aiLabModal');
}

export function handleAIGeneration() {
    const userInput = document.getElementById('aiPromptInput').value.trim();
    if (!userInput) return;
    state.ai.userPrompt = userInput;
    confirmAndCallAI();
}

export async function confirmAndCallAI() {
    state.ai.isGenerating = true;
    state.ai.abortController = new AbortController();
    renderAILab();

    const expertPrompt = `As a professional colorist specializing in Sony Picture Profiles, analyze the following JSON object which represents an existing color recipe. Your task is to generate a new, modified JSON object based on the user's request: "${state.ai.userPrompt}". The new JSON must be a complete, valid recipe object. You must only respond with the raw JSON object, without any surrounding text, explanations, or markdown formatting. The generated recipe name and description must be in the same language as the user's prompt (${getCurrentLanguage()}). Original recipe: ${JSON.stringify(state.ai.originalRecipe)}`;

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
        if (!document.querySelector('.bg-red-50')) {
            renderAILab();
        }
    }
}
