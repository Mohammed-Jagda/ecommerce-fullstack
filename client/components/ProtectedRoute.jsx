'use client';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { token, role } = useSelector((state) => state.auth);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) {
      router.push('/login');
      return;
    }
    if (requiredRole && role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [mounted, token, role, requiredRole, router]);

  // Don't render anything until client is mounted
  if (!mounted) return null;
  if (!token) return null;
  if (requiredRole && role !== requiredRole) return null;

  return children;
}