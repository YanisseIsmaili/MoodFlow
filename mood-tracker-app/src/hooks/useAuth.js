// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      
      // Sauvegarder les données d'authentification
      apiService.saveAuthData(response.access_token || response.token, response.user);
      
      setIsAuthenticated(true);
      setUser(response.user);
      
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    logout,
  };
};