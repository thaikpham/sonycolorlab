import { createClient } from '@supabase/supabase-js';

// Lấy thông tin từ biến môi trường
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Kiểm tra xem biến môi trường đã được cung cấp chưa
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing. Please check your .env file.');
}

// Khởi tạo và export client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
