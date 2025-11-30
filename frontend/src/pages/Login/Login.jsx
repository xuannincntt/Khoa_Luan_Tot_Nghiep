import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import styles from './Login.module.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Lấy địa chỉ trang trước đó (nếu có), mặc định là trang chủ '/'
    // Ví dụ: Bấm "Đặt lịch" -> Login -> Đăng nhập xong tự nhảy về "Đặt lịch"
    const from = location.state?.redirectTo || '/';

    const [citizenId, setCitizenId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = await loginUser(citizenId, password);
        setLoading(false);

        if (res.success) {
            // 1. Lưu thông tin vào localStorage
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            
            // 2. Phát tín hiệu để Header cập nhật lại (ẩn nút Login, hiện tên User)
            window.dispatchEvent(new Event("storage"));

            // 3. Chuyển hướng
            alert('Đăng nhập thành công!');
            if (res.user.role === 'DOCTOR') {
                navigate('/doctor/dashboard');
            } else if (res.user.role === 'ADMIN') {
                navigate('/admin');
            } else {
                // Nếu là bệnh nhân -> Về trang chủ hoặc trang đặt lịch
                navigate(from, { replace: true });
            }
        } else {
            setError(res.message);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>Đăng Nhập</h2>
                    <p>Hệ thống Quản lý Bệnh viện</p>
                </div>

                {error && <div className={styles.alertError}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>CCCD / Mã định danh</label>
                        <input 
                            type="text" 
                            value={citizenId} 
                            onChange={(e) => setCitizenId(e.target.value)} 
                            placeholder="Nhập số CCCD"
                            required 
                            autoFocus
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Mật khẩu</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Nhập mật khẩu"
                            required 
                        />
                    </div>

                    <button type="submit" className={styles.btnLogin} disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;