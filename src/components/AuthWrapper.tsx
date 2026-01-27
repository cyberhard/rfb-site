'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthWrapper() {
  const { isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <p>Вы авторизованы!</p>
        <button onClick={logout}>Выйти</button>
      </div>
    );
  }

  return null;
}
