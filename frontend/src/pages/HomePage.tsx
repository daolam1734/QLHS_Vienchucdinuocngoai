import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import ServicesSection from '../components/ServicesSection';
import ProcessTimeline from '../components/ProcessTimeline';
import DocumentsSection from '../components/DocumentsSection';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import ProfileCompletionModal from '../components/ProfileCompletionModal';
import LoadingOverlay from '../components/LoadingOverlay';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showProfileCompletionModal, setShowProfileCompletionModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [dashboardKey, setDashboardKey] = useState(0); // Key để force re-render dashboard

  useEffect(() => {
    // Function to check and update auth state
    const checkAuthState = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        try {
          const userData = JSON.parse(user);
          console.log('HomePage - User data from localStorage:', userData);
          setIsLoggedIn(true);
          setUserInfo(userData);
          
          // Auto redirect to appropriate dashboard
          if (window.location.pathname === '/') {
            if (userData.role === 'Admin') {
              console.log('HomePage - Redirecting Admin to /admin');
              setIsNavigating(true);
              setTimeout(() => navigate('/admin'), 100);
            } else if (userData.role === 'VienChuc') {
              console.log('HomePage - Redirecting VienChuc to /vien-chuc');
              setIsNavigating(true);
              setTimeout(() => navigate('/vien-chuc'), 100);
            } else if (userData.role === 'NguoiDuyet') {
              console.log('HomePage - Redirecting NguoiDuyet to /duyet-ho-so');
              setIsNavigating(true);
              setTimeout(() => navigate('/duyet-ho-so'), 100);
            }
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };
    
    // Check immediately
    checkAuthState();
    
    // Listen for storage changes (from other tabs or manual updates)
    window.addEventListener('storage', checkAuthState);
    
    return () => {
      window.removeEventListener('storage', checkAuthState);
    };
  }, [navigate]);

  // Additional useEffect to debug state changes
  useEffect(() => {
    console.log('HomePage - State changed:', {
      isLoggedIn,
      userRole: userInfo?.role,
      dashboardKey
    });
  }, [isLoggedIn, userInfo, dashboardKey]);

  const handleLoginSuccess = (user: any) => {
    console.log('HomePage - Login successful:', user);
    console.log('HomePage - isFirstLogin:', user.isFirstLogin);
    console.log('HomePage - role:', user.role);
    
    // Check if first login - MUST change password before accessing dashboard
    if (user.isFirstLogin) {
      console.log('HomePage - First login detected, showing change password modal');
      setCurrentUser(user);
      setIsLoggedIn(false); // Don't log in yet
      setUserInfo(null);
      setIsNavigating(false);
      setShowChangePasswordModal(true);
      return; // Stop here, don't proceed to dashboard
    }
    
    // Set all states immediately for successful login
    setCurrentUser(user);
    setIsLoggedIn(true);
    setUserInfo(user);
    console.log('HomePage - States set, isLoggedIn=true, userInfo=', user);
    
    // Show loading and navigate to appropriate dashboard
    console.log('HomePage - Navigating to dashboard for role:', user.role);
    setIsNavigating(true);
    setTimeout(() => {
      redirectByRole(user);
      // Clear loading after navigation
      setTimeout(() => setIsNavigating(false), 500);
    }, 200);
  };

  const redirectByRole = (user: any) => {
    console.log('HomePage - redirectByRole called with role:', user.role);
    // Redirect based on role
    if (user.role === 'Admin') {
      navigate('/admin');
    } else if (user.role === 'VienChuc') {
      navigate('/vien-chuc');
    } else if (user.role === 'NguoiDuyet') {
      navigate('/duyet-ho-so');
    } else {
      setIsNavigating(false);
    }
  };

  const handleChangePasswordSuccess = () => {
    console.log('HomePage - Password changed successfully');
    setShowChangePasswordModal(false);
    
    // Update user data in localStorage to set isFirstLogin = false
    if (currentUser) {
      const updatedUser = { ...currentUser, isFirstLogin: false };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setUserInfo(updatedUser);
      
      // Check if profile needs completion (VienChuc only)
      if (updatedUser.role === 'VienChuc' && !updatedUser.isProfileCompleted) {
        console.log('HomePage - VienChuc needs to complete profile');
        setShowProfileCompletionModal(true);
        return;
      }
      
      // For VienChuc with complete profile or other roles, navigate to dashboard
      setIsNavigating(true);
      setTimeout(() => {
        redirectByRole(updatedUser);
        setTimeout(() => setIsNavigating(false), 500);
      }, 200);
    }
  };

  const handleProfileCompletionSuccess = () => {
    console.log('HomePage - Profile completed successfully');
    setShowProfileCompletionModal(false);
    
    if (currentUser) {
      const updatedUser = { ...currentUser, isProfileCompleted: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setUserInfo(updatedUser);
      
      // Navigate to dashboard
      setIsNavigating(true);
      setTimeout(() => {
        redirectByRole(updatedUser);
        setTimeout(() => setIsNavigating(false), 500);
      }, 200);
    }
  };

  const handleForgotPassword = () => {
    // Quick fade out LoginModal
    const loginOverlay = document.querySelector('.login-modal-overlay') as HTMLElement;
    if (loginOverlay) {
      loginOverlay.style.transition = 'opacity 0.25s ease-out';
      loginOverlay.style.opacity = '0';
    }
    // Start showing new modal while old one is fading
    setTimeout(() => {
      setShowLoginModal(false);
      setShowForgotPasswordModal(true);
    }, 150);
  };

  const handleBackToLogin = () => {
    // Quick fade out ForgotPasswordModal
    const forgotOverlay = document.querySelector('.forgot-password-modal-overlay') as HTMLElement;
    if (forgotOverlay) {
      forgotOverlay.style.transition = 'opacity 0.25s ease-out';
      forgotOverlay.style.opacity = '0';
    }
    // Start showing new modal while old one is fading
    setTimeout(() => {
      setShowForgotPasswordModal(false);
      setShowLoginModal(true);
    }, 150);
  };

  console.log('HomePage - Current render state:', { 
    isLoggedIn, 
    role: userInfo?.role
  });

  return (
    <>
      {isNavigating && <LoadingOverlay message="Đang chuyển hướng..." />}
      
      <div className="homepage">
        <Header />
        <main className="main-content">
          <HeroBanner onLoginClick={() => setShowLoginModal(true)} />
          <ProcessTimeline />
          <ServicesSection />
          <DocumentsSection />
        </main>
        <Footer />
      </div>
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        onForgotPassword={handleForgotPassword}
      />

      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onOpenLogin={handleBackToLogin}
      />

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSuccess={handleChangePasswordSuccess}
        userEmail={currentUser?.email}
        isFirstLogin={currentUser?.isFirstLogin}
      />

      <ProfileCompletionModal
        isOpen={showProfileCompletionModal}
        onClose={() => setShowProfileCompletionModal(false)}
        onComplete={handleProfileCompletionSuccess}
        userEmail={currentUser?.email}
      />
    </>
  );
}

export default HomePage;
