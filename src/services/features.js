/**
 * features.js
 * This module encapsulates logic for complex, self-contained features
 * like the AI labs, D3 chart, PDF generation, and image lightbox.
 */

// --- Local Module Imports ---
import { state } from './state.js';
import { select } from 'd3-selection';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { forceSimulation, forceCollide, forceX, forceY } from 'd3-force';
import { callGeminiAPI, fetchTrendingRecipeIds } from './api.js';
import { t, applyTranslations } from './language.js';
import recipeImages from './recipe-images.js';
import { showToast, openModal, closeModal } from './ui.js';

// --- CDN URLs for external libraries ---
const HTML2CANVAS_URL = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

const d3 = {
    select,
    scaleLinear,
    scaleSqrt,
    axisBottom,
    axisLeft,
    forceSimulation,
    forceCollide,
    forceX,
    forceY
};

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

/**
 * Renders the interactive D3.js color map chart.
 * @param {string} containerSelector - The CSS selector for the container element.
 * @param {object[]} data - The array of recipe data.
 */
export async function renderColorMapChart(containerSelector, data) {
    if (!Array.isArray(data) || data.length === 0) {
        console.warn("D3: recipes not ready yet.");
        return;
    }

    const cleanedData = data.filter(d => d.coords && typeof d.coords.x === 'number' && typeof d.coords.y === 'number');

    if (cleanedData.length === 0) {
        console.error("D3: coords missing from all recipes.");
        return;
    }

    // Fetch trending recipe IDs
    const trendingIds = await fetchTrendingRecipeIds();
    const container = d3.select(containerSelector);
    if (container.empty()) {
        console.warn("Chart container not found.");
        return;
    }
    container.html(''); // Clear previous chart

    const bounds = container.node().getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) {
        return; // Don't render if container is not visible
    }

    const margin = { top: 40, right: 30, bottom: 50, left: 30 };
    const width = bounds.width - margin.left - margin.right;
    const height = bounds.height - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const defs = svg.append("defs");
    const filter = defs.append("filter")
        .attr("id", "soft-glow")
        .attr("x", "-50%").attr("y", "-50%")
        .attr("width", "200%").attr("height", "200%");
    filter.append("feGaussianBlur")
        .attr("in", "SourceGraphic")
        .attr("stdDeviation", "4")
        .attr("result", "blur");

    const xScale = d3.scaleLinear().domain([-11, 11]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-11, 11]).range([height, 0]);
    const rScale = d3.scaleSqrt().domain([0, 10]).range([7, 12]);

    const quadrantLabels = [
        { x: width * 0.25, y: height * 0.25, text: {vi: 'LẠNH & GẮT', en: 'COOL & PUNCHY'} },
        { x: width * 0.75, y: height * 0.25, text: {vi: 'ẤM & RỰC RỠ', en: 'WARM & VIBRANT'} },
        { x: width * 0.25, y: height * 0.75, text: {vi: 'LẠNH & DỊU', en: 'COOL & MUTED'} },
        { x: width * 0.75, y: height * 0.75, text: {vi: 'ẤM & MỜ', en: 'WARM & FADED'} },
    ];
    svg.selectAll(".quadrant-label")
        .data(quadrantLabels)
        .enter().append("text")
        .attr("class", "quadrant-label")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("dy", "0.35em")
        .text(d => d.text[state.language]);

    svg.append("g").attr("class", "grid")
        .call(d3.axisBottom(xScale).ticks(10).tickSize(height).tickFormat(""))
        .selectAll("line").attr("stroke", "#f1f5f9").attr("stroke-opacity", 0.7);
    svg.append("g").attr("class", "grid")
        .call(d3.axisLeft(yScale).ticks(10).tickSize(-width).tickFormat(""))
        .selectAll("line").attr("stroke", "#f1f5f9").attr("stroke-opacity", 0.7);

    svg.selectAll(".domain").remove();

    svg.append("text").attr("class", "axis-label").attr("text-anchor", "start").attr("x", 5).attr("y", yScale(0) - 8).text(state.language === 'vi' ? '← Lạnh' : '← Cool');
    svg.append("text").attr("class", "axis-label").attr("text-anchor", "end").attr("x", width - 5).attr("y", yScale(0) - 8).text(state.language === 'vi' ? 'Ấm →' : 'Warm →');
    svg.append("text").attr("class", "axis-label").attr("text-anchor", "middle").attr("x", xScale(0)).attr("y", -15).text(state.language === 'vi' ? '↑ Tương phản Gắt' : '↑ Punchy Contrast');
    svg.append("text").attr("class", "axis-label").attr("text-anchor", "middle").attr("x", xScale(0)).attr("y", height + 25).text(state.language === 'vi' ? '↓ Tương phản Dịu' : '↓ Soft Contrast');

    const nodesData = cleanedData.map(d => ({...d, isTrending: trendingIds.includes(d.id)}));

    state.chart.nodes = svg.selectAll(".color-map-node-group")
        .data(nodesData, d => d.id)
        .enter()
        .append("g")
        .attr("class", "color-map-node-group");

    state.chart.nodes.append("circle")
        .attr("class", "color-map-node-aura")
        .attr("r", d => rScale(Math.abs(d.coords.x) + Math.abs(d.coords.y)))
        .attr("fill", d => d.personalityColor)
        .attr("filter", "url(#soft-glow)")
        .attr("opacity", 0.3);

    state.chart.nodes.append("circle")
        .attr("class", "color-map-node-core")
        .attr("r", d => rScale(Math.abs(d.coords.x) + Math.abs(d.coords.y)))
        .attr("fill", d => d.personalityColor);

    state.chart.nodes.append("text")
        .attr("class", "color-map-node-label")
        .attr("x", d => rScale(Math.abs(d.coords.x) + Math.abs(d.coords.y)) + 6)
        .attr("dy", "0.35em")
        .text(d => d.name[state.language]);

    const starNodes = state.chart.nodes.filter(d => d.isTrending);
    
    starNodes.append("polygon")
        .attr("class", "trending-star-icon")
        .attr("points", "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2")
        .attr("fill", "#FFC700")
        .attr("stroke", "#B38B00")
        .attr("stroke-width", 1.5)
        .attr("transform", "translate(5, -15) scale(0.6)");


    state.chart.simulation = d3.forceSimulation(nodesData)
        .force("collide", d3.forceCollide().radius(d => rScale(Math.abs(d.coords.x) + Math.abs(d.coords.y)) + 3).strength(0.8))
        .force("x", d3.forceX(d => xScale(d.coords.x)).strength(0.1))
        .force("y", d3.forceY(d => yScale(d.coords.y)).strength(0.1))
        .stop();

    for (let i = 0; i < 30; ++i) state.chart.simulation.tick();

    state.chart.nodes
        .attr("transform", d => `translate(${d.x}, ${d.y})`);

    updateChartSelection();
}

