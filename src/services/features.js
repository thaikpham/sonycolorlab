// File Path: src/services/features.js
/**
 * features.js
 * This module encapsulates logic for complex, self-contained features
 * like the AI labs, PDF generation, and image lightbox.
 */

// --- Local Module Imports ---
import { state } from './state.js';
import { t } from './language.js';
import recipesData from './recipes.js';
import recipeImages from './recipe-images.js';
import { showToast } from './ui.js';

// --- CDN URLs for external libraries ---
const HTML2CANVAS_URL = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
const CHARTJS_URL = "https://cdn.jsdelivr.net/npm/chart.js";

// --- UTILITY ---

/**
 * Dynamically loads an external script and returns a promise that resolves when it's loaded.
 * It uses the central state to prevent re-loading the same script.
 * @param {string} url - The URL of the script to load.
 * @param {string} stateKey - The key in `state.scripts` to track the loading status (e.g., 'jspdf').
 * @returns {Promise<void>}
 */
function loadScript(url, stateKey) {
    return new Promise((resolve, reject) => {
        if (state.scripts[stateKey]) {
            resolve(); // Already loaded
            return;
        }
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            state.scripts[stateKey] = true;
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// --- D3 COLOR MAP CHART ---
// Removed

// Export a dummy function for backward compatibility if needed,
// though all usages should have been removed.
// However, the error log says `recipe-service.js` or someone is trying to import `updateChartSelection`.
export function updateChartSelection() {
    // No-op
}

export async function renderColorMapChart(containerSelector, data) {
    // No-op
}

// --- GUIDE CHART & LOGIC ---

const menuPaths = {
    new: [
        { icon: '🔘', text: 'Mode Dial: P, A, S, M' },
        { icon: '🟨', text: 'Menu → Exposure/Color' },
        { icon: '🎨', text: 'Color/Tone → Picture Profile' },
        { icon: '➡️', text: 'Select PP1 → Right Arrow' }
    ],
    old: [
        { icon: '🔘', text: 'Mode Dial: P, A, S, M' },
        { icon: '🟥', text: 'Menu → Camera Settings 1' },
        { icon: '📄', text: 'Page 11/12 (Color/WB)' },
        { icon: '➡️', text: 'Picture Profile → Right Arrow' }
    ]
};

const guideVideos = {
    new: 'nAWs5Mus90s', // New Menu Video
    old: 'SI0bdb_oP9A'  // Old Menu Video
};

export function renderGuideVideo(system) {
    const container = document.getElementById('guide-video-container');
    const videoId = guideVideos[system];
    
    if(!container || !videoId) return;

    container.innerHTML = `
        <div class="relative aspect-video w-full rounded-xl overflow-hidden cursor-pointer group video-thumbnail-wrapper" data-video-id="${videoId}">
            <img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" alt="Guide Video" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
            </div>
            <div class="absolute bottom-3 left-4 text-white font-medium text-sm drop-shadow-md bg-black/60 px-3 py-1 rounded-md backdrop-blur-sm">
                Watch Setup Guide
            </div>
        </div>
    `;
}

export function renderMenuPath() {
    const container = document.getElementById('path-container');
    if (!container) return;
    
    const pathData = menuPaths[state.guide.menuSystem];
    container.innerHTML = ''; // Clear

    pathData.forEach((step, index) => {
        const stepEl = document.createElement('div');
        stepEl.className = 'flex items-center gap-3 bg-white/10 p-3 rounded-lg border border-white/10 backdrop-blur-sm w-full md:w-auto transition-all animate-fade-in';
        stepEl.style.animationDelay = `${index * 100}ms`;
        
        stepEl.innerHTML = `
            <span class="text-2xl">${step.icon}</span>
            <span class="font-bold">${step.text}</span>
        `;
        
        container.appendChild(stepEl);

        // Add arrow if not last
        if (index < pathData.length - 1) {
            const arrow = document.createElement('div');
            arrow.className = 'hidden md:block text-slate-500 text-xl font-bold';
            arrow.innerText = '→';
            container.appendChild(arrow);
        }
    });
}

export function updateMenuSystemUI(system) {
    const btnNew = document.getElementById('btn-new-menu');
    const btnOld = document.getElementById('btn-old-menu');
    const textModel = document.getElementById('camera-model-text');

    if (btnNew && btnOld && textModel) {
        if (system === 'new') {
            btnNew.classList.add('guide-active-tab');
            btnNew.classList.remove('guide-inactive-tab');
            btnOld.classList.remove('guide-active-tab');
            btnOld.classList.add('guide-inactive-tab');
            textModel.innerText = "New Menu System";
        } else {
            btnOld.classList.add('guide-active-tab');
            btnOld.classList.remove('guide-inactive-tab');
            btnNew.classList.remove('guide-active-tab');
            btnNew.classList.add('guide-inactive-tab');
            textModel.innerText = "Old Menu System";
        }
    }
    // Also update video when system changes
    renderGuideVideo(system);
}

export async function initGuideChart() {
    const ctx = document.getElementById('exposureChart');
    if (!ctx) return;

    try {
        await loadScript(CHARTJS_URL, 'chartjs');
        
        new window.Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Standard (Normal)', 'Cine2 Recipes', 'S-Log Recipes'],
                datasets: [{
                    label: 'Required Exposure Compensation (Ev)',
                    data: [0, 0.7, 2.0], 
                    backgroundColor: [
                        '#cbd5e1', // Slate-300
                        '#f97316', // Orange-500
                        '#ef4444'  // Red-500
                    ],
                    borderColor: [
                        '#94a3b8',
                        '#ea580c',
                        '#dc2626'
                    ],
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 2.5,
                        title: {
                            display: true,
                            text: 'Exposure Value (+)',
                            font: { family: 'Inter', weight: 'bold' }
                        },
                        grid: { color: '#f1f5f9' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'Inter', weight: '600' } }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y > 0) {
                                    label += '+';
                                }
                                label += context.parsed.y + ' Stops';
                                return label;
                            },
                            afterBody: function(context) {
                                const val = context[0].parsed.y;
                                if(val === 0) return "Meter at 0. Standard digital exposure.";
                                if(val === 0.7) return "Overexpose slightly to avoid muddy shadows.";
                                if(val === 2.0) return "CRITICAL: Must overexpose to avoid noise floor.";
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Failed to load Chart.js", error);
    }
}

export function initGuideFeatures() {
    renderMenuPath();
    updateMenuSystemUI(state.guide.menuSystem);
    renderGuideVideo(state.guide.menuSystem); // Initial render of video
    initGuideChart();
}

// --- IMAGE LIGHTBOX ---

export function openLightbox(recipeId, startIndex) {
    const images = recipeImages[recipeId] || [];
    if (images.length === 0) return;

    state.lightbox.images = images;
    state.lightbox.currentIndex = parseInt(startIndex, 10);

    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('hidden');
    setTimeout(() => lightbox.classList.add('visible'), 10);

    showLightboxImage();
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('visible');
    setTimeout(() => lightbox.classList.add('hidden'), 300);
}

function showLightboxImage() {
    const { images, currentIndex } = state.lightbox;
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCounter = document.getElementById('lightboxCounter');

    lightboxImage.style.opacity = '0';
    setTimeout(() => {
        lightboxImage.src = images[currentIndex];
        lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
        lightboxImage.style.opacity = '1';
    }, 150);
}

function showNextImage() {
    const { images } = state.lightbox;
    state.lightbox.currentIndex = (state.lightbox.currentIndex + 1) % images.length;
    showLightboxImage();
}

function showPrevImage() {
    const { images } = state.lightbox;
    state.lightbox.currentIndex = (state.lightbox.currentIndex - 1 + images.length) % images.length;
    showLightboxImage();
}

// Attach event listeners for lightbox controls
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxNext').addEventListener('click', showNextImage);
document.getElementById('lightboxPrev').addEventListener('click', showPrevImage);
document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeLightbox();
});
document.addEventListener('keydown', (e) => {
    if (document.getElementById('lightbox').classList.contains('visible')) {
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'Escape') closeLightbox();
    }
});

