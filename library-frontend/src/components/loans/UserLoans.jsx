// src/components/loans/UserLoans.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loanService, userService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const UserLoans = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserLoans = async () => {
      try {
        const [userResponse, loansResponse] = await Promise.all([
          userService.getUserById(userId),
          loanService.getLoansByUserId(userId)
        ]);
        
        setUser(userResponse.data);
        setLoans(loansResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user loans:', error);
        setLoading(false);
      }
    };
    
    fetchUserLoans();
  }, [userId]);
  
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
        <div className="text-xl text-gray-500">Loading user loans...</div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-700">User not found</h2>
        <p className="text-gray-500 mt-2">The user you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/admin/users')}
          className="btn btn-primary mt-4"
        >
          Back to Users
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Loans for {user.name}</h1>
        <button 
          onClick={() => navigate('/admin/users')}
          className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          Back to Users
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">User Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><span className="font-medium">Name:</span> {user.name}</p>
            <p><span className="font-medium">Email:</span> {user.email}</p>
          </div>
          <div>
            <p>
              <span className="font-medium">Role:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                user.role === 'LIBRARIAN' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user.role}
              </span>
            </p>
            <p><span className="font-medium">Active Loans:</span> {loans.filter(loan => !loan.returnedDate).length}</p>
          </div>
        </div>
      </div>
      
      {loans.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <p className="text-lg text-gray-500">This user has no loan history.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrowed Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returned Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans.map(loan => (
                <tr key={loan.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{loan.book.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{loan.borrowedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{loan.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{loan.returnedDate || '-'}</td>
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

export default UserLoans;
