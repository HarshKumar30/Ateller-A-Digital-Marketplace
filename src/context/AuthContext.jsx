import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'atelier_token';
const USER_KEY = 'luxe_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);

  const persist = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(USER_KEY);
    if (nextToken) localStorage.setItem(TOKEN_KEY, nextToken);
    else localStorage.removeItem(TOKEN_KEY);
  };

  // Rehydrate + validate token on mount
  useEffect(() => {
    const validate = async () => {
      const t = localStorage.getItem(TOKEN_KEY);
      if (!t) return;
      try {
        const { data } = await axios.get(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${t}` },
        });
        setUser(data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      } catch {
        persist(null, null);
      }
    };
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/register`, { name, email, password });
      persist(data.user, data.token);
      return { success: true };
    } catch (err) {
      console.error('Register error:', err);
      return { success: false, error: err.response?.data?.error || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/login`, { email, password });
      persist(data.user, data.token);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: err.response?.data?.error || 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => persist(null, null);

  const authHeader = () =>
    token ? { Authorization: `Bearer ${token}` } : {};

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, authHeader, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
