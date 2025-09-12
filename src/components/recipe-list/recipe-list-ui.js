import { state } from '../../services/state.js';
import { getCurrentLanguage, applyTranslations, t } from '../../services/language.js';
import { fetchTrendingRecipeIds } from '../../services/api.js';
import recipesData from '../../services/recipes.js';
import recipeImages from '../../services/recipe-images.js';
import { createSaveGuideHTML, formatRecipeName } from '../../services/ui.js';
import { isAIEnabled } from '../../services/state.js';
import { parameterExplanations } from '../../services/translations.js';


function createFilterHTML() {
    const { filter } = state.ui;
    const isLoggedIn = state.auth.isLoggedIn;

    const filters = [
        { key: 'all', nameKey: 'allRecipes' },
        { key: 'trending', nameKey: 'trendingTitle' },
    ];
    if (isLoggedIn) {
        filters.push({ key: 'favorites', nameKey: 'myLab' });
    }

    const filterButtons = filters.map(f => `
        <button class="filter-btn px-4 py-2 rounded-full font-semibold text-sm transition-colors ${filter === f.key ? 'bg-blue-600 text-white' : 'bg-gray-200/80 text-gray-700 hover:bg-gray-300'}" data-filter="${f.key}">
            <span data-translate-key="${f.nameKey}"></span>
        </button>
    `).join('');

    return `
        <div class="mt-4 mb-4 flex items-center gap-2 flex-wrap">
            <span class="text-sm font-semibold text-gray-600 mr-2" data-translate-key="filterBy"></span>
            ${filterButtons}
        </div>
    `;
}

