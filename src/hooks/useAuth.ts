import { useState, useEffect, useCallback } from 'react';

export type User = {
  vkId: number;
  firstName: string;
  lastName: string;
  screenName?: string;
  avatarUrl?: string;
  email?: string;
  id?: number;
};

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (userData: Partial<User>) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        console.error('No user returned from server');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  };

  return { isAuthenticated, user, loading, login, logout };
}
