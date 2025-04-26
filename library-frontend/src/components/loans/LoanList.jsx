// src/components/loans/LoanList.jsx
import React, { useState, useEffect } from 'react';
import { loanService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'returned'
  const { user, isAdmin } = useAuth();
  
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        let response;
        
        if (isAdmin) {
          response = await loanService.getAllLoans();
        } else {
          response = await loanService.getLoansByUserId(user.id);
        }
        
        setLoans(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching loans:', error);
        setLoading(false);
      }
    };
    
    fetchLoans();
  }, [user, isAdmin]);
  
  const handleReturnBook = async (loanId) => {
    try {
      await loanService.returnBook(loanId);
      
      // Update the loan in the local state
      setLoans(prevLoans => 
        prevLoans.map(loan => 
          loan.id === loanId 
            ? { ...loan, returnedDate: new Date().toISOString().split('T')[0] } 
            : loan
        )
      );
      
      alert('Book returned successfully!');
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Failed to return book');
    }
  };
  
  const filteredLoans = loans.filter(loan => {
    if (filter === 'active') {
      return loan.returnedDate === null;
    } else if (filter === 'returned') {
      return loan.returnedDate !== null;
    }
    return true;
  });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-500">Loading loans...</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">{isAdmin ? 'All Loans' : 'My Loans'}</h1>
      
      <div className="flex items-center">
        <label className="mr-2 text-gray-700">Filter:</label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="form-input py-1"
        >
          <option value="all">All Loans</option>
          <option value="active">Active Loans</option>
          <option value="returned">Returned Books</option>
        </select>
      </div>
      
      {filteredLoans.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">No loans found matching your criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrowed Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLoans.map(loan => (
                <tr key={loan.id}>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap">{loan.user.name}</td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">{loan.book.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{loan.borrowedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{loan.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      loan.returnedDate 
                        ? 'bg-green-100 text-green-800' 
                        : new Date() > new Date(loan.dueDate)
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {loan.returnedDate 
                        ? 'Returned' 
                        : new Date() > new Date(loan.dueDate)
                          ? 'Overdue'
                          : 'Active'
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!loan.returnedDate && (
                      <button 
                        onClick={() => handleReturnBook(loan.id)}
                        className="btn bg-green-100 text-green-700 hover:bg-green-200 text-sm"
                      >
                        Return Book
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoanList;