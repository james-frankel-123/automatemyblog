import React, { createContext, useContext, useState, useEffect } from 'react';
import autoBlogAPI from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [loginContext, setLoginContext] = useState(null); // 'gate' or 'nav'

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await autoBlogAPI.me();
        setUser(response.user);
        if (response.user.organizations?.length > 0) {
          setCurrentOrganization(response.user.organizations[0]);
        }
      }
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, context = null) => {
    const response = await autoBlogAPI.login(email, password);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    setUser(response.user);
    if (response.user.organizations?.length > 0) {
      setCurrentOrganization(response.user.organizations[0]);
    }
    
    // Store login context for routing decisions
    setLoginContext(context);
    
    return { ...response, context };
  };

  const register = async (userData, context = null) => {
    const response = await autoBlogAPI.register(userData);
    
    // If registration includes auto-login, handle context
    if (response.user) {
      setUser(response.user);
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      setLoginContext(context);
    }
    
    return { ...response, context };
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setCurrentOrganization(null);
    setLoginContext(null);
  };

  const clearLoginContext = () => {
    setLoginContext(null);
  };

  const setNavContext = () => {
    setLoginContext('nav');
  };

  const value = {
    user,
    currentOrganization,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    loginContext,
    clearLoginContext,
    setNavContext,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};