import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDoctorAppointments } from '../../services/doctorService';

const QueueDisplay = () => {
    const [searchParams] = useSearchParams();
    const doctorId = searchParams.get('doctor_id');
    const doctorName = searchParams.get('name');
    
    const [waitingList, setWaitingList] = useState([]);
    const [currentPatient, setCurrentPatient] = useState(null);

    // Tự động tải lại dữ liệu sau mỗi 5 giây (Real-time giả lập)
    useEffect(() => {
        const fetchData = async () => {
            if (!doctorId) return;
            const data = await getDoctorAppointments(doctorId);
            
            // Lọc danh sách Chờ (P hoặc C)
            const waiting = data.filter(a => a.status === 'P' || a.status === 'C');
            setWaitingList(waiting);

            // Tìm người Đang khám (IP)
            const current = data.find(a => a.status === 'IP');
            setCurrentPatient(current);
        };

        fetchData(); // Gọi lần đầu
        const interval = setInterval(fetchData, 5000); // Gọi lại mỗi 5s
        return () => clearInterval(interval);
    }, [doctorId]);

    return (
        <div style={{ height: '100vh', background: '#e3f2fd', display: 'flex', flexDirection: 'column', padding: '20px', fontFamily: 'Arial' }}>
            {/* Header Màn hình */}
            <div style={{ background: '#0277bd', color: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0, fontSize: '40px' }}>PHÒNG KHÁM BÁC SĨ {doctorName?.toUpperCase()}</h1>
            </div>

            <div style={{ display: 'flex', flex: 1, gap: '20px' }}>
                {/* Cột Trái: ĐANG KHÁM (Nổi bật nhất) */}
                <div style={{ flex: 1, background: 'white', borderRadius: '15px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '5px solid #2e7d32', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '30px', color: '#555', margin: 0 }}>ĐANG MỜI BỆNH NHÂN</h2>
                    {currentPatient ? (
                        <>
                            <h1 style={{ fontSize: '60px', color: '#d32f2f', margin: '20px 0', textAlign: 'center' }}>
                                {currentPatient.patient_name}
                            </h1>
                            <p style={{ fontSize: '24px', color: '#666' }}>Mã BN: {currentPatient.patient_id || '---'}</p>
                        </>
                    ) : (
                        <h2 style={{ fontSize: '40px', color: '#999' }}>Mời bệnh nhân chuẩn bị</h2>
                    )}
                </div>

                {/* Cột Phải: DANH SÁCH CHỜ */}
                <div style={{ flex: 1, background: 'white', borderRadius: '15px', padding: '20px', overflow: 'hidden' }}>
                    <h2 style={{ fontSize: '28px', borderBottom: '2px solid #ddd', paddingBottom: '10px', color: '#0277bd' }}>DANH SÁCH CHỜ KHÁM</h2>
                    <ul style={{ listStyle: 'none', padding: 0, fontSize: '24px' }}>
                        {waitingList.slice(0, 5).map((p, index) => (
                            <li key={p.id} style={{ padding: '15px', borderBottom: '1px dashed #ccc', display: 'flex', justifyContent: 'space-between' }}>
                                <span>{index + 1}. {p.patient_name}</span>
                                <span style={{ fontWeight: 'bold', color: '#0277bd' }}>{new Date(p.appointment_datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </li>
                        ))}
                        {waitingList.length > 5 && <li style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>... và {waitingList.length - 5} người khác</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default QueueDisplay;