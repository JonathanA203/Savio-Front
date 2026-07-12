import React, { useState, useEffect } from 'react';
import { 
  IoCloudUploadOutline, 
  IoLockClosedOutline, 
  IoCloseOutline, 
  IoKeypadOutline,
  IoCheckmarkCircleOutline,
  IoRefreshOutline
} from 'react-icons/io5';
import { apiFetch } from '../services/api'; 

export default function Settings() {
  const [userData, setUserData] = useState(null);
  const [isFetchingData, setIsFetchingData] = useState(true);
  
  // Estados para el flujo de cambio de contraseña
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Estados del formulario del Modal
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // 1. Cargar los datos del usuario al montar el componente
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsFetchingData(true);
    try {
      const response = await apiFetch('/api/User/user-data', {
        method: 'GET'
      });
      setUserData(response.contentData);
    } catch (err) {
      console.error("Error al cargar datos del usuario:", err.message);
    } finally {
      setIsFetchingData(false);
    }
  };

  // 2. Solicitar OTP al correo
  const handleOpenPasswordModal = async () => {
    setIsSendingOtp(true);
    try {
      const response = await apiFetch('/api/Email/otp-password/code', { 
        method: 'POST' 
        // Sin body, según tus especificaciones
      });
      
      if (response.success) {
        setNewPassword('');
        setConfirmNewPassword('');
        setOtpCode('');
        setError('');
        setSuccessMessage('');
        setIsModalOpen(true);
      }
    } catch (err) {
      alert(err.message || "No se pudo enviar el código de seguridad.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 3. Verificar OTP y cambiar contraseña
  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (otpCode.length !== 6) {
      setError('El código OTP debe ser de 6 dígitos.');
      return;
    }

    setIsVerifying(true);

    const payload = {
      otp: otpCode,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword
    };

    try {
      const response = await apiFetch('/api/Auth/otp-password/verify', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      setSuccessMessage(response.message || 'Contraseña actualizada correctamente.');
      
      // Cerramos el modal automáticamente después de 2 segundos de éxito
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMessage('');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Error al actualizar la contraseña.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtpCode(value);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Configuración</h1>
          <button style={styles.refreshBtn} onClick={fetchUserData} disabled={isFetchingData}>
            <IoRefreshOutline style={{ animation: isFetchingData ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>
        
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Cuenta</h2>
          
          {isFetchingData && !userData ? (
            <p style={{ color: 'var(--secondary)' }}>Cargando datos de tu perfil...</p>
          ) : (
            <>
              {/* Avatar Dinámico generado por el nombre del usuario */}
              <div style={styles.avatarSection}>
                <img 
                  src={`https://ui-avatars.com/api/?name=${userData?.userName || 'User'}&background=random&size=150`} 
                  alt="Avatar" 
                  style={styles.avatarImage} 
                />
                <button style={styles.uploadBtn}>
                  <IoCloudUploadOutline style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                  Cambiar Foto
                </button>
              </div>

              {/* Formulario Read-Only con datos del backend */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre de Usuario:</label>
                <input 
                  type="text" 
                  value={userData?.userName || ''} 
                  disabled 
                  style={styles.inputReadonly} 
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Correo Electrónico:</label>
                <input 
                  type="email" 
                  value={userData?.emialUser || ''} // Mapeo exacto de tu backend
                  disabled 
                  style={styles.inputReadonly} 
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Rol en el Sistema:</label>
                <input 
                  type="text" 
                  value={userData?.roleUser || ''} 
                  disabled 
                  style={styles.inputReadonly} 
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Contraseña:</label>
                <div style={styles.passwordRow}>
                  <input 
                    type="password" 
                    value="********" 
                    disabled 
                    style={{ ...styles.inputReadonly, flex: 1, marginBottom: 0 }} 
                  />
                  <button 
                    style={{ ...styles.changePasswordBtn, opacity: isSendingOtp ? 0.7 : 1 }} 
                    onClick={handleOpenPasswordModal}
                    disabled={isSendingOtp}
                  >
                    {isSendingOtp ? 'Enviando OTP...' : 'Cambiar Contraseña'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL DE SEGURIDAD PARA CAMBIO DE CONTRASEÑA */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, color: 'var(--sidebar-bg)' }}>Actualizar Contraseña</h3>
              <button style={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <IoCloseOutline />
              </button>
            </div>
            
            <div style={styles.modalBody}>
              {successMessage ? (
                <div style={styles.successState}>
                  <IoCheckmarkCircleOutline style={{ fontSize: '4rem', color: 'var(--primary)' }} />
                  <h3 style={{ color: 'var(--text-dark)' }}>¡Éxito!</h3>
                  <p style={{ color: 'var(--secondary)' }}>{successMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitPasswordChange}>
                  <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                    Hemos enviado un código de seguridad a tu correo. Ingrésalo junto con tu nueva contraseña.
                  </p>

                  {error && (
                    <p style={{ color: '#d32f2f', fontSize: '0.85rem', marginBottom: '15px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '6px' }}>
                      {error}
                    </p>
                  )}

                  <div style={styles.inputGroup}>
                    <label style={styles.modalLabel}>Nueva Contraseña</label>
                    <div style={styles.inputWrapper}>
                      <IoLockClosedOutline style={styles.inputIcon} />
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        style={styles.modalInput}
                      />
                    </div>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.modalLabel}>Confirmar Contraseña</label>
                    <div style={styles.inputWrapper}>
                      <IoLockClosedOutline style={styles.inputIcon} />
                      <input 
                        type="password" 
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        style={styles.modalInput}
                      />
                    </div>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.modalLabel}>Código OTP (6 dígitos)</label>
                    <div style={styles.inputWrapper}>
                      <IoKeypadOutline style={styles.inputIcon} />
                      <input 
                        type="text" 
                        value={otpCode}
                        onChange={handleOtpChange}
                        required
                        placeholder="000000"
                        style={{ ...styles.modalInput, letterSpacing: '3px' }}
                      />
                    </div>
                  </div>

                  <div style={styles.modalFooter}>
                    <button type="button" style={styles.cancelBtn} onClick={() => setIsModalOpen(false)} disabled={isVerifying}>
                      Cancelar
                    </button>
                    <button type="submit" style={{ ...styles.saveBtn, opacity: isVerifying ? 0.7 : 1 }} disabled={isVerifying}>
                      {isVerifying ? 'Verificando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Estilos del Componente
const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '20px 0' },
  card: { backgroundColor: 'var(--white)', width: '100%', maxWidth: '800px', padding: '40px 50px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid rgba(164, 166, 165, 0.2)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { color: 'var(--text-dark)', fontSize: '2rem', margin: 0 },
  refreshBtn: { background: 'none', border: 'none', color: 'var(--primary)', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  section: { marginBottom: '30px' },
  sectionTitle: { color: 'var(--text-dark)', fontSize: '1.2rem', marginBottom: '20px', borderBottom: '2px solid #E6E6E6', paddingBottom: '10px' },
  avatarSection: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  avatarImage: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)', padding: '2px' },
  uploadBtn: { display: 'flex', alignItems: 'center', backgroundColor: '#3B82F6', color: 'var(--white)', border: 'none', padding: '10px 20px', borderRadius: '25px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', color: 'var(--text-dark)', fontSize: '0.95rem', fontWeight: '600', marginBottom: '8px' },
  inputReadonly: { width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #E6E6E6', backgroundColor: '#F7F8FA', color: 'var(--secondary)', fontSize: '1rem', outline: 'none' },
  passwordRow: { display: 'flex', gap: '15px', alignItems: 'center' },
  changePasswordBtn: { backgroundColor: 'var(--primary)', color: 'var(--white)', border: 'none', padding: '12px 25px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'var(--white)', width: '100%', maxWidth: '450px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #E6E6E6' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--secondary)' },
  modalBody: { padding: '20px' },
  inputGroup: { marginBottom: '15px' },
  modalLabel: { display: 'block', marginBottom: '5px', color: 'var(--text-dark)', fontWeight: '600', fontSize: '0.9rem' },
  inputWrapper: { display: 'flex', alignItems: 'center', border: '1px solid var(--secondary)', borderRadius: '8px', padding: '0 10px', backgroundColor: 'var(--white)' },
  inputIcon: { color: 'var(--secondary)', fontSize: '1.2rem', marginRight: '8px' },
  modalInput: { width: '100%', padding: '10px 0', border: 'none', outline: 'none', background: 'transparent', fontSize: '1rem' },
  modalFooter: { marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  cancelBtn: { padding: '10px 20px', borderRadius: '8px', border: '1px solid #ccc', background: 'var(--white)', cursor: 'pointer', fontWeight: '600', color: 'var(--text-dark)' },
  saveBtn: { padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'var(--white)', fontWeight: 'bold', cursor: 'pointer' },
  successState: { textAlign: 'center', padding: '30px 0' }
};