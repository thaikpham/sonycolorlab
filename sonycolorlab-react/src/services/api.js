import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// IMPORTANT: Replace this with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

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
  const apiUrl = import.meta.env.VITE_GEMINI_API_URL;

  if (!apiUrl) {
    const errorMessage = "The API URL is not configured. Please set VITE_GEMINI_API_URL in your .env.local file.";
    console.error(errorMessage);
    throw new Error(errorMessage);
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
      const errorBody = await response.text();
      const errorMessage = `API call failed with status ${response.status}: ${errorBody}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    const errorMessage = `Failed to call Gemini API: ${error.message}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
