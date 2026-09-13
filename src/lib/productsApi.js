import axios from 'axios';
import { products as fallbackProducts } from '../data/products';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function fetchProducts() {
  try {
    const { data } = await axios.get(`${API_URL}/products`);
    if (Array.isArray(data.products) && data.products.length > 0) return data.products;
    return fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}

export async function fetchProduct(id) {
  try {
    const { data } = await axios.get(`${API_URL}/products/${id}`);
    return data.product;
  } catch {
    return fallbackProducts.find((p) => String(p.id) === String(id)) || null;
  }
}

export function sellerApi(token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return {
    list: async () => (await axios.get(`${API_URL}/seller/products`, { headers })).data.products,
    create: async (payload) => (await axios.post(`${API_URL}/seller/products`, payload, { headers })).data.product,
    update: async (id, payload) => (await axios.put(`${API_URL}/seller/products/${id}`, payload, { headers })).data.product,
    remove: async (id) => (await axios.delete(`${API_URL}/seller/products/${id}`, { headers })).data,
    setStock: async (id, inStock) =>
      (await axios.patch(`${API_URL}/seller/products/${id}/stock`, { inStock }, { headers })).data.product,
  };
}
