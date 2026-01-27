// src/components/AdminPanel.tsx

"use client";

import { useState } from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { Plus } from "lucide-react";
import type { EventStatus } from "./EventStatus";

const STATUS_OPTIONS: EventStatus[] = ["ожидает", "идет", "завершено"];

// ФИКСИРОВАННАЯ ДАТА
const FIXED_DATE = "2026-07-19";

interface AdminPanelProps {
  onAdd: (event: { title: string; startTime: string; status: EventStatus }) => void;
}

export default function AdminPanel({ onAdd }: AdminPanelProps) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState(""); // Только время HH:MM
  const [status, setStatus] = useState<EventStatus>("ожидает");

  const handleAdd = () => {
    if (!title.trim() || !time) {
      alert("Заполните все поля!");
      return;
    }

    // Формируем MySQL datetime с фиксированной датой
    const mysqlFormat = `${FIXED_DATE} ${time}:00`;

    onAdd({ title, startTime: mysqlFormat, status });

    // Сброс формы
    setTitle("");
    setTime("");
    setStatus("ожидает");
  };

  return (
    <div className="mt-12 p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border-2 border-purple-500/30 shadow-2xl shadow-purple-500/10">
      <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Добавить новое событие
      </h3>

      <div className="grid gap-6">
        {/* Название */}
        <div>
          <label className="block text-sm font-semibold text-cyan-400 mb-2">
            Название события
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название события"
            className="w-full"
            classNames={{
              input: "bg-gray-800/50 text-white",
              inputWrapper:
                "bg-gray-800/50 border-gray-600 hover:border-cyan-400 focus-within:border-cyan-400",
            }}
          />
        </div>

        {/* Только время (БЕЗ ДАТЫ!) */}
        <div>
          <label className="block text-sm font-semibold text-purple-400 mb-2">
            Время начала
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-600 hover:border-purple-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 rounded-lg px-4 py-3 text-white transition-all duration-200 outline-none"
            placeholder="чч:мм"
          />
          <p className="text-xs text-gray-400 mt-1">
            Дата фиксирована: 19 июля 2026 г.
          </p>
        </div>

        {/* Статус */}
        <div>
          <label className="block text-sm font-semibold text-pink-400 mb-2">
            Статус
          </label>
          <Select
            selectedKeys={[status]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as EventStatus;
              setStatus(selected);
            }}
            className="w-full"
            classNames={{
              trigger:
                "bg-gray-800/50 border-gray-600 hover:border-pink-400 data-[hover=true]:border-pink-400",
              value: "text-white",
            }}
          >
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s}>{s}</SelectItem>
            ))}
          </Select>
        </div>

        {/* Кнопка добавления */}
        <Button
          onClick={handleAdd}
          className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white font-bold py-6 text-lg shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300"
          startContent={<Plus size={24} />}
        >
          Добавить событие
        </Button>
      </div>
    </div>
  );
}
