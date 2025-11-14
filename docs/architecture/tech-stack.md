# Tech Stack

This document outlines the technology stack used in the sony-colorlab project.

## Frontend

- **Build Tool:** [Vite](https://vitejs.dev/) is used as the frontend build tool, providing a fast development experience.
- **CSS Framework:** [Tailwind CSS](https://tailwindcss.com/) is used for styling the application. It's a utility-first CSS framework that allows for rapid UI development.
- **JavaScript Libraries:**
  - **[D3.js](https://d3js.org/):** A powerful JavaScript library for creating dynamic, interactive data visualizations in web browsers. The following D3 modules are used:
    - `d3-axis`
    - `d3-force`
    - `d3-scale`
    - `d3-selection`

## Backend

- **Backend-as-a-Service (BaaS):** [Supabase](https://supabase.io/) is used for the backend. It provides a suite of tools including a Postgres database, authentication, and storage.

## Tooling

- **`@cloudflare/vite-plugin`:** This plugin suggests integration with Cloudflare, possibly for deployment or other services.
- **`postcss` & `autoprefixer`:** These tools are used for processing CSS and adding vendor prefixes.
- **`vite-bundle-analyzer`:** This tool is used to analyze the size of the JavaScript bundle.
- **`dotenv`:** This is used to manage environment variables.
