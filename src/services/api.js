// File Path: src/services/api.js
/**
 * api.js
 * This module handles all interactions with external services.
 */

// --- Local Module Imports ---
// API Key validation is handled by the environment/injection, so we don't import checks here.

/**
 * Initializes the Firebase application and returns the app instance.
 * @returns {object|null} The Firebase app instance or null if initialization fails.
 */
export function initializeFirebase() {
    // Firebase removed as per user request/environment constraints
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
 * Includes exponential backoff for reliability.
 * @param {string} prompt - The complete prompt to send to the API.
 * @param {AbortSignal} signal - An AbortSignal to allow for request cancellation.
 * @returns {Promise<object>} A promise that resolves to the parsed JSON response from the API.
 */
export async function callGeminiAPI(prompt, signal) {
    // The API key is injected by the execution environment at runtime.
    const apiKey = "";
    
    // Use the specific supported model for this environment
    const MODEL = "gemini-2.5-flash-preview-09-2025";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
        }
    };

    const maxRetries = 5;
    const delays = [1000, 2000, 4000, 8000, 16000];

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: signal
            });

            if (!response.ok) {
                // If it's a 5xx error or 429, we might want to retry. 
                // For this implementation, we'll throw to trigger the retry logic unless it's a 4xx client error (except 429).
                if (response.status !== 429 && response.status >= 400 && response.status < 500) {
                     const errorText = await response.text();
                     throw new Error(`API Error: ${response.status} ${errorText}`); // Don't retry client errors
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
                console.error("Invalid API response structure:", result);
                throw new Error("Invalid API response structure.");
            }
            
            return JSON.parse(result.candidates[0].content.parts[0].text);

        } catch (error) {
            // If we have retries left and it's not an abort error, wait and retry
            if (attempt < maxRetries && error.name !== 'AbortError') {
                await new Promise(resolve => setTimeout(resolve, delays[attempt]));
                continue;
            }
            // If no retries left or it's a fatal error, rethrow
            throw error;
        }
    }
}
