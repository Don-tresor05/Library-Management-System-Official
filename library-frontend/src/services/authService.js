import api from './api'; 

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