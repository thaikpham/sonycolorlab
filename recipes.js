// recipes.js

// Maintainability: Dữ liệu công thức được tách ra một file riêng để dễ quản lý và cập nhật.
// Biến này sẽ được truy cập toàn cục bởi file index.html.
const recipesData = [
    {
        "id": "scl-01-vintage-memory",
        "name": { "vi": "SCL-01: Ký Ức Vintage", "en": "SCL-01: Vintage Memory" },
        "description": { "vi": "Tông màu phim cổ điển, độ bão hòa thấp và tương phản mềm, như một ký ức xa xăm.", "en": "A classic film tone with low saturation and soft contrast, like a distant memory." },
        "type": "color", "contrast": "low", "saturation": "low",
        "whiteBalance": "8600K, B2.5-M3",
        "settings": { "Black level": "-5", "Gamma": "Cine4", "Black Gamma": "Middle -7", "Knee": "Manual 82.5% +4", "Color Mode": "Still", "Saturation": "-8", "Color Phase": "+1" },
        "colorDepth": { "R": "-6", "G": "+7", "B": "+1", "C": "+3", "M": "+7", "Y": "+5" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#a1887f", "coords": { "x": -7.5, "y": -6.5 },
        "demoImages": ["https://images.unsplash.com/photo-1524222717473-730000096953?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1506377711776-dbdc2f2a2a2a?q=80&w=1974&auto=format&fit=crop"]
    },
    {
        "id": "scl-02-emerald-dream",
        "name": { "vi": "SCL-02: Giấc Mơ Lục Bảo", "en": "SCL-02: Emerald Dream" },
        "description": { "vi": "Tông màu cổ điển với sắc xanh lá cây đặc trưng, mang lại cảm giác trong trẻo và hoài niệm.", "en": "A classic tone with characteristic green hues, providing a clear and nostalgic feel." },
        "type": "color", "contrast": "low", "saturation": "low",
        "whiteBalance": "3700K, A7-M0.5",
        "settings": { "Black level": "0", "Gamma": "Movie", "Black Gamma": "Wide +7", "Knee": "Manual 80% +4", "Color Mode": "Still", "Saturation": "+11", "Color Phase": "-3" },
        "colorDepth": { "R": "-4", "G": "+7", "B": "-3", "C": "-3", "M": "-5", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#66bb6a", "coords": { "x": -4.0, "y": -1.5 },
        "demoImages": ["https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=1974&auto=format&fit=crop"]
    },
    {
        "id": "scl-03-neon-noir",
        "name": { "vi": "SCL-03: Đêm Màu", "en": "SCL-03: Neon Noir" },
        "description": { "vi": "Tông màu xanh lá cây đậm chất điện ảnh, lý tưởng cho những cảnh đêm huyền ảo và rực rỡ.", "en": "A cinematic green tone, ideal for magical and vibrant night scenes." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "3000K, A7-G7",
        "settings": { "Black level": "-15", "Gamma": "Still", "Black Gamma": "Wide +7", "Knee": "Manual 105% +4", "Color Mode": "S-Gamut3.Cine", "Saturation": "+32", "Color Phase": "+5" },
        "colorDepth": { "R": "+5", "G": "-1", "B": "+2", "C": "+5", "M": "+5", "Y": "+3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#880e4f", "coords": { "x": 8.5, "y": 9.0 }
    },
    {
        "id": "scl-04-urban-shadows",
        "name": { "vi": "SCL-04: Bóng Đô Thị", "en": "SCL-04: Urban Shadows" },
        "description": { "vi": "Đen trắng tương phản cao, vùng tối sâu và chi tiết, hoàn hảo cho kiến trúc và đường phố.", "en": "High-contrast black and white with deep, detailed shadows, perfect for architecture and street." },
        "type": "bw", "contrast": "high", "saturation": "low",
        "whiteBalance": "AWB",
        "settings": { "Black level": "-10", "Gamma": "Still", "Black Gamma": "Middle -3", "Knee": "Manual 85% +4", "Color Mode": "Black & White", "Saturation": "+15", "Color Phase": "0" },
        "colorDepth": { "R": "-4", "G": "+1", "B": "+3", "C": "+3", "M": "-4", "Y": "-1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#616161", "coords": { "x": 6.0, "y": -3.0 }
    },
    {
        "id": "scl-05-faded-canvas",
        "name": { "vi": "SCL-05: Vải Bạc Màu", "en": "SCL-05: Faded Canvas" },
        "description": { "vi": "Đen trắng với hiệu ứng 'faded', vùng tối được nâng lên tạo cảm giác hoài niệm, mơ màng.", "en": "Black and white with a 'faded' effect, where shadows are lifted to create a nostalgic, dreamy feel." },
        "type": "bw", "contrast": "low", "saturation": "medium",
        "whiteBalance": "AWB",
        "settings": { "Black level": "+3", "Gamma": "Still", "Black Gamma": "Middle -7", "Knee": "Manual 75% +2", "Color Mode": "Black & White", "Saturation": "0", "Color Phase": "0" },
        "colorDepth": { "R": "+5", "G": "+5", "B": "+7", "C": "+2", "M": "+7", "Y": "-4" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#9e9e9e", "coords": { "x": -4.0, "y": 0.0 }
    },
    {
        "id": "scl-06-sun-drenched",
        "name": { "vi": "SCL-06: Nắng Đượm", "en": "SCL-06: Sun-drenched" },
        "description": { "vi": "Tông màu ấm áp của cồn cát dưới ánh nắng, mang đậm cảm giác hoài cổ và tự do.", "en": "The warm tones of sunlit dunes, carrying a deep sense of nostalgia and freedom." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "AWB, A2-G1.75",
        "settings": { "Black level": "+4", "Gamma": "S-Cinetone", "Black Gamma": "Middle -7", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+32", "Color Phase": "+3" },
        "colorDepth": { "R": "+3", "G": "+7", "B": "+4", "C": "-5", "M": "-3", "Y": "-3" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#ffb300", "coords": { "x": 1.5, "y": 9.5 }
    },
    {
        "id": "scl-07-silver-screen",
        "name": { "vi": "SCL-07: Màn Bạc", "en": "SCL-07: Silver Screen" },
        "description": { "vi": "Đen trắng tương phản cao, mô phỏng những thước phim điện ảnh kinh điển, sắc nét.", "en": "High-contrast black and white, simulating classic, sharp motion picture film." },
        "type": "bw", "contrast": "high", "saturation": "high",
        "whiteBalance": "5500K",
        "settings": { "Black level": "-15", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 75% +4", "Color Mode": "Black & White", "Saturation": "+32", "Color Phase": "0" },
        "colorDepth": { "R": "+2", "G": "+7", "B": "+1", "C": "+2", "M": "+7", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#424242", "coords": { "x": 9.0, "y": 8.0 }
    },
    {
        "id": "scl-08-meadow-lullaby",
        "name": { "vi": "SCL-08: Ru Đồng", "en": "SCL-08: Meadow Lullaby" },
        "description": { "vi": "Tông màu ấm áp, mềm mại, gợi cảm giác của ánh nắng ban mai trên một đồng cỏ yên bình.", "en": "A warm, soft tone that evokes the feeling of morning sun on a peaceful meadow." },
        "type": "color", "contrast": "low", "saturation": "medium",
        "whiteBalance": "4200K, A7-M2",
        "settings": { "Black level": "+5", "Gamma": "Still", "Black Gamma": "Narrow -7", "Knee": "Manual 75% +5", "Color Mode": "Still", "Saturation": "+14", "Color Phase": "-3" },
        "colorDepth": { "R": "-3", "G": "+7", "B": "-3", "C": "-7", "M": "-4", "Y": "-1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#fff176", "coords": { "x": -7.0, "y": 4.5 }
    },
    {
        "id": "scl-09-crimson-peak",
        "name": { "vi": "SCL-09: Đỉnh Thẫm", "en": "SCL-09: Crimson Peak" },
        "description": { "vi": "Màu sắc mạnh mẽ, tương phản cao, với tông đỏ và cam được nhấn mạnh, tạo nên sự kịch tính.", "en": "Strong colors with high contrast, with emphasized red and orange tones, creating a dramatic effect." },
        "type": "color", "contrast": "high", "saturation": "high",
        "whiteBalance": "8500K, B3.5-G1",
        "settings": { "Black level": "-15", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 105% +5", "Color Mode": "S-Cinetone", "Saturation": "+32", "Color Phase": "+1" },
        "colorDepth": { "R": "+5", "G": "+7", "B": "+2", "C": "+5", "M": "+5", "Y": "+5" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#e53935", "coords": { "x": 9.5, "y": 9.5 }
    },
    {
        "id": "scl-10-golden-ember",
        "name": { "vi": "SCL-10: Tàn Tro Vàng", "en": "SCL-10: Golden Ember" },
        "description": { "vi": "Tái tạo ánh sáng vàng óng và mềm mại của buổi hoàng hôn, mang lại cảm giác ấm áp và lãng mạn.", "en": "Recreates the golden, soft light of sunset, providing a warm and romantic feel." },
        "type": "color", "contrast": "medium", "saturation": "high",
        "whiteBalance": "5000K, A2-M1",
        "settings": { "Black level": "+6", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 75% +4", "Color Mode": "S-Gamut3.Cine", "Saturation": "+25", "Color Phase": "+2" },
        "colorDepth": { "R": "-3", "G": "+7", "B": "+5", "C": "+5", "M": "+5", "Y": "+1" },
        "detailSettings": { "Level": "0", "Mode": "Manual", "V/H Balance": "+2", "B/W Balance": "Type 3", "Limit": "7", "Crispening": "7", "Hi-Light Detail": "4" },
        "personalityColor": "#e57373", "coords": { "x": 4.5, "y": 6.0 }
    }
];
