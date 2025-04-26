// Auth Service (for Day 4)
import api from './api'; // Adjust the import path as necessary

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (user) => api.post('/auth/register', user),
    getCurrentUser: () => {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    },
    logout: () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  };