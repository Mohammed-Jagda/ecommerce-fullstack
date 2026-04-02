'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/axios';
import { setCredentials } from '../../store/slices/authSlice';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      dispatch(setCredentials(data));
      router.push(data.role === 'admin' ? '/admin' : '/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-gray-950 flex-col justify-between p-14">
        <div>
          <h1 className="text-white text-3xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            ShopEase
          </h1>
          <p className="text-gray-500 text-sm mt-1">Premium E-Commerce</p>
        </div>
        <div>
          <p className="text-white text-4xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Discover products<br />you'll love.
          </p>
          <p className="text-gray-400 mt-4 text-sm leading-relaxed">
            Shop from thousands of products across categories.<br />Fast delivery. Easy returns.
          </p>
        </div>
        <div className="flex gap-8">
          {['10K+ Products', 'Free Shipping', '24/7 Support'].map(t => (
            <div key={t}>
              <p className="text-white text-sm font-medium">{t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>ShopEase</h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-8">Sign in to continue shopping</p>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} required
                placeholder="you@example.com"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} required
                placeholder="••••••••"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-gray-950 text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            New customer?{' '}
            <Link href="/register" className="text-gray-900 font-semibold hover:underline">
              Create account
            </Link>
          </p>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 space-y-1">
            <p className="font-semibold">Demo credentials</p>
            <p>Admin: admin@test.com / admin123</p>
            <p>Consumer: register a new account</p>
          </div>
        </div>
      </div>
    </div>
  );
}