// --- PNG & SHARE FUNCTIONS ---

export async function generateRecipePng(elementId, recipeName) {
    const elementToCapture = document.getElementById(elementId);
    if (!elementToCapture) {
        console.error(`Element with ID "${elementId}" not found for PNG generation.`);
        showToast("Sorry, there was an error creating the image.", true);
        return;
    }

    const btn = document.querySelector(`button[data-element-id="${elementId}"]`);
    const originalBtnContent = btn ? btn.innerHTML : '';
    if (btn) {
        btn.innerHTML = `<div class="loader-dark"></div> ${t('aiQuizGenerating')}`;
        btn.disabled = true;
    }

    try {
        await loadScript(HTML2CANVAS_URL, 'html2canvas');
        const html2canvas = window.html2canvas;

        const canvas = await html2canvas(elementToCapture, {
            scale: 2.5,
            useCORS: true,
            backgroundColor: '#F9FAFB' 
        });

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        const safeFileName = recipeName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        link.download = `SonyColorLab-${safeFileName}.png`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    } catch (error) {
        console.error("Failed to generate PNG:", error);
        showToast("Sorry, there was an error creating the image.", true);
    } finally {
        if (btn) {
            btn.innerHTML = originalBtnContent;
            btn.disabled = false;
        }
    }
}

