// File Path: src/services/state.js
/**
 * state.js
 * This module centralizes the entire application's state and configuration constants.
 * By keeping state in one place, it's easier to manage, debug, and understand data flow.
 */
// --- CONFIGURATION CONSTANTS ---
// These values are replaced by vite during the build process from .env files
export const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
export const __app_id = import.meta.env.VITE_APP_ID || 'default-app-id';

// A computed flag to easily check if the AI features should be enabled.
export const isAIEnabled = API_KEY && API_KEY !== '';

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

  // Language state (keeping structure for compatibility)
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
    isGenerating: false,
    originalRecipe: null,
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
  }
};
