// src/components/AuthManager.jsx
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import OtpForm from './OtpForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';

export default function AuthManager() {
  // Posibles estados: 'login', 'register', 'otp', 'forgot', 'reset'
  const [currentView, setCurrentView] = useState('login');
  
  // Guardamos de dónde venimos para saber a dónde ir después del OTP
  const [flowContext, setFlowContext] = useState(''); 

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginForm 
            onNavigate={setCurrentView} 
            onLoginSuccess={() => {
              setFlowContext('login');
              setCurrentView('otp');
            }} 
          />
        );
      case 'register':
        return <RegisterForm onNavigate={setCurrentView} />;
      case 'forgot':
        return (
          <ForgotPasswordForm 
            onNavigate={setCurrentView}
            onCodeSent={() => {
              setFlowContext('forgot');
              setCurrentView('otp');
            }}
          />
        );
      case 'otp':
        return (
          <OtpForm 
            onNavigate={setCurrentView}
            flowContext={flowContext}
          />
        );
      case 'reset':
        return <ResetPasswordForm onNavigate={setCurrentView} />;
      default:
        return <LoginForm onNavigate={setCurrentView} />;
    }
  };

  return (
    // Aquí está el cambio: Envolvemos el wrapper en el nuevo contenedor
    <div className="auth-page-container">
      <div className="auth-wrapper">
        {renderView()}
      </div>
    </div>
  );
}