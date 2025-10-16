// src/App.jsx
import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  if (currentView === 'settings') {
    return <Settings onBack={() => setCurrentView('dashboard')} />;
  }

  return <Dashboard onOpenSettings={() => setCurrentView('settings')} />;
}

export default App;