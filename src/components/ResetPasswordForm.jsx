import React, { useState } from 'react';
import { IoLockClosedOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

export default function ResetPasswordForm({ onNavigate }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validación 1: Coincidencia
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden. Verifica e intenta de nuevo.');
      return;
    }

    // Validación 2: Longitud mínima (opcional pero recomendada)
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    // MOCK: Simulamos la actualización en la base de datos
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true); // Activamos la vista de éxito

      // Redirigimos automáticamente al Login después de 2.5 segundos
      setTimeout(() => {
        onNavigate('login');
      }, 2500);
    }, 1500);
  };

  // Si el cambio fue exitoso, mostramos un mensaje de confirmación elegante
  if (isSuccess) {
    return (
      <div className="form-box" style={{ textAlign: 'center', padding: '20px 0' }}>
        <IoCheckmarkCircleOutline style={{ color: 'var(--primary)', fontSize: '4rem', marginBottom: '10px' }} />
        <h2 style={{ color: 'var(--text-dark)', marginBottom: '10px' }}>¡Contraseña Actualizada!</h2>
        <p style={{ color: 'var(--secondary)', fontSize: '0.95rem' }}>
          Tu contraseña ha sido reestablecida con éxito. Redirigiendo al inicio de sesión...
        </p>
      </div>
    );
  }

  return (
    <div className="form-box">
      <h2 style={{ color: 'var(--text-dark)', textAlign: 'center', marginBottom: '10px' }}>
        Nueva Contraseña
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
        Ingresa y confirma tu nueva credencial de acceso.
      </p>

      {error && (
        <p style={{ color: '#d32f2f', fontSize: '0.85rem', textAlign: 'center', marginBottom: '15px' }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Input: Nueva Contraseña */}
        <div className="input-group" style={{ position: 'relative', marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-dark)', fontWeight: '500' }}>
            Nueva Contraseña
          </label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--secondary)', borderRadius: '6px', padding: '0 10px', background: 'var(--white)' }}>
            <IoLockClosedOutline style={{ color: 'var(--secondary)', fontSize: '1.2rem', marginRight: '8px' }} />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="••••••••"
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

        {/* Input: Confirmar Contraseña */}
        <div className="input-group" style={{ position: 'relative', marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-dark)', fontWeight: '500' }}>
            Confirmar Contraseña
          </label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--secondary)', borderRadius: '6px', padding: '0 10px', background: 'var(--white)' }}>
            <IoLockClosedOutline style={{ color: 'var(--secondary)', fontSize: '1.2rem', marginRight: '8px' }} />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
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
          {isLoading ? 'Actualizando...' : 'Reestablecer Contraseña'}
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