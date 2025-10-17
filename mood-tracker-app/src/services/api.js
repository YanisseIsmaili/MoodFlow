// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.onSessionExpired = null; // Callback pour notifier l'expiration de session
  }

  // Méthode pour définir un callback d'expiration de session
  setSessionExpiredHandler(callback) {
    this.onSessionExpired = callback;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Ajouter le token JWT si disponible
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultOptions.headers.Authorization = `Bearer ${token}`;
    }

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, finalOptions);
      
      // Gérer l'expiration du token JWT
      if (response.status === 401) {
        this.clearAuthData();
        if (this.onSessionExpired) {
          this.onSessionExpired();
        }
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      
      // Gestion spécifique des erreurs de connexion
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur http://localhost:3000');
      }
      
      throw error;
    }
  }

  // Méthodes d'authentification
  async login(username, password) {
    return this.makeRequest('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async register(userData) {
    // Adapter les données pour correspondre au backend
    const backendData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      email: userData.email,        // Utiliser le username fourni

      password: userData.password,
    };
    
    return this.makeRequest('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  async logout() {
    this.clearAuthData();
  }

  // Méthodes pour les humeurs
  async getMoods() {
    return this.makeRequest('/api/v1/moods');
  }

  async getMoodsByUser(username) {
    return this.makeRequest(`/api/v1/moods/user/${username}`);
  }

  async getMoodsByUserAndMonth(username, date) {
    const token = localStorage.getItem('auth_token');
    
    try {
      // Essayer d'abord l'endpoint avec JWT
      const result = await this.makeRequest(`/api/v1/moods/month?date=${date}`);
      // S'assurer que nous retournons toujours un tableau
      return Array.isArray(result) ? result : (result.moods || []);
    } catch (error) {
      // Fallback: utiliser l'endpoint sans JWT et filtrer côté frontend
      const allMoods = await this.makeRequest(`/api/v1/moods/user/${username}`);
      
      // Filtrer pour le mois demandé
      const targetDate = new Date(date);
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth();
      
      const moodsArray = Array.isArray(allMoods) ? allMoods : (allMoods.moods || []);
      const filtered = moodsArray.filter(mood => {
        const moodDate = new Date(mood.date);
        return moodDate.getFullYear() === year && moodDate.getMonth() === month;
      });
      
      return filtered;
    }
  }

  async createMood(moodData) {
    return this.makeRequest('/api/v1/moods', {
      method: 'POST',
      body: JSON.stringify(moodData),
    });
  }

  async updateMood(id, moodData) {
    return this.makeRequest(`/api/v1/moods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(moodData),
    });
  }

  async deleteMood(id) {
    return this.makeRequest(`/api/v1/moods/${id}`, {
      method: 'DELETE',
    });
  }

  // Méthodes pour les utilisateurs
  async getUserProfile() {
    return this.makeRequest('/api/v1/users/profile');
  }

  async updateUserProfile(userData) {
    return this.makeRequest('/api/v1/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Utilitaires d'authentification
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }

  getCurrentUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  saveAuthData(token, user) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  clearAuthData() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  getAuthData() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    return {
      token,
      user: userData ? JSON.parse(userData) : null
    };
  }

  // Vérifier si l'utilisateur est authentifié avec un token valide
  isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }
}

// Exporter une instance unique
export default new ApiService();