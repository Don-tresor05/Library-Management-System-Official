import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService, loanService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const { user, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const bookResponse = await bookService.getBookById(id);
        setBook(bookResponse.data);
        
        if (isAdmin) {
          const loansResponse = await loanService.getLoansByBookId(id);
          setLoans(loansResponse.data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching book details:', error);
        setLoading(false);
      }
    };
    
    fetchBookData();
  }, [id, isAdmin]);
  
  const handleBorrow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      const loanData = {
        user: { id: user.id },
        book: { id: book.id }
      };
      
      await loanService.createLoan(loanData);
      
      // Refresh book data
      const updatedBook = await bookService.getBookById(id);
      setBook(updatedBook.data);
      
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-500">Loading book details...</div>
      </div>
    );
  }
  
  if (!book) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-700">Book not found</h2>
        <p className="text-gray-500 mt-2">The book you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/books')}
          className="btn btn-primary mt-4"
        >
          Back to Books
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Book Details</h2>
              <ul className="space-y-2">
                <li><span className="font-medium">ISBN:</span> {book.isbn}</li>
                {book.publicationYear && (
                  <li><span className="font-medium">Publication Year:</span> {book.publicationYear}</li>
                )}
                {book.genre && (
                  <li><span className="font-medium">Genre:</span> {book.genre}</li>
                )}
                <li>
                  <span className="font-medium">Availability:</span> 
                  <span 
                    className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      book.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {book.available ? 'Available' : 'Unavailable'}
                  </span>
                </li>
                <li><span className="font-medium">Quantity:</span> {book.quantity}</li>
              </ul>
            </div>
            
            {isAdmin && (
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Admin Actions</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigate(`/admin/books/edit/${book.id}`)}
                    className="btn btn-secondary"
                  >
                    Edit Book
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this book?')) {
                        bookService.deleteBook(book.id)
                          .then(() => navigate('/books'))
                          .catch(err => console.error('Error deleting book:', err));
                      }
                    }}
                    className="btn btn-danger"
                  >
                    Delete Book
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <button 
              onClick={() => navigate('/books')}
              className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Back to Books
            </button>
            
            {isAuthenticated && book.available && (
              <button
                onClick={handleBorrow}
                className="btn btn-primary"
                disabled={!book.available}
              >
                Borrow This Book
              </button>
            )}
          </div>
        </div>
        
        {isAdmin && loans.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Loan History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrowed Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returned Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loans.map(loan => (
                    <tr key={loan.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{loan.user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{loan.borrowedDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{loan.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{loan.returnedDate || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          loan.returnedDate 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {loan.returnedDate ? 'Returned' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;