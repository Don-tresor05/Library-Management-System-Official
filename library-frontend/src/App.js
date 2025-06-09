import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { NotificationProvider } from './context/NotificationContext';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Layout>
            <Routes>
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/books" replace />} />
              
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Authenticated user routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/books" element={<BookList />} />
                <Route path="/books/:id" element={<BookDetail />} />
                <Route path="/loans" element={<LoanList />} />
              </Route>

              {/* Admin-only routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/books" element={<BookList adminView />} />
                <Route path="/admin/books/create" element={<BookForm />} />
                <Route path="/admin/books/edit/:id" element={<BookForm />} />
                <Route path="/admin/users" element={<UserList />} />
                <Route path="/admin/users/create" element={<UserForm />} />
                <Route path="/admin/users/edit/:id" element={<UserForm />} />
                <Route path="/admin/users/:userId/loans" element={<UserLoans />} />
                <Route path="/admin/loans" element={<LoanList adminView />} />
                <Route path="/admin/dashboard" element={<AnalyticsDashboard />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/books" replace />} />
            </Routes>
          </Layout>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;