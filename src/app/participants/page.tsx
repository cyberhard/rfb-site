"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Chip,
  Accordion,
  AccordionItem,
  Avatar,
} from "@heroui/react";
import AppNavbar from "@/components/AppNavbar";
import EditProfileModal from "@/components/EditProfileModal";
import { useAuth } from "@/hooks/useAuth";

type ParticipantRole =
  | "Участник"
  | "Вип"
  | "Вип+"
  | "Спонсор"
  | "Организатор"
  | "Волонтер"
  | "Пресса"
  | "Охрана"
  | "Контролёр"
  | "Админка";

type User = {
  id: number;
  phone_number: string;
  screen_name: string;
  sity: string;
  role: string;
  availability: boolean;
  defile: boolean;
  merch: boolean;
  avatar_url?: string;
  description?: string;
};

const roles: { key: ParticipantRole; label: string }[] = [
  { key: "Организатор", label: "Организатор" },
  { key: "Контролёр", label: "Контролёр" },
  { key: "Пресса", label: "Пресса" },
  { key: "Спонсор", label: "Спонсор" },
  { key: "Вип+", label: "Вип+" },
  { key: "Вип", label: "Вип" },
  { key: "Участник", label: "Участник" },
  { key: "Волонтер", label: "Волонтер" },
  { key: "Охрана", label: "Охрана" },

  // { key: "Админка", label: "Админка" },
];

