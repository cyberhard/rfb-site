"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import EventStatus, {
  type EventStatus as Status,
  type EventType,
} from "./EventStatus";
import AdminPanel from "./AdminPanel";

const STATUS_OPTIONS: Status[] = ["ожидает", "идет", "завершено"];

// ФИКСИРОВАННАЯ ДАТА КОНВЕНТА
const FIXED_DATE = "2026-07-19";

export default function Events() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [isEventsVisible, setIsEventsVisible] = useState(true);
  const { user } = useAuth();

  const isAdmin = user?.role === "Админка";

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error("Ошибка загрузки событий:", error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (event: EventType) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSaveEdit = async () => {
    if (!selectedEvent) return;

    try {
      // Берём только время из startTime
      let timeStr = "";
      if (selectedEvent.startTime.includes(" ")) {
        timeStr = selectedEvent.startTime.split(" ")[1];
      } else if (selectedEvent.startTime.includes("T")) {
        timeStr = selectedEvent.startTime.split("T")[1].split(".")[0];
      }

      // Формируем полный datetime с фиксированной датой
      const mysqlFormat = `${FIXED_DATE} ${timeStr}`;

      const res = await fetch(`/api/events/${selectedEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedEvent.title,
          startTime: mysqlFormat,
          status: selectedEvent.status,
        }),
      });

      if (res.ok) {
        await fetchEvents();
        closeModal();
      } else {
        const error = await res.json();
        console.error("Ошибка:", error);
        alert(`Ошибка: ${error.message}`);
      }
    } catch (error) {
      console.error("Ошибка обновления:", error);
      alert("Произошла ошибка");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить это событие?")) return;

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) await fetchEvents();
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  const handleAdd = async (newEvent: Omit<EventType, "id">) => {
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (res.ok) {
        await fetchEvents();
      } else {
        const error = await res.json();
        alert(error.message || "Ошибка создания события");
      }
    } catch (error) {
      console.error("Ошибка добавления:", error);
    }
  };

  const formatTime = (datetime?: string) => {
    if (!datetime) return "—";

    try {
      // Если формат MySQL: "2026-07-19 11:30:00"
      if (datetime.includes(" ")) {
        const [date, time] = datetime.split(" ");
        const [hours, minutes] = time.split(":");
        return `${hours}:${minutes}`;
      }

      // Если формат ISO: "2026-07-19T11:30:00.000Z"
      if (datetime.includes("T")) {
        const timePart = datetime.split("T")[1];
        const [hours, minutes] = timePart.split(":");
        return `${hours}:${minutes}`;
      }

      return "—";
    } catch (error) {
      console.error("❌ Ошибка formatTime:", error);
      return "—";
    }
  };

  // ВСЕГДА возвращает "19 июля 2026 г."
  const formatDate = () => {
    return "19 июля 2026 г.";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Заголовок с кнопкой сворачивания */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Расписание событий
        </h2>
        <button
          onClick={() => setIsEventsVisible(!isEventsVisible)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 hover:border-cyan-400 rounded-xl transition-all duration-200 text-white"
        >
          {isEventsVisible ? (
            <>
              <ChevronUp size={20} />
              <span>Скрыть</span>
            </>
          ) : (
            <>
              <ChevronDown size={20} />
              <span>Показать ({events.length})</span>
            </>
          )}
        </button>
      </div>

      {/* Список событий */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isEventsVisible ? "max-h-[10000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-xl">Пока нет событий</p>
              {isAdmin && (
                <p className="text-sm mt-2">
                  Добавьте первое событие через админ-панель ниже
                </p>
              )}
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1"
              >
                <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-gradient-to-b from-cyan-400 via-purple-400 to-pink-400 opacity-80"></div>

                <div className="pl-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {formatDate()}
                      </p>
                    </div>
                    <EventStatus status={event.status} />
                  </div>

                  <div className="flex items-center gap-2 text-cyan-400 mb-4">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-lg font-semibold">
                      {formatTime(event.startTime)}
                    </span>
                  </div>

                  {isAdmin && (
                    <div className="flex gap-3 pt-3 border-t border-gray-700/50">
                      <Button
                        size="sm"
                        onClick={() => openEditModal(event)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                        startContent={<Pencil size={16} />}
                      >
                        Редактировать
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
                        startContent={<Trash2 size={16} />}
                      >
                        Удалить
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Админ-панель */}
      {isAdmin && <AdminPanel onAdd={handleAdd} />}

      {/* Модальное окно редактирования */}
      {isModalOpen && selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl shadow-cyan-500/20 p-8 max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Редактировать событие
            </h3>

            <div className="space-y-6">
              {/* Название */}
              <div>
                <label className="block text-sm font-semibold text-cyan-400 mb-2">
                  Название события
                </label>
                <input
                  type="text"
                  value={selectedEvent.title}
                  onChange={(e) =>
                    setSelectedEvent({ ...selectedEvent, title: e.target.value })
                  }
                  className="w-full bg-gray-800/50 border border-gray-600 hover:border-cyan-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 outline-none"
                  placeholder="Введите название события"
                />
              </div>

              {/* Фиксированная дата */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Дата: {formatDate()}
                </label>
              </div>

              {/* Время редактирования */}
              <div>
                <label className="block text-sm font-semibold text-pink-400 mb-2">
                  Время начала (чч:мм)
                </label>
                <input
                  type="time"
                  value={(() => {
                    if (!selectedEvent?.startTime) return "";

                    try {
                      let hours = "", minutes = "";

                      if (selectedEvent.startTime.includes(" ")) {
                        const [date, time] = selectedEvent.startTime.split(" ");
                        [hours, minutes] = time.split(":");
                      } else if (selectedEvent.startTime.includes("T")) {
                        const timePart = selectedEvent.startTime.split("T")[1];
                        [hours, minutes] = timePart.split(":");
                      }

                      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
                    } catch {
                      return "";
                    }
                  })()}
                  onChange={(e) => {
                    const [newHours, newMinutes] = e.target.value.split(":");
                    const updatedTime = `${FIXED_DATE} ${newHours}:${newMinutes}:00`;

                    setSelectedEvent({
                      ...selectedEvent,
                      startTime: updatedTime,
                    });
                  }}
                  className="w-full bg-gray-800/50 border border-gray-600 hover:border-pink-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/30 rounded-lg px-4 py-3 text-white transition-all duration-200 outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Дата фиксирована: 19 июля 2026 г.
                </p>
              </div>

              {/* Статус */}
              <div>
                <label className="block text-sm font-semibold text-purple-400 mb-2">
                  Статус события
                </label>
                <select
                  value={selectedEvent.status}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      status: e.target.value as Status,
                    })
                  }
                  className="w-full bg-gray-800/50 border border-gray-600 hover:border-purple-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 rounded-lg px-4 py-3 text-white transition-all duration-200 outline-none"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Кнопки */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-green-500/30 transition-all duration-200"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
