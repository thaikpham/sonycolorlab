import React from 'react';
import { useAppContext } from '../../context/AppContext';

const AILabModal = () => {
    const { isAILabOpen, setIsAILabOpen } = useAppContext();
    if (!isAILabOpen) return null;

    return (
        <div className="modal visible fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="modal-panel w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl">
                <div className="flex justify-between items-center p-5 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Zm12.25-3.625a.75.75 0 0 0-1.06-1.06l-1.592 1.591a.75.75 0 1 0 1.06 1.061l1.592-1.591ZM21 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5h2.25a.75.75 0 0 1 .75.75ZM17.81 17.81a.75.75 0 0 0-1.06-1.06l-1.591 1.592a.75.75 0 0 0 1.06 1.06l1.591-1.592ZM12 18.75a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V19.5a.75.75 0 0 1 .75-.75ZM4.19 17.81a.75.75 0 1 0-1.06-1.06l-1.591 1.592a.75.75 0 0 0 1.06 1.06l1.591-1.592ZM3 12a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0-1.5H3.75A.75.75 0 0 1 3 12ZM4.19 6.19a.75.75 0 0 0 1.06-1.06L3.657 3.536a.75.75 0 0 0-1.06 1.06l1.592 1.592Z" /></svg>
                        </div>
                         <h2 className="text-xl font-bold">AI Colorist Lab</h2>
                    </div>
                    <button onClick={() => setIsAILabOpen(false)} className="text-3xl font-light text-gray-400 hover:text-black">&times;</button>
                </div>
                <div id="aiLabContent" className="p-6 md:p-8 flex-grow overflow-y-auto sleek-scrollbar">
                    {/* AI Lab content will be built out here */}
                    <p>AI Lab is coming soon...</p>
                </div>
            </div>
        </div>
    );
};
export default AILabModal;
