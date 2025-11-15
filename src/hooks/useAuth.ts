// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';

export type User = {
  name: string;
  role: string;
  id?: number;
  email?: string;
};

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('vk_access_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (authData: any) => {
    if (!authData.access_token) return;
    localStorage.setItem('vk_access_token', authData.access_token);

    try {
      const res = await fetch('/api/auth/vk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authData),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('vk_access_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, user, loading, login, logout };
}
