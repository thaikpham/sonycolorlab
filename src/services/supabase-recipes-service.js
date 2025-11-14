import { supabase } from '../../supabaseClient.js';

export async function getAllRecipes() {
    const { data, error } = await supabase.from('recipes').select('*');
    if (error) {
        console.error('Failed to load recipes:', error);
        return [];
    }
    return data.map(recipe => {
        let name, description;
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
        return { ...recipe, name, description };
    });
}

export async function getRecipeByFormattedName(formattedName) {
    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('formattedName', formattedName)
        .single();
    if (error) {
        console.error('Failed to load recipe:', error);
        return null;
    }
    let name, description;
    try {
        name = typeof data.name === 'string' ? JSON.parse(data.name) : data.name;
    } catch {
        name = { en: data.name, vi: data.name };
    }
    try {
        description = typeof data.description === 'string' ? JSON.parse(data.description) : data.description;
    } catch {
        description = { en: data.description, vi: data.description };
    }
    return { ...data, name, description };
}
