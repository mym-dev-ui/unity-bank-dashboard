import React, { useState } from 'react';

interface StepTwoProps {
  onPrevious?: () => void;
}

export default function StepTwo({ onPrevious }: StepTwoProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateLogin = () => {
    if (!formData.email.trim()) {
      setError('البريد الإلكتروني مطلوب');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('البريد الإلكتروني غير صحيح');
      return false;
    }
    if (!formData.password.trim()) {
      setError('كلمة السر مطلوبة');
      return false;
    }
    if (formData.password.length < 6) {
      setError('كلمة السر يجب أن تكون 6 أحرف على الأقل');
      return false;
    }
    return true;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setLoading(true);
    setTimeout(() => {
      console.log('Login:', formData);
      setLoading(false);
      alert('تم تسجيل الدخول بنجاح');
    }, 1500);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1a2240 50%, #162e4a 100%)',
        padding: '20px',
        fontFamily: "'Segoe UI', 'Arial', sans-serif",
      }}
    >
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .form-container {
          animation: slideUp 0.6s ease-out;
        }
        .logo-wrapper {
          animation: fadeIn 0.8s ease-out;
        }
        .spinner {
          animation: spin 0.8s linear infinite;
        }
      `}</style>

      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '20px',
          padding: '48px 32px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          animation: 'slideUp 0.6s ease-out',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
              animation: 'fadeIn 0.8s ease-out',
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            color: '#ffffff',
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '8px',
            letterSpacing: '-0.5px',
          }}
        >
          تسجيل الدخول
        </h1>

        <p
          style={{
            color: '#94a3b8',
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: '32px',
            lineHeight: '1.6',
          }}
        >
          أدخل بيانات دخولك
        </p>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              style={{
                color: '#cbd5e1',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              البريد الإلكتروني
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="أدخل بريدك الإلكتروني"
                style={{
                  flex: 1,
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: error && !formData.email ? '2px solid #ef4444' : '2px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  color: '#ffffff',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit',
                  textAlign: 'right',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 5L2 7" />
              </svg>
            </div>
          </div>

          {/* Password Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              style={{
                color: '#cbd5e1',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              كلمة السر
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="أدخل كلمة السر"
                style={{
                  flex: 1,
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: error && !formData.password ? '2px solid #ef4444' : '2px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  color: '#ffffff',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit',
                  textAlign: 'right',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => alert('سيتم نقلك إلى صفحة تغيير كلمة المرور')}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                fontSize: '13px',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              هل نسيت كلمة المرور؟ تغيير كلمة المرور
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '12px 14px',
                color: '#fca5a5',
                fontSize: '13px',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? 'rgba(59, 130, 246, 0.6)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s ease',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: loading ? 'none' : '0 10px 25px rgba(59, 130, 246, 0.2)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? (
              <>
                <div
                  className="spinner"
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTopColor: '#ffffff',
                    borderRadius: '50%',
                  }}
                />
                جاري المعالجة...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </button>

          {/* Sign Up Link */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>
              لا تملك حساب؟{' '}
              <button
                type="button"
                onClick={() => {
                  if (onPrevious) {
                    onPrevious();
                  } else {
                    alert('سيتم نقلك إلى صفحة إنشاء الحساب');
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                إنشاء حساب
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
