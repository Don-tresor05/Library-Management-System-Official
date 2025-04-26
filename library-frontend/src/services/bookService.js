import API from './api';

export const getAllBooks = async () => {
  try {
    const response = await API.get('/books');
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const createBook = async (bookData) => {
  try {
    const response = await API.post('/books', bookData);
    return response.data;
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
};

export const updateBook = async (id, bookData) => {
  try {
    const response = await API.put(`/books/${id}`, bookData);
    return response.data;
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await API.delete(`/books/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};



// // Book Service
// import api from './api'; // Adjust the import path as necessary
// export const bookService = {
//   getAllBooks: () => api.get('/books'),
//   getBookById: (id) => api.get(`/books/${id}`),
//   getAvailableBooks: () => api.get('/books/available'),
//   addBook: (book) => api.post('/books', book),
//   updateBook: (id, book) => api.put(`/books/${id}`, book),
//   deleteBook: (id) => api.delete(`/books/${id}`),
// };
