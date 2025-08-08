#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');
const esbuild = require('esbuild');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

console.log('🔧 Starting enhanced build script...');

// --- Configuration ---
const distDir = path.join(__dirname, 'dist');
const srcDir = path.join(__dirname, 'src');

async function build() {
    try {
        // 1. Clean and ensure dist directory exists
        await fs.rm(distDir, { recursive: true, force: true });
        await fs.mkdir(distDir, { recursive: true });
        console.log('🧹 Cleaned and created dist directory.');

        // 2. Process CSS
        const cssInPath = path.join(srcDir, 'styles.css');
        const cssOutPath = path.join(distDir, 'style.css');
        const rawCss = await fs.readFile(cssInPath, 'utf8');

        const postcssProcessor = postcss([
            tailwindcss(path.join(__dirname, 'tailwind.config.js')),
            autoprefixer(),
            cssnano({ preset: 'default' })
        ]);

        const cssResult = await postcssProcessor.process(rawCss, { from: cssInPath, to: cssOutPath });
        await fs.writeFile(cssOutPath, cssResult.css);
        console.log('✅ CSS processed and minified.');

        // 3. Process JavaScript
        const jsOutPath = path.join(distDir, 'main.js');
        await esbuild.build({
            entryPoints: [path.join(srcDir, 'main.js')],
            bundle: true,
            minify: true,
            sourcemap: true,
            outfile: jsOutPath,
        });
        console.log('✅ JavaScript bundled and minified.');

        // 4. Process HTML
        let htmlContent = await fs.readFile(path.join(__dirname, 'index.html'), 'utf8');

        // Update asset paths
        htmlContent = htmlContent.replace('src/styles.css', 'style.css');
        htmlContent = htmlContent.replace('src/main.js', 'main.js');

        // --- Lấy các biến môi trường ---
        const geminiApiKey = process.env.GEMINI_API_KEY;
        const firebaseConfig = process.env.FIREBASE_CONFIG;
        const appId = process.env.APP_ID || 'default-app-id';

        // --- Thực hiện thay thế placeholder ---
        if (geminiApiKey) {
            htmlContent = htmlContent.replace('%%GEMINI_API_KEY%%', geminiApiKey);
            console.log('✅ GEMINI_API_KEY replacement successful.');
        } else {
            console.warn('⚠️  GEMINI_API_KEY is missing.');
        }

        if (firebaseConfig) {
            htmlContent = htmlContent.replace('"%%FIREBASE_CONFIG%%"', firebaseConfig);
            console.log('✅ FIREBASE_CONFIG replacement successful.');
        } else {
            console.warn('⚠️  FIREBASE_CONFIG is missing, replacing with undefined.');
            htmlContent = htmlContent.replace('"%%FIREBASE_CONFIG%%"', 'undefined');
        }

        htmlContent = htmlContent.replace('%%APP_ID%%', appId);
        console.log('✅ APP_ID replacement successful.');

        await fs.writeFile(path.join(distDir, 'index.html'), htmlContent);
        console.log('📝 Wrote final index.html to dist.');

        // 5. Copy static assets
        const staticFiles = ['logo.png', 'logo_black.png']; // recipes.js is now bundled
        for (const file of staticFiles) {
            const srcPath = path.join(__dirname, file);
            const destPath = path.join(distDir, file);
            if (require('fs').existsSync(srcPath)) {
                await fs.copyFile(srcPath, destPath);
                console.log(`↳ Copied ${file} to dist.`);
            }
        }

        console.log('🎉 Build script finished successfully!');

    } catch (error) {
        console.error('🔥 An error occurred during the build script:', error);
        process.exit(1);
    }
}

build();
