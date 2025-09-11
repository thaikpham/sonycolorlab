import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false // prevent Vite from deleting files your build.js puts in dist/
  }
});
