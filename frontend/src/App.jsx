// src/App.jsx (hoặc main.jsx nếu bạn cấu hình router ở đó)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
// import Login from './pages/Login/Login'; // Import trang Login
// Import các trang khác của bạn
// import AppointmentPage from './pages/Appointment/AppointmentPage'; 
// import RegisterPage from './pages/Register/RegisterPage';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/login" element={<Login />} />  */}
          {/* Định nghĩa route cho trang Login */}
          {/* <Route path="/register" element={<RegisterPage />} /> */}
          {/* <Route path="/dat-lich-kham" element={<AppointmentPage />} /> */}
          {/* Thêm các route khác của bạn */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;