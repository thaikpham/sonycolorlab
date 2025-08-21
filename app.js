// --- Firebase SDK Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- Local Module Imports ---
import { t, applyTranslations, updateLangSlider, initLanguage, setLanguage, getCurrentLanguage } from './language.js';
import { Quiz } from './quiz.js'; // Import the new Quiz module
import { parameterExplanations } from './translations.js';
import recipesData from './recipes-core.js?v=2.2';
import recipeImages from './recipes-images.js?v=2.2';

// --- PDF & Canvas Library Imports ---
const JSPDF_URL = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
const HTML2CANVAS_URL = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";


// --- CONFIGURATION & STATE ---
const API_KEY = "%%GEMINI_API_KEY%%";
const __firebase_config = "%%FIREBASE_CONFIG%%";
const __app_id = "%%APP_ID%%";

const isAIEnabled = API_KEY && API_KEY !== '%%GEMINI_API_KEY%%';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

const state = {
    currentView: 'home',
    selectedRecipeId: null,
    isMobileDetailActive: false,
    chart: {
        nodes: null,
        simulation: null,
    },
    ai: {
        isGenerating: false,
        originalRecipe: null,
        userPrompt: '',
        generatedRecipe: null,
        abortController: null,
    },
    captionAI: {
        isGenerating: false,
        recipe: null,
        userPrompt: '',
        abortController: null,
        result: null,
    },
    quiz: {
        instance: null, // A property to hold the Quiz class instance
        currentQuestionIndex: 0,
        answers: [],
    },
    firebase: {
        db: null,
    },
    lightbox: {
        images: [],
        currentIndex: 0,
    },
    animation: {
        blobAnimationFrameId: null,
    },
    scripts: {
        jspdf: false,
        html2canvas: false,
    }
};

const mainContentEl = document.getElementById('mainContent');

// --- Quiz Questions array has been moved to quiz.js ---


// --- UTILITY FUNCTIONS ---
function loadScript(url, stateKey) {
    return new Promise((resolve, reject) => {
        if (state.scripts[stateKey]) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            state.scripts[stateKey] = true;
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function showToast(message, isError = false) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'app-toast';
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            borderRadius: '99px',
            color: 'white',
            zIndex: '9999',
            opacity: '0',
            transition: 'opacity 0.3s ease, bottom 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        });
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.backgroundColor = isError ? '#e53935' : '#2ecc71';
    toast.style.bottom = '20px';
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.bottom = '0px';
    }, 3000);
}


// --- UI & LOGIC FUNCTIONS ---
function createSaveGuideHTML() {
    const guideContent = {
        vi: `
            <p class="mb-4">Trên các máy ảnh Sony Alpha thế hệ mới (như α7 IV, α7R V, α1, ZV-E1), bạn có thể lưu được <strong>3 preset trên thân máy</strong> (vị trí 1, 2, 3 trên vòng xoay) và <strong>4 preset trên thẻ nhớ</strong> (M1, M2, M3, M4).</p>
            <ol class="space-y-4 list-decimal list-inside">
                <li>
                    <strong>Bước 1: Thiết lập máy ảnh theo công thức</strong>
                    <p class="pl-6 text-gray-600">Trước tiên, hãy cài đặt tất cả các thông số của công thức này vào máy ảnh của bạn, bao gồm Cân bằng trắng (WB) và tất cả các mục trong Picture Profile.</p>
                </li>
                <li>
                    <strong>Bước 2: Truy cập Menu để lưu cài đặt</strong>
                    <p class="pl-6 text-gray-600">Nhấn nút <strong>MENU</strong>, di chuyển đến tab <strong>Shooting (màu hồng)</strong> &rarr; <strong>Shooting Mode</strong> &rarr; <strong>Camera Set. Memory</strong>.</p>
                </li>
                <li>
                    <strong>Bước 3: Chọn vị trí lưu</strong>
                    <p class="pl-6 text-gray-600">Chọn một trong các vị trí bạn muốn lưu (ví dụ: số <strong>1</strong> hoặc <strong>M1</strong>) và nhấn nút Enter để xác nhận. Cài đặt của bạn đã được lưu!</p>
                </li>
                <li>
                    <strong>Bước 4: Gọi lại cài đặt đã lưu</strong>
                    <p class="pl-6 text-gray-600">Để sử dụng, chỉ cần xoay vòng xoay chế độ trên đỉnh máy đến đúng số <strong>1, 2, hoặc 3</strong>. Máy ảnh sẽ ngay lập tức áp dụng tất cả các thông số bạn đã lưu.</p>
                </li>
            </ol>
        `,
        en: `
            <p class="mb-4">On new generation Sony Alpha cameras (like α7 IV, α7R V, α1, ZV-E1), you can save <strong>3 presets on the camera body</strong> (positions 1, 2, 3 on the mode dial) and <strong>4 presets on the memory card</strong> (M1, M2, M3, M4).</p>
            <ol class="space-y-4 list-decimal list-inside">
                <li>
                    <strong>Step 1: Set Up Your Camera with the Recipe</strong>
                    <p class="pl-6 text-gray-600">First, input all the parameters from this recipe into your camera, including White Balance (WB) and all Picture Profile settings.</p>
                </li>
                <li>
                    <strong>Step 2: Access the Save Settings Menu</strong>
                    <p class="pl-6 text-gray-600">Press the <strong>MENU</strong> button, navigate to the <strong>Shooting tab (pink)</strong> &rarr; <strong>Shooting Mode</strong> &rarr; <strong>Camera Set. Memory</strong>.</p>
                </li>
                <li>
                    <strong>Step 3: Choose a Memory Slot</strong>
                    <p class="pl-6 text-gray-600">Select one of the memory slots you want to save to (e.g., <strong>1</strong> or <strong>M1</strong>) and press the Enter button to confirm. Your settings are now saved!</p>
                </li>
                <li>
                    <strong>Step 4: Recall the Saved Setting</strong>
                    <p class="pl-6 text-gray-600">To use the preset, simply turn the top mode dial to the corresponding number <strong>1, 2, or 3</strong>. The camera will instantly apply all your saved settings.</p>
                </li>
            </ol>
        `
    };

    return `
        <div class="mt-8 p-5 md:p-6 bg-gray-50 border border-gray-200/80 rounded-2xl">
            <div class="flex justify-between items-center cursor-pointer" id="toggleSaveGuideBtn">
                <div>
                    <h4 class="text-lg md:text-xl font-bold text-gray-800" data-translate-key="saveGuideTitle"></h4>
                    <p class="mt-1 text-gray-600 text-sm" data-translate-key="saveGuideSubtitle"></p>
                </div>
                <button class="btn bg-gray-200 text-gray-700 hover:bg-gray-300 py-2 px-4 text-sm pointer-events-none">
                    <span data-translate-key="showGuideBtn"></span>
                </button>
            </div>
            <div id="saveGuideContent" class="mt-4 text-sm md:text-base overflow-hidden max-h-0 transition-all duration-700 ease-in-out">
                ${guideContent[getCurrentLanguage()]}
            </div>
        </div>
    `;
}

