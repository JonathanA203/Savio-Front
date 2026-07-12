import React, { useState, useEffect } from 'react';
import { IoAddOutline, IoCloseOutline, IoPencilOutline, IoRefreshOutline } from 'react-icons/io5';
import { apiFetch } from '../services/api'; 

export default function Collaborators() {
  const [collaborators, setCollaborators] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  
  // Control de Modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  
  // Datos para el cambio de rol
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('3'); 

  // Estado del Formulario de Registro
  const [formData, setFormData] = useState({
    name: '',
    surename: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyId: ''
  });

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const fetchCollaborators = async () => {
    setIsFetching(true);
    try {
      const response = await apiFetch('/api/Admin/collaborators', {
        method: 'GET'
      });
      setCollaborators(response.contentData || []);
    } catch (err) {
      console.error("Error cargando colaboradores:", err.message);
    } finally {
      setIsFetching(false);
    }
  };

  const getStatusBadgeStyle = (status) => {
    const baseStyle = {
      padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem',
      fontWeight: 'bold', color: '#fff', display: 'inline-block', textAlign: 'center'
    };
    const normalizedStatus = status?.toLowerCase();
    
    switch (normalizedStatus) {
      case 'active': case 'activo': return { ...baseStyle, backgroundColor: '#81D834' }; // Verde
      case 'pendingverification': return { ...baseStyle, backgroundColor: '#1A9CDA' }; // Azul
      case 'under revision': return { ...baseStyle, backgroundColor: '#F8C134' }; // Amarillo oscuro
      case 'inactive': case 'inactivo': return { ...baseStyle, backgroundColor: '#A4A6A5' }; // Gris
      case 'banned': case 'baneado': return { ...baseStyle, backgroundColor: '#F40000' }; // Rojo
      default: return { ...baseStyle, backgroundColor: 'var(--secondary)' };
    }
  };

  // --- MANEJADORES DE REGISTRO ---
  const openAddModal = () => {
    setFormData({ name: '', surename: '', email: '', password: '', confirmPassword: '', companyId: '' });
    setError('');
    setIsAddModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiFetch('/api/User/register/new-user', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (response.contentData) {
        setCollaborators([...collaborators, response.contentData]);
      }
      setIsAddModalOpen(false);
    } catch (err) {
      setError(err.message || 'Error al registrar el usuario.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- MANEJADORES DE CAMBIO DE ROL ---
  const openRoleModal = (user) => {
    setSelectedUserId(user.userId);
    setSelectedUserName(user.userName);
    setSelectedRoleId('3'); 
    setError('');
    setIsRoleModalOpen(true);
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await apiFetch('/api/Role/change', {
        method: 'PUT',
        body: JSON.stringify({
          userId: selectedUserId,
          newRoleId: parseInt(selectedRoleId, 10)
        })
      });

      await fetchCollaborators();
      setIsRoleModalOpen(false);
    } catch (err) {
      setError(err.message || 'Error al actualizar el rol.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2 style={{ color: 'var(--sidebar-bg)', margin: 0 }}>Collaborator Details</h2>
          <button style={styles.refreshBtn} onClick={fetchCollaborators} disabled={isFetching}>
            <IoRefreshOutline style={{ animation: isFetching ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>
        
        <button style={styles.addButton} onClick={openAddModal}>
          <IoAddOutline style={{ fontSize: '1.2rem', marginRight: '5px' }} />
          Add Collaborator
        </button>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Collaborator</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Headquarter</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && collaborators.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Cargando colaboradores...</td></tr>
            ) : collaborators.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No hay colaboradores registrados.</td></tr>
            ) : (
              collaborators.map((user) => (
                <tr key={user.userId} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.userCell}>
                      <img src={`https://ui-avatars.com/api/?name=${user.userName}&background=random`} alt="avatar" style={styles.avatar} />
                      <span style={{ fontWeight: '500', color: 'var(--text-dark)' }}>{user.userName}</span>
                    </div>
                  </td>
                  
                  {/* Se mapea la propiedad exacta del backend (con el error tipográfico incluido) */}
                  <td style={styles.td}>{user.emialUser}</td> 
                  
                  {/* Se mapea el rol que ahora sí envía el backend */}
                  <td style={styles.td}>
                    <span style={styles.roleText}>{user.roleUser}</span>
                  </td> 
                  
                  <td style={styles.td}>N/D</td> 
                  
                  <td style={styles.td}>
                    <span style={getStatusBadgeStyle(user.statusAccount)}>{user.statusAccount || 'Desconocido'}</span>
                  </td>
                  
                  <td style={styles.td}>
                    <button type="button" style={styles.editBtn} onClick={() => openRoleModal(user)}>
                      <IoPencilOutline /> Rol
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* =========================================
          MODAL 1: REGISTRO DE USUARIO
          ========================================= */}
      {isAddModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, color: 'var(--sidebar-bg)' }}>Registrar Nuevo Usuario</h3>
              <button type="button" style={styles.closeBtn} onClick={() => setIsAddModalOpen(false)}>
                <IoCloseOutline />
              </button>
            </div>
            
            <form onSubmit={handleSaveUser}>
              <div style={styles.modalBody}>
                {error && (
                  <div style={styles.errorBox}>{error}</div>
                )}
                
                <div style={styles.row}>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label style={styles.label}>Nombre</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} style={styles.input} />
                  </div>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label style={styles.label}>Apellido</label>
                    <input type="text" name="surename" required value={formData.surename} onChange={handleInputChange} style={styles.input} />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Correo Electrónico</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} style={styles.input} />
                </div>

                <div style={styles.row}>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label style={styles.label}>Contraseña</label>
                    <input type="password" name="password" required value={formData.password} onChange={handleInputChange} style={styles.input} />
                  </div>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label style={styles.label}>Confirmar Contraseña</label>
                    <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleInputChange} style={styles.input} />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>ID de Compañía</label>
                  <input type="text" name="companyId" required value={formData.companyId} onChange={handleInputChange} style={styles.input} />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button type="button" style={styles.cancelBtn} onClick={() => setIsAddModalOpen(false)} disabled={isLoading}>Cancelar</button>
                <button type="submit" style={{ ...styles.saveBtn, opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
                  {isLoading ? 'Registrando...' : 'Registrar Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL 2: ACTUALIZACIÓN DE ROL
          ========================================= */}
      {isRoleModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, maxWidth: '400px' }}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, color: 'var(--sidebar-bg)' }}>Actualizar Rol</h3>
              <button type="button" style={styles.closeBtn} onClick={() => setIsRoleModalOpen(false)}>
                <IoCloseOutline />
              </button>
            </div>
            
            <form onSubmit={handleUpdateRole}>
              <div style={styles.modalBody}>
                {error && (
                  <div style={styles.errorBox}>{error}</div>
                )}
                
                <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Modificando accesos para: <strong>{selectedUserName}</strong>
                </p>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Seleccionar Nuevo Rol</label>
                  <select 
                    value={selectedRoleId} 
                    onChange={(e) => setSelectedRoleId(e.target.value)} 
                    style={styles.select}
                  >
                    <option value="1">TENANT_ADMIN (1)</option>
                    <option value="2">SYSTEM_ADMIN (2)</option>
                    <option value="3">TENANT_USER (3)</option>
                    <option value="4">TENANT_GUEST (4)</option>
                  </select>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button type="button" style={styles.cancelBtn} onClick={() => setIsRoleModalOpen(false)} disabled={isLoading}>
                  Cancelar
                </button>
                <button type="submit" style={{ ...styles.saveBtn, opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
                  {isLoading ? 'Guardando...' : 'Aplicar Rol'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Estilos
const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  addButton: { display: 'flex', alignItems: 'center', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.3s' },
  refreshBtn: { background: 'none', border: 'none', color: 'var(--primary)', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  tableCard: { backgroundColor: 'var(--white)', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid rgba(164, 166, 165, 0.2)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { backgroundColor: '#F7F8FA', color: 'var(--text-dark)', padding: '15px 20px', fontWeight: '600', borderBottom: '1px solid #E6E6E6' },
  tr: { borderBottom: '1px solid #E6E6E6' },
  td: { padding: '15px 20px', color: 'var(--secondary)', fontSize: '0.95rem', verticalAlign: 'middle' },
  userCell: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' },
  roleText: { color: 'var(--text-dark)', fontWeight: '500' },
  editBtn: { background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'var(--white)', width: '100%', maxWidth: '500px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #E6E6E6' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--secondary)' },
  modalBody: { padding: '20px', maxHeight: '60vh', overflowY: 'auto' }, 
  
  errorBox: { backgroundColor: '#ffebee', color: '#d32f2f', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem' },
  row: { display: 'flex', gap: '15px' },
  inputGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '6px', color: 'var(--text-dark)', fontWeight: '600', fontSize: '0.9rem' },
  input: { width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid #E6E6E6', outline: 'none', boxSizing: 'border-box', color: 'var(--text-dark)' },
  select: { width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid #E6E6E6', outline: 'none', boxSizing: 'border-box', color: 'var(--text-dark)', backgroundColor: 'var(--white)', cursor: 'pointer' },
  
  modalFooter: { padding: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #E6E6E6', backgroundColor: '#F7F8FA' },
  cancelBtn: { padding: '8px 15px', borderRadius: '6px', border: '1px solid #ccc', background: 'var(--white)', cursor: 'pointer', color: 'var(--text-dark)' },
  saveBtn: { padding: '8px 15px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--primary)', color: 'var(--white)', fontWeight: 'bold', cursor: 'pointer' }
};