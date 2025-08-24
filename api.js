/**
 * api.js
 * This module handles all interactions with external services.
 * * ==============================================
 * NÂNG CẤP TÍNH NĂNG AI - CẬP NHẬT NGÀY 25/08/2025
 * ==============================================
 * - Cập nhật `callGeminiAPI` để chấp nhận dữ liệu hình ảnh (base64).
 * - Tự động chuyển đổi sang model Vision (`gemini-pro-vision`) khi có hình ảnh.
 */

// --- Firebase SDK Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- Local Module Imports ---
import { state, __firebase_config, __app_id, isAIEnabled, API_KEY } from './state.js';

/**
 * Initializes the Firebase application, signs in the user anonymously,
 * and sets the Firestore database instance in the global state.
 */
export async function initializeFirebase() {
    if (typeof __firebase_config === 'undefined' || __firebase_config.startsWith("%%")) {
        console.warn("Firebase config not found. Trending feature will be disabled.");
        return;
    }
    try {
        const firebaseConfig = JSON.parse(__firebase_config);
        const app = initializeApp(firebaseConfig);
        state.firebase.db = getFirestore(app);
        const auth = getAuth(app);
        await signInAnonymously(auth);
        console.log("Firebase initialized and user signed in anonymously.");
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        state.firebase.db = null;
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
 * Makes a POST request to the Gemini API to generate content, supporting both text and vision models.
 * @param {string} prompt - The complete prompt to send to the API.
 * @param {AbortSignal} signal - An AbortSignal to allow for request cancellation.
 * @param {string|null} [base64ImageData=null] - Optional base64 encoded image data.
 * @returns {Promise<object>} A promise that resolves to the parsed JSON response from the API.
 */
export async function callGeminiAPI(prompt, signal, base64ImageData = null) {
    if (!isAIEnabled) {
        throw new Error("API key not configured.");
    }

    const model = base64ImageData ? 'gemini-pro-vision' : 'gemini-2.5-flash-preview-05-20';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

    const parts = [{ text: prompt }];
    if (base64ImageData) {
        parts.push({
            inline_data: {
                mime_type: 'image/jpeg',
                data: base64ImageData
            }
        });
    }

    const payload = {
        contents: [{ parts: parts }],
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
