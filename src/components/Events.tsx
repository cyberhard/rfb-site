"use client";

import { useState, useEffect } from "react";
// 👇 ИМПОРТИРУЕМ КОМПОНЕНТЫ HEROUI И ИКОНКИ
import { Card, Button, Modal, Input, Textarea } from "@heroui/react";
import { Pencil, Trash2 } from "lucide-react";
import AdminPanel from "./AdminPanel";
// 👇 ИМПОРТИРУЕМ ТИПЫ
import { getEventStatus, getStatusColor, EventType } from "./EventStatus";

export default function Events({ isAdmin }: { isAdmin: boolean }) {
  const [events, setEvents] = useState<EventType[]>([]);
  
  // --- 👇 НОВАЯ ЛОГИКА ДЛЯ МОДАЛЬНОГО ОКНА ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);

  const openEditModal = (event: EventType) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSaveEdit = () => {
    if (!selectedEvent) return;
    setEvents((prev) =>
      prev.map((event) => (event.id === selectedEvent.id ? selectedEvent : event))
    );
    closeModal();
  };

  const handleModalFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSelectedEvent((prev) => (prev ? { ...prev, [name]: value } : null));
  };
  
  const handleDelete = (id: number) => {
    if (window.confirm("Точно удалить это событие?")) {
      setEvents((prev) => prev.filter((event) => event.id !== id));
    }
  };
  // --- ------------------------------------ ---

  const addEvent = (event: EventType) => {
    setEvents((prev) => [...prev, event]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents((prev) => [...prev]);
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {events.length === 0 && (
        <p className="text-gray-400 text-center">Пока нет событий.</p>
      )}

      {events.map((event) => {
        const status = getEventStatus(event.startTime, event.endTime);
        const color = getStatusColor(status);

        return (
          <Card
            key={event.id}
            className="bg-gray-800/70 border border-gray-700 p-6 shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-2xl font-bold text-cyan-400">{event.title}</h4>
                <p className="text-gray-300 mb-3">{event.description}</p>
              </div>
              
              {/* 👇 НОВЫЕ КНОПКИ УПРАВЛЕНИЯ */}
              {isAdmin && (
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    onClick={() => openEditModal(event)}
                    variant="icon"
                    className="text-yellow-400 hover:text-yellow-300"
                  >
                    <Pencil size={18} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(event.id)}
                    variant="icon"
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              )}
            </div>

            <p className={`${color} font-semibold`}>Статус: {status}</p>
            <p className="text-sm text-gray-500">
              {new Date(event.startTime).toLocaleString("ru-RU", {
                timeZone: "Asia/Yekaterinburg",
              })}{" "}
              –{" "}
              {new Date(event.endTime).toLocaleString("ru-RU", {
                timeZone: "Asia/Yekaterinburg",
              })}
            </p>
          </Card>
        );
      })}

      {isAdmin && <AdminPanel onAdd={addEvent} />}

      {/* 👇 НОВОЕ МОДАЛЬНОЕ ОКНО ДЛЯ РЕДАКТИРОВАНИЯ */}
      <Modal show={isModalOpen} onClose={closeModal}>
        <Modal.Header>
          <h3 className="text-xl font-bold text-cyan-400">Редактировать событие</h3>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div className="flex flex-col gap-4">
              <Input
                label="Название"
                name="title"
                value={selectedEvent.title}
                onChange={handleModalFormChange}
              />
              <Textarea
                label="Описание"
                name="description"
                value={selectedEvent.description}
                onChange={handleModalFormChange}
              />
              <Input
                type="datetime-local"
                label="Начало (ЕКБ)"
                name="startTime"
                placeholder=" "
                value={selectedEvent.startTime}
                onChange={handleModalFormChange}
              />
              <Input
                type="datetime-local"
                label="Конец (ЕКБ)"
                name="endTime"
                placeholder=" "
                value={selectedEvent.endTime}
                onChange={handleModalFormChange}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModal} variant="outline" className="mr-2">
            Отмена
          </Button>
          <Button onClick={handleSaveEdit} className="bg-cyan-500 hover:bg-cyan-400 text-black">
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}