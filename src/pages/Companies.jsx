import React, { useState, useEffect } from 'react';
import { 
  IoAddOutline, 
  IoCloseOutline, 
  IoBusinessOutline, 
  IoLinkOutline, 
  IoRefreshOutline,
  IoCopyOutline,
  IoCheckmarkOutline
} from 'react-icons/io5';
import { apiFetch } from '../services/api'; 

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estado para controlar qué ID se acaba de copiar (para la animación del botón)
  const [copiedId, setCopiedId] = useState(null);

  // Control de Modales
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);

  // Estados del Formulario de Compañía
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyConnection, setCompanyConnection] = useState(''); 

  // Estados del Formulario de Conexión (Mock)
  const [dbHost, setDbHost] = useState('');
  const [dbName, setDbName] = useState('');
  const [isCreatingConnection, setIsCreatingConnection] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setIsFetching(true);
    try {
      const response = await apiFetch('/api/Admin/companies', {
        method: 'GET'
      });
      setCompanies(response.contentData || []);
    } catch (err) {
      console.error("Error cargando compañías:", err.message);
    } finally {
      setIsFetching(false);
    }
  };

  // Función mágica para copiar el ID al portapapeles
  const handleCopyId = (id) => {
    if (!id) return;
    
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      // Restauramos el ícono de copiar después de 2 segundos
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    }).catch(err => {
      console.error("Error al copiar al portapapeles:", err);
    });
  };

  // --- MANEJADORES DEL MODAL DE COMPAÑÍA ---
  const handleOpenCompanyModal = () => {
    setCompanyName('');
    setCompanyEmail('');
    setCompanyConnection('');
    setError('');
    setIsCompanyModalOpen(true);
  };

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    setError('');

    if (!companyConnection) {
      setError("Es obligatorio agregar una conexión antes de guardar.");
      return;
    }
    
    setIsLoading(true);

    try {
      const payload = {
        companyName: companyName,
        companyEmail: companyEmail,
        companyConnection: parseInt(companyConnection, 10)
      };

      await apiFetch('/api/Admin/register/company', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      await fetchCompanies();
      setIsCompanyModalOpen(false);
    } catch (err) {
      setError(err.message || 'Error al registrar la compañía.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- MANEJADORES DEL MODAL DE CONEXIÓN ---
  const handleCreateConnection = async (e) => {
    e.preventDefault();
    setIsCreatingConnection(true);

    setTimeout(() => {
      const generatedId = Math.floor(1000 + Math.random() * 9000); 
      setCompanyConnection(generatedId);
      setDbHost('');
      setDbName('');
      setIsCreatingConnection(false);
      setIsConnectionModalOpen(false);
    }, 1500);
  };

  return (
    <div style={styles.container}>
      {/* Encabezado */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2 style={{ color: 'var(--sidebar-bg)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IoBusinessOutline /> Compañías
          </h2>
          <button style={styles.refreshBtn} onClick={fetchCompanies} disabled={isFetching}>
            <IoRefreshOutline style={{ animation: isFetching ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>
        <button style={styles.addButton} onClick={handleOpenCompanyModal}>
          <IoAddOutline style={{ fontSize: '1.2rem', marginRight: '5px' }} />
          Añadir Compañía
        </button>
      </div>

      {/* Tabla de Compañías */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Compañía</th>
              <th style={styles.th}>Correo de Contacto</th>
              <th style={styles.th}>Id de Conexión</th>
              <th style={styles.th}>Fecha Registro</th>
              <th style={styles.th}>Estado</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && companies.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Cargando compañías...</td></tr>
            ) : companies.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No hay compañías registradas.</td></tr>
            ) : (
              companies.map((comp) => (
                <tr key={comp.id} style={styles.tr}>
                  <td style={styles.td}>
                    <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{comp.name}</span>
                  </td>
                  <td style={styles.td}>{comp.contactEmail}</td>
                  <td style={styles.td}>
                    <span style={styles.connectionBadge}>
                      {comp.connectionId === 0 ? 'Sin Asignar' : comp.connectionId}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(comp.registerDate).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    <span style={comp.active ? styles.statusActive : styles.statusInactive}>
                      {comp.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {/* Botón dinámico de Copiar ID */}
                    <button 
                      type="button" 
                      style={{ 
                        ...styles.copyBtn, 
                        color: copiedId === comp.id ? 'var(--primary)' : 'var(--secondary)' 
                      }} 
                      onClick={() => handleCopyId(comp.id)}
                      title="Copiar ID de la Compañía"
                    >
                      {copiedId === comp.id ? (
                        <>
                          <IoCheckmarkOutline style={{ fontSize: '1.1rem' }} /> 
                          <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <IoCopyOutline style={{ fontSize: '1.1rem' }} /> 
                          <span style={{ fontSize: '0.85rem' }}>Copiar ID</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: REGISTRO DE COMPAÑÍA */}
      {isCompanyModalOpen && (
        <div style={{ ...styles.modalOverlay, zIndex: 1000 }}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, color: 'var(--sidebar-bg)' }}>Registrar Compañía</h3>
              <button type="button" style={styles.closeBtn} onClick={() => setIsCompanyModalOpen(false)}>
                <IoCloseOutline />
              </button>
            </div>
            
            <form onSubmit={handleSaveCompany}>
              <div style={styles.modalBody}>
                {error && (
                  <div style={styles.errorBox}>{error}</div>
                )}

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nombre de la Compañía</label>
                  <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={styles.input} />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Correo Electrónico de Contacto</label>
                  <input type="email" required placeholder="contacto@empresa.com" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} style={styles.input} />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Id de Conexión <span style={{color: '#d32f2f'}}>*</span></label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" readOnly required placeholder="Sin conexión asignada" value={companyConnection} style={{ ...styles.input, backgroundColor: '#F7F8FA', flex: 1 }} />
                    <button type="button" onClick={() => setIsConnectionModalOpen(true)} style={styles.addConnectionBtn}>
                      <IoLinkOutline style={{ marginRight: '5px' }} />
                      {companyConnection ? 'Cambiar' : 'Agregar Conexión'}
                    </button>
                  </div>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button type="button" style={styles.cancelBtn} onClick={() => setIsCompanyModalOpen(false)} disabled={isLoading}>Cancelar</button>
                <button type="submit" style={{ ...styles.saveBtn, opacity: (!companyConnection || isLoading) ? 0.5 : 1 }} disabled={!companyConnection || isLoading}>
                  {isLoading ? 'Guardando...' : 'Guardar Compañía'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTRO DE CONEXIÓN */}
      {isConnectionModalOpen && (
        <div style={{ ...styles.modalOverlay, zIndex: 1050 }}>
          <div style={{ ...styles.modalContent, maxWidth: '400px' }}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, color: 'var(--primary)' }}>Nueva Conexión</h3>
              <button type="button" style={styles.closeBtn} onClick={() => setIsConnectionModalOpen(false)}>
                <IoCloseOutline />
              </button>
            </div>
            
            <form onSubmit={handleCreateConnection}>
              <div style={styles.modalBody}>
                <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginBottom: '15px' }}>
                  Los datos ingresados aquí se enviarán al servidor para generar un identificador único (Número).
                </p>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Host / Servidor de BD</label>
                  <input type="text" required placeholder="ej. 192.168.1.100" value={dbHost} onChange={(e) => setDbHost(e.target.value)} style={styles.input} />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nombre de Base de Datos</label>
                  <input type="text" required placeholder="ej. savio_db_tenant" value={dbName} onChange={(e) => setDbName(e.target.value)} style={styles.input} />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button type="button" style={styles.cancelBtn} onClick={() => setIsConnectionModalOpen(false)}>Cancelar</button>
                <button type="submit" style={styles.saveBtn} disabled={isCreatingConnection}>
                  {isCreatingConnection ? 'Generando...' : 'Crear y Asignar'}
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
  refreshBtn: { background: 'none', border: 'none', color: 'var(--primary)', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  addButton: { display: 'flex', alignItems: 'center', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  tableCard: { backgroundColor: 'var(--white)', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid rgba(164, 166, 165, 0.2)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { backgroundColor: '#F7F8FA', color: 'var(--text-dark)', padding: '15px 20px', fontWeight: '600', borderBottom: '1px solid #E6E6E6' },
  tr: { borderBottom: '1px solid #E6E6E6' },
  td: { padding: '15px 20px', color: 'var(--secondary)', fontSize: '0.95rem', verticalAlign: 'middle' },
  connectionBadge: { backgroundColor: '#EBF3FB', color: '#3B82F6', padding: '5px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem' },
  statusActive: { backgroundColor: '#81D834', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' },
  statusInactive: { backgroundColor: '#F8C134', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' },
  
  // Estilo del nuevo botón de copiar
  copyBtn: {
    background: 'none', border: 'none', cursor: 'pointer', display: 'flex', 
    alignItems: 'center', gap: '6px', padding: '5px 10px', borderRadius: '6px',
    transition: 'all 0.2s ease', backgroundColor: '#F7F8FA'
  },
  
  errorBox: { backgroundColor: '#ffebee', color: '#d32f2f', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'var(--white)', width: '100%', maxWidth: '500px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #E6E6E6' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--secondary)' },
  modalBody: { padding: '20px' },
  inputGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '8px', color: 'var(--text-dark)', fontWeight: '600', fontSize: '0.9rem' },
  input: { width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid #E6E6E6', outline: 'none', boxSizing: 'border-box' },
  addConnectionBtn: { display: 'flex', alignItems: 'center', backgroundColor: '#3B82F6', color: 'var(--white)', border: 'none', padding: '0 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' },
  modalFooter: { padding: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#F7F8FA', borderTop: '1px solid #E6E6E6' },
  cancelBtn: { padding: '8px 15px', borderRadius: '6px', border: '1px solid #ccc', background: 'var(--white)', cursor: 'pointer' },
  saveBtn: { padding: '8px 15px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--primary)', color: 'var(--white)', fontWeight: 'bold', cursor: 'pointer' }
};