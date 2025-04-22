// src/pages/LoanManagement.jsx - Updated
import React, { useState, useEffect } from 'react';
import { getAllLoans, createLoan, returnBook } from '../services/loanService';
import { getAllBooks } from '../services/bookService';
import { getAllUsers } from '../services/userService';
import { SelectInput, SubmitButton } from '../components/FormComponents';
import LoanCard from '../components/LoanCard';

const LoanManagement = () => {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    bookId: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [loansData, booksData, usersData] = await Promise.all([
        getAllLoans(),
        getAllBooks(),
        getAllUsers()
      ]);
      setLoans(loansData);
      setBooks(booksData);
      setUsers(usersData);
    } catch (error) {
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      bookId: ''
    });
    setError('');
  };

  const handleCreateLoan = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await createLoan(formData);
      setShowForm(false);
      resetForm();
      await fetchData(); // Refresh data
    } catch (error) {
      setError('Failed to create loan. Please try again.');
    }
  };

  const handleReturnBook = async (loanId) => {
    try {
      await returnBook(loanId);
      await fetchData(); // Refresh data
    } catch (error) {
      setError('Failed to return book. Please try again.');
    }
  };

  // Filter for available books only (assuming they have quantity > 0 and are not currently loaned)
  const availableBooks = books.filter(book => book.quantity > 0 && book.available);

  // Check if a loan is overdue
  const isOverdue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    return now > due;
  };

  // Format date in a readable format - moved to LoanCard component

  return (
    <div className="loan-management-page">
      <div className="page-header">
        <h1>🔄 Loan Management</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Create New Loan
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <h2>Create New Loan</h2>
          <form onSubmit={handleCreateLoan}>
            <SelectInput
              label="Select User"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              options={users.map(user => ({ value: user.id, label: `${user.name} (${user.email})` }))}
              required
            />
            <SelectInput
              label="Select Book"
              name="bookId"
              value={formData.bookId}
              onChange={handleInputChange}
              options={availableBooks.map(book => ({ value: book.id, label: `${book.title} by ${book.author}` }))}
              required
            />
            <div className="form-buttons">
              <SubmitButton text="Create Loan" />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading loan data...</div>
      ) : (
        <div className="loans-container">
          <h2>Active Loans</h2>
          {loans.filter(loan => !loan.returnDate).length === 0 ? (
            <div className="no-loans">No active loans at the moment.</div>
          ) : (
            <div className="loans-grid">
              {loans
                .filter(loan => !loan.returnDate)
                .map((loan) => {
                  const book = books.find(b => b.id === loan.bookId);
                  const user = users.find(u => u.id === loan.userId);
                  const overdue = isOverdue(loan.dueDate);
                  
                  return (
                    <LoanCard 
                      key={loan.id}
                      loan={loan}
                      book={book}
                      user={user}
                      isOverdue={overdue}
                      onReturn={handleReturnBook}
                    />
                  );
                })}
            </div>
          )}

          <h2 className="mt-4">Return History</h2>
          {loans.filter(loan => loan.returnDate).length === 0 ? (
            <div className="no-loans">No return history available.</div>
          ) : (
            <div className="loans-table">
              <table>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Borrowed By</th>
                    <th>Loan Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loans
                    .filter(loan => loan.returnDate)
                    .map((loan) => {
                      const book = books.find(b => b.id === loan.bookId);
                      const user = users.find(u => u.id === loan.userId);
                      const returnDate = new Date(loan.returnDate);
                      const dueDate = new Date(loan.dueDate);
                      const wasOverdue = returnDate > dueDate;
                      
                      return (
                        <tr key={loan.id}>
                          <td>{book ? book.title : 'Unknown Book'}</td>
                          <td>{user ? user.name : 'Unknown User'}</td>
                          <td>{new Date(loan.loanDate).toLocaleDateString()}</td>
                          <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                          <td>{new Date(loan.returnDate).toLocaleDateString()}</td>
                          <td className={wasOverdue ? 'text-danger' : 'text-success'}>
                            {wasOverdue ? 'Returned Late' : 'Returned On Time'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoanManagement;