'use client';
import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders'),
        ]);
        const orders = ordersRes.data;
        setStats({
          products: productsRes.data.length,
          orders: orders.length,
          revenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
          pending: orders.filter((o) => o.status === 'Pending').length,
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Products', value: stats.products, sub: 'In catalogue', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', link: '/admin/products' },
    { label: 'Total Orders', value: stats.orders, sub: 'All time', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', link: '/admin/orders' },
    { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, sub: 'Total earned', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100', link: '/admin/orders' },
    { label: 'Pending Orders', value: stats.pending, sub: 'Need attention', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', link: '/admin/orders' },
  ];

  if (loading) return <div className="text-gray-400 text-sm">Loading dashboard...</div>;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} href={card.link}
            className={`${card.bg} ${card.border} border rounded-2xl p-5 hover:shadow-md transition group`}
          >
            <p className={`text-xs font-semibold uppercase tracking-wide ${card.text} opacity-70`}>{card.label}</p>
            <p className={`text-3xl font-bold ${card.text} mt-2 group-hover:scale-105 transition-transform`}>{card.value}</p>
            <p className={`text-xs ${card.text} opacity-50 mt-1`}>{card.sub}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-orange-500 hover:text-orange-700 font-medium">View all →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">No orders yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{order.user?.name}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹{order.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      order.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      order.status === 'Ready to Ship' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>{order.status}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}