import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('zen_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('zen_token');
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data.data.user);
          localStorage.setItem('zen_user', JSON.stringify(res.data.data.user));
        } catch (err) {
          localStorage.removeItem('zen_token');
          localStorage.removeItem('zen_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data.data;
      localStorage.setItem('zen_token', token);
      localStorage.setItem('zen_user', JSON.stringify(user));
      setUser(user);
      toast.success(`Welcome back, ${user.full_name}!`);
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (full_name, email, password) => {
    try {
      const res = await api.post('/auth/register', { full_name, email, password });
      const { user, token } = res.data.data;
      localStorage.setItem('zen_token', token);
      localStorage.setItem('zen_user', JSON.stringify(user));
      setUser(user);
      toast.success('Registration successful! Welcome to ZenNotes.');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('zen_token');
      localStorage.removeItem('zen_user');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('zen_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
