import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const UltimateButton = () => {
    const { currentView, setIsQuizOpen, setIsAILabOpen, setIsContribNoteOpen } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [currentView]);

    if (currentView !== 'recipeFormulas') {
        return null;
    }

    const toggleMenu = () => setIsOpen(!isOpen);

    const icons = {
        contributePhotosBtn: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-image-plus"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" x2="22" y1="5" y2="5"/><line x1="19" x2="19" y1="2" y2="8"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
        findMyColorBtn: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-flask-conical"><path d="M10 2v7.31"/><path d="M14 9.31V2"/><path d="M12 12.31v4"/><path d="M10 16.31h4"/><path d="M14 16.31v4.39"/><path d="M10 20.7V16.31"/><path d="M17.69 7.51 14 9.31"/><path d="m6.31 7.51 4 1.8"/><path d="m6.31 16.31 4-1.8"/><path d="m17.69 16.31-4-1.8"/><path d="M12 22a7 7 0 0 0 7-7h-4a3 3 0 0 1-3 3v0a3 3 0 0 1-3-3H5a7 7 0 0 0 7 7Z"/></svg>`,
    };

    const menuActions = [
        { id: 'ultimateContributeBtn', key: 'Contribute Photos', colorClass: 'btn-pastel-blue', icon: icons.contributePhotosBtn, action: () => setIsContribNoteOpen(true) },
        { id: 'ultimateQuizBtn', key: 'Find My Color', colorClass: 'btn-pastel-red', icon: icons.findMyColorBtn, action: () => setIsQuizOpen(true) },
    ];

    const radius = 90;
    const startAngle = 180;
    const endAngle = 270;
    const angleStep = (endAngle - startAngle) / (menuActions.length > 0 ? menuActions.length - 1 : 1);

    return (
        <div id="ultimateButtonContainer" className="fixed bottom-8 right-8 z-40">
            <div id="ultimateButtonWrapper">
                <div id="ultimateActionsMenu" className={`${isOpen ? 'menu-open' : ''}`}>
                    {menuActions.map((action, index) => {
                        const angle = startAngle + (angleStep * index);
                        const angleRad = angle * (Math.PI / 180);
                        const x = radius * Math.cos(angleRad);
                        const y = radius * Math.sin(angleRad);

                        const style = isOpen ? { transform: `translate(${x}px, ${y}px) scale(1)`, transitionDelay: `${index * 40}ms` } : { transform: 'translate(0, 0) scale(0.5)'};

                        return (
                            <button key={action.id} id={action.id} className={`ultimate-action-btn ${action.colorClass} ${isOpen ? 'visible' : ''}`} style={style} onClick={action.action}>
                                <div dangerouslySetInnerHTML={{ __html: action.icon }} />
                                <span className="ultimate-tooltip">{action.key}</span>
                            </button>
                        );
                    })}
                </div>
                <button id="ultimateCtaBtn" className="liquid-glass-button" style={{ width: 80, height: 80, padding: 16, borderRadius: 32 }} onClick={toggleMenu}>
                    <img id="ultimateCtaIcon" src="/assets/Logo.png" alt="Actions" style={{ width: '100%', height: 'auto', transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', transform: isOpen ? 'rotate(135deg)' : 'rotate(0deg)' }} />
                </button>
            </div>
        </div>
    );
};
export default UltimateButton;
