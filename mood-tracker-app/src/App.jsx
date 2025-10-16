// src/App.jsx
import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import SettingsModal from './components/modals/SettingsModal';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <LanguageProvider>
      <Dashboard onOpenSettings={() => setIsSettingsOpen(true)} />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </LanguageProvider>
  );
}

export default App;