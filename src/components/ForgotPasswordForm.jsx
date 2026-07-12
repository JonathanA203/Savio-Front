import React, { useState } from 'react';
// Importamos el ícono desde react-icons (usando la colección de Ionicons 5)
import { IoMailOutline } from 'react-icons/io5';

export default function ForgotPasswordForm({ onNavigate, onCodeSent }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // MOCK: Simulamos el tiempo de respuesta del servidor (1.5 segundos)
    setTimeout(() => {
      // Cuando conectes esto a tu backend en C# (similar a la lógica que 
      // estructuraste en SAVIO para manejar 2FA), aquí harías el POST al 
      // endpoint que genera y despacha el código por correo.
      
      setIsLoading(false);
      onCodeSent(); // Notificamos al AuthManager que cambie a la vista OTP
    }, 1500);
  };

  return (
    <div className="form-box">
      <h2 style={{ color: 'var(--text-dark)', textAlign: 'center', marginBottom: '10px' }}>
        Recuperar Contraseña
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
        Ingresa tu correo para recibir un código de verificación.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="input-group" style={{ position: 'relative', marginBottom: '20px' }}>
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
              style={{ 
                width: '100%', 
                padding: '10px 0', 
                border: 'none', 
                outline: 'none',
                background: 'transparent'
              }}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          {isLoading ? 'Enviando código...' : 'Enviar Código'}
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
            ← Volver al Login
          </a>
        </div>
      </form>
    </div>
  );
}