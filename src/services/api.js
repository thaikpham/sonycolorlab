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
             state.firebase.db = null;
             return null;
        }
        const app = initializeApp(firebaseConfig);
        console.log("Firebase app initialized successfully.");
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
// ... existing code ...
