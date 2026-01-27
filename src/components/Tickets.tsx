"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { Ticket as TicketIcon, Sparkles } from "lucide-react";

interface Ticket {
  id: number;
  type: string;
  price: number;
}

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/tickets");

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Ошибка загрузки билетов: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Tickets data received:", data);
        const ticketsArray = data.tickets || [];
        setTickets(ticketsArray);

        if (ticketsArray.length === 0) {
          console.log("No tickets found in database");
        }
      } catch (err: any) {
        console.error("Error fetching tickets:", err);
        setError(err.message || "Не удалось загрузить билеты");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 max-w-md mx-auto">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 max-w-md mx-auto">
          <Sparkles className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Билеты пока не доступны</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
        Билеты на мероприятие
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tickets.map((ticket, index) => {
          // Разные градиенты для каждого типа билета
          const gradients = [
            "from-pink-500/20 via-purple-500/20 to-cyan-500/20",
            "from-cyan-500/20 via-blue-500/20 to-purple-500/20",
            "from-purple-500/20 via-pink-500/20 to-emerald-500/20",
            "from-emerald-500/20 via-cyan-500/20 to-orange-500/20",
          ];

          const borderGradients = [
            "from-pink-500 via-purple-500 to-cyan-500",
            "from-cyan-500 via-blue-500 to-purple-500",
            "from-purple-500 via-pink-500 to-emerald-500",
            "from-emerald-500 via-cyan-500 to-orange-500",
          ];

          // Градиенты для цен (соответствуют градиентам карточек)
          const priceGradients = [
            "from-pink-400 via-purple-400 to-cyan-400", // Участник
            "from-cyan-400 via-blue-400 to-purple-400", // Вип
            "from-purple-400 via-pink-400 to-emerald-400", // Вип+
            "from-emerald-400 via-cyan-400 to-orange-400", // Спонсор
          ];

          const gradient = gradients[index % gradients.length];
          const borderGradient = borderGradients[index % borderGradients.length];
          const priceGradient = priceGradients[index % priceGradients.length];

          return (
            <div
              key={ticket.id}
              className={`group relative bg-gradient-to-br ${gradient} backdrop-blur-sm rounded-2xl p-6 border-2 border-transparent hover:scale-105 transition-all duration-300 hover:shadow-2xl overflow-hidden`}
              style={{
                backgroundImage: `linear-gradient(to bottom right, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))`,
              }}
            >
              {/* Анимированная граница */}
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl bg-gradient-to-r ${borderGradient}`}
              ></div>
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${borderGradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
                style={{ padding: "2px" }}
              >
                <div className="w-full h-full bg-gray-900 rounded-2xl"></div>
              </div>

              {/* Контент */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Иконка билета */}
                <div className="flex items-center justify-center mb-4">
                  <div
                    className={`p-3 rounded-full bg-gradient-to-br ${gradient} border border-gray-600`}
                  >
                    <TicketIcon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Тип билета */}
                <h4 className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:to-cyan-400 transition-all duration-300">
                  {ticket.type}
                </h4>

                {/* Цена с адаптированным градиентом */}
                <div className="flex-1 flex items-center justify-center mb-6">
                  <div className="text-center">
                    <p className={`text-5xl font-extrabold bg-gradient-to-r ${priceGradient} bg-clip-text text-transparent`}>
                      {ticket.price}
                    </p>
                    <p className="text-gray-400 text-lg mt-1">рублей</p>
                  </div>
                </div>

                {/* Кнопка покупки */}
                <Button
                  className={`w-full bg-gradient-to-r ${borderGradient} hover:shadow-lg hover:shadow-pink-500/50 text-white font-bold py-3 text-lg transition-all duration-300 hover:scale-105`}
                  onClick={() => {
                    window.open("https://vk.com/im?sel=-226464845", "_blank");
                  }}
                >
                  Купить билет
                </Button>

                {/* Декоративные элементы */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-2xl"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
