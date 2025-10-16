// src/App.jsx
import React from 'react';
import { DashboardProvider } from './context/DashboardContext';
import Dashboard from './page/Dashboard';

function App() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}

export default App;