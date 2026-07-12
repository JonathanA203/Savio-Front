import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

export default function DashboardLayout() {
  return (
    <div style={styles.layout}>
      <Sidebar />
      
      {/* Área principal de contenido */}
      <main style={styles.mainContent}>
        {/* Aquí se renderizarán las sub-rutas (Overview, Collaborators, etc.) */}
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%', // Obliga al layout a tomar toda la pantalla
    backgroundColor: 'var(--dashboard-bg)',
  },
  mainContent: {
    flex: 1,
    marginLeft: '260px', // Respeta el ancho del Sidebar fijo
    padding: '40px',
    minHeight: '100vh',
    boxSizing: 'border-box', // Evita que el padding rompa el ancho total
    width: 'calc(100% - 260px)', // Fuerza a usar exactamente el espacio restante
  }
};