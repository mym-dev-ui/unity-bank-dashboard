import React, { useState } from 'react';

export default function StepTwo() {
  const [currentPage, setCurrentPage] = useState('login');
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateLogin = () => {
    if (!loginData.email.trim()) {
      setError('البريد الإلكتروني مطلوب');
      return false;
    }
    if (!loginData.email.includes('@')) {
      setError('البريد الإلكتروني غير صحيح');
      return false;
    }
    if (!loginData.password.trim()) {
      setError('كلمة السر مطلوبة');
      return false;
    }
    if (loginData.password.length < 6) {
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
      console.log('Login:', loginData);
      setLoading(false);
      alert('تم تسجيل الدخول بنجاح');
    }, 1500);
  };

  const commonStyles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1a2240 50%, #162e4a 100%)',
      padding: '20px',
      fontFamily: "'Segoe UI', 'Arial', sans-serif",
    },
    card: {
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '20px',
      padding: '48px 32px',
      maxWidth: '440px',
      width: '100%',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    },
    logo: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '32px',
    },
    logoCircle: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
    },
    title: {
      color: '#ffffff',
      fontSize: '28px',
      fontWeight: 'bold',
      textAlign: 'center' as const,
      marginBottom: '8px',
      letterSpacing: '-0.5px',
    },
    subtitle: {
      color: '#94a3b8',
      fontSize: '14px',
      textAlign: 'center' as const,
      marginBottom: '32px',
      lineHeight: '1.6',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    label: {
      color: '#cbd5e1',
      fontSize: '14px',
      fontWeight: '500',
    },
    input: {
      background: 'rgba(30, 41, 59, 0.6)',
      border: '2px solid rgba(148, 163, 184, 0.2)',
      borderRadius: '12px',
      padding: '14px 16px',
      color: '#ffffff',
      fontSize: '15px',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      textAlign: 'right' as const,
    },
    button: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '8px',
      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)',
    },
    link: {
      color: '#3b82f6',
      fontSize: '14px',
      textAlign: 'center' as const,
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
      marginTop: '16px',
    },
    errorBox: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '8px',
      padding: '12px 14px',
      color: '#fca5a5',
      fontSize: '13px',
      textAlign: 'center' as const,
    },
  };

  return (
    <div style={commonStyles.container as React.CSSProperties}>
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

      <div style={{ ...commonStyles.card, animation: 'slideUp 0.6s ease-out' } as React.CSSProperties}>
        {/* Logo */}
        <div style={commonStyles.logo}>
          <div style={commonStyles.logoCircle}>
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

        {/* Login Page */}
        {currentPage === 'login' && (
          <>
            <h1 style={commonStyles.title}>تسجيل الدخول</h1>
            <p style={commonStyles.subtitle}>أدخل بيانات دخولك</p>

            <form onSubmit={handleLoginSubmit} style={commonStyles.form}>
              {/* Email Input */}
              <div style={commonStyles.inputGroup}>
                <label style={commonStyles.label}>البريد الإلكتروني</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="أدخل بريدك الإلكتروني"
                    style={{
                      ...commonStyles.input,
                      flex: 1,
                      border: error && !loginData.email ? '2px solid #ef4444' : '2px solid rgba(148, 163, 184, 0.2)',
                    } as React.CSSProperties}
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
              <div style={commonStyles.inputGroup}>
                <label style={commonStyles.label}>كلمة السر</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="أدخل كلمة السر"
                    style={{
                      ...commonStyles.input,
                      flex: 1,
                      border: error && !loginData.password ? '2px solid #ef4444' : '2px solid rgba(148, 163, 184, 0.2)',
                    } as React.CSSProperties}
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
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
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
                  onClick={() => setCurrentPage('changePassword')}
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
              {error && <div style={commonStyles.errorBox}>{error}</div>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...commonStyles.button,
                  opacity: loading ? 0.7 : 1,
                  background: loading ? 'rgba(59, 130, 246, 0.6)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                } as React.CSSProperties}
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
                    onClick={() => setCurrentPage('signup')}
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
          </>
        )}

        {/* Change Password Page */}
        {currentPage === 'changePassword' && <ChangePasswordPage setCurrentPage={setCurrentPage} />}

        {/* OTP Page */}
        {currentPage === 'otp' && <OTPPage setCurrentPage={setCurrentPage} />}
      </div>
    </div>
  );
}

