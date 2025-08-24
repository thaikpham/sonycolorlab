/**
 * features.js
 * This module encapsulates logic for complex, self-contained features
 * like the AI labs, D3 chart, PDF generation, and image lightbox.
 * * ==============================================
 * NÂNG CẤP ANIMATION - CẬP NHẬT NGÀY 24/08/2025
 * ==============================================
 * - Import và sử dụng hàm `openModal`, `closeModal` từ `ui.js`.
 * - Cập nhật `openAILab` và `closeAILab` để kích hoạt modal với hiệu ứng mượt mà.
 */

// --- Local Module Imports ---
import { state } from './state.js';
import { callGeminiAPI, fetchTrendingRecipeIds } from './api.js';
import { t, getCurrentLanguage, applyTranslations } from './language.js';
import recipesData from './recipes-core.js';
import recipeImages from './recipes-images.js';
// UPDATED: Import modal functions
import { showToast, openModal, closeModal } from './ui.js';

// --- CDN URLs for external libraries ---
const JSPDF_URL = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
const HTML2CANVAS_URL = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

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
    // Fetch trending recipe IDs
    const trendingIds = await fetchTrendingRecipeIds();
    const container = d3.select(containerSelector);
    if (container.empty() || !data || data.length === 0) {
        console.warn("Chart container not found or no data provided.");
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
        .text(d => d.text[getCurrentLanguage()]);

    svg.append("g").attr("class", "grid")
        .call(d3.axisBottom(xScale).ticks(10).tickSize(height).tickFormat(""))
        .selectAll("line").attr("stroke", "#f1f5f9").attr("stroke-opacity", 0.7);
    svg.append("g").attr("class", "grid")
        .call(d3.axisLeft(yScale).ticks(10).tickSize(-width).tickFormat(""))
        .selectAll("line").attr("stroke", "#f1f5f9").attr("stroke-opacity", 0.7);

    svg.selectAll(".domain").remove();

    svg.append("text").attr("class", "axis-label").attr("text-anchor", "start").attr("x", 5).attr("y", yScale(0) - 8).text(getCurrentLanguage() === 'vi' ? '← Lạnh' : '← Cool');
    svg.append("text").attr("class", "axis-label").attr("text-anchor", "end").attr("x", width - 5).attr("y", yScale(0) - 8).text(getCurrentLanguage() === 'vi' ? 'Ấm →' : 'Warm →');
    svg.append("text").attr("class", "axis-label").attr("text-anchor", "middle").attr("x", xScale(0)).attr("y", -15).text(getCurrentLanguage() === 'vi' ? '↑ Tương phản Gắt' : '↑ Punchy Contrast');
    svg.append("text").attr("class", "axis-label").attr("text-anchor", "middle").attr("x", xScale(0)).attr("y", height + 25).text(getCurrentLanguage() === 'vi' ? '↓ Tương phản Dịu' : '↓ Soft Contrast');

    const nodesData = data.filter(d => d.coords).map(d => ({...d, isTrending: trendingIds.includes(d.id)}));

    state.chart.nodes = svg.selectAll(".color-map-node-group")
        .data(nodesData, d => d.id)
        .enter()
        .append("g")
        .attr("class", "color-map-node-group")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

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
        .text(d => d.name[getCurrentLanguage()]);

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

    for (let i = 0; i < 120; ++i) state.chart.simulation.tick();

    state.chart.nodes
        .transition()
        .duration(1200)
        .delay((d, i) => i * 10)
        .ease(d3.easeCubicOut)
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


// --- GEMINI AI LAB (COLOR TWEAKING) ---

export function openAILab(recipeId) {
    state.ai.originalRecipe = recipesData.find(r => r.id === recipeId);
    if (!state.ai.originalRecipe) return;

    Object.assign(state.ai, {
        generatedRecipe: null, userPrompt: '', isGenerating: false,
        abortController: state.ai.abortController ? (state.ai.abortController.abort(), null) : null
    });

    // UPDATED: Use animated modal function
    openModal('aiLabModal');
    renderAILab();
}

export function closeAILab() {
    if (state.ai.abortController) state.ai.abortController.abort();
    // UPDATED: Use animated modal function
    closeModal('aiLabModal');
}

export function renderAILab() {
    const contentEl = document.getElementById('aiLabContent');
    if (!contentEl) return;

    if (state.ai.isGenerating) {
        contentEl.innerHTML = `<div class="flex flex-col items-center justify-center h-64"><div class="loader-dark"></div><p class="mt-4 text-gray-600">Gemini is thinking...</p></div>`;
        return;
    }
    if (state.ai.generatedRecipe) {
        renderAIComparison(contentEl);
        return;
    }
    renderAIPromptInput(contentEl);
    applyTranslations();
}

function renderAIPromptInput(container) {
    const recipeName = state.ai.originalRecipe.name[getCurrentLanguage()];
    container.innerHTML = `
        <p class="text-lg text-gray-600 text-center">${t('aiLabDescription').replace('{recipeName}', `<b>${recipeName}</b>`)}</p>
        <textarea id="aiPromptInput" class="w-full mt-4 p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all min-h-[100px]" placeholder="${t('aiPromptPlaceholder')}"></textarea>
        <div class="mt-6 text-center">
            <button id="generateAIBtn" class="btn btn-primary py-3 px-8 text-lg">
                <span data-translate-key="aiGenerateBtn"></span>
            </button>
        </div>
    `;
}

function renderAIComparison(container) {
    const original = state.ai.originalRecipe;
    const generated = state.ai.generatedRecipe;

    const createComparisonGrid = (titleKey, originalSettings, generatedSettings) => {
        if (!originalSettings || !generatedSettings) return '';
        const allKeys = Object.keys(originalSettings);
        const gridItems = allKeys.map(key => {
            const originalValue = originalSettings[key];
            const generatedValue = generatedSettings[key];
            const isChanged = originalValue !== generatedValue;
            return `
                <div class="flex flex-col p-3 rounded-lg ${isChanged ? 'bg-blue-100/50 border border-blue-200' : 'bg-gray-100/70'}">
                    <span class="text-sm text-gray-500 font-medium">${key}</span>
                    <div class="flex items-baseline gap-2 mt-1">
                        <span class="font-semibold text-lg ${isChanged ? 'text-blue-700' : 'text-gray-800'}">${generatedValue}</span>
                        ${isChanged ? `<span class="text-xs text-gray-500 line-through">${originalValue}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        return `<div><h4 class="text-lg font-bold mb-3 text-gray-700" data-translate-key="${titleKey}"></h4><div class="grid grid-cols-2 md:grid-cols-3 gap-3">${gridItems}</div></div>`;
    };

    container.innerHTML = `
        <div class="text-center">
            <h3 class="text-2xl font-bold" data-translate-key="aiComparisonTitle"></h3>
            <p class="mt-1 text-gray-600" data-translate-key="aiComparisonDescription"></p>
        </div>
        <div class="mt-6 grid grid-cols-1">
             <div class="border-2 border-blue-500 rounded-xl p-4 bg-white shadow-lg">
                <h4 class="text-xl font-bold text-center text-blue-600" data-translate-key="aiNewTitle"></h4>
                <p class="text-center text-gray-500">${generated.name[getCurrentLanguage()]}</p>
            </div>
        </div>
        <div class="mt-6 space-y-6">
            ${createComparisonGrid('recipeSettingsTitle', original.settings, generated.settings)}
            ${original.colorDepth ? createComparisonGrid('colorDepthTitle', original.colorDepth, generated.colorDepth) : ''}
        </div>
        <div class="mt-8 text-center">
             <button id="downloadAIPdfBtn" data-recipe-id="${original.id}" class="btn bg-gray-700 hover:bg-gray-800 text-white py-3 px-6 shadow-lg shadow-gray-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download h-5 w-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                <span data-translate-key="downloadPDFBtn"></span>
            </button>
        </div>
    `;
    applyTranslations();
}

function renderAIError(container) {
    container.innerHTML = `
        <div class="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 class="text-xl font-bold text-red-800" data-translate-key="aiErrorTitle"></h3>
            <p class="mt-2 text-red-700" data-translate-key="aiErrorText"></p>
        </div>
    `;
    applyTranslations();
}

export function handleAIGeneration() {
    const userInput = document.getElementById('aiPromptInput').value.trim();
    if (!userInput) return;
    state.ai.userPrompt = userInput;
    confirmAndCallAI();
}

export async function confirmAndCallAI() {
    state.ai.isGenerating = true;
    state.ai.abortController = new AbortController();
    renderAILab();

    const expertPrompt = `As a professional colorist specializing in Sony Picture Profiles, analyze the following JSON object which represents an existing color recipe. Your task is to generate a new, modified JSON object based on the user's request: "${state.ai.userPrompt}". The new JSON must be a complete, valid recipe object. You must only respond with the raw JSON object, without any surrounding text, explanations, or markdown formatting. The generated recipe name and description must be in the same language as the user's prompt (${getCurrentLanguage()}). Original recipe: ${JSON.stringify(state.ai.originalRecipe)}`;

    try {
        const generatedRecipe = await callGeminiAPI(expertPrompt, state.ai.abortController.signal);
        state.ai.generatedRecipe = generatedRecipe;
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error("Gemini API call failed:", error);
            renderAIError(document.getElementById('aiLabContent'));
        }
    } finally {
        state.ai.isGenerating = false;
        state.ai.userPrompt = '';
        state.ai.abortController = null;
        if (!document.querySelector('.bg-red-50')) {
            renderAILab();
        }
    }
}

// --- PDF & SHARE FUNCTIONS ---

export async function generateRecipePdf(recipeId, generatedRecipeData = null) {
    const originalRecipe = recipesData.find(r => r.id === recipeId);
    if (!originalRecipe) return;

    const btn = document.activeElement;
    const originalBtnContent = btn.innerHTML;
    btn.innerHTML = `<div class="loader-dark"></div> Generating...`;
    btn.disabled = true;

    try {
        await Promise.all([
            loadScript(JSPDF_URL, 'jspdf'),
            loadScript(HTML2CANVAS_URL, 'html2canvas')
        ]);

        const { jsPDF } = window.jspdf;
        const html2canvas = window.html2canvas;

        const pdfContentEl = document.createElement('div');
        pdfContentEl.id = 'pdf-content-wrapper';
        Object.assign(pdfContentEl.style, {
            position: 'absolute', left: '-9999px', top: '0',
            width: '210mm', padding: '20mm', backgroundColor: 'white',
            fontFamily: "'Be Vietnam Pro', sans-serif", color: '#1d1d1f',
            boxSizing: 'border-box'
        });

        const createSettingsHTML = (settings) => Object.entries(settings || {}).map(([key, value]) => `
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 12px; text-align: center;">
                <div style="font-size: 12px; color: #6e6e73; margin-bottom: 4px;">${key}</div>
                <div style="font-size: 18px; font-weight: 600;">${value}</div>
            </div>`).join('');
        
        const createComparisonSettingsHTML = (originalSettings, generatedSettings) => {
             const allKeys = Object.keys(originalSettings || {});
             return allKeys.map(key => {
                const originalValue = originalSettings[key];
                const generatedValue = generatedSettings[key];
                const isChanged = originalValue !== generatedValue;
                return `
                <div style="background-color: ${isChanged ? '#e6f2ff' : '#f8f9fa'}; border-radius: 8px; padding: 12px; text-align: center;">
                    <div style="font-size: 12px; color: #6e6e73; margin-bottom: 4px;">${key}</div>
                    <div style="font-size: 18px; font-weight: 600; color: ${isChanged ? '#0056B3' : 'inherit'};">${generatedValue}</div>
                    ${isChanged ? `<div style="font-size: 11px; text-decoration: line-through; color: #6e6e73;">${originalValue}</div>` : ''}
                </div>`;
             }).join('');
        };

        let contentHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px;">
                <h1 style="font-size: 24px; font-weight: 800; margin: 0;">Alpha AI Color Lab</h1>
            </div>
            <h2 style="font-size: 32px; font-weight: 700; margin: 24px 0 8px 0;">${generatedRecipeData ? generatedRecipeData.name[getCurrentLanguage()] : originalRecipe.name[getCurrentLanguage()]}</h2>
            <p style="font-size: 14px; color: #6e6e73; margin: 0 0 24px 0; font-style: italic;">"${generatedRecipeData ? generatedRecipeData.description[getCurrentLanguage()] : originalRecipe.description[getCurrentLanguage()]}"</p>
        `;

        if (generatedRecipeData) {
            contentHTML += `
                <div style="border: 2px solid #007AFF; border-radius: 12px; padding: 24px; background-color: #f0f7ff;">
                    <h3 style="font-size: 20px; font-weight: 700; margin-top: 0;">AI Generated Recipe</h3>
                    <div style="margin-top: 16px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                        ${createComparisonSettingsHTML(originalRecipe.settings, generatedRecipeData.settings)}
                    </div>
                    ${originalRecipe.colorDepth ? `<h4 style="font-size: 16px; font-weight: 600; margin: 24px 0 12px 0;">Color Depth</h4><div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px;">${createComparisonSettingsHTML(originalRecipe.colorDepth, generatedRecipeData.colorDepth)}</div>` : ''}
                </div>
                 <p style="font-size: 12px; color: #6e6e73; text-align: center; margin-top: 16px;">Based on original recipe: ${originalRecipe.name[getCurrentLanguage()]}</p>
            `;
        } else {
             contentHTML += `
                <h3 style="font-size: 16px; font-weight: 600; margin: 24px 0 12px 0;">White Balance</h3>
                <div style="background-color: #f8f9fa; border-radius: 8px; padding: 12px; font-size: 18px; font-weight: 600;">${originalRecipe.whiteBalance}</div>
                <h3 style="font-size: 16px; font-weight: 600; margin: 24px 0 12px 0;">Main Settings</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">${createSettingsHTML(originalRecipe.settings)}</div>
                ${originalRecipe.colorDepth ? `<h3 style="font-size: 16px; font-weight: 600; margin: 24px 0 12px 0;">Color Depth</h3><div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px;">${createSettingsHTML(originalRecipe.colorDepth)}</div>` : ''}
                ${originalRecipe.detailSettings ? `<h3 style="font-size: 16px; font-weight: 600; margin: 24px 0 12px 0;">Detail</h3><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">${createSettingsHTML(originalRecipe.detailSettings)}</div>` : ''}
             `;
        }
        
        contentHTML += `<p style="text-align: center; margin-top: 40px; font-size: 12px; color: #9ca3af;">Generated from sonycolorlab.app</p>`;

        pdfContentEl.innerHTML = contentHTML;
        document.body.appendChild(pdfContentEl);

        const canvas = await html2canvas(pdfContentEl, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        document.body.removeChild(pdfContentEl);

        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        const fileName = `SonyColorLab-${generatedRecipeData ? generatedRecipeData.name.en : originalRecipe.name.en}.pdf`;
        pdf.save(fileName.replace(/[^a-z0-9]/gi, '-').toLowerCase());

    } catch (error) {
        console.error("Failed to generate PDF:", error);
        showToast("Sorry, there was an error creating the PDF.", true);
    } finally {
        btn.innerHTML = originalBtnContent;
        btn.disabled = false;
    }
}

export async function shareRecipe(recipeId) {
    const recipe = recipesData.find(r => r.id === recipeId);
    if (!recipe) return;

    const shareData = {
        title: `Sony Color Lab: ${recipe.name[getCurrentLanguage()]}`,
        text: `Check out this Sony Alpha color recipe: "${recipe.name[getCurrentLanguage()]}".\n${recipe.description[getCurrentLanguage()]}`,
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
