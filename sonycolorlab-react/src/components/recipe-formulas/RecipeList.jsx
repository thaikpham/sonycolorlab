import React from 'react';
import recipesData from '../../services/recipes';
import { useAppContext } from '../../context/AppContext';

const RecipeList = ({ searchTerm }) => {
    const { selectedRecipeId, setSelectedRecipeId, setIsMobileDetailActive } = useAppContext();

    const filteredRecipes = recipesData.filter(recipe => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const name = recipe.name.en.toLowerCase();
        const tags = recipe.tags.join(' ').toLowerCase();
        return name.includes(lowerSearchTerm) || tags.includes(lowerSearchTerm);
    });

    const handleSelectRecipe = (id) => {
        setSelectedRecipeId(id);
        if (window.innerWidth < 768) { // md breakpoint
            setIsMobileDetailActive(true);
        }
    };

    return (
        <div id="recipeListContainer" className="space-y-2 flex-grow overflow-y-auto sleek-scrollbar -mr-2 pr-2">
            {filteredRecipes.map(recipe => (
                <button
                    key={recipe.id}
                    onClick={() => handleSelectRecipe(recipe.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${selectedRecipeId === recipe.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200/60'}`}
                >
                    <p className="font-bold">{recipe.name.en}</p>
                    <p className={`text-sm ${selectedRecipeId === recipe.id ? 'text-blue-200' : 'text-gray-500'}`}>
                        {recipe.tags[0]}, {recipe.tags[1]}
                    </p>
                </button>
            ))}
        </div>
    );
};

export default RecipeList;
