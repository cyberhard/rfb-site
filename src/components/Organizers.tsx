"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type User = {
  id: number;
  phone_number: string;
  screen_name: string;
  sity: string;
  role: string;
  availability: boolean;
  defile: boolean;
  merch: boolean;
  description?: string;
  avatar_url?: string;
};

const AUTO_PLAY_INTERVAL = 5000; // 5 секунд

export default function Organizers() {
  const [organizers, setOrganizers] = useState<User[]>([]);
  const [sponsors, setSponsors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentOrgIndex, setCurrentOrgIndex] = useState(0);
  const [currentSponsorIndex, setCurrentSponsorIndex] = useState(0);

  // Автопрокрутка для организаторов
  useEffect(() => {
    if (organizers.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentOrgIndex((prev) => (prev === organizers.length - 1 ? 0 : prev + 1));
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [organizers.length, currentOrgIndex]);

  // Автопрокрутка для спонсоров
  useEffect(() => {
    if (sponsors.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSponsorIndex((prev) => (prev === sponsors.length - 1 ? 0 : prev + 1));
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [sponsors.length, currentSponsorIndex]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/participants");
        const data = await res.json();
        if (res.ok) {
          const allUsers = data.users || [];
          setOrganizers(allUsers.filter((u: User) => u.role === "Организатор"));
          setSponsors(allUsers.filter((u: User) => u.role === "Спонсор"));
        }
      } catch (err) {
        console.error("Fetch users error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  const renderCarousel = (
    users: User[],
    currentIndex: number,
    setCurrentIndex: (index: number) => void,
    title: string,
    accentColor: string
  ) => {
    if (users.length === 0) return null;

    const currentUser = users[currentIndex];
    const hasMultiple = users.length > 1;

    // Клик по левой/правой части карточки
    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hasMultiple) return;

      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const cardWidth = rect.width;

      if (clickX < cardWidth / 3) {
        // Клик слева - предыдущий
        setCurrentIndex(currentIndex === 0 ? users.length - 1 : currentIndex - 1);
      } else if (clickX > (cardWidth * 2) / 3) {
        // Клик справа - следующий
        setCurrentIndex(currentIndex === users.length - 1 ? 0 : currentIndex + 1);
      }
    };

    // Свайп для мобильных
    const handleTouchStart = (e: React.TouchEvent) => {
      const touchDown = e.touches[0].clientX;
      (e.currentTarget as HTMLElement).dataset.touchStart = String(touchDown);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      const touchDown = Number((e.currentTarget as HTMLElement).dataset.touchStart);
      if (!touchDown) return;

      const currentTouch = e.touches[0].clientX;
      const diff = touchDown - currentTouch;

      if (Math.abs(diff) > 5) {
        (e.currentTarget as HTMLElement).dataset.isSwiping = "true";
      }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      const touchDown = Number((e.currentTarget as HTMLElement).dataset.touchStart);
      const touchUp = e.changedTouches[0].clientX;
      const isSwiping = (e.currentTarget as HTMLElement).dataset.isSwiping === "true";

      if (!touchDown || !isSwiping) return;

      const diff = touchDown - touchUp;
      const minSwipeDistance = 50;

      if (diff > minSwipeDistance) {
        setCurrentIndex(currentIndex === users.length - 1 ? 0 : currentIndex + 1);
      } else if (diff < -minSwipeDistance) {
        setCurrentIndex(currentIndex === 0 ? users.length - 1 : currentIndex - 1);
      }

      delete (e.currentTarget as HTMLElement).dataset.touchStart;
      delete (e.currentTarget as HTMLElement).dataset.isSwiping;
    };

    return (
      <div className="mb-16">
        {/* Заголовок */}
        <h2
          className={`text-3xl sm:text-4xl font-bold text-center mb-8 bg-gradient-to-r ${accentColor} bg-clip-text text-transparent`}
        >
          {title}
        </h2>

        {/* Карточка */}
        <div className="max-w-2xl mx-auto px-4">
          <div
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 sm:p-8 transition-all duration-500 hover:border-gray-600 cursor-pointer select-none"
            onClick={handleCardClick}
            onTouchStart={hasMultiple ? handleTouchStart : undefined}
            onTouchMove={hasMultiple ? handleTouchMove : undefined}
            onTouchEnd={hasMultiple ? handleTouchEnd : undefined}
          >
            <div className="flex flex-col items-center text-center">
              {/* Аватар */}
              <div className="mb-4">
                {currentUser.avatar_url ? (
                  <Image
                    src={currentUser.avatar_url}
                    alt={currentUser.screen_name || "Аватар"}
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-2 border-gray-600 pointer-events-none"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-3xl font-bold text-white border-2 border-gray-600">
                    {(currentUser.screen_name || currentUser.phone_number)[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* Имя */}
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {currentUser.screen_name || currentUser.phone_number}
              </h3>

              {/* Роль */}
              <span className="inline-block px-3 py-1 rounded-full bg-gray-700/50 border border-gray-600 text-gray-300 text-sm font-medium mb-4">
                {currentUser.role}
              </span>

              {/* Описание */}
              {currentUser.description && (
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-lg">
                  {currentUser.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Индикаторы с CSS-анимацией */}
        {hasMultiple && (
          <div className="flex justify-center gap-3 mt-8">
            {users.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="relative overflow-hidden h-2 rounded-full transition-all duration-300"
                style={{
                  width: index === currentIndex ? '32px' : '8px',
                }}
                aria-label={`Перейти к слайду ${index + 1}`}
              >
                {/* Фон индикатора */}
                <div className="absolute inset-0 bg-gray-600 hover:bg-gray-500 transition-colors duration-200" />
                
                {/* CSS-анимированный прогресс для активного индикатора */}
                {index === currentIndex && (
                  <div
                    key={`progress-${currentIndex}`}
                    className={`absolute inset-0 bg-gradient-to-r ${accentColor}`}
                    style={{
                      animation: `fillProgress ${AUTO_PLAY_INTERVAL}ms linear forwards`,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style jsx global>{`
        @keyframes fillProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Организаторы */}
        {renderCarousel(
          organizers,
          currentOrgIndex,
          setCurrentOrgIndex,
          "Организаторы",
          "from-yellow-400 to-orange-400"
        )}

        {/* Спонсоры */}
        {renderCarousel(
          sponsors,
          currentSponsorIndex,
          setCurrentSponsorIndex,
          "Спонсоры",
          "from-purple-400 to-pink-400"
        )}
      </div>
    </>
  );
}
