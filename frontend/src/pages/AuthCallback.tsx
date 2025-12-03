/**
 * Auth Callback Handler
 * Xử lý callback từ SSO authentication trong LoginModal
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Get code and state from URL
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const state = params.get('state');

      if (!code || !state) {
        throw new Error('Thiếu thông tin xác thực');
      }

      // Exchange code for token
      const response = await axios.post(`${API_URL}/auth/sso/callback`, {
        code,
        state
      });

      if (response.data.success) {
        // Store token and user info
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Redirect based on role
        const user = response.data.user;
        setTimeout(() => {
          if (user.role === 'Admin') {
            navigate('/admin', { replace: true });
          } else if (user.role === 'VienChuc') {
            navigate('/', { replace: true });
          } else if (user.role === 'NguoiDuyet') {
            navigate('/duyet-ho-so', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }, 1000);
      }
    } catch (err: any) {
      console.error('Callback error:', err);
      setError(err.response?.data?.message || 'Xử lý đăng nhập thất bại');
      
      // Redirect to home page after 3 seconds
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {error ? (
          <>
            <AlertCircle size={48} color="#ef5350" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '20px', marginBottom: '12px', color: '#333' }}>
              Đăng nhập thất bại
            </h2>
            <p style={{ color: '#666', marginBottom: '8px' }}>{error}</p>
            <p style={{ fontSize: '14px', color: '#999' }}>
              Đang chuyển về trang chủ...
            </p>
          </>
        ) : (
          <>
            <Loader size={48} color="#1976D2" style={{ 
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite'
            }} />
            <h2 style={{ fontSize: '20px', marginBottom: '12px', color: '#333' }}>
              Đang xử lý đăng nhập...
            </h2>
            <p style={{ color: '#666' }}>Vui lòng đợi trong giây lát</p>
          </>
        )}
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthCallback;
