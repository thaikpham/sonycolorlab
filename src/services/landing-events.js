// File Path: src/services/landing-events.js
import { handleRouting } from '../router.js';
import { renderView } from './view-manager.js';

export function initLandingEventListeners() {
    const enterLabBtn = document.getElementById('enterLabBtn');
    if (enterLabBtn) {
        enterLabBtn.addEventListener('click', () => {
            const mainContentEl = document.getElementById('mainContent');
            if (mainContentEl) {
                mainContentEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const videoLightbox = document.getElementById('video-lightbox');
    const videoPlayerContainer = document.getElementById('video-player-container');
    const videoLightboxClose = document.getElementById('video-lightbox-close');

    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const videoId = thumbnail.getAttribute('data-video-id');
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            videoPlayerContainer.innerHTML = '';
            videoPlayerContainer.appendChild(iframe);
            videoLightbox.classList.add('visible');
        });
    });

    const closeVideoLightbox = () => {
        videoLightbox.classList.remove('visible');
        videoPlayerContainer.innerHTML = '';
    };

    if (videoLightboxClose) {
        videoLightboxClose.addEventListener('click', closeVideoLightbox);
    }

    if (videoLightbox) {
        videoLightbox.addEventListener('click', (e) => {
            if (e.target === videoLightbox) {
                closeVideoLightbox();
            }
        });
    }

    const recipeCards = document.querySelectorAll('.recipe-card');
    recipeCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const path = card.getAttribute('href');
            history.pushState({}, '', path);
            handleRouting();
        });
    });
}
