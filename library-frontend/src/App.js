import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import BookList from './components/books/BookList';
import BookDetail from './components/books/BookDetail';
import UserList from './components/users/UserList';
import UserForm from './components/users/UserForm';
import UserLoans from './components/loans/UserLoans';
import LoanList from './components/loans/LoanList';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import BookForm from './components/admin/BookForm';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<BookList />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User Routes */}
            <Route path="/loans" element={<LoanList />} />
            
            {/* Admin Routes */}
            <Route path="/admin/books" element={<BookList adminView />} />
            <Route path="/admin/books/create" element={<BookForm />} />
            <Route path="/admin/books/edit/:id" element={<BookForm />} />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/admin/users/create" element={<UserForm />} />
            <Route path="/admin/users/edit/:id" element={<UserForm />} />
            <Route path="/admin/users/:userId/loans" element={<UserLoans />} />
            <Route path="/admin/loans" element={<LoanList />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
};

export default App;