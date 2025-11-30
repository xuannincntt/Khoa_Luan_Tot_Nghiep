import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDepartments, getDoctors, createAppointment, getAvailableSlots } from '../../services/appointmentService';
import styles from './Appointment.module.css';

const Appointment = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Data API
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]); // Danh sách gốc
    const [availableSlots, setAvailableSlots] = useState([]); // Danh sách giờ trống

    // Form State
    const [mode, setMode] = useState('BY_DOCTOR'); // 'BY_DOCTOR' hoặc 'BY_DATE'
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState(''); // Giờ người dùng chọn
    const [symptoms, setSymptoms] = useState('');
    
    // UI State
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // 1. Init Data
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login', { state: { redirectTo: '/dat-lich-kham' } }); return; }
        setUser(JSON.parse(storedUser));

        const fetchData = async () => {
            setDepartments(await getDepartments());
            setDoctors(await getDoctors());
        };
        fetchData();
        
        // Mặc định chọn ngày hôm nay
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
    }, [navigate]);

    // 2. Logic Lọc Bác sĩ
    const filteredDoctors = doctors.filter(doc => {
        console.log("Bác sĩ:", doc.full_name, "Khoa ID:", doc.department, "Khoa đang chọn:", selectedDept);
        return selectedDept ? String(doc.department) === String(selectedDept) : true;
    });
        

    // 3. Khi đổi Bác sĩ hoặc Ngày -> Gọi API lấy giờ trống
    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            const fetchSlots = async () => {
                const slots = await getAvailableSlots(selectedDoctor, selectedDate);
                setAvailableSlots(slots);
            };
            fetchSlots();
        } else {
            setAvailableSlots([]);
        }
    }, [selectedDoctor, selectedDate]);

    // 4. Xử lý Submit
    const handleSubmit = async () => {
        if (!selectedDoctor || !selectedDate || !selectedTime) {
            setMessage({ type: 'error', text: 'Vui lòng chọn đầy đủ thông tin!' });
            return;
        }

        setLoading(true);
        const dateTime = `${selectedDate}T${selectedTime}:00Z`; 
        
        const payload = {
            patient: user.id,
            doctor: selectedDoctor,
            appointment_datetime: dateTime,
            status: 'P',
            description: symptoms
        };

        const res = await createAppointment(payload);
        if (res.success) {
            setMessage({ type: 'success', text: 'Đặt lịch thành công!' });
            // Reset nhẹ
            setSelectedTime('');
            setAvailableSlots(prev => prev.filter(t => t !== selectedTime)); // Ẩn giờ vừa đặt
        } else {
            setMessage({ type: 'error', text: res.message });
        }
        setLoading(false);
    };

    // --- RENDER GIAO DIỆN CON ---
    
    // Tạo danh sách 7 ngày tiếp theo
    const getNext7Days = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            // Format hiển thị: "Thứ 2 (26/11)"
            const label = `${d.getDate()}/${d.getMonth()+1}`; 
            days.push({ value: dateStr, label: label });
        }
        return days;
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>Đăng Ký Khám Bệnh</h2>
                </div>

                {/* Tabs Chuyển chế độ */}
                <div className={styles.tabs}>
                    <button 
                        className={mode === 'BY_DOCTOR' ? styles.activeTab : ''} 
                        onClick={() => { setMode('BY_DOCTOR'); setSelectedDoctor(''); setSelectedTime(''); }}
                    >
                        Theo Bác sĩ chuyên khoa
                    </button>
                    <button 
                        className={mode === 'BY_DATE' ? styles.activeTab : ''} 
                        onClick={() => { setMode('BY_DATE'); setSelectedDoctor(''); setSelectedTime(''); }}
                    >
                        Theo Thời gian
                    </button>
                </div>

                {message.text && (
                    <div className={`${styles.alert} ${message.type === 'error' ? styles.alertError : styles.alertSuccess}`}>
                        {message.text}
                    </div>
                )}

                <div className={styles.formContent}>
                    {/* BƯỚC 1: CHỌN KHOA (Chung cho cả 2) */}
                    <div className={styles.formGroup}>
                        <label>1. Chuyên khoa</label>
                        <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
                            <option value="">-- Chọn Chuyên khoa --</option>
                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>

                    {/* LOGIC RIÊNG TỪNG TAB */}
                    {mode === 'BY_DOCTOR' ? (
                        <>
                            <div className={styles.formGroup}>
                                <label>2. Chọn Bác sĩ</label>
                                <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} disabled={!selectedDept}>
                                    <option value="">-- Chọn Bác sĩ --</option>
                                    {filteredDoctors.map(doc => (
                                        <option key={doc.user} value={doc.user}>{doc.full_name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {selectedDoctor && (
                                <div className={styles.formGroup}>
                                    <label>3. Chọn Ngày khám</label>
                                    <div className={styles.dateGrid}>
                                        {getNext7Days().map(day => (
                                            <button 
                                                key={day.value}
                                                className={selectedDate === day.value ? styles.selectedDate : styles.dateBtn}
                                                onClick={() => setSelectedDate(day.value)}
                                            >
                                                {day.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className={styles.formGroup}>
                                <label>2. Chọn Ngày mong muốn</label>
                                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                            </div>

                            <div className={styles.formGroup}>
                                <label>3. Chọn Bác sĩ (có lịch trong ngày)</label>
                                <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} disabled={!selectedDept || !selectedDate}>
                                    <option value="">-- Chọn Bác sĩ --</option>
                                    {filteredDoctors.map(doc => (
                                        <option key={doc.user} value={doc.user}>{doc.full_name}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {/* HIỂN THỊ SLOT THỜI GIAN (Chung) */}
                    {selectedDoctor && selectedDate && (
                        <div className={styles.formGroup}>
                            <label>4. Chọn Giờ khám ({availableSlots.length} khung giờ trống)</label>
                            {availableSlots.length > 0 ? (
                                <div className={styles.slotGrid}>
                                    {availableSlots.map(slot => (
                                        <button 
                                            key={slot} 
                                            className={selectedTime === slot ? styles.selectedSlot : styles.slotBtn}
                                            onClick={() => setSelectedTime(slot)}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p style={{color: 'red', fontStyle: 'italic'}}>Bác sĩ đã kín lịch hoặc không làm việc ngày này.</p>
                            )}
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label>Ghi chú triệu chứng</label>
                        <textarea rows="2" value={symptoms} onChange={e => setSymptoms(e.target.value)}></textarea>
                    </div>

                    <button className={styles.btnSubmit} onClick={handleSubmit} disabled={loading || !selectedTime}>
                        {loading ? 'Đang xử lý...' : 'Xác Nhận Đặt Lịch'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Appointment;