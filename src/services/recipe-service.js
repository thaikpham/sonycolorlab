// File Path: src/services/recipe-service.js
import { supabase } from './supabase-client.js';
import { state } from './state.js';
import { updateListSelectionAndScroll, renderComments, showLoadingOverlay, hideLoadingOverlay } from './ui.js';
import { renderLibraryDetails } from '../components/recipe-list/recipe-list-ui.js';
import { updateChartSelection } from './features.js';
import { onCommentsSnapshot } from './firestore.js';

let unsubscribeComments = null;

function mapSupabaseDataToRecipes(data) {
    if (!data) return [];
    return data.map(item => ({
        ...item,
        image: item.image,
        parameters: typeof item.parameters === 'string' ? JSON.parse(item.parameters) : item.parameters || {},
        coords: typeof item.coords === 'string' ? JSON.parse(item.coords) : item.coords || {},
        tags: Array.isArray(item.tags) ? item.tags : []
    }));
}

export async function getAllRecipes() {
    showLoadingOverlay();
    try {
        const { data, error } = await supabase.from('recipes').select('*');
        if (error) throw error;
        const mappedData = mapSupabaseDataToRecipes(data);
        state.allRecipes = mappedData;
        state.recipes = mappedData; // Initialize recipes with all data
        return state.allRecipes;
    } catch (error) {
        console.error('Error fetching all recipes:', error);
        return [];
    } finally {
        hideLoadingOverlay();
    }
}

export function getInitialRecipes() {
    state.recipes = state.allRecipes;
    return state.recipes;
}

export async function getRecipeById(id) {
    showLoadingOverlay();
    try {
        const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single();
        if (error) throw error;
        return mapSupabaseDataToRecipes([data])[0];
    } catch (error) {
        console.error(`Error fetching recipe by id ${id}:`, error);
        return null;
    } finally {
        hideLoadingOverlay();
    }
}

export async function searchRecipes(query) {
    showLoadingOverlay();
    try {
        const { data, error } = await supabase.from('recipes').select('*').or(`name.ilike.%${query}%,description.ilike.%${query}%,camera.ilike.%${query}%`);
        if (error) throw error;
        state.recipes = mapSupabaseDataToRecipes(data);
        return state.recipes;
    } catch (error) {
        console.error(`Error searching recipes for query "${query}":`, error);
        return [];
    } finally {
        hideLoadingOverlay();
    }
}

export async function getRecipesByTag(tag) {
    showLoadingOverlay();
    try {
        const { data, error } = await supabase.from('recipes').select('*').contains('tags', [tag]);
        if (error) throw error;
        state.recipes = mapSupabaseDataToRecipes(data);
        return state.recipes;
    } catch (error) {
        console.error(`Error fetching recipes by tag "${tag}":`, error);
        return [];
    } finally {
        hideLoadingOverlay();
    }
}


export async function handleRecipeSelection(id) {
    // Unsubscribe from previous listener if it exists
    if (unsubscribeComments) {
        unsubscribeComments();
        unsubscribeComments = null;
    }

    state.ui.selectedRecipeId = (state.ui.selectedRecipeId === id) ? null : id;
    state.ui.isMobileDetailActive = !!state.ui.selectedRecipeId;

    updateListSelectionAndScroll(state.ui.selectedRecipeId);
    await renderLibraryDetails(); // This now includes the comment section structure
    updateChartSelection();

    if (state.ui.selectedRecipeId) {
        // Subscribe to new comments in real-time
        unsubscribeComments = onCommentsSnapshot(state.ui.selectedRecipeId, (comments) => {
            // Ensure the detail view is still visible for this recipe before rendering
            if (state.ui.selectedRecipeId === id) {
                renderComments(comments);
            }
        });

        const recipe = state.allRecipes.find(r => r.id === state.ui.selectedRecipeId);
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
