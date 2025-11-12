import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Đảm bảo Vite build vào 'dist' như wrangler.toml mong đợi
    outDir: 'dist',
    assetsDir: 'assets',
  },
  optimizeDeps: {
    // Thêm cấu hình này để giải quyết lỗi "Rollup failed to resolve import"
    // Bằng cách buộc Vite phải tiền-bundle (pre-bundle) các gói Firebase.
    include: [
        'firebase/app', 
        'firebase/firestore', 
        'firebase/auth'
    ],
  }
});
