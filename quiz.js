/**
 * quiz.js
 * This module encapsulates all logic and data related to the "Find My Color" quiz.
 * * ==============================================
 * CẬP NHẬT TÍNH NĂNG AI - NGÀY 28/08/2025
 * ==============================================
 * - Cập nhật lại câu hỏi về Độ bão hòa màu theo yêu cầu.
 * - Thêm bước cuối cùng: cho phép người dùng nhập prompt để Gemini AI
 * sáng tạo một công thức màu hoàn toàn mới.
 * - Thêm logic gọi API và hiển thị kết quả do AI tạo ra.
 */

// --- Local Module Imports ---
import { callGeminiAPI } from './api.js';

// --- QUIZ DATA ---
const quizQuestions = [
    {
        question: { vi: "Bạn sẽ chụp gì hôm nay?", en: "What will you be shooting today?" },
        options: [
            { tags: ['portrait', 'fine-art-portrait', 'nostalgic-portrait'], text: { vi: 'Chân dung', en: 'Portraits' }, icon: '<circle cx="12" cy="8" r="5" stroke="#f43f5e" /><path d="M20 21a8 8 0 0 0-16 0" stroke="#f43f5e" />' },
            { tags: ['landscape', 'travel', 'summer', 'golden-hour'], text: { vi: 'Phong cảnh', en: 'Landscape' }, icon: '<path d="m8 3 4 8 5-5 5 15H2L8 3z" stroke="#22c55e"/>' },
            { tags: ['urban-night', 'street-photography', 'city-lights'], text: { vi: 'Đô thị', en: 'Urban' }, icon: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" stroke="#6366f1"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" stroke="#6366f1"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" stroke="#6366f1"/><path d="M10 6h4" stroke="#a78bfa"/><path d="M10 10h4" stroke="#a78bfa"/><path d="M10 14h4" stroke="#a78bfa"/><path d="M10 18h4" stroke="#a78bfa"/>' },
            { tags: ['lifestyle', 'everyday', 'family-photos'], text: { vi: 'Đời thường', en: 'Lifestyle' }, icon: '<path d="M17 8h-7a4 4 0 0 0-4 4v2a4 4 0 0 0 4 4h7a4 4 0 0 0 4-4v-2a4 4 0 0 0-4-4Z" stroke="#f97316"/><path d="M17 18v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2" stroke="#f97316"/><path d="M20 8v8" stroke="#f97316"/>' }
        ]
    },
    {
        question: { vi: "Tone màu chủ đạo bạn muốn?", en: "What's your preferred color tone?" },
        options: [
            { tags: ['warm', 'golden-hour', 'amber-tint'], text: { vi: 'Ấm', en: 'Warm' }, icon: '<circle cx="12" cy="12" r="4" stroke="#f59e0b"/><path d="M12 2v2" stroke="#f59e0b"/><path d="M12 20v2" stroke="#f59e0b"/><path d="m4.93 4.93 1.41 1.41" stroke="#f59e0b"/><path d="m17.66 17.66 1.41 1.41" stroke="#f59e0b"/><path d="M2 12h2" stroke="#f59e0b"/><path d="M20 12h2" stroke="#f59e0b"/><path d="m6.34 17.66-1.41 1.41" stroke="#f59e0b"/><path d="m19.07 4.93-1.41 1.41" stroke="#f59e0b"/>' },
            { tags: ['neutral', 'clean', 'balanced'], text: { vi: 'Trung tính', en: 'Neutral' }, icon: '<line x1="21" x2="14" y1="4" y2="4" stroke="#71717a"/><line x1="10" x2="3" y1="4" y2="4" stroke="#71717a"/><line x1="21" x2="12" y1="12" y2="12" stroke="#71717a"/><line x1="8" x2="3" y1="12" y2="12" stroke="#71717a"/><line x1="21" x2="16" y1="20" y2="20" stroke="#71717a"/><line x1="12" x2="3" y1="20" y2="20" stroke="#71717a"/><line x1="14" x2="14" y1="2" y2="6" stroke="#a1a1aa"/><line x1="8" x2="8" y1="10" y2="14" stroke="#a1a1aa"/><line x1="16" x2="16" y1="18" y2="22" stroke="#a1a1aa"/>' },
            { tags: ['cool-tone', 'deep-blues', 'cyan-teal'], text: { vi: 'Lạnh', en: 'Cool' }, icon: '<path d="M2 12h20" stroke="#0ea5e9"/><path d="M12 2v20" stroke="#0ea5e9"/><path d="m20 16-4-4 4-4" stroke="#38bdf8"/><path d="m4 8 4 4-4 4" stroke="#38bdf8"/><path d="m16 4-4 4-4-4" stroke="#38bdf8"/><path d="m8 20 4-4 4 4" stroke="#38bdf8"/>' }
        ]
    },
    {
        question: { vi: "Kiểu tương phản bạn thích?", en: "How do you like your contrast?" },
        options: [
            { tags: ['high-contrast', 'dramatic', 'powerful'], text: { vi: 'Gắt', en: 'Punchy' }, icon: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="#ef4444"/><polyline points="16 7 22 7 22 13" stroke="#ef4444"/>' },
            { tags: ['normal', 'balanced', 'versatile'], text: { vi: 'Trung tính', en: 'Natural' }, icon: '<path d="M5 12h14" stroke="#71717a"/><path d="M12 5v14" stroke="#71717a"/>' },
            { tags: ['soft-contrast', 'faded', 'lifted-blacks'], text: { vi: 'Nhẹ & Mờ', en: 'Soft & Faded' }, icon: '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" stroke="#a8a29e"/><line x1="16" x2="2" y1="8" y2="22" stroke="#a8a29e"/><line x1="17.5" x2="9" y1="15" y2="15" stroke="#a8a29e"/>' },
        ]
    },
    {
        question: { vi: "Bạn thích ảnh màu hay ảnh trắng đen?", en: "Do you prefer color or black & white?" },
        options: [
            { tags: ['color'], text: { vi: 'Ảnh màu', en: 'Color' }, icon: '<circle cx="12" cy="12" r="10" stroke="#3b82f6"/><path d="m2 12 2 2 4-4" stroke="#84cc16"/><path d="m14 7 2 2 4-4" stroke="#f97316"/><path d="M12 22 7.5 12" stroke="#ef4444"/>' },
            { tags: ['bw'], text: { vi: 'Trắng & Đen', en: 'Black & White' }, icon: '<circle cx="12" cy="12" r="10" stroke="#52525b"/><path d="M12 2a10 10 0 0 0-10 10h20a10 10 0 0 0-10-10z" fill="#71717a"/>' }
        ]
    },
    {
        type: 'conditional_saturation',
        question: { vi: "Bạn thích độ bão hòa màu như thế nào?", en: "How do you like your color saturation?" },
        options: [
            { tags: ['high-saturation', 'vibrant', 'super-saturated'], text: { vi: 'Đậm', en: 'Rich' }, icon: '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.7-3.29C8.2 7.95 7 6.46 7 5.06V3" stroke="#e11d48"/><path d="M14 3v2.06c0 1.4-.93 2.89-2.3 3.9-1.13 1.03-1.7 2.13-1.7 3.29 0 2.22 1.8 4.05 4 4.05Z" stroke="#f43f5e"/>' },
            { tags: ['normal', 'moderate', 'natural'], text: { vi: 'Vừa phải', en: 'Natural' }, icon: '<circle cx="12" cy="12" r="10" stroke="#71717a"/><circle cx="12" cy="12" r="4" fill="#a1a1aa"/>' },
            { tags: ['low-saturation', 'muted', 'faded'], text: { vi: 'Hơi nhạt', en: 'Muted' }, icon: '<circle cx="12" cy="12" r="10" stroke="#a1a1aa"/><path d="M22 2 2 22" stroke="#d4d4d8"/>' },
        ]
    },
    {
        type: 'ai_prompt',
        question: { vi: "Sáng tạo màu sắc theo cảm hứng của bạn", en: "Create a color recipe from your inspiration" },
        description: { vi: "Hãy miêu tả bối cảnh, cảm xúc, hoặc phong cách bạn muốn. Gemini sẽ cố gắng tạo ra một công thức màu độc đáo cho bạn. (Không bắt buộc)", en: "Describe the context, mood, or style you want. Gemini will try to create a unique color recipe for you. (Optional)" }
    }
];

export class Quiz {
    constructor(dependencies) {
        this.state = dependencies.state;
        this.getCurrentLanguage = dependencies.getCurrentLanguage;
        this.recipesData = dependencies.recipesData;
        this.recipeImages = dependencies.recipeImages;
        this.applyTranslations = dependencies.applyTranslations;
        this.renderView = dependencies.renderView;
        this.callGeminiAPI = callGeminiAPI;
    }

    start() {
        this.state.quiz.currentQuestionIndex = 0;
        this.state.quiz.answers = [];
        this.renderQuestion();
    }

    close() {
        // Visibility is handled by the caller in app.js.
    }

    handleAnswer(e) {
        const selectedOption = e.target.closest('.quiz-option');
        if (!selectedOption) return;

        document.querySelectorAll('.quiz-option').forEach(btn => btn.classList.remove('selected'));
        selectedOption.classList.add('selected');

        const tags = selectedOption.dataset.tags.split(',');
        this.state.quiz.answers.push(...tags);

        setTimeout(() => {
            const currentQuestion = quizQuestions[this.state.quiz.currentQuestionIndex];
            if (tags.includes('bw') && currentQuestion.options.some(o => o.tags.includes('bw'))) {
                 this.state.quiz.currentQuestionIndex += 2; // Skip saturation question
            } else {
                 this.state.quiz.currentQuestionIndex++;
            }
            this.renderQuestion();
        }, 300);
    }

    renderQuestion() {
        const quizContent = document.getElementById('quizContent');
        const progressBar = document.getElementById('quizProgressBar');
        let qIndex = this.state.quiz.currentQuestionIndex;
        
        const renderNewContent = () => {
            if (qIndex >= quizQuestions.length) {
                this.calculateAndShowResult();
                return;
            }

            const questionData = quizQuestions[qIndex];
            
            if (questionData.type === 'ai_prompt') {
                this.renderAIPromptScreen();
                progressBar.style.width = '100%';
                return;
            }

            const gridClass = `grid gap-4 ${questionData.options.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`;

            quizContent.innerHTML = `
                <div class="quiz-question-container">
                    <h3 class="text-2xl md:text-3xl font-semibold text-center mb-8">${questionData.question[this.getCurrentLanguage()]}</h3>
                    <div class="${gridClass}">
                        ${questionData.options.map(opt => `
                            <button class="quiz-option w-full text-left p-4 rounded-2xl flex items-center gap-4 border-2 border-gray-300 bg-transparent hover:bg-gray-100 transition-all duration-200" data-tags="${opt.tags.join(',')}">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide w-6 h-6 flex-shrink-0">
                                    ${opt.icon}
                                </svg>
                                <span class="font-semibold text-lg">${opt.text[this.getCurrentLanguage()]}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>`;
            
            progressBar.style.width = `${((qIndex) / (quizQuestions.length -1)) * 100}%`;
        };

        const currentContainer = quizContent.querySelector('.quiz-question-container');
        if (currentContainer) {
            currentContainer.classList.add('exiting');
            currentContainer.addEventListener('animationend', renderNewContent, { once: true });
        } else {
            renderNewContent();
        }
    }

    renderAIPromptScreen() {
        const quizContent = document.getElementById('quizContent');
        const questionData = quizQuestions.find(q => q.type === 'ai_prompt');

        quizContent.innerHTML = `
            <div class="quiz-question-container text-center view-transition">
                <h3 class="text-2xl md:text-3xl font-semibold mb-2">${questionData.question[this.getCurrentLanguage()]}</h3>
                <p class="text-gray-600 mb-6">${questionData.description[this.getCurrentLanguage()]}</p>
                <textarea id="aiQuizPrompt" class="w-full mt-4 p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all min-h-[100px]" placeholder="${this.getCurrentLanguage() === 'vi' ? 'VD: một buổi chiều hoàng hôn ở Đà Lạt, tông màu cine, hơi buồn...' : 'e.g., a sunset afternoon in Dalat, cinematic tone, a bit melancholic...'}"></textarea>
                <div class="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <button id="generateAiRecipeBtn" class="btn btn-primary py-3 px-8 text-base">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-5 h-5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                        <span>Sáng tạo với AI</span>
                    </button>
                    <button id="skipAiBtn" class="btn bg-gray-200 text-gray-800 py-3 px-8 text-base">
                        <span>Bỏ qua & Xem gợi ý</span>
                    </button>
                </div>
            </div>`;

        document.getElementById('skipAiBtn').addEventListener('click', () => this.calculateAndShowResult());
        document.getElementById('generateAiRecipeBtn').addEventListener('click', () => this.handleAIGeneration());
    }

    async handleAIGeneration() {
        const userInput = document.getElementById('aiQuizPrompt').value.trim();
        const quizContent = document.getElementById('quizContent');

        if (!userInput) {
            this.calculateAndShowResult();
            return;
        }

        quizContent.innerHTML = `<div class="flex flex-col items-center justify-center h-64"><div class="loader-dark"></div><p class="mt-4 text-gray-600">Gemini đang sáng tạo...</p></div>`;

        const preferences = this.state.quiz.answers.join(', ');
        const expertPrompt = `As a professional colorist specializing in Sony Picture Profiles, analyze the user's preferences from a quiz: "${preferences}". Now, consider the user's creative prompt: "${userInput}". Your task is to generate a completely new, creative, and fully detailed JSON object representing a unique color recipe that matches this inspiration. The new JSON must be a complete, valid recipe object following this exact structure: { "id": "SCL-AI-001", "name": { "vi": "...", "en": "..." }, "description": { "vi": "...", "en": "..." }, "type": "color", "tags": [], "whiteBalance": "...", "settings": { "Black level": 0, "Gamma": "...", "Black Gamma": "...", "Knee": "...", "Color Mode": "...", "Saturation": 0, "Color Phase": 0 }, "colorDepth": { "R": 0, "G": 0, "B": 0, "C": 0, "M": 0, "Y": 0 }, "detailSettings": { "Level": 0 }, "personalityColor": "#...", "coords": { "x": 0, "y": 0 } }. You must only respond with the raw JSON object, without any surrounding text, explanations, or markdown formatting. The generated name and description must be in Vietnamese. The 'coords' should be your estimation of where this recipe would fit on a color map from -10 to 10.`;

        try {
            const generatedRecipe = await this.callGeminiAPI(expertPrompt, null);
            this.showAIResult(generatedRecipe);
        } catch (error) {
            console.error("Quiz Gemini API call failed:", error);
            quizContent.innerHTML = `
                <div class="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 class="text-xl font-bold text-red-800">Đã có lỗi xảy ra</h3>
                    <p class="mt-2 text-red-700">Rất tiếc, không thể tạo công thức lúc này. Vui lòng thử lại.</p>
                    <button id="retakeQuizBtn" class="btn bg-gray-200 text-gray-800 py-3 px-8 text-base mt-4">
                        <span>Làm lại trắc nghiệm</span>
                    </button>
                </div>`;
            document.getElementById('retakeQuizBtn').addEventListener('click', () => this.start());
        }
    }

    showAIResult(recipe) {
        const quizContent = document.getElementById('quizContent');
        document.getElementById('quizProgressBar').style.width = '100%';

        const createSettingsHTML = (settings) => Object.entries(settings || {}).map(([key, value]) => `
            <div class="flex flex-col p-3 rounded-lg bg-white">
                <span class="text-sm text-gray-500 font-medium">${key}</span>
                <span class="font-semibold text-lg text-gray-800">${value}</span>
            </div>`).join('');

        quizContent.innerHTML = `
            <div class="text-center view-transition">
                <h3 class="text-2xl font-bold">Công thức Sáng tạo từ Gemini!</h3>
                <p class="mt-2 text-gray-600">Đây là công thức độc đáo được tạo ra dựa trên cảm hứng của bạn:</p>
                <div class="my-8 p-6 bg-gray-100 rounded-2xl border text-left">
                    <h4 class="text-2xl font-bold text-center">${recipe.name[this.getCurrentLanguage()]}</h4>
                    <p class="text-gray-600 mt-1 text-center italic">"${recipe.description[this.getCurrentLanguage()]}"</p>
                    
                    <h5 class="text-base font-bold mt-6 mb-2">Cân bằng trắng (WB)</h5>
                    <div class="p-3 bg-white rounded-lg font-semibold">${recipe.whiteBalance}</div>

                    <h5 class="text-base font-bold mt-4 mb-2">Cài đặt Chính</h5>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-2">${createSettingsHTML(recipe.settings)}</div>
                    
                    ${recipe.colorDepth ? `<h5 class="text-base font-bold mt-4 mb-2">Độ sâu màu</h5><div class="grid grid-cols-3 md:grid-cols-6 gap-2">${createSettingsHTML(recipe.colorDepth)}</div>` : ''}
                    ${recipe.detailSettings ? `<h5 class="text-base font-bold mt-4 mb-2">Chi tiết</h5><div class="grid grid-cols-2 md:grid-cols-3 gap-2">${createSettingsHTML(recipe.detailSettings)}</div>` : ''}
                </div>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button id="retakeQuizBtn" class="btn bg-gray-200 text-gray-800 py-3 px-8 text-base">
                        <span>Làm lại trắc nghiệm</span>
                    </button>
                </div>
            </div>`;
            
        document.getElementById('retakeQuizBtn').addEventListener('click', () => this.start());
    }

    calculateAndShowResult() {
        const isBW = this.state.quiz.answers.includes('bw');
        const availableRecipes = this.recipesData.filter(r => isBW ? r.type === 'bw' : r.type === 'color');

        const scores = availableRecipes.map(recipe => {
            let score = recipe.tags.reduce((acc, tag) => acc + (this.state.quiz.answers.includes(tag) ? 1 : 0), 0);
            return { id: recipe.id, score: score };
        });

        scores.sort((a, b) => b.score - a.score);
        const bestMatch = this.recipesData.find(r => r.id === scores[0].id);
        
        const quizContent = document.getElementById('quizContent');
        document.getElementById('quizProgressBar').style.width = '100%';

        quizContent.innerHTML = `
            <div class="text-center view-transition">
                <h3 class="text-2xl font-bold" data-translate-key="quizResultTitle"></h3>
                <p class="mt-2 text-gray-600" data-translate-key="quizResultDescription"></p>
                <div class="my-8 p-6 bg-gray-100 rounded-2xl border flex flex-col sm:flex-row items-center gap-6">
                    <img src="${this.recipeImages[bestMatch.id][0]}" class="w-full sm:w-48 h-32 rounded-lg object-cover shadow-lg" alt="Preview">
                    <div class="text-left">
                        <h4 class="text-xl font-bold">${bestMatch.name[this.getCurrentLanguage()]}</h4>
                        <p class="text-gray-600 mt-1">${bestMatch.description[this.getCurrentLanguage()]}</p>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button id="viewResultBtn" data-recipe-id="${bestMatch.id}" class="btn btn-primary py-3 px-8 text-base">
                        <span data-translate-key="viewRecipeBtn"></span>
                    </button>
                    <button id="retakeQuizBtn" class="btn bg-gray-200 text-gray-800 py-3 px-8 text-base">
                        <span data-translate-key="retakeQuizBtn"></span>
                    </button>
                </div>
            </div>`;
            
        this.applyTranslations();
    }
}
