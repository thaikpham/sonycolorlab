/**
 * api.js (React Version)
 * This module handles all interactions with external services, refactored for a React environment.
 */

// --- Firebase SDK Imports ---
// Using the npm package instead of CDN imports
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

/**
 * Initializes the Firebase application, signs in the user anonymously,
 * and returns the Firestore database instance via a state setter.
 * @param {string} firebaseConfigString - The JSON string for Firebase config.
 * @param {function} setFirebase - The state setter function for Firebase state.
 */
export async function initializeFirebase(firebaseConfigString, setFirebase) {
    if (typeof firebaseConfigString === 'undefined' || firebaseConfigString.startsWith("%%") || firebaseConfigString === 'undefined') {
        console.warn("Firebase config not found. Features requiring Firebase will be disabled.");
        setFirebase({ db: null }); // Update state to reflect no DB connection
        return;
    }
    try {
        const firebaseConfig = JSON.parse(firebaseConfigString);
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);

        await signInAnonymously(auth);
        console.log("Firebase initialized and user signed in anonymously.");

        setFirebase({ db }); // Set the DB instance in context state
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        setFirebase({ db: null }); // Ensure db is null on error
    }
}

/**
 * Fetches the latest trending recipe IDs from Firestore.
 * @param {object} db - The Firestore database instance.
 * @param {string} appId - The application ID for the Firestore path.
 * @returns {Promise<string[]>} A promise that resolves to an array of recipe IDs.
 */
export async function fetchTrendingRecipeIds(db, appId) {
    const fallbackIDs = ["scl-001", "scl-007", "scl-008", "scl-015", "scl-027"];
    if (!db || !appId) {
        return fallbackIDs;
    }
    try {
        const docRef = doc(db, `artifacts/${appId}/public/data/trending/latest`);
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
 * @param {string} apiKey - The Gemini API key.
 * @param {string} apiUrl - The full URL for the API endpoint.
 * @param {string} prompt - The complete prompt to send to the API.
 *param {AbortSignal} signal - An AbortSignal to allow for request cancellation.
 * @returns {Promise<object>} A promise that resolves to the parsed JSON response from the API.
 */
export async function callGeminiAPI(apiKey, apiUrl, prompt, signal) {
    if (!apiKey || apiKey.startsWith("YOUR_")) {
        throw new Error("API key not configured.");
    }

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
        }
    };

    const response = await fetch(apiUrl, {
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

    // The API returns a JSON string, so we need to parse it.
    return JSON.parse(result.candidates[0].content.parts[0].text);
}
