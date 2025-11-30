import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import DoctorSidebar from './DoctorSidebar';
import styles from './DoctorLayout.module.css';

const DoctorLayout = () => {
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setDoctor(JSON.parse(userStr));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className={styles.layoutContainer}>
            {/* 1. Header Riêng cho Bác sĩ */}
            <header className={styles.header}>
                <div className={styles.brand}>
                    <div className={styles.logoBox}>BM</div>
                    <span className={styles.brandName}>Doctor Workspace</span>
                </div>
                
                <div className={styles.headerRight}>
                    <div className={styles.doctorProfile}>
                        <div className={styles.avatar}>
                            <FontAwesomeIcon icon={faUserMd} />
                        </div>
                        <div className={styles.info}>
                            <span className={styles.name}>BS. {doctor?.full_name}</span>
                            <span className={styles.role}>Chuyên khoa Tiêu Hóa</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className={styles.btnLogout} title="Đăng xuất">
                        <FontAwesomeIcon icon={faSignOutAlt} />
                    </button>
                </div>
            </header>

            {/* 2. Phần thân: Sidebar + Content */}
            <div className={styles.mainWrapper}>
                <DoctorSidebar />
                
                <main className={styles.contentArea}>
                    {/* Đây là nơi các trang con (Dashboard, Kê đơn...) sẽ hiển thị */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DoctorLayout;