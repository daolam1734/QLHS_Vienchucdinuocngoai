import React from 'react';
import './AuthModalBanner.css';

interface AuthModalBannerProps {
  title?: string;
  subtitle?: string;
  features?: string[];
}

const AuthModalBanner: React.FC<AuthModalBannerProps> = ({
  title = 'Hệ Thống Quản Lý',
  subtitle = 'Viên Chức Đi Nước Ngoài',
  features = [
    'Quản lý hồ sơ viên chức',
    'Theo dõi tiến độ công tác',
    'Báo cáo và thống kê',
    'Bảo mật và an toàn'
  ]
}) => {
  return (
    <div className="auth-modal-banner">
      {/* Decorative Background Elements */}
      <div className="banner-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>

      {/* Banner Content */}
      <div className="banner-content">
        {/* Logo */}
        <div className="banner-logo">
          <img 
            src="/tvu-logo.png" 
            alt="TVU Logo" 
            onError={(e) => {
              // Fallback SVG logo if image not found
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="120" height="120" rx="20" fill="white"/>
                    <path d="M30 40h60v8H30v-8zm15 20h30v8H45v-8zm10 20h20v8H55v-8z" fill="#1976D2"/>
                    <circle cx="60" cy="30" r="8" fill="#1976D2"/>
                  </svg>
                `;
              }
            }}
          />
        </div>

        {/* Titles */}
        <h1 className="banner-title">{title}</h1>
        <p className="banner-subtitle">{subtitle}</p>

        {/* Features List */}
        <div className="banner-features">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon">✓</div>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* University Info */}
        <div className="banner-footer">
          <p className="university-name">Trường Đại học Trà Vinh</p>
          <p className="university-name-en">Tra Vinh University</p>
        </div>
      </div>
    </div>
  );
};

export default AuthModalBanner;
