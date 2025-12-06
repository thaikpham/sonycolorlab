// File Path: src/services/api.js
/**
 * api.js
 * This module handles all interactions with external services.
 */

// --- Local Module Imports ---
import { API_KEY } from './state.js';

/**
 * Initializes the Firebase application and returns the app instance.
 * @returns {object|null} The Firebase app instance or null if initialization fails.
 */
export function initializeFirebase() {
    // Firebase removed as per user request
    return null;
}

/**
 * Fetches the latest trending recipe IDs.
 */
export async function fetchTrendingRecipeIds() {
    // Static fallback since Firebase is removed
    const fallbackIDs = ["scl-001", "scl-007", "scl-008", "scl-015", "scl-027"];
    return fallbackIDs;
}

/**
 * Makes a POST request to the Gemini API to generate content.
 * @param {string} prompt - The complete prompt to send to the API.
 * @param {AbortSignal} signal - An AbortSignal to allow for request cancellation.
 * @returns {Promise<object>} A promise that resolves to the parsed JSON response from the API.
 */
export async function callGeminiAPI(prompt, signal) {
    // Note: We do not check for !isAIEnabled or empty API_KEY here because 
    // the execution environment intercepts the request and injects the key automatically.

    // Using the supported preview model version
    const MODEL_NAME = 'gemini-2.5-flash-preview-09-2025';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
        }
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: signal
    });

    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `API Error: ${response.status} ${errorText}`;
        try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error && errorJson.error.message) {
                errorMessage = errorJson.error.message;
            }
        } catch (e) {
            // keep default error message
        }
        throw new Error(errorMessage);
    }

    const result = await response.json();

    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.error("Invalid API response structure:", result);
        throw new Error("Invalid API response structure.");
    }

    return JSON.parse(result.candidates[0].content.parts[0].text);
}
