// File Path: src/components/profile-ui.js
import { state } from '../services/state.js';
import { getUserProfile, getGeneratedRecipes, getFavoriteRecipes } from '../services/firestore.js';
import { applyTranslations, getCurrentLanguage, t } from '../services/language.js';
import { openModal, closeModal, formatRecipeName } from '../services/ui.js';
import recipesData from '../services/recipes.js';

function createSocialIcon(platform) {
    const icons = {
        instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
        threads: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-at-sign"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>`,
        website: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`
    };
    return icons[platform] || icons.website;
}

export async function renderUserProfilePage(userId) {
    const container = document.getElementById('userProfileViewContainer');
    if (!container) return;

    container.innerHTML = `<div class="w-full flex justify-center pt-20"><div class="loader-dark"></div></div>`;

    const [profileData, generatedRecipes, favoriteRecipeIds] = await Promise.all([
        getUserProfile(userId),
        getGeneratedRecipes(userId),
        getFavoriteRecipes(userId)
    ]);
    
    const favoriteRecipes = recipesData.filter(r => favoriteRecipeIds.includes(r.id));

    if (!profileData) {
        container.innerHTML = `<p class="text-center mt-20">Could not load user profile.</p>`;
        return;
    }

    const socials = profileData.socials || {};
    const socialLinksHTML = Object.entries({ instagram: socials.instagram, threads: socials.threads, website: socials.website })
        .map(([key, value]) => {
            const url = value && (value.startsWith('http://') || value.startsWith('https://')) ? value : `https://${value}`;
            return `
        <a href="${value ? url : '#'}" target="_blank" rel="noopener noreferrer" 
           class="w-10 h-10 rounded-full flex items-center justify-center transition-colors ${value ? 'bg-gray-200 hover:bg-gray-300 text-gray-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}" 
           title="${t(key)}">
            ${createSocialIcon(key)}
        </a>
    `}).join('');

    const generatedRecipesHTML = generatedRecipes.length > 0
        ? `<div class="space-y-4">${generatedRecipes.map(recipe => {
            const recipeName = recipe.name[getCurrentLanguage()] || recipe.name['en'];
            const recipeDesc = recipe.description[getCurrentLanguage()] || recipe.description['en'];
            // FIX: Escape double quotes in the JSON string to ensure the data attribute is valid HTML.
            const recipeJsonString = JSON.stringify(recipe).replace(/"/g, '&quot;');
            return `
            <button class="generated-recipe-card w-full text-left bg-white p-4 rounded-lg border border-gray-200/80 hover:shadow-md hover:border-blue-500 transition-all duration-300" data-recipe="${recipeJsonString}">
                <div class="flex justify-between items-start">
                    <h4 class="font-bold text-lg text-blue-600">${recipeName}</h4>
                    <span class="text-xs font-medium bg-blue-100 text-blue-700 py-1 px-2 rounded-full" data-translate-key="editRecipeBtn"></span>
                </div>
                <p class="text-sm text-gray-500 mt-1 italic">"${recipeDesc}"</p>
                ${recipe.notes ? `<p class="text-sm text-gray-800 mt-3 p-3 bg-gray-50 rounded-md border-l-4 border-gray-300"><strong>Notes:</strong> ${recipe.notes}</p>` : ''}
            </button>
        `}).join('')}</div>`
        : `<div class="text-center py-8"><p class="text-gray-500" data-translate-key="noGeneratedRecipes"></p></div>`;

    const favoritedRecipesHTML = favoriteRecipes.length > 0
        ? `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">${favoriteRecipes.map(recipe => {
            const recipeName = recipe.name[getCurrentLanguage()] || recipe.name['en'];
            const recipeDesc = recipe.description[getCurrentLanguage()] || recipe.description['en'];
            return `
            <div class="bg-white p-4 rounded-lg border border-gray-200/80">
                <h4 class="font-bold text-lg">${formatRecipeName(recipeName)}</h4>
                <p class="text-sm text-gray-500 mt-1 italic">"${recipeDesc}"</p>
            </div>
        `}).join('')}</div>`
        : `<div class="text-center py-8"><p class="text-gray-500" data-translate-key="noFavoritesYet"></p></div>`;

    const demoPhotosHTML = `<div class="text-center py-12 bg-gray-50 rounded-lg"><p class="text-gray-500" data-translate-key="noDemoPhotos"></p><button id="openDemoPhotoModalBtn" class="btn btn-primary mt-4"><span data-translate-key="submitYourPhoto"></span></button></div>`;

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside class="lg:col-span-4 xl:col-span-3">
                <div class="p-6 bg-white/80 glass-panel sticky top-28 text-center">
                    <img src="${profileData.avatar}" alt="${profileData.name}" class="w-32 h-32 rounded-full mx-auto ring-4 ring-white/50 shadow-lg">
                    <h2 class="mt-4 text-2xl font-bold text-gray-800">${profileData.name}</h2>
                    <div class="mt-4 flex justify-center gap-2">${socialLinksHTML}</div>
                    <button id="editProfileBtn" class="btn bg-white/80 border border-gray-200 text-gray-700 hover:bg-white/90 w-full mt-6 py-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil w-4 h-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        <span data-translate-key="editProfile"></span>
                    </button>
                </div>
            </aside>
            <main class="lg:col-span-8 xl:col-span-9">
                <div class="p-4 sm:p-6 bg-white/80 glass-panel">
                    <div class="border-b border-gray-200 mb-6">
                        <nav class="-mb-px flex gap-6" aria-label="Tabs">
                            <button class="tab-btn active" data-tab="myRecipeLab" data-translate-key="myRecipeLab"></button>
                            <button class="tab-btn" data-tab="myDemoPhotos" data-translate-key="myDemoPhotos"></button>
                        </nav>
                    </div>
                    <div id="myRecipeLabContent" class="tab-content space-y-8">
                        <div>
                            <h3 class="text-xl font-bold mb-4" data-translate-key="generatedRecipesSectionTitle"></h3>
                            ${generatedRecipesHTML}
                        </div>
                        <div>
                            <h3 class="text-xl font-bold mb-4" data-translate-key="favoritedRecipesSectionTitle"></h3>
                            ${favoritedRecipesHTML}
                        </div>
                    </div>
                    <div id="myDemoPhotosContent" class="tab-content hidden">${demoPhotosHTML}</div>
                </div>
            </main>
        </div>
        ${createEditProfileModal(socials)}
        ${createDemoPhotoSubmitModal()}
    `;
    
    // Add tab switching logic
    container.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;

            container.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            container.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            document.getElementById(`${tabId}Content`).classList.remove('hidden');
        });
    });

    applyTranslations();
}

function createEditProfileModal(socials) {
    const fields = [
        { key: 'instagram', icon: createSocialIcon('instagram') },
        { key: 'threads', icon: createSocialIcon('threads') },
        { key: 'website', icon: createSocialIcon('website') }
    ];

    const fieldsHTML = fields.map(field => `
        <div>
            <label for="${field.key}" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1 capitalize" data-translate-key="${field.key}"></label>
            <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">${field.icon}</div>
                <input type="url" name="${field.key}" id="${field.key}" class="w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500" value="${socials[field.key] || ''}" placeholder="https://...">
            </div>
        </div>
    `).join('');

    return `
    <div id="editProfileModal" class="modal hidden fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div class="modal-panel w-full max-w-md flex flex-col rounded-2xl">
            <div class="flex justify-between items-center p-5 border-b border-gray-200">
                <h2 class="text-xl font-bold" data-translate-key="editProfile"></h2>
                <button id="closeEditProfileModalBtn" class="text-3xl font-light text-gray-400 hover:text-black">&times;</button>
            </div>
            <form id="editProfileForm">
                <div class="p-6 md:p-8 space-y-4">
                    <h3 class="font-semibold" data-translate-key="socialLinks"></h3>
                    ${fieldsHTML}
                </div>
                <div class="p-5 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex justify-end gap-3">
                    <button type="button" id="cancelEditProfileBtn" class="btn bg-gray-200 text-gray-800 py-2 px-6" data-translate-key="aiCancelBtn"></button>
                    <button type="submit" class="btn btn-primary py-2 px-6">
                        <span data-translate-key="saveChanges"></span>
                    </button>
                </div>
            </form>
        </div>
    </div>
    `;
}

export function openEditProfileModal() {
    openModal('editProfileModal');
    document.getElementById('closeEditProfileModalBtn').onclick = closeEditProfileModal;
    document.getElementById('cancelEditProfileBtn').onclick = closeEditProfileModal;
}

export function closeEditProfileModal() {
    closeModal('editProfileModal');
}


function createDemoPhotoSubmitModal() {
    const recipeOptions = recipesData.map(r => `<option value="${r.id}">${formatRecipeName(r.name[getCurrentLanguage()])}</option>`).join('');

    return `
    <div id="demoPhotoSubmitModal" class="modal hidden fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div class="modal-panel w-full max-w-2xl flex flex-col rounded-2xl">
            <div class="flex justify-between items-center p-5 border-b border-gray-200">
                <h2 class="text-xl font-bold" data-translate-key="submitDemoPhotoTitle"></h2>
                <button id="closeDemoPhotoSubmitModalBtn" class="text-3xl font-light text-gray-400 hover:text-black">&times;</button>
            </div>
            <div class="flex flex-col md:flex-row">
                 <div class="w-full md:w-1/3 p-6 bg-gray-50 border-r border-gray-200">
                    <h3 class="font-semibold" data-translate-key="howToContributeTitle"></h3>
                    <ol class="list-decimal list-inside text-sm text-gray-600 space-y-2 mt-2">
                        <li data-translate-key="contributeStep1"></li>
                        <li data-translate-key="contributeStep2"></li>
                        <li data-translate-key="contributeStep3"></li>
                    </ol>
                </div>
                <form id="demoPhotoSubmitForm" class="w-full md:w-2/3">
                    <div class="p-6 space-y-4">
                        <div>
                            <label for="photoURL" class="text-sm font-medium text-gray-700 mb-1 block" data-translate-key="photoUrlLabel"></label>
                            <input type="url" name="photoURL" id="photoURL" required class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="https://photos.app.goo.gl/...">
                            <p class="text-xs text-gray-500 mt-1" data-translate-key="photoUrlHint"></p>
                        </div>
                         <div>
                            <label for="recipeId" class="text-sm font-medium text-gray-700 mb-1 block" data-translate-key="recipeUsedLabel"></label>
                            <select name="recipeId" id="recipeId" required class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                <option value="" disabled selected data-translate-key="selectRecipePlaceholder"></option>
                                ${recipeOptions}
                            </select>
                        </div>
                        <div>
                            <label for="caption" class="text-sm font-medium text-gray-700 mb-1 block" data-translate-key="captionLabel"></label>
                            <input type="text" name="caption" id="caption" required class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        </div>
                        <div>
                            <label for="description" class="text-sm font-medium text-gray-700 mb-1 block" data-translate-key="descriptionLabel"></label>
                            <textarea name="description" id="description" rows="3" class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
                        </div>
                    </div>
                    <div class="p-5 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex justify-end gap-3">
                        <button type="button" id="cancelDemoPhotoSubmitBtn" class="btn bg-gray-200 text-gray-800 py-2 px-6" data-translate-key="aiCancelBtn"></button>
                        <button type="submit" class="btn btn-primary py-2 px-6">
                            <span data-translate-key="submitBtn"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
}


export function openDemoPhotoSubmitModal() {
    openModal('demoPhotoSubmitModal');
    document.getElementById('closeDemoPhotoSubmitModalBtn').onclick = closeDemoPhotoSubmitModal;
    document.getElementById('cancelDemoPhotoSubmitBtn').onclick = closeDemoPhotoSubmitModal;
}

export function closeDemoPhotoSubmitModal() {
    closeModal('demoPhotoSubmitModal');
}
