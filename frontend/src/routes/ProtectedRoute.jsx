import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;