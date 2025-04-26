// src/components/layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">Library System</Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-gray-200">Home</Link>
            <Link to="/books" className="hover:text-gray-200">Books</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/loans" className="hover:text-gray-200">My Loans</Link>
                
                {isAdmin && (
                  <>
                    <Link to="/admin/books" className="hover:text-gray-200">Manage Books</Link>
                    <Link to="/admin/users" className="hover:text-gray-200">Manage Users</Link>
                    <Link to="/admin/loans" className="hover:text-gray-200">All Loans</Link>
                  </>
                )}
                
                <div className="flex items-center">
                  <span className="mr-2">{user.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-white text-primary px-3 py-1 rounded text-sm hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link 
                  to="/login" 
                  className="bg-white text-primary px-3 py-1 rounded text-sm hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-primary px-3 py-1 rounded text-sm hover:bg-gray-100"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;