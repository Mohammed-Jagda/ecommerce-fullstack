'use client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import api from '../../../lib/axios';
import { setCart, clearCartState } from '../../../store/slices/cartSlice';

export default function CartPage() {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCartData(data);
      dispatch(setCart(data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleRemove = async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    setCartData(data);
    dispatch(setCart(data));
  };

  const handleUpdateQty = async (productId, quantity, maxStock) => {
    if (quantity < 1) { handleRemove(productId); return; }
    if (quantity > maxStock) { alert(`Only ${maxStock} in stock`); return; }
    const { data } = await api.put(`/cart/${productId}`, { quantity });
    setCartData(data);
    dispatch(setCart(data));
  };

  const handleClear = async () => {
    await api.delete('/cart/clear');
    setCartData({ items: [] });
    dispatch(clearCartState());
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-400">Loading cart...</div>
  );

  const items = cartData?.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (items.length === 0) return (
    <div className="max-w-5xl mx-auto px-4 py-24 text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Your cart is empty</h2>
      <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
      <button onClick={() => router.push('/shop')} className="bg-gray-950 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition">
        Continue Shopping
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Your Cart</h1>
          <p className="text-gray-400 text-sm mt-1">{items.length} item{items.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={handleClear} className="text-sm text-red-500 hover:text-red-700 font-medium transition">
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product._id} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-5 hover:shadow-md transition">
              <img
                src={item.product.image || 'https://via.placeholder.com/400x400?text=No+Image'}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-xl bg-gray-100 flex-shrink-0"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide">{item.product.category}</p>
                    <h3 className="font-semibold text-gray-900 mt-0.5">{item.product.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{item.product.stock} in stock</p>
                  </div>
                  <button onClick={() => handleRemove(item.product._id)} className="text-gray-300 hover:text-red-500 transition ml-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1">
                    <button
                      onClick={() => handleUpdateQty(item.product._id, item.quantity - 1, item.product.stock)}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold transition"
                    >−</button>
                    <span className="w-8 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQty(item.product._id, item.quantity + 1, item.product.stock)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >+</button>
                  </div>
                  <p className="text-lg font-bold text-gray-900">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-950 rounded-2xl p-6 text-white sticky top-24">
            <h2 className="text-lg font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Subtotal ({items.length} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-400' : ''}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-500">Add ₹{(999 - subtotal).toFixed(2)} more for free shipping</p>
              )}
              <div className="border-t border-gray-800 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/shop/checkout')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold transition-all duration-200 active:scale-95"
            >
              Proceed to Checkout →
            </button>
            <button
              onClick={() => router.push('/shop')}
              className="w-full text-gray-400 hover:text-white text-sm py-3 transition mt-2"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}