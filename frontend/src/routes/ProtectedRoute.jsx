import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuthStore();

  // 1. Agar user logged in nahi hai (user null hai)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 2. Agar user hai par uska role galat hai
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // Sab sahi hai toh page dikhao (Children render karo)
  return children;
};

export default ProtectedRoute;