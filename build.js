#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Starting corrected build script for vanilla JS project...');

// --- Environment Variables ---
const geminiApiKey = process.env.GEMINI_API_KEY;
const firebaseConfig = process.env.FIREBASE_CONFIG;
const appId = process.env.APP_ID || 'default-app-id';

// --- Paths ---
const projectRoot = __dirname;
const distDir = path.join(projectRoot, 'dist');
const srcDir = path.join(projectRoot, 'src');
const publicDir = path.join(projectRoot, 'public');
const indexHtmlPath = path.join(projectRoot, 'index.html');

// Define the correct path to state.js *after* it has been copied to dist
const stateJsInDistPath = path.join(distDir, 'src', 'services', 'state.js');

// Helper function to recursively copy a directory
function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else if (exists) {
        fs.copyFileSync(src, dest);
    }
}

try {
    // 1. Ensure dist directory is clean before starting
    console.log('📁 Cleaning and creating dist directory...');
    if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true, force: true });
    }
    fs.mkdirSync(distDir, { recursive: true });

    // 2. Copy all necessary project assets to the dist folder FIRST
    console.log('📦 Copying all project files to dist...');
    if (fs.existsSync(indexHtmlPath)) {
        fs.copyFileSync(indexHtmlPath, path.join(distDir, 'index.html'));
        console.log('  ↳ Copied index.html');
    }
    if (fs.existsSync(srcDir)) {
        copyRecursiveSync(srcDir, path.join(distDir, 'src'));
        console.log('  ↳ Copied src directory');
    }
    if (fs.existsSync(publicDir)) {
        copyRecursiveSync(publicDir, path.join(distDir, 'public'));
        console.log('  ↳ Copied public directory');
    }

    // 3. NOW, process the state.js file that is INSIDE the dist directory
    console.log(`🔄 Processing environment variables in ${stateJsInDistPath}...`);
    if (fs.existsSync(stateJsInDistPath)) {
        let fileContent = fs.readFileSync(stateJsInDistPath, 'utf8');

        // Replace GEMINI_API_KEY placeholder
        fileContent = fileContent.replace(
            /"%%GEMINI_API_KEY%%"/g,
            geminiApiKey ? `"${geminiApiKey}"` : `""`
        );
        console.log(geminiApiKey ? '  ✅ GEMINI_API_KEY injected.' : '  ⚠️ GEMINI_API_KEY not set, replaced with empty string.');

        // Replace Firebase Config placeholder
        const firebaseReplacement = firebaseConfig ? `${firebaseConfig}` : `'undefined'`;
        fileContent = fileContent.replace(
            /"%%FIREBASE_CONFIG%%"/g,
            firebaseReplacement
        );
        console.log(firebaseConfig ? '  ✅ FIREBASE_CONFIG injected.' : '  ⚠️ FIREBASE_CONFIG not set, replaced with undefined.');

        // Replace App ID placeholder
        fileContent = fileContent.replace(/"%%APP_ID%%"/g, `"${appId}"`);
        console.log(`  ✅ APP_ID injected.`);

        // Write the modified content back to the file inside 'dist'
        fs.writeFileSync(stateJsInDistPath, fileContent);
        console.log(`📝 Wrote processed state.js back to dist.`);
    } else {
        console.error(`🔥 FATAL ERROR: Could not find state.js at the expected location: ${stateJsInDistPath}. Build failed.`);
        process.exit(1);
    }

    console.log('🎉 Build script finished successfully!');

} catch (error) {
    console.error('🔥 An unexpected error occurred during the build script:', error);
    process.exit(1);
}
