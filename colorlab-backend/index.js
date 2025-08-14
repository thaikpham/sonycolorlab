// Import các thư viện cần thiết
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// --- CẤU HÌNH ---
// 1. ID của Google Analytics Property của anh
const GA_PROPERTY_ID = '496629581'; 

// 2. ID của App (để xây dựng đường dẫn Firestore)
const APP_ID = 'default-app-id'; 

// 3. File key của Service Account
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
    process.exit(1); // Dừng nếu không có key
}

const db = getFirestore();
const analyticsDataClient = new BetaAnalyticsDataClient();

/**
 * Google Cloud Function được kích hoạt bằng HTTP.
 * Function này sẽ lấy dữ liệu từ Google Analytics và cập nhật vào Firestore.
 * * NÂNG CẤP:
 * - Lấy top 5 công thức thay vì 4.
 * - Truy vấn dựa trên số lượt sự kiện 'view_recipe' thay vì page views để có độ chính xác cao hơn.
 * - Yêu cầu phải có Custom Dimension 'recipe_id' được cấu hình trong GA4.
 */
exports.updateTrendingRecipes = async (req, res) => {
    try {
        console.log('Bắt đầu cập nhật công thức thịnh hành...');

        // 1. Truy vấn Google Analytics Data API
        // Thay đổi: Truy vấn theo số lượng sự kiện 'view_recipe' và dimension là 'recipe_id'
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${GA_PROPERTY_ID}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'customEvent:recipe_id' }], // Sử dụng custom dimension
            metrics: [{ name: 'eventCount' }],
            dimensionFilter: {
                filter: {
                    fieldName: 'eventName',
                    stringFilter: {
                        matchType: 'EXACT',
                        value: 'view_recipe', // Lọc chính xác theo tên sự kiện
                    },
                },
            },
            orderBys: [{
                metric: { metricName: 'eventCount' },
                desc: true, // Sắp xếp theo số lượng sự kiện giảm dần
            }],
            limit: 10, // Lấy top 10 để xử lý
        });

        // 2. Xử lý dữ liệu trả về để lấy ra các ID công thức
        const trendingIDs = [];
        if (response.rows) {
            console.log(`Tìm thấy ${response.rows.length} hàng dữ liệu từ GA.`);
            response.rows.forEach(row => {
                const recipeId = row.dimensionValues[0].value;
                // Đảm bảo ID có giá trị và đúng định dạng (scl- hoặc PROCOLOR-)
                if (recipeId && (recipeId.startsWith('scl-') || recipeId.startsWith('PROCOLOR-'))) {
                    if (!trendingIDs.includes(recipeId)) {
                        trendingIDs.push(recipeId);
                    }
                }
            });
        } else {
            console.log('Không có dữ liệu trả về từ Google Analytics.');
        }
        
        // Chỉ lấy 5 công thức hàng đầu
        const top5 = trendingIDs.slice(0, 5);

        if (top5.length === 0) {
            console.log('Không tìm thấy dữ liệu thịnh hành mới sau khi xử lý.');
            res.status(200).send('Không có dữ liệu mới.');
            return;
        }

        // 3. Ghi dữ liệu vào Firestore
        const docRef = db.collection(`artifacts/${APP_ID}/public/data/trending`).doc('latest');
        await docRef.set({
            ids: top5,
            lastUpdated: new Date().toISOString(),
        });

        console.log('Cập nhật thành công:', top5);
        res.status(200).send(`Cập nhật thành công với ${top5.length} công thức.`);

    } catch (error) {
        console.error('LỖI khi cập nhật dữ liệu thịnh hành:', error);
        res.status(500).send('Đã xảy ra lỗi.');
    }
};
