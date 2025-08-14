#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Starting corrected build script...');

// --- Lấy các biến môi trường ---
const geminiApiKey = process.env.GEMINI_API_KEY;
const firebaseConfig = process.env.FIREBASE_CONFIG;
const appId = process.env.APP_ID || 'default-app-id';

// --- DEBUG: Kiểm tra giá trị của GEMINI_API_KEY ---
if (geminiApiKey) {
    console.log(`✅ Found GEMINI_API_KEY. Length: ${geminiApiKey.length}.`);
} else {
    console.error('❌ CRITICAL: GEMINI_API_KEY environment variable NOT FOUND. AI features will be disabled.');
}

// --- Thiết lập đường dẫn ---
const distDir = path.join(__dirname, 'dist');
const appJsPath = path.join(__dirname, 'app.js');
const outputAppJsPath = path.join(distDir, 'app.js');

// Đảm bảo thư mục dist tồn tại
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('📁 Created dist directory.');
}

try {
    // --- Xử lý tệp app.js ---
    console.log('🔄 Processing app.js...');
    let appJsContent = fs.readFileSync(appJsPath, 'utf8');

    // 1. Thay thế GEMINI_API_KEY
    if (geminiApiKey) {
        appJsContent = appJsContent.replace(/"%%GEMINI_API_KEY%%"/g, `"${geminiApiKey}"`);
        console.log('✅ GEMINI_API_KEY replaced.');
    } else {
        appJsContent = appJsContent.replace(/"%%GEMINI_API_KEY%%"/g, `""`);
        console.warn('⚠️ GEMINI_API_KEY is missing, replaced with empty string.');
    }

    // 2. Thay thế Firebase Config
    if (firebaseConfig) {
        // Sửa lỗi: Đảm bảo config được stringify đúng cách để không bị lỗi JSON.parse
        const configString = typeof firebaseConfig === 'string' ? firebaseConfig : JSON.stringify(firebaseConfig);
        appJsContent = appJsContent.replace(/"%%FIREBASE_CONFIG%%"/g, `${JSON.stringify(configString)}`);
        console.log('✅ FIREBASE_CONFIG replaced.');
    } else {
        appJsContent = appJsContent.replace(/"%%FIREBASE_CONFIG%%"/g, `'undefined'`);
        console.warn('⚠️ FIREBASE_CONFIG is missing, replaced with undefined.');
    }

    // 3. Thay thế App ID
    appJsContent = appJsContent.replace(/"%%APP_ID%%"/g, `"${appId}"`);
    console.log('✅ APP_ID replaced.');

    // Ghi lại file app.js đã xử lý
    fs.writeFileSync(outputAppJsPath, appJsContent);
    console.log(`📝 Wrote updated content to ${outputAppJsPath}`);

    // --- Sao chép các file tĩnh khác ---
    console.log('📦 Copying static assets...');
    // FIX: Thêm 'adobe-express-qr-code.svg' vào danh sách các file cần sao chép
    const staticFiles = ['index.html', 'logo.png', 'logo_black.png', 'recipes.js', 'adobe-express-qr-code.svg'];
    staticFiles.forEach(file => {
        const srcPath = path.join(__dirname, file);
        const destPath = path.join(distDir, file);
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`  ↳ Copied ${file} to dist.`);
        } else {
            console.warn(`  ⚠️ Could not find static file: ${file}`);
        }
    });

    console.log('🎉 Build script finished successfully!');

} catch (error) {
    console.error('🔥 An error occurred during the build script:', error);
    process.exit(1); // Dừng build nếu có lỗi
}
