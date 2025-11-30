import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/';

// --- HÀM PHỤ TRỢ: DỊCH LỖI TỪ SERVER SANG TIẾNG VIỆT ---
const handleApiError = (error, defaultMessage) => {
    console.error("Full API Error:", error.response); // Log để dev xem

    if (!error.response) return "Lỗi kết nối đến máy chủ.";
    if (error.response.status === 500) return "Lỗi hệ thống nội bộ (Server Error).";

    const data = error.response.data;

    // 1. Lỗi trùng lịch (unique_together)
    // Django thường trả về non_field_errors cho lỗi trùng lặp nhiều trường
    if (data.non_field_errors) {
        const errText = data.non_field_errors[0];
        if (errText.includes("unique set") || errText.includes("already exists")) {
            return "Bác sĩ này đã có lịch hẹn vào giờ bạn chọn. Vui lòng chọn giờ khác!";
        }
        return errText; // Trả về nguyên văn nếu lỗi lạ
    }

    // 2. Lỗi cụ thể từng trường dữ liệu
    if (data.appointment_datetime) {
        return `Lỗi thời gian: ${data.appointment_datetime[0]}`; 
    }
    if (data.doctor) {
        return "Vui lòng chọn bác sĩ hợp lệ.";
    }
    if (data.patient) {
        return "Thông tin bệnh nhân không hợp lệ.";
    }
    if (data.description) {
        return "Lỗi ghi chú: " + data.description[0];
    }

    // 3. Các lỗi khác
    if (data.detail) {
        return data.detail;
    }

    return defaultMessage;
};


// --- CÁC HÀM GỌI API ---

export const getDepartments = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}departments/`);
        return response.data;
    } catch (error) {
        return [];
    }
};

export const getDoctors = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}employees/`);
        // Lọc sơ bộ phía client nếu cần, tốt nhất là lọc từ API
        return response.data;
    } catch (error) {
        return [];
    }
};

export const createAppointment = async (appointmentData) => {
    const token = localStorage.getItem('token');
    
    try {
        const response = await axios.post(`${API_BASE_URL}appointments/`, appointmentData, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return { success: true, data: response.data };

    } catch (error) {
        // Gọi hàm dịch lỗi ở trên
        const userFriendlyMessage = handleApiError(error, "Đặt lịch thất bại. Vui lòng kiểm tra lại thông tin.");
        
        return { 
            success: false, 
            message: userFriendlyMessage 
        };
    }
};

export const getAvailableSlots = async (doctorId, dateStr) => {
    try {
        const response = await axios.get(`${API_BASE_URL}available-slots/`, {
            params: { doctor_id: doctorId, date: dateStr }
        });
        return response.data.available_slots || [];
    } catch (error) {
        console.error("Error fetching slots", error);
        return [];
    }
};