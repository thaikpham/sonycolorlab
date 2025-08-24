/**
 * quiz.js
 * This module encapsulates all logic and data related to the "Find My Color" quiz.
 * * ==============================================
 * NÂNG CẤP ANIMATION V2 - CẬP NHẬT NGÀY 25/08/2025
 * ==============================================
 * - Refactor `renderQuestion` to use CSS classes for smooth transitions
 * instead of direct style manipulation, eliminating jank.
 */

// --- QUIZ DATA ---
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

export class Quiz {
    constructor(dependencies) {
        this.state = dependencies.state;
        this.getCurrentLanguage = dependencies.getCurrentLanguage;
        this.recipesData = dependencies.recipesData;
        this.recipeImages = dependencies.recipeImages;
        this.applyTranslations = dependencies.applyTranslations;
        this.renderView = dependencies.renderView;
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
            this.state.quiz.currentQuestionIndex++;
            this.renderQuestion();
        }, 300); // Increased delay slightly for a better feel
    }

    renderQuestion() {
        const quizContent = document.getElementById('quizContent');
        const progressBar = document.getElementById('quizProgressBar');
        const qIndex = this.state.quiz.currentQuestionIndex;

        const renderNewContent = () => {
            if (qIndex >= quizQuestions.length) {
                this.calculateAndShowResult();
                return;
            }

            const questionData = quizQuestions[qIndex];
            const hasThreeOptions = questionData.options.length === 3;
            const gridClass = `grid gap-4 ${hasThreeOptions ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`;

            quizContent.innerHTML = `
                <div class="quiz-question-container">
                    <h3 class="text-2xl md:text-3xl font-semibold text-center mb-8">${questionData.question[this.getCurrentLanguage()]}</h3>
                    <div class="${gridClass}">
                        ${questionData.options.map(opt => `
                            <button class="quiz-option w-full text-left p-4 rounded-2xl flex items-center gap-4 border-2 border-transparent bg-gray-100 hover:bg-gray-200 transition-all duration-200" data-tags="${opt.tags.join(',')}">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide w-6 h-6 flex-shrink-0 text-gray-500">
                                    ${opt.icon}
                                </svg>
                                <span class="font-semibold text-lg">${opt.text[this.getCurrentLanguage()]}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>`;
            
            progressBar.style.width = `${((qIndex) / quizQuestions.length) * 100}%`;
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
        const scores = this.recipesData.map(recipe => {
            let score = recipe.tags.reduce((acc, tag) => acc + (this.state.quiz.answers.includes(tag) ? 1 : 0), 0);
            if (this.state.quiz.answers.includes('bw') && recipe.type === 'bw') { 
                score += 2; 
            }
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
