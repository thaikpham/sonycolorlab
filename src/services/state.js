// File Path: src/services/state.js
/**
 * state.js
 * This module centralizes the entire application's state and configuration constants.
 */

// --- CONFIGURATION CONSTANTS ---
// Load the API Key from the environment variables (for Localhost)
// If not found, default to an empty string (for specific preview environments)
export const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ""; 

// Use the global __app_id if available, otherwise fall back to default
export const __app_id = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';

// Force AI features to be enabled if a key is present or if we are in a special environment
export const isAIEnabled = !!API_KEY || true;

// --- CENTRAL APPLICATION STATE ---
export const state = {
  // General UI state
  ui: {
    currentView: 'home',
    selectedRecipeId: null,
    isMobileDetailActive: false,
    filter: 'all', // 'all', 'trending', 'favorites'
  },

  // Language state
  language: 'en',
  loadedTranslations: {},
  currentTranslations: {},

  // D3 Chart state
  chart: {
    nodes: null,
    simulation: null,
  },

  // Gemini AI Colorist feature state
  ai: {
    mode: 'tweak', // 'tweak' or 'bake'
    isGenerating: false,
    originalRecipe: null, 
    selectedTags: [],
    userPrompt: '',
    generatedRecipe: null,
    editableRecipe: null,
    abortController: null,
  },
  
  // Guide feature state
  guide: {
    menuSystem: 'new', // 'new' or 'old'
  },

  // Firebase state
  firebase: {
    db: null,
    app: null,
  },

  // Image Lightbox state
  lightbox: {
    images: [],
    currentIndex: 0,
  },

  // Animation state
  animation: {
    blobAnimationFrameId: null,
  },

  // Tracks dynamically loaded scripts
  scripts: {
    jspdf: false,
    html2canvas: false,
    chartjs: false,
  }
};
