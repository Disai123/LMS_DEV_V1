import React, { createContext, useContext, useEffect } from 'react';
import useAuthStore from '../store/authStore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const authStore = useAuthStore();

  useEffect(() => {
    // Initialize auth state
    authStore.initialize();
  }, []);

  return (
    <AuthContext.Provider value={authStore}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

