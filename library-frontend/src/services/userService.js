// src/services/userService.js
import API from './api';

export const registerUser = async (userData) => {
  try {
    const response = await API.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const getUserDetails = async (id) => {
  try {
    const response = await API.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

// We'll need to get all users, assuming this endpoint exists or can be added
export const getAllUsers = async () => {
  try {
    const response = await API.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};