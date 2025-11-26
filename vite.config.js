import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  // Optional: Configure environment variables for development
  define: {
    // This ensures environment variables work in both dev and production
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
