import React from 'react';
import { useAppContext } from '../../context/AppContext';
import recipeImages from '../../services/recipe-images';

const QuizResult = ({ result, onRetake, onAiResult = false }) => {
    const { setIsQuizOpen, setCurrentView, setSelectedRecipeId } = useAppContext();

    const handleViewResult = () => {
        setSelectedRecipeId(result.id);
        setCurrentView('recipe-formulas');
        setIsQuizOpen(false);
    };

    const createSettingsHTML = (settings) => Object.entries(settings || {}).map(([key, value]) => (
        <div key={key} className="flex flex-col p-3 rounded-lg bg-white/70">
            <span className="text-sm text-gray-500 font-medium">{key}</span>
            <span className="font-semibold text-lg text-gray-800">{value}</span>
        </div>
    ));

    if (onAiResult) {
        return (
             <div className="quiz-result-view text-center max-w-3xl mx-auto py-8">
                <h3 className="text-3xl font-bold">Your AI-Generated Recipe</h3>
                <p className="mt-2 text-gray-600">Gemini has crafted this unique recipe based on your selections and prompt.</p>
                <div className="my-8 p-6 bg-white/80 rounded-2xl border text-left">
                    <h4 className="text-2xl font-bold text-center">{result.name.en}</h4>
                    <p className="text-gray-600 mt-1 text-center italic">"{result.description.en}"</p>
                    <h5 className="text-base font-bold mt-6 mb-2">White Balance</h5>
                    <div className="p-3 bg-white/70 rounded-lg font-semibold">{result.whiteBalance}</div>
                    <h5 className="text-base font-bold mt-4 mb-2">Main Settings</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">{createSettingsHTML(result.settings)}</div>
                    {result.colorDepth && <h5 className="text-base font-bold mt-4 mb-2">Color Depth</h5>}
                    {result.colorDepth && <div className="grid grid-cols-3 md:grid-cols-6 gap-2">{createSettingsHTML(result.colorDepth)}</div>}
                    {result.detailSettings && <h5 className="text-base font-bold mt-4 mb-2">Detail</h5>}
                    {result.detailSettings && <div className="grid grid-cols-2 md:grid-cols-3 gap-2">{createSettingsHTML(result.detailSettings)}</div>}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={onRetake} className="btn bg-gray-200 text-gray-800 py-3 px-8 text-base">Retake Quiz</button>
                </div>
            </div>
        )
    }

    return (
        <div className="quiz-result-view text-center max-w-2xl mx-auto py-8">
            <h3 className="text-3xl font-bold">Here's Your Recommendation!</h3>
            <p className="mt-2 text-gray-600">Based on your answers, we think you'll love this recipe.</p>
            <div className="my-8 p-6 bg-white/80 rounded-2xl border flex flex-col sm:flex-row items-center gap-6">
                <img src={recipeImages[result.id]?.[0]} className="w-full sm:w-48 h-32 rounded-lg object-cover shadow-lg" alt="Preview"/>
                <div className="text-left">
                    <h4 className="text-xl font-bold">{result.name.en}</h4>
                    <p className="text-gray-600 mt-1">{result.description.en}</p>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={handleViewResult} className="btn btn-primary py-3 px-8 text-base">View Full Recipe</button>
                <button onClick={onRetake} className="btn bg-gray-200 text-gray-800 py-3 px-8 text-base">Retake Quiz</button>
            </div>
        </div>
    );
};

export default QuizResult;
