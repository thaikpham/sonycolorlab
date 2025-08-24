#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Starting build script...');

// --- Environment Variables ---
const geminiApiKey = process.env.GEMINI_API_KEY;
const firebaseConfig = process.env.FIREBASE_CONFIG;
const appId = process.env.APP_ID || 'default-app-id';

// --- Paths ---
const distDir = path.join(__dirname, 'dist');
const srcDir = __dirname;

// Ensure dist directory exists and is clean
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });
console.log('📁 Created clean dist directory.');

try {
    // --- Process JS files that need environment variable replacement ---
    const filesToProcess = ['state.js']; // Only state.js needs variables now

    filesToProcess.forEach(fileName => {
        console.log(`🔄 Processing ${fileName}...`);
        const filePath = path.join(srcDir, fileName);
        const outputPath = path.join(distDir, fileName);
        let fileContent = fs.readFileSync(filePath, 'utf8');

        // 1. Replace GEMINI_API_KEY
        fileContent = fileContent.replace(
            /"%%GEMINI_API_KEY%%"/g,
            geminiApiKey ? `"${geminiApiKey}"` : `""`
        );
        console.log(geminiApiKey ? `  ✅ GEMINI_API_KEY replaced in ${fileName}.` : `  ⚠️ GEMINI_API_KEY not found in ${fileName}, replaced with empty string.`);

        // 2. Replace Firebase Config
        const firebaseReplacement = firebaseConfig ? `${firebaseConfig}` : `'undefined'`;
        fileContent = fileContent.replace(
            /"%%FIREBASE_CONFIG%%"/g,
            firebaseReplacement
        );
        console.log(firebaseConfig ? `  ✅ FIREBASE_CONFIG replaced in ${fileName}.` : `  ⚠️ FIREBASE_CONFIG not found in ${fileName}, replaced with undefined.`);

        // 3. Replace App ID
        fileContent = fileContent.replace(/"%%APP_ID%%"/g, `"${appId}"`);
        console.log(`  ✅ APP_ID replaced in ${fileName}.`);

        fs.writeFileSync(outputPath, fileContent);
        console.log(`📝 Wrote processed ${fileName} to dist.`);
    });


    // --- Copy all other necessary static assets ---
    console.log('📦 Copying static assets...');
    const staticFiles = [
        'index.html',
        'logo_black.png',
        'ColorlabQR.png',
        'Logo.png',
        // All JS modules
        'app.js',
        'api.js',
        'features.js',
        'ui.js',
        'language.js',
        'quiz.js',
        'recipes-core.js',
        'recipes-images.js',
        'translations.js'
    ];

    staticFiles.forEach(file => {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(distDir, file);
        if (fs.existsSync(srcPath)) {
            // If the file is one we've already processed, skip copying
            if (!filesToProcess.includes(file)) {
                fs.copyFileSync(srcPath, destPath);
                console.log(`  ↳ Copied ${file}`);
            }
        } else {
            console.warn(`  ⚠️ Could not find static file: ${file}`);
        }
    });

    console.log('🎉 Build script finished successfully!');

} catch (error) {
    console.error('🔥 An error occurred during the build script:', error);
    process.exit(1);
}
