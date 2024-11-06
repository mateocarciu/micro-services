// src/services/api.config.js
import axios from 'axios';

const API = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les tokens d'authentification
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Gérer l'expiration du token
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Example service for a microservice
export const userService = {
  getUsers: () => API.get('/api/users'),
  getUserById: (id) => API.get(`/api/users/${id}`),
  createUser: (userData) => API.post('/api/users', userData),
  updateUser: (id, userData) => API.put(`/api/users/${id}`, userData),
  deleteUser: (id) => API.delete(`/api/users/${id}`),
};

export const authService = {
  login: (credentials) => API.post('/api/auth/login', credentials),
  register: (userData) => API.post('/api/auth/register', userData),
  logout: () => API.post('/api/auth/logout'),
};

export default API;