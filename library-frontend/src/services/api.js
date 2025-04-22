import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Your backend URL
});

// Books API
export const fetchBooks = () => api.get('/books');
export const createBook = (bookData) => api.post('/books', bookData);
export const updateBook = (id, bookData) => api.put(`/books/${id}`, bookData);
export const deleteBook = (id) => api.delete(`/books/${id}`);

// Users API
export const fetchUsers = () => api.get('/users');
export const createUser = (userData) => api.post('/users', userData);
export const fetchUser = (id) => api.get(`/users/${id}`);

// Loans API
export const fetchLoans = () => api.get('/loans');
export const createLoan = (loanData) => api.post('/loans', loanData);
export const returnBook = (id) => api.put(`/loans/${id}/return`);

export default api;