import React from 'react';
import styles from './Footer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Giả định bạn đã import các icon cần thiết
import { 
  faMapMarkerAlt, 
  faPhone, 
  faClock,
  faHospital,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { faYoutube, faFacebook } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className={styles["footer-container"]}>
      <div className={styles["footer-content"]}>
        
        {/* 1. CỘT THÔNG TIN LIÊN HỆ */}
        <div className={styles["footer-col"]}>
          <div className={styles["logo-info"]}>
            <div className={styles["logo"]}>
              <FontAwesomeIcon icon={faHospital} className={styles["logo-icon"]} />
              <div className={styles["logo-text"]}>
                <p className={styles["main-name"]}>BỆNH VIỆN BẠCH MAI</p>
                <p className={styles["sub-name"]}>BACH MAI HOSPITAL</p>
              </div>
            </div>
          </div>

          <ul className={styles["contact-list"]}>
            <li>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>Địa chỉ: 78 Đường Giải Phóng, Phường Kim Liên, Thành phố Hà Nội</span>
            </li>
            <li>
              <FontAwesomeIcon icon={faPhone} />
              <span>Tổng đài: 1900.888.866</span>
            </li>
            <li>
              <FontAwesomeIcon icon={faPhone} />
              <span>Hotline: 096.985.1616</span>
            </li>
            <li>
              <FontAwesomeIcon icon={faClock} />
              <span>Lịch làm việc:</span>
              <p>Thứ 2 - Thứ 6: 06:00 - 20:00</p>
              <p>Thứ 7 - Chủ nhật: 06:30 - 16:30</p>
            </li>
          </ul>
          
          <p className={styles["copyright-info"]}>
            Chịu trách nhiệm chính: PGS.TS. Đào Xuân Cơ - Giám đốc bệnh viện
          </p>
        </div>

        {/* 2. CỘT CHỨC NĂNG NHANH */}
        <div className={styles["footer-col"]}>
          <h3>Chức năng nhanh</h3>
          <ul className={styles["quick-links"]}>
            <li>
              <a href="#goidongdai" className={styles["quick-link-item"]}>
                Gói tổng đài <FontAwesomeIcon icon={faArrowRight} />
              </a>
            </li>
            <li>
              <a href="#datlichkham" className={styles["quick-link-item"]}>
                Đặt lịch khám <FontAwesomeIcon icon={faArrowRight} />
              </a>
            </li>
            <li>
              <a href="#hoihuychuyengia" className={styles["quick-link-item"]}>
                Hỏi đáp cùng chuyên gia <FontAwesomeIcon icon={faArrowRight} />
              </a>
            </li>
            <li>
              <a href="#tracuuketqua" className={styles["quick-link-item"]}>
                Tra cứu kết quả xét nghiệm <FontAwesomeIcon icon={faArrowRight} />
              </a>
            </li>
          </ul>
          
          {/* Mạng xã hội và chứng nhận */}
          <div className={styles["social-media"]}>
            <FontAwesomeIcon icon={faFacebook} className={styles["social-icon"]} />
            <FontAwesomeIcon icon={faYoutube} className={styles["social-icon"]} />
          </div>
          <div className={styles["certifications"]}>
            {/* Sử dụng div/img placeholder cho chứng nhận */}
            <div className={styles["certification-badge"]}>Bộ Công Thương</div>
            <div className={styles["certification-badge"]}>DMCA</div>
          </div>
        </div>

        {/* 3. CỘT ĐIỀU HƯỚNG */}
        <div className={styles["footer-col"]}>
          <h3>Về Bạch Mai</h3>
          <ul className={styles["nav-links"]}>
            <li><a href="#chuyenkhoa">Đơn vị chuyên khoa</a></li>
            <li><a href="#doingu">Đội ngũ bác sĩ</a></li>
            <li><a href="#hoatdong">Tin hoạt động bệnh viện</a></li>
            <li><a href="#mothau">Tin mời thầu</a></li>
          </ul>
        </div>
      </div>
      
      {/* Footer dưới cùng (nếu có thêm thông tin bản quyền) */}
      <div className={styles["footer-bottom"]}>
        <p>© 2025 Bệnh Viện Bạch Mai. Bảo lưu mọi quyền.</p>
      </div>
    </footer>
  );
};

export default Footer;