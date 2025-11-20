import { useState, useEffect, useCallback } from 'react';

export type User = {
  name: string;
  role: string;
  id?: number;
  email?: string;
  avatar?: string;
};

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Проверка авторизации при монтировании
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('vk_access_token');
    if (token) {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: token }),
        });
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('vk_access_token');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('vk_access_token');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Логин через VKID
  const login = async (authData: { access_token: string }) => {
    if (!authData.access_token) return;

    localStorage.setItem('vk_access_token', authData.access_token);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: authData.access_token }),
      });

      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        console.error('No user returned from server');
        localStorage.removeItem('vk_access_token');
      }
    } catch (err) {
      console.error('Login failed:', err);
      localStorage.removeItem('vk_access_token');
    }
  };

  const logout = () => {
    localStorage.removeItem('vk_access_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, user, loading, login, logout };
}
