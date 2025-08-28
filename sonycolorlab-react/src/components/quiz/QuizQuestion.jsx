import React from 'react';

const QuizQuestion = ({ question, questionIndex, onAnswer, selectedAnswer }) => {
    const { question: qText, options, type, description } = question;

    if (type === 'ai_prompt') {
        return (
            <div className="quiz-island active" style={{ gridArea: `area-${questionIndex}`}}>
                <h3 className="text-xl font-bold text-center mb-2">{qText.en}</h3>
                <p className="text-gray-600 text-center text-sm mb-4">{description.en}</p>
                <textarea
                    id="aiQuizPrompt"
                    className="w-full p-3 rounded-xl bg-white/60 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all min-h-[100px]"
                    placeholder="e.g., 'A moody, cinematic feel for a rainy day in Tokyo...'"
                    onChange={(e) => onAnswer(e.target.value)}
                />
            </div>
        );
    }

    return (
        <div className="quiz-island active" style={{ gridArea: `area-${questionIndex}`}}>
            <h3 className="text-xl font-bold text-center mb-4">{qText.en}</h3>
            <div className="space-y-3">
                {options.map((opt, optIndex) => (
                    <button
                        key={optIndex}
                        className={`quiz-option w-full text-left p-4 flex items-center gap-4 ${selectedAnswer === opt.tags.join(',') ? 'selected' : ''}`}
                        onClick={() => onAnswer(opt.tags)}
                    >
                        <svg
                            dangerouslySetInnerHTML={{ __html: opt.icon }}
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide w-8 h-8 flex-shrink-0 text-gray-500 transition-colors"
                        />
                        <span className="font-semibold text-base md:text-lg">{opt.text.en}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuizQuestion;
