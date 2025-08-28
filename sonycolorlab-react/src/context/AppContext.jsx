import React, { createContext, useContext, useState } from 'react';

// --- Configuration Constants ---
// In a real-world scenario, these would be loaded from environment variables
export const API_KEY = "YOUR_API_KEY_HERE"; // Placeholder
export const isAIEnabled = API_KEY && API_KEY !== 'YOUR_API_KEY_HERE';
export const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-preview-0514:generateContent?key=${API_KEY}`;

// Create the context
const AppContext = createContext();

// Create a custom hook for using the context
export const useAppContext = () => useContext(AppContext);

// Create the provider component
export const AppProvider = ({ children }) => {
    // --- Central Application State ---
    const [currentView, setCurrentView] = useState('home');
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);
    const [isMobileDetailActive, setIsMobileDetailActive] = useState(false);

    const [chart, setChart] = useState({
        nodes: null,
        simulation: null,
    });

    const [ai, setAi] = useState({
        isGenerating: false,
        originalRecipe: null,
        userPrompt: '',
        generatedRecipe: null,
        abortController: null,
    });

    const [captionAI, setCaptionAI] = useState({
        isGenerating: false,
        recipe: null,
        userPrompt: '',
        abortController: null,
        result: null,
    });

    const [quiz, setQuiz] = useState({
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [quizResult, setQuizResult] = useState(null);
    const [isAILabOpen, setIsAILabOpen] = useState(false);
    const [isContribNoteOpen, setIsContribNoteOpen] = useState(false);
        instance: null,
        currentQuestionIndex: 0,
        answers: [],
    });

    const [firebase, setFirebase] = useState({ db: null });

    const [lightbox, setLightbox] = useState({
        images: [],
        currentIndex: 0,
    });

    const [animation, setAnimation] = useState({
        blobAnimationFrameId: null,
    });

    const [scripts, setScripts] = useState({
        jspdf: false,
        html2canvas: false,
    });

    const value = {
        // State values
        currentView,
        selectedRecipeId,
        isMobileDetailActive,
        chart,
        ai,
        captionAI,
        quiz,
        isQuizOpen,
        quizResult,
        isAILabOpen,
        isContribNoteOpen,
        firebase,
        lightbox,
        animation,
        scripts,

        // State setters
        setCurrentView,
        setSelectedRecipeId,
        setIsMobileDetailActive,
        setChart,
        setAi,
        setCaptionAI,
        setQuiz,
        setIsQuizOpen,
        setQuizResult,
        setIsAILabOpen,
        setIsContribNoteOpen,
        setFirebase,
        setLightbox,
        setAnimation,
        setScripts,

        // Constants
        isAIEnabled,
        API_URL,
        API_KEY
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
