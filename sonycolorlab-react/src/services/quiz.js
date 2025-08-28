/**
 * quiz.js (React Version)
 * This module exports the quiz data and pure functions for quiz logic.
 * The state management and UI updates are handled by React components and context.
 */

// --- QUIZ DATA ---
export const quizQuestions = [
    {
        question: { vi: "Bạn sẽ chụp gì hôm nay?", en: "What will you be shooting today?" },
        options: [
            { tags: ['portrait', 'fine-art-portrait', 'nostalgic-portrait'], text: { vi: 'Chân dung', en: 'Portraits' }, icon: '<circle cx="12" cy="7" r="4" stroke="#f43f5e"/><path d="M5.5 21v-2a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v2" stroke="#f43f5e"/>' },
            { tags: ['landscape', 'travel', 'summer', 'golden-hour'], text: { vi: 'Phong cảnh', en: 'Landscape' }, icon: '<path d="m8 3 4 8 5-5 5 15H2L8 3z" stroke="#22c55e"/>' },
            { tags: ['urban-night', 'street-photography', 'city-lights'], text: { vi: 'Đô thị', en: 'Urban' }, icon: '<rect width="16" height="20" x="4" y="2" rx="2" stroke="#6366f1"/><path d="M9 22v-4h6v4" stroke="#6366f1"/><path d="M8 6h.01" stroke="#a78bfa"/><path d="M16 6h.01" stroke="#a78bfa"/><path d="M12 6h.01" stroke="#a78bfa"/><path d="M12 10h.01" stroke="#a78bfa"/><path d="M12 14h.01" stroke="#a78bfa"/><path d="M16 10h.01" stroke="#a78bfa"/><path d="M8 10h.01" stroke="#a78bfa"/><path d="M8 14h.01" stroke="#a78bfa"/><path d="M16 14h.01" stroke="#a78bfa"/>' },
            { tags: ['lifestyle', 'everyday', 'family-photos'], text: { vi: 'Đời thường', en: 'Lifestyle' }, icon: '<rect width="20" height="20" x="2" y="2" rx="2" ry="2" stroke="#f97316"/><path d="M7 2v20" stroke="#f97316"/><path d="M17 2v20" stroke="#f97316"/><path d="M2 12h20" stroke="#f97316"/><path d="M2 7h5" stroke="#f97316"/><path d="M2 17h5" stroke="#f97316"/><path d="M17 17h5" stroke="#f97316"/><path d="M17 7h5" stroke="#f97316"/>' }
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
            { tags: ['color'], text: { vi: 'Ảnh màu', en: 'Color' }, icon: '<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#3b82f6"/><path d="m2 12 5 5" stroke="#ef4444"/><path d="m7 17 5-10" stroke="#f97316"/><path d="m12 7 5 10" stroke="#84cc16"/><path d="m17 17 5-5" stroke="#3b82f6"/>' },
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

/**
 * Calculates the best matching recipe based on user answers.
 * @param {Array} recipesData - The full list of recipe objects.
 * @param {Object} answers - An object where keys are question indices and values are arrays of tags.
 * @returns {Object} The recipe object that is the best match.
 */
export function calculateQuizResult(recipesData, answers) {
    const allAnswerTags = Object.values(answers).flat();
    const isBW = allAnswerTags.includes('bw');

    const availableRecipes = recipesData.filter(r => isBW ? r.type === 'bw' : r.type === 'color');

    const scores = availableRecipes.map(recipe => {
        let score = recipe.tags.reduce((acc, tag) => acc + (allAnswerTags.includes(tag) ? 1 : 0), 0);
        return { id: recipe.id, score: score };
    });

    scores.sort((a, b) => b.score - a.score);

    if (scores.length === 0) {
        // Return a default or random recipe if no matches are found
        return recipesData.find(r => r.id === 'scl-016');
    }

    return recipesData.find(r => r.id === scores[0].id);
}

/**
 * Generates a prompt and calls the Gemini API to create an AI-based recipe.
 * @param {string} userInput - The user's text prompt.
 * @param {Object} answers - The user's answers from the quiz.
 * @param {string} currentLanguage - The current language ('vi' or 'en').
 * @param {function} callGeminiAPI - The imported API call function.
 * @returns {Promise<Object>} A promise that resolves to the generated recipe object.
 */
export async function generateAIQuizResult(userInput, answers, currentLanguage, callGeminiAPI) {
    const preferences = Object.values(answers).flat().join(', ');
    const expertPrompt = `As a professional colorist specializing in Sony Picture Profiles, analyze the user's preferences from a quiz: "${preferences}". Now, consider the user's creative prompt: "${userInput}". Your task is to generate a completely new, creative, and fully detailed JSON object representing a unique color recipe that matches this inspiration. The new JSON must be a complete, valid recipe object following this exact structure: { "id": "SCL-AI-001", "name": { "vi": "...", "en": "..." }, "description": { "vi": "...", "en": "..." }, "type": "color", "tags": [], "whiteBalance": "...", "settings": { "Black level": 0, "Gamma": "...", "Black Gamma": "...", "Knee": "...", "Color Mode": "...", "Saturation": 0, "Color Phase": 0 }, "colorDepth": { "R": 0, "G": 0, "B": 0, "C": 0, "M": 0, "Y": 0 }, "detailSettings": { "Level": 0 }, "personalityColor": "#...", "coords": { "x": 0, "y": 0 } }. You must only respond with the raw JSON object, without any surrounding text, explanations, or markdown formatting. The generated name and description must be in the same language as the user's prompt (${currentLanguage}). The 'coords' should be your estimation of where this recipe would fit on a color map from -10 to 10.`;

    // Note: The callGeminiAPI function is passed in as a dependency to keep this function pure.
    // The component calling this will get it from the api.js service.
    return await callGeminiAPI(expertPrompt, null);
}
