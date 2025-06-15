export const translations = {
    // Original App Translations
    headerTitle: {vi: "Alpha AI Color Lab", en: "Alpha AI Color Lab"},
    navLibrary: {vi:"Thư viện", en:"Library"},
    navExplain: {vi:"Giải thích", en:"Explain"},
    navAiStudio: {vi: "AI Studio", en: "AI Studio"},
    landingTitle: {vi:"Tìm màu sắc của riêng bạn.", en:"Find your signature color."},
    landingSubtitle: {vi:"Trả lời vài câu hỏi để khám phá công thức màu được AI tạo ra dành riêng cho tâm trạng và phong cách của bạn hôm nay.", en:"Answer a few questions to discover a unique color recipe, tailored by AI to your mood and style for the day."},
    startQuizBtn: {vi:"Khám phá màu của bạn", en:"Discover Your Color"},
    retakeQuizBtn: {vi: "Làm lại Quiz", en: "Retake Quiz"},
    quizResultTitle: {vi: "AI đề xuất 2 lựa chọn cho bạn:", en: "AI suggests 2 options for you:"},
    loadingAnalyze: {vi: "Đang phân tích lựa chọn...", en: "Analyzing your choices..."},
    sidebarTitle: {vi: "Thư viện màu", en: "Color Library"},
    // ... all other original translations
    errorApi: {vi: "Lỗi kết nối với AI. Vui lòng thử lại.", en: "Error connecting to AI. Please try again."},
    loading: {vi: "Đang tải...", en: "Loading..."},
    compareBtn: {vi: "So sánh 2 lựa chọn", en: "Compare 2 selections"},
    comparisonModalTitle: {vi: "So sánh bằng AI", en: "AI Comparison"},
    comparisonLoading: {vi: "AI đang phân tích...", en: "AI is analyzing..."},
};

export const quizQuestions = [
    // ... same as before
    { id: 'aesthetic', title: 'quizQ1', options: ['quizQ1A1', 'quizQ1A2', 'quizQ1A3', 'quizQ1A4'], values: ['Vintage', 'Modern', 'Cinematic', 'Artistic'] },
    { id: 'mood', title: 'quizQ2', options: ['quizQ2A1', 'quizQ2A2', 'quizQ2A3', 'quizQ2A4'], values: ['Happy', 'Contemplative', 'Dynamic', 'Peaceful'] },
    { id: 'location', title: 'quizQ3', options: ['quizQ3A1', 'quizQ3A2', 'quizQ3A3', 'quizQ3A4'], values: ['Beach', 'Mountain', 'Urban', 'Old Town'] },
    { id: 'tone', title: 'quizQ4', options: ['quizQ4A1', 'quizQ4A2', 'quizQ4A3'], values: ['Warm', 'Cool', 'Neutral'] },
    { id: 'look', title: 'quizQ5', options: ['quizQ5A1', 'quizQ5A2', 'quizQ5A3'], values: ['High', 'Low', 'Medium'] },
    { id: 'style', title: 'quizQ6', options: ['quizQ6A1', 'quizQ6A2'], values: ['Eastern', 'Western'] }
];

