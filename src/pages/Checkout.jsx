import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';
import './Checkout.css';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '', state: '', payment: 'upi' });
  const shipping = total > 9999 ? 0 : 499;
  const tax = Math.round(total * 0.18);
  const grandTotal = total + shipping + tax;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const nextStep = () => setStep(s => s + 1);
  const handleDeliverySubmit = () => {
    const { name, email, phone, address, city, pincode } = form;
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      return toast.error('Please fill all delivery details.', { className: 'hot-toast' });
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return toast.error('Please enter a valid email address.', { className: 'hot-toast' });
    }
    if (phone.replace(/\D/g, '').length < 10) {
      return toast.error('Please enter a valid 10-digit phone number.', { className: 'hot-toast' });
    }
    nextStep();
  };
  const placeOrder = () => {
    clearCart();
    navigate('/order-confirmed');
    toast.success('Artifacts secured. Preparing shipment.', { className: 'hot-toast' });
  };

  if (items.length === 0 && step < 3) { navigate('/shop'); return null; }

  return (
    <div className="checkout-luxe page-enter">
      <div className="container">
        <header className="checkout-header-luxe vast-space">
          <div className="header-text">
            <span className="label-md">Transaction</span>
            <h1 className="display-lg">Checkout</h1>
          </div>
          {/* Minimalist Stepper */}
          <div className="stepper-luxe label-md">
            {['Delivery', 'Payment', 'Review'].map((s, i) => (
              <div key={s} className={`step-luxe ${step >= i + 1 ? 'active' : ''} ${step > i + 1 ? 'done' : ''}`}>
                <span className="step-label">{s}</span>
                {i < 2 && <div className="step-line" />}
              </div>
            ))}
          </div>
        </header>

        <div className="checkout-layout-luxe">
          <div className="checkout-form-luxe">
            {step === 1 && (
              <div className="form-section-luxe">
                <h3 className="display-sm">Delivery Details</h3>
                <div className="form-grid-luxe">
                  <div className="form-group-luxe full">
                    <label className="label-md">Full Name</label>
                    <input className="input-minimal" name="name" value={form.name} onChange={handleChange} placeholder="The Recipient" />
                  </div>
                  <div className="form-group-luxe">
                    <label className="label-md">Email</label>
                    <input className="input-minimal" type="email" name="email" value={form.email} onChange={handleChange} placeholder="atelier@member.com" />
                  </div>
                  <div className="form-group-luxe">
                    <label className="label-md">Phone</label>
                    <input className="input-minimal" name="phone" value={form.phone} onChange={handleChange} placeholder="+91" />
                  </div>
                  <div className="form-group-luxe full">
                    <label className="label-md">Address</label>
                    <input className="input-minimal" name="address" value={form.address} onChange={handleChange} placeholder="Street, Building, Flat" />
                  </div>
                  <div className="form-group-luxe">
                    <label className="label-md">City</label>
                    <input className="input-minimal" name="city" value={form.city} onChange={handleChange} />
                  </div>
                  <div className="form-group-luxe">
                    <label className="label-md">Pincode</label>
                    <input className="input-minimal" name="pincode" value={form.pincode} onChange={handleChange} />
                  </div>
                </div>
                <button className="btn btn-primary checkout-next-btn" onClick={handleDeliverySubmit}>CONTINUE TO PAYMENT</button>
              </div>
            )}

            {step === 2 && (
              <div className="form-section-luxe">
                <h3 className="display-sm">Payment Method</h3>
                <div className="payment-options-luxe">
                  {[['upi', 'UPI ATELIER'], ['card', 'RESERVE CARD'], ['netbanking', 'BANK TRANSFER'], ['cod', 'UPON ARRIVAL']].map(([val, label]) => (
                    <label key={val} className={`payment-opt-luxe ${form.payment === val ? 'active' : ''}`}>
                      <input type="radio" name="payment" value={val} checked={form.payment === val} onChange={handleChange} style={{ display: 'none' }} />
                      <span className="label-md">{label}</span>
                      {form.payment === val && <Check size={14} strokeWidth={3} />}
                    </label>
                  ))}
                </div>
                <div className="flex-row-luxe">
                  <button className="btn-tertiary" onClick={() => setStep(1)}>Back</button>
                  <button className="btn btn-primary" onClick={nextStep}>REVIEW ORDER</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-section-luxe">
                <h3 className="display-sm">Final Review</h3>
                <div className="review-items-luxe">
                  {items.map(item => (
                    <div key={item.id} className="review-item-luxe">
                      <div className="review-item-main">
                        <span className="noto-serif">{item.name}</span>
                        <span className="label-md opacity-40">QTY: {item.qty}</span>
                      </div>
                      <span className="label-md">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex-row-luxe">
                  <button className="btn-tertiary" onClick={() => setStep(2)}>Back</button>
                  <button className="btn btn-primary" onClick={placeOrder}>PLACE ORDER</button>
                </div>
              </div>
            )}
          </div>

          <aside className="checkout-summary-luxe">
            <div className="summary-card-luxe">
              <h3 className="label-md">Summary</h3>
              <div className="summary-rows-luxe">
                <div className="summary-row-luxe body-md"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
                <div className="summary-row-luxe body-md"><span>Shipping</span><span>{shipping === 0 ? 'COMPLIMENTARY' : formatPrice(shipping)}</span></div>
                <div className="summary-row-luxe body-md"><span>Tax</span><span>{formatPrice(tax)}</span></div>
              </div>
              <div className="summary-total-luxe">
                <span className="label-md">Total</span>
                <span className="total-val-luxe">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
