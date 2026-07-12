// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthManager from './components/AuthManager';
import DashboardOverview from './pages/DashboardOverview';
import DashboardLayout from './layouts/DashboardLayout';
import Collaborators from './pages/Collaborators';
import ChatBot from './pages/ChatBot';
import Reports from './pages/Reports';
import Help from './pages/Help';
import Settings from './pages/Settings';
import Companies from './pages/Companies';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthManager />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />}/>
          <Route path="companies" element={<Companies />} />
          <Route path="collaborators" element={<Collaborators />} />
          <Route path="chat" element={<ChatBot />} />
          <Route path="reports" element={<Reports />} />
          <Route path="help" element={<Help />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;