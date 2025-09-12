// File Path: thaikpham/sonycolorlab/sonycolorlab-new-features/src/services/api.js
/**
 * api.js
 * This module handles all interactions with external services.
 */

// --- Firebase SDK Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- Local Module Imports ---
import { state, __firebase_config, __app_id, isAIEnabled, API_KEY } from './state.js';

/**
 * Initializes the Firebase application and returns the app instance.
 * @returns {object|null} The Firebase app instance or null if initialization fails.
 */
export function initializeFirebase() {
    if (typeof __firebase_config === 'undefined' || __firebase_config.startsWith("%%") || __firebase_config === 'undefined' || __firebase_config === '{}') {
        console.warn("Firebase config not found. Features requiring Firebase will be disabled.");
        state.firebase.db = null;
        return null;
    }
    try {
        const firebaseConfig = JSON.parse(__firebase_config);
        if (!firebaseConfig.projectId) {
             console.error("Firebase config is missing projectId. Initialization aborted.");
             return null;
        }
        const app = initializeApp(firebaseConfig);
        console.log("Firebase app initialized.");
        return app;
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        state.firebase.db = null;
        return null;
    }
}

/**
 * Fetches the latest trending recipe IDs from Firestore.
 */
export async function fetchTrendingRecipeIds() {
    const fallbackIDs = ["scl-001", "scl-007", "scl-008", "scl-015", "scl-027"];
    if (!state.firebase.db) {
        return fallbackIDs;
    }
    try {
        const docRef = doc(state.firebase.db, `artifacts/${__app_id}/public/data/trending/latest`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().ids && docSnap.data().ids.length > 0) {
            return docSnap.data().ids;
        } else {
            return fallbackIDs;
        }
    } catch (error) {
        console.error("Error fetching trending data:", error);
        return fallbackIDs;
    }
}

/**
 * Makes a POST request to the Gemini API to generate content.
 * @param {string} prompt - The complete prompt to send to the API.
 * @param {AbortSignal} signal - An AbortSignal to allow for request cancellation.
 * @returns {Promise<object>} A promise that resolves to the parsed JSON response from the API.
 */
export async function callGeminiAPI(prompt, signal) {
    if (!isAIEnabled) {
        throw new Error("API key not configured.");
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

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
        throw new Error(`API Error: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.error("Invalid API response structure:", result);
        throw new Error("Invalid API response structure.");
    }
    
    return JSON.parse(result.candidates[0].content.parts[0].text);
}
