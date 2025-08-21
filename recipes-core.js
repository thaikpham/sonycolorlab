const recipesData = [
    {
        "id": "scl-001",
        "name": { "vi": "SCL-001: Mojave Sun", "en": "SCL-001: Mojave Sun" },
        "formattedName": "SCL-001-Mojave Sun***",
        "description": {
            "en": "A nostalgic, sun-drenched style that bathes scenes in the warm glow of golden hour.\nPerfect for travel and lifestyle, it recreates rich yellows and deep blues, evoking the feeling of an endless summer road trip.",
            "vi": "Một phong cách hoài niệm, ngập tràn ánh nắng, bao phủ các khung cảnh trong ánh sáng ấm áp của giờ vàng. Hoàn hảo cho du lịch và đời sống, nó tái tạo màu vàng đậm và xanh dương sâu, gợi lên cảm giác về một chuyến đi mùa hè bất tận."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "high",
        "tags": ["nostalgic", "sun-drenched", "warm", "travel", "lifestyle", "summer", "golden-hour"],
        "whiteBalance": "8300K, B3-M1.5",
        "settings": { "Black level": "-7", "Gamma": "Cine1", "Black Gamma": "Wide +5", "Knee": "Manual 85% +2", "Color Mode": "S-Gamut3", "Saturation": "+25", "Color Phase": "+4" },
        "colorDepth": { "R": "-1", "G": "+1", "B": "+5", "C": "+4", "M": "0", "Y": "+5" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#FFD700",
        "coords": { "x": 6, "y": 7 }
    },
    {
        "id": "scl-002",
        "name": { "vi": "SCL-002: Kyoto Jade", "en": "SCL-002: Kyoto Jade" },
        "formattedName": "SCL-002-Kyoto Jade",
        "description": {
            "en": "A serene and subtle palette defined by rich jade tones and gentle skin colors.\nIdeal for contemplative portraits, street photography, and landscapes, creating a peaceful, painterly atmosphere.",
            "vi": "Một bảng màu thanh tĩnh và tinh tế được định hình bởi các tông màu xanh ngọc bích đậm và màu da dịu. Lý tưởng cho chân dung trầm tư, nhiếp ảnh đường phố và phong cảnh, tạo ra một không khí yên bình, tựa như tranh vẽ."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "normal",
        "tags": ["serene", "subtle", "portrait", "street-photography", "landscape", "peaceful", "painterly"],
        "whiteBalance": "3700K, A7-M0.5",
        "settings": { "Black level": "0", "Gamma": "Cine1", "Black Gamma": "Wide +7", "Knee": "Manual 80% +3", "Color Mode": "Pro", "Saturation": "+12", "Color Phase": "-4" },
        "colorDepth": { "R": "-4", "G": "+7", "B": "-2", "C": "-2", "M": "-5", "Y": "-3" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#66CDAA",
        "coords": { "x": -4, "y": 3 }
    },
    // ... all other recipes without the "demoImages" property
];
export default recipesData;
