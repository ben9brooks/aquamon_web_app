// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { authenticated } = useAuth();

  if (authenticated === null) {
    // Still loading the authentication state
    return <p>Loading...</p>;
  }

  return authenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;