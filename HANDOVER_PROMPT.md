Codebase Handover & Sanitization Instructions

Objective:
Prepare the "Sony Color Lab" codebase for a team handover by removing all personal branding, private API dependencies, and personal links. The goal is to have a "clean," standalone version of the app that runs entirely on local mock data.

Instructions for the Developer/AI:

Sanitize Personal Metadata:

package.json: Change the author field to "Development Team". Remove or genericize the homepage and repository URLs.

index.html: Update the <title> and <meta> descriptions to be generic (e.g., "Film Simulation App"). Remove any personal analytics scripts (e.g., Google Analytics ID) if present.

public/manifest.json: Ensure the app name and short name are generic if they contain personal branding.

Remove Personal Links:

Scan all JSON translation files (public/locales/*.json) and UI components.

Replace links to personal Facebook, Instagram, YouTube, or PayPal/BuyMeACoffee with generic placeholders (e.g., # or https://example.com).

Replace texts like "Created by ThaiKPham" with "Created by Dev Team".

Implement Mock API Layer:

Modify src/services/api.js (and any other service files making network requests).

Disable all actual fetch or axios calls to the backend (Cloudflare Workers, Supabase, etc.).

Implement Mock Responses: Instead of calling an endpoint, return a Promise.resolve() containing static, realistic sample data.

Example: If the app fetches a recipe, return a hardcoded JSON object representing a full Fujifilm recipe structure.

Add comments indicating where the real API endpoints should be re-connected later.

Configuration Cleanup:

Clear out any hardcoded API keys or secrets in functions/api/config.js or .env files (replace values with "YOUR_API_KEY_HERE").

Validation:

Ensure the application starts (npm run dev) and renders the main UI using the mock data without errors.
