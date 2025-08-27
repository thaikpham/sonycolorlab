/**
 * app.js (Main Controller)
 * This is the entry point and central controller of the application.
 * * ==============================================
 * NÂNG CẤP TRANG CHỦ - CẬP NHẬT NGÀY 27/08/2025
 * ==============================================
 * - Thêm logic để render bản đồ màu D3.js trên trang chủ mới.
 * - Cập nhật trình xử lý sự kiện để điều hướng từ nút "Tiến vào Color Lab".
 * - Tối ưu hóa logic FAB và xử lý lớp phủ (overlay).
 */

// --- Local Module Imports ---
import { t, applyTranslations, updateLangSlider, initLanguage, setLanguage, getCurrentLanguage } from './language.js';
import { parameterExplanations } from './translations.js';
import { Quiz } from './quiz.js';
import recipesData from './recipes-core.js';
import recipeImages from './recipes-images.js';
import { state } from './state.js';
import { initializeFirebase } from './api.js';
import { renderView, updateListSelectionAndScroll, renderLibraryDetails, renderLibraryList, initializeBackgroundBlobs, openModal, closeModal } from './ui.js';
import {
    openAILab, closeAILab, handleAIGeneration, confirmAndCallAI, renderAILab,
    openLightbox,
    generateRecipePdf,
    shareRecipe,
    renderColorMapChart,
    updateChartSelection
} from './features.js';

// --- MODULE-LEVEL VARIABLES ---
let fabContainer, fabOverlay;

// --- CORE APP LOGIC ---

function handleRecipeSelection(id) {
    state.selectedRecipeId = (state.selectedRecipeId === id) ? null : id;
    state.isMobileDetailActive = !!state.selectedRecipeId;

    updateListSelectionAndScroll(state.selectedRecipeId);
    renderLibraryDetails();
    updateChartSelection();

    if (state.selectedRecipeId) {
        const recipe = recipesData.find(r => r.id === state.selectedRecipeId);
        if (recipe) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'view_recipe',
                recipe_id: recipe.id,
                recipe_name: recipe.name.en,
                recipe_name_vi: recipe.name.vi
            });
        }
    }
}

function resetToChartView() {
    state.selectedRecipeId = null;
    state.isMobileDetailActive = false;
    updateListSelectionAndScroll(null);
    renderLibraryDetails();
    updateChartSelection();
}

function attachViewEventListeners(viewName) {
    if (viewName === 'home') {
        initializeBackgroundBlobs();
        const homeChartContainer = document.getElementById('homeColorMapContainer');
        if (homeChartContainer) {
            // Use ResizeObserver to ensure the container is ready before drawing
            const resizeObserver = new ResizeObserver(entries => {
                if (entries && entries.length > 0 && entries[0].contentRect.width > 0) {
                     renderColorMapChart('#homeColorMapContainer', recipesData);
                     resizeObserver.unobserve(homeChartContainer); // Stop observing after drawing
                }
            });
            resizeObserver.observe(homeChartContainer);
        }
    }
    if (viewName === 'recipeFormulas') {
        renderLibraryList();
        renderLibraryDetails();

        const view = document.getElementById('recipeFormulasView');
        const listPanel = document.getElementById('recipeListPanel');
        const mainPanel = document.getElementById('recipeMainPanel');

        if (view && listPanel && mainPanel && window.innerWidth >= 1024) {
            const setStageActive = () => view.classList.remove('stage-inactive');
            const setStageInactive = () => view.classList.add('stage-inactive');

            setTimeout(setStageInactive, 500);

            listPanel.addEventListener('mouseenter', setStageActive);
            mainPanel.addEventListener('mouseenter', setStageInactive);
        }

        const chartContainer = document.getElementById('colorMapContainer');
        if (chartContainer) {
            const resizeObserver = new ResizeObserver(entries => {
                if (entries && entries.length > 0 && entries[0].contentRect.width > 0) {
                     renderColorMapChart('#colorMapContainer', recipesData);
                     resizeObserver.unobserve(chartContainer);
                }
            });
            resizeObserver.observe(chartContainer);
        }
        updateLangSlider();
    }
}

function toggleFabMenu(forceClose = false) {
    if (fabContainer) {
        if (forceClose) {
            fabContainer.classList.remove('open');
        } else {
            fabContainer.classList.toggle('open');
        }
    }
}


