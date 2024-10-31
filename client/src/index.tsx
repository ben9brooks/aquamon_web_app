// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { Temp } from './Temp';
import { PH } from './PH';
import { Tds } from './Tds';
import { Login } from './Login';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/main_window',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: '/temp',
    element: (
      <ProtectedRoute>
        <Temp />
      </ProtectedRoute>
    ),
  },
  {
    path: '/ph',
    element: (
      <ProtectedRoute>
        <PH />
      </ProtectedRoute>
    ),
  },
  {
    path: '/tds',
    element: (
      <ProtectedRoute>
        <Tds />
      </ProtectedRoute>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);