// Translations from infographic.html
export const infographicTranslations = {
    mainTitle: { vi: 'Làm Chủ Màu Sắc Film-look', en: 'Mastering the Film Look' },
    mainSubtitle: { vi: 'Hướng dẫn toàn diện về White Balance và Picture Profile trên máy ảnh Sony', en: 'A Comprehensive Guide to White Balance and Picture Profile on Sony Cameras' },
    introTitle: { vi: 'Nghệ Thuật Của Màu Sắc Sony DIY Color', en: 'The Art of Sony DIY Color' },
    introParagraph: { vi: 'Thay vì dành hàng giờ hậu kỳ, hãy tạo ra những bức ảnh với màu sắc hoàn hảo ngay từ máy ảnh. Đây là cách rèn luyện tư duy nhiếp ảnh, đưa ra quyết định sáng tạo ngay tại thời điểm bấm máy, sử dụng các công cụ mạnh mẽ mà Sony trang bị.', en: 'Instead of spending hours in post-production, create photos with perfect colors straight out of camera. This practice hones your photographic thinking, pushing creative decisions to the moment of capture using the powerful tools Sony provides.' },
    rawProcessTitle: { vi: 'Quy Trình Hậu Kỳ RAW', en: 'RAW Post-Production Workflow' },
    rawStep1: { vi: '1. 📸 Chụp ảnh RAW', en: '1. 📸 Shoot in RAW' },
    rawStep2: { vi: '2. 💻 Chuyển file vào máy tính', en: '2. 💻 Transfer files to computer' },
    rawStep3: { vi: '3. 🎨 Mở phần mềm chỉnh sửa', en: '3. 🎨 Open editing software' },
    rawStep4: { vi: '4.  sliders Kéo các thanh trượt màu sắc', en: '4.  sliders Adjust color sliders' },
    rawStep5: { vi: '5. ✅ Xuất file JPEG/TIFF', en: '5. ✅ Export JPEG/TIFF file' },
    diyProcessTitle: { vi: 'Quy Trình Sáng Tạo Sony DIY Color', en: 'Sony DIY Color Workflow' },
    diyStep1: { vi: '1. 🎨 Thiết lập màu trong máy ảnh', en: '1. 🎨 Set up color in-camera' },
    diyStep2: { vi: '2. 📸 Chụp ảnh JPEG/HEIF', en: '2. 📸 Shoot in JPEG/HEIF' },
    diyStep3: { vi: '3. ✨ Sẵn sàng để sử dụng ngay!', en: '3. ✨ Ready to use immediately!' },
    // ... all other infographic translations
    kelvinChartTitle: { vi: 'Nhiệt độ màu (Kelvin)', en: 'Color Temperature (Kelvin)'},
    wbShiftXAxis: { vi: 'Trục Xanh (B) ← → Hổ phách (A)', en: 'Blue (B) ← → Amber (A) Axis' },
    wbShiftYAxis: { vi: 'Trục Tím (M) ↑', en: 'Magenta (M) Axis ↑' },
    wbShiftRecipe1: { vi: 'Sony Classic Negative', en: 'Sony Classic Negative'},
    wbShiftRecipe2: { vi: 'Kodak Portra 400', en: 'Kodak Portra 400'},
    blackGammaYAxis: { vi: 'Nghiền bóng ↔ Nâng bóng', en: 'Crush Blacks ↔ Lift Blacks'},
    kneeChartSignalIn: { vi: 'Tín hiệu vào (%)', en: 'Input Signal (%)'},
    kneeChartSignalOut: { vi: 'Tín hiệu ra (%)', en: 'Output Signal (%)'},
    kneeChartNoKnee: { vi: 'Tín hiệu gốc (Không Knee)', en: 'Original Signal (No Knee)'},
    kneeChartSoft: { vi: 'Soft Roll-off (Point:80, Slope:+4)', en: 'Soft Roll-off (Point:80, Slope:+4)'},
    kneeChartSharp: { vi: 'Sharp Highlight (Point:95, Slope:-2)', en: 'Sharp Highlight (Point:95, Slope:-2)'},
    colorDepthTitleChart: { vi: 'Điều chỉnh Độ sâu màu', en: 'Color Depth Adjustment'},
    colorDepthYAxis: { vi: 'Nhạt/Sáng ↔ Đậm/Tối', en: 'Pale/Bright ↔ Deep/Dark'},
    colorDepthLabels: {
        vi: ['Đỏ (R)', 'X.lá (G)', 'X.dương (B)', 'Lục lam (C)', 'Tím (M)', 'Vàng (Y)'],
        en: ['Red (R)', 'Green (G)', 'Blue (B)', 'Cyan (C)', 'Magenta (M)', 'Yellow (Y)']
    }
};
