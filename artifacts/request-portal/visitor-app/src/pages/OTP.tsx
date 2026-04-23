import React, { useState } from 'react';

interface OTPProps {
  onBack?: () => void;
  phoneNumber?: string;
}

export default function OTP({ onBack, phoneNumber = '966' }: OTPProps) {
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
      if (onBack) {
        onBack();
      }
    }, 1500);
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    alert('تم إعادة إرسال الكود');
    const firstInput = document.querySelector('[data-otp-index="0"]') as HTMLInputElement;
    firstInput?.focus();
  };

  // Format phone number to show masked version
  const maskedPhone = phoneNumber.replace(/\d(?=\d{2})/g, '*');

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
        {onBack && (
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
        )}

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
          أدخل رمز التحقق المرسل إلى هاتفك +{maskedPhone}
        </p>

        {/* Form */}
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
                  fontFamily: 'inherit',
                }}
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
                جاري التحقق...
              </>
            ) : (
              'تأكيد'
            )}
          </button>

          {/* Resend Link */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>
              لم تستقبل الكود؟{' '}
              <button
                type="button"
                onClick={handleResend}
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
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
