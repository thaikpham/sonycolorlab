// File Path: src/components/ai-lab/ai-lab.js
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
        mode: 'tweak',
        originalRecipe: originalRecipe,
        generatedRecipe: null,
        editableRecipe: null,
        userPrompt: '',
        selectedTags: [],
        isGenerating: false,
        abortController: state.ai.abortController ? (state.ai.abortController.abort(), null) : null
    });

    openModal('aiLabModal');
    renderAILab(); // Renders the initial prompt view
}

/**
 * Opens the AI Lab in "New Baking" mode (Creative Workspace).
 */
export function openNewColorBaking() {
    // Reset state for a new session
    Object.assign(state.ai, {
        mode: 'bake',
        originalRecipe: null, // No specific original recipe
        generatedRecipe: null,
        editableRecipe: null,
        userPrompt: '',
        selectedTags: [],
        isGenerating: false,
        abortController: state.ai.abortController ? (state.ai.abortController.abort(), null) : null
    });

    openModal('aiLabModal');
    renderAILab(); // Renders the New Color Baking view
}

/**
 * Opens the AI Lab with a pre-generated/saved recipe for viewing and editing.
 * @param {object} recipeObject The full recipe object to load into the editor.
 */
export function openAILabWithExistingRecipe(recipeObject) {
    if (!recipeObject) return;

     // Reset state, but load the provided recipe as the "generated" one
    Object.assign(state.ai, {
        mode: 'tweak', // Treat as tweak so we don't show the baking UI
        originalRecipe: null, 
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

// --- Interaction Handlers ---

export function toggleAITag(tag) {
    const { selectedTags } = state.ai;
    if (selectedTags.includes(tag)) {
        state.ai.selectedTags = selectedTags.filter(t => t !== tag);
    } else {
        if (selectedTags.length >= 5) {
            // Optional: Limit selection to 5 tags to prevent prompt bloat
            // For now, simple logic: remove first, add new
            state.ai.selectedTags.shift(); 
        }
        state.ai.selectedTags.push(tag);
    }
    renderAILab(); // Re-render to show active state
}

export function handleAIGeneration() {
    let userInput = '';
    
    if (state.ai.mode === 'bake') {
        userInput = document.getElementById('aiBakePromptInput').value.trim();
        // Validation: require at least one tag or some text
        if (!userInput && state.ai.selectedTags.length === 0) {
            // Shake animation or visual feedback could go here
            document.getElementById('aiBakePromptInput')?.focus();
            return;
        }
    } else {
        userInput = document.getElementById('aiPromptInput').value.trim();
        if (!userInput || !state.ai.originalRecipe) return;
    }

    state.ai.userPrompt = userInput;
    confirmAndCallAI();
}

export async function confirmAndCallAI() {
    state.ai.isGenerating = true;
    state.ai.abortController = new AbortController();
    renderAILab(); // Show loading state

    let expertPrompt = '';

    if (state.ai.mode === 'bake') {
        const tagsContext = state.ai.selectedTags.length > 0 
            ? `The user is inspired by these style keywords: ${state.ai.selectedTags.join(', ')}.` 
            : '';
        const userContext = state.ai.userPrompt 
            ? `User's specific vision: "${state.ai.userPrompt}".` 
            : 'Create a unique, balanced recipe based on the keywords.';

        expertPrompt = `As a professional colorist specializing in Sony Picture Profiles (Sony Alpha cameras), create a brand new, complete color recipe JSON object. 
        ${tagsContext}
        ${userContext}
        
        The JSON must be a valid recipe object with the following structure:
        {
            "id": "generated-${Date.now()}",
            "name": "Creative Name based on style",
            "description": "Short description of the look and best use cases.",
            "type": "color",
            "whiteBalance": "Specific Kelvin and Tint (e.g., 4500K A2 G1)",
            "settings": { 
                "Black level": "value", "Gamma": "value", "Black Gamma": "value", "Knee": "value", "Color Mode": "value", "Saturation": "value", "Color Phase": "value" 
            },
            "colorDepth": { "R": "val", "G": "val", "B": "val", "C": "val", "M": "val", "Y": "val" },
            "detailSettings": { "level": "val", "mode": "Manual", "limit": "3", "crispening": "7", "hiLightDetail": "4" }
        }
        
        IMPORTANT: Respond ONLY with the raw JSON object. No markdown formatting, no code blocks, no explanatory text. Ensure valid JSON.`;

    } else {
        // Tweak Mode
        expertPrompt = `As a professional colorist specializing in Sony Picture Profiles, analyze the following JSON object which represents an existing color recipe. Your task is to generate a new, modified JSON object based on the user's request: "${state.ai.userPrompt}". The new JSON must be a complete, valid recipe object. You must only respond with the raw JSON object, without any surrounding text, explanations, or markdown formatting. The generated recipe name and description must be in the same language as the user's prompt (${state.language}). Original recipe: ${JSON.stringify(state.ai.originalRecipe)}`;
    }

    try {
        const generatedRecipe = await callGeminiAPI(expertPrompt, state.ai.abortController.signal);
        
        // Sanity check for ID, ensure unique if generated one clashes (unlikely with Date.now but good practice)
        if (!generatedRecipe.id) generatedRecipe.id = `gen-${Date.now()}`;
        
        state.ai.generatedRecipe = generatedRecipe;
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error("Gemini API call failed:", error);
            renderAIError(document.getElementById('aiLabContent'), error.message);
        }
    } finally {
        state.ai.isGenerating = false;
        state.ai.userPrompt = '';
        state.ai.abortController = null;
        // Re-render to show result or error, but only if an error didn't already render.
        const errorEl = document.querySelector('#aiLabContent .bg-red-50'); // Check for error element (old style)
        const errorElNew = document.querySelector('.lucide-alert-triangle'); // Check for error icon (new style)
        if (!errorEl && !errorElNew) {
            renderAILab();
        }
    }
}
