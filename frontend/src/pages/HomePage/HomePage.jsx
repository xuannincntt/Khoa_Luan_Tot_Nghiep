import React from 'react';
import styles from './HomePage.module.css';
import homeImg from '../../assets/tai-app-bachmai.webp';
// Import Icons (Giả định bạn đã cài đặt đủ các gói)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone, faCalendarCheck, faComments, faVial, 
  faNewspaper, faFlask, faHospitalUser, faArrowRight,
  faHospital
} from '@fortawesome/free-solid-svg-icons';

// --- COMPONENT CON: QUICK LINK CARD ---
const QuickLinkCard = ({ icon, title, description, link }) => {
  return (
    <a href={link} className={styles["quick-card"]}>
      <div className={styles["icon-wrapper"]}>
        <FontAwesomeIcon icon={icon} className={styles["card-icon"]} />
      </div>
      <h4 className={styles["card-title"]}>{title}</h4>
      <p className={styles["card-description"]}>{description}</p>
    </a>
  );
};
// --- COMPONENT CON: NEWS CARD (Tin tức nhỏ) ---
const NewsCard = ({ icon, title, date, link }) => {
  return (
    <a href={link} className={styles["news-card"]}>
      <FontAwesomeIcon icon={icon} className={styles["news-icon"]} />
      <h5 className={styles["news-title"]}>{title}</h5>
      <p className={styles["news-date"]}>{date}</p>
    </a>
  );
};
// --- COMPONENT CON: FEATURED ITEM CARD (Dịch bệnh/Bài viết lớn) ---
const FeaturedItemCard = ({ image, title, date, link, description }) => {
  return (
    <a href={link} className={styles["featured-item-card"]}>
      <div className={styles["featured-item-image"]}>
        {image ? <img src={image} alt={title} /> : <div className={styles["placeholder-image"]}></div>}
      </div>
      <div className={styles["featured-item-content"]}>
        <h4 className={styles["featured-item-title"]}>{title}</h4>
        <p className={styles["featured-item-date"]}>Ngày đăng: {date}</p>
        {description && <p className={styles["featured-item-description"]}>{description}</p>}
        <button className={styles["view-detail-button"]}>Xem chi tiết</button>
      </div>
    </a>
  );
};
// --- COMPONENT CON: SERVICE CARD (Dịch vụ/Giới thiệu tổ chức) ---
const ServiceCard = ({ title, description, link }) => {
    return (
        <a href={link} className={styles["service-card"]}>
            <h4 className={styles["service-title"]}>{title}</h4>
            <p className={styles["service-description"]}>{description}</p>
        </a>
    );
};
const HomePage = () => {
  return (
    <div className={styles["homepage-container"]}>
        <section className={styles["hero-section"]}>
            <div className={styles["hero-content"]}>
                {/* THẺ HÌNH ẢNH BANNER TĨNH */}
                <img 
                    src={homeImg} 
                    alt="Banner ứng dụng Bạch Mai Care" 
                    className={styles["hero-image"]} 
                />
            </div>

            <div className={styles["quick-links-section"]}>
            <QuickLinkCard 
                icon={faPhone} 
                title="Gọi tổng đài" 
                description={<>Đặt lịch khám nhanh qua <br/> tổng đài 1900.888.866</>}
                link="#contact"
            />
            <QuickLinkCard 
                icon={faCalendarCheck} 
                title="Đặt lịch khám" 
                description={<>Đặt lịch khám online tại <br/> website</>}
                link="#appointment"
            />
            <QuickLinkCard 
                icon={faComments} 
                title="Hỏi đáp cùng chuyên gia" 
                description={<>Giải đáp thắc mắc về <br/> sức khỏe</>}
                link="#qna"
            />
            <QuickLinkCard 
                icon={faVial} 
                title="Kết quả xét nghiệm" 
                description={<>Tra cứu kết quả xét nghiệm <br/> của bạn</>}
                link="#results"
            />
            </div>
        </section>

        <section className={styles["section-container"]}>
            <div className={styles["section-header"]}>
                <FontAwesomeIcon icon={faNewspaper} className={styles["section-icon"]} />
                <h2 className={styles["section-title"]}>Tin tức News</h2>
            </div>
            <div className={styles["news-grid"]}>
                <div className={styles["main-news-article"]}>
                    <h3>Bệnh viện Bạch Mai là đơn vị y tế hàng đầu Việt Nam</h3>
                    <p className={styles["news-meta"]}>
                        Bệnh viện Bạch Mai là bệnh viện đa khoa hoàn chỉnh hạng đặc biệt, có lịch sử hơn 100 năm phát triển. Chúng tôi cung cấp các dịch vụ y tế chất lượng cao.
                    </p>
                    <button className={styles["view-all-button"]}>
                    Xem tất cả tin tức <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
                <div className={styles["small-news-cards"]}>
                    <NewsCard icon={faPhone} title="Tổng đài tư vấn mới" date="2024.10.05" link="#news-detail-1" />
                    <NewsCard icon={faCalendarCheck} title="Hướng dẫn đặt lịch trực tuyến" date="2024.09.15" link="#news-detail-2" />
                    <NewsCard icon={faComments} title="Hỏi đáp cùng chuyên gia" date="2024.09.01" link="#news-detail-3" />
                    <NewsCard icon={faHospital} title="Thông tin cơ cấu tổ chức" date="2024.08.20" link="#news-detail-4" />
                </div>
            </div>
        </section>

        <section className={styles["section-container"]}>
            <div className={styles["section-header"]}>
                <FontAwesomeIcon icon={faHospitalUser} className={styles["section-icon"]} />
                <h2 className={styles["section-title"]}>Bài viết chuyên môn & Thông tin Y tế</h2>
            </div>
            <div className={styles["featured-items-grid"]}>
                <FeaturedItemCard
                    image="https://via.placeholder.com/200x120?text=News+Image+1"
                    title="Hội thảo quốc tế về sức khỏe"
                    date="15/05/2024"
                    description="Giải pháp mới về điều trị bệnh tim mạch. Các chuyên gia quốc tế."
                    link="#item-1"
                />
                <FeaturedItemCard
                    image="https://via.placeholder.com/200x120?text=News+Image+2"
                    title="Ứng dụng AI trong chẩn đoán"
                    date="25/04/2024"
                    description="Đột phá mới trong việc sử dụng trí tuệ nhân tạo để chẩn đoán bệnh sớm hơn."
                    link="#item-2"
                />
                <FeaturedItemCard
                    image="https://via.placeholder.com/200x120?text=News+Image+3"
                    title="Tiến bộ trong điều trị ung thư"
                    date="18/04/2024"
                    description="Phác đồ điều trị mới nhất, giúp cải thiện chất lượng cuộc sống bệnh nhân."
                    link="#item-3"
                />
            </div>
        </section>

        <section className={styles["section-container"]}>
            <div className={styles["section-header"]}>
                <FontAwesomeIcon icon={faFlask} className={styles["section-icon"]} />
                <h2 className={styles["section-title"]}>Dịch vụ nổi bật</h2>
            </div>
            <div className={styles["services-grid"]}>
                <ServiceCard title="Khám Tổng Quát" description="Giá khám sức khỏe toàn diện theo yêu cầu." link="#service-general"/>
                <ServiceCard title="Chẩn đoán hình ảnh" description="CT, MRI, X-Quang, Siêu âm tiên tiến." link="#service-cardio"/>
                <ServiceCard title="Phẫu Thuật Nội Soi" description="Phẫu thuật ít xâm lấn, phục hồi nhanh chóng." link="#service-surgery"/>
                <ServiceCard title="Hồi sức cấp cứu" description="Dịch vụ cấp cứu khẩn cấp luôn sẵn sàng 24/7." link="#service-emergency"/>
            </div>
            <div className={styles["center-button"]}>
                <button className={styles["view-all-button"]}>
                    Xem tất cả dịch vụ <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </section>

        <section className={styles["section-container"]}>
            <div className={styles["section-header"]}>
                <FontAwesomeIcon icon={faHospitalUser} className={styles["section-icon"]} />
                <h2 className={styles["section-title"]}>Giới thiệu tổ chức Bệnh viện Bạch Mai</h2>
            </div>
            <div className={styles["about-grid"]}>
                <ServiceCard title="Khoa/Phòng" description="Xem chi tiết các đơn vị chuyên môn." link="#about-departments"/>
                <ServiceCard title="Đội Ngũ Bác Sĩ" description="Thông tin về đội ngũ chuyên môn." link="#about-doctors"/>
                <ServiceCard title="Thiết Bị Y Tế" description="Công nghệ và thiết bị hiện đại." link="#about-equipment"/>
                <ServiceCard title="Hợp Tác Quốc Tế" description="Các dự án và quan hệ hợp tác." link="#about-collaboration"/>
            </div>
        </section>
    </div>
  );
};

export default HomePage;