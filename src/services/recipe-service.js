import recipesData from './recipes.js';
import { state } from './state.js';
// SỬA LỖI BUILD: Chuyển renderLibraryDetails sang import từ ui.js
import { updateListSelectionAndScroll, renderComments } from './ui.js';
// GỠ BỎ: Dòng import sai trỏ đến recipe-list-ui.js
import { renderLibraryDetails } from '../components/recipe-list/recipe-list-ui.js';
import { updateChartSelection } from './features.js';
import { getRecipeImages } from './recipe-images.js';

// SỬA LỖI BUILD: Import 'db' từ file wrapper (đã đúng)
import { db } from './firestore.js';
import { auth } from './auth.js';
// HOÀN TÁC: Import các hàm firestore trực tiếp từ 'firebase/firestore'
// Lỗi "resolve" này sẽ được sửa trong file vite.config.js
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

/**
 * Selects a recipe, updates the UI, and fetches its details.
 * @param {string} recipeId - The ID of the recipe to select.
 */
export async function selectRecipe(recipeId) {
    if (!recipeId) return;

    const recipe = recipesData.find(r => r.id === recipeId);
    if (!recipe) {
        console.error('Selected recipe not found:', recipeId);
        return;
    }

    state.selectedRecipe = recipe;
    state.selectedRecipeId = recipeId;

    // Update UI
    updateListSelectionAndScroll(recipeId);
    renderLibraryDetails(recipe); // Hàm này bây giờ được import đúng từ ui.js
    renderComments(recipe.comments || []);

    // Update chart
    updateChartSelection(recipe.id);

    // Fetch images if they haven't been fetched
    if (!recipe.imageUrls) {
        await getRecipeImages(recipe);
        // Re-render details if images were fetched
        renderLibraryDetails(recipe);
    }
}

/**
 * Toggles the favorite status of a recipe.
 * @param {string} recipeId - The ID of the recipe.
 */
export async function toggleFavorite(recipeId) {
    if (!auth.currentUser) {
        console.error("User not authenticated to toggle favorite.");
        return;
    }
    const userId = auth.currentUser.uid;
    // Giả sử 'users' là collection của bạn
    const userDocRef = doc(db, 'users', userId); 

    let isFavorite = false;

    try {
        const userDoc = await getDoc(userDocRef);
        
        // Kiểm tra xem người dùng đã tồn tại và đã favorited công thức này chưa
        if (userDoc.exists() && userDoc.data().favorites && userDoc.data().favorites.includes(recipeId)) {
            // Remove from favorites
            await updateDoc(userDocRef, {
                favorites: arrayRemove(recipeId)
            });
            state.userFavorites = state.userFavorites.filter(id => id !== recipeId);
            isFavorite = false;
        } else {
            // Add to favorites
            // Sử dụng { merge: true } để tạo document nếu chưa tồn tại, hoặc thêm field 'favorites'
            await updateDoc(userDocRef, {
                favorites: arrayUnion(recipeId)
            }, { merge: true });
            
            if (!state.userFavorites.includes(recipeId)) {
                state.userFavorites.push(recipeId);
            }
            isFavorite = true;
        }
        
        // Update UI (e.g., the star icon)
        const recipeItem = document.getElementById(`recipe-item-${recipeId}`);
        if (recipeItem) {
            const starIcon = recipeItem.querySelector('.lucide-star, .text-yellow-400');
            if (starIcon) {
                if (isFavorite) {
                    starIcon.outerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-yellow-400 flex-shrink-0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
                } else {
                    starIcon.outerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star text-gray-400 flex-shrink-0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
                }
            }
        }
    } catch (error) {
        console.error("Error toggling favorite: ", error);
    }
}

export function handleRecipeSelection(recipeId) {
    selectRecipe(recipeId);
}

export function resetToChartView() {
    state.selectedRecipe = null;
    state.selectedRecipeId = null;
    updateListSelectionAndScroll(null);
    renderLibraryDetails(null);
    updateChartSelection();
}