function createFullRecipeHTML(recipe) {
    const demoImages = recipeImages[recipe.id] || [];
    const createCollageHTML = (images) => {
        if (!images || images.length === 0) return '';
        const count = Math.min(images.length, 6);

        const imageElements = images.slice(0, count).map((imgUrl, index) => {
            let src = imgUrl;
            let srcset = '';
            
            if (imgUrl.includes('placehold.co')) {
                try {
                    const url = new URL(imgUrl);
                    const pathParts = url.pathname.split('/');
                    const bgColor = pathParts[2] || 'e2e8f0';
                    const fgColor = pathParts[3] || '475569';
                    const text = url.searchParams.get('text') || 'Image';
                    
                    const src400 = `${url.protocol}//${url.hostname}/400x300/${bgColor}/${fgColor}?text=${encodeURIComponent(text)}`;
                    const src800 = `${url.protocol}//${url.hostname}/800x600/${bgColor}/${fgColor}?text=${encodeURIComponent(text)}`;
                    const src1200 = `${url.protocol}//${url.hostname}/1200x900/${bgColor}/${fgColor}?text=${encodeURIComponent(text)}`;
                    
                    src = src800;
                    srcset = `${src400} 400w, ${src800} 800w, ${src1200} 1200w`;
                } catch (e) {
                    srcset = `${imgUrl} 800w`;
                }
            } else {
                srcset = `${imgUrl} 800w`;
            }

            return `
                <div class="collage-item" data-recipe-id="${recipe.id}" data-index="${index}">
                    <img 
                        src="${src}" 
                        ${srcset ? `srcset="${srcset}"` : ''}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy" 
                        decoding="async"
                        alt="Ảnh demo ${index + 1} cho công thức màu ${recipe.name[getCurrentLanguage()]}"
                        onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'flex items-center justify-center h-full text-gray-400 text-xs p-2 text-center\\'>Không tải được ảnh</div>';"
                    >
                </div>`;
        }).join('');

        return `<div class="photo-collage images-${count}">${imageElements}</div>`;
    };

    const createCTAHTML = (recipe) => {
        const recipeHashtag = `#${recipe.id.replace(/-/g, '')}`;
        const ctaText = t('ctaText').replace('{recipeHashtag}', `<b class="font-semibold text-blue-900">${recipeHashtag}</b>`);
        return `<div class="mt-8 p-5 md:p-6 bg-blue-50 border border-blue-200/50 rounded-2xl text-center">
            <h4 class="text-lg md:text-xl font-bold text-blue-800" data-translate-key="ctaTitle"></h4>
            <p class="mt-2 text-blue-700/90 max-w-2xl mx-auto text-sm md:text-base">${ctaText}</p>
            <div class="mt-5 flex flex-wrap justify-center gap-4">
                <button id="shareRecipeBtn" data-recipe-id="${recipe.id}" class="btn bg-green-500 hover:bg-green-600 text-white py-2.5 px-6 shadow-lg shadow-green-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share-2 h-5 w-5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                    <span data-translate-key="shareRecipeBtn"></span>
                </button>
            </div>
        </div>`;
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

    return `
        ${createCollageHTML(demoImages)}
        <div class="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <button class="btn btn-primary py-3 px-6" id="tweakWithAIBtn" data-recipe-id="${recipe.id}" ${aiDisabledAttr}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-5 h-5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                <span data-translate-key="tweakWithAI"></span>
            </button>
            <button class="btn bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 shadow-lg shadow-purple-500/30" id="captionAIBtn" data-recipe-id="${recipe.id}" ${aiDisabledAttr}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text w-5 h-5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                <span data-translate-key="captionFromAI"></span>
            </button>
            <button class="btn bg-gray-700 hover:bg-gray-800 text-white py-3 px-6 shadow-lg shadow-gray-500/30" id="downloadPdfBtn" data-recipe-id="${recipe.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download h-5 w-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                <span data-translate-key="downloadPDFBtn"></span>
            </button>
            <a href="https://helpguide.sony.net/di/pp/v1/en/contents/TP0000909106.html" target="_blank" rel="noopener noreferrer" class="btn bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open h-5 w-5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                <span data-translate-key="sonyGuideBtn"></span>
            </a>
        </div>
        <div class="space-y-8 mt-8">
            ${sections.map(section => `<div><h4 class="text-xl font-bold mb-3 text-gray-700" data-translate-key="${section.titleKey}"></h4><div class="p-4 bg-gray-500/5 rounded-2xl">${section.content}</div></div>`).join('')}
        </div>
        ${createSaveGuideHTML()}
        ${createCTAHTML(recipe)}
    `;
}

const viewTemplates = {
    home: () => `
        <div id="homeView" class="w-full h-full flex items-center justify-center absolute inset-0 p-4 md:p-8">
            <div class="w-full max-w-2xl mx-auto text-center">
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 mb-4" data-translate-key="landingTitle"></h1>
                <p class="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mt-4" data-translate-key="landingSubtitle"></p>
                <div class="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
                    <button id="startQuizBtn" class="btn btn-primary py-4 px-10 text-lg whitespace-nowrap">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wand-2 h-6 w-6"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2 18.28V22h3.72L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
                        <span data-translate-key="findMyColorBtn"></span>
                    </button>
                    <button data-view="recipeFormulas" class="nav-btn btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-4 px-10 text-lg whitespace-nowrap" data-translate-key="startExploringBtn"></button>
                </div>
            </div>
        </div>`,
    recipeFormulas: () => `
        <div id="recipeFormulasView" class="w-full h-full flex flex-col md:flex-row gap-6 absolute inset-0 view-transition">
            <aside id="recipeListPanel" class="w-full md:w-2/5 lg:w-1/3 flex-shrink-0 glass-panel p-4 md:p-6 flex flex-col md:flex">
                <div class="relative mb-4 flex-shrink-0">
                    <input type="search" id="searchInput" class="w-full p-3 pl-4 pr-12 rounded-xl bg-gray-200/50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all" data-translate-key="searchInputPlaceholder">
                    <button id="quizShortcutBtn" class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-blue-500" title="Find My Color Quiz">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wand-2 h-6 w-6"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2 18.28V22h3.72L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
                    </button>
                </div>
                <div id="recipeListContainer" class="space-y-2 flex-grow overflow-y-auto sleek-scrollbar pr-2 -mr-2"></div>
            </aside>
            <main id="recipeMainPanel" class="w-full md:w-3/5 lg:w-2/3 flex flex-col min-h-0 hidden md:flex">
                <div class="glass-panel flex-grow overflow-y-auto p-6 lg:p-10 sleek-scrollbar">
                    <div id="welcomeAndChartContainer" class="flex flex-col items-center justify-center h-full">
                        <div id="welcomeText" class="text-center">
                            <h2 class="text-2xl md:text-3xl font-bold text-gray-700" data-translate-key="recipeDetailWelcomeTitle"></h2>
                            <p class="text-neutral-500 mt-2 max-w-xl mx-auto" data-translate-key="recipeDetailWelcomeText"></p>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                            <a href="https://forms.gle/your-form-id" target="_blank" rel="noopener noreferrer" class="btn bg-green-500 hover:bg-green-600 text-white py-3 px-6 shadow-lg shadow-green-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-circle h-5 w-5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
                                <span data-translate-key="contributeRecipeBtn"></span>
                            </a>
                            <a href="https://www.facebook.com/groups/sonyalphavietnamoffical" target="_blank" rel="noopener noreferrer" class="btn btn-primary py-3 px-6 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users h-5 w-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                <span data-translate-key="ctaButton"></span>
                            </a>
                        </div>
                        <div id="colorMapContainer" class="flex-grow w-full"></div>
                        <div id="trendingContainer" class="w-full mt-4"></div>
                    </div>
                    <div id="recipeContent" class="hidden"></div>
                </div>
            </main>
            <div id="recipeDetailPanelMobile" class="w-full h-full absolute inset-0 bg-[#f8f9fa] p-4 overflow-y-auto hidden">
                <button id="backToListBtn" class="btn bg-white/80 border border-gray-200 text-gray-800 mb-4 py-2 px-4" data-translate-key="backToListBtn"></button>
                <div class="glass-panel p-6 overflow-y-auto sleek-scrollbar"><div id="recipeContentMobile"></div></div>
            </div>
        </div>`,
};

// --- SLEEK COLOR MAP CHART ---
function renderColorMapChart(containerSelector, data) {
    const container = d3.select(containerSelector);
    if (container.empty() || !data || data.length === 0) {
        console.warn("Chart container not found or no data provided.");
        return;
    }
    container.html('');

    const bounds = container.node().getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) {
        return;
    }

    const margin = { top: 40, right: 30, bottom: 50, left: 30 };
    const width = bounds.width - margin.left - margin.right;
    const height = bounds.height - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const defs = svg.append("defs");
    const filter = defs.append("filter")
        .attr("id", "soft-glow")
        .attr("x", "-50%").attr("y", "-50%")
        .attr("width", "200%").attr("height", "200%");
    filter.append("feGaussianBlur")
        .attr("in", "SourceGraphic")
        .attr("stdDeviation", "4")
        .attr("result", "blur");

    const xScale = d3.scaleLinear().domain([-11, 11]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-11, 11]).range([height, 0]);
    const rScale = d3.scaleSqrt().domain([0, 10]).range([7, 12]);

    const quadrantLabels = [
        { x: width * 0.25, y: height * 0.25, text: {vi: 'LẠNH & GẮT', en: 'COOL & PUNCHY'} },
        { x: width * 0.75, y: height * 0.25, text: {vi: 'ẤM & RỰC RỠ', en: 'WARM & VIBRANT'} },
        { x: width * 0.25, y: height * 0.75, text: {vi: 'LẠNH & DỊU', en: 'COOL & MUTED'} },
        { x: width * 0.75, y: height * 0.75, text: {vi: 'ẤM & MỜ', en: 'WARM & FADED'} },
    ];
    svg.selectAll(".quadrant-label")
        .data(quadrantLabels)
        .enter().append("text")
        .attr("class", "quadrant-label")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("dy", "0.35em")
        .text(d => d.text[getCurrentLanguage()]);

    svg.append("g").attr("class", "grid")
        .call(d3.axisBottom(xScale).ticks(10).tickSize(height).tickFormat(""))
        .selectAll("line").attr("stroke", "#f1f5f9").attr("stroke-opacity", 0.7);
    svg.append("g").attr("class", "grid")
        .call(d3.axisLeft(yScale).ticks(10).tickSize(-width).tickFormat(""))
        .selectAll("line").attr("stroke", "#f1f5f9").attr("stroke-opacity", 0.7);

    svg.selectAll(".domain").remove();

    svg.append("text").attr("class", "axis-label").attr("text-anchor", "start").attr("x", 5).attr("y", yScale(0) - 8).text(getCurrentLanguage() === 'vi' ? '← Lạnh' : '← Cool');
    svg.append("text").attr("class", "axis-label").attr("text-anchor", "end").attr("x", width - 5).attr("y", yScale(0) - 8).text(getCurrentLanguage() === 'vi' ? 'Ấm →' : 'Warm →');
    svg.append("text").attr("class", "axis-label").attr("text-anchor", "middle").attr("x", xScale(0)).attr("y", -15).text(getCurrentLanguage() === 'vi' ? '↑ Tương phản Gắt' : '↑ Punchy Contrast');
    svg.append("text").attr("class", "axis-label").attr("text-anchor", "middle").attr("x", xScale(0)).attr("y", height + 25).text(getCurrentLanguage() === 'vi' ? '↓ Tương phản Dịu' : '↓ Soft Contrast');

    const nodesData = data.filter(d => d.coords).map(d => ({...d}));

    state.chart.nodes = svg.selectAll(".color-map-node-group")
        .data(nodesData, d => d.id)
        .enter()
        .append("g")
        .attr("class", "color-map-node-group")
        .attr("transform", `translate(${width / 2}, ${height / 2})`)
        .on("mouseover", function(event, d) {
            d3.select(this).raise();
            const recipeItem = document.querySelector(`.recipe-item[data-recipe-id='${d.id}']`);
            if (recipeItem) {
                recipeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                recipeItem.classList.add('hover-highlight');
            }
        })
        .on("mouseout", function(event, d) {
            const recipeItem = document.querySelector(`.recipe-item[data-recipe-id='${d.id}']`);
            if (recipeItem) {
                recipeItem.classList.remove('hover-highlight');
            }
        })
        .on("click", (event, d) => {
            handleRecipeSelection(d.id);
        });

    state.chart.nodes.append("circle")
        .attr("class", "color-map-node-aura")
        .attr("r", d => rScale(Math.abs(d.coords.x) + Math.abs(d.coords.y)))
        .attr("fill", d => d.personalityColor)
        .attr("filter", "url(#soft-glow)")
        .attr("opacity", 0.3);

    state.chart.nodes.append("circle")
        .attr("class", "color-map-node-core")
        .attr("r", d => rScale(Math.abs(d.coords.x) + Math.abs(d.coords.y)))
        .attr("fill", d => d.personalityColor);

    state.chart.nodes.append("text")
        .attr("class", "color-map-node-label")
        .attr("x", d => rScale(Math.abs(d.coords.x) + Math.abs(d.coords.y)) + 6)
        .attr("dy", "0.35em")
        .text(d => d.name[getCurrentLanguage()]);

    state.chart.simulation = d3.forceSimulation(nodesData)
        .force("collide", d3.forceCollide().radius(d => rScale(Math.abs(d.coords.x) + Math.abs(d.coords.y)) + 3).strength(0.8))
        .force("x", d3.forceX(d => xScale(d.coords.x)).strength(0.1))
        .force("y", d3.forceY(d => yScale(d.coords.y)).strength(0.1))
        .stop();

    for (let i = 0; i < 120; ++i) state.chart.simulation.tick();

    state.chart.nodes
        .transition()
        .duration(1200)
        .delay((d, i) => i * 10)
        .ease(d3.easeCubicOut)
        .attr("transform", d => `translate(${d.x}, ${d.y})`);

    updateChartSelection();
}

