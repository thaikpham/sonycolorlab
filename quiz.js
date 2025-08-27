/**
 * quiz.js
 * This module encapsulates the core logic and data for the "Find My Color" quiz.
 * It manages the quiz flow, state, and answer processing, but delegates
 * rendering and complex features to other modules.
 * * ==============================================
 * REFACTOR & TÁI CẤU TRÚC - NGÀY 28/08/2025
 * ==============================================
 * - Chuyển sang mô hình "One Page Quiz".
 * - `start()`: Gọi hàm render layout một lần duy nhất.
 * - `handleAnswer()`: Chỉ xử lý logic chọn/bỏ chọn và cập nhật state, không render lại toàn bộ.
 * - Thêm `submitQuiz()` để xử lý logic khi người dùng bấm nút hoàn thành.
 * - Loại bỏ logic render khỏi file này, chỉ còn gọi các hàm từ `ui.js`.
 */

// --- QUIZ DATA ---
export const quizQuestions = [
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
        this.recipesData = dependencies.recipesData;
        this.ui = dependencies.ui;
        this.applyTranslations = dependencies.applyTranslations;
        this.handleQuizAIGeneration = dependencies.handleQuizAIGeneration;
    }

    start() {
        this.state.quiz.answers = {}; // Use an object to store answers by index
        this.ui.renderOnePageQuizLayout(quizQuestions);
        this.applyTranslations();
    }

    close() {
        // Visibility is handled by the caller in app.js.
    }

    handleAnswer(e) {
        const selectedOption = e.target.closest('.quiz-option');
        if (!selectedOption) return;

        const questionIndex = selectedOption.dataset.questionIndex;
        const tags = selectedOption.dataset.tags.split(',');
        
        // Store answer
        this.state.quiz.answers[questionIndex] = tags;

        // Update UI for the specific question island
        const island = selectedOption.closest('.quiz-island');
        island.querySelectorAll('.quiz-option').forEach(btn => btn.classList.remove('selected'));
        selectedOption.classList.add('selected');

        // Special handling for B&W choice
        const bwIsland = document.querySelector('.quiz-island[data-question-index="4"]');
        if(questionIndex === '3') { // If "Color vs B&W" is answered
            if(tags.includes('bw')) {
                bwIsland?.classList.add('hidden');
                delete this.state.quiz.answers['4']; // Remove saturation answer if it exists
            } else {
                bwIsland?.classList.remove('hidden');
            }
        }
        
        this.checkCompletion();
    }
    
    checkCompletion() {
        const requiredQuestions = quizQuestions.filter(q => q.type !== 'ai_prompt' && q.type !== 'conditional_saturation');
        const answeredCount = Object.keys(this.state.quiz.answers).filter(key => {
            const q = quizQuestions[key];
            return q && q.type !== 'ai_prompt' && q.type !== 'conditional_saturation';
        }).length;

        const isBwSelected = this.state.quiz.answers['3']?.includes('bw');
        let allAnswered = answeredCount >= requiredQuestions.length;

        // If color is selected, saturation is also required
        if (!isBwSelected && !this.state.quiz.answers['4']) {
            allAnswered = false;
        }

        const submitBtn = document.getElementById('submitQuizBtn');
        if (submitBtn) {
            submitBtn.disabled = !allAnswered;
        }
    }

    submitQuiz() {
        const aiPrompt = document.getElementById('aiQuizPrompt')?.value.trim();
        if (aiPrompt) {
            this.handleQuizAIGeneration(aiPrompt, this.state.quiz.answers);
        } else {
            this.calculateAndShowResult();
        }
    }

    calculateAndShowResult() {
        const allAnswers = Object.values(this.state.quiz.answers).flat();
        const isBW = allAnswers.includes('bw');
        const availableRecipes = this.recipesData.filter(r => isBW ? r.type === 'bw' : r.type === 'color');

        const scores = availableRecipes.map(recipe => {
            let score = recipe.tags.reduce((acc, tag) => acc + (allAnswers.includes(tag) ? 1 : 0), 0);
            return { id: recipe.id, score: score };
        });

        scores.sort((a, b) => b.score - a.score);
        const bestMatch = this.recipesData.find(r => r.id === scores[0].id);

        this.ui.renderQuizResult(bestMatch);
        this.applyTranslations();
    }
}
