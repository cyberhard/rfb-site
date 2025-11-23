// app/login/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading } = useAuth();
  const [phone_number, setPhone_number] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Проверяем параметр URL для сообщения об успешной регистрации
    const params = new URLSearchParams(window.location.search);
    if (params.get('registered') === 'true') {
      setSuccess('Регистрация успешна! Теперь вы можете войти.');
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(phone_number, password);
    
    if (result.success) {
      router.replace('/');
    } else {
      setError(result.error || 'Ошибка входа');
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
          Вход
        </h1>
        <p className="text-gray-300 text-center mb-6">
          Войдите, используя номер телефона и пароль
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium mb-2">
              Номер телефона
            </label>
            <input
              id="phone_number"
              type="text"
              value={phone_number}
              onChange={(e) => setPhone_number(e.target.value)}
              placeholder="+7 (999) 123-45-67"
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
          </div>

          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyan-500 text-black font-bold px-5 py-2 rounded-lg shadow hover:bg-cyan-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}