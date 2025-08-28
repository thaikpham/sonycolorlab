import React from 'react';
import recipesData from '../../services/recipes';

const RecipeDetails = ({ recipeId }) => {
    const recipe = recipesData.find(r => r.id === recipeId);

    if (!recipe) {
        return <div className="text-center p-8">Recipe not found.</div>;
    }

    const renderSettings = (settings) => (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="bg-slate-100 p-4 rounded-lg text-center">
                    <p className="text-sm text-slate-500">{key}</p>
                    <p className="text-xl font-bold text-slate-800">{value}</p>
                </div>
            ))}
        </div>
    );

    return (
        <div id="recipeContent">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">{recipe.name.en}</h2>
            <p className="mt-2 text-slate-500 italic">"{recipe.description.en}"</p>

            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">White Balance</h3>
                <div className="bg-slate-100 p-4 rounded-lg text-xl font-bold text-slate-800 inline-block">
                    {recipe.whiteBalance}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Main Settings</h3>
                {renderSettings(recipe.settings)}
            </div>

            {recipe.colorDepth && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Color Depth</h3>
                    {renderSettings(recipe.colorDepth)}
                </div>
            )}

            {recipe.detailSettings && (
                 <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Detail</h3>
                    {renderSettings(recipe.detailSettings)}
                </div>
            )}
        </div>
    );
};

export default RecipeDetails;
