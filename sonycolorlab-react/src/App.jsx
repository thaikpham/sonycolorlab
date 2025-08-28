import React from 'react';
import { useAppContext } from './context/AppContext';

import HomePage from './pages/HomePage';
import RecipeFormulasPage from './pages/RecipeFormulasPage';
import Header from './components/shared/Header';
import UltimateButton from './components/shared/UltimateButton';
import QuizModal from './components/quiz/QuizModal';
import AILabModal from './components/modals/AILabModal';
import ContributionNoteModal from './components/modals/ContributionNoteModal';
import Lightbox from './components/modals/Lightbox';
import AnimatedBlobs from './components/home/AnimatedBlobs';

const ViewRouter = () => {
    const { currentView } = useAppContext();
    switch (currentView) {
        case 'home': return <HomePage />;
        case 'recipe-formulas': return <RecipeFormulasPage />;
        default: return <HomePage />;
    }
};

function App() {
    const { currentView, isQuizOpen, isAILabOpen, isContribNoteOpen, lightbox } = useAppContext();

    return (
        <div id="appContainer" className="min-h-screen w-screen p-3 sm:p-4 md:p-6 flex flex-col">
            {currentView === 'home' && <AnimatedBlobs />}
            <Header />
            <main id="mainContent" className="flex-grow min-h-0 relative mt-4 md:mt-6">
                <ViewRouter />
            </main>
            <UltimateButton />
            {isQuizOpen && <QuizModal />}
            {isAILabOpen && <AILabModal />}
            {isContribNoteOpen && <ContributionNoteModal />}
            {lightbox.images && lightbox.images.length > 0 && <Lightbox />}
        </div>
    );
}

export default App;
