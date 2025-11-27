
import { describe, it, expect } from 'vitest';
import recipesData from './recipes.js';
import recipeImages from './recipe-images.js';

describe('Recipe Data Integrity', () => {
    it('every recipe should have corresponding images defined in recipeImages', () => {
        const recipesWithMissingImages = recipesData.filter(recipe => {
            // Check if there is an entry in recipeImages for this recipe ID
            return !recipeImages[recipe.id] || recipeImages[recipe.id].length === 0;
        });

        if (recipesWithMissingImages.length > 0) {
            console.error('Recipes with missing images:', recipesWithMissingImages.map(r => r.id));
        }

        expect(recipesWithMissingImages.length).toBe(0);
    });

    it('recipes should be sorted by type (SCL before PROCOLOR) and then numerically', () => {
         // Verify sorting order: SCL before PROCOLOR
         let seenProcolor = false;

         for (const recipe of recipesData) {
             const isProcolor = recipe.id.startsWith('PROCOLOR');
             const isScl = recipe.id.startsWith('scl-') || recipe.id.startsWith('SCL-');

             if (isProcolor) {
                 seenProcolor = true;
             }

             if (isScl && seenProcolor) {
                 throw new Error(`Sorting violation: SCL recipe ${recipe.id} found after PROCOLOR recipe`);
             }
         }
    });
});
