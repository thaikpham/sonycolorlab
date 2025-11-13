import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'd3': ['d3-axis', 'd3-force', 'd3-scale', 'd3-selection'],
        }
      }
    }
  },
  // Optional: Configure environment variables for development
  define: {
    // This ensures environment variables work in both dev and production
  }
});