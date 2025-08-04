#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Building for Cloudflare Pages...');

// ==================================================================
// --- PHẦN THÊM MỚI: Lấy Gemini API Key ---
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
    console.warn('⚠️  GEMINI_API_KEY environment variable not found. AI features will be disabled in the app.');
}
// ==================================================================


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

// Get other environment variables (logic của anh được giữ nguyên)
const firebaseConfig = process.env.FIREBASE_CONFIG;
const appId = process.env.APP_ID || 'default-app-id';


// --- THỰC HIỆN THAY THẾ CÁC PLACEHOLDER ---

// 1. Thay thế GEMINI_API_KEY
if (geminiApiKey) {
    // Sử dụng biểu thức chính quy để thay thế an toàn
    htmlContent = htmlContent.replace(/"%%GEMINI_API_KEY%%"/g, `"${geminiApiKey}"`);
    console.log('✅ GEMINI_API_KEY placeholder replaced.');
}
// Nếu không có key, placeholder sẽ được giữ lại, và logic trong app sẽ vô hiệu hóa nút AI.

// 2. Thay thế Firebase Config (logic của anh được giữ nguyên)
if (firebaseConfig) {
    const escapedConfig = JSON.stringify(firebaseConfig);
    htmlContent = htmlContent.replace(
        /const __firebase_config = "%%FIREBASE_CONFIG%%";/g,
        `const __firebase_config = ${escapedConfig};`
    );
    console.log('✅ FIREBASE_CONFIG placeholder replaced.');
} else {
    console.warn('⚠️  FIREBASE_CONFIG environment variable not found');
    htmlContent = htmlContent.replace(
        /const __firebase_config = "%%FIREBASE_CONFIG%%";/g,
        'const __firebase_config = undefined;'
    );
}

// 3. Thay thế App ID (logic của anh được giữ nguyên)
htmlContent = htmlContent.replace(
    /const __app_id = "%%APP_ID%%";/g,
    `const __app_id = "${appId}";`
);
console.log('✅ APP_ID placeholder replaced.');


// Write the processed HTML to dist/index.html
fs.writeFileSync(outputPath, htmlContent);

// Copy other static assets (logic của anh được giữ nguyên)
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