function updateChartSelection() {
    if (!state.chart.nodes) return;
    state.chart.nodes.classed("selected", d => d.id === state.selectedRecipeId);
}

function resetToChartView() {
    state.selectedRecipeId = null;
    state.isMobileDetailActive = false;
    updateListSelectionAndScroll(null);
    renderLibraryDetails();
    updateChartSelection();
}

function displayTrendingRecipes(trendingIDs) {
    const container = document.getElementById('trendingContainer');
    if (!container) return;

    const trendingRecipes = trendingIDs.map(id => recipesData.find(r => r.id === id)).filter(Boolean);

    if (trendingRecipes.length === 0) {
        container.innerHTML = '';
        container.style.display = 'none';
        return;
    }

    container.innerHTML = `
        <h3 class="text-center font-bold text-gray-500 mb-3" data-translate-key="trendingTitle"></h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            ${trendingRecipes.map(recipe => `
                <div class="trending-item rounded-xl p-3 cursor-pointer"
                     data-recipe-id="${recipe.id}"
                     style="--glow-color: ${recipe.personalityColor};">
                    <div class="flex items-center gap-3">
                        <div class="w-3 h-3 rounded-full flex-shrink-0" style="background-color: ${recipe.personalityColor};"></div>
                        <p class="text-sm font-semibold text-gray-700 truncate">${recipe.name[getCurrentLanguage()]}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    applyTranslations();
    container.style.display = 'block';
}

