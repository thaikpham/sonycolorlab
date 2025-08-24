#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Starting corrected build script...');

// --- Lấy các biến môi trường ---
const geminiApiKey = process.env.GEMINI_API_KEY;
const firebaseConfig = process.env.FIREBASE_CONFIG;
const appId = process.env.APP_ID || 'default-app-id';

// --- Thiết lập đường dẫn ---
const distDir = path.join(__dirname, 'dist');
const srcDir = __dirname; // Thư mục nguồn là thư mục gốc

// Đảm bảo thư mục dist tồn tại và được dọn dẹp trước khi build
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });
console.log('📁 Created clean dist directory.');

try {
    // --- Xử lý tệp app.js ---
    console.log('🔄 Processing app.js...');
    const appJsPath = path.join(srcDir, 'app.js');
    const outputAppJsPath = path.join(distDir, 'app.js');
    let appJsContent = fs.readFileSync(appJsPath, 'utf8');

    // 1. Thay thế GEMINI_API_KEY
    // Thay thế giá trị %%GEMINI_API_KEY%% bằng API key thật hoặc chuỗi rỗng
    appJsContent = appJsContent.replace(
        /"%%GEMINI_API_KEY%%"/g,
        geminiApiKey ? `"${geminiApiKey}"` : `""`
    );
    console.log(geminiApiKey ? '✅ GEMINI_API_KEY replaced.' : '⚠️ GEMINI_API_KEY not found, replaced with empty string.');

    // 2. Thay thế Firebase Config
    // Thay thế giá trị %%FIREBASE_CONFIG%% bằng chuỗi JSON config hoặc 'undefined'
    // Lưu ý: JSON.stringify(firebaseConfig) sẽ tạo ra một chuỗi JSON hợp lệ bên trong chuỗi của file JS.
    const firebaseReplacement = firebaseConfig ? JSON.stringify(firebaseConfig) : `'undefined'`;
    appJsContent = appJsContent.replace(
        /"%%FIREBASE_CONFIG%%"/g,
        firebaseReplacement
    );
    console.log(firebaseConfig ? '✅ FIREBASE_CONFIG replaced.' : '⚠️ FIREBASE_CONFIG not found, replaced with undefined.');


    // 3. Thay thế App ID
    appJsContent = appJsContent.replace(/"%%APP_ID%%"/g, `"${appId}"`);
    console.log('✅ APP_ID replaced.');

    // Ghi lại file app.js đã xử lý vào thư mục dist
    fs.writeFileSync(outputAppJsPath, appJsContent);
    console.log(`📝 Wrote processed app.js to dist.`);

    // --- Sao chép các file tĩnh khác ---
    console.log('📦 Copying static assets...');
    // Danh sách các file cần thiết cho trang web hoạt động
    const staticFiles = [
        'index.html',
        'logo_black.png',
        'adobe-express-qr-code.svg',
        // QUAN TRỌNG: Sao chép tất cả các module JS mà app.js cần
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
            fs.copyFileSync(srcPath, destPath);
            console.log(`  ↳ Copied ${file}`);
        } else {
            // Cảnh báo nếu không tìm thấy file, trừ file logo.png không bắt buộc
            if (file !== 'logo.png') {
                 console.warn(`  ⚠️ Could not find static file: ${file}`);
            }
        }
    });

    console.log('🎉 Build script finished successfully!');

} catch (error) {
    console.error('🔥 An error occurred during the build script:', error);
    process.exit(1); // Dừng build nếu có lỗi
}
