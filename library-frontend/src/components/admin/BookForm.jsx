import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isEditMode = !!id;
  
  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publicationYear: '',
    genre: '',
    quantity: 1,
    available: true
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isEditMode) {
      const fetchBookData = async () => {
        try {
          const response = await bookService.getBookById(id);
          setBook(response.data);
          setLoading(false)         } catch (error) {
            console.error('Error fetching book:', error);
            setError('Failed to load book data');
            setLoading(false);
          }
        };
        
        fetchBookData();
      }
    }, [id, isEditMode]);
    
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setBook(prevBook => ({
        ...prevBook,
        [name]: type === 'checkbox' ? checked : value
      }));
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      
      try {
        if (isEditMode) {
          await bookService.updateBook(id, book);
        } else {
          await bookService.addBook(book);
        }
        navigate('/admin/books');
      } catch (error) {
        console.error('Error saving book:', error);
        setError(error.response?.data?.message || 'Failed to save book');
      }
    };
    
    if (!isAdmin) {
      return (
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-gray-700">Access Denied</h2>
          <p className="text-gray-500 mt-2">You don't have permission to view this page.</p>
        </div>
      );
    }
    
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-500">Loading book data...</div>
        </div>
      );
    }
    
    return (
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isEditMode ? 'Edit Book' : 'Add New Book'}
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={book.title}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Author</label>
            <input
              type="text"
              name="author"
              value={book.author}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">ISBN</label>
            <input
              type="text"
              name="isbn"
              value={book.isbn}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Publication Year</label>
            <input
              type="text"
              name="publicationYear"
              value={book.publicationYear}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Genre</label>
            <input
              type="text"
              name="genre"
              value={book.genre}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={book.quantity}
              onChange={handleChange}
              min="1"
              required
              className="form-input"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="available"
              id="available"
              checked={book.available}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-primary"
            />
            <label htmlFor="available" className="ml-2 text-gray-700">
              Available for loan
            </label>
          </div>
          
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/books')}
              className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditMode ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  export default BookForm;