async function fetchTrendingRecipes() {
    const container = document.getElementById('trendingContainer');
    if (!container) return;

    container.innerHTML = `<p class="text-center text-gray-500 text-sm italic" data-translate-key="trendingLoading"></p>`;
    container.style.display = 'block';
    applyTranslations();

    const fallbackToDummyData = () => {
        console.log("Falling back to dummy trending data.");
        const dummyTrendingIDs = ["scl-001", "scl-007", "scl-008", "scl-015", "scl-027"];
        displayTrendingRecipes(dummyTrendingIDs);
    };

    if (!state.firebase.db) {
        console.warn("Firebase not available, using dummy trending data.");
        fallbackToDummyData();
        return;
    }

    try {
        const docRef = doc(state.firebase.db, `artifacts/${__app_id}/public/data/trending/latest`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().ids && docSnap.data().ids.length > 0) {
            const trendingData = docSnap.data();
            displayTrendingRecipes(trendingData.ids);
        } else {
            console.warn("Real trending data not found or empty in Firestore. Using dummy data as placeholder.");
            fallbackToDummyData();
        }
    } catch (error) {
        console.error("Error fetching real trending data from Firestore, using dummy data:", error);
        fallbackToDummyData();
    }
}


// --- QUIZ LOGIC has been moved to quiz.js ---


// --- GEMINI API CALL ---
async function callGeminiAPI(prompt, signal) {
    if (!isAIEnabled) {
        console.error("Gemini API key not configured.");
        throw new Error("API key not configured.");
    }

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
        }
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: signal
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid API response structure.");
    }
    return JSON.parse(result.candidates[0].content.parts[0].text);
}


// --- GEMINI AI LAB LOGIC ---
function openAILab(recipeId) {
    state.ai.originalRecipe = recipesData.find(r => r.id === recipeId);
    if (!state.ai.originalRecipe) return;

    Object.assign(state.ai, {
        generatedRecipe: null,
        userPrompt: '',
        isGenerating: false,
        abortController: state.ai.abortController ? (state.ai.abortController.abort(), null) : null
    });

    document.getElementById('aiLabModal').classList.remove('hidden');
    renderAILab();
}

function closeAILab() {
    if (state.ai.abortController) {
        state.ai.abortController.abort();
    }
    document.getElementById('aiLabModal').classList.add('hidden');
}

function renderAILab() {
    const contentEl = document.getElementById('aiLabContent');
    if (!contentEl) return;

    if (state.ai.isGenerating) {
        contentEl.innerHTML = `<div class="flex flex-col items-center justify-center h-64"><div class="loader"></div><p class="mt-4 text-gray-600">Gemini is thinking...</p></div>`;
        return;
    }

    if (state.ai.generatedRecipe) {
        renderAIComparison(contentEl);
        return;
    }

    if (state.ai.userPrompt) {
        renderAIConfirmation(contentEl);
        return;
    }

    renderAIPromptInput(contentEl);
    applyTranslations();
}

function renderAIPromptInput(container) {
    const recipeName = state.ai.originalRecipe.name[getCurrentLanguage()];
    container.innerHTML = `
        <p class="text-lg text-gray-600 text-center">${t('aiLabDescription').replace('{recipeName}', `<b>${recipeName}</b>`)}</p>
        <textarea id="aiPromptInput" class="w-full mt-4 p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all min-h-[100px]" placeholder="${t('aiPromptPlaceholder')}"></textarea>
        <div class="mt-6 text-center">
            <button id="generateAIBtn" class="btn btn-primary py-3 px-8 text-lg">
                <span data-translate-key="aiGenerateBtn"></span>
            </button>
        </div>
    `;
}

function renderAIConfirmation(container) {
    const recipeName = state.ai.originalRecipe.name[getCurrentLanguage()];
    const confirmText = t('aiConfirmPromptText')
        .replace('{recipeName}', `<b>${recipeName}</b>`)
        .replace('{userPrompt}', state.ai.userPrompt);

    container.innerHTML = `
        <div class="text-center p-4 bg-blue-50 rounded-lg">
            <h3 class="text-xl font-bold" data-translate-key="aiConfirmPromptTitle"></h3>
            <p class="mt-3 text-lg text-gray-700">${confirmText}</p>
            <div class="mt-6 flex justify-center gap-4">
                <button id="cancelAIBtn" class="btn bg-gray-200 text-gray-800 py-2 px-6" data-translate-key="aiCancelBtn"></button>
                <button id="confirmAIBtn" class="btn btn-primary py-2 px-6" data-translate-key="aiConfirmBtn"></button>
            </div>
        </div>
    `;
    applyTranslations();
}

