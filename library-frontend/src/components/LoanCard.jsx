// src/components/LoanCard.jsx
import React from 'react';

const LoanCard = ({ loan, book, user, isOverdue, onReturn }) => {
  // Format date in a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`loan-card ${isOverdue ? 'overdue' : ''}`}>
      <div className="loan-header">
        <h3>{book ? book.title : 'Unknown Book'}</h3>
        {isOverdue && <span className="overdue-badge">OVERDUE</span>}
      </div>
      <p><strong>Borrowed by:</strong> {user ? user.name : 'Unknown User'}</p>
      <p><strong>Borrowed on:</strong> {formatDate(loan.loanDate)}</p>
      <p><strong>Due by:</strong> {formatDate(loan.dueDate)}</p>
      {!loan.returnDate && (
        <div className="loan-actions">
          <button className="btn btn-primary" onClick={() => onReturn(loan.id)}>
            Return Book
          </button>
        </div>
      )}
      {loan.returnDate && (
        <p><strong>Returned on:</strong> {formatDate(loan.returnDate)}</p>
      )}
    </div>
  );
};

export default LoanCard;