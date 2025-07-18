const recipesData = [
    {
        id: 'scl-01-classic-film',
        name: 'SCL-01: Classic Film',
        description: { en: 'Evokes classic film, with muted tones and soft contrast, like timeless cinematic frames, perfect for a nostalgic and understated mood.', vi: 'Gợi nhớ phim ảnh cổ điển, với tông màu trầm và tương phản mềm mại, như những thước phim vượt thời gian, hoàn hảo cho tâm trạng hoài niệm và tinh tế.' },
        type: 'color',
        contrast: 'low',
        saturation: 'low',
        tags: ['vintage', 'film', 'nostalgic', 'soft', 'cool', 'everyday', 'low-saturation', 'low-contrast', 'color'],
        whiteBalance: '8800K, B3-M4', // Exaggerated
        settings: {
            'Black level': '-6', // Darker for everyday
            'Gamma': 'Cine4',
            'Black Gamma': 'Middle -6',
            'Knee': 'Manual 82.5% +3',
            'Color Mode': 'Still',
            'Saturation': '-7',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '-4', 'G': '+5', 'B': '0', 'C': '+1', 'M': '+5', 'Y': '+3' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#a1887f',
        coords: { x: -7.0, y: -6.0 } // Adjusted
    },
    {
        id: 'scl-02-wong-kar-wai',
        name: 'SCL-02: Wong Kar-Wai',
        description: { en: 'Characteristic green hues, reminiscent of Wong Kar-Wai\'s cinematic style, full of nostalgia, romance, and a melancholic beauty.', vi: 'Sắc xanh đặc trưng, gợi nhớ phong cách điện ảnh của Wong Kar-Wai, đầy hoài niệm, lãng mạn và vẻ đẹp u buồn.' },
        type: 'color',
        contrast: 'low',
        saturation: 'low',
        tags: ['landscape', 'nature', 'green', 'cool', 'nostalgic', 'cinematic', 'low-saturation', 'low-contrast', 'color'],
        whiteBalance: '3500K, A8-M1', // Exaggerated
        settings: {
            'Black level': '-2', // Darker for cinematic
            'Gamma': 'Movie',
            'Black Gamma': 'Wide +6',
            'Knee': 'Manual 80% +3',
            'Color Mode': 'Still',
            'Saturation': '+10',
            'Color Phase': '-2'
        },
        colorDepth: { 'R': '-2', 'G': '+5', 'B': '-1', 'C': '-1', 'M': '-3', 'Y': '-1' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#66bb6a',
        coords: { x: -3.5, y: -1.0 } // Adjusted
    },
    {
        id: 'scl-03-cyberpunk-nights',
        name: 'SCL-03: Cyberpunk Nights',
        description: { en: 'A cinematic green tone, ideal for magical and vibrant night scenes of the cyberpunk world, with neon glows and deep shadows.', vi: 'Tông xanh lá cây điện ảnh, lý tưởng cho những cảnh đêm huyền ảo và sống động của thế giới cyberpunk, với ánh đèn neon và bóng tối sâu thẳm.' },
        type: 'color',
        contrast: 'high',
        saturation: 'high',
        tags: ['cinematic', 'urban', 'street', 'night', 'high-saturation', 'high-contrast', 'color', 'cyberpunk'],
        whiteBalance: '2800K, A8-G8', // Exaggerated
        settings: {
            'Black level': '-16', // Darker for cinematic
            'Gamma': 'Still',
            'Black Gamma': 'Wide +6',
            'Knee': 'Manual 105% +3',
            'Color Mode': 'S-Gamut3.Cine',
            'Saturation': '+31',
            'Color Phase': '+4'
        },
        colorDepth: { 'R': '+3', 'G': '0', 'B': '0', 'C': '+3', 'M': '+3', 'Y': '+1' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#880e4f',
        coords: { x: 8.0, y: 8.5 } // Adjusted
    },
    {
        id: 'scl-04-concrete-jungle',
        name: 'SCL-04: Concrete Jungle',
        description: { en: 'High-contrast black and white with deep, detailed shadows, perfect for urban architecture and street photography, capturing the raw essence of the city.', vi: 'Đen trắng tương phản cao với bóng tối sâu và chi tiết, hoàn hảo cho kiến trúc đô thị và nhiếp ảnh đường phố, nắm bắt bản chất thô mộc của thành phố.' },
        type: 'bw',
        contrast: 'high',
        saturation: 'low',
        tags: ['urban', 'street', 'bw', 'high-contrast', 'architecture'],
        whiteBalance: 'AWB', // Kept AWB
        settings: {
            'Black level': '-9', // Keep as is for BW
            'Gamma': 'Still',
            'Black Gamma': 'Middle -2',
            'Knee': 'Manual 85% +4',
            'Color Mode': 'Black & White',
            'Saturation': '+14',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '-2', 'G': '0', 'B': '+1', 'C': '+1', 'M': '-2', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#616161',
        coords: { x: 5.5, y: -2.5 } // Adjusted
    },
    {
        id: 'scl-05-faded-elegance',
        name: 'SCL-05: Faded Elegance',
        description: { en: 'Black and white with a \'faded\' effect, where shadows are lifted to create a nostalgic, elegant, and dreamy feel, reminiscent of antique prints.', vi: 'Đen trắng với hiệu ứng \'faded\', vùng tối được nâng lên tạo cảm giác hoài niệm, thanh lịch và mơ màng, gợi nhớ những bản in cổ điển.' },
        type: 'bw',
        contrast: 'low',
        saturation: 'medium',
        tags: ['bw', 'vintage', 'faded', 'low-contrast', 'portrait', 'elegant'],
        whiteBalance: 'AWB', // Kept AWB
        settings: {
            'Black level': '+2', // Keep as is for BW
            'Gamma': 'Still',
            'Black Gamma': 'Middle -6',
            'Knee': 'Manual 75% +1',
            'Color Mode': 'Black & White',
            'Saturation': '0',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '+3', 'G': '+3', 'B': '+5', 'C': '0', 'M': '+5', 'Y': '-2' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#9e9e9e',
        coords: { x: -3.5, y: 1.5 } // Adjusted
    },
    {
        id: 'scl-06-desert-bloom',
        name: 'SCL-06: Desert Bloom',
        description: { en: 'The warm tones of sunlit dunes, carrying a deep sense of nostalgia and freedom, like a desert flower blooming under a golden sky.', vi: 'Tông màu ấm áp của cồn cát dưới ánh nắng, mang đậm cảm giác hoài niệm và tự do, như một bông hoa sa mạc nở rộ dưới bầu trời vàng óng.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'high',
        tags: ['warm', 'nostalgic', 'landscape', 'beach', 'high-saturation', 'medium-contrast', 'color', 'desert'],
        whiteBalance: 'AWB, A3-G2', // Exaggerated
        settings: {
            'Black level': '+3', // Keep as is
            'Gamma': 'S-Cinetone',
            'Black Gamma': 'Middle -6',
            'Knee': 'Auto',
            'Color Mode': 'S-Cinetone',
            'Saturation': '+31',
            'Color Phase': '+2'
        },
        colorDepth: { 'R': '+1', 'G': '+5', 'B': '+2', 'C': '-3', 'M': '-1', 'Y': '-1' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ffb300',
        coords: { x: 1.0, y: 9.0 } // Adjusted
    },
    {
        id: 'scl-07-silver-screen',
        name: 'SCL-07: Silver Screen',
        description: { en: 'High-contrast black and white, simulating classic, sharp motion picture film, timeless and iconic, perfect for dramatic narratives.', vi: 'Đen trắng tương phản cao, mô phỏng những thước phim điện ảnh cổ điển, sắc nét, vượt thời gian và mang tính biểu tượng, hoàn hảo cho những câu chuyện kịch tính.' },
        type: 'bw',
        contrast: 'high',
        saturation: 'high',
        tags: ['bw', 'cinematic', 'high-contrast', 'street', 'portrait', 'classic'],
        whiteBalance: '5600K', // Exaggerated
        settings: {
            'Black level': '-14', // Keep as is for BW
            'Gamma': 'Still',
            'Black Gamma': 'Wide -6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'Black & White',
            'Saturation': '+31',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '0', 'C': '0', 'M': '+5', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#424242',
        coords: { x: 8.5, y: 7.5 } // Adjusted
    },
    {
        id: 'scl-08-pastoral-dawn',
        name: 'SCL-08: Pastoral Dawn',
        description: { en: 'A warm, soft tone that evokes the feeling of morning sun on a peaceful meadow, embodying a pastoral beauty and gentle awakening.', vi: 'Tông màu ấm áp, mềm mại, gợi cảm giác ánh nắng ban mai trên một đồng cỏ yên bình, thể hiện vẻ đẹp điền viên và sự thức tỉnh nhẹ nhàng.' },
        type: 'color',
        contrast: 'low',
        saturation: 'medium',
        tags: ['warm', 'soft', 'landscape', 'nature', 'green', 'low-contrast', 'medium-saturation', 'color', 'morning'],
        whiteBalance: '4300K, A8-M3', // Exaggerated
        settings: {
            'Black level': '+4', // Keep as is
            'Gamma': 'Still',
            'Black Gamma': 'Narrow -6',
            'Knee': 'Manual 75% +4',
            'Color Mode': 'Still',
            'Saturation': '+13',
            'Color Phase': '-2'
        },
        colorDepth: { 'R': '-1', 'G': '+5', 'B': '-1', 'C': '-5', 'M': '-2', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#fff176',
        coords: { x: -6.5, y: 4.0 } // Adjusted
    },
    {
        id: 'scl-09-scarlet-drama',
        name: 'SCL-09: Scarlet Drama',
        description: { en: 'Strong colors with high contrast, with emphasized red and orange tones, creating a dramatic and impactful effect, like a vivid theatrical scene.', vi: 'Màu sắc mạnh mẽ với độ tương phản cao, nhấn mạnh tông đỏ và cam, tạo hiệu ứng kịch tính và ấn tượng, như một cảnh sân khấu sống động.' },
        type: 'color',
        contrast: 'high',
        saturation: 'high',
        tags: ['dramatic', 'high-contrast', 'high-saturation', 'warm', 'cinematic', 'color', 'red'],
        whiteBalance: '8700K, B4-G1.5', // Exaggerated
        settings: {
            'Black level': '-16', // Darker for cinematic
            'Gamma': 'Still',
            'Black Gamma': 'Wide -6',
            'Knee': 'Manual 105% +4',
            'Color Mode': 'S-Cinetone',
            'Saturation': '+31',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '+3', 'G': '+5', 'B': '0', 'C': '+3', 'M': '+3', 'Y': '+3' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#e53935',
        coords: { x: 9.0, y: 9.0 } // Adjusted
    },
    {
        id: 'scl-10-sunset-boulevard',
        name: 'SCL-10: Sunset Boulevard',
        description: { en: 'Recreates the golden, soft light of sunset, providing a warm and romantic feel, like on Sunset Boulevard, perfect for dreamy and nostalgic scenes.', vi: 'Tái tạo ánh sáng vàng óng, mềm mại của buổi hoàng hôn, mang lại cảm giác ấm áp và lãng mạn, như trên Đại lộ Hoàng hôn, hoàn hảo cho những cảnh mơ màng và hoài niệm.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'high',
        tags: ['warm', 'golden-hour', 'romantic', 'portrait', 'landscape', 'high-saturation', 'medium-contrast', 'color', 'cinematic'],
        whiteBalance: '5200K, A3-M1.5', // Exaggerated
        settings: {
            'Black level': '+3', // Darker for cinematic
            'Gamma': 'Still',
            'Black Gamma': 'Wide -6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'S-Gamut3.Cine',
            'Saturation': '+24',
            'Color Phase': '+1'
        },
        colorDepth: { 'R': '-1', 'G': '+5', 'B': '+3', 'C': '+3', 'M': '+3', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#e57373',
        coords: { x: 4.0, y: 5.5 } // Adjusted
    },
    {
        id: 'scl-11-mediterranean-blue',
        name: 'SCL-11: Mediterranean Blue',
        description: { en: 'A characteristic blue tone, evoking the feel of a daylight-shot motion picture, with a Mediterranean breeze and clear, vibrant skies.', vi: 'Tông màu xanh dương đặc trưng, gợi cảm giác của một thước phim điện ảnh quay vào ban ngày, với làn gió Địa Trung Hải và bầu trời trong xanh, sống động.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'medium',
        tags: ['cool', 'cinematic', 'daylight', 'blue', 'medium-saturation', 'medium-contrast', 'color', 'landscape'],
        whiteBalance: '7600K, B5-M1.5', // Exaggerated
        settings: {
            'Black level': '-2', // Darker for cinematic
            'Gamma': 'Still',
            'Black Gamma': 'Middle +6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'Still',
            'Saturation': '+9',
            'Color Phase': '-2'
        },
        colorDepth: { 'R': '+2', 'G': '+3', 'B': '-2', 'C': '-2', 'M': '+3', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#42a5f5',
        coords: { x: 1.5, y: 5.0 } // Adjusted
    },
    {
        id: 'scl-12-pop-art-brights',
        name: 'SCL-12: Pop Art Brights',
        description: { en: 'Vibrant, clear colors, simulating lively daylight motion picture film, like a Pop Art masterpiece, bursting with energy and bold hues.', vi: 'Màu sắc sống động, trong trẻo, mô phỏng những thước phim quay ban ngày đầy sức sống, như một kiệt tác Pop Art, bùng nổ năng lượng và sắc thái táo bạo.' },
        type: 'color',
        contrast: 'high',
        saturation: 'high',
        tags: ['vibrant', 'daylight', 'high-saturation', 'high-contrast', 'landscape', 'color', 'pop-art'],
        whiteBalance: '3100K, A8-G1', // Exaggerated
        settings: {
            'Black level': '-9', // Keep as is
            'Gamma': 'Still',
            'Black Gamma': 'Middle -6',
            'Knee': 'Auto',
            'Color Mode': 'Still',
            'Saturation': '+31',
            'Color Phase': '+1'
        },
        colorDepth: { 'R': '+2', 'G': '+5', 'B': '-4', 'C': '+2', 'M': '+4', 'Y': '+3' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ef5350',
        coords: { x: 4.5, y: 9.0 } // Adjusted
    },
    {
        id: 'scl-13-velvet-portrait',
        name: 'SCL-13: Velvet Portrait',
        description: { en: 'Soft tones with low saturation, suitable for portraits and fashion, creating a gentle and luxurious velvet feel, emphasizing delicate beauty.', vi: 'Tông màu mềm mại với độ bão hòa thấp, phù hợp cho chân dung và thời trang, tạo cảm giác nhẹ nhàng và sang trọng như nhung, nhấn mạnh vẻ đẹp tinh tế.' },
        type: 'color',
        contrast: 'low',
        saturation: 'low',
        tags: ['soft', 'portrait', 'fashion', 'low-saturation', 'low-contrast', 'color', 'luxury'],
        whiteBalance: '4300K, A8-M0.5', // Exaggerated
        settings: {
            'Black level': '-5', // Lighter for portrait
            'Gamma': 'Movie',
            'Black Gamma': 'Middle -6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'Still',
            'Saturation': '+4',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '0', 'G': '0', 'B': '+1', 'C': '0', 'M': '-5', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#e0e0e0',
        coords: { x: -1.0, y: -4.0 } // Adjusted
    },
    {
        id: 'scl-14-urban-glow',
        name: 'SCL-14: Urban Glow',
        description: { en: 'A luxurious golden tone, suitable for romantic and cozy urban nightscapes, like the city\'s warm glow, capturing the essence of vibrant city nights.', vi: 'Tông màu vàng sang trọng, phù hợp cho những cảnh đêm đô thị lãng mạn và ấm cúng, như ánh sáng ấm áp của thành phố, nắm bắt bản chất của những đêm đô thị sôi động.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'medium',
        tags: ['warm', 'urban', 'night', 'romantic', 'medium-saturation', 'medium-contrast', 'color', 'cityscape'],
        whiteBalance: '5700K, A8-M1', // Exaggerated
        settings: {
            'Black level': '-1', // Darker for cinematic (urban/night)
            'Gamma': 'Still',
            'Black Gamma': 'Narrow -6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'S-Gamut3.Cine',
            'Saturation': '+17',
            'Color Phase': '+6'
        },
        colorDepth: { 'R': '+3', 'G': '0', 'B': '0', 'C': '+3', 'M': '+3', 'Y': '-3' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ffb74d',
        coords: { x: -1.5, y: 5.5 } // Adjusted
    },
    {
        id: 'scl-15-graphic-mono',
        name: 'SCL-15: Graphic Mono',
        description: { en: 'Black and white with extremely high contrast, creating a strong and impressive graphic effect, ideal for bold and impactful imagery.', vi: 'Đen trắng với độ tương phản cực cao, tạo hiệu ứng đồ họa mạnh mẽ và ấn tượng, lý tưởng cho những hình ảnh táo bạo và có sức ảnh hưởng.' },
        type: 'bw',
        contrast: 'high',
        saturation: 'high',
        tags: ['bw', 'high-contrast', 'graphic', 'street', 'architecture'],
        whiteBalance: '5600K', // Exaggerated
        settings: {
            'Black level': '-14', // Keep as is for BW
            'Gamma': 'Still',
            'Black Gamma': 'Wide -6',
            'Knee': 'Manual 75% +4',
            'Color Mode': 'Black&White',
            'Saturation': '+31',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '+2', 'G': '+5', 'B': '+5', 'C': '+5', 'M': '+5', 'Y': '+5' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#424242',
        coords: { x: 9.0, y: 9.0 } // Adjusted
    },
    {
        id: 'scl-16-summer-nostalgia',
        name: 'SCL-16: Summer Nostalgia',
        description: { en: 'Balanced, faithful colors, simulating clear and fresh summer films, full of nostalgia and a gentle, sun-drenched warmth.', vi: 'Màu sắc cân bằng, trung thực, mô phỏng những thước phim mùa hè trong trẻo và tươi mát, đầy hoài niệm và sự ấm áp dịu dàng của nắng.' },
        type: 'color',
        contrast: 'low',
        saturation: 'low',
        tags: ['film', 'summer', 'natural', 'low-saturation', 'low-contrast', 'color', 'nostalgic'],
        whiteBalance: '4200K, A8-M0.5', // Exaggerated
        settings: {
            'Black level': '+1', // Keep as is
            'Gamma': 'Still',
            'Black Gamma': 'Wide -6',
            'Knee': 'Manual 75 +3',
            'Color Mode': 'Still',
            'Saturation': '+1',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '0', 'C': '+1', 'M': '0', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#aed581',
        coords: { x: -2.5, y: -1.5 } // Adjusted
    },
    {
        id: 'scl-17-timeless-elegance',
        name: 'SCL-17: Timeless Elegance',
        description: { en: 'Low saturation and soft contrast, ideal for portraits with a timeless quality, exuding elegance and a classic, refined beauty.', vi: 'Độ bão hòa thấp và tương phản mềm mại, lý tưởng cho những bức chân dung mang vẻ đẹp vượt thời gian, toát lên sự thanh lịch và vẻ đẹp cổ điển, tinh tế.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'low',
        tags: ['vintage', 'portrait', 'soft', 'low-saturation', 'medium-contrast', 'color', 'elegant'],
        whiteBalance: '4400K, A8-M1.5', // Exaggerated
        settings: {
            'Black level': '-7', // Lighter for portrait
            'Gamma': 'Movie',
            'Black Gamma': 'Middle -6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'Still',
            'Saturation': '+6',
            'Color Phase': '+2'
        },
        colorDepth: { 'R': '-1', 'G': '+5', 'B': '-1', 'C': '-1', 'M': '-3', 'Y': '+2' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#e57373',
        coords: { x: 2.5, y: -2.5 } // Adjusted
    },
    {
        id: 'scl-18-infrared-drama',
        name: 'SCL-18: Infrared Drama',
        description: { en: 'A black and white infrared effect, making foliage and skies dramatic, surreal, and full of impact, creating an otherworldly landscape.', vi: 'Hiệu ứng hồng ngoại đen trắng, làm cho cây cối và bầu trời trở nên kịch tính, siêu thực và đầy ấn tượng, tạo nên một phong cảnh siêu nhiên.' },
        type: 'bw',
        contrast: 'high',
        saturation: 'high',
        tags: ['bw', 'infrared', 'landscape', 'dramatic', 'high-contrast', 'surreal'],
        whiteBalance: 'AWB, A3', // Kept AWB
        settings: {
            'Black level': '-9', // Keep as is for BW
            'Gamma': 'Still',
            'Black Gamma': 'Wide -6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'Black & White',
            'Saturation': '+31',
            'Color Phase': '+3'
        },
        colorDepth: { 'R': '-5', 'G': '-5', 'B': '+5', 'C': '+5', 'M': '+5', 'Y': '-3' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#616161',
        coords: { x: 7.0, y: 7.0 } // Adjusted
    },
    {
        id: 'scl-19-retro-amber',
        name: 'SCL-19: Retro Amber',
        description: { en: 'Warm amber tones, reminiscent of prints from the 70s, full of nostalgia and retro style, perfect for a vintage aesthetic.', vi: 'Tông màu hổ phách ấm áp, gợi nhớ những bản in từ thập niên 70, đầy hoài niệm và phong cách retro, hoàn hảo cho một vẻ đẹp cổ điển.' },
        type: 'color',
        contrast: 'low',
        saturation: 'medium',
        tags: ['vintage', 'warm', 'nostalgic', '70s', 'low-contrast', 'medium-saturation', 'color', 'retro'],
        whiteBalance: '4500K, A8-M0.5', // Exaggerated
        settings: {
            'Black level': '+1', // Keep as is
            'Gamma': 'Movie',
            'Black Gamma': 'Middle +1',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'Still',
            'Saturation': '+2',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '0', 'C': '0', 'M': '+2', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-5', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 5',
            'Limit': '1', // Adjusted towards 0
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ffb74d',
        coords: { x: -6.0, y: 2.5 } // Adjusted
    },
    {
        id: 'scl-20-surreal-pop',
        name: 'SCL-20: Surreal Pop',
        description: { en: 'Extremely vibrant and saturated colors, creating a surreal and colorful world, pushing boundaries with artistic flair.', vi: 'Màu sắc cực kỳ sống động và bão hòa, tạo nên một thế giới siêu thực và đầy màu sắc, vượt qua mọi giới hạn với phong cách nghệ thuật.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'high',
        tags: ['vibrant', 'pop-art', 'surreal', 'high-saturation', 'medium-contrast', 'color', 'artistic'],
        whiteBalance: '3300K, A8-G0.5', // Exaggerated
        settings: {
            'Black level': '-1', // Keep as is
            'Gamma': 'Still',
            'Black Gamma': 'Middle -6',
            'Knee': 'Manual 75% +4',
            'Color Mode': 'ITU709Matrix',
            'Saturation': '+17',
            'Color Phase': '-2'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '+5', 'C': '+5', 'M': '+5', 'Y': '-2' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ef5350',
        coords: { x: 3.5, y: 8.5 } // Adjusted
    },
    {
        id: 'scl-21-arctic-chill',
        name: 'SCL-21: Arctic Chill',
        description: { en: 'A cool tone with blue and green hues and high contrast, providing a sharp, cold feel like arctic ice, perfect for stark landscapes.', vi: 'Tông màu lạnh với sắc xanh dương và xanh lá cây, độ tương phản cao, mang lại cảm giác sắc lạnh như băng Bắc Cực, hoàn hảo cho những phong cảnh khắc nghiệt.' },
        type: 'color',
        contrast: 'high',
        saturation: 'medium',
        tags: ['cool', 'blue', 'green', 'high-contrast', 'medium-saturation', 'landscape', 'color', 'cold'],
        whiteBalance: '4400K, A8-M2', // Exaggerated
        settings: {
            'Black level': '-9', // Darker for cinematic
            'Gamma': 'Cine1',
            'Black Gamma': 'Wide +6',
            'Knee': 'Auto',
            'Color Mode': 'S-Cinetone',
            'Saturation': '+19',
            'Color Phase': '-3'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '-3', 'C': '-3', 'M': '+1', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#29b6f6',
        coords: { x: 5.0, y: 1.5 } // Adjusted
    },
    {
        id: 'scl-22-golden-era-cinema',
        name: 'SCL-22: Golden Era Cinema',
        description: { en: 'A classic, balanced cinematic tone with a pleasant touch of golden warmth, reminiscent of the golden era of cinema, for timeless storytelling.', vi: 'Tông màu điện ảnh cổ điển, cân bằng, với chút ấm áp dễ chịu của nắng vàng, gợi nhớ kỷ nguyên vàng của điện ảnh, cho những câu chuyện vượt thời gian.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'medium',
        tags: ['cinematic', 'warm', 'vintage', 'balanced', 'medium-saturation', 'medium-contrast', 'color', 'classic'],
        whiteBalance: 'AWB White Priority, A3-G0.5', // Exaggerated
        settings: {
            'Black level': '-3', // Darker for cinematic
            'Gamma': 'Movie',
            'Black Gamma': 'Wide +6',
            'Knee': 'Auto',
            'Color Mode': 'Still',
            'Saturation': '+11',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '-1', 'G': '+5', 'B': '-3', 'C': '+3', 'M': '-3', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ffca28',
        coords: { x: 2.5, y: 2.0 } // Adjusted
    },
    {
        id: 'scl-23-crystal-clear-mono',
        name: 'SCL-23: Crystal Clear Mono',
        description: { en: 'Black and white with fine grain and sharp details, delivering crystal-high clarity, perfect for architectural and urban scenes.', vi: 'Đen trắng với hạt mịn và chi tiết sắc nét, mang lại độ trong trẻo cao như pha lê, hoàn hảo cho các cảnh kiến trúc và đô thị.' },
        type: 'bw',
        contrast: 'high',
        saturation: 'low',
        tags: ['bw', 'sharp', 'high-contrast', 'street', 'architecture', 'clear'],
        whiteBalance: 'AWB, B3-G0.25', // Kept AWB
        settings: {
            'Black level': '-11', // Keep as is for BW
            'Gamma': 'Still',
            'Black Gamma': 'Middle -6',
            'Knee': 'Manual 82% +4',
            'Color Mode': 'Black & White',
            'Saturation': '0',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '0', 'G': '-5', 'B': '+5', 'C': '+5', 'M': '+5', 'Y': '-2' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#757575',
        coords: { x: 4.5, y: -1.0 } // Adjusted
    },
    {
        id: 'scl-24-studio-radiance',
        name: 'SCL-24: Studio Radiance',
        description: { en: 'Accurate colors and beautiful skin tones, suitable for professional portraits with warm tones, exuding radiance and natural beauty.', vi: 'Màu sắc chính xác và tông màu da đẹp, phù hợp cho chân dung chuyên nghiệp với tông ấm, toát lên vẻ rạng rỡ và vẻ đẹp tự nhiên.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'high',
        tags: ['portrait', 'warm', 'skin-tone', 'professional', 'high-saturation', 'medium-contrast', 'color', 'studio'],
        whiteBalance: '4200K, A8-G1.5', // Exaggerated
        settings: {
            'Black level': '+7', // Lighter for portrait
            'Gamma': 'S-Cinetone/Cine4',
            'Black Gamma': 'Narrow -6',
            'Knee': 'Auto',
            'Color Mode': 'Still',
            'Saturation': '+29',
            'Color Phase': '-1'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '+1', 'C': '+3', 'M': '+1', 'Y': '-1' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ff8a65',
        coords: { x: 3.5, y: 8.5 } // Adjusted
    },
    {
        id: 'scl-25-mystic-garden',
        name: 'SCL-25: Mystic Garden',
        description: { en: 'A unique tone with green and magenta hues, creating a fantastical and mysterious feel as if in a fairytale garden, full of hidden wonders.', vi: 'Tông màu độc đáo với sắc xanh lá cây và tím, tạo cảm giác kỳ ảo và bí ẩn như trong một khu vườn cổ tích, đầy những điều kỳ diệu tiềm ẩn.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'medium',
        tags: ['artistic', 'green', 'magenta', 'mystical', 'medium-saturation', 'medium-contrast', 'color', 'fantasy'],
        whiteBalance: '7200K, B1.5-M1.5', // Exaggerated
        settings: {
            'Black level': '+6', // Keep as is
            'Gamma': 'Still',
            'Black Gamma': 'Middle +6',
            'Knee': 'Manual 80% +3',
            'Color Mode': 'S-Gamut3.Cine',
            'Saturation': '+9',
            'Color Phase': '+6'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '+3', 'C': '+3', 'M': '+3', 'Y': '-1' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ba68c8',
        coords: { x: 0.5, y: 3.0 } // Adjusted
    },
    {
        id: 'scl-26-city-lights-warmth',
        name: 'SCL-26: City Lights Warmth',
        description: { en: 'Simulates motion picture film, with characteristic warm yellow tones for night scenes, like the glowing embrace of city lights after dark.', vi: 'Mô phỏng phim điện ảnh, với tông màu vàng ấm đặc trưng cho cảnh đêm, như ánh sáng ấm áp của đèn thành phố sau khi trời tối.' },
        type: 'color',
        contrast: 'high',
        saturation: 'high',
        tags: ['cinematic', 'night', 'warm', 'yellow', 'high-saturation', 'high-contrast', 'color', 'urban'],
        whiteBalance: '4900K, A8-G1.5', // Exaggerated
        settings: {
            'Black level': '-16', // Darker for cinematic
            'Gamma': 'S-log2 or S-log3',
            'Black Gamma': 'Middle -6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'ITU709Matrix',
            'Saturation': '+31',
            'Color Phase': '+4'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '-5', 'C': '-5', 'M': '+3', 'Y': '+1' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#827717',
        coords: { x: 6.0, y: 8.0 } // Adjusted
    },
    {
        id: 'scl-27-pop-art-energy',
        name: 'SCL-27: Pop Art Energy',
        description: { en: 'Vibrant, slightly bluish colors, creating a dynamic and prominent feel like Pop Art, bursting with energy and bold visual impact.', vi: 'Màu sắc sống động, hơi ngả xanh, tạo cảm giác năng động và nổi bật như tranh Pop Art, bùng nổ năng lượng và tác động thị giác mạnh mẽ.' },
        type: 'color',
        contrast: 'high',
        saturation: 'high',
        tags: ['vibrant', 'pop-art', 'cool', 'high-saturation', 'high-contrast', 'color', 'dynamic'],
        whiteBalance: '3200K, A8-M2', // Exaggerated
        settings: {
            'Black level': '-5', // Keep as is
            'Gamma': 'Still',
            'Black Gamma': 'Wide +6',
            'Knee': 'Auto',
            'Color Mode': 'Still',
            'Saturation': '+31',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '+1', 'G': '+5', 'B': '0', 'C': '+5', 'M': '-3', 'Y': '-2' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ef5350',
        coords: { x: 6.5, y: 9.0 } // Adjusted
    },
    {
        id: 'scl-28-soft-serenity',
        name: 'SCL-28: Soft Serenity',
        description: { en: 'A realistic, slightly blueish tone, suitable for many photography genres that require subtlety, bringing a sense of peaceful serenity and calm.', vi: 'Tông màu chân thực, hơi ngả xanh, phù hợp cho nhiều thể loại nhiếp ảnh cần sự tinh tế, mang lại cảm giác thanh bình và yên tĩnh.' },
        type: 'color',
        contrast: 'low',
        saturation: 'medium',
        tags: ['natural', 'cool', 'subtle', 'low-contrast', 'medium-saturation', 'color', 'peaceful'],
        whiteBalance: '3700K, A8-M1', // Exaggerated
        settings: {
            'Black level': '+3', // Keep as is
            'Gamma': 'Movie',
            'Black Gamma': 'Narrow -6',
            'Knee': 'Manual 80% +3',
            'Color Mode': 'Still',
            'Saturation': '+13',
            'Color Phase': '-1'
        },
        colorDepth: { 'R': '-1', 'G': '+3', 'B': '-1', 'C': '-1', 'M': '-3', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#a1887f',
        coords: { x: -1.5, y: 4.5 } // Adjusted
    },
    {
        id: 'scl-29-vintage-film-warmth',
        name: 'SCL-29: Vintage Film Warmth',
        description: { en: 'Another version of the warm tone with more subdued colors, with a strong classic cinematic quality, evoking a nostalgic film look.', vi: 'Một phiên bản khác của tông màu ấm với màu sắc dịu hơn, mang đậm chất điện ảnh cổ điển, gợi lên vẻ đẹp hoài niệm của phim ảnh.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'high',
        tags: ['film', 'warm', 'cinematic', 'high-saturation', 'medium-contrast', 'color', 'vintage'],
        whiteBalance: '4600K, A8-G1.5', // Exaggerated
        settings: {
            'Black level': '-2', // Darker for cinematic
            'Gamma': 'Cine1',
            'Black Gamma': 'Middle +6',
            'Knee': 'Manual 75% +4',
            'Color Mode': 'Still',
            'Saturation': '+24',
            'Color Phase': '+2'
        },
        colorDepth: { 'R': '+1', 'G': '+5', 'B': '0', 'C': '0', 'M': '+3', 'Y': '+1' }, // Adjusted
        detailSettings: {
            'Level': '-5', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 5',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ffb74d',
        coords: { x: 3.0, y: 6.5 } // Adjusted
    },
    {
        id: 'scl-30-orthochromatic-blue',
        name: 'SCL-30: Orthochromatic Blue',
        description: { en: 'Black and white simulating Orthochromatic film, sensitive to blue and green, creating a unique and artistic effect with a distinctive blue cast.', vi: 'Đen trắng mô phỏng phim Orthochromatic, nhạy cảm với màu xanh dương và xanh lá cây, tạo hiệu ứng độc đáo và nghệ thuật với tông xanh đặc trưng.' },
        type: 'bw',
        contrast: 'high',
        saturation: 'medium',
        tags: ['bw', 'artistic', 'cool', 'high-contrast', 'orthochromatic', 'film'],
        whiteBalance: 'AWB, A3-M2.75', // Kept AWB
        settings: {
            'Black level': '-11', // Keep as is for BW
            'Gamma': 'Movie',
            'Black Gamma': 'Narrow -6',
            'Knee': '105% +4',
            'Color Mode': 'Still',
            'Saturation': '+14',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '+5', 'G': '+5', 'B': '-5', 'C': '-5', 'M': '+5', 'Y': '+5' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#616161',
        coords: { x: 6.0, y: 2.5 } // Adjusted
    },
    {
        id: 'scl-31-festive-radiance',
        name: 'SCL-31: Festive Radiance',
        description: { en: 'A warm, vibrant tone that brings a festive and joyful atmosphere, full of life and radiance, perfect for celebratory moments.', vi: 'Tông màu ấm áp, sống động, mang lại không khí lễ hội vui tươi, tràn đầy sức sống và rạng rỡ, hoàn hảo cho những khoảnh khắc kỷ niệm.' },
        type: 'color',
        contrast: 'high',
        saturation: 'medium',
        tags: ['warm', 'vibrant', 'happy', 'high-contrast', 'medium-saturation', 'color', 'holiday'],
        whiteBalance: 'AWB, A6-G0.5', // Exaggerated
        settings: {
            'Black level': '-6', // Keep as is
            'Gamma': 'Cine3',
            'Black Gamma': 'Narrow -6',
            'Knee': '105% +4',
            'Color Mode': 'Still',
            'Saturation': '+12',
            'Color Phase': '+3'
        },
        colorDepth: { 'R': '+1', 'G': '+5', 'B': '-2', 'C': '-3', 'M': '+2', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ef5350',
        coords: { x: 7.0, y: 1.0 } // Adjusted
    },
    {
        id: 'scl-32-regal-tones',
        name: 'SCL-32: Regal Tones',
        description: { en: 'Vibrant colors with prominent red and blue tones, creating a luxurious and noble feel, like royal hues, for a sophisticated look.', vi: 'Màu sắc sống động với tông đỏ và xanh dương nổi bật, tạo cảm giác sang trọng và quý phái, như những sắc màu hoàng gia, cho một vẻ ngoài tinh tế.' },
        type: 'color',
        contrast: 'high',
        saturation: 'high',
        tags: ['vibrant', 'rich', 'red', 'blue', 'high-saturation', 'high-contrast', 'color', 'luxury', 'jewel'],
        whiteBalance: '7200K, B2.5-M1.5', // Exaggerated
        settings: {
            'Black level': '-11', // Darker for cinematic
            'Gamma': 'Movie',
            'Black Gamma': 'Wide +6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'Movie',
            'Saturation': '+24',
            'Color Phase': '+1'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '+5', 'C': '+5', 'M': '+5', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#d81b60',
        coords: { x: 8.5, y: 5.0 } // Adjusted
    },
    {
        id: 'scl-33-cinematic-monochrome',
        name: 'SCL-33: Cinematic Monochrome',
        description: { en: 'A variation of Eterna with richer and more saturated colors, creating a striking black and white effect with a cinematic feel and deep tones.', vi: 'Một biến thể của Eterna với màu sắc đậm và bão hòa hơn, tạo hiệu ứng đen trắng ấn tượng với cảm giác điện ảnh và tông màu sâu.' },
        type: 'bw',
        contrast: 'high',
        saturation: 'high',
        tags: ['bw', 'cinematic', 'high-contrast', 'high-saturation', 'film'],
        whiteBalance: '4100K, A7.5-M1.5', // Exaggerated
        settings: {
            'Black level': '-4', // Keep as is for BW
            'Gamma': 'Cine4',
            'Black Gamma': 'Wide -4',
            'Knee': 'Manual 87.5% +2',
            'Color Mode': 'S-Gamut3',
            'Saturation': '+31',
            'Color Phase': '+5'
        },
        colorDepth: { 'R': '-1', 'G': '0', 'B': '+1', 'C': '+5', 'M': '-1', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#e57373',
        coords: { x: 8.0, y: 5.5 } // Adjusted
    },
    {
        id: 'scl-34-forest-whisper-mono',
        name: 'SCL-34: Forest Whisper Mono',
        description: { en: 'Black and white with a green tint, creating a unique and artistic effect, like the whisper of a forest, full of subtle mystery.', vi: 'Đen trắng với tông xanh lá cây, tạo hiệu ứng độc đáo và nghệ thuật, như tiếng thì thầm của rừng, đầy bí ẩn tinh tế.' },
        type: 'bw',
        contrast: 'high',
        saturation: 'low',
        tags: ['bw', 'green', 'tinted-mono', 'artistic', 'high-contrast', 'nature'],
        whiteBalance: 'AWB', // Kept AWB
        settings: {
            'Black level': '-14', // Keep as is for BW
            'Gamma': 'Still',
            'Black Gamma': 'Wide -6',
            'Knee': 'Manual 85% +4',
            'Color Mode': 'Black & White',
            'Saturation': '+14',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '0', 'G': '-2', 'B': '0', 'C': '0', 'M': '0', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#a5d6a7',
        coords: { x: 6.5, y: -0.5 } // Adjusted
    },
    {
        id: 'scl-35-tropical-punch',
        name: 'SCL-35: Tropical Punch',
        description: { en: 'A high-contrast color recipe with warm, vibrant, and punchy tones, like a tropical punch, bursting with energetic and lively hues.', vi: 'Một công thức màu tương phản cao với tông ấm, sống động và mạnh mẽ, như một cú đấm nhiệt đới, bùng nổ với các sắc thái tràn đầy năng lượng và sôi nổi.' },
        type: 'color',
        contrast: 'high',
        saturation: 'high',
        tags: ['vibrant', 'punchy', 'warm', 'high-contrast', 'high-saturation', 'color', 'energetic'],
        whiteBalance: '4200K, A5.5-M1', // Exaggerated
        settings: {
            'Black level': '-14', // Keep as is
            'Gamma': 'Still',
            'Black Gamma': 'Wide -6',
            'Knee': 'Manual 92.5% +4',
            'Color Mode': 'S-Gamut3.Cine',
            'Saturation': '+26',
            'Color Phase': '+5'
        },
        colorDepth: { 'R': '+3', 'G': '+5', 'B': '+3', 'C': '+3', 'M': '0', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#d32f2f',
        coords: { x: 6.5, y: 8.0 } // Adjusted
    },
    {
        id: 'scl-36-glacial-daylight',
        name: 'SCL-36: Glacial Daylight',
        description: { en: 'A surreal, cool tone with high saturation, suitable for daylight scenes, like glacial daylight, creating a stark and ethereal atmosphere.', vi: 'Tông màu lạnh, siêu thực với độ bão hòa cao, phù hợp cho cảnh ban ngày, như ánh sáng băng giá, tạo ra một bầu không khí khắc nghiệt và thanh tao.' },
        type: 'color',
        contrast: 'high',
        saturation: 'medium',
        tags: ['cool', 'surreal', 'daylight', 'high-contrast', 'medium-saturation', 'color', 'cold'],
        whiteBalance: '8200K, B2.5-M2.5', // Exaggerated
        settings: {
            'Black level': '-14', // Keep as is
            'Gamma': 'Cine3',
            'Black Gamma': 'Wide +6',
            'Knee': 'Manual 85% +3',
            'Color Mode': 'S-Gamut3.Cine',
            'Saturation': '+19',
            'Color Phase': '+6'
        },
        colorDepth: { 'R': '-3', 'G': '0', 'B': '+1', 'C': '+2', 'M': '+3', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#4fc3f7',
        coords: { x: 6.0, y: 5.5 } // Adjusted
    },
    {
        id: 'scl-37-urban-chic',
        name: 'SCL-37: Urban Chic',
        description: { en: 'Vivid and highly saturated colors, providing a fresh and modern feel, with an urban chic style, perfect for contemporary cityscapes and fashion.', vi: 'Màu sắc sống động và bão hòa cao, mang lại cảm giác tươi mới và hiện đại, với phong cách đô thị sang trọng, hoàn hảo cho cảnh quan thành phố đương đại và thời trang.' },
        type: 'color',
        contrast: 'high',
        saturation: 'high',
        tags: ['modern', 'vibrant', 'high-saturation', 'high-contrast', 'color', 'urban', 'fashion'],
        whiteBalance: '4500K, A4', // Exaggerated
        settings: {
            'Black level': '-11', // Darker for cinematic
            'Gamma': 'Cine1',
            'Black Gamma': 'Middle +6',
            'Knee': 'Auto',
            'Color Mode': 'S-Gamut3.Cine',
            'Saturation': '+31',
            'Color Phase': '+4'
        },
        colorDepth: { 'R': '-1', 'G': '+2', 'B': '+1', 'C': '+1', 'M': '0', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#4caf50',
        coords: { x: 4.5, y: 7.0 } // Adjusted
    },
    {
        id: 'scl-38-golden-age-remastered',
        name: 'SCL-38: Golden Age Remastered',
        description: { en: 'A second version of the warm golden tone, with warmer and more saturated colors, like a remastered golden age, bringing classic beauty to modern eyes.', vi: 'Một phiên bản thứ hai của tông màu vàng ấm, với màu sắc ấm hơn và bão hòa hơn, như một kỷ nguyên vàng được tái bản, mang vẻ đẹp cổ điển đến với đôi mắt hiện đại.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'high',
        tags: ['vintage', 'warm', 'golden-hour', 'high-saturation', 'medium-contrast', 'color', 'remastered'],
        whiteBalance: '4800K, A8-G1.5', // Exaggerated
        settings: {
            'Black level': '+1', // Keep as is
            'Gamma': 'S-Cinetone',
            'Black Gamma': 'Narrow -6',
            'Knee': 'Auto',
            'Color Mode': 'S-Cinetone',
            'Saturation': '+24',
            'Color Phase': '+4'
        },
        colorDepth: { 'R': '+1', 'G': '-1', 'B': '-3', 'C': '-1', 'M': '+1', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ffb74d',
        coords: { x: 2.5, y: 6.0 } // Adjusted
    },
    {
        id: 'scl-39-porcelain-skin',
        name: 'SCL-39: Porcelain Skin',
        description: { en: 'Simulates portrait film, ideal for achieving beautiful and natural skin tones, smooth as porcelain, perfect for elegant and refined portraits.', vi: 'Mô phỏng phim chân dung, lý tưởng để đạt được tông màu da đẹp và tự nhiên, mịn màng như sứ, hoàn hảo cho những bức chân dung thanh lịch và tinh tế.' },
        type: 'color',
        contrast: 'high',
        saturation: 'medium',
        tags: ['portrait', 'warm', 'skin-tone', 'soft', 'everyday', 'medium-saturation', 'high-contrast', 'color', 'beauty'],
        whiteBalance: '4700K, A8-M1.5', // Exaggerated
        settings: {
            'Black level': '-12', // Lighter for portrait
            'Gamma': 'S-Log2/S-Log3',
            'Black Gamma': 'Middle -6',
            'Knee': 'Manual 75% +4',
            'Color Mode': 'Still',
            'Saturation': '+19',
            'Color Phase': '+2'
        },
        colorDepth: { 'R': '+1', 'G': '+3', 'B': '+3', 'C': '+5', 'M': '+5', 'Y': '-1' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ffccbc',
        coords: { x: 5.5, y: 3.5 } // Adjusted
    },
    {
        id: 'scl-40-true-tone',
        name: 'SCL-40: True Tone',
        description: { en: 'A realistic, slightly blueish tone, suitable for many photography genres, faithfully reproducing natural light with subtle and accurate colors.', vi: 'Tông màu chân thực, hơi ngả xanh, phù hợp cho nhiều thể loại nhiếp ảnh, tái tạo ánh sáng tự nhiên một cách trung thực với màu sắc tinh tế và chính xác.' },
        type: 'color',
        contrast: 'low',
        saturation: 'medium',
        tags: ['natural', 'cool', 'subtle', 'low-contrast', 'medium-saturation', 'color', 'realistic'],
        whiteBalance: '3700K, A8-M1', // Exaggerated
        settings: {
            'Black level': '+3', // Keep as is
            'Gamma': 'Movie',
            'Black Gamma': 'Narrow -6',
            'Knee': 'Manual 80% +3',
            'Color Mode': 'Still',
            'Saturation': '+13',
            'Color Phase': '-1'
        },
        colorDepth: { 'R': '-1', 'G': '+3', 'B': '-1', 'C': '-1', 'M': '-3', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#81c784',
        coords: { x: -1.5, y: 4.5 } // Adjusted
    },
    {
        id: 'scl-41-enchanted-warmth',
        name: 'SCL-41: Enchanted Warmth',
        description: { en: 'A unique, warm tone that brings a magical and distinct feeling to the photo, as if enchanted, perfect for whimsical and artistic scenes.', vi: 'Tông màu ấm áp độc đáo, mang lại cảm giác kỳ diệu và khác biệt cho bức ảnh, như thể được phù phép, hoàn hảo cho những cảnh quay huyền ảo và nghệ thuật.' },
        type: 'color',
        contrast: 'high',
        saturation: 'medium',
        tags: ['warm', 'artistic', 'high-contrast', 'medium-saturation', 'color', 'magical'],
        whiteBalance: '7200K, B4.5-M1.5', // Exaggerated
        settings: {
            'Black level': '-11', // Keep as is
            'Gamma': 'Movie',
            'Black Gamma': 'Middle -6',
            'Knee': 'Manual 75% +4',
            'Color Mode': 'Still',
            'Saturation': '+16',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '-2', 'G': '+5', 'B': '-1', 'C': '-1', 'M': '-3', 'Y': '+2' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ffb74d',
        coords: { x: 6.0, y: 0.5 } // Adjusted
    },
    {
        id: 'scl-42-portraesque-warmth',
        name: 'SCL-42: Portraesque Warmth',
        description: { en: 'Another version of Portra 400 with warmer and softer tones, ideal for portraits, creating beautiful and natural skin tones with a gentle touch.', vi: 'Một phiên bản khác của Portra 400 với tông màu ấm hơn và mềm mại hơn, lý tưởng cho chân dung, tạo ra tông màu da đẹp và tự nhiên với một cảm giác dịu dàng.' },
        type: 'color',
        contrast: 'low',
        saturation: 'medium',
        tags: ['portrait', 'warm', 'soft', 'film', 'low-contrast', 'medium-saturation', 'color', 'portra'],
        whiteBalance: '3800K, A8-G1.5', // Exaggerated
        settings: {
            'Black level': '+12', // Lighter for portrait
            'Gamma': 'Movie',
            'Black Gamma': 'Narrow -6',
            'Knee': 'Manual 85% +3',
            'Color Mode': 'Still',
            'Saturation': '+10',
            'Color Phase': '-3'
        },
        colorDepth: { 'R': '-1', 'G': '+5', 'B': '-1', 'C': '0', 'M': '+3', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-5', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 5',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ffcc80',
        coords: { x: -5.0, y: 5.0 } // Adjusted
    },
    {
        id: 'scl-43-dreamy-reverie',
        name: 'SCL-43: Dreamy Reverie',
        description: { en: 'A dreamy, soft tone with gentle colors, bringing a nostalgic and ethereal feeling, perfect for capturing moments of quiet contemplation.', vi: 'Tông màu mơ màng, mềm mại với màu sắc dịu nhẹ, mang lại cảm giác hoài niệm và thanh tao, hoàn hảo để ghi lại những khoảnh khắc tĩnh lặng.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'high',
        tags: ['dreamy', 'soft', 'nostalgic', 'high-saturation', 'medium-contrast', 'color', 'ethereal'],
        whiteBalance: '4700K, A8', // Exaggerated
        settings: {
            'Black level': '-4', // Keep as is
            'Gamma': 'Cine1 or Cine4',
            'Black Gamma': 'Middle -6',
            'Knee': 'Auto',
            'Color Mode': 'Still',
            'Saturation': '+24',
            'Color Phase': '+2'
        },
        colorDepth: { 'R': '0', 'G': '+3', 'B': '0', 'C': '+1', 'M': '+1', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ef9a9a',
        coords: { x: 3.5, y: 4.5 } // Adjusted
    },
    {
        id: 'scl-44-azure-dawn',
        name: 'SCL-44: Azure Dawn',
        description: { en: 'Clear, slightly bluish colors, simulating crisp daylight, like an azure dawn, perfect for refreshing and vibrant outdoor scenes.', vi: 'Màu sắc trong trẻo, hơi ngả xanh, mô phỏng ánh sáng ban ngày trong trẻo, như bình minh xanh ngắt, hoàn hảo cho những cảnh ngoài trời tươi mới và sống động.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'medium',
        tags: ['daylight', 'cool', 'crisp', 'medium-saturation', 'medium-contrast', 'color', 'landscape'],
        whiteBalance: '3400K, A8-M1.5', // Exaggerated
        settings: {
            'Black level': '-3', // Keep as is
            'Gamma': 'Movie',
            'Black Gamma': 'Middle -6',
            'Knee': 'Manual 80% +3',
            'Color Mode': 'Still',
            'Saturation': '+9',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '+1', 'G': '+3', 'B': '-2', 'C': '0', 'M': '+4', 'Y': '+3' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#4dd0e1',
        coords: { x: 1.0, y: 4.0 } // Adjusted
    },
    {
        id: 'scl-45-gentle-embrace',
        name: 'SCL-45: Gentle Embrace',
        description: { en: 'Warm tones with moderate saturation, suitable for everyday photography and portraits, providing a gentle embrace of light and color.', vi: 'Tông màu ấm áp với độ bão hòa vừa phải, phù hợp cho nhiếp ảnh hàng ngày và chân dung, mang lại cảm giác ôm ấp dịu dàng của ánh sáng và màu sắc.' },
        type: 'color',
        contrast: 'low',
        saturation: 'medium',
        tags: ['warm', 'subtle', 'everyday', 'portrait', 'low-contrast', 'medium-saturation', 'color', 'soft'],
        whiteBalance: '4700K, A8-M1', // Exaggerated
        settings: {
            'Black level': '+3', // Lighter for portrait, also everyday
            'Gamma': 'Movie',
            'Black Gamma': 'Wide -6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'Still',
            'Saturation': '+7',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '-2', 'G': '+5', 'B': '-1', 'C': '-3', 'M': '+3', 'Y': '+2' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ffab91',
        coords: { x: -3.0, y: 2.0 } // Adjusted
    },
    {
        id: 'scl-46-neo-noir-green',
        name: 'SCL-46: Neo-Noir Green',
        description: { en: 'A cinematic tone, low saturation and soft contrast with a green hue, reminiscent of Neo-Noir aesthetics, for mysterious and atmospheric scenes.', vi: 'Tông màu điện ảnh, độ bão hòa thấp và tương phản mềm mại với sắc xanh lá cây, gợi nhớ tính thẩm mỹ của Neo-Noir, cho những cảnh quay bí ẩn và đầy không khí.' },
        type: 'color',
        contrast: 'low',
        saturation: 'low',
        tags: ['cinematic', 'green', 'soft', 'low-saturation', 'low-contrast', 'color', 'noir'],
        whiteBalance: '3800K, A8-M0.5', // Exaggerated
        settings: {
            'Black level': '+4', // Darker for cinematic
            'Gamma': 'Movie',
            'Black Gamma': 'Wide -4',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'Still',
            'Saturation': '-4',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '-1', 'G': '+5', 'B': '0', 'C': '+4', 'M': '+2', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ad494a',
        coords: { x: -6.5, y: -5.0 } // Adjusted
    },
    {
        id: 'scl-47-golden-era-revival',
        name: 'SCL-47: Golden Era Revival',
        description: { en: 'Classic, warm colors, reminiscent of photos from the golden age of photography, like a revival, bringing a timeless and rich aesthetic.', vi: 'Màu sắc cổ điển, ấm áp, gợi nhớ những bức ảnh từ kỷ nguyên vàng của nhiếp ảnh, như một sự hồi sinh, mang lại vẻ đẹp vượt thời gian và phong phú.' },
        type: 'color',
        contrast: 'low',
        saturation: 'medium',
        tags: ['vintage', 'warm', 'golden-hour', 'low-contrast', 'medium-saturation', 'color', 'classic'],
        whiteBalance: '4400K, A8-M1', // Exaggerated
        settings: {
            'Black level': '+7', // Keep as is
            'Gamma': 'Still',
            'Black Gamma': 'Middle -6',
            'Knee': 'Auto',
            'Color Mode': 'Still',
            'Saturation': '+11',
            'Color Phase': '-1'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '+2', 'C': '+2', 'M': '+3', 'Y': '+1' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ffd54f',
        coords: { x: -2.0, y: 3.5 } // Adjusted
    },
    {
        id: 'scl-48-aurora-borealis',
        name: 'SCL-48: Aurora Borealis',
        description: { en: 'A crisp, cool tone with prominent blue hues, perfect for capturing the pristine moments of early morning, like the aurora borealis, ethereal and striking.', vi: 'Tông màu lạnh, trong trẻo với sắc xanh nổi bật, hoàn hảo để nắm bắt những khoảnh khắc tinh khôi của buổi sớm, như cực quang, thanh tao và ấn tượng.' },
        type: 'color',
        contrast: 'high',
        saturation: 'medium',
        tags: ['cool', 'blue', 'crisp', 'high-contrast', 'medium-saturation', 'color', 'surreal'],
        whiteBalance: '8200K, B2.5-M2.5', // Exaggerated
        settings: {
            'Black level': '-14', // Keep as is
            'Gamma': 'Cine3',
            'Black Gamma': 'Wide +6',
            'Knee': 'Manual 85% +3',
            'Color Mode': 'S-Gamut3.Cine',
            'Saturation': '+19',
            'Color Phase': '+6'
        },
        colorDepth: { 'R': '-3', 'G': '0', 'B': '+1', 'C': '+2', 'M': '+3', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#4fc3f7',
        coords: { x: 6.0, y: 5.5 } // Adjusted
    },
    {
        id: 'scl-49-sun-kissed-pop',
        name: 'SCL-49: Sun-Kissed Pop',
        description: { en: 'Vibrant colors with warm undertones, bringing a dynamic and lively summer feeling, like a sun-kissed pop, full of joyous energy.', vi: 'Màu sắc sống động với tông ấm, mang lại cảm giác năng động và tràn đầy sức sống của mùa hè, như một nụ hôn của nắng, đầy năng lượng vui tươi.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'high',
        tags: ['vibrant', 'warm', 'summer', 'high-saturation', 'medium-contrast', 'color', 'energetic'],
        whiteBalance: '4200K, A8-G1.5', // Exaggerated
        settings: {
            'Black level': '+1', // Keep as is
            'Gamma': 'Still',
            'Black Gamma': 'Middle +6',
            'Knee': 'Manual 75% +4',
            'Color Mode': 'S-Gamut3',
            'Saturation': '+31',
            'Color Phase': '+3'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '+5', 'C': '+5', 'M': '+5', 'Y': '+2' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ff8a65',
        coords: { x: 2.0, y: 7.5 } // Adjusted
    },
    {
        id: 'scl-50-timeless-monochrome',
        name: 'SCL-50: Timeless Monochrome',
        description: { en: 'Soft-contrast black and white, providing a classic, gentle, and deep feel, timeless in its appeal, perfect for emotive storytelling.', vi: 'Đen trắng tương phản mềm mại, mang lại cảm giác cổ điển, nhẹ nhàng và sâu lắng, vượt thời gian trong sức hấp dẫn, hoàn hảo cho những câu chuyện đầy cảm xúc.' },
        type: 'bw',
        contrast: 'low',
        saturation: 'low',
        tags: ['bw', 'soft', 'vintage', 'low-contrast', 'low-saturation', 'classic'],
        whiteBalance: 'AWB', // Kept AWB
        settings: {
            'Black level': '-7', // Keep as is for BW
            'Gamma': 'Cine3',
            'Black Gamma': 'Narrow -6',
            'Knee': 'Manual 75% +2',
            'Color Mode': 'Black & White',
            'Saturation': '0',
            'Color Phase': '-1'
        },
        colorDepth: { 'R': '-2', 'G': '+1', 'B': '+5', 'C': '0', 'M': '+5', 'Y': '-3' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#9e9e9e',
        coords: { x: -6.5, y: -2.5 } // Adjusted
    },
    {
        id: 'scl-51-kodachrome-legacy',
        name: 'SCL-51: Kodachrome Legacy',
        description: { en: 'A version of Kodachrome with higher contrast and rich, warm colors, inheriting the Kodachrome legacy for vibrant and authentic imagery.', vi: 'Một phiên bản của Kodachrome với độ tương phản cao hơn và màu sắc phong phú, ấm áp, kế thừa di sản Kodachrome cho hình ảnh sống động và chân thực.' },
        type: 'color',
        contrast: 'high',
        saturation: 'medium',
        tags: ['film', 'warm', 'rich', 'high-contrast', 'medium-saturation', 'color', 'kodachrome'],
        whiteBalance: '4700K, A8-M1', // Exaggerated
        settings: {
            'Black level': '-11', // Darker for cinematic
            'Gamma': 'Cine1',
            'Black Gamma': 'Middle +6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'Still',
            'Saturation': '+16',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '0', 'G': '+4', 'B': '0', 'C': '+5', 'M': '+5', 'Y': '+1' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#a1887f',
        coords: { x: 5.5, y: 6.5 } // Adjusted
    },
    {
        id: 'scl-52-retro-cool',
        name: 'SCL-52: Retro Cool',
        description: { en: 'Simulates the characteristic colors of vintage cameras, with cool and sharp tones, embodying a retro style that is both nostalgic and edgy.', vi: 'Mô phỏng màu sắc đặc trưng của máy ảnh cổ điển, với tông màu lạnh và sắc nét, thể hiện phong cách retro vừa hoài niệm vừa cá tính.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'low',
        tags: ['cool', 'vintage', 'sharp', 'low-saturation', 'medium-contrast', 'color', 'retro'],
        whiteBalance: '7200K, B5.5-M0.5', // Exaggerated
        settings: {
            'Black level': '-8', // Keep as is
            'Gamma': 'Still',
            'Black Gamma': 'Middle +6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'Still',
            'Saturation': '+5',
            'Color Phase': '+1'
        },
        colorDepth: { 'R': '+1', 'G': '+5', 'B': '+1', 'C': '-3', 'M': '+1', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#78909c',
        coords: { x: 3.5, y: -3.5 } // Adjusted
    },
    {
        id: 'scl-53-kodachrome-daylight',
        name: 'SCL-53: Kodachrome Daylight',
        description: { en: 'A balanced Kodachrome version with pleasant, realistic colors for daylight, capturing the authentic vibrancy of a sunny day.', vi: 'Một phiên bản Kodachrome cân bằng với màu sắc dễ chịu, chân thực cho ánh sáng ban ngày, nắm bắt sự sống động đích thực của một ngày nắng.' },
        type: 'color',
        contrast: 'low',
        saturation: 'medium',
        tags: ['film', 'warm', 'daylight', 'natural', 'low-contrast', 'medium-saturation', 'color', 'kodachrome'],
        whiteBalance: '4200K, A8-M2.5', // Exaggerated
        settings: {
            'Black level': '+5', // Keep as is
            'Gamma': 'S-Cinetone',
            'Black Gamma': 'Narrow -6',
            'Knee': 'Auto',
            'Color Mode': 'S-Cinetone',
            'Saturation': '+13',
            'Color Phase': '-2'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '+3', 'C': '0', 'M': '+1', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ffcc80',
        coords: { x: -4.0, y: 6.0 } // Adjusted
    },
    {
        id: 'scl-54-oceanic-depths',
        name: 'SCL-54: Oceanic Depths',
        description: { en: 'Simulates color negative film, with cool blue tones and moderate contrast, like the depths of the ocean, for a profound and immersive feel.', vi: 'Mô phỏng phim âm bản màu, với tông xanh lạnh và độ tương phản vừa phải, như chiều sâu đại dương, mang lại cảm giác sâu sắc và đắm chìm.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'medium',
        tags: ['film', 'cool', 'blue', 'medium-saturation', 'medium-contrast', 'color', 'cinematic'],
        whiteBalance: '8400K, B5-G2', // Exaggerated
        settings: {
            'Black level': '-11', // Darker for cinematic
            'Gamma': 'S-Cinetone',
            'Black Gamma': 'Narrow -6',
            'Knee': 'Auto',
            'Color Mode': 'S-Cinetone',
            'Saturation': '+15',
            'Color Phase': '+1'
        },
        colorDepth: { 'R': '+3', 'G': '+5', 'B': '-4', 'C': '-3', 'M': '+5', 'Y': '-2' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#64b5f6',
        coords: { x: 2.5, y: 2.0 } // Adjusted
    },
    {
        id: 'scl-55-luminous-monochrome',
        name: 'SCL-55: Luminous Monochrome',
        description: { en: 'A version of Tri-X with softer, flatter contrast, creating a high-key effect, bringing a luminous feel perfect for bright and airy compositions.', vi: 'Một phiên bản của Tri-X với độ tương phản mềm mại, phẳng hơn, tạo hiệu ứng high-key, mang lại cảm giác sáng bừng, hoàn hảo cho những bố cục tươi sáng và thoáng đãng.' },
        type: 'bw',
        contrast: 'low',
        saturation: 'high',
        tags: ['bw', 'high-key', 'soft', 'low-contrast', 'high-saturation', 'bright'],
        whiteBalance: '5600K, A3.5-G2.5', // Exaggerated
        settings: {
            'Black level': '+2', // Keep as is for BW
            'Gamma': 'Cine1',
            'Black Gamma': 'Narrow +4',
            'Knee': 'Manual 75% +2',
            'Color Mode': 'Black & White',
            'Saturation': '+23',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '+1', 'G': '+1', 'B': '+1', 'C': '0', 'M': '+1', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#eeeeee',
        coords: { x: -7.5, y: 8.0 } // Adjusted
    },
    {
        id: 'scl-56-romantic-blush',
        name: 'SCL-56: Romantic Blush',
        description: { en: 'A gentle, romantic rose tone that creates a dreamy and sweet feeling, like a soft blush, ideal for tender and intimate portraits.', vi: 'Tông màu hồng nhẹ nhàng, lãng mạn, tạo cảm giác mơ màng và ngọt ngào, như một cái chạm hồng dịu dàng, lý tưởng cho những bức chân dung mềm mại và thân mật.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'high',
        tags: ['romantic', 'dreamy', 'warm', 'high-saturation', 'medium-contrast', 'color', 'pink'],
        whiteBalance: '4800K, A8-M1', // Exaggerated
        settings: {
            'Black level': '+5', // Keep as is
            'Gamma': 'Still',
            'Black Gamma': 'Wide -6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'Pro',
            'Saturation': '+24',
            'Color Phase': '+1'
        },
        colorDepth: { 'R': '0', 'G': '0', 'B': '0', 'C': '-1', 'M': '+3', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#f06292',
        coords: { x: 2.5, y: 5.5 } // Adjusted
    },
    {
        id: 'scl-57-americana-dream',
        name: 'SCL-57: Americana Dream',
        description: { en: 'A modern cinematic tone with teal in the shadows and orange in the highlights, evoking the American dream, for a bold and iconic look.', vi: 'Tông màu điện ảnh hiện đại với sắc xanh ở vùng tối và cam ở vùng sáng, gợi lên giấc mơ Mỹ, cho một vẻ ngoài táo bạo và mang tính biểu tượng.' },
        type: 'color',
        contrast: 'high',
        saturation: 'high',
        tags: ['cinematic', 'teal-orange', 'modern', 'high-saturation', 'high-contrast', 'color', 'americana'],
        whiteBalance: '4500K, A8-G1', // Exaggerated
        settings: {
            'Black level': '-16', // Darker for cinematic
            'Gamma': 'Cine1',
            'Black Gamma': 'Wide -6',
            'Knee': 'Manual 82.5% +3',
            'Color Mode': 'S-Cinetone/Still',
            'Saturation': '+9',
            'Color Phase': '+1'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '-5', 'C': '-4', 'M': '+1', 'Y': '+1' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ff8a65',
        coords: { x: 7.0, y: 4.5 } // Adjusted
    },
    {
        id: 'scl-58-full-spectrum-mono',
        name: 'SCL-58: Full Spectrum Mono',
        description: { en: 'A black and white recipe with a wide tonal range and good detail in both highlights and shadows, like seeing the full spectrum, for rich and detailed monochrome.', vi: 'Một công thức đen trắng với dải tông màu rộng và chi tiết tốt ở cả vùng sáng và tối, như nhìn thấy toàn bộ quang phổ, cho hình ảnh đơn sắc phong phú và chi tiết.' },
        type: 'bw',
        contrast: 'medium',
        saturation: 'high',
        tags: ['bw', 'wide-range', 'detailed', 'medium-contrast', 'versatile'],
        whiteBalance: '6200K, B3-M2', // Exaggerated
        settings: {
            'Black level': '+1', // Keep as is for BW
            'Gamma': 'Cine1-4',
            'Black Gamma': 'Middle -6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'Black & White',
            'Saturation': '+31',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '-2', 'G': '+3', 'B': '+2', 'C': '0', 'M': '-3', 'Y': '-1' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#9e9e9e',
        coords: { x: 2.5, y: 3.5 } // Adjusted
    },
    {
        id: 'scl-59-organic-hues',
        name: 'SCL-59: Organic Hues',
        description: { en: 'A realistic, slightly blueish tone, suitable for many photography genres that require subtlety, with organic hues that feel natural and authentic.', vi: 'Tông màu chân thực, hơi ngả xanh, phù hợp cho nhiều thể loại nhiếp ảnh cần sự tinh tế, với sắc thái hữu cơ mang lại cảm giác tự nhiên và chân thực.' },
        type: 'color',
        contrast: 'low',
        saturation: 'medium',
        tags: ['natural', 'cool', 'subtle', 'low-contrast', 'medium-saturation', 'color', 'earthy'],
        whiteBalance: '3700K, A8-M1', // Exaggerated
        settings: {
            'Black level': '+3', // Keep as is
            'Gamma': 'Movie',
            'Black Gamma': 'Narrow -6',
            'Knee': 'Manual 80% +3',
            'Color Mode': 'Still',
            'Saturation': '+13',
            'Color Phase': '-1'
        },
        colorDepth: { 'R': '-1', 'G': '+3', 'B': '-1', 'C': '-1', 'M': '-3', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#a1887f',
        coords: { x: -1.5, y: 4.5 } // Adjusted
    },
    {
        id: 'scl-60-ruby-glow',
        name: 'SCL-60: Ruby Glow',
        description: { en: 'Simulates slide film with vibrant and clear colors, emphasizing red tones, like the glowing intensity of a ruby, for rich and striking visuals.', vi: 'Mô phỏng phim slide với màu sắc sống động và trong trẻo, nhấn mạnh tông đỏ, như ánh sáng rực rỡ của viên hồng ngọc, cho hình ảnh phong phú và ấn tượng.' },
        type: 'color',
        contrast: 'high',
        saturation: 'high',
        tags: ['film', 'vibrant', 'red', 'high-saturation', 'high-contrast', 'color', 'luxurious'],
        whiteBalance: '3300K, A8-G2', // Exaggerated
        settings: {
            'Black level': '-2', // Darker for cinematic
            'Gamma': 'Still',
            'Black Gamma': 'Middle -6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'S-Gamut3.Cine',
            'Saturation': '+31',
            'Color Phase': '+1'
        },
        colorDepth: { 'R': '+2', 'G': '0', 'B': '+5', 'C': '0', 'M': '+5', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#e53935',
        coords: { x: 5.5, y: 9.0 } // Adjusted
    },
    {
        id: 'scl-61-silk-skin-tone',
        name: 'SCL-61: Silk Skin Tone',
        description: { en: 'Simulates portrait film, ideal for achieving beautiful and natural skin tones, smooth as silk, perfect for elegant and flattering portraits.', vi: 'Mô phỏng phim chân dung, lý tưởng để đạt được tông màu da đẹp và tự nhiên, mịn màng như lụa, hoàn hảo cho những bức chân dung thanh lịch và nịnh mắt.' },
        type: 'color',
        contrast: 'high',
        saturation: 'medium',
        tags: ['portrait', 'skin-tone', 'soft', 'medium-saturation', 'high-contrast', 'color', 'beauty'],
        whiteBalance: '4700K, A8-M1.5', // Exaggerated
        settings: {
            'Black level': '-12', // Lighter for portrait
            'Gamma': 'S-Log2/S-Log3',
            'Black Gamma': 'Middle -6',
            'Knee': 'Manual 75% +4',
            'Color Mode': 'Still',
            'Saturation': '+19',
            'Color Phase': '+2'
        },
        colorDepth: { 'R': '+1', 'G': '+3', 'B': '+3', 'C': '+5', 'M': '+5', 'Y': '-1' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ffccbc',
        coords: { x: 5.5, y: 3.5 } // Adjusted
    },
    {
        id: 'scl-62-emerald-vintage',
        name: 'SCL-62: Emerald Vintage',
        description: { en: 'A unique yellow-green tone, creating a classic and unusual feel, like an old film with an emerald tint, for a distinct retro look.', vi: 'Tông màu vàng xanh độc đáo, tạo cảm giác cổ điển và lạ mắt, như một thước phim cũ với tông ngọc lục bảo, cho một vẻ ngoài retro đặc biệt.' },
        type: 'color',
        contrast: 'high',
        saturation: 'high',
        tags: ['vintage', 'green', 'warm', 'high-saturation', 'high-contrast', 'color', 'unique'],
        whiteBalance: '8200K, A8-G6', // Exaggerated
        settings: {
            'Black level': '-11', // Keep as is
            'Gamma': 'Cine4',
            'Black Gamma': 'Middle -6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'S-Gamut3',
            'Saturation': '+31',
            'Color Phase': '+6'
        },
        colorDepth: { 'R': '+2', 'G': '+3', 'B': '0', 'C': '0', 'M': '-1', 'Y': '+5' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#cddc39',
        coords: { x: 7.0, y: 8.5 } // Adjusted
    },
    {
        id: 'scl-63-urban-grit',
        name: 'SCL-63: Urban Grit',
        description: { en: 'High-contrast black and white with prominent grain, simulating pushed film for added drama, with an urban grit aesthetic perfect for street photography.', vi: 'Đen trắng tương phản cao với hạt rõ nét, mô phỏng phim được đẩy sáng để tăng kịch tính, với vẻ đẹp bụi bặm đô thị hoàn hảo cho nhiếp ảnh đường phố.' },
        type: 'bw',
        contrast: 'high',
        saturation: 'high',
        tags: ['bw', 'high-contrast', 'grainy', 'dramatic', 'street', 'urban'],
        whiteBalance: '5600K, A3.5-G2.5', // Exaggerated
        settings: {
            'Black level': '+4', // Keep as is for BW
            'Gamma': 'Still',
            'Black Gamma': 'Wide -6',
            'Knee': 'Manual 77.5% +1',
            'Color Mode': 'Black & White',
            'Saturation': '+23',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '-2', 'G': '0', 'B': '+4', 'C': '+3', 'M': '-1', 'Y': '-1' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#616161',
        coords: { x: 8.0, y: 5.5 } // Adjusted
    },
    {
        id: 'scl-64-summer-solstice',
        name: 'SCL-64: Summer Solstice',
        description: { en: 'A dominant yellow tone, creating a sunny, nostalgic, and energetic feel, like the summer solstice, full of radiant warmth and light.', vi: 'Tông màu vàng chủ đạo, tạo cảm giác nắng ấm, hoài niệm và tràn đầy năng lượng, như ngày hạ chí, đầy ánh sáng và sự ấm áp rạng rỡ.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'high',
        tags: ['warm', 'yellow', 'vibrant', 'nostalgic', 'high-saturation', 'medium-contrast', 'color', 'summer'],
        whiteBalance: '4400K, A8-G0.5', // Exaggerated
        settings: {
            'Black level': '+3', // Keep as is
            'Gamma': 'Still',
            'Black Gamma': 'Wide +6',
            'Knee': 'Manual 75% +4',
            'Color Mode': 'Still',
            'Saturation': '+19',
            'Color Phase': '-3'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '0', 'C': '-1', 'M': '-2', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ffee58',
        coords: { x: 2.0, y: 8.0 } // Adjusted
    },
    {
        id: 'scl-65-gaf-500-legacy',
        name: 'SCL-65: GAF 500 Legacy',
        description: { en: 'Simulates GAF 500 film with vintage colors and a unique, warm tone, inheriting the GAF legacy for a distinct and classic film look.', vi: 'Mô phỏng phim GAF 500 với màu sắc cổ điển và tông màu ấm áp độc đáo, kế thừa di sản GAF cho một vẻ ngoài phim ảnh đặc trưng và cổ điển.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'medium',
        tags: ['vintage', 'film', 'warm', 'medium-saturation', 'medium-contrast', 'color', 'classic'],
        whiteBalance: '5500K, A8-M1', // Exaggerated
        settings: {
            'Black level': '+2', // Keep as is
            'Gamma': 'Still',
            'Black Gamma': 'Wide +6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'Still',
            'Saturation': '+9',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '+1', 'G': '+3', 'B': '-1', 'C': '-1', 'M': '-1', 'Y': '+1' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#d4e157',
        coords: { x: -1.0, y: 6.5 } // Adjusted
    },
    {
        id: 'scl-66-tungsten-noir',
        name: 'SCL-66: Tungsten Noir',
        description: { en: 'Simulates film balanced for Tungsten light, ideal for night photography, with a mysterious noir aesthetic, capturing deep shadows and subtle highlights.', vi: 'Mô phỏng phim cân bằng cho ánh sáng Tungsten, lý tưởng cho nhiếp ảnh đêm, với vẻ đẹp huyền bí của phim noir, nắm bắt bóng tối sâu và điểm sáng tinh tế.' },
        type: 'color',
        contrast: 'low',
        saturation: 'low',
        tags: ['film', 'night', 'tungsten', 'cool', 'low-saturation', 'low-contrast', 'color', 'noir'],
        whiteBalance: '2500K, A8-M1.5', // Exaggerated
        settings: {
            'Black level': '0', // Darker for cinematic
            'Gamma': 'Movie',
            'Black Gamma': 'Wide +6',
            'Knee': 'Auto',
            'Color Mode': 'Still',
            'Saturation': '+1',
            'Color Phase': '+4'
        },
        colorDepth: { 'R': '-3', 'G': '-5', 'B': '-5', 'C': '+1', 'M': '-5', 'Y': '-3' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ce93d8',
        coords: { x: -7.5, y: -6.5 } // Adjusted
    },
    {
        id: 'scl-67-cine-daylight-pro',
        name: 'SCL-67: Cine Daylight Pro',
        description: { en: 'Simulates motion picture film balanced for daylight, with clear and vibrant colors, offering a professional cine look perfect for bright outdoor scenes.', vi: 'Mô phỏng phim điện ảnh cân bằng cho ánh sáng ban ngày, với màu sắc trong trẻo và sống động, mang lại vẻ ngoài điện ảnh chuyên nghiệp hoàn hảo cho các cảnh ngoài trời sáng sủa.' },
        type: 'color',
        contrast: 'low',
        saturation: 'high',
        tags: ['film', 'daylight', 'vibrant', 'high-saturation', 'low-contrast', 'color', 'cinematic', 'professional'],
        whiteBalance: '3500K, A8-G1.5', // Exaggerated
        settings: {
            'Black level': '+6', // Darker for cinematic
            'Gamma': 'S-Cinetone',
            'Black Gamma': 'Narrow -6',
            'Knee': 'Auto',
            'Color Mode': 'S-Cinetone',
            'Saturation': '+31',
            'Color Phase': '+2'
        },
        colorDepth: { 'R': '0', 'G': '+1', 'B': '0', 'C': '0', 'M': '-1', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#81d4fa',
        coords: { x: -8.5, y: 7.5 } // Adjusted
    },
    {
        id: 'scl-68-redscale-aura',
        name: 'SCL-68: Redscale Aura',
        description: { en: 'A Redscale effect, where the entire image is cast in a dramatic and unique red-orange hue, like a redscale aura, for an artistic and experimental look.', vi: 'Hiệu ứng Redscale, toàn bộ hình ảnh được phủ một tông màu đỏ cam ấn tượng và độc đáo, như một vầng hào quang đỏ, cho một vẻ ngoài nghệ thuật và thử nghiệm.' },
        type: 'color',
        contrast: 'low',
        saturation: 'low',
        tags: ['artistic', 'red', 'warm', 'low-saturation', 'low-contrast', 'color', 'unique'],
        whiteBalance: '>9900K, B4-G2.5', // Exaggerated
        settings: {
            'Black level': '+4', // Keep as is
            'Gamma': 'Still',
            'Black Gamma': 'Middle -6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'ITU709Matrix',
            'Saturation': '+6',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '+3', 'G': '+5', 'B': '+3', 'C': '+3', 'M': '-5', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#e53935',
        coords: { x: -8.5, y: -8.5 } // Adjusted
    },
    {
        id: 'scl-69-bold-monochrome',
        name: 'SCL-69: Bold Monochrome',
        description: { en: 'High-contrast black and white, suitable for works that require strength and impact, with a bold aesthetic perfect for powerful and dramatic compositions.', vi: 'Đen trắng tương phản cao, phù hợp cho những tác phẩm đòi hỏi sức mạnh và tác động, với vẻ đẹp táo bạo hoàn hảo cho những bố cục mạnh mẽ và kịch tính.' },
        type: 'bw',
        contrast: 'high',
        saturation: 'high',
        tags: ['bw', 'graphic', 'high-contrast', 'high-saturation', 'impactful'],
        whiteBalance: '5600K', // Exaggerated
        settings: {
            'Black level': '-14', // Keep as is for BW
            'Gamma': 'S-Cinetone',
            'Black Gamma': 'Narrow -6',
            'Knee': 'Manual 75+1',
            'Color Mode': 'Black&White',
            'Saturation': '+27',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '-1', 'G': '+2', 'B': '+1', 'C': '+1', 'M': '+1', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#616161',
        coords: { x: 9.0, y: 6.0 } // Adjusted
    },
    {
        id: 'scl-70-autumnal-glow',
        name: 'SCL-70: Autumnal Glow',
        description: { en: 'A unique, warm tone that brings a magical and distinct feeling to the photo, like the glow of autumn, for rich and inviting imagery.', vi: 'Tông màu ấm áp độc đáo, mang lại cảm giác kỳ diệu và khác biệt cho bức ảnh, như ánh sáng rực rỡ của mùa thu, cho hình ảnh phong phú và lôi cuốn.' },
        type: 'color',
        contrast: 'high',
        saturation: 'medium',
        tags: ['warm', 'artistic', 'high-contrast', 'medium-saturation', 'color', 'autumn'],
        whiteBalance: '7200K, B4.5-M1.5', // Exaggerated
        settings: {
            'Black level': '-11', // Keep as is
            'Gamma': 'Movie',
            'Black Gamma': 'Middle -6',
            'Knee': 'Manual 75% +4',
            'Color Mode': 'Still',
            'Saturation': '+16',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '-2', 'G': '+5', 'B': '-1', 'C': '-1', 'M': '-3', 'Y': '+2' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ffb74d',
        coords: { x: 6.0, y: 0.5 } // Adjusted
    },
    {
        id: 'scl-71-azure-horizon',
        name: 'SCL-71: Azure Horizon',
        description: { en: 'Cool and clear blue and green tones, ideal for landscapes, like an azure horizon, capturing the vastness and clarity of open skies.', vi: 'Tông màu xanh dương và xanh lá cây mát mẻ, trong trẻo, lý tưởng cho phong cảnh, như đường chân trời xanh ngắt, nắm bắt sự bao la và trong trẻo của bầu trời rộng mở.' },
        type: 'color',
        contrast: 'high',
        saturation: 'high',
        tags: ['cool', 'blue', 'green', 'landscape', 'high-saturation', 'high-contrast', 'color', 'sky'],
        whiteBalance: 'AWB, B2.5-G2.5', // Exaggerated
        settings: {
            'Black level': '-4', // Keep as is
            'Gamma': 'Cine4',
            'Black Gamma': 'Wide +6',
            'Knee': 'Auto',
            'Color Mode': 'Still',
            'Saturation': '+29',
            'Color Phase': '+1'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '+5', 'C': '-3', 'M': '-1', 'Y': '-2' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#29b6f6',
        coords: { x: 7.5, y: 7.5 } // Adjusted
    },
    {
        id: 'scl-72-classic-street-mono',
        name: 'SCL-72: Classic Street Mono',
        description: { en: 'Simulates classic black and white film, a great choice for street photography, with a soft feel that emphasizes texture and subtle details.', vi: 'Mô phỏng phim đen trắng cổ điển, một lựa chọn tuyệt vời cho nhiếp ảnh đường phố, với cảm giác mềm mại nhấn mạnh kết cấu và các chi tiết tinh tế.' },
        type: 'bw',
        contrast: 'low',
        saturation: 'low',
        tags: ['bw', 'soft', 'vintage', 'street', 'low-contrast', 'classic'],
        whiteBalance: 'AWB, A3', // Kept AWB
        settings: {
            'Black level': '-11', // Keep as is for BW
            'Gamma': 'Movie',
            'Black Gamma': 'Middle -4',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'Black & White',
            'Saturation': '0',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '0', 'G': '+1', 'B': '0', 'C': '0', 'M': '+1', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#bdbdbd',
        coords: { x: -5.5, y: -5.5 } // Adjusted
    },
    {
        id: 'scl-73-sepia-dream',
        name: 'SCL-73: Sepia Dream',
        description: { en: 'A second version of the warm golden tone, with warmer and more saturated colors, evoking a sepia dream, for a timeless and artistic feel.', vi: 'Một phiên bản thứ hai của tông màu vàng ấm, với màu sắc ấm hơn và bão hòa hơn, gợi lên giấc mơ màu nâu đỏ, cho một cảm giác vượt thời gian và nghệ thuật.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'high',
        tags: ['vintage', 'warm', 'high-saturation', 'medium-contrast', 'color', 'sepia'],
        whiteBalance: '4800K, A8-G1.5', // Exaggerated
        settings: {
            'Black level': '+1', // Keep as is
            'Gamma': 'S-Cinetone',
            'Black Gamma': 'Narrow -6',
            'Knee': 'Auto',
            'Color Mode': 'S-Cinetone',
            'Saturation': '+24',
            'Color Phase': '+4'
        },
        colorDepth: { 'R': '+1', 'G': '-1', 'B': '-3', 'C': '-1', 'M': '+1', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ffb74d',
        coords: { x: 2.5, y: 6.0 } // Adjusted
    },
    {
        id: 'scl-74-hollywood-epic',
        name: 'SCL-74: Hollywood Epic',
        description: { en: 'A cinematic tone with wide dynamic range and filmic colors, like a Hollywood epic film, for grand and dramatic visual storytelling.', vi: 'Tông màu điện ảnh với dải nhạy sáng rộng và màu sắc đậm chất phim, như một bộ phim bom tấn Hollywood, cho cách kể chuyện bằng hình ảnh hoành tráng và kịch tính.' },
        type: 'color',
        contrast: 'high',
        saturation: 'high',
        tags: ['cinematic', 'film', 'high-saturation', 'high-contrast', 'color', 'epic'],
        whiteBalance: '3700K, A8', // Exaggerated
        settings: {
            'Black level': '-16', // Darker for cinematic
            'Gamma': 'HLG3',
            'Black Gamma': 'Wide 0',
            'Knee': 'Auto',
            'Color Mode': 'BT.2020',
            'Saturation': '+31',
            'Color Phase': '+6'
        },
        colorDepth: { 'R': '-2', 'G': '0', 'B': '+3', 'C': '+2', 'M': '+3', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#64b5f6',
        coords: { x: 9.0, y: 3.5 } // Adjusted
    },
    {
        id: 'scl-75-golden-hour-portrait',
        name: 'SCL-75: Golden Hour Portrait',
        description: { en: 'Accurate colors and beautiful skin tones, suitable for professional portraits with warm tones, as if shot during golden hour, for a soft and flattering glow.', vi: 'Màu sắc chính xác và tông màu da đẹp, phù hợp cho chân dung chuyên nghiệp với tông ấm, như thể được chụp vào giờ vàng, cho một ánh sáng mềm mại và nịnh mắt.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'high',
        tags: ['portrait', 'warm', 'skin-tone', 'professional', 'high-saturation', 'medium-contrast', 'color', 'golden-hour'],
        whiteBalance: '4200K, A8-G1.5', // Exaggerated
        settings: {
            'Black level': '+7', // Lighter for portrait
            'Gamma': 'S-Cinetone/Cine4',
            'Black Gamma': 'Narrow -6',
            'Knee': 'Auto',
            'Color Mode': 'Still',
            'Saturation': '+29',
            'Color Phase': '-1'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '+1', 'C': '+3', 'M': '+1', 'Y': '-1' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ff8a65',
        coords: { x: 3.5, y: 8.5 } // Adjusted
    },
    {
        id: 'scl-76-enchanted-forest',
        name: 'SCL-76: Enchanted Forest',
        description: { en: 'A unique tone with green and magenta hues, creating a fantastical and mysterious feel as if in an enchanted forest, for whimsical and dreamy compositions.', vi: 'Tông màu độc đáo với sắc xanh lá cây và tím, tạo cảm giác kỳ ảo và bí ẩn như trong một khu rừng phù thủy, cho những bố cục huyền ảo và mơ màng.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'medium',
        tags: ['artistic', 'green', 'magenta', 'mystical', 'medium-saturation', 'medium-contrast', 'color', 'fantasy'],
        whiteBalance: '7200K, B1.5-M1.5', // Exaggerated
        settings: {
            'Black level': '+6', // Keep as is
            'Gamma': 'Still',
            'Black Gamma': 'Middle +6',
            'Knee': 'Manual 80% +3',
            'Color Mode': 'S-Gamut3.Cine',
            'Saturation': '+9',
            'Color Phase': '+6'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '+3', 'C': '+3', 'M': '+3', 'Y': '-1' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ba68c8',
        coords: { x: 0.5, y: 3.0 } // Adjusted
    },
    {
        id: 'scl-77-urban-nocturne',
        name: 'SCL-77: Urban Nocturne',
        description: { en: 'Simulates motion picture film, with characteristic warm yellow tones for night scenes, like an urban nocturne, capturing the quiet beauty of the city after dark.', vi: 'Mô phỏng phim điện ảnh, với tông màu vàng ấm đặc trưng cho cảnh đêm, như một bản nhạc đêm đô thị, nắm bắt vẻ đẹp tĩnh lặng của thành phố sau khi trời tối.' },
        type: 'color',
        contrast: 'high',
        saturation: 'high',
        tags: ['cinematic', 'night', 'warm', 'yellow', 'high-saturation', 'high-contrast', 'color', 'urban'],
        whiteBalance: '4900K, A8-G1.5', // Exaggerated
        settings: {
            'Black level': '-16', // Darker for cinematic
            'Gamma': 'S-log2 or S-log3',
            'Black Gamma': 'Middle -6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'ITU709Matrix',
            'Saturation': '+31',
            'Color Phase': '+4'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '-5', 'C': '-5', 'M': '+3', 'Y': '+1' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#827717',
        coords: { x: 6.0, y: 8.0 } // Adjusted
    },
    {
        id: 'scl-78-neon-city-pop',
        name: 'SCL-78: Neon City Pop',
        description: { en: 'Vibrant, slightly bluish colors, creating a dynamic and prominent feel like Pop Art, with a neon city vibe, perfect for energetic and modern street photography.', vi: 'Màu sắc sống động, hơi ngả xanh, tạo cảm giác năng động và nổi bật như tranh Pop Art, với không khí thành phố neon, hoàn hảo cho nhiếp ảnh đường phố hiện đại và tràn đầy năng lượng.' },
        type: 'color',
        contrast: 'high',
        saturation: 'high',
        tags: ['vibrant', 'pop-art', 'cool', 'high-saturation', 'high-contrast', 'color', 'neon', 'urban'],
        whiteBalance: '3200K, A8-M2', // Exaggerated
        settings: {
            'Black level': '-5', // Keep as is
            'Gamma': 'Still',
            'Black Gamma': 'Wide +6',
            'Knee': 'Auto',
            'Color Mode': 'Still',
            'Saturation': '+31',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '+1', 'G': '+5', 'B': '0', 'C': '+5', 'M': '-3', 'Y': '-2' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ef5350',
        coords: { x: 6.5, y: 9.0 } // Adjusted
    },
    {
        id: 'scl-79-delicate-tones',
        name: 'SCL-79: Delicate Tones',
        description: { en: 'A realistic, slightly blueish tone, suitable for many photography genres that require subtlety, with delicate hues that convey a refined and understated beauty.', vi: 'Tông màu chân thực, hơi ngả xanh, phù hợp cho nhiều thể loại nhiếp ảnh cần sự tinh tế, với sắc thái dịu nhẹ truyền tải vẻ đẹp tinh tế và kín đáo.' },
        type: 'color',
        contrast: 'low',
        saturation: 'medium',
        tags: ['natural', 'cool', 'subtle', 'low-contrast', 'medium-saturation', 'color', 'refined'],
        whiteBalance: '3700K, A8-M1', // Exaggerated
        settings: {
            'Black level': '+3', // Keep as is
            'Gamma': 'Movie',
            'Black Gamma': 'Narrow -6',
            'Knee': 'Manual 80% +3',
            'Color Mode': 'Still',
            'Saturation': '+13',
            'Color Phase': '-1'
        },
        colorDepth: { 'R': '-1', 'G': '+3', 'B': '-1', 'C': '-1', 'M': '-3', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#a1887f',
        coords: { x: -1.5, y: 4.5 } // Adjusted
    },
    {
        id: 'scl-80-retro-cine-warm',
        name: 'SCL-80: Retro Cine Warm',
        description: { en: 'Another version of the warm tone with more subdued colors, with a strong classic cinematic quality and a retro style, perfect for vintage film looks.', vi: 'Một phiên bản khác của tông màu ấm với màu sắc dịu hơn, mang đậm chất điện ảnh cổ điển và phong cách retro, hoàn hảo cho vẻ ngoài phim ảnh cổ điển.' },
        type: 'color',
        contrast: 'medium',
        saturation: 'high',
        tags: ['film', 'warm', 'cinematic', 'high-saturation', 'medium-contrast', 'color', 'retro'],
        whiteBalance: '4600K, A8-G1.5', // Exaggerated
        settings: {
            'Black level': '-2', // Darker for cinematic
            'Gamma': 'Cine1',
            'Black Gamma': 'Middle +6',
            'Knee': 'Manual 75% +4',
            'Color Mode': 'Still',
            'Saturation': '+24',
            'Color Phase': '+2'
        },
        colorDepth: { 'R': '+1', 'G': '+5', 'B': '0', 'C': '0', 'M': '+3', 'Y': '+1' }, // Adjusted
        detailSettings: {
            'Level': '-5', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 5',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ffb74d',
        coords: { x: 3.0, y: 6.5 } // Adjusted
    },
    {
        id: 'scl-81-cyanotype-dream',
        name: 'SCL-81: Cyanotype Dream',
        description: { en: 'Black and white simulating Orthochromatic film, sensitive to blue and green, creating a unique effect like a Cyanotype print, for an artistic and distinct monochrome.', vi: 'Đen trắng mô phỏng phim Orthochromatic, nhạy cảm với màu xanh dương và xanh lá cây, tạo hiệu ứng độc đáo như bản in Cyanotype, cho một hình ảnh đơn sắc nghệ thuật và khác biệt.' },
        type: 'bw',
        contrast: 'high',
        saturation: 'medium',
        tags: ['bw', 'artistic', 'cool', 'high-contrast', 'orthochromatic', 'cyanotype'],
        whiteBalance: 'AWB, A3-M2.75', // Kept AWB
        settings: {
            'Black level': '-11', // Keep as is for BW
            'Gamma': 'Movie',
            'Black Gamma': 'Narrow -6',
            'Knee': '105% +4',
            'Color Mode': 'Still',
            'Saturation': '+14',
            'Color Phase': '0'
        },
        colorDepth: { 'R': '+5', 'G': '+5', 'B': '-5', 'C': '-5', 'M': '+5', 'Y': '+5' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#616161',
        coords: { x: 6.0, y: 2.5 } // Adjusted
    },
    {
        id: 'scl-82-carnival-spirit',
        name: 'SCL-82: Carnival Spirit',
        description: { en: 'A warm, vibrant tone that brings a festive and joyful atmosphere, full of life like a carnival spirit, perfect for energetic and celebratory moments.', vi: 'Tông màu ấm áp, sống động, mang lại không khí lễ hội vui tươi, tràn đầy sức sống như tinh thần lễ hội, hoàn hảo cho những khoảnh khắc tràn đầy năng lượng và kỷ niệm.' },
        type: 'color',
        contrast: 'high',
        saturation: 'medium',
        tags: ['warm', 'vibrant', 'happy', 'high-contrast', 'medium-saturation', 'color', 'holiday'],
        whiteBalance: 'AWB, A6-G0.5', // Exaggerated
        settings: {
            'Black level': '-6', // Keep as is
            'Gamma': 'Cine3',
            'Black Gamma': 'Narrow -6',
            'Knee': '105% +4',
            'Color Mode': 'Still',
            'Saturation': '+12',
            'Color Phase': '+3'
        },
        colorDepth: { 'R': '+1', 'G': '+5', 'B': '-2', 'C': '-3', 'M': '+2', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#ef5350',
        coords: { x: 7.0, y: 1.0 } // Adjusted
    },
    {
        id: 'scl-83-jewel-tone-luxe',
        name: 'SCL-83: Jewel Tone Luxe',
        description: { en: 'Vibrant colors with prominent red and blue tones, creating a luxurious and noble feel, like precious jewel tones, for a sophisticated and rich aesthetic.', vi: 'Màu sắc sống động với tông đỏ và xanh dương nổi bật, tạo cảm giác sang trọng và quý phái, như những sắc màu đá quý, cho một vẻ đẹp tinh tế và phong phú.' },
        type: 'color',
        contrast: 'high',
        saturation: 'high',
        tags: ['vibrant', 'rich', 'red', 'blue', 'high-saturation', 'high-contrast', 'color', 'luxury', 'jewel'],
        whiteBalance: '7200K, B2.5-M1.5', // Exaggerated
        settings: {
            'Black level': '-11', // Darker for cinematic
            'Gamma': 'Movie',
            'Black Gamma': 'Wide +6',
            'Knee': 'Manual 75% +3',
            'Color Mode': 'Movie',
            'Saturation': '+24',
            'Color Phase': '+1'
        },
        colorDepth: { 'R': '0', 'G': '+5', 'B': '+5', 'C': '+5', 'M': '+5', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#d81b60',
        coords: { x: 8.5, y: 5.0 } // Adjusted
    },
    {
        id: 'scl-84-dramatic-noir',
        name: 'SCL-84: Dramatic Noir',
        description: { en: 'A variation of Eterna with richer and more saturated colors, creating a striking black and white effect, dramatic like film noir, for intense and moody compositions.', vi: 'Một biến thể của Eterna với màu sắc đậm và bão hòa hơn, tạo hiệu ứng đen trắng ấn tượng, kịch tính như phim noir, cho những bố cục mạnh mẽ và đầy tâm trạng.' },
        type: 'bw',
        contrast: 'high',
        saturation: 'high',
        tags: ['bw', 'cinematic', 'high-contrast', 'high-saturation', 'noir', 'dramatic'],
        whiteBalance: '4100K, A7.5-M1.5', // Exaggerated
        settings: {
            'Black level': '-4', // Keep as is for BW
            'Gamma': 'Cine4',
            'Black Gamma': 'Wide -4',
            'Knee': 'Manual 87.5% +2',
            'Color Mode': 'S-Gamut3',
            'Saturation': '+31',
            'Color Phase': '+5'
        },
        colorDepth: { 'R': '-1', 'G': '0', 'B': '+1', 'C': '+5', 'M': '-1', 'Y': '0' }, // Adjusted
        detailSettings: {
            'Level': '-3', // Softer
            'Mode': 'Manual',
            'V/H Balance': '+1',
            'B/W Balance': 'Type 3',
            'Limit': '7',
            'Crispening': '3', // Softer
            'Hi-Light Detail': '0' // Softer
        },
        personalityColor: '#e57373',
        coords: { x: 8.0, y: 5.5 } // Adjusted
    }
];

export default recipesData;

