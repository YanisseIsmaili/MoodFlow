// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './page/Login';
import Register from './pages/Register';
import SettingsModal from './components/modals/SettingsModal';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
    </LanguageProvider>
  );
}

export default App;