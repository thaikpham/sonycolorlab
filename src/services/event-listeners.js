// File Path: src/services/event-listeners.js
import { select } from 'd3-selection';
import { state } from './state.js';
import { openModal, closeModal, toggleUltimateActionsMenu, showToast } from './ui.js';
import { renderLibraryList, renderLibraryDetails } from '../components/recipe-list/recipe-list-ui.js';
import { setLanguage, updateLangSlider, applyTranslations, getCurrentLanguage, t } from './language.js';
import { renderColorMapChart, openLightbox, generateRecipeCardPng, shareRecipe, generateRecipePng } from './features.js';
import { handleRecipeSelection, resetToChartView } from './recipe-service.js';
import { renderView } from './view-manager.js';
import { parameterExplanations } from './translations.js';
import recipesData from './recipes.js';
import { signInWithGoogle, handleSignOut } from './auth.js';
import { addComment, toggleFavorite, getFavoriteRecipes, saveOrUpdateGeneratedRecipe, updateUserProfile, submitDemoPhoto } from './firestore.js';

// Helper function to read recipe data from an editable form
function getRecipeDataFromForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return null;

    const lang = getCurrentLanguage();
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
        
        // --- Authentication & User Dropdown ---
        if (target.closest('#signInGoogleBtn')) { signInWithGoogle(); return; }
        if (target.closest('#signOutBtn')) { handleSignOut(); return; }
        if (target.closest('#myProfileBtn')) { await renderView('userProfile'); return; }

        
        // Toggle user dropdown
        const avatarBtn = target.closest('#avatarBtn');
        const userDropdown = document.getElementById('userDropdown');
        if (avatarBtn) {
            userDropdown?.classList.toggle('invisible');
            userDropdown?.classList.toggle('opacity-0');
            userDropdown?.classList.toggle('-translate-y-2');
            userDropdown?.classList.toggle('pointer-events-none');
            return;
        }
        // Close dropdown if clicking outside
        if (userDropdown && !userDropdown.classList.contains('invisible') && !target.closest('#userDropdown')) {
             userDropdown.classList.add('invisible', 'opacity-0', '-translate-y-2', 'pointer-events-none');
        }

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
        
        if (target.closest('#favoriteBtn')) {
            if (!state.auth.isLoggedIn) {
                showToast("Please log in to save recipes.", true);
                return;
            }
            const recipeId = target.closest('#favoriteBtn').dataset.recipeId;
            await toggleFavorite(state.auth.user.uid, recipeId);
            state.auth.favorites = await getFavoriteRecipes(state.auth.user.uid);
            renderLibraryDetails();
            renderLibraryList();
            return;
        }
        
        if(target.closest('.filter-btn')) {
            const filter = target.closest('.filter-btn').dataset.filter;
            state.ui.filter = filter;
            renderLibraryList();
            return;
        }

        if (target.closest('#saveAIGeneratedRecipeBtn')) {
            if (!state.auth.isLoggedIn) {
                showToast(t('logInToSave'), true);
                return;
            }
            const recipeData = getRecipeDataFromForm('aiRecipeForm');

            if (recipeData) {
                const btn = target.closest('#saveAIGeneratedRecipeBtn');
                const originalBtnContent = btn.innerHTML;
                btn.innerHTML = `<div class="loader"></div>`;
                btn.disabled = true;
    
                const newDocId = await saveOrUpdateGeneratedRecipe(state.auth.user.uid, recipeData);
    
                if (newDocId) {
                    if (!recipeData.id || recipeData.id.startsWith('SCL-AI-')) {
                         if (state.ai.editableRecipe) state.ai.editableRecipe.id = newDocId;
                         if (state.quiz.editableRecipe) state.quiz.editableRecipe.id = newDocId;
                    }
                    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check h-5 w-5"></svg><span>${t('favoritedBtn')}</span>`;
                } else {
                    btn.innerHTML = originalBtnContent;
                    btn.disabled = false;
                }
            }
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

        // Profile Page specific listeners
        if (state.ui.currentView === 'userProfile') {
            const { openEditProfileModal, openDemoPhotoSubmitModal } = await import('../components/profile-ui.js');
            
            if (target.closest('#editProfileBtn')) {
                openEditProfileModal();
                return;
            }
            if (target.closest('#openDemoPhotoModalBtn')) {
                openDemoPhotoSubmitModal();
                return;
            }
            const recipeCard = target.closest('.generated-recipe-card');
            if (recipeCard) {
                 if (recipeCard.dataset.recipe) {
                    try {
                        const recipeData = JSON.parse(recipeCard.dataset.recipe);
                        const { openAILabWithExistingRecipe } = await import('../components/ai-lab/ai-lab.js');
                        openAILabWithExistingRecipe(recipeData);
                    } catch (error) {
                        console.error("Failed to parse recipe data:", error, recipeCard.dataset.recipe);
                        showToast(t('genericError'), true);
                    }
                }
                return;
            }
        }
    });
    
    document.body.addEventListener('submit', async (e) => {
        if (e.target.id === 'commentForm') {
            e.preventDefault();
            const form = e.target;
            const recipeId = form.dataset.recipeId;
            const input = form.querySelector('#commentInput');
            const text = input.value;
            
            if (text.trim() && state.auth.user) {
                await addComment(recipeId, state.auth.user, text);
                input.value = ''; // Clear input on success
            }
        }
        if (e.target.id === 'editProfileForm') {
            e.preventDefault();
            const { closeEditProfileModal } = await import('../components/profile-ui.js');
            const formData = new FormData(e.target);
            const socialData = {
                instagram: formData.get('instagram'),
                threads: formData.get('threads'),
                website: formData.get('website'),
            };
            await updateUserProfile(state.auth.user.uid, socialData);
            closeEditProfileModal();
            renderView('userProfile'); // Re-render to show changes
        }
        if (e.target.id === 'demoPhotoSubmitForm') {
            e.preventDefault();
            const { closeDemoPhotoSubmitModal } = await import('../components/profile-ui.js');
            const formData = new FormData(e.target);
            const photoData = {
                photoURL: formData.get('photoURL'),
                recipeId: formData.get('recipeId'),
                caption: formData.get('caption'),
                description: formData.get('description'),
            };
            await submitDemoPhoto(state.auth.user.uid, photoData);
            closeDemoPhotoSubmitModal();
            // Optionally, re-render the profile view to show the new submission
            renderView('userProfile');
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
}
