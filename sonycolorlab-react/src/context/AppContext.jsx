import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRecipes, getQuizQuestions } from '../services/api';

// Create the context
const AppContext = createContext();

// Create a custom hook for using the context
export const useAppContext = () => useContext(AppContext);

// Create the provider component
export const AppProvider = ({ children }) => {
    // --- Central Application State ---
    const [recipes, setRecipes] = useState([]);
    const [quizQuestions, setQuizQuestions] = useState([]);
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
        instance: null,
        currentQuestionIndex: 0,
        answers: [],
    });

    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [quizResult, setQuizResult] = useState(null);
    const [isAILabOpen, setIsAILabOpen] = useState(false);
    const [isContribNoteOpen, setIsContribNoteOpen] = useState(false);

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

    // Fetch initial data when the provider mounts
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [recipesData, quizData] = await Promise.all([
                    getRecipes(),
                    getQuizQuestions(),
                ]);
                setRecipes(recipesData);
                setQuizQuestions(quizData);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        fetchInitialData();
    }, []); // Empty dependency array ensures this runs only once

    const value = {
        // State values
        recipes,
        quizQuestions,
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
        setRecipes,
        setQuizQuestions,
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
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
