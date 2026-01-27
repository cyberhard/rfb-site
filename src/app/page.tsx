"use client";
import { useState, useEffect } from 'react';
import Image from "next/image";
import { motion } from "framer-motion";
import Events from "@/components/Events";
import Organizers from "@/components/Organizers";
import Tickets from "@/components/Tickets";
import { useAuth } from "@/hooks/useAuth";
import AppNavbar from "@/components/AppNavbar";

export default function Home() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Админка";

  return (
    <div className="bg-[#0f111b] text-gray-100 min-h-screen flex flex-col font-sans">
      {/* Header */}
      <AppNavbar />

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0f111b] via-[#1a1c2e] to-[#0f111b]">
        <div className="absolute inset-0">
          <Image
            src="/festival-hero.png"
            alt="Главная плюшка фестиваля"
            fill
            className="object-cover object-left-top brightness-75"
            style={{ objectPosition: "0% 10%" }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center px-6 z-10"
        >
          <h2 className="text-5xl sm:text-6xl font-extrabold text-cyan-400 drop-shadow-lg mb-4">
            Добро пожаловать на RFB 4!
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 drop-shadow-md max-w-2xl mx-auto">
            Музыка, кибер-косплей, VR-игры и уникальные технологии ждут тебя!
          </p>
        </motion.div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16">
        <Events /> {/* ← Убрали isAdmin */}
      </section>

      {/* Tickets Section */}
      <section id="tickets" className="px-6 sm:px-20 py-16 bg-gray-900/70">
        <Tickets />
      </section>

      {/* Organizers & Sponsors Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900/50 to-gray-900/70">
        <Organizers />
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-20 py-12 border-t border-gray-800 flex flex-col items-center gap-4 bg-[#0f111b]/80">
        <p className="text-gray-500">© 2026 RFB</p>
        <div className="flex gap-6">
          <a href="https://vk.com/rusfurbal" className="hover:text-pink-400 transition">
            VK
          </a>
        </div>
      </footer>
    </div>
  );
}
