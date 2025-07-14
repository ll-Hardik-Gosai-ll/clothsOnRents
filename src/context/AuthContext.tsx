import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { getCurrentUser, setCurrentUser, getUsers, initializeDefaultAdmin } from '../utils/storage';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  useEffect(() => {
    initializeDefaultAdmin();
    const user = getCurrentUser();
    if (user) {
      setAuthState({
        user,
        isAuthenticated: true
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple authentication - in production, this would be handled by a backend
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (user && (password === 'admin123' || email === 'admin@clothingrental.com')) {
      setCurrentUser(user);
      setAuthState({
        user,
        isAuthenticated: true
      });
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthState({
      user: null,
      isAuthenticated: false
    });
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};