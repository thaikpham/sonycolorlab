import React from 'react';
import ColorMapChart from '../components/d3/ColorMapChart';
import { useAppContext } from '../context/AppContext';

const HomePage = () => {
    const { setCurrentView, setSelectedRecipeId } = useAppContext();

    const handleNodeClick = (recipeId) => {
        setSelectedRecipeId(recipeId);
        setCurrentView('recipe-formulas');
    };

    return (
        <div id="homeView" className="w-full h-full flex flex-col items-center justify-center absolute inset-0 p-4 md:p-8">
            <div className="text-center">
                <h1
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 mb-4"
                    style={{ textWrap: 'balance' }}
                    data-translate-key="landingTitle"
                >
                    Alpha AI Color Lab
                </h1>
                <p
                    className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mt-4"
                    style={{ textWrap: 'balance' }}
                    data-translate-key="landingSubtitle"
                >
                    Discover, create, and share unique color recipes for your Sony Alpha camera.
                </p>
            </div>
            <div className="w-full max-w-4xl flex-grow my-8">
                 <ColorMapChart onNodeClick={handleNodeClick} />
            </div>
        </div>
    );
};

export default HomePage;
