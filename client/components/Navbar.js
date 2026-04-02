'use client';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { clearCartState } from '../store/slices/cartSlice';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartState());
    router.push('/login');
  };

  return (
  <nav className="bg-gray-950 sticky top-0 z-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">

        {/* Left Side - Logo */}
        <Link 
          href="/shop" 
          className="text-white text-2xl font-bold tracking-tight" 
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          ShopEase
        </Link>

        {/* Right Side - All Navigation Items */}
        <div className="flex items-center gap-8">
          
          {/* Center Links - Now moved to right side */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-gray-300 hover:text-white text-sm font-medium transition">
              Shop
            </Link>
            <Link href="/shop/orders" className="text-gray-300 hover:text-white text-sm font-medium transition">
              My Orders
            </Link>
          </div>

          {/* Cart */}
          <Link 
            href="/shop/cart" 
            className="relative flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z" />
            </svg>
            Cart
            {totalItems > 0 && (
              <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Info & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-300 text-sm">{user?.name}</span>
            </div>

            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-white transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
); 
}