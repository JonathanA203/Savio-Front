import React, { useState } from 'react';
import { apiFetch } from '../services/api';

export default function LoginForm({ onNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiFetch('/api/Auth/token', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.contentData && response.contentData.accessToken) {
         localStorage.setItem('jwt_token', response.contentData.accessToken);
      }

      await apiFetch('/api/Email/otp-login/code', {
        method: 'POST',
        body: JSON.stringify({ email: email }), 
      });

      setIsLoading(false);
      onLoginSuccess();
      
    } catch (err) {
      setIsLoading(false);
      setError(err.message); 
    }
  };

  return (
    <div className="form-box">
      <img src="./src/assets/logoIA.png" alt="Logo" className="login-logo"/>
      <h2 style={{ color: 'var(--text-dark)', textAlign: 'center' }}>Iniciar Sesión</h2>
      <p className="login-subtitle">Bienvenido de vuelta </p>
      
      {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
          />
        </div>
        
        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
          />
        </div>

        <div className="actions" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.9rem' }}>
          <label>
            <input type="checkbox" /> Recordarme
          </label>
        </div>

        <button type="submit" className="btn-primary">Ingresar</button>

        <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>
          <p>
            ¿No tienes una cuenta?, Solicita acceso a través de tu administrador.
          </p>
        </div>
      </form>
    </div>
  );
}