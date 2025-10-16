// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './page/Login';
import Register from './page/Register';
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