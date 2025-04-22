// src/pages/BookList.jsx - Updated
import React, { useState, useEffect } from 'react';
import { getAllBooks, createBook, updateBook, deleteBook } from '../services/bookService';
import { TextInput, SubmitButton } from '../components/FormComponents';
import BookCard from '../components/BookCard';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publicationYear: '',
    genre: '',
    quantity: 1
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await getAllBooks();
      setBooks(data);
    } catch (error) {
      // Handle error - show error message
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
      title: '',
      author: '',
      isbn: '',
      publicationYear: '',
      genre: '',
      quantity: 1
    });
    setSelectedBook(null);
    setFormMode('create');
  };

  const handleShowCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publicationYear: book.publicationYear,
      genre: book.genre,
      quantity: book.quantity
    });
    setFormMode('edit');
    setShowForm(true);
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        await fetchBooks(); // Refresh books after delete
      } catch (error) {
        // Handle error
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formMode === 'create') {
        await createBook(formData);
      } else {
        await updateBook(selectedBook.id, formData);
      }
      setShowForm(false);
      resetForm();
      await fetchBooks(); // Refresh books
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="book-list-page">
      <div className="page-header">
        <h1>📖 Book List</h1>
        <button className="btn btn-primary" onClick={handleShowCreateForm}>
          Add New Book
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{formMode === 'create' ? 'Add New Book' : 'Edit Book'}</h2>
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter book title"
              required
            />
            <TextInput
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Enter author name"
              required
            />
            <TextInput
              label="ISBN"
              name="isbn"
              value={formData.isbn}
              onChange={handleInputChange}
              placeholder="Enter ISBN"
              required
            />
            <TextInput
              label="Publication Year"
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleInputChange}
              placeholder="Enter publication year"
            />
            <TextInput
              label="Genre"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              placeholder="Enter genre"
            />
            <TextInput
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Enter quantity"
              required
            />
            <div className="form-buttons">
              <SubmitButton text={formMode === 'create' ? 'Add Book' : 'Update Book'} />
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading books...</div>
      ) : (
        <div className="books-grid">
          {books.length === 0 ? (
            <div className="no-books">No books available. Add some books to get started!</div>
          ) : (
            books.map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                onEdit={handleEditBook} 
                onDelete={handleDeleteBook} 
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BookList;