import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/';

// --- HÀM ĐĂNG KÝ (Register) ---
export const registerPatient = async (formData) => {
    // Chuyển đổi key từ camelCase (React) sang snake_case (Django Python)
    const payload = {
        citizen_id: formData.citizenId,
        password: formData.password,
        full_name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address
    };

    try {
        // Gọi vào endpoint chúng ta đã tạo: /api/patients/
        const response = await axios.post(`${API_BASE_URL}patients/`, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        return { success: true, message: 'Đăng ký thành công!' };
    } catch (error) {
        console.error("Register Error:", error.response);
        // Lấy thông báo lỗi chi tiết từ Backend trả về
        let msg = "Đăng ký thất bại.";
        if (error.response?.data) {
            const errData = error.response.data;
            // Kiểm tra các lỗi phổ biến
            if (errData.citizen_id) msg = `CCCD: ${errData.citizen_id[0]}`;
            else if (errData.phone) msg = `SĐT: ${errData.phone[0]}`;
            else if (errData.password) msg = `Mật khẩu: ${errData.password[0]}`;
        }
        return { success: false, message: msg };
    }
};

// --- HÀM ĐĂNG NHẬP (Login) ---
export const loginUser = async (citizenId, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}login/`, {
            citizen_id: citizenId,
            password: password
        });

        // Backend trả về: { success: true, token: "...", user: {...} }
        if (response.data.success) {
            return { 
                success: true, 
                token: response.data.token, 
                user: response.data.user 
            };
        }
        return { success: false, message: response.data.message || "Lỗi không xác định" };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Sai thông tin đăng nhập hoặc lỗi server.' 
        };
    }
};