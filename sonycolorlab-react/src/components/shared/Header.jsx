import React from 'react';
import { useAppContext } from '../../context/AppContext';

// This is a temporary placeholder for the language switching logic.
// In the full implementation, this would interact with a language context.
const LanguageSwitcher = () => {
    // The original used a "glider" element for animation.
    // This can be replicated with Framer Motion or simple CSS transitions.
    // For now, we'll just render the buttons.
    const [lang, setLang] = React.useState('vi');

    const gliderStyle = {
        transform: lang === 'vi' ? 'translateX(0%)' : 'translateX(100%)',
    };

    return (
        <div className="p-1 bg-gray-200/70 rounded-full flex relative">
            <div
                id="lang-glider"
                className="absolute top-1 bottom-1 w-1/2 bg-white rounded-full shadow-sm transition-transform duration-300"
                style={gliderStyle}
            ></div>
            <button
                id="langVI"
                className="lang-btn-slider relative w-1/2 p-2 rounded-full font-semibold z-10 flex items-center justify-center gap-2"
                onClick={() => setLang('vi')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className="w-5 h-5 rounded-sm">
                    <path fill="#da251d" d="M0 0h900v600H0z"/>
                    <path fill="#ff0" d="m450 186-86 266 226-164h-280l226 164z"/>
                </svg>
                <span className="hidden sm:inline">VIE</span>
            </button>
            <button
                id="langEN"
                className="lang-btn-slider relative w-1/2 p-2 rounded-full font-semibold z-10 flex items-center justify-center gap-2"
                onClick={() => setLang('en')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-5 h-5 rounded-sm">
                    <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
                    <path d="M0,0 v30 h60 v-30 z" fill="#00247d"/>
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
                    <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#t)" stroke="#cf142b" stroke-width="4"/>
                    <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/>
                    <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" stroke-width="6"/>
                </svg>
                <span className="hidden sm:inline">ENG</span>
            </button>
        </div>
    );
};


const Header = () => {
    const { setCurrentView, setIsQuizOpen } = useAppContext();

    const handleHomeClick = () => {
        setCurrentView('home');
    };

    return (
        <header className="flex justify-between items-center w-full z-20 flex-shrink-0">
            <button onClick={handleHomeClick} className="flex items-center transition-transform duration-200 hover:scale-105 active:scale-100">
                <img src="/assets/logo_black.png" alt="Alpha AI Color Lab Logo" className="h-16 md:h-20 w-auto" />
            </button>
            <div className="flex items-center gap-2 md:gap-4">
                <nav id="mainNav" className="hidden md:flex items-center gap-4">
                    <button onClick={() => setIsQuizOpen(true)} className="btn bg-blue-500 text-white py-2 px-4">Take the Quiz</button>
                    <LanguageSwitcher />
                </nav>
            </div>
        </header>
    );
};

export default Header;
