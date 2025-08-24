/**
 * api.js
 * This module handles all interactions with external services:
 * 1. Google Firebase/Firestore for fetching trending data.
 * 2. Google Gemini API for generative AI features.
 */

// --- Firebase SDK Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- Local Module Imports ---
import { state, __firebase_config, __app_id, isAIEnabled, API_URL } from './state.js';

/**
 * Initializes the Firebase application, signs in the user anonymously,
 * and sets the Firestore database instance in the global state.
 * This is called once when the application starts.
 */
export async function initializeFirebase() {
    // Check if the Firebase config has been injected by the build script.
    if (typeof __firebase_config === 'undefined' || __firebase_config.startsWith("%%")) {
        console.warn("Firebase config not found or not replaced by build script. Trending feature will be disabled.");
        return;
    }
    try {
        const firebaseConfig = JSON.parse(__firebase_config);
        const app = initializeApp(firebaseConfig);
        state.firebase.db = getFirestore(app); // Store the db instance in the central state
        const auth = getAuth(app);
        await signInAnonymously(auth);
        console.log("Firebase initialized and user signed in anonymously.");
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        state.firebase.db = null; // Ensure db is null on failure
    }
}

/**
 * Fetches the latest trending recipe IDs from Firestore.
 * If Firestore is unavailable or the data is missing, it returns a hardcoded fallback list.
 * @returns {Promise<string[]>} A promise that resolves to an array of recipe IDs.
 */
export async function fetchTrendingRecipeIds() {
    // A fallback list to ensure the feature always works, even if Firebase fails.
    const fallbackIDs = ["scl-001", "scl-007", "scl-008", "scl-015", "scl-027"];

    if (!state.firebase.db) {
        console.warn("Firebase not available, using dummy trending data.");
        return fallbackIDs;
    }

    try {
        const docRef = doc(state.firebase.db, `artifacts/${__app_id}/public/data/trending/latest`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().ids && docSnap.data().ids.length > 0) {
            console.log("Fetched trending data from Firestore:", docSnap.data().ids);
            return docSnap.data().ids;
        } else {
            console.warn("Trending data document not found or is empty in Firestore. Using fallback data.");
            return fallbackIDs;
        }
    } catch (error) {
        console.error("Error fetching trending data from Firestore, using fallback data:", error);
        return fallbackIDs;
    }
}

/**
 * Makes a POST request to the Gemini API to generate content.
 * @param {string} prompt - The complete prompt to send to the API.
 * @param {AbortSignal} signal - An AbortSignal to allow for request cancellation.
 * @returns {Promise<object>} A promise that resolves to the parsed JSON response from the API.
 * @throws {Error} Throws an error if the API key is not configured, the network request fails, or the response is invalid.
 */
export async function callGeminiAPI(prompt, signal) {
    if (!isAIEnabled) {
        console.error("Gemini API key not configured.");
        throw new Error("API key not configured.");
    }

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json", // Request a JSON response
        }
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: signal // Pass the signal to the fetch request
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API Error:", response.status, errorText);
        throw new Error(`API Error: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    // Validate the structure of the API response before parsing
    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.error("Invalid API response structure:", result);
        throw new Error("Invalid API response structure.");
    }
    
    // The model's response is a stringified JSON, so we need to parse it.
    return JSON.parse(result.candidates[0].content.parts[0].text);
}
