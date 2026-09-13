import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Sell from './pages/Sell';
import SellerRegister from './pages/SellerRegister';
import SellerLogin from './pages/SellerLogin';
import SellerDashboard from './pages/SellerDashboard';
import SellerStorefront from './pages/SellerStorefront';

import BuyerLayout from './layouts/BuyerLayout';
import SellerLayout from './layouts/SellerLayout';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SellerProvider, useSeller } from './context/SellerContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function ProtectedSellerRoute({ children }) {
  const { isSellerAuthenticated } = useSeller();
  return isSellerAuthenticated ? children : <Navigate to="/seller/login" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
    <div className="luxe-app">
      <AuthProvider>
        <SellerProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Routes>
                {/* Buyer experience: buyer nav + footer, commerce enabled */}
                <Route element={<BuyerLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  {/* Bridge + public storefront stay buyer-visible */}
                  <Route path="/sell" element={<Sell />} />
                  <Route path="/seller/:id" element={<SellerStorefront />} />
                  <Route path="/order-confirmed" element={<div className="container vast-space text-center"><h1 className="display-lg">Order Received.</h1><p className="body-md">Your artifacts are being prepared for shipment.</p></div>} />
                </Route>

                {/* Seller experience: seller nav + footer, no cart/wishlist chrome */}
                <Route element={<SellerLayout />}>
                  <Route path="/seller/register" element={<SellerRegister />} />
                  <Route path="/seller/login" element={<SellerLogin />} />
                  <Route path="/seller/dashboard" element={
                    <ProtectedSellerRoute>
                      <SellerDashboard />
                    </ProtectedSellerRoute>
                  } />
                  <Route path="/seller/dashboard/:tab" element={
                    <ProtectedSellerRoute>
                      <SellerDashboard />
                    </ProtectedSellerRoute>
                  } />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster position="bottom-right" />
            </Router>
          </WishlistProvider>
        </CartProvider>
        </SellerProvider>
      </AuthProvider>
    </div>
    </ThemeProvider>
  );
}
