#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Building for Cloudflare Pages...');

// Read the original HTML file
const htmlPath = path.join(__dirname, 'index.html');
const outputPath = path.join(__dirname, 'dist', 'index.html');

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Read HTML content
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Get environment variables
const firebaseConfig = process.env.FIREBASE_CONFIG;
const appId = process.env.APP_ID || 'default-app-id';

// Replace placeholders with actual values
if (firebaseConfig) {
    // Escape quotes and format as JavaScript string
    const escapedConfig = JSON.stringify(firebaseConfig);
    htmlContent = htmlContent.replace(
        /const __firebase_config = "%%FIREBASE_CONFIG%%";/g,
        `const __firebase_config = ${escapedConfig};`
    );
} else {
    console.warn('⚠️  FIREBASE_CONFIG environment variable not found');
    htmlContent = htmlContent.replace(
        /const __firebase_config = "%%FIREBASE_CONFIG%%";/g,
        'const __firebase_config = undefined;'
    );
}

htmlContent = htmlContent.replace(
    /const __app_id = "%%APP_ID%%";/g,
    `const __app_id = "${appId}";`
);

// Write the processed HTML
fs.writeFileSync(outputPath, htmlContent);

// Copy other static assets
const staticFiles = ['logo.png', 'logo_black.png', 'recipes.js'];
staticFiles.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(distDir, file);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`📄 Copied ${file}`);
    }
});

console.log('✅ Build complete! Output in dist/ directory');