import React from 'react';
import { useAppContext } from '../../context/AppContext';

const ContributionNoteModal = () => {
    const { isContribNoteOpen, setIsContribNoteOpen } = useAppContext();
    if (!isContribNoteOpen) return null;

    return (
        <div className="modal visible fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="modal-panel w-full max-w-lg flex flex-col rounded-2xl">
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold">Contribute Demo Photos</h2>
                    <button onClick={() => setIsContribNoteOpen(false)} className="text-3xl font-light text-gray-400 hover:text-black">&times;</button>
                </div>
                <div className="p-6 md:p-8">
                    <p className="text-gray-600 leading-relaxed">
                        Your photo contributions are valuable! To ensure quality and consistency, please upload your photos to Google Photos and share the album link with us. Thank you for helping the community grow!
                    </p>
                </div>
                <div className="p-5 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex flex-col sm:flex-row justify-end gap-3">
                     <button onClick={() => setIsContribNoteOpen(false)} className="btn bg-gray-200 text-gray-800 py-2 px-6">Cancel</button>
                     <a href="https://photos.app.goo.gl/hRPGc9Ch6XmskEdLA" target="_blank" rel="noopener noreferrer" className="btn btn-primary py-2 px-6">
                        <span>Proceed to Google Photos</span>
                     </a>
                </div>
            </div>
        </div>
    );
};
export default ContributionNoteModal;
