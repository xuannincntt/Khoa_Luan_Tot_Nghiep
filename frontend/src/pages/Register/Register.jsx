import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerPatient } from '../../services/authService';
import styles from './Register.module.css';

const Register = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        citizenId: '',
        password: '',
        confirmPassword: '', // Thêm xác nhận mật khẩu
        fullName: '',
        phone: '',
        email: '',
        dateOfBirth: '',
        gender: 'Nam',
        address: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validate đơn giản
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setLoading(true);
        const res = await registerPatient(formData);
        setLoading(false);

        if (res.success) {
            setSuccess(true);
            // Tự động chuyển trang sau 2 giây
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } else {
            setError(res.message);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>Đăng Ký Tài Khoản</h2>
                    <p>Dành cho Bệnh nhân mới</p>
                </div>

                {error && <div className={styles.alertError}>{error}</div>}
                {success && <div className={styles.alertSuccess}>Đăng ký thành công! Đang chuyển hướng...</div>}

                <form onSubmit={handleSubmit}>
                    <div className={styles.gridContainer}>
                        {/* Cột 1 */}
                        <div className={styles.formGroup}>
                            <label>Họ và tên <span className={styles.required}>*</span></label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Nguyễn Văn A" />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Số CCCD <span className={styles.required}>*</span></label>
                            <input type="text" name="citizenId" value={formData.citizenId} onChange={handleChange} required placeholder="Số định danh cá nhân" />
                        </div>

                        {/* Cột 2 */}
                        <div className={styles.formGroup}>
                            <label>Số điện thoại <span className={styles.required}>*</span></label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="09xxxxxxx" />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" />
                        </div>
                        
                        {/* Hàng: Ngày sinh & Giới tính */}
                        <div className={styles.formGroup}>
                            <label>Ngày sinh <span className={styles.required}>*</span></label>
                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Giới tính <span className={styles.required}>*</span></label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className={styles.selectInput}>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                    </div>

                    {/* Hàng: Địa chỉ full width */}
                    <div className={styles.formGroup}>
                        <label>Địa chỉ</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Số nhà, Tên đường, Quận/Huyện..." />
                    </div>

                    {/* Hàng: Mật khẩu */}
                    <div className={styles.gridContainer}>
                        <div className={styles.formGroup}>
                            <label>Mật khẩu <span className={styles.required}>*</span></label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="******" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Nhập lại mật khẩu <span className={styles.required}>*</span></label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="******" />
                        </div>
                    </div>

                    <button type="submit" className={styles.btnRegister} disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;