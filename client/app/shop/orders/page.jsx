'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/axios';

const STATUS_CONFIG = {
  'Pending': { color: 'bg-amber-100 text-amber-800', icon: '🕐', step: 1 },
  'Ready to Ship': { color: 'bg-blue-100 text-blue-800', icon: '📦', step: 2 },
  'Dispatched': { color: 'bg-green-100 text-green-800', icon: '🚚', step: 3 },
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await api.get('/orders/mine');
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-400">Loading orders...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>My Orders</h1>
      <p className="text-gray-400 text-sm mb-8">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-gray-500 font-medium">No orders yet</p>
          <a href="/shop" className="mt-4 inline-block text-sm text-gray-900 underline">Start shopping</a>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];
            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition">
                {/* Order Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Order ID</p>
                      <p className="font-mono font-bold text-gray-900 text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="w-px h-8 bg-gray-100"></div>
                    <div>
                      <p className="text-xs text-gray-400">Date</p>
                      <p className="text-sm font-medium text-gray-700">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="w-px h-8 bg-gray-100"></div>
                    <div>
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="text-sm font-bold text-gray-900">₹{order.totalAmount}</p>
                    </div>
                  </div>
                  <span className={`${config.color} px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5`}>
                    <span>{config.icon}</span>
                    {order.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-4 bg-gray-50">
                  <div className="flex items-center gap-2">
                    {['Pending', 'Ready to Ship', 'Dispatched'].map((s, i) => {
                      const active = config.step > i;
                      const current = config.step === i + 1;
                      return (
                        <div key={s} className="flex items-center flex-1">
                          <div className={`flex items-center gap-2 ${i < 2 ? 'flex-1' : ''}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${active ? 'bg-gray-950 text-white' : 'bg-gray-200 text-gray-400'}`}>
                              {active ? '✓' : i + 1}
                            </div>
                            <span className={`text-xs font-medium hidden sm:block ${active ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
                          </div>
                          {i < 2 && <div className={`flex-1 h-0.5 mx-2 ${config.step > i + 1 ? 'bg-gray-950' : 'bg-gray-200'}`}></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items */}
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs font-bold">
                            {item.quantity}x
                          </div>
                          <span className="text-gray-700 font-medium">{item.name}</span>
                        </div>
                        <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}