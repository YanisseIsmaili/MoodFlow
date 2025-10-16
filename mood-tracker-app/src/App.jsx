// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './page/Login';
import Register from './pages/Register';
import SettingsModal from './components/modals/SettingsModal';
import { LanguageProvider } from './contexts/LanguageContext';
import { DashboardProvider } from './context/DashboardContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-amber-900 text-xl">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }
  
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <>
              <Dashboard onOpenSettings={() => setIsSettingsOpen(true)} />
              <SettingsModal 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
              />
            </>
          } />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      <DashboardProvider>
        <Dashboard onOpenSettings={() => setIsSettingsOpen(true)} />
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      </DashboardProvider>
    </LanguageProvider>
  );
}

export default App;