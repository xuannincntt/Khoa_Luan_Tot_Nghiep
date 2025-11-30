import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faHospital, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css';

function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // --- 1. Hàm kiểm tra trạng thái đăng nhập ---
    const checkLoginStatus = () => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData)); 
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        checkLoginStatus(); 

        const handleStorageChange = () => checkLoginStatus();
        window.addEventListener('storage', handleStorageChange);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // --- 2. Hàm Đăng xuất ---
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    // --- 3. Logic điều hướng Đặt lịch ---
    const handleNavigateToAppointment = (e) => {
        e.preventDefault();
        if (user) {
            navigate('/dat-lich-kham');
        } else {
            navigate('/login', { state: { redirectTo: '/dat-lich-kham' } });
        }
    };

    return (
        <header className={styles["header-container"]}>
            {/* 1. Phần Top Header */}
            <div className={styles["header-top"]}>
                {/* Logo và Tên Bệnh viện */}
                <div className={styles["logo-section"]}>
                    <Link to="/" className={styles["logo"]}>
                        <div className={styles["logo-icon"]}><FontAwesomeIcon icon={faHospital} /></div>
                        <div className={styles["logo-text"]}>
                            <p className={styles["main-name"]}>BỆNH VIỆN BẠCH MAI</p>
                            <p className={styles["sub-name"]}>BACH MAI HOSPITAL</p>
                        </div>
                    </Link>
                    {/* <div className={styles["slogan"]}>
                        <span className={styles["slogan-text"]}>Vì sức khỏe nhân dân</span>
                    </div> */}
                </div>
                
                {/* Khu vực nút Đăng ký / Đăng nhập HOẶC Thông tin User */}
                <div className={styles["auth-section"]}>
                    {user ? (
                        /* Trạng thái ĐÃ ĐĂNG NHẬP */
                        <div className={styles["user-info"]}>
                            <span className={styles["user-name"]}>
                                <FontAwesomeIcon icon={faUser} /> Chào, {user.full_name}
                            </span>
                            <button onClick={handleLogout} className={styles["btn-logout"]} title="Đăng xuất">
                                <FontAwesomeIcon icon={faSignOutAlt} />
                            </button>
                        </div>
                    ) : (
                        /* Trạng thái CHƯA ĐĂNG NHẬP - Hiển thị 2 nút Button */
                        <div className={styles["auth-buttons"]}>
                            <Link to="/register" className={`${styles["btn"]} ${styles["btn-register"]}`}>
                                Đăng ký
                            </Link>
                            <Link to="/login" className={`${styles["btn"]} ${styles["btn-login"]}`}>
                                Đăng nhập
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Thanh Điều hướng (Navigation Bar) */}
            <nav className={styles["header-nav"]}>
                <ul className={styles["nav-list"]}>
                    <li><Link to="/">Trang chủ</Link></li>
                    <li><a href="#gioithieu">Giới thiệu</a></li>
                    <li><a href="#cctochuc">Cơ cấu tổ chức</a></li>
                    <li><a href="#doingubacsi">Đội ngũ bác sĩ</a></li>

                    <li className={styles["dropdown-item"]}>
                        <a href="#tintuc">Tin tức <span className={styles["arrow"]}><FontAwesomeIcon icon={faAngleDown} /></span></a>
                        <ul className={styles["dropdown-menu"]}>
                            <li><a href="#tin-hd">Tin hoạt động bệnh viện</a></li>
                            <li><a href="#bv-cm">Bài viết chuyên môn</a></li>
                            <li><a href="#tin-nganh">Tin trong ngành</a></li>
                        </ul>
                    </li>
                    
                    <li className={styles["dropdown-item"]}>
                        <a href="#danhchobenhnhan">Dành cho bệnh nhân <span className={styles["arrow"]}><FontAwesomeIcon icon={faAngleDown} /></span></a>
                        <ul className={styles["dropdown-menu"]}>
                            <li><a href="/dat-lich-kham" onClick={handleNavigateToAppointment}>Đặt lịch khám</a></li>
                            <li><a href="#tra-cuu">Tra cứu kết quả</a></li>
                            <li><a href="#gia-dv">Bảng giá dịch vụ</a></li>
                        </ul>
                    </li>
                    <li><a href="#bachmaifamily">Bạch Mai Family <span className={styles["arrow"]}><FontAwesomeIcon icon={faAngleDown} /></span></a></li>
                    <li><a href="#tuyendung">Thông tin tuyển dụng</a></li>
                </ul>
            </nav>
            <hr className={styles["divider"]} />
        </header>
    )
}

export default Header;