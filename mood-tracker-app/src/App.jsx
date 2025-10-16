// src/App.jsx
import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import SettingsModal from './components/modals/SettingsModal';
import { LanguageProvider } from './contexts/LanguageContext';
import { DashboardProvider } from './context/DashboardContext';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  return (
    <LanguageProvider>
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