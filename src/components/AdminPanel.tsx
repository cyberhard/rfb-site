"use client";

import { useState } from "react";
import { Button, Input, Textarea } from "@heroui/react";
import { EventType } from "./EventType"; 

export default function AdminPanel({ onAdd }: { onAdd: (event: EventType) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleAdd = () => {
    if (!title || !startDate || !startTime || !endDate || !endTime) 
      return alert("Заполните все поля!");
    
    const startDateTime = `${startDate}T${startTime}`;
    const endDateTime = `${endDate}T${endTime}`;
    
    onAdd({
      id: Date.now(),
      title,
      description,
      startTime: startDateTime,
      endTime: endDateTime,
    });
    
    setTitle("");
    setDescription("");
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
  };

  return (
    <div className="bg-gray-800/70 p-6 rounded-xl border border-gray-700 mt-6">
      <h4 className="text-xl font-bold text-cyan-400 mb-4">Добавить новое событие</h4>

      <div className="flex flex-col gap-4">
        <Textarea 
          label="Название" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <Textarea
          label="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        {/* Начало события */}
        <div className="space-y-2">
          <label className="text-sm text-gray-300">Начало события (ЕКБ)</label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              placeholder="Дата начала"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="time"
              placeholder="Время начала"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
        </div>

        {/* Конец события */}
        <div className="space-y-2">
          <label className="text-sm text-gray-300">Конец события (ЕКБ)</label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              placeholder="Дата окончания"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Input
              type="time"
              placeholder="Время окончания"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={handleAdd} className="bg-cyan-500 hover:bg-cyan-400 text-black mt-2">
          Добавить событие
        </Button>
      </div>
    </div>
  );
}