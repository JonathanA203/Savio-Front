import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  IoHomeOutline, 
  IoPeopleOutline, 
  IoChatbubblesOutline, 
  IoDocumentTextOutline, 
  IoHelpCircleOutline, 
  IoSettingsOutline, 
  IoLogOutOutline,
  IoBusinessOutline
} from 'react-icons/io5';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('jwt_token');
    navigate('/');
  };

  return (
    <aside style={styles.sidebar}>
      {/* Logotipo */}
      <div style={styles.logoContainer}>
        <h2 style={styles.logoText}>SAVIO 🤖</h2>
      </div>

      {/* Menú de Navegación */}
      <nav style={styles.nav}>
        <NavLink to="/dashboard" end style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
          <IoHomeOutline style={styles.icon} /> Dashboard
        </NavLink>

        <NavLink to="/dashboard/companies" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
          <IoBusinessOutline style={styles.icon} /> Companies
        </NavLink>

        <NavLink to="/dashboard/collaborators" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
          <IoPeopleOutline style={styles.icon} /> Collaborators
        </NavLink>

        <NavLink to="/dashboard/chat" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
          <IoChatbubblesOutline style={styles.icon} /> Chat Bot
        </NavLink>

        <NavLink to="/dashboard/reports" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
          <IoDocumentTextOutline style={styles.icon} /> Generate Report
        </NavLink>

        <NavLink to="/dashboard/help" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
          <IoHelpCircleOutline style={styles.icon} /> Help
        </NavLink>

        <NavLink to="/dashboard/settings" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
          <IoSettingsOutline style={styles.icon} /> Settings
        </NavLink>
      </nav>

      {/* Botón de Salir (Fijado abajo) */}
      <div style={styles.signOutContainer}>
        <button onClick={handleSignOut} style={styles.signOutBtn}>
          <IoLogOutOutline style={styles.icon} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

// Estilos en línea para mantener el componente autocontenido
const styles = {
  sidebar: {
    width: '260px',
    backgroundColor: 'var(--sidebar-bg)',
    color: 'var(--white)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
  },
  logoContainer: {
    padding: '30px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  logoText: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    letterSpacing: '2px'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingTop: '20px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 25px',
    color: 'var(--white)',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    borderLeft: '4px solid transparent',
  },
  activeLink: {
    backgroundColor: 'var(--white)',
    color: 'var(--sidebar-active-text)',
    borderLeft: '4px solid var(--primary)',
    fontWeight: '600',
    borderTopLeftRadius: '25px', /* Efecto curvado de la imagen */
    borderBottomLeftRadius: '25px',
    marginLeft: '10px'
  },
  icon: {
    fontSize: '1.3rem',
    marginRight: '15px'
  },
  signOutContainer: {
    padding: '20px',
    borderTop: '1px solid rgba(255,255,255,0.1)'
  },
  signOutBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'transparent',
    border: 'none',
    color: 'var(--white)',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%',
    padding: '10px',
    transition: 'color 0.3s ease',
  }
};