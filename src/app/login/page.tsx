"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Input, Button } from "@heroui/react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("registered") === "true") {
      setSuccess("Регистрация успешна! Войдите в систему.");
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Убираем все нецифровые символы
    const digits = input.replace(/\D/g, "");
    // Ограничиваем 10 цифрами (после +7)
    const limited = digits.slice(0, 10);
    
    // Форматируем: XXX XXX-XX-XX
    let formatted = "";
    if (limited.length > 0) {
      formatted = limited.slice(0, 3);
    }
    if (limited.length > 3) {
      formatted += " " + limited.slice(3, 6);
    }
    if (limited.length > 6) {
      formatted += "-" + limited.slice(6, 8);
    }
    if (limited.length > 8) {
      formatted += "-" + limited.slice(8, 10);
    }
    
    setPhoneDisplay(formatted);
    // Сохраняем в формате +7XXXXXXXXXX
    setPhoneNumber(limited.length > 0 ? `+7${limited}` : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Проверка формата номера
    if (!phoneNumber.startsWith("+7") || phoneNumber.length !== 12) {
      setError("Введите корректный номер телефона");
      return;
    }

    setIsSubmitting(true);
    const result = await login(phoneNumber, password);
    if (result.success) {
      router.replace("/");
    } else {
      setError(result.error);
    }
    setIsSubmitting(false);
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
          Добро пожаловатья!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Номер телефона
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                +7
              </span>
              <Input
                type="text"
                value={phoneDisplay}
                onChange={handlePhoneChange}
                placeholder="999 123-45-67"
                required
                classNames={{
                  input: "pl-10 text-white",
                  inputWrapper:
                    "bg-gray-800 border-gray-700 hover:border-cyan-400 focus-within:border-cyan-400",
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Пароль
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
              classNames={{
                input: "text-white",
                inputWrapper:
                  "bg-gray-800 border-gray-700 hover:border-cyan-400",
              }}
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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyan-500 text-black font-bold px-5 py-2 rounded-lg shadow hover:bg-cyan-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Вход..." : "Войти"}
          </Button>
        </form>
      </div>
    </div>
  );
}
