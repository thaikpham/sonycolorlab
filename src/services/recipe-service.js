// File Path: src/services/recipe-service.js
import { state } from './state.js';
import { updateListSelectionAndScroll, renderComments, showLoadingIndicator, hideLoadingIndicator } from './ui.js';
import { renderLibraryDetails } from '../components/recipe-list/recipe-list-ui.js';
import { updateChartSelection } from './features.js';
import { supabase } from '../../supabaseClient.js';
import { onCommentsSnapshot } from './firestore.js';
import { updateURLForRecipe } from '../router.js';

let unsubscribeComments = null;

export async function fetchRecipes() {
    showLoadingIndicator();
    try {
        const { data, error } = await supabase.from('recipes').select('*');
        if (error) {
            console.error('Error fetching recipes:', error);
            // Implement graceful fallback
            state.recipes = [];
            return;
        }
        state.recipes = data.map(recipe => {
            let name, description, coords;
            try {
                name = typeof recipe.name === 'string' ? JSON.parse(recipe.name) : recipe.name;
            } catch {
                name = { en: recipe.name, vi: recipe.name };
            }
            try {
                description = typeof recipe.description === 'string' ? JSON.parse(recipe.description) : recipe.description;
            } catch {
                description = { en: recipe.description, vi: recipe.description };
            }
            try {
                coords = typeof recipe.coords === 'string' ? JSON.parse(recipe.coords) : recipe.coords;
            } catch {
                coords = { x: 0, y: 0 };
            }
            return { ...recipe, name, description, coords: { x: Number(coords?.x ?? 0), y: Number(coords?.y ?? 0) } };
        });
        window.__RECIPES_LOADED__ = true;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        state.recipes = [];
    } finally {
        hideLoadingIndicator();
    }
}


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

    updateURLForRecipe(state.ui.selectedRecipeId);

    if (state.ui.selectedRecipeId) {
        // Subscribe to new comments in real-time
        unsubscribeComments = onCommentsSnapshot(state.ui.selectedRecipeId, (comments) => {
            // Ensure the detail view is still visible for this recipe before rendering
            if (state.ui.selectedRecipeId === id) {
                renderComments(comments);
            }
        });

        const recipe = state.recipes.find(r => r.id === state.ui.selectedRecipeId);
        if (recipe) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'view_recipe',
                recipe_id: recipe.id,
                recipe_name: recipe.name ? recipe.name.en : '',
                recipe_name_vi: recipe.name ? recipe.name.vi : ''
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
    updateURLForRecipe(null);
}
