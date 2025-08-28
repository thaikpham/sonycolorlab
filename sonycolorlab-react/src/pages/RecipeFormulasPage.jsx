import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

import SearchBar from '../components/recipe-formulas/SearchBar';
import RecipeList from '../components/recipe-formulas/RecipeList';
import RecipeDetails from '../components/recipe-formulas/RecipeDetails';
import ColorMapChart from '../components/d3/ColorMapChart'; // <-- Use the new D3 component

const RecipeFormulasPage = () => {
    const { selectedRecipeId, setSelectedRecipeId, isMobileDetailActive, setIsMobileDetailActive } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    const handleNodeClick = (recipeId) => {
        setSelectedRecipeId(recipeId);
    };

    const WelcomeContent = () => (
        <div id="welcomeAndChartContainer" className="flex flex-col items-center justify-center h-full">
            <div id="welcomeText" className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-700">
                    Welcome to the Color Library
                </h2>
                <p className="text-neutral-500 mt-2 max-w-xl mx-auto">
                    Select a recipe from the list to see its details, or use the search to find the perfect look.
                </p>
            </div>
            <div className="flex-grow w-full mt-8">
                 <ColorMapChart onNodeClick={handleNodeClick} />
            </div>
        </div>
    );

    return (
        <div id="recipeFormulasView" className="w-full h-full flex flex-col md:flex-row absolute inset-0 view-transition">
            <aside
                id="recipeListPanel"
                className={`h-full w-full md:w-auto md:max-w-sm md:flex-shrink-0 glass-panel p-4 md:p-5 flex flex-col
                           ${isMobileDetailActive ? 'hidden md:flex' : 'flex'}`}
            >
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <RecipeList searchTerm={searchTerm} />
            </aside>

            <main id="recipeMainPanel" className="h-full flex-grow hidden md:flex flex-col min-h-0">
                <div className="glass-panel flex-grow overflow-y-auto p-6 lg:p-8 sleek-scrollbar">
                    {selectedRecipeId ? <RecipeDetails recipeId={selectedRecipeId} /> : <WelcomeContent />}
                </div>
            </main>

            {isMobileDetailActive && (
                 <div id="recipeDetailPanelMobile" className="w-full h-full absolute inset-0 bg-[#f8f9fa] overflow-y-auto block md:hidden sleek-scrollbar">
                    <div className="p-4">
                        <button
                            onClick={() => setIsMobileDetailActive(false)}
                            className="btn bg-white/80 border border-gray-200 text-gray-800 mb-4 py-2 px-4"
                        >
                            &larr; Back to List
                        </button>
                        <div id="recipeContentMobile">
                            {selectedRecipeId && <RecipeDetails recipeId={selectedRecipeId} />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeFormulasPage;
