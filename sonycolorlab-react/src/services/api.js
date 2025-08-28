import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';

let app;
let db;

/**
 * Initializes the Firebase application and Firestore database.
 * This function should be called once when the application starts.
 */
export const initializeFirebase = () => {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
};

/**
 * Fetches the list of recipes from the Firestore database.
 * @returns {Promise<Array>} A promise that resolves to an array of recipe objects.
 */
export const getRecipes = async () => {
  if (!db) {
    console.error("Firestore is not initialized. Call initializeFirebase first.");
    return [];
  }
  try {
    const querySnapshot = await getDocs(collection(db, 'recipes'));
    const recipes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

/**
 * Fetches quiz questions from the Firestore database.
 * @returns {Promise<Array>} A promise that resolves to an array of quiz questions.
 */
export const getQuizQuestions = async () => {
    if (!db) {
        console.error("Firestore is not initialized. Call initializeFirebase first.");
        return [];
    }
    try {
        const querySnapshot = await getDocs(collection(db, 'quiz'));
        const questions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return questions;
    } catch (error) {
        console.error("Error fetching quiz questions:", error);
        return [];
    }
};

/**
 * Calls the Gemini API backend to get a response for a given prompt.
 * @param {string} prompt - The user's message to send to the AI.
 * @returns {Promise<string>} A promise that resolves to the AI's text response.
 */
export const callGeminiApi = async (prompt) => {
  // Use the environment variable for the API URL.
  // Fallback to a default for safety, though the .env.local should provide it.
  const apiUrl = import.meta.env.VITE_GEMINI_API_URL;

  if (!apiUrl) {
    throw new Error("VITE_GEMINI_API_URL is not defined in your environment variables.");
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      // Get more detailed error message from the backend response body
      const errorBody = await response.text();
      console.error(`API call failed with status ${response.status}:`, errorBody);
      throw new Error(`API call failed: ${errorBody}`);
    }

    // The backend now sends plain text, so we use response.text()
    return await response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Re-throw the error to be caught by the calling component
    throw error;
  }
};
