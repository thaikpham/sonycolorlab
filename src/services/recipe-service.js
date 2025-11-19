// File Path: src/services/recipe-service.js
import { state } from './state.js';
import { updateListSelectionAndScroll } from './ui.js';
import { renderLibraryDetails } from '../components/recipe-list/recipe-list-ui.js';
import { updateChartSelection } from './features.js';
import { supabase } from '../../supabaseClient.js';

export async function fetchAndSortRecipes() {
    try {
        const { data: recipes, error } = await supabase.from('recipes').select();

        if (error) {
            console.error("Error fetching recipes from Supabase:", error);
            state.recipes = [];
            return [];
        }

        const sortedRecipes = recipes.sort((a, b) => {
            const aIsScl = a.id.startsWith('SCL');
            const bIsScl = b.id.startsWith('SCL');
            const aIsPro = a.id.startsWith('PROCOLOR');
            const bIsPro = b.id.startsWith('PROCOLOR');

            if (aIsScl && bIsPro) return -1;
            if (aIsPro && bIsScl) return 1;

            if ((aIsScl && bIsScl) || (aIsPro && bIsPro)) {
                const aNum = parseInt(a.id.split('-')[1], 10);
                const bNum = parseInt(b.id.split('-')[1], 10);
                return aNum - bNum;
            }

            return a.id.localeCompare(b.id);
        });

        const parsedRecipes = sortedRecipes.map(recipe => {
            try {
                return {
                    ...recipe,
                    name: typeof recipe.name === 'string' ? JSON.parse(recipe.name) : recipe.name,
                    description: typeof recipe.description === 'string' ? JSON.parse(recipe.description) : recipe.description,
                    settings: typeof recipe.settings === 'string' ? JSON.parse(recipe.settings) : recipe.settings,
                    colorDepth: typeof recipe.colorDepth === 'string' ? JSON.parse(recipe.colorDepth) : recipe.colorDepth,
                    detailSettings: typeof recipe.detailSettings === 'string' ? JSON.parse(recipe.detailSettings) : recipe.detailSettings,
                    coords: typeof recipe.coords === 'string' ? JSON.parse(recipe.coords) : recipe.coords,
                    tags: typeof recipe.tags === 'string' ? JSON.parse(recipe.tags) : recipe.tags,
                };
            } catch (e) {
                console.error(`Failed to parse JSON for recipe ${recipe.id}`, e);
                return recipe;
            }
        });

        state.recipes = parsedRecipes;
        return parsedRecipes;

    } catch (error) {
        console.error("Error fetching recipes from Supabase:", error);
        state.recipes = [];
        return [];
    }
}

export function handleRecipeSelection(id) {
    state.ui.selectedRecipeId = (state.ui.selectedRecipeId === id) ? null : id;
    state.ui.isMobileDetailActive = !!state.ui.selectedRecipeId;

    updateListSelectionAndScroll(state.ui.selectedRecipeId);
    renderLibraryDetails();
    updateChartSelection();

    if (state.ui.selectedRecipeId) {
        const recipe = state.recipes.find(r => r.id === state.ui.selectedRecipeId);
        if (recipe) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'view_recipe',
                recipe_id: recipe.id,
                recipe_name: recipe.name.en,
            });
        }
    }
}

export function resetToChartView() {
    state.ui.selectedRecipeId = null;
    state.ui.isMobileDetailActive = false;
    updateListSelectionAndScroll(null);
    renderLibraryDetails();
    updateChartSelection();
}
