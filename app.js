// --- Firebase SDK Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- Local Module Imports ---
import recipesData from './recipes.js?v=2.3';

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
    currentLang: localStorage.getItem('sonycolorlab-lang') || 'en',
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

const translations = {
    headerTitle: {vi: "Alpha AI Color Lab", en: "Alpha AI Color Lab"},
    navRecipeFormulas: {vi:"Công thức màu", en:"Color Recipes"},
    landingTitle: {vi:"Tìm kiếm phong cách của bạn", en:"Find Your Signature Style"},
    landingSubtitle: {vi: "Khám phá và tạo ra công thức màu độc đáo cho máy ảnh Sony Alpha của bạn, với sự hỗ trợ từ AI.", en: "Discover and create unique color recipes for your Sony Alpha camera, powered by AI."},
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
    contributeRecipeBtn: { vi: "Đóng góp công thức mới", en: "Contribute New Recipe" },
    trendingTitle: {vi: "Công thức thịnh hành", en: "Trending Recipes"},
    trendingLoading: {vi: "Đang tải công thức thịnh hành...", en: "Loading trending recipes..."},
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
    tweakWithAI: {vi: "Tinh chỉnh với Gemini AI", en: "Tweak with AI"},
    aiKeyNotConfigured: { vi: "Chưa cấu hình Gemini API Key", en: "Gemini API Key not configured" },
    captionLabTitle: {vi: "Trợ lý Caption Viral", en: "Viral Caption Assistant"},
    captionLabDescription: {vi: "Nhập ý tưởng cho bài đăng của bạn. AI sẽ giúp bạn viết một caption thật 'chất' theo phong cách màu <b>{recipeName}</b>.", en: "Enter an idea for your post. AI will help you write a captivating caption in the <b>{recipeName}</b> color style."},
    captionPromptPlaceholder: {vi: "VD: một buổi chiều hoàng hôn ở Đà Lạt...", en: "E.g., a sunset afternoon in Dalat..."},
    generateCaptionBtn: {vi: "Tạo Caption", en: "Generate Caption"},
    captionResultTitle: {vi: "Gợi ý từ AI", en: "Suggestion from AI"},
    copyBtn: {vi: "Sao chép", en: "Copy"},
    copiedBtn: {vi: "Đã sao chép!", en: "Copied!"},
    captionFromAI: { vi: "Tạo Caption Viral", en: "Viral Caption AI" },
    shareRecipeBtn: {vi: "Chia sẻ Công thức", en: "Share Recipe"},
    downloadPDFBtn: {vi: "Tải PDF", en: "Download PDF"},
    saveGuideTitle: { vi: "Lưu công thức vào máy ảnh", en: "Save Recipe to Camera" },
    saveGuideSubtitle: { vi: "Sử dụng tính năng Camera Setting Memory trên các dòng máy Alpha có menu mới.", en: "Using the Camera Setting Memory feature on Alpha cameras with the new menu." },
    showGuideBtn: { vi: "Xem Hướng Dẫn Chi Tiết", en: "View Full Guide" },
    hideGuideBtn: { vi: "Ẩn Hướng Dẫn", en: "Hide Guide" }
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

const quizQuestions = [
    {
        question: { vi: "Bạn sẽ chụp gì hôm nay?", en: "What will you be shooting today?" },
        options: [
            { tags: ['portrait', 'fine-art-portrait', 'nostalgic-portrait'], text: { vi: 'Chân dung', en: 'Portraits' }, icon: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>' },
            { tags: ['landscape', 'travel', 'summer', 'golden-hour'], text: { vi: 'Phong cảnh', en: 'Landscape' }, icon: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>' },
            { tags: ['urban-night', 'street-photography', 'city-lights'], text: { vi: 'Đô thị', en: 'Urban' }, icon: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>' },
            { tags: ['lifestyle', 'everyday', 'family-photos'], text: { vi: 'Đời thường', en: 'Lifestyle' }, icon: '<path d="M17 8h-7a4 4 0 0 0-4 4v2a4 4 0 0 0 4 4h7a4 4 0 0 0 4-4v-2a4 4 0 0 0-4-4Z"/><path d="M17 18v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2"/><path d="M20 8v8"/>' }
        ]
    },
    {
        question: { vi: "Tone màu chủ đạo bạn muốn?", en: "What's your preferred color tone?" },
        options: [
            { tags: ['warm', 'golden-hour', 'amber-tint'], text: { vi: 'Ấm', en: 'Warm' }, icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>' },
            { tags: ['neutral', 'clean', 'balanced'], text: { vi: 'Trung tính', en: 'Neutral' }, icon: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>' },
            { tags: ['cool-tone', 'deep-blues', 'cyan-teal'], text: { vi: 'Lạnh', en: 'Cool' }, icon: '<line x1="2" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>' }
        ]
    },
    {
        question: { vi: "Kiểu tương phản bạn thích?", en: "How do you like your contrast?" },
        options: [
            { tags: ['high-contrast', 'dramatic', 'powerful'], text: { vi: 'Gắt', en: 'Punchy' }, icon: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>' },
            { tags: ['normal', 'balanced', 'versatile'], text: { vi: 'Trung tính', en: 'Natural' }, icon: '<path d="M5 12h14"/><path d="M12 5v14"/>' },
            { tags: ['soft-contrast', 'faded', 'lifted-blacks'], text: { vi: 'Nhẹ & Mờ', en: 'Soft & Faded' }, icon: '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" x2="2" y1="8" y2="22"/><line x1="17.5" x2="9" y1="15" y2="15"/>' },
        ]
    },
    {
        question: { vi: "Độ bão hòa màu sắc?", en: "And saturation?" },
        options: [
            { tags: ['high-saturation', 'vibrant', 'super-saturated'], text: { vi: 'Đậm', en: 'Rich' }, icon: '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.7-3.29C8.2 7.95 7 6.46 7 5.06V3"/><path d="M14 3v2.06c0 1.4-.93 2.89-2.3 3.9-1.13 1.03-1.7 2.13-1.7 3.29 0 2.22 1.8 4.05 4 4.05Z"/>' },
            { tags: ['normal', 'moderate', 'natural'], text: { vi: 'Trung tính', en: 'Natural' }, icon: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="currentColor"/>' },
            { tags: ['low-saturation', 'muted', 'faded'], text: { vi: 'Nhạt', en: 'Muted' }, icon: '<circle cx="12" cy="12" r="10"/><path d="M22 2 2 22"/>' },
            { tags: ['bw'], text: { vi: 'Trắng & Đen', en: 'Black & White' }, icon: '<circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0-10 10h20a10 10 0 0 0-10-10z"/>' }
        ]
    }
];

// --- LANGUAGE FUNCTIONS ---
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


// --- UTILITY FUNCTIONS ---
// ... (loadScript and showToast functions remain the same)

// --- UI & LOGIC FUNCTIONS ---
// ... (The rest of the app logic remains here)

