import React, { useState } from 'react';
import StepOne from './pages/StepOne';
import StepTwo from './pages/StepTwo';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  return (
    <div dir="rtl" style={{ direction: 'rtl' }}>
      {currentStep === 1 && <StepOne onNext={handleNextStep} />}
      {currentStep === 2 && <StepTwo onPrevious={handlePreviousStep} />}
    </div>
  );
}
