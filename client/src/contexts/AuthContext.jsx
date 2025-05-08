import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Mock authentication functions
  // In a real application, these would connect to your backend
  
  useEffect(() => {
    // Check for existing session in localStorage
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const login = async (email, password) => {
    try {
      // This would be replaced with an actual API call
      // Simulating API response
      const mockUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 10),
        name: email.split('@')[0],
        email,
        role: email.includes('admin') ? 'admin' : 
              email.includes('moderator') ? 'moderator' : 'user',
        createdAt: new Date().toISOString(),
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to login' 
      };
    }
  };
  
  const register = async (name, email, password) => {
    try {
      // This would be replaced with an actual API call
      // Simulating API response
      const mockUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 10),
        name,
        email,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to register' 
      };
    }
  };
  
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };
  
  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return { success: true };
  };
  
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
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