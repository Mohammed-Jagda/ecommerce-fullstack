'use client';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8 bg-gray-50">{children}</main>
      </div>
    </ProtectedRoute>
  );
}