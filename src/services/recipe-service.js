import { state } from './state.js';
import { updateListSelectionAndScroll } from './ui.js';
import { renderLibraryDetails } from '../components/recipe-list/recipe-list-ui.js';
import { updateChartSelection } from './features.js';
import recipesData from './recipes.js';

export function handleRecipeSelection(id) {
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

export function resetToChartView() {
    state.selectedRecipeId = null;
    state.isMobileDetailActive = false;
    updateListSelectionAndScroll(null);
    renderLibraryDetails();
    updateChartSelection();
}
