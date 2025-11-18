document.addEventListener('DOMContentLoaded', () => {
    // --- SELECTORS ---
    const recipeCards = document.querySelectorAll('.recipe-card');
    const recipeModals = document.querySelectorAll('.recipe-modal');
    const closeRecipeBtns = document.querySelectorAll('.close-modal-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const videoLightbox = document.getElementById('video-lightbox');
    const videoLightboxClose = document.getElementById('video-lightbox-close');
    const videoPlayerContainer = document.getElementById('video-player-container');

    // --- RECIPE MODAL LOGIC ---
    const openModal = (modal) => {
        if (modal) {
            modal.classList.add('visible');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = (modal) => {
        if (modal) {
            modal.classList.remove('visible');
            document.body.style.overflow = '';
        }
    };

    recipeCards.forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-modal-target');
            const modal = document.querySelector(modalId);
            openModal(modal);
        });
    });

    closeRecipeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.recipe-modal');
            closeModal(modal);
        });
    });

    recipeModals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // --- IMAGE LIGHTBOX LOGIC ---
    function openImageLightbox(src) {
        if(!lightbox || !lightboxImage) return;
        lightboxImage.src = src;
        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.classList.add('visible'), 10);
        document.body.style.overflow = 'hidden';
    }

    function closeImageLightbox() {
        if(!lightbox) return;
        lightbox.classList.remove('visible');
        setTimeout(() => {
            lightbox.style.display = 'none';
            if (document.querySelector('.recipe-modal.visible') === null && document.querySelector('.video-lightbox-overlay.visible') === null) {
                document.body.style.overflow = '';
            }
        }, 300);
    }

    document.querySelectorAll('.demo-image').forEach(image => {
        image.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent modal from closing
            openImageLightbox(image.src);
        });
    });

    if(lightboxClose) lightboxClose.addEventListener('click', closeImageLightbox);
    if(lightbox) lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeImageLightbox();
    });

    // --- VIDEO LIGHTBOX LOGIC ---
    function openVideoLightbox(videoId) {
        if (!videoLightbox || !videoPlayerContainer) return;

        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1`);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');

        videoPlayerContainer.innerHTML = ''; // Clear previous video
        videoPlayerContainer.appendChild(iframe);

        videoLightbox.style.display = 'flex';
        setTimeout(() => videoLightbox.classList.add('visible'), 10);
        document.body.style.overflow = 'hidden';
    }

    function closeVideoLightbox() {
        if (!videoLightbox) return;
        videoLightbox.classList.remove('visible');
        setTimeout(() => {
            videoLightbox.style.display = 'none';
            if (videoPlayerContainer) {
                videoPlayerContainer.innerHTML = ''; // Important to stop video playback
            }
            if (document.querySelector('.recipe-modal.visible') === null) {
                document.body.style.overflow = '';
            }
        }, 300);
    }

    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const videoId = thumbnail.getAttribute('data-video-id');
            if (videoId) {
                openVideoLightbox(videoId);
            }
        });
    });

    if (videoLightboxClose) videoLightboxClose.addEventListener('click', closeVideoLightbox);
    if (videoLightbox) videoLightbox.addEventListener('click', (e) => {
        if (e.target === videoLightbox) {
            closeVideoLightbox();
        }
    });

    // --- UNIVERSAL ESC KEY HANDLER ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (videoLightbox && videoLightbox.classList.contains('visible')) {
                closeVideoLightbox();
                return;
            }
            if (lightbox && lightbox.classList.contains('visible')) {
                closeImageLightbox();
                return;
            }
            const visibleModal = document.querySelector('.recipe-modal.visible');
            if (visibleModal) {
                closeModal(visibleModal);
            }
        }
    });
});