export default function ParticipantsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [updatingField, setUpdatingField] = useState<
    "availability" | "merch" | null
  >(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const { user: authUser, loading: authLoading } = useAuth();

  // Модальное окно
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const isAdmin =
    !authLoading &&
    !!authUser &&
    (authUser.role === "Админка" || authUser.role === "Контролёр");

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await fetch("/api/participants", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          let fetchedUsers = data.users || [];
          // Убираем фильтрацию - все видят всех участников
          setUsers(fetchedUsers);
        }
      } catch (err) {
        console.error("Fetch participants error:", err);
      } finally {
        setLoading(false);
      }
    };
  
    if (!authLoading) {
      fetchParticipants();
    }
  }, [authLoading]); // убираем authUser и isAdmin из зависимостей


  const getStatusText = (user: User) => {
    return user.availability ? "Прибыл" : "Не прибыл";
  };

  const getMerchText = (user: User) => {
    return user.merch ? "Выдан" : "Не выдан";
  };

  const handleToggleAvailability = useCallback(
    async (targetUser: User) => {
      if (
        !isAdmin ||
        (updatingUserId === targetUser.id && updatingField === "availability")
      ) {
        return;
      }

      setStatusError(null);
      setUpdatingUserId(targetUser.id);
      setUpdatingField("availability");

      try {
        const nextAvailability = !targetUser.availability;
        const res = await fetch("/api/participants", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: targetUser.id,
            availability: nextAvailability,
          }),
          credentials: "include",
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Не удалось обновить статус");
        }

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === targetUser.id
              ? { ...user, availability: nextAvailability }
              : user
          )
        );
      } catch (error) {
        setStatusError(
          error instanceof Error
            ? error.message
            : "Не удалось обновить статус"
        );
      } finally {
        setUpdatingUserId(null);
        setUpdatingField(null);
      }
    },
    [isAdmin, updatingUserId, updatingField]
  );

  const handleToggleMerch = useCallback(
    async (targetUser: User) => {
      if (
        !isAdmin ||
        (updatingUserId === targetUser.id && updatingField === "merch")
      ) {
        return;
      }

      setStatusError(null);
      setUpdatingUserId(targetUser.id);
      setUpdatingField("merch");

      try {
        const nextMerch = !targetUser.merch;
        const res = await fetch("/api/participants", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: targetUser.id,
            merch: nextMerch,
          }),
          credentials: "include",
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Не удалось обновить мерч");
        }

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === targetUser.id ? { ...user, merch: nextMerch } : user
          )
        );
      } catch (error) {
        setStatusError(
          error instanceof Error ? error.message : "Не удалось обновить мерч"
        );
      } finally {
        setUpdatingUserId(null);
        setUpdatingField(null);
      }
    },
    [isAdmin, updatingUserId, updatingField]
  );

  const handleOpenEditModal = (user: User) => {
    if (!isAdmin && authUser && user.id !== authUser.id) {
      return;
    }
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (updatedUser: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser?.id ? { ...u, ...updatedUser } : u))
    );
  };

  return (
    <main className="min-h-screen bg-black text-white w-full overflow-x-hidden">
      <AppNavbar />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-3 sm:px-4 py-4 sm:py-6 w-full">
        <header className="flex items-center gap-3 pt-4 sm:pt-6">
          <h1 className="text-base sm:text-lg font-semibold">
            {isAdmin
              ? "Участники по ролям"
              : authUser
              ? "Моя информация"
              : "Участники по ролям"}
          </h1>
        </header>

        {statusError && (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {statusError}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-400">Загрузка...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Участники не найдены
          </div>
        ) : (
          <section className="w-full overflow-x-hidden">
            <Accordion
              selectionMode="multiple"
              variant="splitted"
              className="w-full"
              defaultExpandedKeys={roles.map((role) => role.key)}
            >
              {roles.map((role) => {
                const usersInRole = users.filter(
                  (u: User) => u.role === role.key
                );

                if (!usersInRole.length) return null;

                return (
                  <AccordionItem
                    key={role.key}
                    aria-label={role.label}
                    title={`${role.label} (${usersInRole.length})`}
                  >
                    <div className="flex flex-col gap-2">
                      {usersInRole.map((user) => {
                        const statusText = getStatusText(user);
                        const merchText = getMerchText(user);
                        const chipColor = user.availability
                          ? "success"
                          : "danger";
                        const merchColor = user.merch ? "success" : "warning";
                        const isBusyAvailability =
                          updatingUserId === user.id &&
                          updatingField === "availability";
                        const isBusyMerch =
                          updatingUserId === user.id &&
                          updatingField === "merch";

                        const canEdit =
                          isAdmin || (authUser && user.id === authUser.id);

                        return (
                          <Card
                            key={user.id}
                            shadow="sm"
                            className="flex w-full flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border border-zinc-800 bg-zinc-900/80 px-3 sm:px-4 py-3"
                          >
                            <div className="flex min-w-0 flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                              <div
                                onClick={() => canEdit && handleOpenEditModal(user)}
                                className={`${
                                  canEdit ? "cursor-pointer hover:opacity-80" : ""
                                } transition-opacity`}
                                title={
                                  canEdit ? "Нажмите для редактирования" : ""
                                }
                              >
                                <Avatar
                                  src={
                                    user.avatar_url ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      user.screen_name || user.phone_number
                                    )}&background=0891b2&color=fff`
                                  }
                                  radius="full"
                                  className="h-10 w-10 flex-shrink-0"
                                  isBordered={false}
                                />
                              </div>
                              <div className="flex min-w-0 flex-col flex-1">
                                <span className="truncate text-sm font-medium text-zinc-100">
                                  {user.screen_name || user.phone_number}
                                </span>
                                <span className="text-xs text-zinc-400">
                                  {user.sity || "—"}
                                  {!!user.defile && " • 🎭 Дефиле"}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                              <Chip
                                size="sm"
                                color={chipColor}
                                variant="flat"
                                className={`text-xs ${
                                  isAdmin ? "cursor-pointer hover:scale-105" : ""
                                } ${isBusyAvailability ? "opacity-50" : ""}`}
                                onClick={() =>
                                  isAdmin && handleToggleAvailability(user)
                                }
                              >
                                {statusText}
                              </Chip>

                              {isAdmin && (
                                <Chip
                                  size="sm"
                                  color={merchColor}
                                  variant="flat"
                                  className={`text-xs cursor-pointer hover:scale-105 ${
                                    isBusyMerch ? "opacity-50" : ""
                                  }`}
                                  onClick={() => handleToggleMerch(user)}
                                >
                                  🎁 {merchText}
                                </Chip>
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </section>
        )}
      </div>

      {/* Модальное окно редактирования */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={editingUser}
        isAdmin={isAdmin}
        onSuccess={handleEditSuccess}
      />
    </main>
  );
}
