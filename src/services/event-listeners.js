// File Path: src/services/event-listeners.js
import { select } from 'd3-selection';
import { state } from './state.js';
import { openModal, closeModal, toggleUltimateActionsMenu, showToast } from './ui.js';
import { renderLibraryList, renderLibraryDetails } from '../components/recipe-list/recipe-list-ui.js';
import { setLanguage, updateLangSlider, applyTranslations, t } from './language.js';
import { renderColorMapChart, openLightbox, generateRecipeCardPng, shareRecipe, generateRecipePng } from './features.js';
import { handleRecipeSelection, resetToChartView } from './recipe-service.js';
import { renderView } from './view-manager.js';
import { parameterExplanations } from './parameterExplanations.js';
import recipesData from './recipes.js';

// Helper function to read recipe data from an editable form
function getRecipeDataFromForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return null;

    const lang = state.language;
    // Determine which editable recipe to use as the source
    const sourceRecipe = state.ai.editableRecipe || state.quiz.editableRecipe;
    if (!sourceRecipe) {
        console.error("No editable recipe found in state.");
        return null;
    }

    // Create a deep copy to avoid mutating the state directly
    const recipe = JSON.parse(JSON.stringify(sourceRecipe));

    // Update fields from the form
    recipe.name[lang] = form.querySelector('#recipeName').value;
    recipe.description[lang] = form.querySelector('#recipeDescription').value;
    recipe.whiteBalance = form.querySelector('#whiteBalance').value;
    recipe.notes = form.querySelector('#recipeNotes')?.value || "";

    form.querySelectorAll('#main-settings-grid input, [data-section="settings"]').forEach(input => {
        if (!recipe.settings) recipe.settings = {};
        recipe.settings[input.dataset.key] = input.value;
    });
    form.querySelectorAll('#color-depth-grid input, [data-section="colorDepth"]').forEach(input => {
        if (!recipe.colorDepth) recipe.colorDepth = {};
        recipe.colorDepth[input.dataset.key] = input.value;
    });
    form.querySelectorAll('#detail-settings-grid input, [data-section="detailSettings"]').forEach(input => {
        if (!recipe.detailSettings) recipe.detailSettings = {};
        recipe.detailSettings[input.dataset.key] = input.value;
    });

    // Ensure the other language's fields are not lost
    const otherLang = lang === 'en' ? 'vi' : 'en';
    if (!recipe.name[otherLang]) recipe.name[otherLang] = sourceRecipe.name[otherLang];
    if (!recipe.description[otherLang]) recipe.description[otherLang] = sourceRecipe.description[otherLang];

    return recipe;
}

async function initializeAndStartQuiz() {
    if (!state.quiz.instance) {
        const { Quiz } = await import('../components/quiz.js');
        state.quiz.instance = new Quiz({
            state,
            recipesData,
            applyTranslations,
        });
    }
    state.quiz.instance.start();
}

