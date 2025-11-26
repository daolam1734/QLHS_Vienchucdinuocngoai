import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import ServicesSection from '../components/ServicesSection';
import ProcessTimeline from '../components/ProcessTimeline';
import DocumentsSection from '../components/DocumentsSection';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleLoginSuccess = (user: any) => {
    console.log('Login successful:', user);
    // Admin goes to admin dashboard, regular users to user dashboard
    if (user.ma_vai_tro === 'VT_ADMIN') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
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

  return (
    <div className="homepage">
      <Header />
      <main className="main-content">
        <HeroBanner onLoginClick={() => setShowLoginModal(true)} />
        <ServicesSection />
        <ProcessTimeline />
        <DocumentsSection />
      </main>
      <Footer />
      
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
    </div>
  );
}

export default HomePage;
