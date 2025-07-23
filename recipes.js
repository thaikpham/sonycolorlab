const recipesData = [
    {
        "id": "scl-001",
        "name": { "vi": "SCL-001: Mojave Sun", "en": "SCL-001: Mojave Sun" }, // Updated name format
        "formattedName": "SCL-001-Mojave Sun", // Formatted name
        "description": {
            "en": "A nostalgic, sun-drenched style that bathes scenes in the warm glow of golden hour.\nPerfect for travel and lifestyle, it recreates rich yellows and deep blues, evoking the feeling of an endless summer road trip.",
            "vi": "Một phong cách hoài niệm, ngập tràn ánh nắng, bao phủ các khung cảnh trong ánh sáng ấm áp của giờ vàng. Hoàn hảo cho du lịch và đời sống, nó tái tạo màu vàng đậm và xanh dương sâu, gợi lên cảm giác về một chuyến đi mùa hè bất tận."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "normal",
        "tags": ["nostalgic", "sun-drenched", "warm", "travel", "lifestyle", "summer", "golden-hour"],
        "whiteBalance": "8300K, B3-M1.5",
        "settings": { "Black level": "-5", "Gamma": "Movie", "Black Gamma": "Wide +7", "Knee": "Manual 75% +4", "Color Mode": "S-Gamut3", "Saturation": "+22", "Color Phase": "+4" },
        "colorDepth": { "R": "-2", "G": "0", "B": "+5", "C": "+5", "M": "0", "Y": "+4" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#FFD700", // Yellowish
        "coords": { "x": 6, "y": 7 } // Example coordinates for chart
    },
    {
        "id": "scl-002",
        "name": { "vi": "SCL-002: Kyoto Jade", "en": "SCL-002: Kyoto Jade" }, // Updated name format
        "formattedName": "SCL-002-Kyoto Jade", // Formatted name
        "description": {
            "en": "A serene and subtle palette defined by rich jade tones and gentle skin colors.\nIdeal for contemplative portraits, street photography, and landscapes, creating a peaceful, painterly atmosphere.",
            "vi": "Một bảng màu thanh tĩnh và tinh tế được định hình bởi các tông màu xanh ngọc bích đậm và màu da dịu. Lý tưởng cho chân dung trầm tư, nhiếp ảnh đường phố và phong cảnh, tạo ra một không khí yên bình, tựa như tranh vẽ."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "normal",
        "tags": ["serene", "subtle", "portrait", "street-photography", "landscape", "peaceful", "painterly"],
        "whiteBalance": "3700K, A7-M0.5",
        "settings": { "Black level": "0", "Gamma": "Movie", "Black Gamma": "Wide +7", "Knee": "Manual 80% +4", "Color Mode": "Still", "Saturation": "+10", "Color Phase": "-4" },
        "colorDepth": { "R": "-4", "G": "+7", "B": "-3", "C": "-3", "M": "-5", "Y": "-3" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#66CDAA", // Jade Green
        "coords": { "x": -4, "y": 3 }
    },
    {
        "id": "scl-003",
        "name": { "vi": "SCL-003: Caspian Blue", "en": "SCL-003: Caspian Blue" }, // Updated name format
        "formattedName": "SCL-003-Caspian Blue", // Formatted name
        "description": {
            "en": "A cool-toned, cinematic profile with distinctive deep blues and rich, crushed blacks.\nIt lends a moody, atmospheric quality to images, perfect for urban nightscapes, dramatic portraits, and storytelling.",
            "vi": "Một cấu hình điện ảnh, tông lạnh với sắc xanh dương đặc trưng và vùng tối sâu, đậm. Nó mang lại chất lượng tâm trạng, đầy không khí cho hình ảnh, hoàn hảo cho cảnh đêm đô thị, chân dung kịch tính và kể chuyện."
        },
        "type": "color",
        "contrast": "high",
        "saturation": "normal",
        "tags": ["cinematic", "cool-tone", "deep-blues", "moody", "atmospheric", "urban-night", "dramatic-portrait", "storytelling"],
        "whiteBalance": "8000K, B2-M2",
        "settings": { "Black level": "-15", "Gamma": "Cine2", "Black Gamma": "Middle +7", "Knee": "Manual 85% +4", "Color Mode": "S-Gamut3.Cine", "Saturation": "+20", "Color Phase": "+7" },
        "colorDepth": { "R": "0", "G": "-1", "B": "+3", "C": "+4", "M": "+5", "Y": "+2" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#4682B4", // Steel Blue
        "coords": { "x": -8, "y": 5 }
    },
    {
        "id": "scl-004",
        "name": { "vi": "SCL-004: Tuscan Ochre", "en": "SCL-004: Tuscan Ochre" }, // Updated name format
        "formattedName": "SCL-004-Tuscan Ochre", // Formatted name
        "description": {
            "en": "A vibrant, high-saturation style with warm, earthy reds and yellows.\nIt brings a bold, sun-baked intensity to images, reminiscent of classic European travel photography.",
            "vi": "Một phong cách rực rỡ, độ bão hòa cao với các tông màu đỏ đất và vàng đất ấm áp. Nó mang lại một cường độ táo bạo, cháy nắng cho hình ảnh, gợi nhớ đến nhiếp ảnh du lịch châu Âu cổ điển."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "high",
        "tags": ["vibrant", "high-saturation", "earthy-reds", "warm-yellows", "bold", "sun-baked", "classic-european-travel"],
        "whiteBalance": "4700K, A2-M0.5",
        "settings": { "Black level": "+5", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 85% +2", "Color Mode": "S-Gamut3.Cine", "Saturation": "+23", "Color Phase": "+3" },
        "colorDepth": { "R": "-3", "G": "+7", "B": "+5", "C": "+5", "M": "+5", "Y": "+1" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#CD853F", // Peru
        "coords": { "x": 7, "y": 8 }
    },
    {
        "id": "scl-005",
        "name": { "vi": "SCL-005: Somerset Meadow", "en": "SCL-005: Somerset Meadow" }, // Updated name format
        "formattedName": "SCL-005-Somerset Meadow", // Formatted name
        "description": {
            "en": "A soft, pastel-like palette with gentle contrast and low saturation.\nIt renders skin tones beautifully and gives landscapes a dreamy, ethereal quality, perfect for romantic and fine-art portraits.",
            "vi": "Một bảng màu nhẹ nhàng, tựa màu pastel với độ tương phản mềm và độ bão hòa thấp. Nó tái tạo tông màu da một cách đẹp đẽ và mang lại cho phong cảnh một chất lượng mơ màng, thanh tao, hoàn hảo cho chân dung lãng mạn và nghệ thuật."
        },
        "type": "color",
        "contrast": "soft",
        "saturation": "low",
        "tags": ["pastel", "soft-contrast", "low-saturation", "dreamy", "ethereal", "romantic-portrait", "fine-art"],
        "whiteBalance": "4200K, A6-M2",
        "settings": { "Black level": "-10", "Gamma": "Movie", "Black Gamma": "Middle -7", "Knee": "Auto", "Color Mode": "Movie", "Saturation": "+10", "Color Phase": "+3" },
        "colorDepth": { "R": "-3", "G": "+7", "B": "-3", "C": "-3", "M": "-5", "Y": "+4" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#B0E0E6", // Powder Blue
        "coords": { "x": -2, "y": -5 }
    },
    {
        "id": "scl-006",
        "name": { "vi": "SCL-006: Faded Cine", "en": "SCL-006: Faded Cine" }, // Updated name format
        "formattedName": "SCL-006-Faded Canvas", // Formatted name
        "description": {
            "en": "A stylized look with heavily lifted blacks and muted colors, creating a soft, hazy effect.\nIt evokes a sense of nostalgia and is ideal for fashion, editorial, and lifestyle photography aiming for a vintage-modern feel.",
            "vi": "Một phong cách được cách điệu hóa với vùng đen được nâng sáng mạnh và màu sắc dịu, tạo ra một hiệu ứng mờ, mềm mại. Nó gợi lên cảm giác hoài niệm và lý tưởng cho nhiếp ảnh thời trang, biên tập và đời sống hướng đến cảm giác cổ điển-hiện đại."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "muted",
        "tags": ["stylized", "lifted-blacks", "soft-colors", "hazy", "nostalgic", "fashion", "editorial", "lifestyle", "vintage-modern"],
        "whiteBalance": "3600K, A6-M1.5",
        "settings": { "Black level": "+15", "Gamma": "Movie", "Black Gamma": "Narrow +7", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+11", "Color Phase": "-4" },
        "colorDepth": { "R": "-3", "G": "+7", "B": "-3", "C": "+3", "M": "+5", "Y": "+2" },
        "detailSettings": { "Level": "-7" },
        "personalityColor": "#D2B48C", // Tan
        "coords": { "x": 0, "y": -7 }
    },
    {
        "id": "scl-007",
        "name": { "vi": "SCL-007: Dynachrome '75", "en": "SCL-007: Dynachrome '75" }, // Updated name format
        "formattedName": "SCL-007-Dynachrome '75", // Formatted name
        "description": {
            "en": "A high-contrast, moody profile with deep blacks and a dramatic, cool color shift.\nIt emphasizes texture and form, creating a strong graphic style reminiscent of vintage documentary slide film.",
            "vi": "Một cấu hình tương phản cao, đầy tâm trạng với màu đen sâu và sự dịch chuyển màu sắc lạnh, đầy kịch tính. Nó nhấn mạnh kết cấu và hình khối, tạo ra một phong cách đồ họa mạnh mẽ gợi nhớ đến phim dương bản tài liệu cổ điển."
        },
        "type": "color",
        "contrast": "high",
        "saturation": "normal",
        "tags": ["high-contrast", "moody", "deep-blacks", "cool-color-shift", "graphic", "classic-slide-film"],
        "whiteBalance": "4700K, A7-G0.5",
        "settings": { "Black level": "-15", "Gamma": "Cine1", "Black Gamma": "Wide -7", "Knee": "Manual 82.5% +4", "Color Mode": "S-Cinetone", "Saturation": "+10", "Color Phase": "+2" },
        "colorDepth": { "R": "+2", "G": "+7", "B": "-7", "C": "-6", "M": "+3", "Y": "+3" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#8B0000", // Dark Red
        "coords": { "x": -8, "y": 2 }
    },
    {
        "id": "scl-008",
        "name": { "vi": "SCL-008: Modern Classic", "en": "SCL-008: Modern Classic" }, // Updated name format
        "formattedName": "SCL-008-Modern Classic", // Formatted name
        "description": {
            "en": "A clean, vibrant, and contemporary style built on modern color science.\nIt delivers rich, pleasing colors with smooth tonal transitions, making it a versatile choice for everyday shooting, from portraits to products.",
            "vi": "Một phong cách trong trẻo, sống động và đương đại được xây dựng trên khoa học màu sắc hiện đại. Nó mang lại màu sắc phong phú, dễ chịu với sự chuyển tông mượt mà, là một lựa chọn linh hoạt cho việc chụp ảnh hàng ngày, từ chân dung đến sản phẩm."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "normal",
        "tags": ["clean", "vibrant", "contemporary", "modern-color-science", "rich-colors", "smooth-tonal-transitions", "versatile", "everyday", "portrait", "product"],
        "whiteBalance": "4000K, A7-M2",
        "settings": { "Black level": "+6", "Gamma": "S-Cinetone", "Black Gamma": "Narrow -7", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+14", "Color Phase": "-3" },
        "colorDepth": { "R": "0", "G": "+7", "B": "+5", "C": "-2", "M": "+3", "Y": "+2" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#4682B4", // Steel Blue
        "coords": { "x": 0, "y": 4 }
    },
    {
        "id": "scl-009",
        "name": { "vi": "SCL-009: Urban Teal", "en": "SCL-009: Urban Teal" }, // Updated name format
        "formattedName": "SCL-009-Urban Teal", // Formatted name
        "description": {
            "en": "A muted, low-saturation color profile with a distinctive cyan-teal cast in the shadows and mid-tones.\nIt creates a subtle, gentle, and slightly melancholic mood, perfect for street photography and urban exploration.",
            "vi": "Một cấu hình màu dịu, độ bão hòa thấp với sắc xanh mòng két (cyan-teal) đặc trưng ở vùng tối và trung bình. Nó tạo ra một tâm trạng tinh tế, nhẹ nhàng và hơi u buồn, hoàn hảo cho nhiếp ảnh đường phố và khám phá đô thị."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "low",
        "tags": ["muted-color", "low-saturation", "cyan-teal", "subtle", "gentle", "melancholy", "street-photography", "urban-exploration"],
        "whiteBalance": "4000K, A7-M0.5",
        "settings": { "Black level": "-7", "Gamma": "Still", "Black Gamma": "Middle -7", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "-5", "Color Phase": "+2" },
        "colorDepth": { "R": "-4", "G": "+7", "B": "+2", "C": "+3", "M": "-6", "Y": "-1" },
        "detailSettings": { "Level": "-7" },
        "personalityColor": "#008080", // Teal
        "coords": { "x": -5, "y": -3 }
    },
    {
        "id": "scl-010",
        "name": { "vi": "SCL-010: Cinema Verde", "en": "SCL-010: Cinema Verde" }, // Updated name format
        "formattedName": "SCL-010-Cinema Verde", // Formatted name
        "description": {
            "en": "A cinematic style with very low saturation and a subtle green tint, designed to emulate motion picture film.\nIt provides a flat, neutral base, ideal for shots requiring a desaturated, atmospheric feel.",
            "vi": "Một phong cách điện ảnh với độ bão hòa rất thấp và một chút sắc xanh lá tinh tế, được thiết kế để mô phỏng phim điện ảnh. Nó cung cấp một nền phẳng, trung tính, lý tưởng cho các cảnh quay đòi hỏi cảm giác mất bão hòa, đầy không khí."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "very-low",
        "tags": ["cinematic", "very-low-saturation", "subtle-green-tint", "film-emulation", "flat", "neutral", "desaturated", "atmospheric"],
        "whiteBalance": "4000K, A7-M0.25",
        "settings": { "Black level": "+7", "Gamma": "Movie", "Black Gamma": "Wide -5", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "-5", "Color Phase": "+1" },
        "colorDepth": { "R": "-3", "G": "+7", "B": "-2", "C": "+6", "M": "+4", "Y": "+2" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#3CB371", // Medium Sea Green
        "coords": { "x": 2, "y": -6 }
    },
    {
        "id": "scl-011",
        "name": { "vi": "SCL-011: Midnight Halogen", "en": "SCL-011: Midnight Halogen" }, // Updated name format
        "formattedName": "SCL-011-Midnight Halogen", // Formatted name
        "description": {
            "en": "A night-specific formula that transforms artificial city lights into vibrant blues and cyans, while maintaining good highlight control.\nIt creates a futuristic, cyberpunk-inspired aesthetic.",
            "vi": "Một công thức chuyên dụng cho ban đêm, biến đổi ánh đèn nhân tạo của thành phố thành các màu xanh dương và xanh mòng két rực rỡ, trong khi vẫn kiểm soát tốt vùng sáng. Nó tạo ra một thẩm mỹ tương lai, lấy cảm hứng từ cyberpunk."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "normal",
        "tags": ["night-specific", "city-lights", "vibrant-blues", "cyan-teal", "highlight-control", "futuristic", "cyberpunk"],
        "whiteBalance": "2700K, A7-M1.25",
        "settings": { "Black level": "+3", "Gamma": "Movie", "Black Gamma": "Wide +7", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+2", "Color Phase": "+5" },
        "colorDepth": { "R": "-5", "G": "-7", "B": "-7", "C": "+3", "M": "-7", "Y": "-5" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#4169E1", // Royal Blue
        "coords": { "x": -7, "y": 0 }
    },
    {
        "id": "scl-012",
        "name": { "vi": "SCL-012: Amber Glow", "en": "SCL-012: Amber Glow" }, // Updated name format
        "formattedName": "SCL-012-Amber Glow", // Formatted name
        "description": {
            "en": "A warm, soft, and nostalgic profile with a gentle amber cast.\nIt excels at creating a cozy and intimate feel, perfect for golden hour portraits, family photos, and vintage-inspired shots.",
            "vi": "Một cấu hình ấm áp, nhẹ nhàng và hoài niệm với sắc hổ phách mềm mại. Nó xuất sắc trong việc tạo ra cảm giác ấm áp và thân mật, hoàn hảo cho chân dung giờ vàng, ảnh gia đình và các cảnh quay mang hơi hướng cổ điển."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "normal",
        "tags": ["warm", "soft", "nostalgic", "amber-tint", "intimate", "golden-hour-portrait", "family-photos", "vintage-inspired"],
        "whiteBalance": "4300K, A7-M0.25",
        "settings": { "Black level": "+2", "Gamma": "Movie", "Black Gamma": "Middle +2", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+3", "Color Phase": "+1" },
        "colorDepth": { "R": "+1", "G": "+7", "B": "+2", "C": "+2", "M": "+4", "Y": "+2" },
        "detailSettings": { "Level": "-7" },
        "personalityColor": "#FFBF00", // Amber
        "coords": { "x": 4, "y": -2 }
    },
    {
        "id": "scl-013",
        "name": { "vi": "SCL-013: Flatiron Mist", "en": "SCL-013: Flatiron Mist" }, // Updated name format
        "formattedName": "SCL-013-Flatiron Mist", // Formatted name
        "description": {
            "en": "An incredibly versatile, low-contrast profile that utilizes an S-Log gamma to maximize dynamic range.\nIt produces a flat, soft image with rich colors, perfect for harsh lighting conditions or as a robust base for post-production.",
            "vi": "Một cấu hình cực kỳ linh hoạt, có độ tương phản thấp, sử dụng gamma S-Log để tối đa hóa dải tần nhạy sáng. Nó tạo ra một hình ảnh phẳng, mềm mại với màu sắc phong phú, hoàn hảo cho điều kiện ánh sáng gắt hoặc làm nền tảng vững chắc cho việc hậu kỳ."
        },
        "type": "color",
        "contrast": "low",
        "saturation": "normal",
        "tags": ["versatile", "low-contrast", "s-log", "maximized-dynamic-range", "flat-image", "soft", "rich-colors", "harsh-lighting", "post-production"],
        "whiteBalance": "4500K, A7-M1",
        "settings": { "Black level": "-15", "Gamma": "S-Log2", "Black Gamma": "Middle -7", "Knee": "Manual 75% +5", "Color Mode": "Still", "Saturation": "+20", "Color Phase": "+3" },
        "colorDepth": { "R": "+3", "G": "+5", "B": "+5", "C": "+7", "M": "+7", "Y": "-3" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#A9A9A9", // Dark Gray
        "coords": { "x": -5, "y": 0 }
    },
    {
        "id": "scl-014",
        "name": { "vi": "SCL-014: Magenta Bloom", "en": "SCL-014: Magenta Bloom" }, // Updated name format
        "formattedName": "SCL-014-Magenta Bloom", // Formatted name
        "description": {
            "en": "A vibrant, powerful style with a distinctive magenta cast, emulating a popular slide film.\nIdeal for landscapes and nature, making flowers and sunsets pop with intense, dramatic colors.",
            "vi": "Một phong cách sống động, mạnh mẽ với tông màu magenta đặc trưng, mô phỏng loại phim dương bản nổi tiếng. Lý tưởng cho phong cảnh và thiên nhiên, làm cho hoa và cảnh hoàng hôn trở nên nổi bật với màu sắc dữ dội, đầy kịch tính."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "vibrant",
        "tags": ["vibrant", "powerful", "magenta-cast", "slide-film", "landscape", "nature", "flowers", "sunsets", "intense-colors", "dramatic"],
        "whiteBalance": "3900K, A7-M0.25",
        "settings": { "Black level": "-8", "Gamma": "Still", "Black Gamma": "Middle -7", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+10", "Color Phase": "-1" },
        "colorDepth": { "R": "+2", "G": "+7", "B": "+1", "C": "+2", "M": "-7", "Y": "0" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#FF00FF", // Magenta
        "coords": { "x": 3, "y": 6 }
    },
    {
        "id": "scl-015",
        "name": { "vi": "SCL-015: Vintage Slide", "en": "SCL-015: Vintage Slide" }, // Updated name format
        "formattedName": "SCL-015-Vintage Slide", // Formatted name
        "description": {
            "en": "A warm, slightly faded style with a subtle green-cyan tint in the shadows.\nIt evokes the feeling of looking through old family slide films, perfect for nostalgic portraits and everyday scenes.",
            "vi": "Một phong cách ấm áp, hơi phai màu với một chút sắc xanh lá-lục trong vùng tối. Nó gợi lên cảm giác như đang xem lại những tấm phim slide cũ của gia đình, hoàn hảo cho chân dung hoài niệm và các cảnh đời thường."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "faded",
        "tags": ["warm", "faded", "green-tint", "old-family-slides", "nostalgic-portrait", "everyday-scenes"],
        "whiteBalance": "3600K, A7-M1",
        "settings": { "Black level": "-4", "Gamma": "Movie", "Black Gamma": "Middle -7", "Knee": "Manual 80% +4", "Color Mode": "Still", "Saturation": "+10", "Color Phase": "-1" },
        "colorDepth": { "R": "+3", "G": "+5", "B": "-4", "C": "+2", "M": "+6", "Y": "+5" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#BC8F8F", // Rosy Brown
        "coords": { "x": 1, "y": -4 }
    },
    {
        "id": "scl-016",
        "name": { "vi": "SCL-016: Everyday Natural", "en": "SCL-016: Everyday Natural" }, // Updated name format
        "formattedName": "SCL-016-Everyday Natural", // Formatted name
        "description": {
            "en": "A clean, balanced, and versatile profile with moderate saturation and natural skin tones.\nThis is a go-to choice for a wide range of situations, providing an authentic look with a subtle filmic feel.",
            "vi": "Một cấu hình trong trẻo, cân bằng và linh hoạt với độ bão hòa vừa phải và tông màu da tự nhiên. Đây là lựa chọn hàng đầu cho nhiều tình huống, mang lại một cái nhìn chân thực với một chút cảm giác phim ảnh tinh tế."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "moderate",
        "tags": ["clean", "balanced", "versatile", "natural-skin-tones", "all-situations", "authentic-look", "subtle-film-feel"],
        "whiteBalance": "3900K, A7",
        "settings": { "Black level": "+2", "Gamma": "Still", "Black Gamma": "Wide +2", "Knee": "Auto", "Color Mode": "Still", "Saturation": "+10", "Color Phase": "-1" },
        "colorDepth": { "R": "-2", "G": "+7", "B": "+4", "C": "+2", "M": "-4", "Y": "+2" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#8FBC8F", // Dark Sea Green
        "coords": { "x": 0, "y": 0 }
    },
    {
        "id": "scl-017",
        "name": { "vi": "SCL-017: Soft Portrait", "en": "SCL-017: Soft Portrait" }, // Updated name format
        "formattedName": "SCL-017-Soft Portrait", // Formatted name
        "description": {
            "en": "Characterized by soft contrast and a gentle magenta cast, this formula is perfect for flattering portraits.\nIt renders skin tones with a smooth, delicate quality, creating a refined and elegant look.",
            "vi": "Đặc trưng bởi độ tương phản mềm mại và tông màu magenta dịu, công thức này hoàn hảo cho những bức chân dung nịnh mắt. Nó tái tạo tông màu da với chất lượng nhẹ nhàng, mượt mà, tạo ra một vẻ ngoài tinh tế và thanh lịch."
        },
        "type": "color",
        "contrast": "soft",
        "saturation": "muted",
        "tags": ["soft-contrast", "gentle-magenta", "flattering-portraits", "smooth-skin-tones", "delicate", "elegant"],
        "whiteBalance": "4100K, A7-M0.25",
        "settings": { "Black level": "-8", "Gamma": "Movie", "Black Gamma": "Middle -7", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+5", "Color Phase": "0" },
        "colorDepth": { "R": "0", "G": "+2", "B": "+3", "C": "+2", "M": "-7", "Y": "0" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#DB7093", // Pale Violet Red
        "coords": { "x": -3, "y": -1 }
    },
    {
        "id": "scl-018",
        "name": { "vi": "SCL-018: Vector Graphic", "en": "SCL-018: Vector Graphic" }, // Updated name format
        "formattedName": "SCL-018-Vector Graphic", // Formatted name
        "description": {
            "en": "A bold, high-contrast style with super-saturated, almost artificial colors and deep blacks.\nIt creates a strong graphic look, ideal for abstract subjects, modern architecture, and experimental photography.",
            "vi": "Một phong cách táo bạo, tương phản cao với màu sắc siêu bão hòa, gần như nhân tạo và màu đen sâu. Nó tạo ra một phong cách đồ họa mạnh mẽ, lý tưởng cho các chủ thể trừu tượng, kiến trúc hiện đại và nhiếp ảnh thử nghiệm."
        },
        "type": "color",
        "contrast": "high",
        "saturation": "super-saturated",
        "tags": ["bold", "high-contrast", "super-saturated", "artificial-colors", "deep-blacks", "graphic", "abstract", "modern-architecture", "experimental-photography"],
        "whiteBalance": "4000K, A5-M0.5",
        "settings": { "Black level": "-15", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 92.5% +5", "Color Mode": "S-Gamut3.Cine", "Saturation": "+27", "Color Phase": "+6" },
        "colorDepth": { "R": "+5", "G": "+7", "B": "+5", "C": "+5", "M": "+2", "Y": "+1" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#8A2BE2", // Blue Violet
        "coords": { "x": 8, "y": 9 }
    },
    {
        "id": "scl-019",
        "name": { "vi": "SCL-019: Pop Art", "en": "SCL-019: Pop Art" }, // Updated name format
        "formattedName": "SCL-019-Pop Art", // Formatted name
        "description": {
            "en": "An explosion of color. This formula pushes saturation to the maximum, creating a super-vibrant, high-energy style.\nPerfect for making bold statements and capturing the fun, playful side of life.",
            "vi": "Một sự bùng nổ của màu sắc. Công thức này đẩy độ bão hòa lên mức tối đa, tạo ra một phong cách siêu rực rỡ, năng lượng cao. Hoàn hảo để tạo ra những tuyên bố táo bạo và ghi lại khía cạnh vui vẻ, tinh nghịch của cuộc sống."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "maximum",
        "tags": ["color-explosion", "maximum-saturation", "super-vibrant", "high-energy", "bold-statements", "playful-side"],
        "whiteBalance": "3700K, A5-M1",
        "settings": { "Black level": "+2", "Gamma": "Still", "Black Gamma": "Middle +7", "Knee": "Manual 85% +3", "Color Mode": "S-Gamut3", "Saturation": "+20", "Color Phase": "-1" },
        "colorDepth": { "R": "+2", "G": "+7", "B": "+7", "C": "+7", "M": "+7", "Y": "+4" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#FF69B4", // Hot Pink
        "coords": { "x": 8, "y": 6 }
    },
    {
        "id": "scl-020",
        "name": { "vi": "SCL-020: Autumn Haze", "en": "SCL-020: Autumn Haze" }, // Updated name format
        "formattedName": "SCL-020-Autumn Haze", // Formatted name
        "description": {
            "en": "A modern take on classic warm film stocks, utilizing S-Cinetone for smooth tones.\nIt delivers a cozy feel, with slightly muted greens and yellows, perfect for capturing the essence of a misty autumn day.",
            "vi": "Một phiên bản hiện đại của dòng phim ấm cổ điển, sử dụng S-Cinetone cho tông màu mượt mà. Nó mang lại cảm giác ấm cúng, với màu xanh lá và vàng hơi dịu, hoàn hảo để ghi lại tinh hoa của một ngày thu mờ sương."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "muted",
        "tags": ["modern-take", "classic-warm-film", "s-cinetone", "smooth-tones", "cozy", "subtle-greens", "yellows", "misty-autumn-day"],
        "whiteBalance": "4600K, A7-G1.25",
        "settings": { "Black level": "+2", "Gamma": "S-Cinetone", "Black Gamma": "Narrow -7", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+25", "Color Phase": "+5" },
        "colorDepth": { "R": "+3", "G": "-3", "B": "-5", "C": "-3", "M": "+3", "Y": "-2" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#D2B48C", // Tan
        "coords": { "x": 5, "y": -1 }
    },
    {
        "id": "scl-021",
        "name": { "vi": "SCL-021: Muted Pastels", "en": "SCL-021: Muted Pastels" }, // Updated name format
        "formattedName": "SCL-021-Muted Pastels", // Formatted name
        "description": {
            "en": "A soft and subtle style with moderate saturation and gentle tones.\nIt's versatile for everyday shooting, lending images a peaceful and pleasant feel without being overwhelmed by color.",
            "vi": "Một phong cách nhẹ nhàng và tinh tế với độ bão hòa vừa phải và tông màu mềm mại. Nó linh hoạt cho việc chụp ảnh hàng ngày, mang lại cho hình ảnh một cảm giác yên bình và dễ chịu mà không bị màu sắc lấn át."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "moderate",
        "tags": ["soft", "subtle", "moderate-saturation", "soft-tones", "versatile", "everyday-shooting", "peaceful", "pleasant", "not-overwhelmed-by-color"],
        "whiteBalance": "4500K, A7-M0.75",
        "settings": { "Black level": "+2", "Gamma": "Movie", "Black Gamma": "Wide -7", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+8", "Color Phase": "-1" },
        "colorDepth": { "R": "-4", "G": "+7", "B": "-3", "C": "-5", "M": "+5", "Y": "+4" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#ADD8E6", // Light Blue
        "coords": { "x": -1, "y": -3 }
    },
    {
        "id": "scl-022",
        "name": { "vi": "SCL-022: Neutral Standard", "en": "SCL-022: Neutral Standard" }, // Updated name format
        "formattedName": "SCL-022-Neutral Standard", // Formatted name
        "description": {
            "en": "A neutral, true-to-life profile designed for accuracy.\nIt provides a clean, standard look with minimal color shifts, making it a great, reliable base for any type of photography.",
            "vi": "Một cấu hình trung tính, chân thực được thiết kế cho sự chính xác. Nó cung cấp một cái nhìn trong trẻo, tiêu chuẩn với sự thay đổi màu sắc tối thiểu, làm cho nó trở thành một nền tảng tuyệt vời, đáng tin cậy cho bất kỳ loại nhiếp ảnh nào."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "low",
        "tags": ["neutral", "true-to-life", "accuracy", "clean", "standard-look", "minimal-color-shift", "reliable-base", "any-type-of-photography"],
        "whiteBalance": "4000K, A7-M0.25",
        "settings": { "Black level": "+2", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+2", "Color Phase": "+1" },
        "colorDepth": { "R": "+1", "G": "+7", "B": "0", "C": "+3", "M": "+2", "Y": "+1" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#D3D3D3", // Light Gray
        "coords": { "x": 0, "y": -1 }
    },
    {
        "id": "scl-023",
        "name": { "vi": "SCL-023: Alpine Cool", "en": "SCL-023: Alpine Cool" }, // Updated name format
        "formattedName": "SCL-023-Alpine Cool", // Formatted name
        "description": {
            "en": "A cool-toned formula with a high Kelvin temperature, giving images a clean, crisp blue cast.\nIt's well-suited for emphasizing cold light in urban or mountain landscapes, creating a clean and edgy aesthetic.",
            "vi": "Một công thức tông màu lạnh với nhiệt độ Kelvin cao, mang lại cho hình ảnh một sắc xanh trong trẻo, sắc nét. Rất phù hợp để nhấn mạnh ánh sáng lạnh trong các cảnh quan đô thị hoặc núi non, tạo ra một phong cách thẩm mỹ sạch sẽ và sắc sảo."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "normal",
        "tags": ["cool-tone", "high-kelvin", "clean-blue-cast", "sharp", "cold-light", "urban-landscape", "mountain", "clean-aesthetic", "crisp"],
        "whiteBalance": "7000K, B5-M0.25",
        "settings": { "Black level": "-9", "Gamma": "Still", "Black Gamma": "Middle +7", "Knee": "Manual 75% +4", "Color Mode": "Still", "Saturation": "+6", "Color Phase": "+2" },
        "colorDepth": { "R": "+3", "G": "+7", "B": "+3", "C": "-5", "M": "+3", "Y": "-2" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#4682B4", // Steel Blue
        "coords": { "x": -6, "y": 3 }
    },
    {
        "id": "scl-024",
        "name": { "vi": "SCL-024: Arctic Negative", "en": "SCL-024: Arctic Negative" }, // Updated name format
        "formattedName": "SCL-024-Arctic Negative", // Formatted name
        "description": {
            "en": "Pushing white balance to its coldest, this formula creates a unique, stylized look with a deep blue-green cast.\nIt's perfect for experimental, moody, and atmospheric photography.",
            "vi": "Đẩy cân bằng trắng đến mức lạnh nhất, công thức này tạo ra một phong cách độc đáo, cách điệu với sắc xanh lam-lục sâu. Nó hoàn hảo cho các bức ảnh thử nghiệm, tâm trạng và đầy không khí."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "normal",
        "tags": ["cold-white-balance", "unique", "stylized", "deep-blue-green-cast", "experimental", "moody", "atmospheric"],
        "whiteBalance": "9900K, B6-M0.5",
        "settings": { "Black level": "+4", "Gamma": "S-Cinetone", "Black Gamma": "Middle -7", "Knee": "Manual 75% +5", "Color Mode": "S-Cinetone", "Saturation": "+5", "Color Phase": "+1" },
        "colorDepth": { "R": "+2", "G": "+7", "B": "-4", "C": "-4", "M": "-5", "Y": "+3" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#00CED1", // Dark Cyan
        "coords": { "x": -9, "y": 1 }
    },
    {
        "id": "scl-025",
        "name": { "vi": "SCL-025: Saturated Cinema", "en": "SCL-025: Saturated Cinema" }, // Updated name format
        "formattedName": "SCL-025-Saturated Cinema", // Formatted name
        "description": {
            "en": "A powerful, high-saturation cinematic style, distinct from Fuji emulations.\nIt utilizes a wide color space to produce deep, rich colors with a filmic gamma curve, well-suited for vivid visual storytelling.",
            "vi": "Một phong cách điện ảnh có độ bão hòa cao và mạnh mẽ, khác với phiên bản Fuji. Nó sử dụng không gian màu rộng để tạo ra màu sắc sâu, phong phú với đường cong gamma điện ảnh, rất phù hợp cho kể chuyện bằng hình ảnh sống động."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "high",
        "tags": ["high-saturation", "powerful-cinematic", "wide-color-space", "deep-rich-colors", "cinematic-gamma-curve", "vivid-visual-storytelling"],
        "whiteBalance": "4000K, A7-M1",
        "settings": { "Black level": "-5", "Gamma": "Cine4", "Black Gamma": "Wide -5", "Knee": "Manual 87.5% +3", "Color Mode": "S-Gamut3", "Saturation": "+32", "Color Phase": "+6" },
        "colorDepth": { "R": "-3", "G": "-2", "B": "+3", "C": "+7", "M": "-3", "Y": "-2" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#8B0000", // Dark Red
        "coords": { "x": 7, "y": 5 }
    },
    {
        "id": "scl-026",
        "name": { "vi": "SCL-026: HDR Cinema", "en": "SCL-026: HDR Cinema" }, // Updated name format
        "formattedName": "SCL-026-HDR Cinema", // Formatted name
        "description": {
            "en": "Leveraging HLG (Hybrid Log-Gamma), this formula captures wide dynamic range with high saturation.\nIt produces a vivid, impactful image that feels both cinematic and surreal, ideal for high-energy shots.",
            "vi": "Tận dụng HLG (Hybrid Log-Gamma), công thức này ghi lại dải tần nhạy sáng rộng với độ bão hòa cao. Nó tạo ra một hình ảnh sống động, tác động mạnh, vừa mang cảm giác điện ảnh vừa siêu thực, lý tưởng cho các cảnh quay năng lượng cao."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "high",
        "tags": ["hlg", "hybrid-log-gamma", "wide-dynamic-range", "high-saturation", "vivid", "impactful", "cinematic-feel", "surreal", "high-energy-shots"],
        "whiteBalance": "3900K, A7",
        "settings": { "Black level": "-15", "Gamma": "HLG3", "Black Gamma": "Wide 0", "Knee": "Auto", "Color Mode": "BT.2020", "Saturation": "+32", "Color Phase": "+7" },
        "colorDepth": { "R": "-4", "G": "-1", "B": "+5", "C": "+4", "M": "+5", "Y": "+2" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#FF4500", // Orange Red
        "coords": { "x": 9, "y": 6 }
    },
    {
        "id": "scl-027",
        "name": { "vi": "SCL-027: Daylight Cinema", "en": "SCL-027: Daylight Cinema" }, // Updated name format
        "formattedName": "SCL-027-Daylight Cinema", // Formatted name
        "description": {
            "en": "A modern, clean cinematic style based on S-Cinetone.\nIt's designed for daylight conditions, delivering beautiful skin tones, high saturation, and a professional, polished feel straight out of camera.",
            "vi": "Một phong cách điện ảnh hiện đại, trong trẻo dựa trên S-Cinetone. Nó được thiết kế cho ánh sáng ban ngày, mang lại tông màu da đẹp, độ bão hòa cao và cảm giác chuyên nghiệp, bóng bẩy ngay từ máy ảnh."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "high",
        "tags": ["modern-cinematic", "clean", "s-cinetone", "daylight", "beautiful-skin-tones", "high-saturation", "professional", "polished", "straight-out-of-camera"],
        "whiteBalance": "3700K, A7-G1",
        "settings": { "Black level": "+9", "Gamma": "S-Cinetone", "Black Gamma": "Narrow -7", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+32", "Color Phase": "+3" },
        "colorDepth": { "R": "0", "G": "+3", "B": "+2", "C": "+2", "M": "-3", "Y": "+1" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#F0E68C", // Khaki
        "coords": { "x": 5, "y": 4 }
    },
    {
        "id": "scl-028",
        "name": { "vi": "SCL-028: Phoenix Fire", "en": "SCL-028: Phoenix Fire" }, // Updated name format
        "formattedName": "SCL-028-Phoenix Fire", // Formatted name
        "description": {
            "en": "An experimental and powerful style with ultra-high saturation and pronounced warm tones.\nIt creates fiery reds and oranges, perfect for bold, abstract, and high-impact photography.",
            "vi": "Một phong cách thử nghiệm và mạnh mẽ với độ bão hòa cực cao và tông màu ấm rõ rệt. Nó tạo ra màu đỏ và cam rực lửa, hoàn hảo cho nhiếp ảnh táo bạo, trừu tượng và có tác động mạnh."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "extreme",
        "tags": ["experimental", "powerful", "ultra-high-saturation", "pronounced-warm-tones", "fiery-reds", "oranges", "bold", "abstract", "high-impact"],
        "whiteBalance": "8500K, B3.5-G1",
        "settings": { "Black level": "-15", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 105% +5", "Color Mode": "S-Cinetone", "Saturation": "+32", "Color Phase": "+1" },
        "colorDepth": { "R": "+5", "G": "+7", "B": "+2", "C": "+5", "M": "+5", "Y": "+5" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#FF4500", // OrangeRed
        "coords": { "x": 9, "y": 9 }
    },
    {
        "id": "scl-029",
        "name": { "vi": "SCL-029: Hollywood Cool", "en": "SCL-029: Hollywood Cool" }, // Updated name format
        "formattedName": "SCL-029-Hollywood Cool", // Formatted name
        "description": {
            "en": "A balanced cinematic formula for tungsten lighting with a cool blue-green bias.\nBased on S-Cinetone, it delivers smooth tones and a sophisticated, professional look reminiscent of classic Hollywood films.",
            "vi": "Một công thức điện ảnh cân bằng cho ánh sáng tungsten với thiên hướng xanh lam-lục mát mẻ. Dựa trên S-Cinetone, nó mang lại tông màu mượt mà và một vẻ ngoài tinh xảo, chuyên nghiệp gợi nhớ đến các bộ phim Hollywood cổ điển."
        },
        "type": "color",
        "contrast": "normal",
        "saturation": "normal",
        "tags": ["balanced-cinematic", "tungsten-light", "cool-blue-green-bias", "s-cinetone", "smooth-tones", "sophisticated", "professional-look", "classic-hollywood"],
        "whiteBalance": "8200K, B4.5-G1.75",
        "settings": { "Black level": "-10", "Gamma": "S-Cinetone", "Black Gamma": "Narrow -7", "Knee": "Auto", "Color Mode": "S-Cinetone", "Saturation": "+16", "Color Phase": "+2" },
        "colorDepth": { "R": "+5", "G": "+7", "B": "-6", "C": "-5", "M": "+7", "Y": "-4" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#6495ED", // Cornflower Blue
        "coords": { "x": -8, "y": 0 }
    },
    {
        "id": "scl-040",
        "name": { "vi": "SCL-040: Graphite Standard", "en": "SCL-040: Graphite Standard" }, // Updated name format
        "formattedName": "SCL-040-Graphite Standard", // Formatted name
        "description": {
            "en": "A balanced, versatile monochrome style with a full tonal range and clean mid-tones.\nThis is a perfect starting point for black and white photography, delivering classic, timeless results for any subject.",
            "vi": "Một phong cách đơn sắc cân bằng, đa dụng với dải tông màu đầy đủ và các tông màu trung bình trong trẻo. Đây là điểm khởi đầu hoàn hảo cho nhiếp ảnh đen trắng, mang lại kết quả cổ điển, vượt thời gian cho mọi chủ thể."
        },
        "type": "bw",
        "contrast": "normal",
        "saturation": "normal",
        "tags": ["balanced-monochrome", "versatile", "full-tonal-range", "clean-midtones", "perfect-starting-point", "black-and-white", "classic", "timeless"],
        "whiteBalance": "AWB (Ưu tiên trắng)",
        "settings": { "Black level": "-11", "Gamma": "Still", "Black Gamma": "Middle -3", "Knee": "Manual 85% +5", "Color Mode": "Black & White", "Saturation": "+15", "Color Phase": "0" },
        "colorDepth": { "R": "-1", "G": "+1", "B": "-1", "C": "+3", "M": "-3", "Y": "-1" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#555555", // Dark Gray
        "coords": { "x": 0, "y": 0 } // Placeholder for B&W chart
    },
    {
        "id": "scl-041",
        "name": { "vi": "SCL-041: Obsidian Contrast", "en": "SCL-041: Obsidian Contrast" }, // Updated name format
        "formattedName": "SCL-041-Obsidian Contrast", // Formatted name
        "description": {
            "en": "A dramatic, high-contrast monochrome style with inky blacks and crisp whites.\nIdeal for architectural details, powerful street photography, and making subjects stand out with impressive clarity.",
            "vi": "Một phong cách đơn sắc kịch tính, tương phản cao với màu đen sâu như mực và màu trắng sắc nét. Lý tưởng cho các chi tiết kiến trúc, nhiếp ảnh đường phố mạnh mẽ và làm nổi bật chủ thể với sự rõ ràng ấn tượng."
        },
        "type": "bw",
        "contrast": "high",
        "saturation": "normal",
        "tags": ["dramatic-monochrome", "high-contrast", "inky-blacks", "crisp-whites", "architectural-details", "powerful-street-photography", "impressive-clarity"],
        "whiteBalance": "AWB (Ưu tiên trắng)",
        "settings": { "Black level": "-15", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 85% +5", "Color Mode": "Black & White", "Saturation": "+15", "Color Phase": "0" },
        "colorDepth": { "R": "+2", "G": "-4", "B": "-1", "C": "+2", "M": "-1", "Y": "+2" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#333333", // Very Dark Gray
        "coords": { "x": 8, "y": 5 }
    },
    {
        "id": "scl-042",
        "name": { "vi": "SCL-042: Newsprint Grit", "en": "SCL-042: Newsprint Grit" }, // Updated name format
        "formattedName": "SCL-042-Newsprint Grit", // Formatted name
        "description": {
            "en": "A powerful, high-contrast style that emulates the feel of 'pushed' black and white film used by photojournalists.\nIt's grainy, sharp, and full of character, perfect for capturing raw, unedited moments.",
            "vi": "Một phong cách mạnh mẽ, tương phản cao mô phỏng cảm giác của phim đen trắng \"pushed\" được các nhà báo ảnh sử dụng. Nó có hạt, sắc nét và đầy cá tính, hoàn hảo để ghi lại những khoảnh khắc thô mộc, không qua chỉnh sửa."
        },
        "type": "bw",
        "contrast": "high",
        "saturation": "normal",
        "tags": ["powerful", "high-contrast", "pushed-black-and-white-film", "photojournalism", "grainy", "sharp", "character", "raw", "unedited-moments"],
        "whiteBalance": "5500K, A3-G2",
        "settings": { "Black level": "+5", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 77.5% +2", "Color Mode": "Black & White", "Saturation": "+24", "Color Phase": "0" },
        "colorDepth": { "R": "-4", "G": "-1", "B": "+6", "C": "+5", "M": "-3", "Y": "-3" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#777777", // Medium Gray
        "coords": { "x": 6, "y": -2 }
    },
    {
        "id": "scl-043",
        "name": { "vi": "SCL-043: Silver Gelatin", "en": "SCL-043: Silver Gelatin" }, // Updated name format
        "formattedName": "SCL-043-Silver Gelatin", // Formatted name
        "description": {
            "en": "A flat, soft-contrast profile with rich mid-tones and smooth transitions.\nIt emulates the look of a classic darkroom print on silver gelatin paper, ideal for fine-art portraits and subtle compositions.",
            "vi": "Một cấu hình tương phản phẳng, mềm mại với các tông màu trung bình phong phú và sự chuyển tiếp mượt mà. Nó mô phỏng vẻ ngoài của một bản in phòng tối cổ điển trên giấy bạc gelatin, lý tưởng cho chân dung nghệ thuật và các bố cục tinh tế."
        },
        "type": "bw",
        "contrast": "soft",
        "saturation": "normal",
        "tags": ["flat", "soft-contrast", "rich-midtones", "smooth-transitions", "classic-darkroom-print", "silver-gelatin-paper", "fine-art-portrait", "subtle-compositions"],
        "whiteBalance": "5500K, A3-G2",
        "settings": { "Black level": "+3", "Gamma": "Cine1", "Black Gamma": "Narrow +5", "Knee": "Manual 75% +3", "Color Mode": "Black & White", "Saturation": "+24", "Color Phase": "0" },
        "colorDepth": { "R": "+3", "G": "+3", "B": "+3", "C": "+2", "M": "+3", "Y": "+2" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#AAAAAA", // Light Gray
        "coords": { "x": -5, "y": -5 }
    },
    {
        "id": "scl-044",
        "name": { "vi": "SCL-044: Crystal Clear", "en": "SCL-044: Crystal Clear" }, // Updated name format
        "formattedName": "SCL-044-Crystal Clear", // Formatted name
        "description": {
            "en": "A clean, crisp, and cool-toned black and white style.\nIt features fine grain and high clarity, perfect for technical subjects, architecture, and portraits where detail is paramount.",
            "vi": "Một phong cách đen trắng trong trẻo, sắc nét và có tông màu lạnh. Nó có hạt mịn và độ trong cao, hoàn hảo cho các chủ thể kỹ thuật, kiến trúc và chân dung nơi chi tiết là quan trọng nhất."
        },
        "type": "bw",
        "contrast": "normal",
        "saturation": "normal",
        "tags": ["clean", "crisp", "cool-tone", "fine-grain", "high-clarity", "technical-subjects", "architecture", "detail-oriented-portraits"],
        "whiteBalance": "AWB, B3-G0.25",
        "settings": { "Black level": "-12", "Gamma": "Still", "Black Gamma": "Middle -7", "Knee": "Manual 82% +5", "Color Mode": "Black & White", "Saturation": "0", "Color Phase": "0" },
        "colorDepth": { "R": "-1", "G": "-7", "B": "+7", "C": "+7", "M": "+7", "Y": "-4" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#BBBBBB", // Lighter Gray
        "coords": { "x": 3, "y": 7 }
    },
    {
        "id": "scl-045",
        "name": { "vi": "SCL-045: Classic Reportage", "en": "SCL-045: Classic Reportage" }, // Updated name format
        "formattedName": "SCL-045-Classic Reportage", // Formatted name
        "description": {
            "en": "A versatile, medium-contrast style with a classic grain structure.\nThis is a black and white 'workhorse' choice, ideal for photojournalism, street photography, and capturing everyday life with an authentic feel.",
            "vi": "Một phong cách đa dụng, có độ tương phản trung bình với cấu trúc hạt cổ điển. Đây là lựa chọn \"chủ lực\" của nhiếp ảnh đen trắng, lý tưởng cho phóng sự, nhiếp ảnh đường phố và ghi lại cuộc sống hàng ngày với cảm giác chân thực."
        },
        "type": "bw",
        "contrast": "medium",
        "saturation": "normal",
        "tags": ["versatile", "medium-contrast", "classic-grain", "black-and-white-workhorse", "photojournalism", "street-photography", "everyday-life", "authentic-feel"],
        "whiteBalance": "AWB, A3",
        "settings": { "Black level": "-12", "Gamma": "Movie", "Black Gamma": "Middle -5", "Knee": "Manual 75% +4", "Color Mode": "Black & White", "Saturation": "0", "Color Phase": "0" },
        "colorDepth": { "R": "0", "G": "+3", "B": "0", "C": "+2", "M": "+3", "Y": "0" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#888888", // Gray
        "coords": { "x": -2, "y": 2 }
    },
    {
        "id": "scl-046",
        "name": { "vi": "SCL-046: Noir Film", "en": "SCL-046: Noir Film" }, // Updated name format
        "formattedName": "SCL-046-Noir Film", // Formatted name
        "description": {
            "en": "A very high-contrast, dramatic black and white style with deep, crushed blacks and bright whites.\nIt evokes the classic film noir aesthetic, perfect for creating mystery, drama, and graphic compositions.",
            "vi": "Một phong cách đen trắng có độ tương phản rất cao, đầy kịch tính với màu đen sâu, bị nén và màu trắng sáng. Nó gợi lên phong cách của phim noir cổ điển, hoàn hảo để tạo ra sự bí ẩn, kịch tính và các bố cục đồ họa."
        },
        "type": "bw",
        "contrast": "very-high",
        "saturation": "normal",
        "tags": ["very-high-contrast", "dramatic", "deep-crushed-blacks", "bright-whites", "classic-film-noir", "mystery", "graphic-compositions"],
        "whiteBalance": "5500K",
        "settings": { "Black level": "-15", "Gamma": "Still", "Black Gamma": "Wide -7", "Knee": "Manual 75% +4", "Color Mode": "Black & White", "Saturation": "+32", "Color Phase": "0" },
        "colorDepth": { "R": "+2", "G": "+7", "B": "+1", "C": "+2", "M": "+7", "Y": "+1" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#222222", // Very Dark Gray
        "coords": { "x": 9, "y": 9 }
    },
    {
        "id": "scl-047",
        "name": { "vi": "SCL-047: Low Light Grain", "en": "SCL-047: Low Light Grain" }, // Updated name format
        "formattedName": "SCL-047-Low Light Grain", // Formatted name
        "description": {
            "en": "Designed to emulate high-speed film, this formula uses a cinematic gamma to handle contrast while encouraging grain.\nIt's perfect for low-light situations, adding texture and atmosphere to shots.",
            "vi": "Được thiết kế để mô phỏng phim tốc độ cao, công thức này sử dụng gamma điện ảnh để xử lý độ tương phản trong khi khuyến khích hạt. Nó hoàn hảo cho các tình huống thiếu sáng, thêm kết cấu và không khí cho ảnh."
        },
        "type": "bw",
        "contrast": "normal",
        "saturation": "normal",
        "tags": ["high-speed-film-emulation", "cinematic-gamma", "contrast-handling", "grain-encouraged", "low-light-situations", "texture", "atmosphere"],
        "whiteBalance": "AWB (Ưu tiên trắng)",
        "settings": { "Black level": "-11", "Gamma": "Cine4", "Black Gamma": "Wide +7", "Knee": "Manual 82.5% +0", "Color Mode": "Black & White", "Saturation": "0", "Color Phase": "-2" },
        "colorDepth": { "R": "+3", "G": "+2", "B": "+7", "C": "+7", "M": "+4", "Y": "-5" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#666666", // Dark Gray
        "coords": { "x": -4, "y": -7 }
    },
    {
        "id": "scl-048",
        "name": { "vi": "SCL-048: Modern B&W", "en": "SCL-048: Modern B&W" }, // Updated name format
        "formattedName": "SCL-048-Modern B&W", // Formatted name
        "description": {
            "en": "A contemporary black and white style that utilizes S-Cinetone gamma for smooth, beautiful tonal transitions.\nIt delivers deep blacks without being overly harsh, well-suited for modern portraits and fine art.",
            "vi": "Một phong cách đen trắng đương đại sử dụng gamma S-Cinetone để tạo ra sự chuyển tông mượt mà, đẹp mắt. Nó mang lại màu đen sâu mà không quá gắt, rất phù hợp cho chân dung hiện đại và nghệ thuật."
        },
        "type": "bw",
        "contrast": "normal",
        "saturation": "normal",
        "tags": ["contemporary-black-and-white", "s-cinetone-gamma", "smooth-beautiful-tonal-transitions", "deep-blacks", "not-harsh", "modern-portrait", "fine-art"],
        "whiteBalance": "5500K",
        "settings": { "Black level": "-15", "Gamma": "S-Cinetone", "Black Gamma": "Narrow -7", "Knee": "Manual 75% +2", "Color Mode": "Black & White", "Saturation": "+28", "Color Phase": "0" },
        "colorDepth": { "R": "-3", "G": "+4", "B": "+3", "C": "+3", "M": "+3", "Y": "+2" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#444444", // Dark Gray
        "coords": { "x": 5, "y": 4 }
    },
    {
        "id": "scl-049",
        "name": { "vi": "SCL-049: Ortho Portrait", "en": "SCL-049: Ortho Portrait" }, // Updated name format
        "formattedName": "SCL-049-Ortho Portrait", // Formatted name
        "description": {
            "en": "Emulating orthochromatic film, which is insensitive to red light.\nThis results in darkened skin and lip tones, creating a unique, vintage, and often dramatic portrait style.",
            "vi": "Mô phỏng phim orthochromatic, loại phim không nhạy với ánh sáng đỏ. Điều này dẫn đến tông màu da và môi bị tối đi, tạo ra một phong cách chân dung độc đáo, cổ điển và thường đầy kịch tính."
        },
        "type": "color", // This one is tricky, it's a color effect but often used for B&W-like portraits
        "contrast": "normal",
        "saturation": "normal",
        "tags": ["orthochromatic-film", "red-light-insensitive", "darkened-skin-tones", "lips", "unique-portrait", "vintage", "dramatic"],
        "whiteBalance": "AWB, A3-M2.75",
        "settings": { "Black level": "-12", "Gamma": "Movie", "Black Gamma": "Narrow -7", "Knee": "Manual 105% +5", "Color Mode": "Still", "Saturation": "+15", "Color Phase": "0" },
        "colorDepth": { "R": "+7", "G": "+7", "B": "-7", "C": "-7", "M": "+7", "Y": "+7" },
        "detailSettings": { "Level": "0" },
        "personalityColor": "#708090", // Slate Gray
        "coords": { "x": -6, "y": -8 }
    }
];

export default recipesData;
