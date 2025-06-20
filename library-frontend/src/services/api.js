import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


const getAllBooks = (params = {}) => api.get('/books', { params });
const getBookById = (id) => api.get(`/books/${id}`);
const getAvailableBooks = (params) => api.get('/books/available', { params });
const addBook = (book) => api.post('/books', book);
const updateBook = (id, book) => api.put(`/books/${id}`, book);
const deleteBook = (id) => api.delete(`/books/${id}`);


const getAllUsers = (params = {}) => api.get('/users', { params });
const getUserById = (id) => api.get(`/users/${id}`);
const createUser = (user) => api.post('/users', user);
const updateUser = (id, user) => api.put(`/users/${id}`, user);
const deleteUser = (id) => api.delete(`/users/${id}`);


const getAllLoans = () => api.get('/loans');
const getLoanById = (id) => api.get(`/loans/${id}`);
const getLoansByUserId = (userId) => api.get(`/loans/user/${userId}`);
const getLoansByBookId = (bookId) => api.get(`/loans/book/${bookId}`);
const getActiveLoans = () => api.get('/loans/active');
const createLoan = (loan) => api.post('/loans', loan);
const returnBook = (id) => api.put(`/loans/${id}/return`);
const deleteLoan = (id) => api.delete(`/loans/${id}`);


const login = (credentials) => api.post('/auth/login', credentials);
const register = (user) => api.post('/auth/register', user);

const getActivityLogs = (params) => api.get('/activity-logs', { params });


export const bookService = {
  getAllBooks,
  getBookById,
  getAvailableBooks,
  addBook,
  updateBook,
  deleteBook
};

export const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};

export const loanService = {
  getActiveLoans,
  getAllLoans,
  getLoanById,
  getLoansByUserId,
  getLoansByBookId,
  createLoan,
  returnBook,
  deleteLoan
};

export const authService = {
  login,
  register,
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
};

export const activityLogService = {
  getActivityLogs
};

export default api;