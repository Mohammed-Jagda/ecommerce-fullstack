'use client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../lib/axios';
import { setCart } from '../../store/slices/cartSlice';

const CATEGORIES = ['All', 'Watches', 'T-Shirts', 'Shirts', 'Jeans', 'Bottles', 'Shoes', 'Bags'];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', success: true });
  const dispatch = useDispatch();

  const fetchProducts = async (q = '', cat = '') => {
    try {
      let url = '/products?';
      if (q) url += `search=${q}&`;
      if (cat && cat !== 'All') url += `category=${cat}`;
      const { data } = await api.get(url);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const showToast = (message, success = true) => {
    setToast({ show: true, message, success });
    setTimeout(() => setToast({ show: false, message: '', success: true }), 3000);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchProducts(e.target.value, activeCategory);
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    fetchProducts(search, cat);
  };

  const handleAddToCart = async (productId) => {
    setAddingId(productId);
    try {
      const { data } = await api.post('/cart', { productId, quantity: 1 });
      dispatch(setCart(data));
      showToast('Added to cart!', true);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add to cart', false);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-xl transition-all ${toast.success ? 'bg-gray-950 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-3">New Arrivals</p>
          <h1 className="text-5xl font-bold leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Shop the Latest<br />Trends
          </h1>
          <p className="text-gray-400 text-base max-w-md">
            Discover premium quality products at unbeatable prices. Free shipping on orders above ₹999.
          </p>
          <div className="flex gap-6 mt-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{products.length}+</p>
              <p className="text-gray-500 text-xs">Products</p>
            </div>
            <div className="w-px bg-gray-800"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">Free</p>
              <p className="text-gray-500 text-xs">Shipping</p>
            </div>
            <div className="w-px bg-gray-800"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="text-gray-500 text-xs">Support</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text" value={search} onChange={handleSearch}
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-gray-950 text-white shadow-lg'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 font-medium">No products found</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); fetchProducts(); }} className="mt-4 text-sm text-gray-900 underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* Image */}
                <div className="relative overflow-hidden bg-gray-50 h-52">
                  <img
                    src={product.image || 'https://via.placeholder.com/400x400?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; }}
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                  )}
                  {product.stock > 0 && product.stock <= 5 && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">Only {product.stock} left</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide mb-1">{product.category}</p>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">{product.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-orange-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={addingId === product._id || product.stock === 0}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      product.stock === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-950 text-white hover:bg-gray-800 active:scale-95'
                    }`}
                  >
                    {product.stock === 0 ? 'Out of Stock' : addingId === product._id ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}