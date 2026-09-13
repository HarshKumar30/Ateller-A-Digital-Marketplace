import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../data/products';
import toast from 'react-hot-toast';
import './ProductCard.css';

export default function ProductCard({ product, mode = 'buyer' }) {
  const { addToCart, isInCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const isSellerView = mode === 'seller';

  const wishlisted = isWishlisted(product.id);
  const inCart = isInCart(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!product.inStock) return;
    addToCart(product);
    toast.success(`${product.name.slice(0, 15)}... added to cart`, { className: 'hot-toast' });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(product);
    toast(wishlisted ? 'Removed from curated' : 'Added to curated list', { className: 'hot-toast' });
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card page-enter">
      {/* Image Container with Tonal Background */}
      <div className="pc-image-container product-image-bg">
        <img src={product.image} alt={product.name} className="pc-image" loading="lazy" />

        {/* Editorial Badge */}
        {product.badge && (
          <div className="pc-badge label-md luxe-badge">{product.badge}</div>
        )}

        {/* Wishlist Icon - buyer mode only (sellers don't shop here) */}
        {!isSellerView && (
        <button
          className={`pc-wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlist}
          aria-label="Wishlist"
        >
          <Heart size={18} strokeWidth={1} fill={wishlisted ? 'var(--error)' : 'none'} />
        </button>
        )}
      </div>

      {/* Info Section - Extreme White Space */}
      <div className="pc-body">
        <div className="pc-header">
          <span className="pc-category label-md">{product.category}</span>
          <h3 className="pc-title">{product.name}</h3>
        </div>

        <div className="pc-footer">
          <div className="pc-price-wrap">
            <span className="pc-price-main">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="pc-price-old">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          {isSellerView ? (
            <span className="pc-price-main label-md">SELLER VIEW</span>
          ) : (
          <button
            className={`pc-add-btn ${inCart ? 'in-cart' : ''}`}
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            {inCart ? 'ADDED' : <ShoppingBag size={16} strokeWidth={1.5} />}
          </button>
          )}
        </div>
      </div>
    </Link>
  );
}
