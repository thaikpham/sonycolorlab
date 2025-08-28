import { state } from '../../services/state.js';
import { getCurrentLanguage, applyTranslations } from '../../services/language.js';
import { fetchTrendingRecipeIds } from '../../services/api.js';
import recipesData from '../../services/recipes.js';
import recipeImages from '../../services/recipe-images.js';
import { createFullRecipeHTML, formatRecipeName } from '../../services/ui.js';

export async function renderLibraryList() {
    const container = document.getElementById('recipeListContainer');
    if (!container) return;
    const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const trendingIds = await fetchTrendingRecipeIds();

    const recipesToRender = recipesData.filter(r =>
        r.name[getCurrentLanguage()].toLowerCase().includes(searchTerm) ||
        r.description[getCurrentLanguage()].toLowerCase().includes(searchTerm)
    );

    container.innerHTML = recipesToRender.map((recipe, index) => {
        const isSelected = recipe.id === state.selectedRecipeId;
        const isTrending = trendingIds.includes(recipe.id);
        const hasImages = recipeImages[recipe.id] && recipeImages[recipe.id].length > 0 && recipeImages[recipe.id].some(url => !url.includes('placehold.co'));
        const glowStyle = isSelected ? `--glow-color: ${recipe.personalityColor};` : '';
        const animationStyle = `animation-delay: ${index * 30}ms;`;

        const imageIconHTML = hasImages
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image text-teal-500 flex-shrink-0"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`
            : '';

        const trendingIconHTML = isTrending
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star text-yellow-400 flex-shrink-0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
            : '';

        return `<div class="recipe-item p-4 rounded-lg cursor-pointer ${isSelected ? 'selected' : ''} recipe-item-stagger"
                     data-recipe-id="${recipe.id}"
                     style="${glowStyle} ${animationStyle}">
            <div class="flex justify-between items-start">
                <span class="font-semibold text-primary pr-2">${formatRecipeName(recipe.name[getCurrentLanguage()])}</span>
                <div class="flex items-center gap-2 pt-1">
                    ${imageIconHTML}
                    ${trendingIconHTML}
                </div>
            </div>
            <p class="text-sm text-neutral-600 mt-1 leading-snug">${recipe.description[getCurrentLanguage()]}</p>
        </div>`;
    }).join('');
}

export function renderLibraryDetails() {
    const isMobile = window.innerWidth < 768;
    const recipeListPanel = document.getElementById('recipeListPanel');
    const recipeMainPanel = document.getElementById('recipeMainPanel');
    const recipeDetailPanelMobile = document.getElementById('recipeDetailPanelMobile');

    if (isMobile) {
        recipeListPanel.classList.toggle('hidden', state.isMobileDetailActive);
        if (state.isMobileDetailActive) {
            recipeDetailPanelMobile.classList.remove('hidden');
            setTimeout(() => recipeDetailPanelMobile.classList.add('visible'), 10);
        } else {
            recipeDetailPanelMobile.classList.remove('visible');
            recipeDetailPanelMobile.addEventListener('transitionend', () => {
                if (!recipeDetailPanelMobile.classList.contains('visible')) {
                    recipeDetailPanelMobile.classList.add('hidden');
                }
            }, { once: true });
        }
    } else {
        recipeListPanel?.classList.remove('hidden');
        recipeDetailPanelMobile?.classList.add('hidden');
        recipeDetailPanelMobile?.classList.remove('visible');
    }

    const recipe = recipesData.find(r => r.id === state.selectedRecipeId);
    let recipeContentContainer = isMobile && state.isMobileDetailActive
        ? document.getElementById('recipeContentMobile')
        : document.getElementById('recipeContent');
    let welcomeAndChartContainer = document.getElementById('welcomeAndChartContainer');

    if (!recipeContentContainer) return;

    if (!recipe) {
        if (welcomeAndChartContainer) welcomeAndChartContainer.classList.remove('hidden');
        recipeContentContainer.classList.add('hidden');
        if(!isMobile) recipeMainPanel?.classList.remove('hidden');
        return;
    }

    if (welcomeAndChartContainer) welcomeAndChartContainer.classList.add('hidden');
    recipeContentContainer.classList.remove('hidden');
    if(!isMobile) recipeMainPanel?.classList.remove('hidden');

    recipeContentContainer.innerHTML = `
        <div class="mb-4 hidden md:block">
            <button id="backToChartBtn" class="btn bg-white/60 border border-gray-200/80 text-gray-700 hover:bg-white/90 py-2 px-4 text-sm" data-translate-key="backToChartBtn"></button>
        </div>
        <div>
            <h3 class="text-3xl md:text-4xl font-bold">${formatRecipeName(recipe.name[getCurrentLanguage()])}</h3>
            <p class="text-lg text-neutral-600 mt-1">"${recipe.description[getCurrentLanguage()]}"</p>
        </div>
        <div class="mt-8">${createFullRecipeHTML(recipe)}</div>
    `;
    applyTranslations();
}
