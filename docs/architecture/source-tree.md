# Source Tree

This document provides an overview of the project's directory structure.

```
/
├─── _redirects
├─── .env
├─── .gitignore
├─── build.js
├─── dev_server.log
├─── googled28df2855bc09526.html
├─── index.html
├─── package-lock.json
├─── package.json
├─── supabaseClient.js
├─── tailwind.config.js
├─── vite.config.js
├─── vite.log
├─── WORKFLOW_AND_TESTING_RECOMMENDATIONS.md
├─── wrangler.toml
├─── .bmad-core/               # BMad framework core files
├─── .gemini/                  # Gemini CLI configuration and commands
├─── .git/                     # Git version control files
├─── colorlab-backend/         # Backend service (likely Cloudflare Worker)
│    ├─── index.js
│    └─── package.json
├─── docs/                     # Project documentation
│    └─── architecture/
│         ├─── coding-standard.md
│         ├─── source-tree.md
│         └─── tech-stack.md
├─── functions/                # Serverless functions (e.g., for Netlify/Vercel)
│    └─── api/
│         └─── config.js
├─── node_modules/             # Project dependencies
├─── public/                   # Static assets
│    ├─── assets/              # Images
│    └─── locales/             # Localization files
├─── src/                      # Main application source code
│    ├─── app.js               # Main application logic
│    ├─── config.js            # Application configuration
│    ├─── router.js            # Client-side routing
│    ├─── components/          # UI components
│    ├─── services/            # Business logic and API communication
│    └─── styles/              # CSS styles
└─── web-bundles/              # Bundled web assets
```

## Key Directories

- **`src/`**: This is the heart of the application, containing all the frontend JavaScript code.
  - **`src/components/`**: Contains reusable UI components.
  - **`src/services/`**: Contains modules for handling business logic, such as API calls, authentication, and state management.
  - **`src/app.js`**: The main entry point for the application's logic.
  - **`src/router.js`**: Handles client-side navigation.
- **`colorlab-backend/`**: This directory contains a Node.js-based backend service. The presence of `wrangler.toml` strongly suggests it's a [Cloudflare Worker](https://workers.cloudflare.com/).
- **`public/`**: Contains static files that are served directly to the client, such as images, fonts, and localization files.
- **`docs/`**: Contains project documentation.
- **`.bmad-core/`**: Contains configuration and definitions for the BMad development agent framework.
