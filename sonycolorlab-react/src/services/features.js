/**
 * features.js (React Version)
 * This module encapsulates logic for complex features, refactored for a React environment.
 * UI-heavy logic like D3 charts and the lightbox will be handled in their own components.
 */

import recipesData from './recipes.js';

// --- CDN URLs for external libraries ---
const JSPDF_URL = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
const HTML2CANVAS_URL = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

/**
 * Dynamically loads an external script.
 * @param {string} url - The URL of the script to load.
 * @returns {Promise<void>}
 */
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * Manages loading of PDF generation scripts to avoid re-loading.
 * @param {object} scriptsState - The current state of loaded scripts from context.
 * @param {function} setScripts - The state setter for scripts from context.
 */
export async function loadPdfScripts(scriptsState, setScripts) {
    if (!scriptsState.jspdf) {
        await loadScript(JSPDF_URL);
        setScripts(s => ({ ...s, jspdf: true }));
    }
    if (!scriptsState.html2canvas) {
        await loadScript(HTML2CANVAS_URL);
        setScripts(s => ({ ...s, html2canvas: true }));
    }
}

/**
 * Generates a PDF for a given recipe.
 * @param {string} recipeId - The ID of the recipe to generate a PDF for.
 * @param {object} generatedRecipeData - Optional AI-generated recipe data to compare against.
 * @param {function} showToast - A function to display toast notifications.
 * @param {string} currentLanguage - The current language ('vi' or 'en').
 */
export async function generateRecipePdf(recipeId, generatedRecipeData, showToast, currentLanguage) {
    const originalRecipe = recipesData.find(r => r.id === recipeId);
    if (!originalRecipe) return;

    // The component calling this will handle the loading state (e.g., set a state `isGeneratingPdf` to true)
    try {
        // Note: The script loading should ideally be handled by the calling component
        // using the `loadPdfScripts` function above in a `useEffect`.
        // This is a simplified version for logic migration.
        if (!window.jspdf || !window.html2canvas) {
            console.error("PDF libraries not loaded. Call loadPdfScripts first.");
            showToast("Error: PDF libraries not loaded.", true);
            return;
        }

        const { jsPDF } = window.jspdf;
        const html2canvas = window.html2canvas;

        // NOTE: The following HTML generation should be replaced by rendering a React component
        // to a static string using ReactDOMServer.renderToStaticMarkup for better maintainability.
        // This is a placeholder for the logic migration step.
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
            <h2 style="font-size: 32px; font-weight: 700; margin: 24px 0 8px 0;">${generatedRecipeData ? generatedRecipeData.name[currentLanguage] : originalRecipe.name[currentLanguage]}</h2>
            <p style="font-size: 14px; color: #6e6e73; margin: 0 0 24px 0; font-style: italic;">"${generatedRecipeData ? generatedRecipeData.description[currentLanguage] : originalRecipe.description[currentLanguage]}"</p>
        `;

        if (generatedRecipeData) {
            contentHTML += `<div style="border: 2px solid #007AFF; border-radius: 12px; padding: 24px; background-color: #f0f7ff;"><h3 style="font-size: 20px; font-weight: 700; margin-top: 0;">AI Generated Recipe</h3><div style="margin-top: 16px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">${createComparisonSettingsHTML(originalRecipe.settings, generatedRecipeData.settings)}</div>${originalRecipe.colorDepth ? `<h4 style="font-size: 16px; font-weight: 600; margin: 24px 0 12px 0;">Color Depth</h4><div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px;">${createComparisonSettingsHTML(originalRecipe.colorDepth, generatedRecipeData.colorDepth)}</div>` : ''}</div><p style="font-size: 12px; color: #6e6e73; text-align: center; margin-top: 16px;">Based on original recipe: ${originalRecipe.name[currentLanguage]}</p>`;
        } else {
             contentHTML += `<h3 style="font-size: 16px; font-weight: 600; margin: 24px 0 12px 0;">White Balance</h3><div style="background-color: #f8f9fa; border-radius: 8px; padding: 12px; font-size: 18px; font-weight: 600;">${originalRecipe.whiteBalance}</div><h3 style="font-size: 16px; font-weight: 600; margin: 24px 0 12px 0;">Main Settings</h3><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">${createSettingsHTML(originalRecipe.settings)}</div>${originalRecipe.colorDepth ? `<h3 style="font-size: 16px; font-weight: 600; margin: 24px 0 12px 0;">Color Depth</h3><div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px;">${createSettingsHTML(originalRecipe.colorDepth)}</div>` : ''}${originalRecipe.detailSettings ? `<h3 style="font-size: 16px; font-weight: 600; margin: 24px 0 12px 0;">Detail</h3><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">${createSettingsHTML(originalRecipe.detailSettings)}</div>` : ''}`;
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
        // The calling component will set its loading state to false.
    }
}

/**
 * Shares a recipe using the Web Share API or copies the link to the clipboard.
 * @param {string} recipeId - The ID of the recipe to share.
 * @param {function} showToast - A function to display toast notifications.
 * @param {string} currentLanguage - The current language ('vi' or 'en').
 */
export async function shareRecipe(recipeId, showToast, currentLanguage) {
    const recipe = recipesData.find(r => r.id === recipeId);
    if (!recipe) return;

    const shareData = {
        title: `Sony Color Lab: ${recipe.name[currentLanguage]}`,
        text: `Check out this Sony Alpha color recipe: "${recipe.name[currentLanguage]}".\n${recipe.description[currentLanguage]}`,
        url: window.location.href // This will eventually be updated to the specific recipe URL
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
