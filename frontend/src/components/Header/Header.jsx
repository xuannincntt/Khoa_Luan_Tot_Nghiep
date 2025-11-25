// import reactLogo from '../../assets/react.svg';
// import viteLogo from '../../assets/vite.svg';
import styles from './Header.module.css';
// import clsx from 'clsx';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faMagnifyingGlass, faHospital } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const useAuth = () => ({
    isAuthenticated: false, // Thay thế bằng logic kiểm tra token/user state
    userRole: null // Vai trò của người dùng
});

function Header() {
    const navigate = useNavigate();
    const { isAuthenticated, userRole } = useAuth(); // Lấy trạng thái xác thực

    const handleNavigateToAppointment = (e) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
        
        // 1. Kiểm tra trạng thái đăng nhập
        if (isAuthenticated) {
            // Nếu đã đăng nhập, chuyển thẳng đến trang Đặt lịch khám
            // Giả định đường dẫn trang đặt lịch là '/dat-lich-kham'
            navigate('/dat-lich-kham');
        } else {
            // Nếu chưa đăng nhập, chuyển đến trang Đăng nhập/Đăng ký
            // Giả định đường dẫn trang đăng nhập là '/login'
            navigate('/login', { state: { redirectTo: '/dat-lich-kham' } });
            
            // NOTE: { state: { redirectTo: ... } } là cách gửi thông tin
            // rằng sau khi đăng nhập xong, hệ thống nên chuyển hướng về đâu.
        }
    };

    return (
        <header className={styles["header-container"]}>
            {/* 1. Phần Top Header */}
            <div className={styles["header-top"]}>
                {/* Logo và Tên Bệnh viện */}
                <div className={styles["logo-section"]}>
                    <div className={styles["logo"]}>
                        {/* Giả định: Sử dụng một Icon/Div tạm thời thay cho logo hình ảnh */}
                        <div className={styles["logo-icon"]}><FontAwesomeIcon icon={faHospital} /></div>
                        <div className={styles["logo-text"]}>
                            <p className={styles["main-name"]}>BỆNH VIỆN BẠCH MAI</p>
                            <p className={styles["sub-name"]}>BACH MAI HOSPITAL</p>
                        </div>
                    </div>
                    <div className={styles["slogan"]}>
                        <span className={styles["slogan-text"]}>Vì sức khỏe nhân dân</span>
                    </div>
                </div>
                
                {/* Thanh Tìm kiếm */}
                <div className={styles["search-section"]}>
                    <input 
                        type="text" 
                        placeholder="Từ khóa tìm kiếm..." 
                        className={styles["search-input"]} 
                    />
                    <button className={styles["search-button"]}>
                        <i className={styles["search-icon"]}><FontAwesomeIcon icon={faMagnifyingGlass} /></i>
                    </button>
                </div>
            </div>

            {/* 2. Thanh Điều hướng (Navigation Bar) */}
            <nav className={styles["header-nav"]}>
                <ul className={styles["nav-list"]}>
                    <li><a href="/">Trang chủ</a></li>
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
                            <li><a href="#gia-dv">Tra cứu kết quả khám</a></li>
                            <li><a href="#gia-dv">Bảng giá dịch vụ bệnh viện</a></li>
                            <li><a href="#chedo-cs">Chế độ chính sách</a></li>
                            <li><a href="#hd-qtkb">Hướng dẫn quy trình khám chữa bệnh</a></li>
                        </ul>
                    </li>
                    <li><a href="#bachmaifamily">Bạch Mai Family <span className={styles["arrow"]}><FontAwesomeIcon icon={faAngleDown} /></span></a></li>
                    <li><a href="#tuyendung">Thông tin tuyển dụng</a></li>
                </ul>
            </nav>
            {/* Đường kẻ phân cách */}
            <hr className={styles["divider"]} />
        </header>
    )
}

export default Header;