function renderAIComparison(container) {
    const original = state.ai.originalRecipe;
    const generated = state.ai.generatedRecipe;

    const createComparisonGrid = (titleKey, originalSettings, generatedSettings) => {
        if (!originalSettings || !generatedSettings) return '';
        const allKeys = Object.keys(originalSettings);
        const gridItems = allKeys.map(key => {
            const originalValue = originalSettings[key];
            const generatedValue = generatedSettings[key];
            const isChanged = originalValue !== generatedValue;
            return `
                <div class="flex flex-col p-3 rounded-lg ${isChanged ? 'bg-blue-100/50 border border-blue-200' : 'bg-gray-100/70'}">
                    <span class="text-sm text-gray-500 font-medium">${key}</span>
                    <div class="flex items-baseline gap-2 mt-1">
                        <span class="font-semibold text-lg ${isChanged ? 'text-blue-700' : 'text-gray-800'}">${generatedValue}</span>
                        ${isChanged ? `<span class="text-xs text-gray-500 line-through">${originalValue}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        return `<div><h4 class="text-lg font-bold mb-3 text-gray-700" data-translate-key="${titleKey}"></h4><div class="grid grid-cols-2 md:grid-cols-3 gap-3">${gridItems}</div></div>`;
    };

    container.innerHTML = `
        <div class="text-center">
            <h3 class="text-2xl font-bold" data-translate-key="aiComparisonTitle"></h3>
            <p class="mt-1 text-gray-600" data-translate-key="aiComparisonDescription"></p>
        </div>
        <div class="mt-6 grid grid-cols-1">
             <div class="border-2 border-blue-500 rounded-xl p-4 bg-white shadow-lg">
                <h4 class="text-xl font-bold text-center text-blue-600" data-translate-key="aiNewTitle"></h4>
                <p class="text-center text-gray-500">${generated.name[getCurrentLanguage()]}</p>
            </div>
        </div>
        <div class="mt-6 space-y-6">
            ${createComparisonGrid('recipeSettingsTitle', original.settings, generated.settings)}
            ${original.colorDepth ? createComparisonGrid('colorDepthTitle', original.colorDepth, generated.colorDepth) : ''}
        </div>
        <div class="mt-8 text-center">
             <button id="downloadAIPdfBtn" data-recipe-id="${original.id}" class="btn bg-gray-700 hover:bg-gray-800 text-white py-3 px-6 shadow-lg shadow-gray-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download h-5 w-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                <span data-translate-key="downloadPDFBtn"></span>
            </button>
        </div>
    `;
    applyTranslations();
}

function renderAIError(container) {
    container.innerHTML = `
        <div class="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 class="text-xl font-bold text-red-800" data-translate-key="aiErrorTitle"></h3>
            <p class="mt-2 text-red-700" data-translate-key="aiErrorText"></p>
        </div>
    `;
    applyTranslations();
}

function handleAIGeneration() {
    const userInput = document.getElementById('aiPromptInput').value.trim();
    if (!userInput) return;

    state.ai.userPrompt = userInput;
    renderAILab();
}

async function confirmAndCallAI() {
    state.ai.isGenerating = true;
    state.ai.abortController = new AbortController();
    renderAILab();

    const expertPrompt = `As a professional colorist specializing in Sony Picture Profiles, analyze the following JSON object which represents an existing color recipe. Your task is to generate a new, modified JSON object based on the user's request: "${state.ai.userPrompt}". The new JSON must be a complete, valid recipe object. You must only respond with the raw JSON object, without any surrounding text, explanations, or markdown formatting. The generated recipe name and description must be in the same language as the user's prompt (${getCurrentLanguage()}). Original recipe: ${JSON.stringify(state.ai.originalRecipe)}`;

    try {
        const generatedRecipe = await callGeminiAPI(expertPrompt, state.ai.abortController.signal);
        state.ai.generatedRecipe = generatedRecipe;
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error("Gemini API call failed:", error);
            renderAIError(document.getElementById('aiLabContent'));
        }
    } finally {
        state.ai.isGenerating = false;
        state.ai.userPrompt = '';
        state.ai.abortController = null;
        if (!document.querySelector('.bg-red-50')) {
            renderAILab();
        }
    }
}


// --- CAPTION AI LOGIC ---
function openCaptionLab(recipeId) {
    const recipe = recipesData.find(r => r.id === recipeId);
    if (!recipe) return;

    Object.assign(state.captionAI, {
        recipe: recipe,
        isGenerating: false,
        userPrompt: '',
        abortController: null,
        result: null,
    });

    document.getElementById('captionLabModal').classList.remove('hidden');
    renderCaptionLab();
}

function closeCaptionLab() {
    if (state.captionAI.abortController) {
        state.captionAI.abortController.abort();
    }
    document.getElementById('captionLabModal').classList.add('hidden');
}

function renderCaptionLab() {
    const contentEl = document.getElementById('captionLabContent');
    if (!contentEl) return;

    if (state.captionAI.isGenerating) {
        contentEl.innerHTML = `<div class="flex flex-col items-center justify-center h-64"><div class="loader"></div><p class="mt-4 text-gray-600">Gemini is thinking...</p></div>`;
        return;
    }

    if (state.captionAI.result) {
        const { caption, hashtags } = state.captionAI.result;
        contentEl.innerHTML = `
            <h3 class="text-xl font-bold text-center" data-translate-key="captionResultTitle"></h3>
            <div class="mt-4 p-4 bg-gray-50 border rounded-lg">
                <p id="caption-text" class="text-gray-800 whitespace-pre-wrap">${caption}</p>
                <p id="hashtags-text" class="mt-3 text-purple-700 font-semibold">${hashtags}</p>
            </div>
            <div class="mt-4 flex gap-2 justify-end">
                 <button class="btn bg-gray-200 text-gray-800 py-2 px-4" data-copy-target="hashtags-text">
                     <span data-translate-key="copyBtn"></span> Hashtags
                 </button>
                 <button class="btn btn-primary py-2 px-4" data-copy-target="caption-text">
                     <span data-translate-key="copyBtn"></span> Caption
                 </button>
            </div>
        `;
    } else {
        const recipeName = state.captionAI.recipe.name[getCurrentLanguage()];
        contentEl.innerHTML = `
            <p class="text-base text-gray-600 text-center">${t('captionLabDescription').replace('{recipeName}', `<b>${recipeName}</b>`)}</p>
            <textarea id="captionPromptInput" class="w-full mt-4 p-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all min-h-[80px]" placeholder="${t('captionPromptPlaceholder')}"></textarea>
            <div class="mt-6 text-center">
                <button id="generateCaptionBtn" class="btn bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 text-lg">
                    <span data-translate-key="generateCaptionBtn"></span>
                </button>
            </div>
        `;
    }
    applyTranslations();
}

async function handleCaptionGeneration() {
    const userInput = document.getElementById('captionPromptInput').value.trim();
    if (!userInput) return;

    state.captionAI.isGenerating = true;
    state.captionAI.abortController = new AbortController();
    renderCaptionLab();

    const { recipe } = state.captionAI;
    const recipeHashtag = `#${recipe.id.replace(/-/g, '')}${recipe.name.en.split(': ')[1]?.replace(/\s/g, '') || ''}`;
    const prompt = `You are a witty, trendy, and creative social media expert for Sony Alpha Vietnam, specializing in Gen Z vocabulary and viral content. Your task is to generate a compelling social media post.
**CRITICAL RULES:**
1.  **Mandatory Hashtags:** The final hashtag string MUST include '#sonycolorlab', '#sonyalphavietnam', and '${recipeHashtag}'. This is non-negotiable.
2.  **Tone & Style:** The caption's tone must be creative, subtle, sophisticated, and potentially humorous. Use trendy Vietnamese Gen Z slang and phrasing to make it highly shareable and viral.
3.  **Language:** The entire response (caption and hashtags) MUST be in the same language as the User's Idea, which is: ${getCurrentLanguage()}.

**CONTEXT:**
* **Photographic Style:** "${recipe.name[getCurrentLanguage()]}" - This style is known for: "${recipe.description[getCurrentLanguage()]}".
* **User's Idea:** "${userInput}"

**TASK:**
Based on all the rules and context, generate a caption and a set of hashtags.

**OUTPUT FORMAT:**
You must respond with only a single, valid JSON object with two keys: "caption" (string) and "hashtags" (string).`;

    try {
        state.captionAI.result = await callGeminiAPI(prompt, state.captionAI.abortController.signal);
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error("Caption AI call failed:", error);
            renderAIError(document.getElementById('aiLabContent'));
        }
    } finally {
        state.captionAI.isGenerating = false;
        state.captionAI.abortController = null;
        if (!document.querySelector('.bg-red-50')) {
             renderCaptionLab();
        }
    }
}


// --- CORE APP LOGIC ---
function initializeBackgroundBlobs() {
    const container = document.getElementById('blobContainer');
    if (!container) return;
    container.innerHTML = '';

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const blobs = [
        { id: 'red', color: '#e74c3c', r: vw * 0.12 }, 
        { id: 'green', color: '#2ecc71', r: vw * 0.15 },
        { id: 'blue', color: '#3498db', r: vw * 0.11 }, 
        { id: 'cyan', color: '#1abc9c', r: vw * 0.14 },
        { id: 'magenta', color: '#9b59b6', r: vw * 0.10 }, 
        { id: 'yellow', color: '#f1c40f', r: vw * 0.13 },
    ].map(d => ({
        ...d,
        x: Math.random() * (vw - d.r * 2) + d.r,
        y: Math.random() * (vh - d.r * 2) + d.r,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
    }));

    const blobElements = blobs.map(blobData => {
        const el = document.createElement('div');
        el.className = 'bg-blob';
        el.style.width = `${blobData.r * 2}px`;
        el.style.height = `${blobData.r * 2}px`;
        el.style.backgroundColor = blobData.color;
        container.appendChild(el);
        setTimeout(() => el.classList.add('visible'), 100);
        return { el, data: blobData };
    });

    function animate() {
        if (state.currentView !== 'home') {
            state.animation.blobAnimationFrameId = null;
            return;
        }

        blobElements.forEach(item => {
            const blob = item.data;
            blob.x += blob.vx;
            blob.y += blob.vy;

            if (blob.x - blob.r < 0 || blob.x + blob.r > vw) {
                blob.vx *= -1;
                blob.x = Math.max(blob.r, Math.min(vw - blob.r, blob.x));
            }
            if (blob.y - blob.r < 0 || blob.y + blob.r > vh) {
                blob.vy *= -1;
                blob.y = Math.max(blob.r, Math.min(vh - blob.r, blob.y));
            }

            item.el.style.transform = `translate(${blob.x - blob.r}px, ${blob.y - blob.r}px)`;
        });

        state.animation.blobAnimationFrameId = requestAnimationFrame(animate);
    }
    animate();
}


