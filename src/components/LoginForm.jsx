// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { IoMailOutline, IoLockClosedOutline } from 'react-icons/io5';
import { apiFetch } from '../services/api';

export default function LoginForm({ onNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // 1. Bloqueamos el botón inmediatamente

    try {
      // Paso 1: Validar credenciales y obtener el token inicial
      const response = await apiFetch('/api/Auth/token', {
        method: 'POST',
        body: JSON.stringify({ 
          email: email, 
          password: password 
        })
      });

      if (response.contentData && response.contentData.accessToken) {
         localStorage.setItem('jwt_token', response.contentData.accessToken);
      }

      // Paso 2: Solo si el anterior tiene éxito, solicitamos el envío del código OTP
      await apiFetch('/api/Email/otp-login/code', {
        method: 'POST',
        body: JSON.stringify({ 
          email: email 
        })
      });

      // Paso 3: Si ambos endpoints respondieron correctamente, avanzamos a la pantalla de OTP
      onLoginSuccess();

    } catch (err) {
      // Si cualquiera de las dos peticiones falla, capturamos el error y desbloqueamos el botón
      setError(err.message || 'Credenciales incorrectas o error al enviar el código de verificación.');
      setIsLoading(false); 
    }
  };

  return (
    <div className="form-box">
      <img src="./src/assets/logoIA.png" alt="Logo" className="login-logo"/>
      <h2 style={styles.title}>Iniciar Sesión</h2>
      <p style={styles.subtitle}>Ingresa tus credenciales para recibir tu código OTP.</p>

      {/* Caja de visualización de errores */}
      {error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        
        {/* Campo de Correo */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Correo Electrónico</label>
          <div style={styles.inputWrapper}>
            <IoMailOutline style={styles.inputIcon} />
            <input
              type="email"
              required
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Campo de Contraseña */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Contraseña</label>
          <div style={styles.inputWrapper}>
            <IoLockClosedOutline style={styles.inputIcon} />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Enlace de contraseña olvidada */}
        <div style={styles.forgotRow}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('forgot');
            }}
            style={styles.forgotLink}
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        {/* Botón de envío dinámico */}
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
          style={{
            ...styles.submitBtn,
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Enviando código...' : 'Ingresar'}
        </button>

        {/* Enlace de Registro */}
        <div style={styles.registerRow}>
          <span style={{ color: 'var(--secondary)' }}>¿No tienes una cuenta? </span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('register');
            }}
            style={styles.registerLink}
          >
            Regístrate aquí
          </a>
        </div>
      </form>
    </div>
  );
}

// Estilos locales del componente
const styles = {
  title: {
    color: 'var(--text-dark)',
    textAlign: 'center',
    margin: '0 0 10px 0',
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    color: 'var(--secondary)',
    fontSize: '0.9rem',
    margin: '0 0 25px 0',
  },
  errorBox: {
    backgroundColor: '#ffebee',
    color: '#d32f2f',
    padding: '10px 15px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '0.85rem',
    border: '1px solid #ffcdd2',
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: 'var(--text-dark)',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--secondary)',
    borderRadius: '8px',
    padding: '0 12px',
    backgroundColor: 'var(--white)',
  },
  inputIcon: {
    color: 'var(--secondary)',
    fontSize: '1.2rem',
    marginRight: '10px',
  },
  input: {
    width: '100%',
    padding: '12px 0',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: '1rem',
    color: 'var(--text-dark)',
  },
  forgotRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '25px',
  },
  forgotLink: {
    color: 'var(--primary)',
    fontSize: '0.85rem',
    textDecoration: 'none',
    fontWeight: '500',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'var(--primary)',
    color: 'var(--white)',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  registerRow: {
    textAlign: 'center',
    marginTop: '25px',
    fontSize: '0.9rem',
  },
  registerLink: {
    color: 'var(--primary)',
    textDecoration: 'none',
    fontWeight: '600',
  },
};