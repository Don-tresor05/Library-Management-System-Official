// src/components/BookCard.jsx
import React from 'react';

const BookCard = ({ book, onEdit, onDelete }) => {
  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>ISBN:</strong> {book.isbn}</p>
      <p><strong>Genre:</strong> {book.genre || 'N/A'}</p>
      <p><strong>Year:</strong> {book.publicationYear || 'N/A'}</p>
      <p className="availability">
        <strong>Available:</strong> {book.available ? 'Yes' : 'No'} 
        ({book.quantity} total)
      </p>
      <div className="book-actions">
        <button className="btn btn-sm btn-secondary" onClick={() => onEdit(book)}>
          Edit
        </button>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete(book.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default BookCard;