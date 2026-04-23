import React, { useState } from 'react';

export default function StepOne() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    idNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('الاسم الكامل مطلوب');
      return false;
    }
    if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 7) {
      setError('رقم الجوال غير صحيح');
      return false;
    }
    if (!formData.idNumber.trim()) {
      setError('رقم الهوية مطلوب');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setLoading(false);
      alert('تم تقديم النموذج بنجاح');
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
        className="form-container"
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '20px',
          padding: '48px 32px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Logo */}
        <div
          className="logo-wrapper"
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
          إنشاء حساب
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
          أدخل بيانات التسجيل الأساسية
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Full Name Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              style={{
                color: '#cbd5e1',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              الاسم الكامل
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="أدخل اسمك الكامل"
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: `2px solid ${error && !formData.fullName ? '#ef4444' : 'rgba(148, 163, 184, 0.2)'}`,
                borderRadius: '12px',
                padding: '14px 16px',
                color: '#ffffff',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                if (!error) {
                  e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                }
              }}
            />
          </div>

          {/* Phone Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              style={{
                color: '#cbd5e1',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              رقم الجوال
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="أدخل رقم الجوال"
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: `2px solid ${error && !formData.phoneNumber ? '#ef4444' : 'rgba(148, 163, 184, 0.2)'}`,
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
                if (!error) {
                  e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                }
              }}
            />
          </div>

          {/* ID Number Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              style={{
                color: '#cbd5e1',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              رقم الهوية
            </label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder="أدخل رقم الهوية"
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: `2px solid ${error && !formData.idNumber ? '#ef4444' : 'rgba(148, 163, 184, 0.2)'}`,
                borderRadius: '12px',
                padding: '14px 16px',
                color: '#ffffff',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                if (!error) {
                  e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                }
              }}
            />
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
              'التسجيل'
            )}
          </button>
        </form>

        {/* Footer Text */}
        <p
          style={{
            color: '#64748b',
            fontSize: '12px',
            textAlign: 'center',
            marginTop: '24px',
            lineHeight: '1.6',
          }}
        >
          بالتسجيل، أنت توافق على الشروط والأحكام
        </p>
      </div>
    </div>
  );
}
