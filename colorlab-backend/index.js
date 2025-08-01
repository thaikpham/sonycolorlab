// Import các thư viện cần thiết
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// --- CẤU HÌNH ---
// 1. ID của Google Analytics Property của anh
const GA_PROPERTY_ID = '496629581'; 

// 2. ID của App (để xây dựng đường dẫn Firestore)
//    Nếu anh không chắc, 'default-app-id' thường là giá trị đúng.
const APP_ID = 'default-app-id'; 

// 3. File key của Service Account
//    QUAN TRỌNG: Hãy chắc chắn rằng file 'service-account-key.json' 
//    nằm cùng cấp với file index.js này khi deploy.
const SERVICE_ACCOUNT_KEY_PATH = './service-account-key.json'; 
// --- KẾT THÚC CẤU HÌNH ---

// Khởi tạo Firebase Admin SDK
try {
    const serviceAccount = require(SERVICE_ACCOUNT_KEY_PATH);
    initializeApp({
      credential: cert(serviceAccount)
    });
} catch (e) {
    console.error("Lỗi nghiêm trọng: Không tìm thấy file service-account-key.json. Hãy chắc chắn bạn đã đặt file này vào thư mục của function.");
}

const db = getFirestore();
const analyticsDataClient = new BetaAnalyticsDataClient();

/**
 * Google Cloud Function được kích hoạt bằng HTTP.
 * Function này sẽ lấy dữ liệu từ Google Analytics và cập nhật vào Firestore.
 */
exports.updateTrendingRecipes = async (req, res) => {
    try {
        console.log('Bắt đầu cập nhật công thức thịnh hành...');

        // 1. Truy vấn Google Analytics Data API
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${GA_PROPERTY_ID}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'pagePath' }],
            metrics: [{ name: 'screenPageViews' }],
            // Lọc để chỉ lấy các trang có đường dẫn chứa '/recipes/'
            // Điều này giúp loại bỏ các trang không liên quan như trang chủ, v.v.
            dimensionFilter: {
                filter: {
                    fieldName: 'pagePath',
                    stringFilter: {
                        matchType: 'CONTAINS',
                        value: 'scl-', // Lọc theo ID công thức
                    },
                },
            },
            orderBys: [{
                metric: { metricName: 'screenPageViews' },
                desc: true, // Sắp xếp theo lượt xem giảm dần
            }],
            limit: 20, // Lấy top 20 trang để xử lý
        });

        // 2. Xử lý dữ liệu trả về để lấy ra các ID công thức
        const trendingIDs = [];
        if (response.rows) {
            response.rows.forEach(row => {
                const pagePath = row.dimensionValues[0].value;
                // Trích xuất ID từ sự kiện GTM, ví dụ: từ "scl-001"
                const match = pagePath.match(/(scl-\d+)/);
                if (match && match[1]) {
                    if (!trendingIDs.includes(match[1])) {
                        trendingIDs.push(match[1]);
                    }
                }
            });
        }
        
        // Chỉ lấy 4 công thức hàng đầu
        const top4 = trendingIDs.slice(0, 4);

        if (top4.length === 0) {
            console.log('Không tìm thấy dữ liệu thịnh hành mới.');
            res.status(200).send('Không có dữ liệu mới.');
            return;
        }

        // 3. Ghi dữ liệu vào Firestore
        const docRef = db.collection(`artifacts/${APP_ID}/public/data/trending`).doc('latest');
        await docRef.set({
            ids: top4,
            lastUpdated: new Date().toISOString(),
        });

        console.log('Cập nhật thành công:', top4);
        res.status(200).send(`Cập nhật thành công với ${top4.length} công thức.`);

    } catch (error) {
        console.error('LỖI khi cập nhật dữ liệu thịnh hành:', error);
        res.status(500).send('Đã xảy ra lỗi.');
    }
};
