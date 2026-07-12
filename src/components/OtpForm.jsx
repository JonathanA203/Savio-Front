import React, { useState } from 'react';
import { IoKeypadOutline } from 'react-icons/io5';
import { apiFetch } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function OtpForm({ onNavigate, flowContext }) {
  const [otpCode, setOtpCode] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);

    const endpoint = flowContext === 'login' ? '/api/Auth/otp-login/verify' : '/api/Auth/otp-password/verify';

    try {
      const response = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ otpCode: otpCode }),
      });

      setIsLoading(false);
      setMessage(response.message); 
      setIsError(false);

      if (flowContext === 'login') {
        if (response.contentData && response.contentData.accessToken) {
           localStorage.setItem('jwt_token', response.contentData.accessToken);
        }    
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);

      } else if (flowContext === 'forgot') {
        setTimeout(() => {
          onNavigate('reset');
        }, 1500);
      }

    } catch (err) {
      setIsLoading(false);
      setIsError(true);
      setMessage(err.message);
    }
  };

  // Permite ingresar solo números y máximo 6 dígitos
  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtpCode(value);
    }
  };

  return (
    <div className="form-box">
      <h2 style={{ color: 'var(--text-dark)', textAlign: 'center', marginBottom: '10px' }}>
        Seguridad 2FA
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '20px', fontWeight: '500' }}>
        Ingresa el código enviado a tu correo.
      </p>

      {isError && (
        <p style={{ color: '#d32f2f', fontSize: '0.85rem', textAlign: 'center', marginBottom: '15px' }}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="input-group" style={{ position: 'relative', marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-dark)', fontWeight: '500', textAlign: 'center' }}>
            Código de 6 dígitos
          </label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--secondary)', borderRadius: '6px', padding: '0 10px', background: 'var(--white)', justifyContent: 'center' }}>
            <IoKeypadOutline style={{ color: 'var(--secondary)', fontSize: '1.2rem', marginRight: '8px' }} />
            <input
              type="text"
              value={otpCode}
              onChange={handleOtpChange}
              required
              autoComplete="one-time-code"
              placeholder="000000"
              style={{ 
                width: '100px', 
                padding: '12px 0', 
                border: 'none', 
                outline: 'none',
                background: 'transparent',
                fontSize: '1.2rem',
                letterSpacing: '4px',
                textAlign: 'center'
              }}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-primary"
          disabled={isLoading || otpCode.length !== 6}
          style={{ 
            opacity: (isLoading || otpCode.length !== 6) ? 0.7 : 1, 
            cursor: (isLoading || otpCode.length !== 6) ? 'not-allowed' : 'pointer' 
          }}
        >
          {isLoading ? 'Verificando...' : 'Verificar y Entrar'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('login');
            }}
            style={{ color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '500' }}
          >
            ← Cancelar y volver al Login
          </a>
        </div>
      </form>
    </div>
  );
}