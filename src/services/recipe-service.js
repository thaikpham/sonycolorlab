// File Path: src/services/recipe-service.js
import { state } from './state.js';
import { updateListSelectionAndScroll } from './ui.js';
import { renderComments } from '../components/ui/Comments.js';
import { renderLibraryDetails } from '../components/recipe-list/recipe-list-ui.js';
import { updateChartSelection } from './features.js';
import recipesData from './recipes.js';
import { onCommentsSnapshot } from './firestore.js';

let unsubscribeComments = null;

export function handleRecipeSelection(id) {
    // Unsubscribe from previous listener if it exists
    if (unsubscribeComments) {
        unsubscribeComments();
        unsubscribeComments = null;
    }

    state.ui.selectedRecipeId = (state.ui.selectedRecipeId === id) ? null : id;
    state.ui.isMobileDetailActive = !!state.ui.selectedRecipeId;

    updateListSelectionAndScroll(state.ui.selectedRecipeId);
    renderLibraryDetails(); // This now includes the comment section structure
    updateChartSelection();

    if (state.ui.selectedRecipeId) {
        // Subscribe to new comments in real-time
        unsubscribeComments = onCommentsSnapshot(state.ui.selectedRecipeId, (comments) => {
            // Ensure the detail view is still visible for this recipe before rendering
            if (state.ui.selectedRecipeId === id) {
                renderComments(comments);
            }
        });

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
    // Unsubscribe from comment listener when leaving detail view
    if (unsubscribeComments) {
        unsubscribeComments();
        unsubscribeComments = null;
    }

    state.ui.selectedRecipeId = null;
    state.ui.isMobileDetailActive = false;
    updateListSelectionAndScroll(null);
    renderLibraryDetails();
    updateChartSelection();
}
