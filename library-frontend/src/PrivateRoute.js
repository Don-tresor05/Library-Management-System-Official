import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;