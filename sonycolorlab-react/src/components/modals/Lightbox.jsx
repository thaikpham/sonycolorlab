import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const Lightbox = () => {
    const { lightbox, setLightbox } = useAppContext();

    const closeLightbox = () => setLightbox({ images: [], currentIndex: 0 });

    const showNext = () => {
        setLightbox(prev => ({ ...prev, currentIndex: (prev.currentIndex + 1) % prev.images.length }));
    };

    const showPrev = () => {
        setLightbox(prev => ({ ...prev, currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length }));
    };

    // Effect for keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'Escape') closeLightbox();
        };

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup function
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [lightbox.images]); // Re-add listener if images change, though unlikely needed

    if (!lightbox.images || lightbox.images.length === 0) {
        return null;
    }

    return (
        <div id="lightbox" className="visible" onClick={closeLightbox}>
            <span id="lightboxClose" onClick={closeLightbox}>&times;</span>
            <div id="lightboxPrev" className="lightbox-arrow" onClick={(e) => { e.stopPropagation(); showPrev(); }}>&#x2039;</div>
            <img id="lightboxImage" src={lightbox.images[lightbox.currentIndex]} alt="Full size view" onClick={(e) => e.stopPropagation()} />
            <div id="lightboxNext" className="lightbox-arrow" onClick={(e) => { e.stopPropagation(); showNext(); }}>&#x203A;</div>
            <div id="lightboxCounter">{lightbox.currentIndex + 1} / {lightbox.images.length}</div>
        </div>
    );
};

export default Lightbox;
