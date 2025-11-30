// src/App.jsx

import './App.css';
import React from 'react';

// --- COMPONENTS CẤU TRÚC ---
import Header from "./components/Header/Header.jsx";
import Footer from './components/Footer/Footer.jsx';

// --- TRANG CHÍNH (PAGES) ---
import HomePage from "./pages/HomePage/HomePage.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx"; 
import Appointment from './pages/Appointment/Appointment.jsx';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';

import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import DoctorLayout from './layouts/DoctorLayout/DoctorLayout';
import QueueDisplay from './pages/Doctor/QueueDisplay';

// Layout cho người dùng thường (Bệnh nhân/Khách)
const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
         {/* Outlet là nơi nội dung của các trang con (Home, Login...) sẽ hiện ra */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        
        {/* NHÓM 1: CÁC TRANG CÔNG KHAI (Dùng MainLayout) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dat-lich-kham" element={<Appointment />} />
        </Route>


        {/* NHÓM 2: TRANG DÀNH CHO BÁC SĨ (Dùng DoctorLayout) */}
        {/* Khi đường dẫn bắt đầu bằng /doctor, nó sẽ dùng giao diện bác sĩ */}
        <Route path="/doctor" element={<DoctorLayout />}>
           {/* index: nghĩa là vào /doctor sẽ hiện trang này 
              hoặc bạn có thể đặt path="dashboard" để thành /doctor/dashboard 
           */}
           <Route path="dashboard" element={<DoctorDashboard />} />
           
           {/* Sau này thêm các trang khác của bác sĩ vào đây rất dễ */}
           {/* <Route path="exam" element={<ExamPage />} /> */}
        </Route>
        <Route path="/doctor/queue-display" element={<QueueDisplay />} />
      </Routes>
    </Router>
  );
}

export default App;