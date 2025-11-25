import axios from 'axios'; // Cần cài đặt: npm install axios

const API_BASE_URL = 'http://localhost:8000/api/'; // Thay đổi nếu API của bạn ở địa chỉ khác

export const loginUser = async (citizenId, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}login/`, { // Giả sử có endpoint /api/login/
            citizen_id: citizenId,
            password: password, // Trong thực tế, bạn sẽ gửi password đã được hash/mã hóa
        });

        // Giả sử API trả về token và thông tin user
        return { success: true, token: response.data.token, user: response.data.user };

    } catch (error) {
        console.error('Lỗi API đăng nhập:', error.response?.data || error.message);
        return { success: false, message: error.response?.data?.detail || 'Lỗi đăng nhập.' };
    }
};

// Bạn có thể thêm các hàm khác như registerUser, logoutUser, checkAuthStatus
export const logoutUser = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    // Có thể gọi API để invalidate token ở backend nếu cần
};

export const getCurrentUser = () => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    // Trong thực tế, bạn có thể giải mã token hoặc gọi API để lấy thông tin user đầy đủ
    if (token && role) {
        return { isAuthenticated: true, role: role, token: token };
    }
    return { isAuthenticated: false, role: null, token: null };
};