async function init() {
    initLanguage();
    
    fabContainer = document.getElementById('fabContainer');
    fabOverlay = document.getElementById('fab-overlay');

    state.quiz.instance = new Quiz({
        state,
        getCurrentLanguage,
        recipesData,
        recipeImages,
        applyTranslations,
        renderView: (view, id) => renderView(view, id, attachViewEventListeners)
    });

    // --- GLOBAL EVENT LISTENERS (EVENT DELEGATION) ---
    document.body.addEventListener('click', async (e) => {
        const target = e.target;
        
        if (target.closest('#fabMainBtn')) {
            toggleFabMenu();
            return;
        }
        if (target.id === 'fab-overlay' && fabContainer.classList.contains('open')) {
            toggleFabMenu(true);
            return;
        }

        const navBtn = target.closest('.fab-menu-item');
        const langBtn = target.closest('.lang-btn-slider');
        const recipeItem = target.closest('.recipe-item');
        const collageItem = target.closest('.collage-item');
        const d3Node = target.closest('.color-map-node-group');

        if (d3Node) {
            // If chart on home page is clicked, go to recipes view and select
            if (state.currentView === 'home') {
                const recipeId = d3.select(d3Node).datum().id;
                await renderView('recipeFormulas', recipeId, attachViewEventListeners);
            } else {
                handleRecipeSelection(d3.select(d3Node).datum().id);
            }
            return;
        }
        
        // New home page button
        if (target.closest('#enterLabBtn')) {
            await renderView('recipeFormulas', null, attachViewEventListeners);
            return;
        }

        if (target.closest('#homeBtn')) { await renderView('home', null, attachViewEventListeners); return; }
        if (target.closest('#backToListBtn') || target.closest('#backToChartBtn')) { resetToChartView(); return; }

        if (navBtn) {
            toggleFabMenu(true);
            if (navBtn.dataset.view === 'recipeFormulas' && state.currentView === 'recipeFormulas') {
                resetToChartView();
            } else {
                await renderView(navBtn.dataset.view, null, attachViewEventListeners);
            }
            return;
        }
        
        if (target.closest('#startQuizBtnFab') || target.closest('#quizShortcutBtn')) {
            toggleFabMenu(true);
            openModal('quizModal');
            state.quiz.instance.start();
            return;
        }

        if (langBtn) {
            const newLang = langBtn.id === 'langEN' ? 'en' : 'vi';
            setLanguage(newLang);
            updateLangSlider();
            applyTranslations();
            // Re-render views that depend on language
            if (state.currentView === 'recipeFormulas') {
                renderLibraryList();
                renderLibraryDetails();
                renderColorMapChart('#colorMapContainer', recipesData);
            } else if (state.currentView === 'home') {
                renderColorMapChart('#homeColorMapContainer', recipesData);
            }
            return;
        }

        if (recipeItem) { handleRecipeSelection(recipeItem.dataset.recipeId); return; }
        if (collageItem) { openLightbox(collageItem.dataset.recipeId, collageItem.dataset.index); return; }

        if (target.closest('#downloadPdfBtn')) { generateRecipePdf(target.closest('#downloadPdfBtn').dataset.recipeId); return; }
        if (target.closest('#shareRecipeBtn')) { shareRecipe(target.closest('#shareRecipeBtn').dataset.recipeId); return; }
        if (target.closest('#tweakWithAIBtn')) { openAILab(target.closest('#tweakWithAIBtn').dataset.recipeId); return; }

        if (target.closest('#toggleSaveGuideBtn')) {
            const btn = target.closest('#toggleSaveGuideBtn');
            const content = btn.parentElement.querySelector('#saveGuideContent');
            const btnSpan = btn.querySelector('span');
            const isHidden = content.classList.contains('max-h-0');
            if (isHidden) {
                content.classList.remove('max-h-0');
                content.classList.add('max-h-[1000px]');
                btnSpan.dataset.translateKey = 'hideGuideBtn';
            } else {
                content.classList.add('max-h-0');
                content.classList.remove('max-h-[1000px]');
                btnSpan.dataset.translateKey = 'showGuideBtn';
            }
            applyTranslations();
            return;
        }

        if (target.closest('#quizModal')) {
            if (target.closest('#closeQuizBtn')) { closeModal('quizModal'); state.quiz.instance.close(); return; }
            if (target.closest('#retakeQuizBtn')) { state.quiz.instance.start(); return; }
            if (target.closest('#viewResultBtn')) {
                const recipeId = target.closest('#viewResultBtn').dataset.recipeId;
                closeModal('quizModal');
                await renderView('recipeFormulas', recipeId, attachViewEventListeners);
                return;
            }
            if (target.closest('.quiz-option')) { state.quiz.instance.handleAnswer(e); return; }
        }

        if (target.closest('#aiLabModal')) {
            if (target.closest('#closeAILabBtn')) { closeAILab(); return; }
            if (target.closest('#cancelAIBtn')) { state.ai.userPrompt = ''; state.ai.generatedRecipe = null; renderAILab(); return; }
            if (target.closest('#generateAIBtn')) { handleAIGeneration(); return; }
            if (target.closest('#confirmAIBtn')) { confirmAndCallAI(); return; }
            if (target.closest('#downloadAIPdfBtn')) { generateRecipePdf(target.closest('#downloadAIPdfBtn').dataset.recipeId, state.ai.generatedRecipe); return; }
        }
    });

    document.body.addEventListener('mouseover', (e) => {
        const title = e.target.closest('.parameter-title');
        const tooltipEl = document.getElementById('infoTooltip');
        if (title && tooltipEl) {
            const key = title.dataset.paramKey;
            const explanation = parameterExplanations[key]?.[getCurrentLanguage()];
            if (explanation) {
                tooltipEl.innerHTML = explanation;
                const titleRect = title.getBoundingClientRect();
                tooltipEl.style.left = `${titleRect.left + window.scrollX}px`;
                tooltipEl.style.top = `${titleRect.bottom + window.scrollY + 8}px`;
                tooltipEl.classList.remove('hidden');
                setTimeout(() => tooltipEl.classList.add('visible'), 10);
            }
        }
    });
    document.body.addEventListener('mouseout', (e) => {
        if (e.target.closest('.parameter-title')) {
            const tooltipEl = document.getElementById('infoTooltip');
            if(tooltipEl) {
                tooltipEl.classList.remove('visible');
                setTimeout(() => tooltipEl.classList.add('hidden'), 200);
            }
        }
    });

    document.addEventListener('input', e => {
        if(e.target.id === 'searchInput') renderLibraryList();
    });

    await renderView('home', null, attachViewEventListeners);
    updateLangSlider();

    initializeFirebase();
}

document.addEventListener("DOMContentLoaded", init);
