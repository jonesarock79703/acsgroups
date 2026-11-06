import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('acsgroups_user') || localStorage.getItem('apexvest_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('acsgroups_token') || localStorage.getItem('apexvest_token') || null;
  });

  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [authModalRole, setAuthModalRole] = useState('user'); // 'user' | 'admin'

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('acsgroups_user', JSON.stringify(data.user));
      } else if (res.status === 401) {
        logout();
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  useEffect(() => {
    if (token) {
      refreshUser();
    }
  }, [token]);

  const login = async (email, password, loginType = 'user') => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, loginType })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('acsgroups_token', data.token);
      localStorage.setItem('acsgroups_user', JSON.stringify(data.user));
      setAuthModalOpen(false);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, mobile, email, password, confirmPassword }) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, email, password, confirmPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('acsgroups_token', data.token);
      localStorage.setItem('acsgroups_user', JSON.stringify(data.user));
      setAuthModalOpen(false);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('acsgroups_token');
    localStorage.removeItem('acsgroups_user');
    localStorage.removeItem('apexvest_token');
    localStorage.removeItem('apexvest_user');
  };

  const openAuthModal = (mode = 'login', role = 'user') => {
    setAuthModalMode(mode);
    setAuthModalRole(role);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        refreshUser,
        authModalOpen,
        authModalMode,
        authModalRole,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
        setAuthModalRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