export function initEventListeners() {
    document.body.addEventListener('click', async (e) => {
        const target = e.target;
        
        // --- Landing Page Mobile Buttons ---
        if (target.closest('#enterLabBtn')) {
            await renderView('recipeFormulas');
            return;
        }
        if (target.closest('#findMyColorBtn')) {
            openModal('quizModal');
            initializeAndStartQuiz();
            return;
        }
        
        // --- Ultimate Button Logic ---
        if (target.closest('#ultimateCtaBtn')) {
            if (state.ui.currentView === 'home') {
                await renderView('recipeFormulas');
            } else if (state.ui.currentView === 'recipeFormulas') {
                toggleUltimateActionsMenu();
            }
            return;
        }

        // --- Ultimate Actions Menu Logic ---
        if (target.closest('#ultimateQuizBtn')) {
            toggleUltimateActionsMenu(true);
            openModal('quizModal');
            initializeAndStartQuiz();
            return;
        }
        if (target.closest('#ultimateContributeBtn')) {
            toggleUltimateActionsMenu(true);
            openModal('contributionNoteModal');
            return;
        }
        if (!target.closest('#ultimateButtonWrapper')) {
            toggleUltimateActionsMenu(true);
        }
        
        const langBtn = target.closest('.lang-btn-slider');
        const recipeItem = target.closest('.recipe-item');
        const collageItem = target.closest('.collage-item');
        const d3Node = target.closest('.color-map-node-group');

        if (d3Node) {
            if (state.ui.currentView === 'home') {
                const recipeId = select(d3Node).datum().id;
                await renderView('recipeFormulas', recipeId);
            } else {
                handleRecipeSelection(select(d3Node).datum().id);
            }
            return;
        }
        
        if (target.closest('#homeBtn')) { await renderView('home'); return; }
        if (target.closest('#backToListBtn') || target.closest('#backToChartBtn')) { resetToChartView(); return; }
        
        if (target.closest('#quizShortcutBtn')) {
            openModal('quizModal');
            initializeAndStartQuiz();
            return;
        }

        if (langBtn) {
            const newLang = langBtn.id === 'langEN' ? 'en' : 'vi';
            setLanguage(newLang);
            updateLangSlider();
            applyTranslations();
            if (state.ui.currentView === 'recipeFormulas') {
                renderLibraryList();
                renderLibraryDetails();
                renderColorMapChart('#colorMapContainer', recipesData);
            } else if (state.ui.currentView === 'home') {
                renderColorMapChart('#homeColorMapContainer', recipesData);
            }
            return;
        }

        if (recipeItem) { handleRecipeSelection(recipeItem.dataset.recipeId); return; }
        if (collageItem) { openLightbox(collageItem.dataset.recipeId, collageItem.dataset.index); return; }

        if (target.closest('#downloadPngBtn')) { generateRecipeCardPng(target.closest('#downloadPngBtn').dataset.recipeId); return; }
        
        if (target.closest('#downloadQuizResultPngBtn')) {
            const button = target.closest('#downloadQuizResultPngBtn');
            const elementId = button.dataset.elementId;
            const recipeName = button.dataset.recipeName;
            generateRecipePng(elementId, recipeName);
            return;
        }

        if (target.closest('#shareRecipeBtn')) { shareRecipe(target.closest('#shareRecipeBtn').dataset.recipeId); return; }
        if (target.closest('#tweakWithAIBtn')) {
            const { openAILab } = await import('../components/ai-lab/ai-lab.js');
            openAILab(target.closest('#tweakWithAIBtn').dataset.recipeId);
            return;
        }
        
        if(target.closest('.filter-btn')) {
            const filter = target.closest('.filter-btn').dataset.filter;
            state.ui.filter = filter;
            renderLibraryList();
            return;
        }

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
            if (target.closest('#closeQuizBtn')) { closeModal('quizModal'); state.quiz.instance?.close(); return; }
            if (target.closest('#retakeQuizBtn')) { state.quiz.instance?.start(); return; }
            if (target.closest('#viewResultBtn')) {
                const recipeId = target.closest('#viewResultBtn').dataset.recipeId;
                closeModal('quizModal');
                await renderView('recipeFormulas', recipeId);
                return;
            }
            if (target.closest('.quiz-option')) { state.quiz.instance?.handleAnswer(e); return; }
            if (target.closest('#submitQuizBtn')) { state.quiz.instance?.submitQuiz(); return; }
            if (target.closest('.quiz-clarification-option')) {
                state.quiz.instance?.handleClarification(target.textContent.trim());
                return;
            }
        }

        if (target.closest('#contributionNoteModal')) {
            if (target.closest('#closeContributionNoteBtn') || target.closest('#closeContributionNoteBtn2')) {
                closeModal('contributionNoteModal');
                return;
            }
            if (target.closest('#proceedToGooglePhotosBtn')) {
                setTimeout(() => closeModal('contributionNoteModal'), 300);
                return;
            }
        }

        if (target.closest('#aiLabModal')) {
            const { closeAILab, handleAIGeneration, confirmAndCallAI } = await import('../components/ai-lab/ai-lab.js');
            const { renderAILab } = await import('../components/ai-lab/ai-lab-ui.js');

            if (target.closest('#closeAILabBtn')) { closeAILab(); return; }
            if (target.closest('#cancelAIBtn')) { state.ai.userPrompt = ''; state.ai.generatedRecipe = null; renderAILab(); return; }
            if (target.closest('#generateAIBtn')) { handleAIGeneration(); return; }
            if (target.closest('#confirmAIBtn')) { confirmAndCallAI(); return; }
            if (target.closest('#downloadAIPngBtn')) { generateRecipeCardPng(target.closest('#downloadAIPngBtn').dataset.recipeId, state.ai.generatedRecipe); return; }
        }
    });

    document.body.addEventListener('mouseover', (e) => {
        const title = e.target.closest('.parameter-title');
        const tooltipEl = document.getElementById('infoTooltip');
        if (title && tooltipEl) {
            const key = title.dataset.paramKey;
            const explanation = parameterExplanations[key]?.[state.language];
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
}
