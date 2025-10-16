// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthService } from '../hooks/useAuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const authService = useAuthService();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    if (authService.isAuthenticated()) {
      const userData = authService.getCurrentUser();
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const username = credentials.username || credentials.email;
      const response = await authService.login(username, credentials.password);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      authMode: authService.authMode,
      isSimulationMode: authService.isSimulationMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};