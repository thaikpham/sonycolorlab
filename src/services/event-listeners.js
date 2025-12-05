// File Path: src/services/event-listeners.js
// D3 removed
import { state } from './state.js';
import { openModal, closeModal, showToast } from './ui.js';
import { renderLibraryList, renderLibraryDetails } from '../components/recipe-list/recipe-list-ui.js';
import { setLanguage, updateLangSlider, applyTranslations, t } from './language.js';
// renderColorMapChart removed
import { openLightbox, generateRecipeCardPng, shareRecipe, generateRecipePng, renderMenuPath, updateMenuSystemUI } from './features.js';
import { handleRecipeSelection, resetToChartView } from './recipe-service.js';
import { renderView } from './view-manager.js';
import { parameterExplanations } from './parameterExplanations.js';
import recipesData from './recipes.js';

export function initEventListeners() {
    document.body.addEventListener('click', async (e) => {
        const target = e.target;
        
        // --- Landing Page Mobile Buttons ---
        if (target.closest('#enterLabBtn')) {
            await renderView('recipeFormulas');
            return;
        }
        // Find My Color (Quiz) removed
        
        const recipeItem = target.closest('.recipe-item');
        const collageItem = target.closest('.collage-item');
        // d3Node logic removed

        // Handle Home Button (both the header button and the new sidebar logo)
        if (target.closest('#homeBtn') || target.closest('#sidebarLogoBtn')) { 
            await renderView('home'); 
            // Also reset selection if we are "going home"
            resetToChartView(); 
            return; 
        }

        if (target.closest('#backToListBtn') || target.closest('#backToChartBtn')) { resetToChartView(); return; }
        
        // Guide Interactions
        
        // 1. Menu System Toggles
        if (target.closest('.guide-menu-btn')) {
            const btn = target.closest('.guide-menu-btn');
            const system = btn.dataset.menu;
            state.guide.menuSystem = system;
            updateMenuSystemUI(system);
            renderMenuPath();
            return;
        }

        // 2. Video Thumbnail Click (New Feature)
        if (target.closest('.video-thumbnail-wrapper')) {
            const wrapper = target.closest('.video-thumbnail-wrapper');
            const videoId = wrapper.dataset.videoId;
            if (videoId) {
                wrapper.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
                wrapper.classList.remove('cursor-pointer', 'group'); // Remove pointer behavior once playing
            }
            return;
        }

        // 3. Checklist Items
        if (target.closest('.guide-checklist-item')) {
            const item = target.closest('.guide-checklist-item');
            const circle = item.querySelector('.check-circle');
            if (circle) {
                circle.classList.toggle('bg-orange-500');
                circle.classList.toggle('border-transparent');
                // Optional: Change icon color if needed, currently CSS handles bg
                circle.style.color = circle.classList.contains('bg-orange-500') ? 'white' : '';
            }
            return;
        }

        // 4. Ingredient Cards Toggle
        if (target.closest('.guide-ingredient-card')) {
            const card = target.closest('.guide-ingredient-card');
            const ingredientId = card.dataset.ingredient;
            const desc = document.getElementById(`desc-${ingredientId}`);
            if (desc) {
                if (desc.classList.contains('hidden')) {
                    desc.classList.remove('hidden');
                    desc.classList.add('block');
                } else {
                    desc.classList.add('hidden');
                    desc.classList.remove('block');
                }
            }
            return;
        }

        // Language switcher removed

        if (recipeItem) { handleRecipeSelection(recipeItem.dataset.recipeId); return; }
        if (collageItem) { openLightbox(collageItem.dataset.recipeId, collageItem.dataset.index); return; }

        if (target.closest('#downloadPngBtn')) { generateRecipeCardPng(target.closest('#downloadPngBtn').dataset.recipeId); return; }
        
        // Quiz result PNG download removed

        if (target.closest('#shareRecipeBtn')) { shareRecipe(target.closest('#shareRecipeBtn').dataset.recipeId); return; }
        
        // --- AI Features ---
        if (target.closest('#tweakWithAIBtn')) {
            const { openAILab } = await import('../components/ai-lab/ai-lab.js');
            openAILab(target.closest('#tweakWithAIBtn').dataset.recipeId);
            return;
        }

        // New Color Baking (AI Creative Lab)
        if (target.closest('#openNewColorBakingBtn')) {
            const { openNewColorBaking } = await import('../components/ai-lab/ai-lab.js');
            openNewColorBaking();
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
            const { closeAILab, handleAIGeneration, confirmAndCallAI, toggleAITag } = await import('../components/ai-lab/ai-lab.js');
            const { renderAILab } = await import('../components/ai-lab/ai-lab-ui.js');

            if (target.closest('#closeAILabBtn') || target.closest('#closeAILabBtn2')) { closeAILab(); return; }
            if (target.closest('#cancelAIBtn')) { state.ai.userPrompt = ''; state.ai.generatedRecipe = null; renderAILab(); return; }
            if (target.closest('#generateAIBtn') || target.closest('#startBakingBtn')) { handleAIGeneration(); return; }
            if (target.closest('#confirmAIBtn')) { confirmAndCallAI(); return; }
            if (target.closest('#downloadAIPngBtn')) { generateRecipeCardPng(target.closest('#downloadAIPngBtn').dataset.recipeId, state.ai.generatedRecipe); return; }
            
            // Tag handling
            if (target.closest('.ai-tag-btn')) {
                const btn = target.closest('.ai-tag-btn');
                const tag = btn.dataset.tag;
                toggleAITag(tag);
                return;
            }
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
