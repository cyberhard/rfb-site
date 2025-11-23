// app/register/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState({
    phone_number: '',
    password: '',
    confirmPassword: '',
    screen_name: '',
    sity: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Валидация
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: formData.phone_number,
          password: formData.password,
          screen_name: formData.screen_name,
          sity: formData.sity,
        }),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        // После успешной регистрации перенаправляем на страницу входа
        router.push('/login?registered=true');
      } else {
        setError(data.error || 'Ошибка при регистрации');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Ошибка подключения к серверу');
      setIsSubmitting(false);
    }
  };

  if (loading || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f111b] text-gray-100">
        <div className="text-cyan-400">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f111b] text-gray-100 p-4">
      <div className="bg-gray-900/50 p-8 rounded-lg shadow-xl border border-gray-800 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-cyan-400">
          Регистрация
        </h1>
        <p className="text-gray-300 text-center mb-6">
          Создайте аккаунт для участия в фестивале
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium mb-2">
              Номер телефона *
            </label>
            <input
              id="phone_number"
              name="phone_number"
              type="text"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+7 (999) 123-45-67"
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="screen_name" className="block text-sm font-medium mb-2">
              Отображаемое имя *
            </label>
            <input
              id="screen_name"
              name="screen_name"
              type="text"
              value={formData.screen_name}
              onChange={handleChange}
              placeholder="Ваше имя"
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="sity" className="block text-sm font-medium mb-2">
              Город *
            </label>
            <input
              id="sity"
              name="sity"
              type="text"
              value={formData.sity}
              onChange={handleChange}
              placeholder="Москва"
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Пароль *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Минимум 6 символов"
              required
              minLength={6}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Подтвердите пароль *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Повторите пароль"
              required
              minLength={6}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-pink-500 text-black font-bold px-5 py-2 rounded-lg shadow hover:bg-pink-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

