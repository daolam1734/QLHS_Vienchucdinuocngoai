import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import AuthCallback from './pages/AuthCallback';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardNguoiDuyet from './pages/DashboardNguoiDuyet';
import DashboardVienChuc from './pages/DashboardVienChuc';
import ProfilePage from './pages/ProfilePage';
import CreateHoSoPage from './pages/CreateHoSoPage';
import GioiThieuPage from './pages/GioiThieuPage';
import QuyTrinhThuTucPage from './pages/QuyTrinhThuTucPage';
import TaiBieuMauPage from './pages/TaiBieuMauPage';
import HuongDanPage from './pages/HuongDanPage';
import './App.css';

// Protected Route Component for authenticated users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Admin Route Component - redirect all authenticated users to admin dashboard
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/gioi-thieu" element={<GioiThieuPage />} />
        <Route path="/quy-trinh" element={<QuyTrinhThuTucPage />} />
        <Route path="/tai-bieu-mau" element={<TaiBieuMauPage />} />
        <Route path="/huong-dan" element={<HuongDanPage />} />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route 
          path="/duyet-ho-so" 
          element={
            <ProtectedRoute>
              <DashboardNguoiDuyet />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vien-chuc" 
          element={
            <ProtectedRoute>
              <DashboardVienChuc />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/thong-tin-ca-nhan" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tao-ho-so" 
          element={
            <ProtectedRoute>
              <CreateHoSoPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
