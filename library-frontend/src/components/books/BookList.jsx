import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../../services/api';
import BookCard from './BookCard';
import { useAuth } from '../../context/AuthContext';

const BookList = ({ adminView = false }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const { isAuthenticated, } = useAuth();
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await bookService.getAllBooks();
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, []);

  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(id);
        setBooks(books.filter(book => book.id !== id));
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete book');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'available') {
      return matchesSearch && book.available;
    }
    
    return matchesSearch;
  });

  const refreshBooks = async () => {
    setLoading(true);
    try {
      const response = await bookService.getAllBooks();
      setBooks(response.data);
    } catch (error) {
      console.error('Error refreshing books:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-500">Loading books...</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          {adminView ? 'Manage Books' : 'Library Books'}
        </h1>
        {adminView && (
          <Link 
            to="/admin/books/create" 
            className="btn btn-primary"
          >
            + Add New Book
          </Link>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder={`Search by ${adminView ? 'title, author or ISBN' : 'title or author'}...`}
            value={searchTerm}
            onChange={handleSearch}
            className="form-input pl-10"
          />
          <svg 
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        
        <div className="flex items-center">
          <label className="mr-2 text-gray-700">Filter:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="form-input py-1"
          >
            <option value="all">All Books</option>
            <option value="available">Available Only</option>
          </select>
        </div>
      </div>
      
      {filteredBooks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">No books found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              canBorrow={isAuthenticated && !adminView}
              adminView={adminView}
              onDelete={handleDeleteBook}
              refreshBooks={refreshBooks}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;