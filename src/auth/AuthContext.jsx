import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({
          email: decodedToken.email,
          name: decodedToken.name || 'Guest',
          user_id: decodedToken.user_id
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    sessionStorage.setItem('authToken', token);
    try {
      const decodedToken = jwtDecode(token);
      setUser({ email: decodedToken.email, name: decodedToken.name,user_id:decodedToken.user_id });
    } catch (error) {
      console.error('Error decoding token on login:', error);
      setUser(null);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
