'use client';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';

export default function ShopLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="consumer">
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}