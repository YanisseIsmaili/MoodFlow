// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
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
      email: userData.email,
      username: userData.username, // Utiliser le username fourni
      password: userData.password,
    };
    
    return this.makeRequest('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  async logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  // Méthodes pour les humeurs
  async getMoods() {
    return this.makeRequest('/api/v1/moods');
  }

  async getMoodsByUser(username) {
    return this.makeRequest(`/api/v1/moods/user/${username}`);
  }

  async getMoodsByUserAndMonth(username, date) {
    return this.makeRequest(`/api/v1/moods/${username}?date=${date}`);
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

  getAuthData() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    return {
      token,
      user: userData ? JSON.parse(userData) : null
    };
  }
}

// Exporter une instance unique
export default new ApiService();