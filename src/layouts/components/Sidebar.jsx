import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  IoHomeOutline, 
  IoPeopleOutline, 
  IoBusinessOutline, 
  IoChatbubblesOutline, 
  IoDocumentTextOutline, 
  IoHelpCircleOutline, 
  IoSettingsOutline, 
  IoLogOutOutline 
} from 'react-icons/io5';

export default function Sidebar() {
  const navigate = useNavigate();

  // 1. Extraemos y normalizamos el rol (quitamos guiones bajos y pasamos a mayúsculas)
  // Ej: "TenantUser" o "TENANT_USER" o "3" -> "TENANTUSER" o "3"
  const rawRole = String(localStorage.getItem('user_role') || '');
  const role = rawRole.toUpperCase().replace('_', '');

  // 2. Definimos quién es quién según tus reglas
  const isTenantAdmin = role === '1' || role === 'ADMINTENANT';
  const isSystemAdmin = role === '2' || role === 'SYSTEMADMIN';
  const isTenantUser  = role === '3' || role === 'TENANTUSER';
  const isTenantGuest = role === '4' || role === 'TENANTGUEST';

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role');
    // El replace: true borra el dashboard del historial del botón "Atrás"
    navigate('/', { replace: true }); 
  };

  return (
    <aside style={styles.sidebar}>
      <div>
        <div style={styles.logoContainer}>
          <h2 style={styles.logoText}>SAVIO 🤖</h2>
        </div>

        <nav style={styles.nav}>
          
          {/* Dashboard: Visible para 1 (Admin), 3 (User), 4 (Guest) */}
          {(isTenantAdmin || isTenantUser || isTenantGuest) && (
            <NavLink to="/dashboard" end style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
              <IoHomeOutline style={styles.icon} /> Dashboard
            </NavLink>
          )}

          {/* Companies: SOLO visible para 2 (System Admin) */}
          {isSystemAdmin && (
            <NavLink to="/dashboard/companies" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
              <IoBusinessOutline style={styles.icon} /> Companies
            </NavLink>
          )}
          {/* Users: SOLO visible para 2 (System Admin) */}
          {isSystemAdmin && (
            <NavLink to="/dashboard/users" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
              <IoPeopleOutline style={styles.icon} /> Users
            </NavLink>
          )}

          {/* Collaborators: SOLO visible para 1 (Tenant Admin) */}
          {isTenantAdmin && (
            <NavLink to="/dashboard/collaborators" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
              <IoPeopleOutline style={styles.icon} /> Collaborators
            </NavLink>
          )}

          {/* Chat Bot: Visible para 1 (Tenant Admin) y 3 (Tenant User) */}
          {(isTenantAdmin || isTenantUser) && (
            <NavLink to="/dashboard/chat" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
              <IoChatbubblesOutline style={styles.icon} /> Chat Bot
            </NavLink>
          )}

          {/* Generate Report: Visible para 1 (Tenant Admin) y 3 (Tenant User) */}
          {(isTenantAdmin || isTenantUser) && (
            <NavLink to="/dashboard/reports" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
              <IoDocumentTextOutline style={styles.icon} /> Generate Report
            </NavLink>
          )}

          <hr style={styles.divider} />

          {/* Vistas Inherentes (Para TODOS los roles) */}
          <NavLink to="/dashboard/help" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
            <IoHelpCircleOutline style={styles.icon} /> Help
          </NavLink>

          <NavLink to="/dashboard/settings" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
            <IoSettingsOutline style={styles.icon} /> Settings
          </NavLink>
        </nav>
      </div>

      {/* Botón de Logout */}
      <button onClick={handleLogout} style={styles.logoutBtn}>
        <IoLogOutOutline style={styles.icon} /> Sign Out
      </button>
    </aside>
  );
}

const styles = {
  sidebar: { width: '260px', backgroundColor: 'var(--sidebar-bg)', color: 'var(--white)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh', position: 'fixed', left: 0, top: 0, padding: '20px 0', boxSizing: 'border-box' },
  logoContainer: { padding: '0 25px', marginBottom: '40px' },
  logoText: { margin: 0, fontSize: '1.8rem', letterSpacing: '1px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '5px' },
  link: { display: 'flex', alignItems: 'center', padding: '15px 25px', color: '#A4A6A5', textDecoration: 'none', fontSize: '1rem', transition: 'all 0.3s ease' },
  activeLink: { backgroundColor: 'var(--white)', color: 'var(--sidebar-bg)', borderLeft: '5px solid var(--primary)', fontWeight: 'bold' },
  icon: { marginRight: '15px', fontSize: '1.3rem' },
  divider: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '15px 25px' },
  logoutBtn: { display: 'flex', alignItems: 'center', padding: '15px 25px', color: '#A4A6A5', background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontSize: '1rem', textAlign: 'left', transition: 'color 0.3s ease' }
};