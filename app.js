/**
 * app.js (Main Controller)
 * This is the entry point and central controller of the application.
 * * ==============================================
 * GỠ BỎ TÍNH NĂNG AI - CẬP NHẬT NGÀY 25/08/2025
 * ==============================================
 * - Đã gỡ bỏ các event listener cho input file không còn tồn tại.
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

async function init() {
    initLanguage();

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
        const navBtn = target.closest('[data-view]');
        const langBtn = target.closest('.lang-btn-slider');
        const recipeItem = target.closest('.recipe-item');
        const collageItem = target.closest('.collage-item');
        const d3Node = target.closest('.color-map-node-group');

        if (d3Node) {
            const recipeData = d3.select(d3Node).datum();
            if (recipeData && recipeData.id) {
                handleRecipeSelection(recipeData.id);
            }
            return;
        }

        if (target.closest('#homeBtn')) { await renderView('home', null, attachViewEventListeners); return; }
        if (target.closest('#hamburgerBtn')) { document.getElementById('mobileNavMenu').classList.remove('translate-x-full'); return; }
        if (target.closest('#closeMobileNavBtn')) { document.getElementById('mobileNavMenu').classList.add('translate-x-full'); return; }
        if (target.closest('#backToListBtn') || target.closest('#backToChartBtn')) { resetToChartView(); return; }

        if (navBtn) {
            if (navBtn.dataset.view === 'recipeFormulas' && state.currentView === 'recipeFormulas') {
                resetToChartView();
            } else {
                await renderView(navBtn.dataset.view, null, attachViewEventListeners);
            }
            if(target.closest('.nav-btn-mobile')) {
                 document.getElementById('mobileNavMenu').classList.add('translate-x-full');
            }
            return;
        }

        if (langBtn) {
            const newLang = langBtn.id === 'langEN' ? 'en' : 'vi';
            setLanguage(newLang);
            updateLangSlider();
            applyTranslations();
            if (state.currentView === 'recipeFormulas') {
                renderLibraryList();
                renderLibraryDetails();
                renderColorMapChart('#colorMapContainer', recipesData);
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

        if (target.closest('#startQuizBtn') || target.closest('#quizShortcutBtn')) {
            openModal('quizModal');
            state.quiz.instance.start();
            return;
        }
        if (target.closest('#quizModal')) {
            if (target.closest('#closeQuizBtn')) {
                closeModal('quizModal');
                state.quiz.instance.close();
                return;
            }
            if (target.closest('#retakeQuizBtn')) {
                state.quiz.instance.start();
                return;
            }
            if (target.closest('#viewResultBtn')) {
                const recipeId = target.closest('#viewResultBtn').dataset.recipeId;
                closeModal('quizModal');
                await renderView('recipeFormulas', recipeId, attachViewEventListeners);
                return;
            }
            if (target.closest('.quiz-option')) {
                state.quiz.instance.handleAnswer(e);
                return;
            }
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
