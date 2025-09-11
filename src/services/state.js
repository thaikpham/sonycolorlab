/**
 * state.js
 * This module centralizes the entire application's state and configuration constants.
 * By keeping state in one place, it's easier to manage, debug, and understand data flow.
 */

// --- CONFIGURATION CONSTANTS ---
// These values are replaced by the build script (`build.js`).
export const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
export const __firebase_config = (() => {
  try {
    return JSON.stringify(import.meta.env.VITE_FIREBASE_CONFIG || '{}');
  } catch {
    return '';
  }
})();
export const __app_id = import.meta.env.VITE_APP_ID || 'default-app-id';

// A computed flag to easily check if the AI features should be enabled.
export const isAIEnabled = API_KEY && API_KEY !== '%%GEMINI_API_KEY%%';

// The full URL for the Gemini API endpoint.
export const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

// --- CENTRAL APPLICATION STATE ---
// This single object holds all the dynamic data for the application.
// Each property represents a different "slice" of the application's state.
export const state = {
    // General UI state
    currentView: 'home',
    selectedRecipeId: null,
    isMobileDetailActive: false, // For handling mobile-specific layout changes

    // D3 Chart state
    chart: {
        nodes: null,
        simulation: null,
    },

    // Gemini AI Colorist feature state
    ai: {
        isGenerating: false,
        originalRecipe: null,
        userPrompt: '',
        generatedRecipe: null,
        abortController: null, // To cancel in-flight API requests
    },

    // Gemini AI Caption feature state
    captionAI: {
        isGenerating: false,
        recipe: null,
        userPrompt: '',
        abortController: null,
        result: null,
    },

    // Quiz feature state
    quiz: {
        instance: null, // A property to hold the Quiz class instance
        currentQuestionIndex: 0,
        answers: [],
    },

    // Firebase state
    firebase: {
        db: null, // Holds the Firestore database instance
    },

    // Image Lightbox state
    lightbox: {
        images: [],
        currentIndex: 0,
    },

    // Animation state
    animation: {
        blobAnimationFrameId: null, // ID for the home screen blob animation
    },

    // Tracks dynamically loaded scripts to avoid re-loading
    scripts: {
        jspdf: false,
        html2canvas: false,
    }
};
