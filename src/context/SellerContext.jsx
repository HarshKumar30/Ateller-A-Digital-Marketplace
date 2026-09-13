import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SellerContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'atelier_seller_token';
const SELLER_KEY = 'atelier_seller';

export function SellerProvider({ children }) {
  const [seller, setSeller] = useState(() => {
    try {
      const saved = localStorage.getItem(SELLER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [sellerToken, setSellerToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);

  const persist = (nextSeller, nextToken) => {
    setSeller(nextSeller);
    setSellerToken(nextToken);
    if (nextSeller) localStorage.setItem(SELLER_KEY, JSON.stringify(nextSeller));
    else localStorage.removeItem(SELLER_KEY);
    if (nextToken) localStorage.setItem(TOKEN_KEY, nextToken);
    else localStorage.removeItem(TOKEN_KEY);
  };

  useEffect(() => {
    const validate = async () => {
      const t = localStorage.getItem(TOKEN_KEY);
      if (!t) return;
      try {
        const { data } = await axios.get(`${API_URL}/seller/me`, {
          headers: { Authorization: `Bearer ${t}` },
        });
        setSeller(data.seller);
        localStorage.setItem(SELLER_KEY, JSON.stringify(data.seller));
      } catch {
        persist(null, null);
      }
    };
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = async (shop_name, email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/seller/register`, { shop_name, email, password });
      persist(data.seller, data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Seller registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/seller/login`, { email, password });
      persist(data.seller, data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => persist(null, null);

  const sellerHeader = () =>
    sellerToken ? { Authorization: `Bearer ${sellerToken}` } : {};

  return (
    <SellerContext.Provider
      value={{ seller, sellerToken, loading, register, login, logout, sellerHeader, isSellerAuthenticated: !!seller }}
    >
      {children}
    </SellerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSeller = () => useContext(SellerContext);
