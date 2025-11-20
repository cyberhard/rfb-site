"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
// import { Menu, X } from "lucide-react";
import { Button } from "@heroui/react"; // Оставляем Button для секции Билеты
import Link from "next/link"; // Оставляем Next.js Link
import Events from "@/components/Events";
import { useAuth } from "@/hooks/useAuth";
import AppNavbar from "@/components/AppNavbar";


export default function Home() {
  const { user, isAuthenticated, login, logout, loading } = useAuth();
  //================================================================================
  // 👇 2. ВМЕСТО ЭТОГО, ЖЕСТКО ЗАДАЕМ АДМИНА ДЛЯ ТЕСТА:
  // const { logout } = useAuth(); // Можем вытащить только logout, он нам нужен для кнопки
  // const user = {
  //   name: "Тестовый Админ",
  //   email: "admin@test.com",
  //   role: "admin", // 👈 Самое важное!
  //   id: 1 
  // };
  // const isAuthenticated = true;
  // const loading = false;
  //================================================================================

  return (
    <div className="bg-[#0f111b] text-gray-100 min-h-screen flex flex-col font-sans">
      {/* Header */}
      <AppNavbar />

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0f111b] via-[#1a1c2e] to-[#0f111b]">
        <div className="absolute inset-0">
          <Image
            src="/festival-hero.jpg"
            alt="Главная плюшка фестиваля"
            fill
            className="object-cover object-center brightness-75"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center px-6 z-10"
        >
          <h2 className="text-5xl sm:text-6xl font-extrabold text-cyan-400 drop-shadow-lg mb-4">
            Добро пожаловать на RFB 2026!
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 drop-shadow-md max-w-2xl mx-auto">
            Музыка, кибер-косплей, VR-игры и уникальные технологии ждут тебя!
          </p>
        </motion.div>
      </section>

      {/* Events Section */}
      <section id="events" className="px-6 sm:px-20 py-16">
        <h3 className="text-3xl font-bold text-cyan-400 mb-8">Расписание Событий</h3>
        <div className="bg-gray-900/60 rounded-xl p-4 shadow-md">
          <Events isAdmin={user?.role === "admin"} />
        </div>
      </section>


      {/* Tickets Section */}
      <section id="tickets" className="px-6 sm:px-20 py-16 bg-gray-900/70 flex flex-col items-center gap-6">
        <h3 className="text-3xl font-semibold text-pink-400 drop-shadow-lg">Билеты и аккаунт</h3>
        {user ? (
          <div className="flex flex-col gap-4 items-center">
            <p className="text-gray-200 text-center">Привет, {user.name}! Можешь предъявить билет или купить новый.</p>
            <div className="flex gap-4">
              <Button className="bg-cyan-500 hover:bg-cyan-400 text-black">Показать билет</Button>
              <Button className="bg-pink-500 hover:bg-pink-400 text-black">Купить билет</Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-300 text-center">
            {/* 6. Немного обновили текст-подсказку */}
            Войдите, чтобы получить доступ к билетам. Кнопка входа находится в верхнем меню.
          </p>
        )}
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-20 py-12 border-t border-gray-800 flex flex-col items-center gap-4 bg-[#0f111b]/80">
        <p className="text-gray-500">© 2026 RFB</p>
        <div className="flex gap-6">
          <a href="https://vk.com/rusfurbal" className="hover:text-pink-400 transition">VK</a>
          <a href="#" className="hover:text-cyan-400 transition">Telegram</a>
        </div>
      </footer>
    </div>
  );
}