function renderView(viewName, selectedId = null) {
    state.currentView = viewName;
    if (selectedId) { state.selectedRecipeId = selectedId; }

    const blobContainer = document.getElementById('blobContainer');

    if (viewName !== 'home') {
        document.body.style.overflowY = 'auto';
        if (state.animation.blobAnimationFrameId) {
            cancelAnimationFrame(state.animation.blobAnimationFrameId);
            state.animation.blobAnimationFrameId = null;
        }
        if(blobContainer) {
            blobContainer.querySelectorAll('.bg-blob').forEach(b => b.classList.remove('visible'));
        }
    } else {
        document.body.style.overflowY = 'hidden';
        if (!state.animation.blobAnimationFrameId) {
            initializeBackgroundBlobs();
        }
    }

    const footerEl = document.querySelector('footer');
    if (footerEl) {
        footerEl.classList.toggle('hidden', viewName === 'recipeFormulas');
    }

    return new Promise(resolve => {
        const currentContent = mainContentEl.children[0];
        if (currentContent) {
            currentContent.classList.add('view-transition-out');
            currentContent.addEventListener('animationend', () => {
                mainContentEl.innerHTML = viewTemplates[viewName]();
                attachViewEventListeners(viewName);
                applyTranslations();
                resolve();
            }, { once: true });
        } else {
            mainContentEl.innerHTML = viewTemplates[viewName]();
            attachViewEventListeners(viewName);
            applyTranslations();
            resolve();
        }
    });
}

