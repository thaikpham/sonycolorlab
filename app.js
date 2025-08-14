// --- Firebase SDK Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- CONFIGURATION & STATE ---
// Các placeholder này sẽ được thay thế bởi build script
const API_KEY = "%%GEMINI_API_KEY%%";
const __firebase_config = "%%FIREBASE_CONFIG%%";
const __app_id = "%%APP_ID%%";

const isAIEnabled = API_KEY && API_KEY !== '%%GEMINI_API_KEY%%';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

const state = {
    currentLang: 'vi',
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
        currentQuestionIndex: 0,
        answers: [],
    },
    firebase: {
        db: null,
    },
    lightbox: {
        images: [],
        currentIndex: 0,
    }
    // REMOVED: state.animation object
};

const mainContentEl = document.getElementById('mainContent');

// Cache-busting: Thêm version query để buộc tải lại file mới khi có thay đổi
import recipesData from './recipes.js?v=2.1';

// --- UPDATED: Quiz questions with Lucide icons ---
const quizQuestions = [
    {
        question: { vi: "Bạn sẽ chụp gì hôm nay?", en: "What will you be shooting today?" },
        options: [
            { tags: ['portrait', 'fine-art-portrait', 'nostalgic-portrait'], text: { vi: 'Chân dung', en: 'Portraits' }, icon: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>' },
            { tags: ['landscape', 'travel', 'summer', 'golden-hour'], text: { vi: 'Phong cảnh', en: 'Landscape' }, icon: '<path d="m2 21 17.2-17.2a2.4 2.4 0 0 1 3.4 3.4L5.4 21H2z"/><path d="m15 15 6 6"/>' },
            { tags: ['urban-night', 'street-photography', 'city-lights'], text: { vi: 'Đô thị', en: 'Urban' }, icon: '<rect width="16" height="16" x="4" y="4" rx="2"/><path d="M9 4v16"/><path d="M15 4v16"/>' },
            { tags: ['lifestyle', 'everyday', 'family-photos'], text: { vi: 'Đời thường', en: 'Lifestyle' }, icon: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>' }
        ]
    },
    {
        question: { vi: "Tone màu chủ đạo bạn muốn?", en: "What's your preferred color tone?" },
        options: [
            { tags: ['warm', 'golden-hour', 'amber-tint'], text: { vi: 'Ấm', en: 'Warm' }, icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>' },
            { tags: ['neutral', 'clean', 'balanced'], text: { vi: 'Trung tính', en: 'Neutral' }, icon: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>' },
            { tags: ['cool-tone', 'deep-blues', 'cyan-teal'], text: { vi: 'Lạnh', en: 'Cool' }, icon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>' }
        ]
    },
    {
        question: { vi: "Kiểu tương phản bạn thích?", en: "How do you like your contrast?" },
        options: [
            { tags: ['high-contrast', 'dramatic', 'powerful'], text: { vi: 'Gắt', en: 'Punchy' }, icon: '<circle cx="12" cy="12" r="10"/><path d="M12 18a6 6 0 0 0 0-12v12z"/>' },
            { tags: ['normal', 'balanced', 'versatile'], text: { vi: 'Trung tính', en: 'Natural' }, icon: '<path d="M5 12h14"/><path d="M12 5v14"/>' },
            { tags: ['soft-contrast', 'faded', 'lifted-blacks'], text: { vi: 'Nhẹ & Mờ', en: 'Soft & Faded' }, icon: '<circle cx="12" cy="12" r="10"/>' },
        ]
    },
    {
        question: { vi: "Độ bão hòa màu sắc?", en: "And saturation?" },
        options: [
            { tags: ['high-saturation', 'vibrant', 'super-saturated'], text: { vi: 'Đậm', en: 'Rich' }, icon: '<circle cx="12" cy="12" r="10" fill="currentColor"/>' },
            { tags: ['normal', 'moderate', 'natural'], text: { vi: 'Trung tính', en: 'Natural' }, icon: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="currentColor"/>' },
            { tags: ['low-saturation', 'muted', 'faded'], text: { vi: 'Nhạt', en: 'Muted' }, icon: '<circle cx="12" cy="12" r="10"/><path d="m2 2 20 20"/>' },
            { tags: ['bw'], text: { vi: 'Trắng & Đen', en: 'Black & White' }, icon: '<circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0-10 10h20a10 10 0 0 0-10-10z"/>' }
        ]
    }
];

const translations = {
    headerTitle: {vi: "Alpha AI Color Lab", en: "Alpha AI Color Lab"},
    navRecipeFormulas: {vi:"Công thức màu", en:"Color Recipes"},
    landingTitle: {vi:"Tìm kiếm phong cách của bạn", en:"Find Your Signature Style"},
    startExploringBtn: {vi:"Khám phá tất cả", en:"Explore All Recipes"},
    findMyColorBtn: {vi: "Tìm màu cho bạn", en: "Find My Color"},
    quizTitle: {vi: "Trắc nghiệm Tìm màu", en: "Color Finder Quiz"},
    quizResultTitle: {vi: "Gợi ý cho bạn!", en: "Our Suggestion For You!"},
    quizResultDescription: {vi: "Dựa trên câu trả lời của bạn, chúng tôi nghĩ bạn sẽ thích công thức này:", en: "Based on your answers, we think you'll love this recipe:"},
    viewRecipeBtn: {vi: "Xem chi tiết công thức", en: "View Recipe Details"},
    retakeQuizBtn: {vi: "Làm lại trắc nghiệm", en: "Retake Quiz"},
    searchInputPlaceholder: {vi: "Tìm công thức...", en: "Search recipes..."},
    recipeDetailWelcomeTitle: {vi: "Bản đồ màu Tương tác", en: "Interactive Color Map"},
    recipeDetailWelcomeText: {vi: "Khám phá các công thức màu một cách trực quan. Chọn một công thức trong danh sách hoặc trên biểu đồ để xem chi tiết.", en: "Explore color recipes visually. Select a recipe from the list or the chart to see details."},
    whiteBalanceTitle: {vi: "Cân bằng trắng (WB)", en: "White Balance (WB)"},
    recipeSettingsTitle: {vi: "Cài đặt Chính", en: "Main Settings"},
    colorDepthTitle: {vi: "Độ sâu màu", en: "Color Depth"},
    detailTitle: {vi: "Chi tiết", en: "Detail"},
    sonyGuideBtn: {vi: "Xem tài liệu gốc từ Sony", en: "View Official Sony Guide"},
    backToChartBtn: {vi: "← Quay lại Bản đồ màu", en: "← Back to Color Map"},
    backToListBtn: {vi: "← Quay lại danh sách", en: "← Back to list"},
    ctaTitle: {vi: "Chia sẻ tác phẩm của bạn!", en: "Share Your Creations!"},
    ctaText: {vi: "Yêu thích công thức này? Hãy chia sẻ ảnh của bạn lên group Facebook <b>Sony Alpha Vietnam | Official</b> với hashtag <b>#sonycolorlab</b> và {recipeHashtag} để có cơ hội được giới thiệu!", en: "Love this recipe? Share your photos on the <b>Sony Alpha Vietnam | Official</b> Facebook group with hashtags <b>#sonycolorlab</b> and {recipeHashtag} for a chance to be featured!"},
    ctaButton: {vi: "Tham gia Nhóm", en: "Join The Group"},
    trendingTitle: {vi: "Thịnh hành nhất", en: "Trending Now"},
    aiLabTitle: {vi: "Gemini AI Colorist", en: "Gemini AI Colorist"},
    aiLabDescription: {vi: "Mô tả phong cách bạn muốn, Gemini sẽ tinh chỉnh công thức màu <b>{recipeName}</b> cho bạn.", en: "Describe the style you want, and Gemini will tweak the <b>{recipeName}</b> recipe for you."},
    aiPromptPlaceholder: {vi: "VD: tông màu trong trẻo, hơi ngả xanh như phim của Wes Anderson...", en: "E.g., a clean, slightly teal look like a Wes Anderson film..."},
    aiGenerateBtn: {vi: "Tinh chỉnh với AI", en: "Tweak with AI"},
    aiConfirmPromptTitle: {vi: "Xác nhận yêu cầu", en: "Confirm Request"},
    aiConfirmPromptText: {vi: "OK! Tôi sẽ tạo một phiên bản mới của <b>{recipeName}</b> với phong cách <i>\"{userPrompt}\"</i>. Tiếp tục nhé?", en: "Got it! I will generate a new version of <b>{recipeName}</b> with a style inspired by <i>\"{userPrompt}\"</i>. Shall we proceed?"},
    aiConfirmBtn: {vi: "Đồng ý", en: "Confirm & Generate"},
    aiCancelBtn: {vi: "Hủy", en: "Cancel"},
    aiComparisonTitle: {vi: "Kết quả từ Gemini AI", en: "Result from Gemini AI"},
    aiComparisonDescription: {vi: "Đây là phiên bản mới được tạo dựa trên yêu cầu của bạn. Các thông số thay đổi đã được làm nổi bật.", en: "Here is the new version based on your request. Changed parameters are highlighted."},
    aiOriginalTitle: {vi: "Công thức gốc", en: "Original Recipe"},
    aiNewTitle: {vi: "Công thức mới (AI)", en: "New Recipe (AI)"},
    aiErrorTitle: {vi: "Đã có lỗi xảy ra", en: "An Error Occurred"},
    aiErrorText: {vi: "Rất tiếc, không thể tạo công thức lúc này. Vui lòng kiểm tra lại API Key hoặc thử lại sau.", en: "Sorry, the recipe could not be generated at this time. Please check your API Key or try again later."},
    tweakWithAI: {vi: "Tinh chỉnh với Gemini AI", en: "Tweak with Gemini AI"},
    aiKeyNotConfigured: { vi: "Chưa cấu hình Gemini API Key", en: "Gemini API Key not configured" },
    captionLabTitle: {vi: "Trợ lý Caption Viral", en: "Viral Caption Assistant"},
    captionLabDescription: {vi: "Nhập ý tưởng cho bài đăng của bạn. AI sẽ giúp bạn viết một caption thật 'chất' theo phong cách màu <b>{recipeName}</b>.", en: "Enter an idea for your post. AI will help you write a captivating caption in the <b>{recipeName}</b> color style."},
    captionPromptPlaceholder: {vi: "VD: một buổi chiều hoàng hôn ở Đà Lạt...", en: "E.g., a sunset afternoon in Dalat..."},
    generateCaptionBtn: {vi: "Tạo Caption", en: "Generate Caption"},
    captionResultTitle: {vi: "Gợi ý từ AI", en: "Suggestion from AI"},
    copyBtn: {vi: "Sao chép", en: "Copy"},
    copiedBtn: {vi: "Đã sao chép!", en: "Copied!"},
    captionFromAI: { vi: "Tạo Caption Viral", en: "Viral Caption AI" }
};

const parameterExplanations = {
    'Black level': { vi: "Điều chỉnh điểm đen. Giá trị âm (-) làm vùng tối sâu hơn, tăng tương phản. Giá trị dương (+) nâng vùng tối, tạo hiệu ứng 'mờ' hoài cổ.", en: "Adjusts the black point. Negative (-) values deepen shadows for more contrast. Positive (+) values lift shadows for a 'faded' look." },
    'Gamma': { vi: "Xác định đường cong tương phản tổng thể, là nền tảng cho 'look' của bạn. Cine & S-Cinetone cho cảm giác điện ảnh, trong khi S-Log tối đa hóa dải tần nhạy sáng để hậu kỳ.", en: "Defines the overall contrast curve, the foundation of your look. Cine & S-Cinetone provide a cinematic feel, while S-Log maximizes dynamic range for post-production." },
    'Black Gamma': { vi: "Tinh chỉnh độ tương phản riêng trong vùng tối. 'Range' xác định vùng ảnh hưởng (Hẹp/Vừa/Rộng). 'Level' tăng hoặc giảm độ sáng của vùng đó.", en: "Fine-tunes contrast specifically in the shadow areas. 'Range' sets the affected area (Narrow/Middle/Wide). 'Level' brightens or darkens that area." },
    'Knee': { vi: "Kiểm soát cách các vùng sáng (highlight) được nén lại để tránh bị 'cháy sáng'. Chế độ Tự động hoạt động tốt, trong khi Thủ công cho phép kiểm soát chính xác hơn.", en: "Controls how highlights are compressed to prevent 'clipping' (overexposure). Auto mode works well; Manual mode offers precise control." },
    'Color Mode': { vi: "Xác định không gian màu và cách màu sắc được tái tạo. Nên chọn chế độ phù hợp với Gamma đã chọn (ví dụ: S-Cinetone, S-Gamut3.Cine).", en: "Determines the color space and how colors are rendered. Should be matched with the chosen Gamma (e.g., S-Cinetone, S-Gamut3.Cine)." },
    'Saturation': { vi: "Điều chỉnh cường độ tổng thể của tất cả các màu. Tăng để có màu rực rỡ, giảm để có màu dịu hơn hoặc đơn sắc.", en: "Adjusts the overall intensity of all colors. Increase for vibrant colors, decrease for a more muted or monochrome look." },
    'Color Phase': { vi: "Dịch chuyển nhẹ toàn bộ quang phổ màu về phía đỏ hoặc xanh lá. Hữu ích để tinh chỉnh tông màu tổng thể hoặc cân bằng màu giữa các máy ảnh.", en: "Slightly shifts the entire color spectrum towards red or green. Useful for subtle global tone adjustments or matching cameras." },
    'Color Depth': { vi: "Công cụ mạnh nhất. Tăng/giảm độ sáng của từng kênh màu riêng lẻ (Đỏ, Lục, Lam, Cyan, Magenta, Vàng) để tinh chỉnh màu sắc một cách chính xác.", en: "The most powerful tool. Brightens or darkens individual color channels (R, G, B, C, M, Y) for precise color tuning." },
    'R': { vi: "Điều chỉnh độ sáng (luminance) của kênh màu Đỏ. Tăng (+) để màu đỏ tối và đậm hơn (son môi, da). Giảm (-) để sáng và nhạt hơn.", en: "Adjusts the luminance of the Red channel. Increase (+) for darker, richer reds (lipstick, skin). Decrease (-) for lighter, paler reds." },
    'G': { vi: "Điều chỉnh độ sáng (luminance) của kênh màu Lục. Tăng (+) để màu xanh lá cây tối và đậm hơn (cây cỏ). Giảm (-) để sáng và nhạt hơn.", en: "Adjusts the luminance of the Green channel. Increase (+) for darker, richer greens (foliage). Decrease (-) for lighter, paler greens." },
    'B': { vi: "Điều chỉnh độ sáng (luminance) của kênh màu Lam. Tăng (+) để màu xanh dương tối và đậm hơn (quần áo, đường phố). Giảm (-) để sáng và nhạt hơn.", en: "Adjusts the luminance of the Blue channel. Increase (+) for darker, richer blues (clothing, streets). Decrease (-) for lighter, paler blues." },
    'C': { vi: "Điều chỉnh độ sáng (luminance) của kênh màu Lục lam. Tăng (+) để màu da trời tối và đậm hơn. Giảm (-) để sáng và nhạt hơn.", en: "Adjusts the luminance of the Cyan channel. Increase (+) for darker, richer cyan (sky). Decrease (-) for lighter, paler cyan." },
    'M': { vi: "Điều chỉnh độ sáng (luminance) của kênh màu Cánh sen. Tăng (+) để màu hồng/tím tối và đậm hơn (da người, son môi). Giảm (-) để sáng và nhạt hơn.", en: "Adjusts the luminance of the Magenta channel. Increase (+) for darker, richer magenta (skin tones, lipstick). Decrease (-) for lighter, paler magenta." },
    'Y': { vi: "Điều chỉnh độ sáng (luminance) của kênh màu Vàng. Tăng (+) để màu vàng tối và đậm hơn (da người Á Đông). Giảm (-) để sáng và nhạt hơn.", en: "Adjusts the luminance of the Yellow channel. Increase (+) for darker, richer yellows (Asian skin tones). Decrease (-) for lighter, paler yellows." },
    'Detail': { vi: "Kiểm soát độ sắc nét của hình ảnh. Giảm mạnh (ví dụ: -7) để có 'look' mềm mại, giống phim. Tăng để có hình ảnh sắc nét, hiện đại.", en: "Controls image sharpening. Decrease significantly (e.g., -7) for a soft, filmic look. Increase for a crisp, modern image." },
    'Level': { vi: "Điều chỉnh mức độ sắc nét tổng thể. Máy ảnh Sony vốn đã rất nét. Giảm để ảnh mềm mại hơn (-7 để giả lập chất ảnh phim), hoặc tăng để nét hơn nữa.", en: "Adjusts the overall sharpening level. Sony cameras are inherently sharp. Decrease for a softer look (-7 mimics film), or increase for even more sharpness."}
};

// --- UI & LOGIC FUNCTIONS ---
function t(key) { return translations[key]?.[state.currentLang] || key; }

function applyTranslations() {
    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.dataset.translateKey;
        if (translations[key]?.[state.currentLang]) {
            const element = el;
            if (element.placeholder !== undefined) element.placeholder = t(key);
            else element.innerHTML = t(key);
        }
    });
}

function createFullRecipeHTML(recipe) {
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
                        alt="Ảnh demo ${index + 1} cho công thức màu ${recipe.name[state.currentLang]}"
                        onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'flex items-center justify-center h-full text-gray-400 text-xs p-2 text-center\\'>Không tải được ảnh</div>';"
                    >
                </div>`;
        }).join('');

        return `<div class="photo-collage images-${count}">${imageElements}</div>`;
    };

    const createCTAHTML = (recipe) => {
        const recipeHashtag = `#${recipe.id.replace(/-/g, '')}`;
        const ctaText = t('ctaText').replace('{recipeHashtag}', `<b class="font-semibold text-blue-900">${recipeHashtag}</b>`);
        return `<div class="mt-8 p-5 md:p-6 bg-blue-50 border border-blue-200/50 rounded-2xl text-center"><h4 class="text-lg md:text-xl font-bold text-blue-800" data-translate-key="ctaTitle"></h4><p class="mt-2 text-blue-700/90 max-w-2xl mx-auto text-sm md:text-base">${ctaText}</p><a href="https://www.facebook.com/groups/sonyalphavietnamoffical" target="_blank" rel="noopener noreferrer" class="btn btn-primary mt-5 py-2.5 px-6 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users h-5 w-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg><span data-translate-key="ctaButton"></span></a></div>`;
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
        ${createCollageHTML(recipe.demoImages)}
        <div class="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <button class="btn btn-primary py-3 px-6" id="tweakWithAIBtn" data-recipe-id="${recipe.id}" ${aiDisabledAttr}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-5 h-5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                <span data-translate-key="tweakWithAI"></span>
            </button>
            <button class="btn bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 shadow-lg shadow-purple-500/30" id="captionAIBtn" data-recipe-id="${recipe.id}" ${aiDisabledAttr}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text w-5 h-5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                <span data-translate-key="captionFromAI"></span>
            </button>
            <a href="https://helpguide.sony.net/di/pp/v1/en/contents/TP0000909106.html" target="_blank" rel="noopener noreferrer" class="btn bg-gray-700 hover:bg-gray-800 text-white py-3 px-6 shadow-lg shadow-gray-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open w-5 h-5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                <span data-translate-key="sonyGuideBtn"></span>
            </a>
        </div>
        ${createCTAHTML(recipe)}
        <div class="space-y-8 mt-8">
            ${sections.map(section => `<div><h4 class="text-xl font-bold mb-3 text-gray-700" data-translate-key="${section.titleKey}"></h4><div class="p-4 bg-gray-500/5 rounded-2xl">${section.content}</div></div>`).join('')}
        </div>
    `;
}

const viewTemplates = {
    // UPDATED: home template without animations and logo
    home: () => `
        <div id="homeView" class="w-full h-full flex items-center justify-center absolute inset-0 p-4 md:p-8">
            <div class="w-full max-w-2xl mx-auto text-center">
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 mb-4" data-translate-key="landingTitle"></h1>
                <p class="text-lg md:text-xl text-slate-600 max-w-xl mx-auto mt-4">Khám phá và tạo ra các công thức màu độc đáo cho máy ảnh Sony Alpha của bạn, được hỗ trợ bởi AI.</p>
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
                        <div id="welcomeText" class="text-center"><h2 class="text-2xl md:text-3xl font-bold text-gray-700" data-translate-key="recipeDetailWelcomeTitle"></h2><p class="text-neutral-500 mt-2 max-w-xl mx-auto" data-translate-key="recipeDetailWelcomeText"></p></div>
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
        .text(d => d.text[state.currentLang]);

    svg.append("g").attr("class", "grid")
        .call(d3.axisBottom(xScale).ticks(10).tickSize(height).tickFormat(""))
        .selectAll("line").attr("stroke", "#f1f5f9").attr("stroke-opacity", 0.7);
    svg.append("g").attr("class", "grid")
        .call(d3.axisLeft(yScale).ticks(10).tickSize(-width).tickFormat(""))
        .selectAll("line").attr("stroke", "#f1f5f9").attr("stroke-opacity", 0.7);

    svg.selectAll(".domain").remove();

    svg.append("text").attr("class", "axis-label").attr("text-anchor", "start").attr("x", 5).attr("y", yScale(0) - 8).text(state.currentLang === 'vi' ? '← Lạnh' : '← Cool');
    svg.append("text").attr("class", "axis-label").attr("text-anchor", "end").attr("x", width - 5).attr("y", yScale(0) - 8).text(state.currentLang === 'vi' ? 'Ấm →' : 'Warm →');
    svg.append("text").attr("class", "axis-label").attr("text-anchor", "middle").attr("x", xScale(0)).attr("y", -15).text(state.currentLang === 'vi' ? '↑ Tương phản Gắt' : '↑ Punchy Contrast');
    svg.append("text").attr("class", "axis-label").attr("text-anchor", "middle").attr("x", xScale(0)).attr("y", height + 25).text(state.currentLang === 'vi' ? '↓ Tương phản Dịu' : '↓ Soft Contrast');

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
        .text(d => d.name[state.currentLang]);

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
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            ${trendingRecipes.map(recipe => `
                <div class="trending-item rounded-xl p-3 cursor-pointer"
                     data-recipe-id="${recipe.id}"
                     style="--glow-color: ${recipe.personalityColor};">
                    <div class="flex items-center gap-3">
                        <div class="w-3 h-3 rounded-full flex-shrink-0" style="background-color: ${recipe.personalityColor};"></div>
                        <p class="text-sm font-semibold text-gray-700 truncate">${recipe.name[state.currentLang]}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    applyTranslations();
    container.style.display = 'block';
}

async function fetchTrendingRecipes() {
    if (!state.firebase.db) {
        console.warn("Firebase not available, using mock trending data.");
        const mockTrendingIDs = ["scl-001", "scl-003", "scl-008", "scl-027"];
        displayTrendingRecipes(mockTrendingIDs);
        return;
    }

    try {
        const docRef = doc(state.firebase.db, `artifacts/${__app_id}/public/data/trending/latest`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const trendingData = docSnap.data();
            if (trendingData.ids && trendingData.ids.length > 0) {
                displayTrendingRecipes(trendingData.ids);
            } else {
                 throw new Error("Trending IDs array is empty or missing.");
            }
        } else {
            throw new Error("Trending document does not exist.");
        }
    } catch (error) {
        console.error("Error fetching real trending data, falling back to mock data:", error);
        const mockTrendingIDs = ["scl-001", "scl-003", "scl-008", "scl-027"];
        displayTrendingRecipes(mockTrendingIDs);
    }
}

// --- QUIZ LOGIC ---
function startQuiz() {
    state.quiz.currentQuestionIndex = 0;
    state.quiz.answers = [];
    document.getElementById('quizModal').classList.remove('hidden');
    renderQuizQuestion();
}

function closeQuiz() { document.getElementById('quizModal').classList.add('hidden'); }

function renderQuizQuestion() {
    const quizContent = document.getElementById('quizContent');
    const progressBar = document.getElementById('quizProgressBar');
    const qIndex = state.quiz.currentQuestionIndex;

    const render = () => {
        if (qIndex >= quizQuestions.length) {
            calculateAndShowQuizResult();
            return;
        }
        const questionData = quizQuestions[qIndex];
        const hasThreeOptions = questionData.options.length === 3;
        const gridClass = `quiz-options-grid ${hasThreeOptions ? 'has-three-options' : ''}`;

        quizContent.innerHTML = `
            <div class="quiz-question-container">
                <h3 class="text-2xl md:text-3xl font-semibold text-center mb-8">${questionData.question[state.currentLang]}</h3>
                <div class="${gridClass}">
                    ${questionData.options.map(opt => `
                        <button class="quiz-option w-full text-left p-4 rounded-2xl flex items-center gap-4" data-tags="${opt.tags.join(',')}">
                            <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 border">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide w-6 h-6 text-gray-700">
                                    ${opt.icon}
                                </svg>
                            </div>
                            <span class="font-semibold text-lg text-gray-800">${opt.text[state.currentLang]}</span>
                        </button>
                    `).join('')}
                </div>
            </div>`;
        progressBar.style.width = `${((qIndex) / quizQuestions.length) * 100}%`;
    };

    const container = quizContent.querySelector('.quiz-question-container');
    if (container) {
        container.classList.add('exiting');
        setTimeout(() => { render(); }, 150);
    } else {
        render();
    }
}

function handleQuizAnswer(e) {
    const selectedOption = e.target.closest('.quiz-option');
    if (!selectedOption) return;
    document.querySelectorAll('.quiz-option').forEach(btn => btn.classList.remove('selected'));
    selectedOption.classList.add('selected');
    const tags = selectedOption.dataset.tags.split(',');
    state.quiz.answers.push(...tags);
    setTimeout(() => { state.quiz.currentQuestionIndex++; renderQuizQuestion(); }, 300);
}

function calculateAndShowQuizResult() {
    const scores = recipesData.map(recipe => {
        let score = recipe.tags.reduce((acc, tag) => acc + (state.quiz.answers.includes(tag) ? 1 : 0), 0);
        if (state.quiz.answers.includes('bw') && recipe.type === 'bw') { score += 2; }
        return { id: recipe.id, score: score };
    });
    scores.sort((a, b) => b.score - a.score);
    const bestMatch = recipesData.find(r => r.id === scores[0].id);
    const quizContent = document.getElementById('quizContent');
    document.getElementById('quizProgressBar').style.width = '100%';
    quizContent.innerHTML = `<div class="text-center view-transition"><h3 class="text-2xl font-bold" data-translate-key="quizResultTitle"></h3><p class="mt-2 text-gray-600" data-translate-key="quizResultDescription"></p><div class="my-8 p-6 bg-gray-100 rounded-2xl border flex flex-col sm:flex-row items-center gap-6"><img src="${bestMatch.demoImages[0]}" class="w-full sm:w-48 h-32 rounded-lg object-cover shadow-lg" alt="Preview"><div class="text-left"><h4 class="text-xl font-bold">${bestMatch.name[state.currentLang]}</h4><p class="text-gray-600 mt-1">${bestMatch.description[state.currentLang]}</p></div></div><div class="flex flex-col sm:flex-row gap-4 justify-center"><button id="viewResultBtn" data-recipe-id="${bestMatch.id}" class="btn btn-primary py-3 px-8 text-base"><span data-translate-key="viewRecipeBtn"></span></button><button id="retakeQuizBtn" class="btn bg-gray-200 text-gray-800 py-3 px-8 text-base"><span data-translate-key="retakeQuizBtn"></span></button></div></div>`;
    applyTranslations();
}

// --- OPTIMIZATION: Centralized Gemini API call function ---
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
    const recipeName = state.ai.originalRecipe.name[state.currentLang];
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
    const recipeName = state.ai.originalRecipe.name[state.currentLang];
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
                <p class="text-center text-gray-500">${generated.name[state.currentLang]}</p>
            </div>
        </div>
        <div class="mt-6 space-y-6">
            ${createComparisonGrid('recipeSettingsTitle', original.settings, generated.settings)}
            ${original.colorDepth ? createComparisonGrid('colorDepthTitle', original.colorDepth, generated.colorDepth) : ''}
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

    const expertPrompt = `As a professional colorist specializing in Sony Picture Profiles, analyze the following JSON object which represents an existing color recipe. Your task is to generate a new, modified JSON object based on the user's request: "${state.ai.userPrompt}". The new JSON must be a complete, valid recipe object. You must only respond with the raw JSON object, without any surrounding text, explanations, or markdown formatting. The generated recipe name and description must be in the same language as the user's prompt (${state.currentLang}). Original recipe: ${JSON.stringify(state.ai.originalRecipe)}`;

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
        const recipeName = state.captionAI.recipe.name[state.currentLang];
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
3.  **Language:** The entire response (caption and hashtags) MUST be in the same language as the User's Idea, which is: ${state.currentLang}.

**CONTEXT:**
* **Photographic Style:** "${recipe.name[state.currentLang]}" - This style is known for: "${recipe.description[state.currentLang]}".
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
// REMOVED: initializeBackgroundBlobs and initializeInteractiveLogo functions

function renderView(viewName, selectedId = null) {
    state.currentView = viewName;
    if (selectedId) { state.selectedRecipeId = selectedId; }

    const qrCodeContainer = document.getElementById('qrCodeContainer');
    if (qrCodeContainer) {
        qrCodeContainer.classList.toggle('hidden', viewName !== 'home');
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

function updateLangSlider() {
    const glider = document.getElementById('lang-glider');
    const langVI = document.getElementById('langVI');
    const langEN = document.getElementById('langEN');
    if (!glider || !langVI || !langEN) return;
    langVI.classList.toggle('text-blue-600', state.currentLang === 'vi');
    langVI.classList.toggle('text-gray-500', state.currentLang !== 'vi');
    langEN.classList.toggle('text-blue-600', state.currentLang === 'en');
    langEN.classList.toggle('text-gray-500', state.currentLang !== 'en');
    glider.style.transform = state.currentLang === 'vi' ? 'translateX(0%)' : 'translateX(100%)';
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
    const recipesToRender = recipesData.filter(r => r.name[state.currentLang].toLowerCase().includes(searchTerm) || r.description[state.currentLang].toLowerCase().includes(searchTerm));
    
    container.innerHTML = recipesToRender.map((recipe, index) => {
        const isSelected = recipe.id === state.selectedRecipeId;
        const glowStyle = isSelected ? `--glow-color: ${recipe.personalityColor};` : '';
        const animationStyle = `animation-delay: ${index * 40}ms;`;
        
        return `<div class="recipe-item p-3 rounded-xl cursor-pointer ${isSelected ? 'selected' : ''} recipe-item-stagger" 
                     data-recipe-id="${recipe.id}" 
                     style="${glowStyle} ${animationStyle}">
            <span class="font-semibold text-primary">${recipe.name[state.currentLang]}</span>
            <p class="text-sm text-neutral-600 mt-1 leading-snug">${recipe.description[state.currentLang]}</p>
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
            <h3 class="text-3xl md:text-4xl font-bold">${recipe.name[state.currentLang]}</h3>
            <p class="text-lg text-neutral-600 mt-1">"${recipe.description[state.currentLang]}"</p>
        </div>
        <div class="mt-8">${createFullRecipeHTML(recipe)}</div>
    `;
    applyTranslations();
}

function openLightbox(recipeId, startIndex) {
    const recipe = recipesData.find(r => r.id === recipeId);
    if (!recipe || !recipe.demoImages) return;

    state.lightbox.images = recipe.demoImages;
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

async function init() {
    // Attach global event listeners immediately
    document.body.addEventListener('mouseover', (e) => {
        const title = e.target.closest('.parameter-title');
        const tooltipEl = document.getElementById('infoTooltip');
        if (title && tooltipEl) {
            const key = title.dataset.paramKey;
            const explanation = parameterExplanations[key]?.[state.currentLang];
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

        if (target.closest('#quizModal')) {
            if (target.closest('#closeQuizBtn')) { closeQuiz(); return; }
            if (target.closest('#retakeQuizBtn')) { state.quiz.currentQuestionIndex = 0; state.quiz.answers = []; renderQuizQuestion(); return; }
            if (target.closest('#viewResultBtn')) {
                const recipeId = target.closest('#viewResultBtn').dataset.recipeId;
                closeQuiz();
                await renderView('recipeFormulas', recipeId);
                return;
            }
            if (target.closest('.quiz-option')) { handleQuizAnswer(e); return; }
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

        if (target.closest('#startQuizBtn') || target.closest('#quizShortcutBtn')) { startQuiz(); return; }
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
            state.currentLang = langBtn.id === 'langEN' ? 'en' : 'vi';
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

    // --- SIMPLIFIED INITIALIZATION FLOW ---

    // 1. Render the initial view HTML immediately.
    await renderView('home');

    // 2. Start non-critical tasks in the background.
    initializeFirebase().then(() => {
        console.log("Firebase is ready in the background.");
        // If the user navigates to the formulas page while firebase is initializing,
        // this ensures the trending recipes are fetched once ready.
        if (state.currentView === 'recipeFormulas') {
            fetchTrendingRecipes();
        }
    });
}

// Run init after the DOM is fully loaded.
document.addEventListener("DOMContentLoaded", init);
