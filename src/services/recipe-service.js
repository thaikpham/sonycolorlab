// File Path: src/services/recipe-service.js
import { state } from './state.js';
import { updateListSelectionAndScroll, renderComments, showLoadingIndicator, hideLoadingIndicator } from './ui.js';
import { renderLibraryDetails } from '../components/recipe-list/recipe-list-ui.js';
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

        // Custom sorting logic
        const getSortKeys = (name) => {
            const match = name.match(/^(SCL|PROCOLOR)-?(\d+)/i);
            if (match) {
                const prefix = match[1].toUpperCase();
                const number = parseInt(match[2], 10);
                // Prioritize SCL over PROCOLOR, then sort by number
                return [prefix === 'SCL' ? 0 : 1, number];
            }
            // Place items that don't match the pattern at the end
            return [2, name];
        };

        data.sort((a, b) => {
            const [prefixA, numberA] = getSortKeys(a.formattedName);
            const [prefixB, numberB] = getSortKeys(b.formattedName);

            if (prefixA !== prefixB) {
                return prefixA - prefixB;
            }
            if (numberA !== numberB) {
                return numberA - numberB;
            }
            return a.formattedName.localeCompare(b.formattedName);
        });

        state.recipes = data;
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

export function resetToListView() {
    // Unsubscribe from comment listener when leaving detail view
    if (unsubscribeComments) {
        unsubscribeComments();
        unsubscribeComments = null;
    }

    state.ui.selectedRecipeId = null;
    state.ui.isMobileDetailActive = false;
    updateListSelectionAndScroll(null);
    renderLibraryDetails();
    updateURLForRecipe(null);
}