function updateListSelectionAndScroll(id) {
    const listContainer = document.getElementById('recipeListContainer');
    if (!listContainer) return;

    const oldSelectedItem = listContainer.querySelector('.recipe-item.selected');
    if (oldSelectedItem) {
        oldSelectedItem.classList.remove('selected');
    }

    if (id) {
        const newSelectedItem = listContainer.querySelector(`.recipe-item[data-recipe-id="${id}"]`);
        if (newSelectedItem) {
            newSelectedItem.classList.add('selected');
            const recipe = recipesData.find(r => r.id === id);
            if (recipe) {
                newSelectedItem.style.setProperty('--glow-color', recipe.personalityColor);
            }
            newSelectedItem.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
}

function handleRecipeSelection(id) {
    state.selectedRecipeId = (state.selectedRecipeId === id) ? null : id;
    state.isMobileDetailActive = !!state.selectedRecipeId;

    updateListSelectionAndScroll(state.selectedRecipeId);
    renderLibraryDetails();
    updateChartSelection();

    if (state.selectedRecipeId) {
        const recipe = recipesData.find(r => r.id === state.selectedRecipeId);
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

function attachViewEventListeners(viewName) {
    if (viewName === 'recipeFormulas') {
        renderLibraryList();
        renderLibraryDetails();
        fetchTrendingRecipes();

        const chartContainer = document.getElementById('colorMapContainer');
        if (chartContainer) {
            const resizeObserver = new ResizeObserver(entries => {
                if (entries && entries.length > 0 && entries[0].contentRect.width > 0) {
                     renderColorMapChart('#colorMapContainer', recipesData);
                     resizeObserver.unobserve(chartContainer);
                }
            });
            resizeObserver.observe(chartContainer);
        }
        updateLangSlider();
    }
}

function renderLibraryList() {
    const container = document.getElementById('recipeListContainer');
    if (!container) return;
    const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const recipesToRender = recipesData.filter(r => r.name[getCurrentLanguage()].toLowerCase().includes(searchTerm) || r.description[getCurrentLanguage()].toLowerCase().includes(searchTerm));
    
    container.innerHTML = recipesToRender.map((recipe, index) => {
        const isSelected = recipe.id === state.selectedRecipeId;
        const glowStyle = isSelected ? `--glow-color: ${recipe.personalityColor};` : '';
        const animationStyle = `animation-delay: ${index * 40}ms;`;
        
        return `<div class="recipe-item p-3 rounded-xl cursor-pointer ${isSelected ? 'selected' : ''} recipe-item-stagger" 
                     data-recipe-id="${recipe.id}" 
                     style="${glowStyle} ${animationStyle}">
            <span class="font-semibold text-primary">${recipe.name[getCurrentLanguage()]}</span>
            <p class="text-sm text-neutral-600 mt-1 leading-snug">${recipe.description[getCurrentLanguage()]}</p>
        </div>`;
    }).join('');
}

function renderLibraryDetails() {
    const isMobile = window.innerWidth < 768;
    const recipeListPanel = document.getElementById('recipeListPanel');
    const recipeMainPanel = document.getElementById('recipeMainPanel');
    const recipeDetailPanelMobile = document.getElementById('recipeDetailPanelMobile');

    if (isMobile) {
        recipeListPanel.classList.toggle('hidden', state.isMobileDetailActive);
        recipeDetailPanelMobile.classList.toggle('hidden', !state.isMobileDetailActive);
    } else {
        recipeListPanel?.classList.remove('hidden');
        recipeDetailPanelMobile?.classList.add('hidden');
    }

    const recipe = recipesData.find(r => r.id === state.selectedRecipeId);
    let recipeContentContainer = isMobile && state.isMobileDetailActive ? document.getElementById('recipeContentMobile') : document.getElementById('recipeContent');
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
        <div class="mb-4">
            <button id="backToChartBtn" class="btn bg-white/60 border border-gray-200/80 text-gray-700 hover:bg-white/90 py-2 px-4 text-sm" data-translate-key="backToChartBtn"></button>
        </div>
        <div>
            <h3 class="text-3xl md:text-4xl font-bold">${recipe.name[getCurrentLanguage()]}</h3>
            <p class="text-lg text-neutral-600 mt-1">"${recipe.description[getCurrentLanguage()]}"</p>
        </div>
        <div class="mt-8">${createFullRecipeHTML(recipe)}</div>
    `;
    applyTranslations();
}

function openLightbox(recipeId, startIndex) {
    const recipe = recipesData.find(r => r.id === recipeId);
    if (!recipe) return;
    const images = recipeImages[recipe.id] || [];
    if (images.length === 0) return;

    state.lightbox.images = images;
    state.lightbox.currentIndex = parseInt(startIndex, 10);

    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('hidden');
    setTimeout(() => lightbox.classList.add('visible'), 10);

    showLightboxImage();
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('visible');
    setTimeout(() => {
        lightbox.classList.add('hidden');
    }, 300);
}

function showLightboxImage() {
    const { images, currentIndex } = state.lightbox;
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCounter = document.getElementById('lightboxCounter');

    lightboxImage.style.opacity = '0';

    setTimeout(() => {
        lightboxImage.src = images[currentIndex];
        lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
        lightboxImage.style.opacity = '1';
    }, 150);
}

function showNextImage() {
    const { images } = state.lightbox;
    state.lightbox.currentIndex = (state.lightbox.currentIndex + 1) % images.length;
    showLightboxImage();
}

function showPrevImage() {
    const { images } = state.lightbox;
    state.lightbox.currentIndex = (state.lightbox.currentIndex - 1 + images.length) % images.length;
    showLightboxImage();
}

async function initializeFirebase() {
    if (typeof __firebase_config === 'undefined' || typeof __app_id === 'undefined' || __firebase_config.startsWith("%%") || __app_id.startsWith("%%")) {
        console.warn("Firebase config not found or not replaced by build script. Trending feature will be disabled.");
        return;
    }
    try {
        const firebaseConfig = JSON.parse(__firebase_config);
        const app = initializeApp(firebaseConfig);
        state.firebase.db = getFirestore(app);
        const auth = getAuth(app);
        await signInAnonymously(auth);
        console.log("Firebase initialized and user signed in anonymously.");
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        state.firebase.db = null;
    }
}

// --- PDF & SHARE FUNCTIONS ---
async function generateRecipePdf(recipeId, generatedRecipeData = null) {
    const originalRecipe = recipesData.find(r => r.id === recipeId);
    if (!originalRecipe) return;

    const btn = document.activeElement;
    const originalBtnContent = btn.innerHTML;
    btn.innerHTML = `<div class="loader"></div> Generating...`;
    btn.disabled = true;

    try {
        await Promise.all([
            loadScript(JSPDF_URL, 'jspdf'),
            loadScript(HTML2CANVAS_URL, 'html2canvas')
        ]);

        const { jsPDF } = window.jspdf;
        const html2canvas = window.html2canvas;

        const pdfContentEl = document.createElement('div');
        pdfContentEl.id = 'pdf-content-wrapper';
        Object.assign(pdfContentEl.style, {
            position: 'absolute',
            left: '-9999px',
            top: '0',
            width: '210mm',
            padding: '20mm',
            backgroundColor: 'white',
            fontFamily: "'Be Vietnam Pro', sans-serif",
            color: '#1d1d1f',
            boxSizing: 'border-box'
        });

        const createSettingsHTML = (settings) => Object.entries(settings || {}).map(([key, value]) => `
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 12px; text-align: center;">
                <div style="font-size: 12px; color: #6e6e73; margin-bottom: 4px;">${key}</div>
                <div style="font-size: 18px; font-weight: 600;">${value}</div>
            </div>`).join('');
        
        const createComparisonSettingsHTML = (originalSettings, generatedSettings) => {
             const allKeys = Object.keys(originalSettings || {});
             return allKeys.map(key => {
                const originalValue = originalSettings[key];
                const generatedValue = generatedSettings[key];
                const isChanged = originalValue !== generatedValue;
                return `
                <div style="background-color: ${isChanged ? '#e6f2ff' : '#f8f9fa'}; border-radius: 8px; padding: 12px; text-align: center;">
                    <div style="font-size: 12px; color: #6e6e73; margin-bottom: 4px;">${key}</div>
                    <div style="font-size: 18px; font-weight: 600; color: ${isChanged ? '#0056B3' : 'inherit'};">${generatedValue}</div>
                    ${isChanged ? `<div style="font-size: 11px; text-decoration: line-through; color: #6e6e73;">${originalValue}</div>` : ''}
                </div>`;
             }).join('');
        };

        let contentHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px;">
                <h1 style="font-size: 24px; font-weight: 800; margin: 0;">Alpha AI Color Lab</h1>
            </div>
            <h2 style="font-size: 32px; font-weight: 700; margin: 24px 0 8px 0;">${generatedRecipeData ? generatedRecipeData.name[getCurrentLanguage()] : originalRecipe.name[getCurrentLanguage()]}</h2>
            <p style="font-size: 14px; color: #6e6e73; margin: 0 0 24px 0; font-style: italic;">"${generatedRecipeData ? generatedRecipeData.description[getCurrentLanguage()] : originalRecipe.description[getCurrentLanguage()]}"</p>
        `;

        if (generatedRecipeData) {
            contentHTML += `
                <div style="border: 2px solid #007AFF; border-radius: 12px; padding: 24px; background-color: #f0f7ff;">
                    <h3 style="font-size: 20px; font-weight: 700; margin-top: 0;">AI Generated Recipe</h3>
                    <div style="margin-top: 16px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                        ${createComparisonSettingsHTML(originalRecipe.settings, generatedRecipeData.settings)}
                    </div>
                    ${originalRecipe.colorDepth ? `<h4 style="font-size: 16px; font-weight: 600; margin: 24px 0 12px 0;">Color Depth</h4><div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px;">${createComparisonSettingsHTML(originalRecipe.colorDepth, generatedRecipeData.colorDepth)}</div>` : ''}
                </div>
                 <p style="font-size: 12px; color: #6e6e73; text-align: center; margin-top: 16px;">Based on original recipe: ${originalRecipe.name[getCurrentLanguage()]}</p>
            `;
        } else {
             contentHTML += `
                <h3 style="font-size: 16px; font-weight: 600; margin: 24px 0 12px 0;">White Balance</h3>
                <div style="background-color: #f8f9fa; border-radius: 8px; padding: 12px; font-size: 18px; font-weight: 600;">${originalRecipe.whiteBalance}</div>
                <h3 style="font-size: 16px; font-weight: 600; margin: 24px 0 12px 0;">Main Settings</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">${createSettingsHTML(originalRecipe.settings)}</div>
                ${originalRecipe.colorDepth ? `<h3 style="font-size: 16px; font-weight: 600; margin: 24px 0 12px 0;">Color Depth</h3><div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px;">${createSettingsHTML(originalRecipe.colorDepth)}</div>` : ''}
                ${originalRecipe.detailSettings ? `<h3 style="font-size: 16px; font-weight: 600; margin: 24px 0 12px 0;">Detail</h3><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">${createSettingsHTML(originalRecipe.detailSettings)}</div>` : ''}
             `;
        }
        
        contentHTML += `<p style="text-align: center; margin-top: 40px; font-size: 12px; color: #9ca3af;">Generated from sonycolorlab.app</p>`;

        pdfContentEl.innerHTML = contentHTML;
        document.body.appendChild(pdfContentEl);

        const canvas = await html2canvas(pdfContentEl, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        document.body.removeChild(pdfContentEl);

        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        const fileName = `SonyColorLab-${generatedRecipeData ? generatedRecipeData.name.en : originalRecipe.name.en}.pdf`;
        pdf.save(fileName.replace(/[^a-z0-9]/gi, '-').toLowerCase());

    } catch (error) {
        console.error("Failed to generate PDF:", error);
        showToast("Sorry, there was an error creating the PDF.", true);
    } finally {
        btn.innerHTML = originalBtnContent;
        btn.disabled = false;
    }
}

async function shareRecipe(recipeId) {
    const recipe = recipesData.find(r => r.id === recipeId);
    if (!recipe) return;

    const shareData = {
        title: `Sony Color Lab: ${recipe.name[getCurrentLanguage()]}`,
        text: `Check out this Sony Alpha color recipe: "${recipe.name[getCurrentLanguage()]}".\n${recipe.description[getCurrentLanguage()]}`,
        url: window.location.href
    };
    
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(shareData.url);
            showToast('Recipe link copied to clipboard!');
        }
    } catch (error) {
        console.error('Error sharing:', error);
        if (error.name !== 'AbortError') {
             await navigator.clipboard.writeText(shareData.url);
             showToast('Sharing failed. Link copied instead!', true);
        }
    }
}


async function init() {
    initLanguage();

    // Initialize the Quiz module
    state.quiz.instance = new Quiz({
        state,
        getCurrentLanguage,
        recipesData,
        recipeImages,
        applyTranslations,
        renderView
    });

    document.body.addEventListener('mouseover', (e) => {
        const title = e.target.closest('.parameter-title');
        const tooltipEl = document.getElementById('infoTooltip');
        if (title && tooltipEl) {
            const key = title.dataset.paramKey;
            const explanation = parameterExplanations[key]?.[getCurrentLanguage()];
            if (explanation) {
                tooltipEl.innerHTML = explanation;
                const titleRect = title.getBoundingClientRect();
                tooltipEl.style.left = `${titleRect.left + window.scrollX}px`;
                tooltipEl.style.top = `${titleRect.bottom + window.scrollY + 8}px`;
                tooltipEl.classList.remove('hidden');
                setTimeout(() => tooltipEl.classList.add('visible'), 10);
            }
        }
    });
    document.body.addEventListener('mouseout', (e) => {
        if (e.target.closest('.parameter-title')) {
            const tooltipEl = document.getElementById('infoTooltip');
            if(tooltipEl) {
                tooltipEl.classList.remove('visible');
                setTimeout(() => tooltipEl.classList.add('hidden'), 200);
            }
        }
    });
    document.body.addEventListener('click', async (e) => {
        const target = e.target;
        const navBtn = target.closest('[data-view]');
        const langBtn = target.closest('.lang-btn-slider');
        const recipeItem = target.closest('.recipe-item');
        const trendingItem = target.closest('.trending-item');
        
        const collageItem = target.closest('.collage-item');
        if (collageItem) {
            openLightbox(collageItem.dataset.recipeId, collageItem.dataset.index);
            return;
        }

        if (target.closest('#homeBtn')) { await renderView('home'); return; }
        if (target.closest('#hamburgerBtn')) { document.getElementById('mobileNavMenu').classList.remove('translate-x-full'); return; }
        if (target.closest('#closeMobileNavBtn')) { document.getElementById('mobileNavMenu').classList.add('translate-x-full'); return; }
        if (target.closest('#backToListBtn') || target.closest('#backToChartBtn')) { resetToChartView(); return; }

        if (target.closest('#downloadPdfBtn')) {
            generateRecipePdf(target.closest('#downloadPdfBtn').dataset.recipeId);
            return;
        }
        if (target.closest('#shareRecipeBtn')) {
            shareRecipe(target.closest('#shareRecipeBtn').dataset.recipeId);
            return;
        }

        if (target.closest('#toggleSaveGuideBtn')) {
            const btn = target.closest('#toggleSaveGuideBtn');
            const content = btn.parentElement.querySelector('#saveGuideContent');
            const btnSpan = btn.querySelector('span');
            const isHidden = content.classList.contains('max-h-0');

            if (isHidden) {
                content.classList.remove('max-h-0');
                content.classList.add('max-h-[1000px]');
                btnSpan.dataset.translateKey = 'hideGuideBtn';
            } else {
                content.classList.add('max-h-0');
                content.classList.remove('max-h-[1000px]');
                btnSpan.dataset.translateKey = 'showGuideBtn';
            }
            applyTranslations();
            return;
        }

        // Updated Quiz modal event handling
        if (target.closest('#quizModal')) {
            if (target.closest('#closeQuizBtn')) { state.quiz.instance.close(); return; }
            if (target.closest('#retakeQuizBtn')) { state.quiz.instance.start(); return; }
            if (target.closest('#viewResultBtn')) {
                const recipeId = target.closest('#viewResultBtn').dataset.recipeId;
                state.quiz.instance.close();
                await renderView('recipeFormulas', recipeId);
                return;
            }
            if (target.closest('.quiz-option')) { state.quiz.instance.handleAnswer(e); return; }
        }

        if (target.closest('#aiLabModal')) {
            if (target.closest('#closeAILabBtn')) { closeAILab(); return; }
            if (target.closest('#cancelAIBtn')) {
                 Object.assign(state.ai, { userPrompt: '', generatedRecipe: null });
                 renderAILab();
                 return;
            }
            if (target.closest('#generateAIBtn')) { handleAIGeneration(); return; }
            if (target.closest('#confirmAIBtn')) { confirmAndCallAI(); return; }
            if (target.closest('#downloadAIPdfBtn')) {
                generateRecipePdf(target.closest('#downloadAIPdfBtn').dataset.recipeId, state.ai.generatedRecipe);
                return;
            }
        }

        if (target.closest('#captionLabModal')) {
            if (target.closest('#closeCaptionLabBtn')) { closeCaptionLab(); return; }
            if (target.closest('#generateCaptionBtn')) { handleCaptionGeneration(); return; }
            const copyBtn = target.closest('[data-copy-target]');
            if (copyBtn) {
                const targetId = copyBtn.dataset.copyTarget;
                const textToCopy = document.getElementById(targetId).innerText;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = copyBtn.querySelector('span').innerText;
                    copyBtn.querySelector('span').innerText = t('copiedBtn');
                    copyBtn.disabled = true;
                    setTimeout(() => {
                        copyBtn.querySelector('span').innerText = originalText;
                        copyBtn.disabled = false;
                    }, 2000);
                });
                return;
            }
        }

        // Updated Quiz start buttons
        if (target.closest('#startQuizBtn') || target.closest('#quizShortcutBtn')) { 
            state.quiz.instance.start(); 
            return; 
        }
        
        if (target.closest('#tweakWithAIBtn')) { openAILab(target.closest('#tweakWithAIBtn').dataset.recipeId); return; }
        if (target.closest('#captionAIBtn')) { openCaptionLab(target.closest('#captionAIBtn').dataset.recipeId); return; }

        if (navBtn) {
            if (navBtn.dataset.view === 'recipeFormulas' && state.currentView === 'recipeFormulas') {
                resetToChartView();
            } else {
                await renderView(navBtn.dataset.view);
            }
            if(target.closest('.nav-btn-mobile')) {
                 document.getElementById('mobileNavMenu').classList.add('translate-x-full');
            }
            return;
        }

        if (langBtn) {
            const newLang = langBtn.id === 'langEN' ? 'en' : 'vi';
            setLanguage(newLang);
            updateLangSlider();
            applyTranslations();
            if (state.currentView === 'recipeFormulas') {
                renderLibraryList();
                if (state.selectedRecipeId) {
                    renderLibraryDetails();
                } else {
                    renderColorMapChart('#colorMapContainer', recipesData);
                    fetchTrendingRecipes();
                }
            }
            return;
        }

        if (recipeItem) { handleRecipeSelection(recipeItem.dataset.recipeId); return; }
        if (trendingItem) { handleRecipeSelection(trendingItem.dataset.recipeId); return; }
    });
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxNext').addEventListener('click', showNextImage);
    document.getElementById('lightboxPrev').addEventListener('click', showPrevImage);
    document.getElementById('lightbox').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('lightbox').classList.contains('visible')) {
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'Escape') closeLightbox();
        }
    });
    document.addEventListener('input', e => {
        if(e.target.id === 'searchInput') renderLibraryList();
    });

    await renderView('home');
    updateLangSlider();

    initializeFirebase().then(() => {
        console.log("Firebase is ready in the background.");
        if (state.currentView === 'recipeFormulas') {
            fetchTrendingRecipes();
        }
    });
}

document.addEventListener("DOMContentLoaded", init);
