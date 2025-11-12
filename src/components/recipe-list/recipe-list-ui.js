import getLang from '../../services/language.js'; // SỬA LỖI BUILD: Import default (bỏ {})
import { getRecipeTitle, getRecipeDescription } from '../../services/recipes.js';
import { state } from '../../services/state.js';

/**
 * Creates the HTML markup for the recipe list.
 * @param {Array<Object>} recipes - The list of recipe objects.
 * @returns {string} The HTML string for the recipe list.
 */
export function createRecipeListHTML(recipes) {
    if (!recipes || recipes.length === 0) {
        // Hàm getLang vẫn được sử dụng ở đây
        return `<p class="text-gray-500">${getLang('no_recipes_found')}</p>`;
    }

    const listItems = recipes.map(recipe => createRecipeListItemHTML(recipe)).join('');
    return `<ul id="recipe-list-items" class="space-y-2">${listItems}</ul>`;
}

/**
 * Creates the HTML markup for a single recipe list item.
 * @param {Object} recipe - The recipe object.
 * @returns {string} The HTML string for the recipe list item.
 */
export function createRecipeListItemHTML(recipe) {
    // SỬA LỖI LOGIC (GIỮ NGUYÊN): Sử dụng getRecipeTitle và getRecipeDescription
    const title = getRecipeTitle(recipe);
    const description = getRecipeDescription(recipe);

    const isFavorite = state.userFavorites.includes(recipe.id);
    const hasImage = recipe.hasImage || false;

    // Xác định icon yêu thích (sao)
    const starIcon = isFavorite 
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-yellow-400 flex-shrink-0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star text-gray-400 flex-shrink-0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;

    // Xác định icon hình ảnh
    const imageIcon = hasImage
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image text-teal-500 flex-shrink-0"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>`
        : ``;

    return `
        <li id="recipe-item-${recipe.id}" class="recipe-list-item p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border-2 border-transparent" data-recipe-id="${recipe.id}">
            <div class="flex justify-between items-start">
                <span class="font-semibold text-primary pr-2">${title}</span>
                <div class="flex items-center gap-2 pt-1">
                    ${imageIcon}
                    ${starIcon}
                </div>
            </div>
            ${description ? `<p class="text-sm text-gray-600 mt-1 truncate">${description}</p>` : ''}
        </li>
    `;
}
