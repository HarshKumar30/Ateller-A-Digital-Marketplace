import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Shop.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function SellerStorefront() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/sellers/${id}/products`);
        setSeller(data.seller);
        setItems(data.products || []);
      } catch (e) {
        setError(e.response?.data?.error || 'Seller not found');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  if (loading) return <div className="container vast-space"><p className="body-md">Loading storefront…</p></div>;
  if (error) return <div className="container vast-space"><h2 className="display-sm">{error}</h2><Link to="/shop" className="btn-tertiary">Back to Shop</Link></div>;

  return (
    <div className="shop-luxe page-enter">
      <div className="container vast-space">
        <span className="label-md">Seller Storefront</span>
        <h1 className="display-lg">{seller.shop_name}</h1>
        <p className="body-md opacity-60">{items.length} artifact(s)</p>
        <div className="shop-grid-luxe" style={{ marginTop: 32 }}>
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
