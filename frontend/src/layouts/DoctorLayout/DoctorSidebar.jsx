import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarCheck, faStethoscope, faFilePrescription, 
    faUserInjured, faChartBar, faChevronDown, faChevronRight,
    faClock, faHistory, faPills
} from '@fortawesome/free-solid-svg-icons';
import styles from './DoctorLayout.module.css';

const DoctorSidebar = () => {
    const location = useLocation();
    
    // Trạng thái mở/đóng của các menu cha
    // Mặc định mở menu 'appointment'
    const [openMenu, setOpenMenu] = useState('appointment');

    const toggleMenu = (menuId) => {
        setOpenMenu(openMenu === menuId ? null : menuId);
    };

    // Cấu trúc Menu
    const menuItems = [
        {
            id: 'appointment',
            title: 'Quản lý Lịch hẹn',
            icon: faCalendarCheck,
            subItems: [
                { title: 'Lịch khám hôm nay', path: '/doctor/dashboard', icon: faClock },
                { title: 'Lịch sắp tới', path: '/doctor/upcoming', icon: faCalendarCheck },
                { title: 'Lịch sử khám', path: '/doctor/history', icon: faHistory },
            ]
        },
        {
            id: 'exam',
            title: 'Khám & Điều trị',
            icon: faStethoscope,
            subItems: [
                { title: 'Tiếp nhận bệnh nhân', path: '/doctor/examination', icon: faUserInjured },
                { title: 'Kê đơn thuốc', path: '/doctor/prescriptions', icon: faPills },
                { title: 'Chỉ định CLS', path: '/doctor/tests', icon: faFilePrescription },
            ]
        },
        {
            id: 'reports',
            title: 'Báo cáo & Thống kê',
            icon: faChartBar,
            subItems: [
                { title: 'Doanh thu ngày', path: '/doctor/revenue', icon: faChartBar },
            ]
        }
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarContent}>
                {menuItems.map((item) => (
                    <div key={item.id} className={styles.menuGroup}>
                        {/* Menu Cha */}
                        <div 
                            className={`${styles.menuHeader} ${openMenu === item.id ? styles.menuActive : ''}`}
                            onClick={() => toggleMenu(item.id)}
                        >
                            <div className={styles.menuTitle}>
                                <FontAwesomeIcon icon={item.icon} className={styles.menuIcon} />
                                <span>{item.title}</span>
                            </div>
                            <FontAwesomeIcon 
                                icon={openMenu === item.id ? faChevronDown : faChevronRight} 
                                className={styles.arrowIcon}
                            />
                        </div>

                        {/* Menu Con (Dropdown) */}
                        <div className={`${styles.subMenu} ${openMenu === item.id ? styles.subMenuOpen : ''}`}>
                            {item.subItems.map((sub, index) => (
                                <Link 
                                    to={sub.path} 
                                    key={index}
                                    className={`${styles.subMenuItem} ${location.pathname === sub.path ? styles.subActive : ''}`}
                                >
                                    <FontAwesomeIcon icon={sub.icon} className={styles.subIcon} />
                                    {sub.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default DoctorSidebar;