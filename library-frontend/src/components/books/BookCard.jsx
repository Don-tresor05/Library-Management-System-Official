import React from 'react';
import { Link } from 'react-router-dom';
import { loanService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book, canBorrow, refreshBooks }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleBorrow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const loanData = {
        user: { id: user.id },
        book: { id: book.id }
      };
      
      await loanService.createLoan(loanData);
      
      if (refreshBooks) {
        refreshBooks();
      } else {
        // Refresh the page as fallback
        window.location.reload();
      }
      
      alert(`You have successfully borrowed "${book.title}"`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message || "You can't borrow this book right now.");
      } else {
        alert("An error occurred while processing your request.");
      }
      console.error('Error borrowing book:', error);
    }
  };
  
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{book.title}</h3>
      <p className="text-gray-600 mb-1">by {book.author}</p>
      <p className="text-sm text-gray-500 mb-1">ISBN: {book.isbn}</p>
      
      {book.publicationYear && (
        <p className="text-sm text-gray-500 mb-1">Year: {book.publicationYear}</p>
      )}
      
      {book.genre && (
        <p className="text-sm text-gray-500 mb-3">Genre: {book.genre}</p>
      )}
      
      <div className="flex items-center justify-between mt-4">
        <span 
          className={`px-2 py-1 rounded text-xs font-medium ${
            book.available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}
        >
          {book.available ? 'Available' : 'Unavailable'}
        </span>
        
        <div className="flex space-x-2">
          <Link 
            to={`/books/${book.id}`}
            className="btn bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm"
          >
            Details
          </Link>
          
          {canBorrow && book.available && (
            <button
              onClick={handleBorrow}
              className="btn btn-primary text-sm"
              disabled={!book.available}
            >
              Borrow
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;