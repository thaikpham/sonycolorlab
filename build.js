#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const esbuild = require('esbuild');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

console.log('🔧 Starting full build script...');

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

        // Update asset paths to be relative to the dist root
        htmlContent = htmlContent.replace('src/styles.css', 'style.css');
        htmlContent = htmlContent.replace('src/main.js', 'main.js');

        await fs.writeFile(path.join(distDir, 'index.html'), htmlContent);
        console.log('📝 Wrote final index.html to dist.');

        // 5. Copy static assets
        const staticFiles = ['logo.png', 'logo_black.png'];
        for (const file of staticFiles) {
            await fs.copy(path.join(__dirname, file), path.join(distDir, file));
            console.log(`↳ Copied ${file} to dist.`);
        }

        console.log('🎉 Full build finished successfully!');

    } catch (error) {
        console.error('🔥 An error occurred during the build script:', error);
        process.exit(1);
    }
}

build();
