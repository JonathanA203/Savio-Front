import React, { useState } from 'react';
import { IoPersonOutline, IoMailOutline, IoLockClosedOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

export default function RegisterForm({ onNavigate }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validación básica en el frontend
    if (!agreeTerms) {
      setError('Debes aceptar los términos y condiciones para continuar.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    // MOCK: Simulamos la creación del usuario en el servidor
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true); // Mostramos el mensaje de éxito

      // Redirigimos al Login después de 2.5 segundos para que inicie sesión
      setTimeout(() => {
        onNavigate('login');
      }, 2500);
    }, 1500);
  };

  // Vista de éxito
  if (isSuccess) {
    return (
      <div className="form-box" style={{ textAlign: 'center', padding: '20px 0' }}>
        <IoCheckmarkCircleOutline style={{ color: 'var(--primary)', fontSize: '4rem', marginBottom: '10px' }} />
        <h2 style={{ color: 'var(--text-dark)', marginBottom: '10px' }}>¡Cuenta Creada!</h2>
        <p style={{ color: 'var(--secondary)', fontSize: '0.95rem' }}>
          Tu registro se ha completado con éxito. Redirigiendo al inicio de sesión...
        </p>
      </div>
    );
  }

  // Vista del formulario
  return (
    <div className="form-box">
      <h2 style={{ color: 'var(--text-dark)', textAlign: 'center', marginBottom: '10px' }}>
        Registro
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
        Crea una cuenta para acceder a la plataforma.
      </p>

      {error && (
        <p style={{ color: '#d32f2f', fontSize: '0.85rem', textAlign: 'center', marginBottom: '15px' }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Input: Username */}
        <div className="input-group" style={{ position: 'relative', marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-dark)', fontWeight: '500' }}>
            Username
          </label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--secondary)', borderRadius: '6px', padding: '0 10px', background: 'var(--white)' }}>
            <IoPersonOutline style={{ color: 'var(--secondary)', fontSize: '1.2rem', marginRight: '8px' }} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Tu usuario"
              style={{ width: '100%', padding: '10px 0', border: 'none', outline: 'none', background: 'transparent' }}
            />
          </div>
        </div>

        {/* Input: Email */}
        <div className="input-group" style={{ position: 'relative', marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-dark)', fontWeight: '500' }}>
            Email
          </label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--secondary)', borderRadius: '6px', padding: '0 10px', background: 'var(--white)' }}>
            <IoMailOutline style={{ color: 'var(--secondary)', fontSize: '1.2rem', marginRight: '8px' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@correo.com"
              style={{ width: '100%', padding: '10px 0', border: 'none', outline: 'none', background: 'transparent' }}
            />
          </div>
        </div>

        {/* Input: Password */}
        <div className="input-group" style={{ position: 'relative', marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-dark)', fontWeight: '500' }}>
            Password
          </label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--secondary)', borderRadius: '6px', padding: '0 10px', background: 'var(--white)' }}>
            <IoLockClosedOutline style={{ color: 'var(--secondary)', fontSize: '1.2rem', marginRight: '8px' }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px 0', border: 'none', outline: 'none', background: 'transparent' }}
            />
          </div>
        </div>

        {/* Checkbox: Terms & Conditions */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
          <input 
            type="checkbox" 
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            style={{ marginRight: '8px', cursor: 'pointer' }}
          />
          <label>
            Acepto los <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>términos y condiciones</a>
          </label>
        </div>

        <button 
          type="submit" 
          className="btn-primary"
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          <p style={{ margin: 0 }}>
            ¿Ya tienes una cuenta?{' '}
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavigate('login'); }}
              style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}
            >
              Inicia sesión
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}