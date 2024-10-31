// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  authenticated: boolean | null; // null indicates loading state
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    localStorage.removeItem('authenticated'); // Clear any previous session
    setAuthenticated(false); // Set authenticated state to false
  }, []);

  const login = () => {
    localStorage.setItem('authenticated', 'true');
    setAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authenticated');
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};