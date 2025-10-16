// src/App.jsx
import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
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
    <DashboardProvider>
      <Dashboard onOpenSettings={() => setIsSettingsOpen(true)} />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </DashboardProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;