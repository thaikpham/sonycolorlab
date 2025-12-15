import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    minify: 'esbuild',
    target: 'esnext',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['html2canvas'], // Ensure html2canvas is split if it's large, though it's loaded from CDN in some places, checking imports...
        }
      }
    }
  },
  define: {
    // This ensures environment variables work in both dev and production
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
