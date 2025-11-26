// File Path: src/components/ui/SaveGuide.js
import { state } from '../../services/state.js';

export function createSaveGuideHTML() {
    const guideContent = {
        vi: `
            <p class="mb-4">Trên các máy ảnh Sony Alpha thế hệ mới (như α7 IV, α7R V, α1, ZV-E1), bạn có thể lưu được <strong>3 preset trên thân máy</strong> (vị trí 1, 2, 3 trên vòng xoay) và <strong>4 preset trên thẻ nhớ</strong> (M1, M2, M3, M4).</p>
            <ol class="space-y-4 list-decimal list-inside">
                <li>
                    <strong>Bước 1: Thiết lập máy ảnh theo công thức</strong>
                    <p class="pl-6 text-gray-600">Trước tiên, hãy cài đặt tất cả các thông số của công thức này vào máy ảnh của bạn, bao gồm Cân bằng trắng (WB) và tất cả các mục trong Picture Profile.</p>
                </li>
                <li>
                    <strong>Bước 2: Truy cập Menu để lưu cài đặt</strong>
                    <p class="pl-6 text-gray-600">Nhấn nút <strong>MENU</strong>, di chuyển đến tab <strong>Shooting (màu hồng)</strong> &rarr; <strong>Shooting Mode</strong> &rarr; <strong>Camera Set. Memory</strong>.</p>
                </li>
                <li>
                    <strong>Bước 3: Chọn vị trí lưu</strong>
                    <p class="pl-6 text-gray-600">Chọn một trong các vị trí bạn muốn lưu (ví dụ: số <strong>1</strong> hoặc <strong>M1</strong>) và nhấn nút Enter để xác nhận. Cài đặt của bạn đã được lưu!</p>
                </li>
                <li>
                    <strong>Bước 4: Gọi lại cài đặt đã lưu</strong>
                    <p class="pl-6 text-gray-600">Để sử dụng, chỉ cần xoay vòng xoay chế độ trên đỉnh máy đến đúng số <strong>1, 2, hoặc 3</strong>. Máy ảnh sẽ ngay lập tức áp dụng tất cả các thông số bạn đã lưu.</p>
                </li>
            </ol>
        `,
        en: `
            <p class="mb-4">On new generation Sony Alpha cameras (like α7 IV, α7R V, α1, ZV-E1), you can save <strong>3 presets on the camera body</strong> (positions 1, 2, 3 on the mode dial) and <strong>4 presets on the memory card</strong> (M1, M2, M3, M4).</p>
            <ol class="space-y-4 list-decimal list-inside">
                <li>
                    <strong>Step 1: Set Up Your Camera with the Recipe</strong>
                    <p class="pl-6 text-gray-600">First, input all the parameters from this recipe into your camera, including White Balance (WB) and all Picture Profile settings.</p>
                </li>
                <li>
                    <strong>Step 2: Access the Save Settings Menu</strong>
                    <p class="pl-6 text-gray-600">Press the <strong>MENU</strong> button, navigate to the <strong>Shooting tab (pink)</strong> &rarr; <strong>Shooting Mode</strong> &rarr; <strong>Camera Set. Memory</strong>.</p>
                </li>
                <li>
                    <strong>Step 3: Choose a Memory Slot</strong>
                    <p class="pl-6 text-gray-600">Select one of the memory slots you want to save to (e.g., <strong>1</strong> or <strong>M1</strong>) and press the Enter button to confirm. Your settings are now saved!</p>
                </li>
                <li>
                    <strong>Step 4: Recall the Saved Setting</strong>
                    <p class="pl-6 text-gray-600">To use the preset, simply turn the top mode dial to the corresponding number <strong>1, 2, or 3</strong>. The camera will instantly apply all your saved settings.</p>
                </li>
            </ol>
        `
    };

    return `
        <div class="mt-8 p-5 md:p-6 bg-gray-50 border border-gray-200/80 rounded-2xl">
            <div class="flex justify-between items-center cursor-pointer" id="toggleSaveGuideBtn">
                <div>
                    <h4 class="text-lg md:text-xl font-bold text-gray-800" data-translate-key="saveGuideTitle"></h4>
                    <p class="mt-1 text-gray-600 text-sm" data-translate-key="saveGuideSubtitle"></p>
                </div>
                <button class="btn bg-gray-200 text-gray-700 hover:bg-gray-300 py-2 px-4 text-sm pointer-events-none">
                    <span data-translate-key="showGuideBtn"></span>
                </button>
            </div>
            <div id="saveGuideContent" class="mt-4 text-sm md:text-base overflow-hidden max-h-0 transition-all duration-700 ease-in-out">
                ${guideContent[state.language]}
            </div>
        </div>
    `;
}
