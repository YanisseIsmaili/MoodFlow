// src/hooks/useAuthService.js
import apiService from '../services/api';

const AUTH_MODE = import.meta.env.VITE_AUTH_MODE || 'simulation';

export const useAuthService = () => {
  const isSimulationMode = AUTH_MODE === 'simulation';

  const login = async (username, password) => {
    if (isSimulationMode) {
      // Mode simulation
      console.log('🔧 MODE SIMULATION - Authentification simulée');
      
      // Simulation d'une attente réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (username && password) {
        const userData = { 
          email: username.includes('@') ? username : `${username}@example.com`,
          username: username,
          name: username.includes('@') ? username.split('@')[0] : username,
          id: Date.now(),
          simulatedUser: true
        };
        
        // Sauvegarder en localStorage pour simulation
        localStorage.setItem('auth_simulation', JSON.stringify(userData));
        
        return {
          user: userData,
          token: 'simulation-token-' + Date.now()
        };
      } else {
        throw new Error('Identifiant et mot de passe requis');
      }
    } else {
      // Mode API réel
      console.log('🔗 MODE API - Connexion au backend NestJS');
      console.log('🔗 Données envoyées:', { username, password: '***' });
      
      try {
        const response = await apiService.login(username, password);
        
        // Sauvegarder les données d'authentification
        apiService.saveAuthData(response.access_token || response.token, response.user);
        
        return response;
      } catch (error) {
        // Gestion des erreurs spécifiques du backend
        if (error.message.includes('Failed to fetch')) {
          throw new Error('❌ Backend non disponible. Vérifiez que le serveur NestJS est démarré sur http://localhost:3000');
        }
        throw error;
      }
    }
  };

  const register = async (formData) => {
    if (isSimulationMode) {
      // Mode simulation
      console.log('🔧 MODE SIMULATION - Inscription simulée');
      
      // Simulation d'une attente réseau
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (formData.email && formData.password && formData.firstName) {
        const userData = {
          email: formData.email,
          name: formData.firstName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          id: Date.now(),
          simulatedUser: true
        };
        
        // Auto-connexion après inscription en mode simulation
        localStorage.setItem('auth_simulation', JSON.stringify(userData));
        
        return {
          user: userData,
          token: 'simulation-token-' + Date.now()
        };
      } else {
        throw new Error('Tous les champs sont requis');
      }
    } else {
      // Mode API réel
      console.log('🔗 MODE API - Inscription via backend NestJS');
      
      try {
        const response = await apiService.register(formData);
        
        // Sauvegarder les données d'authentification
        apiService.saveAuthData(response.access_token || response.token, response.user);
        
        return response;
      } catch (error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('❌ Backend non disponible. Vérifiez que le serveur NestJS est démarré sur http://localhost:3000');
        }
        throw error;
      }
    }
  };

  const logout = () => {
    if (isSimulationMode) {
      console.log('🔧 MODE SIMULATION - Déconnexion simulée');
      localStorage.removeItem('auth_simulation');
    } else {
      console.log('🔗 MODE API - Déconnexion via backend');
      apiService.logout();
    }
  };

  const isAuthenticated = () => {
    if (isSimulationMode) {
      return !!localStorage.getItem('auth_simulation');
    } else {
      return apiService.isAuthenticated();
    }
  };

  const getCurrentUser = () => {
    if (isSimulationMode) {
      const userData = localStorage.getItem('auth_simulation');
      return userData ? JSON.parse(userData) : null;
    } else {
      const { user } = apiService.getAuthData();
      return user;
    }
  };

  return {
    login,
    register,
    logout,
    isAuthenticated,
    getCurrentUser,
    isSimulationMode,
    authMode: AUTH_MODE
  };
};