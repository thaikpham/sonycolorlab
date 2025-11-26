// File Path: src/components/ui/Comments.js
import { applyTranslations } from '../../services/language.js';

export function createCommentsHTML(comments) {
    if (comments.length === 0) {
        return `<p class="text-gray-500 itaic" data-translate-key="noCommentsYet"></p>`;
    }

    return comments.map(comment => `
        <div class="flex items-start gap-4 animate-fade-in">
            <img src="${comment.userAvatar || 'https://placehold.co/40x40/e2e8f0/a0aec0?text=A'}" alt="${comment.userName}" class="w-10 h-10 rounded-full">
            <div class="flex-grow bg-gray-100 rounded-lg p-3">
                <p class="font-semibold text-sm">${comment.userName}</p>
                <p class="text-gray-700 whitespace-pre-wrap mt-1">${comment.text}</p>
                <p class="text-xs text-gray-400 mt-2 text-right">${comment.timestamp ? new Date(comment.timestamp.seconds * 1000).toLocaleString() : ''}</p>
            </div>
        </div>
    `).join('');
}

export function renderComments(comments) {
    const container = document.getElementById('commentsListContainer');
    if (!container) return;

    container.innerHTML = createCommentsHTML(comments);
    applyTranslations();
}