export async function generateRecipeCardPng(recipeId, generatedRecipeData = null) {
    const originalRecipe = recipesData.find(r => r.id === recipeId);
    if (!originalRecipe && !generatedRecipeData) return;

    const recipeToRender = generatedRecipeData || originalRecipe;
    const recipeName = recipeToRender.name; // Directly use the English string

    const btn = document.activeElement;
    const originalBtnContent = btn.innerHTML;
    btn.innerHTML = `<div class="loader-dark"></div> Generating...`;
    btn.disabled = true;

    // Default color since personalityColor was removed
    const accentColor = '#3b82f6'; 

    try {
        await loadScript(HTML2CANVAS_URL, 'html2canvas');
        const { html2canvas } = window;

        const pngContentEl = document.createElement('div');
        pngContentEl.id = 'png-card-wrapper';
        Object.assign(pngContentEl.style, {
            position: 'absolute',
            left: '-9999px',
            top: '0',
            width: '1200px',
            fontFamily: "'Be Vietnam Pro', sans-serif",
            color: '#111827',
            backgroundColor: '#f0f2f5',
            overflow: 'hidden',
            boxSizing: 'border-box'
        });

        const createSettingsHTML = (settings) => {
            if (!settings) return '';
            return Object.entries(settings).map(([key, value]) => `
                <div style="background: rgba(255, 255, 255, 0.6); border-radius: 16px; padding: 20px; text-align: center; display: flex; flex-direction: column; justify-content: center; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
                    <div style="font-size: 20px; color: #4b5563; margin-bottom: 8px; font-weight: 500;">${key}</div>
                    <div style="font-size: 36px; font-weight: 800;">${value}</div>
                </div>`).join('');
        };
        
        const contentHTML = `
            <div style="width: 100%; height: 100%; position: relative; background-image: radial-gradient(circle at 10% 20%, rgb(137, 210, 255) 0%, rgb(153, 153, 255) 50%, rgb(229, 153, 255) 100%);">
                <div style="position: absolute; inset: 0; background: rgba(240, 242, 245, 0.7); backdrop-filter: blur(150px); -webkit-backdrop-filter: blur(150px);"></div>
                <div style="position: relative; padding: 80px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 32px;">
                        <img src="/assets/logo_black.png" style="height: 80px; width: auto;" alt="Logo">
                        <p style="font-size: 24px; font-weight: 600; color: #6b7280;">sonycolorlab.app</p>
                    </div>
                    <h2 style="font-size: 80px; font-weight: 800; margin: 56px 0 16px 0; line-height: 1.1; letter-spacing: -2px;">${recipeToRender.name}</h2>
                    <p style="font-size: 28px; color: #4b5563; margin: 0 0 56px 0; font-style: italic; max-width: 90%;">"${recipeToRender.description}"</p>
                    
                    <h3 style="font-size: 28px; font-weight: 700; margin: 40px 0 20px 0; border-left: 4px solid ${accentColor}; padding-left: 16px;">White Balance</h3>
                    <div style="background: rgba(255, 255, 255, 0.6); border-radius: 16px; padding: 24px; font-size: 32px; font-weight: 600; border: 1px solid rgba(0,0,0,0.05);">${recipeToRender.whiteBalance}</div>

                    <h3 style="font-size: 28px; font-weight: 700; margin: 40px 0 20px 0; border-left: 4px solid ${accentColor}; padding-left: 16px;">Main Settings</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">${createSettingsHTML(recipeToRender.settings)}</div>
                    
                    ${recipeToRender.colorDepth ? `<h3 style="font-size: 28px; font-weight: 700; margin: 40px 0 20px 0; border-left: 4px solid ${accentColor}; padding-left: 16px;">Color Depth</h3><div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 24px;">${createSettingsHTML(recipeToRender.colorDepth)}</div>` : ''}
                    
                    ${recipeToRender.detailSettings ? `<h3 style="font-size: 28px; font-weight: 700; margin: 40px 0 20px 0; border-left: 4px solid ${accentColor}; padding-left: 16px;">Detail</h3><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;">${createSettingsHTML(recipeToRender.detailSettings)}</div>` : ''}
                </div>
            </div>
        `;
        
        pngContentEl.innerHTML = contentHTML;
        document.body.appendChild(pngContentEl);

        const canvas = await html2canvas(pngContentEl, {
            scale: 1,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null
        });
        
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        const safeFileName = recipeName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        link.download = `SonyColorLab-${safeFileName}.png`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        document.body.removeChild(pngContentEl);

    } catch (error) {
        console.error("Failed to generate PNG:", error);
        showToast("Sorry, there was an error creating the image.", true);
    } finally {
        btn.innerHTML = originalBtnContent;
        btn.disabled = false;
    }
}

export async function shareRecipe(recipeId) {
    const recipe = recipesData.find(r => r.id === recipeId);
    if (!recipe) return;

    // Construct specific share URL
    const shareUrl = new URL(window.location.origin);
    shareUrl.searchParams.set('id', recipeId);

    const shareData = {
        title: `Sony Color Lab: ${recipe.name}`,
        text: `Check out this Sony Alpha color recipe: "${recipe.name}".\n${recipe.description}`,
        url: shareUrl.toString()
    };
    
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(shareData.url);
            showToast('Recipe link copied to clipboard!');
        }
    } catch (error) {
        console.error('Error sharing:', error);
        if (error.name !== 'AbortError') {
             await navigator.clipboard.writeText(shareData.url);
             showToast('Sharing failed. Link copied instead!', true);
        }
    }
}
