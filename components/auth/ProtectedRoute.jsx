'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppContent } from '../../context/AppContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedin, userData, loading } = useContext(AppContent);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isLoggedin) {
        router.push('/login');
      } else if (adminOnly && userData && userData.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [isLoggedin, userData, loading, adminOnly, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!isLoggedin) {
    return null; // Will redirect in useEffect
  }

  if (adminOnly && userData && userData.role !== 'admin') {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
