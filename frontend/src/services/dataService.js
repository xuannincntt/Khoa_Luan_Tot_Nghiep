import axios from 'axios'; 

const API_BASE_URL = 'http://localhost:8000/api/'; 

// Lấy CSRF token từ cookie
const getCsrfToken = () => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken'));
    return cookie ? cookie.split('=')[1] : null;
};

// Hàm lấy token xác thực từ localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Authorization': `Token ${token}`, // Giả sử Django dùng Token Authentication
        'X-CSRFToken': getCsrfToken(),
        'Content-Type': 'application/json',
    };
};

// --- 1. LẤY DANH SÁCH KHOA/PHÒNG ---
export const getDepartments = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}departments/`, {
            headers: getAuthHeaders(),
        });
        // Giả sử API trả về mảng các đối tượng Khoa
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách Khoa:", error);
        return [];
    }
};

// --- 2. LẤY DANH SÁCH BÁC SĨ ---
export const getDoctors = async (departmentId = null) => {
    try {
        let url = `${API_BASE_URL}employees/`;
        // Lọc theo loại nhân viên là Bác sĩ (DOCTOR)
        // Trong thực tế, bạn nên có một endpoint API riêng cho bác sĩ để tối ưu
        let filter = '?employee_type__name=DOCTOR'; 
        
        if (departmentId) {
            filter += `&department=${departmentId}`;
        }
        
        const response = await axios.get(url + filter, {
            headers: getAuthHeaders(),
        });
        
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách Bác sĩ:", error);
        return [];
    }
};

// --- 3. TẠO LỊCH HẸN MỚI ---
export const createAppointment = async (appointmentData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}appointments/`, appointmentData, {
            headers: getAuthHeaders(),
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Lỗi tạo lịch hẹn:", error.response?.data || error.message);
        return { success: false, message: "Lỗi tạo lịch hẹn. Vui lòng kiểm tra dữ liệu." };
    }
};