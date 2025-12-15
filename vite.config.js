import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    minify: 'esbuild',
    target: 'esnext',
    cssMinify: true,
  },
  define: {
    // This ensures environment variables work in both dev and production
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
