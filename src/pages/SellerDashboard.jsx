import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSeller } from '../context/SellerContext';
import { sellerApi } from '../lib/productsApi';
import { categories, formatPrice } from '../data/products';
import toast from 'react-hot-toast';
import './SellerDashboard.css';

const EMPTY_FORM = {
  name: '',
  category: 'electronics',
  price: '',
  originalPrice: '',
  image: '',
  description: '',
  badge: '',
  tags: '',
  inStock: true,
};

const TABS = [
  { id: 'overview', label: 'Overview', to: '/seller/dashboard' },
  { id: 'products', label: 'Products', to: '/seller/dashboard/products' },
  { id: 'orders', label: 'Orders', to: '/seller/dashboard/orders' },
];

export default function SellerDashboard() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeTab = tab || 'overview';
  const { seller, sellerToken, logout } = useSeller();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const api = sellerApi(sellerToken);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.list());
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const startEdit = (p) => {
    if (activeTab !== 'products') navigate('/seller/dashboard/products');
    setEditingId(p.id);
    setForm({
      name: p.name || '',
      category: p.category || 'electronics',
      price: String(p.price ?? ''),
      originalPrice: p.originalPrice != null ? String(p.originalPrice) : '',
      image: p.image || '',
      description: p.description || '',
      badge: p.badge || '',
      tags: (p.tags || []).join(', '),
      inStock: !!p.inStock,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      toast.error('Name and price are required');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      originalPrice: form.originalPrice === '' ? null : Number(form.originalPrice),
      image: form.image.trim() || null,
      description: form.description.trim() || null,
      badge: form.badge.trim() || null,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      inStock: !!form.inStock,
    };
    try {
      if (editingId) {
        const updated = await api.update(editingId, payload);
        setItems((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
        toast.success('Product updated');
      } else {
        const created = await api.create(payload);
        setItems((prev) => [created, ...prev]);
        toast.success('Product listed');
      }
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.remove(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) resetForm();
      toast.success('Product deleted');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    }
  };

  const toggleStock = async (p) => {
    try {
      const updated = await api.setStock(p.id, !p.inStock);
      setItems((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Stock update failed');
    }
  };

  const inStock = items.filter((p) => p.inStock).length;
  const outOfStock = items.length - inStock;
  const inventoryValue = items.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  return (
    <div className="seller-dash page-enter">
      <div className="container vast-space">
        <header className="seller-head">
          <div>
            <span className="label-md">Seller Dashboard · seller mode</span>
            <h1 className="display-lg">{seller?.shop_name || 'Your shop'}</h1>
            <p className="body-md opacity-60">{seller?.email} · buyer cart & wishlist hidden in this mode</p>
          </div>
          <button className="btn-tertiary" onClick={logout}>Sign out</button>
        </header>

        <nav className="seller-tabs" aria-label="Seller sections">
          {TABS.map((t) => (
            <Link
              key={t.id}
              to={t.to}
              className={`seller-tab label-md${(activeTab === t.id || (t.id === 'overview' && !tab)) ? ' active' : ''}`}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        {(activeTab === 'overview' || !tab) && (
          <section className="seller-stats">
            <div className="seller-stat-card">
              <span className="label-md">Products</span>
              <strong className="display-sm">{loading ? '…' : items.length}</strong>
            </div>
            <div className="seller-stat-card">
              <span className="label-md">In stock</span>
              <strong className="display-sm">{loading ? '…' : inStock}</strong>
            </div>
            <div className="seller-stat-card">
              <span className="label-md">Out of stock</span>
              <strong className="display-sm">{loading ? '…' : outOfStock}</strong>
            </div>
            <div className="seller-stat-card">
              <span className="label-md">List value</span>
              <strong className="display-sm">{loading ? '…' : formatPrice(inventoryValue)}</strong>
            </div>
          </section>
        )}

        {(activeTab === 'overview' || !tab) && (
          <section>
            <h2 className="display-sm">Getting started</h2>
            <p className="body-md opacity-60">
              List artifacts under Products — they appear instantly in the buyer Shop and your public storefront
              {seller ? (<> (<Link to={`/seller/${seller.id}`} className="btn-tertiary">view storefront</Link>)</>) : ''}.
              Orders arrive in v2; the Orders tab is a placeholder for now.
            </p>
          </section>
        )}

        {activeTab === 'products' && (
          <>
            <section className="seller-form-card">
              <h2 className="display-sm">{editingId ? `Edit #${editingId}` : 'List a new artifact'}</h2>
              <form onSubmit={handleSubmit} className="seller-grid">
                <label className="label-md">Name<input className="input-minimal" value={form.name} onChange={(e) => set(e, 'name')} required minLength={2} /></label>
                <label className="label-md">Category
                  <select className="input-minimal" value={form.category} onChange={(e) => set('category', e.target.value)}>
                    {categories.filter((c) => c.id !== 'all').map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </label>
                <label className="label-md">Price (INR)<input type="number" min="1" className="input-minimal" value={form.price} onChange={(e) => set('price', e.target.value)} required /></label>
                <label className="label-md">Original price<input type="number" min="1" className="input-minimal" value={form.originalPrice} onChange={(e) => set('originalPrice', e.target.value)} placeholder="Optional" /></label>
                <label className="label-md seller-span">Image URL<input className="input-minimal" value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="https://…" /></label>
                <label className="label-md seller-span">Description<textarea className="input-minimal" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} /></label>
                <label className="label-md">Badge<input className="input-minimal" value={form.badge} onChange={(e) => set('badge', e.target.value)} placeholder="New / Sale" /></label>
                <label className="label-md">Tags (comma separated)<input className="input-minimal" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="wireless, premium" /></label>
                <label className="label-md seller-check"><input type="checkbox" checked={form.inStock} onChange={(e) => set('inStock', e.target.checked)} /> In stock</label>
                <div className="seller-actions seller-span">
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'List product'}</button>
                  {editingId && <button type="button" className="btn-tertiary" onClick={resetForm}>Cancel edit</button>}
                </div>
              </form>
            </section>

            <section>
              <h2 className="display-sm">Your products</h2>
              {loading ? <p className="body-md">Loading…</p> : items.length === 0 ? (
                <p className="body-md opacity-60">No products yet. List your first artifact above.</p>
              ) : (
                <div className="seller-table-wrap">
                  <table className="seller-table">
                    <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                    <tbody>
                      {items.map((p) => (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td>{p.name}</td>
                          <td>{p.category}</td>
                          <td>{formatPrice(p.price)}</td>
                          <td><button className="btn-tertiary" onClick={() => toggleStock(p)}>{p.inStock ? 'In stock' : 'Out of stock'}</button></td>
                          <td className="seller-row-actions">
                            <button className="btn-tertiary" onClick={() => startEdit(p)}>Edit</button>
                            <button className="btn-tertiary" onClick={() => handleDelete(p.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'orders' && (
          <section className="seller-orders-empty">
            <h2 className="display-sm">No orders yet.</h2>
            <p className="body-md opacity-60">
              Order management lands in v2. For now this marketplace is products-only:
              your artifacts are live in the buyer Shop and storefront, and buyers check out as guests of the house.
            </p>
            <Link to="/seller/dashboard/products" className="btn btn-primary">Manage products</Link>
          </section>
        )}
      </div>
    </div>
  );
}
