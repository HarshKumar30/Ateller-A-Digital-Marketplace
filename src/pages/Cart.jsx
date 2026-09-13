import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import toast from 'react-hot-toast';
import './Cart.css';

export default function Cart() {
  const { items, total, removeFromCart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();
  const shipping = total > 9999 ? 0 : 499; // Luxe shipping
  const tax = Math.round(total * 0.18);
  const grandTotal = total + shipping + tax;

  if (items.length === 0) return (
    <div className="cart-empty-luxe page-enter vast-space">
      <div className="container flex-center" style={{ flexDirection: 'column' }}>
        <h2 className="display-lg">Your Cart is Empty.</h2>
        <p className="body-md" style={{ marginBottom: 40, opacity: 0.6 }}>Curate your collection from our catalog.</p>
        <Link to="/shop" className="btn btn-primary">Discover Products</Link>
      </div>
    </div>
  );

  return (
    <div className="cart-luxe page-enter">
      <div className="container">
        <header className="cart-header-luxe vast-space">
          <div className="header-text">
            <span className="label-md">Selection</span>
            <h1 className="display-lg">Cart</h1>
          </div>
          <button className="btn-tertiary" onClick={() => { clearCart(); toast('Collection cleared'); }}>Clear Selection</button>
        </header>

        <div className="cart-layout-luxe">
          {/* 1. Items List - No Borders */}
          <div className="cart-items-luxe">
            {items.map(item => (
              <div key={item.id} className="cart-item-luxe">
                <Link to={`/product/${item.id}`} className="cart-item-visual product-image-bg">
                  <img src={item.image} alt={item.name} />
                </Link>
                <div className="cart-item-details">
                  <span className="label-md cart-item-cat">{item.category}</span>
                  <Link to={`/product/${item.id}`} className="cart-item-name noto-serif">{item.name}</Link>
                  <div className="cart-item-controls">
                    <div className="qty-picker-luxe mini">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1}><Minus size={12} /></button>
                      <span className="qty-val">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}><Plus size={12} /></button>
                    </div>
                    <button className="remove-btn-luxe label-md" onClick={() => { removeFromCart(item.id); toast('Removed'); }}>
                      REMOVE
                    </button>
                  </div>
                </div>
                <div className="cart-item-price-luxe label-md">
                  {formatPrice(item.price * item.qty)}
                </div>
              </div>
            ))}
          </div>

          {/* 2. Summary - Float and Tonal */}
          <aside className="cart-summary-luxe">
            <div className="summary-card-luxe">
              <h3 className="label-md">Summary</h3>

              <div className="summary-rows-luxe">
                <div className="summary-row-luxe body-md">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="summary-row-luxe body-md">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'COMPLIMENTARY' : formatPrice(shipping)}</span>
                </div>
                <div className="summary-row-luxe body-md">
                  <span>Tax (EST)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="summary-total-luxe">
                <span className="label-md">Total</span>
                <span className="total-val-luxe">{formatPrice(grandTotal)}</span>
              </div>

              <div className="coupon-box-luxe">
                <input className="input-minimal" placeholder="Promotion Code" />
              </div>

              <button className="btn btn-primary checkout-btn-luxe" onClick={() => navigate('/checkout')}>
                PROCEED TO CHECKOUT
              </button>

              <p className="secure-tag label-md">SECURED ENCRYPTION</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
