import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api.config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    localStorage.setItem('token', response.data.data.auth_token); // Stocke le token
    localStorage.setItem('userId', response.data.data.userId); 
    localStorage.setItem('email', response.data.data.email); 
    localStorage.setItem('firstname', response.data.data.firstname); 
    localStorage.setItem('lastname', response.data.data.lastname); 
    localStorage.setItem('role', response.data.data.role); 
    setUser({
      userId: response.data.data.userId,
      email: response.data.data.email,
      firstname: response.data.data.firstname,
      lastname: response.data.data.lastname,
      role: response.data.data.role
    }); // Stocke toutes les données utilisateur
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