function ChangePasswordPage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
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
      setCurrentPage('login');
    }, 1500);
  };

  const commonStyles = {
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    label: {
      color: '#cbd5e1',
      fontSize: '14px',
      fontWeight: '500',
    },
    input: {
      background: 'rgba(30, 41, 59, 0.6)',
      border: '2px solid rgba(148, 163, 184, 0.2)',
      borderRadius: '12px',
      padding: '14px 16px',
      color: '#ffffff',
      fontSize: '15px',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      textAlign: 'right' as const,
    },
  };

  return (
    <>
      <button
        onClick={() => setCurrentPage('login')}
        style={{
          background: 'none',
          border: 'none',
          color: '#3b82f6',
          fontSize: '24px',
          cursor: 'pointer',
          marginBottom: '16px',
        }}
      >
        ←
      </button>

      <h1 style={{ color: '#ffffff', fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Security Code Input */}
        <div style={commonStyles.inputGroup}>
          <label style={commonStyles.label}>رمز الأمان</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              name="securityCode"
              value={formData.securityCode}
              onChange={handleChange}
              placeholder="أدخل رمز الأمان"
              style={{ ...commonStyles.input, flex: 1 } as React.CSSProperties}
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
        <div style={commonStyles.inputGroup}>
          <label style={commonStyles.label}>كلمة المرور الجديدة</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type={showPasswords.new ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="أدخل كلمة المرور الجديدة"
              style={{ ...commonStyles.input, flex: 1 } as React.CSSProperties}
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
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div style={commonStyles.inputGroup}>
          <label style={commonStyles.label}>تأكيد كلمة المرور</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="أدخل كلمة المرور مجددا"
              style={{ ...commonStyles.input, flex: 1 } as React.CSSProperties}
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
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
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
          } as React.CSSProperties}
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
    </>
  );
}

function OTPPage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOTPChange = (value: string, index: number) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.querySelector(`[data-otp-index="${index + 1}"]`) as HTMLInputElement;
      nextInput?.focus();
    }
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`[data-otp-index="${index - 1}"]`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const validateOtp = () => {
    if (otp.some(digit => !digit)) {
      setError('يرجى إدخال الكود الكامل');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOtp()) return;

    setLoading(true);
    setTimeout(() => {
      console.log('OTP:', otp.join(''));
      setLoading(false);
      alert('تم التحقق بنجاح');
      setCurrentPage('login');
    }, 1500);
  };

  return (
    <>
      <button
        onClick={() => setCurrentPage('login')}
        style={{
          background: 'none',
          border: 'none',
          color: '#3b82f6',
          fontSize: '24px',
          cursor: 'pointer',
          marginBottom: '16px',
        }}
      >
        ←
      </button>

      <h1 style={{ color: '#ffffff', fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>
        التحقق من الهوية
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
        قم بإدخال رمز التحقق المرسول إلى **199
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* OTP Boxes */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexDirection: 'row-reverse' }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              data-otp-index={index}
              value={digit}
              onChange={(e) => handleOTPChange(e.currentTarget.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength={1}
              style={{
                width: '50px',
                height: '50px',
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                background: 'rgba(30, 41, 59, 0.6)',
                border: error ? '2px solid #ef4444' : '2px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                color: '#ffffff',
                outline: 'none',
                transition: 'all 0.3s ease',
              } as React.CSSProperties}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          ))}
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
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: loading ? 'none' : '0 10px 25px rgba(59, 130, 246, 0.2)',
          } as React.CSSProperties}
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
              جاري التحقق...
            </>
          ) : (
            'تأكيد'
          )}
        </button>

        {/* Resend Link */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => alert('تم إعادة الإرسال')}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            إعادة الإرسال
          </button>
        </div>
      </form>
    </>
  );
}
