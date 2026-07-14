import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import AuthManager from './components/AuthManager';
import DashboardLayout from './layouts/DashboardLayout';

import DashboardOverview from './pages/DashboardOverview';
import Collaborators from './pages/Collaborators';
import Companies from './pages/Companies';
import ChatBot from './pages/ChatBot';
import Reports from './pages/Reports';
import Help from './pages/Help';
import Settings from './pages/Settings';
import Users from './pages/Users';

// --- 1. GUARDIÁN DE RUTAS PRIVADAS ---
// Si NO hay token, expulsa al usuario al Login
const PrivateRoute = () => {
  const token = localStorage.getItem('jwt_token');
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

// --- 2. GUARDIÁN DE RUTAS PÚBLICAS ---
// Si YA hay token, impide ver el Login y lo manda al Dashboard
const PublicRoute = () => {
  const token = localStorage.getItem('jwt_token');
  return !token ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Rutas Públicas (Envueltas en el Guardián Público) */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<AuthManager />} />
        </Route>

        {/* Rutas Privadas (Envueltas en el Guardián Privado) */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="companies" element={<Companies />} />
            <Route path="collaborators" element={<Collaborators />} />
            <Route path="users" element={<Users />} />
            <Route path="chat" element={<ChatBot />} />
            <Route path="reports" element={<Reports />} />
            <Route path="help" element={<Help />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;