Film Simulation Lab

Film Simulation Lab is an AI-powered web application designed to generate, manage, and explore custom film simulation recipes for cameras. It leverages generative AI to translate aesthetic descriptions into precise camera settings.

🏆 Project History & Credits

This project was originally architected and developed by Thai Pham (thai.pham@sony.com | GitHub: thaikpham).

It serves as a proof-of-concept for integrating AI with photographic workflows. The project has been handed over to the core development team for maintenance, scaling, and feature expansion.

🚀 Getting Started

Prerequisites

Node.js (v18 or higher)

npm or yarn

Installation

Clone the repository:

git clone <repository-url>
cd film-simulation-lab


Install dependencies:

npm install


Start the development server:

npm run dev


The application will launch at http://localhost:5173 (or the port specified by Vite).

🛠️ Tech Stack

Frontend: HTML5, Modern JavaScript (ES Modules), Tailwind CSS

Build Tool: Vite

Localization: i18next (Support for English & Vietnamese)

Backend/Services (Mocked for Dev):

Cloudflare Workers (API Hosting)

Supabase (Database)

OpenAI/Gemini (AI Generation Logic)

⚠️ Handover Notes: Mock API Mode

To facilitate a smooth handover and ensure the application runs immediately without complex environment setup, the API layer is currently running in MOCK MODE.

File location: src/services/api.js

Behavior: All network requests (AI generation, saving recipes) are intercepted and return static mock data (Promise.resolve(...)).

Action Required: When ready to deploy or connect to the real backend, the development team should:

Open src/services/api.js.

Uncomment the actual fetch() calls.

Remove the mock data blocks.

Ensure environment variables (API keys) are set in .env or the deployment platform.

📂 Project Structure

├── public/
│   ├── locales/       # JSON translation files (en, vi)
│   └── assets/        # Static images and icons
├── src/
│   ├── components/    # UI Components (AI Lab, Recipe List, etc.)
│   ├── services/      # Business logic (API, State Management, UI Helpers)
│   └── styles/        # Tailwind directives and custom CSS
├── functions/         # Cloudflare Workers serverless functions
└── index.html         # Application entry point

Domain: https://sonycolorlab.app is still manage by Thai K. Pham

thai.pham@sony.com 
