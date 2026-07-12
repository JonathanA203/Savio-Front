import React, { useState } from 'react';
import { 
  IoCloudDownloadOutline, 
  IoDocumentTextOutline, 
  IoMailOutline, 
  IoCheckmarkCircleOutline,
  IoRefreshOutline
} from 'react-icons/io5';

export default function Reports() {
  // Estados: 'idle' (inicio), 'generating' (cargando), 'ready' (listo para descargar)
  const [reportStatus, setReportStatus] = useState('idle');

  const handleGenerateReport = () => {
    setReportStatus('generating');

    // MOCK: Simulamos el tiempo que tarda el backend en compilar el PDF o Excel
    setTimeout(() => {
      setReportStatus('ready');
    }, 2000);
  };

  const handleDownload = () => {
    // MOCK: Aquí iría la lógica para procesar el Blob que envíe tu backend
    console.log("Descargando reporte...");
    alert("Iniciando descarga del reporte...");
  };

  const handleSendEmail = () => {
    // MOCK: Llamada al endpoint para enviar al correo del usuario autenticado
    console.log("Enviando por correo...");
    alert("El reporte ha sido enviado a tu correo registrado.");
  };

  const handleReset = () => {
    setReportStatus('idle');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* ESTADO 1: Inicio (Botón Gigante) */}
        {reportStatus === 'idle' && (
          <div style={styles.stateContainer}>
            <button style={styles.mainButton} onClick={handleGenerateReport}>
              <IoCloudDownloadOutline style={styles.mainIcon} />
              Generar Reporte
            </button>
          </div>
        )}

        {/* ESTADO 2: Cargando */}
        {reportStatus === 'generating' && (
          <div style={styles.stateContainer}>
            <div style={styles.spinner}></div>
            <h3 style={{ color: 'var(--text-dark)', marginTop: '20px' }}>Recopilando datos...</h3>
            <p style={{ color: 'var(--secondary)' }}>Por favor espera, esto puede tardar unos segundos.</p>
          </div>
        )}

        {/* ESTADO 3: Reporte Listo (Acciones) */}
        {reportStatus === 'ready' && (
          <div style={styles.stateContainer}>
            <IoCheckmarkCircleOutline style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '10px' }} />
            <h3 style={{ color: 'var(--text-dark)', margin: '0 0 5px 0' }}>¡Reporte Generado con Éxito!</h3>
            <p style={{ color: 'var(--secondary)', marginBottom: '30px' }}>Selecciona cómo deseas exportar la información.</p>
            
            <div style={styles.actionButtonsContainer}>
              <button style={styles.actionButton} onClick={handleDownload}>
                <IoDocumentTextOutline style={styles.actionIcon} />
                Descargar (PDF)
              </button>
              
              <button style={{ ...styles.actionButton, ...styles.actionButtonOutline }} onClick={handleSendEmail}>
                <IoMailOutline style={styles.actionIcon} />
                Enviar por Correo
              </button>
            </div>

            <button style={styles.resetButton} onClick={handleReset}>
              <IoRefreshOutline style={{ marginRight: '5px' }} /> Generar uno nuevo
            </button>
          </div>
        )}

        {/* Texto de Ayuda (Siempre visible en la base) */}
        <p style={styles.disclaimer}>
          Si deseas cambiar el formato con el que se generan los reportes, puedes revisar <span style={{ fontWeight: 'bold', color: 'var(--text-dark)' }}>"Settings"</span>.
        </p>

      </div>
    </div>
  );
}

// Estilos del Componente
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 60px)', // Centrado perfecto en la pantalla principal
  },
  card: {
    backgroundColor: 'var(--white)',
    padding: '50px',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
    border: '1px solid rgba(164, 166, 165, 0.2)',
    width: '100%',
    maxWidth: '600px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '400px', // Mantiene la tarjeta de un tamaño consistente
    justifyContent: 'center',
  },
  stateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  mainButton: {
    backgroundColor: '#4CAF50', // El verde claro específico de tu diseño para este botón
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '15px 40px',
    fontSize: '1.5rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
  },
  mainIcon: {
    marginRight: '15px',
    fontSize: '1.8rem',
  },
  actionButtonsContainer: {
    display: 'flex',
    gap: '20px',
    width: '100%',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--primary)',
    color: 'var(--white)',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.3s',
    flex: 1,
    maxWidth: '220px',
  },
  actionButtonOutline: {
    backgroundColor: 'transparent',
    color: 'var(--primary)',
    border: '2px solid var(--primary)',
  },
  actionIcon: {
    marginRight: '8px',
    fontSize: '1.2rem',
  },
  resetButton: {
    background: 'none',
    border: 'none',
    color: 'var(--secondary)',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'color 0.3s',
  },
  disclaimer: {
    marginTop: '40px',
    fontSize: '0.85rem',
    color: 'var(--secondary)',
  },
  /* Spinner animado creado con CSS in-line */
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #E6E6E6',
    borderTop: '5px solid var(--primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  }
};

// Inyectamos el keyframe para el spinner si no existe en tu CSS global
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);