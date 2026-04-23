import React, { useState } from 'react';
import StepOne from './pages/StepOne';
import StepTwo from './pages/StepTwo';
import ChangePassword from './pages/ChangePassword';
import OTP from './pages/OTP';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userPhone, setUserPhone] = useState('966501234567');

  const handleStepOneNext = () => {
    setCurrentStep(2);
  };

  const handleStepTwoPrevious = () => {
    setCurrentStep(1);
  };

  const handleForgotPassword = () => {
    setCurrentStep(3);
  };

  const handleChangePasswordBack = () => {
    setCurrentStep(2);
  };

  const handleVerifyOTP = () => {
    setCurrentStep(4);
  };

  const handleOTPBack = () => {
    setCurrentStep(2);
  };

  return (
    <div dir="rtl" style={{ direction: 'rtl' }}>
      {currentStep === 1 && <StepOne onNext={handleStepOneNext} />}
      {currentStep === 2 && (
        <StepTwo 
          onPrevious={handleStepTwoPrevious} 
          onForgotPassword={handleForgotPassword}
          onVerifyOTP={handleVerifyOTP}
        />
      )}
      {currentStep === 3 && <ChangePassword onBack={handleChangePasswordBack} />}
      {currentStep === 4 && <OTP onBack={handleOTPBack} phoneNumber={userPhone} />}
    </div>
  );
}
