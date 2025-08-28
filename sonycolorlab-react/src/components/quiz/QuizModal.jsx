import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { quizQuestions, calculateQuizResult, generateAIQuizResult } from '../../services/quiz';
import { callGeminiAPI } from '../../services/api';
import recipesData from '../../services/recipes';
import QuizQuestion from './QuizQuestion';
import QuizResult from './QuizResult';

const QuizModal = () => {
    const { setIsQuizOpen, API_KEY, API_URL } = useAppContext();
    const [answers, setAnswers] = useState({});
    const [step, setStep] = useState('answering'); // answering, loading, result, ai_result, error
    const [result, setResult] = useState(null);

    const handleAnswer = (questionIndex, answer) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };

    const isBwSelected = answers['3']?.includes('bw');
    const requiredQuestionsCount = isBwSelected ? 3 : 4;
    const answeredCount = Object.keys(answers).filter(k => k !== '5').length; // Don't count AI prompt
    const isComplete = answeredCount >= requiredQuestionsCount;

    const handleSubmit = async () => {
        setStep('loading');
        const aiPrompt = answers['5'];
        if (aiPrompt && typeof aiPrompt === 'string' && aiPrompt.trim()) {
            try {
                const aiResult = await generateAIQuizResult(aiPrompt, answers, 'en', (prompt) => callGeminiAPI(API_KEY, API_URL, prompt, null));
                setResult(aiResult);
                setStep('ai_result');
            } catch (error) {
                console.error("AI Generation failed:", error);
                setStep('error');
            }
        } else {
            const standardResult = calculateQuizResult(recipesData, answers);
            setResult(standardResult);
            setStep('result');
        }
    };

    const handleRetake = () => {
        setAnswers({});
        setResult(null);
        setStep('answering');
    };

    const renderContent = () => {
        switch (step) {
            case 'loading':
                return <div className="flex flex-col items-center justify-center h-full"><div className="loader-dark"></div><p className="mt-4 text-gray-600">Generating your recipe...</p></div>;
            case 'error':
                return <div className="quiz-result-view text-center max-w-lg mx-auto py-8"><div className="p-4 bg-red-50 border border-red-200 rounded-lg"><h3 className="text-xl font-bold text-red-800">Generation Failed</h3><p className="mt-2 text-red-700">Sorry, we couldn't create a recipe at this time.</p><button onClick={handleRetake} className="btn bg-gray-200 text-gray-800 py-3 px-8 text-base mt-4">Try Again</button></div></div>;
            case 'result':
                return <QuizResult result={result} onRetake={handleRetake} />;
            case 'ai_result':
                return <QuizResult result={result} onRetake={handleRetake} onAiResult={true} />;
            case 'answering':
            default:
                return (
                    <div className="quiz-one-page-layout">
                        {quizQuestions.map((q, index) => {
                            if (q.type === 'conditional_saturation' && isBwSelected) return null;
                            return <QuizQuestion key={index} question={q} questionIndex={index} onAnswer={(answer) => handleAnswer(index, answer)} selectedAnswer={answers[index]?.join(',')} />
                        })}
                        <div id="quizSubmitIsland" className="quiz-island active p-6 flex flex-col items-center justify-center text-center" style={{ gridArea: 'area-6' }}>
                            <p className="text-gray-600 mb-4 text-sm">Once you've answered the required questions, you can submit.</p>
                            <button id="submitQuizBtn" className="btn btn-pastel-submit w-full max-w-xs py-4 text-lg" disabled={!isComplete} onClick={handleSubmit}>
                                <span>Find My Recipe</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div id="quizModal" className="modal fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div id="quizPanel" className="modal-panel w-full max-w-7xl max-h-[90vh] flex flex-col rounded-2xl md:rounded-3xl !bg-gray-100/70 relative">
                <button onClick={() => setIsQuizOpen(false)} className="absolute top-4 right-5 text-3xl font-light text-gray-400 hover:text-black z-10">&times;</button>
                <div id="quizContent" className="p-4 md:p-6 flex-grow overflow-y-auto sleek-scrollbar">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default QuizModal;
