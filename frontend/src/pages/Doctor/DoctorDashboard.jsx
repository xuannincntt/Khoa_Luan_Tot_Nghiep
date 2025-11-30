import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoctorAppointments, updateAppointmentStatus, saveExaminationResult } from '../../services/doctorService';
import styles from './DoctorDashboard.module.css';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    
    // Tab quản lý: 'waiting' | 'inprogress' | 'history'
    const [activeTab, setActiveTab] = useState('waiting');
    
    // Dữ liệu khám
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');

    // Load dữ liệu ban đầu
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const u = JSON.parse(userStr);
            setDoctor(u);
            fetchData(u.id);
        }
    }, []);

    const fetchData = async (doctorId) => {
        const data = await getDoctorAppointments(doctorId);
        setAppointments(data);
    };

    // --- CÁC HÀM XỬ LÝ NGHIỆP VỤ ---

    // 1. Mở màn hình IoT tab mới
    const openQueueDisplay = () => {
        if (!doctor || !doctor.id) {
            alert("Đang tải thông tin bác sĩ, vui lòng thử lại sau giây lát.");
            return;
        }
        // Tạo URL (Lưu ý đường dẫn phải khớp với App.jsx)
        const url = `/doctor/queue-display?doctor_id=${doctor.id}&name=${encodeURIComponent(doctor.full_name)}`;
        
        // Mở tab mới
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    // 2. Gọi bệnh nhân vào khám (Waiting -> In Progress)
    const handleStartExam = async (appId) => {
        if (window.confirm('Bạn muốn gọi bệnh nhân này vào khám?')) {
            await updateAppointmentStatus(appId, 'IP');
            fetchData(doctor.id);
            setActiveTab('inprogress'); // Tự động chuyển tab
        }
    };

    // 3. Lưu & Kết thúc khám (In Progress -> Completed)
    const handleFinishExam = async (appId) => {
        const result = await saveExaminationResult({
            appointment_id: appId,
            diagnosis: diagnosis,
            treatment: treatment,
            prescription_details: []
        });

        if (result.success) {
            alert("Đã lưu hồ sơ bệnh án!");
            setDiagnosis('');
            setTreatment('');
            fetchData(doctor.id);
            setActiveTab('history'); // Chuyển sang tab lịch sử
        }
    };

    // --- PHÂN LOẠI DỮ LIỆU THEO TAB ---
    const waitingList = appointments.filter(a => a.status === 'P' || a.status === 'C');
    const inProgressList = appointments.filter(a => a.status === 'IP');
    const historyList = appointments.filter(a => a.status === 'CM').reverse(); // Mới nhất lên đầu

    return (
        <div className={styles.dashboardContainer}>
            {/* Header Tabs & Nút IoT */}
            <div className={styles.topControl}>
                <div className={styles.tabs}>
                    <button 
                        className={activeTab === 'waiting' ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab('waiting')}
                    >
                        Hàng chờ ({waitingList.length})
                    </button>
                    <button 
                        className={activeTab === 'inprogress' ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab('inprogress')}
                    >
                        Đang khám ({inProgressList.length})
                    </button>
                    <button 
                        className={activeTab === 'history' ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab('history')}
                    >
                        Lịch sử khám
                    </button>
                </div>
                
                <button className={styles.btnIoT} onClick={openQueueDisplay}>
                    Chiếu màn hình
                </button>
            </div>

            {/* NỘI DUNG CHÍNH */}
            <div className={styles.tabContent}>
                
                {/* TAB 1: HÀNG CHỜ */}
                {activeTab === 'waiting' && (
                    <div className={styles.patientList}>
                        <h3>Danh sách chờ khám hôm nay</h3>
                        {waitingList.length > 0 ? waitingList.map(app => (
                            <div key={app.id} className={styles.card} style={{borderLeftColor: '#ff9800'}}> {/* Màu cam cho chờ */}
                                <div className={styles.cardInfo}>
                                    <div className={styles.timeBox}>
                                        {new Date(app.appointment_datetime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                    </div>
                                    <div className={styles.patientDetails}>
                                        <strong>{app.patient_name}</strong>
                                        <span className={styles.reason}>Lý do: {app.description || "Không có ghi chú"}</span>
                                    </div>
                                </div>
                                <button className={styles.btnCall} onClick={() => handleStartExam(app.id)}>
                                    Gọi vào khám
                                </button>
                            </div>
                        )) : (
                            <p style={{fontStyle:'italic', color:'#666'}}>Hiện tại không có bệnh nhân nào trong hàng chờ.</p>
                        )}
                    </div>
                )}

                {/* TAB 2: ĐANG KHÁM */}
                {activeTab === 'inprogress' && (
                    <div className={styles.examArea}>
                        {inProgressList.map(app => (
                            <div key={app.id}>
                                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                                    <h2 style={{margin:0, color:'var(--color-primary)'}}>Đang khám: {app.patient_name}</h2>
                                    <span className={styles.badgeIP}>ĐANG DIỄN RA</span>
                                </div>
                                
                                <div className={styles.inputGroup}>
                                    <label>Triệu chứng ban đầu:</label>
                                    <div style={{padding:'10px', background:'#f9f9f9', borderRadius:'5px'}}>
                                        {app.description}
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Chẩn đoán của bác sĩ:</label>
                                    <textarea rows="3" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="Nhập chẩn đoán..."></textarea>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Phác đồ điều trị / Lời dặn:</label>
                                    <textarea rows="3" value={treatment} onChange={e => setTreatment(e.target.value)} placeholder="Nhập hướng điều trị..."></textarea>
                                </div>
                                
                                <button className={styles.btnFinish} onClick={() => handleFinishExam(app.id)}>
                                    Lưu & Hoàn thành
                                </button>
                            </div>
                        ))}
                         {inProgressList.length === 0 && <p>Chưa chọn bệnh nhân. Vui lòng quay lại tab Hàng chờ.</p>}
                    </div>
                )}

                {/* TAB 3: LỊCH SỬ (Giữ nguyên Table cũ cũng được hoặc style lại sau) */}
                 {activeTab === 'history' && (
                     /* ... Code bảng lịch sử cũ ... */
                     <div style={{background:'white', padding:'20px', borderRadius:'10px'}}>
                         <table style={{width:'100%', borderCollapse:'collapse'}}>
                            <thead>
                                <tr style={{background:'#f0f0f0', textAlign:'left'}}>
                                    <th style={{padding:'10px'}}>Giờ</th>
                                    <th style={{padding:'10px'}}>Bệnh nhân</th>
                                    <th style={{padding:'10px'}}>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyList.map(app => (
                                    <tr key={app.id} style={{borderBottom:'1px solid #eee'}}>
                                        <td style={{padding:'10px'}}>{new Date(app.appointment_datetime).toLocaleTimeString()}</td>
                                        <td style={{padding:'10px'}}>{app.patient_name}</td>
                                        <td style={{padding:'10px', color:'green'}}>Hoàn thành</td>
                                    </tr>
                                ))}
                            </tbody>
                         </table>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default DoctorDashboard;