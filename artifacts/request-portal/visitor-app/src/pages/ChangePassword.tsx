import React, { useState } from 'react';

interface ChangePasswordProps {
  onBack?: () => void;
}

export default function ChangePassword({ onBack }: ChangePasswordProps) {
  const [formData, setFormData] = useState({
    securityCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswords, setShowPasswords] = useState({ new: false, confirm: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.securityCode.trim()) {
      setError('رمز الأمان مطلوب');
      return false;
    }
    if (!formData.newPassword.trim()) {
      setError('كلمة المرور الجديدة مطلوبة');
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setTimeout(() => {
      console.log('Password changed:', formData);
      setLoading(false);
      alert('تم تغيير كلمة المرور بنجاح');
      if (onBack) {
        onBack();
      }
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
        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#3b82f6',
            fontSize: '24px',
            cursor: 'pointer',
            marginBottom: '16px',
            padding: 0,
          }}
        >
          ←
        </button>

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
          تغيير كلمة المرور
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
          أدخل كلمة السر الجديدة ورمز الأمان الخاص بك
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Security Code Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              style={{
                color: '#cbd5e1',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              رمز الأمان
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                name="securityCode"
                value={formData.securityCode}
                onChange={handleChange}
                placeholder="أدخل رمز الأمان"
                style={{
                  flex: 1,
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: error && !formData.securityCode ? '2px solid #ef4444' : '2px solid rgba(148, 163, 184, 0.2)',
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
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
          </div>

          {/* New Password Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              style={{
                color: '#cbd5e1',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              كلمة المرور الجديدة
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="أدخل كلمة المرور الجديدة"
                style={{
                  flex: 1,
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: error && !formData.newPassword ? '2px solid #ef4444' : '2px solid rgba(148, 163, 184, 0.2)',
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
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {showPasswords.new ? (
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

          {/* Confirm Password Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              style={{
                color: '#cbd5e1',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              تأكيد كلمة المرور
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="أدخل كلمة المرور مجددا"
                style={{
                  flex: 1,
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: error && !formData.confirmPassword ? '2px solid #ef4444' : '2px solid rgba(148, 163, 184, 0.2)',
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
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {showPasswords.confirm ? (
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
              'تغيير كلمة المرور'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
