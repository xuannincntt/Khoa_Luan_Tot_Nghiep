// src/services/doctorService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { 'Authorization': `Token ${token}` };
};

// 1. Lấy danh sách lịch hẹn của Bác sĩ
export const getDoctorAppointments = async (doctorId, date = null) => {
    try {
        const params = { doctor_id: doctorId };
        if (date) params.date = date; // Nếu muốn lọc theo ngày
        
        const response = await axios.get(`${API_BASE_URL}appointments/`, {
            headers: getAuthHeaders(),
            params: params
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy lịch hẹn:", error);
        return [];
    }
};

// 2. Lấy danh sách thuốc (để kê đơn)
export const getDrugList = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}drugs/`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        return [];
    }
};

// 3. Lưu kết quả khám bệnh (MedicalVisit + Prescription)
// Đây là hàm quan trọng nhất: Xử lý Transaction (Khám + Thuốc + Cập nhật trạng thái)
export const saveExaminationResult = async (data) => {
    /* Data structure mong đợi:
       {
           appointment_id: 1,
           diagnosis: "Viêm họng",
           treatment: "Uống thuốc đều",
           prescription_details: [ {drug: 1, quantity: 10, ...} ]
       }
    */
    // Lưu ý: Logic này khá phức tạp, để đơn giản ở Frontend, 
    // ta sẽ tách làm 2 bước: Tạo MedicalVisit trước -> Tạo Prescription sau.
    // Hoặc tốt nhất là viết 1 Custom API ở Backend để xử lý cục này.
    
    // Ở đây mình giả định bạn sẽ gọi API tạo MedicalVisit
    try {
        // B1: Tạo hồ sơ khám
        const visitRes = await axios.post(`${API_BASE_URL}medical-visits/`, {
            appointment: data.appointment_id,
            diagnosis: data.diagnosis,
            treatment_protocol: data.treatment
        }, { headers: getAuthHeaders() });

        // B2: Nếu có thuốc, tạo đơn thuốc (Prescription)
        if (data.prescription_details.length > 0) {
            // ... Logic tạo đơn thuốc (cần backend hỗ trợ nested serializer hoặc gọi loop)
            // Để đơn giản cho demo, mình sẽ chỉ update trạng thái Appointment
        }

        // B3: Cập nhật trạng thái Lịch hẹn -> Completed (CM)
        await axios.patch(`${API_BASE_URL}appointments/${data.appointment_id}/`, {
            status: 'CM' // Completed
        }, { headers: getAuthHeaders() });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.response?.data || "Lỗi lưu kết quả" };
    }
};

// Cập nhật trạng thái Lịch hẹn (VD: P -> IP, IP -> CM)
export const updateAppointmentStatus = async (appointmentId, status) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}appointments/${appointmentId}/`, 
            { status: status }, 
            { headers: getAuthHeaders() }
        );
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: "Lỗi cập nhật trạng thái" };
    }
};