//  src/services/loanService.js
import API from './api';

export const getAllLoans = async () => {
  try {
    const response = await API.get('/loans');
    return response.data;
  } catch (error) {
    console.error('Error fetching loans:', error);
    throw error;
  }
};

export const createLoan = async (loanData) => {
  try {
    const response = await API.post('/loans', loanData);
    return response.data;
  } catch (error) {
    console.error('Error creating loan:', error);
    throw error;
  }
};

export const returnBook = async (id) => {
  try {
    const response = await API.put(`/loans/${id}/return`);
    return response.data;
  } catch (error) {
    console.error('Error returning book:', error);
    throw error;
  }
};



// // Loan Service
// import api from './api'; // Adjust the import path as necessary

// export const loanService = {
//   getAllLoans: () => api.get('/loans'),
//   getLoanById: (id) => api.get(`/loans/${id}`),
//   getLoansByUserId: (userId) => api.get(`/loans/user/${userId}`),
//   getLoansByBookId: (bookId) => api.get(`/loans/book/${bookId}`),
//   createLoan: (loan) => api.post('/loans', loan),
//   returnBook: (id) => api.put(`/loans/${id}/return`),
//   deleteLoan: (id) => api.delete(`/loans/${id}`),
// };