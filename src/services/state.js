// File Path: src/services/state.js
/**
 * state.js
 * This module centralizes the entire application's state and configuration constants.
 * By keeping state in one place, it's easier to manage, debug, and understand data flow.
 */

// --- CONFIGURATION CONSTANTS ---
// In this preview environment, the API Key is provided at runtime.
// We initialize it to an empty string to comply with environment security rules.
export const API_KEY = ""; 

// Use the global __app_id if available, otherwise fall back to default
export const __app_id = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';

// Force AI features to be enabled for this environment
export const isAIEnabled = true;

// --- CENTRAL APPLICATION STATE ---
// This single object holds all the dynamic data for the application.
// Each property represents a different "slice" of the application's state.
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

  // D3 Chart state (Legacy/Unused but keeping placeholder to avoid crash if referenced)
  chart: {
    nodes: null,
    simulation: null,
  },

  // Gemini AI Colorist feature state
  ai: {
    mode: 'tweak', // 'tweak' (existing) or 'bake' (new)
    isGenerating: false,
    originalRecipe: null, // Used for 'tweak' mode
    selectedTags: [], // Used for 'bake' mode
    userPrompt: '',
    generatedRecipe: null,
    editableRecipe: null, // Holds the state of the recipe being edited in the UI
    abortController: null,
  },
  
  // Quiz feature state (Legacy/Unused)
  quiz: {
    instance: null,
    answers: {},
    editableRecipe: null,
    aiContext: {
      initialPrompt: "",
      clarificationQuestion: "",
      userClarification: "",
      isAsking: false,
    }
  },

  // Guide feature state
  guide: {
    menuSystem: 'new', // 'new' or 'old'
  },

  // Firebase state (Stubbed)
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
