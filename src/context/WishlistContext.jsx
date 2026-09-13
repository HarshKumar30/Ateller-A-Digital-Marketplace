import { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const toggle = (product) => setWishlist(prev =>
    prev.find(p => p.id === product.id) ? prev.filter(p => p.id !== product.id) : [...prev, product]
  );
  const isWishlisted = (id) => wishlist.some(p => p.id === id);
  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
