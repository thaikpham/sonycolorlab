/**
 * quiz.js
 * This module encapsulates all logic and data related to the "Find My Color" quiz.
 * * ==============================================
 * NÂNG CẤP TÍNH NĂNG AI - CẬP NHẬT NGÀY 25/08/2025
 * ==============================================
 * - Thêm câu hỏi "Color vs. B&W".
 * - Thêm bước cuối cùng cho phép người dùng tải lên/chụp ảnh để AI phân tích.
 * - Tích hợp gọi API Gemini Vision để đưa ra gợi ý dựa trên ảnh và các lựa chọn trước đó.
 * - Cập nhật giao diện và luồng hoạt động của quiz để hỗ trợ tính năng mới.
 */

import { state } from './state.js';
import { callGeminiAPI } from './api.js';
import recipesData from './recipes-core.js';
import recipeImages from './recipes-images.js';

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
        // This is a conditional question, shown only if 'color' is selected.
        type: 'conditional_saturation',
        question: { vi: "Độ bão hòa màu sắc?", en: "And saturation?" },
        options: [
            { tags: ['high-saturation', 'vibrant', 'super-saturated'], text: { vi: 'Đậm', en: 'Rich' }, icon: '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.7-3.29C8.2 7.95 7 6.46 7 5.06V3" stroke="#e11d48"/><path d="M14 3v2.06c0 1.4-.93 2.89-2.3 3.9-1.13 1.03-1.7 2.13-1.7 3.29 0 2.22 1.8 4.05 4 4.05Z" stroke="#f43f5e"/>' },
            { tags: ['normal', 'moderate', 'natural'], text: { vi: 'Trung tính', en: 'Natural' }, icon: '<circle cx="12" cy="12" r="10" stroke="#71717a"/><circle cx="12" cy="12" r="4" fill="#a1a1aa"/>' },
            { tags: ['low-saturation', 'muted', 'faded'], text: { vi: 'Nhạt', en: 'Muted' }, icon: '<circle cx="12" cy="12" r="10" stroke="#a1a1aa"/><path d="M22 2 2 22" stroke="#d4d4d8"/>' },
        ]
    },
    {
        type: 'ai_analysis',
        question: { vi: "Hãy để AI phân tích bối cảnh của bạn", en: "Let AI analyze your scene" },
        description: { vi: "Chụp hoặc tải lên một bức ảnh về môi trường bạn đang chụp. Gemini sẽ phân tích ánh sáng, màu sắc và bối cảnh để gợi ý công thức phù hợp nhất dựa trên các lựa chọn trước đó của bạn.", en: "Take or upload a photo of your environment. Gemini will analyze the light, colors, and context to suggest the best recipe based on your previous choices." },
        options: [
            { id: 'uploadImageBtn', text: { vi: 'Tải ảnh lên', en: 'Upload Photo' }, icon: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#3b82f6"/><polyline points="17 8 12 3 7 8" stroke="#3b82f6"/><line x1="12" x2="12" y1="3" y2="15" stroke="#3b82f6"/>' },
            { id: 'captureImageBtn', text: { vi: 'Chụp ảnh', en: 'Take Photo' }, icon: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" stroke="#16a34a"/><circle cx="12" cy="13" r="3" stroke="#16a34a"/>' }
        ]
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
            // Skip saturation question if user chose B&W
            if (tags.includes('bw') && currentQuestion.options.some(o => o.tags.includes('bw'))) {
                 this.state.quiz.currentQuestionIndex += 2; // Skip next question
            } else {
                 this.state.quiz.currentQuestionIndex++;
            }
            this.renderQuestion();
        }, 300);
    }
    
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64Data = e.target.result.split(',')[1];
            this.triggerAIAnalysis(base64Data);
        };
        reader.readAsDataURL(file);
    }

    async triggerAIAnalysis(base64Data) {
        const quizContent = document.getElementById('quizContent');
        quizContent.innerHTML = `
            <div class="text-center view-transition flex flex-col items-center justify-center h-full">
                <div class="loader-dark"></div>
                <p class="mt-4 text-gray-600" data-translate-key="aiAnalyzing"></p>
            </div>`;
        this.applyTranslations();

        const userPreferences = this.state.quiz.answers.join(', ');
        const isBW = this.state.quiz.answers.includes('bw');
        const availableRecipes = this.recipesData.filter(r => isBW ? r.type === 'bw' : r.type === 'color');
        
        const prompt = `Based on the user's preferences: "${userPreferences}" and the attached image, analyze the scene's lighting, subject, and colors. From the following list of JSON objects, which single Sony Picture Profile recipe is the most suitable? Respond ONLY with the raw JSON object of the single best recipe, with no other text or markdown. Recipe list: ${JSON.stringify(availableRecipes)}`;

        try {
            const bestMatch = await this.callGeminiAPI(prompt, null, base64Data);
            this.showAIResult(bestMatch);
        } catch (error) {
            console.error("AI analysis failed:", error);
            this.showAIResult(null); // Show error state
        }
    }

    renderQuestion() {
        const quizContent = document.getElementById('quizContent');
        const progressBar = document.getElementById('quizProgressBar');
        let qIndex = this.state.quiz.currentQuestionIndex;
        
        const renderNewContent = () => {
            if (qIndex >= quizQuestions.length) {
                this.calculateAndShowResult(); // Fallback if AI step is somehow skipped
                return;
            }

            const questionData = quizQuestions[qIndex];

            // Handle special AI analysis step
            if (questionData.type === 'ai_analysis') {
                quizContent.innerHTML = `
                <div class="quiz-question-container text-center">
                    <h3 class="text-2xl md:text-3xl font-semibold mb-2">${questionData.question[this.getCurrentLanguage()]}</h3>
                    <p class="text-gray-600 max-w-xl mx-auto mb-8">${questionData.description[this.getCurrentLanguage()]}</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${questionData.options.map(opt => `
                            <button id="${opt.id}" class="quiz-option w-full text-left p-4 rounded-2xl flex items-center gap-4 border-2 border-transparent bg-gray-100 hover:bg-gray-200 transition-all duration-200">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide w-8 h-8 flex-shrink-0">
                                    ${opt.icon}
                                </svg>
                                <span class="font-semibold text-lg">${opt.text[this.getCurrentLanguage()]}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>`;
                progressBar.style.width = `${((qIndex + 1) / (quizQuestions.length)) * 100}%`;
                return;
            }

            const gridClass = `grid gap-4 ${questionData.options.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`;

            quizContent.innerHTML = `
                <div class="quiz-question-container">
                    <h3 class="text-2xl md:text-3xl font-semibold text-center mb-8">${questionData.question[this.getCurrentLanguage()]}</h3>
                    <div class="${gridClass}">
                        ${questionData.options.map(opt => `
                            <button class="quiz-option w-full text-left p-4 rounded-2xl flex items-center gap-4 border-2 border-transparent bg-gray-100 hover:bg-gray-200 transition-all duration-200" data-tags="${opt.tags.join(',')}">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide w-6 h-6 flex-shrink-0">
                                    ${opt.icon}
                                </svg>
                                <span class="font-semibold text-lg">${opt.text[this.getCurrentLanguage()]}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>`;
            
            progressBar.style.width = `${((qIndex) / (quizQuestions.length)) * 100}%`;
        };

        const currentContainer = quizContent.querySelector('.quiz-question-container');
        if (currentContainer) {
            currentContainer.classList.add('exiting');
            currentContainer.addEventListener('animationend', renderNewContent, { once: true });
        } else {
            renderNewContent();
        }
    }

    calculateAndShowResult() {
        // This function now acts as a fallback if AI fails or for B&W path
        const isBW = this.state.quiz.answers.includes('bw');
        const availableRecipes = this.recipesData.filter(r => isBW ? r.type === 'bw' : r.type === 'color');

        const scores = availableRecipes.map(recipe => {
            let score = recipe.tags.reduce((acc, tag) => acc + (this.state.quiz.answers.includes(tag) ? 1 : 0), 0);
            return { id: recipe.id, score: score };
        });

        scores.sort((a, b) => b.score - a.score);
        const bestMatch = this.recipesData.find(r => r.id === scores[0].id);
        
        this.showAIResult(bestMatch, true); // Show result, flagging it as a fallback
    }

    showAIResult(bestMatch, isFallback = false) {
        const quizContent = document.getElementById('quizContent');
        document.getElementById('quizProgressBar').style.width = '100%';

        if (!bestMatch) {
            quizContent.innerHTML = `
            <div class="text-center view-transition">
                <h3 class="text-2xl font-bold text-red-600" data-translate-key="aiErrorTitle"></h3>
                <p class="mt-2 text-gray-600" data-translate-key="aiErrorText"></p>
                <div class="mt-6">
                    <button id="retakeQuizBtn" class="btn bg-gray-200 text-gray-800 py-3 px-8 text-base">
                        <span data-translate-key="retakeQuizBtn"></span>
                    </button>
                </div>
            </div>`;
            this.applyTranslations();
            return;
        }

        quizContent.innerHTML = `
            <div class="text-center view-transition">
                <h3 class="text-2xl font-bold" data-translate-key="${isFallback ? 'quizResultTitle' : 'aiSuggestionTitle'}"></h3>
                <p class="mt-2 text-gray-600" data-translate-key="quizResultDescription"></p>
                <div class="my-8 p-6 bg-gray-100 rounded-2xl border flex flex-col sm:flex-row items-center gap-6">
                    <img src="${recipeImages[bestMatch.id][0]}" class="w-full sm:w-48 h-32 rounded-lg object-cover shadow-lg" alt="Preview">
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
