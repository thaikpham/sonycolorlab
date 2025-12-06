// File Path: src/services/api.js
/**
 * api.js
 * This module handles all interactions with external services.
 */

// --- Local Module Imports ---
import { API_KEY } from './state.js';

/**
 * Initializes the Firebase application.
 */
export function initializeFirebase() {
    return null;
}

/**
 * Fetches the latest trending recipe IDs.
 */
export async function fetchTrendingRecipeIds() {
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
    // 1. Validation: Ensure we have an API Key before calling Google
    if (!API_KEY) {
        console.warn("Gemini API Key is missing. Check your .env file for VITE_GEMINI_API_KEY.");
        // If we are strictly local, this will fail. 
        // If in an intercepted environment, the interceptor might fix it, but usually it requires a key placeholder.
        // We will proceed but warn.
    }

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
        
        // Handle specific "Unregistered caller" case clearly
        if (response.status === 400 && errorMessage.includes("unregistered caller")) {
            throw new Error("API Key is missing or invalid. Please check your .env file.");
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
