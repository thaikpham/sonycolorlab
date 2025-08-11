#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Starting enhanced build script (with debugging)...');

// --- DEBUG: In ra tất cả các biến môi trường có sẵn ---
// console.log('All available environment variables:', process.env);

// --- Lấy các biến môi trường ---
const geminiApiKey = process.env.GEMINI_API_KEY;
const firebaseConfig = process.env.FIREBASE_CONFIG;
const appId = process.env.APP_ID || 'default-app-id';

// --- DEBUG: Kiểm tra giá trị của GEMINI_API_KEY ---
if (geminiApiKey) {
    console.log(`✅ Found GEMINI_API_KEY. Length: ${geminiApiKey.length}. Starts with: "${geminiApiKey.substring(0, 4)}..."`);
} else {
    console.error('❌ CRITICAL: GEMINI_API_KEY environment variable NOT FOUND. AI features will be disabled.');
}

// --- Thiết lập đường dẫn ---
const htmlPath = path.join(__dirname, 'index.html');
const distDir = path.join(__dirname, 'dist');
const outputPath = path.join(distDir, 'index.html');

// Đảm bảo thư mục dist tồn tại
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

try {
    // Đọc nội dung file HTML
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    console.log('📄 Successfully read index.html.');

    // --- Thực hiện thay thế placeholder ---

    // 1. Thay thế GEMINI_API_KEY (Sử dụng phương pháp an toàn hơn)
    const geminiPlaceholder = 'const API_KEY = "%%GEMINI_API_KEY%%";';
    if (htmlContent.includes('%%GEMINI_API_KEY%%')) {
        console.log('Found GEMINI placeholder. Attempting to replace...');
        if (geminiApiKey) {
            htmlContent = htmlContent.replace(geminiPlaceholder, `const API_KEY = "${geminiApiKey}";`);
            console.log('✅ GEMINI_API_KEY replacement successful.');
        } else {
             console.warn('⚠️  GEMINI_API_KEY is missing, placeholder was NOT replaced.');
        }
    } else {
        console.warn('⚠️  Warning: Placeholder for GEMINI_API_KEY was not found in index.html.');
    }

    // 2. Thay thế Firebase Config
    const firebasePlaceholder = 'const __firebase_config = "%%FIREBASE_CONFIG%%";';
     if (htmlContent.includes('%%FIREBASE_CONFIG%%')) {
        console.log('Found FIREBASE placeholder. Attempting to replace...');
        if (firebaseConfig) {
            htmlContent = htmlContent.replace(firebasePlaceholder, `const __firebase_config = ${JSON.stringify(firebaseConfig)};`);
            console.log('✅ FIREBASE_CONFIG replacement successful.');
        } else {
            console.warn('⚠️  FIREBASE_CONFIG is missing, replacing with undefined.');
            htmlContent = htmlContent.replace(firebasePlaceholder, 'const __firebase_config = undefined;');
        }
    } else {
        console.warn('⚠️  Warning: Placeholder for FIREBASE_CONFIG was not found.');
    }

    // 3. Thay thế App ID
    htmlContent = htmlContent.replace(/const __app_id = "%%APP_ID%%";/g, `const __app_id = "${appId}";`);
    console.log('✅ APP_ID replacement successful.');


    // Ghi lại file đã xử lý
    fs.writeFileSync(outputPath, htmlContent);
    console.log(`📝 Wrote updated content to ${outputPath}`);

    // Sao chép các file tĩnh
    const staticFiles = ['logo.png', 'logo_black.png', 'recipes.js'];
    staticFiles.forEach(file => {
        const srcPath = path.join(__dirname, file);
        const destPath = path.join(distDir, file);
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`↳ Copied ${file} to dist.`);
        }
    });

    console.log('🎉 Build script finished successfully!');

} catch (error) {
    console.error('🔥 An error occurred during the build script:', error);
    process.exit(1); // Dừng build nếu có lỗi
}