/**
 * Updates the visual selection state of nodes on the D3 chart.
 */
export function updateChartSelection() {
    if (!state.chart.nodes) return;
    state.chart.nodes.classed("selected", d => d.id === state.selectedRecipeId);
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
    const originalRecipe = state.recipes.find(r => r.id === recipeId);
    if (!originalRecipe && !generatedRecipeData) return;

    const recipeToRender = generatedRecipeData || originalRecipe;
    const recipeName = recipeToRender.name.en;

    const btn = document.activeElement;
    const originalBtnContent = btn.innerHTML;
    btn.innerHTML = `<div class="loader-dark"></div> Generating...`;
    btn.disabled = true;

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
                    <h2 style="font-size: 80px; font-weight: 800; margin: 56px 0 16px 0; line-height: 1.1; letter-spacing: -2px;">${recipeToRender.name[state.language]}</h2>
                    <p style="font-size: 28px; color: #4b5563; margin: 0 0 56px 0; font-style: italic; max-width: 90%;">"${recipeToRender.description[state.language]}"</p>
                    
                    <h3 style="font-size: 28px; font-weight: 700; margin: 40px 0 20px 0; border-left: 4px solid ${recipeToRender.personalityColor || '#3b82f6'}; padding-left: 16px;">White Balance</h3>
                    <div style="background: rgba(255, 255, 255, 0.6); border-radius: 16px; padding: 24px; font-size: 32px; font-weight: 600; border: 1px solid rgba(0,0,0,0.05);">${recipeToRender.whiteBalance}</div>

                    <h3 style="font-size: 28px; font-weight: 700; margin: 40px 0 20px 0; border-left: 4px solid ${recipeToRender.personalityColor || '#3b82f6'}; padding-left: 16px;">Main Settings</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">${createSettingsHTML(recipeToRender.settings)}</div>
                    
                    ${recipeToRender.colorDepth ? `<h3 style="font-size: 28px; font-weight: 700; margin: 40px 0 20px 0; border-left: 4px solid ${recipeToRender.personalityColor || '#3b82f6'}; padding-left: 16px;">Color Depth</h3><div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 24px;">${createSettingsHTML(recipeToRender.colorDepth)}</div>` : ''}
                    
                    ${recipeToRender.detailSettings ? `<h3 style="font-size: 28px; font-weight: 700; margin: 40px 0 20px 0; border-left: 4px solid ${recipeToRender.personalityColor || '#3b82f6'}; padding-left: 16px;">Detail</h3><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;">${createSettingsHTML(recipeToRender.detailSettings)}</div>` : ''}
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
    const recipe = state.recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const shareData = {
        title: `Sony Color Lab: ${recipe.name[state.language]}`,
        text: `Check out this Sony Alpha color recipe: "${recipe.name[state.language]}".\n${recipe.description[state.language]}`,
        url: window.location.href
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

export async function saveRecipeToGoogleDrive(recipeData) {
    if (!state.auth.isLoggedIn) {
        showToast(t('logInToContinue'), true);
        return;
    }
    if (!state.auth.googleAccessToken) {
        showToast(t('googleSignInRequired'), true);
        return;
    }

    const btn = document.activeElement;
    const originalBtnContent = btn.innerHTML;
    btn.innerHTML = `<div class="loader-dark"></div> ${t('savingToDrive')}`;
    btn.disabled = true;

    // Format the recipe content for the file
    const lang = state.language;
    let fileContent = `Sony Color Lab Recipe: ${recipeData.name[lang] || recipeData.name.en}\n`;
    fileContent += `==============================================\n\n`;
    fileContent += `Description: ${recipeData.description[lang] || recipeData.description.en}\n\n`;
    fileContent += `--- SETTINGS ---\n`;
    fileContent += `White Balance: ${recipeData.whiteBalance}\n`;
    for (const [key, value] of Object.entries(recipeData.settings)) {
        fileContent += `${key}: ${value}\n`;
    }
    if (recipeData.colorDepth) {
        fileContent += `\n--- COLOR DEPTH ---\n`;
        for (const [key, value] of Object.entries(recipeData.colorDepth)) {
            fileContent += `${key}: ${value}\n`;
        }
    }
    if (recipeData.detailSettings) {
        fileContent += `\n--- DETAIL ---\n`;
        for (const [key, value] of Object.entries(recipeData.detailSettings)) {
            fileContent += `${key}: ${value}\n`;
        }
    }
    if (recipeData.notes) {
        fileContent += `\n--- MY NOTES ---\n`;
        fileContent += `${recipeData.notes}\n`;
    }
    fileContent += `\n\nGenerated via sonycolorlab.app`;

    const metadata = {
        name: `Sony Recipe - ${recipeData.name.en}.txt`,
        mimeType: 'text/plain',
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([fileContent], { type: 'text/plain' }));

    try {
        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${state.auth.googleAccessToken}`
            },
            body: form
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Google Drive API Error:", error);
            // Handle expired token scenario by prompting re-login
            if (error.error.code === 401) {
                 showToast(t('googleAuthExpired'), true);
            } else {
                throw new Error(error.error.message || 'Failed to upload file.');
            }
        } else {
            await response.json();
            showToast(t('driveSaveSuccess'));
        }

    } catch (error) {
        console.error("Failed to save to Google Drive:", error);
        showToast(t('driveSaveError'), true);
    } finally {
        if (btn) {
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide w-5 h-5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M11.5 12.5 13 14l-2.5 2.5"/><path d="m10 16.5 1.5-1.5"/></svg><span data-translate-key="saveToDriveBtn"></span>`;
            applyTranslations();
            btn.disabled = false;
        }
    }
}

