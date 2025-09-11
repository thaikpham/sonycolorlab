/**
 * state.js
 * This module centralizes the entire application's state and configuration constants.
 * By keeping state in one place, it's easier to manage, debug, and understand data flow.
 */
// --- CONFIGURATION CONSTANTS ---
// These values are replaced by the build script (`build.js`).
export let API_KEY = '';
export let __firebase_config = '';
export let __app_id = '';

export async function initConfig() {
  try {
    const response = await fetch('/api/config'); // Cloudflare Pages function endpoint
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const config = await response.json();

    // Update the configuration variables
    API_KEY = config.VITE_GEMINI_API_KEY || API_KEY;
    __firebase_config = config.VITE_FIREBASE_CONFIG ? JSON.stringify(config.VITE_FIREBASE_CONFIG) : __firebase_config;
    __app_id = config.VITE_APP_ID || __app_id;

    // Update dependent variables
    API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;
    isAIEnabled = API_KEY && API_KEY !== '';

  } catch (error) {
    console.error("Failed to fetch remote config, using local .env variables:", error);
    // The variables are already initialized with .env values, so we just log the error.
  }
}

// A computed flag to easily check if the AI features should be enabled.
export let isAIEnabled = import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY !== '';

// The full URL for the Gemini API endpoint.
export let API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

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
