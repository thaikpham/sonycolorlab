// File Path: src/services/recipe-service.js
import { state } from './state.js';
import { updateListSelectionAndScroll } from './ui.js';
import { renderLibraryDetails } from '../components/recipe-list/recipe-list-ui.js';
import { updateChartSelection } from './features.js';
import recipesData from './recipes.js';

export function handleRecipeSelection(id) {
    state.ui.selectedRecipeId = (state.ui.selectedRecipeId === id) ? null : id;
    state.ui.isMobileDetailActive = !!state.ui.selectedRecipeId;

    // --- Update URL Parameter ---
    const newUrl = new URL(window.location);
    if (state.ui.selectedRecipeId) {
        newUrl.searchParams.set('id', state.ui.selectedRecipeId);
    } else {
        newUrl.searchParams.delete('id');
    }
    window.history.pushState({}, '', newUrl);
    // ----------------------------

    updateListSelectionAndScroll(state.ui.selectedRecipeId);
    renderLibraryDetails();
    updateChartSelection();

    if (state.ui.selectedRecipeId) {
        const recipe = recipesData.find(r => r.id === state.ui.selectedRecipeId);
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

export function resetToChartView() {
    state.ui.selectedRecipeId = null;
    state.ui.isMobileDetailActive = false;

    // --- Reset URL Parameter ---
    const newUrl = new URL(window.location);
    newUrl.searchParams.delete('id');
    window.history.pushState({}, '', newUrl);
    // ---------------------------

    updateListSelectionAndScroll(null);
    renderLibraryDetails();
    updateChartSelection();
}
