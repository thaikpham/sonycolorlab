import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  envDir: './',
  // Optional: Configure environment variables for development
  define: {
    // This ensures environment variables work in both dev and production
  },
});