export async function renderLibraryList() {
    const container = document.getElementById('recipeListContainer');
    if (!container) return;

    let filterContainer = document.getElementById('recipeListFilter');
    if (!filterContainer) {
        filterContainer = document.createElement('div');
        filterContainer.id = 'recipeListFilter';
        const searchInput = document.getElementById('searchInput');
        if(searchInput) {
            searchInput.parentElement.insertAdjacentElement('afterend', filterContainer);
        }
    }
    filterContainer.innerHTML = createFilterHTML();
    applyTranslations();

    const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase();
    
    let recipesToRender = recipesData;

    // Apply filter
    const { filter } = state.ui;
    if (filter === 'trending') {
        const trendingIds = await fetchTrendingRecipeIds();
        recipesToRender = recipesData.filter(r => trendingIds.includes(r.id));
    } else if (filter === 'favorites') {
        const favoriteIds = state.auth.favorites || [];
        recipesToRender = recipesData.filter(r => favoriteIds.includes(r.id));
    }

    // Apply search
    if (searchTerm) {
        recipesToRender = recipesToRender.filter(r =>
            r.name[getCurrentLanguage()].toLowerCase().includes(searchTerm) ||
            r.description[getCurrentLanguage()].toLowerCase().includes(searchTerm) ||
            r.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    const trendingIds = await fetchTrendingRecipeIds();

    container.innerHTML = recipesToRender.map((recipe, index) => {
        const isSelected = recipe.id === state.ui.selectedRecipeId;
        const isTrending = trendingIds.includes(recipe.id);
        const hasImages = recipeImages[recipe.id] && recipeImages[recipe.id].length > 0 && recipeImages[recipe.id].some(url => !url.includes('placehold.co'));
        const glowStyle = isSelected ? `--glow-color: ${recipe.personalityColor};` : '';
        const animationStyle = `animation-delay: ${index * 30}ms;`;

        const imageIconHTML = hasImages
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image text-teal-500 flex-shrink-0"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`
            : '';

        const trendingIconHTML = isTrending
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-yellow-400 flex-shrink-0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
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


function createCommentsSectionHTML(recipeId) {
    const isLoggedIn = state.auth.isLoggedIn;

    const commentFormHTML = isLoggedIn ? `
        <form id="commentForm" class="mt-4 flex items-start gap-4" data-recipe-id="${recipeId}">
            <img src="${state.auth.user.photoURL || 'https://placehold.co/40x40/e2e8f0/a0aec0?text=A'}" alt="Your avatar" class="w-10 h-10 rounded-full">
            <div class="flex-grow">
                <textarea id="commentInput" required class="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" placeholder="${t('commentPlaceholder')}" rows="3"></textarea>
                <div class="flex justify-end mt-2">
                    <button type="submit" class="btn btn-primary py-2 px-6">
                        <span data-translate-key="submitCommentBtn"></span>
                    </button>
                </div>
            </div>
        </form>
    ` : `
        <div class="mt-6 text-center p-4 bg-gray-100 rounded-lg">
            <p data-translate-key="logInToComment"></p>
        </div>
    `;

    return `
        <div class="mt-12">
            <h3 class="text-2xl font-bold" data-translate-key="commentsTitle"></h3>
            ${commentFormHTML}
            <div id="commentsListContainer" class="mt-6 space-y-4">
                <!-- Comments will be rendered here by ui.js -->
            </div>
        </div>
    `;
}

function createRecipeDetailHTML(recipe) {
    const demoImages = recipeImages[recipe.id] || [];
    
    const createCollageHTML = (images) => {
        if (!images || images.length === 0) return '';
        const count = Math.min(images.length, 8);

        const imageElements = images.slice(0, count).map((imgUrl, index) => `
            <div class="collage-item" data-recipe-id="${recipe.id}" data-index="${index}">
                <img 
                    src="${imgUrl}" 
                    loading="lazy" 
                    decoding="async"
                    alt="Demo image ${index + 1} for ${formatRecipeName(recipe.name[getCurrentLanguage()])}"
                    onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'flex items-center justify-center h-full text-gray-400 text-xs p-2 text-center\\'>Image failed to load</div>';"
                >
            </div>`).join('');

        return `<div class="photo-collage">${imageElements}</div>`;
    };

    const createSettingsGrid = (settings) => {
        if (!settings) return '';
        return Object.entries(settings).map(([key, value]) => {
            const explanationKey = Object.keys(parameterExplanations).find(k => k.toLowerCase() === key.toLowerCase().trim());
            return `<div class="flex flex-col p-4 bg-white/50 rounded-xl"><div class="flex items-center gap-1.5"><span class="parameter-title text-sm text-gray-500 font-medium" data-param-key="${explanationKey || ''}">${key}</span></div><span class="font-semibold text-xl text-gray-800 mt-1">${value}</span></div>`;
        }).join('');
    };

    const sections = [
        { titleKey: 'whiteBalanceTitle', content: `<div class="p-4 bg-white/50 rounded-xl"><p class="font-semibold text-xl text-gray-800">${recipe.whiteBalance || ''}</p></div>` },
        { titleKey: 'recipeSettingsTitle', content: `<div class="grid grid-cols-2 md:grid-cols-3 gap-3">${createSettingsGrid(recipe.settings)}</div>` },
        recipe.colorDepth ? { titleKey: 'colorDepthTitle', content: `<div class="grid grid-cols-3 md:grid-cols-6 gap-3">${createSettingsGrid(recipe.colorDepth)}</div>` } : null,
        recipe.detailSettings ? { titleKey: 'detailTitle', content: `<div class="grid grid-cols-2 md:grid-cols-3 gap-3">${createSettingsGrid(recipe.detailSettings)}</div>` } : null
    ].filter(Boolean);

    const aiDisabledAttr = !isAIEnabled ? `disabled title="${t('aiKeyNotConfigured')}"` : '';
    const isFavorited = state.auth.favorites?.includes(recipe.id);
    const favoriteButtonHTML = state.auth.isLoggedIn ? `
        <button id="favoriteBtn" data-recipe-id="${recipe.id}" class="btn ${isFavorited ? 'bg-yellow-400 hover:bg-yellow-500 text-white' : 'bg-white/60 hover:bg-white/90 text-gray-700'} border border-gray-200/80 py-2.5 px-6 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${isFavorited ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star h-5 w-5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span data-translate-key="${isFavorited ? 'favoritedBtn' : 'favoriteBtn'}"></span>
        </button>
    ` : '';

    return `
        ${createCollageHTML(demoImages)}

        <div class="mt-6 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <h3 class="text-3xl md:text-4xl font-bold">${formatRecipeName(recipe.name[getCurrentLanguage()])}</h3>
                <p class="text-lg text-neutral-600 mt-1">"${recipe.description[getCurrentLanguage()]}"</p>
            </div>
            <div class="flex-shrink-0 mt-2 sm:mt-0">
                ${favoriteButtonHTML}
            </div>
        </div>

        <div class="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <button class="btn btn-primary py-3 px-6" id="tweakWithAIBtn" data-recipe-id="${recipe.id}" ${aiDisabledAttr}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-5 h-5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                <span data-translate-key="tweakWithAI"></span>
            </button>
            <button class="btn bg-gray-700 hover:bg-gray-800 text-white py-3 px-6 shadow-lg shadow-gray-500/30" id="downloadPngBtn" data-recipe-id="${recipe.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image h-5 w-5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                <span data-translate-key="downloadPNG"></span>
            </button>
             <button id="shareRecipeBtn" data-recipe-id="${recipe.id}" class="btn bg-green-500 hover:bg-green-600 text-white py-2.5 px-6 shadow-lg shadow-green-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share-2 h-5 w-5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                <span data-translate-key="shareRecipeBtn"></span>
            </button>
        </div>
        <div class="space-y-8 mt-8">
            ${sections.map(section => `<div><h4 class="text-xl font-bold mb-3 text-gray-700" data-translate-key="${section.titleKey}"></h4><div class="p-4 bg-gray-500/5 rounded-2xl">${section.content}</div></div>`).join('')}
        </div>
        ${createSaveGuideHTML()}
        ${createCommentsSectionHTML(recipe.id)}
    `;
}

export function renderLibraryDetails() {
    const isMobile = window.innerWidth < 768;
    const recipeListPanel = document.getElementById('recipeListPanel');
    const recipeMainPanel = document.getElementById('recipeMainPanel');
    const recipeDetailPanelMobile = document.getElementById('recipeDetailPanelMobile');

    if (isMobile) {
        recipeListPanel.classList.toggle('hidden', state.ui.isMobileDetailActive);
        if (state.ui.isMobileDetailActive) {
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

    const recipe = recipesData.find(r => r.id === state.ui.selectedRecipeId);
    let recipeContentContainer = isMobile && state.ui.isMobileDetailActive
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
        ${createRecipeDetailHTML(recipe)}
    `;
    applyTranslations();
}
