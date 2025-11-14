// File Path: src/router.js
import { state } from './services/state.js';
import { supabase } from '../supabaseClient.js';
import { renderLibraryDetails } from './components/recipe-list/recipe-list-ui.js';
import { renderView } from './services/view-manager.js';

export async function handleRouting() {
    const path = window.location.pathname;
    const slug = path.substring(1);

    if (slug) {
        await fetchRecipeBySlug(slug);
        renderView('recipeFormulas'); // Make sure the recipe view is active
    } else {
        renderView('home');
    }
}

async function fetchRecipeBySlug(slug) {
    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('formattedName', slug)
        .single();

    if (error) {
        console.error('Error fetching recipe by slug:', error);
        // Handle recipe not found, e.g., show a 404 message or redirect
        return;
    }

    if (data) {
        state.ui.selectedRecipeId = data.id;
        // If recipes haven't been loaded yet, add this one to the list
        if (!state.recipes.find(r => r.id === data.id)) {
            state.recipes.push(data);
        }
        renderLibraryDetails();
    }
}

export function updateURLForRecipe(recipeId) {
    const recipe = state.recipes.find(r => r.id === recipeId);
    if (recipe) {
        const slug = recipe.formattedName;
        history.pushState({ recipeId }, ``, `/${slug}`);
    } else {
        history.pushState({}, '', '/');
    }
}
