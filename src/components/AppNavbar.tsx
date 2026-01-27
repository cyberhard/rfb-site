// src/components/AppNavbar.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AppNavbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Определение, является ли пользователь администратором
  const isAdmin =
    user?.role === "Админка" || user?.role === "Контролёр";
  
  // Элементы меню, которые отображаются в NavbarContent
  const navItems = (
    <>
      <NavbarItem>
        <Link href="/#events" className="hover:text-pink-400 transition">
          События
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link href="/participants" className="hover:text-pink-400 transition">
          Участники
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link href="/#tickets" className="hover:text-pink-400 transition">
          Билеты
        </Link>
      </NavbarItem>
      {/* Отображаем "Админка" только для админов */}
      {isAdmin && (
        <NavbarItem>
          <Link href="/admin" className="hover:text-pink-400 transition">
            Админка
          </Link>
        </NavbarItem>
      )}
    </>
  );

  return (
    <Navbar
      // className="w-full border-b border-gray-800 relative z-50 bg-gradient-to-b from-[#0f111b]/90 to-[#1a1c2e]/50"
      maxWidth="full"
    >
      <NavbarBrand className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/furry_icon.png"
            alt="Главная плюшка фестиваля"
            width={50}
            height={50}
            className="object-cover object-center brightness-75 select-none"
            draggable="false"
            onDragStart={(e) => e.preventDefault()}
          />
          <p className="text-3xl sm:text-4xl font-bold tracking-wider text-cyan-400 drop-shadow-lg">
          RusFurBal-4
          </p>
        </Link>
      </NavbarBrand>

      {/* Основное меню для десктопа (md:flex) */}
      <NavbarContent className="hidden md:flex gap-6 text-sm font-medium" justify="center">
        {navItems}
      </NavbarContent>

      {/* Кнопки входа/выхода */}
      <NavbarContent justify="end">
        {/* Кнопка входа/выхода для десктопа */}
        <NavbarItem className="hidden md:flex">
          {isAuthenticated ? (
            <Button
              onClick={logout}
              className="bg-pink-500 text-black font-bold px-5 py-2 rounded-lg shadow hover:bg-pink-400 transition"
            >
              Выйти
            </Button>
          ) : (
            <Link href="/login" passHref>
              <Button
                as="span"
                className="bg-cyan-500 text-black font-bold px-5 py-2 rounded-lg shadow hover:bg-cyan-400 transition"
              >
                Войти
              </Button>
            </Link>
          )}
        </NavbarItem>
        
        {/* Кнопка мобильного меню */}
        <NavbarItem className="md:hidden">
          <button
            className="p-2 rounded hover:bg-gray-900 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </NavbarItem>
      </NavbarContent>

      {/* Мобильное меню (показывается только при menuOpen) */}
      <div
        className={`absolute top-full left-0 w-full backdrop-blur-md bg-[#0f111b]/70 border-t border-gray-800 flex flex-col items-center gap-4 py-6 md:hidden transition-all duration-300 ${
          menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5 pointer-events-none"
        }`}
        // Чтобы избежать дублирования контента, просто переиспользуем логику navItems
      >
        <Link href="/#events" onClick={() => setMenuOpen(false)} className="hover:text-pink-400 transition text-lg">События</Link>
        <Link href="/participants" onClick={() => setMenuOpen(false)} className="hover:text-pink-400 transition text-lg">Участники</Link>
        <Link href="/#tickets" onClick={() => setMenuOpen(false)} className="hover:text-pink-400 transition text-lg">Билеты</Link>
        {isAdmin && (
          <Link href="/admin" onClick={() => setMenuOpen(false)} className="hover:text-pink-400 transition text-lg">Админка</Link>
        )}
        
        {/* Кнопка входа/выхода для мобильного меню */}
        {isAuthenticated ? (
          <Button onClick={() => { logout(); setMenuOpen(false); }} className="bg-pink-500 text-black px-5 py-2 rounded-lg hover:bg-pink-400 transition">
            Выйти
          </Button>
        ) : (
          <Link href="/login" passHref>
            <Button
              as="span"
              className="bg-cyan-500 text-black font-bold px-5 py-2 rounded-lg shadow hover:bg-cyan-400 transition"
            >
              Войти
            </Button>
          </Link>
        )}
      </div>
    </Navbar>
  );
}